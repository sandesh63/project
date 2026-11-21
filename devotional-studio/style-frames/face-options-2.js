// Face options for Jalandhar (asura king) and Mahadev, in the same parametric face system as Tulasi/Vishnu.
const A = require('../engine/art.js');
const C = require('../engine/characters.js');
const F = require('../engine/faces.js');

const INK = '#3b1c0e';
const radial = (id, l, b, s) => `<radialGradient id="${id}" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="${l}"/><stop offset=".62" stop-color="${b}"/><stop offset="1" stop-color="${s}"/></radialGradient>
  <linearGradient id="${id}L" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="${l}"/><stop offset=".45" stop-color="${b}"/><stop offset="1" stop-color="${s}"/></linearGradient>`;

const SKINS = {
  bronze: ['#c99068', '#a0623e', '#6e3a20'],
  ocean: ['#7fb8b0', '#4e8a86', '#2a5654'],
  warm: ['#f0c39a', '#d89a6c', '#a86a42'],
  charcoal: ['#7a7088', '#544a62', '#2e2638'],
  kathi: ['#6fbf6a', '#3f9446', '#1f5a28'],
  ash: ['#c8d6ec', '#9fb4d8', '#6c84b4'],
  shivaBlue: ['#9fb8ee', '#7090d8', '#4a62aa'],
};
const skinDefs = Object.entries(SKINS).map(([k, v]) => radial('sk_' + k, ...v)).join('');

// ---------- facial hair / extras drawn on top of the face
const mustache = (style, my, col = '#1a100a') => ({
  thin: `<path d="M-2 ${my - 7} C -8 ${my - 10} -16 ${my - 9} -20 ${my - 4} C -15 ${my - 6} -8 ${my - 5} -2 ${my - 5}Z M2 ${my - 7} C 8 ${my - 10} 16 ${my - 9} 20 ${my - 4} C 15 ${my - 6} 8 ${my - 5} 2 ${my - 5}Z" fill="${col}"/>`,
  curl: `<path d="M-1 ${my - 7} C -10 ${my - 12} -20 ${my - 10} -24 ${my - 4} C -27 ${my} -24 ${my - 8} -30 ${my - 9} C -28 ${my - 3} -22 ${my - 4} -18 ${my - 5} C -12 ${my - 6} -6 ${my - 5} -1 ${my - 5}Z M1 ${my - 7} C 10 ${my - 12} 20 ${my - 10} 24 ${my - 4} C 27 ${my} 24 ${my - 8} 30 ${my - 9} C 28 ${my - 3} 22 ${my - 4} 18 ${my - 5} C 12 ${my - 6} 6 ${my - 5} 1 ${my - 5}Z" fill="${col}"/>`,
  thick: `<path d="M0 ${my - 8} C -10 ${my - 13} -22 ${my - 11} -26 ${my - 1} C -18 ${my - 6} -9 ${my - 5} 0 ${my - 5} C 9 ${my - 5} 18 ${my - 6} 26 ${my - 1} C 22 ${my - 11} 10 ${my - 13} 0 ${my - 8}Z" fill="${col}"/>`,
  red: `<path d="M0 ${my - 8} C -10 ${my - 13} -22 ${my - 11} -28 ${my - 2} C -18 ${my - 6} -9 ${my - 5} 0 ${my - 5} C 9 ${my - 5} 18 ${my - 6} 28 ${my - 2} C 22 ${my - 11} 10 ${my - 13} 0 ${my - 8}Z" fill="#c8201a"/>`,
}[style] || '');
const beard = (my, chin, col = '#1a100a') => `<path d="M-30 ${my - 2} C -28 ${chin + 6} 28 ${chin + 6} 30 ${my - 2} C 22 ${chin - 6} -22 ${chin - 6} -30 ${my - 2}Z" fill="${col}" opacity=".92"/>`;
const fangs = (my) => `<path d="M-6 ${my + 1} l 2.2 6 l 2.2 -6Z M2 ${my + 1} l 2.2 6 l 2.2 -6Z" fill="#fffaf0" stroke="${INK}" stroke-width=".6"/>`;

