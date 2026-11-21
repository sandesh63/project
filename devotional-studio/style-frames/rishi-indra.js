// Rishi (sage) and Indra (king of the devas) — full body, same build system as Mahadev / Jalandhar.
const A = require('../engine/art.js');
const C = require('../engine/characters.js');
const F = require('../engine/faces.js');
const INK = '#2a1a10';

const TORSO = 'M -19.5 120 L -21.8 151 C -44 155 -66 160 -80 168 C -94 176 -100 196 -98 216 C -96 232 -90 242 -82 246 C -76 250 -74 258 -73 268 C -70 300 -65 334 -64.4 376 L -66.7 430 L 66.7 430 L 64.4 376 C 65 334 70 300 73 268 C 74 258 76 250 82 246 C 90 242 96 232 98 216 C 100 196 94 176 80 168 C 66 160 44 155 21.8 151 L 19.5 120 Z';
const lean = (k) => `scale(${k},1)`;

const defs = `<defs>
  <radialGradient id="rSkin" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#e2b48c"/><stop offset=".62" stop-color="#c48a60"/><stop offset="1" stop-color="#8e5a36"/></radialGradient>
  <linearGradient id="rSkinL" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="#e2b48c"/><stop offset=".45" stop-color="#c48a60"/><stop offset="1" stop-color="#8e5a36"/></linearGradient>
  <radialGradient id="iSkin" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#fbe0bc"/><stop offset=".62" stop-color="#eec08c"/><stop offset="1" stop-color="#c48e5c"/></radialGradient>
  <linearGradient id="iSkinL" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="#fbe0bc"/><stop offset=".45" stop-color="#eec08c"/><stop offset="1" stop-color="#c48e5c"/></linearGradient>
  <linearGradient id="saffron" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6a23a"/><stop offset=".55" stop-color="#e07818"/><stop offset="1" stop-color="#9a4a0c"/></linearGradient>
  <linearGradient id="silkW" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffaf0"/><stop offset=".6" stop-color="#efe4cc"/><stop offset="1" stop-color="#c8b894"/></linearGradient>
  <linearGradient id="cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c8d6f0"/></linearGradient>
  <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a2a"/><stop offset="1" stop-color="#4a2a10"/></linearGradient>
</defs>`;

const mala = (w, d, y0 = 160) => `<path d="M${-w} ${y0} C ${-w * .9} ${y0 + d * .7} ${-w * .4} ${y0 + d} 0 ${y0 + d + 8} C ${w * .4} ${y0 + d} ${w * .9} ${y0 + d * .7} ${w} ${y0}" fill="none" stroke="#6a2e14" stroke-width="6.5" stroke-dasharray="1 6.5" stroke-linecap="round"/>`;
const legs = (SK, SH, k = 1) => {
  const a = A.arm([-34 * k, 470], [-38 * k, 700], [-32 * k, 898], SK, SH, [72 * k, 68 * k, 48 * k, 50 * k, 30]);
  const b = A.arm([34 * k, 470], [38 * k, 700], [32 * k, 898], SK, SH, [72 * k, 68 * k, 48 * k, 50 * k, 30]);
  const foot = (sx) => `<g transform="scale(${sx},1)"><path d="M-50 898 C -60 914 -58 930 -40 934 L -12 934 C -4 928 -8 912 -16 898Z" fill="${SK}" stroke="${INK}" stroke-width="2"/></g>`;
  return a + b + foot(1) + foot(-1);
};

// ---------------- RISHI
const RISHI_FACE = { W: 46, chin: 136, cheek: .96, jaw: .52, noseY: 98, mouthY: 114, eye: { ex: 21, ey: 67, ew: 26, eh: 9, tilt: 1, irisK: .9, flick: 2 },
  liner: 2, crease: true, brow: { x0: 6, x1: 36, y: 52, arch: 3, t: 3.6 }, nose: 'defined', lips: { w: 10, up: 3.4, lo: 5, c1: '#8a4a3a', c2: '#a46050' }, smile: true };

