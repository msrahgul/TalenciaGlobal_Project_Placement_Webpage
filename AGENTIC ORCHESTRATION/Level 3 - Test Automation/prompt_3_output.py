import json
from pathlib import Path
from openradix_tests import rules, registry

ROOT = Path(__file__).resolve().parents[2]
VALID = json.loads((ROOT / "data" / "sample_company_valid.json").read_text())
META = {m["column_name"]: m for m in registry.load_metadata()}

def test_glassdoor_rating_in_range():
    assert rules.rating_range_0_10(VALID["glassdoor_rating"], META["glassdoor_rating"]) is None
    
def test_website_rating_in_range():
    assert rules.rating_range_0_10(VALID["website_rating"], META["website_rating"]) is None

def test_indeed_rating_in_range():
    assert rules.rating_range_0_10(VALID["indeed_rating"], META["indeed_rating"]) is None

def test_google_rating_in_range():
    assert rules.rating_range_0_10(VALID["google_rating"], META["google_rating"]) is None
