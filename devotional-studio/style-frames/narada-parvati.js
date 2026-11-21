// Narada (divine sage with veena) and Mata Parvati — full body, same build system as the other characters.
const A = require('../engine/art.js');
const C = require('../engine/characters.js');
const F = require('../engine/faces.js');
const INK = '#2a1a10';
const TORSO = 'M -19.5 120 L -21.8 151 C -44 155 -66 160 -80 168 C -94 176 -100 196 -98 216 C -96 232 -90 242 -82 246 C -76 250 -74 258 -73 268 C -70 300 -65 334 -64.4 376 L -66.7 430 L 66.7 430 L 64.4 376 C 65 334 70 300 73 268 C 74 258 76 250 82 246 C 90 242 96 232 98 216 C 100 196 94 176 80 168 C 66 160 44 155 21.8 151 L 19.5 120 Z';

const defs = `<defs>
  <radialGradient id="nSkin" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#f8d4ac"/><stop offset=".62" stop-color="#e8b282"/><stop offset="1" stop-color="#b8805a"/></radialGradient>
  <linearGradient id="nSkinL" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="#f8d4ac"/><stop offset=".45" stop-color="#e8b282"/><stop offset="1" stop-color="#b8805a"/></linearGradient>
  <linearGradient id="nWhite" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffdf6"/><stop offset=".6" stop-color="#f0e8d8"/><stop offset="1" stop-color="#cfc4ac"/></linearGradient>
  <linearGradient id="nSaff" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb24a"/><stop offset=".6" stop-color="#ec8420"/><stop offset="1" stop-color="#a8520e"/></linearGradient>
  <linearGradient id="vWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8682e"/><stop offset=".5" stop-color="#7a4416"/><stop offset="1" stop-color="#4a260a"/></linearGradient>
  <radialGradient id="gourd" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#d8a060"/><stop offset=".6" stop-color="#9a5a22"/><stop offset="1" stop-color="#5a300c"/></radialGradient>
  <radialGradient id="pFace" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#fbdcb8"/><stop offset=".62" stop-color="#efbf92"/><stop offset="1" stop-color="#c88e62"/></radialGradient>
  <linearGradient id="pSkin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fbdcb8"/><stop offset=".5" stop-color="#efbf92"/><stop offset="1" stop-color="#c88e62"/></linearGradient>
  <linearGradient id="pBlouse" gradientUnits="userSpaceOnUse" x1="-120" y1="150" x2="120" y2="280"><stop offset="0" stop-color="#ffd34a"/><stop offset=".55" stop-color="#e8a818"/><stop offset="1" stop-color="#a86e08"/></linearGradient>
  <linearGradient id="pSaree" gradientUnits="userSpaceOnUse" x1="-110" y1="0" x2="110" y2="0"><stop offset="0" stop-color="#b8243a"/><stop offset=".45" stop-color="#8e1428"/><stop offset="1" stop-color="#5a0818"/></linearGradient>
  <pattern id="pButta" width="30" height="34" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="2.2" fill="#f2c14e" opacity=".85"/><circle cx="23" cy="25" r="2.2" fill="#f2c14e" opacity=".85"/><path d="M23 6 l 2 3 -2 3 -2 -3z M8 22 l 2 3 -2 3 -2 -3z" fill="#f2c14e" opacity=".6"/></pattern>
</defs>`;

// ---------------- NARADA
const NARADA_FACE = { W: 47, chin: 130, cheek: 1.0, jaw: .56, noseY: 94, mouthY: 110, irisCol: '#5a3014',
  eye: { ex: 21, ey: 66, ew: 27, eh: 11, tilt: 1.5, irisK: .88, flick: 3 }, crease: true, liner: 2.5,
  brow: { x0: 6, x1: 36, y: 50, arch: 5, t: 3 }, nose: 'soft', lips: { w: 10.5, up: 3.8, lo: 5.8, c1: '#b4483e', c2: '#cc6054' }, smile: true };

