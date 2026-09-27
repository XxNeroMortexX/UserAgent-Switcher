@echo off
setlocal
set "SOURCE=%~dp0v3"
set "TARGET=%LOCALAPPDATA%\UserAgentSwitcherDev"

if not exist "%SOURCE%\manifest.json" (
    echo ERROR: v3\manifest.json was not found beside this installer.
    pause
    exit /b 1
)

if exist "%~dp0.git" (
    echo Checking for repository updates...
    git -C "%~dp0" pull --ff-only origin master
    if errorlevel 1 (
        echo ERROR: Git update failed. Extension files were not changed.
        pause
        exit /b 1
    )
)

robocopy "%SOURCE%" "%TARGET%" /MIR /R:2 /W:1 >nul
if errorlevel 8 (
    echo ERROR: Could not copy the extension.
    pause
    exit /b 1
)

echo Extension files installed at:
echo %TARGET%
echo.
echo FIRST TIME: In Chrome, open chrome://extensions
echo Enable Developer mode, click Load unpacked, and select that folder.
echo Import useragent-switcher-preferences.json from this repository.
echo.
echo LATER UPDATES: Run this file again, then click Reload
echo on your unpacked extension at chrome://extensions.
pause
