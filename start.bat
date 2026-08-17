@echo off
echo =======================================================
echo Starting Farook Project (Backend, Frontend, Admin)...
echo =======================================================

echo Starting Backend...
start "f4rooqh_Tech_hype1_backend" cmd /k "cd f4rooqh_Tech_hype1_backend && bun run dev"

echo Starting Frontend...
start "f4rooqh_Tech_hype1_frontend" cmd /k "cd f4rooqh_Tech_hype1_frontend && bun run dev"

echo Starting Admin...
start "farook-admin" cmd /k "cd farook-admin && bun run dev"

echo.
echo All services are launching in new command windows!
echo You can close this window now.
pause
