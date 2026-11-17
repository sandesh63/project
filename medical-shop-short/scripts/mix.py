#!/usr/bin/env python3
"""Mix voice + Epidemic music + SFX for the Short and mux onto the silent render.

Voice on top; music ~10 LU under it and side-chain ducked by the voice; SFX -6 dB;
market ambience under hook and CTA; two-pass loudnorm to -14 LUFS / -1.5 dBTP.
Usage: python3 scripts/mix.py out/short-silent.mp4 out/final.mp4
"""
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / 'public'
TL = (ROOT / 'src/v3/timeline.ts').read_text()
DUR = float(re.search(r'export const DURATION = ([\d.]+)', TL).group(1))
SFX = [(m[0], float(m[1]), float(m[2])) for m in re.findall(r"\{file: '(\w+)', at: ([\d.]+), vol: ([\d.]+)\}", TL)]
MUSIC = PUB / 'music2.mp3'

VOICE_GAIN_DB = 7.0     # VO is ~-22 LUFS -> ~-15
MUSIC_GAIN_DB = -14.0   # music is ~-12 LUFS -> ~-26 (about 10-11 LU under voice)
SFX_GAIN_DB = -6.0

def build(extra_out):
    inputs = ['-i', str(PUB / 'vo.mp3'), '-i', str(MUSIC), '-i', str(PUB / 'sfx/market.mp3')]
    for f, _, _ in SFX:
        inputs += ['-i', str(PUB / f'sfx/{f}.mp3')]
    fc = []
    fc.append(f'[0:a]aresample=48000,volume={VOICE_GAIN_DB}dB,apad=whole_dur={DUR},asplit=2[vo][key]')
    fc.append(f'[1:a]aresample=48000,atrim=0:{DUR},volume={MUSIC_GAIN_DB}dB,'
              f'afade=t=in:d=0.4,afade=t=out:st={DUR-1.6}:d=1.6[mus]')
    fc.append('[mus][key]sidechaincompress=threshold=0.04:ratio=3:attack=25:release=350:makeup=1[musd]')
    # ambience: hook 0-5 s and CTA 62.15 s-end
    fc.append(f'[2:a]aresample=48000,asplit=2[am1][am2]')
    fc.append(f'[am1]atrim=0:5,afade=t=out:st=4.4:d=0.6,volume=-12dB[amb1]')
    cta = 62.15
    fc.append(f'[am2]atrim=30:{30+DUR-cta},asetpts=PTS-STARTPTS,afade=t=in:d=0.5,volume=-13dB,'
              f'adelay={int(cta*1000)}|{int(cta*1000)}[amb2]')
    sfx_labels = []
    for i, (f, at, vol) in enumerate(SFX):
        d = int(at * 1000)
        lab = f's{i}'
        fc.append(f'[{3+i}:a]aresample=48000,volume={vol:.3f},volume={SFX_GAIN_DB}dB,adelay={d}|{d}[{lab}]')
        sfx_labels.append(f'[{lab}]')
    n = 4 + len(sfx_labels)
    fc.append(f'[vo][musd][amb1][amb2]{"".join(sfx_labels)}amix=inputs={n}:normalize=0:duration=first,'
              f'atrim=0:{DUR}{extra_out}')
    return inputs, ';'.join(fc)

def main():
    silent, final = sys.argv[1], sys.argv[2]
    tmp = ROOT / 'out/mix_raw.wav'
    inputs, fc = build('[mix]')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', fc, '-map', '[mix]', '-ac', '2', str(tmp)], check=True)
    # loudnorm pass 1
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', str(tmp), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json', '-f', 'null', '-'],
                       capture_output=True, text=True)
    st = json.loads(r.stderr[r.stderr.rindex('{'):r.stderr.rindex('}') + 1])
    ln = (f"loudnorm=I=-14:TP=-1.5:LRA=7:measured_I={st['input_i']}:measured_TP={st['input_tp']}:"
          f"measured_LRA={st['input_lra']}:measured_thresh={st['input_thresh']}:offset={st['target_offset']}:linear=true")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', silent, '-i', str(tmp), '-af', ln + ',aresample=48000',
                    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', final], check=True)
    print('mixed ->', final, '| pre-norm', st['input_i'], 'LUFS')

if __name__ == '__main__':
    main()
