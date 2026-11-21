// Parametric face system for Tulasi — lets us offer several distinct face designs.
// Origin = top of skull, x=0 centre line. Head height ~130.
const INK = '#3b1c0e';

function faceP(p) {
  const W = p.W, chin = p.chin, ck = p.cheek, jk = p.jaw;
  const skin = p.skin || 'url(#tFace)', shade = p.shade || '#b9774a';
  const facePath = `M0 0 C ${W * .6} 0 ${W} 18 ${W} 50 C ${W} 70 ${W * ck + 2} 84 ${W * ck} 94 C ${W * ck - 3} 106 ${W * jk + 8} 116 ${W * jk} ${chin - 10}
    C ${W * jk * .6} ${chin - 2} ${W * .14} ${chin} 0 ${chin} C ${-W * .14} ${chin} ${-W * jk * .6} ${chin - 2} ${-W * jk} ${chin - 10}
    C ${-W * jk - 8} 116 ${-W * ck + 3} 106 ${-W * ck} 94 C ${-W * ck - 2} 84 ${-W} 70 ${-W} 50 C ${-W} 18 ${-W * .6} 0 0 0Z`;

  // ---- eyes
  const { ex, ey, ew, eh, tilt, irisK, flick } = p.eye;
  const eye = (sx) => {
    const ix0 = ex - ew / 2, ox = ex + ew / 2, oy = ey - tilt;
    if (p.eyesClosed || p.eyes === 'closed') {
      return `<g transform="scale(${sx},1)">
        <path d="M${ix0} ${ey + 1} C ${ix0 + ew * .3} ${ey + eh * .55} ${ox - ew * .3} ${ey + eh * .55} ${ox} ${oy}" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        ${[.35, .5, .65, .8].map(t => `<path d="M${ix0 + ew * t} ${ey + eh * .42} l ${t * 2 - .6} ${3.5}" stroke="${INK}" stroke-width="1.2"/>`).join('')}</g>`;
    }
    const mode = p.eyes || 'open';
    const ehT = eh * ({ lowered: .36, wide: 1.22, angry: 1.02, open: 1 }[mode] ?? 1) * (p.mouth === 'smile' && mode === 'open' ? .82 : 1);
    const shape = `M${ix0} ${ey + 1} C ${ix0 + ew * .22} ${ey - ehT} ${ox - ew * .28} ${ey - ehT - 1} ${ox} ${oy} C ${ox - ew * .22} ${ey + eh * .55} ${ix0 + ew * .25} ${ey + eh * .6} ${ix0} ${ey + 1}Z`;
    const ir = eh * irisK * (mode === 'wide' ? .82 : 1), icx = ex + 1 + (p.look || 0) * sx, icy = ey - ehT * .12 + (mode === 'lowered' ? eh * .34 : 0), cid = `fp${p.id}${sx > 0 ? 'r' : 'l'}`;
    const lashes = p.lashes ? [.7, .84, .96].map((t, i) => {
      const lx = ix0 + ew * t, ly = ey - ehT * (1 - (t - .5) * 1.2) + 1;
      return `<path d="M${lx} ${ly} q ${1 + i * .6} ${-1.6 - i * .3} ${2.2 + i * .8} ${-2.2 - i * .5}" stroke="${INK}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    }).join('') : '';
    return `<g transform="scale(${sx},1)">
      <clipPath id="${cid}"><path d="${shape}"/></clipPath>
      <path d="${shape}" fill="#fbf4ec"/>
      <g clip-path="url(#${cid})">
        <circle cx="${icx}" cy="${icy}" r="${ir}" fill="${p.irisCol || '#6a3a1a'}"/>
        <circle cx="${icx}" cy="${icy}" r="${ir * .78}" fill="#3e200e"/>
        <circle cx="${icx}" cy="${icy}" r="${ir * .42}" fill="#120804"/>
        <circle cx="${icx + ir * .35}" cy="${icy - ir * .38}" r="${ir * .26}" fill="#fff"/>
        <circle cx="${icx - ir * .35}" cy="${icy + ir * .35}" r="${ir * .12}" fill="#fff" opacity=".8"/>
        <path d="M${ix0} ${ey - ehT - 6} L ${ox + 4} ${ey - ehT - 6} L ${ox + 4} ${ey - ehT * .55} C ${ex + ew * .2} ${ey - ehT * .9} ${ex - ew * .2} ${ey - ehT * .9} ${ix0} ${ey - ehT * .55}Z" fill="${shade}" opacity=".3"/>
      </g>
      <path d="M${ix0 - .5} ${ey + 1.5} C ${ix0 + ew * .22} ${ey - ehT - .5} ${ox - ew * .28} ${ey - ehT - 1.5} ${ox} ${oy} l ${flick} ${-flick * .45}" stroke="${INK}" stroke-width="${p.liner || 2.8}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${ix0 + 2} ${ey + 2.5} C ${ix0 + ew * .3} ${ey + eh * .65} ${ox - ew * .25} ${ey + eh * .6} ${ox - 1} ${oy + 1.5}" stroke="${INK}" stroke-width="${p.lowerLine || 1}" fill="none" opacity=".75"/>
      ${p.crease ? `<path d="M${ix0 + 2} ${ey - ehT * .7} C ${ix0 + ew * .3} ${ey - ehT * 1.55} ${ox - ew * .3} ${ey - ehT * 1.6} ${ox + 1} ${oy - eh * .7}" stroke="${shade}" stroke-width="1.4" fill="none" opacity=".75"/>` : ''}
      ${lashes}
    </g>`;
  };

  // ---- brows
  const b0 = p.brow, em = p.eyes || 'open';
  const b = { ...b0, y: b0.y + (em === 'wide' ? -4 : em === 'lowered' || em === 'closed' ? 1 : 0), arch: b0.arch + (em === 'wide' ? 2 : 0) };
  const angry = em === 'angry', sad = !!p.sad;
  const brow = (sx) => sad ? `<path transform="scale(${sx},1)" d="M${b.x0} ${b.y - 3} C ${b.x0 + 10} ${b.y - 6} ${b.x1 - 10} ${b.y - 2} ${b.x1} ${b.y + 4} C ${b.x1 - 10} ${b.y + 1} ${b.x0 + 10} ${b.y - 3.6} ${b.x0} ${b.y - 1}Z" fill="#24160e"/>` : angry ? `<path transform="scale(${sx},1)" d="M${b.x0} ${b.y + 7} C ${b.x0 + 10} ${b.y + 1} ${b.x1 - 10} ${b.y - 4} ${b.x1} ${b.y - 1} C ${b.x1 - 10} ${b.y - 4 + b.t} ${b.x0 + 10} ${b.y + 1 + b.t + 1} ${b.x0} ${b.y + 7 + b.t + .5}Z" fill="#24160e"/>` : `<path transform="scale(${sx},1)" d="M${b.x0} ${b.y + 2} C ${b.x0 + 8} ${b.y - b.arch} ${b.x1 - 10} ${b.y - b.arch - 2} ${b.x1} ${b.y + 3} C ${b.x1 - 10} ${b.y - b.arch + b.t} ${b.x0 + 8} ${b.y - b.arch + b.t + 1} ${b.x0} ${b.y + 2 + b.t}Z" fill="#24160e"/>`;

  // ---- nose
  const ny = p.noseY;
  const noses = {
    mural: `<path d="M-2 ${ey + 2} C -3 ${ey + 14} -5 ${ny - 8} -6 ${ny - 2}" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M-7 ${ny - 1} C -5 ${ny + 3} -1 ${ny + 3} 1 ${ny + 1.5} C 3 ${ny + 3} 6 ${ny + 2.5} 7 ${ny - 1}" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
    soft: `<path d="M-3 ${ny - 16} C -4 ${ny - 10} -5 ${ny - 5} -5.5 ${ny - 2}" stroke="${shade}" stroke-width="2.2" fill="none" opacity=".45" stroke-linecap="round"/>
      <path d="M-6.5 ${ny} C -4.5 ${ny + 3} -1.5 ${ny + 3} 0 ${ny + 2} C 1.5 ${ny + 3} 4.5 ${ny + 3} 6.5 ${ny}" stroke="${INK}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M-8 ${ny - 2} C -9.5 ${ny} -8.5 ${ny + 2} -6.5 ${ny + 2.5} M8 ${ny - 2} C 9.5 ${ny} 8.5 ${ny + 2} 6.5 ${ny + 2.5}" stroke="${shade}" stroke-width="1.3" fill="none"/>
      <ellipse cx="1" cy="${ny - 3}" rx="3" ry="2" fill="#fff" opacity=".28"/>`,
    button: `<path d="M-5 ${ny} C -3.5 ${ny + 2.5} -1 ${ny + 2.5} 0 ${ny + 1.6} C 1 ${ny + 2.5} 3.5 ${ny + 2.5} 5 ${ny}" stroke="${INK}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="0" cy="${ny - 3}" rx="4.5" ry="3.5" fill="${shade}" opacity=".18"/><ellipse cx="1" cy="${ny - 4}" rx="2" ry="1.4" fill="#fff" opacity=".3"/>`,
    defined: `<path d="M-3 ${ey + 4} C -4 ${ey + 14} -6 ${ny - 10} -7 ${ny - 3}" stroke="${shade}" stroke-width="2.4" fill="none" opacity=".5" stroke-linecap="round"/>
      <path d="M-7 ${ny} C -5 ${ny + 3.5} -1.5 ${ny + 3.5} 0 ${ny + 2.2} C 1.5 ${ny + 3.5} 5 ${ny + 3.5} 7 ${ny}" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M-9 ${ny - 3} C -11 ${ny} -9.5 ${ny + 2.5} -7 ${ny + 3} M9 ${ny - 3} C 11 ${ny} 9.5 ${ny + 2.5} 7 ${ny + 3}" stroke="${INK}" stroke-width="1.2" fill="none" opacity=".8"/>
      <ellipse cx="1.5" cy="${ny - 4}" rx="3" ry="2.2" fill="#fff" opacity=".3"/>`,
  };

  // ---- lips
  const L = p.lips, my = p.mouthY, lw = L.w, up = L.up, lo = L.lo, sm = p.smile && p.mouth !== 'soft' ? 3.6 : 0;
  const openMouth = `<path d="M${-lw * .9} ${my - 1} C ${-lw * .5} ${my - 4} ${lw * .5} ${my - 4} ${lw * .9} ${my - 1} C ${lw * .7} ${my + 9} ${-lw * .7} ${my + 9} ${-lw * .9} ${my - 1}Z" fill="#5a1410"/>
    <path d="M${-lw * .6} ${my - 1.6} C ${-lw * .3} ${my - 2.6} ${lw * .3} ${my - 2.6} ${lw * .6} ${my - 1.6} L ${lw * .55} ${my + .6} L ${-lw * .55} ${my + .6}Z" fill="#fff6ee"/>
    <path d="M${-lw * .9} ${my - 1} C ${-lw * .5} ${my - 4.6} ${-lw * .15} ${my - 3.8} 0 ${my - 3} C ${lw * .15} ${my - 3.8} ${lw * .5} ${my - 4.6} ${lw * .9} ${my - 1}" stroke="${L.c1}" stroke-width="2.6" fill="none"/>
    <path d="M${-lw * .8} ${my + 1.5} C ${-lw * .5} ${my + 10} ${lw * .5} ${my + 10} ${lw * .8} ${my + 1.5}" stroke="${L.c2}" stroke-width="3" fill="none"/>`;
  const tears = p.tears ? `<path d="M${ex + 4} ${ey + eh * .7} C ${ex + 2} ${ey + 14} ${ex + 4} ${ey + 22} ${ex + 5} ${ey + 28}" stroke="#dff2ff" stroke-width="2.4" fill="none" opacity=".85"/><circle cx="${ex + 5}" cy="${ey + 29}" r="2.5" fill="#e8f6ff" opacity=".95"/>` : '';
  const lips = p.mouth === 'open' ? openMouth : `<path d="M${-lw} ${my - sm * .4} C ${-lw * .55} ${my - up} ${-lw * .2} ${my - up * .95} 0 ${my - up * .55} C ${lw * .2} ${my - up * .95} ${lw * .55} ${my - up} ${lw} ${my - sm * .4} C ${lw * .5} ${my + 1.2 + sm * .4} ${-lw * .5} ${my + 1.2 + sm * .4} ${-lw} ${my - sm * .4}Z" fill="${L.c1}"/>
    <path d="M${-lw + 1} ${my} C ${-lw * .55} ${my + lo + sm * .5} ${lw * .55} ${my + lo + sm * .5} ${lw - 1} ${my} C ${lw * .4} ${my + 1.8} ${-lw * .4} ${my + 1.8} ${-lw + 1} ${my}Z" fill="${L.c2}"/>
    <path d="M${-lw} ${my - sm * .4} C ${-lw * .45} ${my + 1.8 + sm * .5} ${lw * .45} ${my + 1.8 + sm * .5} ${lw} ${my - sm * .4}" stroke="${INK}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M${-lw * .35} ${my + lo * .55} Q 0 ${my + lo * .7} ${lw * .35} ${my + lo * .55}" stroke="#fff" stroke-width="1.4" opacity=".35" fill="none"/>
    ${sm ? `<path d="M${-lw - 2.5} ${my - 2} q 1.4 1.6 2.4 1.6 M${lw + 2.5} ${my - 2} q -1.4 1.6 -2.4 1.6" stroke="${shade}" stroke-width="1.2" fill="none"/>` : ''}`;

  return `<g>
    <path d="M${-W - 1} 54 C ${-W - 11} 48 ${-W - 13} 74 ${-W - 2} 84Z M${W + 1} 54 C ${W + 11} 48 ${W + 13} 74 ${W + 2} 84Z" fill="${skin}" stroke="${INK}" stroke-width="2"/>
    <path d="${facePath}" fill="${skin}" stroke="${INK}" stroke-width="2.1"/>
    <path d="M${-W} 50 C ${-W} 70 ${-W * ck - 2} 84 ${-W * ck} 94 C ${-W * ck + 3} 106 ${-W * jk - 8} 116 ${-W * jk} ${chin - 10} C ${-W * .7} ${chin - 30} ${-W * .9} 80 ${-W * .9} 50Z" fill="${shade}" opacity=".25"/>
    ${p.cheekbone ? `<path d="M${-W * .92} 78 C ${-W * .7} 86 ${-W * .5} 90 ${-W * .35} 92" stroke="${shade}" stroke-width="5" opacity=".18" fill="none" filter="url(#sBlur)"/>` : ''}
    <ellipse cx="${-W * .58}" cy="${p.blushY || 88}" rx="${W * .22}" ry="${W * .13}" fill="#ec7f6a" opacity="${p.blush ?? .22}" filter="url(#sBlur)"/>
    <ellipse cx="${W * .58}" cy="${p.blushY || 88}" rx="${W * .22}" ry="${W * .13}" fill="#ec7f6a" opacity="${p.blush ?? .22}" filter="url(#sBlur)"/>
    <path d="M${W * .2} 6 C ${W * .7} 12 ${W * .98} 34 ${W * .98} 58" fill="none" stroke="#ffe2bd" stroke-width="3" opacity=".45" filter="url(#sBlur)"/>
    ${brow(1)}${brow(-1)}${eye(1)}${eye(-1)}
    ${noses[p.nose]}
    ${lips}
    ${tears}
  </g>`;
}

// Hair + ornaments around the face (Tulasi), parametrised by style
function tulasiHair(p, layer) {
  const W = p.W;
  if (layer === 'back') {
    const vol = p.hairVol || 0;
    return `<path d="M0 ${-10 - vol} C ${-W - 8 - vol * .5} ${-10 - vol} ${-W - 9 - vol * .5} 30 ${-W - 8 - vol * .5} 56 C ${-W - 7 - vol * .5} 76 ${-W - 6} 88 ${-W + 2} 92 L ${W - 2} 92 C ${W + 6} 88 ${W + 7 + vol * .5} 76 ${W + 8 + vol * .5} 56 C ${W + 9 + vol * .5} 30 ${W + 8 + vol * .5} ${-10 - vol} 0 ${-10 - vol}Z" fill="#17100c"/>`;
  }
  const vol = p.hairVol || 0, side = p.hairSide || 0;
  // front: centre parting, hair sweeping down over the temples and the top of the ears
  const half = (sx) => `<path transform="scale(${sx},1)" d="M0 ${-12 - vol} C ${-W * .7 - vol} ${-12 - vol} ${-W - 6 - vol * .5} 8 ${-W - 5 - vol * .5} 46 C ${-W - 5 - vol * .4} 60 ${-W - 2 - side * .5} 72 ${-W + 2} 80 C ${-W + 2 - side} 66 ${-W + 4} 52 ${-W + 10} 40 C ${-W * .6} 22 ${-W * .3} 13 0 11Z" fill="#17100c" stroke="#080503" stroke-width="1.2"/>`;
  const strands = (sx) => [0, 1, 2, 3].map(k => `<path transform="scale(${sx},1)" d="M${-4 - k * 5} ${-8 - vol + k * 2} C ${-W * .6 - k * 3} ${-2 + k * 3} ${-W - 4 - vol} ${20 + k * 6} ${-W - 3 - vol + k * 2} ${46 + k * 6}" stroke="${p.wavy ? '#4a3a32' : '#3a2a22'}" stroke-width="1.3" fill="none" opacity=".75" ${p.wavy ? 'stroke-dasharray="14 3"' : ''}/>`).join('');
  return `${half(1)}${half(-1)}${strands(1)}${strands(-1)}
    <path d="M-1.4 ${-11 - vol} L 1.4 ${-11 - vol} L 1.1 11 L -1.1 11Z" fill="#c8201a"/>`;
}

// LOCKED: Tulasi's face = option B6 "Youthful, innocent" (chosen by the channel owner).
const TULASI_FACE = { W: 47, chin: 124, cheek: 1.02, jaw: .6, noseY: 91, mouthY: 104, irisCol: '#8a4a20',
  eye: { ex: 21.5, ey: 66, ew: 28, eh: 13.5, tilt: .5, irisK: .88, flick: 2 }, lashes: true, crease: true, liner: 2.4,
  brow: { x0: 7, x1: 34, y: 48, arch: 4, t: 2.2 }, nose: 'button', blush: .34, blushY: 90,
  lips: { w: 8, up: 3.4, lo: 5.4, c1: '#cc4e4a', c2: '#e47068' }, smile: true, hairVol: 6, hairSide: 4, wavy: true };

module.exports = { faceP, tulasiHair, TULASI_FACE };