function veena(t = 0) {
  const L = 609, ang = Math.atan2(-560, -240) * 180 / Math.PI;
  const vib = Math.sin(t * 40) * .6;
  return `<g transform="translate(110,520) rotate(${ang})">
    <circle cx="-14" cy="0" r="52" fill="url(#gourd)" stroke="#2a1606" stroke-width="2.2"/>
    <ellipse cx="-14" cy="-18" rx="30" ry="12" fill="#fff" opacity=".12"/>
    <rect x="20" y="-11" width="${L - 40}" height="22" rx="6" fill="url(#vWood)" stroke="#2a1606" stroke-width="2"/>
    ${[...Array(14)].map((_, i) => `<path d="M${70 + i * 30} -11 L ${70 + i * 30} 11" stroke="url(#gold)" stroke-width="2.4"/>`).join('')}
    ${[-5, 0, 5].map(y => `<path d="M10 ${y} Q ${L / 2} ${y + vib} ${L - 20} ${y}" stroke="#fff4d6" stroke-width=".9" opacity=".85"/>`).join('')}
    <circle cx="${L - 6}" cy="0" r="32" fill="url(#gourd)" stroke="#2a1606" stroke-width="2"/>
    <path d="M${L + 22} -8 C ${L + 44} -16 ${L + 54} -2 ${L + 46} 10 C ${L + 40} 4 ${L + 32} 2 ${L + 24} 6Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.2"/>
    ${[-14, -2, 10].map(y => `<rect x="${L - 50}" y="${y - 22}" width="6" height="14" rx="2" fill="#3a1a06"/>`).join('')}
    <path d="M10 -14 L 10 14" stroke="url(#gold)" stroke-width="5"/></g>`;
}

