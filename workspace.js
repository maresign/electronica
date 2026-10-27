/*!
 * workspace.js — Shipment Workspace add-on for platform.maresign.com (v2 preview)
 * Adds four sidebar items: Shipments, Envelopes, Rulebook, Public verification.
 * Installed by ONE line in index.html (a deferred script tag pointing to workspace.js).
 * Roll back: delete that line (or this file). Nothing in index.html is changed or overridden.
 * All data is simulated. Only SHA-256 hashing (Web Crypto) runs for real, in the browser.
 */
(function () {
  'use strict';
  try {
    if (window.__msWorkspace) return; window.__msWorkspace = true;

    // ---------------- styles (scoped under .ws) ----------------
    var css = `
.ws{--corp:#0A2540;--accent:#00A3E0;--line:#E2E8F0;--ink:#0F172A;--muted:#64748B;--purple:#7C3AED;font-size:13px;color:var(--ink)}
.ws *{box-sizing:border-box}
.ws h1{font-size:20px;font-weight:700;color:var(--corp);margin:0 0 4px}
.ws .sub{color:var(--muted);margin:0 0 16px;font-size:12px}
.ws .card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.ws .grid2{display:grid;grid-template-columns:300px 1fr;gap:16px}
.ws .shiplist{display:flex;flex-direction:column;gap:8px}
.ws .ship{cursor:pointer;border:1px solid var(--line);border-radius:12px;padding:12px;background:#fff}
.ws .ship:hover{border-color:#94a3b8}.ws .ship.on{border-color:var(--corp);box-shadow:0 0 0 2px rgba(10,37,64,.12)}
.ws .ship b{display:block;font-size:13px}.ws .ship span.m{font-size:11.5px;color:var(--muted)}
.ws .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.ws .between{justify-content:space-between}
.ws .state{font-size:11px;font-weight:700;padding:3px 8px;border-radius:999px;background:#eef2ff;color:#3730a3;border:1px solid #c7d2fe;white-space:nowrap}
.ws .chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);border-radius:10px;padding:4px 8px 4px 4px;background:#fff;font-size:12px;cursor:pointer}
.ws .chip .t{font-size:10.5px;font-weight:800;color:#fff;border-radius:7px;padding:3px 6px;min-width:38px;text-align:center}
.ws .t-eBL{background:#1e3a8a}.ws .t-eFBL{background:#334155}.ws .t-eNCD{background:#0e7490}.ws .t-INV{background:#ca8a04}.ws .t-PL{background:#b91c1c}.ws .t-COO{background:#059669}.ws .t-CUS{background:#ea580c}.ws .t-SOF{background:#7c3aed}.ws .t-NOR{background:#9333ea}.ws .t-BDN{background:#0f766e}
.ws .sec{margin-top:16px}.ws .sec h3{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:0 0 8px;font-weight:700}
.ws table{width:100%;border-collapse:collapse;font-size:12.5px}
.ws th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);border-bottom:1px solid var(--line);padding:8px;background:#f8fafc}
.ws td{border-bottom:1px solid #f1f5f9;padding:8px;vertical-align:top}
.ws select,.ws input[type=text]{border:1px solid var(--line);border-radius:8px;padding:7px 10px;font-size:12.5px;background:#fff}
.ws .btn{cursor:pointer;border:0;border-radius:8px;padding:7px 12px;font-weight:700;font-size:12.5px;background:var(--corp);color:#fff;text-decoration:none;display:inline-block}
.ws .btn[disabled]{opacity:.4;cursor:default}
.ws .btn.ghost{background:#fff;color:var(--corp);border:1px solid var(--line)}
.ws .tl{list-style:none;margin:0;padding:0}
.ws .tl li{position:relative;padding:0 0 12px 22px;border-left:2px solid var(--line);margin-left:6px}
.ws .tl li:before{content:"";position:absolute;left:-7px;top:2px;width:12px;height:12px;border-radius:50%;background:var(--accent);border:2px solid #fff}
.ws .tl .h{font-weight:700;font-size:12.5px}.ws .tl .m{font-size:11.5px;color:var(--muted)}
.ws .hash{font-family:ui-monospace,monospace;font-size:11px;color:var(--purple);word-break:break-all}
.ws .jur{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;border-radius:6px;padding:3px 7px;border:1px solid;cursor:pointer}
.ws .j-title{color:#065f46;background:#ecfdf5;border-color:#a7f3d0}.ws .j-evid{color:#92400e;background:#fffbeb;border-color:#fde68a}
.ws .j-contract{color:#1e40af;background:#eff6ff;border-color:#bfdbfe}.ws .j-na{color:#475569;background:#f8fafc;border-color:#e2e8f0}
.ws .jurbox{margin-top:8px;font-size:12.5px;background:#f8fafc;border:1px solid var(--line);border-radius:10px;padding:10px;display:none}
.ws .tabs{display:flex;gap:6px;flex-wrap:wrap}
.ws .tabs button{cursor:pointer;border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 12px;font-weight:600;font-size:12px}
.ws .tabs button.on{background:var(--corp);color:#fff;border-color:var(--corp)}
.ws .pill{font-size:11px;font-weight:700;border-radius:999px;padding:3px 8px;white-space:nowrap}
.ws .p-rec{background:#ede9fe;color:#5b21b6}.ws .p-prog{background:#fef3c7;color:#92400e}.ws .p-done{background:#d1fae5;color:#065f46}.ws .p-draft{background:#f1f5f9;color:#475569}
.ws .res{margin-top:12px;border-radius:12px;padding:14px;display:none;font-size:12.5px}
.ws .res.ok{display:block;background:#ecfdf5;border:1px solid #a7f3d0}.ws .res.bad{display:block;background:#fef2f2;border:1px solid #fecaca}
.ws .drop{border:2px dashed #cbd5e1;border-radius:14px;padding:22px;text-align:center;background:#fff}
.ws.new{font-size:9px;font-family:ui-monospace,monospace;padding:1px 6px;border-radius:4px;background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd;margin-left:auto}
#ws-toast{position:fixed;left:50%;bottom:72px;transform:translateX(-50%);background:#0A2540;color:#fff;padding:10px 14px;border-radius:10px;font-size:12px;opacity:0;transition:.25s;pointer-events:none;z-index:70;max-width:92vw}
#ws-toast.on{opacity:1}
@media (max-width:900px){.ws .grid2{grid-template-columns:1fr}}`;
    var st = document.createElement('style'); st.id = 'ws-style'; st.textContent = css; document.head.appendChild(st);

    // ---------------- data (simulated) ----------------
    var JUR = ['TR', 'UK', 'SG', 'FR', 'DCSA'];
    var JLABEL = { TR: 'TR', UK: 'UK', SG: 'SG', FR: 'FR', DCSA: 'DCSA Annex' };
    var JMAP = {
      eBL: {
        TR: ['j-evid', 'Evidence', 'Türkiye: TTK m.1228 et seq. assume a paper bill of lading and MLETR is not adopted. The eBL is not a statutory document of title; signed with a qualified e-signature it is strong written evidence (HMK m.205/2).'],
        UK: ['j-title', 'Doc. of title', 'UK: Electronic Trade Documents Act 2023 gives a qualifying electronic bill of lading the same effect as paper.'],
        SG: ['j-title', 'Doc. of title', 'Singapore: Electronic Transactions Act as amended in 2021 implements MLETR.'],
        FR: ['j-title', 'Doc. of title', 'France: electronic transferable records recognised; implementing decree No. 2025-811.'],
        DCSA: ['j-contract', 'Contractual', 'DCSA Standard Annex v2: binds the users who accepted it. It does not bind third parties such as a court, customs, an arresting creditor or a non-party bank.']
      },
      eNCD: {
        TR: ['j-na', 'Not party', 'NCD Convention: Türkiye has not ratified. Art. 1 may still apply if taking in charge, delivery or issuance is in a State Party and the document refers to the Convention conspicuously.'],
        UK: ['j-na', 'Not in force', 'The Convention enters into force 180 days after the tenth ratification (Art. 25).'],
        SG: ['j-na', 'Not in force', 'Not yet in force (Art. 25).'], FR: ['j-na', 'Not in force', 'Not yet in force (Art. 25).'],
        DCSA: ['j-na', 'Out of scope', 'The DCSA Annex covers ocean eBLs.']
      },
      OPS: {
        TR: ['j-evid', 'Evidence', 'Operational record, not a document of title. With a qualified e-signature (Law No. 5070) it is written evidence (HMK m.205/2).'],
        UK: ['j-na', 'Evidence', 'Operational record; admissible as evidence.'], SG: ['j-na', 'Evidence', 'Operational record; admissible as evidence.'], FR: ['j-na', 'Evidence', 'Operational record; admissible as evidence.'],
        DCSA: ['j-na', 'Out of scope', 'Not a transferable record.']
      }
    };
    JMAP.eFBL = JMAP.eBL;
    var OPS_TYPES = ['INV', 'PL', 'COO', 'CUS', 'SOF', 'NOR', 'BDN'];
    var TYPE_NAME = { eBL: 'Electronic bill of lading', eFBL: 'FIATA negotiable multimodal B/L', eNCD: 'Negotiable cargo document', INV: 'Commercial invoice', PL: 'Packing list', COO: 'Certificate of origin', CUS: 'Customs declaration', SOF: 'Statement of facts', NOR: 'Notice of readiness', BDN: 'Bunker delivery note' };

    var shipments = [
      { id: 'SHP-26-0412', title: 'Ambarlı → Rotterdam', meta: "Container · 40' HC · MV Meridian Star 042W", tdoc: 'eBL', ebl: 'MRS-2026-TR-881', state: 'ISSUED', holder: 'Maresign Exporters',
        parties: [['Issuer (carrier)', 'Meridian Maritime'], ['Shipper', 'Maresign Exporters'], ['Consignee', 'To order'], ['Notify / buyer', 'Global Imports LLC'], ['Bank', 'Global Bank PLC'], ['Agent', 'Port Customs Agency']],
        docs: [['eBL', 'MRS-2026-TR-881'], ['INV', 'INV-55210'], ['PL', 'PL-55210'], ['COO', 'TOBB-COO-88412'], ['CUS', 'GB-26TR0412']],
        tl: [['Draft created', 'Maresign Exporters', '2026-10-20 09:12'], ['eBL issued · e-seal (simulated)', 'Meridian Maritime', '2026-10-21 14:03']] },
      { id: 'SHP-26-0398', title: 'Houston → İskenderun', meta: 'Bulk · steel coils · MV Anatolian Grace', tdoc: 'eFBL', ebl: 'MRS-2026-US-102', state: 'TRANSFERRED', holder: 'Global Bank PLC',
        parties: [['Issuer', 'Meridian Maritime'], ['Shipper', 'Gulf Steel Inc.'], ['Consignee', 'To order of Global Bank PLC'], ['Buyer', 'İskenderun Çelik A.Ş.'], ['Bank', 'Global Bank PLC']],
        docs: [['eFBL', 'MRS-2026-US-102'], ['INV', 'INV-77019'], ['NOR', 'NOR-AG-0915'], ['SOF', 'SOF-AG-0915'], ['BDN', 'BDN-HOU-3321']],
        tl: [['NOR tendered · QES (simulated)', 'Master, MV Anatolian Grace', '2026-09-15 06:40'], ['B/L issued · e-seal (simulated)', 'Meridian Maritime', '2026-09-18 17:20'], ['Endorsed to bank', 'Gulf Steel Inc.', '2026-09-22 10:05']] },
      { id: 'SHP-26-0377', title: 'Mersin → Almaty (Middle Corridor)', meta: 'Multimodal · sea + rail · NCD template', tdoc: 'eNCD', ebl: 'MRS-2026-NCD-007', state: 'DRAFT', holder: 'Maresign Exporters',
        parties: [['Transport operator', 'Caspian Link Logistics'], ['Consignor', 'Maresign Exporters'], ['Consignee', 'To order'], ['Buyer', 'Almaty Trade LLP']],
        docs: [['eNCD', 'MRS-2026-NCD-007'], ['INV', 'INV-90120'], ['PL', 'PL-90120'], ['CUS', 'GB-26TR0377']],
        tl: [['Draft created (NCD template)', 'Maresign Exporters', '2026-10-24 11:30']] }
    ];
    var STATES = ['DRAFT', 'ISSUED', 'TRANSFERRED', 'SURRENDER_REQUESTED', 'DELIVERED', 'AMEND_REQUESTED', 'SWITCHED_TO_PAPER', 'VOID'];
    var RULES = [
      ['DRAFT', 'ISSUED', 'Issuer (carrier / transport operator)', 'Qualified e-seal', 'Art. 10 (singularity, integrity)', 'Art. 3 (issuance), Art. 12', 's.2 (qualifying document: integrity, exclusive control, reliable system)'],
      ['ISSUED', 'TRANSFERRED', 'Current holder', 'Qualified e-signature', 'Art. 11 (control), Art. 15 (endorsement)', 'Art. 11 (transfer), Art. 15–16', 's.3 (possession, indorsement)'],
      ['TRANSFERRED', 'TRANSFERRED', 'Current holder', 'Qualified e-signature', 'Art. 11, Art. 15', 'Art. 11, Art. 16', 's.3'],
      ['ISSUED', 'SURRENDER_REQUESTED', 'Holder at destination', 'Qualified e-signature', 'Art. 11', 'Art. 10 (delivery)', 's.3 (parting with possession)'],
      ['TRANSFERRED', 'SURRENDER_REQUESTED', 'Holder at destination', 'Qualified e-signature', 'Art. 11', 'Art. 10 (delivery)', 's.3 (parting with possession)'],
      ['SURRENDER_REQUESTED', 'DELIVERED', 'Issuer', 'Qualified e-seal', 'Art. 11', 'Art. 10', 's.3 (effect)'],
      ['ISSUED', 'AMEND_REQUESTED', 'Holder', 'Qualified e-signature', 'Art. 16 (amendment)', 'not addressed', 'not addressed'],
      ['AMEND_REQUESTED', 'ISSUED', 'Issuer (re-issues)', 'Qualified e-seal', 'Art. 16', 'Art. 3', 's.2'],
      ['ISSUED', 'SWITCHED_TO_PAPER', 'Holder + issuer', 'Qualified e-signature + e-seal', 'Art. 18 (change of medium)', 'Art. 17 (change of medium)', 's.4 (change of form)'],
      ['TRANSFERRED', 'SWITCHED_TO_PAPER', 'Holder + issuer', 'Qualified e-signature + e-seal', 'Art. 18', 'Art. 17', 's.4'],
      ['DRAFT', 'VOID', 'Issuer', 'Qualified e-seal', '—', '—', '—']
    ];
    var ACTIONS = {
      DRAFT: [['ISSUED', 'Issue (e-seal)'], ['VOID', 'Void draft']],
      ISSUED: [['TRANSFERRED', 'Transfer / endorse'], ['SURRENDER_REQUESTED', 'Request surrender for delivery'], ['AMEND_REQUESTED', 'Request amendment'], ['SWITCHED_TO_PAPER', 'Switch to paper']],
      TRANSFERRED: [['TRANSFERRED', 'Transfer / endorse again'], ['SURRENDER_REQUESTED', 'Request surrender for delivery'], ['SWITCHED_TO_PAPER', 'Switch to paper']],
      SURRENDER_REQUESTED: [['DELIVERED', 'Accept surrender · deliver']],
      AMEND_REQUESTED: [['ISSUED', 'Re-issue amended eBL']],
      DELIVERED: [], SWITCHED_TO_PAPER: [], VOID: []
    };
    var envelopes = [
      { box: 'inbox', from: 'Meridian Maritime', to: 'Maresign Exporters', subj: 'eBL MRS-2026-TR-881 issued', att: ['eBL', 'INV'], st: 'Received', d: '2026-10-21' },
      { box: 'inbox', from: 'Port Customs Agency', to: 'Maresign Exporters', subj: 'Export declaration GB-26TR0412', att: ['CUS'], st: 'Received', d: '2026-10-21' },
      { box: 'sent', from: 'Maresign Exporters', to: 'Global Bank PLC', subj: 'Bank presentation, L/C 4471', att: ['eBL', 'INV', 'PL', 'COO'], st: 'In progress', d: '2026-10-22' },
      { box: 'inbox', from: 'Master, MV Anatolian Grace', to: 'İskenderun Çelik A.Ş.', subj: 'NOR tendered, İskenderun anchorage', att: ['NOR', 'SOF'], st: 'Done', d: '2026-09-15' },
      { box: 'inbox', from: 'Bunker supplier (sim.)', to: 'Meridian Maritime', subj: 'e-BDN BDN-HOU-3321 signed by chief engineer', att: ['BDN'], st: 'Done', d: '2026-09-12' },
      { box: 'drafts', from: 'Maresign Exporters', to: 'Caspian Link Logistics', subj: 'NCD draft for Mersin → Almaty', att: ['eNCD', 'PL'], st: 'Draft', d: '2026-10-24' },
      { box: 'archive', from: 'Gulf Steel Inc.', to: 'Global Bank PLC', subj: 'Endorsement of MRS-2026-US-102', att: ['eFBL'], st: 'Done', d: '2026-09-22' }
    ];

    // ---------------- helpers ----------------
    function q(s) { return document.querySelector(s); }
    function qa(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function pretty(s) { return s.replace(/_/g, ' ').toLowerCase().replace(/^./, function (c) { return c.toUpperCase(); }); }
    function chip(t, no) { return '<span class="chip" data-t="' + t + '" data-no="' + esc(no) + '"><span class="t t-' + t + '">' + t + '</span>' + esc(no) + '</span>'; }
    function toast(m) { var t = q('#ws-toast'); t.textContent = m; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('on'); }, 2600); }
    function sha256(text) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (b) {
        return Array.prototype.map.call(new Uint8Array(b), function (x) { return x.toString(16).padStart(2, '0'); }).join('');
      });
    }

    // ---------------- DOM injection ----------------
    var nav = q('#sidebar nav');
    var main = q('main');
    if (!nav || !main || typeof window.switchTab !== 'function') return; // host page changed: do nothing

    var BTN = 'menu-item w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-all';
    var grp = document.createElement('div');
    grp.id = 'ws-nav';
    grp.innerHTML = '<div class="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shipment Workspace</div><div class="space-y-1">' +
      '<button data-ws="ws-ship" class="' + BTN + '">📦 Shipments <span class="ws new">NEW</span></button>' +
      '<button data-ws="ws-env" class="' + BTN + '">✉️ Envelopes <span class="ws new">NEW</span></button>' +
      '<button data-ws="ws-rule" class="' + BTN + '">⚖️ Smart Rulebook <span class="ws new">NEW</span></button>' +
      '<button data-ws="ws-verify" class="' + BTN + '">✅ Public Verification <span class="ws new">NEW</span></button></div>';
    // place before the "R&D" group (third group) if present, else at end
    var groups = nav.children;
    nav.insertBefore(grp, groups.length > 2 ? groups[2] : null);

    var html =
      '<section id="view-ws-ship" class="view-section ws"><h1>📦 Shipment folders</h1><p class="sub">Every document, party and event of a shipment in one place. Click a document chip to see its legal status by jurisdiction.</p>' +
      '<div class="grid2"><div class="shiplist" id="ws-shiplist"></div><div class="card" id="ws-shipdetail"></div></div></section>' +

      '<section id="view-ws-env" class="view-section ws"><h1>✉️ Envelopes</h1><p class="sub">Documents move in envelopes, like email. Filter by folder, document type or text.</p>' +
      '<div class="card"><div class="row between" style="margin-bottom:10px"><div class="tabs" id="ws-envtabs"></div><div class="row"><select id="ws-envtype"></select><input type="text" id="ws-envq" placeholder="Search subject, party, no."></div></div>' +
      '<div style="overflow-x:auto"><table style="min-width:700px"><thead><tr><th>From / To</th><th>Subject</th><th>Attachments</th><th>Status</th><th>Date</th></tr></thead><tbody id="ws-envbody"></tbody></table></div></div></section>' +

      '<section id="view-ws-rule" class="view-section ws"><h1>⚖️ Smart Rulebook (smart contract)</h1><p class="sub">The smart contract of the workspace, run on permissioned infrastructure instead of a public chain. It defines which state an eBL can move to, who may sign each step and which legal provision the rule mirrors. The engine refuses any step the contract does not define. Every executed step is meant to be sealed with a qualified e-signature or e-seal (Law No. 5070); here the signatures are simulated, the rule enforcement and hashes are real.</p>' +
      '<div class="card"><div class="row" style="margin-bottom:8px">Highlight for: <select id="ws-rulefor"></select></div><div style="overflow-x:auto" id="ws-rulesvg"></div></div>' +
      '<div class="card sec" style="overflow-x:auto"><table style="min-width:900px"><thead><tr><th>Rule</th><th>From → To</th><th>Who may act</th><th>Signature</th><th>MLETR</th><th>NCD Convention</th><th>UK ETDA 2023</th></tr></thead><tbody id="ws-rulebody"></tbody></table></div>' +
      '<div class="card sec"><div class="row between"><h3 style="margin:0">Contract definition</h3><span class="sub" style="margin:0">Contract ID = SHA-256 of this definition. Change one character and the ID changes.</span></div><div class="hash sec" id="ws-cid" style="margin-top:8px"></div><div id="ws-canc" style="margin-top:6px"></div><pre id="ws-spec" style="margin:10px 0 0;max-height:260px;overflow:auto;background:#0f172a;color:#e2e8f0;border-radius:10px;padding:12px;font-size:11.5px;line-height:1.45"></pre></div>' +
      '<div class="card sec" style="overflow-x:auto"><h3>Execution log</h3><table style="min-width:700px"><thead><tr><th>Time</th><th>Document</th><th>Rule</th><th>Step</th><th>Result</th><th>Evidence hash</th></tr></thead><tbody id="ws-exec"></tbody></table><p class="sub" style="margin:8px 0 0">Run an action in Shipments to see it here. Steps the contract does not allow are recorded as rejected.</p></div></section>' +

      '<section id="view-ws-verify" class="view-section ws"><h1>✅ Public verification</h1><p class="sub">For a bank, customs officer or court: no account needed. Drop an evidence package or type a document number. The file is hashed locally; nothing is uploaded.</p>' +
      '<div class="card"><div class="drop"><p style="margin:0 0 10px"><b>Drop or choose an evidence package (.json)</b></p><input type="file" id="ws-vfile" accept=".json,application/json"></div>' +
      '<div class="row sec"><input type="text" id="ws-vno" placeholder="Document no, e.g. MRS-2026-TR-881" style="flex:1;min-width:220px"><button class="btn" id="ws-vbtn">Look up</button></div>' +
      '<div class="res" id="ws-vres"></div>' +
      '<div class="sec"><h3>Try it</h3><p class="sub" style="margin:0 0 8px">Download a sample package, verify it, then change one character and verify again.</p><div class="row" id="ws-samples"></div></div>' +
      '<p class="sub sec">Registry match only. Full cryptographic verification (signatures, certificates, TradeTrust, DCSA) runs in the Verification Lab.</p></div></section>';
    var holder = document.createElement('div'); holder.innerHTML = html;
    while (holder.firstChild) main.appendChild(holder.firstChild);
    var tst = document.createElement('div'); tst.id = 'ws-toast'; document.body.appendChild(tst);

    qa('#ws-nav button').forEach(function (b) {
      b.addEventListener('click', function () {
        window.switchTab(b.getAttribute('data-ws'), b);
        if (b.getAttribute('data-ws') === 'ws-rule') renderRule();
      });
    });

    // ---------------- shipments ----------------
    var cur = 0;
    function renderShipList() {
      q('#ws-shiplist').innerHTML = shipments.map(function (s, i) {
        return '<div class="ship ' + (i === cur ? 'on' : '') + '" data-i="' + i + '"><div class="row between"><b>' + esc(s.title) + '</b><span class="state">' + pretty(s.state) + '</span></div><span class="m">' + esc(s.id) + ' · ' + esc(s.meta) + '</span></div>';
      }).join('');
      qa('#ws-shiplist .ship').forEach(function (e) { e.onclick = function () { cur = +e.getAttribute('data-i'); renderShipList(); renderShip(); }; });
    }
    function jurBadges(t) {
      var key = OPS_TYPES.indexOf(t) >= 0 ? 'OPS' : t; var m = JMAP[key]; if (!m) return '';
      return JUR.map(function (j) { return '<span class="jur ' + m[j][0] + '" data-j="' + j + '" data-k="' + key + '">' + JLABEL[j] + ': ' + m[j][1] + '</span>'; }).join(' ');
    }
    function renderShip() {
      var s = shipments[cur];
      var acts = ACTIONS[s.state].map(function (a) { return '<option value="' + a[0] + '">' + esc(a[1]) + '</option>'; }).join('');
      q('#ws-shipdetail').innerHTML =
        '<div class="row between"><div><h1 style="margin:0">' + esc(s.title) + '</h1><p class="sub" style="margin:2px 0 0">' + esc(s.id) + ' · ' + esc(s.meta) + '</p></div>' +
        '<div class="row"><select id="ws-act" ' + (acts ? '' : 'disabled') + '><option value="">' + (acts ? 'Choose an action…' : 'No further actions') + '</option>' + acts + '</select><button class="btn" id="ws-actgo" ' + (acts ? '' : 'disabled') + '>Run</button></div></div>' +
        '<div class="row sec"><span class="state">State: ' + pretty(s.state) + '</span><span class="sub" style="margin:0">Controlled by <b>' + esc(s.holder) + '</b> · title document ' + chip(s.tdoc, s.ebl) + '</span></div>' +
        '<div class="sec"><h3>Parties</h3><table><tbody>' + s.parties.map(function (p) { return '<tr><td style="width:38%;color:var(--muted)">' + esc(p[0]) + '</td><td><b>' + esc(p[1]) + '</b></td></tr>'; }).join('') + '</tbody></table></div>' +
        '<div class="sec"><h3>Documents · click for legal status</h3><div class="row">' + s.docs.map(function (d) { return chip(d[0], d[1]); }).join('') + '</div><div class="jurbox" id="ws-jurbox"></div></div>' +
        '<div class="sec"><h3>Timeline</h3><ul class="tl">' + s.tl.slice().reverse().map(function (e) { return '<li><div class="h">' + esc(e[0]) + '</div><div class="m">' + esc(e[1]) + ' · ' + esc(e[2]) + '</div>' + (e[3] ? '<div class="hash">evidence sha-256 ' + e[3] + '</div>' : '') + (e[4] ? '<div style="margin-top:4px">' + anchorHtml(e[4]) + '</div>' : '') + '</li>'; }).join('') + '</ul>' +
        '<p class="sub" style="margin:4px 0 0">Run an action to create an evidence record, then anchor its fingerprint to Bitcoin. Only the hash is sent, never the document.</p></div>';
      qa('#ws-shipdetail .chip').forEach(function (c) { c.onclick = function () { showDoc(c.getAttribute('data-t'), c.getAttribute('data-no')); }; });
      var go = q('#ws-actgo'); if (go) go.onclick = runAction;
      wireAnchors('#ws-shipdetail', renderShip);
    }
    function showDoc(t, no) {
      var box = q('#ws-jurbox'); box.style.display = 'block';
      box.innerHTML = '<div class="row between"><b>' + chip(t, no) + ' ' + esc(TYPE_NAME[t] || t) + '</b><span class="sub" style="margin:0">Illustrative · not legal advice</span></div><div class="row sec" style="margin-top:8px">' + jurBadges(t) + '</div><div id="ws-jurtxt" class="sub" style="margin:8px 0 0">Click a badge for the reasoning.</div>';
      qa('#ws-jurbox .jur').forEach(function (b) { b.onclick = function () { q('#ws-jurtxt').textContent = JMAP[b.getAttribute('data-k')][b.getAttribute('data-j')][2]; }; });
    }
    var execLog = [];
    function findRule(from, to) { for (var i = 0; i < RULES.length; i++) { if (RULES[i][0] === from && RULES[i][1] === to) return i; } return -1; }
    function runAction() {
      var s = shipments[cur], sel = q('#ws-act'), to = sel.value; if (!to) { toast('Choose an action first'); return; }
      var label = sel.options[sel.selectedIndex].textContent;
      var when = new Date().toISOString().slice(0, 16).replace('T', ' ');
      var ri = findRule(s.state, to);
      if (ri < 0) { // the Smart Rulebook refuses transitions it does not define
        execLog.push({ at: when, doc: s.ebl, rule: '—', step: pretty(s.state) + ' → ' + pretty(to), result: 'REJECTED', hash: '' });
        toast('Blocked by Smart Rulebook: no rule allows this step'); return;
      }
      var event = { contract: contractId, rule: 'R' + (ri + 1), shipment: s.id, document: s.ebl, from: s.state, to: to, actor: s.holder, at: when, signature: RULES[ri][3] + ' (simulated)' };
      sha256(JSON.stringify(event)).then(function (h) {
        if (to === 'TRANSFERRED') s.holder = s.holder === 'Global Bank PLC' ? 'Global Imports LLC' : 'Global Bank PLC';
        s.state = to; s.tl.push([label + ' · rule R' + (ri + 1) + ' · ' + RULES[ri][3] + ' (simulated)', event.actor, when, h.slice(0, 32) + '…', h]);
        execLog.push({ at: when, doc: s.ebl, rule: 'R' + (ri + 1), step: pretty(event.from) + ' → ' + pretty(to), result: 'EXECUTED', hash: h });
        return buildSamples().then(function () { registry[s.ebl].last = h; renderShipList(); renderShip(); toast('Executed rule R' + (ri + 1) + '. Evidence hash ' + h.slice(0, 12) + '…'); });
      });
    }

    // ---------------- Bitcoin anchoring via OpenTimestamps (real) ----------------
    // Only the 32-byte SHA-256 digest leaves the browser. No document content, no party data.
    var OTS_CALENDARS = ['https://a.pool.opentimestamps.org', 'https://alice.btc.calendar.opentimestamps.org'];
    var OTS_MAGIC = [0x00, 0x4f, 0x70, 0x65, 0x6e, 0x54, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x73, 0x00, 0x00, 0x50, 0x72, 0x6f, 0x6f, 0x66, 0x00, 0xbf, 0x89, 0xe2, 0xe8, 0x84, 0xe8, 0x92, 0x94];
    var anchors = {}; // hex digest -> {status, url, at}
    function hexToBytes(h) { var a = new Uint8Array(h.length / 2); for (var i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16); return a; }
    function anchor(hex, label) {
      if (anchors[hex] && anchors[hex].status === 'submitted') return Promise.resolve(anchors[hex]);
      anchors[hex] = { status: 'pending' };
      var digest = hexToBytes(hex);
      var calls = OTS_CALENDARS.map(function (u) {
        return fetch(u + '/digest', { method: 'POST', headers: { 'Accept': 'application/vnd.opentimestamps.v1' }, body: digest })
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
          .then(function (b) { return new Uint8Array(b); }, function () { return null; });
      });
      return Promise.all(calls).then(function (res) {
        var ok = res.filter(function (x) { return x && x.length; });
        if (!ok.length) { anchors[hex] = { status: 'failed' }; return anchors[hex]; }
        var parts = [new Uint8Array(OTS_MAGIC), new Uint8Array([0x01, 0x08]), digest];
        ok.forEach(function (r, i) { if (i < ok.length - 1) parts.push(new Uint8Array([0xff])); parts.push(r); });
        var url = URL.createObjectURL(new Blob(parts, { type: 'application/octet-stream' }));
        anchors[hex] = { status: 'submitted', url: url, n: ok.length, at: new Date().toISOString().slice(0, 16).replace('T', ' '), name: (label || hex.slice(0, 12)) + '.ots' };
        return anchors[hex];
      });
    }
    function anchorHtml(hex) {
      var a = anchors[hex];
      if (!a) return '<button class="btn ghost ws-anc" data-h="' + hex + '" style="padding:4px 8px;font-size:11px">⚓ Anchor to Bitcoin</button>';
      if (a.status === 'pending') return '<span class="sub" style="margin:0">⏳ Sending to OpenTimestamps calendars…</span>';
      if (a.status === 'failed') return '<span class="sub" style="margin:0;color:#b91c1c">Calendars unreachable; not anchored.</span> <button class="btn ghost ws-anc" data-h="' + hex + '" style="padding:4px 8px;font-size:11px">Retry</button>';
      return '<span class="sub" style="margin:0;color:#065f46">⚓ Submitted to ' + a.n + ' Bitcoin calendar(s) · ' + a.at + ' · Bitcoin confirmation usually within hours.</span> <a class="btn ghost" style="padding:4px 8px;font-size:11px" href="' + a.url + '" download="' + esc(a.name) + '">⬇ .ots proof</a> <a href="https://opentimestamps.org" target="_blank" rel="noopener" style="font-size:11px">verify at opentimestamps.org</a>';
    }
    function wireAnchors(scope, rerender) {
      qa(scope + ' .ws-anc').forEach(function (b) {
        b.onclick = function () { var h = b.getAttribute('data-h'); anchors[h] = { status: 'pending' }; rerender(); anchor(h).then(function () { rerender(); }); };
      });
    }

    // ---------------- envelopes ----------------
    var box = 'inbox';
    function renderEnv() {
      var boxes = ['inbox', 'sent', 'drafts', 'archive'];
      q('#ws-envtabs').innerHTML = boxes.map(function (b) { return '<button class="' + (b === box ? 'on' : '') + '" data-b="' + b + '">' + pretty(b) + ' (' + envelopes.filter(function (e) { return e.box === b; }).length + ')</button>'; }).join('');
      qa('#ws-envtabs button').forEach(function (x) { x.onclick = function () { box = x.getAttribute('data-b'); renderEnv(); }; });
      var ty = q('#ws-envtype').value, qq = q('#ws-envq').value.toLowerCase();
      var rows = envelopes.filter(function (e) { return e.box === box && (!ty || e.att.indexOf(ty) >= 0) && (!qq || JSON.stringify(e).toLowerCase().indexOf(qq) >= 0); });
      var cls = { Received: 'p-rec', 'In progress': 'p-prog', Done: 'p-done', Draft: 'p-draft' };
      q('#ws-envbody').innerHTML = rows.length ? rows.map(function (e) {
        return '<tr><td><b>' + esc(e.from) + '</b><br><span class="sub">→ ' + esc(e.to) + '</span></td><td>' + esc(e.subj) + '</td><td><div class="row">' + e.att.map(function (a) { return '<span class="chip"><span class="t t-' + a + '">' + a + '</span></span>'; }).join('') + '</div></td><td><span class="pill ' + cls[e.st] + '">' + e.st + '</span></td><td>' + e.d + '</td></tr>';
      }).join('') : '<tr><td colspan="5" class="sub">No envelopes.</td></tr>';
    }
    q('#ws-envtype').innerHTML = '<option value="">All document types</option>' + Object.keys(TYPE_NAME).map(function (t) { return '<option value="' + t + '">' + t + ' · ' + TYPE_NAME[t] + '</option>'; }).join('');
    q('#ws-envtype').onchange = renderEnv; q('#ws-envq').oninput = renderEnv;

    // ---------------- rulebook ----------------
    function renderRule() {
      var sel = q('#ws-rulefor');
      if (!sel.options.length) { sel.innerHTML = shipments.map(function (s, i) { return '<option value="' + i + '">' + esc(s.ebl) + ' · ' + esc(s.title) + '</option>'; }).join(''); sel.onchange = renderRule; }
      var st = shipments[+sel.value || 0].state;
      var P = { DRAFT: [20, 110], ISSUED: [190, 110], TRANSFERRED: [360, 110], SURRENDER_REQUESTED: [540, 110], DELIVERED: [730, 110], AMEND_REQUESTED: [190, 220], SWITCHED_TO_PAPER: [450, 220], VOID: [20, 220] };
      var W = 150, H = 44;
      function arrow(a, b) {
        var p1 = P[a], p2 = P[b], x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1];
        if (a === b) return '<path d="M' + (x1 + W - 20) + ' ' + y1 + ' C ' + (x1 + W + 10) + ' ' + (y1 - 40) + ', ' + (x1 + 20) + ' ' + (y1 - 40) + ', ' + (x1 + 30) + ' ' + y1 + '" fill="none" stroke="#94a3b8" stroke-width="1.6" marker-end="url(#ws-ar)"/>';
        var sx = x1 + W / 2, sy = y1 + H / 2, ex = x2 + W / 2, ey = y2 + H / 2;
        if (y1 === y2) { sx = x1 + W; ex = x2; } else if (y2 > y1) { sy = y1 + H; ey = y2; } else { sy = y1; ey = y2 + H; }
        return '<line x1="' + sx + '" y1="' + sy + '" x2="' + ex + '" y2="' + ey + '" stroke="#94a3b8" stroke-width="1.6" marker-end="url(#ws-ar)"/>';
      }
      var svg = '<svg viewBox="0 0 900 290" width="900" height="290" role="img" aria-label="eBL state machine"><defs><marker id="ws-ar" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 z" fill="#94a3b8"/></marker></defs>';
      RULES.forEach(function (r) { svg += arrow(r[0], r[1]); });
      STATES.forEach(function (k) { var x = P[k][0], y = P[k][1], on = k === st; svg += '<rect x="' + x + '" y="' + y + '" width="' + W + '" height="' + H + '" rx="10" fill="' + (on ? '#0A2540' : '#fff') + '" stroke="' + (on ? '#0A2540' : '#cbd5e1') + '" stroke-width="1.5"/><text x="' + (x + W / 2) + '" y="' + (y + 27) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + (on ? '#fff' : '#0F172A') + '">' + pretty(k) + '</text>'; });
      svg += '<text x="20" y="30" font-size="12" fill="#64748B">Current state of the selected document is filled. Each arrow = one signed transition.</text></svg>';
      q('#ws-rulesvg').innerHTML = svg;
      q('#ws-rulebody').innerHTML = RULES.map(function (r, i) { return '<tr' + (r[0] === st ? ' style="background:#f0f9ff"' : '') + '><td><b>R' + (i + 1) + '</b></td><td><b>' + pretty(r[0]) + '</b> → ' + pretty(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td><td>' + esc(r[4]) + '</td><td>' + esc(r[5]) + '</td><td>' + esc(r[6]) + '</td></tr>'; }).join('');
      q('#ws-spec').textContent = contractSpec;
      q('#ws-cid').textContent = 'contract id (sha-256) ' + (contractId || '…');
      if (contractId) { q('#ws-canc').innerHTML = anchorHtml(contractId); wireAnchors('#ws-canc', renderRule); }
      q('#ws-exec').innerHTML = execLog.length ? execLog.slice().reverse().map(function (e) {
        return '<tr><td>' + e.at + '</td><td>' + esc(e.doc) + '</td><td><b>' + e.rule + '</b></td><td>' + esc(e.step) + '</td><td><span class="pill ' + (e.result === 'EXECUTED' ? 'p-done' : 'p-prog') + '">' + e.result + '</span></td><td class="hash">' + (e.hash ? e.hash.slice(0, 24) + '…' : '—') + '</td></tr>';
      }).join('') : '<tr><td colspan="6" class="sub">No executions yet.</td></tr>';
    }
    // machine-readable contract definition (its hash is the contract id)
    var contractSpec = JSON.stringify({
      contract: 'maresign.ebl-rulebook', version: '0.2.0', mode: 'simulation',
      legalBasis: ['UNCITRAL MLETR', 'UN Convention on Negotiable Cargo Documents', 'UK Electronic Trade Documents Act 2023', 'Law No. 5070 (TR e-signature)', 'HMK m.205/2'],
      states: STATES,
      rules: RULES.map(function (r, i) { return { id: 'R' + (i + 1), from: r[0], to: r[1], actor: r[2], signature: r[3], mletr: r[4], ncd: r[5], ukEtda2023: r[6] }; }),
      default: 'deny'
    }, null, 2);
    var contractId = '';
    sha256(contractSpec).then(function (h) { contractId = h; });

    // ---------------- public verification ----------------
    var registry = {}, hashIndex = {}, urls = [];
    function buildSamples() {
      var wrap = q('#ws-samples'); wrap.innerHTML = '';
      urls.forEach(function (u) { URL.revokeObjectURL(u); }); urls = [];
      return shipments.reduce(function (p, s) {
        return p.then(function () {
          var pkg = JSON.stringify({ package: 'maresign-evidence/0.1', document: s.ebl, type: s.tdoc, shipment: s.id, state: s.state, controlledBy: s.holder, events: s.tl.map(function (e) { return { event: e[0], by: e[1], at: e[2] }; }), signature: 'QES (simulated)', note: 'Simulation sample' }, null, 2);
          return sha256(pkg).then(function (h) {
            var rec = { doc: s.ebl, shipment: s.id, state: s.state, last: h };
            registry[s.ebl] = rec; hashIndex[h] = rec;
            var a = document.createElement('a'); a.className = 'btn ghost'; a.textContent = '⬇ ' + s.ebl + '.json';
            var u = URL.createObjectURL(new Blob([pkg], { type: 'application/json' })); urls.push(u);
            a.href = u; a.download = s.ebl + '.json'; wrap.appendChild(a);
          });
        });
      }, Promise.resolve());
    }
    function showRes(ok, html) { var r = q('#ws-vres'); r.className = 'res ' + (ok ? 'ok' : 'bad'); r.innerHTML = html; }
    q('#ws-vfile').onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      f.text().then(function (txt) { return sha256(txt); }).then(function (h) {
        var rec = hashIndex[h];
        var renderAnc = function () { var el = q('#ws-vanc'); if (el) { el.innerHTML = anchorHtml(h); wireAnchors('#ws-vanc', renderAnc); } };
        setTimeout(function () { q('#ws-vres').insertAdjacentHTML('beforeend', '<div id="ws-vanc" style="margin-top:8px"></div>'); renderAnc(); }, 0);
        if (rec) showRes(true, '<b>✓ Match.</b> This package is identical to the registered record for <b>' + esc(rec.doc) + '</b> (' + esc(rec.shipment) + ').<div class="hash">sha-256 ' + h + '</div>');
        else showRes(false, '<b>✗ No match.</b> No registered package has this fingerprint. The file may have been altered, or it was never registered.<div class="hash">sha-256 ' + h + '</div>');
      });
    };
    q('#ws-vbtn').onclick = function () {
      var n = q('#ws-vno').value.trim().toUpperCase(), rec = registry[n];
      if (rec) showRes(true, '<b>✓ Registered.</b> ' + esc(rec.doc) + ' · shipment ' + esc(rec.shipment) + ' · state <b>' + pretty(rec.state) + '</b><div class="hash">last evidence sha-256 ' + rec.last + '</div>');
      else showRes(false, '<b>✗ Not found.</b> No document with this number in the (simulated) registry.');
    };

    // ---------------- init ----------------
    renderShipList(); renderShip(); renderEnv(); buildSamples();
  } catch (err) {
    // Never break the host page.
    if (window.console) console.warn('[workspace.js] disabled:', err);
  }
})();
