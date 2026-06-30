@echo off
echo Installing FastAPI service dependencies...
pip install -r requirements.txt
echo.
echo Starting OpenRADIX Agentic Pipeline Service on http://localhost:7788
python main.py
