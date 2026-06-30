r"""
graph.py
========
Wires the node functions into a LangGraph state machine with surgical retry.

Flow:
    research -> validate_research --(invalid + budget)--> research
                              \--(ok)--> consolidate -> gate
    gate --(errors + budget)--> consolidate
    gate --(clean)----------> db_write
    db_write --(db error + budget)--> consolidate
    db_write --(ok)----------------> skills -> hiring -> END

`langgraph` is imported lazily inside build_graph so the module loads even when
the package isn't installed (e.g. for offline unit tests of the nodes).
"""

from . import agents
from .state import GraphState


def build_graph():
    from langgraph.graph import StateGraph, END

    g = StateGraph(GraphState)
    g.add_node("research", agents.research_node)
    g.add_node("validate_research", agents.validate_research_node)
    g.add_node("consolidate", agents.consolidate_node)
    g.add_node("gate", agents.gate_node)
    g.add_node("db_write", agents.db_write_node)
    g.add_node("skills", agents.skills_node)
    g.add_node("hiring", agents.hiring_node)

    g.set_entry_point("research")
    g.add_edge("research", "validate_research")
    g.add_conditional_edges(
        "validate_research", agents.route_after_validate,
        {"research": "research", "consolidate": "consolidate"},
    )
    g.add_edge("consolidate", "gate")
    g.add_conditional_edges(
        "gate", agents.route_after_gate,
        {"consolidate": "consolidate", "db_write": "db_write"},
    )
    g.add_conditional_edges(
        "db_write", agents.route_after_db,
        {"consolidate": "consolidate", "skills": "skills"},
    )
    g.add_edge("skills", "hiring")
    g.add_edge("hiring", END)
    return g.compile()
