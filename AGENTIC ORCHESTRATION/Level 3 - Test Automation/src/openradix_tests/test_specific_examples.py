"""
Specific (hand-written) example tests.

Where the metadata matrix is generic, these are concrete — the kind of test a
student writes when they want to pin down ONE parameter's expected behaviour.
They always read the clean sample, so they document what "good" looks like.

Generate more of these from prompts/3_generate_specific_tests.md.
"""

import json
from pathlib import Path

from openradix_tests import rules, registry

ROOT = Path(__file__).resolve().parents[2]
VALID = json.loads((ROOT / "data" / "sample_company_valid.json").read_text(encoding="utf-8"))
META = {m["column_name"]: m for m in registry.load_metadata()}


def _m(param):
    return META[param]


# --- Company Basics ---------------------------------------------------------
def test_name_is_present_and_matches_pattern():
    assert rules.not_blank(VALID["name"], _m("name")) is None
    assert rules.matches_pattern(VALID["name"], _m("name")) is None


def test_name_is_critical_and_not_null():
    assert _m("name")["criticality"] == "Critical"
    assert _m("name")["nullable"] is False


def test_short_name_within_length_bounds():
    m = _m("short_name")
    assert m["min_length"] == 2
    assert rules.length_in_range(VALID["short_name"], m) is None


def test_logo_url_is_composite_image_urls():
    m = _m("logo_url")
    assert m["ac"] == "Composite" and m["minimum_element"] == 1 and m["maximum_element"] == 5
    assert rules.composite_min_count(VALID["logo_url"], m) is None
    assert rules.url_shape(VALID["logo_url"], m) is None
    assert rules.matches_pattern(VALID["logo_url"], m) is None  # image extension regex


# --- Digital Presence -------------------------------------------------------
def test_website_url_is_valid_url():
    assert rules.url_shape(VALID["website_url"], _m("website_url")) is None


def test_twitter_handle_matches_handle_regex():
    assert rules.matches_pattern(VALID["twitter_handle"], _m("twitter_handle")) is None


def test_glassdoor_rating_in_range_and_numeric_type():
    m = _m("glassdoor_rating")
    assert m["validation_type"] == "rating"
    assert rules.rating_range_0_10(VALID["glassdoor_rating"], m) is None


# --- Contact Info -----------------------------------------------------------
def test_primary_contact_email_is_valid():
    assert rules.email_shape(VALID["primary_contact_email"], _m("primary_contact_email")) is None


def test_primary_phone_has_enough_digits():
    assert rules.phone_shape(VALID["primary_phone_number"], _m("primary_phone_number")) is None


# --- Business / Competitive -------------------------------------------------
def test_key_competitors_has_at_least_five():
    m = _m("key_competitors")
    assert m["minimum_element"] == 5
    assert rules.composite_min_count(VALID["key_competitors"], m) is None


def test_tech_stack_min_three():
    m = _m("tech_stack")
    assert m["minimum_element"] == 3
    assert rules.composite_min_count(VALID["tech_stack"], m) is None


# --- Market (atomic) --------------------------------------------------------
def test_tam_is_atomic():
    assert rules.atomic_no_delimiter(VALID["tam"], _m("tam")) is None


def test_som_is_numeric():
    assert rules.number_shape(VALID["som"], _m("som")) is None


# --- Governance metadata richness ------------------------------------------
def test_metadata_has_governance_columns():
    m = _m("annual_revenue")
    for col in ("data_owner", "criticality", "data_volatility", "update_frequency",
                "validation_mode", "is_derived_from", "data_source"):
        assert col in m


def test_short_name_is_derived_from_name():
    assert _m("short_name")["is_derived_from"] == "name"


# --- Global record checks ---------------------------------------------------
def test_record_has_all_required():
    assert rules.all_required_present(VALID, list(META.values())) is None
