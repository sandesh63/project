#!/usr/bin/env bash
# Render the whole Tulasi Devi long video: frames → per-part MP4 (voice + SFX, no music) → join with logo.
# usage: bash videos/tulasi-long/render_all.sh <workDir> [parts...]
set -e
cd "$(dirname "$0")/../.."
WORK=${1:?workdir}; shift
PARTS=${@:-01 02 03 04 05 06 07 08 09 10 11 12}
mkdir -p "$WORK"
for p in $PARTS; do
  echo "== part $p"
  rm -rf "$WORK/f$p"
  node engine/render-video.js videos/tulasi-long/part$p.js "$WORK/f$p" | tail -1
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 videos/tulasi-long/voice/part$p.mp3)
  ffmpeg -v error -y -framerate 30 -i "$WORK/f$p/f%05d.jpg" -i videos/tulasi-long/voice/part$p.mp3 -i videos/tulasi-long/sfx/part$p.wav \
    -filter_complex "[1:a]aresample=44100,aformat=channel_layouts=stereo,apad[v];[2:a]volume=0.16[s];[v][s]amix=inputs=2:duration=longest:normalize=0,atrim=0:$D,apad=pad_dur=0.5[a];[0:v]tpad=stop_mode=clone:stop_duration=0.5,format=yuv420p[vv]" \
    -map "[vv]" -map "[a]" -t $(python3 -c "print($D+0.5)") -c:v libx264 -preset medium -crf 19 -c:a pcm_s16le -ar 44100 "$WORK/part$p.mkv"
done
# silent logo, 16:9
ffmpeg -v error -y -i brand/divine_stories_studio_logo_16x9.mp4 -f lavfi -t 3 -i anullsrc=r=44100:cl=stereo -map 0:v -map 1:a -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -r 30 -c:a pcm_s16le -shortest "$WORK/logo.mkv"
LIST="$WORK/list.txt"; : > "$LIST"
for p in 01 logo 02 03 04 05 06 07 08 09 10 11 12; do
  if [ "$p" = logo ]; then echo "file '$WORK/logo.mkv'" >> "$LIST"; else [ -f "$WORK/part$p.mkv" ] && echo "file '$WORK/part$p.mkv'" >> "$LIST"; fi
done
ffmpeg -v error -y -f concat -safe 0 -i "$LIST" -af loudnorm=I=-14:TP=-1:LRA=11 -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart videos/tulasi-long/tulasi_devi_long_video.mp4
ffprobe -v error -show_entries format=duration,size -of compact videos/tulasi-long/tulasi_devi_long_video.mp4
echo ALL DONE
