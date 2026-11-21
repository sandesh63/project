// Tulasi Devi — YouTube Short (9:16), timed to the ElevenLabs voice-over (voice.mp3, 55.72 s).
// Scenes are drawn in a 1920x1080 "world" and framed by a vertical camera (world height = screen height).
const fs = require('fs');
const path = require('path');
const A = require('../../engine/art.js');
const C = require('../../engine/characters.js');
const N = require('../../engine/anim.js');
const { clamp, lerp, ease, prog, fade, noise } = N;

const W = 1080, H = 1920, FPS = 30, DURATION = 55.8;
const BASE = H / 1080;                      // 1.7778: world 1080 px tall fills the 1920 px screen
const SPEC = {                               // numbers from SKILL.md (Look / Camera / Motion)
  pushPerSec: .012, grain: .10, vignette: .78, crossfade: .3,
  caption: { y: 1440, size: 66, maxChars: 22, lineH: 92 },
  safeTop: 230, safeBottom: 1560,
};

let GRAIN = '';
const gp = path.join(__dirname, '..', 'tulasi-preview', 'grain.png');
if (fs.existsSync(gp)) GRAIN = 'data:image/png;base64,' + fs.readFileSync(gp).toString('base64');

// vertical camera over the world
const cam = (inner, { s = 1, fx = 960, fy = 540, px = 0, py = 0 } = {}) =>
  `<g transform="translate(${W / 2 + px},${H / 2 + py}) scale(${BASE * s}) translate(${-fx},${-fy})">${inner}</g>`;
const BG = (fill) => `<rect x="-800" y="-800" width="3520" height="2680" fill="${fill}"/>`;

const defs = `<defs>
  <linearGradient id="bgTemple" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b0d24"/><stop offset=".55" stop-color="#4a1418"/><stop offset="1" stop-color="#1a0806"/></linearGradient>
  <linearGradient id="bgGrief" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1030"/><stop offset=".6" stop-color="#2a1430"/><stop offset="1" stop-color="#0a0610"/></linearGradient>
  <linearGradient id="wallNight" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#141a3a"/><stop offset=".5" stop-color="#1c2348"/><stop offset="1" stop-color="#2a2a44"/></linearGradient>
  <linearGradient id="moonSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff"/><stop offset=".5" stop-color="#7f9ad8"/><stop offset="1" stop-color="#34407a"/></linearGradient>
  <linearGradient id="moonPool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd2ff" stop-opacity=".55"/><stop offset="1" stop-color="#7f9ad8" stop-opacity="0"/></linearGradient>
  <linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a6a"/><stop offset=".35" stop-color="#c0507a"/><stop offset=".7" stop-color="#f59a4a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
  <linearGradient id="floorStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a3a"/><stop offset="1" stop-color="#3a2014"/></linearGradient>
  <radialGradient id="redEnergy" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#ffcf6a"/><stop offset=".3" stop-color="#e2541e"/><stop offset=".7" stop-color="#7a120c"/><stop offset="1" stop-color="#1a0404"/></radialGradient>
  <radialGradient id="sunDisc" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe6"/><stop offset=".5" stop-color="#ffe08a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
  <linearGradient id="topBand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".75"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
  <linearGradient id="cband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
  <filter id="shadowify" x="-20%" y="-20%" width="140%" height="140%">
    <feColorMatrix type="matrix" values="0 0 0 0 .03  0 0 0 0 .03  0 0 0 0 .07  0 0 0 .92 0"/><feGaussianBlur stdDeviation="3.5"/></filter>
  <filter id="silRim" x="-20%" y="-20%" width="140%" height="140%">
    <feMorphology operator="dilate" radius="3" in="SourceAlpha" result="d"/><feGaussianBlur in="d" stdDeviation="4" result="b"/>
    <feFlood flood-color="#9fc0ff"/><feComposite in2="b" operator="in" result="rim"/>
    <feMerge><feMergeNode in="rim"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <pattern id="grainPat" width="512" height="512" patternUnits="userSpaceOnUse"><image href="${GRAIN}" width="512" height="512"/></pattern>
</defs>`;

