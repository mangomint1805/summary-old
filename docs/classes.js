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
  PT1: 12 /* trang Ôn tập sau Progress Test 1 – mở sau buổi kiểm tra */
};
var SN_TOTAL = 24;
/* Các buổi không có trang bài học */
var SN_OTHER = { 12: 'Progress Test 1', 24: 'Progress Test 2' };
var SN_PREFIX = 'summaryOld';
var SN_FILES = {
  'review/progress-test-1.html': 'PT1',
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

/* Nạp thêm tính năng: đánh dấu đã học + tìm kiếm (file extras.js) */
(function () {
  var me = document.currentScript; if (!me || !me.src) return;
  var s = document.createElement('script'); s.src = me.src.replace(/classes\.js(\?.*)?$/, 'extras.js'); s.defer = true;
  document.head.appendChild(s);
})();
