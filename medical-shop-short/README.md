# Medical Shop Short — 3D animated YouTube Short (Remotion + Three.js)

"Medical shop wale kaise kamate hain?" — a 85 s vertical (1080×1920) Short,
fully generated in code: procedural 3D environments and cartoon characters
(React Three Fiber inside Remotion), toon shading with ink outlines, fake bloom,
and word-by-word Hinglish captions.

## Run

```bash
npm install
npx remotion studio              # live preview / scrub timeline
npx remotion render MedicalShort out/medical-shop-short.mp4 --concurrency=4
npx remotion still scene-split out/split.png --frame=200   # one frame of one scene
```

`remotion.config.ts` points Remotion at the pre-installed headless Chromium and
uses SwiftShader (`swangle`) for WebGL, so it renders on machines without a GPU.
On your own PC with a GPU you can delete those two lines for faster renders.

## Where things live

| File | What |
|---|---|
| `src/timeline.ts` | Scene timings, voiceover text (captions) and pop-up callouts |
| `src/three/Character.tsx` | Parametric cartoon character + cast presets (Common Man, Chemist, Distributor) |
| `src/three/props.tsx` | Shelves, medicine boxes, neon cross, string lights, buildings, diyas, coins… |
| `src/three/sets/Shop.tsx` | The medical shop interior + night street |
| `src/three/sets/scenes*.tsx` | The 8 scenes (hook, journey, split, scheme, govt, expenses, cliff, cta) |
| `src/overlay/Overlays.tsx` | Captions, callout chips, CTA arrow, vignette |

## Adding the voiceover

1. Record the VO, save as `public/vo.mp3`.
2. Adjust each scene's `start`/`end` in `src/timeline.ts` to match.
3. Add `<Audio src={staticFile('vo.mp3')} />` (and music) in `src/Video.tsx`.
