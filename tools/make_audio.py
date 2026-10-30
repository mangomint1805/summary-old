"""Tạo file phát âm (mp3) cho mọi từ trong "Bảng từ vựng" của các bài.

Cần: pip install kokoro-onnx soundfile ; ffmpeg ; 2 file model của kokoro-onnx
(kokoro-v1.0.onnx, voices-v1.0.bin) đặt trong thư mục MODEL_DIR.
Chạy:  python tools/make_audio.py MODEL_DIR   (chỉ tạo file còn thiếu)
"""
import glob, html, os, re, subprocess, sys, tempfile

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs')
VOICES = {'us-f': ('af_heart', 'en-us'), 'us-m': ('am_michael', 'en-us'), 'uk-f': ('bf_emma', 'en-gb')}
POS = re.compile(r'\s*\((n|v|adj|adv|phr|prep|conj|n/v|v/n|pron|phr\.v|np)\)\s*$', re.I)


def clean(s):  # giống hàm speak() trong flashcards.js
    s = re.sub(r'\([^)]*\)', '', s).replace('/', ', ')
    return re.sub(r'\s+', ' ', s).strip()


def slug(s):  # giống hàm slug() trong flashcards.js
    return re.sub(r'(^-+|-+$)', '', re.sub(r'[^a-z0-9]+', '-', clean(s).lower()))


def words():
    out = {}
    for f in glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True):
        s = open(f, encoding='utf-8').read()
        m = re.search(r'<h2[^>]*>[^<]*Bảng từ vựng', s)  # tiêu đề bảng, không phải dòng mục lục
        if not m:
            continue
        i = m.start()
        sec = s[i:]
        j = sec.find('<h2', 5)
        sec = sec[:j] if j > 0 else sec
        for tr in re.findall(r'<tr class="(?:odd|even)">.*?</tr>', sec, re.S):
            tds = re.findall(r'<td[^>]*>(.*?)</td>', tr, re.S)
            if not tds:
                continue
            en = POS.sub('', html.unescape(re.sub('<[^>]+>', '', tds[0])).strip())
            if en and slug(en):
                out[slug(en)] = clean(en)
    return out


def main(model_dir):
    import soundfile as sf
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(model_dir, 'kokoro-v1.0.onnx'), os.path.join(model_dir, 'voices-v1.0.bin'))
    ws = words()
    made = 0
    for code, (voice, lang) in VOICES.items():
        d = os.path.join(ROOT, 'audio', code)
        os.makedirs(d, exist_ok=True)
        for sl, text in sorted(ws.items()):
            mp3 = os.path.join(d, sl + '.mp3')
            if os.path.exists(mp3):
                continue
            samples, sr = k.create(text, voice=voice, speed=0.9, lang=lang)
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as t:
                sf.write(t.name, samples, sr)
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', t.name, '-af',
                            'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,apad=pad_dur=0.15',
                            '-ac', '1', '-ar', '24000', '-b:a', '40k', mp3], check=True)
            os.unlink(t.name)
            made += 1
    print(len(ws), 'từ,', made, 'file mới')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
