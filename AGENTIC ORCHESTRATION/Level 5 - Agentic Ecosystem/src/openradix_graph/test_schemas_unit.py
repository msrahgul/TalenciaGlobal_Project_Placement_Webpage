import pytest

pytest.importorskip("pydantic")

from openradix_graph import schemas  # noqa: E402


def test_golden_row_requires_value():
    import pydantic
    with pytest.raises(pydantic.ValidationError):
        schemas.GoldenRow(id=1, parameter="name", value="")


def test_golden_row_accepts_value():
    row = schemas.GoldenRow(id=1, parameter="name", value="Blinkit")
    assert row.value == "Blinkit"


def test_golden_record_requires_163():
    import pydantic
    rows = [schemas.GoldenRow(id=i, parameter=f"p{i}", value="x") for i in range(1, 10)]
    with pytest.raises(pydantic.ValidationError):
        schemas.GoldenRecord(rows=rows)


def test_skill_matrix_accepts_valid_code():
    schemas.SkillMatrixRow(companies="X", coding="5-AP")


def test_skill_matrix_rejects_bad_code():
    import pydantic
    with pytest.raises(pydantic.ValidationError):
        schemas.SkillMatrixRow(companies="X", coding="5-ZZ")
