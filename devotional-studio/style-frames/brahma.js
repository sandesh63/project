// Brahma — three visible faces, four arms (white lotus + mala, pink lotus, abhaya, Vedas), pink shawl, yellow dhoti, on a lotus.
const A = require('../engine/art.js');
const C = require('../engine/characters.js');
const F = require('../engine/faces.js');
const INK = '#2a1a10';
const TORSO = 'M -19.5 120 L -21.8 151 C -44 155 -66 160 -80 168 C -94 176 -100 196 -98 216 C -96 232 -90 242 -82 246 C -76 250 -74 258 -73 268 C -70 300 -65 334 -64.4 376 L -66.7 430 L 66.7 430 L 64.4 376 C 65 334 70 300 73 268 C 74 258 76 250 82 246 C 90 242 96 232 98 216 C 100 196 94 176 80 168 C 66 160 44 155 21.8 151 L 19.5 120 Z';
const SK = 'url(#bmSkinL)', SH = '#b47a48';

const defs = `<defs>
  <radialGradient id="bmSkin" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#fcd8b0"/><stop offset=".62" stop-color="#eab486"/><stop offset="1" stop-color="#b47a48"/></radialGradient>
  <linearGradient id="bmSkinL" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="#fcd8b0"/><stop offset=".45" stop-color="#eab486"/><stop offset="1" stop-color="#b47a48"/></linearGradient>
  <linearGradient id="bmPink" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6a8c4"/><stop offset=".55" stop-color="#d8668e"/><stop offset="1" stop-color="#9a3a5e"/></linearGradient>
  <linearGradient id="bmYellow" gradientUnits="userSpaceOnUse" x1="-120" y1="0" x2="120" y2="0"><stop offset="0" stop-color="#ffe066"/><stop offset=".5" stop-color="#f6b81e"/><stop offset="1" stop-color="#c88208"/></linearGradient>
  <linearGradient id="bmTeal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4ab8b0"/><stop offset="1" stop-color="#1e6a72"/></linearGradient>
</defs>`;

const BFACE = { W: 46, chin: 132, cheek: .98, jaw: .55, noseY: 96, mouthY: 112, irisCol: '#4a2a14',
  eye: { ex: 20, ey: 66, ew: 26, eh: 9.5, tilt: 1.5, irisK: .9, flick: 3 }, crease: true, liner: 2.4,
  brow: { x0: 6, x1: 35, y: 51, arch: 4, t: 3 }, nose: 'defined', lips: { w: 10, up: 3.6, lo: 5.4, c1: '#a8484a', c2: '#c4605e' }, smile: true };

