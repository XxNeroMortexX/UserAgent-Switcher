'use strict';

// localization
document.querySelectorAll('[data-localize]').forEach(e => {
  const ref = e.dataset.localize;
  const translated = chrome.i18n.getMessage(ref);
  if (translated) {
    e.textContent = translated;
  }
});
document.querySelectorAll('[data-localized-title]').forEach(e => {
  const ref = e.dataset.localizedTitle;
  const translated = chrome.i18n.getMessage(ref);
  if (translated) {
    e.title = translated;
  }
});

function notify(msg, period = 750, c = () => {}) {
  // Update status to let user know options were saved.
  const status = document.getElementById('status');
  status.textContent = msg;
  clearTimeout(notify.id);
  notify.id = setTimeout(() => {
    status.textContent = '';
    c();
  }, period);
}

function prepare(str) {
  return str.split(/\s*,\s*/)
    .map(s => s.replace('http://', '')
      .replace('https://', '').split('/')[0].trim())
    .filter((h, i, l) => h && l.indexOf(h) === i);
}

function save() {
  let custom = {};
  const c = document.getElementById('custom').value;
  try {
    custom = JSON.parse(c);
  }
  catch (e) {
    window.setTimeout(() => {
      notify('Custom JSON error: ' + e.message, 5000);
      alert('Custom JSON error: ' + e.message);
      document.getElementById('custom').value = c;
    }, 1000);
  }

  let parser = {};
  const p = document.getElementById('parser').value;
  try {
    parser = JSON.parse(p);
  }
  catch (e) {
    window.setTimeout(() => {
      notify('Parser JSON error: ' + e.message, 5000);
      alert('Parser JSON error: ' + e.message);
      document.getElementById('parser').value = p;
    }, 1000);
  }

  const oss = document.getElementById('popular-oss').value.split(/\s*,\s*/).filter((s, i, l) => {
    return s && l.indexOf(s) === i;
  });
  if (oss.length === 0) {
    oss.push('Windows');
  }
  const browsers = document.getElementById('popular-browsers').value.split(/\s*,\s*/).filter((s, i, l) => {
    return s && l.indexOf(s) === i;
  });
  if (browsers.length === 0) {
    browsers.push('Chrome');
  }

  chrome.storage.local.set({
    'userAgentData': document.getElementById('userAgentData').checked,
    'blacklist': prepare(document.getElementById('blacklist').value),
    'whitelist': prepare(document.getElementById('whitelist').value),
    custom,
    parser,
    'mode': document.querySelector('[name="mode"]:checked').value,
    'protected': document.getElementById('protected').value.split(/\s*,\s*/).filter(s => s.length > 4),
    'remote-address': document.getElementById('remote-address').value,
    'user-styling': document.getElementById('user-styling').value,
    'popular-oss': oss,
    'popular-browsers': browsers
  }, () => {
    restore();
    notify(chrome.i18n.getMessage('optionsSaved'));

    chrome.contextMenus.update(document.querySelector('[name="mode"]:checked').value, {
      checked: true
    });
  });
}

function restore() {
  chrome.storage.local.get({
    'userAgentData': true,
    'mode': 'blacklist',
    'whitelist': [],
    'blacklist': [],
    'custom': {},
    'parser': {},
    'protected': [
      'google.com/recaptcha',
      'gstatic.com/recaptcha',
      'accounts.google.com',
      'accounts.youtube.com',
      'gitlab.com/users/sign_in',
      'challenges.cloudflare.com'
    ],
    'remote-address': '',
    'user-styling': '',
    'popular-oss': ['Windows', 'Mac OS', 'Linux', 'Chromium OS', 'Android'],
    'popular-browsers': ['Internet Explorer', 'Safari', 'Chrome', 'Firefox', 'Opera', 'Edge', 'Vivaldi']
  }, prefs => {
    document.getElementById('userAgentData').checked = prefs.userAgentData;
    document.querySelector(`[name="mode"][value="${prefs.mode}"`).checked = true;
    document.getElementById('blacklist').value = prefs.blacklist.join(', ');
    document.getElementById('whitelist').value = prefs.whitelist.join(', ');
    document.getElementById('custom').value = JSON.stringify(prefs.custom, null, 2);
    document.getElementById('parser').value = JSON.stringify(prefs.parser, null, 2);
    document.getElementById('protected').value = prefs.protected.join(', ');
    document.getElementById('remote-address').value = prefs['remote-address'];
    document.getElementById('remote-address').dispatchEvent(new Event('input'));
    document.getElementById('user-styling').value = prefs['user-styling'];
    document.getElementById('popular-oss').value = prefs['popular-oss'].join(', ');
    document.getElementById('popular-browsers').value = prefs['popular-browsers'].join(', ');
  });
}
document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);

