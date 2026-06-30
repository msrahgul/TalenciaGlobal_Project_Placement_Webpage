# tests/

The Level-3 data-quality rules are **vendored** into this level as
`src/openradix_graph/rules.py` + `registry.py` + `data/*.json`, and invoked
directly by `gate.py` inside the LangGraph pipeline (see `src/openradix_graph/gate.py`).

The fast offline checks live next to the code:

```bash
pytest src/openradix_graph -q
```

That runs the parsing, schema (Pydantic), gate (data-quality), and
graph-compile tests. To run the full standalone metadata-driven matrix
(~1,600 checks) against a record, use **Level 3**:

```bash
cd ../"Level 3 - Test Automation"
pytest -q --data <path-to-record.json>
```
