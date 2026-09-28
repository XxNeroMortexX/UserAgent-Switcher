@echo off
setlocal
set "SOURCE=%~dp0v3"

if not exist "%SOURCE%\manifest.json" (
    echo ERROR: v3\manifest.json was not found beside this installer.
    pause
    exit /b 1
)

if exist "%~dp0.git" (
    echo Checking for repository updates...
    git -C "%~dp0." pull --ff-only origin master
    if errorlevel 1 (
        echo ERROR: Git update failed. Extension files were not changed.
        pause
        exit /b 1
    )
)

echo.
echo Choose your browser:
echo   C - Chrome
echo   E - Microsoft Edge
echo   O - Opera
echo   B - Brave
echo   V - Vivaldi
echo   F - Firefox (temporary Developer mode add-on)
choice /C CEOBVF /N /M "Browser [C/E/O/B/V/F]: "

if errorlevel 6 goto firefox
if errorlevel 5 goto vivaldi
if errorlevel 4 goto brave
if errorlevel 3 goto opera
if errorlevel 2 goto edge

:chrome
set "BROWSER=Chrome"
set "TARGET=%LOCALAPPDATA%\UserAgentSwitcherDev"
set "PAGE=chrome://extensions"
goto copy

:edge
set "BROWSER=Microsoft Edge"
set "TARGET=%LOCALAPPDATA%\UserAgentSwitcherDev-Edge"
set "PAGE=edge://extensions"
goto copy

:opera
set "BROWSER=Opera"
set "TARGET=%LOCALAPPDATA%\UserAgentSwitcherDev-Opera"
set "PAGE=opera://extensions"
goto copy

:brave
set "BROWSER=Brave"
set "TARGET=%LOCALAPPDATA%\UserAgentSwitcherDev-Brave"
set "PAGE=brave://extensions"
goto copy

:vivaldi
set "BROWSER=Vivaldi"
set "TARGET=%LOCALAPPDATA%\UserAgentSwitcherDev-Vivaldi"
set "PAGE=vivaldi://extensions"
goto copy

:firefox
set "BROWSER=Firefox"
set "TARGET=%LOCALAPPDATA%\UserAgentSwitcherDev-Firefox"
goto copy

:copy
robocopy "%SOURCE%" "%TARGET%" /MIR /R:2 /W:1 >nul
if errorlevel 8 (
    echo ERROR: Could not copy the extension.
    pause
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Prepare-Browser-Manifest.ps1" -ManifestPath "%TARGET%\manifest.json" -Browser "%BROWSER%"
if errorlevel 1 (
    echo ERROR: Could not prepare the browser manifest.
    pause
    exit /b 1
)

echo.
echo %BROWSER% extension files are ready at:
echo %TARGET%
echo.

if "%BROWSER%"=="Firefox" goto firefox_instructions

echo FIRST TIME: Open %PAGE%, enable Developer mode,
echo click Load unpacked, and select the folder above.
echo The YouTube PC settings load automatically on first install.
echo.
echo LATER UPDATES: Run this file again and choose %BROWSER%,
echo then click Reload on the unpacked extension at %PAGE%.
goto done

:firefox_instructions
echo Open about:debugging in Firefox, select This Firefox,
echo then Load Temporary Add-on and select:
echo %TARGET%\manifest.json
echo The YouTube PC settings load automatically on first install.
echo Firefox removes temporary add-ons when it restarts.

:done
pause