const youtubeTvAgents = {
  'lg-working': "Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 DMOST/2.0.0 (; LGE; webOSTV; WEBOS6.3.2 03.34.95; W6_lm21a;)",
  'deviceatlas-roku-1': "Roku/DVP-15.2",
  'deviceatlas-roku-2': "Roku/DVP-15.2 (15.2.4.3429-81)",
  'deviceatlas-roku-3': "Roku/DVP-14.1 (14.1.4.7709-CU)",
  'deviceatlas-roku-4': "Roku/DVP-13.0 (13.0.0.4220-AB)",
  'deviceatlas-samsung-tizen-tv-1': "Mozilla/5.0 (SMART-TV; Linux; Tizen 9.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/8.0 Chrome/120.0.6099.5 TV Safari/537.36",
  'deviceatlas-samsung-tizen-tv-2': "Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/120.0.6099.5 TV Safari/537.36",
  'deviceatlas-samsung-tizen-tv-3': "Mozilla/5.0 (SMART-TV; Linux; Tizen 9.0)",
  'deviceatlas-samsung-tizen-tv-4': "Mozilla/5.0 (SMART-TV; Linux; Tizen 5.5) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.0 Chrome/94.0.4606.31 TV Safari/537.36",
  'deviceatlas-samsung-tizen-tv-5': "Mozilla/5.0 (SMART-TV; Linux; Tizen 2.3) AppleWebKit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1",
  'deviceatlas-samsung-tizen-tv-6': "Mozilla/5.0 (SMART-TV; Linux; Tizen 2.2; SAMSUNG SM-Z910F) AppleWebKit/537.3 (KHTML, like Gecko) Version/2.2 TV Safari/538.1",
  'deviceatlas-lg-webos-1': "Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.270 Safari/537.36 WebAppManager",
  'deviceatlas-lg-webos-2': "Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.2.1 Chrome/38.0.2125.122 Safari/537.36 WebAppManager",
  'deviceatlas-lg-webos-3': "Mozilla/5.0 (Web0S; Linux/SmartTV)",
  'deviceatlas-apple-tv-1': "AppleCoreMedia/1.0.0.23L5443g (Apple TV; U; CPU OS 26_5 like Mac OS X; en_gb)",
  'deviceatlas-apple-tv-2': "AppleCoreMedia/1.0.0.22J357 (Apple TV; U; CPU OS 18_0 like Mac OS X; en_us)",
  'deviceatlas-apple-tv-3': "com.google.tvos.GoogleInteractiveMediaAds/4.14.1 (Apple TV; CPU OS 26_4 like Mac OS X)",
  'deviceatlas-apple-tv-4': "PrimeVideo/2.9.1 (AppleTV6,2; tvOS 26.4; Scale/2.0)",
  'deviceatlas-amazon-fire-tv-fire-os-1': "Mozilla/5.0 (Linux; Android 11; AFTKM) AppleWebKit/537.36 (KHTML, like Gecko) Silk/146.1.122 like Chrome/146.0.7680.165 Safari/537.36",
  'deviceatlas-amazon-fire-tv-fire-os-2': "Mozilla/5.0 (Linux; Android 9; AFTSS) AppleWebKit/537.36 (KHTML, like Gecko) Silk/138.13.4 like Chrome/138.0.7204.244 Safari/537.36",
  'deviceatlas-amazon-fire-tv-fire-os-3': "Mozilla/5.0 (Linux; Android 5.1.1; AFTT Build/LVY48F; wv)",
  'deviceatlas-amazon-fire-tv-fire-os-4': "Mozilla/5.0 (Linux; Android 9; AFTKA)",
  'deviceatlas-amazon-fire-tv-vega-os-kepler-1': "Kepler/1.1 (Linux; AFTCL001)",
  'deviceatlas-amazon-fire-tv-vega-os-kepler-2': "Mozilla/5.0 (Linux; Kepler 1.1; AFTCA002 user/1234; wv) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Chrome/132.0.6834.209 Safari/537.36",
  'deviceatlas-amazon-fire-tv-vega-os-kepler-3': "Amazon AFTCA002 Kepler/1.1 espn/2026.3.1 NativeClientPlatform/2025.09.10",
  'deviceatlas-amazon-fire-tv-vega-os-kepler-4': "Amazon AFTCA002 Kepler/1.1 Hulu/1.43.0 NativeClientPlatform/2025.09.8",
  'deviceatlas-amazon-fire-tv-vega-os-kepler-5': "Kepler/1.1 (Linux; AFTCA002)",
  'deviceatlas-amazon-fire-tv-vega-os-kepler-6': "Mozilla/5.0 (Linux; Kepler 1.1; AFTCA002 user/1234; wv) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Chrome/130.0.6723.192 Safari/537.36",
  'deviceatlas-google-tv-and-chromecast-1': "Mozilla/5.0 (Linux; Android 14; Chromecast HD Build/UTTC.250917.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/146.0.7680.177 Mobile Safari/537.36",
  'deviceatlas-google-tv-and-chromecast-2': "Mozilla/5.0 (Linux; Android 14; Google TV Streamer Build/UTTK.250729.004; wv)",
  'deviceatlas-google-tv-and-chromecast-3': "Mozilla/5.0 (Linux; Android 14; Chromecast Build/UTTC.250917.004; wv)",
  'deviceatlas-sony-bravia-1': "Mozilla/5.0 (Linux; Android 14; BRAVIA VU31 Build/UKR1.240726.001; wv)",
  'deviceatlas-sony-bravia-2': "Mozilla/5.0 (Linux; Android 12; BRAVIA VH1 Build/STT2.230505.001.S101; wv)",
  'deviceatlas-sony-bravia-3': "Mozilla/5.0 (Linux; Android 9; BRAVIA 4K GB Build/PTT1.190515.001.S54; wv)",
  'deviceatlas-tcl-1': "Mozilla/5.0 (Linux; Android 12; TCL TV Build/TQ1A.230205.002; wv)",
  'deviceatlas-tcl-2': "Mozilla/5.0 (Linux; Android 11; TCL TV Build/RP1A.200720.011; wv)",
  'deviceatlas-tcl-3': "Mozilla/5.0 (Linux; Android 9; TCL TV Build/QT.200305.002; wv)",
  'deviceatlas-hisense-vidaa-1': "Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.5563.146 Odin/111.5563.5.1 Safari/537.36 Model/VIDAA-MTK9603 VIDAA/9.0(Hisense;SmartTV;65E70LEVS;MTK9603/V0000.09.09R.P0930;UHD;65E7LE;)",
  'deviceatlas-hisense-vidaa-2': "Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.5563.146 Odin/111.5563.5.1 Safari/537.36 Model/VIDAA-MT9602 VIDAA/9.0(Hisense;SmartTV;65A53FEVS;MTK9602/V0000.09.09A.P0930;UHD;65A5FE;)",
  'deviceatlas-hbbtv-broadcast-hybrid-1': "Mozilla/5.0 (Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36 OPR/31.0.1890.0 OMI/4.6.1.40.Dominik2.0 VSTVB MB100 HbbTV/1.2.1 (; TELEFUNKEN; MB110; 2.9.8.0; ;) SmartTvA/3.0.0",
  'deviceatlas-hbbtv-broadcast-hybrid-2': "Mozilla/5.0 (Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36 OPR/25.0.1620.0 OMI/4.3.18.7.Dominik.0 VSTVB MB100 HbbTV/1.2.1 (; PANASONIC; MB100; 0.1.34.5; ;) SmartTvA/3.0.0",
  'deviceatlas-hbbtv-broadcast-hybrid-3': "Mozilla/5.0 (Linux; Andr0id 10; BRAVIA 4K VH22) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36 OPR/46.0.2207.0 OMI/4.21.0.273.DIA6.234 HbbTV/1.5.1 (+DRM; Sony; KD-43X75WL; PKG6.7480.0852EUA; ; com.sony.HE.G4.4K; ) sony.hbbtv.tv.G4.2023HE.4K LaTivu_1.0.1_2023",
  'deviceatlas-hbbtv-broadcast-hybrid-4': "Mozilla/5.0 Cobalt/23.0.0.0 skia Starboard/14 HbbTV/1.0.0 FVC/9.0 LaTivu_2.0.0_2024 VIDAA-MTK9618 VIDAA/U9.0",
  'deviceatlas-playstation-and-xbox-1': "Mozilla/5.0 (PlayStation; PlayStation 5/13.00) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  'deviceatlas-playstation-and-xbox-2': "Mozilla/5.0 (PlayStation; PlayStation 4/13.50) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  'deviceatlas-playstation-and-xbox-3': "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edge/44.18363.8131"
};

