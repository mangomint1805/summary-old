/* =====================================================================
   DANH SÁCH LỚP: thầy chỉ cần sửa phần này
   ---------------------------------------------------------------------
   ma        : mã lớp học sinh nhập để vào trang (không phân biệt hoa/thường)
   ten       : tên hiện trên trang
   khaiGiang : ngày học buổi 1, dạng 'YYYY-MM-DD'
   thu       : các thứ trong tuần lớp học (2 = Thứ 2 … 7 = Thứ 7, 8 = Chủ nhật)
   nghi      : các ngày lớp NGHỈ (lễ, thầy bận…), dạng 'YYYY-MM-DD'.
               Buổi học rơi vào ngày nghỉ sẽ tự dời sang buổi kế tiếp.
   moc       : (không bắt buộc) ['YYYY-MM-DD', số buổi] = "tới ngày đó lớp đã
               học xong buổi số mấy". Dùng khi lớp chậm/nhanh hơn lịch: các buổi
               sau sẽ tính tiếp từ mốc này theo các thứ học.
   hocToi    : (không bắt buộc) ép mở tới buổi số mấy dù chưa tới ngày.
   Bài của buổi nào sẽ mở SAU GIỜ TAN HỌC của ngày học buổi đó (giờ tan lấy từ
               'ten', ví dụ '17h45 - 19h15' → mở lúc 19:15).
   gioMo     : (không bắt buộc) giờ mở bài khác giờ tan học, dạng 'HH:MM'.
   ===================================================================== */
var SN_CLASSES = [
  { ma: 'PRE112385', ten: 'PRE112385 (2-4-6, 17h45 - 19h15)', khaiGiang: '2026-08-28', thu: [2, 4, 6], nghi: [] },
  { ma: 'PRE115275', ten: 'PRE115275 (3-5-7, 17h45 - 19h15)', khaiGiang: '2026-09-19', thu: [3, 5, 7], nghi: [] }
];

/* Bài học ứng với buổi nào trong lịch 24 buổi (TOEIC PRE, giáo trình cũ) */
var SN_SESSIONS = {
  R1: 1, L1: 2, R2: 3, L2: 4, R3: 5, L3: 6, R4: 7, L4: 8, R5: 9, L5: 10, R7: 11,
  L6: 13, R8: 14, L7: 15, R9: 16, L8: 17, R10: 18, L9: 19, R11: 20, L10: 21, R12: 22, L11: 23,
  PT1: 12, /* trang Ôn tập sau Progress Test 1 – mở sau buổi kiểm tra */
  PT2: 22  /* trang Ôn tập trước Progress Test 2 – mở trước buổi thi vài ngày */
};
var SN_TOTAL = 24;
/* Các buổi không có trang bài học */
var SN_OTHER = { 12: 'Progress Test 1', 24: 'Progress Test 2' };
/* Tên bài (dùng cho thông báo "bài mới mở"), lấy theo trang chủ */
var SN_TITLES = {
  "R1": "Reading Unit 1 · Nouns & Pronouns",
  "R2": "Reading Unit 2 · Adjectives & Adverbs",
  "R3": "Reading Unit 3 · Verb Tenses",
  "R4": "Reading Unit 4 · Active & Passive Voice",
  "R5": "Reading Unit 5–6 · To-infinitives & Gerunds",
  "R7": "Reading Unit 7 · Participles",
  "R8": "Reading Unit 8 · Conjunctions",
  "R9": "Reading Unit 9 · Prepositions",
  "R10": "Reading Unit 10 · Relative Pronouns & Adverbs",
  "R11": "Reading Unit 11 · Subjunctive Mood",
  "R12": "Reading Unit 12 · Agreement",
  "L1": "Listening Unit 1 · Part 1 – Photos of People",
  "L2": "Listening Unit 2 · Part 1 – Photos of Objects & Scenes",
  "L3": "Listening Unit 3 · Part 2 – Information Questions (1)",
  "L4": "Listening Unit 4 · Part 2 – Information Questions (2)",
  "L5": "Listening Unit 5 · Part 2 – Yes/No Questions",
  "L6": "Listening Unit 6 · Part 2 – Other Question Types",
  "L7": "Listening Unit 7 · Part 3 – Business Activities",
  "L8": "Listening Unit 8 · Part 3 – Daily Activities",
  "L9": "Listening Unit 9 · Part 3 – At Public Places",
  "L10": "Listening Unit 10–11 · Part 4 – Telephone Messages, Announcements & Ads",
  "L11": "Listening Unit 11–12 · Part 4 – Radio Broadcasts, Speeches & Internal Announcements",
  "PT1": "Ôn tập sau Progress Test 1",
  "PT2": "Ôn tập trước Progress Test 2"
 };
