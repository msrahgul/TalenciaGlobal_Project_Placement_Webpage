"""
FastAPI microservice wrapping the Level 5 LangGraph pipeline.

Endpoints:
  POST /run        — start a research job, returns { job_id }
  GET  /stream/{job_id} — SSE stream of log lines
  GET  /result/{job_id} — final result (polling fallback)
  GET  /health     — liveness check
  POST /doctor     — ping all 3 LLM providers

Start it:
  pip install fastapi uvicorn
  python main.py          (or: uvicorn main:app --reload --port 7788)
"""

import sys
import os
import uuid
import threading
import subprocess
import json
import time
from pathlib import Path
from typing import Iterator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# ── paths ──────────────────────────────────────────────────────────────────
HERE = Path(__file__).parent
LEVEL5_DIR = HERE.parent / "AGENTIC ORCHESTRATION" / "Level 5 - Agentic Ecosystem"

# Use the Level 5 venv Python so the pipeline has pinned deps (pydantic==2.13.4,
# langgraph==0.2.62, etc.) without conflicting with the global installation.
_VENV_PYTHON = LEVEL5_DIR / ".venv" / "Scripts" / "python.exe"  # Windows
if not _VENV_PYTHON.exists():
    _VENV_PYTHON = LEVEL5_DIR / ".venv" / "bin" / "python"       # Linux/Mac
PYTHON = str(_VENV_PYTHON) if _VENV_PYTHON.exists() else sys.executable

# ── in-memory job store ─────────────────────────────────────────────────────
jobs: dict[str, dict] = {}   # job_id -> { logs: [], status, result }


app = FastAPI(title="OpenRADIX Agentic Pipeline Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten for production
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── models ──────────────────────────────────────────────────────────────────
class RunRequest(BaseModel):
    company: str
    company_id: int | None = None
    max_retries: int = 2


class DoctorRequest(BaseModel):
    providers: list[str] | None = None


# ── helpers ─────────────────────────────────────────────────────────────────
def _run_pipeline(job_id: str, req: RunRequest) -> None:
    """Run the LangGraph pipeline in a background thread and collect logs."""
    job = jobs[job_id]
    job["status"] = "running"

    cmd = [
        PYTHON, "-m", "openradix_graph", "run",
        "--company", req.company,
        "--max-retries", str(req.max_retries),
    ]
    if req.company_id:
        cmd += ["--company-id", str(req.company_id)]

    env = os.environ.copy()
    env["PYTHONUNBUFFERED"] = "1"
    # Ensure the src/ directory is on PYTHONPATH so openradix_graph is importable
    # even if the editable install hasn't been run yet.
    src_path = str(LEVEL5_DIR / "src")
    existing_path = env.get("PYTHONPATH", "")
    env["PYTHONPATH"] = f"{src_path};{existing_path}" if existing_path else src_path

    try:
        proc = subprocess.Popen(
            cmd,
            cwd=str(LEVEL5_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            env=env,
        )
        for line in iter(proc.stdout.readline, ""):
            stripped = line.rstrip("\n")
            if stripped:
                job["logs"].append(stripped)

        proc.wait()
        job["return_code"] = proc.returncode
        job["status"] = "done" if proc.returncode == 0 else "error"

        # parse summary from the last ~15 lines
        tail = "\n".join(job["logs"][-20:])
        job["result"] = _parse_summary(tail, job["logs"])

    except Exception as exc:
        job["logs"].append(f"[service error] {exc}")
        job["status"] = "error"
        job["result"] = {"error": str(exc)}


def _parse_summary(tail: str, all_logs: list[str]) -> dict:
    """Extract structured data from the CLI summary output."""
    result = {
        "company": None,
        "company_id": None,
        "db_status": None,
        "gate_failures": 0,
        "stage_failures": [],
        "providers_ok": [],
        "golden_record_fields": 0,
    }
    for line in all_logs:
        if "company        :" in line:
            result["company"] = line.split(":", 1)[-1].strip()
        elif "company_id     :" in line:
            val = line.split(":", 1)[-1].strip()
            result["company_id"] = int(val) if val.isdigit() else None
        elif "db status      :" in line:
            result["db_status"] = line.split(":", 1)[-1].strip()
        elif "gate failures  :" in line:
            result["gate_failures"] = int(line.split(":")[-1].strip())
        elif "stage failures :" in line:
            result["stage_failures_count"] = int(line.split(":")[-1].strip())
        elif line.startswith("   - "):
            result["stage_failures"].append(line[5:].strip())
        elif "usable params" in line and "using" in line:
            import re
            m = re.search(r"(\d+) params", line)
            if m:
                result["golden_record_fields"] = int(m.group(1))
        elif "[research]" in line and "rows" in line and "OK" not in line and "RETRY" not in line:
            provider = line.split("]")[1].strip().split(":")[0].strip()
            if provider and provider not in result["providers_ok"]:
                result["providers_ok"].append(provider)
    return result


def _sse_generator(job_id: str) -> Iterator[str]:
    """Yield SSE-formatted log lines as they arrive."""
    if job_id not in jobs:
        yield f"data: [error] job {job_id!r} not found\n\n"
        return

    job = jobs[job_id]
    sent = 0

    while True:
        logs = job["logs"]
        while sent < len(logs):
            line = logs[sent].replace("\n", " ")
            yield f"data: {line}\n\n"
            sent += 1

        if job["status"] in ("done", "error"):
            # flush remaining then close
            while sent < len(job["logs"]):
                line = job["logs"][sent].replace("\n", " ")
                yield f"data: {line}\n\n"
                sent += 1
            status_event = "done" if job["status"] == "done" else "error"
            yield f"event: {status_event}\ndata: {json.dumps(job.get('result', {}))}\n\n"
            break

        time.sleep(0.3)


# ── endpoints ───────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"ok": True, "level5_dir": str(LEVEL5_DIR), "python": PYTHON}


@app.post("/run")
def start_run(req: RunRequest):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"logs": [], "status": "pending", "result": None, "return_code": None}
    t = threading.Thread(target=_run_pipeline, args=(job_id, req), daemon=True)
    t.start()
    return {"job_id": job_id}


@app.get("/stream/{job_id}")
def stream_logs(job_id: str):
    if job_id not in jobs:
        raise HTTPException(404, f"Job {job_id!r} not found")
    return StreamingResponse(
        _sse_generator(job_id),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.get("/result/{job_id}")
def get_result(job_id: str):
    if job_id not in jobs:
        raise HTTPException(404, f"Job {job_id!r} not found")
    job = jobs[job_id]
    return {
        "job_id": job_id,
        "status": job["status"],
        "log_lines": len(job["logs"]),
        "result": job["result"],
    }


@app.post("/doctor")
def doctor(req: DoctorRequest):
    """Ping all configured LLM providers and return their status."""
    cmd = [PYTHON, "-m", "openradix_graph", "doctor"]
    if req.providers:
        cmd += ["--providers"] + req.providers

    proc = subprocess.run(
        cmd, cwd=str(LEVEL5_DIR), capture_output=True, text=True, timeout=30,
    )
    return {
        "ok": proc.returncode == 0,
        "output": proc.stdout + proc.stderr,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=7788, reload=False)