function rishi(x, y, s, o = {}) {
  const SK = 'url(#rSkinL)', SH = '#8e5a36';
  const face = { ...RISHI_FACE, id: 'ri' + (o.id || '') + (o.eyes || ''), skin: 'url(#rSkin)', shade: '#8e5a36', rim: '#fff0d8', blush: .1, eyes: o.eyes || 'lowered', mouth: o.mouth, smile: o.mouth ? o.mouth === 'smile' : true };
  const by = face.brow.y, my = face.mouthY;
  // white eyebrows over the drawn ones, wrinkles, beard + moustache
  face.overlay = `${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M5 ${by + 1} C 14 ${by - 6} 28 ${by - 6} 38 ${by + 2}" stroke="#f4f0e6" stroke-width="4.4" fill="none" stroke-linecap="round"/>`).join('')}
    ${[0, 1].map(k => `<path d="M-20 ${by - 14 - k * 6} Q 0 ${by - 17 - k * 6} 20 ${by - 14 - k * 6}" stroke="#8e5a36" stroke-width="1.2" fill="none" opacity=".6"/>`).join('')}
    <path d="M-40 ${my - 16} C -46 ${my + 40} -26 ${my + 120} 0 ${my + 150} C 26 ${my + 120} 46 ${my + 40} 40 ${my - 16} C 26 ${my - 2} -26 ${my - 2} -40 ${my - 16}Z" fill="#f4f0e6" stroke="#c8c0b0" stroke-width="1.4"/>
    ${[-24, -12, 0, 12, 24].map(x => `<path d="M${x} ${my + 8} C ${x * 1.1} ${my + 50} ${x * .7} ${my + 100} ${x * .3} ${my + 138}" stroke="#d8d0c0" stroke-width="1.4" fill="none"/>`).join('')}
    <path d="M0 ${my - 7} C -10 ${my - 12} -24 ${my - 8} -30 ${my + 4} C -20 ${my - 2} -10 ${my - 2} 0 ${my - 3} C 10 ${my - 2} 20 ${my - 2} 30 ${my + 4} C 24 ${my - 8} 10 ${my - 12} 0 ${my - 7}Z" fill="#fbf8f0" stroke="#c8c0b0" stroke-width="1"/>`;
  const hairBack = `<path d="M0 -4 C -44 -4 -60 20 -60 60 C -62 110 -56 150 -62 190 C -30 200 30 200 62 190 C 56 150 62 110 60 60 C 60 20 44 -4 0 -4Z" fill="#e8e2d4"/>
    ${[-1, 1].map(sx => [0, 1, 2].map(k => `<path transform="scale(${sx},1)" d="M${48 + k * 3} ${80 + k * 30} C ${58 + k * 3} ${110 + k * 30} ${56 + k * 3} ${140 + k * 30} ${60 + k * 3} ${170 + k * 20}" stroke="#c8c0b0" stroke-width="1.4" fill="none"/>`).join('')).join('')}`;
  const bun = `<path d="M-26 12 C -32 -16 -20 -40 0 -44 C 20 -40 32 -16 26 12Z" fill="#e8e2d4" stroke="#b8b0a0" stroke-width="1.4"/>
    ${[-32, -18, -4].map((yy, i) => `<path d="M${-18 + i * 3} ${yy} Q 0 ${yy - 7} ${18 - i * 3} ${yy}" stroke="#b8b0a0" stroke-width="1.6" fill="none"/>`).join('')}
    <path d="M-26 8 Q 0 -2 26 8" stroke="#6a2e14" stroke-width="5.5" stroke-dasharray="1 6" stroke-linecap="round" fill="none"/>`;
  const tilak = [0, 1, 2].map(k => `<path d="M-24 ${by - 26 + k * 5} Q 0 ${by - 29 + k * 5} 24 ${by - 26 + k * 5}" stroke="#fffaf0" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('') + `<circle cx="0" cy="${by - 21}" r="2.8" fill="#d1261c"/>`;
  const J1 = { sh: [-76, 206], el: [-110, 300], wr: [-112, 214] }, J2 = { sh: [76, 206], el: [100, 304], wr: [70, 390] };
  return `<g transform="translate(${x},${y}) scale(${s})">
    <!-- staff -->
    <rect x="-108" y="40" width="11" height="900" rx="5" fill="url(#wood)" stroke="#2a1606" stroke-width="1.4"/>
    <path d="M-102 40 C -118 30 -122 10 -108 0 C -94 8 -90 28 -102 40Z" fill="url(#wood)" stroke="#2a1606"/>
    ${legs(SK, SH, .92)}
    <!-- dhoti -->
    <path d="M-66 420 C -84 500 -92 600 -90 720 L -40 740 L -10 700 L 10 700 L 40 740 L 90 720 C 92 600 84 500 66 420Z" fill="url(#saffron)" stroke="#6a2e08" stroke-width="2"/>
    ${[-50, -24, 24, 50].map(x => `<path d="M${x * .8} 440 C ${x} 560 ${x * 1.1} 650 ${x * 1.2} 720" stroke="#9a4a0c" stroke-width="2" fill="none" opacity=".6"/>`).join('')}
    <path d="M-10 430 L 10 430 L 14 700 L -14 700Z" fill="#f6a23a" stroke="#6a2e08" stroke-width="1.4"/>
    ${hairBack}
    <g transform="${lean(.9)}">
      ${A.arm(J1.sh, J1.el, J1.wr, SK, SH, [42, 40, 30, 30, 24])}${A.arm(J2.sh, J2.el, J2.wr, SK, SH, [42, 40, 30, 30, 24])}
      <path d="${TORSO}" fill="${SK}" stroke="${INK}" stroke-width="2.2"/>
      <path d="M-40 230 Q -20 240 -6 236 M40 230 Q 20 240 6 236" stroke="${SH}" stroke-width="1.6" fill="none" opacity=".5"/>
      <!-- saffron upper cloth over the left shoulder -->
      <path d="M30 152 C 64 156 92 170 98 210 C 98 260 80 320 70 380 L 72 430 L -66 430 C -40 380 -6 320 20 270 C 30 230 30 190 30 152Z" fill="url(#saffron)" stroke="#6a2e08" stroke-width="2"/>
      ${[0, 1, 2].map(k => `<path d="M${40 + k * 16} 170 C ${30 + k * 16} 260 ${0 + k * 20} 340 ${-30 + k * 26} 430" stroke="#9a4a0c" stroke-width="2" fill="none" opacity=".55"/>`).join('')}
      <path d="M-66 394 Q 0 410 66 394" stroke="#9a4a0c" stroke-width="10" fill="none"/>
    </g>
    ${mala(40, 130, 158)}${mala(30, 90, 156)}
    ${F.faceP(face)}
    <path d="M-46 30 C -42 16 -26 10 0 10 C 26 10 42 16 46 30 L 47 40 C 38 28 22 22 0 22 C -22 22 -38 28 -47 40Z" fill="#e8e2d4"/>
    ${bun}${tilak}
    ${[-1, 1].map(sx => `<g transform="translate(${sx * 50},92)"><circle r="6" fill="#6a2e14"/></g>`).join('')}
    <!-- hands: right holds the staff, left holds the kamandalu -->
    <g transform="translate(${-112 * .9},214) scale(.62)">${A.holdingHand(SK, SH, -1, false)}</g>
    <g transform="translate(${70 * .9 + 4},400)">
      <path d="M-26 0 C -34 30 -26 56 0 60 C 26 56 34 30 26 0Z" fill="#6a3a1a" stroke="#2a1606" stroke-width="2"/>
      <path d="M-20 0 L 20 0 L 14 -14 L -14 -14Z" fill="#7a4a22" stroke="#2a1606" stroke-width="1.6"/>
      <path d="M22 18 C 44 14 52 0 50 -12" stroke="#6a3a1a" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M-14 -14 C -14 -40 14 -40 14 -14" stroke="#4a2a10" stroke-width="4" fill="none"/>
      <path d="M-24 14 Q 0 22 24 14" stroke="#c8922a" stroke-width="3" fill="none"/></g>
    <g transform="translate(${70 * .9},390) rotate(170) scale(.6)">${A.holdingHand(SK, SH, 1, false)}</g>
  </g>`;
}

