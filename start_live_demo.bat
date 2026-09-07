@echo off
title IP-SAKTI Sahayak - Live Backend & Public Tunnel
echo ====================================================================
echo   IP-SAKTI Sahayak: Live Backend & Cloudflare Public Tunnel
echo ====================================================================
echo.
echo 1. Checking Ollama status...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Ollama is not running! Please start Ollama before continuing.
    echo.
) else (
    echo [OK] Ollama is active.
)

echo.
echo 2. Starting FastAPI Backend on port 8000...
start "IP-SAKTI FastAPI Backend" cmd /k "backend\.venv\Scripts\python.exe -m uvicorn backend.main:app --port 8000"
timeout /t 4 >nul

echo.
echo 3. Starting Cloudflare Public Tunnel...
echo Copy the https://*.trycloudflare.com URL below and paste into Vercel!
echo ====================================================================
.\cloudflared.exe tunnel --url http://127.0.0.1:8000
pause
