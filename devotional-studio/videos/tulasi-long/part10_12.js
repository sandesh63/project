// Parts 10–12: Tulasi Vivah today, the shloka, the outro.
const K = require('./common.js');
const { A, C, cam, BG, breathe, sway, blink, lampDiya, burst, stars, clamp, lerp, ease, prog, noise, makeFrame } = K;
const film = (S, CAPS, DURATION, flashes = []) => {
  const fx = (t) => { const f = Math.max(0, ...flashes.map(([at, k]) => k * clamp(1 - Math.abs(t - at) / .2))); return f > 0 ? `<rect width="${K.W}" height="${K.H}" fill="#fff8ea" opacity="${f.toFixed(3)}"/>` : ''; };
  return { W: K.W, H: K.H, FPS: K.FPS, DURATION, frame: makeFrame(S, CAPS, fx), CAPS, SHOTS: S.map((s, i) => ({ n: i + 1, a: s.a, b: s.b })) };
};
// Tulasi plant dressed as a bride (red chunri) + Shaligram groom on a small swing, sugarcane mandap
const sugarcane = (x) => `<g transform="translate(${x},0)"><path d="M0 1000 L 0 300" stroke="#5a8a2a" stroke-width="14"/>${[400, 520, 640, 760, 880].map(y => `<path d="M-8 ${y} L 8 ${y}" stroke="#3a5a1a" stroke-width="4"/>`).join('')}
  <path d="M0 300 C -60 260 -100 280 -140 240 M0 300 C 60 250 110 270 150 230 M0 320 C -40 270 -40 220 -70 180" stroke="#3a8a2a" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;
function vivah(t, bride = 1, shali = 1) {
  const chunri = bride > 0 ? `<g opacity="${bride}"><path d="M860 560 C 880 480 1040 480 1060 560 L 1080 760 L 840 760Z" fill="#c8201a" opacity=".82" stroke="#7a0d0c" stroke-width="2"/>
    <path d="M860 560 C 880 480 1040 480 1060 560" stroke="url(#gold)" stroke-width="8" fill="none"/>${[...Array(12)].map((_, i) => `<circle cx="${870 + i * 18}" cy="${760}" r="3" fill="url(#gold)"/>`).join('')}
    ${[...Array(6)].map((_, i) => `<circle cx="${890 + i * 28}" cy="${620 + (i % 2) * 40}" r="2.6" fill="#f2c14e"/>`).join('')}</g>` : '';
  return `${BG('url(#dawnSky)')}<circle cx="960" cy="420" r="260" fill="url(#sunDisc)"/>
    <path d="M-900 760 Q 480 720 960 750 T 2800 740 L 2800 1900 L -900 1900Z" fill="url(#floorStone)"/>
    ${[...Array(4)].map((_, k) => `<ellipse cx="960" cy="1010" rx="${300 - k * 60}" ry="${64 - k * 13}" fill="none" stroke="${['#e8344e', '#f39a1e', '#fff6e0', '#1f8a52'][k]}" stroke-width="7" stroke-dasharray="${8 + k * 2} ${6 + k}"/>`).join('')}
    ${sugarcane(640)}${sugarcane(1280)}
    <path d="M640 300 Q 960 220 1280 300" stroke="#f39a1e" stroke-width="16" stroke-dasharray="10 4" fill="none"/>
    ${[...Array(9)].map((_, i) => `<path d="M${680 + i * 70} ${292 - Math.sin(i / 8 * Math.PI) * 60} l 0 50" stroke="#f39a1e" stroke-width="8" stroke-dasharray="6 3"/>`).join('')}
    ${A.tulasiKatte(900, 985, 1.0, 11, 1)}<g transform="translate(-60,0)">${chunri}</g>
    <g opacity="${shali}">${A.shaligram(1150, 930, .42, .5)}<path d="M1120 870 Q 1150 850 1180 870" stroke="#f39a1e" stroke-width="8" fill="none" stroke-dasharray="6 3"/></g>
    ${[0, 1, 2, 3].map(i => lampDiya(780 + i * 120, 1050, .45, t, i)).join('')}`;
}
const P10 = [
  { a: 0, b: 5.8, f: (t) => cam(`${BG('url(#nightSky)')}${stars(6)}<circle cx="1520" cy="330" r="64" fill="#fff4d6"/><circle cx="1520" cy="330" r="150" fill="#fff2c8" opacity=".12" filter="url(#softGlow)"/><path d="M930 230 A 64 64 0 1 0 1000 300 A 50 50 0 1 1 930 230Z" fill="#0c1030" opacity=".0"/>
      ${A.templeSilhouette(960, 1000, .9, '#0c0a24')}${[...Array(40)].map((_, i) => { const r = A.rng(100 + i * 13); return lampDiya(200 + (i % 20) * 80, 940 + Math.floor(i / 20) * 60, .25, t, i); }).join('')}`,
    { s: lerp(1.0, 1.08, prog(t, 0, 5.8)), fy: 560 }), title: [1.0, 5.6, 'DEV UTHANI EKADASHI', 180, 80] },
  { a: 5.8, b: 9.4, f: (t) => { const o = prog(t, 7.2, 8.8, ease.inOut);
    return cam(`${BG('#050a22')}<ellipse cx="960" cy="560" rx="800" ry="500" fill="url(#blueGlow)" opacity="${.4 + o * .4}"/>
      <path d="M-200 900 Q 960 760 2120 900 L 2120 1300 L -200 1300Z" fill="#1a3a8a"/>${[...Array(5)].map((_, i) => `<path d="M${i * 420 - 200} ${880 + (i % 2) * 20} q 100 -30 200 0" stroke="#9fc0ff" stroke-width="3" fill="none" opacity=".5"/>`).join('')}
      ${breathe(C.vishnu(960, 150, .82, { id: 'p10v', eyes: o > .5 ? 'open' : 'closed', mouth: 'smile' }), t, 960, 950)}`, { s: lerp(1.0, 1.1, prog(t, 5.8, 9.4)), fy: 480 }); } },
  { a: 9.4, b: 12.0, f: (t) => cam(vivah(t, 0, 0), { s: lerp(1.0, 1.05, prog(t, 9.4, 12.0)), fy: 640 }), title: [10.5, 12.0, 'TULASI VIVAH', 180, 100] },
  { a: 12.0, b: 14.8, f: (t) => cam(vivah(t, prog(t, 12.4, 13.6), 0), { s: 1.6, fx: 960, fy: 640 }) },
  { a: 14.8, b: 18.5, f: (t) => cam(vivah(t, 1, prog(t, 15.0, 16.0)) + K.N.petalsAnim(61, 40, 1920, 1080, t, { speed: 60 }), { s: lerp(1.6, 1.1, prog(t, 14.8, 18.5, ease.inOut)), fx: 1020, fy: 680 }) },
  { a: 18.5, b: 21.6, f: (t) => cam(`${BG('#050a22')}<ellipse cx="960" cy="480" rx="800" ry="600" fill="url(#blueGlow)" opacity=".7"/>${breathe(C.vishnu(960, 60, 2.2, { id: 'p10vc', eyes: 'lowered', mouth: 'smile' }), t, 960, 1300, .006)}`, { s: 1.0, fy: 360 }) },
  { a: 21.6, b: 26.1, f: (t) => { const g = prog(t, 23.5, 25.4);
    return cam(`${BG('#0a0604')}<ellipse cx="960" cy="560" rx="${400 + g * 400}" ry="${400 + g * 300}" fill="url(#lampGlow)" opacity="${.6 + g * .3}"/><g opacity="${.3 + g * .5}">${C.tulasi(960, 150, .9, { pose: 'anjali', eyes: 'closed', mouth: 'smile', id: 'p10g' })}</g>
      ${A.tulasiKatte(960, 1080, .9, 11, g)}${K.N.embersAnim(9, 60, 1920, 1080, t, { color: '#ffe08a', speed: 40 })}`, { s: 1.0, fy: 560 }); } },
  { a: 26.1, b: 28.7, f: (t) => cam(`${K.courtyard(t)}${A.tulasiKatte(960, 985, 1.05, 11, 1)}`, { s: lerp(1.0, 1.06, prog(t, 26.1, 28.7)), fy: 600 }) },
  { a: 28.7, b: 30.4, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="translate(960,560) rotate(${Math.sin(t * 2) * 40})">${[...Array(5)].map((_, i) => `<g transform="translate(${(i - 2) * 60},0)">${A.flame(0, 0, 1.2, noise(t, i) * 3)}</g>`).join('')}<path d="M-160 20 Q 0 70 160 20 L 120 40 Q 0 80 -120 40Z" fill="url(#brass)"/></g>`, { s: 1.0, fy: 560 }) },
  { a: 30.4, b: 31.9, f: (t) => cam(`${BG('url(#bgTemple)')}<ellipse cx="960" cy="640" rx="320" ry="80" fill="url(#brass)" stroke="#5a3408" stroke-width="3"/>
      ${[...Array(9)].map((_, i) => `<circle cx="${820 + (i % 5) * 70}" cy="${610 + Math.floor(i / 5) * 40}" r="22" fill="${['#ffe8b0', '#f39a1e', '#fff6e0'][i % 3]}" stroke="#a8641a"/>`).join('')}
      <g transform="translate(960,560)"><path d="M0 0 C -16 -12 -16 -44 0 -60 C 16 -44 16 -12 0 0Z" fill="#3fa35a" stroke="#0e3d1f" stroke-width="2"/></g>`, { s: 1.1, fy: 600 }) },
  { a: 31.9, b: 35.7, f: (t) => { const g = prog(t, 33.6, 35.0);
    return cam(`${K.courtyard(t)}<ellipse cx="960" cy="560" rx="${300 + g * 300}" ry="${300 + g * 200}" fill="url(#blueGlow)" opacity="${g * .6}"/>${A.tulasiKatte(860, 985, 1.0, 11, 1)}
      <g opacity="${g}">${C.vishnu(1250, 380, .55, { id: 'p10vf', eyes: 'lowered', mouth: 'smile' })}</g>`, { s: lerp(1.0, 1.1, prog(t, 31.9, 35.7)), fx: 1000, fy: 620 }); } },
];
const C10 = [
  [-0.3, 5.6, 'Every year, on Shukla Ekadashi in the month of Kartik — ★Dev Uthani Ekadashi★…'],
  [5.8, 9.2, 'when Lord Vishnu ★wakes★ from his cosmic sleep…'], [9.4, 11.8, 'homes celebrate ★Tulasi Vivah★.'],
  [12.0, 14.6, 'Tulasi is adorned like a ★bride★…'], [14.8, 18.3, 'and married to the ★Shaligram★.'],
  [18.5, 21.4, 'This is the Lord’s promise.'], [21.6, 25.9, 'What the devotee lost, the Lord made ★immortal★.'],
  [26.1, 28.6, 'That is why Tulasi is in every courtyard…'], [28.7, 30.3, 'in every ★aarti★…'], [30.4, 31.8, 'in every offering…'],
  [31.9, 35.6, 'because where there is Tulasi… there is ★Vishnu★.'],
];

