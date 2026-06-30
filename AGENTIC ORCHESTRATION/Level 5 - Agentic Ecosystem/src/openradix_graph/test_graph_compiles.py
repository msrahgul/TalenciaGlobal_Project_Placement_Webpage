import pytest

pytest.importorskip("langgraph")
pytest.importorskip("pydantic")


def test_build_graph_compiles():
    from openradix_graph.graph import build_graph
    graph = build_graph()
    assert graph is not None
