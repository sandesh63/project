// Mahadev v2 — redesigned from the channel owner's reference: flowing hair, top bun + crescent + Ganga arc,
// twin cobras, tiger skin with fur trim, orange sash, rudraksha, trishul with damru and lightning. Face = M5.
const A = require('../engine/art.js');
const C = require('../engine/characters.js');
const F = require('../engine/faces.js');
const O = require('./face-options-2.js');
const INK = '#2a1a2e';
const SK = 'url(#sk_shivaBlueL)', SH = '#4a62aa';

// long wavy locks: tapered strands with a sine wobble, flowing outward
function lock(x0, y0, len, dir, w, wob, seed, col) {
  const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([x0 + dir * (t * len * .55 + Math.sin(t * 6 + seed) * wob * t), y0 + t * len]); }
  const L = [], R = []; pts.forEach(([x, y], i) => { const ww = w * (1 - i / 11); L.push([x - ww, y]); R.push([x + ww, y]); });
  return `<path d="M${L[0]}${A.crPath(L)} L ${R[R.length - 1]}${A.crPath(R.reverse())}Z" fill="${col}"/>`;
}
function hairBack(t = 0) {
  const r = A.rng(17);
  // wavy outline of the whole mass (behind head and shoulders, flowing outward)
  const edge = (sx) => { const pts = []; for (let i = 0; i <= 14; i++) { const u = i / 14; pts.push([sx * (44 + u * 110 + Math.sin(u * 9 + t) * 12 * u), 30 + u * 300]); } return pts; };
  const L = edge(-1), R = edge(1);
  const mass = `<path d="M0 -2 C -40 -2 -54 14 ${L[0][0]} ${L[0][1]}${A.crPath(L)} C -112 360 -50 330 0 320 C 50 330 112 360 ${R[14][0]} ${R[14][1]}${A.crPath([...R].reverse())} C 54 14 40 -2 0 -2Z" fill="#16183a"/>`;
  let locks = '';
  for (let i = 0; i < 18; i++) {
    const side = i % 2 ? 1 : -1, k = Math.floor(i / 2);
    locks += lock(side * (54 + k * 10), 70 + k * 22, 110 + r() * 80, side, 7 + r() * 5, 14 + r() * 10, r() * 6 + t, '#16183a');
    const x0 = side * (52 + k * 10), y0 = 80 + k * 22, len = 110 + r() * 80;
    locks += `<path d="M${x0} ${y0} q ${side * len * .3} ${len * .45} ${side * len * .55} ${len}" stroke="#34407e" stroke-width="1.6" fill="none" opacity=".8"/>`;
  }
  const shine = [-1, 1].map(sx => `<path d="M${sx * 54} 60 C ${sx * 90} 120 ${sx * 120} 190 ${sx * 150} 260" stroke="#3a4488" stroke-width="3" fill="none" opacity=".7"/>`).join('');
  return mass + locks + shine;
}
function cobra(x, y, s, flip) {
  return `<g transform="translate(${x},${y}) scale(${flip ? -s : s},${s})">
    <path d="M0 60 C 4 30 -4 14 0 -6" stroke="#2e7a3a" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M-14 4 C -20 -14 -12 -32 0 -34 C 12 -32 20 -14 14 4 C 8 10 -8 10 -14 4Z" fill="#2e7a3a" stroke="#0e3a1a" stroke-width="1.4"/>
    <path d="M-6 0 C -8 -14 -4 -24 0 -24 C 4 -24 8 -14 6 0Z" fill="#e8e0b8" opacity=".85"/>
    ${[-18, -10, -2].map(yy => `<path d="M-5 ${yy} Q 0 ${yy + 3} 5 ${yy}" stroke="#a8986a" stroke-width="1" fill="none"/>`).join('')}
    <ellipse cx="0" cy="-34" rx="6" ry="5" fill="#245e2e" stroke="#0e3a1a"/>
    <circle cx="-2.6" cy="-35" r="1.2" fill="#f4d03a"/><circle cx="2.6" cy="-35" r="1.2" fill="#f4d03a"/></g>`;
}
function trishul(x, y, s, t = 0, len = 600) {
  const bolt = (dx, seed) => { const r = A.rng(seed + Math.floor(t * 12)); let d = `M${dx} -120`; let yy = -120; while (yy < len - 80) { yy += 30 + r() * 30; d += ` L ${dx + (r() - .5) * 26} ${yy}`; } return d; };
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="${bolt(-6, 3)}" stroke="#bfe6ff" stroke-width="2.4" fill="none" filter="url(#glow)" opacity=".85"/>
    <path d="${bolt(8, 9)}" stroke="#7fc8ff" stroke-width="1.6" fill="none" filter="url(#glow)" opacity=".7"/>
    <rect x="-5" y="-60" width="10" height="${len}" rx="4" fill="#4a6aa8" stroke="#1a2a5a" stroke-width="1.4"/>
    <path d="M0 -60 L -8 -150 L 0 -200 L 8 -150Z" fill="#9ab8e8" stroke="#1a2a5a" stroke-width="1.6"/>
    <path d="M-6 -70 C -40 -76 -54 -110 -48 -160 L -40 -120 C -36 -96 -22 -88 -6 -86Z" fill="#9ab8e8" stroke="#1a2a5a" stroke-width="1.6"/>
    <path d="M6 -70 C 40 -76 54 -110 48 -160 L 40 -120 C 36 -96 22 -88 6 -86Z" fill="#9ab8e8" stroke="#1a2a5a" stroke-width="1.6"/>
    <rect x="-14" y="-66" width="28" height="10" rx="3" fill="#c8922a" stroke="#5a3a0a"/>
    <g transform="translate(0,-30)">
      <path d="M-34 -18 L 34 -18 L 6 0 L 34 18 L -34 18 L -6 0Z" fill="#a8683a" stroke="#4a2a12" stroke-width="1.6"/>
      <ellipse cx="-34" cy="0" rx="6" ry="18" fill="#e8c890" stroke="#4a2a12" stroke-width="1.4"/>
      <ellipse cx="34" cy="0" rx="6" ry="18" fill="#d8b478" stroke="#4a2a12" stroke-width="1.4"/>
      <path d="M-6 0 L 6 0" stroke="#d1261c" stroke-width="5"/>
      <path d="M0 4 C 4 30 -8 40 -4 62 M2 4 C 10 26 6 44 12 58" stroke="#7a3a1a" stroke-width="2" fill="none"/>
      <circle cx="-4" cy="62" r="3" fill="#7a3a1a"/><circle cx="12" cy="58" r="3" fill="#7a3a1a"/></g>
  </g>`;
}
const rud = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L ${x2} ${y2}" stroke="#6a2e14" stroke-width="7" stroke-dasharray="1 6.5" stroke-linecap="round"/>`;
const tiger = `<pattern id="tigerPat" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
    <rect width="26" height="26" fill="#d9952e"/>
    <path d="M4 6 c 3 -3 7 -2 6 2 c -1 3 -5 3 -6 -2z M16 16 c 3 -3 8 -1 6 3 c -2 3 -6 2 -6 -3z M18 4 c 2 -2 5 -1 4 1z M5 18 c 2 -1 4 0 3 2z" fill="#4a2a0e"/>
    <circle cx="7" cy="5" r="1.4" fill="#e8b45a"/><circle cx="19" cy="17" r="1.6" fill="#e8b45a"/></pattern>`;

// upper body (head to hips). origin = top of skull.
function mahadevUpper(o = {}) {
  const face = { ...F.MAHADEV_FACE, id: 'mv' + (o.id || '') + (o.eyes || ''), skin: 'url(#sk_shivaBlue)', shade: '#2e4488', rim: '#e4ecff', blush: 0,
    eyes: o.eyes || 'lowered', mouth: o.mouth, smile: o.mouth ? o.mouth === 'smile' : true, sad: o.sad };
  const by = face.brow.y;
  const third = o.eyes === 'angry'
    ? `<ellipse cx="0" cy="${by - 17}" rx="4" ry="8.5" fill="#ff8a2a" filter="url(#glow)"/><ellipse cx="0" cy="${by - 17}" rx="2" ry="4.6" fill="#fff3c0"/>`
    : `<path d="M0 ${by - 25} C 3 ${by - 20} 3 ${by - 14} 0 ${by - 9} C -3 ${by - 14} -3 ${by - 20} 0 ${by - 25}Z" fill="#c8201a" stroke="${INK}" stroke-width=".8"/><circle cx="0" cy="${by - 17}" r="1.6" fill="#1a0a0a"/>`;
  const tripundra = [0, 1, 2].map(k => `<path d="M-28 ${by - 31 + k * 5} Q 0 ${by - 34 + k * 5} 28 ${by - 31 + k * 5}" stroke="#fbf8f0" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('');
  const torso = 'M -19.5 120 L -21.8 151 C -44 155 -66 160 -80 168 C -94 176 -100 196 -98 216 C -96 232 -90 242 -82 246 C -76 250 -74 258 -73 268 C -70 300 -65 334 -64.4 376 L -66.7 430 L 66.7 430 L 64.4 376 C 65 334 70 300 73 268 C 74 258 76 250 82 246 C 90 242 96 232 98 216 C 100 196 94 176 80 168 C 66 160 44 155 21.8 151 L 19.5 120 Z';
  return `<g>
    ${hairBack(o.wind || 0)}
    ${o.armsBack || ''}
    <path d="${torso}" fill="${SK}" stroke="${INK}" stroke-width="2.2"/>
    <path d="M -73 268 C -70 300 -65 334 -64.4 376 C -68 334 -68 300 -68 270Z" fill="${SH}" opacity=".45"/><path d="M-98 216 C -96 232 -90 242 -82 246 C -86 236 -90 224 -90 210Z" fill="${SH}" opacity=".4"/><path d="M-62 174 C -78 178 -90 190 -92 206" stroke="#c8d8ff" stroke-width="2" fill="none" opacity=".5"/>
    <path d="M -43.7 228 Q -23 238 -5.8 234 M 43.7 228 Q 23 238 5.8 234" stroke="${SH}" stroke-width="1.8" fill="none" opacity=".4"/><path d="M0 372 Q 4 379 0 386" stroke="${SH}" stroke-width="2.4" fill="none"/>
    ${[0, 1, 2].map(k => `<path d="M-94 ${200 + k * 8} Q -84 ${196 + k * 8} -74 ${204 + k * 8}" stroke="#fbf8f0" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('')}
    <!-- tiger skin over the left shoulder, fur trim, orange sash -->
    <path d="M 34.5 154 C 60 157 80 164 90 180 C 98 196 98 222 88 242 C 78 290 69 330 66.7 376 L 69 430 L -66.7 430 C -41.4 380 -6.9 320 20.7 270 C 32.2 230 34.5 190 41.4 158 Z" fill="url(#tigerPat)" stroke="#4a2a0e" stroke-width="2"/>
    <path d="M36 158 C 30 190 28 230 18 270 C -6 320 -36 380 -56 430" fill="none" stroke="#fbf6ea" stroke-width="12" stroke-linecap="round" stroke-dasharray="10 3"/>
    <path d="M -71.3 394 Q 0 410 71.3 394 L 75.9 430 Q 0 446 -75.9 430 Z" fill="#d2561e" stroke="#7a2a0a" stroke-width="1.6"/>
    <path d="M44 410 C 80 420 116 440 144 470 L 126 480 C 102 456 78 440 46 430Z" fill="#d2561e" stroke="#7a2a0a" stroke-width="1.4"/>
    <!-- rudraksha mala -->
    <path d="M-28 162 C -26 224 -10 254 0 262 C 10 254 26 224 28 162" fill="none" stroke="#6a2e14" stroke-width="7" stroke-dasharray="1 6.5" stroke-linecap="round"/>
    <path d="M -41.4 164 C -36.8 244 -16.1 288 0 298 C 16.1 288 36.8 244 41.4 164" fill="none" stroke="#6a2e14" stroke-width="6" stroke-dasharray="1 7" stroke-linecap="round"/>
    <!-- neck snake + twin cobras -->
    <path d="M-24 146 C -40 160 -30 176 0 178 C 30 176 40 160 24 146" fill="none" stroke="#2e7a3a" stroke-width="11" stroke-linecap="round"/>
    <path d="M-24 146 C -40 160 -30 176 0 178 C 30 176 40 160 24 146" fill="none" stroke="#9ad06a" stroke-width="2" stroke-dasharray="3 6"/>
    <path d="M26 152 C 54 172 62 240 46 290 C 40 306 26 304 24 290" stroke="#2e7a3a" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M26 152 C 54 172 62 240 46 290" stroke="#9ad06a" stroke-width="1.6" fill="none" stroke-dasharray="3 6"/>${cobra(22, 238, .88, false)}
    ${F.faceP(face)}
    <path d="M-48 28 C -44 12 -28 4 0 4 C 28 4 44 12 48 28 L 49 40 C 40 24 24 18 0 18 C -24 18 -40 24 -49 40Z" fill="#16183a"/>
    <!-- top bun, rudraksha band, crescent, Ganga arc -->
    <path d="M-30 10 C -36 -20 -24 -46 0 -50 C 24 -46 36 -20 30 10Z" fill="#16183a" stroke="#05061a" stroke-width="1.2"/>
    ${[-38, -24, -10].map((yy, i) => `<path d="M${-22 + i * 3} ${yy} Q 0 ${yy - 8} ${22 - i * 3} ${yy}" stroke="#2e3672" stroke-width="2" fill="none"/>`).join('')}
    <path d="M-30 6 Q 0 -4 30 6" stroke="#6a2e14" stroke-width="6" stroke-dasharray="1 6" stroke-linecap="round" fill="none"/>
    <path d="M-38 -26 C -54 -18 -56 4 -44 14 C -48 -2 -44 -16 -32 -22Z" fill="#fffbe8" stroke="#d8d0a8" stroke-width="1" filter="url(#glow)"/>
    <path d="M6 -50 C 30 -110 110 -130 160 -60" stroke="#cfeaff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9" filter="url(#glow)"/>
    <path d="M10 -50 C 34 -104 106 -122 152 -60" stroke="#ffffff" stroke-width="1.6" fill="none" opacity=".8"/>
    ${tripundra}${third}
    ${[-1, 1].map(sx => `<g transform="translate(${sx * 52},90)"><circle r="9" fill="none" stroke="url(#gold)" stroke-width="3.4"/></g>`).join('')}
  </g>`;
}

const J1 = { sh: [-80, 206], el: [-134, 290], wr: [-144, 206] }, J2 = { sh: [80, 206], el: [104, 310], wr: [100, 414] };
function armsBack() {
  return `${A.arm(J1.sh, J1.el, J1.wr, SK, SH, [46, 44, 33, 34, 26])}${rud(-142, 282, -122, 304)}${rud(-154, 218, -134, 220)}
    ${A.arm(J2.sh, J2.el, J2.wr, SK, SH, [46, 44, 33, 34, 26])}${rud(84, 254, 108, 258)}${rud(88, 402, 112, 404)}`;
}
function hands() {
  return `<g transform="translate(-144,206) scale(.68)">${A.holdingHand(SK, SH, -1, false)}</g>
    <g transform="translate(100,414) rotate(178) scale(.68)">${A.openPalm(SK, SH, 1)}</g>`;
}
function arms() { return armsBack() + hands(); }

function mahadevSheet() {
  const W = 1920, H = 1080;
  const card = (x, y, o, id, label) => `<clipPath id="mc${id}"><rect x="${x - 135}" y="${y - 175}" width="270" height="360" rx="14"/></clipPath>
    <rect x="${x - 135}" y="${y - 175}" width="270" height="360" rx="14" fill="#eaf1ff" stroke="#9fb4d8" stroke-width="2"/>
    <g clip-path="url(#mc${id})"><g transform="translate(${x},${y - 130}) scale(1.35)">${mahadevUpper({ ...o, id })}</g></g>
    <text x="${x}" y="${y + 215}" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="24" fill="#2a3a6a">${label}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${A.defs()}${C.defs2()}
    <defs>${O.skinDefs}${tiger}</defs>
    <rect width="${W}" height="${H}" fill="#f4f7ff"/>
    <ellipse cx="420" cy="520" rx="420" ry="520" fill="#5f9bff" opacity=".22" filter="url(#softGlow)"/>
    <text x="1380" y="70" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="34" fill="#1f2f6a">MAHADEV · NEW DESIGN (face M5)</text>
    <g transform="translate(470,250) scale(1.3)">${trishul(-144, 40, 1, 0)}${mahadevUpper({ id: 'hero', armsBack: armsBack() })}${hands()}</g>
    ${card(1080, 330, { eyes: 'lowered', mouth: 'smile' }, 1, 'compassionate · default')}
    ${card(1380, 330, { eyes: 'closed', mouth: 'soft' }, 2, 'meditation')}
    ${card(1680, 330, { eyes: 'open', mouth: 'soft' }, 3, 'calm')}
    ${card(1230, 790, { eyes: 'angry', mouth: 'soft' }, 4, 'Rudra · third eye opens (battle)')}
    ${card(1530, 790, { eyes: 'lowered', mouth: 'soft', sad: true }, 5, 'sorrow')}
  </svg>`;
}

function lowerBody(o = {}) {
  const legL = A.arm([-34, 470], [-38, 700], [-32, 898], SK, SH, [72, 68, 48, 50, 30]);
  const legR = A.arm([34, 470], [38, 700], [32, 898], SK, SH, [72, 68, 48, 50, 30]);
  const foot = (sx) => `<g transform="scale(${sx},1)"><path d="M-50 898 C -60 914 -58 930 -40 934 L -12 934 C -4 928 -8 912 -16 898Z" fill="${SK}" stroke="${INK}" stroke-width="2"/>
    <path d="M-46 900 Q -32 908 -18 900" stroke="url(#gold)" stroke-width="5" fill="none"/>${[-40, -33, -26, -19].map(x => `<circle cx="${x}" cy="929" r="2" fill="#2e4488" opacity=".5"/>`).join('')}</g>`;
  const skirt = 'M-66 420 C -84 480 -96 560 -98 640 L -88 674 C -60 664 -40 690 -14 670 C 10 690 40 662 68 678 L 98 640 C 96 560 84 480 66 420Z';
  return `${legL}${legR}${foot(1)}${foot(-1)}
    ${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M-50 880 Q -32 888 -14 880" stroke="#6a2e14" stroke-width="6" stroke-dasharray="1 6" stroke-linecap="round" fill="none"/>`).join('')}
    <path d="${skirt}" fill="url(#tigerPat)" stroke="#4a2a0e" stroke-width="2"/>
    <path d="M-88 674 C -60 664 -40 690 -14 670 C 10 690 40 662 68 678 L 98 640" fill="none" stroke="#fbf6ea" stroke-width="11" stroke-linecap="round" stroke-dasharray="9 3"/>
    <path d="M-30 440 C -40 520 -46 600 -50 660 M24 440 C 30 520 36 600 40 660" stroke="#7a4a1a" stroke-width="2" fill="none" opacity=".5"/>
    <path d="M58 430 C 92 470 110 520 116 580 L 98 586 C 92 530 76 486 50 452Z" fill="#d2561e" stroke="#7a2a0a" stroke-width="1.4"/>`;
}

function mahadevFull(x, y, s, o = {}) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    ${trishul(-144, 40, 1, o.t || 0, 920)}
    ${lowerBody(o)}
    ${mahadevUpper({ ...o, armsBack: armsBack() })}
    ${hands()}
  </g>`;
}

function mahadevFullSheet() {
  const W = 1920, H = 1080;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${A.defs()}${C.defs2()}
    <defs>${O.skinDefs}${tiger}</defs>
    <rect width="${W}" height="${H}" fill="#f4f7ff"/>
    <ellipse cx="640" cy="560" rx="420" ry="540" fill="#5f9bff" opacity=".2" filter="url(#softGlow)"/>
    <ellipse cx="660" cy="992" rx="150" ry="14" fill="#3a4a7a" opacity=".25" filter="url(#blur3)"/>
    ${mahadevFull(660, 205, .84, { id: 'full' })}
    <text x="1400" y="120" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="40" fill="#1f2f6a">MAHADEV</text>
    <text x="1400" y="166" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="28" fill="#2a3a6a">full body · face M5</text>
    ${[['trishul with damru', 260], ['crescent moon + Ganga', 320], ['one cobra, right shoulder', 380], ['tiger skin with fur trim', 440], ['orange sash', 500], ['rudraksha mala, bands, anklets', 560], ['tripundra + third eye', 620]].map(([t, yy]) => `<text x="1400" y="${yy}" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-size="30" fill="#2a3a6a">· ${t} ·</text>`).join('')}
  </svg>`;
}

module.exports = { mahadevSheet, mahadevFullSheet, mahadevFull, mahadevUpper, lowerBody, trishul, arms, tiger };
