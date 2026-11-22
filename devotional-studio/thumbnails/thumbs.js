// Divine Stories Studio — YouTube thumbnails for Tulasi Devi (long 1280x720, Shorts 1080x1920).
// Artwork = caption-free frames of our own video (grab.js), re-cropped and composed, plus Google-font titles.
// render: node thumbnails/thumbs-render.js <outDir> [nameFilter]
const G = require('./grab.js');

// ---------- shared pieces of the channel's thumbnail style ----------
const DEFS = `<defs>
  <linearGradient id="tGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c2"/><stop offset=".45" stop-color="#ffd23f"/><stop offset="1" stop-color="#ff8a00"/></linearGradient>
  <linearGradient id="tFire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe14d"/><stop offset=".5" stop-color="#ff6a00"/><stop offset="1" stop-color="#e0002a"/></linearGradient>
  <linearGradient id="tBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6fbff"/><stop offset=".5" stop-color="#5fd8ff"/><stop offset="1" stop-color="#2a6bff"/></linearGradient>
  <linearGradient id="tPink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0fa"/><stop offset=".5" stop-color="#ff7ad9"/><stop offset="1" stop-color="#c2189b"/></linearGradient>
  <linearGradient id="tGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4ffd6"/><stop offset=".5" stop-color="#8cff5a"/><stop offset="1" stop-color="#17a84a"/></linearGradient>
  <linearGradient id="tStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f2f2"/><stop offset=".55" stop-color="#9a9aa4"/><stop offset="1" stop-color="#4a4a56"/></linearGradient>
  <radialGradient id="tVig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
  <linearGradient id="tBotFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".8"/></linearGradient>
  <linearGradient id="tTopFade" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></linearGradient>
  <filter id="tGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="tSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="tStoneF"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="1.1" intercept=".05"/><feFuncG type="linear" slope="1.1" intercept=".05"/><feFuncB type="linear" slope="1.15" intercept=".08"/></feComponentTransfer></filter>
</defs>`;

const FONT = { impact: "'Anton', Impact, sans-serif", indian: "'Yatra One', serif", title: "'Cinzel Decorative', serif", hand: "'Kalam', cursive", round: "'Baloo 2', sans-serif" };

