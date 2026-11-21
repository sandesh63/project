# Synthesised soundtrack for the Tulasi preview: tanpura-style drone, temple bells, curse hit, shimmer.
import numpy as np, wave, sys
SR = 44100; DUR = 20.0
n = int(SR * DUR); t = np.arange(n) / SR
out = np.zeros((n, 2))
rng = np.random.default_rng(7)

def env_exp(length, decay):
    tt = np.arange(length) / SR
    return np.exp(-tt / decay)

def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR); j = min(n, i + len(sig))
    if j <= i: return
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    out[i:j, 0] += sig[:j - i] * gain * l; out[i:j, 1] += sig[:j - i] * gain * r

def pluck(f, dur=3.2):
    L = int(dur * SR); tt = np.arange(L) / SR; s = np.zeros(L)
    for k in range(1, 18):  # bright jawari-like harmonic series
        s += np.sin(2 * np.pi * f * k * tt * (1 + .0004 * k)) * (1 / k ** .8) * np.exp(-tt / (dur / (1 + k * .18)))
    s *= np.minimum(1, tt / .01)
    return s / 6

def bell(f, dur=4.5):
    L = int(dur * SR); tt = np.arange(L) / SR; s = np.zeros(L)
    for ratio, amp, dec in [(1, 1, 3.5), (2.0, .55, 2.2), (2.76, .5, 1.8), (5.4, .3, 1.0), (8.93, .18, .6), (.5, .35, 4.0)]:
        s += amp * np.sin(2 * np.pi * f * ratio * tt + rng.random()) * np.exp(-tt / dec)
    s *= np.minimum(1, tt / .003)
    return s / 3

# --- tanpura drone (Pa Sa Sa Sa_low), darker in the doorway scene
SA = 130.81; PA = 98.0
pattern = [PA, SA * 2, SA * 2, SA]
k = 0; tt0 = 0.6
while tt0 < DUR:
    g = .5 if 8 <= tt0 < 12 else .7
    if 13.6 <= tt0 < 14.6: g = .25
    add(pluck(pattern[k % 4]), tt0, g, pan=(-.3 if k % 2 else .3))
    tt0 += 0.85; k += 1
# --- soft pad
pad = (np.sin(2 * np.pi * SA * t) + .6 * np.sin(2 * np.pi * SA * 1.5 * t) + .4 * np.sin(2 * np.pi * SA * 2 * t)) * (.5 + .5 * np.sin(2 * np.pi * .15 * t))
padEnv = np.clip(t / 2.0, 0, 1) * np.where((t > 8) & (t < 12), .6, 1.0) * np.clip((20 - t) / 1.2, 0, 1)
out[:, 0] += pad * padEnv * .05; out[:, 1] += pad * padEnv * .05
# --- bells
add(bell(523.25), .25, .55, -.2)        # lamp lights
add(bell(392.0), 4.0, .45, .3)          # temple
add(bell(659.25), 16.05, .5, -.1)       # dawn
add(bell(783.99, 5.5), 17.4, .45, .2)   # title
add(bell(1046.5, 5.5), 17.55, .25, -.3)
# --- heartbeat thumps in the doorway scene
for tb in [9.3, 9.6, 10.4, 10.7, 11.4, 11.7]:
    L = int(.35 * SR); tt = np.arange(L) / SR
    add(np.sin(2 * np.pi * (60 - 25 * tt) * tt) * np.exp(-tt / .09), tb, .9)
# --- rising swell into the curse, then the hit
L = int(1.6 * SR); tt = np.arange(L) / SR
sw = rng.normal(0, 1, L); sw = np.convolve(sw, np.ones(40) / 40, 'same') * (tt / 1.6) ** 2.2
add(sw, 12.22, .9)
L = int(2.6 * SR); tt = np.arange(L) / SR
boom = np.sin(2 * np.pi * (85 * np.exp(-tt * 1.5) + 32) * tt) * np.exp(-tt / .9)
boom += rng.normal(0, 1, L) * np.exp(-tt / .12) * .5
add(boom, 13.8, 1.1)
# --- transformation shimmer
for i in range(26):
    add(bell(1200 + rng.random() * 2400, 2.2), 14.9 + rng.random() * .9, .07, rng.random() * 2 - 1)

# --- simple reverb (exponential noise IR, FFT convolution)
irL = int(1.8 * SR); ir = rng.normal(0, 1, irL) * np.exp(-np.arange(irL) / SR / .55); ir[0] = 0
def conv(x, h):
    N = 1 << int(np.ceil(np.log2(len(x) + len(h))))
    return np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(h, N), N)[:len(x)]
wet = np.stack([conv(out[:, 0], ir), conv(out[:, 1], ir[::-1].copy() if False else ir)], 1)
mix = out + wet * (0.25 / np.max(np.abs(wet)) * np.max(np.abs(out)))
mix *= np.clip((DUR - t) / 1.0, 0, 1)[:, None]
mix = mix / np.max(np.abs(mix)) * .89
data = (mix * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
print('audio ok')