// ------------------------------------------------------------ scenes
function vPrayer(t) {                     // 0 – 12.7 : lamp, Tulasi in prayer, eyes open on "वृंदा ने" (11.48)
  const lamp = prog(t, .1, 1.0, ease.out), bgOn = prog(t, .3, 2.2);
  const eyes = t < 11.35 ? 'closed' : t < 11.6 ? 'lowered' : 'open';
  const fl = noise(t, 1) * 4;
  const inner = `${BG('#0a0406')}${BG('url(#bgTemple)').replace('/>', ` opacity="${bgOn * .9}"/>`)}
    <g transform="rotate(${t * 3} 960 330)">${A.mandalaGlow(960, 330, 560, '#ffcf6a', bgOn * .55)}</g>
    <g opacity="${clamp(bgOn * 1.4)}">${C.tulasi(960, 110, 3.2, { pose: 'anjali', eyes, mouth: 'soft', id: 'p' })}</g>
    <ellipse cx="960" cy="905" rx="${700 * lamp}" ry="${420 * lamp}" fill="url(#lampGlow)" opacity="${.85 * lamp}"/>
    <g transform="translate(960,905)"><path d="M-70 0 Q 0 46 70 0 Q 0 16 -70 0Z" fill="url(#goldV)" stroke="#7a4a10" stroke-width="2"/>
      <g transform="translate(40,-2) scale(${1.6 * lamp})">${A.flame(0, 0, 1, fl)}</g></g>
    ${N.embersAnim(5, 40, 1920, 1080, t, { op: bgOn })}`;
  const punch = prog(t, 11.45, 11.9, ease.out) * .04;
  return cam(inner, { s: 1 + t * SPEC.pushPerSec + punch, fx: 960 + Math.sin(t * .3) * 8, fy: 470 });
}

function vTemple(t) {                     // 12.7 – 21.1 : temple, the shield of devotion around her
  const lt = t - 12.7, fl1 = noise(t, 2) * 3, fl2 = noise(t, 5) * 3;
  const shield = prog(t, 17.0, 18.2);
  const rings = [0, 1, 2].map(k => { const ph = ((t - 17 + k * .6) % 1.8) / 1.8; return t < 17 ? '' :
    `<ellipse cx="960" cy="560" rx="${200 + ph * 260}" ry="${420 + ph * 200}" fill="none" stroke="#ffd66b" stroke-width="${6 * (1 - ph)}" opacity="${(1 - ph) * .8 * shield}" filter="url(#glow)"/>`; }).join('');
  const inner = `${BG('url(#bgTemple)')}
    ${A.templeSilhouette(300, 900, 1.1, '#26101e')}${A.templeSilhouette(1640, 920, .9, '#26101e')}
    <g transform="rotate(${t * 4} 960 330)">${A.mandalaGlow(960, 330, 520, '#ffcf6a', .55)}</g>
    ${A.prabhavali(960, 780, 400, { flames: 25, thick: 30, pillar: 400 })}
    ${A.lotus(960, 1010, 1.9, '#f6b6c6', '#c64f73')}
    <ellipse cx="960" cy="560" rx="360" ry="560" fill="url(#lampGlow)" opacity="${.25 + shield * .3}"/>
    ${C.tulasi(960, 140, .93, { pose: 'anjali', eyes: 'lowered', mouth: 'soft', id: 't' })}
    ${rings}
    ${A.nilavilakku(560, 1080, 1.0, fl1)}${A.nilavilakku(1360, 1080, 1.0, fl2)}
    ${N.embersAnim(7, 60, 1920, 1080, t)}${N.petalsAnim(9, 34, 1920, 1080, t)}`;
  return cam(inner, { s: lerp(1.0, 1.22, prog(lt, 0, 8.4, ease.sine)), fx: 960, fy: lerp(560, 430, prog(lt, 0, 8.4, ease.sine)) });
}

