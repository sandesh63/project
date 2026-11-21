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
  return svg(W, H, `${parchment(W, H)}
    ${shadow(260, 896, 90)}${C.tulasi(260, 80, s, { eyes: 'open', mouth: 'smile' })}
    ${shadow(560, 896, 90)}${C.tulasi(560, 80, s, { pose: 'anjali', eyes: 'lowered' })}
    ${headCard(960, 120, 1.7, `<g transform="translate(0,0)">${C.tulasi(0, 0, 1, { eyes: 'closed', pose: 'anjali' })}</g>`, 1)}
    ${headCard(1240, 120, 1.7, C.tulasi(0, 0, 1, { eyes: 'open', mouth: 'smile' }), 2)}
    ${headCard(1520, 120, 1.7, C.tulasi(0, 0, 1, { eyes: 'wide', mouth: 'open' }), 3)}
    ${headCard(1240, 520, 1.7, C.tulasi(0, 0, 1, { eyes: 'angry', mouth: 'open', tears: true }), 4)}
    ${headCard(960, 520, 1.7, C.tulasi(0, 0, 1, { eyes: 'lowered', pose: 'anjali' }), 5)}
  `);
}

function sheetVishnu() {
  const W = 1920, H = 1080, s = .82;
  return svg(W, H, `${parchment(W, H)}
    ${shadow(330, 870, 110)}${C.vishnu(330, 165, s, {})}
    ${shadow(760, 870, 110)}${C.vishnu(760, 165, s, { pose: 'accept', eyes: 'closed' })}
    ${headCard(1180, 260, 1.4, C.vishnu(0, 0, 1, {}), 1, 190, 420)}
    ${headCard(1460, 260, 1.4, C.vishnu(0, 0, 1, { eyes: 'open', mouth: 'smile' }), 2, 190, 420)}
    ${headCard(1740, 260, 1.4, C.vishnu(0, 0, 1, { eyes: 'closed' }), 3, 190, 420)}
  `);
}

module.exports = { sheetTulasi, sheetVishnu };
