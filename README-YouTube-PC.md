# YouTube on PC with a phone remote

This fork includes a Windows setup for the User-Agent Switcher and Manager
extension. The included preferences make youtube.com/tv identify as an LG
webOS TV, so the YouTube phone app can connect to the PC screen.

## Install

1. Run `Install-YouTube-PC.bat`.
2. In Chrome, open `chrome://extensions` and turn on Developer mode.
3. Click **Load unpacked** and select the folder printed by the batch file
   (`%LOCALAPPDATA%\UserAgentSwitcherDev`).
4. Open the extension's Options page and import
   `useragent-switcher-preferences.json` from this repository.
5. Open `https://www.youtube.com/tv` on the PC. In the YouTube phone app,
   choose **YouTube on TV** and confirm playback starts on the PC.

Disable another installed copy of User-Agent Switcher and Manager before
using this one, so both copies do not change the same YouTube request.

## Update

Run `Install-YouTube-PC.bat` again to pull changes from this fork and copy the files,
then click **Reload** on the unpacked extension at `chrome://extensions`.
The browser's imported preferences are retained across file updates.

The batch file copies only the `v3` extension files. It does not overwrite
this repository or the exported preferences JSON.
