// Deepa Chitra characters v2 — full-body, code-drawn, matched to the master reference sheets
// (references/characters/*.png). Local units: y=0 is the top of the skull, x=0 the centre line.
// Tulasi is ~900 units tall (7 heads), Vishnu ~960 (8 heads). Head height H = 128.
const A = require('./art.js');
const F = require('./faces.js');
const { P } = A;

const INK = '#3b1c0e';           // softer than mural black-brown; reads as illustration
const LW = 2.2;                   // base line width

function defs2() {
  return `<defs>
    <linearGradient id="tSkin" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f3c7a0"/><stop offset=".5" stop-color="#e4aa7c"/><stop offset="1" stop-color="#c3835a"/>
    </linearGradient>
    <radialGradient id="tFace" cx=".42" cy=".42" r=".72">
      <stop offset="0" stop-color="#f8d0aa"/><stop offset=".62" stop-color="#e6ad80"/><stop offset="1" stop-color="#c7885d"/>
    </radialGradient>
    <linearGradient id="tBlouse" gradientUnits="userSpaceOnUse" x1="-120" y1="150" x2="120" y2="280">
      <stop offset="0" stop-color="#26a466"/><stop offset=".55" stop-color="#13784a"/><stop offset="1" stop-color="#0b4f30"/>
    </linearGradient>
    <linearGradient id="tSaree" gradientUnits="userSpaceOnUse" x1="-110" y1="0" x2="110" y2="0">
      <stop offset="0" stop-color="#d9392a"/><stop offset=".45" stop-color="#bd201b"/><stop offset="1" stop-color="#860f0e"/>
    </linearGradient>
    <pattern id="tButta" width="34" height="40" patternUnits="userSpaceOnUse">
      <path d="M8 6 c3 0 4 3 2 5 c-1 1 -3 1 -3 -1 c0 -2 1 -4 1 -4z" fill="#f0c048" opacity=".85"/>
      <path d="M21 21 c3 0 4 3 2 5 c-1 1 -3 1 -3 -1 c0 -2 1 -4 1 -4z" fill="#f0c048" opacity=".85"/>
      <circle cx="21" cy="8" r="1.2" fill="#f0c048" opacity=".7"/><circle cx="8" cy="23" r="1.2" fill="#f0c048" opacity=".7"/>
    </pattern>
    <linearGradient id="vSkin" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#9fb0ec"/><stop offset=".5" stop-color="#7486d6"/><stop offset="1" stop-color="#4f5fb0"/>
    </linearGradient>
    <radialGradient id="vFace" cx=".42" cy=".42" r=".72">
      <stop offset="0" stop-color="#a9b8f0"/><stop offset=".62" stop-color="#7a8bd8"/><stop offset="1" stop-color="#5262b4"/>
    </radialGradient>
    <linearGradient id="vTorso" gradientUnits="userSpaceOnUse" x1="-130" y1="0" x2="130" y2="0">
      <stop offset="0" stop-color="#9aabea"/><stop offset=".45" stop-color="#7889d8"/><stop offset="1" stop-color="#4c5bab"/>
    </linearGradient>
    <linearGradient id="vDhoti" gradientUnits="userSpaceOnUse" x1="-120" y1="0" x2="120" y2="0">
      <stop offset="0" stop-color="#ffd54a"/><stop offset=".5" stop-color="#f7b51e"/><stop offset="1" stop-color="#c9820c"/>
    </linearGradient>
    <linearGradient id="vShawl" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#d8442a"/><stop offset="1" stop-color="#8f1a12"/>
    </linearGradient>
    <filter id="sBlur"><feGaussianBlur stdDeviation="2.2"/></filter>
    <filter id="sBlur5"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>`;
}

// A woven saree/silk border drawn along a path: green edges, gold body, dark motif dashes.
function borderStroke(d, w = 12, green = '#0f6a3c') {
  return `<path d="${d}" fill="none" stroke="${green}" stroke-width="${w + 5}" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="url(#gold)" stroke-width="${w}" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="#9a5a10" stroke-width="${w * .32}" stroke-dasharray="3 5" stroke-linejoin="round"/>`;
}

