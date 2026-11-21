// Parts 5–9 of the long video.
const K = require('./common.js');
const RS = require('../../style-frames/ram-sita.js');
const { A, C, MV, JL, RI, NP, SB, KD, cam, BG, breathe, sway, blink, lampDiya, burst, shieldDome, stars, kailash, ocean, doorRoom, clamp, lerp, ease, prog, noise, makeFrame } = K;
const T = (o) => C.tulasi(o.x ?? 960, o.y ?? 110, o.s ?? 3.2, o);
const film = (S, CAPS, DURATION, flashes = []) => {
  const fx = (t) => { const f = Math.max(0, ...flashes.map(([at, k]) => k * clamp(1 - Math.abs(t - at) / .2))); return f > 0 ? `<rect width="${K.W}" height="${K.H}" fill="#fff8ea" opacity="${f.toFixed(3)}"/>` : ''; };
  return { W: K.W, H: K.H, FPS: K.FPS, DURATION, frame: makeFrame(S, CAPS, fx), CAPS, SHOTS: S.map((s, i) => ({ n: i + 1, a: s.a, b: s.b })) };
};
const asuraThrone = (gold = 'url(#darkGold)') => `<path d="M760 980 L 760 300 Q 960 120 1160 300 L 1160 980Z" fill="${gold}" opacity=".85" stroke="#3a2406" stroke-width="4"/><path d="M800 980 L 800 320 Q 960 170 1120 320 L 1120 980Z" fill="#3a0a10"/>`;
const army = (t, y = 900, col = '#14060a', n = 26, seed = 3) => { const r = A.rng(seed); let o = '';
  for (let i = 0; i < n; i++) { const x = -60 + i * (2040 / n) + r() * 30, s = .7 + r() * .5, bob = Math.sin(t * 4 + i) * 4;
    o += `<g transform="translate(${x},${y + bob}) scale(${s})" fill="${col}"><ellipse cx="0" cy="-118" rx="16" ry="18"/><path d="M-16 -128 L 0 -156 L 16 -128Z"/>
      <path d="M-26 -100 L 26 -100 L 30 0 L -30 0Z"/><rect x="${18 + r() * 6}" y="-210" width="5" height="210"/><path d="M${20} -216 l 6 -18 6 18z"/></g>`; } return o; };
const heaven = (t, burning = 0) => `${BG('url(#skyDay)')}${BG('url(#redEnergy)', burning * .55)}${K.clouds(880, 7)}
  <g transform="translate(960,860)">${[...Array(5)].map((_, i) => `<g transform="translate(${(i - 2) * 220},0)"><rect x="-30" y="-380" width="60" height="380" fill="#f4ecdc" stroke="#c8b894" stroke-width="3"/><rect x="-44" y="-400" width="88" height="24" fill="url(#gold)"/></g>`).join('')}
  <path d="M-520 -400 L 520 -400 L 460 -470 L -460 -470Z" fill="#f4ecdc" stroke="#c8b894" stroke-width="3"/><path d="M-300 -470 L 0 -560 L 300 -470Z" fill="url(#gold)"/></g>`;

