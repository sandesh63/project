// Tulasi Devi — 20 s preview. Every pixel is drawn in code.
// frame(t) returns the full SVG for time t (seconds).
const fs = require('fs');
const path = require('path');
const A = require('../../engine/art.js');
const C = require('../../engine/characters.js');
const N = require('../../engine/anim.js');
const { clamp, lerp, ease, prog, fade, noise, camera } = N;

const W = 1920, H = 1080, FPS = 30, DURATION = 20;

// static film grain texture (generated once by render step, embedded as data URI)
let GRAIN = '';
const grainPath = path.join(__dirname, 'grain.png');
if (fs.existsSync(grainPath)) GRAIN = 'data:image/png;base64,' + fs.readFileSync(grainPath).toString('base64');

const extraDefs = `<defs>
  <linearGradient id="bgTemple" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b0d24"/><stop offset=".55" stop-color="#4a1418"/><stop offset="1" stop-color="#1a0806"/></linearGradient>
  <linearGradient id="wallNight" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#141a3a"/><stop offset=".5" stop-color="#1c2348"/><stop offset="1" stop-color="#2a2a44"/></linearGradient>
  <linearGradient id="moonSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff"/><stop offset=".5" stop-color="#7f9ad8"/><stop offset="1" stop-color="#34407a"/></linearGradient>
  <linearGradient id="moonPool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd2ff" stop-opacity=".55"/><stop offset="1" stop-color="#7f9ad8" stop-opacity="0"/></linearGradient>
  <linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a6a"/><stop offset=".35" stop-color="#c0507a"/><stop offset=".7" stop-color="#f59a4a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
  <linearGradient id="floorStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a3a"/><stop offset="1" stop-color="#3a2014"/></linearGradient>
  <radialGradient id="redEnergy" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#ffcf6a"/><stop offset=".3" stop-color="#e2541e"/><stop offset=".7" stop-color="#7a120c"/><stop offset="1" stop-color="#1a0404"/></radialGradient>
  <radialGradient id="sunDisc" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe6"/><stop offset=".5" stop-color="#ffe08a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
  <filter id="shadowify" x="-20%" y="-20%" width="140%" height="140%">
    <feColorMatrix type="matrix" values="0 0 0 0 .03  0 0 0 0 .03  0 0 0 0 .07  0 0 0 .92 0"/><feGaussianBlur stdDeviation="3.5"/>
  </filter>
  <filter id="silRim" x="-20%" y="-20%" width="140%" height="140%">
    <feMorphology operator="dilate" radius="3" in="SourceAlpha" result="d"/><feGaussianBlur in="d" stdDeviation="4" result="b"/>
    <feFlood flood-color="#9fc0ff"/><feComposite in2="b" operator="in" result="rim"/>
    <feMerge><feMergeNode in="rim"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <pattern id="grainPat" width="512" height="512" patternUnits="userSpaceOnUse"><image href="${GRAIN}" width="512" height="512"/></pattern>
</defs>`;

// ---------------------------------------------------------------- scenes
function sceneS1(t) { // 0–4 s : lamp lights, Tulasi prays, eyes open
  const lamp = prog(t, .2, 1.2, ease.out);
  const bgOn = prog(t, .4, 2.6);
  const eyes = t < 2.55 ? 'closed' : t < 2.8 ? 'lowered' : 'open';
  const fl = noise(t, 1) * 4;
  const inner = `
    <rect x="-700" y="-700" width="${W + 1400}" height="${H + 1400}" fill="#0a0406"/>
    <rect x="-700" y="-700" width="${W + 1400}" height="${H + 1400}" fill="url(#bgTemple)" opacity="${bgOn * .9}"/>
    <g transform="rotate(${t * 3} 960 330)">${A.mandalaGlow(960, 330, 560, '#ffcf6a', bgOn * .55)}</g>
    <g opacity="${clamp(bgOn * 1.4)}">${C.tulasi(960, 110, 3.2, { pose: 'anjali', eyes, mouth: 'soft', id: 's1' })}</g>
    <ellipse cx="960" cy="905" rx="${700 * lamp}" ry="${420 * lamp}" fill="url(#lampGlow)" opacity="${.85 * lamp}"/>
    <g transform="translate(960,905)">
      <path d="M-70 0 Q 0 46 70 0 Q 0 16 -70 0Z" fill="url(#goldV)" stroke="#7a4a10" stroke-width="2"/>
      <path d="M-70 0 Q 0 14 70 0" fill="none" stroke="#ffe7a0" stroke-width="2" opacity=".7"/>
      <g transform="translate(40,-2) scale(${1.6 * lamp})">${A.flame(0, 0, 1, fl)}</g></g>
    ${N.embersAnim(5, 40, W, H, t, { op: bgOn })}`;
  return camera(inner, W, H, { s: lerp(1, 1.09, prog(t, 0, 4.2, ease.sine)), fx: 960, fy: 420 });
}

