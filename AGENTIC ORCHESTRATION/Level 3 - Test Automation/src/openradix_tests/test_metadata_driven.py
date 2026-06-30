"""
The metadata-driven matrix.

A SINGLE test function, parametrized by conftest into ~1,600+ cases across three
scopes:
  * Per-Parameter / Specific-Parameters -> run a per-value rule on one parameter
  * Global                              -> run a holistic rule on the whole record
"""

from openradix_tests import rules


def test_parameter_rule(case, record, all_metadata):
    meta, master_case = case

    if master_case.get("applicable_to") == "Global":
        rule_fn = rules.GLOBAL_REGISTRY[master_case["rule_id"]]
        message = rule_fn(record, all_metadata)
        assert message is None, (
            f"[GLOBAL {master_case['id']}] {master_case['test_case_type']}: {message}"
        )
        return

    value = record.get(meta["column_name"], "")
    rule_fn = rules.REGISTRY[master_case["rule_id"]]
    message = rule_fn(value, meta)
    assert message is None, (
        f"{meta['column_name']} [{master_case['id']}] "
        f"{master_case['test_case_type']}: {message} (value={value!r})"
    )
