// Five face options for Tulasi, rendered as matching head-and-shoulder portraits.
const A = require('../engine/art.js');
const C = require('../engine/characters.js');
const F = require('../engine/faces.js');

const OPTIONS = {
  A: { name: 'Soft Classic', W: 44, chin: 130, cheek: .96, jaw: .5, noseY: 94, mouthY: 110,
    eye: { ex: 20, ey: 64, ew: 26, eh: 9.5, tilt: 2, irisK: .82, flick: 4 }, lashes: true, crease: true, liner: 2.6,
    brow: { x0: 6, x1: 35, y: 49, arch: 5, t: 2.6 }, nose: 'soft',
    lips: { w: 11.5, up: 4.2, lo: 6.4, c1: '#b8463e', c2: '#d4645a' }, smile: true, hairVol: 4, hairSide: 3 },
  B: { name: 'Doe-Eyed (animated film)', W: 46, chin: 126, cheek: 1.0, jaw: .56, noseY: 92, mouthY: 106,
    eye: { ex: 21, ey: 66, ew: 28, eh: 12.5, tilt: 1, irisK: .86, flick: 3 }, lashes: true, crease: true, liner: 2.4,
    brow: { x0: 7, x1: 34, y: 48, arch: 4, t: 2.2 }, nose: 'button', blush: .3, blushY: 90,
    lips: { w: 9, up: 3.6, lo: 5.6, c1: '#c44a48', c2: '#df6a64' }, smile: true, hairVol: 6, hairSide: 4, wavy: true },
  C: { name: 'Kerala Mural (traditional)', W: 42, chin: 134, cheek: .94, jaw: .46, noseY: 96, mouthY: 112,
    eye: { ex: 20, ey: 63, ew: 30, eh: 8, tilt: 4.5, irisK: .9, flick: 9 }, lashes: false, crease: false, liner: 3.2, lowerLine: 1.6,
    brow: { x0: 5, x1: 38, y: 48, arch: 7, t: 2 }, nose: 'mural', blush: .12,
    lips: { w: 9.5, up: 4, lo: 5.4, c1: '#a83a32', c2: '#c4524a' }, smile: false, hairVol: 2, hairSide: 1 },
  D: { name: 'Graceful Realistic', W: 43, chin: 132, cheek: .95, jaw: .44, noseY: 95, mouthY: 111,
    eye: { ex: 19.5, ey: 64, ew: 25, eh: 8.6, tilt: 2.5, irisK: .84, flick: 3 }, lashes: true, crease: true, liner: 2.2, lowerLine: 1.2,
    brow: { x0: 6, x1: 35, y: 50, arch: 4.5, t: 3 }, nose: 'defined', cheekbone: true, blush: .18,
    lips: { w: 12, up: 4.6, lo: 7, c1: '#a8403c', c2: '#c85a54' }, smile: false, hairVol: 5, hairSide: 5, wavy: true },
  E: { name: 'Serene Devotional', W: 45, chin: 128, cheek: .98, jaw: .54, noseY: 93, mouthY: 108,
    eye: { ex: 20, ey: 65, ew: 27, eh: 7, tilt: 1.5, irisK: 1.05, flick: 5 }, lashes: true, crease: true, liner: 2.6,
    brow: { x0: 6, x1: 35, y: 50, arch: 4, t: 2.4 }, nose: 'soft', blush: .25,
    lips: { w: 10.5, up: 4, lo: 6, c1: '#b8463e', c2: '#d4645a' }, smile: true, hairVol: 3, hairSide: 2 },
};