// ---- Part 11 · shloka (10.8 s): parchment card, words glow as sung
const SH = [['वृन्दायै', 0], ['तुलसीदेव्यै', 1.4], ['प्रियायै', 3.3], ['केशवस्य च।', 4.1], ['विष्णुभक्तिप्रदे', 5.1], ['देवि', 6.9], ['सत्यवत्यै', 8.4], ['नमो नमः॥', 9.6]];
const P11 = [{ a: 0, b: 10.8, f: (t) => {
  const line = (words, y) => { let x = 0; const sizes = words.map(([w]) => w.length * 30 + 30); const tot = sizes.reduce((a, b) => a + b, 0); x = 960 - tot / 2;
    return words.map(([w, at], i) => { const on = prog(t, at - .1, at + .4); const cx = x + sizes[i] / 2; x += sizes[i];
      return `<text x="${cx}" y="${y}" text-anchor="middle" font-family="'Noto Serif Devanagari', serif" font-weight="800" font-size="62" fill="${on > .5 ? '#ffd66b' : '#6a4a20'}" ${on > .5 ? 'filter="url(#glow)"' : ''}>${w}</text>`; }).join(''); };
  return cam(`${BG('#1a0c08')}<ellipse cx="960" cy="560" rx="900" ry="560" fill="url(#lampGlow)" opacity=".4"/>
    <rect x="300" y="250" width="1320" height="520" rx="24" fill="#f4e2bc" stroke="url(#gold)" stroke-width="10"/>
    <rect x="330" y="280" width="1260" height="460" rx="16" fill="none" stroke="#c8922a" stroke-width="2" stroke-dasharray="10 8"/>
    ${A.tulasiKatte(1700, 1060, .55, 11, 1)}${lampDiya(220, 1000, .9, t, 3)}
    ${line(SH.slice(0, 4), 450)}${line(SH.slice(4), 600)}
    <text x="960" y="700" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="30" fill="#6a4a20">Vrindāyai Tulasī-devyai priyāyai Keśavasya ca · Viṣṇu-bhakti-prade devi satyavatyai namo namaḥ</text>`, { s: lerp(1.0, 1.04, prog(t, 0, 10.8)), fy: 540 }); } }];
