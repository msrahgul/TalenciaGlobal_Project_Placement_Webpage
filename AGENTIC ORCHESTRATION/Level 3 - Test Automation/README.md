# Level 3 — Test Automation (metadata-driven pytest)

**What this level teaches:** how to guarantee the quality of the 163 research
parameters *automatically*, before any system trusts the data — using a small
set of generic rules that a rich metadata sheet expands into ~1,500 concrete
checks. No LLMs, no database — it runs fully offline.

## The big idea

```
parameter_metadata.json   (163 params x ~30 columns:
                            type, atomic/composite, element + length bounds,
                            regex_pattern, nullability, criticality, owner, ...)
        ×
master_test_cases.json    (~23 generic rules, each tagged with a SCOPE)
        ↓  (conftest.py cross-joins them)
~1,500 parametrized pytest checks
```

### Three scopes (`applicable_to`)

| Scope | Means | Example |
|---|---|---|
| **Per-Parameter** | run on every parameter matching an `applies_when` predicate | "every composite has ≥ minimum_element values" |
| **Specific-Parameters** | run only on an explicit list of parameters | "the 4 rating fields are 0–10" |
| **Global** | run ONCE on the whole record | "all 163 keys present", "every required field filled" |

Add a parameter, a column, or a rule → the matrix grows automatically. That is
*metadata-driven testing*.

## Run it (ready-made)

```bash
# activate your venv first (see PREWORK.md)

# 1) Clean data -> everything passes
pytest -q --data data/sample_company_valid.json     # ~1523 passed

# 2) Dirty data -> 9 seeded defects fail (one per important rule type)
pytest -q --data data/sample_company_dirty.json     # 9 failed
```

The 9 dirty defects span all three scopes and the new rule types:
`key_competitors` (min-count), `category` (atomic delimiter), `glassdoor_rating`
(rating range), `website_url` (url shape), `overview_text` (placeholder),
`ceo_name` (blank, also caught by the **Global** completeness check), `name`
(regex/emoji), `short_name` (length bound).

A human-readable summary (grouped by priority, scope, category) is written to
`reports/data_quality_report.md` after every run.

## The metadata (rich)

Each parameter now carries ~30 columns, including testable ones —
`validation_type`, `ac`, `minimum_element`/`maximum_element` (composite counts),
`min_length`/`max_length` (char bounds from `data_type`), `regex_pattern`,
`nullable` — and governance ones — `criticality`, `confidence_level`,
`data_volatility`, `update_frequency`, `data_owner`, `business_rules`,
`data_rules`, `data_source`, `validation_mode`, `is_derived_from`.

## Folder map

| Path | What it is |
|---|---|
| `data/parameter_metadata.json` / `.xlsx` | the 163-parameter registry (machine + human) |
| `data/master_test_cases.json` / `.xlsx` | the generic rule catalog (with `applicable_to`) |
| `data/sample_company_valid.json` | a clean record (passes) |
| `data/sample_company_dirty.json` | the clean record + 8 seeded defects |
| `src/openradix_tests/rules.py` | per-value rules (`REGISTRY`) + global rules (`GLOBAL_REGISTRY`) |
| `src/openradix_tests/registry.py` | loads metadata + cases; `matches()` predicate engine |
| `conftest.py` | builds the 3-scope matrix, `--data` option, report hook |
| `src/openradix_tests/test_metadata_driven.py` | the auto-expanded matrix |
| `src/openradix_tests/test_specific_examples.py` | hand-written showcase tests |
| `tools/build_metadata.py` | regenerates the rich metadata from the Level-1 schema |
| `tools/build_samples.py` | regenerates the valid/dirty records |
| `tools/sync_xlsx.py` | sync JSON ⇄ Excel mirrors |
| `prompts/` | 3 SELF-CONTAINED prompts (copy-paste, no extra data needed) |

## Regenerate artifacts

```bash
python tools/build_metadata.py
python tools/build_samples.py
python tools/sync_xlsx.py to-xlsx data/parameter_metadata.json data/parameter_metadata.xlsx
python tools/sync_xlsx.py to-xlsx data/master_test_cases.json   data/master_test_cases.xlsx
```

## Connecting to other levels

A Level-4 `golden_record.json` validates here directly:
```bash
pytest -q --data ../"Level 4 - Agentic Research"/outputs/Blinkit/golden_record.json
```
In Level 5 these same rules become an automated gate inside the agent pipeline.
