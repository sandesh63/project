// Part 1 — cold open (37.07 s). Timed to voice/part01.words.json.
const K = require('./common.js');
const { A, C, RI, KD, JL, cam, BG, breathe, sway, blink, lampDiya, burst, shieldDome, stars, courtyard, doorRoom, clamp, lerp, ease, prog, noise, makeFrame } = K;

const DURATION = 37.1;
const T = (o) => C.tulasi(o.x ?? 960, o.y ?? 110, o.s ?? 3.2, o);

// woman's hand pouring water from a brass lota (forearm enters from the right; fingers wrap the lota neck)
function lotaPour(t, tilt) {
  const sk = 'url(#tSkin)', sh = '#b9774a';
  return `<g transform="translate(1180,470) rotate(${-tilt})">
    <path d="M38 -44 C 120 -50 220 -40 420 -30 L 420 20 C 220 10 120 0 40 -10Z" fill="${sk}" stroke="#3b1c0e" stroke-width="2.4"/>
    <path d="M40 -12 C 120 -2 220 8 420 18" stroke="${sh}" stroke-width="8" fill="none" opacity=".35"/>
    ${[0, 1, 2].map(k => `<path d="M${70 + k * 16} -46 Q ${66 + k * 16} -26 ${72 + k * 16} -8" stroke="${k === 1 ? '#c8201a' : 'url(#gold)'}" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('')}
    <circle cx="0" cy="40" r="62" fill="url(#brass)" stroke="#5a3408" stroke-width="2.4"/>
    <ellipse cx="-20" cy="16" rx="20" ry="12" fill="#fff6d0" opacity=".45"/>
    <path d="M-22 -18 L -20 -40 L 20 -40 L 22 -18Z" fill="url(#brass)" stroke="#5a3408" stroke-width="2"/>
    <ellipse cx="0" cy="-42" rx="30" ry="8" fill="url(#brass)" stroke="#5a3408" stroke-width="2"/>
    <path d="M-56 30 C -90 20 -104 -2 -112 -26" stroke="url(#brass)" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M-56 30 Q 0 50 56 30" stroke="#5a3408" stroke-width="2" fill="none"/>
    <g transform="translate(38,-28) rotate(-90) scale(.78)">${A.holdingHand(sk, sh, -1, false)}</g></g>`;
}
function waterStream(t, p, tilt) {
  if (p <= 0) return '';
  // spout tip (-112,-26) in lota space, rotated by -tilt around the lota centre (1180,470)
  const th = -tilt * Math.PI / 180, lx = -112, ly = -26;
  const sx = 1180 + lx * Math.cos(th) - ly * Math.sin(th), sy = 470 + lx * Math.sin(th) + ly * Math.cos(th);
  const ex = 1000, ey = 735, len = clamp(p * 1.3);
  const qx = sx - 60, qy = sy + 20;
  const at = (u) => [(1 - u) * (1 - u) * sx + 2 * (1 - u) * u * qx + u * u * ex, (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * qy + u * u * ey];
  const [mx, my] = at(len);
  const drops = len < 1 ? '' : [...Array(10)].map((_, i) => { const u = ((t * 1.8 + i / 10) % 1), [dx, dy] = at(u); return `<circle cx="${dx}" cy="${dy}" r="3" fill="#e8f8ff" opacity=".85"/>`; }).join('');
  return `<path d="M${sx} ${sy} Q ${qx + (mx - ex) * 0} ${qy} ${mx} ${my}" stroke="#bfe8ff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".9"/>${drops}
    ${len >= 1 ? `<ellipse cx="${ex}" cy="${ey}" rx="${30 + Math.sin(t * 8) * 4}" ry="8" fill="#e8f8ff" opacity=".6"/>` : ''}`;
}

const S = [
  // 1 0.0–2.3 courtyard at dawn
  { a: 0, b: 2.3, f: (t) => cam(`${courtyard(t)}${A.tulasiKatte(960, 985, 1.05, 11, 1)}${K.N.petalsAnim(29, 16, 1920, 1080, t, { speed: 40, op: .7 })}`, { s: lerp(1.0, 1.08, prog(t, 0, 2.3)), fy: 600 }) },
  // 2 2.3–4.5 close on the plant, leaves sway
  { a: 2.3, b: 4.5, f: (t) => cam(`${courtyard(t)}${sway(A.tulasiKatte(960, 985, 1.05, 11, 1), t, 960, 740, 1.4)}${K.N.embersAnim(31, 30, 1920, 1080, t, { color: '#fff2c0', speed: 20 })}`, { s: lerp(2.0, 2.2, prog(t, 2.3, 4.5)), fy: 560 }) },
  // 3 4.5–7.2 water poured from a brass lota
  { a: 4.5, b: 7.2, f: (t) => { const tilt = lerp(5, 34, prog(t, 4.6, 5.4, ease.out));
    return cam(`${courtyard(t)}${A.tulasiKatte(960, 985, 1.05, 11, 1)}${waterStream(t, prog(t, 5.2, 5.9), tilt)}${lotaPour(t, tilt)}`, { s: 1.55, fx: 1060, fy: 600 }); } },
  // 4 7.2–8.6 diyas light one by one
  { a: 7.2, b: 8.6, f: (t) => cam(`${courtyard(t)}${A.tulasiKatte(960, 985, 1.05, 11, 1)}
      ${[0, 1, 2, 3, 4].map(i => { const lit = prog(t, 7.3 + i * .18, 7.5 + i * .18, ease.out); return `<ellipse cx="${855 + i * 52}" cy="955" rx="${40 * lit}" ry="${30 * lit}" fill="url(#lampGlow)" opacity="${lit}"/>${lampDiya(855 + i * 52, 960, .3, t, i, lit)}`; }).join('')}`,
    { s: 2.1, fx: 960, fy: 900 }) },
  // 5 8.6–10.5 the plant glows, title
  { a: 8.6, b: 10.5, f: (t) => { const g = prog(t, 8.7, 9.6);
    return cam(`${courtyard(t)}<ellipse cx="960" cy="620" rx="${300 + g * 200}" ry="${300 + g * 180}" fill="url(#lampGlow)" opacity="${.5 + g * .4}"/>${A.tulasiKatte(960, 985, 1.05, 11, 1)}${K.N.embersAnim(33, 70, 1920, 1080, t, { color: '#fff2c0', speed: 35 })}`,
      { s: lerp(1.15, 1.0, prog(t, 8.6, 10.5, ease.out)), fy: 600 }); }, title: [8.7, 10.5, 'TULASI', 210, 150] },
  // 6 10.5–12.5 night falls
  { a: 10.5, b: 12.5, f: (t) => cam(`${courtyard(t, 'url(#nightSky)')}${BG('#06081e', .55)}${stars(5)}<circle cx="1500" cy="200" r="60" fill="#fff4d6"/><circle cx="1500" cy="200" r="150" fill="#fff2c8" opacity=".12" filter="url(#softGlow)"/>
      <ellipse cx="960" cy="640" rx="320" ry="300" fill="#9fc0ff" opacity=".15" filter="url(#softGlow)"/>${A.tulasiKatte(960, 985, 1.05, 11, 1)}`, { s: lerp(1.0, 1.1, prog(t, 10.5, 12.5)), fy: 620 }) },
  // 7 12.5–15.4 the plant becomes golden light that forms Vrinda
  { a: 12.5, b: 15.4, f: (t) => { const d = prog(t, 12.8, 14.4);
    const parts = (() => { const r = A.rng(55); let o = ''; for (let i = 0; i < 90; i++) { const x0 = 900 + r() * 120, y0 = 560 + r() * 200, x1 = 860 + r() * 200, y1 = 180 + r() * 760, p = clamp(d * 1.4 - r() * .4);
      o += `<circle cx="${lerp(x0, x1, p)}" cy="${lerp(y0, y1, p)}" r="${2 + r() * 3}" fill="#ffe08a" opacity="${p > 0 && p < 1 ? .9 : 0}" filter="url(#glow)"/>`; } return o; })();
    return cam(`${courtyard(t, 'url(#nightSky)')}${BG('#06081e', .6)}${stars(5)}<g opacity="${1 - d}">${A.tulasiKatte(960, 985, 1.05, 11, 1)}</g>
      <ellipse cx="960" cy="560" rx="380" ry="520" fill="url(#lampGlow)" opacity="${d * .7}"/>
      <g opacity="${prog(t, 13.6, 14.8)}">${breathe(C.tulasi(960, 150, .9, { pose: 'anjali', eyes: t > 14.6 ? 'open' : 'closed', mouth: 'soft', id: 'p1s7' }), t, 960, 980)}</g>${parts}`, { s: 1.0, fy: 560 }); } },
  // 8 15.4–18.7 Vrinda prays inside her golden shield
  { a: 15.4, b: 18.7, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 4} 960 360)">${A.mandalaGlow(960, 360, 560, '#ffcf6a', .55)}</g>
      ${shieldDome(960, 560, 330, 480, t, 1)}${breathe(C.tulasi(960, 140, .93, { pose: 'anjali', eyes: blink(t, 'lowered', .2), mouth: 'soft', id: 'p1s8' }), t, 960, 1000)}
      ${A.nilavilakku(560, 1080, 1.0, noise(t, 2) * 3)}${A.nilavilakku(1360, 1080, 1.0, noise(t, 5) * 3)}${K.N.embersAnim(7, 50, 1920, 1080, t)}`,
    { s: lerp(1.0, 1.1, prog(t, 15.4, 18.7)), fy: 520 }) },
  // 9 18.7–20.3 the gods, afraid
  { a: 18.7, b: 20.3, f: (t) => cam(`${BG('url(#skyDay)')}${BG('#1a0c20', .35)}${K.clouds(860, 3)}
      <ellipse cx="960" cy="420" rx="900" ry="380" fill="#ffd66b" opacity=".25" filter="url(#softGlow)"/>
      ${KD.agni(560, 260, .66, { id: 'p1ag', eyes: 'wide', mouth: 'open' })}${RI.indra(960, 230, .7, { id: 'p1in', eyes: 'wide', mouth: 'open' })}${KD.vayu(1360, 260, .66, { id: 'p1va', eyes: 'wide', mouth: 'open' })}`,
    { s: lerp(1.0, 1.06, prog(t, 18.7, 20.3)), fy: 500, px: Math.sin(t * 30) * 2 }) },
  // 10 20.3–23.6 Vishnu revealed
  { a: 20.3, b: 23.6, f: (t) => cam(`${BG('#050a22')}<ellipse cx="960" cy="480" rx="800" ry="600" fill="url(#blueGlow)" opacity=".8"/><g transform="rotate(${t * 8} 960 420)">${A.mandalaGlow(960, 420, 600, '#bcd6ff', .45)}</g>
      ${breathe(C.vishnu(960, 150, .82, { id: 'p1v', eyes: blink(t, 'lowered', .5), mouth: 'smile' }), t, 960, 950)}${K.N.embersAnim(21, 60, 1920, 1080, t, { color: '#cfe2ff', speed: 30 })}`,
    { s: lerp(1.0, 1.12, prog(t, 20.3, 23.6)), fy: lerp(560, 420, prog(t, 20.3, 23.6)) }) },
  // 11 23.6–26.2 his face cracks to stone, flash on "पत्थर" (23.72)
  { a: 23.6, b: 26.2, f: (t) => { const c = prog(t, 23.7, 25.2);
    const edge = 'M960 -300 L 948 20 L 972 140 L 952 250 L 980 330 L 958 420 L 986 520 L 962 640 L 990 780 L 970 1300';
    const face = C.vishnu(960, 60, 2.6, { id: 'p1v2', eyes: 'closed', mouth: 'soft', sad: true });
    return cam(`${BG('#05081e')}<ellipse cx="760" cy="380" rx="520" ry="600" fill="url(#blueGlow)" opacity=".8"/>
      <filter id="p1stone"><feColorMatrix type="matrix" values=".26 .5 .1 0 .02  .26 .5 .1 0 .02  .28 .52 .12 0 .04  0 0 0 1 0"/></filter>
      <clipPath id="p1side"><rect x="${lerp(1700, -300, c)}" y="-300" width="3000" height="2000"/></clipPath>
      ${face}<g clip-path="url(#p1side)"><g filter="url(#p1stone)">${face}</g></g>
      <path d="${edge}" transform="translate(${lerp(740, -960, c)},0)" stroke="#ffd66b" stroke-width="7" fill="none" filter="url(#glow)" opacity="${c < 1 ? 1 : 0}"/>`, { s: 1.0 + (t - 23.6) * .02, fy: 340 }); } },
  // 12 26.2–28.8 "a story of love": Vrinda and Jalandhar together
  { a: 26.2, b: 28.8, f: (t) => cam(`${BG('url(#loveGlow)')}${K.N.petalsAnim(41, 30, 1920, 1080, t, { speed: 40 })}
      ${breathe(JL.jalandharFull(1130, 170, 1.15, { id: 'p1j', eyes: blink(t, 'open', .3), mouth: 'smile' }), t, 1130, 1200)}
      ${breathe(C.tulasi(800, 190, 1.2, { eyes: blink(t, 'open', 1.1), mouth: 'smile', id: 'p1t' }), t, 800, 1200, .012, 1)}`,
    { s: lerp(1.0, 1.06, prog(t, 26.2, 28.8)), fx: 960, fy: 480 }) },
  // 13 28.8–30.0 "of devotion": prayer by lamplight
  { a: 28.8, b: 30.0, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 3} 960 330)">${A.mandalaGlow(960, 330, 560, '#ffcf6a', .5)}</g>
      ${T({ pose: 'anjali', eyes: 'closed', mouth: 'soft', id: 'p1s13' })}<ellipse cx="960" cy="905" rx="600" ry="380" fill="url(#lampGlow)" opacity=".8"/>${lampDiya(960, 905, 1.6, t, 3)}`, { s: 1.04 + (t - 28.8) * .02, fy: 440 }) },
  // 14 30.0–30.9 "of deceit": the four-armed shadow
  { a: 30.0, b: 30.9, f: (t) => cam(`${doorRoom(t)}<g transform="translate(1440,170) skewX(-8) scale(.68)" filter="url(#shadowify)">${C.vishnu(0, 0, 1, { id: 'p1sh', eyes: 'closed' })}</g>`,
    { s: 1.1 + prog(t, 30.0, 30.3, ease.out) * .06, fx: 1300, fy: 500 }) },
  // 15 30.9–32.9 "and a sacrifice": Vrinda in rising golden light
  { a: 30.9, b: 32.9, f: (t) => { const g = prog(t, 31.0, 32.8);
    return cam(`${BG('#1a0604')}<ellipse cx="960" cy="700" rx="700" ry="600" fill="url(#lampGlow)" opacity="${.5 + g * .4}"/>
      <g opacity="${1 - g * .45}">${C.tulasi(960, 150, .9, { pose: 'anjali', eyes: 'closed', mouth: 'soft', id: 'p1s15' })}</g>
      ${K.N.embersAnim(43, 120, 1920, 1080, t, { color: '#ffd27a', speed: 90 })}`, { s: 1.05, fy: 540 }); } },
  // 16 32.9–37.1 the Lord keeps her in his heart: glowing Tulasi leaf at his chest
  { a: 32.9, b: 37.1, f: (t) => { const g = prog(t, 33.4, 35.0, ease.out), cx = 960, cy = 470;
    const leaf = `<g transform="translate(${cx},${cy}) scale(${.7 + g * .7})"><circle r="150" fill="url(#lampGlow)" opacity="${g}"/><circle r="60" fill="#fff2b0" opacity="${g * .5}" filter="url(#glow)"/>
      <path d="M0 40 C -34 20 -36 -30 0 -60 C 36 -30 34 20 0 40Z" fill="#3fa35a" stroke="#0e3d1f" stroke-width="2" opacity="${g}"/><path d="M0 38 L 0 -52" stroke="#1f6e3a" stroke-width="2" opacity="${g}"/></g>`;
    return cam(`${BG('#050a22')}<ellipse cx="960" cy="480" rx="800" ry="600" fill="url(#blueGlow)" opacity=".75"/>
      ${breathe(C.vishnu(960, 120, 1.25, { id: 'p1v3', eyes: 'lowered', mouth: 'smile' }), t, 960, 1300, .008)}${leaf}
      ${K.N.petalsAnim(45, 10, 1920, 1080, t, { speed: 30, op: .7 })}`, { s: lerp(1.0, 1.3, prog(t, 32.9, 37.1, ease.inOut)), fy: lerp(420, 470, prog(t, 32.9, 37.1)) }); } },
];

const CAPS = [
  [-0.3, 2.3, 'In the courtyard of every Hindu home…'],
  [2.36, 4.4, '…grows a small plant.'],
  [4.58, 7.0, 'Every day we offer it water…'],
  [7.3, 8.4, '…and light a lamp for it.'],
  [8.72, 9.9, '★Tulasi★.', 1.3],
  [10.56, 12.2, 'But do you know…'],
  [12.64, 15.0, 'this plant… was once a ★woman★?'],
  [15.48, 20.2, 'A woman whose ★devotion★ defeated even the gods.'],
  [20.32, 23.5, 'And who cursed Lord ★Vishnu★ himself…'],
  [23.72, 25.9, '…to turn into ★stone★.', 1.15],
  [26.3, 28.5, 'This is a story of ★love★…'],
  [28.9, 29.8, 'of ★devotion★…'],
  [30.06, 30.8, 'of ★deceit★…'],
  [30.94, 32.8, 'and of a ★sacrifice★…'],
  [32.92, 37.0, 'that the Lord kept in his heart ★forever★.'],
];

const flashAt = (t) => { const f = Math.max(clamp(1 - Math.abs(t - 23.76) / .2), .35 * clamp(1 - Math.abs(t - 30.04) / .12));
  return f > 0 ? `<rect width="${K.W}" height="${K.H}" fill="#fff8ea" opacity="${f.toFixed(3)}"/>` : ''; };
const frame = makeFrame(S, CAPS, flashAt);
const SHOTS = S.map((s, i) => ({ n: i + 1, a: s.a, b: s.b }));
module.exports = { W: K.W, H: K.H, FPS: K.FPS, DURATION, frame, CAPS, SHOTS };
