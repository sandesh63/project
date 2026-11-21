// Shri Ram and Mata Sita — reusable characters, each in two looks: 'royal' (Ayodhya) and 'vanvas' (forest exile).
const A = require('../engine/art.js');
const C = require('../engine/characters.js');
const F = require('../engine/faces.js');
const INK = '#1e1a2a';
const TORSO = 'M -19.5 120 L -21.8 151 C -44 155 -66 160 -80 168 C -94 176 -100 196 -98 216 C -96 232 -90 242 -82 246 C -76 250 -74 258 -73 268 C -70 300 -65 334 -64.4 376 L -66.7 430 L 66.7 430 L 64.4 376 C 65 334 70 300 73 268 C 74 258 76 250 82 246 C 90 242 96 232 98 216 C 100 196 94 176 80 168 C 66 160 44 155 21.8 151 L 19.5 120 Z';
const SK = 'url(#ramSkinL)', SH = '#2e5288';

const defs = `<defs>
  <radialGradient id="ramSkin" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#8ab4e8"/><stop offset=".62" stop-color="#5a86c8"/><stop offset="1" stop-color="#2e5288"/></radialGradient>
  <linearGradient id="ramSkinL" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="#8ab4e8"/><stop offset=".45" stop-color="#5a86c8"/><stop offset="1" stop-color="#2e5288"/></linearGradient>
  <linearGradient id="ramYellow" gradientUnits="userSpaceOnUse" x1="-120" y1="0" x2="120" y2="0"><stop offset="0" stop-color="#ffe066"/><stop offset=".5" stop-color="#f6b81e"/><stop offset="1" stop-color="#c88208"/></linearGradient>
  <linearGradient id="ramOchre" gradientUnits="userSpaceOnUse" x1="-120" y1="0" x2="120" y2="0"><stop offset="0" stop-color="#e0a060"/><stop offset=".5" stop-color="#b8743a"/><stop offset="1" stop-color="#7a4a20"/></linearGradient>
  <linearGradient id="ramRed" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2453a"/><stop offset="1" stop-color="#8e1a14"/></linearGradient>
  <linearGradient id="bowWood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c8862e"/><stop offset="1" stop-color="#6a3a10"/></linearGradient>
  <radialGradient id="sitaFace" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#fde0c0"/><stop offset=".62" stop-color="#f2c49a"/><stop offset="1" stop-color="#cc946a"/></radialGradient>
  <linearGradient id="sitaSkin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fde0c0"/><stop offset=".5" stop-color="#f2c49a"/><stop offset="1" stop-color="#cc946a"/></linearGradient>
  <linearGradient id="sitaSaree" gradientUnits="userSpaceOnUse" x1="-110" y1="0" x2="110" y2="0"><stop offset="0" stop-color="#f6884a"/><stop offset=".45" stop-color="#e2602a"/><stop offset="1" stop-color="#a83a14"/></linearGradient>
  <linearGradient id="sitaBlouse" gradientUnits="userSpaceOnUse" x1="-120" y1="150" x2="120" y2="280"><stop offset="0" stop-color="#c83a5a"/><stop offset=".55" stop-color="#9a1a3a"/><stop offset="1" stop-color="#5a0a20"/></linearGradient>
  <linearGradient id="sitaOchre" gradientUnits="userSpaceOnUse" x1="-110" y1="0" x2="110" y2="0"><stop offset="0" stop-color="#e8b878"/><stop offset=".45" stop-color="#c8904a"/><stop offset="1" stop-color="#8a5a28"/></linearGradient>
  <linearGradient id="sitaBlouseV" gradientUnits="userSpaceOnUse" x1="-120" y1="150" x2="120" y2="280"><stop offset="0" stop-color="#d8a868"/><stop offset=".55" stop-color="#a8743a"/><stop offset="1" stop-color="#6a4218"/></linearGradient>
  <pattern id="sitaButta" width="32" height="36" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="2.4" fill="#ffd66b" opacity=".85"/><circle cx="24" cy="26" r="2.4" fill="#ffd66b" opacity=".85"/></pattern>
  <pattern id="noButta" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="none"/></pattern>
</defs>`;

// ---------------- SHRI RAM
const RAM_FACE = { W: 47, chin: 130, cheek: 1.0, jaw: .56, noseY: 95, mouthY: 111, irisCol: '#3a2a1a',
  eye: { ex: 21, ey: 66, ew: 28, eh: 11, tilt: 2.5, irisK: .9, flick: 4.5 }, crease: true, liner: 2.6,
  brow: { x0: 6, x1: 36, y: 51, arch: 4.5, t: 3.2 }, nose: 'soft', lips: { w: 10.5, up: 3.8, lo: 5.8, c1: '#a8484a', c2: '#c4605e' }, smile: true };

