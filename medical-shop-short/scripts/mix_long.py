#!/usr/bin/env python3
"""Long video mix: VO on top, looped Epidemic music ducked under it, SFX -6 dB, loudnorm -14 LUFS / -1.5 dBTP.
Usage: python3 scripts/mix_long.py out/long_silent.mp4 out/long_final.mp4"""
import json, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / 'public'
CL = json.load(open(ROOT / 'src/long/clauses.json'))
at = lambda n: CL[n - 1]['t0']
DUR = 314.2

SFX = []
add = lambda f, t, v=0.6: SFX.append((f, round(t, 2), v))
# section transitions
for n in [5, 7, 11, 21, 28, 35, 44, 49, 53, 57]:
    add('whoosh', at(n) - 0.35, 0.45)
add('pop', at(2) + 0.6); add('pop', at(3) + 1.5)
add('vehicle', at(6) - 0.2, 0.3)
add('pop', at(8) + 0.2); add('kaching', at(8) + 3.9, 0.5); add('pop', at(9) + 0.6)
for n, d in [(13, .3), (15, .3), (16, .3), (18, .3)]: add('pop', at(n) + d)
add('kaching', at(19) + 0.5, 0.55)
add('lock', at(23) + 1.0, 0.6)            # licence stamp
add('pop', at(24) + 1); add('pop', at(26) + 1.2); add('pop', at(26) + 3.5); add('pop', at(26) + 5.2)
add('coins', at(29) + 0.3, 0.5); add('kaching', at(32) + 0.6, 0.55)
for n in [35, 36, 37, 38]: add('paper', at(n), 0.6)
add('paper', at(39), 0.5); add('pop', at(41)); add('kaching', at(43) + 1.2, 0.5)
add('suspense', at(44) - 0.2, 0.5); add('chime', at(45) + 4.5, 0.5); add('chime', at(47) + 0.8, 0.45)
add('chime', at(49) + 0.3, 0.45)
for d in [3.2, 4.6, 6.0, 8.2, 10.3]: add('pop', at(49) + d, 0.5)
for d in [1.6, 3.4, 5.2]: add('pop', at(51) + d, 0.5)
add('chime', at(52), 0.45)
for d in [0.3, 2.4, 4.2, 6.0]: add('pop', at(54) + d, 0.5)
add('chime', at(56) + 0.5, 0.45); add('chime', at(63) + 0.5, 0.5)

def main():
    silent, final = sys.argv[1], sys.argv[2]
    raw = ROOT / 'out/mix_long_raw.wav'
    music = ROOT / 'out/music_long.wav'
    # loop the 127 s track three times with 4 s crossfades, trim to length
    m = str(PUB / 'music2.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', m, '-i', m, '-i', m, '-filter_complex',
                    '[0][1]acrossfade=d=4:c1=tri:c2=tri[a];[a][2]acrossfade=d=4:c1=tri:c2=tri,'
                    f'atrim=0:{DUR},afade=t=in:d=0.6,afade=t=out:st={DUR-2.5}:d=2.5', str(music)], check=True)
    inputs = ['-i', str(PUB / 'vo_long.mp3'), '-i', str(music), '-i', str(PUB / 'sfx/market.mp3')]
    for f, _, _ in SFX:
        inputs += ['-i', str(PUB / f'sfx/{f}.mp3')]
    fc = [f'[0:a]aresample=48000,volume=8dB,apad=whole_dur={DUR},asplit=2[vo][key]',
          '[1:a]aresample=48000,volume=-14dB[mus]',
          '[mus][key]sidechaincompress=threshold=0.04:ratio=3:attack=25:release=350[musd]',
          f'[2:a]aresample=48000,atrim=0:{at(5)},afade=t=out:st={at(5)-1}:d=1,volume=-13dB[amb]']
    labs = []
    for i, (f, t, v) in enumerate(SFX):
        d = int(max(0, t) * 1000)
        fc.append(f'[{3+i}:a]aresample=48000,volume={v},volume=-6dB,adelay={d}|{d}[s{i}]')
        labs.append(f'[s{i}]')
    fc.append(f'[vo][musd][amb]{"".join(labs)}amix=inputs={3+len(labs)}:normalize=0:duration=first,atrim=0:{DUR}[mix]')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(fc), '-map', '[mix]', '-ac', '2', str(raw)], check=True)
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', str(raw), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, text=True)
    st = json.loads(r.stderr[r.stderr.rindex('{'):r.stderr.rindex('}') + 1])
    ln = (f"loudnorm=I=-14:TP=-1.5:LRA=7:measured_I={st['input_i']}:measured_TP={st['input_tp']}:"
          f"measured_LRA={st['input_lra']}:measured_thresh={st['input_thresh']}:offset={st['target_offset']}:linear=true")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', silent, '-i', str(raw), '-af', ln + ',aresample=48000',
                    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', final], check=True)
    print('mixed ->', final, '| pre-norm', st['input_i'], 'LUFS |', len(SFX), 'sfx')

if __name__ == '__main__':
    main()