var SN_PREFIX = 'summaryOld';
var SN_FILES = {
  'review/progress-test-1.html': 'PT1',
  'review/progress-test-2.html': 'PT2',
  'reading/unit-01-nouns-pronouns.html': 'R1',
  'reading/unit-02-adjectives-adverbs.html': 'R2',
  'reading/unit-03-verb-tenses.html': 'R3',
  'reading/unit-04-active-passive-voice.html': 'R4',
  'reading/unit-05-to-infinitives-gerunds.html': 'R5',
  'reading/unit-07-participles.html': 'R7',
  'reading/unit-08-conjunctions.html': 'R8',
  'reading/unit-09-prepositions.html': 'R9',
  'reading/unit-10-relative-pronouns-adverbs.html': 'R10',
  'reading/unit-11-subjunctive-mood.html': 'R11',
  'reading/unit-12-agreement.html': 'R12',
  'listening/unit-01-photos-of-people.html': 'L1',
  'listening/unit-02-photos-of-objects-scenes.html': 'L2',
  'listening/unit-03-information-questions-1.html': 'L3',
  'listening/unit-04-information-questions-2.html': 'L4',
  'listening/unit-05-yes-no-questions.html': 'L5',
  'listening/unit-06-other-question-types.html': 'L6',
  'listening/unit-07-business-activities.html': 'L7',
  'listening/unit-08-daily-activities.html': 'L8',
  'listening/unit-09-at-public-places.html': 'L9',
  'listening/unit-10-telephone-messages-announcements-ads.html': 'L10',
  'listening/unit-11-radio-broadcasts-speeches-internal-announcements.html': 'L11'
};

/* ===================== phần xử lý (không cần sửa) ===================== */
/* giờ mở bài của lớp: gioMo, hoặc giờ tan học trong tên lớp, mặc định 21:15 */
function snEndHM(c) {
  var m = c && c.gioMo ? String(c.gioMo).match(/(\d{1,2})\D(\d{2})/) : null;
  if (!m && c) m = String(c.ten || '').match(/-\s*(\d{1,2})h(\d{2})/);
  return m ? [+m[1], +m[2]] : [21, 15];
}
function snEndText(c) { var e = snEndHM(c); return e[0] + 'h' + ('0' + e[1]).slice(-2); }