// ---------------- INDRA
const INDRA_FACE = { W: 48, chin: 132, cheek: 1.0, jaw: .56, noseY: 95, mouthY: 112, eye: { ex: 21, ey: 66, ew: 28, eh: 11, tilt: 1.5, irisK: .88, flick: 3.5 },
  liner: 2.6, crease: true, brow: { x0: 6, x1: 36, y: 51, arch: 4, t: 3.2 }, nose: 'soft', lips: { w: 11, up: 4, lo: 6, c1: '#b4483e', c2: '#cc6054' }, smile: true };

function vajra(x, y, s) {
  const prong = (sy) => `<g transform="scale(1,${sy})"><path d="M0 -20 C -4 -40 -4 -60 0 -84 C 4 -60 4 -40 0 -20Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.2"/>
    ${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M2 -22 C 22 -32 26 -56 10 -78 C 18 -56 14 -40 2 -30Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.2"/>`).join('')}
    <ellipse cx="0" cy="-18" rx="12" ry="6" fill="url(#gold)" stroke="#7a4a10"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s})"><circle r="70" fill="url(#lampGlow)" opacity=".7"/>${prong(1)}${prong(-1)}
    <rect x="-7" y="-14" width="14" height="28" rx="5" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.2"/><circle r="5" fill="#2a8ad8"/></g>`;
}