// ---------- JALANDHAR
const J_OPTIONS = {
  J1: { name: 'Proud Asura King', skin: 'bronze', W: 49, chin: 136, cheek: .98, jaw: .62, noseY: 97, mouthY: 114,
    eye: { ex: 21, ey: 66, ew: 27, eh: 9, tilt: 4, irisK: .82, flick: 4 }, liner: 3, crease: true, eyes: 'angry', irisCol: '#7a2a10',
    brow: { x0: 5, x1: 38, y: 51, arch: 3, t: 4.2 }, nose: 'defined', lips: { w: 11, up: 3.6, lo: 5.4, c1: '#7a2a24', c2: '#94403a' }, smile: false, mus: 'curl', crown: 'spikes' },
  J2: { name: 'Ocean-born (born from the sea)', skin: 'ocean', W: 49, chin: 134, cheek: 1.0, jaw: .6, noseY: 96, mouthY: 113,
    eye: { ex: 21, ey: 66, ew: 27, eh: 10, tilt: 3, irisK: .86, flick: 4 }, liner: 2.8, crease: true, eyes: 'open', irisCol: '#1fb8c8',
    brow: { x0: 5, x1: 37, y: 51, arch: 3.5, t: 3.8 }, nose: 'soft', lips: { w: 11, up: 3.8, lo: 5.6, c1: '#5a2a3a', c2: '#74404e' }, smile: false, mus: 'thin', crown: 'waves' },
  J3: { name: 'Handsome Deceiver', skin: 'warm', W: 48, chin: 134, cheek: .98, jaw: .55, noseY: 96, mouthY: 113,
    eye: { ex: 21, ey: 66, ew: 27, eh: 10, tilt: 2.5, irisK: .86, flick: 3 }, liner: 2.6, crease: true, eyes: 'open',
    brow: { x0: 6, x1: 37, y: 51, arch: 4, t: 3.6 }, nose: 'defined', lips: { w: 11.5, up: 4, lo: 6, c1: '#a84444', c2: '#c25a58' }, smile: true, mus: 'thin', crown: 'spikes' },
  J4: { name: 'Dark Demon Lord', skin: 'charcoal', W: 50, chin: 138, cheek: 1.0, jaw: .66, noseY: 98, mouthY: 116,
    eye: { ex: 21, ey: 66, ew: 28, eh: 9.5, tilt: 5, irisK: .8, flick: 6 }, liner: 3.2, crease: true, eyes: 'angry', irisCol: '#d0201a',
    brow: { x0: 4, x1: 39, y: 50, arch: 2, t: 5 }, nose: 'defined', lips: { w: 12, up: 3.6, lo: 5.4, c1: '#3a1a28', c2: '#4e2a38' }, smile: false, mus: 'thick', beard: true, fangs: true, crown: 'horns' },
  J5: { name: 'Kathakali Villain (Kerala tradition)', skin: 'kathi', W: 49, chin: 136, cheek: .98, jaw: .6, noseY: 97, mouthY: 114,
    eye: { ex: 21, ey: 65, ew: 30, eh: 8.5, tilt: 5, irisK: .9, flick: 9 }, liner: 3.4, lowerLine: 1.8, eyes: 'angry', irisCol: '#3a1a0a',
    brow: { x0: 4, x1: 40, y: 49, arch: 6, t: 3.6 }, nose: 'mural', lips: { w: 11, up: 4, lo: 5.6, c1: '#c8201a', c2: '#e03a2a' }, smile: false, mus: 'red', kathi: true, crown: 'kathakali' },
};

