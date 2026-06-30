from openradix_tests import rules


def test_atomic_no_delimiter():
    assert rules.atomic_no_delimiter("Accenture", {}) is None
    assert rules.atomic_no_delimiter("A; B", {}) is not None


def test_composite_min_count():
    meta = {"ac": "Composite", "minimum_element": 2, "maximum_element": 5, "delimiter": ";"}
    assert rules.composite_min_count("A; B", meta) is None
    assert rules.composite_min_count("A", meta) is not None


def test_composite_max_count():
    meta = {"ac": "Composite", "minimum_element": 1, "maximum_element": 2, "delimiter": ";"}
    assert rules.composite_max_count("A; B; C", meta) is not None


def test_not_blank():
    assert rules.not_blank("", {}) is not None
    assert rules.not_blank("x", {}) is None


def test_not_placeholder():
    assert rules.not_placeholder("Not Found", {}) is not None
    assert rules.not_placeholder("Real value", {}) is None


def test_url_shape_composite_aware():
    meta = {"ac": "Composite", "delimiter": ";"}
    assert rules.url_shape("https://a.com; https://b.com", meta) is None
    assert rules.url_shape("https://a.com; nope", meta) is not None


def test_rating_range():
    assert rules.rating_range_0_10("8.5", {}) is None
    assert rules.rating_range_0_10("99", {}) is not None


def test_length_in_range():
    meta = {"min_length": 2, "max_length": 5}
    assert rules.length_in_range("abc", meta) is None
    assert rules.length_in_range("a", meta) is not None
    assert rules.length_in_range("toolong", meta) is not None


def test_matches_pattern():
    meta = {"regex_pattern": r"^@?[A-Za-z0-9_]{1,15}$"}
    assert rules.matches_pattern("@acme", meta) is None
    assert rules.matches_pattern("has space", meta) is not None


def test_matches_pattern_is_noop_without_pattern():
    assert rules.matches_pattern("anything at all", {"regex_pattern": None}) is None


def test_blank_skips_shape_rules():
    assert rules.url_shape("", {}) is None
    assert rules.composite_min_count("", {"ac": "Composite", "minimum_element": 3}) is None


def test_global_all_required_present():
    metas = [{"column_name": "name", "nullable": False}, {"column_name": "x", "nullable": True}]
    assert rules.all_required_present({"name": "Acme", "x": ""}, metas) is None
    assert rules.all_required_present({"name": "", "x": ""}, metas) is not None


def test_global_no_unexpected_keys():
    metas = [{"column_name": "name"}]
    assert rules.no_unexpected_keys({"name": "Acme", "company_id": 1}, metas) is None
    assert rules.no_unexpected_keys({"name": "Acme", "weird": 1}, metas) is not None