const youtubeTvSelect = document.getElementById('youtube-tv-agent');
const youtubeTvCustom = document.getElementById('youtube-tv-custom');
const youtubeTvCurrent = document.getElementById('youtube-tv-current');

youtubeTvSelect.addEventListener('change', () => {
  youtubeTvCustom.hidden = youtubeTvSelect.value !== 'custom';
});

function showYoutubeTvPreview() {
  const choice = youtubeTvSelect.value;
  document.getElementById('youtube-tv-preview').textContent =
    choice === 'custom' ? youtubeTvCustom.value : (youtubeTvAgents[choice] || '');
}
youtubeTvSelect.addEventListener('change', showYoutubeTvPreview);
youtubeTvCustom.addEventListener('input', showYoutubeTvPreview);
function showCurrentYoutubeTvAgent() {
  chrome.storage.local.get({custom: {}}, prefs => {
    const agent = prefs.custom['www.youtube.com'] || '';
    const known = Object.entries(youtubeTvAgents).find(([, value]) => value === agent);
    youtubeTvSelect.value = known ? known[0] : (agent ? 'custom' : '');
    youtubeTvCustom.hidden = youtubeTvSelect.value !== 'custom';
    if (youtubeTvSelect.value === 'custom') {
      youtubeTvCustom.value = agent;
    }
    youtubeTvCurrent.textContent = known
      ? youtubeTvSelect.selectedOptions[0].textContent
      : (agent || 'No YouTube rule');
    youtubeTvCurrent.title = agent;
    showYoutubeTvPreview();
  });
}
document.addEventListener('DOMContentLoaded', showCurrentYoutubeTvAgent);