const C11 = [[0, 10.6, 'To Vrinda, Tulasi Devi, beloved of Keshava, giver of devotion to Vishnu — salutations again and again.']];

// ---- Part 12 · outro (24.8 s)
const P12 = [
  { a: 0, b: 5.0, f: (t) => cam(`${K.courtyard(t)}${A.tulasiKatte(960, 985, 1.05, 11, 1)}`, { s: lerp(1.15, 1.0, prog(t, 0, 5, ease.out)), fy: 600 }) },
  { a: 5.0, b: 10.1, f: (t) => cam(`${K.courtyard(t)}<ellipse cx="960" cy="560" rx="500" ry="460" fill="url(#lampGlow)" opacity=".5"/>${A.tulasiKatte(960, 985, 1.05, 11, 1)}
      <g opacity="${prog(t, 7.4, 8.6) * .5}">${C.tulasi(960, 140, .85, { pose: 'anjali', eyes: 'closed', mouth: 'smile', id: 'p12g' })}</g>`, { s: 1.0, fy: 600 }) },
  { a: 10.1, b: 13.3, f: (t) => cam(`${BG('#050a22')}<ellipse cx="960" cy="480" rx="800" ry="600" fill="url(#blueGlow)" opacity=".7"/>${breathe(C.vishnu(960, 120, 1.25, { id: 'p12v', eyes: 'lowered', mouth: 'smile' }), t, 960, 1300, .008)}
      <g transform="translate(960,470) scale(1.1)"><circle r="120" fill="url(#lampGlow)"/><path d="M0 40 C -34 20 -36 -30 0 -60 C 36 -30 34 20 0 40Z" fill="#3fa35a" stroke="#0e3d1f" stroke-width="2"/></g>`, { s: 1.15, fy: 470 }) },
  { a: 13.3, b: 18.9, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 3} 960 330)">${A.mandalaGlow(960, 330, 560, '#ffcf6a', .5)}</g>${breathe(C.tulasi(960, 140, .93, { pose: 'anjali', eyes: blink(t, 'open', .4), mouth: 'smile', id: 'p12t' }), t, 960, 1000)}
      ${K.N.petalsAnim(9, 30, 1920, 1080, t)}`, { s: lerp(1.0, 1.08, prog(t, 13.3, 18.9)), fy: 500 }), title: [17.3, 18.9, 'JAI TULASI MATA', 170, 90] },
  { a: 18.9, b: 24.8, f: (t) => cam(`${K.courtyard(t, 'url(#nightSky)')}${BG('#06081e', .5)}${stars(5)}<ellipse cx="960" cy="640" rx="320" ry="300" fill="url(#lampGlow)" opacity=".6"/>${A.tulasiKatte(960, 985, 1.05, 11, 1)}
      ${K.N.petalsAnim(29, 14, 1920, 1080, t, { speed: 30, op: .7 })}`, { s: lerp(1.0, .92, prog(t, 18.9, 24.8)), fy: 600 }), title: [23.7, 24.8, 'JAI SHRI HARI', 170, 90] },
];
const C12 = [
  [-0.3, 4.9, 'The next time you offer water to Tulasi, remember…'], [5.0, 10.0, 'she is not just a plant. She is the ★immortal story★ of a devotee…'],
  [10.1, 13.2, 'whom the Lord held close to his ★heart★.'], [13.3, 16.0, 'If this story touched your heart, write in the comments…'],
  [16.1, 18.8, '★"Jai Tulasi Mata"★'], [19.0, 23.5, 'And ★subscribe★ for more divine stories.'], [23.7, 24.7, '★Jai Shri Hari★.', 1.2],
];

module.exports = { part10: film(P10, C10, 35.7), part11: film(P11, C11, 10.85), part12: film(P12, C12, 24.8) };
