from openradix_tests import registry


def test_load_metadata_has_163():
    meta = registry.load_metadata()
    assert len(meta) == 163
    assert all("column_name" in m and "validation_type" in m for m in meta)


def test_metadata_is_rich():
    meta = registry.load_metadata()
    # rich governance + validation columns are present
    for col in ("regex_pattern", "min_length", "max_length", "criticality",
                "data_owner", "validation_mode", "is_derived_from", "nullability"):
        assert col in meta[0]


def test_load_master_cases_nonempty():
    cases = registry.load_master_cases()
    assert len(cases) >= 20
    assert all("rule_id" in c and "applicable_to" in c for c in cases)


def test_master_cases_have_three_scopes():
    scopes = {c["applicable_to"] for c in registry.load_master_cases()}
    assert {"Per-Parameter", "Specific-Parameters", "Global"} <= scopes


def test_matches_predicate():
    atomic = {"ac": "Atomic", "nullable": False}
    composite = {"ac": "Composite"}
    assert registry.matches("ac == 'Atomic'", atomic) is True
    assert registry.matches("ac == 'Composite'", atomic) is False
    assert registry.matches("nullable == False", atomic) is True
    assert registry.matches("ac == 'Composite'", composite) is True