function head(o, id, side = 0) {
  const p = { ...BFACE, id, skin: 'url(#bmSkin)', shade: '#b47a48', rim: '#fff0d8', blush: .1, eyes: o.eyes || 'lowered', mouth: o.mouth, smile: o.mouth ? o.mouth === 'smile' : true, look: side * 3 };
  const by = p.brow.y, my = p.mouthY;
  p.overlay = `${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M5 ${by + 1} C 14 ${by - 6} 28 ${by - 6} 37 ${by + 2}" stroke="#f6f2ea" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')}
    <path d="M-42 ${my - 22} C -50 ${my + 40} -28 ${my + 110} 0 ${my + 132} C 28 ${my + 110} 50 ${my + 40} 42 ${my - 22} C 28 ${my - 4} -28 ${my - 4} -42 ${my - 22}Z" fill="#f6f2ea" stroke="#c8c0b0" stroke-width="1.4"/>
    ${[-26, -13, 0, 13, 26].map(x => `<path d="M${x} ${my + 10} C ${x * 1.1} ${my + 50} ${x * .7} ${my + 90} ${x * .3} ${my + 122}" stroke="#d8d0c4" stroke-width="1.4" fill="none"/>`).join('')}
    <path d="M0 ${my - 7} C -10 ${my - 13} -26 ${my - 9} -34 ${my + 5} C -22 ${my - 2} -10 ${my - 2} 0 ${my - 3} C 10 ${my - 2} 22 ${my - 2} 34 ${my + 5} C 26 ${my - 9} 10 ${my - 13} 0 ${my - 7}Z" fill="#fbf8f0" stroke="#c8c0b0" stroke-width="1"/>
    <path d="M-3 ${by - 4} L 0 ${by - 24} L 3 ${by - 4}Z" fill="#d1261c"/><path d="M-20 ${by - 18} Q 0 ${by - 21} 20 ${by - 18}" stroke="#fffaf0" stroke-width="2.4" fill="none"/>`;
  const crown = `<g transform="translate(0,-16)">
    <path d="M-50 40 Q 0 24 50 40 L 48 14 Q 0 0 -48 14Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.6"/>
    ${[-30, -15, 0, 15, 30].map(xx => `<circle cx="${xx}" cy="${24 - (30 - Math.abs(xx)) * .1}" r="${xx === 0 ? 5.5 : 3}" fill="${xx === 0 ? '#d1261c' : (Math.abs(xx) === 15 ? '#1f8a4a' : '#fff4d6')}" stroke="#7a4a10" stroke-width=".7"/>`).join('')}
    <path d="M-44 14 L -36 -40 C -22 -56 22 -56 36 -40 L 44 14Z" fill="url(#goldV)" stroke="#7a4a10" stroke-width="1.4"/>
    ${[-16, 0].map((yy, i) => `<path d="M${-40 + i * 3} ${yy} Q 0 ${yy - 9} ${40 - i * 3} ${yy}" stroke="#7a4a10" stroke-width="1.6" fill="none"/>`).join('')}
    <ellipse cx="0" cy="-22" rx="6" ry="5.5" fill="#8a4ad8" stroke="#7a4a10"/>
    <path d="M-36 -40 C -22 -56 22 -56 36 -40 L 24 -70 Q 0 -82 -24 -70Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.2"/>
    <path d="M-22 -70 Q 0 -84 22 -70 L 12 -96 Q 0 -104 -12 -96Z" fill="url(#goldV)" stroke="#7a4a10"/>
    <path d="M0 -100 C 8 -110 7 -122 0 -130 C -7 -122 -8 -110 0 -100Z" fill="url(#gold)" stroke="#7a4a10"/></g>`;
  return `<g>
    <path d="M-48 40 C -56 70 -56 110 -46 140 L 46 140 C 56 110 56 70 48 40Z" fill="#e8e2d6"/>
    ${F.faceP(p)}
    <path d="M-46 32 C -42 20 -26 14 0 14 C 26 14 42 20 46 32 L 47 42 C 38 32 22 26 0 26 C -22 26 -38 32 -47 42Z" fill="#e8e2d6"/>
    ${crown}
    ${[-1, 1].map(sx => `<g transform="translate(${sx * 49},90)"><circle r="7" fill="url(#gold)" stroke="#7a4a10"/><circle cy="10" r="3" fill="#d1261c"/></g>`).join('')}
  </g>`;
}

const lotusFlower = (col1, col2, s = 1) => `<g transform="scale(${s})">${[-50, -25, 0, 25, 50].map(a => `<path transform="rotate(${a})" d="M0 0 C 10 -12 10 -30 0 -40 C -10 -30 -10 -12 0 0Z" fill="${col1}" stroke="${col2}" stroke-width="1.4"/>`).join('')}</g>`;

