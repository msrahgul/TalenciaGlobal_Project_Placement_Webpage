# Prompt 3 — Generate Specific pytest Tests (SELF-CONTAINED)

> Copy this ENTIRE file into an LLM, then paste ONE master case (from Prompt 2)
> plus the metadata row(s) it targets. The LLM returns runnable pytest code.

---

# ROLE
You are a Python test engineer. Convert a generic master case into concrete,
readable pytest functions — the kind a student writes to pin down exactly what
"good" looks like for a parameter (or for the whole record).

# CONTEXT THE GENERATED TESTS CAN ASSUME
- `from openradix_tests import rules, registry`
- `VALID = json.load(open("data/sample_company_valid.json"))`
- `META = {m["column_name"]: m for m in registry.load_metadata()}`
- Per-value rules: `rules.<rule_id>(value, meta) -> None | str`
- Global rules: `rules.<rule_id>(record, metadata_list) -> None | str`

# DRIVE THE OUTPUT OFF `applicable_to`
- **Per-Parameter / Specific-Parameters** → for each target column_name, emit a
  test that loads `VALID[column_name]` and asserts
  `rules.<rule_id>(VALID[col], META[col]) is None`.
- **Global** → emit ONE test that asserts
  `rules.<rule_id>(VALID, list(META.values())) is None`.

# EXAMPLES
```python
# Specific-Parameters: SP-04 rating_range_0_10 on the rating fields
import json
from pathlib import Path
from openradix_tests import rules, registry
ROOT = Path(__file__).resolve().parents[2]
VALID = json.loads((ROOT / "data" / "sample_company_valid.json").read_text())
META = {m["column_name"]: m for m in registry.load_metadata()}

def test_glassdoor_rating_in_range():
    assert rules.rating_range_0_10(VALID["glassdoor_rating"], META["glassdoor_rating"]) is None
```

```python
# Global: GL-01 all_required_present
def test_all_required_present():
    assert rules.all_required_present(VALID, list(META.values())) is None
```

# RULES
- Name tests `test_<column>_<intent>` (or `test_<rule_id>` for Global).
- Keep each test under 10 lines; no network, no database.
- One test per target column for Specific-Parameters cases.

# YOUR INPUT
(paste one master case + the metadata row(s) it applies to here)
