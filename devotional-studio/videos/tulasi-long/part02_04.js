// Parts 2, 3 and 4 of the long video. Each exported as its own film module (timed to its voice part).
const K = require('./common.js');
const BM = require('../../style-frames/brahma.js');
const { A, C, MV, JL, RI, SB, KD, cam, BG, breathe, sway, blink, lampDiya, burst, shieldDome, stars, kailash, ocean, clamp, lerp, ease, prog, noise, makeFrame } = K;

// simple Brahma (Tridev shot only): rishi body recoloured golden, gold crown, Vedas, standing on a lotus
function brahma(x, y, s, t) {
  let r = RI.rishi(x, y, s, { id: 'brahma', eyes: 'lowered', mouth: 'smile' });
  // fuller build like Vishnu / Mahadev: torso+arms x1.24 (rishi base 0.9 -> 1.12), legs+dhoti x1.2; hands and staff follow the wider arms
  r = r.replace('transform="scale(0.9,1)"', 'transform="scale(1.12,1)"');
  r = r.replace('Z" fill="url(#wood)" stroke="#2a1606"/>', 'Z" fill="url(#wood)" stroke="#2a1606"/><g transform="scale(1.2,1)">');
  r = r.replace(/(<path d="M-10 430 L 10 430 L 14 700 L -14 700Z"[^>]*>)/, '$1</g>');
  r = r.replace('<rect x="-108" y="40"', '<rect x="-133" y="40"').replace('<path d="M-102 40 C -118 30 -122 10 -108 0 C -94 8 -90 28 -102 40Z"', '<path d="M-127 40 C -143 30 -147 10 -133 0 C -119 8 -115 28 -127 40Z"');
  r = r.replace('translate(-100.8,214)', 'translate(-125.4,214)').replace('translate(67,400)', 'translate(82.4,400)').replace('translate(63,390)', 'translate(78.4,390)');
  r = r.replace(/url\(#rSkinL\)/g, 'url(#brSkinL)').replace(/url\(#rSkin\)/g, 'url(#brSkin)').replace(/url\(#saffron\)/g, 'url(#brCloth)');
  return `<defs><radialGradient id="brSkin" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#ffd8a0"/><stop offset=".62" stop-color="#e8a860"/><stop offset="1" stop-color="#b47430"/></radialGradient>
    <linearGradient id="brSkinL" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="#ffd8a0"/><stop offset=".45" stop-color="#e8a860"/><stop offset="1" stop-color="#b47430"/></linearGradient>
    <linearGradient id="brCloth" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8344e"/><stop offset="1" stop-color="#8a0e24"/></linearGradient></defs>
    <g transform="translate(${x},${y + 935 * s}) scale(${s * 2.2})">${A.lotus(0, 0, 1, '#f6b6c6', '#c64f73')}</g>
    ${r}
    <g transform="translate(${x},${y - 40 * s}) scale(${s})"><path d="M-46 40 Q 0 24 46 40 L 44 14 Q 0 0 -44 14Z" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.6"/>
      <path d="M-36 14 L -26 -36 C -14 -50 14 -50 26 -36 L 36 14Z" fill="url(#goldV)" stroke="#7a4a10" stroke-width="1.4"/><circle cy="-12" r="6" fill="#d1261c"/></g>
    <g transform="translate(${x + 60 * s},${y + 390 * s}) scale(${s})"><rect x="-34" y="-12" width="68" height="24" rx="4" fill="#d8b878" stroke="#6a4a20" stroke-width="2"/><path d="M-26 -4 L 26 -4 M-26 4 L 26 4" stroke="#7a5a2a" stroke-width="1.4"/></g>`;
}

// ---------- PART 2 · intro (8.3 s)
const P2 = [
  { a: 0, b: 2.9, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 4} 960 420)">${A.mandalaGlow(960, 420, 560, '#ffcf6a', .5)}</g>
      ${A.nilavilakku(660, 1080, 1.1, noise(t, 2) * 3)}${A.nilavilakku(1260, 1080, 1.1, noise(t, 5) * 3)}${lampDiya(960, 760, 1.4, t, 2)}${K.N.embersAnim(3, 40, 1920, 1080, t)}`,
    { s: lerp(1.0, 1.06, prog(t, 0, 2.9)), fy: 520 }) },
  { a: 2.9, b: 8.3, f: (t) => cam(`${K.courtyard(t)}${A.tulasiKatte(960, 985, 1.05, 11, 1)}${K.N.petalsAnim(29, 20, 1920, 1080, t, { speed: 40, op: .8 })}`,
    { s: lerp(1.08, 1.0, prog(t, 2.9, 8.3, ease.out)), fy: 600 }), title: [2.9, 8.2, 'TULASI DEVI', 200, 130] },
];
const C2 = [[-0.3, 1.1, 'Namaskar.', 1.2], [1.2, 5.4, 'Today we hear the complete story of ★Tulasi Devi★…'], [5.6, 8.2, 'from beginning to end.']];

// ---------- PART 3 · Jalandhar's birth (51.5 s)
const P3 = [
  // 0–3.5 "versions differ…": scrolls / palm-leaf manuscripts in lamplight
  { a: 0, b: 3.55, f: (t) => cam(`${BG('#1a0c08')}<ellipse cx="960" cy="560" rx="700" ry="480" fill="url(#lampGlow)" opacity=".6"/>
      ${[0, 1, 2].map(i => `<g transform="translate(${720 + i * 240},${520 + (i % 2) * 40}) rotate(${-6 + i * 6})"><rect x="-150" y="-26" width="300" height="52" rx="8" fill="#d8b878" stroke="#6a4a20" stroke-width="3"/>
        ${[...Array(4)].map((_, k) => `<path d="M-130 ${-12 + k * 8} L 130 ${-12 + k * 8}" stroke="#7a5a2a" stroke-width="1.4" stroke-dasharray="${6 + k} 4"/>`).join('')}<circle cx="-150" cy="0" r="8" fill="#6a4a20"/><circle cx="150" cy="0" r="8" fill="#6a4a20"/></g>`).join('')}
      ${lampDiya(960, 760, 1.2, t, 4)}`, { s: lerp(1.0, 1.08, prog(t, 0, 3.5)), fy: 560 }) },
  // 3.5–6.8 "…but the core story is one": the sacred flame
  { a: 3.55, b: 6.8, f: (t) => cam(`${BG('#0a0406')}<ellipse cx="960" cy="560" rx="500" ry="460" fill="url(#lampGlow)" opacity=".85"/>${lampDiya(960, 640, 2.4, t, 6)}`, { s: 1 + (t - 3.55) * .02, fy: 560 }) },
  // 6.8–10.8 Indra arrives proud at Kailash
  { a: 6.8, b: 10.8, f: (t) => cam(`${kailash(t)}${breathe(RI.indra(lerp(700, 860, prog(t, 6.8, 10.5)), 330, .55, { id: 'p3i', eyes: 'lowered', mouth: 'smile' }), t, 860, 900)}`,
    { s: lerp(1.0, 1.1, prog(t, 6.8, 10.8)), fy: 520 }) },
  // 10.8–16.1 Mahadev opens his third eye (15.1)
  { a: 10.8, b: 16.1, f: (t) => { const eye = t > 14.9 ? 'angry' : 'lowered';
    return cam(`${kailash(t)}<ellipse cx="960" cy="400" rx="600" ry="500" fill="#ff8a2a" opacity="${prog(t, 14.9, 15.8) * .35}" filter="url(#softGlow)"/>
      ${breathe(MV.mahadevFull(960, 150, 1.2, { id: 'p3m', eyes: eye, mouth: 'soft', t }), t, 960, 1200, .008)}`,
      { s: lerp(1.0, 1.35, prog(t, 13.5, 15.4, ease.inOut)), fy: lerp(520, 280, prog(t, 13.5, 15.4, ease.inOut)) }); } },
  // 16.1–22.2 the terrible fire that could burn the three worlds
  { a: 16.1, b: 22.2, f: (t) => { const g = prog(t, 16.2, 19.0);
    const fl = [...Array(14)].map((_, i) => { const x = 960 + (i - 6.5) * 120, h = (200 + (i * 53) % 220) * g + Math.sin(t * 6 + i) * 30; return `<path d="M${x - 70} 1100 C ${x - 60} ${1100 - h * .5} ${x - 14} ${1100 - h * .7} ${x} ${1100 - h} C ${x + 14} ${1100 - h * .7} ${x + 60} ${1100 - h * .5} ${x + 70} 1100Z" fill="url(#flame)"/>`; }).join('');
    return cam(`${BG('url(#redEnergy)')}<g transform="rotate(${t * 30} 960 420)">${A.mandalaGlow(960, 420, 900, '#ffb04a', .45)}</g>${fl}${K.N.embersAnim(17, 120, 1920, 1080, t, { color: '#ffcf6a', speed: 200 })}`,
      { s: 1.05, fy: 540, ...K.shake(t, 0, 4 + g * 6) }); } },
  // 22.2–26.5 at Indra's prayer, Mahadev casts the fire into the ocean
  { a: 22.2, b: 26.5, f: (t) => { const p = prog(t, 24.6, 26.3, ease.in);
    return cam(`${ocean(t)}<g transform="translate(${lerp(960, 1300, p)},${lerp(300, 760, p)}) scale(${lerp(1.4, .5, p)})"><circle r="120" fill="url(#lampGlow)"/>${A.flame(0, 40, 2.2, Math.sin(t * 9) * 4)}</g>
      ${p >= .98 ? burst(1300, 760, prog(t, 26.2, 26.5), 40, 3, '#ffd27a', 200) : ''}`, { s: 1.0, fy: 540 }); } },
  // 26.5–30.9 in the waves the fire becomes a child
  { a: 26.5, b: 30.9, f: (t) => { const b = prog(t, 28.6, 30.3);
    return cam(`${ocean(t)}<ellipse cx="960" cy="700" rx="${300 + b * 100}" ry="${240 + b * 80}" fill="url(#fireGlow)" opacity="${.6 + b * .3}"/>
      <g opacity="${1 - b}" transform="translate(960,760) scale(1.6)">${A.flame(0, 0, 1.6, Math.sin(t * 9) * 4)}</g>
      <g opacity="${b}">${SB.baby(960, 520, 1.3, { mood: 'calm', id: 'p3b' })}</g>`, { s: lerp(1.0, 1.25, prog(t, 26.5, 30.9)), fy: 640 }); } },
  // 30.9–35.3 he cried so loudly the three worlds trembled
  { a: 30.9, b: 35.3, f: (t) => cam(`${ocean(t)}<ellipse cx="960" cy="640" rx="600" ry="520" fill="url(#fireGlow)" opacity=".85"/>
      ${[0, 1, 2].map(k => { const ph = ((t * 1.4 + k * .33) % 1); return `<circle cx="960" cy="560" r="${120 + ph * 700}" fill="none" stroke="#ffe7a0" stroke-width="${6 * (1 - ph)}" opacity="${(1 - ph) * .8}"/>`; }).join('')}
      ${SB.baby(960, 300, 2.1, { mood: 'cry', id: 'p3c' })}`, { s: 1.0, fy: 560, ...K.shake(t, 0, prog(t, 32.0, 34.5) * 10) }) },
  // 35.3–39.2 Samudra Dev adopts the child
  { a: 35.3, b: 39.2, f: (t) => cam(`${ocean(t, 'url(#skyDay)')}${breathe(SB.samudra(960, 170, .9, { id: 'p3s', pose: 'hold', babyMood: 'calm', waves: false, mouth: 'smile', t }), t, 960, 980)}
      <g transform="translate(960,0)">${SB.waves(t, 1100, 760, 4)}</g>`, { s: lerp(1.0, 1.12, prog(t, 35.3, 39.2)), fy: 470 }) },
  // 39.2–44.9 the name: JALANDHAR, "born from water"
  { a: 39.2, b: 44.9, f: (t) => cam(`${ocean(t, 'url(#skyDay)')}<ellipse cx="960" cy="540" rx="500" ry="420" fill="url(#fireGlow)" opacity=".7"/>${SB.baby(960, 300, 2.0, { mood: 'calm', id: 'p3n' })}
      <g transform="translate(960,0)">${SB.waves(t, 1100, 860, 5)}</g>`, { s: lerp(1.0, 1.08, prog(t, 39.2, 44.9)), fy: 520 }), title: [40.9, 44.8, 'JALANDHAR', 170, 110] },
  // 44.9–47.5 born of Mahadev's radiance: baby glows, fire mark echoes the third eye
  { a: 44.9, b: 47.5, f: (t) => cam(`${BG('#0a0406')}<g transform="rotate(${t * 8} 960 480)">${A.mandalaGlow(960, 480, 620, '#ff9a3a', .5)}</g>${SB.baby(960, 220, 2.6, { mood: 'calm', id: 'p3r', glow: 1 })}`,
    { s: lerp(1.0, 1.15, prog(t, 44.9, 47.5)), fy: 420 }) },
  // 47.5–51.5 he grows into a mighty asura king
  { a: 47.5, b: 51.5, f: (t) => { const g = prog(t, 47.6, 49.2);
    return cam(`${BG('url(#asuraBg)')}<path d="M760 980 L 760 300 Q 960 120 1160 300 L 1160 980Z" fill="url(#darkGold)" opacity=".85" stroke="#3a2406" stroke-width="4"/><path d="M800 980 L 800 320 Q 960 170 1120 320 L 1120 980Z" fill="#3a0a10"/>
      <g opacity="${1 - g}">${SB.baby(960, 520, 1.2, { mood: 'calm', id: 'p3g' })}</g>
      <g opacity="${g}">${breathe(JL.jalandharFull(960, 210, .8, { id: 'p3j', eyes: blink(t, 'open', .2) === 'closed' ? 'closed' : 'angry', mouth: 'smile' }), t, 960, 960)}</g>
      ${burst(960, 560, prog(t, 47.6, 48.6), 50, 8, '#ffd27a', 300)}${K.N.embersAnim(13, 50, 1920, 1080, t, { color: '#ffb04a', speed: 40 })}`,
      { s: lerp(1.15, 1.0, prog(t, 47.5, 51.5, ease.out)), fy: 540 }); } },
];
const C3 = [
  [-0.3, 3.4, 'The Puranas tell this story in different ways…'], [3.6, 6.4, 'but its heart is the same.'],
  [6.8, 10.7, 'Once, Indra, king of the gods, came to Kailash full of ★pride★.'],
  [10.8, 15.9, 'To break his pride, ★Mahadev★ opened his third eye.'],
  [16.1, 22.0, 'A fire burst out that could burn the ★three worlds★ to ash.'],
  [22.2, 26.4, 'At Indra’s plea, Mahadev cast the fire into the ★ocean★.'],
  [26.5, 30.8, 'In the waves… the fire became a ★child★.'],
  [30.9, 35.2, 'He cried so loudly… the three worlds ★trembled★.'],
  [35.3, 39.1, 'The ocean god, ★Samudra Dev★, took him as his son.'],
  [39.2, 44.8, 'He was named ★Jalandhar★ — born of water.'],
  [44.9, 47.4, 'Born of Mahadev’s radiance…'],
  [47.5, 51.4, 'he grew into a mighty ★asura king★.'],
];

// ---------- PART 4 · Vrinda (41.4 s)
const P4 = [
  // 0–4.6 Kalanemi's daughter, Vrinda
  { a: 0, b: 4.65, f: (t) => cam(`${BG('url(#asuraBg)')}<path d="M560 980 L 560 300 Q 760 120 960 300 L 960 980Z" fill="url(#kMetal)" opacity=".8"/><path d="M600 980 L 600 320 Q 760 170 920 320 L 920 980Z" fill="#2a0a1a"/>
      ${breathe(KD.kalanemi(760, 230, .75, { id: 'p4k', eyes: blink(t, 'open', .4) === 'closed' ? 'closed' : 'angry', mouth: 'smile' }), t, 760, 960)}
      <g opacity="${prog(t, 3.3, 4.0)}">${breathe(C.tulasi(1240, 260, .78, { pose: 'anjali', eyes: blink(t, 'lowered', .9), mouth: 'smile', id: 'p4v' }), t, 1240, 980)}</g>`,
    { s: lerp(1.0, 1.06, prog(t, 0, 4.6)), fx: lerp(860, 1000, prog(t, 2.8, 4.4, ease.inOut)), fy: 520 }), title: [3.5, 4.6, 'VRINDA', 160, 100] },
  // 4.6–6.4 born in an asura family
  { a: 4.65, b: 6.35, f: (t) => cam(`${BG('url(#asuraBg)')}${A.templeSilhouette(500, 1000, 1, '#1a0408')}${A.templeSilhouette(1420, 1000, .8, '#1a0408')}
      ${breathe(C.tulasi(960, 140, .93, { eyes: blink(t, 'open', .2), mouth: 'smile', id: 'p4a' }), t, 960, 1000)}`, { s: 1.02, fy: 520 }) },
  // 6.4–10.3 a devotee of Vishnu from childhood: she offers flowers to a small Vishnu idol
  { a: 6.35, b: 10.3, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 3} 1250 360)">${A.mandalaGlow(1250, 360, 420, '#bcd6ff', .4)}</g>
      <rect x="1150" y="760" width="200" height="60" rx="8" fill="#d9c7a3" stroke="#3b1c0e" stroke-width="3"/>
      ${C.vishnu(1250, 470, .3, { id: 'p4idol', eyes: 'lowered', mouth: 'smile' })}
      ${breathe(C.tulasi(780, 140, .93, { pose: 'anjali', eyes: blink(t, 'lowered', .6), mouth: 'smile', id: 'p4d' }), t, 780, 1000)}
      ${K.N.petalsAnim(51, 14, 1920, 1080, t, { speed: 30 })}`, { s: lerp(1.0, 1.1, prog(t, 6.35, 10.3)), fx: 1000, fy: 520 }) },
  // 10.3–12.9 her marriage to Jalandhar: garlands, fire altar
  { a: 10.3, b: 12.9, f: (t) => cam(`${BG('url(#loveGlow)')}
      <ellipse cx="960" cy="1000" rx="160" ry="40" fill="#5a2a14"/><g transform="translate(960,990)">${A.flame(0, 0, 2.2, Math.sin(t * 9) * 3)}</g>
      ${breathe(JL.jalandharFull(1180, 200, .9, { id: 'p4j', eyes: 'open', mouth: 'smile' }), t, 1180, 1100)}
      ${breathe(C.tulasi(740, 230, .92, { pose: 'anjali', eyes: 'lowered', mouth: 'smile', id: 'p4m' }), t, 740, 1100, .012, 1)}
      ${K.N.petalsAnim(53, 40, 1920, 1080, t, { speed: 50 })}`, { s: lerp(1.0, 1.06, prog(t, 10.3, 12.9)), fy: 520 }) },
  // 12.9–19.7 her lifelong vow: pativrata dharma
  { a: 12.9, b: 19.7, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 3} 960 330)">${A.mandalaGlow(960, 330, 560, '#ffcf6a', .55)}</g>
      ${C.tulasi(960, 110, 3.2, { pose: 'anjali', eyes: t > 17.5 ? 'closed' : blink(t, 'lowered', .3), mouth: 'soft', id: 'p4vow' })}
      <ellipse cx="960" cy="905" rx="600" ry="380" fill="url(#lampGlow)" opacity="${.5 + prog(t, 17.8, 18.6) * .4}"/>${lampDiya(960, 905, 1.6, t, 5, prog(t, 17.6, 18.2, ease.out))}`,
    { s: 1.04 + (t - 12.9) * .012, fy: 440 }) },
  // 19.7–26.3 while her vow held, no one could kill Jalandhar
  { a: 19.7, b: 26.35, f: (t) => cam(`${BG('url(#asuraBg)')}${shieldDome(960, 560, 300, 450, t, 1)}
      ${breathe(JL.jalandharFull(960, 210, .8, { id: 'p4s', eyes: 'angry', mouth: 'smile' }), t, 960, 960)}
      ${[0, 1, 2, 3].map(i => { const st = 21 + i * 1.2, p = prog(t, st, st + .5, ease.in); const ang = -2.4 + i * 1.3, x0 = 960 + Math.cos(ang) * 900, y0 = 560 + Math.sin(ang) * 700;
        return p > 0 && p < 1.3 ? `<path d="M${lerp(x0, 960 + Math.cos(ang) * 310, p)} ${lerp(y0, 560 + Math.sin(ang) * 460, p)} l ${-Math.cos(ang) * 60} ${-Math.sin(ang) * 60}" stroke="#ffe08a" stroke-width="6" stroke-linecap="round"/>${burst(960 + Math.cos(ang) * 310, 560 + Math.sin(ang) * 460, prog(t, st + .5, st + 1.0), 20, i, '#ffe7a0', 120)}` : ''; }).join('')}`,
    { s: 1.05, fy: 540 }) },
  // 26.35–31.2 not gods, not demons, not even the Trimurti
  { a: 26.35, b: 31.25, f: (t) => { const w = t < 27.8 ? 0 : t < 29.0 ? 1 : 2;
    return cam(`${BG(w === 0 ? 'url(#skyDay)' : w === 1 ? 'url(#asuraBg)' : '#050a22')}
      ${w === 0 ? `${K.clouds(860, 3)}${RI.indra(960, 200, .75, { id: 'p4i', eyes: 'wide', mouth: 'open' })}` : ''}
      ${w === 1 ? `${KD.kalanemi(960, 230, .75, { id: 'p4k2', eyes: 'wide', mouth: 'open' })}` : ''}
      ${w === 2 ? `<ellipse cx="960" cy="480" rx="800" ry="500" fill="url(#blueGlow)" opacity=".7"/>${C.vishnu(560, 300, .5, { id: 'p4t1', eyes: 'lowered' })}${MV.mahadevFull(1360, 300, .5, { id: 'p4t2', eyes: 'lowered', t })}
        ${BM.defs}${BM.brahma(960, 330, .5, { id: 'tri' })}` : ''}`, { s: 1.04, fy: 520 }); },
    title: [29.1, 31.2, 'TRIDEV', 150, 90] },
  // 31.25–35.9 before every battle she lit a lamp and prayed
  { a: 31.25, b: 35.9, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 4} 960 330)">${A.mandalaGlow(960, 330, 520, '#ffcf6a', .55)}</g>
      ${A.prabhavali(960, 780, 400, { flames: 25, thick: 30, pillar: 400 })}
      ${breathe(C.tulasi(960, 140, .93, { pose: 'anjali', eyes: 'closed', mouth: 'soft', id: 'p4p' }), t, 960, 1000)}
      ${A.nilavilakku(600, 1080, 1.0, noise(t, 2) * 3)}${A.nilavilakku(1320, 1080, 1.0, noise(t, 5) * 3)}${K.N.embersAnim(7, 50, 1920, 1080, t)}`,
    { s: lerp(1.0, 1.12, prog(t, 31.25, 35.9)), fy: 500 }) },
  // 35.9–41.4 her devotion becomes an invisible armour around Jalandhar
  { a: 35.9, b: 41.4, f: (t) => { const g = prog(t, 38.8, 40.6);
    return cam(`${BG('url(#asuraBg)')}${shieldDome(960, 560, 300 * (.3 + g * .7), 450 * (.3 + g * .7), t, g)}
      ${breathe(JL.jalandharFull(960, 210, .8, { id: 'p4a2', eyes: 'angry', mouth: 'smile' }), t, 960, 960)}
      <g opacity="${1 - prog(t, 38.0, 39.0)}"><ellipse cx="960" cy="560" rx="700" ry="500" fill="url(#lampGlow)" opacity=".5"/></g>
      ${K.N.embersAnim(9, 60, 1920, 1080, t, { color: '#ffe08a', speed: 50 })}`, { s: lerp(1.1, 1.0, prog(t, 35.9, 41.4, ease.out)), fy: 540 }); } },
];
const C4 = [
  [-0.3, 3.3, 'The asura king Kalanemi had a daughter…'], [3.5, 4.6, '★Vrinda★.', 1.3],
  [4.7, 6.3, 'Born in an asura family…'], [6.4, 10.2, 'yet from childhood, a devotee of Lord ★Vishnu★.'],
  [10.3, 12.8, 'Vrinda married ★Jalandhar★.'], [12.9, 17.4, 'And for her husband, she took a lifelong vow…'],
  [18.0, 19.6, '★Pativrata dharma★ — devotion to her husband.'], [19.7, 26.3, 'As long as her vow held, no one could ★kill★ Jalandhar.'],
  [26.5, 31.2, 'Not the gods… not the demons… not even the ★Tridev★.'],
  [31.3, 35.8, 'Before every battle, Vrinda lit a lamp and prayed.'],
  [35.9, 41.3, 'And her devotion became an ★invisible armour★ around Jalandhar.'],
];

const film = (S, CAPS, DURATION, flashes = []) => {
  const fx = (t) => { const f = Math.max(0, ...flashes.map(([at, k]) => k * clamp(1 - Math.abs(t - at) / .2))); return f > 0 ? `<rect width="${K.W}" height="${K.H}" fill="#fff8ea" opacity="${f.toFixed(3)}"/>` : ''; };
  return { W: K.W, H: K.H, FPS: K.FPS, DURATION, frame: makeFrame(S, CAPS, fx), CAPS, SHOTS: S.map((s, i) => ({ n: i + 1, a: s.a, b: s.b })) };
};
module.exports = {
  part02: film(P2, C2, 8.3),
  part03: film(P3, C3, 51.5, [[15.15, .6], [26.3, .7], [48.0, .5]]),
  part04: film(P4, C4, 41.4, [[3.5, .3]]),
};
