/*!
 * watchkeeper.js v0.2 - Watchkeeper assistant panel for platform.maresign.com
 * Installed by ONE deferred script line in index.html. Roll back: delete that line.
 * Talks only to the Maresign proxy (form.maresign.com/watchkeeper), which holds the API key.
 * Explains and suggests; never runs an action. Conversation lives in memory only.
 */
(function () {
  'use strict';
  try {
    if (window.__msWatchkeeper) return; window.__msWatchkeeper = true;
    var API = 'https://form.maresign.com/watchkeeper/api.php';
    var ANCHOR = '<svg class="wk-anc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.6" r="1.8"/><path d="M12 6.4v14.1"/><path d="M8 9.2h8"/><path d="M4.2 13.2c.4 4.3 3.7 7.3 7.8 7.3s7.4-3 7.8-7.3"/><path d="M2.8 14.8l1.4-1.6 1.7 1.3M21.2 14.8l-1.4-1.6-1.7 1.3"/></svg>'; // original line anchor, same style as icons.js

    var T = {
      tr: { title: 'Watchkeeper', sub: 'Vardiya zabiti · ekranları ve belgeleri anlatır', ph: 'Sorunuzu yazın…', send: 'Gönder',
        hello: 'Merhaba, ben Watchkeeper, bu platformun vardiya zabitiyim. Bu platformdaki ekranları, belgeleri ve bir belgenin hangi ülkede ne sayıldığını anlatırım. Karar vermem, işlem yapmam: adımı söylerim, düğmeye siz basarsınız.',
        foot: 'Simülasyon · hukuki görüş değildir · kişisel veri girmeyin', go: 'Ekrana git', err: 'Bağlantı kurulamadı. Biraz sonra tekrar deneyin.', thinking: 'Seyir defterine bakıyorum…',
        chips: ['Bu ekran ne işe yarıyor?', 'Bu konşimento Türkiye\'de ne sayılır?', 'DCSA eki eBL\'yi Türkiye\'de geçerli kılar mı?', 'Kuantum sonrası imza neden gerekli?', 'Bitcoin çapası neyi kanıtlar?'] },
      en: { title: 'Watchkeeper', sub: 'Officer of the watch · explains screens and documents', ph: 'Type your question…', send: 'Send',
        hello: 'Hello, I am Watchkeeper, the officer of the watch on this platform. I explain the screens, the documents and what a document counts as in each jurisdiction. I don\'t decide and I don\'t act: I tell you the step, you press the button.',
        foot: 'Simulation · not legal advice · do not enter personal data', go: 'Go to screen', err: 'Could not connect. Please try again shortly.', thinking: 'Checking the log book…',
        chips: ['What is this screen for?', 'What does this bill of lading count as in Türkiye?', 'Does the DCSA Annex make an eBL valid in Türkiye?', 'Why post-quantum signatures?', 'What does a Bitcoin anchor prove?'] }
    };
    var lang = (navigator.language || 'en').toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en';
    var history = []; var busy = false;

    var css = '' +
      '#wk-fab{position:fixed;right:20px;bottom:20px;z-index:45;display:flex;align-items:center;gap:8px;background:#0A2540;color:#fff;border:0;border-radius:999px;padding:10px 16px 10px 13px;font:600 13px/1 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 8px 24px rgba(10,37,64,.28);cursor:pointer}' +
      '.wk-anc{width:20px;height:20px;flex:none}#wk-panel .wk-badge{width:36px;height:36px;border-radius:9px;border:1px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;flex:none}#wk-panel .wk-badge .wk-anc{width:24px;height:24px}' +
      '#wk-fab .d{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.25)}' +
      '#wk-panel{position:fixed;right:20px;bottom:78px;z-index:46;width:380px;max-width:calc(100vw - 24px);height:560px;max-height:calc(100vh - 110px);display:none;flex-direction:column;background:#fff;border:1px solid #E2E8F0;border-radius:16px;box-shadow:0 18px 48px rgba(15,23,42,.22);overflow:hidden;font:13px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;color:#0F172A}' +
      '#wk-panel.on{display:flex}' +
      '#wk-panel .hd{background:#0A2540;color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px}' +
      '#wk-panel .hd b{display:block;font-size:14px}#wk-panel .hd span{font-size:11px;opacity:.75}' +
      '#wk-panel .hd .sp{margin-left:auto;display:flex;gap:6px;align-items:center}' +
      '#wk-panel .lg{border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff;border-radius:6px;font-size:10.5px;font-weight:700;padding:2px 6px;cursor:pointer}#wk-panel .lg.on{background:#fff;color:#0A2540}' +
      '#wk-panel .x{background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer;line-height:1;padding:0 2px}' +
      '#wk-log{flex:1;overflow-y:auto;padding:14px;background:#F8FAFC;display:flex;flex-direction:column;gap:10px}' +
      '#wk-log .m{max-width:88%;padding:9px 12px;border-radius:12px;white-space:normal;word-wrap:break-word}' +
      '#wk-log .a{background:#fff;border:1px solid #E2E8F0;align-self:flex-start;border-bottom-left-radius:4px}' +
      '#wk-log .u{background:#0A2540;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}' +
      '#wk-log .t{color:#64748B;font-style:italic}' +
      '#wk-log .go{display:inline-block;margin:6px 6px 0 0;border:1px solid #00A3E0;color:#0369a1;background:#f0f9ff;border-radius:8px;padding:4px 9px;font-size:12px;font-weight:600;cursor:pointer}' +
      '#wk-log ul{margin:4px 0 0 18px;padding:0}#wk-log p{margin:0 0 6px}#wk-log p:last-child{margin:0}' +
      '#wk-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px;background:#F8FAFC}' +
      '#wk-chips button{border:1px solid #E2E8F0;background:#fff;border-radius:999px;padding:5px 10px;font-size:11.5px;cursor:pointer;color:#0F172A}' +
      '#wk-form{display:flex;gap:8px;padding:10px;border-top:1px solid #E2E8F0;background:#fff}' +
      '#wk-in{flex:1;border:1px solid #E2E8F0;border-radius:10px;padding:9px 11px;font:inherit;resize:none;height:40px;max-height:110px}' +
      '#wk-send{border:0;border-radius:10px;background:#0A2540;color:#fff;font-weight:700;padding:0 14px;cursor:pointer}#wk-send[disabled]{opacity:.45;cursor:default}' +
      '#wk-panel .ft{font-size:10.5px;color:#64748B;text-align:center;padding:0 10px 8px;background:#fff}' +
      '@media (max-width:640px){#wk-panel{right:12px;left:12px;width:auto;bottom:72px;height:calc(100vh - 100px)}#wk-fab{right:12px;bottom:14px}}';
    var st = document.createElement('style'); st.id = 'wk-style'; st.textContent = css; document.head.appendChild(st);

    var fab = document.createElement('button'); fab.id = 'wk-fab'; fab.type = 'button';
    fab.innerHTML = ANCHOR + '<span>Watchkeeper</span><span class="d"></span>';
    var p = document.createElement('div'); p.id = 'wk-panel'; p.setAttribute('role', 'dialog');
    p.innerHTML = '<div class="hd"><span class="wk-badge">' + ANCHOR + '</span><div><b id="wk-t"></b><span id="wk-s"></span></div><div class="sp"><button class="lg" data-l="tr">TR</button><button class="lg" data-l="en">EN</button><button class="x" id="wk-x" aria-label="Close">×</button></div></div>' +
      '<div id="wk-log"></div><div id="wk-chips"></div>' +
      '<form id="wk-form"><textarea id="wk-in" maxlength="1200" rows="1"></textarea><button id="wk-send" type="submit"></button></form><div class="ft" id="wk-f"></div>';
    document.body.appendChild(fab); document.body.appendChild(p);

    function $(s) { return p.querySelector(s); }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    var VIEWS = ['vault', 'network', 'paper', 'dataroom', 'templates', 'ws-ship', 'ws-env', 'ws-rule', 'ws-verify', 'lab', 'kyc'];

    function render(text) {
      var gos = [];
      text = text.replace(/\[\[GO:([a-z\-]+)\]\]/g, function (_, v) { if (VIEWS.indexOf(v) >= 0 && gos.indexOf(v) < 0) gos.push(v); return ''; });
      var lines = esc(text.trim()).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').split(/\n/);
      var html = '', inList = false;
      lines.forEach(function (l) {
        var li = l.match(/^\s*(?:[-•*]|\d+[.)])\s+(.*)$/);
        if (li) { if (!inList) { html += '<ul>'; inList = true; } html += '<li>' + li[1] + '</li>'; return; }
        if (inList) { html += '</ul>'; inList = false; }
        if (l.trim()) html += '<p>' + l + '</p>';
      });
      if (inList) html += '</ul>';
      gos.forEach(function (v) { html += '<button class="go" data-v="' + v + '">↪ ' + T[lang].go + ': ' + navLabel(v) + '</button>'; });
      return html;
    }
    function navBtn(v) {
      return v.indexOf('ws-') === 0 ? document.querySelector('#ws-nav button[data-ws="' + v + '"]') : document.querySelector('.menu-item[onclick*="\'' + v + '\'"]');
    }
    function navLabel(v) { var b = navBtn(v); return b ? esc(b.textContent.replace(/NEW/g, '').trim()) : v; }
    function add(cls, html) { var d = document.createElement('div'); d.className = 'm ' + cls; d.innerHTML = html; $('#wk-log').appendChild(d); $('#wk-log').scrollTop = 1e6; return d; }

    $('#wk-log').addEventListener('click', function (e) {
      var b = e.target.closest('.go'); if (!b) return;
      var v = b.getAttribute('data-v'), nb = navBtn(v);
      if (nb) nb.click(); else if (typeof window.switchTab === 'function') window.switchTab(v, null);
      if (window.innerWidth < 640) p.classList.remove('on');
    });

    function context() {
      var sec = document.querySelector('.view-section.active') || document.querySelector('main');
      var nav = document.querySelector('#sidebar .menu-item.active, #sidebar .menu-item.bg-corporate');
      var role = '';
      var sel = document.querySelector('header select'); if (sel && sel.options[sel.selectedIndex]) role = sel.options[sel.selectedIndex].textContent.trim();
      var txt = sec ? (sec.innerText || '').replace(/\n{3,}/g, '\n\n').trim() : '';
      return 'View id: ' + (sec && sec.id ? sec.id.replace(/^view-/, '') : 'unknown') + '\nMenu item: ' + (nav ? nav.textContent.replace(/NEW/g, '').trim() : '') + (role ? '\nRole: ' + role : '') + '\nVisible text:\n' + txt.slice(0, 4500);
    }

    function setLang(l) {
      lang = l; var t = T[l];
      $('#wk-t').textContent = t.title; $('#wk-s').textContent = t.sub; $('#wk-in').placeholder = t.ph; $('#wk-send').textContent = t.send; $('#wk-f').textContent = t.foot;
      Array.prototype.forEach.call(p.querySelectorAll('.lg'), function (b) { b.classList.toggle('on', b.getAttribute('data-l') === l); });
      $('#wk-chips').innerHTML = history.length ? '' : t.chips.map(function (c) { return '<button type="button">' + esc(c) + '</button>'; }).join('');
      if (!history.length) { $('#wk-log').innerHTML = ''; add('a', '<p>' + esc(t.hello) + '</p>'); }
    }
    Array.prototype.forEach.call(p.querySelectorAll('.lg'), function (b) { b.onclick = function () { setLang(b.getAttribute('data-l')); }; });
    $('#wk-chips').addEventListener('click', function (e) { if (e.target.tagName === 'BUTTON') ask(e.target.textContent); });

    function ask(q) {
      q = (q || '').trim(); if (!q || busy) return;
      busy = true; $('#wk-send').disabled = true; $('#wk-chips').innerHTML = '';
      add('u', esc(q)); history.push({ role: 'user', content: q });
      var wait = add('a t', esc(T[lang].thinking));
      fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-8), context: context(), lang: lang }) })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (j) {
          wait.remove();
          if (j && j.reply) { history.push({ role: 'assistant', content: j.reply }); add('a', render(j.reply)); }
          else { history.pop(); add('a t', esc((j && j.message) || T[lang].err)); }
        }, function () { wait.remove(); history.pop(); add('a t', esc(T[lang].err)); })
        .then(function () { busy = false; $('#wk-send').disabled = false; $('#wk-in').focus(); });
    }
    $('#wk-form').addEventListener('submit', function (e) { e.preventDefault(); var v = $('#wk-in').value; $('#wk-in').value = ''; ask(v); });
    $('#wk-in').addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#wk-form').requestSubmit ? $('#wk-form').requestSubmit() : $('#wk-send').click(); } });
    fab.onclick = function () { p.classList.toggle('on'); if (p.classList.contains('on')) $('#wk-in').focus(); };
    $('#wk-x').onclick = function () { p.classList.remove('on'); };
    setLang(lang);
  } catch (err) {
    if (window.console) console.warn('[watchkeeper.js] disabled:', err);
  }
})();