function sceneS2(t) { // 4–8 s : the temple, Tulasi in prayer
  const lt = t - 4, fl1 = noise(t, 2) * 3, fl2 = noise(t, 5) * 3;
  const inner = `
    <rect x="-700" y="-700" width="${W + 1400}" height="${H + 1400}" fill="url(#bgTemple)"/>
    ${A.templeSilhouette(300, 900, 1.1, '#26101e')}${A.templeSilhouette(1640, 920, .9, '#26101e')}
    <g transform="rotate(${t * 4} 960 330)">${A.mandalaGlow(960, 330, 520, '#ffcf6a', .55 + noise(t, 3) * .04)}</g>
    ${A.prabhavali(960, 780, 400, { flames: 25, thick: 30, pillar: 400 })}
    ${A.lotus(960, 1010, 1.9, '#f6b6c6', '#c64f73')}
    ${C.tulasi(960, 140, .93, { pose: 'anjali', eyes: 'lowered', mouth: 'soft', id: 's2' })}
    ${A.nilavilakku(250, 1080, 1.3, fl1)}${A.nilavilakku(1670, 1080, 1.3, fl2)}
    <ellipse cx="250" cy="640" rx="320" ry="320" fill="url(#lampGlow)" opacity="${.35 + noise(t, 2) * .05}"/>
    <ellipse cx="1670" cy="640" rx="320" ry="320" fill="url(#lampGlow)" opacity="${.35 + noise(t, 5) * .05}"/>
    ${N.embersAnim(7, 60, W, H, t)}
    ${N.petalsAnim(9, 34, W, H, t)}`;
  return camera(inner, W, H, { s: lerp(1.0, 1.16, prog(lt, 0, 4.2, ease.sine)), fx: 960, fy: lerp(540, 380, prog(lt, 0, 4.2, ease.sine)) });
}

