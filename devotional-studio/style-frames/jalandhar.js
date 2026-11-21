// Jalandhar — asura king, full body. Face = locked J1, rakshasa features (fangs, fierce eyes, darker skin).
// Same fit build as Mahadev: torso outline contains the shoulders, arms drawn behind, hands on top.
const A = require('../engine/art.js');
const C = require('../engine/characters.js');
const F = require('../engine/faces.js');
const O = require('./face-options-2.js');
const INK = '#2a140c';
const SK = 'url(#jSkinL)', SH = '#4a2414';

const defs = `<defs>
  <radialGradient id="jSkin" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#b47a52"/><stop offset=".62" stop-color="#8a5232"/><stop offset="1" stop-color="#5a2e18"/></radialGradient>
  <linearGradient id="jSkinL" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="#b47a52"/><stop offset=".45" stop-color="#8a5232"/><stop offset="1" stop-color="#5a2e18"/></linearGradient>
  <linearGradient id="darkGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a3a0a"/><stop offset=".35" stop-color="#c8922a"/><stop offset=".5" stop-color="#f2d27a"/><stop offset=".7" stop-color="#9a6a1a"/><stop offset="1" stop-color="#4a2e06"/></linearGradient>
  <linearGradient id="cape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a1018"/><stop offset="1" stop-color="#3a0408"/></linearGradient>
  <linearGradient id="kilt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a1a22"/><stop offset=".5" stop-color="#24101a"/><stop offset="1" stop-color="#14080e"/></linearGradient>
  <linearGradient id="iron" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6a6470"/><stop offset=".5" stop-color="#3a3640"/><stop offset="1" stop-color="#1e1c24"/></linearGradient>
</defs>`;

const torso = 'M -19.5 120 L -21.8 151 C -44 155 -66 160 -80 168 C -94 176 -100 196 -98 216 C -96 232 -90 242 -82 246 C -76 250 -74 258 -73 268 C -70 300 -65 334 -64.4 376 L -66.7 430 L 66.7 430 L 64.4 376 C 65 334 70 300 73 268 C 74 258 76 250 82 246 C 90 242 96 232 98 216 C 100 196 94 176 80 168 C 66 160 44 155 21.8 151 L 19.5 120 Z';