function indra(x, y, s, o = {}) {
  const SK = 'url(#iSkinL)', SH = '#c48e5c';
  const face = { ...INDRA_FACE, id: 'in' + (o.id || '') + (o.eyes || ''), skin: 'url(#iSkin)', shade: '#b47a4a', rim: '#fff4d8', blush: .14, eyes: o.eyes || 'open', mouth: o.mouth, smile: o.mouth ? o.mouth === 'smile' : true };
  const my = face.mouthY;
  face.overlay = `<path d="M-2 ${my - 7} C -8 ${my - 10} -16 ${my - 9} -20 ${my - 4} C -15 ${my - 6} -8 ${my - 5} -2 ${my - 5}Z M2 ${my - 7} C 8 ${my - 10} 16 ${my - 9} 20 ${my - 4} C 15 ${my - 6} 8 ${my - 5} 2 ${my - 5}Z" fill="#2a1a10"/>`;
  const by = face.brow.y;
  const crown = `<g transform="translate(0,-14)">
    <path d="M-58 40 Q 0 22 58 40 L 56 14 Q 0 -2 -56 14Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.6"/>
    <path d="M-50 14 L -40 -40 C -24 -60 24 -60 40 -40 L 50 14Z" fill="url(#goldV)" stroke="#7a4a10" stroke-width="1.6"/>
    ${[-20, -4, 12].map((yy, i) => `<path d="M${-46 + i * 4} ${yy} Q 0 ${yy - 10} ${46 - i * 4} ${yy}" stroke="#7a4a10" stroke-width="2" fill="none"/>`).join('')}
    <path d="M-40 -40 C -24 -60 24 -60 40 -40 L 26 -74 Q 0 -90 -26 -74Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.4"/>
    <path d="M0 -84 C 10 -96 8 -112 0 -122 C -8 -112 -10 -96 0 -84Z" fill="url(#gold)" stroke="#7a4a10"/>
    <ellipse cx="0" cy="24" rx="9" ry="7" fill="#2a8ad8" stroke="#7a4a10"/>
    ${[-30, 30].map(xx => `<circle cx="${xx}" cy="28" r="4" fill="#d1261c" stroke="#7a4a10" stroke-width=".8"/>`).join('')}
    <ellipse cx="0" cy="-30" rx="7" ry="6" fill="#d1261c" stroke="#7a4a10"/>
    ${[-1, 1].map(sx => `<g transform="translate(${sx * 56},20) scale(${sx},1)">${[-60, -25, 10].map(a => `<ellipse transform="rotate(${a})" cx="0" cy="-10" rx="4.5" ry="9" fill="url(#gold)" stroke="#7a4a10" stroke-width=".8"/>`).join('')}<circle r="4.5" fill="#d1261c" stroke="#7a4a10" stroke-width=".8"/></g>`).join('')}</g>`;
  const J1 = { sh: [-80, 206], el: [-132, 296], wr: [-124, 214] }, J2 = { sh: [80, 206], el: [104, 310], wr: [96, 414] };
  const band = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L ${x2} ${y2}" stroke="url(#gold)" stroke-width="11" stroke-linecap="round"/>`;
  const clouds = [...Array(7)].map((_, i) => `<ellipse cx="${-180 + i * 60}" cy="${930 + (i % 2) * 14}" rx="${70 + (i % 3) * 14}" ry="${40 + (i % 2) * 10}" fill="url(#cloud)" opacity=".96"/>`).join('');
  return `<g transform="translate(${x},${y}) scale(${s})">
    <circle cx="0" cy="60" r="150" fill="url(#lampGlow)" opacity=".6"/>
    <g transform="scale(1.15,1)">
    ${legs(SK, SH)}
    <!-- white silk dhoti with gold border -->
    <path d="M-70 420 C -90 500 -100 620 -96 760 L -46 790 L -12 740 L 12 740 L 46 790 L 96 760 C 100 620 90 500 70 420Z" fill="url(#silkW)" stroke="#8a7a5a" stroke-width="2"/>
    <path d="M-96 760 L -46 790 L -12 740 L 12 740 L 46 790 L 96 760" stroke="url(#gold)" stroke-width="8" fill="none"/>
    ${[-56, -28, 28, 56].map(xx => `<path d="M${xx * .8} 440 C ${xx} 580 ${xx * 1.1} 680 ${xx * 1.2} 760" stroke="#c8b894" stroke-width="2" fill="none"/>`).join('')}
    <path d="M-12 430 L 12 430 L 16 740 L -16 740Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.4"/>
    <path d="M-50 60 C -58 110 -54 150 -60 176 L 60 176 C 54 150 58 110 50 60Z" fill="#1a1008"/>
    ${A.arm(J1.sh, J1.el, J1.wr, SK, SH, [46, 44, 33, 34, 26])}${band(-116, 252, -94, 258)}${band(-136, 222, -114, 224)}
    ${A.arm(J2.sh, J2.el, J2.wr, SK, SH, [46, 44, 33, 34, 26])}${band(88, 252, 110, 256)}${band(88, 402, 110, 404)}
    <path d="${TORSO}" fill="${SK}" stroke="${INK}" stroke-width="2.2"/>
    <path d="M-44 232 Q -24 242 -6 238 M44 232 Q 24 242 6 238" stroke="${SH}" stroke-width="1.6" fill="none" opacity=".5"/>
    <path d="M0 356 Q 4 363 0 370" stroke="${SH}" stroke-width="2.2" fill="none"/>
    <!-- gold-bordered uttariya over both shoulders, jewelled collar, sacred thread, belt -->
    ${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M-24 156 C -60 162 -92 172 -100 196 C -104 212 -102 228 -96 238 C -86 214 -60 196 -30 186Z" fill="#2a6ab8" stroke="#123a6a" stroke-width="1.6"/>
      <path transform="scale(${sx},1)" d="M-30 186 C -60 196 -86 214 -96 238" stroke="url(#gold)" stroke-width="5" fill="none"/>`).join('')}
    <path d="M-40 156 C -36 196 -14 214 0 220 C 14 214 36 196 40 156" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.6"/>
    ${[-24, -12, 0, 12, 24].map(xx => `<circle cx="${xx}" cy="${178 + (24 - Math.abs(xx)) * .8}" r="4" fill="${xx === 0 ? '#2a8ad8' : '#d1261c'}" stroke="#7a4a10" stroke-width=".8"/>`).join('')}
    <path d="M86 196 C 40 270 -20 340 -60 410" stroke="#fffaf0" stroke-width="2.6" fill="none"/>
    <path d="M-66 392 Q 0 408 66 392 L 70 428 Q 0 444 -70 428Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.6"/>
    <ellipse cx="0" cy="414" rx="12" ry="10" fill="#2a8ad8" stroke="#7a4a10"/>
    </g>
    ${F.faceP(face)}
    <path d="M-48 32 C -44 18 -28 12 0 12 C 28 12 44 18 48 32 L 49 42 C 40 30 24 24 0 24 C -24 24 -40 30 -49 42Z" fill="#1a1008"/>
    <path d="M-2 ${by - 4} L 0 ${by - 22} L 2 ${by - 4}Z" fill="#d1261c"/>
    ${crown}
    ${[-1, 1].map(sx => `<g transform="translate(${sx * 52},90)"><circle r="8" fill="url(#gold)" stroke="#7a4a10"/><circle cy="12" r="4" fill="#2a8ad8"/></g>`).join('')}
    ${vajra(-143, 180, .95)}
    <g transform="translate(-143,214) scale(.7)">${A.holdingHand(SK, SH, -1, false)}</g>
    <g transform="translate(110,414) rotate(176) scale(.7)">${A.openPalm(SK, SH, 1)}</g>
    ${clouds}
  </g>`;
}

function rishiIndraSheet() {
  const W = 1920, H = 1080;
  const card = (cx, cy, fn, o, id, label, bg) => `<clipPath id="ri${id}"><rect x="${cx - 120}" y="${cy - 150}" width="240" height="300" rx="14"/></clipPath>
    <rect x="${cx - 120}" y="${cy - 150}" width="240" height="300" rx="14" fill="${bg}" stroke="#c8b894" stroke-width="2"/>
    <g clip-path="url(#ri${id})"><g transform="translate(${cx},${cy - 80})">${fn(0, 0, 1.1, { ...o, id })}</g></g>
    <text x="${cx}" y="${cy + 182}" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="23" fill="#4a3a20">${label}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${A.defs()}${C.defs2()}${defs}
    <rect width="${W}" height="${H}" fill="#f4ecdc"/>
    <ellipse cx="300" cy="980" rx="140" ry="13" fill="#7a5a30" opacity=".25" filter="url(#blur3)"/>
    ${rishi(300, 205, .82, { id: 'full' })}
    <text x="300" y="70" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="40" fill="#8a3a14">RISHI</text>
    <rect x="600" y="0" width="${W - 600}" height="${H}" fill="#e6eefc"/>
    ${indra(860, 205, .8, { id: 'full' })}
    <text x="860" y="70" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="40" fill="#1f3a7a">INDRA</text>
    ${card(1290, 290, rishi, { eyes: 'closed', mouth: 'soft' }, 1, 'rishi · meditation', '#fbf4e6')}
    ${card(1560, 290, rishi, { eyes: 'open', mouth: 'smile' }, 2, 'rishi · blessing', '#fbf4e6')}
    ${card(1290, 760, indra, { eyes: 'open', mouth: 'smile' }, 3, 'indra · proud', '#f4f8ff')}
    ${card(1560, 760, indra, { eyes: 'wide', mouth: 'open' }, 4, 'indra · afraid (defeated by Jalandhar)', '#f4f8ff')}
  </svg>`;
}

module.exports = { rishiIndraSheet, rishi, indra, defs };