// ================= PART 5 · arrogance (43.4 s)
const P5 = [
  { a: 0, b: 5.1, f: (t) => cam(`${BG('url(#asuraBg)')}${army(t, 1000, '#1a0610', 22, 2)}
      ${breathe(JL.jalandharFull(960, 230, .74, { id: 'p5j', eyes: 'angry', mouth: 'open' }), t, 960, 960)}${shieldDome(960, 570, 280, 420, t, .8)}${army(t, 1120, '#0a0204', 18, 5)}`,
    { s: lerp(1.0, 1.08, prog(t, 0, 5.1)), fy: 540, ...K.shake(t, 0, 2) }) },
  { a: 5.1, b: 6.8, f: (t) => cam(`${heaven(t, prog(t, 5.1, 6.6))}${army(t, 1040, '#1a0610', 26, 7)}${K.N.embersAnim(23, 60, 1920, 1080, t, { color: '#ffb04a', speed: 120 })}`, { s: 1.0, fy: 540 }) },
  { a: 6.8, b: 8.6, f: (t) => cam(`${BG('url(#skyDay)')}${BG('#1a0c20', .4)}${K.clouds(860, 3)}
      ${KD.agni(lerp(560, 400, prog(t, 6.8, 8.6)), 260, .66, { id: 'p5ag', eyes: 'wide', mouth: 'open' })}${RI.indra(lerp(960, 820, prog(t, 6.8, 8.6)), 230, .7, { id: 'p5in', eyes: 'lowered', mouth: 'soft', sad: true })}${KD.vayu(lerp(1360, 1220, prog(t, 6.8, 8.6)), 260, .66, { id: 'p5va', eyes: 'wide', mouth: 'open' })}`,
    { s: 1.0, fy: 500 }) },
  { a: 8.6, b: 13.1, f: (t) => cam(`${BG('url(#asuraBg)')}${asuraThrone()}<g transform="rotate(${t * 6} 960 420)">${A.mandalaGlow(960, 420, 620, '#ff6a2a', .35)}</g>
      ${breathe(JL.jalandharFull(960, 120, 1.6, { id: 'p5a', eyes: 'lowered', mouth: 'smile' }), t, 960, 1200, .008)}`, { s: lerp(1.0, 1.15, prog(t, 8.6, 13.1)), fy: lerp(540, 360, prog(t, 8.6, 13.1)) }), title: [11.4, 13.0, 'AHANKAAR', 170, 100] },
  { a: 13.1, b: 19.0, f: (t) => cam(`${BG('url(#asuraBg)')}${asuraThrone()}
      ${breathe(JL.jalandharFull(1240, 230, .74, { id: 'p5b', eyes: 'open', mouth: 'smile' }), t, 1240, 960)}
      ${breathe(NP.narada(680, 230, .74, { id: 'p5n', eyes: t > 16 ? 'lowered' : 'closed', mouth: t > 16 ? 'smile' : 'open', t }), t, 680, 960, .012, 1)}`,
    { s: 1.0, fx: 960, fy: 540 }), title: [13.8, 15.4, 'NARADA', 160, 90] },
  { a: 19.0, b: 24.8, f: (t) => cam(`${BG('#1a0408')}<ellipse cx="960" cy="420" rx="700" ry="500" fill="#c2311d" opacity=".25" filter="url(#softGlow)"/>
      ${JL.jalandharFull(960, 120, 2.9, { id: 'p5c', eyes: 'lowered', mouth: 'smile' })}
      <g opacity="${prog(t, 22.6, 23.6) * .55}">${NP.parvati(1500, 240, .7, { id: 'p5pv', eyes: 'lowered', mouth: 'smile', lotus: false })}</g>`, { s: lerp(1.0, 1.1, prog(t, 19.0, 24.8)), fy: 360 }) },
  // disguised as Mahadev: Mahadev's form with red asura glint, shadow of a spiked crown on the snow
  { a: 24.8, b: 28.6, f: (t) => cam(`${kailash(t)}<g transform="translate(1200,620) skewX(-30) scale(.7,.35)" filter="url(#shadowify)">${JL.jalandharFull(0, 0, 1, { id: 'p5sh' })}</g>
      ${breathe(MV.mahadevFull(960, 230, .8, { id: 'p5fake', eyes: 'angry', mouth: 'smile', t }), t, 960, 960)}
      <ellipse cx="960" cy="316" rx="60" ry="22" fill="#ff1a1a" opacity="${.15 + .1 * Math.sin(t * 6)}" filter="url(#softGlow)"/>`, { s: lerp(1.0, 1.08, prog(t, 24.8, 28.6)), fy: 520 }) },
  { a: 28.6, b: 31.7, f: (t) => cam(`${kailash(t, false)}<ellipse cx="960" cy="420" rx="600" ry="520" fill="#ffd8e0" opacity=".35" filter="url(#softGlow)"/>${breathe(NP.parvati(960, 180, .86, { id: 'p5p', eyes: 'lowered', mouth: 'smile' }), t, 960, 980)}`,
    { s: lerp(1.0, 1.08, prog(t, 28.6, 31.7)), fy: 500 }), title: [29.4, 31.6, 'JAGADAMBA', 160, 90] },
  { a: 31.7, b: 36.4, f: (t) => { const v = prog(t, 34.6, 35.8);
    return cam(`${kailash(t, false)}<g opacity="${1 - v}">${NP.parvati(960, 60, 2.6, { id: 'p5pa', eyes: t > 32.6 ? 'angry' : 'lowered', mouth: 'soft', lotus: false })}</g>
      <ellipse cx="960" cy="420" rx="${200 + v * 600}" ry="${300 + v * 500}" fill="#fff4e0" opacity="${v * .9}" filter="url(#softGlow)"/>${burst(960, 420, v, 70, 12, '#fff1d0', 500)}`, { s: 1.0, fy: 380 }); } },
  { a: 36.4, b: 43.4, f: (t) => cam(`${BG('url(#battleSky)')}${K.clouds(300, 11, '#2a2a4a', .8)}
      ${breathe(MV.mahadevFull(560, 260, .7, { id: 'p5m', eyes: 'angry', mouth: 'soft', t }), t, 560, 980)}
      ${breathe(JL.jalandharFull(1360, 270, .7, { id: 'p5j2', eyes: 'angry', mouth: 'open' }), t, 1360, 980)}
      ${Math.floor(t * 4) % 5 === 0 ? `<path d="M960 -100 L 900 260 L 990 280 L 920 640" stroke="#cfe6ff" stroke-width="6" fill="none" filter="url(#glow)"/>` : ''}${K.clouds(980, 14, '#3a3a5a', .9)}`,
    { s: lerp(1.0, 1.12, prog(t, 36.4, 43.4)), fy: 520, ...K.shake(t, 0, prog(t, 37.4, 38.4) * 6) }) },
];
const C5 = [
  [-0.3, 4.9, 'Protected by Vrinda’s power, Jalandhar won ★war after war★.'], [5.2, 6.7, 'He seized ★heaven★.'], [6.8, 8.4, 'The gods wandered, homeless.'],
  [8.6, 10.9, 'But with power came…'], [11.4, 12.9, '★arrogance★.', 1.25],
  [13.1, 18.9, 'One day, the sage ★Narada★ praised Mata Parvati’s beauty before Jalandhar.'],
  [19.0, 24.6, 'A sinful desire rose in his heart — he wanted ★Parvati★.'],
  [24.8, 28.4, 'Disguised as ★Mahadev★, he went to Kailash.'],
  [28.6, 31.5, 'But who can deceive the ★Mother of the Universe★?'],
  [31.7, 36.2, 'Mata Parvati saw through the trick at once… and ★vanished★.'],
  [36.4, 43.3, 'Now war was certain. Before Jalandhar stood… ★Mahadev★ himself.'],
];