// ---------------------------------------------------------------- shared face
// Origin: top of skull. Face oval ~98 wide, chin at y=128. opts: skin, shade, eyes, mouth, brows, male
function faceV2(o) {
  const eyes = o.eyes || 'open';
  const eyeY = o.male ? 64 : 63;
  const lid = { open: 0, lowered: 4.5, half: 3, wide: -1.5, closed: 99, angry: -1 }[eyes];
  const eye = (sx) => {
    if (eyes === 'closed') {
      return `<g transform="scale(${sx},1)">
        <path d="M7 ${eyeY} C 13 ${eyeY + 6} 25 ${eyeY + 6} 32 ${eyeY - 1}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
        ${[12, 17, 22, 27].map((x, i) => `<path d="M${x} ${eyeY + 4.6 - Math.abs(i - 1.5) * .6} l ${-.6 + i * .5} 3.2" stroke="${INK}" stroke-width="1.2"/>`).join('')}
        <path d="M8 ${eyeY - 5} C 15 ${eyeY - 9} 25 ${eyeY - 9} 31 ${eyeY - 5}" fill="none" stroke="${o.shade}" stroke-width="1.6" opacity=".55"/>
      </g>`;
    }
    const top = eyeY - 8 + lid, cid = `ec${o.id}${sx > 0 ? 'r' : 'l'}`;
    const shape = `M7 ${eyeY + 1} C 12 ${top} 25 ${top - 1} 32 ${eyeY - 2} C 26 ${eyeY + 5} 13 ${eyeY + 6} 7 ${eyeY + 1}Z`;
    const ix = 19 + (o.look || 0) * sx, iy = eyeY - .5 + (eyes === 'lowered' ? 1.5 : 0);
    return `<g transform="scale(${sx},1) translate(19,${eyeY}) scale(1.16) translate(-19,${-eyeY})">
      <clipPath id="${cid}"><path d="${shape}"/></clipPath>
      <path d="${shape}" fill="#fbf3ea"/>
      <g clip-path="url(#${cid})">
        <circle cx="${ix}" cy="${iy}" r="6.6" fill="#5a3218"/>
        <circle cx="${ix}" cy="${iy}" r="5" fill="#3a1e0d"/>
        <circle cx="${ix}" cy="${iy}" r="2.6" fill="#120804"/>
        <circle cx="${ix + 2}" cy="${iy - 2.2}" r="1.7" fill="#fff"/>
        <path d="M7 ${top - 2} C 14 ${top + 2} 26 ${top + 2} 32 ${top - 2} L 32 ${top - 8} L 7 ${top - 8}Z" fill="${o.shade}" opacity=".35"/>
      </g>
      <path d="M6.5 ${eyeY + 1.5} C 12 ${top - .5} 25 ${top - 1.5} 32.5 ${eyeY - 2.5} L 35.5 ${eyeY - 5.5}" fill="none" stroke="${INK}" stroke-width="${o.male ? 2.6 : 3}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 ${eyeY + 2.5} C 15 ${eyeY + 6.5} 25 ${eyeY + 5.5} 31 ${eyeY - 1}" fill="none" stroke="${INK}" stroke-width="1" opacity=".7"/>
      <path d="M8 ${top - 3.5} C 15 ${top - 7} 25 ${top - 7.5} 31 ${top - 4}" fill="none" stroke="${o.shade}" stroke-width="1.3" opacity=".6"/>
    </g>`;
  };
  const browY = eyeY - 14;
  const brow = (sx) => {
    const angry = o.brows === 'angry' || eyes === 'angry';
    const inner = angry ? browY + 5 : browY + 1, outer = angry ? browY - 1 : browY + 1.5;
    return `<path transform="scale(${sx},1)" d="M5 ${inner} C 13 ${browY - 6 + (angry ? 4 : 0)} 25 ${browY - 6} 34 ${outer} C 25 ${browY - 3.6} 14 ${browY - 3.6 + (angry ? 3 : 0)} 5 ${inner + 2.2}Z" fill="${o.male ? '#1c120c' : '#24160e'}"/>`;
  };
  const mouthY = o.male ? 110 : 107;
  const mouths = {
    soft: `<path d="M-11 ${mouthY} C -6 ${mouthY - 3.5} -2 ${mouthY - 2.5} 0 ${mouthY - 1.5} C 2 ${mouthY - 2.5} 6 ${mouthY - 3.5} 11 ${mouthY} C 6 ${mouthY + 1.4} -6 ${mouthY + 1.4} -11 ${mouthY}Z" fill="${o.lip1}"/>
      <path d="M-10 ${mouthY + .4} C -6 ${mouthY + 7} 6 ${mouthY + 7} 10 ${mouthY + .4} C 4 ${mouthY + 1.8} -4 ${mouthY + 1.8} -10 ${mouthY + .4}Z" fill="${o.lip2}"/>
      <path d="M-11 ${mouthY} C -5 ${mouthY + 1.6} 5 ${mouthY + 1.6} 11 ${mouthY}" stroke="${INK}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      <path d="M-4 ${mouthY + 4.2} Q 0 ${mouthY + 5.4} 4 ${mouthY + 4.2}" stroke="#fff" stroke-width="1.2" opacity=".35" fill="none"/>`,
    smile: `<path d="M-12 ${mouthY - 1} C -6 ${mouthY - 3} -2 ${mouthY - 2} 0 ${mouthY - 1.2} C 2 ${mouthY - 2} 6 ${mouthY - 3} 12 ${mouthY - 1} C 6 ${mouthY + 2.5} -6 ${mouthY + 2.5} -12 ${mouthY - 1}Z" fill="${o.lip1}"/>
      <path d="M-11 ${mouthY - .4} C -6 ${mouthY + 7} 6 ${mouthY + 7} 11 ${mouthY - .4} C 4 ${mouthY + 2.6} -4 ${mouthY + 2.6} -11 ${mouthY - .4}Z" fill="${o.lip2}"/>
      <path d="M-12 ${mouthY - 1} C -5 ${mouthY + 2.6} 5 ${mouthY + 2.6} 12 ${mouthY - 1}" stroke="${INK}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      <path d="M-14 ${mouthY - 2.5} q 1.5 1.5 2 1.5 M14 ${mouthY - 2.5} q -1.5 1.5 -2 1.5" stroke="${o.shade}" stroke-width="1.2" fill="none"/>`,
    open: `<path d="M-11 ${mouthY - 1} C -6 ${mouthY - 4} 6 ${mouthY - 4} 11 ${mouthY - 1} C 8 ${mouthY + 9} -8 ${mouthY + 9} -11 ${mouthY - 1}Z" fill="#5a1410"/>
      <path d="M-8 ${mouthY - 1.6} C -4 ${mouthY - 2.6} 4 ${mouthY - 2.6} 8 ${mouthY - 1.6} L 7 ${mouthY + .6} L -7 ${mouthY + .6}Z" fill="#fff6ee"/>
      <path d="M-11 ${mouthY - 1} C -6 ${mouthY - 4.5} -2 ${mouthY - 3.5} 0 ${mouthY - 2.5} C 2 ${mouthY - 3.5} 6 ${mouthY - 4.5} 11 ${mouthY - 1}" stroke="${o.lip1}" stroke-width="2.6" fill="none"/>
      <path d="M-10 ${mouthY + 1} C -7 ${mouthY + 10} 7 ${mouthY + 10} 10 ${mouthY + 1}" stroke="${o.lip2}" stroke-width="3.2" fill="none"/>`,
  };
  const W = o.male ? 48 : 44, chin = o.male ? 134 : 130;
  const facePath = `M0 0 C ${W * .64} 0 ${W} 20 ${W + 1} 56 C ${W + 2} 86 ${W * .8} ${chin - 20} ${W * .38} ${chin - 6} C ${W * .18} ${chin} ${-W * .18} ${chin} ${-W * .38} ${chin - 6} C ${-W * .8} ${chin - 20} ${-W - 2} 86 ${-W - 1} 56 C ${-W} 20 ${-W * .64} 0 0 0Z`;
  return `<g>
    <path d="M${-W - 2} 52 C ${-W - 13} 46 ${-W - 15} 74 ${-W - 3} 86 Z M${W + 2} 52 C ${W + 13} 46 ${W + 15} 74 ${W + 3} 86Z" fill="${o.skin}" stroke="${INK}" stroke-width="${LW}"/>
    <path d="${facePath}" fill="${o.skin}" stroke="${INK}" stroke-width="${LW}"/>
    <path d="M${-W - 1} 56 C ${-W - 2} 86 ${-W * .8} ${chin - 20} ${-W * .38} ${chin - 6} C ${-W * .6} ${chin - 26} ${-W * .9} 92 ${-W * .9} 56Z" fill="${o.shade}" opacity=".28"/>
    <path d="M${W * .2} 4 C ${W * .7} 10 ${W * .96} 34 ${W * .98} 60 C ${W * .99} 82 ${W * .8} 104 ${W * .45} ${chin - 10}" fill="none" stroke="${o.rim || '#ffe2bd'}" stroke-width="3" opacity=".5" filter="url(#sBlur)"/>
    ${o.male ? '' : `<ellipse cx="-29" cy="88" rx="10" ry="6" fill="#e8806a" opacity=".22"/><ellipse cx="29" cy="88" rx="10" ry="6" fill="#e8806a" opacity=".22"/>`}
    ${brow(1)}${brow(-1)}
    ${eye(1)}${eye(-1)}
    <path d="M-3 ${eyeY + 9} C -3.6 ${eyeY + 15} -4.4 ${eyeY + 20} -5.5 ${eyeY + 24}" fill="none" stroke="${o.shade}" stroke-width="2" opacity=".55"/>
    <path d="M-8 ${eyeY + 29} C -6 ${eyeY + 32.5} -2.5 ${eyeY + 32.5} 0 ${eyeY + 31} C 2.5 ${eyeY + 32.5} 6 ${eyeY + 32.5} 8 ${eyeY + 29}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M-9 ${eyeY + 27} C -11 ${eyeY + 29} -10 ${eyeY + 31} -8 ${eyeY + 31.5} M9 ${eyeY + 27} C 11 ${eyeY + 29} 10 ${eyeY + 31} 8 ${eyeY + 31.5}" fill="none" stroke="${o.shade}" stroke-width="1.4"/>
    <ellipse cx="2" cy="${eyeY + 25}" rx="3" ry="2" fill="#fff" opacity=".25"/>
    <g transform="translate(0,${mouthY}) scale(1.12) translate(0,${-mouthY})">${mouths[o.mouth || 'soft']}</g>
    <path d="M-6 ${chin - 9} Q 0 ${chin - 6} 6 ${chin - 9}" stroke="${o.shade}" stroke-width="1.4" fill="none" opacity=".45"/>
    ${o.tears ? `<path d="M24 ${eyeY + 6} C 22 ${eyeY + 16} 24 ${eyeY + 24} 25 ${eyeY + 30}" stroke="#dff2ff" stroke-width="2.4" fill="none" opacity=".8"/><circle cx="25" cy="${eyeY + 31}" r="2.4" fill="#e8f6ff" opacity=".9"/>` : ''}
  </g>`;
}