function narada(x, y, s, o = {}) {
  const SK = 'url(#nSkinL)', SH = '#b8805a';
  const face = { ...NARADA_FACE, id: 'na' + (o.id || '') + (o.eyes || '') + (o.mouth || ''), skin: 'url(#nSkin)', shade: '#b8805a', rim: '#fff0d8', blush: .14,
    eyes: o.eyes || 'open', mouth: o.mouth, smile: o.mouth ? o.mouth === 'smile' : true };
  const by = face.brow.y;
  const namam = `<path d="M-8 ${by + 2} C -9 ${by - 12} -7 ${by - 22} -5 ${by - 30} M8 ${by + 2} C 9 ${by - 12} 7 ${by - 22} 5 ${by - 30}" stroke="#fffaf0" stroke-width="3.8" stroke-linecap="round" fill="none"/>
    <path d="M-8 ${by + 2} Q 0 ${by + 9} 8 ${by + 2}" stroke="#fffaf0" stroke-width="3.8" fill="none"/><path d="M0 ${by + 4} L 0 ${by - 28}" stroke="#d1261c" stroke-width="3" stroke-linecap="round"/>`;
  const topKnot = `<path d="M-24 14 C -30 -20 -20 -54 0 -60 C 20 -54 30 -20 24 14Z" fill="#16100c" stroke="#05030a" stroke-width="1.4"/>
    ${[-46, -30, -14].map((yy, i) => `<path d="M${-17 + i * 2} ${yy} Q 0 ${yy - 7} ${17 - i * 2} ${yy}" stroke="#3a2a22" stroke-width="1.8" fill="none"/>`).join('')}
    ${[...Array(9)].map((_, i) => { const a = Math.PI * (1.05 + i * .11); return `<g transform="translate(${Math.cos(a) * 26},${4 + Math.sin(a) * 9})">${[0, 72, 144, 216, 288].map(r => `<ellipse transform="rotate(${r})" cx="0" cy="-3.6" rx="2.4" ry="3.8" fill="#fffaf0" stroke="#cfc3a6" stroke-width=".5"/>`).join('')}<circle r="1.4" fill="#f2a01e"/></g>`; }).join('')}
    <circle cx="0" cy="-62" r="5" fill="#f2a01e" stroke="#a8520e"/>`;
  const J1 = { sh: [-80, 206], el: [-112, 300], wr: [4, 296] }, J2 = { sh: [80, 206], el: [116, 304], wr: [60, 402] };
  const mala = (w, d, y0) => `<path d="M${-w} ${y0} C ${-w * .9} ${y0 + d * .7} ${-w * .4} ${y0 + d} 0 ${y0 + d + 8} C ${w * .4} ${y0 + d} ${w * .9} ${y0 + d * .7} ${w} ${y0}" fill="none" stroke="#2e7a3a" stroke-width="6" stroke-dasharray="1 6" stroke-linecap="round"/>`;
  const legs = A.arm([-34, 470], [-38, 700], [-32, 898], SK, SH, [70, 66, 46, 48, 30]) + A.arm([34, 470], [38, 700], [32, 898], SK, SH, [70, 66, 46, 48, 30])
    + [-1, 1].map(sx => `<g transform="scale(${sx},1)"><path d="M-50 898 C -60 914 -58 930 -40 934 L -12 934 C -4 928 -8 912 -16 898Z" fill="${SK}" stroke="${INK}" stroke-width="2"/></g>`).join('');
  return `<g transform="translate(${x},${y}) scale(${s})">
    <circle cx="0" cy="60" r="140" fill="url(#lampGlow)" opacity=".45"/>
    ${legs}
    <path d="M-66 420 C -84 500 -92 600 -90 720 L -40 740 L -10 700 L 10 700 L 40 740 L 90 720 C 92 600 84 500 66 420Z" fill="url(#nWhite)" stroke="#8a7a5a" stroke-width="2"/>
    <path d="M-90 720 L -40 740 L -10 700 L 10 700 L 40 740 L 90 720" stroke="url(#nSaff)" stroke-width="9" fill="none"/>
    ${[-50, -24, 24, 50].map(xx => `<path d="M${xx * .8} 440 C ${xx} 560 ${xx * 1.1} 650 ${xx * 1.2} 720" stroke="#cfc4ac" stroke-width="2" fill="none"/>`).join('')}
    <path d="M-50 60 C -56 100 -52 130 -58 156 L 58 156 C 52 130 56 100 50 60Z" fill="#16100c"/>
    ${A.arm(J1.sh, J1.el, J1.wr, SK, SH, [44, 42, 31, 32, 25])}${A.arm(J2.sh, J2.el, J2.wr, SK, SH, [44, 42, 31, 32, 25])}
    <path d="${TORSO}" fill="${SK}" stroke="${INK}" stroke-width="2.2"/>
    <path d="M-44 232 Q -24 242 -6 238 M44 232 Q 24 242 6 238" stroke="${SH}" stroke-width="1.6" fill="none" opacity=".5"/>
    <!-- saffron sash over the left shoulder -->
    <path d="M30 152 C 60 156 84 168 90 196 L 82 230 C 40 300 -10 360 -50 430 L -70 430 C -40 360 0 290 38 220 C 34 196 30 172 30 152Z" fill="url(#nSaff)" stroke="#7a3a08" stroke-width="2"/>
    <path d="M-66 394 Q 0 410 66 394 L 70 428 Q 0 444 -70 428Z" fill="url(#nSaff)" stroke="#7a3a08" stroke-width="1.6"/>
    ${mala(36, 120, 158)}${mala(26, 84, 156)}
    ${veena(o.t || 0)}
    <g transform="translate(4,296) rotate(-30) scale(.62)">${A.holdingHand(SK, SH, 1, true)}</g>
    <g transform="translate(60,402) rotate(-24) scale(.62)">${A.holdingHand(SK, SH, 1, false)}</g>
    ${F.faceP(face)}
    <path d="M-47 32 C -43 18 -27 12 0 12 C 27 12 43 18 47 32 L 48 42 C 39 30 23 24 0 24 C -23 24 -39 30 -48 42Z" fill="#16100c"/>
    ${topKnot}${namam}
    ${[-1, 1].map(sx => `<g transform="translate(${sx * 50},90)"><circle r="6" fill="url(#gold)" stroke="#7a4a10"/><circle cy="9" r="3" fill="#2e7a3a"/></g>`).join('')}
  </g>`;
}