function visitorSilhouette(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})" filter="url(#silRim)">
    <path d="M0 -40 L 14 -6 L 26 -40 L 30 0 L -30 0 L -26 -40 L -14 -6Z" fill="#05060f"/>
    <ellipse cx="0" cy="26" rx="26" ry="32" fill="#05060f"/>
    <path d="M-12 54 L -14 72 C -50 78 -78 84 -88 100 L -104 260 L -96 330 L -80 330 L -76 220 L -66 160 L -60 330 C -58 420 -56 520 -54 600 L -18 600 L -6 380 L 6 380 L 18 600 L 54 600 C 56 520 58 420 60 330 L 66 160 L 76 220 L 80 330 L 96 330 L 104 260 L 88 100 C 78 84 50 78 14 72 L 12 54Z" fill="#05060f"/>
  </g>`;
}

function sceneS3(t) { // 8–12 s : the visitor and the four-armed shadow
  const lt = t - 8;
  const grow = prog(lt, 1.0, 2.8, ease.inOut);
  const fl = noise(t, 9);
  const inner = `
    <rect x="-700" y="-700" width="${W + 1400}" height="${H + 1400}" fill="url(#wallNight)"/>
    <!-- right plastered wall lit faintly by the lamp -->
    <rect x="900" y="0" width="1100" height="900" fill="#6a5866"/>
    <ellipse cx="1500" cy="420" rx="760" ry="560" fill="url(#lampGlow)" opacity="${.42 + fl * .04}"/>
    <rect x="900" y="0" width="40" height="900" fill="#1c1a2c" opacity=".7"/>
    <!-- doorway -->
    <path d="M360 900 L 360 330 Q 540 190 720 330 L 720 900Z" fill="url(#moonSky)"/>
    <circle cx="610" cy="360" r="46" fill="#f4f6ff" opacity=".9"/><circle cx="610" cy="360" r="120" fill="#e8f0ff" opacity=".18" filter="url(#softGlow)"/>
    <path d="M360 760 Q 450 720 540 750 T 720 740 L 720 900 L 360 900Z" fill="#1a2450" opacity=".8"/>
    <path d="M330 910 L 330 320 Q 540 150 750 320 L 750 910 L 720 910 L 720 330 Q 540 190 360 330 L 360 910Z" fill="#4a2a16" stroke="#1e0e06" stroke-width="4"/>
    <path d="M345 905 L 345 325 Q 540 168 735 325 L 735 905" fill="none" stroke="#8a5a2a" stroke-width="4" stroke-dasharray="12 10"/>
    <!-- floor + moonlight pool -->
    <rect x="-700" y="900" width="${W + 1400}" height="800" fill="#0e1024"/>
    <path d="M360 900 L 720 900 L 1120 1080 L 120 1080Z" fill="url(#moonPool)"/>
    <!-- lamp niche on the far left -->
    <path d="M90 560 L 90 470 Q 140 420 190 470 L 190 560Z" fill="#1a0e0a"/>
    <rect x="120" y="540" width="40" height="12" rx="5" fill="${A.P.gold3}"/>
    ${A.flame(140, 540, .7, fl * 3)}
    <!-- the four-armed shadow grows on the wall -->
    <g opacity="${grow}" transform="translate(1440,${lerp(330, 170, grow)}) skewX(-8) scale(${lerp(.42, .68, grow)})" filter="url(#shadowify)">
      ${C.vishnu(0, 0, 1, { id: 'sh', eyes: 'closed' })}
    </g>
    <!-- the visitor, backlit in the doorway -->
    ${visitorSilhouette(540, 300 + Math.sin(t * 1.2) * 2, 1)}
    ${N.embersAnim(13, 30, W, H, t, { color: '#cfe2ff', op: .6, speed: 20 })}`;
  return camera(inner, W, H, { s: lerp(1.05, 1.12, prog(lt, 0, 4)), fx: 960, fy: 540, px: lerp(220, -180, prog(lt, .4, 3.6, ease.inOut)) });
}

function sceneS4a(t) { // 12–13.8 s : Tulasi's anger
  const lt = t - 12, shake = prog(lt, .6, 1.8) * 7;
  const inner = `
    <rect x="-700" y="-700" width="${W + 1400}" height="${H + 1400}" fill="url(#redEnergy)"/>
    <g transform="rotate(${lt * 40} 960 420)">${A.mandalaGlow(960, 420, 900, '#ffb04a', .5)}</g>
    <g transform="rotate(${-lt * 25} 960 420)">${A.mandalaGlow(960, 420, 650, '#ff6a2a', .35)}</g>
    ${C.tulasi(960, 120, 3.2, { eyes: 'angry', mouth: 'open', tears: true, id: 's4' })}
    ${N.embersAnim(17, 90, W, H, t, { color: '#ffcf6a', speed: 160 })}`;
  return camera(inner, W, H, { s: lerp(1.0, 1.14, prog(lt, 0, 1.8, ease.in)), fx: 960, fy: 360, px: noise(t * 6, 1) * shake, py: noise(t * 6, 4) * shake });
}

function sceneS4b(t) { // 13.8–16 s : Vishnu accepts, becomes the Shaligram
  const lt = t - 13.8;
  const toStone = prog(lt, .8, 1.6);
  const vis = 1 - prog(lt, 1.3, 1.9);
  const stone = prog(lt, 1.2, 2.0, ease.out);
  const sat = lerp(1, 0, toStone), dark = lerp(1, .45, toStone);
  const inner = `
    <rect x="-700" y="-700" width="${W + 1400}" height="${H + 1400}" fill="#050a22"/>
    <ellipse cx="960" cy="520" rx="${700 + stone * 200}" ry="${600 + stone * 150}" fill="url(#blueGlow)" opacity="${.7 + stone * .3}"/>
    <g transform="rotate(${lt * 10} 960 520)">${A.mandalaGlow(960, 520, 600, '#bcd6ff', .4)}</g>
    <filter id="stoneF"><feColorMatrix type="saturate" values="${sat}"/><feComponentTransfer><feFuncR type="linear" slope="${dark}"/><feFuncG type="linear" slope="${dark}"/><feFuncB type="linear" slope="${dark * 1.05}"/></feComponentTransfer></filter>
    <g opacity="${vis}" filter="url(#stoneF)" transform="translate(960,560) scale(${lerp(1, .55, prog(lt, 1.0, 1.9, ease.in))}) translate(-960,-560)">
      ${C.vishnu(960, 150, .78, { pose: 'accept', eyes: 'closed', mouth: 'soft', id: 's4b' })}
    </g>
    <g opacity="${stone}">${A.shaligram(960, 600, lerp(.4, 1.25, stone), 1)}</g>
    ${N.embersAnim(21, 80, W, H, t, { color: '#cfe2ff', speed: 50 })}`;
  return camera(inner, W, H, { s: lerp(1.0, 1.06, prog(lt, 0, 2.2)), fx: 960, fy: 540 });
}

function sceneS5(t) { // 16–20 s : dawn, the Tulasi plant, title
  const lt = t - 16;
  const grow = lerp(.12, 1, prog(lt, .1, 2.2, ease.out));
  const title = prog(lt, 1.4, 2.4, ease.out), sub = prog(lt, 2.1, 2.9, ease.out);
  const rays = [...Array(24)].map((_, i) => `<path transform="rotate(${i * 15 + lt * 4})" d="M0 -60 L 14 -900 L -14 -900Z" fill="#fff2c0" opacity="${i % 2 ? .08 : .16}"/>`).join('');
  const rangoli = [...Array(4)].map((_, k) => `<ellipse cx="960" cy="1010" rx="${260 - k * 55}" ry="${60 - k * 13}" fill="none" stroke="${['#e8344e', '#f39a1e', '#fff6e0', '#1f8a52'][k]}" stroke-width="6" stroke-dasharray="${8 + k * 2} ${6 + k}"/>`).join('');
  const inner = `
    <rect x="-700" y="-700" width="${W + 1400}" height="${H + 1400}" fill="url(#dawnSky)"/>
    <g transform="translate(960,600)">${rays}</g>
    <circle cx="960" cy="600" r="${260}" fill="url(#sunDisc)"/>
    ${A.templeSilhouette(1500, 760, .55, '#6a3048')}${A.templeSilhouette(420, 760, .45, '#7a3a50')}
    <path d="M0 740 Q 480 700 960 730 T 1920 720 L 2600 720 L 2600 1800 L -700 1800 L -700 740Z" fill="url(#floorStone)"/>
    ${[...Array(9)].map((_, i) => `<path d="M${960 + (i - 4) * 120} 740 L ${960 + (i - 4) * 420} 1080" stroke="#2a160c" stroke-width="2" opacity=".5"/>`).join('')}
    ${[800, 860, 940, 1040].map(y => `<path d="M0 ${y} L 1920 ${y}" stroke="#2a160c" stroke-width="2" opacity=".35"/>`).join('')}
    ${rangoli}
    <ellipse cx="960" cy="760" rx="520" ry="300" fill="url(#lampGlow)" opacity=".45"/>
    ${A.tulasiKatte(960, 985, 1.05, 11, grow)}
    ${N.petalsAnim(29, 18, W, H, t, { speed: 45, op: .8 })}
    ${N.embersAnim(31, 40, W, H, t, { color: '#fff2c0', speed: 25 })}
    <g opacity="${title}" transform="translate(960,${lerp(330, 310, title)})">
      <text text-anchor="middle" font-family="'Cinzel Decorative', Cinzel, serif" font-weight="900" font-size="150" letter-spacing="${lerp(40, 12, title)}" fill="url(#goldV)" stroke="#3a1608" stroke-width="5" style="paint-order:stroke" filter="url(#glow)">TULASI DEVI</text>
    </g>
    <g opacity="${sub}"><text x="960" y="400" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="58" fill="#fff6e6" stroke="#3a1608" stroke-width="5" style="paint-order:stroke">The curse that turned God into stone</text></g>`;
  return camera(inner, W, H, { s: lerp(1.06, 1.0, prog(lt, 0, 4, ease.out)), fx: 960, fy: 560 });
}

// ---------------------------------------------------------------- timeline
const SCENES = [
  { fn: sceneS1, a: 0, b: 4.2, fi: 0, fo: .4 },
  { fn: sceneS2, a: 3.8, b: 7.9, fi: .4, fo: .35 },
  { fn: sceneS3, a: 8.05, b: 12.1, fi: .35, fo: .2 },
  { fn: sceneS4a, a: 11.95, b: 13.85, fi: .15, fo: .05 },
  { fn: sceneS4b, a: 13.8, b: 16.3, fi: .05, fo: .4 },
  { fn: sceneS5, a: 15.9, b: 20, fi: .4, fo: .5 },
];
const CAPTIONS = [
  { a: 1.4, b: 3.9, parts: [['Her prayers were so ', 0], ['powerful', 1], ['…', 0]] },
  { a: 4.3, b: 7.7, parts: [['that even the gods could not defeat her ', 0], ['husband', 1]] },
  { a: 8.5, b: 11.9, parts: [['But the one at her door… was ', 0], ['not her husband', 1]] },
  { a: 12.15, b: 15.8, parts: [['With one ', 0], ['curse', 1], ['… she turned God into ', 0], ['stone', 1]] },
];

function frame(t) {
  let body = '';
  for (const s of SCENES) {
    if (t < s.a || t > s.b) continue;
    const op = clamp(Math.min(s.fi ? (t - s.a) / s.fi : 1, s.fo ? (s.b - t) / s.fo : 1));
    if (op <= 0) continue;
    body += `<g opacity="${op.toFixed(3)}">${s.fn(t)}</g>`;
  }
  // flashes: the curse (13.8 s) and the transformation (15.1 s)
  const flash = Math.max(clamp(1 - Math.abs(t - 13.82) / .22), .7 * clamp(1 - Math.abs(t - 15.1) / .35));
  if (flash > 0) body += `<rect width="${W}" height="${H}" fill="#fff8ea" opacity="${flash.toFixed(3)}"/>`;
  let caps = '';
  for (const c of CAPTIONS) {
    const op = fade(t, c.a, c.b, .35, .35);
    if (op > 0) caps += `<rect y="${H - 230}" width="${W}" height="230" fill="url(#cband)" opacity="${op}"/>` + N.caption(W, H, c.parts, op);
  }
  const gx = Math.floor((t * 977) % 512), gy = Math.floor((t * 613) % 512);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${A.defs()}${C.defs2()}${extraDefs}
    <linearGradient id="cband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></linearGradient>
    ${body}
    <rect width="${W}" height="${H}" fill="url(#vignette)"/>
    ${GRAIN ? `<rect x="${-gx}" y="${-gy}" width="${W + 512}" height="${H + 512}" fill="url(#grainPat)" opacity=".10" style="mix-blend-mode:overlay"/>` : ''}
    ${caps}
  </svg>`;
}

module.exports = { W, H, FPS, DURATION, frame };
