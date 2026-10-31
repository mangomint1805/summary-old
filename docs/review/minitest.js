/* Trang chữa bài Minitest: vẽ nội dung từ window.MT (dữ liệu nằm trong từng trang minitest-N.html).
   Học viên chọn đáp án → hiện đúng/sai, dịch, giải thích. Bài làm lưu trên máy (khoá <SN_PREFIX>.mtN, tự đồng bộ khi đăng nhập). */
(function () {
  'use strict';
  var M = window.MT, root = document.getElementById('mt');
  if (!M || !root) return;
  var L = 'ABCD', KEY = (window.SN_PREFIX || 'summaryOld') + '.mt' + M.n;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // **đậm** và (32) trong lời thoại
  function fmt(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/&lt;(\/?)(b|i|u|br)&gt;/g, '<$1$2>'); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(ans)); } catch (e) {} }
  var ans = load(), Q = [];
  M.groups.forEach(function (g) { g.qs.forEach(function (q) { q.g = g; Q.push(q); }); });

  var css = document.createElement('style');
  css.textContent = [
    '#mt [hidden]{display:none!important}',
    '.mt-hero{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:14px 0}',
    '.mt-hero div{background:var(--card,#fff);border:1px solid var(--line);border-radius:12px;padding:12px 14px}',
    '.mt-hero b{display:block;font-size:24px;font-family:Fraunces,Georgia,serif;font-weight:600;color:var(--amber-ink)}',
    '.mt-hero small{color:var(--dim);font-size:13.5px}',
    '.mt-bars{margin:8px 0 4px;display:grid;gap:6px}',
    '.mt-bar{display:grid;grid-template-columns:62px 1fr 92px;align-items:center;gap:8px;font-size:13.5px}',
    '.mt-bar i{display:block;height:10px;border-radius:99px;background:var(--line);overflow:hidden}',
    '.mt-bar i span{display:block;height:100%;background:var(--teal,#1f7a6d);border-radius:99px}',
    '.mt-bar.low i span{background:#c0533a}',
    '.mt-steps{counter-reset:s;list-style:none;padding:0;margin:10px 0;display:grid;gap:8px}',
    '.mt-steps li{position:relative;padding:10px 12px 10px 46px;background:var(--card,#fff);border:1px solid var(--line);border-radius:12px}',
    '.mt-steps li::before{counter-increment:s;content:counter(s);position:absolute;left:12px;top:10px;width:24px;height:24px;border-radius:50%;background:var(--amber);color:#fff;font-weight:700;display:grid;place-items:center;font-size:13px}',
    '.mt-score{position:sticky;top:64px;z-index:5;display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;justify-content:space-between;margin:18px 0 6px;padding:10px 14px;background:var(--card,#fff);border:1.5px solid var(--amber);border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,.06);font-size:15px}',
    '.mt-score button{font:inherit;font-size:13.5px;font-weight:600;border:1px solid var(--line);background:var(--paper);border-radius:8px;padding:5px 10px;cursor:pointer;color:var(--ink)}',
    '.mt-g{margin:26px 0 0;padding:16px 16px 6px;background:var(--card,#fff);border:1px solid var(--line);border-radius:16px}',
    '.mt-g>h2{margin:0 0 8px!important;font-size:21px!important}',
    '.mt-tag{display:inline-block;font-size:12px;font-weight:700;border-radius:99px;padding:2px 9px;background:var(--amber-soft);color:var(--amber-ink);margin-left:6px;vertical-align:3px;font-family:inherit}',
    '.mt-g audio{width:100%;margin:6px 0 8px}',
    '.mt-g .mt-img{display:block;max-width:100%;border-radius:10px;border:1px solid var(--line);margin:6px auto 10px;cursor:zoom-in}',
    '.mt-g details.mt-sc{margin:6px 0 10px;border:1px dashed var(--line);border-radius:10px;padding:8px 12px;background:var(--paper)}',
    '.mt-g details.mt-sc summary{cursor:pointer;font-weight:700;color:var(--amber-ink)}',
    '.mt-sc p{margin:8px 0!important;line-height:1.55}',
    '.mt-sc .sp{display:inline-block;min-width:30px;font-weight:700;color:var(--amber-ink)}',
    '.mt-sc .vi{display:block;color:var(--dim);font-size:14px;margin-top:2px}',
    '.mt-sc .qn,.mt-pass .qn{display:inline-block;font-size:11.5px;font-weight:700;background:var(--amber);color:#fff;border-radius:6px;padding:0 5px;margin:0 2px;vertical-align:1px}',
    '.mt-pass{background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:10px 14px;margin:6px 0 10px;line-height:1.65}',
    '.mt-pass p{margin:6px 0!important}',
    '.mt-pass .bl{display:inline-block;min-width:70px;border-bottom:2px solid var(--amber);text-align:center;font-weight:700;color:var(--amber-ink)}',
    '.mt-q{border-top:1px solid var(--line);padding:12px 0 10px}',
    '.mt-q:first-of-type{border-top:0}',
    '.mt-qh{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 10px}',
    '.mt-qh b{font-size:15px;color:var(--amber-ink)}',
    '.mt-qh .st{font-size:12.5px;font-weight:700;border-radius:99px;padding:1px 9px;background:#efece5;color:var(--dim)}',
    '.mt-qh .st.low{background:#fbe4dc;color:#9a3d12}',
    '.mt-stem{font-weight:600;margin:4px 0 2px!important;font-size:16px}',
    '.mt-qvi{color:var(--dim);font-size:14px;margin:0 0 6px!important}',
    '.mt-opts{display:grid;gap:6px;margin:8px 0}',
    '.mt-opt{display:flex;gap:10px;align-items:flex-start;text-align:left;font:inherit;font-size:15px;padding:9px 12px;border:1.5px solid var(--line);border-radius:10px;background:var(--paper);color:var(--ink);cursor:pointer;line-height:1.45}',
    '.mt-opt:hover:not([disabled]){border-color:var(--amber)}',
    '.mt-opt .l{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-weight:700;background:var(--card,#fff);border:1px solid var(--line);font-size:13.5px}',
    '.mt-opt .t{flex:1;min-width:0}',
    '.mt-opt .t small{display:block;color:var(--dim);font-size:13.5px;margin-top:1px}',
    '.mt-opt .n{flex:none;font-size:12.5px;color:var(--dim);white-space:nowrap;padding-top:3px}',
    '.mt-opt[disabled]{cursor:default}',
    '.mt-opt.ok{border-color:#1f7a4d;background:#e8f5ee}.mt-opt.ok .l{background:#1f7a4d;color:#fff;border-color:#1f7a4d}',
    '.mt-opt.bad{border-color:#c0533a;background:#fbece7}.mt-opt.bad .l{background:#c0533a;color:#fff;border-color:#c0533a}',
    '.mt-opt.dim{opacity:.75}',
    '.mt-skip{font:inherit;font-size:13.5px;border:0;background:none;color:var(--dim);text-decoration:underline;cursor:pointer;padding:2px 0}',
    '.mt-ex{display:none;margin:8px 0 2px;padding:10px 14px;border-radius:10px;background:var(--amber-soft);border-left:4px solid var(--amber)}',
    '.mt-q.done .mt-ex{display:block}.mt-q.done .mt-skip{display:none}',
    '.mt-ex p{margin:5px 0!important}',
    '.mt-ex .k{font-weight:700}',
    '.mt-end{margin:28px 0 0;padding:18px;border:1.5px solid var(--amber);border-radius:16px;background:var(--card,#fff);text-align:center}',
    '.mt-end b{font-size:22px}',
    'html[data-theme=dark] .mt-opt.ok{background:#16301f}html[data-theme=dark] .mt-opt.bad{background:#3a1f19}',
    'html[data-theme=dark] .mt-qh .st{background:#2a2e36}html[data-theme=dark] .mt-qh .st.low{background:#3a2419;color:#f3b08e}',
    '@media (max-width:480px){.mt-g{padding:14px 12px 4px}.mt-score{top:56px}.mt-bar{grid-template-columns:52px 1fr 80px}}'
  ].join('\n');
  document.head.appendChild(css);

  var h = '';
  if (M.intro) h += '<p>' + M.intro + '</p>';
  if (M.stats) {
    var S = M.stats;
    h += '<h2>Kết quả của lớp ' + esc(S.lop) + '</h2><div class="mt-hero"><div><b>' + esc(S.avg) + '</b><small>Điểm trung bình</small></div><div><b>' + esc(S.max) + '</b><small>Cao nhất</small></div><div><b>' + esc(S.n) + ' bạn</b><small>' + esc(S.note || '') + '</small></div></div>';
    if (S.groups) h += '<p class="mt-qvi">Tỉ lệ đúng theo từng ' + esc(S.unit || 'nhóm câu') + ':</p><div class="mt-bars">' + S.groups.map(function (x) {
      return '<div class="mt-bar' + (x[1] < 45 ? ' low' : '') + '"><span>' + esc(x[0]) + '</span><i><span style="width:' + x[1] + '%"></span></i><span>' + x[1] + '%' + (x[2] ? ' · ' + esc(x[2]) : '') + '</span></div>';
    }).join('') + '</div>';
  }
  if (M.steps) h += '<h2>' + esc(M.stepsTitle || 'Cách làm') + '</h2><ol class="mt-steps">' + M.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>';
  h += '<div class="mt-score" id="mtScore"></div>';

  M.groups.forEach(function (g, gi) {
    h += '<section class="mt-g" id="g' + gi + '"><h2>' + esc(g.title) + (g.tag ? '<span class="mt-tag">' + esc(g.tag) + '</span>' : '') + '</h2>';
    if (g.audio) h += '<audio controls preload="none" src="' + esc(g.audio) + '"></audio>';
    (g.imgs || []).forEach(function (src) { h += '<a href="' + esc(src) + '" target="_blank" rel="noopener"><img class="mt-img" loading="lazy" src="' + esc(src) + '" alt="' + esc(g.title) + '"></a>'; });
    if (g.passage) h += '<div class="mt-pass">' + g.passage.map(function (p) {
      return '<p>' + fmt(p).replace(/⟦(\d+)⟧/g, '<span class="bl">(' + '$1' + ')</span>') + '</p>';
    }).join('') + '</div>';
    if (g.script && g.script.length) {
      h += '<details class="mt-sc"' + (g.openScript ? ' open' : '') + '><summary>' + esc(g.scriptLabel || '📜 Lời thoại + dịch (mở sau khi đã nghe)') + '</summary>' + g.script.map(function (l) {
        return '<p>' + (l.sp ? '<span class="sp">' + esc(l.sp) + '</span> ' : '') + fmt(l.t).replace(/\((\d{1,3})\)/g, '<span class="qn">$1</span>') + (l.vi ? '<span class="vi">' + esc(l.vi) + '</span>' : '') + '</p>';
      }).join('') + '</details>';
    }
    g.qs.forEach(function (q) {
      var acc = q.ans.join(''), stat = '';
      if (q.cls) { var tot = 0, ok = 0; L.split('').forEach(function (c) { if (q.cls[c] != null) { tot += q.cls[c]; if (acc.indexOf(c) >= 0) ok += q.cls[c]; } }); stat = '<span class="st' + (ok / tot < 0.4 ? ' low' : '') + '">Lớp đúng ' + ok + '/' + (q.of || tot) + '</span>'; }
      h += '<div class="mt-q" id="q' + q.n + '" data-n="' + q.n + '"><div class="mt-qh"><b>Câu ' + q.n + '</b>' + stat + '</div>';
      if (q.q) h += '<p class="mt-stem">' + fmt(q.q) + '</p>';
      if (q.qvi) h += '<p class="mt-qvi"' + (M.qviAfter ? ' hidden' : '') + '>' + esc(q.qvi) + '</p>';
      h += '<div class="mt-opts">' + q.opts.map(function (o, i) {
        var c = L[i];
        return '<button type="button" class="mt-opt" data-c="' + c + '"><span class="l">' + c + '</span><span class="t">' +
          (M.hideOpts ? '<span class="h">' + (M.hideHint || 'Nghe rồi chọn') + '</span><span class="sh" hidden>' + fmt(o.t) + '</span>' : fmt(o.t)) +
          (o.vi ? '<small hidden>' + esc(o.vi) + '</small>' : '') + '</span>' + (q.cls && q.cls[c] != null ? '<span class="n" hidden>' + q.cls[c] + ' bạn</span>' : '') + '</button>';
      }).join('') + '</div><button type="button" class="mt-skip">Chưa chắc? Xem đáp án luôn</button>';
      h += '<div class="mt-ex"><p class="k">✓ Đáp án: ' + q.ans.map(function (c) { var o = q.opts[L.indexOf(c)]; return '(' + c + ') ' + fmt(o ? o.t : ''); }).join(' hoặc ') + '</p>' +
        (q.key ? '<p>🔑 ' + fmt(q.key) + '</p>' : '') + (q.ex ? '<p>' + fmt(q.ex) + '</p>' : '') + '</div></div>';
    });
    h += '</section>';
  });
  if (M.recap) h += M.recap;
  h += '<div class="mt-end" id="mtEnd" hidden></div>';
  root.innerHTML = h;

  function show(q, pick) {
    var el = document.getElementById('q' + q.n); if (!el) return;
    el.classList.add('done');
    var qv = el.querySelector('.mt-qvi'); if (qv) qv.hidden = false;
    [].forEach.call(el.querySelectorAll('.mt-opt'), function (b) {
      var c = b.dataset.c, right = q.ans.indexOf(c) >= 0;
      b.disabled = true;
      b.classList.toggle('ok', right); b.classList.toggle('bad', !right && c === pick); b.classList.toggle('dim', !right && c !== pick);
      [].forEach.call(b.querySelectorAll('small,.n,.sh'), function (x) { x.hidden = false; });
      var hh = b.querySelector('.h'); if (hh) hh.hidden = true;
    });
  }
  function score() {
    var done = 0, ok = 0;
    Q.forEach(function (q) { var a = ans[q.n]; if (a) { done++; if (q.ans.indexOf(a) >= 0) ok++; } });
    document.getElementById('mtScore').innerHTML = '<span>Đã làm <b>' + done + '/' + Q.length + '</b> câu · đúng <b>' + ok + '</b></span><button type="button" id="mtReset">↺ Làm lại từ đầu</button>';
    document.getElementById('mtReset').onclick = function () { if (!confirm('Xoá các câu đã chọn để làm lại?')) return; ans = {}; save(); location.reload(); };
    var end = document.getElementById('mtEnd');
    if (done === Q.length) {
      var r = ok / Q.length;
      end.hidden = false;
      end.innerHTML = '<div style="font-size:40px">' + (r >= .8 ? '🎉' : r >= .5 ? '👍' : '💪') + '</div><b>Bạn đúng ' + ok + '/' + Q.length + ' câu</b><p>' +
        (r >= .8 ? 'Rất tốt! Ghi lại các cặp từ "nói lại ý" ở trên vào vở nhé.' : r >= .5 ? 'Khá lắm! Đọc lại giải thích các câu sai, nghe lại đoạn đó thêm một lần.' : 'Đừng lo! Mở lời thoại, nghe lại từng đoạn và tìm câu chứa đáp án, rồi bấm "Làm lại từ đầu".') + '</p>';
    } else end.hidden = true;
  }
  Q.forEach(function (q) { if (ans[q.n]) show(q, ans[q.n] === '-' ? null : ans[q.n]); });
  score();
  root.addEventListener('click', function (ev) {
    var b = ev.target.closest('.mt-opt, .mt-skip'); if (!b || b.disabled) return;
    var el = b.closest('.mt-q'), n = +el.dataset.n, q = Q.filter(function (x) { return x.n === n; })[0];
    if (!q || ans[n]) return;
    var pick = b.classList.contains('mt-skip') ? '-' : b.dataset.c;
    ans[n] = pick; save(); show(q, pick === '-' ? null : pick); score();
  });

  // ===== Bài làm online của chính bạn (trang thi minitest lưu ở mt.exam.<mã đề>; đăng nhập Google thì tự đồng bộ giữa các máy) =====
  var css2 = document.createElement('style');
  css2.textContent = '.mt-mine{margin:14px 0 4px;padding:11px 14px;border-radius:12px;background:var(--brand-soft,#f2e2c4);border:1.5px solid var(--line);display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;justify-content:space-between}' +
    '.mt-mine button{font:inherit;font-size:13.5px;font-weight:600;border:1px solid var(--line);background:var(--card,#fff);border-radius:8px;padding:5px 10px;cursor:pointer;color:var(--ink)}' +
    '.mt-qh .me{font-size:12.5px;font-weight:700;border-radius:99px;padding:1px 9px}.mt-qh .me.y{background:#e1f4ec;color:#1f7a4d}.mt-qh .me.n{background:#fbe6e2;color:#b2412d}' +
    '.mt-opt.mine{outline:2.5px dashed #6b5bd6;outline-offset:2px}#mt.hide-mine .me{display:none}#mt.hide-mine .mt-opt.mine{outline:0}';
  document.head.appendChild(css2);
  function mine() {
    var best = null;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k.indexOf('mt.exam.' + (M.exam || 'TOEIC-PRE-MT' + M.n) + '-') !== 0) continue;
        var L = JSON.parse(localStorage.getItem(k) || '[]'); if (!Array.isArray(L)) continue;
        L.forEach(function (x) { if (x && x.a && (!x.src || x.src.indexOf(M.examSrc || '/pretoeic-minitest/') >= 0) && (!best || x.at > best.at)) best = x; });
      }
    } catch (e) {}
    return best;
  }
  function paintMine() {
    var x = mine(); if (!x || document.getElementById('mtMine')) return !!x;
    var ok = 0, tot = 0;
    Q.forEach(function (q) {
      var el = document.getElementById('q' + q.n); if (!el) return;
      var c = x.a[q.n] || x.a[String(q.n)] || ''; tot++;
      var right = c && q.ans.indexOf(c) >= 0; if (right) ok++;
      el.querySelector('.mt-qh').insertAdjacentHTML('beforeend', '<span class="me ' + (right ? 'y' : 'n') + '">Bài online: ' + (c ? c + (right ? ' ✓' : ' ✗') : 'bỏ trống ✗') + '</span>');
      var b = c && el.querySelector('.mt-opt[data-c="' + c + '"]'); if (b) b.classList.add('mine');
    });
    var d = new Date(x.at), when = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    var bx = document.createElement('div'); bx.className = 'mt-mine'; bx.id = 'mtMine';
    bx.innerHTML = '<span>📝 Đang hiện <b>bài làm online của bạn</b> ngày ' + when + ': đúng <b>' + ok + '/' + tot + '</b> câu. Câu bạn chọn có khung tím nét đứt.</span><button type="button">Ẩn bài làm</button>';
    var sc = document.getElementById('mtScore'); sc.parentNode.insertBefore(bx, sc);
    bx.querySelector('button').onclick = function () { var h = root.classList.toggle('hide-mine'); this.textContent = h ? 'Hiện bài làm' : 'Ẩn bài làm'; };
    return true;
  }
  // máy khác: bài làm về sau khi đăng nhập Google đồng bộ xong, thử lại vài lần
  if (!paintMine()) [3000, 8000, 15000].forEach(function (t) { setTimeout(paintMine, t); });
})();
