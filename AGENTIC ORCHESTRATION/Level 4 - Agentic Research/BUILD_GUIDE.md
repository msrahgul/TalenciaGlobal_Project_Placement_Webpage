# Level 4 — Build Guide (project-based milestones, I2R)

The "learn by building" track. You'll assemble a small **fleet of agents** that
turns the manual research from Levels 1–2 into one command — and then point your
Level-3 testing framework at the result.

This guide is organised as **project milestones**. Each milestone follows the
**I2R** rhythm:

- **Introduction** — the idea you don't have yet (mentor frames it).
- **Immersion** — you *do* it: run, read, break, observe.
- **Reflection** — what just happened, and the principle to keep.

> Outcome: `python -m openradix_agents run --company "Blinkit"` produces a Golden
> Record + skill matrix + hiring JSON from real LLM calls, plus a data-quality
> report from the embedded Level-3 checks. The finished code is in this folder —
> peek whenever you're stuck.

The one mental model for the whole level:

> **An agent = prompt + provider + parser + sink.** Every agent here is that same
> four-step shape with a different prompt and a different output.

---

## Milestone 0 — Mission Control (Setup & the map) · ~10 min

### Introduction
Level 3 was offline and deterministic. Level 4 brings the **LLMs** back: we let
AI do the research that you previously did by hand. Before any of that, we need a
working cockpit and a shared vocabulary.

### Immersion
Follow `PREWORK.md`: Python 3.11/3.12, venv, `pip install -r requirements.txt`,
three API keys in `.env`. Then prove the offline parts work:
```bash
pytest src/openradix_agents/test_parsing_unit.py -q
python -m openradix_agents --help
```
Then check your keys before spending any tokens — one command pings all three
providers and reports each:
```bash
python -m openradix_agents doctor      # want three [ OK ] lines
```
Open the folder and find the four "rooms": `prompts/` (the recipes), `data/`
(the vendored Level-3 metadata + cases), `src/openradix_agents/` (the agents),
`outputs/` (where results land).

### Reflection
You don't need keys to *understand* the pipeline — only to *run the LLM parts*.
The testing agent (Milestone 6) needs **no key at all**. Keep that in mind: the
quality machinery is free and offline; only generation costs tokens.

---

## Milestone 1 — One interface, three brains (provider abstraction) · ~20 min

### Introduction
We will ask **three different LLMs** the same research question and compare. To do
that cleanly, every model must look the same to our code. That's a **provider
abstraction**.

### Immersion
Open `src/openradix_agents/providers.py`. Notice every factory returns a LangChain
chat model with the same `.invoke()` method:
- **OpenRouter** via `ChatOpenAI` (base_url swapped) — one key, many models.
- **OpenRouter (alt)** — the *same* class and key, a different model id. This is
  "one key, many models" made literal: a second voice with no new account.
- **Groq** via `ChatGroq` — extremely fast.
- **Gemini** via `ChatGoogleGenerativeAI`.

Try generating it yourself from an LLM: *"Write a providers.py exposing
`openrouter_llm()`, `groq_llm()`, `gemini_llm()` using langchain-openai/groq/
google-genai, reading keys and model ids from a config module, with lazy imports."*
Compare what you get to the shipped file.

