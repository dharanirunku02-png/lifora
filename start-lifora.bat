@echo off
title LIFORA - Healthcare Transportation & Ambulance Booking System
echo =====================================================================
echo  LIFORA: Connecting Every Life to Care
echo  24/7 Affordable Healthcare Transportation and Ambulance Booking
echo =====================================================================
echo.

echo [1/3] Starting Python FastAPI Backend on http://127.0.0.1:8000 ...
start "LIFORA Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn main:app --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Vite React Frontend on http://localhost:5173 ...
start "LIFORA Frontend (Vite)" cmd /k "cd frontend && npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening LIFORA in your default web browser...
start http://localhost:5173/

echo.
echo =====================================================================
echo  LIFORA is running!
echo  - Web App: http://localhost:5173/
echo  - Backend API: http://127.0.0.1:8000/
echo  - API Docs: http://127.0.0.1:8000/docs
echo =====================================================================
