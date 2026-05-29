@echo off
setlocal
cd /d "%~dp0"
cd app
if exist "..\.tools\node-v24.15.0-win-x64\node.exe" (
  "..\.tools\node-v24.15.0-win-x64\node.exe" "serve-dist.js"
  exit /b %errorlevel%
)

where node >nul 2>nul
if %errorlevel%==0 (
  node "serve-dist.js"
  exit /b %errorlevel%
)

echo Node.js non trovato. Includi .tools\node-v24.15.0-win-x64 oppure installa Node.js e assicurati che "node" sia disponibile nel PATH.
exit /b 1
