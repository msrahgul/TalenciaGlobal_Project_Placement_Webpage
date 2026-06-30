# Level 3 — Pre-Work (do this BEFORE the session)

Goal: walk in with a working Python + pytest setup so the 2 hours are spent on
the *ideas*, not installation.

## 1. Install Python 3.11 or newer
- Download from https://www.python.org/downloads/ (tick "Add Python to PATH").
- Verify:
  ```bash
  python --version
  ```
  You should see `Python 3.11.x` or higher.

## 2. Create a virtual environment in this folder
```bash
cd "Level 3 - Test Automation"
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate
```

## 3. Install dependencies
```bash
pip install -r requirements.txt
```

## 4. Smoke-test
```bash
pytest --version
python tools/build_metadata.py
```
You should see `163 parameters` written.

## What you DON'T need
- No API keys.
- No database.
- No internet during the session (everything runs offline).

If all four steps worked, you're ready. See `README.md` to run the suite and
`BUILD_GUIDE.md` to build it yourself.
