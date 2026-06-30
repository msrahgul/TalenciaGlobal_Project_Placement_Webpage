# Prompt 2 — Generate Master Test Cases (SELF-CONTAINED)

> Copy this ENTIRE file into an LLM, then paste your `parameter_metadata.json`
> (from Prompt 1) at the bottom. Everything else — the scope taxonomy, the rule
> catalog, the output format — is already inside.

---

# ROLE
You are a QA Framework Designer. Design **generic, metadata-driven** data-quality
test cases. The framework cross-joins each case with the parameters it applies to,
turning ~25 rules into ~1,500 concrete checks.

# THE `applicable_to` SCOPE (the key idea)
Every master case declares ONE scope:

- **Per-Parameter** — applies to EVERY parameter whose metadata matches an
  `applies_when` predicate (e.g. all composites). Use `applies_when` like
  `ac == 'Composite'`, `nullable == False`, `validation_type == 'url'`, or `True`
  (truly every parameter). Leave `parameters` empty.
- **Specific-Parameters** — applies to ONLY an explicit `parameters` list
  (e.g. the rating fields). Set `parameters` to the exact column_names; set
  `applies_when` to `True`.
- **Global** — a HOLISTIC check run ONCE against the whole 163-parameter record
  (not per field). Leave `parameters` empty.

Keep scopes **non-overlapping**: a parameter should never run the same rule twice.
(Tip: put structural/hygiene/presence rules in Per-Parameter; put the typed
format rules — url/email/phone/rating/number/regex — in Specific-Parameters.)

# OUTPUT — one row per case, EXACTLY these columns
`id, applicable_to, parameters, applies_when, rule_id, test_case_category,
test_case_type, priority, description, example_scenarios`

# RULE CATALOG (rule_id must be one of these)
Per-value rules (Per-Parameter / Specific-Parameters):
`not_blank, not_placeholder, atomic_no_delimiter, composite_min_count,
composite_max_count, composite_elements_nonempty, composite_no_trailing_delimiter,
composite_max_element_length, length_in_range, no_newlines, no_bullets,
no_leading_trailing_space, no_double_space, not_only_punctuation, url_shape,
email_shape, phone_shape, number_shape, rating_range_0_10, matches_pattern,
enum_in_allowed`

Global rules (Global scope only):
`all_required_present, all_163_present, no_unexpected_keys`

# EXAMPLES (one per scope)
```json
{ "id": "PP-01", "applicable_to": "Per-Parameter", "parameters": [],
  "applies_when": "nullable == False", "rule_id": "not_blank",
  "test_case_category": "INPUT VALIDATION", "test_case_type": "Invalid/Empty Input",
  "priority": "High", "description": "Required parameters must contain a value.",
  "example_scenarios": "Test: '' (empty); Test: '   '; Test: NULL" }

{ "id": "SP-04", "applicable_to": "Specific-Parameters",
  "parameters": ["website_rating","glassdoor_rating","indeed_rating","google_rating"],
  "applies_when": "True", "rule_id": "rating_range_0_10",
  "test_case_category": "RANGE VALIDATION", "test_case_type": "Rating 0-10",
  "priority": "High", "description": "Ratings must be 0-10.",
  "example_scenarios": "Pass: '4.2'; Fail: '55'" }

{ "id": "GL-01", "applicable_to": "Global", "parameters": [], "applies_when": "True",
  "rule_id": "all_required_present", "test_case_category": "GLOBAL / HOLISTIC",
  "test_case_type": "Completeness", "priority": "High",
  "description": "Every non-nullable parameter has a value.",
  "example_scenarios": "Fail if ceo_name is blank" }
```

# REQUIRED COVERAGE
Produce ~20-25 cases: cover all the Per-Parameter structural/hygiene/presence
rules, all six typed rules as Specific-Parameters (url, email, phone, rating,
number, matches_pattern), and the three Global rules.

Return BOTH a Markdown table and a JSON array.

# YOUR METADATA
(paste your parameter_metadata.json here — or use the provided
`data/parameter_metadata.json`)
