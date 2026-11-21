// Samudra Dev (ocean god) and baby Jalandhar — same build system as the other characters.
const A = require('../engine/art.js');
const C = require('../engine/characters.js');
const F = require('../engine/faces.js');
const INK = '#14262a';
const TORSO = 'M -19.5 120 L -21.8 151 C -44 155 -66 160 -80 168 C -94 176 -100 196 -98 216 C -96 232 -90 242 -82 246 C -76 250 -74 258 -73 268 C -70 300 -65 334 -64.4 376 L -66.7 430 L 66.7 430 L 64.4 376 C 65 334 70 300 73 268 C 74 258 76 250 82 246 C 90 242 96 232 98 216 C 100 196 94 176 80 168 C 66 160 44 155 21.8 151 L 19.5 120 Z';

const defs = `<defs>
  <radialGradient id="sdSkin" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#8fd2c8"/><stop offset=".62" stop-color="#4fa6a0"/><stop offset="1" stop-color="#2a6c6a"/></radialGradient>
  <linearGradient id="sdSkinL" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="#8fd2c8"/><stop offset=".45" stop-color="#4fa6a0"/><stop offset="1" stop-color="#2a6c6a"/></linearGradient>
  <linearGradient id="sdSilk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7fe0e8"/><stop offset=".5" stop-color="#2aa8c0"/><stop offset="1" stop-color="#14607a"/></linearGradient>
  <pattern id="sdWave" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 14 Q 10 4 20 14 T 40 14" stroke="#d8fbff" stroke-width="2" fill="none" opacity=".55"/></pattern>
  <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3ac0d8"/><stop offset=".5" stop-color="#1878a0"/><stop offset="1" stop-color="#0a3a5a"/></linearGradient>
  <radialGradient id="bySkin" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#e2ad80"/><stop offset=".62" stop-color="#c08054"/><stop offset="1" stop-color="#8a5232"/></radialGradient>
  <linearGradient id="swaddle" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd27a"/><stop offset=".5" stop-color="#f29a2a"/><stop offset="1" stop-color="#b8520e"/></linearGradient>
  <radialGradient id="fireGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2b0" stop-opacity=".95"/><stop offset=".35" stop-color="#ffb347" stop-opacity=".6"/><stop offset=".7" stop-color="#ff6a1a" stop-opacity=".2"/><stop offset="1" stop-color="#ff4a00" stop-opacity="0"/></radialGradient>
</defs>`;

// ---------------- BABY JALANDHAR (origin = top of skull; head 0..100, swaddle to ~210)
const BABY_FACE = { W: 50, chin: 122, cheek: 1.06, jaw: .7, noseY: 92, mouthY: 104, irisCol: '#5a2a10',
  eye: { ex: 21, ey: 68, ew: 24, eh: 13.5, tilt: 0, irisK: .95, flick: 1 }, liner: 2.4, crease: false,
  brow: { x0: 8, x1: 32, y: 50, arch: 3, t: 1.8 }, nose: 'button', blush: .42, blushY: 90,
  lips: { w: 7, up: 2.8, lo: 4.4, c1: '#c8504a', c2: '#e07068' }, smile: true };

function baby(x, y, s, o = {}) {
  const crying = o.mood === 'cry';
  const face = { ...BABY_FACE, id: 'by' + (o.id || '') + (o.mood || ''), skin: 'url(#bySkin)', shade: '#8a5232', rim: '#ffe0a0',
    noEars: true, eyes: crying ? 'closed' : (o.eyes || 'open'), mouth: crying ? 'open' : (o.mouth || 'smile'), smile: !crying, tears: crying, sad: crying };
  return `<g transform="translate(${x},${y}) scale(${s})">
    <ellipse cx="0" cy="110" rx="170" ry="190" fill="url(#fireGlow)" opacity="${o.glow ?? .9}"/>
    <!-- swaddle -->
    <path d="M-50 86 C -78 110 -80 170 -56 206 C -36 230 36 230 56 206 C 80 170 78 110 50 86 Q 0 70 -50 86Z" fill="url(#swaddle)" stroke="#6a2e08" stroke-width="2"/>
    <path d="M-50 92 C -20 120 20 140 54 112 M-56 150 C -20 170 30 172 62 150 M-50 196 C -16 208 20 208 50 194" stroke="#a8520e" stroke-width="2" fill="none" opacity=".7"/>
    <path d="M-50 88 Q 0 108 50 88" stroke="url(#gold)" stroke-width="6" fill="none"/>
    <!-- head (adult-proportioned face, scaled to baby size) -->
    <g transform="translate(0,-8) scale(.8)">
      <path d="M-49 56 C -58 56 -59 72 -49 76Z M49 56 C 58 56 59 72 49 76Z" fill="url(#bySkin)" stroke="${INK}" stroke-width="1.8"/>
      ${F.faceP(face)}
      <path d="M-38 18 C -32 2 -16 -6 0 -6 C 16 -6 32 2 38 18 C 26 10 10 10 0 12 C -10 10 -26 10 -38 18Z" fill="#1a0e08"/>
      <path d="M-5 -6 C -12 -20 2 -27 9 -17 C 5 -17 0 -14 -5 -6Z" fill="#1a0e08"/>
      <path d="M0 26 C 6 33 7 40 0 45 C -7 40 -6 33 0 26Z" fill="#ff7a1a" stroke="#b83a0a" stroke-width=".9"/><circle cx="0" cy="40" r="1.9" fill="#fff2b0"/>
    </g>
  </g>`;
}