var SN = (function () {
  'use strict';
  var KEY = SN_PREFIX + '.lop', GV = SN_PREFIX + '.gv';
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function norm(s) { return String(s || '').replace(/\s+/g, '').toUpperCase(); }
  function find(code) {
    code = norm(code); if (!code) return null;
    for (var i = 0; i < SN_CLASSES.length; i++) if (norm(SN_CLASSES[i].ma) === code) return SN_CLASSES[i];
    return null;
  }
  function ymd(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function key(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  var cache = {};
  function dates(c) {
    if (cache[c.ma]) return cache[c.ma];
    var out = [], d = ymd(c.khaiGiang), off = {}, days = {}, guard = 0;
    (c.nghi || []).forEach(function (x) { off[x] = 1; });
    (c.thu || []).forEach(function (t) { days[t === 8 ? 0 : t - 1] = 1; });
    function isDay(x) { return days[x.getDay()] && !off[key(x)]; }
    var m = c.moc && c.moc[1] ? { d: ymd(c.moc[0]), n: Math.min(+c.moc[1], SN_TOTAL) } : null;
    var need = m ? m.n : SN_TOTAL;
    while (out.length < need && guard++ < 800) {
      if (isDay(d)) out.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    if (m) {
      // các buổi đã học: không trễ hơn ngày mốc, buổi mốc = đúng ngày mốc
      out = out.map(function (x) { return x > m.d ? new Date(m.d) : x; });
      out[m.n - 1] = new Date(m.d);
      d = new Date(m.d); d.setDate(d.getDate() + 1);
      while (out.length < SN_TOTAL && guard++ < 1600) {
        if (isDay(d)) out.push(new Date(d));
        d.setDate(d.getDate() + 1);
      }
    }
    return (cache[c.ma] = out);
  }
  function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function doneSessions(c) {
    var now = new Date(), ds = dates(c), n = 0, e = snEndHM(c);
    ds.forEach(function (d, i) { var o = new Date(d); o.setHours(e[0], e[1], 0, 0); if (now >= o) n = i + 1; });
    return Math.max(n, c.hocToi || 0);
  }
  function isOpen(c, id) { var s = SN_SESSIONS[id]; return !s || s <= doneSessions(c); }
  function openDate(c, id) { var s = SN_SESSIONS[id]; return s ? dates(c)[s - 1] : null; }
  var TH = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  function fmt(d, withDay) {
    if (!d) return '';
    var s = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2);
    return withDay ? TH[d.getDay()] + ', ' + s : s;
  }
  function current() { return find(get(KEY)); }
  function choose(code) { var c = find(code); if (c) set(KEY, c.ma); return c; }
  function leave() { set(KEY, null); }
  function teacher(v) { if (v === undefined) return get(GV) === '1'; set(GV, v ? '1' : null); }
  return { find: find, current: current, choose: choose, leave: leave, teacher: teacher, dates: dates,
    doneSessions: doneSessions, isOpen: isOpen, openDate: openDate, fmt: fmt, today: today, norm: norm };
})();

/* ===== Bắt đăng nhập Google trước khi xem web =====
   Chưa đăng nhập thì che toàn bộ trang và hiện nút đăng nhập (dùng assets/acc.js, Firebase minto-english).
   Máy đã đăng nhập (mt.acc) thì cho xem ngay, nếu Firebase báo đã đăng xuất thì che lại.
   Chế độ giáo viên (?gv) không bị chặn. Đây chỉ là khoá trên trình duyệt, không phải bảo mật thật. */
(function () {
  'use strict';
  if (window.SN_GATE) return; window.SN_GATE = 1;
  if (SN.teacher() || /[?&]gv(=|&|$)/.test(location.search)) return;
  var me = document.currentScript, src = (me && me.getAttribute('src')) || 'classes.js';
  var ACC = src.replace(/classes\.js.*$/, '') + 'assets/acc.js?v=7';
  var had = false; try { had = !!localStorage.getItem('mt.acc'); } catch (e) {}
  var root = document.documentElement, box = null, locked = false;
  var css = document.createElement('style');
  css.textContent = 'html.sn-auth body>*:not(.sn-auth-box){display:none!important}html.sn-auth body{background:var(--paper,#faf8f4)}' +
    '.sn-auth-box{max-width:420px;margin:12vh auto 24px;padding:26px 22px 22px;background:#fff;border:1.5px solid var(--line,#ddd7c9);border-radius:16px;box-shadow:0 10px 30px rgba(30,35,43,.08);text-align:center;box-sizing:border-box;width:calc(100% - 32px);}' +
    '.sn-auth-box .ic{font-size:44px;line-height:1}' +
    '.sn-auth-box h2{font-family:Fraunces,Lora,"Times New Roman",serif;font-weight:600;font-size:24px;margin:12px 0 6px;color:var(--ink,#1e232b)}' +
    '.sn-auth-box p{color:var(--dim,#666e7a);margin:4px 0 0;font-size:15.5px;line-height:1.55}' +
    '.sn-auth-box .mp-acc{text-align:left;margin-top:16px;border-top:1px dashed #e2dbcd;padding-top:14px;font-size:15px}' +
    '.sn-auth-box .mp-acc .ma-g{font-size:15.5px;padding:13px}' +
    '.sn-auth-box .mp-acc .ma-t{display:none}' +
    '.sn-auth-box .wait{color:var(--dim,#666e7a);font-size:14.5px}' +
    '.sn-auth-box .retry{margin-top:10px;font:600 14.5px/1 inherit;padding:10px 16px;border-radius:10px;border:1.5px solid var(--amber,#a8691a);background:#fff;color:var(--amber-ink,#6b4410);cursor:pointer}';
  document.head.appendChild(css);

  function draw() {
    if (!locked || !document.body) return;
    if (!box) {
      box = document.createElement('div'); box.className = 'sn-auth-box';
      box.innerHTML = '<div class="ic">🔐</div><h2>Đăng nhập để học</h2>' +
        '<p>Web tóm tắt bài dành cho học viên lớp của thầy. Đăng nhập Google một lần, lần sau vào là xem được luôn.</p>' +
        '<div class="mp-acc"><span class="wait">Đang tải nút đăng nhập…</span></div>';
      document.body.appendChild(box);
    }
    var acc = box.querySelector('.mp-acc');
    if (window.MACC) window.MACC.render(acc);
  }
  function lock() { locked = true; root.classList.add('sn-auth'); if (document.body) draw(); else document.addEventListener('DOMContentLoaded', draw); }
  function unlock() { locked = false; root.classList.remove('sn-auth'); if (box) { box.remove(); box = null; } }
  function fail() {
    if (!locked) return; draw();
    var acc = box && box.querySelector('.mp-acc'); if (!acc) return;
    acc.innerHTML = '<span class="wait">Không tải được dịch vụ đăng nhập. Kiểm tra mạng (Wi-Fi / 4G) rồi thử lại nhé.</span><br><button type="button" class="retry">Thử lại</button>';
    acc.querySelector('.retry').onclick = function () { location.reload(); };
  }
  function watch() {
    window.MACC.load().then(function (fb) {
      fb.A.onAuthStateChanged(fb.auth, function (u) { if (u) unlock(); else lock(); });
    }, fail);
    if (locked) draw();
  }
  if (!had) lock();
  if (window.MACC) watch();
  else {
    var sc = document.createElement('script'); sc.src = ACC;
    sc.onload = function () { if (window.MACC) watch(); else fail(); };
    sc.onerror = fail;
    document.head.appendChild(sc);
  }
})();

/* ===== Khoá trang bài học: bài chưa tới buổi thì không cho xem ===== */
(function () {
  'use strict';
  var path = location.pathname.replace(/\\/g, '/');
  var file = Object.keys(SN_FILES).filter(function (f) { return path.slice(-f.length) === f; })[0];
  if (!file) return; // không phải trang bài học (VD trang chủ)
  var id = SN_FILES[file];
  var q = new URLSearchParams(location.search);
  if (q.has('lop')) SN.choose(q.get('lop'));
  if (SN.teacher()) return;
  var c = SN.current();
  if (c && SN.isOpen(c, id)) return;

  var css = document.createElement('style');
  css.textContent = 'html.sn-lock main{display:none}' +
    '.sn-box{max-width:520px;margin:40px auto;padding:26px 24px;background:var(--card,#fff);border:1.5px solid var(--amber,#a8691a);border-radius:14px;text-align:center;font-family:inherit;}' +
    '.sn-box .ic{font-size:44px;line-height:1;}' +
    '.sn-box h2{font-family:Lora,"Times New Roman",serif;font-weight:600;font-size:23px;margin:12px 0 6px;}' +
    '.sn-box p{color:var(--dim,#666e7a);margin:6px 0;}' +
    '.sn-box a.btn{display:inline-block;margin:14px 6px 0;padding:11px 18px;border-radius:10px;font-weight:700;text-decoration:none;background:var(--amber,#a8691a);color:#fff;}' +
    '.sn-box a.alt{background:var(--card,#fff);color:var(--amber-ink,#6b4410);border:1.5px solid var(--amber,#a8691a);}';
  document.head.appendChild(css);
  document.documentElement.classList.add('sn-lock');
  document.addEventListener('DOMContentLoaded', function () {
    var home = '../index.html';
    var box = document.createElement('div'); box.className = 'sn-box';
    if (!c) {
      box.innerHTML = '<div class="ic">🔑</div><h2>Bạn chưa nhập mã lớp</h2><p>Vào trang chủ, nhập mã lớp thầy gửi để xem các bài lớp đã học nhé.</p>' +
        '<a class="btn" href="' + home + '">Về trang chủ nhập mã lớp</a>';
    } else {
      var d = SN.openDate(c, id);
      box.innerHTML = '<div class="ic">🔒</div><h2>Lớp mình chưa học tới bài này</h2>' +
        '<p>Bài này sẽ mở sau giờ học, lúc <b>' + snEndText(c) + ' ngày ' + SN.fmt(d, true) + '/' + d.getFullYear() + '</b> (buổi ' + SN_SESSIONS[id] + ' của lớp ' + c.ma + ').</p>' +
        '<p>Ôn lại các bài đã học trước nha!</p><a class="btn" href="' + home + '">← Về danh sách bài</a>';
    }
    var main = document.querySelector('main');
    (main ? main.parentNode : document.body).insertBefore(box, main || null);
  });
})();

/* ===== Thông báo "bài mới mở" khi học sinh vào lại web =====
   Máy học sinh nhớ các bài đã mở ở lần vào trước; lần sau có bài mới mở thì hiện thông báo
   ở góc dưới màn hình (nhãn "Mới" trên trang chủ do extras.js lo). Lần đầu vào chỉ ghi nhớ, không báo. */
(function () {
  'use strict';
  if (typeof SN_TITLES === 'undefined') return;
  var me = document.currentScript, src = me && me.getAttribute('src');
  var base = src ? src.replace(/classes\.js.*$/, '') : '';
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  var FILE = {}; Object.keys(SN_FILES).forEach(function (f) { FILE[SN_FILES[f]] = f; });
  function run() {
    if (SN.teacher() || new URLSearchParams(location.search).has('xem')) return;
    var c = SN.current(); if (!c) return;
    var open = Object.keys(SN_SESSIONS).filter(function (id) { return FILE[id] && SN_TITLES[id] && SN.isOpen(c, id); });
    var k = SN_PREFIX + '.seen.' + c.ma, raw = get(k);
    set(k, JSON.stringify(open));
    if (raw === null) return;
    var seen = {}; try { JSON.parse(raw).forEach(function (id) { seen[id] = 1; }); } catch (e) { return; }
    var fresh = open.filter(function (id) { return !seen[id]; })
      .sort(function (a, b) { return SN_SESSIONS[a] - SN_SESSIONS[b]; });
    if (!fresh.length) return;
    var box = document.createElement('div');
    box.className = 'sn-toast'; box.setAttribute('role', 'status');
    box.innerHTML = '<button type="button" class="x" aria-label="Đóng thông báo">✕</button>' +
      '<p class="t">🎉 Lớp ' + esc(c.ma) + ' có ' + (fresh.length > 1 ? fresh.length + ' bài' : 'bài') + ' mới mở</p><ul>' +
      fresh.slice(0, 5).map(function (id) { return '<li><a href="' + esc(base + FILE[id]) + '">' + esc(SN_TITLES[id]) + '</a></li>'; }).join('') +
      (fresh.length > 5 ? '<li>… và ' + (fresh.length - 5) + ' bài khác trên trang chủ</li>' : '') + '</ul>';
    box.querySelector('.x').onclick = function () { box.remove(); };
    document.body.appendChild(box);
  }
  function whenUnlocked() {
    var root = document.documentElement;
    if (!root.classList.contains('sn-auth')) return run();
    // đang bị che vì chưa đăng nhập: đăng nhập xong mới báo
    var mo = new MutationObserver(function () { if (!root.classList.contains('sn-auth')) { mo.disconnect(); run(); } });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
  }
  document.addEventListener('DOMContentLoaded', function () { setTimeout(whenUnlocked, 0); });
})();

/* Điện thoại: bảng nào vẫn rộng hơn khung bài thì cho riêng bảng đó cuộn ngang */
document.addEventListener('DOMContentLoaded', function () {
  [].forEach.call(document.querySelectorAll('.doc table'), function (t) {
    var p = t.parentElement;
    if (!p || p.classList.contains('tbl-scroll') || p.classList.contains('lt-scroll')) return;
    var cs = getComputedStyle(p), room = p.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (t.offsetWidth <= room + 1) return;
    var w = document.createElement('div'); w.className = 'tbl-scroll';
    p.insertBefore(w, t); w.appendChild(t);
  });
});

/* Nạp thêm tính năng: đánh dấu đã học + tìm kiếm (file extras.js) */
(function () {
  var me = document.currentScript; if (!me || !me.src) return;
  var s = document.createElement('script'); s.src = me.src.replace(/classes\.js(\?.*)?$/, 'extras.js'); s.defer = true;
  document.head.appendChild(s);
})();
