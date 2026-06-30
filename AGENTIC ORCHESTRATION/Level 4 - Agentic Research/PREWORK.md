# Level 4 — Pre-Work (do this BEFORE the session)

You'll be calling real LLMs, so the only slow part is creating accounts and
getting API keys. Do that now so the session is about *agents*, not signup forms.

## 1. Python
- Install **Python 3.11 or 3.12** (LangChain wheels are most reliable there).
- Verify: `python --version`.

## 2. Get three API keys (free tiers are fine)
| Provider | Where | Env var |
|---|---|---|
| OpenRouter | https://openrouter.ai/keys | `OPENROUTER_API_KEY` |
| Groq | https://console.groq.com/keys | `GROQ_API_KEY` |
| Google Gemini | https://aistudio.google.com/app/apikey | `GOOGLE_API_KEY` |

## 3. Create venv + install
```bash
cd "Level 4 - Agentic Research"
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

## 4. Configure keys
```bash
copy .env.example .env        # Windows  (cp on macOS/Linux)
```
Open `.env` and paste your three keys. Leave the model ids as-is for now.

## 5. Smoke-test (offline parts)
```bash
pytest src/openradix_agents/test_parsing_unit.py -q
python -m openradix_agents --help
```
Both should succeed even before your keys work.

## 6. Verify your keys work
Run the built-in health check — it pings all three providers and reports each one:
```bash
python -m openradix_agents doctor
```
You want three `[ OK ]` lines. If you see `[FAIL]` or `[MISS]`, the report names the
key and the exact error, so you can fix `.env` and run it again.

> **Tip:** if you edited a key in `.env` but still get a `401`, a leftover OS
> environment variable was probably shadowing the file. The code loads `.env` with
> `override=True` so the file wins, and `doctor` shows a masked preview of the key it
> actually used — handy for spotting a stale value.
>
> **Gemini quota (`429`)?** That's a quota limit, not a bad key. Swap it for a second
> OpenRouter model by adding `RESEARCH_PROVIDERS=openrouter,groq,openrouter-alt` to
> `.env`, then re-run `doctor`.

> No database is needed for Level 4. Persisting to Supabase happens in Level 5.