### Reflection
Because every factory shares one interface, swapping or adding a model is a one-line
change. This is the single most reused idea in agent engineering: **program to an
interface, not to a vendor.** `openrouter-alt` is the proof — when a provider goes
down (Gemini's free quota often does), drop it for the second OpenRouter model by
setting `RESEARCH_PROVIDERS=openrouter,groq,openrouter-alt` in `.env`. No code change.

---

## Milestone 2 — Chat → data (prompts as templates + parsing) · ~20 min

### Introduction
An LLM returns *text* — usually a markdown table or JSON wrapped in prose. In
Levels 1–2 you cleaned that by hand in Excel. We're going to automate that step.

### Immersion
1. `prompts/` holds the prompts from Levels 1–2 with `{{COMPANY}}` / `{{DATASET}}`
   / `{{COMPANIES}}` placeholders. `prompts.py` fills them with simple string
   replacement (not `str.format`, because the JSON prompts contain `{ }`).
2. `parsing.py` converts the model's markdown/JSON into Python data. Run:
   ```bash
   pytest src/openradix_agents/test_parsing_unit.py -q
   ```

### Reflection
`parsing.py` is the automation of "paste into Excel and clean it up." Templating +
parsing are the unglamorous glue that turns a chat toy into a data pipeline. Most
real agent bugs live here, not in the model.

---

## Milestone 3 — The research agent (multi-LLM fan-out) · ~20 min

### Introduction
The first real agent. One research prompt, **three independent answers**. Asking
several models the same thing and comparing is a cheap, powerful way to raise
confidence — "multi-LLM consensus."

### Immersion
`research_agent.run_research()` renders the research prompt and calls all three
providers, saving each result:
```bash
python -m openradix_agents run --company "Blinkit" --only research
```
Look in `outputs/Blinkit/` for the three `research_*.json` files. Open two and
eyeball where the models *disagree*.

### Reflection
Three brains rarely agree perfectly — and that disagreement is *information*. It's
exactly why the next agent exists: someone has to pick the best answer per field.
Notice the shape already: **prompt + provider + parser + sink.**

---

## Milestone 4 — The consolidation agent (the Golden Record) · ~20 min

### Introduction
Three partial, sometimes-conflicting tables → **one** trustworthy 163-field
record. We call it the **Golden Record**.

### Immersion
`consolidation_agent.run_consolidation()` stacks the three results into a
~489-row dataset (tagging each row with its source), asks one LLM to choose the
best value per parameter, and saves `golden_record.json` keyed by column name
(using `columns.py` to map parameter ID → column):
```bash
python -m openradix_agents run --company "Blinkit"
```
Open `outputs/Blinkit/golden_record.json` — 163 fields, one company, one file.

### Reflection
The Golden Record is the hand-off currency of the whole system. It's keyed by the
*same* column names as the Level-3 metadata — which is exactly why the testing
agent can validate it without any glue. Consistent contracts make levels click
together.

---

## Milestone 5 — The specialist agents (skills + hiring) · ~20 min

### Introduction
Two more agents — but you already know their shape. This milestone is about
*recognising the pattern*, not learning something new.

### Immersion
`skill_matrix_agent` (the Level-2 Expectation Matrix — 12 skills, Bloom codes like
`5-AP`) and `hiring_agent` each follow the identical four steps: render prompt →
invoke → parse → save. Read one, then skim the other and predict its structure
before you read it.
```bash
python -m openradix_agents run --company "Blinkit" --only skills
python -m openradix_agents run --company "Blinkit" --only hiring
```

### Reflection
That repetition is the lesson: once you have the four-step shape, new agents are
cheap. An "agentic system" is mostly the *same* small pattern, repeated with
discipline — not a pile of clever one-offs.

---

## Milestone 6 — The testing agent (your Level-3 framework, now in play) · ~20 min

### Introduction
We generated a lot of data with AI. **Can we trust it?** This is where Level 3
comes back. The 5th agent calls **no LLM** — it runs the metadata-driven checks
you built last session against the Golden Record.

### Immersion
```bash
python -m openradix_agents run --company "Blinkit" --only test
```
Open `outputs/Blinkit/data_quality_report.md`. It's the same three-scope matrix
(~1,500 checks) and the same graded report you know from Level 3 — Per-Parameter,
Specific-Parameters, and Global failures, grouped by priority/scope/category.

Now force a problem: open `golden_record.json`, blank out `ceo_name` or put a `;`
in `category`, save, and re-run `--only test`. Watch the report light up.

### Reflection
This is the **quality-first mindset** made concrete: generation is easy, *trusted*
generation is the engineering. Notice what's deliberately missing here — the
report does **not** stop the pipeline or write a database. It just *tells you*.

That gap is the entire motivation for Level 5: take these same checks and make
them a **blocking gate** inside an orchestrated loop that retries only what failed
and persists only clean data.

---

### What you learned
- A provider abstraction lets you swap/compare LLMs trivially.
- Multi-LLM fan-out + consolidation = a Golden Record.
- Every agent is the same four-step shape: prompt + provider + parser + sink.
- Your Level-3 testing framework drops straight into an agent pipeline as a report.
- Why you do NOT yet gate or persist (that's Level 5).
