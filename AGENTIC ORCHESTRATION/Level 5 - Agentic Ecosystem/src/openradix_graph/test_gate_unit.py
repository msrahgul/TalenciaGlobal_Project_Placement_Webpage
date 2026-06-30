import json
from pathlib import Path

from openradix_graph import gate

DATA = Path(__file__).resolve().parents[2] / "data"


def test_clean_record_has_no_failures():
    record = json.loads((DATA / "sample_company_valid.json").read_text(encoding="utf-8"))
    assert gate.check_record(record) == []


def test_dirty_record_has_six_failures():
    record = json.loads((DATA / "sample_company_dirty.json").read_text(encoding="utf-8"))
    failures = gate.check_record(record)
    assert len(failures) == 6
    assert all(f["severity"] == "error" for f in failures)


def test_atomic_delimiter_is_flagged():
    record = json.loads((DATA / "sample_company_valid.json").read_text(encoding="utf-8"))
    record["category"] = "Enterprise; Startup"
    failures = gate.check_record(record)
    assert any(f["parameter"] == "category" and f["rule_id"] == "atomic_no_delimiter"
               for f in failures)
