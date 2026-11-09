/* Đề mục thu gọn (details.sec): nút "Mở tất cả", tự mở khi bấm mục lục / tìm kiếm / in. */
(function () {
  var doc = document.querySelector('.doc');
  if (!doc) return;
  var secs = [].slice.call(doc.querySelectorAll('details.sec'));
  if (!secs.length) return;
  var old = doc.querySelector('.sec-tools'); if (old) old.remove();
  var bar = document.createElement('div');
  bar.className = 'sec-tools';
  bar.innerHTML = '<button type="button" class="sec-all">▾ Mở tất cả</button><span>Bấm vào từng đề mục để mở / thu gọn</span>';
  secs[0].parentNode.insertBefore(bar, secs[0]);
  var btn = bar.querySelector('button');
  function paint() {
    var all = secs.every(function (d) { return d.open; });
    btn.textContent = all ? '▴ Thu gọn tất cả' : '▾ Mở tất cả';
  }
  btn.addEventListener('click', function () {
    var open = !secs.every(function (d) { return d.open; });
    secs.forEach(function (d) { d.open = open; });
    paint();
  });
  secs.forEach(function (d) { d.addEventListener('toggle', paint); });
  function openTo(el) {
    while (el && el !== doc) { if (el.tagName === 'DETAILS' && !el.open) el.open = true; el = el.parentElement; }
  }
  function fromHash() {
    var id = decodeURIComponent((location.hash || '').slice(1));
    var el = id && document.getElementById(id);
    if (el && doc.contains(el)) { openTo(el); setTimeout(function () { el.scrollIntoView({ block: 'start' }); }, 30); }
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
  // Ô tìm kiếm của trang tô "sn-hit" lên đề mục: mở đúng mục đó
  if (window.MutationObserver) new MutationObserver(function (ms) {
    ms.forEach(function (m) { if (m.target.classList && m.target.classList.contains('sn-hit')) openTo(m.target); });
  }).observe(doc, { subtree: true, attributes: true, attributeFilter: ['class'] });
  // In bài: mở hết
  var was = null;
  window.addEventListener('beforeprint', function () { was = secs.map(function (d) { return d.open; }); secs.forEach(function (d) { d.open = true; }); });
  window.addEventListener('afterprint', function () { if (was) secs.forEach(function (d, i) { d.open = was[i]; }); paint(); });
})();
