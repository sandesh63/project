---
name: divine-stories-studio
description: Make a Divine Stories Studio devotional video (Hindu temple stories, deity avatars) entirely in code — script (Hindi/Hinglish + ElevenLabs tags), code-drawn characters and sets, animation, captions, music/SFX and the final MP4 in 9:16 (Shorts) or 16:9 (long). Use when the user asks for a new story video, a Short, a script, a character, a scene, or changes to the channel's look.
---

# Divine Stories Studio — production skill

Everything is drawn and animated **in code** (SVG → Playwright frames → ffmpeg). No AI image generators.
Every rule below is a **number, not an adjective**. If a value is not listed, copy the closest existing scene.

Project root: `devotional-studio/`. Read these before writing code:
- `engine/art.js` (props, ornaments, particles) · `engine/characters.js` (bodies, poses) · `engine/faces.js` (locked faces)
- `engine/anim.js` (easing, camera, particles, captions) · `engine/render-video.js` (renderer)
- Reference implementations: `videos/tulasi-short/short.js` (9:16), `videos/tulasi-preview/preview.js` (16:9)

---

## 1. Output

| key | Short | Long |
|---|---|---|
| frame | 1080 × 1920 | 1920 × 1080 |
| fps | 30 | 30 |
| length | 50–60 s (+3 s logo at the **end**) | 12–14 min (logo at **0:40**, after the cold open) |
| codec | H.264 CRF 18, yuv420p, AAC 192 kbps | same |
| loudness | −14 LUFS integrated, peaks ≤ −1 dBFS | same |
| safe zone | top 230 px, bottom 360 px free of text | 5 % margin all sides |

## 2. Look

```
style:        ~~cinematic, moody, epic~~   → use the numbers below
art:          flat 2D vector, outline 2.2 px #3b1c0e, gradient fill 3 stops (light 0 / base .5 / shade 1)
rim light:    3 px, blur 2.2, opacity .45–.50, warm #ffe2bd (blue #d8e4ff on Vishnu)
key light:    oil lamp from below-front, glow radius 320–700 px, opacity .35–.85
gold:         5-stop gradient #7a4a10 → #f2c14e → #fff1b8 → #c8891f → #7a4a10 on EVERY ornament
grain:        0.10 opacity, overlay blend, 512 px tile, offset (t·977, t·613) per frame
vignette:     clear to radius .55, edge black .78
mandala halo: radius 520–560, rotation 3–4 °/s, opacity .45–.55
```

**Palette (hex):** maroon #4a1418 · night indigo #141a3a · vermilion #c2311d · saree red #bd201b · peacock green #13784a ·
gold #f2c14e · lamp #ffb347 · Vishnu blue #7486d6 · skin warm #e4aa7c · moon #cfe0ff · dawn #f59a4a / #c0507a.

**Mood → background:** devotion = maroon→indigo + lamp · suspense = indigo + moonlight #9fc0ff · anger = radial #ffcf6a→#e2541e→#7a120c ·
divine = #050a22 + blue glow #5f9bff · hope/ending = dawn sky + 24 sun rays at 8–16 % opacity.

## 3. Characters (locked — never redraw from scratch)

