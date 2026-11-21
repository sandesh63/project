#!/usr/bin/env bash
# Re-mix voice + SFX onto already-rendered part videos (no frame re-render), then re-join with the silent logo.
# usage: bash videos/tulasi-long/remix_audio.sh <workDir>   (workDir from render_all.sh, containing partNN.mkv + logo.mkv)
set -e
cd "$(dirname "$0")/../.."
WORK=${1:?workdir}
for p in 01 02 03 04 05 06 07 08 09 10 11 12; do
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 videos/tulasi-long/voice/part$p.mp3)
  ffmpeg -v error -y -i "$WORK/part$p.mkv" -i videos/tulasi-long/voice/part$p.mp3 -i videos/tulasi-long/sfx/part$p.wav \
    -filter_complex "[1:a]aresample=44100,aformat=channel_layouts=stereo,apad[v];[2:a]volume=0.32[s];[v][s]amix=inputs=2:duration=longest:normalize=0,atrim=0:$D,apad=pad_dur=0.5[a]" \
    -map 0:v -map "[a]" -t $(python3 -c "print($D+0.5)") -c:v copy -c:a pcm_s16le -ar 44100 "$WORK/remix$p.mkv"
done
LIST="$WORK/list_remix.txt"; : > "$LIST"
for p in 01 logo 02 03 04 05 06 07 08 09 10 11 12; do
  if [ "$p" = logo ]; then echo "file '$WORK/logo.mkv'" >> "$LIST"; else echo "file '$WORK/remix$p.mkv'" >> "$LIST"; fi
done
ffmpeg -v error -y -f concat -safe 0 -i "$LIST" -af loudnorm=I=-14:TP=-1:LRA=11 -c:v copy -c:a aac -b:a 192k -movflags +faststart videos/tulasi-long/tulasi_devi_long_video.mp4
ffprobe -v error -show_entries format=duration,size -of compact videos/tulasi-long/tulasi_devi_long_video.mp4
