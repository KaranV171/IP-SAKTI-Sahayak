@echo off
title IP-SAKTI Sahayak - Localhost Runner
echo ====================================================================
echo   IP-SAKTI Sahayak: Starting Complete Localhost System
echo ====================================================================
echo.

echo 1. Checking Ollama status...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Ollama is not running! Please start Ollama for local LLM inference.
) else (
    echo [OK] Ollama is active.
)

echo.
echo 2. Starting FastAPI Backend on port 8000...
start "IP-SAKTI FastAPI Backend" cmd /k "backend\.venv\Scripts\python.exe -m uvicorn backend.main:app --port 8000"

echo.
echo 3. Starting Next.js Frontend on port 3000...
start "IP-SAKTI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Waiting for services to initialize...
timeout /t 8 >nul

echo.
echo ====================================================================
echo   All services are active and ready!
echo.
echo   Frontend App:   http://localhost:3000
echo   FastAPI API:    http://localhost:8000
echo   API Docs:       http://localhost:8000/docs
echo ====================================================================
echo.
echo Opening http://localhost:3000 in your browser...
start http://localhost:3000
pause