// ================= PART 6 · even Mahadev could not win (40.9 s)
const P6 = [
  { a: 0, b: 7.3, f: (t) => cam(`${BG('url(#battleSky)')}${K.clouds(260, 11, '#2a2a4a', .8)}
      ${MV.mahadevFull(lerp(560, 660, prog(t, 0, 7)), 260, .7, { id: 'p6m', eyes: 'angry', mouth: 'soft', t })}${JL.jalandharFull(lerp(1360, 1260, prog(t, 0, 7)), 270, .7, { id: 'p6j', eyes: 'angry', mouth: 'open' })}
      ${Math.floor(t * 5) % 3 === 0 ? `<path d="M${400 + (t * 97 % 1100)} -100 L ${460 + (t * 53 % 1000)} 300 L ${420 + (t * 71 % 1000)} 320 L ${500 + (t * 31 % 1000)} 700" stroke="#cfe6ff" stroke-width="5" fill="none" filter="url(#glow)"/>` : ''}
      ${K.clouds(980, 14, '#3a3a5a', .9)}`, { s: 1.05, fy: 520, ...K.shake(t, 0, 3 + prog(t, 3.5, 6.2) * 8) }) },
  { a: 7.3, b: 10.4, f: (t) => { const hit = 9.3, p = prog(t, 7.6, hit, ease.in);
    return cam(`${BG('url(#asuraBg)')}${K.clouds(900, 21, '#3a1a2a', .8)}${JL.jalandharFull(960, 230, .78, { id: 'p6h', eyes: 'angry' })}
      <g transform="translate(${lerp(377, 900, p)},${lerp(-112, 330, p)}) rotate(135) scale(.7)">${MV.trishul(0, 0, 1, t, 520)}</g>${burst(900, 330, prog(t, hit, hit + .7), 60, 6)}`, { s: 1.05, fy: 520, ...K.shake(t, 0, clamp(1 - Math.abs(t - hit) / .5) * 9) }); } },
  { a: 10.4, b: 13.3, f: (t) => { const heal = prog(t, 11.0, 12.6);
    return cam(`${BG('url(#asuraBg)')}<ellipse cx="960" cy="420" rx="500" ry="440" fill="#ffd66b" opacity="${heal * .4}" filter="url(#softGlow)"/>${JL.jalandharFull(960, 120, 2.0, { id: 'p6w', eyes: 'angry', mouth: 'smile' })}
      <path d="M900 520 L 1020 600" stroke="#d1261c" stroke-width="${10 * (1 - heal)}" stroke-linecap="round" opacity="${1 - heal}"/>${burst(960, 560, heal, 40, 4, '#ffe7a0', 160)}`, { s: 1.0, fy: 440 }); } },
  { a: 13.3, b: 17.3, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 4} 960 330)">${A.mandalaGlow(960, 330, 520, '#ffcf6a', .55)}</g>${A.prabhavali(960, 780, 400, { flames: 25, thick: 30, pillar: 400 })}
      ${breathe(C.tulasi(960, 140, .93, { pose: 'anjali', eyes: 'closed', mouth: 'soft', id: 'p6v' }), t, 960, 1000)}${A.nilavilakku(600, 1080, 1.0, noise(t, 2) * 3)}${A.nilavilakku(1320, 1080, 1.0, noise(t, 5) * 3)}`,
    { s: lerp(1.0, 1.1, prog(t, 13.3, 17.3)), fy: 500 }) },
  { a: 17.3, b: 20.5, f: (t) => cam(`${BG('#0a0406')}<ellipse cx="960" cy="560" rx="560" ry="500" fill="url(#lampGlow)" opacity=".9"/>${lampDiya(960, 640, 2.6, t, 6)}`, { s: 1.0 + (t - 17.3) * .03, fy: 560 }) },
  { a: 20.5, b: 23.0, f: (t) => cam(`${BG('#050a22')}<ellipse cx="1300" cy="480" rx="600" ry="600" fill="url(#blueGlow)" opacity=".7"/>
      ${C.vishnu(1350, 200, .74, { id: 'p6vi', eyes: 'lowered', mouth: 'soft' })}${RI.indra(lerp(500, 640, prog(t, 20.5, 22.8)), 260, .62, { id: 'p6in', eyes: 'lowered', mouth: 'soft', sad: true })}
      ${KD.agni(lerp(260, 380, prog(t, 20.5, 22.8)), 300, .56, { id: 'p6ag', eyes: 'lowered', mouth: 'soft' })}`, { s: 1.0, fy: 520 }) },
  { a: 23.0, b: 29.9, f: (t) => cam(`${BG('url(#skyDay)')}${BG('#1a0c20', .35)}${K.clouds(860, 3)}${RI.indra(960, 100, 1.5, { id: 'p6sp', eyes: 'wide', mouth: Math.floor(t * 8) % 2 ? 'open' : 'soft' })}`, { s: 1.0, fy: 420 }) },
  { a: 29.9, b: 34.6, f: (t) => cam(`${BG('#050a22')}<ellipse cx="960" cy="480" rx="800" ry="600" fill="url(#blueGlow)" opacity=".6"/>${C.vishnu(960, 60, 2.2, { id: 'p6vs', eyes: 'lowered', mouth: 'soft', sad: true })}`,
    { s: lerp(1.0, 1.08, prog(t, 29.9, 34.6)), fy: 360 }) },
  { a: 34.6, b: 40.9, f: (t) => { const k = t < 37.6 ? 0 : 1;
    return cam(`${BG(k ? 'url(#bgTemple)' : 'url(#nightSky)')}${k ? `<g transform="rotate(${t * 3} 960 330)">${A.mandalaGlow(960, 330, 520, '#ffcf6a', .5)}</g>${breathe(C.tulasi(960, 140, .93, { pose: 'anjali', eyes: 'closed', mouth: 'soft', id: 'p6pr' }), t, 960, 1000)}`
      : `${stars(9)}<circle cx="960" cy="520" r="300" fill="#2a4a9a"/><path d="M760 360 C 860 420 900 560 820 700 M1080 380 C 1020 480 1120 600 1060 700" stroke="#3aa060" stroke-width="40" fill="none" opacity=".8"/><circle cx="960" cy="520" r="300" fill="none" stroke="#9fc0ff" stroke-width="6" filter="url(#glow)"/>`}`, { s: 1.0, fy: 520 }); } },
];
const C6 = [
  [-0.3, 6.6, 'The battle of Mahadev and Jalandhar was so fierce that ★earth and sky★ shook.'],
  [7.3, 10.2, 'Every blow of Mahadev reached Jalandhar…'], [10.4, 13.1, 'but every wound ★healed★ in an instant.'],
  [13.3, 17.1, 'Because far away in the palace, Vrinda was still praying.'], [17.3, 20.3, 'Her lamp was ★still burning★.'],
  [20.5, 22.9, 'The gods went to Lord Vishnu.'], [23.0, 29.7, '"Lord, while Vrinda’s vow holds, Jalandhar is ★immortal★. Evil is winning."'],
  [29.9, 34.4, 'And Lord Vishnu faced a terrible ★dilemma★…'], [34.6, 37.4, 'on one side, the safety of the ★world★…'], [37.6, 40.8, 'on the other, his ★dearest devotee★.'],
];

// ================= PART 7 · that night (47.4 s)
const P7 = [
  { a: 0, b: 3.9, f: (t) => cam(`${BG('url(#nightSky)')}${stars(9)}<circle cx="1110" cy="190" r="62" fill="#fff4d6"/><circle cx="1110" cy="190" r="150" fill="#fff2c8" opacity=".14" filter="url(#softGlow)"/>
      ${A.templeSilhouette(900, 1000, .95, '#0c0a24')}${A.templeSilhouette(600, 1000, .6, '#100e2c')}${A.templeSilhouette(1240, 1000, .6, '#100e2c')}`, { s: 1.05, fy: lerp(380, 560, prog(t, 0, 3.9, ease.inOut)) }) },
  { a: 3.9, b: 7.7, f: (t) => cam(`${doorRoom(t)}<g opacity="${prog(t, 4.2, 5.2)}" filter="url(#silRim)">${JL.jalandharFull(540, 300, .58, { id: 'p7sil' }).replace(/fill="url\([^)]*\)"/g, 'fill="#05060f"').replace(/fill="#[0-9a-fA-F]{3,6}"/g, 'fill="#05060f"')}</g>`,
    { s: lerp(1.0, 1.15, prog(t, 3.9, 7.7)), fx: 560, fy: 560 }) },
  { a: 7.7, b: 9.6, f: (t) => cam(`${BG('url(#wallNight)')}<ellipse cx="960" cy="420" rx="500" ry="500" fill="#9fc0ff" opacity=".18" filter="url(#softGlow)"/>${JL.jalandharFull(960, 120, 2.9, { id: 'p7f', eyes: blink(t, 'open', .4), mouth: 'smile' })}`, { s: 1.03, fy: 360 }) },
  { a: 9.6, b: 12.7, f: (t) => cam(`${doorRoom(t)}${JL.jalandharFull(lerp(560, 800, prog(t, 9.6, 12.6)), 280, .6, { id: 'p7w', eyes: 'open', mouth: 'smile' })}`, { s: 1.1, fx: 760, fy: 560 }) },
  { a: 12.7, b: 18.3, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 3} 960 330)">${A.mandalaGlow(960, 330, 560, '#ffcf6a', .45)}</g>
      <g transform="translate(0,${-prog(t, 15.2, 16.2, ease.out) * 40})">${T({ eyes: blink(t, 'open', .9), mouth: t > 15.2 && t < 18 && Math.floor(t * 8) % 2 ? 'open' : 'smile', tears: true, id: 'p7j' })}</g>`, { s: 1.04, fy: 430 }) },
  { a: 18.3, b: 22.9, f: (t) => { const bow = prog(t, 20.0, 21.9, ease.inOut);
    return cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 3} 960 330)">${A.mandalaGlow(960, 330, 520, '#ffcf6a', .4)}</g>
      ${JL.jalandharFull(1200, 200, .8, { id: 'p7b', eyes: 'lowered', mouth: 'smile' })}
      <g transform="rotate(${bow * 32} 760 1000)">${C.tulasi(760, 200, .82, { pose: 'anjali', eyes: 'closed', mouth: 'smile', id: 'p7v' })}</g>
      ${lampDiya(420, 960, 1.0, t, 4)}`, { s: 1.0, fy: 560 }); } },
  { a: 22.9, b: 26.5, f: (t) => { const out = prog(t, 24.6, 25.4);
    return cam(`${BG('#05030a')}<ellipse cx="960" cy="560" rx="560" ry="500" fill="url(#lampGlow)" opacity="${.9 * (1 - out)}"/>${lampDiya(960, 640, 2.6, t, 6, 1 - out)}
      ${out > 0 ? [...Array(5)].map((_, i) => `<path d="M${1024 + i * 4} ${560 - out * 120 - i * 26} q ${10 - i * 4} -20 ${-6 + i * 3} -40" stroke="#8a8494" stroke-width="3" fill="none" opacity="${out * (1 - i * .15)}"/>`).join('') : ''}`, { s: 1.0, fy: 560 }); } },
  { a: 26.5, b: 29.6, f: (t) => cam(`${BG('url(#bgGrief)')}${C.tulasi(960, 110, 3.2, { eyes: 'lowered', mouth: 'soft', id: 'p7br' })}`, { s: 1.04, fy: 440 }) },
  { a: 29.6, b: 34.2, f: (t) => { const sh = prog(t, 32.4, 33.4);
    return cam(`${BG('url(#asuraBg)')}${shieldDome(960, 560, 300, 450, t, 1 - sh)}${burst(960, 560, sh, 90, 15, '#ffd66b', 520)}
      ${JL.jalandharFull(960, 210, .8, { id: 'p7k', eyes: sh > .3 ? 'wide' : 'angry', mouth: sh > .3 ? 'open' : 'smile' })}`, { s: 1.05, fy: 540 }); } },
  { a: 34.2, b: 38.3, f: (t) => { const hit = 35.4, p = prog(t, 34.3, hit, ease.in);
    return cam(`${BG('url(#asuraBg)')}${K.clouds(900, 21, '#3a1a2a', .8)}<g opacity="${1 - prog(t, 36.0, 37.4)}">${JL.jalandharFull(960, 230, .78, { id: 'p7e', eyes: t > hit ? 'closed' : 'wide', mouth: 'open' })}</g>
      <g transform="translate(${lerp(377, 920, p)},${lerp(-112, 360, p)}) rotate(135) scale(.7)">${MV.trishul(0, 0, 1, t, 520)}</g>${burst(920, 380, prog(t, hit, hit + .9), 80, 6, '#cfe6ff', 360)}`, { s: 1.05, fy: 520, ...K.shake(t, 0, clamp(1 - Math.abs(t - hit) / .6) * 10) }); } },
  { a: 38.3, b: 46.0, f: (t) => { const g = prog(t, 40.6, 45.9, ease.inOut), pan = prog(t, 38.8, 40.8, ease.inOut);
    return cam(`${doorRoom(t)}<g opacity="${g}" transform="translate(1440,${lerp(330, 170, g)}) skewX(-8) scale(${lerp(.42, .68, g)})" filter="url(#shadowify)">${C.vishnu(0, 0, 1, { id: 'p7sh', eyes: 'closed' })}</g>
      <g opacity="${1 - pan}">${C.tulasi(700, 200, .7, { eyes: 'open', mouth: 'soft', id: 'p7look' })}</g>`, { s: 1.05 + pan * .08, fx: lerp(760, 1430, pan), fy: lerp(540, 520, pan) }); } },
  { a: 46.0, b: 47.4, f: (t) => cam(`${doorRoom(t)}<g transform="translate(1440,170) skewX(-8) scale(.68)" filter="url(#shadowify)">${C.vishnu(0, 0, 1, { id: 'p7sh2', eyes: 'closed' })}</g>`, { s: 1.13 + prog(t, 46.0, 46.35, ease.out) * .08, fx: 1430, fy: 500 }) },
];
const C7 = [
  [-0.3, 4.6, 'That very night… someone came to Vrinda’s door.'], [5.4, 7.5, 'It was ★Jalandhar★.'], [7.7, 9.5, 'Same face…'], [9.6, 12.5, 'same voice… same walk.'],
  [12.7, 15.1, 'Tears of joy filled Vrinda’s eyes.'], [15.3, 18.1, '"My lord! You have returned from battle!"'],
  [18.3, 22.8, 'She left her prayer… and bowed at her husband’s feet.'], [22.9, 26.3, 'At that moment… the lamp ★went out★.'],
  [26.5, 29.5, 'Vrinda’s vow was ★broken★.'], [29.6, 34.0, 'Far away on the battlefield, Jalandhar’s armour ★shattered★.'],
  [34.2, 38.1, 'Mahadev’s ★trishul★ ended the evil.'], [38.3, 42.5, 'Then Vrinda’s eyes fell on the wall…'],
  [43.0, 45.9, 'In the lamp’s last flicker, her husband’s shadow…'], [46.0, 47.3, 'had ★four arms★.', 1.3],
];

// ================= PART 8 · the curse (55.9 s)
// Treta Yuga: dusk forest, Ram (rim-lit silhouette with bow) and Sita fading away
const ramSita = (t, sitaFade = 0) => {
  const r = A.rng(77);
  const treeRow = (y, sc, col, n, seed) => { const q = A.rng(seed); let o = '';
    for (let i = 0; i < n; i++) { const x = -200 + i * (2400 / n) + q() * 60, h = (300 + q() * 260) * sc;
      o += `<g transform="translate(${x},${y})" fill="${col}"><path d="M-${14 * sc} 0 L -${8 * sc} -${h} L ${8 * sc} -${h} L ${14 * sc} 0Z"/>
        ${[0, 1, 2].map(k => `<ellipse cx="${(q() - .5) * 120 * sc}" cy="${-h - 40 * sc + k * 60 * sc}" rx="${(110 + q() * 60) * sc}" ry="${(70 + q() * 30) * sc}"/>`).join('')}</g>`; } return o; };
  const ff = [...Array(40)].map((_, i) => { const x = r() * 1920, y = 380 + r() * 600, ph = r() * 6; return `<circle cx="${x + Math.sin(t * .7 + ph) * 20}" cy="${y + Math.cos(t * .5 + ph) * 14}" r="${1.6 + r() * 2}" fill="#ffe08a" opacity="${.3 + .6 * Math.abs(Math.sin(t * 2 + ph))}" filter="url(#glow)"/>`; }).join('');
  const person = (x, fill, dress) => `<g transform="translate(${x},1000)" fill="${fill}">
    <ellipse cx="0" cy="-430" rx="24" ry="28"/>${dress ? `<path d="M-12 -470 C -6 -490 6 -490 12 -470Z"/><path d="M-34 -400 L 34 -400 L 70 0 L -70 0Z"/><path d="M24 -400 C 60 -380 70 -300 64 -200" stroke="${fill}" stroke-width="10" fill="none"/>`
      : `<path d="M-14 -458 L 0 -500 L 14 -458Z"/><path d="M-42 -398 L 42 -398 L 50 -210 L 30 0 L 10 0 L 0 -190 L -10 0 L -30 0 L -50 -210Z"/><path d="M64 -470 Q 120 -300 64 -130" stroke="${fill}" stroke-width="9" fill="none"/><path d="M64 -470 L 64 -130" stroke="${fill}" stroke-width="2"/><path d="M-30 -420 L -60 -480" stroke="${fill}" stroke-width="12"/>`}</g>`;
  return `${BG('url(#duskForest)')}<circle cx="1180" cy="620" r="170" fill="url(#sunDisc)"/>
    <defs><linearGradient id="duskForest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1840"/><stop offset=".45" stop-color="#8a3a6a"/><stop offset=".75" stop-color="#e2744a"/><stop offset="1" stop-color="#f6b45a"/></linearGradient>
      <filter id="warmRim" x="-20%" y="-20%" width="140%" height="140%"><feMorphology operator="dilate" radius="3" in="SourceAlpha" result="d"/><feGaussianBlur in="d" stdDeviation="4" result="b"/><feFlood flood-color="#ffc06a"/><feComposite in2="b" operator="in" result="rim"/><feMerge><feMergeNode in="rim"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    ${treeRow(900, .8, '#6a2a4a', 12, 3)}${treeRow(960, 1.0, '#3a1430', 10, 5)}
    <rect x="-900" y="960" width="3720" height="900" fill="#1a0a18"/>
    ${RS.defs}
    <g>${RS.ram(760, 400, .62, { id: 'p8r' + Math.round(sitaFade * 0), look: 'vanvas', eyes: sitaFade > .3 ? 'lowered' : 'open', mouth: 'soft', sad: sitaFade > .3, halo: false })}</g>
    <g opacity="${1 - sitaFade}">${RS.sita(1260, 410, .64, { id: 'p8s', look: 'vanvas', eyes: 'lowered', mouth: 'soft', halo: false })}</g>
    <rect x="-900" y="-900" width="3720" height="2880" fill="#ff8a3a" opacity=".12" style="mix-blend-mode:multiply"/>
    ${sitaFade > 0 ? burst(1300, 700, sitaFade, 50, 9, '#ffe08a', 260) : ''}
    ${[-1, 1].map(sx => `<g transform="translate(${960 + sx * 1010},1100) scale(${sx},1)" fill="#2a1030" opacity=".9"><path d="M-40 0 L -26 -760 L 26 -760 L 40 0Z"/><ellipse cx="-80" cy="-860" rx="220" ry="120"/><ellipse cx="80" cy="-760" rx="150" ry="90"/><path d="M10 -520 C 120 -560 200 -620 260 -700" stroke="#0a0408" stroke-width="22" fill="none"/></g>`).join('')}${ff}`;
};
const P8 = [
  { a: 0, b: 5.3, f: (t) => { const r = prog(t, 2.2, 4.4);
    return cam(`${BG('#050a22')}<ellipse cx="960" cy="480" rx="${300 + r * 500}" ry="${400 + r * 300}" fill="url(#blueGlow)" opacity="${.4 + r * .5}"/>
      <g opacity="${1 - r}">${JL.jalandharFull(960, 210, .8, { id: 'p8j', eyes: 'lowered', mouth: 'soft' })}</g><g opacity="${r}">${C.vishnu(960, 150, .82, { id: 'p8v', eyes: 'lowered', mouth: 'soft', sad: true })}</g>${burst(960, 480, r, 60, 3, '#cfe2ff', 400)}`, { s: 1.0, fy: 520 }); } },
  { a: 5.3, b: 11.7, f: (t) => cam(`${BG('#050a22')}<ellipse cx="960" cy="480" rx="800" ry="600" fill="url(#blueGlow)" opacity=".8"/>${breathe(C.vishnu(960, 150, .82, { id: 'p8v2', eyes: 'lowered', mouth: 'soft', sad: true }), t, 960, 950)}`,
    { s: lerp(1.0, 1.12, prog(t, 5.3, 11.7)), fy: 470 }) },
  { a: 11.7, b: 14.1, f: (t) => cam(`${BG('url(#bgGrief)')}${C.tulasi(960, 110, 6, { eyes: 'wide', mouth: 'open', tears: true, sad: true, id: 'p8s' })}`, { s: lerp(1.0, 1.05, prog(t, 11.7, 14.1)), fy: 520 }) },
  { a: 14.1, b: 20.2, f: (t) => cam(`${BG('url(#bgGrief)')}${C.tulasi(960, 110, 3.2, { eyes: 'lowered', mouth: Math.floor(t * 8) % 2 && t < 19.4 ? 'open' : 'soft', tears: true, sad: true, id: 'p8q' })}`, { s: 1.04, fy: 440 }) },
  { a: 20.2, b: 24.2, f: (t) => { const r = prog(t, 20.4, 23.6);
    return cam(`${BG('url(#bgGrief)')}${BG('url(#redEnergy)', r)}<g transform="rotate(${t * 20} 960 420)">${A.mandalaGlow(960, 420, 700, '#ffb04a', .2 + r * .4)}</g>${C.tulasi(960, 110, 3.2, { eyes: r > .4 ? 'angry' : 'lowered', mouth: 'soft', tears: true, id: 'p8r' })}`, { s: 1.04 + r * .06, fy: 470 }); } },
  { a: 24.2, b: 30.0, f: (t) => cam(`${BG('url(#redEnergy)')}<g transform="rotate(${t * 15} 960 420)">${A.mandalaGlow(960, 420, 800, '#ffb04a', .35)}</g>
      ${C.vishnu(1130, 150, 1.45, { id: 'p8cv', eyes: 'lowered', mouth: 'soft', sad: true })}${C.tulasi(800, 160, 1.5, { eyes: 'angry', mouth: Math.floor(t * 9) % 2 ? 'open' : 'soft', tears: true, id: 'p8ct' })}
      ${K.N.embersAnim(19, 70, 1920, 1080, t, { color: '#ffcf6a', speed: 120 })}`, { s: .92, fx: lerp(900, 1010, prog(t, 24.2, 30)), fy: 520, ...K.shake(t, 0, prog(t, 27.6, 28.6) * 6) }) },
  { a: 30.0, b: 36.5, f: (t) => cam(`${ramSita(t, prog(t, 33.5, 36.2))}`, { s: lerp(1.0, 1.08, prog(t, 30.0, 36.5)), fy: 560 }) },
  { a: 36.5, b: 39.7, f: (t) => cam(`${BG('#050a22')}<ellipse cx="960" cy="480" rx="800" ry="600" fill="url(#blueGlow)" opacity=".6"/>${C.vishnu(960, 60, 2.2, { id: 'p8e', eyes: t > 38 ? 'closed' : 'lowered', mouth: 'soft', sad: true })}`, { s: 1.0 + (t - 36.5) * .02, fy: 360 }) },
  { a: 39.7, b: 45.1, f: (t) => { const toStone = prog(t, 42.6, 44.0), vis = 1 - prog(t, 43.6, 44.6), stone = prog(t, 43.4, 44.8, ease.out);
    return cam(`${BG('#050a22')}<ellipse cx="960" cy="520" rx="${700 + stone * 200}" ry="${600 + stone * 150}" fill="url(#blueGlow)" opacity="${.7 + stone * .3}"/>
      <filter id="p8sf"><feColorMatrix type="saturate" values="${1 - toStone}"/><feComponentTransfer><feFuncR type="linear" slope="${1 - toStone * .55}"/><feFuncG type="linear" slope="${1 - toStone * .55}"/><feFuncB type="linear" slope="${1 - toStone * .5}"/></feComponentTransfer></filter>
      <g opacity="${vis}" filter="url(#p8sf)" transform="translate(960,560) scale(${lerp(1, .55, prog(t, 43.4, 44.6, ease.in))}) translate(-960,-560)">${C.vishnu(960, 150, .78, { pose: 'accept', eyes: 'closed', mouth: 'soft', id: 'p8a' })}</g>
      <g opacity="${stone}">${A.shaligram(960, 600, lerp(.4, 1.25, stone), 1)}</g>`, { s: 1.0, fy: 520 }); } },
  { a: 45.1, b: 49.0, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 6} 960 520)">${A.mandalaGlow(960, 520, 560, '#ffcf6a', .45)}</g>${A.shaligram(960, 600, 1.3, .9)}
      ${lampDiya(620, 900, 1.0, t, 2)}${lampDiya(1300, 900, 1.0, t, 5)}`, { s: lerp(1.0, 1.1, prog(t, 45.1, 49.0)), fy: 600 }), title: [46.4, 48.9, 'SHALIGRAM', 170, 100] },
  { a: 49.0, b: 55.9, f: (t) => cam(`${ramSita(t, prog(t, 52.2, 54.6))}`, { s: lerp(1.08, 1.0, prog(t, 49.0, 55.9)), fy: 600 }) },
];
const C8 = [
  [-0.3, 2.2, 'Before Vrinda, the form changed…'], [3.6, 6.9, 'and there stood… Lord ★Vishnu★.'], [7.0, 11.5, 'The very Lord she had worshipped all her life.'],
  [11.7, 13.9, 'Vrinda’s heart ★broke★.'], [14.1, 20.0, '"Lord… you? You deceived your own ★devotee★?"'],
  [20.2, 24.0, 'Through her tears, a ★curse★ rose to her lips.'],
  [24.2, 29.9, '"As you turned my heart to stone, you too shall become ★stone★!"'],
  [30.0, 36.3, '"And as I am separated from my husband today, one day you will be separated from your ★wife★!"'],
  [36.5, 39.5, 'Lord Vishnu closed his eyes.'], [39.7, 44.9, 'He spoke not a word… and ★accepted★ the curse.'],
  [45.1, 48.9, 'That stone is worshipped today as the ★Shaligram★.'],
  [49.0, 55.8, 'And it is said, in the Treta Yuga, Shri Ram’s separation from ★Sita★ was the fruit of this curse.'],
];

