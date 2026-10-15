/* =====================================================================
   extras.js: Đánh dấu "đã ôn tập" + Tìm kiếm trong các bài
   (được classes.js tự nạp, không cần sửa file này)
   ===================================================================== */
(function () {
  'use strict';
  if (typeof SN === 'undefined' || typeof SN_FILES === 'undefined') return;
  var me = document.currentScript;
  var cj = document.querySelector('script[src*="classes.js"]');
  var BASE = me && me.src ? me.src.replace(/extras\.js(\?.*)?$/, '') : (cj ? cj.src.replace(/classes\.js(\?.*)?$/, '') : '');
  var KEY = (window.SN_PREFIX || 'sn') + '.done';

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function isDone(id) { return !!load()[id]; }
  function setDone(id, v) { var o = load(); if (v) o[id] = Date.now(); else delete o[id]; save(o); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fold(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/\s+/g, ' ');
  }

  var css = document.createElement('style');
  css.textContent =
    '.sn-mark{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:28px 0 8px;padding:18px 20px;border-radius:14px;background:var(--card,#fff);border:1.5px solid var(--line,#e2ddd2);}' +
    '.sn-mark p{margin:0;flex:1;min-width:200px;color:var(--dim,#666e7a);}' +
    '.sn-btn{font:inherit;font-weight:700;font-size:16px;padding:11px 18px;border-radius:10px;cursor:pointer;border:1.5px solid var(--amber,#a8691a);background:var(--card,#fff);color:var(--amber-ink,#6b4410);}' +
    '.sn-btn.on{background:#1f7a4d;border-color:#1f7a4d;color:#fff;}' +
    '.sn-btn:focus-visible,.sn-search input:focus-visible{outline:3px solid var(--amber,#a8691a);outline-offset:2px;}' +
    '.sn-pill{display:inline-block;margin:4px 0 0;padding:4px 12px;border-radius:999px;font-size:14px;font-weight:700;cursor:pointer;border:0;font-family:inherit;background:#e7efe9;color:#1f5c3d;}' +
    '.sn-pill.off{background:#f1ede4;color:var(--dim,#666e7a);}' +
    '.stop.sn-done .dot{box-shadow:0 0 0 3px #1f7a4d;}' +
    '.stop .sn-ck{display:none;margin-left:8px;font-size:13px;font-weight:700;color:#1f7a4d;white-space:nowrap;}' +
    '.stop.sn-done .sn-ck{display:inline;}' +
    '.sn-mine{margin:10px 0 0;font-size:15px;color:var(--dim,#666e7a);}' +
    '.sn-mine b{color:#1f7a4d;}' +
    '.sn-search{margin:22px 0 6px;}' +
    'body.gated .sn-search,body.gated .sn-mine{display:none;}' +
    '.sn-search label{display:block;font-weight:700;margin:0 0 6px;}' +
    '.sn-search input{width:100%;box-sizing:border-box;font:inherit;font-size:17px;padding:12px 14px;border-radius:12px;border:1.5px solid var(--line,#d9d4c7);background:var(--card,#fff);color:inherit;}' +
    '.sn-res{list-style:none;margin:8px 0 0;padding:0;}' +
    '.sn-res li{margin:0 0 8px;}' +
    '.sn-res a{display:block;padding:12px 14px;border-radius:12px;background:var(--card,#fff);border:1px solid var(--line,#e2ddd2);text-decoration:none;color:inherit;}' +
    '.sn-res a:hover{border-color:var(--amber,#a8691a);}' +
    '.sn-res small{display:block;color:var(--amber-ink,#6b4410);font-weight:700;font-size:13px;}' +
    '.sn-res b.h{display:block;margin:2px 0;}' +
    '.sn-res span{display:block;color:var(--dim,#666e7a);font-size:15px;}' +
    '.sn-res mark{background:#ffe6a8;color:inherit;padding:0 1px;border-radius:3px;}' +
    '.sn-note{color:var(--dim,#666e7a);font-size:15px;margin:8px 2px;}' +
    '.doc h2.sn-hit,.doc h3.sn-hit{background:#fff4d6;border-radius:6px;}' +
    '.doc h2,.doc h3{scroll-margin-top:16px;}' +
    '.sn-toc{margin:14px 0 6px;padding:12px 16px;border-radius:12px;background:var(--card,#fff);border:1px solid var(--line,#e2ddd2);}' +
    '.sn-toc summary{cursor:pointer;font-weight:700;}' +
    '.sn-toc ol{margin:10px 0 0;padding-left:4px;list-style:none;}' +
    '.sn-toc li{margin:6px 0;}' +
    '.sn-toc li.h3{margin-left:18px;font-size:15px;}' +
    '.sn-toc a{color:var(--amber-ink,#6b4410);}' +
    '.sn-top{position:fixed;right:16px;bottom:16px;z-index:50;font:inherit;font-weight:700;font-size:15px;padding:10px 16px;border-radius:999px;border:0;background:var(--amber,#a8691a);color:#fff;box-shadow:0 4px 14px rgba(0,0,0,.18);cursor:pointer;opacity:0;pointer-events:none;transition:opacity .2s;}' +
    '.sn-top.show{opacity:1;pointer-events:auto;}' +
    '.sn-new{display:inline-block;margin-right:8px;padding:1px 9px;border-radius:999px;background:#c2410c;color:#fff;font-size:12px;font-weight:700;vertical-align:2px;}';
  document.head.appendChild(css);

  function rel() {
    var u = location.href.split('#')[0].split('?')[0];
    return BASE && u.indexOf(BASE) === 0 ? decodeURIComponent(u.slice(BASE.length)) : '';
  }

  /* ---------- trang bài học ---------- */
  function unitPage(id) {
    if (document.documentElement.classList.contains('sn-lock')) return;
    var doc = document.querySelector('.doc'), main = document.querySelector('main');
    if (!main) return;
    if (doc) [].forEach.call(doc.querySelectorAll('h2,h3'), function (h, i) { if (!h.id) h.id = 'sn-h' + i; });
    var h1 = main.querySelector('h1');
    var pill = document.createElement('button'); pill.type = 'button'; pill.className = 'sn-pill';
    var card = document.createElement('div'); card.className = 'sn-mark';
    card.innerHTML = '<p>Ôn xong bài này rồi? Đánh dấu để theo dõi bài nào mình đã ôn (chỉ lưu trên máy của bạn).</p>';
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'sn-btn';
    card.appendChild(btn);
    function paint() {
      var d = isDone(id);
      btn.classList.toggle('on', d); btn.setAttribute('aria-pressed', d ? 'true' : 'false');
      btn.textContent = d ? '✓ Đã ôn tập bài này' : 'Đánh dấu đã ôn tập';
      pill.classList.toggle('off', !d);
      pill.textContent = d ? '✓ Đã ôn tập' : 'Chưa ôn tập';
    }
    function toggle() { setDone(id, !isDone(id)); paint(); }
    btn.onclick = toggle; pill.onclick = toggle;
    if (h1) h1.insertAdjacentElement('afterend', pill);
    main.appendChild(card);
    paint();
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) { t.classList.add('sn-hit'); } }
    /* mục lục + nút lên đầu */
    var hs = doc ? [].slice.call(doc.querySelectorAll('h2,h3')) : [];
    if (hs.length > 2) {
      var toc = document.createElement('details'); toc.className = 'sn-toc';
      toc.innerHTML = '<summary>Mục lục bài (' + hs.filter(function (h) { return h.tagName === 'H2'; }).length + ' phần)</summary><ol>' +
        hs.map(function (h) { return '<li class="' + h.tagName.toLowerCase() + '"><a href="#' + h.id + '">' + esc(h.textContent.trim()) + '</a></li>'; }).join('') + '</ol>';
      if (h1) pill.insertAdjacentElement('afterend', toc); else main.insertBefore(toc, main.firstChild);
    }
    var up = document.createElement('button'); up.type = 'button'; up.className = 'sn-top'; up.textContent = '↑ Lên đầu';
    up.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    document.body.appendChild(up);
    function onScroll() { up.classList.toggle('show', window.scrollY > 600); }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ---------- trang chủ ---------- */
  function homePage() {
    var stops = [].slice.call(document.querySelectorAll('.stop[data-id]'));
    if (!stops.length) return;
    stops.forEach(function (s) {
      var n = s.querySelector('.name');
      if (n && !s.querySelector('.sn-ck')) { var ck = document.createElement('span'); ck.className = 'sn-ck'; ck.textContent = '✓ Đã ôn'; n.appendChild(ck); }
    });
    var mine = document.createElement('p'); mine.className = 'sn-mine';
    var bar = document.getElementById('lopbar');
    if (bar) bar.insertAdjacentElement('afterend', mine);
    function curClass() {
      var x = new URLSearchParams(location.search).get('xem');
      if (x !== null && SN.find) { var f = SN.find(x); if (f) return f; }
      return SN.current ? SN.current() : null;
    }
    function paintNew() {
      var c = curClass(), now = new Date();
      stops.forEach(function (s) {
        var b = s.querySelector('.sn-new'), isNew = false;
        if (c && !s.classList.contains('locked') && SN.openDate) {
          var d = SN.openDate(c, s.dataset.id);
          if (d) { var o = new Date(d), e = typeof snEndHM === 'function' ? snEndHM(c) : [0, 0]; o.setHours(e[0], e[1], 0, 0); isNew = now >= o && now - o < 3 * 864e5; }
        }
        if (isNew && !b) { b = document.createElement('span'); b.className = 'sn-new'; b.textContent = 'Mới'; var n = s.querySelector('.name'); if (n) n.insertBefore(b, n.firstChild); }
        if (!isNew && b) b.parentNode.removeChild(b);
      });
    }
    function paintDone() {
      var o = load(), open = 0, done = 0;
      stops.forEach(function (s) {
        var d = !!o[s.dataset.id], isOpen = !s.classList.contains('locked');
        s.classList.toggle('sn-done', d && isOpen);
        if (isOpen) { open++; if (d) done++; }
      });
      mine.innerHTML = open ? 'Bạn đã ôn tập <b>' + done + '/' + open + '</b> bài đang mở.' : '';
      paintNew();
    }
    paintDone();
    window.addEventListener('pageshow', paintDone);
    window.addEventListener('storage', paintDone);
    new MutationObserver(paintDone).observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });

    /* tìm kiếm */
    var firstSec = document.querySelector('h2.sec');
    if (!firstSec) return;
    var box = document.createElement('section'); box.className = 'sn-search'; box.setAttribute('role', 'search');
    box.innerHTML = '<label for="snQ">Tìm trong các bài đã mở</label>' +
      '<input id="snQ" type="search" autocomplete="off" placeholder="Ví dụ: bị động, câu hỏi đuôi, passive, hợp đồng…">' +
      '<p class="sn-note" id="snNote" aria-live="polite"></p><ul class="sn-res" id="snRes"></ul>';
    firstSec.parentNode.insertBefore(box, firstSec);
    var input = box.querySelector('#snQ'), list = box.querySelector('#snRes'), note = box.querySelector('#snNote');
    var index = null, loading = null;

    function build() {
      if (loading) return loading;
      var jobs = stops.filter(function (s) { return !s.classList.contains('locked'); }).map(function (s) {
        var a = s.querySelector('a.go'); if (!a) return null;
        var href = a.getAttribute('href'), name = (s.querySelector('.name') || {}).textContent || '';
        var dn = (s.querySelector('.dot b') || {}).textContent || '';
        var id = s.dataset.id, kind = id[0] === 'R' ? 'Reading ' : id[0] === 'L' ? 'Listening ' : 'Weekly Revision ';
        var label = kind + dn + ' · ' + name.replace('✓ Đã ôn', '').replace(/^Mới/, '').trim();
        return fetch(href).then(function (r) { return r.text(); }).then(function (html) {
          var d = new DOMParser().parseFromString(html, 'text/html'), doc = d.querySelector('.doc');
          if (!doc) return [];
          var out = [], cur = { h: label, hid: '', text: '' };
          [].forEach.call(doc.querySelectorAll('h2,h3'), function (h, i) { if (!h.id) h.id = 'sn-h' + i; });
          [].forEach.call(doc.children, function (el) {
            if (/^H[23]$/.test(el.tagName)) {
              if (cur.text || cur.hid) out.push(cur);
              cur = { h: el.textContent.trim(), hid: el.id, text: '' };
            } else cur.text += ' ' + el.textContent.replace(/\s+/g, ' ');
          });
          out.push(cur);
          return out.map(function (x) { return { unit: label, h: x.h, url: href + (x.hid ? '#' + x.hid : ''), text: x.text.trim(), f: fold(x.h + ' ' + x.text) }; });
        }).catch(function () { return []; });
      }).filter(Boolean);
      note.textContent = 'Đang tải các bài…';
      loading = Promise.all(jobs).then(function (parts) { index = [].concat.apply([], parts); note.textContent = ''; return index; });
      return loading;
    }
    function snippet(text, terms) {
      var f = fold(text), pos = -1;
      for (var i = 0; i < terms.length && pos < 0; i++) pos = f.indexOf(terms[i]);
      var start = Math.max(0, pos - 50), s = text.slice(start, start + 170);
      var out = esc((start > 0 ? '…' : '') + s + (start + 170 < text.length ? '…' : ''));
      terms.forEach(function (t) {
        if (!t) return;
        var src = fold(out), i = src.indexOf(t);
        if (i >= 0) out = out.slice(0, i) + '<mark>' + out.slice(i, i + t.length) + '</mark>' + out.slice(i + t.length);
      });
      return out;
    }
    function run() {
      var q = input.value.trim();
      list.innerHTML = '';
      if (q.length < 2) { note.textContent = ''; return; }
      build().then(function (idx) {
        if (input.value.trim() !== q) return;
        var terms = fold(q).split(' ').filter(Boolean);
        var hits = idx.filter(function (x) { return terms.every(function (t) { return x.f.indexOf(t) >= 0; }); });
        hits.sort(function (a, b) {
          var ah = terms.every(function (t) { return fold(a.h).indexOf(t) >= 0; }) ? 0 : 1;
          var bh = terms.every(function (t) { return fold(b.h).indexOf(t) >= 0; }) ? 0 : 1;
          return ah - bh;
        });
        note.textContent = hits.length ? 'Tìm thấy ' + hits.length + ' chỗ' + (hits.length > 20 ? ' (hiện 20 chỗ đầu)' : '') + '.' : 'Không thấy "' + q + '" trong các bài đang mở. Thử từ khác nhé.';
        list.innerHTML = hits.slice(0, 20).map(function (x) {
          return '<li><a href="' + esc(x.url) + '"><small>' + esc(x.unit) + '</small><b class="h">' + esc(x.h) + '</b><span>' + snippet(x.text || x.h, terms) + '</span></a></li>';
        }).join('');
      });
    }
    var tmr;
    input.addEventListener('focus', function () { build(); }, { once: true });
    input.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(run, 220); });
  }

  function start() {
    var r = rel();
    if (SN_FILES[r]) unitPage(SN_FILES[r]);
    else if (r === '' || r === 'index.html') homePage();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
