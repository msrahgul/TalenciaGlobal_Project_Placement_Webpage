# Level 5 — Complete Agentic Ecosystem (LangGraph)

**What this level teaches:** orchestration. You type a company name and a
LangGraph state machine runs the whole pipeline — research across 3 LLMs,
consolidation, **three validation gates**, database persistence, and **surgical
retry** of only what failed.

```
python -m openradix_graph run --company "Blinkit"
```

## The pipeline

```
research ──► OpenRouter / Groq / Gemini
   │            (each output: Pydantic GoldenRow shape check)
   ├─ a provider invalid? ── retry ONLY that provider (≤ MAX_RETRIES)
   ▼
consolidate ─► 163-row Golden Record ─► Pydantic GoldenRecord gate
   ▼
gate ─► Level-3 data-quality rules (rules.py, run as functions)
   │      errors? ── retry consolidation
   ▼
db_write ─► INSERT staging_company (psycopg2)  ─► trigger normalizes + builds company_json
   │      processing_status == 'error'? ── retry
   ▼
skills ─► hiring   (each: generate ► Pydantic ► INSERT) ─► DONE ✅
```

## Three stacked gates

| Gate | File | Catches |
|---|---|---|
| 1. Pydantic | `schemas.py` | wrong shape / empty / missing 163 |
| 2. Data-quality rules | `gate.py` + `rules.py` | the Level-3 rules (delimiters, ranges, counts…) |
| 3. DB status | `db.py` | referential / normalization errors (e.g. "Country not found") |

Only an all-green record advances. Failures retry **only the failed branch**
(e.g. "Gemini failed validation → regenerate Gemini only").

## Run it

```bash
# venv active, .env filled (keys + SUPABASE_DB_URL) — see PREWORK.md

# Step 0 — check your keys first (pings all 3 providers, ~5 sec):
python -m openradix_graph doctor

python -m openradix_graph run --company "Blinkit"
python -m openradix_graph run --company "Blinkit" --company-id 117 --max-retries 3
```

**A provider down?** If a key is permanently unavailable — e.g. Gemini's free-tier
quota — swap it for a second OpenRouter model (same key, different model id) by
adding one line to `.env`, then re-run `doctor` to confirm:
```bash
RESEARCH_PROVIDERS=openrouter,groq,openrouter-alt
# optionally choose the 2nd model:  OPENROUTER_MODEL_2=nvidia/nemotron-nano-9b-v2:free
```

Rows land in `staging_company` (then normalized into the 88 tables + `company_json`),
`staging_company_skill_levels`, and `job_role_details_json`.

## Code map

| File | Role |
|---|---|
| `schemas.py` | Pydantic models (gate 1) |
| `gate.py` / `rules.py` / `registry.py` | data-quality rules (gate 2, vendored from Level 3) |
| `db.py` | psycopg2 writers + status read-back (gate 3) |
| `state.py` | the typed graph state |
| `agents.py` | node functions + retry routing |
| `graph.py` | LangGraph wiring (`build_graph()`) |
| `cli.py` | `run --company ...` |

## Offline tests
```bash
pytest src/openradix_graph -q   # parsing + schemas + gate + graph-compile
```