// ---------------- PARVATI
const PARVATI_FACE = { W: 46, chin: 128, cheek: 1.0, jaw: .55, noseY: 93, mouthY: 107, irisCol: '#5a3014',
  eye: { ex: 21, ey: 66, ew: 28, eh: 11.5, tilt: 2, irisK: .86, flick: 4.5 }, lashes: true, crease: true, liner: 2.8,
  brow: { x0: 6, x1: 35, y: 49, arch: 4.5, t: 2.4 }, nose: 'soft', blush: .2, blushY: 90,
  lips: { w: 9.5, up: 3.8, lo: 5.8, c1: '#b8303a', c2: '#d4505a' }, smile: true, hairVol: 5, hairSide: 3, wavy: true };

function parvatiHead(o = {}) {
  const p = { ...PARVATI_FACE, id: 'pv' + (o.id || '') + (o.eyes || '') + (o.mouth || ''), skin: 'url(#pFace)', shade: '#c08860',
    eyes: o.eyes || 'lowered', mouth: o.mouth, tears: o.tears, sad: o.sad, smile: o.mouth ? o.mouth === 'smile' : true };
  const W = p.W;
  const jhumka = (sx) => `<g transform="translate(${sx * (W + 3)},84) scale(.8)">
    <circle r="5" fill="url(#gold)" stroke="#8a5a12" stroke-width=".8"/><circle r="2.2" fill="#d1261c"/>
    <path d="M0 4 L 0 10" stroke="url(#gold)" stroke-width="2"/>
    <path d="M-12 28 C -12 15 -6 10 0 10 C 6 10 12 15 12 28Z" fill="url(#gold)" stroke="#8a5a12" stroke-width="1"/>
    ${[-10, -5, 0, 5, 10].map(x => `<circle cx="${x}" cy="31" r="1.8" fill="#fff6e6"/>`).join('')}</g>`;
  const crown = `<g transform="translate(0,-18)">
    <path d="M-50 30 Q 0 14 50 30 L 48 8 Q 0 -6 -48 8Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.4"/>
    ${[-30, -15, 0, 15, 30].map(xx => `<circle cx="${xx}" cy="${18 - (30 - Math.abs(xx)) * .15}" r="${xx === 0 ? 5 : 3}" fill="${xx === 0 ? '#d1261c' : (Math.abs(xx) === 15 ? '#1f8a4a' : '#fff4d6')}" stroke="#7a4a10" stroke-width=".7"/>`).join('')}
    <path d="M-40 8 L -30 -34 C -16 -48 16 -48 30 -34 L 40 8Z" fill="url(#goldV)" stroke="#7a4a10" stroke-width="1.4"/>
    ${[-12, 2].map((yy, i) => `<path d="M${-36 + i * 3} ${yy} Q 0 ${yy - 8} ${36 - i * 3} ${yy}" stroke="#7a4a10" stroke-width="1.6" fill="none"/>`).join('')}
    <path d="M-30 -34 C -16 -48 16 -48 30 -34 L 20 -60 Q 0 -72 -20 -60Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.2"/>
    <path d="M0 -68 C 8 -78 7 -90 0 -98 C -7 -90 -8 -78 0 -68Z" fill="url(#gold)" stroke="#7a4a10"/>
    <ellipse cx="0" cy="-22" rx="5.5" ry="5" fill="#d1261c" stroke="#7a4a10"/>
    ${[-1, 1].map(sx => `<g transform="translate(${sx * 46},14) scale(${sx},1)">${[-60, -25, 10].map(a => `<ellipse transform="rotate(${a})" cx="0" cy="-8" rx="3.6" ry="7" fill="url(#gold)" stroke="#7a4a10" stroke-width=".7"/>`).join('')}<circle r="3.6" fill="#1f8a4a" stroke="#7a4a10" stroke-width=".6"/></g>`).join('')}</g>`;
  return `<g>
    ${F.tulasiHair(p, 'back')}
    <ellipse cx="0" cy="40" rx="${W + 16}" ry="30" fill="#16100c"/>
    ${F.faceP(p)}
    ${F.tulasiHair(p, 'front')}
    <circle cx="0" cy="${p.brow.y - 7}" r="3.6" fill="#c8201a"/>
    ${crown}${jhumka(-1)}${jhumka(1)}
  </g>`;
}

