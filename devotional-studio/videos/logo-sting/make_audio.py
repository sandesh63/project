# 3 s sting sound: rising shimmer -> temple bell + low gong at the reveal -> sparkle -> tail.
import numpy as np, wave, sys
SR = 44100; DUR = 3.0; n = int(SR * DUR); t = np.arange(n) / SR
out = np.zeros((n, 2)); rng = np.random.default_rng(11)

def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR); j = min(n, i + len(sig))
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    out[i:j, 0] += sig[:j - i] * gain * l; out[i:j, 1] += sig[:j - i] * gain * r

def bell(f, dur, decs=(2.5, 1.6, 1.3, .8, .5)):
    L = int(dur * SR); tt = np.arange(L) / SR; s = np.zeros(L)
    for ratio, amp, dec in zip((1, 2.0, 2.76, 5.4, 8.93), (1, .55, .5, .3, .18), decs):
        s += amp * np.sin(2 * np.pi * f * ratio * tt + rng.random()) * np.exp(-tt / dec)
    return s * np.minimum(1, tt / .003) / 3

# rising shimmer (0 -> 1.0 s)
L = int(1.05 * SR); tt = np.arange(L) / SR; sh = np.zeros(L)
for k in range(12):
    f0 = 600 + k * 180
    sh += np.sin(2 * np.pi * (f0 * tt + 300 * tt ** 2)) * (.5 + .5 * np.sin(tt * (9 + k)))
sh *= (tt / 1.05) ** 2.5 / 12
add(sh, 0.0, .55)
# reveal hit at 1.0 s: low gong + bell + chime
L = int(2.0 * SR); tt = np.arange(L) / SR
gong = np.sin(2 * np.pi * 65.4 * tt) * np.exp(-tt / 1.1) + .5 * np.sin(2 * np.pi * 98 * tt) * np.exp(-tt / .8)
add(gong * .7, 1.0, .9)
add(bell(523.25, 2.0), 1.0, .7, -.15)
add(bell(1046.5, 2.0), 1.02, .35, .2)
# sparkle with the light sweep
for i in range(18):
    add(bell(1800 + rng.random() * 2600, .9, (.4, .3, .25, .2, .15)), 1.5 + rng.random() * .7, .06, rng.random() * 2 - 1)
# tail fade
out *= np.clip((DUR - t) / .5, 0, 1)[:, None]
irL = int(1.2 * SR); ir = rng.normal(0, 1, irL) * np.exp(-np.arange(irL) / SR / .45); ir[0] = 0
def conv(x, h):
    N = 1 << int(np.ceil(np.log2(len(x) + len(h))))
    return np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(h, N), N)[:len(x)]
wet = np.stack([conv(out[:, 0], ir), conv(out[:, 1], ir)], 1)
mix = out + wet * (.3 / np.max(np.abs(wet)) * np.max(np.abs(out)))
mix *= np.clip((DUR - t) / .3, 0, 1)[:, None]
mix = mix / np.max(np.abs(mix)) * .89
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('audio ok')