function visitor(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})" filter="url(#silRim)">
    <path d="M0 -40 L 14 -6 L 26 -40 L 30 0 L -30 0 L -26 -40 L -14 -6Z" fill="#05060f"/>
    <ellipse cx="0" cy="26" rx="26" ry="32" fill="#05060f"/>
    <path d="M-12 54 L -14 72 C -50 78 -78 84 -88 100 L -104 260 L -96 330 L -80 330 L -76 220 L -66 160 L -60 330 C -58 420 -56 520 -54 600 L -18 600 L -6 380 L 6 380 L 18 600 L 54 600 C 56 520 58 420 60 330 L 66 160 L 76 220 L 80 330 L 96 330 L 104 260 L 88 100 C 78 84 50 78 14 72 L 12 54Z" fill="#05060f"/></g>`;
}

function vDoor(t) {                       // 21.1 – 32.7 : visitor at the door → pan to the wall → four arms (31.25)
  const fl = noise(t, 9);
  const grow = prog(t, 28.9, 31.25, ease.inOut);
  const pan = prog(t, 28.3, 30.7, ease.inOut);
  const punch = prog(t, 31.25, 31.6, ease.out) * .07 * (1 - prog(t, 31.8, 32.6));
  const inner = `${BG('url(#wallNight)')}
    <rect x="900" y="-200" width="1500" height="1100" fill="#6a5866"/>
    <ellipse cx="1500" cy="420" rx="760" ry="560" fill="url(#lampGlow)" opacity="${.42 + fl * .04}"/>
    <rect x="900" y="-200" width="40" height="1100" fill="#1c1a2c" opacity=".7"/>
    <path d="M360 900 L 360 330 Q 540 190 720 330 L 720 900Z" fill="url(#moonSky)"/>
    <circle cx="610" cy="360" r="46" fill="#f4f6ff" opacity=".9"/><circle cx="610" cy="360" r="120" fill="#e8f0ff" opacity=".18" filter="url(#softGlow)"/>
    <path d="M360 760 Q 450 720 540 750 T 720 740 L 720 900 L 360 900Z" fill="#1a2450" opacity=".8"/>
    <path d="M330 910 L 330 320 Q 540 150 750 320 L 750 910 L 720 910 L 720 330 Q 540 190 360 330 L 360 910Z" fill="#4a2a16" stroke="#1e0e06" stroke-width="4"/>
    <path d="M345 905 L 345 325 Q 540 168 735 325 L 735 905" fill="none" stroke="#8a5a2a" stroke-width="4" stroke-dasharray="12 10"/>
    <rect x="-800" y="900" width="3520" height="900" fill="#0e1024"/>
    <path d="M360 900 L 720 900 L 1120 1080 L 120 1080Z" fill="url(#moonPool)"/>
    <path d="M90 560 L 90 470 Q 140 420 190 470 L 190 560Z" fill="#1a0e0a"/>
    <rect x="120" y="540" width="40" height="12" rx="5" fill="${A.P.gold3}"/>${A.flame(140, 540, .7, fl * 3)}
    <g opacity="${grow}" transform="translate(1440,${lerp(330, 170, grow)}) skewX(-8) scale(${lerp(.42, .68, grow)})" filter="url(#shadowify)">
      ${C.vishnu(0, 0, 1, { id: 'sh', eyes: 'closed' })}</g>
    ${visitor(540, 300 + Math.sin(t * 1.2) * 2, 1)}
    ${N.embersAnim(13, 30, 1920, 1080, t, { color: '#cfe2ff', op: .6, speed: 20 })}`;
  const lt = t - 21.1;
  return cam(inner, { s: 1.0 + lt * .006 + punch + prog(t, 25.4, 28.2) * .08, fx: lerp(560, 1430, pan), fy: lerp(540, lerp(470, 520, pan), prog(t, 25.4, 28.2)) });
}

function vGrief(t) {                      // 32.7 – 39.7 : truth, tears, the curse rises (anger from 38.6)
  const red = prog(t, 38.4, 39.7);
  const eyes = t < 38.6 ? 'lowered' : 'angry';
  const inner = `${BG('url(#bgGrief)')}${BG('url(#redEnergy)').replace('/>', ` opacity="${red}"/>`)}
    <g transform="rotate(${t * 2} 960 360)">${A.mandalaGlow(960, 360, 560, red > .3 ? '#ffb04a' : '#9fb8ff', .35 + red * .2)}</g>
    ${C.tulasi(960, 120, 3.2, { eyes, mouth: 'soft', tears: true, sad: t < 38.6, id: 'g' })}
    ${N.embersAnim(15, 40, 1920, 1080, t, { color: red > .3 ? '#ffcf6a' : '#cfe2ff', speed: 25 + red * 100, op: .7 })}`;
  return cam(inner, { s: 1.04 + (t - 32.7) * .015, fx: 960, fy: 440 });
}

function vCurse(t) {                      // 39.7 – 45.9 : the curse; flash on "पत्थर" (45.65)
  const lt = t - 39.7, shake = prog(lt, 1.0, 5.9) * 9;
  const inner = `${BG('url(#redEnergy)')}
    <g transform="rotate(${lt * 40} 960 420)">${A.mandalaGlow(960, 420, 900, '#ffb04a', .5)}</g>
    <g transform="rotate(${-lt * 25} 960 420)">${A.mandalaGlow(960, 420, 650, '#ff6a2a', .35)}</g>
    ${C.tulasi(960, 120, 3.2, { eyes: 'angry', mouth: (Math.floor(t * 7) % 3 === 0 && t < 45.6) ? 'soft' : 'open', tears: true, id: 'c' })}
    ${N.embersAnim(17, 90, 1920, 1080, t, { color: '#ffcf6a', speed: 160 })}`;
  return cam(inner, { s: lerp(1.08, 1.3, prog(lt, 0, 6.1, ease.in)), fx: 960, fy: 380, px: noise(t * 6, 1) * shake, py: noise(t * 6, 4) * shake });
}

function vStone(t) {                      // 45.7 – 50.2 : Vishnu accepts silently, becomes the Shaligram
  const toStone = prog(t, 48.0, 49.2), vis = 1 - prog(t, 48.7, 49.6), stone = prog(t, 48.6, 49.8, ease.out);
  const sat = lerp(1, 0, toStone), dark = lerp(1, .45, toStone);
  const inner = `${BG('#050a22')}
    <ellipse cx="960" cy="520" rx="${700 + stone * 200}" ry="${600 + stone * 150}" fill="url(#blueGlow)" opacity="${.7 + stone * .3}"/>
    <g transform="rotate(${t * 10} 960 520)">${A.mandalaGlow(960, 520, 600, '#bcd6ff', .4)}</g>
    <filter id="stoneF"><feColorMatrix type="saturate" values="${sat}"/><feComponentTransfer><feFuncR type="linear" slope="${dark}"/><feFuncG type="linear" slope="${dark}"/><feFuncB type="linear" slope="${dark * 1.05}"/></feComponentTransfer></filter>
    <g opacity="${vis}" filter="url(#stoneF)" transform="translate(960,560) scale(${lerp(1, .55, prog(t, 48.4, 49.4, ease.in))}) translate(-960,-560)">
      ${C.vishnu(960, 150, .78, { pose: 'accept', eyes: 'closed', mouth: 'soft', id: 'v' })}</g>
    <g opacity="${stone}">${A.shaligram(960, 600, lerp(.4, 1.25, stone), 1)}</g>
    ${N.embersAnim(21, 80, 1920, 1080, t, { color: '#cfe2ff', speed: 50 })}`;
  return cam(inner, { s: lerp(1.0, 1.12, prog(t, 45.7, 50.2)), fx: 960, fy: lerp(470, 560, prog(t, 47.5, 49.8)) });
}

function vDawn(t) {                       // 50.0 – 55.8 : Tulasi plant grows, title on "तुलसी" (51.9), CTA (53.2)
  const lt = t - 50;
  const grow = lerp(.12, 1, prog(lt, .1, 2.0, ease.out));
  const rays = [...Array(24)].map((_, i) => `<path transform="rotate(${i * 15 + lt * 4})" d="M0 -60 L 14 -900 L -14 -900Z" fill="#fff2c0" opacity="${i % 2 ? .08 : .16}"/>`).join('');
  const rangoli = [...Array(4)].map((_, k) => `<ellipse cx="960" cy="1010" rx="${260 - k * 55}" ry="${60 - k * 13}" fill="none" stroke="${['#e8344e', '#f39a1e', '#fff6e0', '#1f8a52'][k]}" stroke-width="6" stroke-dasharray="${8 + k * 2} ${6 + k}"/>`).join('');
  const inner = `${BG('url(#dawnSky)')}
    <g transform="translate(960,560)">${rays}</g><circle cx="960" cy="560" r="260" fill="url(#sunDisc)"/>
    ${A.templeSilhouette(1240, 760, .55, '#6a3048')}${A.templeSilhouette(680, 760, .45, '#7a3a50')}
    <path d="M-800 740 Q 480 700 960 730 T 2700 720 L 2700 1800 L -800 1800Z" fill="url(#floorStone)"/>
    ${rangoli}
    <ellipse cx="960" cy="760" rx="520" ry="300" fill="url(#lampGlow)" opacity=".45"/>
    ${A.tulasiKatte(960, 985, 1.05, 11, grow)}
    ${N.petalsAnim(29, 18, 1920, 1080, t, { speed: 45, op: .8 })}${N.embersAnim(31, 40, 1920, 1080, t, { color: '#fff2c0', speed: 25 })}`;
  return cam(inner, { s: lerp(1.12, 1.0, prog(lt, 0, 5.8, ease.out)), fx: 960, fy: 600 });
}

// ------------------------------------------------------------ timeline
const SCENES = [
  { fn: vPrayer, a: 0, b: 12.85 }, { fn: vTemple, a: 12.55, b: 21.25 }, { fn: vDoor, a: 20.95, b: 32.85 },
  { fn: vGrief, a: 32.55, b: 39.85 }, { fn: vCurse, a: 39.55, b: 45.9, fo: .05 }, { fn: vStone, a: 45.65, b: 50.3, fi: .05 },
  { fn: vDawn, a: 50.0, b: 55.8, fo: .25 },
];
// captions timed to the voice (pauses measured from voice.mp3); ★word★ = gold highlight
const CAPS = [
  [0.0, 1.11, 'क्या आप जानते हैं…'],
  [1.69, 5.46, 'भगवान विष्णु को ★पत्थर★ बनने का श्राप… किसने दिया था?'],
  [6.07, 8.50, 'न किसी ऋषि ने… न किसी देवता ने।'],
  [9.07, 12.17, 'एक पतिव्रता स्त्री ने — ★वृंदा★ ने।'],
  [12.84, 15.39, 'वृंदा की ★भक्ति★ इतनी शक्तिशाली थी…'],
  [15.76, 19.16, 'कि उसके पति जलंधर को स्वयं ★महादेव★ भी…'],
  [19.41, 20.77, 'पराजित नहीं कर पा रहे थे।'],
  [21.41, 24.95, 'फिर एक रात… वृंदा के द्वार पर उसका पति आया।'],
  [25.52, 27.83, 'वही चेहरा… वही आवाज़…'],
  [28.35, 30.88, 'लेकिन दीवार पर पड़ती उसकी परछाईं के…'],
  [31.25, 32.29, '★चार हाथ★ थे।', 1.35],
  [32.90, 34.70, 'जब वृंदा को सच पता चला…'],
  [35.86, 36.94, 'आँखों में ★आँसू★ थे…'],
  [37.41, 39.39, 'और होंठों पर… एक ★श्राप★।'],
  [39.82, 43.61, '"जैसे तुमने मेरा हृदय पत्थर कर दिया…"'],
  [43.92, 46.50, '"वैसे ही तुम भी… ★पत्थर★ बन जाओगे!"', 1.15],
  [46.87, 49.23, 'और भगवान ने… वह श्राप चुपचाप स्वीकार कर लिया।'],
  [49.84, 50.52, 'लेकिन ★क्यों?★', 1.25],
  [50.88, 52.74, 'और वृंदा… ★तुलसी★ कैसे बनीं?'],
  [53.23, 55.72, 'पूरी कथा देखिए — ★लिंक नीचे★ है'],
];

function wrap(text, max) {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { const plain = (cur + ' ' + w).replace(/★/g, '').trim(); if (plain.length > max && cur) { lines.push(cur); cur = w; } else cur = (cur ? cur + ' ' : '') + w; }
  if (cur) lines.push(cur); return lines;
}
function captionSVG(t) {
  let out = '';
  for (const [a, b, text, big = 1] of CAPS) {
    const op = fade(t, a - .08, b + .25, .15, .2);
    if (op <= 0) continue;
    const pop = lerp(.9, 1, prog(t, a - .08, a + .12, ease.out));
    const size = SPEC.caption.size * big;
    const lines = wrap(text, Math.round(SPEC.caption.maxChars / big));
    const y0 = SPEC.caption.y - (lines.length - 1) * SPEC.caption.lineH * big / 2;
    const ls = lines.map((ln, i) => {
      let hl = false;
      const spans = ln.split(/(★)/).filter(Boolean).map(p => { if (p === '★') { hl = !hl; return ''; } return `<tspan fill="${hl ? '#ffd66b' : '#fff8ec'}">${p}</tspan>`; }).join('');
      return `<text x="${W / 2}" y="${y0 + i * SPEC.caption.lineH * big}" text-anchor="middle" font-family="'Noto Serif Devanagari', serif" font-weight="800" font-size="${size}"
        style="paint-order:stroke" stroke="#120604" stroke-width="10" stroke-linejoin="round">${spans}</text>`;
    }).join('');
    out += `<g opacity="${op}" transform="translate(${W / 2},${SPEC.caption.y}) scale(${pop}) translate(${-W / 2},${-SPEC.caption.y})">${ls}</g>`;
  }
  return out;
}

function frame(t) {
  let body = '';
  for (const s of SCENES) {
    if (t < s.a || t > s.b) continue;
    const fi = s.fi ?? SPEC.crossfade, fo = s.fo ?? SPEC.crossfade;
    const op = clamp(Math.min(s.a === 0 ? 1 : (t - s.a) / fi, (s.b - t) / fo));
    if (op > 0) body += `<g opacity="${op.toFixed(3)}">${s.fn(t)}</g>`;
  }
  const flash = Math.max(clamp(1 - Math.abs(t - 45.68) / .22), .6 * clamp(1 - Math.abs(t - 49.0) / .3), .35 * clamp(1 - Math.abs(t - 31.28) / .15));
  if (flash > 0) body += `<rect width="${W}" height="${H}" fill="#fff8ea" opacity="${flash.toFixed(3)}"/>`;
  // hook title (0.2–5.5 s) and the Tulasi title + CTA arrow in the last scene
  const hook = fade(t, .25, 5.5, .3, .3);
  const title = prog(t, 51.6, 52.4, ease.out) * fade(t, 51.6, 55.8, .1, .25);
  const arrow = fade(t, 53.2, 55.8, .2, .2);
  const gx = Math.floor((t * 977) % 512), gy = Math.floor((t * 613) % 512);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${A.defs()}${C.defs2()}${defs}
    ${body}
    <rect width="${W}" height="${H}" fill="url(#vignette)"/>
    ${GRAIN ? `<rect x="${-gx}" y="${-gy}" width="${W + 512}" height="${H + 512}" fill="url(#grainPat)" opacity="${SPEC.grain}" style="mix-blend-mode:overlay"/>` : ''}
    <rect y="${SPEC.caption.y - 190}" width="${W}" height="330" fill="url(#cband)"/>
    ${hook > 0 ? `<g opacity="${hook}"><rect width="${W}" height="330" fill="url(#topBand)"/><text x="${W / 2}" y="${SPEC.safeTop - 20}" text-anchor="middle" font-family="'Noto Serif Devanagari', serif" font-weight="800" font-size="84" fill="url(#goldV)" style="paint-order:stroke" stroke="#120604" stroke-width="12">भगवान को श्राप?</text></g>` : ''}
    ${title > 0 ? `<g opacity="${title}" transform="translate(${W / 2},${SPEC.safeTop + 90}) scale(${lerp(1.15, 1, title)})">
      <text text-anchor="middle" font-family="'Noto Serif Devanagari', serif" font-weight="800" font-size="128" fill="url(#goldV)" style="paint-order:stroke" stroke="#3a1608" stroke-width="10" filter="url(#glow)">तुलसी देवी</text>
      <text y="80" text-anchor="middle" font-family="'Noto Serif Devanagari', serif" font-weight="600" font-size="46" fill="#fff6e6" style="paint-order:stroke" stroke="#3a1608" stroke-width="6">संपूर्ण कथा</text></g>` : ''}
    ${captionSVG(t)}
    ${arrow > 0 ? `<g opacity="${arrow}" transform="translate(${W / 2},${1590 + Math.abs(Math.sin(t * 5)) * 22})"><path d="M-34 0 L 0 34 L 34 0" fill="none" stroke="#ffd66b" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M-34 -36 L 0 -2 L 34 -36" fill="none" stroke="#ffd66b" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/></g>` : ''}
  </svg>`;
}

module.exports = { W, H, FPS, DURATION, frame, CAPS };
