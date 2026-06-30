"""
agents.py
=========
The LangGraph node functions. Each takes the GraphState and returns it updated.
Pure orchestration logic lives here; `graph.py` only wires these together.

Validation gates used:
  1. Pydantic (schemas.py)  -> shape/type
  2. gate.check_record      -> the Level-3 data-quality rules
  3. db status read-back    -> referential / normalization
"""

from . import providers, prompts, parsing, schemas, gate, db, io_utils, config
from .columns import COLUMNS, column_for_id

# Research fan-out providers come from .env (RESEARCH_PROVIDERS) so a dead
# provider can be swapped for a 2nd OpenRouter model without touching code.
PROVIDERS = config.RESEARCH_PROVIDERS
MIN_VALID_ROWS = 150  # a provider's research is "valid" if it yields this many usable rows


def _log(state: dict, message: str) -> None:
    state.setdefault("log", []).append(message)
    print(message)


def _bump(state: dict, key: str) -> int:
    attempts = state.setdefault("attempts", {})
    attempts[key] = attempts.get(key, 0) + 1
    return attempts[key]


# --------------------------------------------------------------------------- #
# Research fan-out  (surgical retry: only re-runs providers that are not valid)
# --------------------------------------------------------------------------- #
def research_node(state: dict) -> dict:
    company = state["company"]
    state.setdefault("raw", {})
    state.setdefault("rows", {})
    state.setdefault("valid", {})
    prompt = prompts.render("research", company=company)

    targets = [p for p in PROVIDERS if not state["valid"].get(p)]
    for provider in targets:
        n = _bump(state, provider)
        try:
            text = providers.invoke(provider, prompt)
            rows = parsing.parse_markdown_table(text)
            state["raw"][provider] = text
            state["rows"][provider] = rows
            _log(state, f"[research] {provider}: {len(rows)} rows (attempt {n})")
        except Exception as exc:  # provider/network error
            state["rows"][provider] = []
            _log(state, f"[research] {provider} ERROR (attempt {n}): {exc}")
    return state


def validate_research_node(state: dict) -> dict:
    for provider in PROVIDERS:
        usable = 0
        for r in state.get("rows", {}).get(provider, []):
            col = column_for_id(r.get("ID"))
            value = (r.get("Research Output / Data") or "").strip()
            if not (col and value):
                continue
            try:
                schemas.GoldenRow(id=int(r["ID"]), parameter=col, value=value)
                usable += 1
            except Exception:
                pass
        state.setdefault("valid", {})[provider] = usable >= MIN_VALID_ROWS
        verdict = "OK" if state["valid"][provider] else "RETRY"
        _log(state, f"[validate] {provider}: {usable} usable rows -> {verdict}")
    return state


def route_after_validate(state: dict) -> str:
    invalid = [p for p in PROVIDERS if not state.get("valid", {}).get(p)]
    can_retry = any(state.get("attempts", {}).get(p, 0) < config.MAX_RETRIES for p in invalid)
    if invalid and can_retry:
        return "research"
    return "consolidate"


# --------------------------------------------------------------------------- #
# Consolidation -> Golden Record (+ Pydantic GoldenRecord gate)
# --------------------------------------------------------------------------- #
_HEADERS = "| ID | Category | A/C | Parameter | Research Output / Data | Source |"


def _build_dataset(sources: dict[str, list[dict]]) -> str:
    lines = [_HEADERS, "|---|---|---|---|---|---|"]
    for source, rows in sources.items():
        for r in rows:
            lines.append(
                f"| {r.get('ID', '')} | {r.get('Category', '')} | {r.get('A/C', '')} "
                f"| {r.get('Parameter', '')} | {r.get('Research Output / Data', '')} | {source} |"
            )
    return "\n".join(lines)


def _record_from_table(text: str) -> dict:
    """Turn a consolidated markdown table into a {column_name: value} record."""
    record = {}
    for r in parsing.parse_markdown_table(text):
        col = column_for_id(r.get("ID"))
        if col:
            record[col] = (r.get("Research Output / Data") or "").strip()
    return record