// ================= PART 9 · Tulasi is born (53.6 s)
const ashes = (t, g) => `<ellipse cx="960" cy="930" rx="260" ry="50" fill="#5a4a44"/><ellipse cx="960" cy="920" rx="200" ry="34" fill="#7a6a62"/>
  ${(() => { const r = A.rng(7); return [...Array(30)].map((_, i) => `<circle cx="${800 + r() * 320}" cy="${900 + r() * 30}" r="${2 + r() * 3}" fill="#ffb347" opacity="${(1 - g) * (.4 + .4 * Math.sin(t * 3 + i))}"/>`).join(''); })()}`;
const P9 = [
  { a: 0, b: 4.3, f: (t) => cam(`${BG('url(#bgGrief)')}${C.tulasi(960, 110, 3.2, { eyes: 'closed', mouth: 'soft', tears: true, sad: true, id: 'p9g' })}`, { s: lerp(1.04, 1.1, prog(t, 0, 4.3)), fy: 440 }) },
  { a: 4.3, b: 9.2, f: (t) => { const g = prog(t, 5.0, 8.4);
    return cam(`${BG('#1a0604')}<ellipse cx="960" cy="700" rx="${600 + g * 400}" ry="${500 + g * 300}" fill="url(#lampGlow)" opacity="${.5 + g * .45}"/>
      <g opacity="${1 - g}">${C.tulasi(960, 150, .9, { pose: 'anjali', eyes: 'closed', mouth: 'soft', id: 'p9f' })}</g>
      <ellipse cx="960" cy="560" rx="${200 + g * 300}" ry="${400 + g * 200}" fill="#fff4d0" opacity="${g * .7}" filter="url(#softGlow)"/>
      ${K.N.embersAnim(43, 140, 1920, 1080, t, { color: '#ffd27a', speed: 120 })}`, { s: 1.05, fy: 540 }); } },
  { a: 9.2, b: 12.8, f: (t) => cam(`${BG('url(#nightSky)')}${stars(4)}${ashes(t, 0)}`, { s: 1.15, fy: 820 }) },
  { a: 12.8, b: 17.6, f: (t) => { const g = lerp(.08, .7, prog(t, 12.9, 17.4, ease.out));
    return cam(`${BG('url(#dawnSky)')}<circle cx="960" cy="640" r="${200 + g * 100}" fill="url(#sunDisc)"/>${ashes(t, g)}${A.tulasiKatte(960, 1180, 1.05, 11, g).replace(/<path d="M-170 0[\s\S]*?(?=<path d="M-110 -250 Q)/, '')}`, { s: 1.15, fy: 760 }); } },
  { a: 17.6, b: 21.4, f: (t) => cam(`${BG('url(#dawnSky)')}<circle cx="960" cy="500" r="300" fill="url(#sunDisc)"/>${ashes(t, 1)}<g>${sway(A.tulasiKatte(960, 1180, 1.05, 11, .75).replace(/<path d="M-170 0[\s\S]*?(?=<path d="M-110 -250 Q)/, ''), t, 960, 930, 2)}</g>
      ${K.N.embersAnim(33, 60, 1920, 1080, t, { color: '#fff2c0', speed: 30 })}`, { s: 1.45, fy: 760 }) },
  { a: 21.4, b: 25.2, f: (t) => cam(`${BG('url(#dawnSky)')}<circle cx="960" cy="500" r="300" fill="url(#sunDisc)"/><g transform="translate(-260,0)">${ashes(t, 1)}${A.tulasiKatte(960, 1180, 1.05, 11, .8).replace(/<path d="M-170 0[\s\S]*?(?=<path d="M-110 -250 Q)/, '')}</g>
      ${breathe(C.vishnu(lerp(1500, 1200, prog(t, 21.4, 24.6)), 200, .74, { id: 'p9v', eyes: 'lowered', mouth: 'smile' }), t, 1200, 950)}`, { s: 1.0, fy: 540 }) },
  { a: 25.2, b: 33.6, f: (t) => cam(`${BG('#050a22')}<ellipse cx="960" cy="480" rx="800" ry="600" fill="url(#blueGlow)" opacity=".7"/>${breathe(C.vishnu(960, 60, 2.2, { id: 'p9s', eyes: blink(t, 'lowered', .6), mouth: Math.floor(t * 8) % 3 === 0 ? 'open' : 'smile' }), t, 960, 1300, .006)}`,
    { s: 1.0, fy: 360 }), title: [29.3, 33.4, 'TULASI', 170, 120] },
  { a: 33.6, b: 37.6, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 4} 960 420)">${A.mandalaGlow(960, 420, 560, '#ffcf6a', .5)}</g>${A.shaligram(960, 520, .9, .7)}
      <g transform="translate(960,460)">${[-30, 0, 30].map(a => `<path transform="rotate(${a})" d="M0 0 C -14 -10 -14 -40 0 -54 C 14 -40 14 -10 0 0Z" fill="#3fa35a" stroke="#0e3d1f" stroke-width="2"/>`).join('')}</g>
      ${lampDiya(620, 900, 1.0, t, 2)}${lampDiya(1300, 900, 1.0, t, 5)}`, { s: lerp(1.0, 1.15, prog(t, 33.6, 37.6)), fy: 520 }) },
  { a: 37.6, b: 42.5, f: (t) => cam(`${BG('url(#dawnSky)')}<circle cx="960" cy="560" r="300" fill="url(#sunDisc)"/>${K.courtyard(t).replace(/<rect x="-900"[^>]*>/, '')}${A.tulasiKatte(860, 985, 1.05, 11, 1)}${A.shaligram(1150, 900, .5, .6)}`,
    { s: lerp(1.0, 1.1, prog(t, 37.6, 42.5)), fx: 1000, fy: 640 }) },
  { a: 42.5, b: 48.2, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 4} 960 420)">${A.mandalaGlow(960, 420, 560, '#ffcf6a', .5)}</g>
      <rect x="760" y="760" width="400" height="40" rx="10" fill="url(#brass)"/>${A.shaligram(960, 640, .9, .6)}
      ${[...Array(6)].map((_, i) => `<g transform="translate(${820 + i * 56},${770 - Math.abs(i - 2.5) * 6}) rotate(${-30 + i * 12})"><path d="M0 0 C -12 -8 -12 -34 0 -46 C 12 -34 12 -8 0 0Z" fill="#3fa35a" stroke="#0e3d1f" stroke-width="2"/></g>`).join('')}
      ${lampDiya(560, 900, 1.0, t, 2)}${lampDiya(1360, 900, 1.0, t, 5)}`, { s: 1.05, fy: 600 }) },
  { a: 48.2, b: 53.6, f: (t) => { const water = [...Array(6)].map((_, k) => { let d = `M-900 ${720 + k * 50}`; for (let x = -900; x <= 2800; x += 40) d += ` L ${x} ${720 + k * 50 + Math.sin(x / 80 + t * (1.2 + k * .2) + k) * 8}`; return `<path d="${d} L 2800 1900 L -900 1900Z" fill="#2a6a7a" opacity="${.35 + k * .1}"/>`; }).join('');
    return cam(`${BG('url(#skyDay)')}<path d="M-900 720 L 300 420 L 600 560 L 900 360 L 1300 560 L 1700 420 L 2800 720Z" fill="#6a8a6a"/>${water}
      ${(() => { const r = A.rng(31); return [...Array(9)].map((_, i) => { const x = 520 + i * 105 + r() * 40, y = 930 + r() * 100; return `<ellipse cx="${x}" cy="${y}" rx="${40 + r() * 30}" ry="${26 + r() * 16}" fill="#17151d" stroke="#000" stroke-width="2"/><ellipse cx="${x - 12}" cy="${y - 10}" rx="10" ry="5" fill="#fff" opacity=".25"/>`; }).join(''); })()}`,
      { s: lerp(1.0, 1.1, prog(t, 48.2, 53.6)), fy: 760 }); }, title: [48.3, 53.5, 'GANDAKI', 170, 100] },
];
const C9 = [
  [-0.3, 4.1, 'Having lost her husband, broken by the loss of her vow…'], [4.3, 9.0, 'Vrinda gave up her life in the ★sacred fire★.'],
  [9.2, 12.6, 'But where her ashes fell…'], [12.8, 17.4, 'a tender ★green plant★ rose from the earth.'],
  [17.6, 21.2, 'Small fragrant leaves… as if devotion itself had ★awakened★ again.'],
  [21.4, 25.0, 'Lord Vishnu came to the plant and said —'],
  [25.2, 33.4, '"Vrinda, your devotion is ★immortal★. From today you shall be called ★Tulasi★. You will be dearer to me than Lakshmi."'],
  [33.6, 36.8, '"No worship of mine will be complete ★without Tulasi★."'], [37.6, 42.3, '"And as the Shaligram, I will be with you ★forever★."'],
  [42.5, 48.0, 'That is why, even today, worship of the Shaligram is incomplete without a ★Tulasi leaf★.'],
  [48.2, 53.5, 'And the black stones of the ★Gandaki★ river are revered as Lord Vishnu himself.'],
];

module.exports = {
  part05: film(P5, C5, 43.4, [[24.8, .3], [34.9, .6]]),
  part06: film(P6, C6, 40.9, [[9.3, .5]]),
  part07: film(P7, C7, 47.4, [[33.0, .5], [35.4, .7], [46.05, .35]]),
  part08: film(P8, C8, 55.9, [[2.6, .4], [25.9, .6], [44.0, .6]]),
  part09: film(P9, C9, 53.6, [[29.3, .3]]),
};
