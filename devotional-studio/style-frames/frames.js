// Style frames for Tulasi Devi. Each returns a full SVG (1920x1080 or 1080x1920).
const A = require('../engine/art.js');
const { P } = A;

const caption = (w, y, parts, size = 46) => {
  const spans = parts.map(([t, hl]) => `<tspan fill="${hl ? '#ffd66b' : '#fff7ea'}" ${hl ? 'font-weight="700"' : ''}>${t}</tspan>`).join('');
  return `<text x="${w / 2}" y="${y}" text-anchor="middle" font-family="Cinzel, serif" font-size="${size}" letter-spacing="3"
     style="paint-order:stroke" stroke="#1a0a04" stroke-width="7" stroke-linejoin="round">${spans}</text>`;
};

function svg(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${A.defs()}${body}${A.finish(w, h)}</svg>`;
}

// A — Vrinda, the devoted one
function frameVrinda() {
  const W = 1920, H = 1080;
  return svg(W, H, `
    <linearGradient id="bgA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b0d24"/><stop offset=".55" stop-color="#4a1418"/><stop offset="1" stop-color="#1a0806"/></linearGradient>
    <rect width="${W}" height="${H}" fill="url(#bgA)"/>
    ${A.templeSilhouette(300, 900, 1.1, '#26101e')}${A.templeSilhouette(1640, 920, .9, '#26101e')}
    ${A.mandalaGlow(960, 360, 520, '#ffcf6a', .55)}
    ${A.prabhavali(960, 760, 430, { flames: 25, thick: 30, pillar: 400 })}
    ${A.vrinda(960, 400, .98, { look: 0 })}
    ${A.nilavilakku(260, 1080, 1.25, 3)}${A.nilavilakku(1660, 1080, 1.25, -3)}
    ${A.embers(5, 70, W, H)}
    ${A.petals(9, 46, W, H)}
    ${A.captionBand(W, H)}
    ${caption(W, 1010, [['She was the most ', 0], ['devoted', 1], [' woman in the three worlds', 0]])}
  `);
}

// B — Vishnu revealed
function frameVishnu() {
  const W = 1920, H = 1080;
  return svg(W, H, `
    <linearGradient id="bgB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060a24"/><stop offset=".6" stop-color="#12245a"/><stop offset="1" stop-color="#05061a"/></linearGradient>
    <rect width="${W}" height="${H}" fill="url(#bgB)"/>
    ${A.embers(21, 160, W, H, '#cfe2ff')}
    <ellipse cx="960" cy="420" rx="760" ry="620" fill="url(#blueGlow)" opacity=".7"/>
    ${A.mandalaGlow(960, 330, 560, '#bcd6ff', .45)}
    ${A.prabhavali(960, 860, 570, { flames: 29, thick: 30, pillar: 300 })}
    ${A.vishnu(960, 500, .82)}
    ${A.petals(31, 26, W, H, { op: .8 })}
    ${A.captionBand(W, H)}
    ${caption(W, 1010, [['But the one who came to her door… was ', 0], ['Vishnu', 1]])}
  `);
}

// C — the world: night temple ghat, Tulasi brindavan
function frameWorld() {
  const W = 1920, H = 1080;
  const r = A.rng(77); let stars = '';
  for (let i = 0; i < 220; i++) stars += `<circle cx="${r() * W}" cy="${r() * 520}" r="${r() * 1.6 + .3}" fill="#fff" opacity="${r() * .8 + .1}"/>`;
  let lamps = '', refl = '';
  for (let i = 0; i < 14; i++) {
    const x = 120 + i * 130 + (i % 2) * 20, y = 760;
    lamps += `<rect x="${x - 10}" y="${y}" width="20" height="10" rx="4" fill="${P.gold3}"/>${A.flame(x, y, .45)}`;
    refl += `<ellipse cx="${x}" cy="${y + 120}" rx="10" ry="60" fill="#ffb347" opacity=".35" filter="url(#blur8)"/>`;
  }
  return svg(W, H, `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050822"/><stop offset=".6" stop-color="#1c1d52"/><stop offset="1" stop-color="#5a2a4a"/></linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1a40"/><stop offset="1" stop-color="#05051a"/></linearGradient>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>${stars}
    <circle cx="1480" cy="200" r="150" fill="#fff2c8" opacity=".12" filter="url(#softGlow)"/>
    <circle cx="1480" cy="200" r="70" fill="#fff4d6"/><circle cx="1500" cy="186" r="62" fill="#f2e2b8" opacity=".5"/>
    <path d="M0 640 Q 300 560 620 610 T 1300 590 T 1920 620 L1920 760 L0 760Z" fill="#1a1838"/>
    ${A.templeSilhouette(420, 760, 1, '#100f2c')}${A.templeSilhouette(1180, 760, .7, '#14133a')}${A.templeSilhouette(1650, 760, .5, '#17163f')}
    <rect y="760" width="${W}" height="320" fill="url(#water)"/>
    <path d="M0 760 L ${W} 760 L ${W} 780 L 0 780Z" fill="#2a2240"/>
    ${lamps}${refl}
    <ellipse cx="1480" cy="900" rx="40" ry="150" fill="#fff2c8" opacity=".18" filter="url(#blur8)"/>
    ${[...Array(10)].map((_, i) => `<path d="M${60 + i * 190} ${830 + (i % 3) * 60} q 40 -8 80 0" stroke="#8a86c0" stroke-width="2" opacity=".35" fill="none"/>`).join('')}
    <path d="M520 1080 L 700 820 L 1240 820 L 1420 1080Z" fill="#3a2a2a" stroke="#1a0e0e" stroke-width="3"/>
    ${[...Array(5)].map((_, i) => `<path d="M${560 - i * 0 + i * 0} ${860 + i * 45} L ${1380} ${860 + i * 45}" stroke="#241818" stroke-width="3"/>`).join('')}
    <ellipse cx="960" cy="760" rx="420" ry="260" fill="url(#lampGlow)" opacity=".5"/>
    ${A.tulasiKatte(960, 960, 1.05, 11)}
    ${A.nilavilakku(720, 1000, .6, 2)}${A.nilavilakku(1200, 1000, .6, -2)}
    ${A.petals(44, 30, W, H)}
    ${A.embers(12, 60, W, 1080)}
  `);
}

// D — thumbnail / title card
function frameTitle() {
  const W = 1920, H = 1080;
  return svg(W, H, `
    <linearGradient id="bgD" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3d0f12"/><stop offset=".55" stop-color="#1c0c20"/><stop offset="1" stop-color="#071034"/></linearGradient>
    <rect width="${W}" height="${H}" fill="url(#bgD)"/>
    ${A.mandalaGlow(560, 470, 560, '#ffcf6a', .6)}
    <g transform="translate(-60,-20)">${A.vrinda(620, 560, 1.75, { hands: false, look: 6 })}</g>
    ${A.shaligram(1500, 640, 1.25)}
    ${A.embers(3, 90, W, H)}${A.petals(17, 40, W, H)}
    <text x="1500" y="250" text-anchor="middle" font-family="'Cinzel Decorative', Cinzel, serif" font-weight="900" font-size="128" fill="url(#goldV)" stroke="#2a1208" stroke-width="4" style="paint-order:stroke" filter="url(#glow)">TULASI</text>
    <text x="1500" y="250" text-anchor="middle" font-family="'Cinzel Decorative', Cinzel, serif" font-weight="900" font-size="128" fill="url(#goldV)">TULASI</text>
    <text x="1500" y="340" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="56" letter-spacing="22" fill="#fff4dc">DEVI</text>
    <text x="1500" y="900" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="58" fill="#fff4dc" stroke="#000" stroke-width="5" style="paint-order:stroke">Her curse turned God</text>
    <text x="1500" y="970" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="64" fill="#ffd66b" stroke="#000" stroke-width="6" style="paint-order:stroke">INTO STONE</text>
    ${A.frameBorder(W, H)}
  `);
}

// E — 9:16 Shorts hook frame
function frameShort() {
  const W = 1080, H = 1920;
  return svg(W, H, `
    <linearGradient id="bgE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0d2a"/><stop offset=".5" stop-color="#3a1020"/><stop offset="1" stop-color="#120605"/></linearGradient>
    <rect width="${W}" height="${H}" fill="url(#bgE)"/>
    ${A.mandalaGlow(540, 760, 560, '#ffcf6a', .55)}
    ${A.prabhavali(540, 1180, 420, { flames: 23, thick: 28, pillar: 800 })}
    ${A.vrinda(540, 800, 1.0)}
    ${A.nilavilakku(130, 1920, 1.2, 3)}${A.nilavilakku(950, 1920, 1.2, -3)}
    ${A.embers(8, 90, W, H)}${A.petals(23, 50, W, H)}
    <text x="540" y="260" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="74" fill="#fff7ea" stroke="#1a0a04" stroke-width="9" style="paint-order:stroke">Why does</text>
    <text x="540" y="360" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="74" fill="#fff7ea" stroke="#1a0a04" stroke-width="9" style="paint-order:stroke">Vishnu marry</text>
    <text x="540" y="470" text-anchor="middle" font-family="Cinzel, serif" font-weight="900" font-size="96" fill="#ffd66b" stroke="#1a0a04" stroke-width="10" style="paint-order:stroke">A PLANT?</text>
    ${A.captionBand(W, H, 420)}
    ${caption(W, 1640, [['She ', 0], ['cursed', 1], [' God himself…', 0]], 54)}
  `);
}

module.exports = { frameVrinda, frameVishnu, frameWorld, frameTitle, frameShort };
