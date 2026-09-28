# YouTube on PC with a phone remote

This fork includes a Windows setup for User-Agent Switcher and Manager.
The included preferences identify youtube.com/tv as an LG webOS TV so
the YouTube phone app can connect to the PC screen.

## Install

1. Run `Install-YouTube-PC.bat` and choose Chrome, Edge, Opera, Brave, Vivaldi, or Firefox.
2. For Chrome, Edge, Opera, Brave, or Vivaldi, open the extensions page printed by the
   installer, enable Developer mode, click **Load unpacked**, and select
   the folder printed by the installer.
3. For Firefox, open `about:debugging` > **This Firefox** >
   **Load Temporary Add-on**, then select `manifest.json` in the folder
   printed by the installer. Firefox removes temporary add-ons on restart.
4. The extension starts in Custom Mode with the included YouTube rule.
5. Click **Open YouTube TV** in the extension popup. In the YouTube phone app,
   choose **YouTube on TV** and confirm playback starts on the PC.

Disable another copy of User-Agent Switcher and Manager in the same browser
so both copies do not change the same YouTube request.

## Update

Run `Install-YouTube-PC.bat` again and choose the same browser. If this is a
Git checkout, it first pulls changes from this fork. For Chrome, Edge, Opera, Brave, or Vivaldi, click **Reload** on the unpacked extension afterward. For Firefox,
reload the temporary add-on through `about:debugging`.

The installer copies only the `v3` extension files. The original exported preferences JSON remains in this repository.

## TV identity picker

In the extension's Options page, the **YouTube TV device** picker appears
beside Custom Mode. **Mine Special — LG webOS (tested)** is the first choice
and the default on a fresh installation. The picker also includes 45 complete
user-agent examples from the DeviceAtlas smart TV list, grouped by device
family, plus a field for a custom string:

https://deviceatlas.com/blog/list-smart-tv-user-agent-strings

Selecting an entry previews its full string. Click **Use for YouTube** to
save it as the `www.youtube.com` entry in the existing Custom Mode JSON.
Other custom rules remain in place. Only Mine Special has been confirmed
to work with this PC YouTube and phone remote setup; other examples are
provided for experimentation. Import Settings and Export Settings remain
available.
