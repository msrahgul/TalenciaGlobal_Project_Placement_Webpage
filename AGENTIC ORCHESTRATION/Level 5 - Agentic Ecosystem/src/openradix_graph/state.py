"""
state.py
========
The typed state threaded through the LangGraph nodes. ``total=False`` lets nodes
fill keys incrementally.
"""

from typing import Any, TypedDict


class GraphState(TypedDict, total=False):
    company: str
    company_id: int | None

    # research fan-out
    raw: dict          # provider -> raw LLM text
    rows: dict         # provider -> parsed rows
    valid: dict        # provider -> bool (passed Pydantic shape check)
    attempts: dict     # provider/stage -> retry count

    # consolidation + gates
    golden: dict | None
    gate_failures: list

    # database
    db_status: str | None
    db_error: str | None

    # secondary artifacts
    skill_row: dict | None
    hiring_row: dict | None   # NOTE: must not be named "hiring" — a state key may
                              # not share a name with a graph node (see graph.py)

    # bookkeeping
    stage_failures: list
    log: list
    done: bool
