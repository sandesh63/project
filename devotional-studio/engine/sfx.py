# Sound-effects track (no music) from a JSON cue list.
# usage: python3 engine/sfx.py cues.json out.wav DURATION
# cue: {"t": seconds, "type": bell|chime|whoosh|boom|shimmer|fire|waves|thunder|heartbeat|swell|crack|wind|cry, "gain": 0..1, "dur": s, "f": Hz}
import json, sys, wave
import numpy as np
SR = 44100
cues = json.load(open(sys.argv[1])); DUR = float(sys.argv[3])
n = int(SR * DUR); out = np.zeros((n, 2)); rng = np.random.default_rng(9)

def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR); j = min(n, i + len(sig))
    if j <= i or i < 0: return
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    out[i:j, 0] += sig[:j - i] * gain * l; out[i:j, 1] += sig[:j - i] * gain * r
def tt(d): return np.arange(int(d * SR)) / SR
def lp(x, k):  # crude low-pass: moving average of k samples
    return np.convolve(x, np.ones(k) / k, 'same')
def bell(f, d=4.0):
    t = tt(d); s = np.zeros_like(t)
    for ratio, amp, dec in [(1, 1, 3.2), (2.0, .55, 2.0), (2.76, .5, 1.6), (5.4, .3, .9), (8.93, .18, .5), (.5, .35, 3.6)]:
        s += amp * np.sin(2 * np.pi * f * ratio * t + rng.random()) * np.exp(-t / dec)
    return s * np.minimum(1, t / .003) / 3
def whoosh(d=.6):
    t = tt(d); x = lp(rng.normal(0, 1, len(t)), 12); env = np.sin(np.pi * t / d) ** 2
    return x * env * .7
def boom(d=2.4):
    t = tt(d); return (np.sin(2 * np.pi * (85 * np.exp(-t * 1.5) + 32) * t) * np.exp(-t / .9) + rng.normal(0, 1, len(t)) * np.exp(-t / .12) * .5)
def shimmer(d=2.0):
    s = np.zeros(int(d * SR))
    for _ in range(18):
        b = bell(1200 + rng.random() * 2400, 1.6) * .25; st = int(rng.random() * (d - .6) * SR); s[st:st + len(b)] += b[:len(s) - st]
    return s
def fire(d=3.0):
    t = tt(d); x = lp(rng.normal(0, 1, len(t)), 30) * 2.2
    crack = np.zeros_like(t)
    for _ in range(int(d * 14)):
        p = int(rng.random() * (len(t) - 600)); crack[p:p + 600] += rng.normal(0, 1, 600) * np.exp(-np.arange(600) / 80) * .8
    env = np.minimum(1, t / .4) * np.minimum(1, (d - t) / .5)
    return (x + crack) * env * .6
def waves(d=4.0):
    t = tt(d); x = lp(rng.normal(0, 1, len(t)), 60) * 3
    env = (.55 + .45 * np.sin(2 * np.pi * t / 3.2)) * np.minimum(1, t / .8) * np.minimum(1, (d - t) / .8)
    return x * env * .7
def thunder(d=3.0):
    t = tt(d); x = lp(rng.normal(0, 1, len(t)), 80) * 4
    return x * np.exp(-t / 1.0) * np.minimum(1, t / .05)
def heartbeat(d=.35):
    t = tt(d); return np.sin(2 * np.pi * (60 - 25 * t) * t) * np.exp(-t / .09)
def swell(d=1.6):
    t = tt(d); return lp(rng.normal(0, 1, len(t)), 40) * 2 * (t / d) ** 2.2
def crack(d=.8):
    t = tt(d); s = np.zeros_like(t)
    for k in range(6):
        p = int(k * .09 * SR); s[p:p + 900] += rng.normal(0, 1, 900) * np.exp(-np.arange(900) / 120)
    return s * .9 + np.sin(2 * np.pi * 70 * t) * np.exp(-t / .2) * .5
def wind(d=3.0):
    t = tt(d); x = lp(rng.normal(0, 1, len(t)), 20)
    return x * (.5 + .5 * np.sin(2 * np.pi * t / 1.7)) * np.minimum(1, t / .5) * np.minimum(1, (d - t) / .5) * 1.4
def cry(d=1.2):  # soft infant-like wail (pitched vowel), kept gentle
    t = tt(d); f0 = 420 + 80 * np.sin(2 * np.pi * 1.4 * t)
    ph = 2 * np.pi * np.cumsum(f0) / SR
    s = sum(np.sin(k * ph) / k for k in range(1, 7))
    return s * np.sin(np.pi * t / d) ** 1.5 * .35

GEN = dict(bell=lambda c: bell(c.get('f', 523.25), c.get('dur', 4)), chime=lambda c: bell(c.get('f', 1046.5), c.get('dur', 2.5)),
           whoosh=lambda c: whoosh(c.get('dur', .6)), boom=lambda c: boom(c.get('dur', 2.4)), shimmer=lambda c: shimmer(c.get('dur', 2)),
           fire=lambda c: fire(c.get('dur', 3)), waves=lambda c: waves(c.get('dur', 4)), thunder=lambda c: thunder(c.get('dur', 3)),
           heartbeat=lambda c: heartbeat(), swell=lambda c: swell(c.get('dur', 1.6)), crack=lambda c: crack(c.get('dur', .8)),
           wind=lambda c: wind(c.get('dur', 3)), cry=lambda c: cry(c.get('dur', 1.2)))
for c in cues:
    add(GEN[c['type']](c), c['t'], c.get('gain', .5), c.get('pan', 0))

irL = int(1.4 * SR); ir = rng.normal(0, 1, irL) * np.exp(-np.arange(irL) / SR / .45); ir[0] = 0
def conv(a, h):
    N = 1 << int(np.ceil(np.log2(len(a) + len(h)))); return np.fft.irfft(np.fft.rfft(a, N) * np.fft.rfft(h, N), N)[:len(a)]
if np.max(np.abs(out)) > 0:
    wet = np.stack([conv(out[:, 0], ir), conv(out[:, 1], ir)], 1)
    out = out + wet * (.2 / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(out)))
    out = out / np.max(np.abs(out)) * .7
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print('sfx ok', len(cues), 'cues')