// ---------------- SAMUDRA DEV
const SD_FACE = { W: 48, chin: 132, cheek: 1.0, jaw: .58, noseY: 96, mouthY: 112, irisCol: '#0e4a52',
  eye: { ex: 21, ey: 66, ew: 27, eh: 10, tilt: 2, irisK: .9, flick: 3.5 }, crease: true, liner: 2.6,
  brow: { x0: 5, x1: 37, y: 51, arch: 4, t: 3.8 }, nose: 'defined', lips: { w: 11, up: 3.8, lo: 5.6, c1: '#7a3a4a', c2: '#94505e' }, smile: true };

function conch(cx, cy, s = 1) {
  return `<g transform="translate(${cx},${cy}) rotate(-14) scale(${s})">
    <circle r="60" fill="#d8fbff" opacity=".25" filter="url(#softGlow)"/>
    <path d="M0 -40 C 18 -34 24 -10 18 14 C 14 26 -14 26 -18 14 C -24 -10 -18 -34 0 -40Z" fill="#fffaf0" stroke="#8a7a5a" stroke-width="1.6"/>
    <path d="M-12 -20 Q 0 -8 14 -22 M-15 0 Q 0 10 16 -2 M-12 14 Q 0 22 12 12" fill="none" stroke="#d8c8a8" stroke-width="2"/>
    <path d="M0 -40 C 6 -50 4 -58 0 -62 C -4 -58 -6 -50 0 -40Z" fill="#f6d0c0" stroke="#8a7a5a"/>
    <path d="M-8 24 Q 0 34 8 24" fill="#f6d0c0" stroke="#8a7a5a"/></g>`;
}
function waves(t, w = 220, y0 = 760, seed = 0) {
  let o = '';
  for (let k = 0; k < 5; k++) {
    const y = y0 + k * 34, amp = 14 - k * 1.5, ph = t * (1.6 - k * .15) + k + seed;
    let d = `M${-w - 60} ${y}`;
    for (let x = -w - 60; x <= w + 60; x += 20) d += ` L ${x} ${y + Math.sin(x / 34 + ph) * amp}`;
    d += ` L ${w + 60} ${y + 400} L ${-w - 60} ${y + 400}Z`;
    o += `<path d="${d}" fill="url(#sea)" opacity="${.75 + k * .05}" stroke="#d8fbff" stroke-width="${2.4 - k * .3}" stroke-opacity=".7"/>`;
  }
  return o + [...Array(14)].map((_, i) => `<circle cx="${-w + (i * 37) % (2 * w)}" cy="${y0 - 6 + Math.sin(t * 2 + i) * 8}" r="${3 + i % 3}" fill="#f4feff" opacity=".8"/>`).join('');
}

