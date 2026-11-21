# Divine Stories Studio — handoff notes (read this first in a new session)

Branch: `claude/tulasi-devi-video-y4yqmi` on `sandesh63/project`. Skill: `.claude/skills/divine-stories-studio/SKILL.md`.

## Locked designs (all code-drawn, final)
| character | file | notes |
|---|---|---|
| Tulasi / Vrinda | `engine/characters.js` `tulasi()` | face B6 (`engine/faces.js` TULASI_FACE) |
| Vishnu | `engine/characters.js` `vishnu()` | face V5 (VISHNU_FACE) |
| Mahadev | `style-frames/mahadev-v2.js` `mahadevFull()` | face M5, fit build +15%, one snake (3 neck coils, hood on his right shoulder) |
| Jalandhar | `style-frames/jalandhar.js` `jalandharFull()` | face J1, asura: fangs, pointed ears, full gold cuirass, cape, mace |
| Rishi | `style-frames/rishi-indra.js` `rishi()` | approved |
| Indra | `style-frames/rishi-indra.js` `indra()` | body +15%, plain blue silk tunic, vajra, clouds |
| Narada | `style-frames/narada-parvati.js` `narada()` | awaiting approval: top-knot with flowers, veena, white dhoti, saffron sash |
| Samudra Dev | `style-frames/samudra-baby.js` `samudra()` | awaiting approval: teal ocean god, shell crown, pearls, conch; pose 'hold' cradles the baby |
| Baby Jalandhar | `style-frames/samudra-baby.js` `baby()` | awaiting approval: swaddled glowing newborn, flame mark; mood cry/calm |
| Kalanemi | `style-frames/kalanemi-devas.js` `kalanemi()` | awaiting approval: Jalandhar body, grey beard, horned crown, bronze armour, purple cape |
| Agni / Vayu | `style-frames/kalanemi-devas.js` `agni()` `vayu()` | awaiting approval: Indra body; Agni red-gold, fire beard, flaming spear, flames; Vayu silver-blue, green tunic, banner, wind |
| Parvati | `style-frames/narada-parvati.js` `parvati()` | awaiting approval: Tulasi body recoloured (maroon saree, yellow blouse), own face + gold crown, lotus |

Sheets: `style-frames/v2/*.png`. Logo sting: `brand/`.

## Done
- 20 s preview (`videos/tulasi-preview/`), Hindi Short v1 (`videos/tulasi-short/`, timed with Whisper `words.json`)
- Scripts: `scripts/tulasi-devi/short.md`, `long_video.md` (Hindi + Hinglish + ElevenLabs tags)

## Next (approved by the owner)
1. Short v2: 27 shots (one picture per phrase), ENGLISH captions only, character motion (breathing, blink, sway),
   timed to `videos/tulasi-short/words.json`. Shot list = the 27-row table agreed in chat (summary in SKILL.md §10).
2. Mobile preview page (Artifact link) that plays the film from code with the voice, BEFORE any render.
3. Render only after the owner approves the preview.

## Owner's preferences
- Always review renders against reference images before sending; no patch-work fixes.
- Bodies: normal fit, not fat chests, not too lean. Asuras look like asuras; devas never have horns.
- Discuss visual plans before implementing.

## Short v2 status
- Code: `videos/tulasi-short-v2/short.js` (27 shots, English captions). Stills: `node engine/shot-stills.js <outDir> [t1,t2,...]`.
- Mobile preview (private Artifact): https://claude.ai/artifact/RSnPNWgFcAA8VL5xVSxJA9 — page source in `videos/tulasi-short-v2/preview/`.
  Rebuild: `node engine/bundle-preview.js videos/tulasi-short-v2/short.js <dir>/film.js`, mix voice+music to `<dir>/audio.mp3`, republish.
- RENDERED (latest): `videos/tulasi-short-v2/tulasi_short_english_v3_voice_only.mp4` — stone-Vishnu hook, voice only, silent logo.

## Long video status
- Code: `videos/tulasi-long/part01.js … part12.js` (+ `common.js`), voice parts + Whisper timings in `voice/`, SFX cues in `sfx/`.
- Render everything: `bash videos/tulasi-long/render_all.sh <workDir> [parts]` (~25 min full; one part ~2 min, then re-joins).
- Final: `videos/tulasi-long/tulasi_devi_long_video.mp4` (7:40, voice + SFX, no music, silent logo after Part 1, −14 LUFS).
  It is 172 MB, over GitHub's 100 MB limit, so it is gitignored — re-render from code if needed.
- Brahma (proper design): `style-frames/brahma.js`, used in the Part 4 Tridev shot.
