/*!
 * icons.js v1.0 - Maresign maritime line icons for platform.maresign.com
 * Replaces emoji in the interface with original line drawings (24px grid, currentColor).
 * Installed by ONE deferred script line in index.html. Roll back: delete that line; emoji come back.
 * Works on content rendered later too (MutationObserver). Does not touch text inputs or code.
 * Also enlarges all platform text by 2px (see the block at the end of the file).
 */
(function () {
  'use strict';
  try {
    if (window.__msIcons) return;
    var P = {
      ship: '<path d="M2.5 15.5h19l-2.6 4H5.1z"/><path d="M5 15.5v-3.5h3.5v3.5M8.5 15.5v-3.5H12v3.5M6.7 12V8.5h3.5V12"/><path d="M15 15.5V8h3.5v7.5"/><path d="M15.8 8V5.5h1.9V8"/><path d="M15 10.5h3.5"/>',
      logbook: '<path d="M6 3.5h11.5v15H7.2A1.7 1.7 0 0 0 5.5 20.2V5a1.5 1.5 0 0 1 .5-1.5z"/><path d="M5.5 20.2a1.7 1.7 0 0 0 1.7 1.3h10.3v-3"/><rect x="9.5" y="9.5" width="5" height="4" rx=".6"/><path d="M10.4 9.5V8.3a1.6 1.6 0 0 1 3.2 0v1.2"/>',
      scroll: '<path d="M7 4.5h11.5a2 2 0 0 1 0 4H17v9.5a2 2 0 0 1-2 2H5.5a2 2 0 0 1 0-4H7z"/><path d="M7 16.5V4.5a2 2 0 0 0-2 2v1.5h2"/><path d="M5.5 20a2 2 0 0 0 2-2v-1.5h-2"/><path d="M9.5 9h5M9.5 12h5"/>',
      chest: '<rect x="3.5" y="9.5" width="17" height="10" rx="1.2"/><path d="M3.5 9.5V8a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v1.5"/><path d="M3.5 13h17"/><rect x="10.5" y="11.5" width="3" height="3.5" rx=".6"/><path d="M7.5 4.2v5.3M16.5 4.2v5.3"/>',
      quill: '<path d="M14.5 3.5H6.5a1.5 1.5 0 0 0-1.5 1.5v14a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-6"/><path d="M8 9h4M8 12.5h3M8 16h6"/><path d="M20.5 3.5c-3 .6-6 3.2-7.2 7.4l1.3 1.2c4-1.4 6.4-4.6 5.9-8.6z"/><path d="M13.3 10.9 11.8 14"/>',
      doc: '<path d="M14 3.5H6.5A1.5 1.5 0 0 0 5 5v14a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8.5z"/><path d="M14 3.5v5h5"/><path d="M8.5 12.5h7M8.5 16h5"/>',
      sextant: '<path d="M12 4 5 17.5M12 4l7 13.5"/><path d="M4.2 17.2a11 11 0 0 0 15.6 0"/><path d="M12 4l2.6 15"/><circle cx="12" cy="4" r="1.3"/><rect x="6.6" y="9.2" width="6" height="2.2" rx=".6" transform="rotate(-12 9.6 10.3)"/><path d="M8.8 18.6l.4 1.6M15.2 18.6l-.4 1.6"/>',
      wheel: '<circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="1.6"/><path d="M12 6.5V2.5M12 17.5v4M6.5 12h-4M17.5 12h4M8.1 8.1 5.3 5.3M15.9 15.9l2.8 2.8M15.9 8.1l2.8-2.8M8.1 15.9l-2.8 2.8"/><path d="M12 10.4V6.5M12 13.6v3.9M10.4 12H6.5M13.6 12h3.9"/>',
      spyglass: '<path d="M3 15.5 13.6 5.4l3.6 3.6L6.6 19.1z"/><path d="M13.6 5.4l1.6-1.6 3.6 3.6-1.6 1.6"/><path d="M9.1 9.6l3.6 3.6"/><path d="M8.2 20.5l1.8-3M12.2 20.5l-1.6-3"/>',
      building: '<path d="M3 20.5h18"/><path d="M5 20.5V8.5l7-4 7 4v12"/><path d="M9 20.5v-4h6v4"/><path d="M8.5 11h1.5M14 11h1.5M8.5 14h1.5M14 14h1.5"/>',
      pen: '<path d="M4 20l3.5-1 10.8-10.8a1.8 1.8 0 0 0-2.5-2.5L5 16.5z"/><path d="M14.5 7l2.5 2.5"/><path d="M4 20.5h7"/><path d="M13 20.5c1.5-1.6 3-1.6 3.5 0s2 1.6 3.5 0"/>',
      clipboard: '<rect x="5" y="4.5" width="14" height="16" rx="1.5"/><rect x="9" y="3" width="6" height="3" rx=".8"/><path d="M8.5 10.5l1.2 1.2 2.3-2.3M8.5 15.5l1.2 1.2 2.3-2.3M13.5 11h2.5M13.5 16h2.5"/>',
      upload: '<path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15"/><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5"/>',
      download: '<path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15"/><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5"/>',
      archive: '<rect x="3.5" y="4.5" width="17" height="4.5" rx="1"/><path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9"/><path d="M10 13h4"/>',
      warning: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17v.4"/>',
      bank: '<path d="M3 9.5 12 4l9 5.5z"/><path d="M5 9.5v8M9.7 9.5v8M14.3 9.5v8M19 9.5v8"/><path d="M3 20h18M4 17.5h16"/>',
      seal: '<path d="M12 2.8l2.1 1.6 2.6-.3 1 2.4 2.4 1-.3 2.6 1.6 2.1-1.6 2.1.3 2.6-2.4 1-1 2.4-2.6-.3L12 21.2l-2.1-1.6-2.6.3-1-2.4-2.4-1 .3-2.6L2.6 12l1.6-2.1-.3-2.6 2.4-1 1-2.4 2.6.3z"/><path d="M8.6 12.2l2.3 2.3 4.6-4.8"/>',
      hourglass: '<path d="M6.5 3.5h11M6.5 20.5h11"/><path d="M7.5 3.5c0 4.5 4.5 5.5 4.5 8.5s-4.5 4-4.5 8.5M16.5 3.5c0 4.5-4.5 5.5-4.5 8.5s4.5 4 4.5 8.5"/><path d="M9.5 18.5h5"/>',
      anchor: '<circle cx="12" cy="4.6" r="1.8"/><path d="M12 6.4v14.1"/><path d="M8 9.2h8"/><path d="M4.2 13.2c.4 4.3 3.7 7.3 7.8 7.3s7.4-3 7.8-7.3"/><path d="M2.8 14.8l1.4-1.6 1.7 1.3M21.2 14.8l-1.4-1.6-1.7 1.3"/>',
      container: '<rect x="2.5" y="6" width="19" height="12" rx=".8"/><path d="M6 8.5v7M9 8.5v7M12 8.5v7M15 8.5v7M18 8.5v7"/>',
      envelope: '<rect x="3" y="5.5" width="18" height="13" rx="1.4"/><path d="M3.5 6.5 12 13l8.5-6.5"/><circle cx="12" cy="14.5" r="2.1"/>',
      compass: '<circle cx="12" cy="12" r="9"/><path d="M12 3.8 13.6 10.4 20.2 12 13.6 13.6 12 20.2 10.4 13.6 3.8 12 10.4 10.4z"/><path d="M12 3.8v16.4M3.8 12h16.4" stroke-width=".6"/><circle cx="12" cy="12" r="1"/>',
      lighthouse: '<path d="M9 20.5 10 9h4l1 11.5z"/><path d="M9.6 7.2h4.8V9H9.6z"/><path d="M10.4 7.2V5.6L12 4.3l1.6 1.3v1.6"/><path d="M9.6 13h4.9M9.3 16.5h5.4"/><path d="M6 20.5h12"/><path d="M7.5 6.2 4 5.2M7.5 8.3 4 9.3M16.5 6.2l3.5-1M16.5 8.3l3.5 1"/>',
      helm: '<circle cx="12" cy="12" r="4.2"/><path d="M12 7.8V3M12 16.2V21M7.8 12H3M16.2 12H21"/><circle cx="12" cy="12" r="1.2"/><path d="M12 3h0M12 21h0M3 12h0M21 12h0" stroke-width="3"/>'
    };
    var MAP = {
      '🚢': 'ship', '🔒': 'logbook', '🖨': 'scroll', '📁': 'chest', '📝': 'quill', '📄': 'doc', '🧪': 'sextant',
      '⚙': 'wheel', '🔍': 'spyglass', '🏢': 'building', '💳': 'pen', '📋': 'clipboard', '📤': 'upload', '📥': 'download',
      '🗄': 'archive', '🐞': 'warning', '🏦': 'bank', '✅': 'seal', '⏳': 'hourglass', '⚓': 'anchor', '📦': 'container',
      '✉': 'envelope', '⚖': 'compass', '👑': 'helm', '⬇': 'download'
    };
    function svg(name, cls) {
      return '<svg class="ms-ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + P[name] + '</svg>';
    }
    window.__msIcons = { svg: svg, names: Object.keys(P) };

    var st = document.createElement('style'); st.id = 'ms-icons-style';
    st.textContent = '.ms-ic{width:1.25em;height:1.25em;display:inline-block;vertical-align:-0.25em;flex:none}' +
      'h1 .ms-ic,h2 .ms-ic{width:1.15em;height:1.15em;vertical-align:-0.18em}' +
      '.menu-item .ms-ic,#ws-nav .ms-ic{width:17px;height:17px;opacity:.9}' +
      /* header fix: on tablets / phones in landscape the long SIMULATION MODE badge collided with the buttons */
      'header .mr-auto.ml-8>span{white-space:nowrap}' +
      '@media (min-width:768px) and (max-width:1199px){header .mr-auto.ml-8{margin-left:10px!important;flex-shrink:0}header .mr-auto.ml-8>span{font-size:10px!important;padding:3px 6px!important}}' +
      '@media (min-width:768px) and (max-width:959px){header button[onclick="openQRModal()"] span{display:none!important}header #account-switcher{max-width:190px}}';
    document.head.appendChild(st);

    var keys = Object.keys(MAP).sort(function (a, b) { return b.length - a.length; });
    var RE = new RegExp('(' + keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')️?', 'g');
    var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, CODE: 1, PRE: 1, OPTION: 1, SELECT: 1 };

    function swapText(node) {
      var t = node.nodeValue; RE.lastIndex = 0;
      if (!t || !RE.test(t)) return;
      var p = node.parentNode; if (!p || SKIP[p.nodeName] || (p.closest && p.closest('#wk-log,[contenteditable=true]'))) return;
      var frag = document.createElement('span'); RE.lastIndex = 0;
      var html = t.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; })
        .replace(RE, function (m, k) { var n = MAP[k]; if (k === '✅' && p.closest && p.closest('#ws-nav,#view-ws-verify h1')) n = 'lighthouse'; return svg(n); });
      frag.innerHTML = html;
      while (frag.firstChild) p.insertBefore(frag.firstChild, node);
      p.removeChild(node);
    }
    function scan(root) {
      if (!root) return;
      if (root.nodeType === 3) { swapText(root); return; }
      if (root.nodeType !== 1 || SKIP[root.nodeName]) return;
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), list = [], n;
      while ((n = w.nextNode())) list.push(n);
      list.forEach(swapText);
    }
    function start() {
      scan(document.body);
      var pending = [], timer = null;
      new MutationObserver(function (ms) {
        ms.forEach(function (m) {
          if (m.type === 'characterData') pending.push(m.target);
          else Array.prototype.forEach.call(m.addedNodes, function (x) { pending.push(x); });
        });
        if (!timer) timer = setTimeout(function () { var l = pending; pending = []; timer = null; l.forEach(scan); }, 30);
      }).observe(document.body, { childList: true, subtree: true, characterData: true });
    }
    window.__msIcons.scan = scan;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  } catch (err) {
    if (window.console) console.warn('[icons.js] disabled:', err);
  }
})();

