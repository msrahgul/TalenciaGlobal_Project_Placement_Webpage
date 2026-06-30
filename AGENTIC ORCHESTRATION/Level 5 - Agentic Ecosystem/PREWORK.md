# Level 5 — Pre-Work (do this BEFORE the session)

Level 5 connects everything: agents + validation + your Level-2 database. Get the
keys AND the database URL ready beforehand.

## 1. Python
- **Python 3.11 or 3.12** (LangGraph + psycopg2 wheels are most reliable there).

## 2. API keys (same three as Level 4)
- OpenRouter: https://openrouter.ai/keys
- Groq: https://console.groq.com/keys
- Gemini: https://aistudio.google.com/app/apikey

## 3. Your Supabase database URL
You already created the schema + triggers in Level 2. Level 5 writes to it.
1. Supabase dashboard → your project → **Project Settings → Database**.
2. Copy the **Connection string (URI)** — use the **Session pooler** version.
3. It looks like:
   `postgresql://postgres:[YOUR-PASSWORD]@db.YOUR-REF.supabase.co:5432/postgres`

Confirm these Level-2 objects exist (they're what the pipeline writes to):
- `staging_company` (+ trigger `trg_staging_company_insert`)
- `staging_company_skill_levels` (+ its trigger)
- `job_role_details_json`
- `companies`, `countries`, `cities` master data loaded

## 4. Create venv + install
```bash
cd "Level 5 - Agentic Ecosystem"
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## 5. Configure
```bash
copy .env.example .env      # cp on macOS/Linux
```
Fill in the three keys **and** `SUPABASE_DB_URL`.

## 6. Smoke-test (offline)
```bash
pytest src/openradix_graph -q
python -m openradix_graph --help
```
Both should pass before any live run.

## 7. Verify your keys work
Run the built-in health check — it pings all three providers and reports each one:
```bash
python -m openradix_graph doctor
```
You want three `[ OK ]` lines. If you see `[FAIL]` or `[MISS]`, the report names the
key and the exact error, so you can fix `.env` and run it again.

> **Tip:** if you edited a key in `.env` but still get a `401`, a leftover OS
> environment variable was probably shadowing the file. The code loads `.env` with
> `override=True` so the file wins, and `doctor` shows a masked preview of the key it
> actually used.
>
> **Gemini quota (`429`)?** That's a quota limit, not a bad key. Swap it for a second
> OpenRouter model by adding `RESEARCH_PROVIDERS=openrouter,groq,openrouter-alt` to
> `.env`, then re-run `doctor`.