function jCrown(type) {
  const gem = (x, y, r, c = '#d1261c') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="#5a3a0a" stroke-width=".8"/>`;
  const band = `<path d="M-60 40 Q 0 22 60 40 L 58 14 Q 0 -2 -58 14Z" fill="url(#darkGold)" stroke="#3a2406" stroke-width="1.6"/>
    <path d="M-58 27 Q 0 10 58 27" stroke="#d1261c" stroke-width="2.4" stroke-dasharray="6 5" fill="none"/>${gem(0, 22, 6.5)}${gem(-30, 26, 3.5, '#2a8a5a')}${gem(30, 26, 3.5, '#2a8a5a')}`;
  if (type === 'waves') return `<g>${[-40, -20, 0, 20, 40].map((x, i) => `<path d="M${x - 12} 16 C ${x - 14} ${-6 - (i === 2 ? 30 : 12)} ${x + 4} ${-14 - (i === 2 ? 34 : 14)} ${x + 10} ${-4 - (i === 2 ? 20 : 6)} C ${x + 2} ${-6 - (i === 2 ? 18 : 6)} ${x - 2} 4 ${x + 12} 16Z" fill="url(#darkGold)" stroke="#3a2406" stroke-width="1.2"/>`).join('')}
      ${gem(0, -30, 5, '#1fb8c8')}${band}</g>`;
  if (type === 'horns') return `<g><path d="M-48 16 C -70 -10 -72 -40 -56 -62 C -58 -36 -48 -18 -30 8Z M48 16 C 70 -10 72 -40 56 -62 C 58 -36 48 -18 30 8Z" fill="#2e2622" stroke="#000" stroke-width="1.4"/>
      <path d="M-34 16 L -22 -36 L -10 10 L 0 -64 L 10 10 L 22 -36 L 34 16Z" fill="url(#darkGold)" stroke="#3a2406" stroke-width="1.4"/>${gem(0, -20, 5)}${band}</g>`;
  if (type === 'kathakali') return `<g><path d="M-74 30 C -80 -30 -50 -84 0 -88 C 50 -84 80 -30 74 30 Q 0 6 -74 30Z" fill="url(#darkGold)" stroke="#3a2406" stroke-width="1.6"/>
      ${[...Array(9)].map((_, i) => { const a = Math.PI * (1.08 + i * .105); return `<circle cx="${Math.cos(a) * 66}" cy="${-14 + Math.sin(a) * 66}" r="5" fill="${i % 2 ? '#d1261c' : '#2a8a5a'}"/>`; }).join('')}
      <path d="M-40 -10 Q 0 -60 40 -10" stroke="#d1261c" stroke-width="5" fill="none"/>${gem(0, -46, 7)}${band}</g>`;
  // spikes (matches the silhouette at the door: tall centre + side spikes)
  return `<g><path d="M-54 16 L -48 -24 L -36 6 L -24 -46 L -12 4 L 0 -82 L 12 4 L 24 -46 L 36 6 L 48 -24 L 54 16Z" fill="url(#darkGold)" stroke="#3a2406" stroke-width="1.4"/>
    ${gem(0, -30, 6)}${gem(-24, -18, 3.5, '#2a8a5a')}${gem(24, -18, 3.5, '#2a8a5a')}${band}</g>`;
}

function jalandharBust(o, id) {
  const sk = SKINS[o.skin];
  const p = { ...o, id, skin: `url(#sk_${o.skin})`, shade: sk[2], rim: '#ffcf9a', blush: 0 };
  const my = p.mouthY;
  p.overlay = `${o.beard ? beard(my, p.chin) : ''}${mustache(o.mus, my)}${o.fangs ? fangs(my) : ''}
    ${o.kathi ? `<path d="M-30 ${p.noseY - 6} C -24 ${p.noseY + 10} -10 ${p.noseY + 14} -4 ${p.noseY + 4}Z M30 ${p.noseY - 6} C 24 ${p.noseY + 10} 10 ${p.noseY + 14} 4 ${p.noseY + 4}Z" fill="#d1261c"/>
      <path d="M-${p.W + 2} 70 C -${p.W + 14} 110 -30 ${p.chin + 14} 0 ${p.chin + 16} C 30 ${p.chin + 14} ${p.W + 14} 110 ${p.W + 2} 70" fill="none" stroke="#fffaf0" stroke-width="7"/>` : ''}`;
  const hair = `<path d="M0 -4 C -42 -4 -62 18 -62 56 C -62 84 -58 104 -50 116 L 50 116 C 58 104 62 84 62 56 C 62 18 42 -4 0 -4Z" fill="#120a08"/>
    ${[-1, 1].map(sx => [0, 1, 2].map(k => `<path transform="scale(${sx},1)" d="M${50 + k * 3} ${84 + k * 16} q 16 4 12 18 q -10 4 -12 -4" fill="#120a08"/>`).join('')).join('')}`;
  const tilak = [0, 1, 2].map(k => `<path d="M-22 ${p.brow.y - 20 + k * 5} Q 0 ${p.brow.y - 23 + k * 5} 22 ${p.brow.y - 20 + k * 5}" stroke="#efe6d6" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/>`).join('') + `<circle cx="0" cy="${p.brow.y - 15}" r="3.4" fill="#d1261c"/>`;
  const ear = (sx) => `<g transform="translate(${sx * (p.W + 4)},86)"><circle r="9" fill="none" stroke="url(#darkGold)" stroke-width="4"/><circle cy="9" r="3.4" fill="#d1261c"/></g>`;
  return `<g>
    <!-- armour + cape -->
    <path d="M-150 240 C -150 200 -130 182 -100 174 L 100 174 C 130 182 150 200 150 240Z" fill="#5a0e12"/>
    <path d="M-20 118 L -22 156 C -50 164 -90 170 -118 186 C -130 196 -136 214 -136 240 L 136 240 C 136 214 130 196 118 186 C 90 170 50 164 22 156 L 20 118Z" fill="url(#sk_${o.skin}L)" stroke="${INK}" stroke-width="2"/>
    ${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M-60 170 C -100 166 -134 186 -140 226 L -140 240 L -96 240 C -96 214 -80 196 -56 188Z" fill="url(#darkGold)" stroke="#3a2406" stroke-width="2"/>
      <path transform="scale(${sx},1)" d="M-70 182 C -100 184 -122 200 -128 224" stroke="#d1261c" stroke-width="3" fill="none"/>`).join('')}
    <path d="M-56 188 L 56 188 L 48 240 L -48 240Z" fill="#2a1a12" stroke="#3a2406" stroke-width="1.6"/>
    <path d="M-40 196 Q 0 214 40 196 M-36 214 Q 0 232 36 214" stroke="url(#darkGold)" stroke-width="4" fill="none"/>
    <circle cx="0" cy="220" r="8" fill="#d1261c" stroke="#3a2406"/>
    ${hair}
    ${F.faceP(p)}
    <path d="M-50 30 C -46 18 -30 12 0 12 C 30 12 46 18 50 30 L 51 40 C 40 30 24 25 0 25 C -24 25 -40 30 -51 40Z" fill="#120a08"/>
    ${o.kathi ? '' : tilak}
    <g transform="translate(0,-14)">${jCrown(o.crown)}</g>
    ${ear(-1)}${ear(1)}
  </g>`;
}

// ---------- MAHADEV
const M_OPTIONS = {
  M1: { name: 'Serene Yogi', skin: 'ash', W: 48, chin: 134, cheek: .98, jaw: .55, noseY: 96, mouthY: 113, eyes: 'lowered',
    eye: { ex: 21, ey: 66, ew: 28, eh: 10, tilt: 2, irisK: .88, flick: 4 }, liner: 2.6, crease: true,
    brow: { x0: 6, x1: 37, y: 51, arch: 4, t: 3.4 }, nose: 'soft', lips: { w: 11, up: 4, lo: 6, c1: '#8a4a5a', c2: '#a46070' }, smile: true, third: 'closed' },
  M2: { name: 'Animated (matches Tulasi & Vishnu)', skin: 'shivaBlue', W: 49, chin: 128, cheek: 1.02, jaw: .6, noseY: 93, mouthY: 108, eyes: 'open',
    eye: { ex: 22, ey: 67, ew: 28, eh: 12.5, tilt: .8, irisK: .88, flick: 2.5 }, liner: 2.5, crease: true,
    brow: { x0: 7, x1: 36, y: 49, arch: 4, t: 3 }, nose: 'button', lips: { w: 9.5, up: 3.6, lo: 5.6, c1: '#8a4a5a', c2: '#a46070' }, smile: true, third: 'closed' },
  M3: { name: 'Kerala Mural (traditional)', skin: 'shivaBlue', W: 46, chin: 138, cheek: .95, jaw: .46, noseY: 99, mouthY: 116, eyes: 'open',
    eye: { ex: 21, ey: 65, ew: 31, eh: 8, tilt: 4.5, irisK: .9, flick: 9 }, liner: 3.2, lowerLine: 1.6,
    brow: { x0: 5, x1: 40, y: 49, arch: 7, t: 2.6 }, nose: 'mural', lips: { w: 10, up: 4, lo: 5.4, c1: '#8a4a5a', c2: '#a46070' }, smile: false, third: 'closed' },
  M4: { name: 'Rudra (fierce, third eye open)', skin: 'ash', W: 49, chin: 136, cheek: .98, jaw: .6, noseY: 97, mouthY: 114, eyes: 'angry',
    eye: { ex: 21, ey: 66, ew: 27, eh: 9.5, tilt: 3.5, irisK: .84, flick: 4 }, liner: 3, crease: true, irisCol: '#c84a10',
    brow: { x0: 5, x1: 38, y: 51, arch: 3, t: 4.2 }, nose: 'defined', lips: { w: 11.5, up: 4, lo: 6, c1: '#6a3444', c2: '#844a5a' }, smile: false, third: 'open' },
  M5: { name: 'Compassionate (matches Vishnu V5)', skin: 'shivaBlue', W: 48, chin: 132, cheek: 1.0, jaw: .55, noseY: 95, mouthY: 111, eyes: 'lowered',
    eye: { ex: 21, ey: 66, ew: 28, eh: 11, tilt: 1.5, irisK: .9, flick: 4 }, liner: 2.6, crease: true,
    brow: { x0: 6, x1: 36, y: 51, arch: 4, t: 3 }, nose: 'soft', lips: { w: 11, up: 4, lo: 6, c1: '#8a4a5a', c2: '#a46070' }, smile: true, third: 'closed' },
};

function mahadevBust(o, id) {
  const sk = SKINS[o.skin];
  const p = { ...o, id, skin: `url(#sk_${o.skin})`, shade: sk[2], rim: '#e4ecff', blush: 0 };
  const by = p.brow.y;
  const tripundra = [0, 1, 2].map(k => `<path d="M-30 ${by - 25 + k * 6} Q 0 ${by - 28 + k * 6} 30 ${by - 25 + k * 6}" stroke="#fbf8f0" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('');
  const third = o.third === 'open'
    ? `<ellipse cx="0" cy="${by - 19}" rx="4" ry="8" fill="#ff8a2a" filter="url(#glow)"/><ellipse cx="0" cy="${by - 19}" rx="2" ry="4.4" fill="#fff3c0"/>`
    : `<path d="M0 ${by - 27} C 2.8 ${by - 22} 2.8 ${by - 16} 0 ${by - 11} C -2.8 ${by - 16} -2.8 ${by - 22} 0 ${by - 27}Z" fill="#c8201a" stroke="${INK}" stroke-width=".8"/>`;
  // jata: matted locks gathered high, crescent moon, Ganga
  const locks = (sx) => [0, 1, 2, 3].map(k => `<path transform="scale(${sx},1)" d="M${44 + k * 6} 60 C ${60 + k * 8} 120 ${58 + k * 10} 180 ${70 + k * 8} 240 L ${82 + k * 8} 240 C ${70 + k * 10} 180 ${72 + k * 8} 120 ${58 + k * 6} 58Z" fill="#1c140e" stroke="#000" stroke-width=".8"/>`).join('');
  const loops = [[-26, -40, 22], [26, -40, 22], [-14, -66, 20], [14, -66, 20], [0, -88, 18], [-34, -14, 18], [34, -14, 18]];
  const jata = `<g>
    <path d="M-46 22 C -58 -10 -50 -60 -24 -84 C -10 -100 10 -100 24 -84 C 50 -60 58 -10 46 22Z" fill="#1c140e" stroke="#000" stroke-width="1.2"/>
    ${loops.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .62}" fill="#241a12" stroke="#000" stroke-width="1"/><path d="M${x - r * .7} ${y} Q ${x} ${y - r * .5} ${x + r * .7} ${y}" stroke="#4a3626" stroke-width="2" fill="none"/>`).join('')}
    <path d="M-40 8 Q 0 -6 40 8" stroke="#8a5a2a" stroke-width="6" fill="none"/>
    ${[-26, -13, 0, 13, 26].map(x => `<circle cx="${x}" cy="${3 - (26 - Math.abs(x)) * .12}" r="3.6" fill="#7a3a1a" stroke="#3a1a0a" stroke-width=".6"/>`).join('')}
    <path d="M-44 -50 C -60 -40 -62 -16 -50 -4 C -54 -22 -50 -38 -38 -46Z" fill="#f4f0dc" stroke="#c8c0a0" stroke-width="1" filter="url(#glow)"/>
    ${[-1, 0, 1].map(k => `<path d="M${k * 4} -100 C ${k * 4 + k * 10} -122 ${k * 24} -128 ${k * 34 + (k ? 0 : 6)} -118" stroke="#8fd0ff" stroke-width="${k ? 2.4 : 3.2}" fill="none" stroke-linecap="round" opacity=".9"/>`).join('')}
    ${[[-30, -116], [34, -114], [8, -126]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#dff4ff"/>`).join('')}
  </g>`;
  const snake = `<g>
    <path d="M-32 152 C -48 172 -30 188 0 188 C 34 188 54 172 50 150 C 48 140 56 134 66 134" fill="none" stroke="#2e7a3a" stroke-width="7" stroke-linecap="round"/>
    <path d="M-32 152 C -48 172 -30 188 0 188 C 34 188 54 172 50 150" fill="none" stroke="#9ad06a" stroke-width="1.6" stroke-dasharray="3 6"/>
    <g transform="translate(76,128) rotate(-20)">
      <path d="M-5 10 C -18 8 -20 -10 -10 -18 C -6 -22 6 -22 10 -18 C 20 -10 18 8 5 10Z" fill="#2e7a3a" stroke="#123a1a" stroke-width="1.2"/>
      <path d="M-4 -4 C -2 -10 2 -10 4 -4 C 2 2 -2 2 -4 -4Z" fill="#9ad06a" opacity=".7"/>
      <ellipse cx="0" cy="-17" rx="5" ry="4" fill="#24652e" stroke="#123a1a" stroke-width=".8"/>
      <circle cx="-2.4" cy="-18" r="1.1" fill="#f4d03a"/><circle cx="2.4" cy="-18" r="1.1" fill="#f4d03a"/></g>
  </g>`;
  const rudraksha = `<path d="M-46 176 C -40 230 -16 256 0 262 C 16 256 40 230 46 176" fill="none" stroke="#7a3a1a" stroke-width="7" stroke-dasharray="1 7" stroke-linecap="round"/>`;
  const ear = (sx) => `<g transform="translate(${sx * (p.W + 4)},88)"><circle r="7" fill="#7a3a1a" stroke="#3a1a0a"/><circle cy="12" r="5" fill="#7a3a1a" stroke="#3a1a0a"/></g>`;
  return `<g>
    ${locks(1)}${locks(-1)}
    <path d="M-20 118 L -22 156 C -50 164 -90 170 -118 186 C -130 196 -136 214 -136 240 L 136 240 C 136 214 130 196 118 186 C 90 170 50 164 22 156 L 20 118Z" fill="url(#sk_${o.skin}L)" stroke="${INK}" stroke-width="2"/>
    <path d="M-19 136 Q 0 150 19 136 L 20 150 Q 0 164 -20 150Z" fill="#2a4a9a" opacity=".75"/>
    ${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M-120 190 C -100 196 -86 206 -80 222" stroke="${sk[2]}" stroke-width="2" fill="none" opacity=".6"/>`).join('')}
    ${rudraksha}${snake}
    ${F.faceP(p)}
    <path d="M-48 26 C -44 10 -28 4 0 4 C 28 4 44 10 48 26 L 49 36 C 40 22 24 16 0 16 C -24 16 -40 22 -49 36Z" fill="#1c140e"/>
    ${jata}${tripundra}${third}
    ${ear(-1)}${ear(1)}
  </g>`;
}

function sheet(title, opts, bustFn, cyBase, sc) {
  const W = 1920, H = 1080; let cards = '';
  Object.keys(opts).forEach((k, i) => {
    const cx = 192 + i * 384;
    cards += `<clipPath id="c${k}"><rect x="${cx - 176}" y="80" width="352" height="740" rx="18"/></clipPath>
      <rect x="${cx - 176}" y="80" width="352" height="840" rx="18" fill="#fbf1dc" stroke="#d8c39a" stroke-width="2"/>
      <g clip-path="url(#c${k})"><g transform="translate(${cx},${cyBase}) scale(${sc})">${bustFn(opts[k], k)}</g></g>
      <text x="${cx}" y="870" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="50" fill="#8a3a14">${k}</text>
      <text x="${cx}" y="904" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="23" fill="#5a3a20">${opts[k].name}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${A.defs()}${C.defs2()}
    <defs>${skinDefs}<linearGradient id="darkGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a3a0a"/><stop offset=".35" stop-color="#c8922a"/><stop offset=".5" stop-color="#f2d27a"/><stop offset=".7" stop-color="#9a6a1a"/><stop offset="1" stop-color="#4a2e06"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="#f1e2c2"/>
    <text x="${W / 2}" y="54" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="34" fill="#6a2a10">${title}</text>
    ${cards}</svg>`;
}

const jalandharOptions = () => sheet('JALANDHAR · FACE OPTIONS', J_OPTIONS, jalandharBust, 360, 1.85);
const mahadevOptions = () => sheet('MAHADEV · FACE OPTIONS', M_OPTIONS, mahadevBust, 380, 1.75);

module.exports = { jalandharOptions, mahadevOptions, J_OPTIONS, M_OPTIONS, jalandharBust, mahadevBust, SKINS, skinDefs, jCrown, mustache, fangs, beard };