// jasmine flower cluster string along points
function jasmineString(pts, r = 6) {
  let out = '';
  pts.forEach(([x, y], i) => {
    out += `<g transform="translate(${x},${y}) rotate(${i * 37})">
      ${[0, 72, 144, 216, 288].map(a => `<ellipse transform="rotate(${a})" cx="0" cy="${-r * .6}" rx="${r * .42}" ry="${r * .62}" fill="#fffaf0" stroke="#cfc3a6" stroke-width=".7"/>`).join('')}
      <circle r="${r * .22}" fill="#f2e3a0"/></g>`;
  });
  return out;
}
const bez = (p0, p1, p2, p3, n) => [...Array(n)].map((_, i) => {
  const t = i / (n - 1), u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
});

// ---------------------------------------------------------------- TULASI
function tulasiHead(o = {}) {
  // Face = locked option B6 (engine/faces.js TULASI_FACE); expressions via o.eyes / o.mouth / o.tears
  const p = { ...F.TULASI_FACE, id: 't' + (o.id || '') + (o.eyes || '') + (o.mouth || ''), eyes: o.eyes || 'open', mouth: o.mouth, tears: o.tears, look: o.look, sad: o.sad,
    smile: o.mouth ? o.mouth === 'smile' : F.TULASI_FACE.smile };
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
    ${F.tulasiHair(p, 'back')}${jas(-1)}${jas(1)}
    ${F.faceP(p)}
    ${F.tulasiHair(p, 'front')}${tikka}${bindi}${jhumka(-1)}${jhumka(1)}
  </g>`;
}

function tulasi(x, y, s = 1, o = {}) {
  const pose = o.pose || 'neutral';
  const SK = 'url(#tSkin)', SH = '#b9774a';
  // ---- arms (joints)
  const J = pose === 'anjali'
    ? { r: { sh: [-92, 184], el: [-104, 318], wr: [-20, 262] }, l: { sh: [92, 184], el: [104, 318], wr: [20, 262] } }
    : { r: { sh: [-94, 184], el: [-118, 320], wr: [-126, 442] }, l: { sh: [94, 184], el: [118, 320], wr: [126, 442] } };
  const armW = [50, 47, 35, 35, 27];
  // relaxed hanging hand, side view: palm + four separate fingers + thumb in front (verified at close-up)
  const relaxedHand = (sx) => `<g transform="translate(${sx * 126},442) rotate(${sx * -4}) scale(${sx},1)">
      ${[[10, 30, 5.6], [4.5, 36, 6], [-1, 38, 6.2], [-6.5, 35, 6]].map(([fx, len, w]) => `<path d="M${fx - w / 2} 34 C ${fx - w / 2 - .6} ${34 + len * .5} ${fx - w / 2} ${34 + len * .8} ${fx - w / 2 + .6} ${34 + len - w / 2} A ${w / 2} ${w / 2} 0 0 0 ${fx + w / 2 + .6} ${34 + len - w / 2} C ${fx + w / 2 + .6} ${34 + len * .8} ${fx + w / 2 + .4} ${34 + len * .5} ${fx + w / 2} 34Z" fill="${SK}" stroke="${INK}" stroke-width="1.6"/>
        <path d="M${fx - w / 2 + 1} ${34 + len * .45} L ${fx + w / 2 - 1} ${34 + len * .45}" stroke="${SH}" stroke-width="1" opacity=".8"/>`).join('')}
      <path d="M-12 -2 C -14 12 -14 26 -11 38 C -4 42 6 42 13 38 C 14 26 14 12 12 -2Z" fill="${SK}" stroke="${INK}" stroke-width="${LW}"/>
      <path d="M-11 36 C -4 39 6 39 13 36" stroke="${SH}" stroke-width="1.2" fill="none" opacity=".7"/>
      <path d="M-11.5 6 C -14 10 -17.5 20 -17 32 C -16.8 38 -16 41 -15 43 A 4.6 4.6 0 0 0 -6 44 C -8 37 -8.5 26 -7 18 C -8 12 -9.5 8 -11.5 6Z" stroke-linejoin="round" fill="${SK}" stroke="${INK}" stroke-width="1.8"/>
      <path d="M-11 -4 Q 0 2 11 -4" stroke="url(#gold)" stroke-width="5" fill="none"/>
      <path d="M-11 -10 Q 0 -4 11 -10" stroke="#b8201a" stroke-width="4" fill="none"/>
      <path d="M-11 -16 Q 0 -10 11 -16" stroke="url(#gold)" stroke-width="4" fill="none"/>
      <path d="M-11 -22 Q 0 -16 11 -22" stroke="url(#gold)" stroke-width="3.4" fill="none"/>
    </g>`;
  const anjaliHands = `<g>
      <path d="M0 166 C 12 170 19 192 20 216 C 21 238 18 254 0 268 C -18 254 -21 238 -20 216 C -19 192 -12 170 0 166Z" fill="${SK}" stroke="${INK}" stroke-width="${LW}"/>
      <path d="M0 170 L 0 264" stroke="${INK}" stroke-width="1.4"/>
      ${[188, 202, 216].map(yy => `<path d="M-14 ${yy} Q -7 ${yy + 3} 0 ${yy + 1} M14 ${yy} Q 7 ${yy + 3} 0 ${yy + 1}" stroke="${SH}" stroke-width="1.1" fill="none"/>`).join('')}
      <path d="M-16 236 Q -8 230 -2 242 M16 236 Q 8 230 2 242" stroke="${SH}" stroke-width="1.4" fill="none"/>
      ${[-1, 1].map(sx => `<g transform="scale(${sx},1)">
        <path d="M-12 258 Q -22 262 -26 270" stroke="url(#gold)" stroke-width="5" fill="none"/>
        <path d="M-15 264 Q -24 268 -28 276" stroke="#b8201a" stroke-width="4.5" fill="none"/>
        <path d="M-18 270 Q -27 274 -31 282" stroke="url(#gold)" stroke-width="4.5" fill="none"/></g>`).join('')}
    </g>`;

  // ---- costume shapes
  const skinBody = `M-16 116 L -18 150 C -34 160 -66 164 -90 172 C -100 178 -104 190 -100 204 L -74 268 C -62 290 -54 310 -54 330 L 54 330 C 54 310 62 290 74 268 L 100 204 C 104 190 100 178 90 172 C 66 164 34 160 18 150 L 16 116Z`;
  const blouse = `M-34 158 C -22 194 22 194 34 158 C 54 160 76 163 92 172 C 102 180 106 196 104 212 C 100 236 90 252 78 262 L 72 272 Q 0 284 -72 272 L -78 262 C -90 252 -100 236 -104 212 C -106 196 -102 180 -92 172 C -76 163 -54 160 -34 158Z`;
  const sleeveFill = (sx) => `<path transform="scale(${sx},1)" d="M-72 166 C -92 168 -110 180 -116 204 C -120 220 -120 236 -118 246 Q -100 254 -82 246 L -74 214 Z" fill="url(#tBlouse)"/>`;
  const sleeveLine = (sx) => `<g transform="scale(${sx},1)">
      <path d="M-92 172 C -106 180 -114 194 -116 210 C -118 224 -119 238 -118 246 Q -100 254 -82 246 L -78 232" fill="none" stroke="${INK}" stroke-width="${LW}"/>
      ${borderStroke('M-117 240 Q -100 248 -82 241', 6)}
      <path d="M-104 196 C -110 210 -112 224 -112 236" stroke="#0a4a2c" stroke-width="5" fill="none" opacity=".35"/></g>`;
  const skirt = `M-54 322 C -84 356 -104 400 -104 444 C -104 520 -96 600 -86 680 C -80 740 -84 820 -92 862 L -98 886 Q 0 898 98 886 L 92 862 C 84 820 80 740 86 680 C 96 600 104 520 104 444 C 104 400 84 356 54 322 Q 0 332 -54 322Z`;
  const pleats = [...Array(10)].map((_, i) => {
    const x0 = -4 + i * 4.2, x0b = x0 + 4.2, x1 = -62 + i * 12.6, x1b = x1 + 12.6;
    return `<path d="M${x0} 346 C ${x0 - 6} 520 ${x1 + 10} 700 ${x1} 880 L ${x1b} 880 C ${x1b + 10} 700 ${x0b - 6} 520 ${x0b} 346Z" fill="${i % 2 ? '#8e1210' : '#d63a2c'}" opacity="${i % 2 ? .45 : .28}"/>
      <path d="M${x0} 346 C ${x0 - 6} 520 ${x1 + 10} 700 ${x1} 880" stroke="#6a0b0a" stroke-width="1.3" fill="none" opacity=".6"/>`;
  }).join('') + [0, 1, 2].map(k => `<path d="M${100 - k * 4} ${452 + k * 30} C ${60 - k * 10} ${560 + k * 40} ${20 - k * 10} ${700 + k * 30} ${-6 - k * 8} ${860}" stroke="#6a0b0a" stroke-width="2.4" fill="none" opacity=".35"/><path d="M${96 - k * 4} ${462 + k * 30} C ${56 - k * 10} ${570 + k * 40} ${16 - k * 10} ${710 + k * 30} ${-10 - k * 8} ${864}" stroke="#ff6a50" stroke-width="1.4" fill="none" opacity=".25"/>`).join('');
  const pleatHem = [...Array(10)].map((_, i) => `<path d="M${-62 + i * 12.6} 870 l 6.3 14 l 6.3 -14" stroke="#0f6a3c" stroke-width="1.5" fill="none"/>`).join('');
  const palluFront = `M-62 342 C -36 300 8 232 42 162 C 62 162 84 166 98 176 C 106 196 104 232 94 262 C 82 292 72 318 66 342 Q 6 352 -62 342Z`;
  const palluHang = `M94 178 C 116 196 126 280 124 400 L 120 646 Q 106 654 92 650 C 98 520 100 400 98 290 C 97 240 96 200 94 178Z`;

  return `<g transform="translate(${x},${y}) scale(${s})">
    <g transform="scale(${o.slim ?? .88},1)">
    <!-- back layer: pallu hanging behind the left arm -->
    <path d="${palluHang}" fill="url(#tSaree)" stroke="${INK}" stroke-width="${LW}"/>
    <path d="${palluHang}" fill="url(#tButta)"/>
    ${borderStroke('M124 400 L 120 646', 9)}${borderStroke('M120 646 Q 106 654 92 650', 9)}
    <path d="M108 230 C 112 330 112 480 108 640" stroke="#7a0d0c" stroke-width="2" fill="none" opacity=".6"/>
    <!-- body skin -->
    <path d="${skinBody}" fill="${SK}" stroke="${INK}" stroke-width="${LW}"/>
    <path d="M-16 136 Q 0 150 16 136 L 16 120 L -16 120Z" fill="${SH}" opacity=".35"/>
    <path d="M-30 166 Q 0 174 30 166" stroke="${SH}" stroke-width="1.6" fill="none" opacity=".5"/>
    <!-- skirt -->
    <path d="${skirt}" fill="url(#tSaree)" stroke="${INK}" stroke-width="${LW}"/>
    <path d="${skirt}" fill="url(#tButta)"/>
    ${pleats}
    <path d="M-104 460 C -98 580 -90 660 -86 690 C -82 760 -86 820 -92 862" stroke="#6a0b0a" stroke-width="10" fill="none" opacity=".25"/>
    ${borderStroke('M12 340 C 8 520 -30 700 -60 872', 10)}
    <path d="M-94 864 Q 0 875 94 864 L 98 886 Q 0 898 -98 886Z" fill="url(#gold)" stroke="#0f6a3c" stroke-width="3"/>
    <path d="M-94 869 Q 0 880 94 869" stroke="#0f6a3c" stroke-width="2" fill="none"/>
    <path d="M-94 878 Q 0 889 94 878" stroke="#9a5a10" stroke-width="2.5" stroke-dasharray="3 5" fill="none"/>
    ${pleatHem}
    <!-- feet -->
    ${[-1, 1].map(sx => `<g transform="scale(${sx},1)">
      <path d="M-40 884 C -46 896 -42 906 -30 909 L -12 909 C -6 904 -8 892 -14 884Z" fill="${SK}" stroke="${INK}" stroke-width="${LW}"/>
      ${[-36, -30, -24, -18].map((tx, i) => `<ellipse cx="${tx}" cy="${906 - i * .4}" rx="2.6" ry="2" fill="#c8201a" opacity=".8"/>`).join('')}
      <path d="M-40 886 Q -26 891 -12 886" stroke="#d8d8e0" stroke-width="3" fill="none" stroke-dasharray="2 2"/></g>`).join('')}
    <!-- blouse body -->
    <path d="${blouse}" fill="url(#tBlouse)" stroke="${INK}" stroke-width="${LW}"/>
    ${borderStroke('M-34 158 C -22 194 22 194 34 158', 6)}
    ${borderStroke('M-72 270 Q 0 282 72 270', 5)}
    <path d="M-60 200 C -54 226 -54 248 -62 266" stroke="#0a4a2c" stroke-width="1.6" fill="none" opacity=".7"/>
    <!-- arms -->
    ${pose === 'anjali' ? `${A.arm(J.r.sh, J.r.el, J.r.wr, SK, SH, armW)}${A.arm(J.l.sh, J.l.el, J.l.wr, SK, SH, armW)}`
      : `${A.arm(J.r.sh, J.r.el, J.r.wr, SK, SH, armW)}${A.arm(J.l.sh, J.l.el, J.l.wr, SK, SH, armW)}`}
    <!-- sleeves over the arms (no seam: fill only, outer outline only) -->
    ${sleeveFill(1)}${sleeveFill(-1)}${sleeveLine(1)}${sleeveLine(-1)}
    <!-- pallu across the chest over the left shoulder -->
    <path d="${palluFront}" fill="url(#tSaree)" stroke="${INK}" stroke-width="${LW}"/>
    <path d="${palluFront}" fill="url(#tButta)"/>
    ${[18, 36, 54].map(d => `<path d="M${-62 + d} 344 C ${-36 + d} 304 ${8 + d * .7} 236 ${42 + d * .9} 166" stroke="#7a0d0c" stroke-width="1.8" fill="none" opacity=".55"/>`).join('')}
    ${borderStroke('M-62 342 C -36 300 8 232 42 162', 11)}
    <!-- waist belt -->
    <path d="M-60 324 Q 0 338 60 324 L 64 342 Q 0 356 -64 342Z" fill="url(#gold)" stroke="#8a5a12" stroke-width="1.4"/>
    <path d="M-60 333 Q 0 347 60 333" stroke="#8a5a12" stroke-width="1.2" stroke-dasharray="4 4" fill="none"/>
    <ellipse cx="0" cy="340" rx="14" ry="11" fill="url(#gold)" stroke="#8a5a12" stroke-width="1.4"/>
    <ellipse cx="0" cy="340" rx="6" ry="5" fill="#c8201a"/>
    <!-- necklaces -->
    <path d="M-20 150 Q 0 164 20 150" stroke="url(#gold)" stroke-width="7" fill="none"/>
    ${[-12, -4, 4, 12].map(xx => `<circle cx="${xx}" cy="${156 - Math.abs(xx) * .25}" r="2.4" fill="${Math.abs(xx) < 8 ? '#1f8a4a' : '#c8201a'}"/>`).join('')}
    <path d="M-28 156 C -24 196 -10 214 0 222 C 10 214 24 196 28 156" stroke="url(#gold)" stroke-width="2.6" fill="none"/>
    ${bez([-28, 156], [-24, 196], [-10, 214], [0, 222], 9).concat(bez([0, 222], [10, 214], [24, 196], [28, 156], 9)).map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r="2.2" fill="#f2c14e" stroke="#8a5a12" stroke-width=".5"/>`).join('')}
    <path d="M0 220 l 7 9 -7 11 -7 -11z" fill="url(#gold)" stroke="#8a5a12" stroke-width="1"/><circle cx="0" cy="230" r="2.6" fill="#c8201a"/>
    <!-- hands -->
    ${pose === 'anjali' ? anjaliHands : `${relaxedHand(-1)}${relaxedHand(1)}`}
    </g>
    <!-- head -->
    ${o.headSvg ?? tulasiHead(o)}
  </g>`;
}

// ---------------------------------------------------------------- VISHNU
function vishnuHead(o = {}) {
  const S = 'url(#vFace)', SH = '#4c5bab';
  const backHair = `<path d="M0 -4 C -40 -4 -60 18 -62 56 C -64 90 -60 112 -54 126 L 54 126 C 60 112 64 90 62 56 C 60 18 40 -4 0 -4Z" fill="#140d0a"/>`;
  const namam = `<path d="M-8 52 C -9 40 -7 32 -5 24 M8 52 C 9 40 7 32 5 24" stroke="#fffaf0" stroke-width="4.2" stroke-linecap="round" fill="none"/>
    <path d="M-8 52 Q 0 60 8 52" stroke="#fffaf0" stroke-width="4.2" fill="none" stroke-linecap="round"/>
    <path d="M0 54 L 0 26" stroke="#d1261c" stroke-width="3.4" stroke-linecap="round"/>`;
  const flowerEar = (sx) => `<g transform="translate(${sx * 54},88)">
    ${[...Array(8)].map((_, i) => `<ellipse transform="rotate(${i * 45})" cx="0" cy="-7" rx="3.6" ry="6.4" fill="#f7c22c" stroke="#a8700c" stroke-width=".8"/>`).join('')}
    <circle r="4" fill="#d1261c" stroke="#8a5a12" stroke-width=".8"/>
    <path d="M0 10 L 0 20" stroke="url(#gold)" stroke-width="2"/><circle cy="22" r="3" fill="url(#gold)"/></g>`;
  // broad layered mukuta, wider than the head (as in the sheet)
  const petalRow = (y, w, n, col) => [...Array(n)].map((_, i) => {
    const t = (i + .5) / n, cx = -w + t * 2 * w;
    return `<path d="M${cx} ${y - 13} C ${cx + 6} ${y - 9} ${cx + 6} ${y - 2} ${cx} ${y} C ${cx - 6} ${y - 2} ${cx - 6} ${y - 9} ${cx} ${y - 13}Z" fill="url(#gold)" stroke="#8a5a12" stroke-width=".9"/>
      <circle cx="${cx}" cy="${y - 6}" r="2" fill="${i % 2 ? col : '#d1261c'}"/>`;
  }).join('');
  const crown = `<g>
    ${[-1, 1].map(sx => `<g transform="scale(${sx},1) translate(56,18) scale(.62) translate(-56,-18)">
      <path d="M52 14 C 78 12 88 36 82 62 C 78 76 66 82 58 76 C 64 62 64 42 54 30Z" fill="url(#gold)" stroke="#8a5a12" stroke-width="1.2"/>
      <path d="M60 22 C 74 24 78 40 74 58" stroke="#d1261c" stroke-width="2" fill="none"/>
      <circle cx="70" cy="44" r="3.6" fill="#1f8a4a" stroke="#8a5a12" stroke-width=".6"/>
      ${[0, 1, 2].map(k => `<circle cx="${66 - k * 2}" cy="${80 + k * 6}" r="2.2" fill="#fff4d6"/>`).join('')}</g>`).join('')}
    <path d="M-60 18 C -66 -4 -60 -28 -48 -46 C -38 -60 -24 -70 -14 -80 L 14 -80 C 24 -70 38 -60 48 -46 C 60 -28 66 -4 60 18 Q 0 2 -60 18Z" fill="url(#goldV)" stroke="#8a5a12" stroke-width="1.6"/>
    <path d="M-60 18 C -66 -4 -60 -28 -48 -46 C -44 -28 -44 -4 -40 14Z" fill="#8a5a12" opacity=".22"/>
    <path d="M-63 -8 Q 0 -24 63 -8" stroke="#8a5a12" stroke-width="2" fill="none"/>
    <path d="M-52 -36 Q 0 -50 52 -36" stroke="#8a5a12" stroke-width="2" fill="none"/>
    <path d="M-36 -60 Q 0 -70 36 -60" stroke="#8a5a12" stroke-width="2" fill="none"/>
    ${petalRow(-10, 58, 11, '#1f8a4a')}${petalRow(-38, 48, 8, '#1f8a4a')}${petalRow(-62, 32, 5, '#1f8a4a')}
    <ellipse cx="0" cy="-24" rx="9" ry="7.5" fill="#d1261c" stroke="#8a5a12" stroke-width="1.2"/>
    <ellipse cx="0" cy="-50" rx="5" ry="4.5" fill="#1f8a4a" stroke="#8a5a12"/>
    <path d="M-62 38 Q 0 20 62 38 L 60 14 Q 0 -2 -60 14Z" fill="url(#gold)" stroke="#8a5a12" stroke-width="1.4"/>
    <path d="M-60 26 Q 0 9 60 26" stroke="#d1261c" stroke-width="2.4" stroke-dasharray="5 5" fill="none"/>
    ${[-40, -20, 0, 20, 40].map(xx => `<circle cx="${xx}" cy="${24 - (40 - Math.abs(xx)) * .18}" r="${xx === 0 ? 6 : 3.4}" fill="${xx === 0 ? '#d1261c' : (Math.abs(xx) === 20 ? '#1f8a4a' : '#fff4d6')}" stroke="#8a5a12" stroke-width=".8"/>`).join('')}
    <path d="M-14 -80 Q 0 -86 14 -80 L 9 -90 Q 0 -94 -9 -90Z" fill="url(#gold)" stroke="#8a5a12"/>
    <path d="M0 -90 C 10 -98 9 -112 0 -124 C -9 -112 -10 -98 0 -90Z" fill="url(#gold)" stroke="#8a5a12" stroke-width="1.2"/>
    <circle cx="0" cy="-105" r="3" fill="#d1261c"/>
  </g>`;
  return `<g>
    ${backHair}
    ${o.face
      ? F.faceP({ skin: S, shade: SH, rim: '#d8e4ff', blush: 0, ...o.face, id: 'v' + (o.id || '') + (o.eyes || ''), eyes: o.eyes || o.face.defaultEyes || 'open', mouth: o.mouth, smile: o.mouth ? o.mouth === 'smile' : o.face.smile, tears: o.tears, sad: o.sad, look: o.look })
      : faceV2({ id: 'v' + (o.id || ''), male: true, skin: S, shade: SH, eyes: o.eyes || 'lowered', mouth: o.mouth || 'soft', brows: o.brows, look: o.look, rim: '#d8e4ff', lip1: '#a84452', lip2: '#c25a66' })}
    <path d="M-50 30 C -46 18 -30 12 0 12 C 30 12 46 18 50 30 L 51 40 C 40 30 24 25 0 25 C -24 25 -40 30 -51 40Z" fill="#140d0a"/>
    ${namam}<g transform="translate(0,-14)">${crown}</g>${flowerEar(-1)}${flowerEar(1)}
  </g>`;
}

function vishnu(x, y, s = 1, o = {}) {
  const SK = 'url(#vSkin)', SH = '#4c5bab';
  const lowerJoin = o.pose === 'accept';
  const J = {
    bR: { sh: [-100, 204], el: [-188, 238], wr: [-184, 122] },
    bL: { sh: [100, 204], el: [188, 238], wr: [184, 122] },
    fR: lowerJoin ? { sh: [-116, 214], el: [-124, 380], wr: [-18, 300] } : { sh: [-116, 214], el: [-138, 378], wr: [-112, 300] },
    fL: lowerJoin ? { sh: [116, 214], el: [124, 380], wr: [18, 300] } : { sh: [116, 214], el: [146, 376], wr: [162, 492] },
  };
  const aw = [44, 42, 31, 32, 24];
  const curls = (sx) => [...Array(8)].map((_, i) => `<g transform="scale(${sx},1)"><path d="M${44 + i * 2.5} ${104 + i * 22} c 16 -4 30 6 28 20 c -2 10 -14 12 -20 6 c 6 -2 8 -8 4 -12 c -4 -4 -12 -2 -12 6 c -10 -2 -8 -16 0 -20z" fill="#140d0a" stroke="#000" stroke-width=".8"/><path d="M${50 + i * 2.5} ${110 + i * 22} c 8 -2 14 2 14 8" stroke="#4a3a30" stroke-width="1.2" fill="none"/></g>`).join('');
  const torso = 'M-22 158 C -60 168 -98 176 -120 196 C -132 210 -132 240 -126 268 C -114 316 -88 356 -72 412 L 72 412 C 88 356 114 316 126 268 C 132 240 132 210 120 196 C 98 176 60 168 22 158Z';
  const dhoti = 'M-76 402 C -104 440 -116 490 -116 540 C -116 620 -110 700 -96 760 C -88 800 -84 860 -84 900 L -90 936 Q -58 945 -22 936 L -16 900 C -12 840 -8 800 0 772 C 8 800 12 840 16 900 L 22 936 Q 58 945 90 936 L 84 900 C 84 860 88 800 96 760 C 110 700 116 620 116 540 C 116 490 104 440 76 402 Q 0 416 -76 402Z';
  const drape = [480, 550, 620, 690].map((yy, i) => `<path d="M${-108 + i} ${yy} Q -60 ${yy + 54 - i * 4} -6 ${yy + 22}" stroke="#a8680a" stroke-width="3" fill="none" opacity=".55"/><path d="M${-118 + i} ${yy + 6} Q -60 ${yy + 58 - i * 4} -6 ${yy + 28}" stroke="#ffe27a" stroke-width="2" fill="none" opacity=".5"/><path d="M${120 - i} ${yy} Q 60 ${yy + 54 - i * 4} 6 ${yy + 22}" stroke="#a8680a" stroke-width="3" fill="none" opacity=".55"/><path d="M${118 - i} ${yy + 6} Q 60 ${yy + 58 - i * 4} 6 ${yy + 28}" stroke="#ffe27a" stroke-width="2" fill="none" opacity=".35"/>`).join('');
  const vert = [-80, -60, -40, 40, 60, 80].map(xx => `<path d="M${xx * 1.2} 760 C ${xx * 1.05} 820 ${xx * .95} 870 ${xx} 928" stroke="#a8680a" stroke-width="2.2" fill="none" opacity=".6"/>`).join('') + [-1, 1].map(sx => [0, 1, 2, 3].map(k => `<path transform="scale(${sx},1)" d="M${-92 + k * 2} ${880 + k * 12} Q -58 ${890 + k * 12} ${-20 - k} ${880 + k * 12}" stroke="#a8680a" stroke-width="1.8" fill="none" opacity=".6"/>`).join('')).join('');
  const panel = `M-24 420 L 24 420 L 36 690 L -36 690Z`;
  const garland = (sx) => {
    const pts = bez([sx * 34, 168], [sx * 64, 340], [sx * 60, 560], [sx * 54, 740], 40);
    return pts.map(([gx, gy], i) => i % 3 === 2
      ? `<g transform="translate(${gx},${gy})">${[0, 72, 144, 216, 288].map(a => `<ellipse transform="rotate(${a})" cx="0" cy="-4" rx="2.6" ry="4" fill="#fffaf0" stroke="#cfc3a6" stroke-width=".5"/>`).join('')}<circle r="1.6" fill="#f2a01e"/></g>`
      : `<g transform="translate(${gx},${gy}) rotate(${i * 50}) scale(1.35)"><path d="M0 0 C 4 -5 12 -5 16 0 C 12 5 4 5 0 0Z" fill="${i % 2 ? '#2e8a4a' : '#3fa35a'}" stroke="#0e3d1f" stroke-width=".6"/><path d="M0 0 C -4 -5 -12 -5 -16 0 C -12 5 -4 5 0 0Z" fill="#2a7a42" stroke="#0e3d1f" stroke-width=".6"/></g>`).join('');
  };
  const shawlEnd = (sx) => `<g transform="scale(${sx},1)">
    <path d="M-96 186 C -126 196 -140 240 -142 300 L -146 560 Q -128 568 -110 562 C -110 470 -108 380 -104 300 Z" fill="url(#vShawl)" stroke="${INK}" stroke-width="${LW}"/>
    ${borderStroke('M-146 560 Q -128 568 -110 562', 7, '#1f6a3c')}
    ${borderStroke('M-142 300 L -146 556', 6, '#1f6a3c')}
    <path d="M-126 260 C -128 360 -128 460 -126 552" stroke="#6a120c" stroke-width="2" fill="none" opacity=".6"/></g>`;
  const disc = (cx, cy) => `<g transform="translate(${cx},${cy})">
    <ellipse rx="70" ry="40" fill="url(#lampGlow)"/>
    <ellipse rx="38" ry="10" fill="url(#gold)" stroke="#8a5a12" stroke-width="1.4"/>
    ${[...Array(18)].map((_, i) => { const a = i / 18 * Math.PI * 2; return `<path d="M${Math.cos(a) * 38} ${Math.sin(a) * 10} l ${Math.cos(a) * 9} ${Math.sin(a) * 2.4}" stroke="#d99a20" stroke-width="3"/>`; }).join('')}
    <ellipse rx="26" ry="6.5" fill="none" stroke="#8a5a12" stroke-width="1.2"/>
    <ellipse rx="7" ry="2.4" fill="#d1261c"/>
    <path d="M0 2 L 0 30" stroke="url(#gold)" stroke-width="2.4"/></g>`;
  const conch = (cx, cy) => `<g transform="translate(${cx},${cy}) rotate(12)">
    <path d="M0 -40 C 18 -34 24 -10 18 14 C 14 26 -14 26 -18 14 C -24 -10 -18 -34 0 -40Z" fill="#fffaf0" stroke="#8a5a12" stroke-width="1.6"/>
    <path d="M-12 -20 Q 0 -8 14 -22 M-15 0 Q 0 10 16 -2 M-12 14 Q 0 22 12 12" fill="none" stroke="#d8c8a8" stroke-width="2"/>
    <path d="M0 -40 C 6 -50 4 -58 0 -62 C -4 -58 -6 -50 0 -40Z" fill="url(#gold)" stroke="#8a5a12"/>
    <path d="M-8 24 Q 0 34 8 24" fill="url(#gold)" stroke="#8a5a12"/></g>`;
  const handS = .62;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <g transform="scale(${o.slim ?? .88},1)">
    <!-- hair behind shoulders -->
    ${curls(1)}${curls(-1)}
    <!-- shawl ends hang behind -->
    ${shawlEnd(1)}${shawlEnd(-1)}
    <!-- back arms + attributes -->
    ${A.arm(J.bR.sh, J.bR.el, J.bR.wr, SK, SH, [40, 38, 28, 28, 22])}${A.bandOn(J.bR.sh, J.bR.el, .45, 40)}
    ${A.arm(J.bL.sh, J.bL.el, J.bL.wr, SK, SH, [40, 38, 28, 28, 22])}${A.bandOn(J.bL.sh, J.bL.el, .45, 40)}
    <g transform="translate(${J.bR.wr[0]},${J.bR.wr[1]}) scale(${handS})">${A.holdingHand(SK, SH, -1, true)}</g>
    ${disc(J.bR.wr[0] + 11.8, J.bR.wr[1] - 75)}
    ${conch(J.bL.wr[0] + 2, J.bL.wr[1] - 60)}
    <g transform="translate(${J.bL.wr[0]},${J.bL.wr[1]}) scale(${handS})">${A.holdingHand(SK, SH, 1, false)}</g>
    <!-- neck + torso -->
    <path d="M-20 120 L -22 162 L 22 162 L 20 120Z" fill="${SK}" stroke="${INK}" stroke-width="${LW}"/>
    <path d="M-20 138 Q 0 152 20 138 L 20 124 L -20 124Z" fill="${SH}" opacity=".35"/>
    <path d="${torso}" fill="url(#vTorso)" stroke="${INK}" stroke-width="${LW}"/>
    <path d="M-120 196 C -132 210 -132 240 -126 268 C -114 316 -88 356 -72 412 C -90 360 -112 310 -118 262 C -120 236 -120 214 -112 202Z" fill="${SH}" opacity=".4"/>
    <path d="M-86 270 Q -48 288 -12 278 M86 270 Q 48 288 12 278" stroke="${SH}" stroke-width="1.8" fill="none" opacity=".5"/>
    <ellipse cx="-50" cy="236" rx="34" ry="20" fill="#c2cff8" opacity=".18"/>
    <path d="M0 372 Q 4 379 0 386" stroke="${SH}" stroke-width="2.4" fill="none"/>
    <!-- shawl over the shoulders (front edges) -->
    ${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M-24 162 C -60 170 -96 178 -114 192 C -120 200 -122 210 -120 222 C -100 206 -60 192 -30 184Z" fill="url(#vShawl)" stroke="${INK}" stroke-width="${LW}"/>
      <g transform="scale(${sx},1)">${borderStroke('M-30 184 C -60 192 -100 206 -120 222', 5, '#1f6a3c')}</g>`).join('')}
    <!-- dhoti -->
    <path d="${dhoti}" fill="url(#vDhoti)" stroke="${INK}" stroke-width="${LW}"/>
    ${drape}${vert}
    <path d="${panel}" fill="url(#vDhoti)" stroke="${INK}" stroke-width="1.6"/>
    ${[-16, -8, 0, 8, 16].map(px => `<path d="M${px} 424 L ${px * 1.5} 686" stroke="#b9780c" stroke-width="1.6"/>`).join('')}
    <path d="M-36 690 l 9 12 l 9 -12 l 9 12 l 9 -12 l 9 12 l 9 -12 l 9 12 l 9 -12" stroke="#c0281c" stroke-width="5" fill="none"/>
    ${borderStroke('M-92 924 Q -58 933 -22 924 M22 924 Q 58 933 92 924', 7, '#c0281c')}
    <!-- waist sash + belt -->
    <path d="M-76 396 Q 0 412 76 396 L 80 424 Q 0 440 -80 424Z" fill="#c0281c" stroke="${INK}" stroke-width="1.6"/>
    ${borderStroke('M-76 400 Q 0 416 76 400', 5, '#1f6a3c')}${borderStroke('M-80 420 Q 0 436 80 420', 5, '#1f6a3c')}
    <ellipse cx="0" cy="416" rx="16" ry="13" fill="url(#gold)" stroke="#8a5a12" stroke-width="1.4"/><ellipse cx="0" cy="416" rx="7" ry="6" fill="#d1261c"/>
    <!-- feet -->
    ${[-1, 1].map(sx => `<g transform="scale(${sx},1)">
      <path d="M-74 934 C -82 946 -78 958 -64 961 L -40 961 C -34 955 -36 944 -42 934Z" fill="${SK}" stroke="${INK}" stroke-width="${LW}"/>
      <path d="M-74 934 Q -58 940 -42 934" stroke="url(#gold)" stroke-width="5" fill="none"/></g>`).join('')}
    <!-- necklaces: choker, mid, long with Kaustubha -->
    <path d="M-22 160 Q 0 176 22 160" stroke="url(#gold)" stroke-width="8" fill="none"/>
    ${[-14, -5, 5, 14].map(xx => `<circle cx="${xx}" cy="${167 - Math.abs(xx) * .3}" r="2.6" fill="${Math.abs(xx) < 8 ? '#d1261c' : '#1f8a4a'}"/>`).join('')}
    <path d="M-40 168 C -34 206 -14 226 0 232 C 14 226 34 206 40 168" stroke="url(#gold)" stroke-width="6" fill="none"/>
    <path d="M0 230 l 9 10 -9 14 -9 -14z" fill="url(#gold)" stroke="#8a5a12" stroke-width="1"/><circle cx="0" cy="242" r="3.2" fill="#d1261c"/>
    <path d="M-52 176 C -46 240 -20 286 0 298 C 20 286 46 240 52 176" stroke="url(#gold)" stroke-width="2.6" fill="none"/>
    ${bez([-52, 176], [-46, 240], [-20, 286], [0, 298], 11).concat(bez([0, 298], [20, 286], [46, 240], [52, 176], 11)).map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r="2.4" fill="#f2c14e" stroke="#8a5a12" stroke-width=".5"/>`).join('')}
    <path d="M0 296 C 12 298 16 310 12 318 C 8 324 -8 324 -12 318 C -16 310 -12 298 0 296Z" fill="url(#gold)" stroke="#8a5a12" stroke-width="1.2"/>
    <ellipse cx="0" cy="310" rx="6" ry="7" fill="#d1261c"/>
    <!-- sacred thread -->
    <path d="M92 190 C 50 260 -20 340 -84 410" stroke="#fffaf0" stroke-width="2.6" fill="none"/>
    <!-- vanamala -->
    ${garland(-1)}${garland(1)}
    <!-- front arms -->
    ${A.arm(J.fR.sh, J.fR.el, J.fR.wr, SK, SH, aw)}${A.bandOn(J.fR.sh, J.fR.el, .28, 44)}
    ${A.arm(J.fL.sh, J.fL.el, J.fL.wr, SK, SH, aw)}${A.bandOn(J.fL.sh, J.fL.el, .28, 44)}
    ${lowerJoin
      ? `<g transform="translate(0,300) scale(.9)"><path d="M0 -92 C 10 -86 17 -64 18 -38 C 19 -16 16 2 0 14 C -16 2 -19 -16 -18 -38 C -17 -64 -10 -86 0 -92Z" fill="${SK}" stroke="${INK}" stroke-width="${LW}"/><path d="M0 -90 L 0 12" stroke="${INK}" stroke-width="1.4"/><path d="M-20 10 Q 0 20 20 10" stroke="url(#gold)" stroke-width="6" fill="none"/></g>`
      : `<g transform="translate(${J.fR.wr[0]},${J.fR.wr[1]}) rotate(-6) scale(${handS + .04})">${A.openPalm(SK, SH, 1)}</g>
         <g transform="translate(${J.fL.wr[0]},${J.fL.wr[1]}) rotate(${180 - 10}) scale(${handS + .04})">${A.openPalm(SK, SH, 1)}</g>`}
    </g>
    <!-- head -->
    ${vishnuHead({ face: F.VISHNU_FACE, ...o })}
  </g>`;
}

module.exports = { defs2, tulasi, tulasiHead, vishnu, vishnuHead, faceV2, borderStroke };
