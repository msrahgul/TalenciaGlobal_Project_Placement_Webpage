# Agentic Service — Quick Start

The `agentic_service/` folder is a lightweight **FastAPI** wrapper that lets the website trigger the Level 5 LangGraph pipeline and stream real-time logs via Server-Sent Events (SSE).

## Architecture

```
Website (React)  ──POST /run──►  FastAPI (port 7788)  ──►  Level 5 .venv python
                 ◄─SSE stream──  │                         └─ openradix_graph run
                                  └─ GET /result/{id}       (LangGraph pipeline)
```

## Starting the service

**Step 1 — Set up the Level 5 venv (one-time)**
```powershell
cd "AGENTIC ORCHESTRATION\Level 5 - Agentic Ecosystem"
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
```

**Step 2 — Start the FastAPI service**
```powershell
cd agentic_service
pip install -r requirements.txt   # installs fastapi + uvicorn
python main.py
# ✅ Service running at http://localhost:7788
```

**Step 3 — Test the service health**
```powershell
curl http://localhost:7788/health
# {"ok": true, "level5_dir": "...", "python": "..."}
```

**Step 4 — Check all 3 LLM providers**
```powershell
curl -X POST http://localhost:7788/doctor -H "Content-Type: application/json" -d "{}"
```

**Step 5 — Run the full pipeline**
```powershell
curl -X POST http://localhost:7788/run -H "Content-Type: application/json" `
  -d '{"company": "Blinkit", "max_retries": 2}'
# Returns: {"job_id": "..."}
```

**Step 6 — Stream logs**
```powershell
curl http://localhost:7788/stream/{job_id}
# Streams SSE lines until pipeline finishes
```

## Environment Variables (website)

Add to your `.env` file:
```
VITE_AGENTIC_SERVICE_URL=http://localhost:7788
```

On production (if you host the service on Railway/Render), set this to the deployed URL.

## What it does

The FastAPI service:
1. Accepts `POST /run` → starts the Level 5 LangGraph pipeline in a background thread
2. Streams real-time log output via `GET /stream/{job_id}` as Server-Sent Events  
3. Returns structured results at `GET /result/{job_id}`

The LangGraph pipeline:
- **research** — asks 3 LLMs (OpenRouter, Groq, Gemini) the same research questions in parallel
- **validate_research** — Pydantic gate: checks each provider's output has ≥150 usable rows
- **consolidate** — merges the 3 outputs into one 163-field Golden Record
- **gate** — Level-3 data quality rules (~1,500 checks: delimiters, ranges, formats)
- **db_write** — writes to Supabase `staging_company` table
- **skills** — generates skill matrix for the company
- **hiring** — generates hiring rounds JSON

Failed gates trigger **surgical retries** — only the failed provider/stage is re-run.