function parvati(x, y, s, o = {}) {
  let body = C.tulasi(x, y, s, { ...o, pose: o.pose || 'neutral', headSvg: parvatiHead(o) });
  body = body.replace(/url\(#tBlouse\)/g, 'url(#pBlouse)').replace(/url\(#tSaree\)/g, 'url(#pSaree)').replace(/url\(#tButta\)/g, 'url(#pButta)').replace(/url\(#tSkin\)/g, 'url(#pSkin)');
  // lotus in her left hand (screen right)
  const lotus = o.lotus === false ? '' : `<g transform="translate(${x + 111 * s},${y + 470 * s}) scale(${.42 * s})">${A.lotus(0, 0, 1, '#f6b6c6', '#c64f73')}</g>`;
  return `<g><circle cx="${x}" cy="${y + 60 * s}" r="${150 * s}" fill="url(#lampGlow)" opacity=".5"/>${body}${lotus}</g>`;
}

function naradaParvatiSheet() {
  const W = 1920, H = 1080;
  const card = (cx, cy, fn, o, id, label, bg, sc = 1.1, dy = 80) => `<clipPath id="np${id}"><rect x="${cx - 120}" y="${cy - 150}" width="240" height="300" rx="14"/></clipPath>
    <rect x="${cx - 120}" y="${cy - 150}" width="240" height="300" rx="14" fill="${bg}" stroke="#c8b894" stroke-width="2"/>
    <g clip-path="url(#np${id})">${fn(cx, cy - dy, sc, { ...o, id })}</g>
    <text x="${cx}" y="${cy + 182}" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="23" fill="#4a3a20">${label}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${A.defs()}${C.defs2()}${defs}
    <rect width="${W}" height="${H}" fill="#f6efe2"/>
    <ellipse cx="320" cy="980" rx="140" ry="13" fill="#7a5a30" opacity=".25" filter="url(#blur3)"/>
    ${narada(320, 205, .82, { id: 'full' })}
    <text x="320" y="62" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="40" fill="#a8520e">NARADA</text>
    <rect x="640" y="0" width="${W - 640}" height="${H}" fill="#fbeef0"/>
    <ellipse cx="900" cy="985" rx="120" ry="12" fill="#7a3040" opacity=".2" filter="url(#blur3)"/>
    ${parvati(900, 196, .86, { id: 'full' })}
    <text x="900" y="62" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="40" fill="#8e1428">PARVATI</text>
    ${card(1310, 290, narada, { eyes: 'closed', mouth: 'open' }, 1, 'narada · singing “Narayan”', '#fbf4e6')}
    ${card(1580, 290, narada, { eyes: 'lowered', mouth: 'smile' }, 2, 'narada · mischievous', '#fbf4e6')}
    ${card(1310, 760, parvati, { eyes: 'lowered', mouth: 'smile', lotus: false }, 3, 'parvati · serene', '#fff6f8', 1.6, 120)}
    ${card(1580, 760, parvati, { eyes: 'angry', mouth: 'soft', lotus: false }, 4, 'parvati · sees through the trick', '#fff6f8', 1.6, 120)}
  </svg>`;
}

module.exports = { naradaParvatiSheet, narada, parvati, defs };