def consolidate_node(state: dict) -> dict:
    _bump(state, "consolidate")
    sources = {p: state["rows"][p] for p in PROVIDERS if state.get("rows", {}).get(p)}
    prompt = prompts.render("consolidation", dataset=_build_dataset(sources))

    # Try providers IN ORDER (config.CONSOLIDATION_PROVIDERS = gemini -> groq ->
    # openrouter). Fall through to the next provider on a hard error (Gemini
    # quota 429, Groq's 12k-TPM 413, ...) OR on an unusable result (a weak model
    # that ignores the table and rambles). Keep the best partial as we go.
    record: dict = {}
    best_usable = -1
    for provider in config.CONSOLIDATION_PROVIDERS:
        try:
            text = providers.invoke(provider, prompt)
        except Exception as exc:
            _log(state, f"[consolidate] {provider} failed: {exc}")
            continue
        candidate = _record_from_table(text)
        usable = sum(1 for c in COLUMNS if candidate.get(c, "").strip())
        _log(state, f"[consolidate] {provider}: {usable} usable params")
        if usable > best_usable:
            best_usable, record = usable, candidate
        if usable >= MIN_VALID_ROWS:  # good enough -> stop the chain here
            _log(state, f"[consolidate] using {provider} ({usable} params)")
            break
    else:
        msg = "best partial result" if record else "no usable result from any provider"
        _log(state, f"[consolidate] all providers exhausted; {msg}")

    state["golden"] = record

    # Pydantic gate: do we have all 163 non-empty parameters?
    gr_rows = [schemas.GoldenRow(id=i + 1, parameter=c, value=record[c])
               for i, c in enumerate(COLUMNS) if record.get(c, "").strip()]
    try:
        schemas.GoldenRecord(rows=gr_rows)
        _log(state, f"[consolidate] golden record {len(record)} fields - Pydantic OK")
    except Exception as exc:
        state.setdefault("stage_failures", []).append(f"consolidate: {exc}")
        _log(state, f"[consolidate] Pydantic gate failed: {exc}")
    return state


# --------------------------------------------------------------------------- #
# Data-quality gate (Level-3 rules)
# --------------------------------------------------------------------------- #
def gate_node(state: dict) -> dict:
    failures = gate.check_record(state.get("golden") or {})
    state["gate_failures"] = failures
    errors = gate.errors_only(failures)
    _log(state, f"[gate] {len(errors)} error-level failures, {len(failures)} total")
    return state


def route_after_gate(state: dict) -> str:
    errors = gate.errors_only(state.get("gate_failures", []))
    if errors and state.get("attempts", {}).get("consolidate", 0) < config.MAX_RETRIES:
        _log(state, "[gate] retrying consolidation to fix data-quality errors")
        return "consolidate"
    return "db_write"


# --------------------------------------------------------------------------- #
# Database write + status read-back
# --------------------------------------------------------------------------- #
def db_write_node(state: dict) -> dict:
    _bump(state, "db_write")
    cid = state.get("company_id") or db.resolve_company_id(state["company"])
    state["company_id"] = cid
    status, error = db.insert_staging_company(state["golden"], cid)
    state["db_status"] = status
    state["db_error"] = error
    _log(state, f"[db] staging_company status={status} error={error}")
    return state


def route_after_db(state: dict) -> str:
    if state.get("db_status") == "error" and state.get("attempts", {}).get("db_write", 0) < config.MAX_RETRIES:
        _log(state, "[db] error -> retrying consolidation")
        return "consolidate"
    return "skills"


# --------------------------------------------------------------------------- #
# Secondary artifacts: skills / hiring (generate -> validate -> write)
# --------------------------------------------------------------------------- #
def skills_node(state: dict) -> dict:
    company = state["company"]
    text = providers.invoke("gemini", prompts.render("expectation_matrix", companies=company))
    rows = parsing.parse_markdown_table(text)
    row = rows[0] if rows else {}
    row.setdefault("companies", company)
    try:
        schemas.SkillMatrixRow(**{k: row.get(k) for k in schemas.SKILL_COLUMNS + ["companies"]})
        db.insert_skill_levels(row)
        state["skill_row"] = row
        _log(state, "[skills] validated + written")
    except Exception as exc:
        state.setdefault("stage_failures", []).append(f"skills: {exc}")
        _log(state, f"[skills] skipped: {exc}")
    return state


def hiring_node(state: dict) -> dict:
    company = state["company"]
    try:
        data = parsing.extract_json(providers.invoke("gemini", prompts.render("hiring", company=company)))
        schemas.HiringRounds(**data)
        db.insert_hiring(state["company_id"], company, data)
        state["hiring_row"] = data
        _log(state, "[hiring] validated + written")
    except Exception as exc:
        state.setdefault("stage_failures", []).append(f"hiring: {exc}")
        _log(state, f"[hiring] skipped: {exc}")
    state["done"] = True
    return state