// chunky outlined title: hard offset shadow + thick dark stroke + gradient fill (+ optional glow)
function T(str, x, y, size, fill, o = {}) {
  const f = o.font || FONT.impact, anchor = o.anchor || 'middle', sw = o.sw || size * .13, rot = o.rot ? ` rotate(${o.rot} ${x} ${y})` : '';
  const ls = o.ls != null ? o.ls : 1, stroke = o.stroke || '#16040a', w = o.weight || 400;
  const base = `x="${x}" y="${y}" font-family="${f}" font-weight="${w}" font-size="${size}" text-anchor="${anchor}" letter-spacing="${ls}"`;
  return `<g transform="${rot}">
    ${o.glow ? `<text ${base} fill="${o.glow}" stroke="${o.glow}" stroke-width="${sw * 2.2}" filter="url(#tSoft)" opacity=".85">${str}</text>` : ''}
    <text ${base} transform="translate(${size * .05},${size * .07})" fill="#000" stroke="#000" stroke-width="${sw}" stroke-linejoin="round" opacity=".75">${str}</text>
    <text ${base} fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" style="paint-order:stroke">${str}</text>
  </g>`;
}
// slanted colour ribbon with a word on it
function tag(str, x, y, size, bg, fg = '#fff', o = {}) {
  const w = o.w || str.length * size * .62 + size * 1.2, h = size * 1.45, rot = o.rot || -4;
  return `<g transform="translate(${x},${y}) rotate(${rot})">
    <rect x="${-w / 2 + 6}" y="${-h / 2 + 8}" width="${w}" height="${h}" rx="${h * .18}" fill="#000" opacity=".55"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h * .18}" fill="${bg}" stroke="#fff" stroke-width="${size * .09}"/>
    <text y="${size * .36}" text-anchor="middle" font-family="${o.font || FONT.round}" font-weight="800" font-size="${size}" fill="${fg}" letter-spacing="1">${str}</text>
  </g>`;
}
function rays(cx, cy, n, r, col, op = .35, rot = 0) {
  let s = '';
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + rot, b = a + Math.PI / n * .55;
    s += `M${cx} ${cy} L${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)} L${(cx + Math.cos(b) * r).toFixed(1)} ${(cy + Math.sin(b) * r).toFixed(1)}Z`; }
  return `<path d="${s}" fill="${col}" opacity="${op}"/>`;
}
// jagged lightning-style split line from (x1,y1) to (x2,y2)
function bolt(x1, y1, x2, y2, n, amp, col, w) {
  let pts = [];
  for (let i = 0; i <= n; i++) { const k = i / n; pts.push([x1 + (x2 - x1) * k + (i % 2 ? amp : -amp) * (i && i < n ? 1 : 0), y1 + (y2 - y1) * k]); }
  const d = 'M' + pts.map(p => p.map(v => v.toFixed(0)).join(' ')).join(' L');
  return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w * 3}" opacity=".45" filter="url(#tSoft)"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linejoin="miter"/>`;
}
function zig(x1, y1, x2, y2, n, amp) { // polygon edge points (for clipping a split)
  const pts = []; for (let i = 0; i <= n; i++) { const k = i / n; pts.push([x1 + (x2 - x1) * k + (i % 2 ? amp : -amp) * (i && i < n ? 1 : 0), y1 + (y2 - y1) * k]); }
  return pts;
}
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${DEFS}${body}</svg>`;
const L = (body) => svg(1280, 720, body);
const V = (body) => svg(1080, 1920, body);
const C = G.crop;

// ---------- LONG (1280x720) ----------
const long = {
  // 1. the curse — angry Vrinda vs Vishnu turning to stone
  long1_she_cursed_vishnu: () => {
    const e = zig(700, -20, 600, 740, 6, 26);
    const left = `M-10 -10 L${e.map(p => p.join(' ')).join(' L')} L-10 740Z`;
    return L(`<rect width="1280" height="720" fill="#12081e"/>
      <clipPath id="c1r"><rect x="560" width="720" height="720"/></clipPath>
      <g clip-path="url(#c1r)"><rect x="560" width="720" height="720" fill="#0b1640"/>${rays(980, 300, 28, 900, '#5fd8ff', .14)}
        ${C(320, [600, -20, 720, 860], [600, 0, 720, 720], 'filter="url(#tStoneF)"')}</g>
      <clipPath id="c1l"><path d="${left}"/></clipPath>
      <g clip-path="url(#c1l)"><rect width="760" height="720" fill="#ff6a00"/>${rays(330, 330, 30, 900, '#ffe14d', .35)}
        ${C(300, [540, 40, 840, 840], [-40, 0, 760, 760])}</g>
      ${bolt(700, -20, 600, 740, 6, 26, '#ff2a2a', 7)}
      <rect y="470" width="1280" height="250" fill="url(#tBotFade)"/>
      ${T('SHE CURSED', 330, 610, 104, 'url(#tGold)', { rot: -3 })}
      ${T('VISHNU!', 880, 650, 150, 'url(#tBlue)', { rot: -3, glow: '#2a6bff' })}
      ${tag('INTO STONE', 1010, 470, 38, '#e0002a', '#fff', { rot: 5 })}
      <rect width="1280" height="720" fill="url(#tVig)"/>`);
  },
  // 2. why is Vishnu worshipped as a stone — Shaligram
  long2_why_vishnu_stone: () => L(`<rect width="1280" height="720" fill="#1a0610"/>
      ${C(323, [380, 240, 1040, 693], [200, 0, 1080, 720])}
      <rect width="600" height="720" fill="url(#tLeftFade)"/>${rays(120, 360, 24, 520, '#5fd8ff', .08)}
      <linearGradient id="tLeftFade" x1="0" y1="0" x2="1" y2="0"><stop offset=".5" stop-color="#1a0610" stop-opacity=".95"/><stop offset="1" stop-color="#1a0610" stop-opacity="0"/></linearGradient>
      ${T('WHY IS', 290, 205, 96, '#fff', { rot: -4 })}
      ${T('VISHNU', 300, 350, 150, 'url(#tBlue)', { rot: -4, glow: '#2a6bff' })}
      ${T('A STONE?', 330, 500, 132, 'url(#tStone)', { rot: -4 })}
      ${tag('SHALIGRAM', 1060, 640, 40, '#7a1bd6', '#fff', { rot: 3 })}
      <rect width="1280" height="720" fill="url(#tVig)"/>`),
  // 3. the asura no god could kill
  long3_no_god_could_kill: () => L(`<rect width="1280" height="720" fill="#2a0006"/>
      ${rays(860, 300, 26, 1000, '#ff3b1f', .22)}
      ${C(163, [440, 0, 1060, 1000], [440, 0, 840, 720])}
      <clipPath id="c3"><path d="M-10 300 L330 270 L370 730 L-10 730Z"/></clipPath>
      <g clip-path="url(#c3)">${C(62, [660, 0, 600, 1080], [-40, 240, 460, 828])}</g><path d="M-10 300 L330 270 L370 730" fill="none" stroke="#fff" stroke-width="8"/>
      <rect y="0" width="1280" height="260" fill="url(#tTopFade)"/>
      ${T('NO GOD', 300, 150, 120, 'url(#tFire)', { rot: -5, glow: '#ff2a00' })}
      ${T('COULD KILL', 380, 270, 104, '#fff', { rot: -5 })}
      ${T('HIM', 1080, 640, 150, 'url(#tFire)', { rot: -6, glow: '#ff2a00' })}
      ${tag('WHY?', 560, 640, 48, '#ffd23f', '#2a0006', { rot: -6 })}
      <rect width="1280" height="720" fill="url(#tVig)"/>`),
  // 4. the shadow at her door
  long4_who_came_to_her_door: () => L(`<rect width="1280" height="720" fill="#120a24"/>
      ${C(275, [440, 0, 1480, 1080], [300, 0, 980, 720])}
      <rect x="300" width="980" height="720" fill="#3a1a8a" opacity=".25" style="mix-blend-mode:multiply"/>
      <circle cx="1010" cy="250" r="190" fill="#ffd23f" opacity=".12" filter="url(#tSoft)"/>
      <clipPath id="c4"><path d="M-10 -10 L560 -10 Q 470 360 560 730 L-10 730Z"/></clipPath>
      <g clip-path="url(#c4)"><rect width="600" height="720" fill="#5a0a2a"/>${rays(260, 340, 26, 800, '#ff7ad9', .18)}${C(243, [560, 40, 800, 900], [-60, 30, 660, 742])}</g>
      <path d="M560 -10 Q 470 360 560 730" fill="none" stroke="#ff7ad9" stroke-width="8"/>
      <rect y="480" width="1280" height="240" fill="url(#tBotFade)"/>
      ${T('WHO CAME', 860, 140, 112, 'url(#tPink)', { rot: -3, glow: '#c2189b' })}
      ${T('TO HER DOOR?', 820, 640, 112, '#fff', { rot: -3 })}
      ${tag('NOT HER HUSBAND', 1010, 250, 32, '#e0002a', '#fff', { rot: 4 })}
      <rect width="1280" height="720" fill="url(#tVig)"/>`),
  // 5. the full story title card
  long5_tulasi_devi_full_story: () => L(`<rect width="1280" height="720" fill="#ff7a2a"/>
      ${rays(640, 380, 36, 1100, '#ffe14d', .35, .05)}
      <circle cx="640" cy="380" r="300" fill="#fff4b0" opacity=".45" filter="url(#tSoft)"/>
      <clipPath id="a5l"><path d="M40 760 L40 380.0 A 180.0 180.0 0 0 1 400 380.0 L400 760Z"/></clipPath><clipPath id="a5c"><path d="M450 760 L450 360.0 A 190.0 190.0 0 0 1 830 360.0 L830 760Z"/></clipPath><clipPath id="a5r"><path d="M880 760 L880 380.0 A 180.0 180.0 0 0 1 1240 380.0 L1240 760Z"/></clipPath>
      <g clip-path="url(#a5l)"><rect x="40" y="200" width="360" height="560" fill="#7a1030"/>${C(120, [560, 40, 800, 1000], [-20, 200, 480, 600])}</g>
      <g clip-path="url(#a5c)">${C(420, [516, 260, 600, 932], [450, 170, 380, 590])}</g>
      <g clip-path="url(#a5r)"><rect x="880" y="200" width="360" height="560" fill="#0a1a5a"/>${C(365, [540, 0, 840, 1000], [840, 200, 440, 600])}</g>
      <path d="M40 760 L40 380.0 A 180.0 180.0 0 0 1 400 380.0 L400 760Z" fill="none" stroke="url(#tGold)" stroke-width="9"/><path d="M450 760 L450 360.0 A 190.0 190.0 0 0 1 830 360.0 L830 760Z" fill="none" stroke="url(#tGold)" stroke-width="11"/><path d="M880 760 L880 380.0 A 180.0 180.0 0 0 1 1240 380.0 L1240 760Z" fill="none" stroke="url(#tGold)" stroke-width="9"/>
      <rect y="0" width="1280" height="200" fill="url(#tTopFade)" opacity=".6"/>
      <rect y="560" width="1280" height="160" fill="url(#tBotFade)" opacity=".7"/>
      ${T('TULASI DEVI', 640, 140, 116, 'url(#tGold)', { font: FONT.title, weight: 900, sw: 13, ls: 4, glow: '#ff3b00' })}
      ${tag('THE COMPLETE STORY', 640, 650, 44, '#c2003a', '#fff', { rot: -2, w: 640 })}
      <rect width="1280" height="720" fill="url(#tVig)"/>`),
  // 6. the curse that separated Ram and Sita
  long6_ram_sita_curse: () => {
    const e = zig(700, -20, 760, 740, 7, 22);
    return L(`<rect width="1280" height="720" fill="#2a0c34"/>
      <clipPath id="c6l"><path d="M-10 -10 L${e.map(p => p.join(' ')).join(' L')} L-10 740Z"/></clipPath>
      <clipPath id="c6r"><path d="M1290 -10 L${e.map(p => p.join(' ')).join(' L')} L1290 740Z"/></clipPath>
      <g clip-path="url(#c6l)">${C(308, [520, 280, 960, 760], [-160, 0, 1480, 1172])}</g>
      <g clip-path="url(#c6r)"><g transform="translate(40,70)">${C(308, [520, 280, 960, 760], [-160, 0, 1480, 1172])}</g></g>
      ${bolt(700, -20, 760, 740, 7, 22, '#ff5a1f', 6)}
      <g transform="translate(1060,90)"><circle r="96" fill="#ff6a00" stroke="#fff" stroke-width="7"/><clipPath id="c6c"><circle r="90"/></clipPath><g clip-path="url(#c6c)">${C(300, [720, 120, 480, 480], [-90, -90, 180, 180])}</g></g>
      <rect y="0" width="1280" height="240" fill="url(#tTopFade)"/>
      <rect y="470" width="1280" height="250" fill="url(#tBotFade)"/>
      ${T('HER CURSE', 360, 130, 110, 'url(#tFire)', { rot: -3, glow: '#ff2a00' })}
      ${T('SEPARATED', 400, 560, 96, '#fff', { rot: -3 })}
      ${T('RAM &amp; SITA', 420, 680, 116, 'url(#tGold)', { rot: -3 })}
      <rect width="1280" height="720" fill="url(#tVig)"/>`);
  },
  // 7. why Vishnu loves Tulasi
  long7_why_vishnu_loves_tulasi: () => L(`<rect width="1280" height="720" fill="#0a1a5a"/>
      ${rays(420, 330, 30, 1000, '#5fd8ff', .2)}
      ${C(365, [520, 0, 880, 1080], [0, 0, 760, 932])}
      <clipPath id="c7"><circle cx="1010" cy="300" r="230"/></clipPath>
      <circle cx="1010" cy="300" r="246" fill="url(#tGreen)" stroke="#fff" stroke-width="8"/>
      <g clip-path="url(#c7)">${C(420, [600, 300, 720, 720], [780, 70, 460, 460])}</g>
      <rect y="470" width="1280" height="250" fill="url(#tBotFade)"/>
      ${T('WHY VISHNU', 640, 600, 112, '#fff', { rot: -2 })}
      ${T('LOVES TULASI', 640, 700, 104, 'url(#tGreen)', { rot: -2, glow: '#17a84a' })}
      ${tag('NO PUJA WITHOUT IT', 1010, 70, 32, '#ff2a6a', '#fff', { rot: 4 })}
      <rect width="1280" height="720" fill="url(#tVig)"/>`),
};

// ---------- SHORTS (1080x1920) ----------
const shorts = {
  short1_turned_vishnu_to_stone: () => {
    const e = zig(-20, 1040, 1100, 940, 7, 30);
    return V(`<rect width="1080" height="1920" fill="#0b1640"/>
      <clipPath id="s1t"><path d="M-10 -10 L1090 -10 L${[...e].reverse().map(p => p.join(' ')).join(' L')}Z"/></clipPath>
      <g clip-path="url(#s1t)"><rect width="1080" height="1100" fill="#ff6a00"/>${rays(540, 560, 34, 1300, '#ffe14d', .35)}${C(300, [480, 40, 960, 900], [-60, 40, 1200, 1125])}</g>
      <clipPath id="s1b"><path d="M-10 1930 L1090 1930 L${[...e].reverse().map(p => p.join(' ')).join(' L')}Z"/></clipPath>
      <g clip-path="url(#s1b)">${rays(540, 1500, 30, 1200, '#5fd8ff', .16)}${C(320, [700, 30, 520, 760], [100, 940, 880, 1286], 'filter="url(#tStoneF)"')}</g>
      ${bolt(-20, 1040, 1100, 940, 7, 30, '#ff2a2a', 9)}
      <rect y="0" width="1080" height="360" fill="url(#tTopFade)"/>
      ${T('SHE CURSED', 540, 200, 150, 'url(#tGold)', { rot: -3 })}
      <rect y="1500" width="1080" height="420" fill="url(#tBotFade)"/>
      ${T('VISHNU', 540, 1700, 210, 'url(#tBlue)', { rot: -3, glow: '#2a6bff' })}
      ${tag('INTO STONE!', 540, 1820, 64, '#e0002a', '#fff', { rot: -3 })}
      <rect width="1080" height="1920" fill="url(#tVig)"/>`);
  },
  short2_why_stone_shaligram: () => V(`<rect width="1080" height="1920" fill="#1a0610"/>
      ${C(365, [500, 0, 920, 1000], [-160, 160, 1400, 1520])}
      <rect y="900" width="1080" height="620" fill="url(#tBotFade)"/>
      <rect y="1100" width="1080" height="820" fill="#2a0a14"/>
      <rect y="0" width="1080" height="420" fill="url(#tTopFade)"/>
      ${T('WHY IS VISHNU', 540, 170, 128, '#fff', { rot: -3 })}
      ${T('A STONE?', 540, 340, 190, 'url(#tStone)', { rot: -3, glow: '#7a1bd6' })}
      <g>${C(323, [600, 260, 720, 560], [-60, 1100, 1200, 933])}</g>${bolt(-20, 1110, 1100, 1090, 7, 24, '#ffd23f', 8)}
      ${tag('SHALIGRAM', 540, 1820, 72, '#7a1bd6', '#fff', { rot: -3 })}
      <rect width="1080" height="1920" fill="url(#tVig)"/>`),
};

module.exports = { ...long, ...shorts };
