# Level 3 — Build Guide (build it yourself in ~2 hours)

The "learn by building" track. You'll recreate the whole metadata-driven test
framework from three SELF-CONTAINED prompts, then run it. The finished code is
already in this folder — peek whenever you're stuck.

> Outcome: a pytest suite that turns ~23 generic rules + a rich 163-parameter
> metadata sheet into ~1,500 automatic data-quality checks across three scopes.

---

## 0. Setup (5 min)
Follow `PREWORK.md`: venv + `pip install -r requirements.txt`.

## 1. Rich metadata: describe every parameter (25 min)
The 163 parameters have rules baked into them. We capture that as **metadata** —
now ~30 columns per parameter, including testable fields (`validation_type`,
`minimum_element`/`maximum_element`, `min_length`/`max_length`, `regex_pattern`,
`nullable`) and governance fields (`criticality`, `data_owner`, `data_volatility`,
`validation_mode`, `is_derived_from`, ...).

1. Open `prompts/1_generate_metadata.md` — it ALREADY contains the full 163-row
   schema, so you just paste the whole file into an LLM. No hunting for data.
2. Save the JSON it returns as `data/parameter_metadata.json`.

We've automated the canonical copy with `tools/build_metadata.py`. Run it, then
`python tools/sync_xlsx.py to-xlsx data/parameter_metadata.json data/parameter_metadata.xlsx`
to view it in Excel.

**Why:** metadata is the single source of truth. Add a column or a parameter →
every applicable test updates automatically.

## 2. Master test cases + the three scopes (25 min)
A *master case* = a generic rule + the scope it applies to. Open
`prompts/2_generate_master_test_cases.md` (self-contained). The key new concept
is the **`applicable_to`** column:

- **Per-Parameter** — matches parameters via an `applies_when` predicate.
- **Specific-Parameters** — an explicit `parameters` list (the typed rules:
  url/email/phone/rating/number/regex).
- **Global** — one holistic check on the whole record (`all_required_present`,
  `all_163_present`, `no_unexpected_keys`).

Keep scopes non-overlapping so a parameter never runs the same rule twice. Save
the result as `data/master_test_cases.json`.

## 3. The rule library (20 min)
`src/openradix_tests/rules.py` has two registries:
- `REGISTRY` — per-value rules `rule(value, meta) -> None | str` (incl. the new
  `length_in_range` and `matches_pattern`).
- `GLOBAL_REGISTRY` — whole-record rules `rule(record, metadata) -> None | str`.

Run the rule unit tests:
```bash
pytest src/openradix_tests/test_rules_unit.py -v
```

## 4. Wiring the 3-scope matrix (15 min)
`registry.py` loads metadata + cases and exposes `matches()` (the `applies_when`
engine). The root `conftest.py` turns each case into pytest params by scope:
Per-Parameter → one test per matching parameter; Specific → one per listed
parameter; Global → one test total. Read `conftest.py` and
`test_metadata_driven.py` — ~40 lines become ~1,500 tests.

## 5. Sample data: prove it works (15 min)
1. `python tools/build_samples.py` creates a **clean** record and a **dirty**
   record (8 seeded defects — one per important rule type).
2. Run green, then red:
   ```bash
   pytest -q --data data/sample_company_valid.json   # ~1523 passed
   pytest -q --data data/sample_company_dirty.json   # 9 failed
   ```
3. Open `reports/data_quality_report.md` — failures grouped by priority, scope,
   and category.

## 6. Specific tests (15 min)
Use `prompts/3_generate_specific_tests.md` (self-contained) to turn one master
case into concrete pytest functions, driven by its `applicable_to` scope. Compare
with `src/openradix_tests/test_specific_examples.py`.

## 7. Make it fail on purpose (10 min)
Edit `data/sample_company_valid.json`: put a `;` inside `name`, an emoji in a
name field, set `glassdoor_rating` to `99`, or blank out `website_url`. Re-run and
watch the matrix (and the Global completeness check) catch it.

---

### What you learned
- Rich, governance-grade metadata that drives tests.
- Three test scopes: Per-Parameter, Specific-Parameters, and Global/holistic.
- Regex and length validation from metadata.
- pytest parametrization (`pytest_generate_tests`) and custom options.
- These exact rules return in Level 5 as an automated gate inside the agent loop.