function samudra(x, y, s, o = {}) {
  const SK = 'url(#sdSkinL)', SH = '#2a6c6a';
  const hold = o.pose === 'hold';
  const face = { ...SD_FACE, id: 'sd' + (o.id || '') + (o.eyes || '') + (o.mouth || ''), skin: 'url(#sdSkin)', shade: '#2a6c6a', rim: '#d8fbff', blush: 0,
    eyes: o.eyes || 'open', mouth: o.mouth, smile: o.mouth ? o.mouth === 'smile' : true };
  const my = face.mouthY;
  face.overlay = `<path d="M-36 ${my - 14} C -42 ${my + 26} -22 ${my + 58} 0 ${my + 64} C 22 ${my + 58} 42 ${my + 26} 36 ${my - 14} C 24 ${my + 2} -24 ${my + 2} -36 ${my - 14}Z" fill="#0e3a40" opacity=".95"/>
    ${[-18, -6, 6, 18].map(xx => `<path d="M${xx} ${my + 10} q ${xx > 0 ? 6 : -6} 18 0 34" stroke="#2a6a70" stroke-width="1.6" fill="none"/>`).join('')}
    <path d="M0 ${my - 7} C -10 ${my - 12} -22 ${my - 9} -28 ${my + 2} C -18 ${my - 3} -9 ${my - 3} 0 ${my - 4} C 9 ${my - 3} 18 ${my - 3} 28 ${my + 2} C 22 ${my - 9} 10 ${my - 12} 0 ${my - 7}Z" fill="#0e3a40"/>`;
  const hair = (() => { let d = ''; const r = A.rng(5); for (let i = 0; i < 14; i++) { const sx = i % 2 ? 1 : -1, k = Math.floor(i / 2), x0 = sx * (40 + k * 7), len = 150 + r() * 90;
    d += `<path d="M${x0} 70 C ${x0 + sx * 30} ${70 + len * .3} ${x0 - sx * 10} ${70 + len * .6} ${x0 + sx * 26} ${70 + len} C ${x0 + sx * 6} ${70 + len * .65} ${x0 + sx * 40} ${70 + len * .35} ${x0 + sx * 14} 70Z" fill="${k % 2 ? '#0e3a40' : '#14484e'}"/>`; } return d; })();
  const crown = `<g transform="translate(0,-14)">
    <path d="M-58 40 Q 0 22 58 40 L 56 14 Q 0 -2 -56 14Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.6"/>
    ${[-44, -30, -16, 16, 30, 44].map(xx => `<circle cx="${xx}" cy="${24 - (44 - Math.abs(xx)) * .1}" r="4" fill="#fbfaf4" stroke="#a8a090" stroke-width=".8"/>`).join('')}
    <g transform="translate(0,12)">${[...Array(9)].map((_, i) => `<path transform="rotate(${-64 + i * 16})" d="M0 0 L -7 -56 Q 0 -62 7 -56Z" fill="url(#goldV)" stroke="#7a4a10" stroke-width="1"/>`).join('')}
      <path d="M-50 -24 A 52 52 0 0 1 50 -24" fill="none" stroke="#7a4a10" stroke-width="2"/></g>
    ${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M40 14 L 50 -26 L 56 14Z" fill="#e0503a" stroke="#8a2a1a" stroke-width="1"/>`).join('')}
    <circle cx="0" cy="22" r="7" fill="#fbfaf4" stroke="#a8a090"/><circle cx="-1.6" cy="20" r="2.4" fill="#fff"/></g>`;
  const ear = (sx) => `<g transform="translate(${sx * 52},90)"><path d="M0 0 C -9 4 -9 18 0 24 C 9 18 9 4 0 0Z" fill="#fbe8e0" stroke="#a8907a" stroke-width="1"/><circle cy="28" r="3.6" fill="#fbfaf4"/></g>`;
  const necklaces = `<path d="M-24 160 Q 0 176 24 160" stroke="#fbfaf4" stroke-width="7" stroke-dasharray=".1 9" stroke-linecap="round" fill="none"/>
    <path d="M-40 168 C -34 214 -14 236 0 242 C 14 236 34 214 40 168" stroke="#e0503a" stroke-width="6" stroke-dasharray=".1 8" stroke-linecap="round" fill="none"/>
    <path d="M-52 176 C -46 250 -20 292 0 300 C 20 292 46 250 52 176" stroke="#fbfaf4" stroke-width="6" stroke-dasharray=".1 9" stroke-linecap="round" fill="none"/>
    <path d="M0 298 C 12 300 16 312 12 320 C 8 326 -8 326 -12 320 C -16 312 -12 300 0 298Z" fill="url(#gold)" stroke="#7a4a10"/><circle cx="0" cy="312" r="5" fill="#2aa8c0"/>`;
  // arms
  const J = hold
    ? { r: { sh: [-80, 206], el: [-114, 318], wr: [-46, 344] }, l: { sh: [80, 206], el: [114, 318], wr: [46, 344] } }
    : { r: { sh: [-80, 206], el: [-132, 296], wr: [-124, 214] }, l: { sh: [80, 206], el: [104, 310], wr: [96, 414] } };
  const armsSvg = A.arm(J.r.sh, J.r.el, J.r.wr, SK, SH, [46, 44, 33, 34, 26]) + A.arm(J.l.sh, J.l.el, J.l.wr, SK, SH, [46, 44, 33, 34, 26]);
  const band = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L ${x2} ${y2}" stroke="#fbfaf4" stroke-width="9" stroke-dasharray=".1 7" stroke-linecap="round"/>`;
  const clipId = 'sdFore' + (o.id || '');
  return `<g transform="translate(${x},${y}) scale(${s})">
    <circle cx="0" cy="80" r="170" fill="#7fe0e8" opacity=".25" filter="url(#softGlow)"/>
    ${hair}
    <!-- lower garment (silk with wave pattern) -->
    <path d="M-70 420 C -92 520 -100 640 -100 760 L 100 760 C 100 640 92 520 70 420Z" fill="url(#sdSilk)" stroke="#0e3a4a" stroke-width="2"/>
    <path d="M-70 420 C -92 520 -100 640 -100 760 L 100 760 C 100 640 92 520 70 420Z" fill="url(#sdWave)"/>
    ${armsSvg}
    <path d="${TORSO}" fill="${SK}" stroke="${INK}" stroke-width="2.2"/>
    <path d="M-44 232 Q -24 242 -6 238 M44 232 Q 24 242 6 238" stroke="${SH}" stroke-width="1.6" fill="none" opacity=".5"/>
    <!-- aqua sash, belt -->
    <path d="M30 152 C 60 156 84 168 90 196 L 82 230 C 40 300 -10 360 -50 430 L -70 430 C -40 360 0 290 38 220 C 34 196 30 172 30 152Z" fill="url(#sdSilk)" stroke="#0e3a4a" stroke-width="2"/>
    <path d="M-66 394 Q 0 410 66 394 L 70 428 Q 0 444 -70 428Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.6"/>
    ${[-40, -20, 0, 20, 40].map(xx => `<circle cx="${xx}" cy="${413 + Math.abs(xx) * .02}" r="3.4" fill="#fbfaf4"/>`).join('')}
    ${necklaces}
    ${hold ? `<g clip-path="url(#${clipId})">${armsSvg}</g><clipPath id="${clipId}"><rect x="-300" y="244" width="600" height="400"/></clipPath>
      ${baby(0, 200, .62, { mood: o.babyMood || 'cry', id: 'h' + (o.id || ''), glow: .7 })}
      <g transform="translate(${J.r.wr[0]},${J.r.wr[1]}) rotate(28) scale(.66)">${A.holdingHand(SK, SH, -1, false)}</g>
      <g transform="translate(${J.l.wr[0]},${J.l.wr[1]}) rotate(-28) scale(.66)">${A.holdingHand(SK, SH, 1, false)}</g>`
    : `${band(-116, 252, -94, 258)}${band(88, 252, 110, 256)}
      ${conch(-124, 166, .95)}
      <g transform="translate(-124,214) scale(.66)">${A.holdingHand(SK, SH, -1, false)}</g>
      <g transform="translate(96,414) rotate(176) scale(.66)">${A.openPalm(SK, SH, 1)}</g>`}
    ${F.faceP(face)}
    <path d="M-48 32 C -44 18 -28 12 0 12 C 28 12 44 18 48 32 L 49 42 C 40 30 24 24 0 24 C -24 24 -40 30 -49 42Z" fill="#0e3a40"/>
    ${crown}${ear(-1)}${ear(1)}
    ${o.waves !== false ? waves(o.t || 0, 230, 600, 1) : ''}
  </g>`;
}