document.getElementById('youtube-tv-apply').addEventListener('click', () => {
  const choice = youtubeTvSelect.value;
  const agent = choice === 'custom'
    ? youtubeTvCustom.value.trim()
    : youtubeTvAgents[choice];
  if (!agent) {
    notify('Choose a TV identity or enter a custom string', 4000);
    return;
  }

  let rules;
  try {
    rules = JSON.parse(document.getElementById('custom').value);
    if (!rules || typeof rules !== 'object' || Array.isArray(rules)) {
      throw new Error('Expected a JSON object');
    }
  }
  catch (error) {
    notify('Fix the Custom Mode JSON first: ' + error.message, 5000);
    return;
  }

  rules['www.youtube.com'] = agent;
  document.getElementById('custom').value = JSON.stringify(rules, null, 2);
  document.getElementById('mode-custom').checked = true;
  save();
  youtubeTvCurrent.textContent = youtubeTvSelect.selectedOptions[0].textContent;
  youtubeTvCurrent.title = agent;
});
document.getElementById('sample').addEventListener('click', e => {
  e.preventDefault();

  document.getElementById('custom').value = JSON.stringify({
    'www.google.com': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
    'www.bing.com, www.yahoo.com, www.wikipedia.org': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0',
    'example.com': ['random-useragent-1', 'random-user-agent-2'],
    '*': 'useragent-for-all-hostnames'
  }, null, 2);
});

document.getElementById('sample-2').addEventListener('click', e => {
  e.preventDefault();

  document.getElementById('parser').value = JSON.stringify({
    'my-custom-useragent': {
      'appVersion': 'custom app version',
      'platform': 'custom platform',
      'vendor': '[delete]',
      'product': 'custom product',
      'oscpu': 'custom oscpu',
      'custom-variable': 'this is a custom variable'
    }
  }, null, 2);
});

document.getElementById('donate').addEventListener('click', () => {
  chrome.tabs.create({
    url: chrome.runtime.getManifest().homepage_url + '?rd=donate'
  });
});

document.getElementById('reset').addEventListener('click', e => {
  if (e.detail === 1) {
    notify(chrome.i18n.getMessage('dbReset'));
  }
  else {
    localStorage.clear();
    chrome.storage.local.clear(() => {
      chrome.runtime.reload();
      window.close();
    });
  }
});

document.getElementById('help').addEventListener('click', () => {
  chrome.tabs.create({
    url: chrome.runtime.getManifest().homepage_url
  });
});