// head-and-shoulders bust using a face option
function bust(o, id) {
  const p = { ...o, id };
  const W = p.W;
  const jas = (sx) => [...Array(7)].map((_, i) => {
    const t = i / 6, x = sx * (W + 8 + Math.sin(t * 3) * 5), y = 48 + t * 84;
    return `<g transform="translate(${x},${y}) rotate(${i * 40})">${[0, 72, 144, 216, 288].map(a => `<ellipse transform="rotate(${a})" cx="0" cy="-4" rx="2.8" ry="4.2" fill="#fffaf0" stroke="#cfc3a6" stroke-width=".6"/>`).join('')}<circle r="1.4" fill="#f2e3a0"/></g>`;
  }).join('');
  const jhumka = (sx) => `<g transform="translate(${sx * (W + 3)},84) scale(.72)">
    <circle r="4.5" fill="url(#gold)" stroke="#8a5a12" stroke-width=".8"/><circle r="2" fill="#1f8a4a"/>
    <path d="M0 4 L 0 10" stroke="url(#gold)" stroke-width="2"/>
    <path d="M-10 26 C -10 14 -5 10 0 10 C 5 10 10 14 10 26Z" fill="url(#gold)" stroke="#8a5a12" stroke-width="1"/>
    ${[-8, -4, 0, 4, 8].map(x => `<circle cx="${x}" cy="29" r="1.6" fill="#fff6e6"/>`).join('')}</g>`;
  const tikka = `<path d="M0 -10 L 0 15" stroke="url(#gold)" stroke-width="2"/>
    <path d="M0 15 C 5 16 7 20 5 24 C 3 26 -3 26 -5 24 C -7 20 -5 16 0 15Z" fill="url(#gold)" stroke="#8a5a12" stroke-width=".8"/>
    <circle cx="0" cy="20.5" r="2" fill="#c8201a"/>${[-3.5, 0, 3.5].map(x => `<circle cx="${x}" cy="27.5" r="1.2" fill="#fff6e6"/>`).join('')}
    <path d="M0 -8 C -20 -6 -36 6 -45 24 M0 -8 C 20 -6 36 6 45 24" stroke="url(#gold)" stroke-width="1.4" fill="none"/>`;
  const bindi = `<circle cx="0" cy="${p.brow.y - 6}" r="3" fill="#c8201a"/>`;
  return `<g>
    <!-- shoulders: blouse + pallu -->
    <path d="M-16 118 L -18 150 C -40 160 -70 166 -92 178 C -104 186 -110 204 -110 230 L 110 230 C 110 204 104 186 92 178 C 70 166 40 160 18 150 L 16 118Z" fill="url(#tSkin)" stroke="#3b1c0e" stroke-width="2"/>
    <path d="M-16 134 Q 0 148 16 134 L 16 120 L -16 120Z" fill="#b9774a" opacity=".3"/>
    <path d="M-34 160 C -22 192 22 192 34 160 C 56 162 80 168 96 180 C 106 190 110 206 110 230 L -110 230 C -110 206 -106 190 -96 180 C -80 168 -56 162 -34 160Z" fill="url(#tBlouse)" stroke="#3b1c0e" stroke-width="2"/>
    ${C.borderStroke('M-34 160 C -22 192 22 192 34 160', 5)}
    <path d="M-30 230 C -4 206 20 182 42 164 C 64 164 88 170 100 182 C 108 194 110 210 110 230Z" fill="url(#tSaree)" stroke="#3b1c0e" stroke-width="2"/>
    <path d="M-30 230 C -4 206 20 182 42 164 C 64 164 88 170 100 182 C 108 194 110 210 110 230Z" fill="url(#tButta)"/>
    ${C.borderStroke('M-30 230 C -4 206 20 182 42 164', 9)}
    <path d="M-20 150 Q 0 164 20 150" stroke="url(#gold)" stroke-width="6" fill="none"/>
    ${[-10, -3, 3, 10].map(x => `<circle cx="${x}" cy="${155 - Math.abs(x) * .3}" r="2.2" fill="${Math.abs(x) < 6 ? '#1f8a4a' : '#c8201a'}"/>`).join('')}
    <path d="M-26 156 C -22 190 -8 206 0 212 C 8 206 22 190 26 156" stroke="url(#gold)" stroke-width="2.4" fill="none"/>
    <path d="M0 210 l 6 8 -6 9 -6 -9z" fill="url(#gold)" stroke="#8a5a12" stroke-width=".8"/><circle cx="0" cy="218" r="2.2" fill="#c8201a"/>
    <!-- head -->
    ${F.tulasiHair(p, 'back')}${jas(-1)}${jas(1)}
    ${F.faceP(p)}
    ${F.tulasiHair(p, 'front')}${tikka}${bindi}${jhumka(-1)}${jhumka(1)}
  </g>`;
}

function faceOptions() {
  const W = 1920, H = 1080;
  const keys = Object.keys(OPTIONS);
  let cards = '';
  keys.forEach((k, i) => {
    const cx = 192 + i * 384, cy = 250;
    cards += `<clipPath id="card${k}"><rect x="${cx - 176}" y="80" width="352" height="740" rx="18"/></clipPath>
      <rect x="${cx - 176}" y="80" width="352" height="840" rx="18" fill="#fbf1dc" stroke="#d8c39a" stroke-width="2"/>
      <g clip-path="url(#card${k})"><g transform="translate(${cx},${cy}) scale(2.3)">${bust(OPTIONS[k], k)}</g></g>
      <text x="${cx}" y="870" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="54" fill="#8a3a14">${k}</text>
      <text x="${cx}" y="904" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="25" fill="#5a3a20">${OPTIONS[k].name}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${A.defs()}${C.defs2()}
    <rect width="${W}" height="${H}" fill="#f1e2c2"/>
    <text x="${W / 2}" y="54" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="34" fill="#6a2a10">TULASI DEVI · FACE OPTIONS</text>
    ${cards}</svg>`;
}

module.exports = { faceOptions, OPTIONS, bust };
