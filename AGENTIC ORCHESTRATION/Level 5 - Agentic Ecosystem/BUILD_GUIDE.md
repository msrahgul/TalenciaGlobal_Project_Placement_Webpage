# Level 5 — Build Guide (project-based milestones, I2R)

The capstone. You'll turn the Level-4 agents into a **self-validating, self-healing
LangGraph pipeline** that writes clean data to your database — and retries only
what fails.

This guide is organised as **project milestones**, each on the **I2R** rhythm:

- **Introduction** — the idea you don't have yet (mentor frames it).
- **Immersion** — you *do* it: run, read, break, observe.
- **Reflection** — what just happened, and the principle to keep.

> Outcome: `python -m openradix_graph run --company "Blinkit"` runs research →
> validate → consolidate → validate → test → write → verify, retrying only what
> fails, until clean rows land in Supabase. The finished code is in this folder —
> peek when stuck.

The one mental model for the whole level:

> **Level 4 was a straight line of agents. Level 5 is a *state machine*: nodes
> connected by edges that can loop back. The loops are where the self-healing
> lives.**

The pipeline you're building:
```
research → validate → consolidate → gate → db_write → skills → hiring → DONE
   ▲___________|            ▲_________|         |
   retry only the           retry consolidation  retry on DB error
   invalid provider         on data-quality errors
```

---

## Milestone 0 — Mission Control (setup + the database) · ~10 min

### Introduction
Level 4 wrote files and trusted you to read the report. Level 5 removes the trust:
the machine validates its own work and only writes data that passes. For that we
need the same three keys **and** your Level-2 database.

### Immersion
Follow `PREWORK.md`: Python 3.11/3.12, venv, install, `.env` with the three keys
**and** `SUPABASE_DB_URL`. Then confirm the offline gates work:
```bash
pytest src/openradix_graph -q
python -m openradix_graph --help
```
All offline tests should pass (parsing + schemas + gate + graph-compile). Before the
live run later, check your keys — one command pings all three providers:
```bash
python -m openradix_graph doctor       # want three [ OK ] lines
```
If Gemini shows a quota `429`, swap it for a second OpenRouter model by adding
`RESEARCH_PROVIDERS=openrouter,groq,openrouter-alt` to `.env`, then re-run `doctor`.

### Reflection
Same as Level 4, the *machinery* is offline and testable; only *generation* and
the *database write* need credentials. You can build and understand the entire
graph before spending a single token.

---

## Milestone 1 — Why a state machine? (LangGraph concepts) · ~15 min

### Introduction
In Level 4, agents ran in a fixed line. But what if Gemini's research is garbage?
A straight line can't say "redo just Gemini." We need a structure that can branch
and loop. That's **LangGraph**: **nodes** (functions), a typed **state**
(a dictionary threaded through them), and **edges** (including *conditional* ones
that decide where to go next).

### Immersion
Open `state.py` — the `GraphState` TypedDict. This single dictionary is what every
node reads and updates: the raw provider outputs, the golden record, retry
counters, the DB status, the log. Skim `graph.py`'s `build_graph()` and just count
the nodes and edges for now — don't worry about the logic yet.

### Reflection
Everything in Level 5 is "a node reads the state, does one job, updates the state,
and hands it on." Hold that picture. The cleverness isn't in any one node — it's
in the *edges* that let the graph loop back. We'll get there in Milestone 5.

---

## Milestone 2 — Gate 1: Shape (Pydantic) · ~20 min

### Introduction
The first of **three stacked gates.** Before we ask "is the data *good*?", we ask
"is it even the right *shape*?" — non-empty values, 163 unique parameters, valid
skill codes. That's what Pydantic does: structural validation.

### Immersion
Open `schemas.py`: `GoldenRow` (value must be non-empty), `GoldenRecord` (exactly
163 unique ids), `SkillMatrixRow` (codes like `5-AP`). Run:
```bash
pytest src/openradix_graph/test_schemas_unit.py -q
```
Try it from an LLM too: *"Write Pydantic v2 models for a 163-field golden record
and a 12-skill Bloom matrix row validated against `^\d{1,2}-(CU|AP|AS|EV|CR)$`."*

