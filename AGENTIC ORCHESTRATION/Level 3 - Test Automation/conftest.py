"""
Project-root conftest.py
========================
Builds the metadata-driven test matrix across THREE scopes:

* **Per-Parameter**      — a rule applied to every parameter whose metadata
                           satisfies the case's ``applies_when`` predicate.
* **Specific-Parameters** — a rule applied only to an explicit ``parameters`` list.
* **Global**             — a holistic rule run ONCE against the whole record.

Also registers the ``--data`` option and writes a data-quality report.
Lives at the project root so ``--data`` is registered before argument parsing
(``pythonpath = src`` in pytest.ini makes ``openradix_tests`` importable).
"""

import json
import re
from pathlib import Path

import pytest

from openradix_tests import registry

ROOT = Path(__file__).resolve().parent
DEFAULT_DATA = ROOT / "data" / "sample_company_valid.json"
_CASE_ID_RE = re.compile(r"\[(.+?)::([A-Z]{2}-\d+)\]")


# --------------------------------------------------------------------------- #
# CLI option + fixtures
# --------------------------------------------------------------------------- #
def pytest_addoption(parser):
    parser.addoption(
        "--data",
        action="store",
        default=str(DEFAULT_DATA),
        help="Path to the company record JSON to validate (default: clean sample).",
    )


@pytest.fixture(scope="session")
def record(request):
    return json.loads(Path(request.config.getoption("--data")).read_text(encoding="utf-8"))


@pytest.fixture(scope="session")
def all_metadata():
    return registry.load_metadata()


# --------------------------------------------------------------------------- #
# The matrix
# --------------------------------------------------------------------------- #
def _matrix():
    metas = registry.load_metadata()
    by_name = {m["column_name"]: m for m in metas}
    cases = registry.load_master_cases()
    items, ids = [], []
    for case in cases:
        scope = case.get("applicable_to", "Per-Parameter")
        if scope == "Global":
            items.append((None, case))
            ids.append(f"GLOBAL::{case['id']}")
        elif scope == "Specific-Parameters":
            for p in case.get("parameters", []):
                if p in by_name:
                    items.append((by_name[p], case))
                    ids.append(f"{p}::{case['id']}")
        else:  # Per-Parameter
            for m in metas:
                if registry.matches(case.get("applies_when", "False"), m):
                    items.append((m, case))
                    ids.append(f"{m['column_name']}::{case['id']}")
    return items, ids


def pytest_generate_tests(metafunc):
    if "case" in metafunc.fixturenames:
        items, ids = _matrix()
        metafunc.parametrize("case", items, ids=ids)


# --------------------------------------------------------------------------- #
# Reporting hook -> reports/data_quality_report.md
# --------------------------------------------------------------------------- #
def pytest_terminal_summary(terminalreporter, exitstatus, config):
    case_by_id = {c["id"]: c for c in registry.load_master_cases()}

    passed = len(terminalreporter.stats.get("passed", []))
    failed = terminalreporter.stats.get("failed", [])

    lines = [
        "# OpenRADIX Data Quality Report",
        "",
        f"- Data file: `{config.getoption('--data')}`",
        f"- Checks passed: **{passed}**",
        f"- Checks failed: **{len(failed)}**",
        "",
    ]

    if failed:
        by_priority, by_category, by_scope = {}, {}, {}
        rows = []
        for rep in failed:
            m = _CASE_ID_RE.search(rep.nodeid)
            if not m:
                rows.append(("(other)", "", "", "", rep.nodeid))
                continue
            target, case_id = m.group(1), m.group(2)
            case = case_by_id.get(case_id, {})
            pri = case.get("priority", "")
            cat = case.get("test_case_category", "")
            scope = case.get("applicable_to", "")
            by_priority[pri] = by_priority.get(pri, 0) + 1
            by_category[cat] = by_category.get(cat, 0) + 1
            by_scope[scope] = by_scope.get(scope, 0) + 1
            rows.append((target, scope, case_id, pri, case.get("test_case_type", "")))

        def _section(title, d):
            lines.append(f"## Failures by {title}")
            for k, n in sorted(d.items()):
                lines.append(f"- {k or '(none)'}: {n}")
            lines.append("")

        _section("priority", by_priority)
        _section("scope", by_scope)
        _section("category", by_category)

        lines.append("## Failure detail")
        lines.append("")
        lines.append("| Target | Scope | Case | Priority | Type |")
        lines.append("|---|---|---|---|---|")
        for target, scope, case_id, pri, ttype in rows:
            lines.append(f"| {target} | {scope} | {case_id} | {pri} | {ttype} |")

    report_path = ROOT / "reports" / "data_quality_report.md"
    report_path.parent.mkdir(exist_ok=True)
    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    terminalreporter.write_line(f"data-quality report -> {report_path}")
