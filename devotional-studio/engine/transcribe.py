# Word-level timestamps for a voice-over (Hindi by default) with faster-whisper.
# usage: python3 -I engine/transcribe.py voice.mp3 words.json [model=medium] [lang=hi]
import sys, json, subprocess
import numpy as np
from faster_whisper import WhisperModel
src, dst = sys.argv[1], sys.argv[2]
model = sys.argv[3] if len(sys.argv) > 3 else "medium"
lang = sys.argv[4] if len(sys.argv) > 4 else "hi"
# decode with ffmpeg (avoids PyAV version issues): 16 kHz mono float32
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(raw, dtype=np.float32)
m = WhisperModel(model, device="cpu", compute_type="int8")
segs, info = m.transcribe(audio, language=lang, word_timestamps=True, beam_size=5)
words = [[round(w.start, 2), round(w.end, 2), w.word.strip()] for s in segs for w in s.words]
json.dump(words, open(dst, "w"), ensure_ascii=False)
print(f"{len(words)} words, {audio.size / 16000:.2f}s")