function ramHead(o, id) {
  const p = { ...RAM_FACE, id, skin: 'url(#ramSkin)', shade: '#2e5288', rim: '#dfeaff', blush: 0, eyes: o.eyes || 'open', mouth: o.mouth, smile: o.mouth ? o.mouth === 'smile' : true, sad: o.sad };
  const by = p.brow.y;
  const namam = `<path d="M-7 ${by + 2} C -8 ${by - 10} -6 ${by - 18} -4 ${by - 26} M7 ${by + 2} C 8 ${by - 10} 6 ${by - 18} 4 ${by - 26}" stroke="#fffaf0" stroke-width="3.6" stroke-linecap="round" fill="none"/>
    <path d="M-7 ${by + 2} Q 0 ${by + 8} 7 ${by + 2}" stroke="#fffaf0" stroke-width="3.6" fill="none"/><path d="M0 ${by + 4} L 0 ${by - 24}" stroke="#d1261c" stroke-width="2.8" stroke-linecap="round"/>`;
  const royal = o.look !== 'vanvas';
  // hair stays behind the head: a cap that ends above the ears, no locks in front of the ears or along the jaw
  const hairBack = `<path d="M0 -4 C -40 -4 -54 16 -52 50 C -50 60 -48 66 -46 70 L 46 70 C 48 66 50 60 52 50 C 54 16 40 -4 0 -4Z" fill="#141018"/>`;
  const crown = `<g transform="translate(0,-14)">
    <path d="M-56 40 Q 0 22 56 40 L 54 14 Q 0 0 -54 14Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.6"/>
    ${[-36, -18, 0, 18, 36].map(xx => `<circle cx="${xx}" cy="${24 - (36 - Math.abs(xx)) * .1}" r="${xx === 0 ? 6 : 3.4}" fill="${xx === 0 ? '#d1261c' : (Math.abs(xx) === 18 ? '#1f8a4a' : '#fff4d6')}" stroke="#7a4a10" stroke-width=".7"/>`).join('')}
    <path d="M-48 14 L -38 -42 C -24 -58 24 -58 38 -42 L 48 14Z" fill="url(#goldV)" stroke="#7a4a10" stroke-width="1.4"/>
    ${[-18, 0].map((yy, i) => `<path d="M${-44 + i * 3} ${yy} Q 0 ${yy - 9} ${44 - i * 3} ${yy}" stroke="#7a4a10" stroke-width="1.6" fill="none"/>`).join('')}
    <ellipse cx="0" cy="-24" rx="6" ry="5.5" fill="#1f8a4a" stroke="#7a4a10"/>
    <path d="M-38 -42 C -24 -58 24 -58 38 -42 L 24 -72 Q 0 -84 -24 -72Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.2"/>
    <path d="M0 -80 C 8 -90 7 -102 0 -110 C -7 -102 -8 -90 0 -80Z" fill="url(#gold)" stroke="#7a4a10"/>
    ${[-1, 1].map(sx => `<g transform="translate(${sx * 52},18) scale(${sx},1)">${[-60, -25, 10].map(a => `<ellipse transform="rotate(${a})" cx="0" cy="-8" rx="3.6" ry="7" fill="url(#gold)" stroke="#7a4a10" stroke-width=".7"/>`).join('')}</g>`).join('')}</g>`;
  const jata = `<path d="M-26 14 C -32 -18 -20 -46 0 -50 C 20 -46 32 -18 26 14Z" fill="#141018" stroke="#05030a" stroke-width="1.2"/>
    ${[-38, -24, -10].map((yy, i) => `<path d="M${-18 + i * 3} ${yy} Q 0 ${yy - 8} ${18 - i * 3} ${yy}" stroke="#3a3040" stroke-width="1.8" fill="none"/>`).join('')}
    <path d="M-26 10 Q 0 0 26 10" stroke="#6a2e14" stroke-width="5.5" stroke-dasharray="1 6" stroke-linecap="round" fill="none"/>`;
  const ear = (sx) => royal ? `<g transform="translate(${sx * 51},90)">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse transform="rotate(${a})" cx="0" cy="-6" rx="3.2" ry="5.8" fill="#f7c22c" stroke="#a8700c" stroke-width=".7"/>`).join('')}<circle r="3.6" fill="#d1261c"/></g>`
    : `<g transform="translate(${sx * 51},90)"><circle r="6" fill="#6a2e14" stroke="#3a1a0a"/></g>`;
  return `<g>${hairBack}${F.faceP(p)}
    <path d="M-48 30 C -44 16 -28 10 0 10 C 28 10 44 16 48 30 L 49 40 C 40 28 24 22 0 22 C -24 22 -40 28 -49 40Z" fill="#141018"/>
    ${royal ? crown : jata}${namam}${ear(-1)}${ear(1)}</g>`;
}

function bowAndQuiver(royal) {
  // bow held vertically in his left hand (screen right) at (120, 420); quiver on the back over the right shoulder
  return {
    quiver: `<g transform="translate(-60,150) rotate(-24)"><rect x="-16" y="0" width="32" height="200" rx="10" fill="${royal ? 'url(#ramRed)' : '#7a4a20'}" stroke="#3a1a0a" stroke-width="2"/>
      ${[-8, 0, 8].map(x => `<path d="M${x} 0 L ${x} -46" stroke="#c8a868" stroke-width="3"/><path d="M${x - 5} -46 L ${x} -60 L ${x + 5} -46Z" fill="#d8d0c0" stroke="#5a5040" stroke-width=".8"/>`).join('')}
      ${royal ? `<path d="M-16 20 L 16 20 M-16 180 L 16 180" stroke="url(#gold)" stroke-width="5"/>` : ''}</g>`,
    bow: `<g transform="translate(133,420)"><path d="M0 -330 C 70 -220 70 220 0 330" stroke="url(#bowWood)" stroke-width="12" fill="none" stroke-linecap="round"/>
      ${royal ? `<path d="M0 -330 C 70 -220 70 220 0 330" stroke="url(#gold)" stroke-width="4" fill="none" stroke-dasharray="16 26"/>` : ''}
      <path d="M0 -330 L 0 330" stroke="#efe6d0" stroke-width="2"/><rect x="38" y="-26" width="14" height="52" rx="5" fill="${royal ? 'url(#gold)' : '#5a3010'}"/></g>`,
  };
}

function ram(x, y, s, o = {}) {
  const royal = o.look !== 'vanvas', id = 'ram' + (o.id || '');
  const R = { sh: [-82, 206], el: [-112, 330], wr: [-118, 450] }, L = { sh: [82, 206], el: [140, 300], wr: [178, 420] };
  const aw = [44, 42, 31, 32, 25];
  const legs = A.arm([-36, 470], [-40, 700], [-34, 898], SK, SH, [72, 68, 48, 50, 30]) + A.arm([36, 470], [40, 700], [34, 898], SK, SH, [72, 68, 48, 50, 30])
    + [-1, 1].map(sx => `<g transform="scale(${sx},1)"><path d="M-52 898 C -62 914 -60 930 -42 934 L -14 934 C -6 928 -10 912 -18 898Z" fill="${SK}" stroke="${INK}" stroke-width="2"/>${royal ? `<path d="M-52 900 Q -34 906 -18 900" stroke="url(#gold)" stroke-width="5" fill="none"/>` : ''}</g>`).join('');
  const BQ = bowAndQuiver(royal), fc = 'rf' + id;
  const arms = A.arm(R.sh, R.el, R.wr, SK, SH, aw) + A.arm(L.sh, L.el, L.wr, SK, SH, aw);
  const cloth = royal ? 'url(#ramYellow)' : 'url(#ramOchre)';
  return `<g transform="translate(${x},${y}) scale(${s})">
    ${o.halo === false ? '' : `<circle cx="0" cy="60" r="150" fill="url(#lampGlow)" opacity=".45"/>`}
    ${BQ.quiver}
    ${legs}
    <path d="M-72 420 C -94 520 -104 640 -100 760 L -50 790 L -14 740 L 14 740 L 50 790 L 100 760 C 104 640 94 520 72 420Z" fill="${cloth}" stroke="#5a3a08" stroke-width="2"/>
    ${[-56, -28, 28, 56].map(xx => `<path d="M${xx * .8} 440 C ${xx} 580 ${xx * 1.1} 680 ${xx * 1.2} 760" stroke="${royal ? '#c88208' : '#6a3a14'}" stroke-width="2.2" fill="none" opacity=".7"/>`).join('')}
    ${royal ? `<path d="M-100 760 L -50 790 L -14 740 L 14 740 L 50 790 L 100 760" stroke="url(#borderMotif)" stroke-width="10" fill="none"/>` : ''}
    ${arms}
    <path d="${TORSO}" fill="${SK}" stroke="${INK}" stroke-width="2.2"/>
    <path d="M-44 232 Q -24 242 -6 238 M44 232 Q 24 242 6 238" stroke="${SH}" stroke-width="1.6" fill="none" opacity=".5"/>
    <path d="M0 356 Q 4 363 0 370" stroke="${SH}" stroke-width="2.2" fill="none"/>
    <!-- uttariya over the left shoulder + quiver strap -->
    <path d="M30 152 C 60 156 84 168 90 196 L 82 230 C 40 300 -10 360 -50 430 L -70 430 C -40 360 0 290 38 220 C 34 196 30 172 30 152Z" fill="${royal ? 'url(#ramRed)' : 'url(#ramOchre)'}" stroke="#3a1a0a" stroke-width="2"/>
    <path d="M-70 170 C -20 240 30 330 70 400" stroke="#5a3010" stroke-width="7" fill="none"/>
    <path d="M-66 392 Q 0 408 66 392 L 70 428 Q 0 444 -70 428Z" fill="${royal ? 'url(#gold)' : '#6a3a14'}" stroke="#3a1a0a" stroke-width="1.6"/>
    ${royal ? `<path d="M-22 160 Q 0 176 22 160" stroke="url(#gold)" stroke-width="7" fill="none"/>
      <path d="M-40 168 C -34 206 -14 226 0 232 C 14 226 34 206 40 168" stroke="url(#gold)" stroke-width="5" fill="none"/><path d="M0 230 l 8 10 -8 13 -8 -13z" fill="url(#gold)" stroke="#7a4a10"/><circle cx="0" cy="242" r="3" fill="#d1261c"/>`
      : `<path d="M-40 166 C -34 230 -14 262 0 270 C 14 262 34 230 40 166" fill="none" stroke="#6a2e14" stroke-width="6.5" stroke-dasharray="1 6.5" stroke-linecap="round"/>`}
    <!-- forearms in front of the body -->
    <clipPath id="${fc}"><rect x="-300" y="250" width="600" height="400"/></clipPath>
    <g clip-path="url(#${fc})">${arms}</g>
    ${royal ? `${A.bandOn(R.sh, R.el, .3, 44)}${A.bandOn(L.sh, L.el, .3, 44)}` : ''}
    ${BQ.bow}
    <g transform="translate(${L.wr[0]},${L.wr[1]}) rotate(-10) scale(.64)">${A.holdingHand(SK, SH, 1, false)}</g>
    <!-- arrow held lowered in the right hand -->
    <path d="M${R.wr[0] - 6} ${R.wr[1] - 120} L ${R.wr[0] + 6} ${R.wr[1] + 150}" stroke="#c8a868" stroke-width="4"/>
    <path d="M${R.wr[0] + 6} ${R.wr[1] + 150} l -7 -16 l 14 1Z" fill="#d8d0c0" stroke="#5a5040" stroke-width=".8"/>
    <path d="M${R.wr[0] - 6} ${R.wr[1] - 120} l -8 -14 M${R.wr[0] - 6} ${R.wr[1] - 120} l 6 -16" stroke="#e8344e" stroke-width="3"/>
    <g transform="translate(${R.wr[0]},${R.wr[1]}) rotate(6) scale(.64)">${A.holdingHand(SK, SH, -1, false)}</g>
    ${ramHead(o, id)}
  </g>`;
}

// ---------------- MATA SITA (graceful body shared with Tulasi; own face, colours and look)
const SITA_FACE = { W: 46, chin: 128, cheek: 1.0, jaw: .55, noseY: 93, mouthY: 107, irisCol: '#4a2a14',
  eye: { ex: 21, ey: 66, ew: 28, eh: 12, tilt: 1.5, irisK: .88, flick: 4 }, lashes: true, crease: true, liner: 2.7,
  brow: { x0: 6, x1: 35, y: 49, arch: 4.5, t: 2.3 }, nose: 'soft', blush: .26, blushY: 90,
  lips: { w: 9.5, up: 3.7, lo: 5.8, c1: '#c03a40', c2: '#da5a5a' }, smile: true, hairVol: 5, hairSide: 3, wavy: true };

function sitaHead(o, id) {
  const royal = o.look !== 'vanvas';
  const p = { ...SITA_FACE, id, skin: 'url(#sitaFace)', shade: '#c08860', eyes: o.eyes || 'open', mouth: o.mouth, tears: o.tears, sad: o.sad, smile: o.mouth ? o.mouth === 'smile' : true };
  const W = p.W;
  const jh = (sx) => `<g transform="translate(${sx * (W + 3)},84) scale(${royal ? .78 : .55})"><circle r="5" fill="url(#gold)" stroke="#8a5a12" stroke-width=".8"/>
    <path d="M-11 26 C -11 14 -5 10 0 10 C 5 10 11 14 11 26Z" fill="url(#gold)" stroke="#8a5a12"/>${[-8, -4, 0, 4, 8].map(x => `<circle cx="${x}" cy="29" r="1.7" fill="#fff6e6"/>`).join('')}</g>`;
  const tiara = royal ? `<g transform="translate(0,-10)"><path d="M-44 30 Q 0 12 44 30 L 42 10 Q 0 -4 -42 10Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.4"/>
      ${[-26, -13, 0, 13, 26].map(xx => `<circle cx="${xx}" cy="${20 - (26 - Math.abs(xx)) * .12}" r="${xx === 0 ? 4.5 : 2.6}" fill="${xx === 0 ? '#d1261c' : '#fff4d6'}" stroke="#7a4a10" stroke-width=".6"/>`).join('')}
      <path d="M-14 10 L 0 -24 L 14 10Z" fill="url(#goldV)" stroke="#7a4a10"/><circle cy="-6" r="3.6" fill="#1f8a4a"/></g>`
    : `${[...Array(9)].map((_, i) => { const a = Math.PI * (1.08 + i * .105); return `<g transform="translate(${Math.cos(a) * (W + 4)},${44 + Math.sin(a) * 44})">${[0, 72, 144, 216, 288].map(r => `<ellipse transform="rotate(${r})" cx="0" cy="-3.4" rx="2.3" ry="3.6" fill="${i % 3 ? '#fffaf0' : '#f6b6c6'}" stroke="#cfc3a6" stroke-width=".5"/>`).join('')}</g>`; }).join('')}`;
  return `<g>${F.tulasiHair(p, 'back')}${F.faceP(p)}${F.tulasiHair(p, 'front')}
    <circle cx="0" cy="${p.brow.y - 7}" r="3.4" fill="#c8201a"/>${royal ? `<path d="M0 -8 L 0 12" stroke="url(#gold)" stroke-width="2"/><circle cx="0" cy="14" r="3" fill="url(#gold)"/>` : ''}
    ${tiara}${jh(-1)}${jh(1)}</g>`;
}

function sita(x, y, s, o = {}) {
  const royal = o.look !== 'vanvas', id = 'sita' + (o.id || '');
  let body = C.tulasi(x, y, s, { ...o, pose: o.pose || 'neutral', headSvg: sitaHead(o, id) });
  body = body.replace(/url\(#tBlouse\)/g, royal ? 'url(#sitaBlouse)' : 'url(#sitaBlouseV)').replace(/url\(#tSaree\)/g, royal ? 'url(#sitaSaree)' : 'url(#sitaOchre)')
    .replace(/url\(#tButta\)/g, royal ? 'url(#sitaButta)' : 'url(#noButta)').replace(/url\(#tSkin\)/g, 'url(#sitaSkin)');
  return `<g>${o.halo === false ? '' : `<circle cx="${x}" cy="${y + 60 * s}" r="${150 * s}" fill="url(#lampGlow)" opacity=".4"/>`}${body}</g>`;
}

function ramSitaSheet() {
  const W = 1920, H = 1080;
  const lbl = (x, t, c) => `<text x="${x}" y="1040" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="26" fill="${c}">${t}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${A.defs()}${C.defs2()}${defs}
    <rect width="${W}" height="${H}" fill="#f6efe2"/><rect x="960" width="960" height="${H}" fill="#e8efe0"/>
    <text x="480" y="62" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="38" fill="#8a3a14">AYODHYA · ROYAL</text>
    <text x="1440" y="62" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="38" fill="#3a5a2a">VANVAS · FOREST</text>
    ${ram(300, 190, .8, { id: 'r1', look: 'royal', eyes: 'open', mouth: 'smile' })}${sita(680, 205, .82, { id: 's1', look: 'royal', eyes: 'open', mouth: 'smile' })}
    ${ram(1260, 190, .8, { id: 'r2', look: 'vanvas', eyes: 'lowered', mouth: 'soft' })}${sita(1640, 205, .82, { id: 's2', look: 'vanvas', eyes: 'lowered', mouth: 'soft' })}
    ${lbl(300, 'Shri Ram', '#5a3a20')}${lbl(680, 'Mata Sita', '#5a3a20')}${lbl(1260, 'Shri Ram', '#3a4a2a')}${lbl(1640, 'Mata Sita', '#3a4a2a')}
  </svg>`;
}

module.exports = { ram, sita, ramHead, sitaHead, ramSitaSheet, defs };