// export
document.getElementById('export').addEventListener('click', e => {
  const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  chrome.storage.local.get(null, prefs => {
    for (const key of Object.keys(prefs)) {
      if (key && key.startsWith('cache.')) {
        delete prefs[key];
      }
    }
    const text = JSON.stringify(Object.assign({}, prefs, {
      'json-guid': guid,
      'json-forced': false
    }), null, e.shiftKey ? '' : '  ');
    const blob = new Blob([text], {type: 'application/json'});
    const objectURL = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), {
      href: objectURL,
      type: 'application/json',
      download: 'useragent-switcher-preferences.json'
    }).dispatchEvent(new MouseEvent('click'));
    setTimeout(() => URL.revokeObjectURL(objectURL));
  });
});
// import
document.getElementById('import').addEventListener('click', () => {
  const input = document.createElement('input');
  input.style.display = 'none';
  input.type = 'file';
  input.accept = '.json';
  input.acceptCharset = 'utf-8';

  document.body.appendChild(input);
  input.initialValue = input.value;
  input.onchange = readFile;
  input.click();

  function readFile() {
    if (input.value !== input.initialValue) {
      const file = input.files[0];
      if (file.size > 100e6) {
        console.warn('100MB backup? I don\'t believe you.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = event => {
        input.remove();
        let json;
        try {
          json = JSON.parse(event.target.result);
        }
        catch (e) {
          notify('Import JSON error: ' + e.message, 5000);
          return;
        }
        if (json === null || typeof json !== 'object' || Array.isArray(json)) {
          notify('Import JSON error: expected a preference object', 5000);
          return;
        }
        const {prefs} = sanitizePrefs(json, 'import');
        if (prefs['remote-address']) {
          const proceed = window.confirm(
            'The imported file sets the remote configuration server to:\n\n' +
            prefs['remote-address'] +
            '\n\nAllow this extension to fetch preferences from it on every startup?'
          );
          if (!proceed) {
            delete prefs['remote-address'];
          }
        }
        chrome.storage.local.clear(() => {
          chrome.storage.local.set(prefs, () => {
            window.close();
            chrome.runtime.reload();
          });
        });
      };
      reader.readAsText(file, 'utf-8');
    }
  }
});

/* toggle */
document.getElementById('toggle-blacklist-desc').addEventListener('click', () => {
  document.querySelector('[for="toggle-blacklist-desc"]').classList.toggle('hidden');
});
document.getElementById('toggle-whitelist-desc').addEventListener('click', () => {
  document.querySelector('[for="toggle-whitelist-desc"]').classList.toggle('hidden');
});
document.getElementById('toggle-custom-desc').addEventListener('click', () => {
  document.querySelector('[for="toggle-custom-desc"]').classList.toggle('hidden');
});
document.getElementById('toggle-protected-desc').addEventListener('click', () => {
  document.querySelector('[for="toggle-protected-desc"]').classList.toggle('hidden');
});
document.getElementById('toggle-parser-desc').addEventListener('click', () => {
  document.querySelector('[for="toggle-parser-desc"]').classList.toggle('hidden');
});

// links
for (const a of [...document.querySelectorAll('[data-href]')]) {
  if (a.hasAttribute('href') === false) {
    a.href = chrome.runtime.getManifest().homepage_url + '#' + a.dataset.href;
  }
}

// Remote update
document.getElementById('remote-address').oninput = e => {
  try {
    new URL(e.target.value);
    document.getElementById('update').disabled = false;
  }
  catch (e) {
    document.getElementById('update').disabled = true;
  }
};
document.getElementById('update').onclick = () => chrome.runtime.sendMessage({
  method: 'update-from-remote',
  href: document.getElementById('remote-address').value
}, resp => {
  if (resp === true) {
    notify('Updated, refreshing options page...', 1200, () => {
      location.reload();
    });
  }
  else {
    alert(resp);
  }
});

fetch('/data/popup/map.json').then(r => r.json()).then(o => {
  for (const browser of o.browser) {
    const option = document.createElement('option');
    option.value = option.textContent = browser;
    document.getElementById('popular-browsers-selector').append(option);
  }
  for (const os of o.os) {
    const option = document.createElement('option');
    option.value = option.textContent = os;
    document.getElementById('popular-oss-selector').append(option);
  }
});
document.getElementById('popular-browsers-selector').onchange = e => {
  const editor = document.getElementById('popular-browsers');
  if (e.target.value) {
    const v = editor.value;
    editor.value += (v ? ', ' : '') + e.target.value;
  }
  e.target.value = '';
};
document.getElementById('popular-oss-selector').onchange = e => {
  const editor = document.getElementById('popular-oss');
  if (e.target.value) {
    const v = editor.value;
    editor.value += (v ? ', ' : '') + e.target.value;
  }
  e.target.value = '';
};