| character | face | body | default expression |
|---|---|---|---|
| Tulasi / Vrinda | `TULASI_FACE` = option **B6** (W 47, chin 124, eye h 13.5, iris #8a4a20) | 7 heads (900 u), slim .88, green blouse + red saree | eyes `open`, mouth `smile` |
| Vishnu | `VISHNU_FACE` = option **V5** (W 48, chin 132, eye h 11, default `lowered`) | 8 heads (960 u), slim .88, blue #7486d6, 4 arms | eyes `lowered`, mouth `smile` |

- Expressions = settings, not drawings: `eyes` ∈ open · lowered · closed · wide · angry; `mouth` ∈ soft · smile · open; `tears` bool; `sad` bool (upturned brows).
- Poses: Tulasi `neutral` | `anjali`; Vishnu default (chakra, shankha, abhaya, varada) | `accept` (lower hands joined).
- New character → add a face preset in `engine/faces.js`, show **5 options + 6 variants** on one sheet, lock the chosen one, then build the body. Always review the sheet against the user's reference images before sending.
- Respect: deities never shown in horror style; violence and self-sacrifice shown only as light, embers or silhouette.

## 4. Shot sizes (world = 1920 × 1080 units)

| shot | character scale | framing |
|---|---|---|
| CU (face + hands) | 3.2 | head top at y 110, face centre y 330–470 |
| MS (bust) | 1.6–1.8 | head at upper third |
| WS (full body) | 0.78–0.93 | feet at y 1000 ± 20 |
| insert (object) | Shaligram 0.4 → 1.25 | centre (960, 600) |

Vertical camera: world height fills the screen (scale 1.778); visible world width 607 u → keep subject within x 960 ± 300.

## 5. Camera (numbers per shot)

```
angle:        eye level, 0° tilt, frontal (art is frontal — never rotate a character in 3D)
push-in:      1.2 % per second (Short) · 0.8 % per second (long); cap 1.25× per shot
punch-in:     +4 % to +7 % over 0.35 s, ease-out, on a reveal word, release over 0.8 s
pan:          ease-in-out, 2.4 s for a 870 u move (door → wall); never faster than 400 u/s
sway:         ±8 u horizontal, period 21 s (sin(t·0.3)) on calm close-ups
shake:        only anger / curse: amplitude ramps 0 → 7–9 px over 1.0–5.9 s, noise at 6× speed
focus point:  face y 380–470 on CU; move focus ≤ 130 u per shot
```

## 6. Motion & effects

```
flame flicker:   offset = noise(t)·3–4 px (sum of sines 7.3 / 13.1 / 23.7 Hz)
petals:          18–34 pieces, fall 45–60 u/s, sway 20–60 u, spin 40–160 °/s, 70 % marigold #f39a1e
embers:          40–90 pieces, rise 20–50 u/s (calm) · 100–160 u/s (anger), radius 0.8–3.4, twinkle 3 Hz
shield rings:    3 rings, period 1.8 s, radius +260 u, stroke 6 → 0 px
eye change:      closed → lowered (0.25 s) → open, on the exact spoken word
blink:           0.12 s closed every 3.5–5 s on long holds
stone turn:      saturation 1 → 0 and brightness 1 → .45 over 1.2 s, then scale 1 → .55 and fade over 0.9 s
plant growth:    grow .12 → 1 over 2.0 s, ease-out
```

## 7. Transitions

```
crossfade:        0.30 s (Short) · 0.40 s (long) — default
dip to black:     0.35 s out + 0.35 s in — mood change (temple → night)
white flash:      triangular, half-width 0.22 s, peak .8–1.0 — curse / transformation only (max 3 per Short)
cut on flash:     hide hard cuts under a flash peak
logo sting:       3.0 s (brand/divine_stories_studio_logo_9x16.mp4 or _16x9.mp4)
```

## 8. Text

| element | Short | Long |
|---|---|---|
| caption font | Noto Serif Devanagari 800, 66 px | Cinzel 50 px (Latin) / Noto Serif Devanagari 800, 54 px |
| position | centre y 1440, line height 92, max 22 chars/line | baseline y = H − 78 |
| stroke | 10 px #120604 | 8 px #140804 |
| highlight | 1–2 key words per line, #ffd66b (`★word★`) | same |
| timing | appear 0.08 s before the word, pop .9 → 1 in 0.2 s, fade 0.2 s after the phrase | fade .35 s |
| hook title | 84 px gold, y 210, 0.25–5.5 s, dark top band 330 px | — |
| emphasis | reveal words at 1.15–1.35× size | — |

## 9. Audio

```
voice:        ElevenLabs — Short: Eleven v3/v4 with audio tags; long: Multilingual v2 with <break> tags
              settings v2: stability 45, similarity 75, style 35, speaker boost on, speed 0.95
music bed:    tanpura drone (Pa-Sa-Sa-Sa, pluck every 0.85–0.9 s) + pad, −18 dB under voice, −24 dB at suspense
SFX:          bell on scene opens (−6 dB), heartbeat 6 thumps before a reveal, swell 1.5 s into a hit, boom on the curse,
              shimmer (24 bells 1.2–3.6 kHz, −24 dB) on transformations; 0.8–1.2 s of near-silence before the biggest line
reverb:       1.8 s exponential tail, wet 25 %
sync:         time every visual beat to the voice: measure pauses with ffmpeg silencedetect (−38 dB, 0.28 s; −34 dB, 0.12 s inside long phrases)
```

## 10. Script formula

**Short (50–60 s, 130–150 Hindi words):**
1. 0–3 s **question hook** ("क्या आप जानते हैं…") + on-screen hook title.
2. 3–12 s who + one surprising fact (name the hero on a beat).
3. 12–21 s the power / stakes (why it matters).
4. 21–33 s the twist, revealed visually (shadow, reflection, sign) — 1 reveal word.
5. 33–47 s the emotional peak (tears → curse/boon), quote line in the character's voice.
6. 47–51 s consequence in one sentence.
7. 51–56 s **open loop** ("लेकिन क्यों?") + CTA ("पूरी कथा देखिए — लिंक नीचे है"). Never give the ending.

**Long (12–14 min, ~130 words/min):** cold open 40 s (end of story as a mystery) → logo + one-line intro 15 s →
7 chapters × 80–100 s (origin · hero · rise · conflict · twist · climax · transformation) → meaning & ritual today 70 s →
shloka with transliteration + meaning 20 s → outro + comment prompt ("जय …") 30 s.
State once that Purana versions differ. Each block: VISUAL (English) · HINGLISH · HINDI.

**ElevenLabs tags (v3):** `[softly] [mysterious] [whispers] [slowly] [reverent] [tense] [sad] [sighs] [angry] [crying] [curious] [warmly] [pause] [short pause] [long pause] [dramatic pause]`.
No emojis in the voice text. Give the hero's quoted line a separate voice when possible.

## 11. Workflow

1. Script → `scripts/<story>/short.md` + `long_video.md` (both languages + ElevenLabs version).
2. New characters → face options sheet → user picks → lock in `engine/faces.js`.
3. Get the voice file → measure pauses → write the caption table `[start, end, text]`.
4. Write `videos/<story>-short/short.js` (scenes keyed to caption times) and `make_music.py`.
5. Check frames: render 10 stills (`--from t --to t+0.034`), contact sheet, fix, repeat.
6. Full render: `node engine/render-video.js videos/<story>-short/short.js <framesDir>` (≈ 3.5 frames/s on 4 workers).
7. Mix: `ffmpeg -i frames/f%05d.jpg -i voice.mp3 -i music.wav` → voice 0 dB, music −18 dB → append the logo sting → `loudnorm=I=-14:TP=-1`.
8. Spot-check 3 frames from the MP4 (first second, the reveal, the last second) before sending.

## 12. QC checklist (all must pass)

- [ ] every on-screen change lands within ±0.1 s of its spoken word
- [ ] no text in the safe zones; captions never cover the face's eyes
- [ ] no black edges when the camera moves (backgrounds drawn oversized: x −800 … 2720, y −800 … 1880)
- [ ] character matches the locked face + costume; expressions read at phone size
- [ ] max 3 white flashes; no flicker under 0.1 s
- [ ] audio −14 LUFS, voice clearly above music, no clipping
