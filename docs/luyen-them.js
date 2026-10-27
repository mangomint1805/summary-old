/* Luyện thêm: nối bài tóm tắt với các phần luyện tập của web TOEIC (cùng tên miền nên dùng chung dữ liệu: chuỗi đề mini…).
   - Cuối mỗi bài học: khung "🎯 Luyện thêm sau bài này" chọn đúng phần luyện của bài.
   - Trang chủ: hàng "⚡ Luyện tập nhanh" (đề mini hôm nay + chuỗi 🔥, phản xạ Part 2, chép chính tả, gõ từ rơi).
   File này giống hệt nhau ở summary-new và summary-old (bảng bài học của từng web nằm trong MAP). */
(function () {
  'use strict';
  var OLD = /\/summary-old\//.test(location.pathname);
  var me = document.currentScript, base = (me && me.src) ? me.src.replace(/luyen-them\.js.*$/, '') : '';
  var T = '/toeic/'; // web luyện đề TOEIC cùng tên miền

  // các mục luyện tập (đường dẫn web TOEIC hoặc chuyên đề của web này)
  var IT = {
    ct: ['🎧', 'Chép chính tả', 'Nghe từng câu trong đề thật rồi gõ lại, Part 1–4', T + 'chinh-ta.html'],
    p1: ['🎧', 'Chép chính tả Part 1', 'Nghe câu mô tả tranh rồi gõ lại', T + 'chinh-ta.html?p=p1'],
    p2: ['🎧', 'Chép chính tả Part 2', 'Nghe câu hỏi – đáp rồi gõ lại', T + 'chinh-ta.html?p=p2'],
    p3: ['🎧', 'Chép chính tả Part 3', 'Gõ lại từng câu trong hội thoại', T + 'chinh-ta.html?p=p3'],
    p4: ['🎧', 'Chép chính tả Part 4', 'Gõ lại từng câu trong bài nói', T + 'chinh-ta.html?p=p4'],
    px: ['⚡', 'Phản xạ Part 2', 'Nghe câu hỏi, chọn câu trả lời thật nhanh', T + 'phan-xa.html'],
    m2: ['📝', '10 câu Part 2', 'Hỏi – đáp có audio, chấm ngay', T + 'mini.html?m=p2'],
    m5: ['📝', '15 câu Part 5', 'Ngữ pháp & từ vựng, chấm ngay, có giải thích', T + 'mini.html?m=p5'],
    md: ['🔥', 'Đề mini hôm nay', '20 câu Part 1, 2, 5 · 10 phút', T + 'mini.html?m=day'],
    mh: ['💪', 'Đề khó: Part 3 + Part 6', 'Hội thoại dài & đoạn văn điền từ', T + 'mini.html?m=hard'],
    gt: ['🔤', 'Gõ từ rơi', 'Trò chơi ôn từ vựng TOEIC', T + 'go-tu.html'],
    ets: ['🎯', 'Luyện đề TOEIC', 'Đề ETS thật, chấm điểm ngay', T],
    // chuyên đề (luôn mở, trên chính web này)
    c_lt: ['📘', 'Chuyên đề Tính – Danh – Động – Trạng', 'Kèm 12 câu luyện Part 5', 'chuyen-de/phan-biet-loai-tu.html'],
    c_dt: ['📘', 'Chuyên đề Đại từ', 'Kèm 12 câu luyện Part 5', 'chuyen-de/dai-tu.html'],
    c_th: ['📘', 'Chuyên đề Các thì', 'Kèm 12 câu luyện Part 5', 'chuyen-de/thi-dong-tu.html'],
    c_bd: ['📘', 'Chuyên đề Câu bị động', 'Kèm 12 câu luyện Part 5', 'chuyen-de/cau-bi-dong.html'],
    c_gt: ['📘', 'Chuyên đề Giới từ', 'Kèm 12 câu luyện Part 5', 'chuyen-de/gioi-tu.html'],
    c_li: ['📘', 'Chuyên đề Liên từ', 'Kèm 12 câu luyện Part 5', 'chuyen-de/lien-tu.html'],
    c_qh: ['📘', 'Chuyên đề Đại từ quan hệ', 'Kèm 12 câu luyện Part 5', 'chuyen-de/dai-tu-quan-he.html'],
    c_tv: ['📘', 'Chuyên đề To V và V-ing', 'Kèm 12 câu luyện Part 5', 'chuyen-de/to-v-v-ing.html'],
    c_ss: ['📘', 'Chuyên đề So sánh', 'Kèm 12 câu luyện Part 5', 'chuyen-de/so-sanh.html'],
    c_hh: ['📘', 'Chuyên đề Sự hòa hợp', 'Kèm 12 câu luyện Part 5', 'chuyen-de/hoa-hop-chu-vi.html'],
    c_b1: ['📘', 'Chuyên đề Bẫy Part 1', 'Kèm 12 câu luyện', 'chuyen-de/bay-part-1.html'],
    c_b2: ['📘', 'Chuyên đề Trả lời gián tiếp Part 2', 'Kèm 12 câu luyện', 'chuyen-de/tra-loi-gian-tiep-part-2.html'],
    c_pp: ['📘', 'Chuyên đề Cách nói lại Part 3–4', 'Kèm 12 câu luyện', 'chuyen-de/paraphrase-part-3-4.html']
  };
  var P1 = ['p1', 'md', 'c_b1'], P2 = ['px', 'p2', 'm2', 'c_b2'], P3 = ['p3', 'c_pp', 'md'], P4 = ['p4', 'c_pp', 'md'];
  var MAP = OLD ? {
    L1: P1, L2: P1, L3: P2, L4: P2, L5: P2, L6: P2, L7: P3, L8: P3, L9: P3, L10: P4, L11: P4,
    R1: ['m5', 'c_lt', 'c_dt', 'gt'], R2: ['m5', 'c_lt', 'c_ss', 'gt'], R3: ['m5', 'c_th', 'gt'], R4: ['m5', 'c_bd', 'gt'],
    R5: ['m5', 'c_tv', 'gt'], R7: ['m5', 'c_lt', 'gt'], R8: ['m5', 'c_li', 'gt'], R9: ['m5', 'c_gt', 'gt'], R10: ['m5', 'c_qh', 'gt'],
    R11: ['m5', 'gt'], R12: ['m5', 'c_hh', 'gt'],
    PT1: ['md', 'm5', 'ets'], PT2: ['md', 'm5', 'ets']
  } : {
    L1: P1, L2: P1, L3: P2, L4: P2, L5: P2, L6: P3, L7: P3, L8: P4,
    R1: ['m5', 'c_lt', 'c_dt', 'gt'], R2: ['m5', 'c_lt', 'c_ss', 'gt'], R3: ['m5', 'c_th', 'gt'], R4: ['m5', 'c_bd', 'gt'],
    R5: ['m5', 'c_lt', 'gt'], R6: ['m5', 'c_li', 'c_gt', 'gt'], R7: ['m5', 'c_ss', 'gt'],
    W1: ['md', 'p1', 'm5'], W2: ['md', 'm5', 'c_th'], W3: ['md', 'm5', 'c_li'], W4: ['md', 'm5', 'c_hh'],
    PT1: ['md', 'm5', 'ets'], PT2: ['md', 'm5', 'ets'],
    AR1: ['m5', 'c_dt', 'c_lt', 'mh'], AR2: ['m5', 'c_lt', 'c_ss', 'mh'], AR3: ['m5', 'c_th', 'c_bd', 'mh'],
    AR4: ['m5', 'c_li', 'c_gt', 'mh'], AR5: ['m5', 'c_qh', 'mh'], AR6: ['m5', 'c_tv', 'mh'],
    AL1: ['p1', 'md', 'c_b1'], AL2: ['px', 'p2', 'c_b2'], AL3: ['p3', 'mh', 'c_pp'], AL4: ['p3', 'mh', 'c_pp'],
    AL5: ['p4', 'c_pp', 'ets'], AL6: ['p4', 'c_pp', 'ets'],
    APRE: ['md', 'm5', 'px', 'c_lt']
  };

  var css = document.createElement('style');
  css.textContent =
    '.lt-more{margin:26px 0 8px;padding:16px 18px;border:1.5px solid var(--line,#ddd7c9);border-radius:14px;background:var(--card,#fff)}' +
    '.lt-more h2{margin:0 0 4px!important;font-size:20px!important}.lt-more>p{margin:0 0 10px;color:var(--dim,#666e7a);font-size:14.5px}' +
    '.lt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}' +
    '.lt-grid a{display:flex;gap:10px;align-items:flex-start;padding:11px 12px;border:1px solid var(--line,#ddd7c9);border-radius:11px;background:var(--paper,#faf8f4);text-decoration:none;color:var(--ink,#1e232b)}' +
    '.lt-grid a:hover{border-color:var(--amber,#a8691a);box-shadow:0 4px 14px rgba(107,68,16,.08)}' +
    '.lt-grid .ic{font-size:22px;line-height:1.1;flex:none}.lt-grid b{display:block;font-size:15px;line-height:1.3}.lt-grid small{display:block;color:var(--dim,#666e7a);font-size:13px;line-height:1.35;margin-top:2px}' +
    '.lt-grid small.st{color:#c2410c;font-weight:700}.lt-quick .lt-grid{grid-template-columns:repeat(auto-fill,minmax(165px,1fr))}';
  document.head.appendChild(css);

  function href(u) { return /^(\/|https?:)/.test(u) ? u : base + u; }
  function card(k, extra) {
    var x = IT[k]; if (!x) return '';
    return '<a href="' + href(x[3]) + '"><span class="ic" aria-hidden="true">' + x[0] + '</span><span><b>' + x[1] + '</b><small>' + x[2] + '</small>' + (extra || '') + '</span></a>';
  }
  // chuỗi đề mini (dữ liệu của web TOEIC, cùng tên miền)
  function mini() {
    var D = {}; try { D = JSON.parse(localStorage.getItem('ets26.mini.days')) || {}; } catch (e) {}
    function day(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
    var d = new Date(), today = D[day(d)], s = 0; if (!today) d.setDate(d.getDate() - 1);
    while (D[day(d)]) { s++; d.setDate(d.getDate() - 1); }
    return { today: today, streak: s };
  }

  function lesson() {
    var path = location.pathname, F = window.SN_FILES || {}, id = null;
    Object.keys(F).forEach(function (f) { if (path.slice(-f.length - 1) === '/' + f) id = F[f]; });
    if (!id && /\/a\/on-tap-pre\.html$/.test(path)) id = 'APRE';
    var L = id && MAP[id]; if (!L) return;
    var main = document.querySelector('main'); if (!main) return;
    var box = document.createElement('section'); box.className = 'lt-more'; box.setAttribute('aria-label', 'Luyện thêm');
    box.innerHTML = '<h2>🎯 Luyện thêm sau bài này</h2><p>Đọc xong tóm tắt thì luyện ngay phần này cho nhớ lâu. Các bài luyện mở trên web luyện đề TOEIC, chấm điểm ngay.</p><div class="lt-grid">' +
      L.map(function (k) { return card(k); }).join('') + '</div>';
    main.appendChild(box);
  }

  function home() {
    var after = document.querySelector('nav.more-sites'); if (!after || document.querySelector('.lt-quick')) return;
    var m = mini();
    var st = m.streak ? '<small class="st">🔥 ' + m.streak + ' ngày liên tục' + (m.today ? ' · hôm nay ' + m.today + '/20' : ' · làm hôm nay để giữ chuỗi') + '</small>' : '<small class="st">Bắt đầu chuỗi 🔥 ngay hôm nay</small>';
    var box = document.createElement('section'); box.className = 'lt-more lt-quick'; box.setAttribute('aria-label', 'Luyện tập nhanh');
    box.innerHTML = '<h2>⚡ Luyện tập nhanh</h2><p>Mỗi ngày 10–15 phút trên web luyện đề TOEIC: làm đề mini, luyện nghe và ôn từ vựng.</p><div class="lt-grid">' +
      card('md', st) + card('px') + card('ct') + card('gt') + '</div>';
    after.parentNode.insertBefore(box, after.nextSibling);
  }

  function run() { lesson(); home(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
