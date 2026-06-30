"""
build_samples.py
================
Generates the two sample company records the test-suite runs against:

  * data/sample_company_valid.json  -> rule-clean by construction (suite goes green)
  * data/sample_company_dirty.json  -> the valid record with seeded defects, one
                                        per important rule type (suite shows reds)

Values are synthesised per-parameter FROM THE METADATA so the valid record always
satisfies every rule (length bounds, regex patterns, typed shapes, composite
counts). A few headline atomic fields use realistic overrides.

Run:  python tools/build_samples.py
"""

import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE.parent / "data"
META = json.loads((DATA / "parameter_metadata.json").read_text(encoding="utf-8"))

OVERRIDES = {
    "name": "Acme Corporation",
    "short_name": "Acme",
    "category": "Enterprise",
    "incorporation_year": "2012",
    "overview_text": "Acme Corporation builds logistics automation software for global retailers.",
    "nature_of_company": "Private",
    "headquarters_address": "123 Market Street, Metropolis",
    "website_url": "https://www.acme.example",
    "ceo_name": "Jordan Lee",
    "employee_size": "5200 employees",
    "profitability_status": "Profitable",
    "twitter_handle": "@acmecorp",
}

# One seeded defect per important rule type.
DEFECTS = {
    "key_competitors": "Acme Rival; Beta Rival",   # composite_min_count (needs >= 5)
    "category": "Enterprise; Startup",             # atomic_no_delimiter
    "glassdoor_rating": "55",                       # rating_range_0_10
    "website_url": "notaurl",                       # url_shape
    "overview_text": "Not Found",                   # not_placeholder
    "ceo_name": "",                                 # not_blank (+ global all_required_present)
    "name": "Acme\U0001F680 Corp",                 # matches_pattern (emoji breaks name regex)
    "short_name": "X",                              # length_in_range (shorter than min_length 2)
}


def _elem(validation_type: str, parameter: str, i: int) -> str:
    if validation_type == "url":
        if parameter == "logo_url":
            return f"https://www.acme.example/logo/{i}.png"   # must be an image URL
        return f"https://www.acme.example/{parameter}/{i}"
    if validation_type == "email":
        return f"info{i}@acme.example"
    if validation_type == "phone":
        return "+1 555 123 4567"
    if validation_type == "rating":
        return "7.5"
    if validation_type == "number":
        return str(1200 + i)
    return f"{parameter.replace('_', ' ')} sample value {i}"


def _value_for(meta: dict) -> str:
    parameter, vt = meta["column_name"], meta["validation_type"]
    if meta["ac"] == "Composite":
        lo = meta["minimum_element"] or 1
        n = max(lo, 2)
        if meta["maximum_element"]:
            n = min(n, meta["maximum_element"])
        return "; ".join(_elem(vt, parameter, i) for i in range(1, n + 1))
    if parameter in OVERRIDES:
        return OVERRIDES[parameter]
    if vt in ("url", "email", "phone", "rating", "number"):
        return _elem(vt, parameter, 1)
    return f"{parameter.replace('_', ' ')} sample value"


def build_valid() -> dict:
    record = {"company_id": 117}
    for meta in META:
        record[meta["column_name"]] = _value_for(meta)
    return record


def build_dirty(valid: dict) -> dict:
    dirty = dict(valid)
    dirty.update(DEFECTS)
    dirty["_defects"] = [{"parameter": p, "bad_value": v} for p, v in DEFECTS.items()]
    return dirty


if __name__ == "__main__":
    valid = build_valid()
    dirty = build_dirty(valid)
    (DATA / "sample_company_valid.json").write_text(json.dumps(valid, indent=2, ensure_ascii=False), encoding="utf-8")
    (DATA / "sample_company_dirty.json").write_text(json.dumps(dirty, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"valid: {len(valid) - 1} params | dirty: {len(DEFECTS)} seeded defects")
