# Music bed + SFX for the Tulasi Short, timed to the voice-over events (seconds).
import numpy as np, wave, sys
SR = 44100; DUR = 55.8; n = int(SR * DUR); t = np.arange(n) / SR
out = np.zeros((n, 2)); rng = np.random.default_rng(5)
def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR); j = min(n, i + len(sig))
    if j <= i: return
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    out[i:j, 0] += sig[:j - i] * gain * l; out[i:j, 1] += sig[:j - i] * gain * r
def pluck(f, dur=3.2):
    L = int(dur * SR); tt = np.arange(L) / SR; s = np.zeros(L)
    for k in range(1, 16): s += np.sin(2 * np.pi * f * k * tt * (1 + .0004 * k)) * (1 / k ** .8) * np.exp(-tt / (dur / (1 + k * .18)))
    return s * np.minimum(1, tt / .01) / 6
def bell(f, dur=4.5):
    L = int(dur * SR); tt = np.arange(L) / SR; s = np.zeros(L)
    for ratio, amp, dec in [(1, 1, 3.5), (2.0, .55, 2.2), (2.76, .5, 1.8), (5.4, .3, 1.0), (8.93, .18, .6), (.5, .35, 4.0)]:
        s += amp * np.sin(2 * np.pi * f * ratio * tt + rng.random()) * np.exp(-tt / dec)
    return s * np.minimum(1, tt / .003) / 3
SA, PA = 130.81, 98.0; pat = [PA, SA * 2, SA * 2, SA]
k = 0; x = .4
while x < DUR - 1:
    g = .55
    if 21 <= x < 32.5: g = .38            # suspense at the door
    if 43.0 <= x < 45.4: g = .15          # silence around the curse hit
    add(pluck(pat[k % 4]), x, g, -.3 if k % 2 else .3); x += .9; k += 1
pad = (np.sin(2 * np.pi * SA * t) + .6 * np.sin(2 * np.pi * SA * 1.5 * t) + .4 * np.sin(2 * np.pi * SA * 2 * t)) * (.5 + .5 * np.sin(2 * np.pi * .12 * t))
env = np.clip(t / 2, 0, 1) * np.clip((DUR - t) / 1.5, 0, 1)
out[:, 0] += pad * env * .04; out[:, 1] += pad * env * .04
add(bell(523.25), .1, .5, -.2); add(bell(392.0), 12.7, .4, .3); add(bell(659.25), 49.7, .45); add(bell(783.99, 5), 51.85, .4, .2); add(bell(1046.5, 5), 52.0, .2, -.3)
for tb in [28.6, 28.9, 29.7, 30.0, 30.7, 31.0]:
    L = int(.35 * SR); tt = np.arange(L) / SR; add(np.sin(2 * np.pi * (60 - 25 * tt) * tt) * np.exp(-tt / .09), tb, .9)
L = int(1.6 * SR); tt = np.arange(L) / SR; hit = np.sin(2 * np.pi * (70 * np.exp(-tt * 2) + 40) * tt) * np.exp(-tt / .6); add(hit, 31.30, .8)
L = int(1.5 * SR); tt = np.arange(L) / SR; sw = np.convolve(rng.normal(0, 1, L), np.ones(40) / 40, 'same') * (tt / 1.5) ** 2.2; add(sw, 42.35, .8)
L = int(2.6 * SR); tt = np.arange(L) / SR; boom = np.sin(2 * np.pi * (85 * np.exp(-tt * 1.5) + 32) * tt) * np.exp(-tt / .9) + rng.normal(0, 1, L) * np.exp(-tt / .12) * .5; add(boom, 43.84, 1.0)
for i in range(24): add(bell(1200 + rng.random() * 2400, 2.2), 47.6 + rng.random() * 1.3, .06, rng.random() * 2 - 1)
irL = int(1.8 * SR); ir = rng.normal(0, 1, irL) * np.exp(-np.arange(irL) / SR / .55); ir[0] = 0
def conv(a, h):
    N = 1 << int(np.ceil(np.log2(len(a) + len(h)))); return np.fft.irfft(np.fft.rfft(a, N) * np.fft.rfft(h, N), N)[:len(a)]
wet = np.stack([conv(out[:, 0], ir), conv(out[:, 1], ir)], 1)
mix = out + wet * (.25 / np.max(np.abs(wet)) * np.max(np.abs(out)))
mix = mix / np.max(np.abs(mix)) * .89
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('music ok')