### Reflection
Gate 1 is cheap and catches the dumb stuff early — an empty field, a missing
parameter, a malformed code — before we waste an LLM call or a database round-trip
on it. Cheap gates first, expensive gates last.

---

## Milestone 3 — Gate 2: Rules (your Level-3 framework, as a gate) · ~15 min

### Introduction
Shape isn't quality. A field can be the right shape and still be wrong — a rating
of "55", a semicolon in an atomic field. Those are the **Level-3 rules**. Here they
stop being a pytest suite and become a function the graph calls.

### Immersion
Open `gate.py` — it imports the vendored `rules.py` + `registry.py` and runs them
as plain functions against a record, returning a list of failures. Run:
```bash
pytest src/openradix_graph/test_gate_unit.py -q     # clean = 0, dirty = 6
```

### Reflection
This is the payoff of building Level 3 properly: the same rules run as a test suite
*and* as a live gate inside an agent loop, with no rewrite. Write your quality
logic once, call it everywhere.

---

## Milestone 4 — Gate 3: The database (psycopg2 + trigger status) · ~20 min

### Introduction
The third gate is the strictest, and it's not even ours — it's the **database
itself.** When we insert into `staging_company`, your Level-2 trigger normalizes
the row into the 88 tables and can reject it ("Country not found"). A rejection is
a real, authoritative validation signal.

### Immersion
Open `db.py`. Note two things: (1) it inserts into `staging_company` and then reads
back `processing_status` / `error_message` — that read-back *is* gate 3; (2) the
column lists come from trusted constants and every value is parameterized (no SQL
injection surface). The trigger does the normalization and builds `company_json`.

### Reflection
Three independent gates now stand between an LLM's guess and your clean database:
**shape → rules → referential integrity.** Each catches what the others can't.
Defence in depth isn't paranoia here — it's the difference between a demo and a
system you'd actually run.

---

## Milestone 5 — Surgical retry (the conditional edges) · ~25 min

### Introduction
This is the heart of the level. When something fails, we do **not** restart the
whole pipeline. We re-run *only the failed part* — the one bad provider, or just
consolidation. That's **surgical retry**, and it's expressed entirely through
**conditional edges**.

### Immersion
Open `agents.py` and read two nodes: `research_node` (fans out, but only to
providers not yet marked valid) and `validate_research_node` (marks each provider
valid/invalid). The retry counters live in `state["attempts"]`. Then open
`graph.py` and find the three decision points:
- `validate_research` → back to `research` (only invalid providers) or onward.
- `gate` → back to `consolidate` on data-quality errors, or to `db_write`.
- `db_write` → back to `consolidate` on a DB error, or onward to `skills`.
```bash
pytest src/openradix_graph/test_graph_compiles.py -q
```

### Reflection
A straight line wastes work: one bad provider would force you to redo all three.
Conditional edges let the graph spend effort *exactly* where the failure is, up to
a retry budget. That budget matters — without `MAX_RETRIES`, a permanently-broken
provider would loop forever. Self-healing, but bounded.

---

## Milestone 6 — Run the ecosystem + force a retry · ~20 min

### Introduction
Time to run the whole machine and then deliberately break it, so you can *watch*
the surgical retry fire.

### Immersion
**[needs keys + DB]**
```bash
python -m openradix_graph run --company "Blinkit"
```
Watch the log: each provider, each gate, the DB status. Check your Supabase tables
for the new rows and the normalized output. Then force a retry:
- Lower or break one provider's key and watch **only that branch** re-run.
- Or feed a company whose office cities aren't in your `cities` master and watch
  the **DB-status gate** flag "City not found", triggering a retry from
  consolidation.

### Reflection
You just watched a pipeline *notice its own mistake and fix only that mistake*. No
human in the loop, no full restart. That's the whole arc of Levels 3→4→5:
Level 3 could *judge* quality, Level 4 could *generate* at scale, and Level 5
*closes the loop* — generate, judge, and self-correct until the data is clean
enough to trust in a database.

---

### What you learned
- Orchestration with LangGraph: nodes, typed state, and conditional edges.
- **Surgical retry** — re-run only the failed provider/stage, not the whole run.
- Stacking three independent gates: shape (Pydantic) → rules (Level 3) → database.
- Why every layer across Levels 3–5 matters: generation is easy, *trustworthy*
  generation is the engineering.
