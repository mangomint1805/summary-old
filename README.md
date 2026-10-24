# TOEIC Pre · Tóm tắt kiến thức

Tóm tắt kiến thức từng bài của khóa TOEIC Pre (Reading & Listening), viết bằng tiếng Việt cho học viên mới bắt đầu, kèm bảng từ vựng của mỗi bài.

## Link nhanh

| Dùng để | Link |
|---|---|
| 🏠 Trang chủ (mở tất cả bài) | [mangomint1805.github.io/summary-old](https://mangomint1805.github.io/summary-old/) |
| 👩‍🏫 Chế độ giáo viên (lịch từng lớp, link gửi lớp) | [mangomint1805.github.io/summary-old/?gv](https://mangomint1805.github.io/summary-old/?gv) |

## Mã lớp và lịch mở bài

Học sinh vào trang chủ phải **nhập mã lớp** (hoặc mở link có sẵn mã, VD `…/summary-old/?lop=PRE115275`). Bài sẽ tự mở từ 0h ngày lớp học tới bài đó theo lịch 24 buổi; bài chưa tới hiện "🔒 Mở ngày …", mở thẳng link bài cũng bị chặn.

Thêm lớp mới / sửa lịch: mở file `docs/classes.js`, sửa danh sách `SN_CLASSES`:

```js
{ ma: 'PRE115275', ten: 'PRE115275 (3-5-7, 17h45 - 19h15)', khaiGiang: '2026-09-19', thu: [3, 5, 7], nghi: [] }
```

- `thu`: các thứ học (2 = Thứ 2 … 7 = Thứ 7, 8 = Chủ nhật).
- `nghi`: ngày lớp nghỉ (`'2026-11-20'`…), các buổi sau tự lùi lại.
- `moc`: (tuỳ chọn) `['2026-10-14', 11]` = tới ngày 14/10 lớp đã học xong buổi 11; các buổi sau tính tiếp từ mốc này.
- `hocToi`: (tuỳ chọn) ép mở tới buổi số mấy dù chưa tới ngày.

Mở link `?gv` một lần trên máy của thầy để xem được mọi bài và xem lịch từng lớp. Đây chỉ là khoá đơn giản trên trình duyệt, không phải bảo mật thật.

## Flashcard từ vựng

Mỗi bài có nút **🃏 Flashcard từ vựng**, thẻ tạo tự động từ bảng từ vựng của bài (có phiên âm). Chạm để lật thẻ, 🔊 nghe phát âm (file mp3 có sẵn trong `docs/audio/`, 3 giọng Mỹ nữ / Mỹ nam / Anh nữ, nghe được trên mọi điện thoại), trộn thẻ, đánh dấu Đã thuộc / Chưa thuộc, ôn riêng từ chưa thuộc. Thêm từ mới thì chạy `python tools/make_audio.py <thư mục model>` để tạo file phát âm.

## Reading

| Bài | Chủ điểm | Nội dung |
|---|---|---|
| Unit 1 | [Nouns & Pronouns](https://mangomint1805.github.io/summary-old/reading/unit-01-nouns-pronouns.html) | Danh từ & Đại từ |
| Unit 2 | [Adjectives & Adverbs](https://mangomint1805.github.io/summary-old/reading/unit-02-adjectives-adverbs.html) | Tính từ & Trạng từ |
| Unit 3 | [Verb Tenses](https://mangomint1805.github.io/summary-old/reading/unit-03-verb-tenses.html) | Các thì của động từ |
| Unit 4 | [Active & Passive Voice](https://mangomint1805.github.io/summary-old/reading/unit-04-active-passive-voice.html) | Câu chủ động & bị động |
| Unit 5–6 | [To-infinitives & Gerunds](https://mangomint1805.github.io/summary-old/reading/unit-05-to-infinitives-gerunds.html) | To V & V-ing |
| Unit 7 | [Participles](https://mangomint1805.github.io/summary-old/reading/unit-07-participles.html) | Phân từ |
| Unit 8 | [Conjunctions](https://mangomint1805.github.io/summary-old/reading/unit-08-conjunctions.html) | Liên từ |
| Unit 9 | [Prepositions](https://mangomint1805.github.io/summary-old/reading/unit-09-prepositions.html) | Giới từ |
| Unit 10 | [Relative Pronouns & Adverbs](https://mangomint1805.github.io/summary-old/reading/unit-10-relative-pronouns-adverbs.html) | Đại từ & trạng từ quan hệ |
| Unit 11 | [Subjunctive Mood](https://mangomint1805.github.io/summary-old/reading/unit-11-subjunctive-mood.html) | Thức giả định |
| Unit 12 | [Agreement](https://mangomint1805.github.io/summary-old/reading/unit-12-agreement.html) | Sự hòa hợp chủ ngữ – động từ |

## Listening

| Bài | Chủ điểm | Nội dung |
|---|---|---|
| Unit 1 | [Part 1 – Photos of People](https://mangomint1805.github.io/summary-old/listening/unit-01-photos-of-people.html) | Tranh tả người |
| Unit 2 | [Part 1 – Photos of Objects & Scenes](https://mangomint1805.github.io/summary-old/listening/unit-02-photos-of-objects-scenes.html) | Tranh tả vật và cảnh |
| Unit 3 | [Part 2 – Information Questions (1)](https://mangomint1805.github.io/summary-old/listening/unit-03-information-questions-1.html) | Câu hỏi Who / What / Which |
| Unit 4 | [Part 2 – Information Questions (2)](https://mangomint1805.github.io/summary-old/listening/unit-04-information-questions-2.html) | Câu hỏi When / Where / Why / How |
| Unit 5 | [Part 2 – Yes/No Questions](https://mangomint1805.github.io/summary-old/listening/unit-05-yes-no-questions.html) | Câu hỏi Yes/No |
| Unit 6 | [Part 2 – Other Question Types](https://mangomint1805.github.io/summary-old/listening/unit-06-other-question-types.html) | Các dạng câu hỏi khác |
| Unit 7 | [Part 3 – Business Activities](https://mangomint1805.github.io/summary-old/listening/unit-07-business-activities.html) | Hoạt động kinh doanh |
| Unit 8 | [Part 3 – Daily Activities](https://mangomint1805.github.io/summary-old/listening/unit-08-daily-activities.html) | Hoạt động hằng ngày |
| Unit 9 | [Part 3 – At Public Places](https://mangomint1805.github.io/summary-old/listening/unit-09-at-public-places.html) | Ở nơi công cộng |
| Unit 10–11 | [Part 4 – Telephone Messages, Announcements & Ads](https://mangomint1805.github.io/summary-old/listening/unit-10-telephone-messages-announcements-ads.html) | Tin nhắn thoại, thông báo, quảng cáo |
| Unit 11–12 | [Part 4 – Radio Broadcasts, Speeches & Internal Announcements](https://mangomint1805.github.io/summary-old/listening/unit-11-radio-broadcasts-speeches-internal-announcements.html) | Phát thanh, bài phát biểu, thông báo nội bộ |

## Chuyên đề

Bài tổng hợp theo chủ điểm ngữ pháp, dùng để ôn xuyên suốt khoá.

| # | Chuyên đề |
|---|---|
| 1 | [Phân biệt loại từ: Tính – Danh – Động – Trạng](https://mangomint1805.github.io/summary-old/chuyen-de/phan-biet-loai-tu.html) |
| 2 | [Đại từ trong TOEIC](https://mangomint1805.github.io/summary-old/chuyen-de/dai-tu.html) |
| 3 | [Các thì của động từ trong TOEIC](https://mangomint1805.github.io/summary-old/chuyen-de/thi-dong-tu.html) |
| 4 | [Câu bị động trong TOEIC](https://mangomint1805.github.io/summary-old/chuyen-de/cau-bi-dong.html) |
| 5 | [Giới từ thường gặp trong TOEIC](https://mangomint1805.github.io/summary-old/chuyen-de/gioi-tu.html) |

## Ôn tập

| Bài | Nội dung |
|---|---|
| [Ôn tập sau Progress Test 1](https://mangomint1805.github.io/summary-old/review/progress-test-1.html) | Ôn lại kiến thức sau bài Progress Test 1 |

## Cấu trúc thư mục

```
docs/
  index.html     trang chủ (nhập mã lớp; chế độ ?gv cho giáo viên)
  classes.js     danh sách lớp + lịch mở bài
  flashcards.js  flashcard từ vựng
  audio/         file phát âm từ vựng (tạo bằng tools/make_audio.py)
  style.css      giao diện chung
  extras.js      đánh dấu "đã ôn tập" + tìm kiếm trong các bài
  cap-nhat.html  trang "Có gì mới" (nội dung trong cap-nhat.js)
  reading/       trang web từng bài Reading
  listening/     trang web từng bài Listening
  chuyen-de/     trang web từng chuyên đề ngữ pháp
  review/        trang ôn tập sau Progress Test
```

GitHub Pages: Settings → Pages → Branch `main`, folder `/docs`.
