// Character sheets for the v2 code-drawn characters, laid out like the reference sheets.
const A = require('../engine/art.js');
const C = require('../engine/characters.js');

const parchment = (W, H) => `<rect width="${W}" height="${H}" fill="#f4e6c8"/>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity=".18"/>`;
const shadow = (x, y, w) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * .12}" fill="#7a5a30" opacity=".22" filter="url(#blur3)"/>`;
const svg = (W, H, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${A.defs()}${C.defs2()}${body}</svg>`;

// head close-up: head group scaled, clipped to a card
const headCard = (x, y, sc, inner, id, top = 40, h = 270) => `<clipPath id="hc${id}"><rect x="${x - 120}" y="${y - top}" width="240" height="${h}" rx="10"/></clipPath>
  <g clip-path="url(#hc${id})"><g transform="translate(${x},${y}) scale(${sc})">${inner}</g></g>`;

function sheetTulasi() {
  const W = 1920, H = 1080, s = .9;
  const card = (x, y, opts, id, label) => `${headCard(x, y, 1.75, C.tulasi(0, 0, 1, opts), id, 50, 300)}
    <text x="${x}" y="${y + 275}" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="24" fill="#5a3a20">${label}</text>`;
  return svg(W, H, `${parchment(W, H)}
    ${shadow(250, 896, 90)}${C.tulasi(250, 80, s, { eyes: 'open', mouth: 'smile' })}
    ${shadow(540, 896, 90)}${C.tulasi(540, 80, s, { pose: 'anjali', eyes: 'lowered', mouth: 'soft' })}
    ${card(900, 130, { eyes: 'closed', mouth: 'soft', pose: 'anjali' }, 1, 'prayer · eyes closed')}
    ${card(1180, 130, { eyes: 'lowered', mouth: 'soft', pose: 'anjali' }, 2, 'devotion · eyes lowered')}
    ${card(1460, 130, { eyes: 'open', mouth: 'smile' }, 3, 'gentle smile')}
    ${card(1740, 130, { eyes: 'open', mouth: 'soft' }, 4, 'calm')}
    ${card(1040, 560, { eyes: 'wide', mouth: 'open' }, 5, 'shock · realisation')}
    ${card(1320, 560, { eyes: 'angry', mouth: 'open', tears: true }, 6, 'anger · the curse')}
    ${card(1600, 560, { eyes: 'lowered', mouth: 'soft', tears: true, sad: true }, 7, 'grief')}
  `);
}

function sheetVishnu() {
  const W = 1920, H = 1080, s = .8;
  const card = (x, y, opts, id, label) => `${headCard(x, y, 1.3, C.vishnu(0, 0, 1, opts), 'v' + id, 175, 380)}
    <text x="${x}" y="${y + 232}" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="24" fill="#5a3a20">${label}</text>`;
  return svg(W, H, `${parchment(W, H)}
    ${shadow(300, 880, 110)}${C.vishnu(300, 140, s, { eyes: 'lowered', mouth: 'smile' })}
    ${shadow(700, 880, 110)}${C.vishnu(700, 140, s, { pose: 'accept', eyes: 'closed', mouth: 'soft' })}
    ${card(1060, 220, { eyes: 'lowered', mouth: 'smile' }, 1, 'compassionate · default')}
    ${card(1340, 220, { eyes: 'open', mouth: 'smile' }, 2, 'blessing smile')}
    ${card(1620, 220, { eyes: 'open', mouth: 'soft' }, 3, 'calm')}
    ${card(1200, 660, { eyes: 'closed', mouth: 'soft' }, 4, 'meditation · accepts the curse')}
    ${card(1480, 660, { eyes: 'lowered', mouth: 'soft', sad: true }, 5, 'sorrow')}
  `);
}

module.exports = { sheetTulasi, sheetVishnu };