function brahma(x, y, s, o = {}) {
  const id = 'bm' + (o.id || '');
  // joints (screen left = his right)
  const BR = { sh: [-82, 204], el: [-196, 176], wr: [-226, 76] };      // back right: white lotus + mala
  const BL = { sh: [82, 204], el: [196, 176], wr: [226, 76] };         // back left: pink lotus
  const FR = { sh: [-86, 214], el: [-150, 372], wr: [-176, 280] };     // front right: abhaya
  const FL = { sh: [86, 214], el: [128, 380], wr: [70, 420] };         // front left: Vedas at the waist
  const aw = [44, 42, 31, 32, 25], bw = [40, 38, 28, 29, 23];
  const band = (a, b, t) => A.bandOn(a, b, t, 40);
  const legs = A.arm([-36, 470], [-40, 700], [-34, 898], SK, SH, [74, 70, 50, 52, 32]) + A.arm([36, 470], [40, 700], [34, 898], SK, SH, [74, 70, 50, 52, 32])
    + [-1, 1].map(sx => `<g transform="scale(${sx},1)"><path d="M-52 898 C -62 914 -60 930 -42 934 L -14 934 C -6 928 -10 912 -18 898Z" fill="${SK}" stroke="${INK}" stroke-width="2"/><path d="M-52 900 Q -34 906 -18 900" stroke="url(#gold)" stroke-width="5" fill="none"/></g>`).join('');
  const fc = 'fore' + id;
  const frontArms = A.arm(FR.sh, FR.el, FR.wr, SK, SH, aw) + A.arm(FL.sh, FL.el, FL.wr, SK, SH, aw);
  const K = 1.12, unK = (1 / K).toFixed(4);
  return `<g transform="translate(${x},${y}) scale(${s})"><g transform="scale(${K},1)">
    <circle cx="0" cy="40" r="190" fill="url(#lampGlow)" opacity=".55"/>
    <circle cx="0" cy="40" r="150" fill="none" stroke="#ffe7a0" stroke-width="3" opacity=".6"/>
    <g transform="translate(0,940) scale(2.6)">${A.lotus(0, 0, 1, '#f6b6c6', '#c64f73')}</g>
    ${legs}
    <!-- yellow dhoti, teal sash -->
    <path d="M-74 420 C -96 520 -108 640 -104 770 L -52 800 L -14 750 L 14 750 L 52 800 L 104 770 C 108 640 96 520 74 420Z" fill="url(#bmYellow)" stroke="#8a5a08" stroke-width="2"/>
    ${[-60, -30, 30, 60].map(xx => `<path d="M${xx * .8} 440 C ${xx} 580 ${xx * 1.1} 680 ${xx * 1.2} 770" stroke="#c88208" stroke-width="2.2" fill="none" opacity=".7"/>`).join('')}
    <path d="M-104 770 L -52 800 L -14 750 L 14 750 L 52 800 L 104 770" stroke="url(#borderMotif)" stroke-width="10" fill="none"/>
    <!-- pink shawl hanging behind both arms -->
    ${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M-70 170 C -120 190 -138 260 -142 360 L -150 700 Q -128 712 -108 704 C -110 560 -108 420 -100 300Z" fill="url(#bmPink)" stroke="#7a2a48" stroke-width="2"/>`).join('')}
    <!-- back arms + their hands and flowers -->
    ${A.arm(BR.sh, BR.el, BR.wr, SK, SH, bw)}${band(BR.sh, BR.el, .5)}${A.arm(BL.sh, BL.el, BL.wr, SK, SH, bw)}${band(BL.sh, BL.el, .5)}
    <g transform="translate(${BR.wr[0]},${BR.wr[1] - 70})">${lotusFlower('#fffaf0', '#c8c0a8', 1.1)}</g><path d="M${BR.wr[0]} ${BR.wr[1] - 70} L ${BR.wr[0]} ${BR.wr[1] - 20}" stroke="#2e7a3a" stroke-width="4"/>
    <path d="M${BR.wr[0] - 10} ${BR.wr[1] - 10} C ${BR.wr[0] - 30} ${BR.wr[1] + 40} ${BR.wr[0] - 20} ${BR.wr[1] + 90} ${BR.wr[0] - 2} ${BR.wr[1] + 110}" stroke="#6a2e14" stroke-width="6" stroke-dasharray="1 6" stroke-linecap="round" fill="none"/>
    <g transform="translate(${BR.wr[0]},${BR.wr[1]}) scale(.64)">${A.holdingHand(SK, SH, -1, false)}</g>
    <g transform="translate(${BL.wr[0]},${BL.wr[1] - 70})">${lotusFlower('#f6b6c6', '#c64f73', 1.1)}</g><path d="M${BL.wr[0]} ${BL.wr[1] - 70} L ${BL.wr[0]} ${BL.wr[1] - 20}" stroke="#2e7a3a" stroke-width="4"/>
    <g transform="translate(${BL.wr[0]},${BL.wr[1]}) scale(.64)">${A.holdingHand(SK, SH, 1, false)}</g>
    <!-- side heads (behind the main head, turned outward) -->
    <g transform="translate(-60,22) scale(${(.78 / K).toFixed(4)},.86)">${head(o, id + 'l', -1)}</g>
    <g transform="translate(60,22) scale(${(.78 / K).toFixed(4)},.86)">${head(o, id + 'r', 1)}</g>
    <!-- torso -->
    ${frontArms}
    <path d="${TORSO}" fill="${SK}" stroke="${INK}" stroke-width="2.2"/>
    <path d="M-44 232 Q -24 242 -6 238 M44 232 Q 24 242 6 238" stroke="${SH}" stroke-width="1.6" fill="none" opacity=".5"/>
    <path d="M0 356 Q 4 363 0 370" stroke="${SH}" stroke-width="2.2" fill="none"/>
    <!-- shawl over the shoulders (front edges) -->
    ${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M-26 158 C -62 164 -96 176 -104 200 C -108 216 -104 232 -98 242 C -88 218 -62 198 -32 188Z" fill="url(#bmPink)" stroke="#7a2a48" stroke-width="2"/>`).join('')}
    <path d="M-66 392 Q 0 408 66 392 L 70 428 Q 0 444 -70 428Z" fill="url(#bmTeal)" stroke="#123a40" stroke-width="1.6"/>
    <path d="M-66 396 Q 0 412 66 396" stroke="url(#gold)" stroke-width="4" fill="none"/>
    <ellipse cx="0" cy="414" rx="14" ry="11" fill="url(#gold)" stroke="#7a4a10"/><ellipse cx="0" cy="414" rx="6" ry="5" fill="#d1261c"/>
    <!-- necklaces + white flower garland -->
    <path d="M-40 166 C -34 206 -14 226 0 232 C 14 226 34 206 40 166" stroke="url(#gold)" stroke-width="6" fill="none"/>
    <path d="M-52 176 C -46 250 -20 300 0 310 C 20 300 46 250 52 176" stroke="url(#gold)" stroke-width="3" fill="none"/>
    <path d="M0 230 l 8 10 -8 13 -8 -13z" fill="url(#gold)" stroke="#7a4a10"/><circle cx="0" cy="242" r="3" fill="#d1261c"/>
    ${[-1, 1].map(sx => { let o2 = ''; for (let i = 0; i < 22; i++) { const u = i / 21; const gx = sx * (34 + Math.sin(u * 3) * 24 + u * 16), gy = 170 + u * 380; o2 += `<circle cx="${gx}" cy="${gy}" r="5" fill="#fffaf0" stroke="#cfc3a6" stroke-width=".8"/>`; } return o2; }).join('')}
    <!-- front arms: forearms in front of the body -->
    <clipPath id="${fc}"><rect x="-300" y="250" width="600" height="400"/></clipPath>
    <g clip-path="url(#${fc})">${frontArms}</g>
    ${band(FR.sh, FR.el, .28)}${band(FL.sh, FL.el, .28)}
    <g transform="translate(${FR.wr[0]},${FR.wr[1]}) rotate(-8) scale(.68)">${A.openPalm(SK, SH, 1)}</g>
    <!-- the Vedas: palm turned up (fingers pointing inward), open book lying on it, thumb over the cover edge -->
    <g transform="translate(${FL.wr[0]},${FL.wr[1]}) rotate(-96) scale(.66)">${A.openPalm(SK, SH, -1)}</g>
    <g transform="translate(${FL.wr[0] - 34},${FL.wr[1] - 11}) rotate(-6)">
      <path d="M-60 0 L 0 9 L 60 0 L 60 -9 L 0 0 L -60 -9Z" fill="#8a3a1a" stroke="#4a1a08" stroke-width="1.4"/>
      <path d="M-58 -9 C -32 -20 -10 -18 0 -5 C 10 -18 32 -20 58 -9 L 58 -3 C 32 -13 10 -11 0 2 C -10 -11 -32 -13 -58 -3Z" fill="#fffaf0" stroke="#c8b894" stroke-width="1.2"/>
      ${[-44, -30, 16, 30].map(xx => `<path d="M${xx} -10 l 13 -2" stroke="#b8a888" stroke-width="1"/>`).join('')}</g>
    <!-- main head -->
    <g transform="scale(${unK},1)">${head(o, id + 'c', 0)}</g>
  </g></g>`;
}

function brahmaSheet() {
  const W = 1920, H = 1080;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${A.defs()}${C.defs2()}${defs}
    <rect width="${W}" height="${H}" fill="#fbf2e6"/>
    <text x="520" y="62" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="40" fill="#9a3a5e">BRAHMA</text>
    ${brahma(520, 220, .74, { id: 'full' })}
    <clipPath id="bmc"><rect x="1080" y="120" width="700" height="760" rx="18"/></clipPath>
    <rect x="1080" y="120" width="700" height="760" rx="18" fill="#fff6ee" stroke="#e0c0b0" stroke-width="2"/>
    <g clip-path="url(#bmc)">${brahma(1430, 330, 1.7, { id: 'cu' })}</g>
    <text x="1430" y="920" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="26" fill="#5a3a20">three faces · white lotus &amp; mala · pink lotus · blessing hand · the Vedas</text>
  </svg>`;
}
module.exports = { brahma, brahmaSheet, defs };