function samudraBabySheet() {
  const W = 1920, H = 1080;
  const card = (cx, cy, inner, id, label) => `<clipPath id="sb${id}"><rect x="${cx - 130}" y="${cy - 150}" width="260" height="300" rx="14"/></clipPath>
    <rect x="${cx - 130}" y="${cy - 150}" width="260" height="300" rx="14" fill="#0e2a3a" stroke="#4fa6a0" stroke-width="2"/>
    <g clip-path="url(#sb${id})">${inner}</g>
    <text x="${cx}" y="${cy + 182}" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="23" fill="#d8fbff">${label}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${A.defs()}${C.defs2()}${defs}
    <rect width="${W}" height="${H}" fill="#06202e"/>
    <text x="340" y="62" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="40" fill="#8fd2c8">SAMUDRA DEV</text>
    ${samudra(340, 200, .82, { id: 'full', waves: false })}
    <text x="860" y="62" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="34" fill="#ffd27a">…HOLDING BABY JALANDHAR</text>
    ${samudra(860, 200, .82, { id: 'hold', pose: 'hold', waves: false })}
    <g transform="translate(960,0)">${waves(0, 1000, 690, 1)}</g>
    <text x="1500" y="62" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="40" fill="#ffd27a">BABY JALANDHAR</text>
    ${card(1360, 290, baby(1360, 160, 1.15, { mood: 'cry', id: 'c1' }), 1, 'crying (the three worlds tremble)')}
    ${card(1640, 290, baby(1640, 160, 1.15, { mood: 'calm', id: 'c2' }), 2, 'calm')}
    ${card(1500, 760, `<rect x="1370" y="610" width="260" height="300" fill="#0a3a5a"/>${baby(1500, 640, .95, { mood: 'cry', id: 'c3' })}<g transform="translate(1500,0)">${waves(0, 130, 820, 3)}</g>`, 3, 'born in the waves')}
  </svg>`;
}

module.exports = { samudraBabySheet, samudra, baby, waves, defs };
