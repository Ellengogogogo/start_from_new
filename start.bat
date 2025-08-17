@echo off
echo Property Expose Generator - Starting Services
echo ============================================

echo.
echo Starting Frontend (Next.js)...
cd frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo Starting Backend (FastAPI)...
cd ..\backend
start "Backend" cmd /k "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo Starting Worker...
cd ..\worker
start "Worker" cmd /k "python main.py"

echo.
echo Services are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
pause
