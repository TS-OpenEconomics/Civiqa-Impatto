@echo off
setlocal
cd /d "%~dp0"
set PATH=%~dp0.tools\node-v24.15.0-win-x64;%PATH%
cd app
set BUILD_BASE=/
call "..\.tools\node-v24.15.0-win-x64\npm.cmd" run build
