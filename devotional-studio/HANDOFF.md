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
- Awaiting owner review; render only after approval.