// right arm (screen left) holds the mace upright; left arm (screen right) fist on the hip
const J1 = { sh: [-80, 206], el: [-120, 300], wr: [-128, 380] }, J2 = { sh: [80, 206], el: [124, 296], wr: [84, 360] };
const band = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L ${x2} ${y2}" stroke="url(#darkGold)" stroke-width="12" stroke-linecap="round"/><circle cx="${(x1 + x2) / 2}" cy="${(y1 + y2) / 2 - 2}" r="3.4" fill="#d1261c"/>`;
function armsBack() {
  return `${A.arm(J1.sh, J1.el, J1.wr, SK, SH, [46, 44, 33, 34, 26])}${band(-104, 252, -78, 258)}${band(-140, 362, -114, 366)}
    ${A.arm(J2.sh, J2.el, J2.wr, SK, SH, [46, 44, 33, 34, 26])}${band(84, 252, 110, 256)}${band(92, 352, 100, 376)}`;
}
function fist(x, y, rot) {
  return `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M-17 -4 C -20 -18 -12 -24 0 -24 C 14 -24 20 -16 18 -2 C 16 10 6 16 -4 15 C -14 14 -16 6 -17 -4Z" fill="${SK}" stroke="${INK}" stroke-width="2"/>
    ${[-10, -3, 4, 11].map(x => `<path d="M${x} -22 L ${x} -14" stroke="${SH}" stroke-width="1.4"/>`).join('')}<path d="M-16 -2 C -8 0 0 -2 6 -8" stroke="${SH}" stroke-width="1.4" fill="none"/></g>`;
}
function mace(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-6" y="-200" width="12" height="560" rx="5" fill="url(#iron)" stroke="#0e0c12" stroke-width="1.4"/>
    ${[-150, -60, 30, 120, 210].map(yy => `<rect x="-8" y="${yy}" width="16" height="8" rx="3" fill="url(#darkGold)"/>`).join('')}
    <ellipse cx="0" cy="-246" rx="44" ry="54" fill="url(#iron)" stroke="#0e0c12" stroke-width="2"/>
    ${[...Array(8)].map((_, i) => { const a = i / 8 * Math.PI * 2; return `<path d="M${Math.cos(a) * 40} ${-246 + Math.sin(a) * 48} L ${Math.cos(a) * 58} ${-246 + Math.sin(a) * 66} L ${Math.cos(a + .2) * 40} ${-246 + Math.sin(a + .2) * 48}Z" fill="#2a2830" stroke="#0e0c12"/>`; }).join('')}
    <path d="M-44 -246 Q 0 -232 44 -246 M-40 -270 Q 0 -256 40 -270 M-38 -222 Q 0 -208 38 -222" stroke="url(#darkGold)" stroke-width="5" fill="none"/>
    <circle cx="0" cy="-246" r="8" fill="#d1261c" stroke="#3a2406"/>
    <path d="M0 -300 L 0 -322" stroke="url(#darkGold)" stroke-width="8" stroke-linecap="round"/></g>`;
}

function upper(o = {}) {
  const face = { ...F.JALANDHAR_FACE, id: 'ja' + (o.id || '') + (o.eyes || ''), skin: 'url(#jSkin)', shade: '#5a2e18', rim: '#ffb07a', blush: 0,
    eyes: o.eyes || 'angry', mouth: o.mouth, smile: o.mouth === 'smile', irisCol: '#b8200e' };
  const my = face.mouthY;
  face.overlay = `${O.mustache('curl', my)}<g transform="translate(0,${my + 1}) scale(1.45) translate(0,${-my - 1})">${O.fangs(my)}</g>
    <path d="M-28 ${face.noseY - 4} C -22 ${face.noseY + 4} -14 ${face.noseY + 6} -8 ${face.noseY + 2}" stroke="#3a1a0c" stroke-width="1.4" fill="none" opacity=".6"/>
    <path d="M28 ${face.noseY - 4} C 22 ${face.noseY + 4} 14 ${face.noseY + 6} 8 ${face.noseY + 2}" stroke="#3a1a0c" stroke-width="1.4" fill="none" opacity=".6"/>`;
  const tilak = [0, 1, 2].map(k => `<path d="M-22 ${face.brow.y - 20 + k * 5} Q 0 ${face.brow.y - 23 + k * 5} 22 ${face.brow.y - 20 + k * 5}" stroke="#efe6d6" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/>`).join('') + `<circle cx="0" cy="${face.brow.y - 15}" r="3.4" fill="#d1261c"/>`;
  const hair = `<path d="M0 -4 C -44 -4 -64 18 -64 56 C -64 96 -60 130 -66 168 C -40 176 40 176 66 168 C 60 130 64 96 64 56 C 64 18 44 -4 0 -4Z" fill="#100806"/>
    ${[-1, 1].map(sx => [0, 1, 2, 3].map(k => `<path transform="scale(${sx},1)" d="M${52 + k * 2} ${92 + k * 20} q 18 4 14 20 q -12 5 -14 -4" fill="#100806"/>`).join('')).join('')}`;
  return `<g>
    ${hair}
    ${o.armsBack || ''}
    <path d="${torso}" fill="${SK}" stroke="${INK}" stroke-width="2.2"/>
    <path d="M-98 216 C -96 232 -90 242 -82 246 C -86 236 -90 224 -90 210Z" fill="${SH}" opacity=".4"/>
    <!-- full gold cuirass: covers the whole torso from the collar to the waist -->
    <path d="M -21.8 151 C -44 155 -66 160 -80 168 C -94 176 -100 196 -98 216 C -96 232 -90 242 -82 246 C -76 250 -74 258 -73 268 C -70 300 -65 334 -64.4 376 L -66.7 430 L 66.7 430 L 64.4 376 C 65 334 70 300 73 268 C 74 258 76 250 82 246 C 90 242 96 232 98 216 C 100 196 94 176 80 168 C 66 160 44 155 21.8 151 Q 0 166 -21.8 151 Z" fill="url(#darkGold)" stroke="#3a2406" stroke-width="2.2"/>
    <path d="M-20 154 Q 0 170 20 154 L 24 170 Q 0 188 -24 170Z" fill="#5a0810" stroke="#3a2406" stroke-width="1.6"/>
    <!-- chest plates -->
    <path d="M-62 196 C -44 214 -10 220 0 216 C 10 220 44 214 62 196 C 66 230 60 256 50 270 C 30 280 10 278 0 272 C -10 278 -30 280 -50 270 C -60 256 -66 230 -62 196Z" fill="none" stroke="#5a3a0a" stroke-width="2.4"/>
    <path d="M0 216 L 0 272" stroke="#5a3a0a" stroke-width="2"/>
    <!-- lower plates (segmented) -->
    ${[292, 318, 344, 370].map((y, i) => `<path d="M${-60 + i * 1.2} ${y} Q 0 ${y + 12} ${60 - i * 1.2} ${y}" stroke="#5a3a0a" stroke-width="2.2" fill="none"/><path d="M${-58 + i * 1.2} ${y + 3} Q 0 ${y + 15} ${58 - i * 1.2} ${y + 3}" stroke="#fff1b8" stroke-width="1.2" fill="none" opacity=".45"/>`).join('')}
    <!-- central emblem: face of glory with ruby -->
    <g transform="translate(0,244) scale(.42)">${A.kirtimukha(0, 0, 1)}</g>
    <circle cx="0" cy="244" r="7" fill="#d1261c" stroke="#3a2406" stroke-width="1.4"/>
    ${[-1, 1].map(sx => `<g transform="scale(${sx},1)">${[210, 250, 300, 350].map(y => `<circle cx="-48" cy="${y}" r="3" fill="#d1261c" stroke="#3a2406" stroke-width=".8"/>`).join('')}</g>`).join('')}
    <!-- full layered pauldrons covering each shoulder -->
    ${[-1, 1].map(sx => `<g transform="scale(${sx},1)">
      ${[0, 1, 2].map(k => `<path d="M${-40 - k * 4} ${162 + k * 22} C ${-70 - k * 4} ${156 + k * 22} ${-104 - k * 2} ${170 + k * 22} ${-110 - k * 2} ${198 + k * 22} C ${-112} ${210 + k * 22} ${-108} ${218 + k * 22} ${-100} ${222 + k * 22} C ${-90 - k * 2} ${206 + k * 22} ${-70 - k * 4} ${196 + k * 22} ${-44 - k * 4} ${196 + k * 22}Z" fill="url(#darkGold)" stroke="#3a2406" stroke-width="2"/>
        <path d="M${-50 - k * 4} ${172 + k * 22} C ${-76 - k * 4} ${170 + k * 22} ${-98 - k * 2} ${182 + k * 22} ${-104 - k * 2} ${204 + k * 22}" stroke="#d1261c" stroke-width="2.4" fill="none"/>`).join('')}
      <circle cx="-74" cy="180" r="5" fill="#d1261c" stroke="#3a2406"/></g>`).join('')}
    <!-- belt -->
    <path d="M-68 392 Q 0 408 68 392 L 72 428 Q 0 444 -72 428Z" fill="#5a0810" stroke="#3a2406" stroke-width="2"/>
    <path d="M-68 396 Q 0 412 68 396 M-70 424 Q 0 440 70 424" stroke="url(#darkGold)" stroke-width="4" fill="none"/>
    <circle cx="0" cy="414" r="11" fill="url(#darkGold)" stroke="#3a2406" stroke-width="2"/><circle cx="0" cy="414" r="5" fill="#d1261c"/>
    <!-- neck + necklace -->
    <path d="M-22 156 Q 0 172 22 156" stroke="url(#darkGold)" stroke-width="8" fill="none"/>
    ${[-12, 0, 12].map(x => `<path d="M${x} ${164 - Math.abs(x) * .2} l 4 9 -4 7 -4 -7z" fill="#efe6d6" stroke="#5a3a0a" stroke-width=".8"/>`).join('')}
    ${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M-50 58 C -62 46 -70 30 -72 14 C -64 26 -58 36 -50 44Z" fill="url(#jSkin)" stroke="${INK}" stroke-width="1.8"/>`).join('')}
    ${F.faceP(face)}
    <path d="M-50 30 C -46 18 -30 12 0 12 C 30 12 46 18 50 30 L 51 40 C 40 30 24 25 0 25 C -24 25 -40 30 -51 40Z" fill="#100806"/>
    ${tilak}
    <g transform="translate(0,-14)">${O.jCrown('spikes')}</g>
    ${[-1, 1].map(sx => `<g transform="translate(${sx * 53},86)"><circle r="9" fill="none" stroke="url(#darkGold)" stroke-width="4"/><circle cy="9" r="3.4" fill="#d1261c"/></g>`).join('')}
  </g>`;
}

function capeBack() {
  return `
    <path d="M-92 176 C -150 260 -170 480 -176 760 L 176 760 C 170 480 150 260 92 176 Z" fill="url(#cape)" stroke="#2a0204" stroke-width="2"/>
    ${[-110, -50, 10, 70, 130].map(x => `<path d="M${x * .55} 200 C ${x * .8} 400 ${x} 600 ${x * 1.2} 760" stroke="#5a0810" stroke-width="3" fill="none" opacity=".7"/>`).join('')}`;
}

function lower() {
  const legL = A.arm([-34, 470], [-38, 700], [-32, 898], SK, SH, [72, 68, 48, 50, 30]);
  const legR = A.arm([34, 470], [38, 700], [32, 898], SK, SH, [72, 68, 48, 50, 30]);
  const boot = (sx) => `<g transform="scale(${sx},1)">
    <path d="M-60 780 C -62 830 -58 880 -56 900 L -10 900 C -8 880 -8 830 -12 780Z" fill="url(#kilt)" stroke="#0a0408" stroke-width="2"/>
    ${[800, 830, 860].map(y => `<path d="M-60 ${y} L -10 ${y + 4}" stroke="url(#darkGold)" stroke-width="4"/>`).join('')}
    <path d="M-60 896 C -70 910 -66 926 -50 930 L -10 930 C -4 922 -6 908 -12 896Z" fill="#1e1018" stroke="#0a0408" stroke-width="2"/></g>`;
  // armoured kilt: overlapping dark panels with gold edges
  const panels = [...Array(7)].map((_, i) => {
    const x = -84 + i * 24;
    return `<path d="M${x} 430 L ${x + 30} 430 L ${x + 34 + (i - 3) * 3} 640 L ${x - 4 + (i - 3) * 3} 640Z" fill="url(#kilt)" stroke="#0a0408" stroke-width="1.6"/>
      <path d="M${x - 4 + (i - 3) * 3} 640 L ${x + 34 + (i - 3) * 3} 640" stroke="url(#darkGold)" stroke-width="6"/>
      <circle cx="${x + 15 + (i - 3) * 1.5}" cy="560" r="3.2" fill="url(#darkGold)"/>`;
  }).join('');
  return `${legL}${legR}${boot(1)}${boot(-1)}
    ${panels}
    <path d="M-20 430 L 20 430 L 26 690 L -26 690Z" fill="#8a1018" stroke="#2a0204" stroke-width="1.6"/>
    <path d="M-26 690 L 26 690" stroke="url(#darkGold)" stroke-width="6"/>
    ${[460, 520, 580, 640].map(y => `<path d="M-14 ${y} L 14 ${y}" stroke="url(#darkGold)" stroke-width="2" opacity=".8"/>`).join('')}`;
}

function jalandharFull(x, y, s, o = {}) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    ${capeBack()}
    ${lower()}
    ${upper({ ...o, armsBack: armsBack() })}
    ${mace(-128, 380, 1)}
    ${fist(-128, 384, -10)}
    ${fist(84, 362, 150)}
  </g>`;
}

function jalandharSheet() {
  const W = 1920, H = 1080;
  const card = (cx, cy, o, id, label) => `<clipPath id="jc${id}"><rect x="${cx - 135}" y="${cy - 175}" width="270" height="360" rx="14"/></clipPath>
    <rect x="${cx - 135}" y="${cy - 175}" width="270" height="360" rx="14" fill="#2a1418" stroke="#6a3a2a" stroke-width="2"/>
    <g clip-path="url(#jc${id})"><g transform="translate(${cx},${cy - 92}) scale(1.24)">${upper({ ...o, id })}</g></g>
    <text x="${cx}" y="${cy + 215}" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="24" fill="#f2d8b0">${label}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${A.defs()}${C.defs2()}${defs}
    <rect width="${W}" height="${H}" fill="#1a0c10"/>
    <ellipse cx="560" cy="560" rx="420" ry="540" fill="#c2311d" opacity=".25" filter="url(#softGlow)"/>
    <ellipse cx="560" cy="992" rx="170" ry="14" fill="#000" opacity=".5" filter="url(#blur3)"/>
    ${jalandharFull(560, 205, .84, { id: 'full' })}
    <text x="1380" y="70" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="40" fill="#f2c14e">JALANDHAR</text>
    <text x="1380" y="108" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="26" fill="#f2d8b0">asura king · face J1</text>
    ${card(1080, 330, { eyes: 'angry' }, 1, 'fierce · default')}
    ${card(1380, 330, { eyes: 'open', mouth: 'smile' }, 2, 'proud smile')}
    ${card(1680, 330, { eyes: 'wide', mouth: 'open' }, 3, 'roar')}
    ${card(1230, 790, { eyes: 'lowered', mouth: 'soft' }, 4, 'scheming')}
    ${card(1530, 790, { eyes: 'closed', mouth: 'soft' }, 5, 'defeated')}
  </svg>`;
}

module.exports = { jalandharSheet, jalandharFull, upper, defs };