/* ---- Font size +2px for the whole platform (requested 27 Oct 2026) ----
 * Reads every font-size rule the page already has (Tailwind, workspace.js, watchkeeper.js)
 * and appends the same selector with 2px more. Re-runs when Tailwind adds new classes.
 * Roll back only this part: set window.MS_FONT_BUMP = 0 before this file loads, or delete this block. */
(function () {
  'use strict';
  try {
    if (window.__msFontBump) return; window.__msFontBump = true;
    var BUMP = typeof window.MS_FONT_BUMP === 'number' ? window.MS_FONT_BUMP : 2;
    if (!BUMP) return;
    var tag = document.createElement('style'); tag.id = 'ms-fontbump';
    function px(v) {
      var m = /^([\d.]+)(px|rem)$/.exec(String(v).trim()); if (!m) return null;
      return m[2] === 'rem' ? parseFloat(m[1]) * 16 : parseFloat(m[1]);
    }
    function walk(rules, out) {
      for (var i = 0; i < rules.length; i++) {
        var r = rules[i];
        if (r.type === 1 && r.style && r.style.fontSize) {
          var n = px(r.style.fontSize); if (n == null) continue;
          var sel = r.selectorText.indexOf('::') < 0 ? ':is(' + r.selectorText + '):not(header *)' : r.selectorText; // top bar keeps its original sizes so badges do not collide
          out.push(sel + '{font-size:' + (Math.round((n + BUMP) * 100) / 100) + 'px' + (r.style.getPropertyPriority('font-size') ? ' !important' : '') + '}');
        } else if (r.type === 4 && r.cssRules) {
          var inner = []; walk(r.cssRules, inner);
          if (inner.length) out.push('@media ' + r.media.mediaText + '{' + inner.join('') + '}');
        }
      }
    }
    var last = '';
    function build() {
      var out = ['body{font-size:' + (16 + BUMP) + 'px}', 'header{font-size:16px}'];
      for (var i = 0; i < document.styleSheets.length; i++) {
        var sh = document.styleSheets[i];
        if (sh.ownerNode === tag) continue;
        try { walk(sh.cssRules || [], out); } catch (e) { /* cross-origin sheet: skip */ }
      }
      var css = out.join('\n');
      if (css !== last) { last = css; tag.textContent = css; }
      if (document.head.lastElementChild !== tag) document.head.appendChild(tag); // stay last so it wins
    }
    var t = null;
    function soon() { if (!t) t = setTimeout(function () { t = null; build(); }, 120); }
    function start() {
      build();
      new MutationObserver(function (ms) {
        for (var i = 0; i < ms.length; i++) { if (ms[i].target !== tag && !(ms[i].addedNodes.length === 1 && ms[i].addedNodes[0] === tag)) { soon(); return; } }
      }).observe(document.head, { childList: true, subtree: true, characterData: true });
      window.addEventListener('load', soon);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  } catch (err) {
    if (window.console) console.warn('[icons.js font bump] disabled:', err);
  }
})();

/* ---- Phone portrait: full "SIMULATION MODE" label + one-time landscape hint (27 Oct 2026) ---- */
(function () {
  'use strict';
  try {
    if (window.__msPhoneUx) return; window.__msPhoneUx = true;
    function labelFix() {
      var badge = document.querySelector('header .md\\:hidden span.font-mono');
      if (!badge) return;
      for (var i = 0; i < badge.childNodes.length; i++) {
        var n = badge.childNodes[i];
        if (n.nodeType === 3 && /\bSIM\b/.test(n.nodeValue) && !/SIMULATION/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/\bSIM\b/, 'SIMULATION MODE');
      }
      badge.style.whiteSpace = 'nowrap';
    }
    var TR = (navigator.language || '').toLowerCase().indexOf('tr') === 0;
    var KEY = 'ms-landscape-hint-v1';
    function seen() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
    function remember() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }
    function isPhonePortrait() { return window.matchMedia('(max-width: 640px) and (orientation: portrait)').matches; }
    function hint() {
      if (seen() || !isPhonePortrait()) return;
      var st = document.createElement('style');
      st.textContent = '#ms-rot{position:fixed;left:12px;right:12px;bottom:76px;z-index:60;background:#0A2540;color:#fff;border-radius:14px;padding:14px 14px 12px;box-shadow:0 12px 32px rgba(10,37,64,.35);font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;display:flex;gap:12px;align-items:flex-start;animation:msrot .25s ease-out}' +
        '#ms-rot svg{width:34px;height:34px;flex:none;margin-top:2px}#ms-rot b{display:block;font-size:15px;margin-bottom:2px}' +
        '#ms-rot button{margin-top:10px;border:0;border-radius:8px;background:#fff;color:#0A2540;font-weight:700;padding:7px 14px;font-size:13px;cursor:pointer}' +
        '@keyframes msrot{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}';
      document.head.appendChild(st);
      var box = document.createElement('div'); box.id = 'ms-rot'; box.setAttribute('role', 'status');
      box.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2.5" width="10" height="17" rx="2"/><path d="M11 17h2"/><path d="M3 15.5a8.5 8.5 0 0 0 6 6"/><path d="M7.2 21.9 9 21.5l-.4-1.8"/><rect x="13.5" y="13" width="8" height="5.5" rx="1" opacity=".5"/></svg>' +
        '<div><b>' + (TR ? 'Daha rahat kullanım için' : 'For the best experience') + '</b>' +
        (TR ? 'Tablolar ve sevkiyat ekranları geniş. Telefonunuzu yatay çevirirseniz platform daha rahat okunur.' : 'Tables and shipment screens are wide. Turn your phone sideways for easier reading.') +
        '<br><button type="button">' + (TR ? 'Tamam' : 'Got it') + '</button></div>';
      document.body.appendChild(box);
      function close() { remember(); if (box.parentNode) box.parentNode.removeChild(box); window.removeEventListener('resize', onRot); }
      function onRot() { if (!isPhonePortrait()) close(); }
      box.querySelector('button').onclick = close;
      window.addEventListener('resize', onRot);
      setTimeout(close, 12000);
    }
    function start() { labelFix(); setTimeout(hint, 1200); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  } catch (err) {
    if (window.console) console.warn('[icons.js phone ux] disabled:', err);
  }
})();

/* ---- Layout fixes from the device audit + larger logo (27 Oct 2026) ---- */
(function () {
  'use strict';
  try {
    if (window.__msLayoutFix) return; window.__msLayoutFix = true;
    var css =
      /* menu labels: left aligned like the others even when they wrap to two lines */
      '#sidebar .menu-item,#ws-nav button{text-align:left!important;line-height:1.3}' +
      /* logo x2: was 36 / 48 / 64 px (phone / small tablet / desktop) */
      'header img[alt="Maresign"]{height:72px!important;width:auto!important}' +
      '@media (min-width:640px){header img[alt="Maresign"]{height:96px!important}}' +
      '@media (min-width:768px){header img[alt="Maresign"]{height:128px!important}}' +
      /* phones: nothing wider than the screen, comfortable tap targets */
      'main select{max-width:100%}' +
      '@media (max-width:640px){#ws-rulefor{width:100%}' +
      'main .view-section button:not(.chip),main .view-section select{min-height:34px}' +
      'main .view-section a.underline,main .view-section button.underline{display:inline-block;padding:6px 0}}' +
      /* phones/tablets: hide the Watchkeeper button while the side menu is open so it does not cover menu items */
      '@media (max-width:1023px){body.ms-sb-open #wk-fab{display:none!important}}';
    var st = document.createElement('style'); st.id = 'ms-layout-fix'; st.textContent = css;
    document.head.appendChild(st);
    /* the mobile side menu slides in under the header: keep its first item clear of the taller header */
    function syncSidebar() {
      var h = document.querySelector('header'), sb = document.getElementById('sidebar');
      if (!h || !sb) return;
      sb.style.paddingTop = window.innerWidth < 1024 ? (h.offsetHeight + 12) + 'px' : '';
    }
    function watchSidebar() {
      var sb = document.getElementById('sidebar'); if (!sb) return;
      var upd = function () { document.body.classList.toggle('ms-sb-open', !sb.classList.contains('-translate-x-full')); };
      upd(); new MutationObserver(upd).observe(sb, { attributes: true, attributeFilter: ['class'] });
    }
    function start() { syncSidebar(); watchSidebar(); window.addEventListener('resize', syncSidebar); window.addEventListener('load', syncSidebar); setTimeout(syncSidebar, 800); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  } catch (err) {
    if (window.console) console.warn('[icons.js layout fix] disabled:', err);
  }
})();
