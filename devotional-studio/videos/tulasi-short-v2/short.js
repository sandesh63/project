// Tulasi Devi — YouTube Short v2 (9:16). 27 shots, one picture per spoken phrase, English captions,
// character motion (breathing, blinking, sway, speaking). Timed to ../tulasi-short/words.json (Whisper).
const fs = require('fs');
const path = require('path');
const A = require('../../engine/art.js');
const C = require('../../engine/characters.js');
const N = require('../../engine/anim.js');
const O = require('../../style-frames/face-options-2.js');
const MV = require('../../style-frames/mahadev-v2.js');
const JL = require('../../style-frames/jalandhar.js');
const RI = require('../../style-frames/rishi-indra.js');
const { clamp, lerp, ease, prog, fade, noise } = N;

const W = 1080, H = 1920, FPS = 30, DURATION = 55.8;
const BASE = H / 1080;
const SPEC = { grain: .10, cut: .15, caption: { y: 1440, size: 58, maxChars: 24, lineH: 82 }, safeTop: 230 };

let GRAIN = '';
const gp = path.join(__dirname, '..', 'tulasi-preview', 'grain.png');
if (fs.existsSync(gp)) GRAIN = 'data:image/png;base64,' + fs.readFileSync(gp).toString('base64');
const WORDS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tulasi-short', 'words.json'), 'utf8'));

// ------------------------------------------------------------ helpers
const cam = (inner, { s = 1, fx = 960, fy = 540, px = 0, py = 0, rot = 0 } = {}) =>
  `<g transform="translate(${W / 2 + px},${H / 2 + py}) rotate(${rot}) scale(${BASE * s}) translate(${-fx},${-fy})">${inner}</g>`;
const BG = (fill, op = 1) => `<rect x="-900" y="-900" width="3720" height="2880" fill="${fill}" opacity="${op}"/>`;
const breathe = (svg, t, ax, ay, amp = .012, ph = 0) => { const b = Math.sin(t * 1.6 + ph); return `<g transform="translate(${ax},${ay}) scale(${1 + amp * .35 * b},${1 + amp * b}) translate(${-ax},${-ay})">${svg}</g>`; };
const sway = (svg, t, ax, ay, deg = 1.2, ph = 0) => `<g transform="rotate(${Math.sin(t * .6 + ph) * deg} ${ax} ${ay})">${svg}</g>`;
const blink = (t, base, seed = 0) => ((base === 'open' || base === 'lowered') && ((t + seed) % 4.1) < .12) ? 'closed' : base;
const speaking = (t) => WORDS.some(([s, e]) => t >= s && t <= e) && Math.floor(t * 9) % 2 === 0;
const lampDiya = (x, y, s, t, seed = 1) => `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-70 0 Q 0 46 70 0 Q 0 16 -70 0Z" fill="url(#goldV)" stroke="#7a4a10" stroke-width="2"/>
  <g transform="translate(40,-2) scale(1.6)">${A.flame(0, 0, 1, noise(t, seed) * 4)}</g></g>`;
const burst = (cx, cy, p, n = 46, seed = 4, col = '#ffe7a0', R = 260) => {
  if (p <= 0 || p >= 1) return ''; const r = A.rng(seed); let out = '';
  for (let i = 0; i < n; i++) { const a = r() * 6.283, d = R * (.2 + p * (.6 + r() * .8)); out += `<circle cx="${cx + Math.cos(a) * d}" cy="${cy + Math.sin(a) * d}" r="${(1.5 + r() * 3.5) * (1 - p * .6)}" fill="${col}" opacity="${(1 - p) * (.6 + r() * .4)}" filter="url(#glow)"/>`; }
  return out;
};
const shieldDome = (cx, cy, rx, ry, t, op = 1) => `<g opacity="${op}">
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffd66b" opacity=".10"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#ffd66b" stroke-width="5" opacity=".85" filter="url(#glow)"/>
  ${[0, 1, 2].map(k => { const ph = ((t + k * .6) % 1.8) / 1.8; return `<ellipse cx="${cx}" cy="${cy}" rx="${rx * (.7 + ph * .35)}" ry="${ry * (.7 + ph * .35)}" fill="none" stroke="#fff1b8" stroke-width="${4 * (1 - ph)}" opacity="${(1 - ph) * .7}"/>`; }).join('')}</g>`;
const tree = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-40 0 C -30 -120 -50 -260 -20 -420 L 20 -420 C 40 -260 34 -120 46 0Z" fill="#3a2414" stroke="#1a0e06" stroke-width="3"/>
  <path d="M-20 -300 C -80 -340 -140 -360 -200 -350 M10 -340 C 70 -380 140 -400 210 -380" stroke="#3a2414" stroke-width="18" fill="none" stroke-linecap="round"/>
  ${[[-180, -420, 140], [0, -500, 180], [170, -430, 150], [-90, -560, 130], [90, -570, 130]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1f4a2a"/><circle cx="${cx - r * .2}" cy="${cy - r * .25}" r="${r * .7}" fill="#2a6a3a" opacity=".8"/>`).join('')}</g>`;
const clouds = (y, seed, col = 'url(#cloud)', op = .95) => { const r = A.rng(seed); return [...Array(10)].map(() => `<ellipse cx="${400 + r() * 1120}" cy="${y + r() * 80}" rx="${90 + r() * 120}" ry="${40 + r() * 40}" fill="${col}" opacity="${op}"/>`).join(''); };
const stars = (seed, n = 160) => { const r = A.rng(seed); let o = ''; for (let i = 0; i < n; i++) o += `<circle cx="${r() * 1920}" cy="${r() * 700}" r="${r() * 1.8 + .3}" fill="#fff" opacity="${r() * .8 + .15}"/>`; return o; };
const visitor = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})" filter="url(#silRim)">
  <path d="M0 -40 L 14 -6 L 26 -40 L 30 0 L -30 0 L -26 -40 L -14 -6Z" fill="#05060f"/><ellipse cx="0" cy="26" rx="26" ry="32" fill="#05060f"/>
  <path d="M-12 54 L -14 72 C -50 78 -78 84 -88 100 L -104 260 L -96 330 L -80 330 L -76 220 L -66 160 L -60 330 C -58 420 -56 520 -54 600 L -18 600 L -6 380 L 6 380 L 18 600 L 54 600 C 56 520 58 420 60 330 L 66 160 L 76 220 L 80 330 L 96 330 L 104 260 L 88 100 C 78 84 50 78 14 72 L 12 54Z" fill="#05060f"/></g>`;

// sets
const templeSet = (t, glow = .55) => `${BG('url(#bgTemple)')}
  ${A.templeSilhouette(300, 900, 1.1, '#26101e')}${A.templeSilhouette(1640, 920, .9, '#26101e')}
  <g transform="rotate(${t * 4} 960 330)">${A.mandalaGlow(960, 330, 520, '#ffcf6a', glow)}</g>
  ${A.prabhavali(960, 780, 400, { flames: 25, thick: 30, pillar: 400 })}`;
const doorRoom = (t, doorOpen = 1) => { const fl = noise(t, 9);
  return `${BG('url(#wallNight)')}
  <rect x="900" y="-300" width="1600" height="1200" fill="#6a5866"/>
  <ellipse cx="1500" cy="420" rx="760" ry="560" fill="url(#lampGlow)" opacity="${.42 + fl * .04}"/>
  <rect x="900" y="-300" width="40" height="1200" fill="#1c1a2c" opacity=".7"/>
  <path d="M360 900 L 360 330 Q 540 190 720 330 L 720 900Z" fill="url(#moonSky)" opacity="${doorOpen}"/>
  <circle cx="610" cy="360" r="46" fill="#f4f6ff" opacity="${.9 * doorOpen}"/>
  <path d="M360 330 Q 450 260 540 250 L 540 900 L 360 900Z" fill="#3a2010" stroke="#1e0e06" stroke-width="3" transform="translate(360,0) scale(${1 - doorOpen * .85},1) translate(-360,0)"/>
  <path d="M720 330 Q 630 260 540 250 L 540 900 L 720 900Z" fill="#3a2010" stroke="#1e0e06" stroke-width="3" transform="translate(720,0) scale(${1 - doorOpen * .85},1) translate(-720,0)"/>
  <path d="M330 910 L 330 320 Q 540 150 750 320 L 750 910 L 720 910 L 720 330 Q 540 190 360 330 L 360 910Z" fill="#4a2a16" stroke="#1e0e06" stroke-width="4"/>
  <rect x="-900" y="900" width="3720" height="1000" fill="#0e1024"/>
  <path d="M360 900 L 720 900 L 1120 1080 L 120 1080Z" fill="url(#moonPool)" opacity="${doorOpen}"/>
  <path d="M90 560 L 90 470 Q 140 420 190 470 L 190 560Z" fill="#1a0e0a"/><rect x="120" y="540" width="40" height="12" rx="5" fill="${A.P.gold3}"/>${A.flame(140, 540, .7, fl * 3)}`; };

// ------------------------------------------------------------ 27 shots
const T = (o) => C.tulasi(o.x ?? 960, o.y ?? 110, o.s ?? 3.2, o);
const S = [
  // 1  0.0–1.7  "Do you know…": diya lights in darkness
  { a: 0, b: 1.75, f: (t) => { const l = prog(t, .1, .9, ease.out);
    return cam(`${BG('#070305')}<ellipse cx="960" cy="560" rx="${600 * l}" ry="${520 * l}" fill="url(#lampGlow)" opacity="${.9 * l}"/>${lampDiya(960, 640, 2.4 * (.3 + .7 * l), t)}${N.embersAnim(2, 30, 1920, 1080, t, { op: l })}`, { s: 1 + t * .03, fy: 560 }); } },
  // 2  1.7–3.8  Vishnu in the temple; flickers to stone on "पत्थर" (2.82)
  { a: 1.7, b: 3.85, f: (t) => { const g = clamp(1 - Math.abs(t - 3.0) / .2);
    return cam(`${templeSet(t)}<filter id="s2f"><feColorMatrix type="saturate" values="${1 - g}"/></filter>
      <g filter="url(#s2f)">${breathe(C.vishnu(960, 120, .88, { id: 's2', eyes: blink(t, 'lowered', .3), mouth: 'smile' }), t, 960, 960)}</g>${N.embersAnim(7, 40, 1920, 1080, t)}`,
      { s: 1.15, fx: 960, fy: lerp(820, 430, prog(t, 1.7, 3.6, ease.inOut)) }); } },
  // 3  3.8–5.8  "…cursed? who gave it?": the Shaligram glows
  { a: 3.75, b: 5.95, f: (t) => cam(`${BG('#040820')}<g transform="rotate(${t * 12} 960 560)">${A.mandalaGlow(960, 560, 560, '#bcd6ff', .4 + .1 * Math.sin(t * 4))}</g>${A.shaligram(960, 600, 1.3, .9 + .1 * Math.sin(t * 5))}${N.embersAnim(21, 60, 1920, 1080, t, { color: '#cfe2ff', speed: 30 })}`,
    { s: lerp(1.05, 1.2, prog(t, 3.75, 5.9)), fy: 580 }) },
  // 4  6.0–7.5  "Not a sage…": rishi meditating under a tree
  { a: 5.9, b: 7.55, f: (t) => cam(`${BG('#0e2018')}${BG('url(#forestSky)')}${tree(700, 990, 1.3)}${tree(1300, 1000, 1.1)}
      <rect x="-900" y="930" width="3720" height="900" fill="#1a2a14"/>
      ${breathe(RI.rishi(960, 150, .85, { id: 's4', eyes: 'closed', mouth: 'soft' }), t, 960, 950)}${N.embersAnim(5, 30, 1920, 1080, t, { color: '#e8f8c0', speed: 15, op: .6 })}`,
    { s: 1.05, fx: lerp(880, 1040, prog(t, 5.9, 7.55)), fy: 500 }) },
  // 5  7.5–9.0  "…not a god.": Indra on clouds
  { a: 7.45, b: 9.05, f: (t) => cam(`${BG('url(#skyDay)')}${clouds(820, 3)}${breathe(RI.indra(960, 150, .82, { id: 's5', eyes: blink(t, 'open', 1.1), mouth: 'soft' }), t, 960, 950)}${clouds(940, 8, 'url(#cloud)', .9)}`,
    { s: 1.05, fx: lerp(1040, 880, prog(t, 7.45, 9.05)), fy: 500 }) },
  // 6  9.0–11.5 "A devoted wife —": Vrinda praying in the temple, wide
  { a: 8.95, b: 11.55, f: (t) => cam(`${templeSet(t)}${A.lotus(960, 1010, 1.9, '#f6b6c6', '#c64f73')}
      ${breathe(C.tulasi(960, 140, .93, { pose: 'anjali', eyes: blink(t, 'lowered', .7), mouth: 'soft', id: 's6' }), t, 960, 1000)}
      ${A.nilavilakku(600, 1080, 1.0, noise(t, 2) * 3)}${A.nilavilakku(1320, 1080, 1.0, noise(t, 5) * 3)}${N.petalsAnim(9, 26, 1920, 1080, t)}`,
    { s: lerp(1.0, 1.15, prog(t, 8.95, 11.5)), fy: lerp(560, 470, prog(t, 8.95, 11.5)) }) },
  // 7  11.5–12.8 "— Vrinda.": her eyes open, close-up, title
  { a: 11.5, b: 12.85, f: (t) => { const eyes = t < 11.62 ? 'closed' : t < 11.75 ? 'lowered' : 'open';
    return cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 3} 960 330)">${A.mandalaGlow(960, 330, 560, '#ffcf6a', .55)}</g>
      ${sway(T({ pose: 'anjali', eyes, mouth: 'soft', id: 's7' }), t, 960, 900)}`, { s: 1.04 + prog(t, 11.6, 11.95, ease.out) * .05, fy: 450 }); }, title: [11.6, 12.85, 'VRINDA'] },
  // 8  12.8–15.5 "Her devotion was so powerful…": golden aura rises, lamps flare
  { a: 12.8, b: 15.55, f: (t) => { const a = prog(t, 12.9, 15.0);
    return cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 6} 960 360)">${A.mandalaGlow(960, 360, 500 + a * 160, '#ffcf6a', .5 + a * .3)}</g>
      ${shieldDome(960, 520, 300 + a * 40, 470 + a * 40, t, a)}
      ${breathe(C.tulasi(960, 120, 1.55, { pose: 'anjali', eyes: 'closed', mouth: 'soft', id: 's8' }), t, 960, 1100)}
      ${A.nilavilakku(650, 1080, .9 + a * .2, noise(t, 2) * 3)}${A.nilavilakku(1270, 1080, .9 + a * .2, noise(t, 5) * 3)}${N.embersAnim(11, 70, 1920, 1080, t, { speed: 60 + a * 60 })}`,
      { s: lerp(1.25, 1.0, prog(t, 12.8, 15.5, ease.out)), fy: 520 }); } },
  // 9  15.5–17.4 "her husband Jalandhar…": asura king on his throne inside the golden shield
  { a: 15.5, b: 17.45, f: (t) => cam(`${BG('url(#asuraBg)')}
      <path d="M760 980 L 760 300 Q 960 120 1160 300 L 1160 980Z" fill="url(#darkGold)" opacity=".85" stroke="#3a2406" stroke-width="4"/>
      <path d="M800 980 L 800 320 Q 960 170 1120 320 L 1120 980Z" fill="#3a0a10"/>
      ${breathe(JL.jalandharFull(960, 210, .8, { id: 's9', eyes: blink(t, 'open', .2) === 'closed' ? 'closed' : 'angry' }), t, 960, 960)}
      ${shieldDome(960, 560, 290, 430, t, 1)}${N.embersAnim(13, 50, 1920, 1080, t, { color: '#ffb04a', speed: 40 })}`,
    { s: lerp(1.15, 1.05, prog(t, 15.5, 17.4)), fy: lerp(600, 520, prog(t, 15.5, 17.4)) }), title: [15.7, 17.45, 'JALANDHAR'] },
  // 10 17.4–19.3 "…even Mahadev…": Mahadev on the battlefield, third eye blazes
  { a: 17.4, b: 19.35, f: (t) => { const eye = t > 18.0 ? 'angry' : 'open';
    const bolt = Math.floor(t * 5) % 3 === 0 ? `<path d="M${400 + (t * 97 % 300)} -100 L ${480 + (t * 53 % 200)} 200 L ${430 + (t * 71 % 200)} 220 L ${520 + (t * 31 % 200)} 560" stroke="#cfe6ff" stroke-width="4" fill="none" filter="url(#glow)"/>` : '';
    return cam(`${BG('url(#battleSky)')}${clouds(200, 11, '#2a2a4a', .8)}${bolt}${clouds(960, 14, '#3a3a5a', .9)}
      ${breathe(MV.mahadevFull(960, 240, .8, { id: 's10', eyes: eye, mouth: 'soft', t }), t, 960, 980)}`,
      { s: 1.12, fy: lerp(800, 430, prog(t, 17.4, 19.0, ease.inOut)) }); } },
  // 11 19.3–21.2 "…could not defeat him.": trishul strikes the shield and bounces off; cut to her steady lamp
  { a: 19.3, b: 21.25, f: (t) => { const hit = 19.9, fly = prog(t, 19.3, hit, ease.in), back = prog(t, hit, 20.6, ease.out);
    const ox = lerp(377, 677, fly) - back * 160, oy = lerp(-112, 188, fly) - back * 220, rot = 135 - back * 70;
    const shake = clamp(1 - Math.abs(t - hit) / .5) * 8;
    if (t > 20.7) return cam(`${BG('#0a0406')}<ellipse cx="960" cy="560" rx="500" ry="460" fill="url(#lampGlow)" opacity=".85"/>${lampDiya(960, 640, 2.2, t, 3)}`, { s: 1.0, fy: 560 });
    return cam(`${BG('url(#asuraBg)')}${clouds(900, 21, '#3a1a2a', .8)}
      ${JL.jalandharFull(960, 230, .78, { id: 's11', eyes: t > hit ? 'open' : 'angry', mouth: t > hit ? 'smile' : undefined })}
      ${shieldDome(960, 560, 290, 430, t, 1)}
      <g transform="translate(${ox},${oy}) rotate(${rot}) scale(.7)">${MV.trishul(0, 0, 1, t, 520)}</g>
      ${burst(776, 287, prog(t, hit, hit + .7), 60, 6)}`, { s: 1.05, fy: 520, px: noise(t * 6, 1) * shake, py: noise(t * 6, 3) * shake }); } },
  // 12 21.2–22.5 "Then one night…": moon over the palace
  { a: 21.2, b: 22.55, f: (t) => cam(`${BG('url(#nightSky)')}${stars(9)}<circle cx="1110" cy="190" r="150" fill="#fff2c8" opacity=".14" filter="url(#softGlow)"/><circle cx="1110" cy="190" r="62" fill="#fff4d6"/>
      <g transform="translate(${(t - 21.2) * 30},0)">${clouds(330, 31, '#3a3a6a', .55)}</g>
      ${A.templeSilhouette(900, 1000, .95, '#0c0a24')}${A.templeSilhouette(700, 1000, .7, '#100e2c')}${A.templeSilhouette(1220, 1000, .7, '#100e2c')}
      ${[...Array(7)].map((_, i) => `<rect x="${800 + i * 50}" y="900" width="14" height="22" fill="#ffb347" opacity="${.5 + .3 * Math.sin(t * 3 + i)}"/>`).join('')}`,
    { s: 1.05, fy: lerp(380, 560, prog(t, 21.2, 22.5, ease.inOut)) }) },
  // 13 22.5–25.3 "her husband came to her door.": the door opens, he stands backlit
  { a: 22.5, b: 25.35, f: (t) => { const o = prog(t, 22.6, 23.8, ease.inOut);
    return cam(`${doorRoom(t, o)}<g opacity="${prog(t, 23.2, 24.0)}">${visitor(540, 300, 1)}</g>${N.embersAnim(13, 30, 1920, 1080, t, { color: '#cfe2ff', op: .5, speed: 20 })}`,
      { s: lerp(1.0, 1.15, prog(t, 22.5, 25.3)), fx: 560, fy: 560 }); } },
  // 14 25.3–26.7 "Same face…": "Jalandhar" smiling, close-up
  { a: 25.3, b: 26.75, f: (t) => cam(`${BG('url(#wallNight)')}<ellipse cx="960" cy="420" rx="500" ry="500" fill="#9fc0ff" opacity=".18" filter="url(#softGlow)"/>
      ${sway(breathe(JL.jalandharFull(960, 120, 2.9, { id: 's14', eyes: blink(t, 'open', .4), mouth: 'smile' }), t, 960, 1200, .008), t, 960, 900, .8)}`,
    { s: lerp(1.0, 1.06, prog(t, 25.3, 26.7)), fy: 360 }) },
  // 15 26.7–28.3 "same voice…": Vrinda smiles happily and rises
  { a: 26.7, b: 28.35, f: (t) => cam(`${BG('url(#bgTemple)')}<g transform="rotate(${t * 3} 960 330)">${A.mandalaGlow(960, 330, 560, '#ffcf6a', .45)}</g>
      <g transform="translate(0,${-prog(t, 26.8, 27.8, ease.out) * 40})">${sway(T({ eyes: blink(t, 'open', .9), mouth: 'smile', id: 's15' }), t, 960, 900)}</g>`, { s: 1.04, fy: 430 }) },
  // 16 28.3–31.3 "But the shadow on the wall…": camera slides to the wall, the shadow changes
  { a: 28.3, b: 31.3, f: (t) => { const g = prog(t, 29.0, 31.25, ease.inOut), pan = prog(t, 28.3, 30.5, ease.inOut);
    return cam(`${doorRoom(t, 1)}
      <g opacity="${g}" transform="translate(1440,${lerp(330, 170, g)}) skewX(-8) scale(${lerp(.42, .68, g)})" filter="url(#shadowify)">${C.vishnu(0, 0, 1, { id: 's16sh', eyes: 'closed' })}</g>
      ${visitor(540, 300, 1)}`, { s: 1.05 + pan * .08, fx: lerp(560, 1430, pan), fy: lerp(540, 520, pan) }); } },
  // 17 31.3–32.7 "…had four arms.": complete four-armed shadow, punch-in
  { a: 31.3, b: 32.75, f: (t) => cam(`${doorRoom(t, 1)}
      <g transform="translate(1440,170) skewX(-8) scale(.68)" filter="url(#shadowify)">${C.vishnu(0, 0, 1, { id: 's17sh', eyes: 'closed' })}</g>`,
    { s: 1.13 + prog(t, 31.3, 31.65, ease.out) * .08, fx: 1430, fy: 500 }) },
  // 18 32.7–35.8 "When Vrinda learned the truth…": smile → shock
  { a: 32.7, b: 35.85, f: (t) => { const shock = t > 33.4;
    return cam(`${BG('url(#bgGrief)')}<g transform="rotate(${t * 2} 960 360)">${A.mandalaGlow(960, 360, 560, '#9fb8ff', .35)}</g>
      ${sway(T({ eyes: shock ? 'wide' : 'open', mouth: shock ? 'open' : 'smile', id: 's18' }), t, 960, 900, .6)}`, { s: shock ? lerp(1.04, 1.14, prog(t, 33.4, 33.7, ease.out)) : 1.04, fy: 440 }); } },
  // 19 35.8–37.0 "tears in her eyes…": extreme close-up, tear rolls
  { a: 35.8, b: 37.05, f: (t) => cam(`${BG('url(#bgGrief)')}${C.tulasi(960, 110, 6, { eyes: 'lowered', mouth: 'soft', tears: true, sad: true, id: 's19' })}`,
    { s: lerp(1.0, 1.05, prog(t, 35.8, 37.0)), fy: 520 }) },
  // 20 37.0–39.8 "and a curse on her lips.": anger rises, her palm lifts, red energy gathers
  { a: 37.0, b: 39.85, f: (t) => { const r = prog(t, 37.2, 39.6);
    return cam(`${BG('url(#bgGrief)')}${BG('url(#redEnergy)', r)}<g transform="rotate(${t * 20} 960 420)">${A.mandalaGlow(960, 420, 700, '#ffb04a', .2 + r * .4)}</g>
      ${T({ eyes: t > 38.5 ? 'angry' : 'lowered', mouth: 'soft', tears: true, id: 's20' })}
      ${(() => { const hy = lerp(1100, 590, prog(t, 37.6, 38.8, ease.out));
        // forearm from below the frame up to the wrist, with bangles, then the palm
        return `<path d="M${1120 - 40} ${hy + 14} C ${1120 - 46} ${hy + 160} ${1120 - 30} ${hy + 330} ${1120 - 6} ${hy + 520} L ${1120 + 86} ${hy + 520} C ${1120 + 70} ${hy + 330} ${1120 + 50} ${hy + 160} ${1120 + 44} ${hy + 14}Z" fill="url(#tSkin)" stroke="#3b1c0e" stroke-width="2.4"/>
          <path d="M${1120 - 40} ${hy + 30} C ${1120 - 44} ${hy + 170} ${1120 - 28} ${hy + 330} ${1120 - 6} ${hy + 510}" stroke="#b9774a" stroke-width="10" fill="none" opacity=".35"/>
          ${[0, 1, 2, 3].map(k => `<path d="M${1120 - 42 + k * .5} ${hy + 34 + k * 14} Q ${1120 + 2} ${hy + 46 + k * 14} ${1120 + 46 - k * .2} ${hy + 34 + k * 14}" stroke="${k === 1 ? '#c8201a' : 'url(#gold)'}" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('')}
          <g transform="translate(1122,${hy}) scale(2.0)">${A.openPalm('url(#tSkin)', '#b9774a', -1)}</g>`; })()}
      ${N.embersAnim(17, 60, 1920, 1080, t, { color: '#ffcf6a', speed: 40 + r * 120, op: r })}`, { s: 1.04 + r * .06, fy: 470 }); } },
  // 21 39.8–42.5 "As you turned my heart to stone…": two-shot, Vrinda speaks, Vishnu before her
  { a: 39.8, b: 42.55, f: (t) => cam(`${BG('url(#redEnergy)')}<g transform="rotate(${t * 15} 960 420)">${A.mandalaGlow(960, 420, 800, '#ffb04a', .35)}</g>
      ${breathe(C.vishnu(1130, 150, 1.45, { id: 's21v', eyes: 'lowered', mouth: 'soft', sad: true }), t, 1130, 1300)}
      ${breathe(C.tulasi(800, 160, 1.5, { eyes: 'angry', mouth: speaking(t) ? 'open' : 'soft', tears: true, id: 's21t' }), t, 800, 1300, .014, 1)}
      ${N.embersAnim(19, 70, 1920, 1080, t, { color: '#ffcf6a', speed: 120 })}`,
    { s: .92, fx: lerp(900, 1010, prog(t, 39.8, 42.5)), fy: 520, px: noise(t * 6, 2) * 3 }) },
  // 22 42.5–45.5 "…you too shall become stone!": curse beam hits Vishnu, flash on "पत्थर" (43.84)
  { a: 42.5, b: 45.55, f: (t) => { const beam = prog(t, 42.7, 43.84, ease.in), shake = prog(t, 42.6, 43.84) * 9 * (1 - prog(t, 44.2, 45));
    return cam(`${BG('url(#redEnergy)')}<g transform="rotate(${t * 40} 960 420)">${A.mandalaGlow(960, 420, 900, '#ffb04a', .5)}</g>
      ${C.vishnu(960, 150, 1.0, { id: 's22', eyes: t > 43.84 ? 'closed' : 'lowered', mouth: 'soft', sad: true })}
      <path d="M200 1300 L ${lerp(200, 960, beam)} ${lerp(1300, 420, beam)}" stroke="#ffe08a" stroke-width="${18 * beam}" stroke-linecap="round" filter="url(#glow)" opacity="${beam > 0 && t < 44.3 ? 1 : 0}"/>
      ${burst(960, 420, prog(t, 43.84, 44.6), 70, 9, '#fff1b8', 380)}${N.embersAnim(23, 90, 1920, 1080, t, { color: '#ffcf6a', speed: 160 })}`,
      { s: lerp(1.1, 1.3, prog(t, 42.5, 43.9, ease.in)), fy: 430, px: noise(t * 6, 1) * shake, py: noise(t * 6, 4) * shake }); } },
  // 23 45.5–47.6 "And the Lord… that curse": Vishnu, eyes closed, hands joined, calm
  { a: 45.5, b: 47.65, f: (t) => cam(`${BG('#050a22')}<ellipse cx="960" cy="520" rx="700" ry="600" fill="url(#blueGlow)" opacity=".7"/><g transform="rotate(${t * 10} 960 520)">${A.mandalaGlow(960, 520, 600, '#bcd6ff', .4)}</g>
      ${breathe(C.vishnu(960, 150, .78, { pose: 'accept', eyes: 'closed', mouth: 'soft', id: 's23' }), t, 960, 900, .008)}${N.embersAnim(21, 60, 1920, 1080, t, { color: '#cfe2ff', speed: 30 })}`,
    { s: lerp(1.0, 1.1, prog(t, 45.5, 47.6)), fy: 470 }) },
  // 24 47.6–49.4 "…silently accepted.": he turns to stone, becomes the Shaligram
  { a: 47.6, b: 49.45, f: (t) => { const toStone = prog(t, 47.7, 48.6), vis = 1 - prog(t, 48.3, 49.0), stone = prog(t, 48.2, 49.2, ease.out);
    return cam(`${BG('#050a22')}<ellipse cx="960" cy="520" rx="${700 + stone * 200}" ry="${600 + stone * 150}" fill="url(#blueGlow)" opacity="${.7 + stone * .3}"/>
      <filter id="s24f"><feColorMatrix type="saturate" values="${1 - toStone}"/><feComponentTransfer><feFuncR type="linear" slope="${1 - toStone * .55}"/><feFuncG type="linear" slope="${1 - toStone * .55}"/><feFuncB type="linear" slope="${1 - toStone * .5}"/></feComponentTransfer></filter>
      <g opacity="${vis}" filter="url(#s24f)" transform="translate(960,560) scale(${lerp(1, .55, prog(t, 48.2, 49.0, ease.in))}) translate(-960,-560)">${C.vishnu(960, 150, .78, { pose: 'accept', eyes: 'closed', mouth: 'soft', id: 's24' })}</g>
      <g opacity="${stone}">${A.shaligram(960, 600, lerp(.4, 1.25, stone), 1)}</g>${N.embersAnim(21, 80, 1920, 1080, t, { color: '#cfe2ff', speed: 50 })}`,
      { s: lerp(1.1, 1.0, prog(t, 47.6, 49.4)), fy: lerp(470, 560, prog(t, 47.6, 49.2)) }); } },
  // 25 49.4–50.8 "But why?": a lamp in darkness, Vishnu's sorrowful face fades above
  { a: 49.4, b: 50.85, f: (t) => cam(`${BG('#05030a')}<g opacity="${.35 * (1 - prog(t, 50.2, 50.8))}">${C.vishnu(960, 170, 1.6, { id: 's25', eyes: 'lowered', mouth: 'soft', sad: true })}</g>
      <rect x="-900" y="560" width="3720" height="1400" fill="#05030a" opacity=".6"/>
      <ellipse cx="960" cy="860" rx="420" ry="300" fill="url(#lampGlow)" opacity=".85"/>${lampDiya(960, 900, 1.8, t, 7)}`, { s: 1.0, fy: 600 }) },
  // 26 50.8–53.1 "And how did Vrinda become Tulasi?": Vrinda dissolves into gold, the plant grows
  { a: 50.8, b: 53.15, f: (t) => { const d = prog(t, 50.9, 51.9), g = lerp(.12, 1, prog(t, 51.3, 52.9, ease.out)), lt = t - 50.8;
    const rays = [...Array(24)].map((_, i) => `<path transform="rotate(${i * 15 + lt * 4})" d="M0 -60 L 14 -900 L -14 -900Z" fill="#fff2c0" opacity="${i % 2 ? .08 : .16}"/>`).join('');
    const parts = (() => { const r = A.rng(55); let o = ''; for (let i = 0; i < 80; i++) { const x0 = 860 + r() * 200, y0 = 160 + r() * 700, p = clamp(d * 1.4 - r() * .4);
      o += `<circle cx="${lerp(x0, 960 + (r() - .5) * 120, p)}" cy="${lerp(y0, 720 + (r() - .5) * 60, p)}" r="${2 + r() * 3}" fill="#ffe08a" opacity="${p > 0 && p < 1 ? .9 : 0}" filter="url(#glow)"/>`; } return o; })();
    return cam(`${BG('url(#dawnSky)')}<g transform="translate(960,560)">${rays}</g><circle cx="960" cy="560" r="260" fill="url(#sunDisc)"/>
      ${A.templeSilhouette(1240, 760, .55, '#6a3048')}${A.templeSilhouette(680, 760, .45, '#7a3a50')}
      <path d="M-900 740 Q 480 700 960 730 T 2800 720 L 2800 1900 L -900 1900Z" fill="url(#floorStone)"/>
      <ellipse cx="960" cy="760" rx="520" ry="300" fill="url(#lampGlow)" opacity=".45"/>
      ${A.tulasiKatte(960, 985, 1.05, 11, g)}
      <g opacity="${1 - d}">${C.tulasi(960, 150, .9, { pose: 'anjali', eyes: 'closed', mouth: 'soft', id: 's26' })}</g>${parts}
      ${N.petalsAnim(29, 18, 1920, 1080, t, { speed: 45, op: .8 })}`, { s: lerp(1.08, 1.0, prog(t, 50.8, 53.1, ease.out)), fy: 600 }); }, title: [51.8, 55.8, 'TULASI DEVI', 'big'] },
  // 27 53.1–55.8 "Watch the full story — link below": title card + arrow
  { a: 53.1, b: 55.8, f: (t) => cam(`${BG('url(#dawnSky)')}<circle cx="960" cy="560" r="300" fill="url(#sunDisc)"/>
      <path d="M-900 740 Q 480 700 960 730 T 2800 720 L 2800 1900 L -900 1900Z" fill="url(#floorStone)"/>
      ${A.tulasiKatte(960, 985, 1.05, 11, 1)}${N.petalsAnim(29, 22, 1920, 1080, t, { speed: 45, op: .8 })}${N.embersAnim(31, 40, 1920, 1080, t, { color: '#fff2c0', speed: 25 })}`,
    { s: 1.0, fy: 600 }), title: [51.8, 55.8, 'TULASI DEVI', 'big'], arrow: [54.6, 55.8] },
];

const CAPS = [
  [0.0, 1.2, 'Do you know…'],
  [1.72, 5.6, 'who cursed Lord Vishnu to turn into ★stone★?'],
  [6.08, 7.5, 'Not a sage…'],
  [7.58, 8.75, 'not a god.'],
  [9.08, 12.4, 'A devoted wife — ★Vrinda★.'],
  [12.9, 15.45, 'Her ★devotion★ was so powerful…'],
  [15.56, 17.4, 'that her husband ★Jalandhar★…'],
  [17.46, 20.95, 'could not be defeated even by ★Mahadev★.'],
  [21.36, 25.0, 'Then one night… her husband came to her door.'],
  [25.48, 27.8, 'Same face… same voice…'],
  [28.36, 30.95, 'But the shadow on the wall…'],
  [31.3, 32.35, 'had ★four arms★.', 1.3],
  [32.78, 34.7, 'When Vrinda learned the truth…'],
  [35.86, 36.95, 'there were ★tears★ in her eyes…'],
  [36.98, 39.3, 'and a ★curse★ on her lips.'],
  [39.92, 42.4, '"As you turned my heart to stone…"'],
  [42.6, 45.2, '"…you too shall become ★stone★!"', 1.15],
  [45.6, 49.3, 'And the Lord… silently accepted the curse.'],
  [49.38, 50.7, 'But ★why?★', 1.3],
  [50.9, 52.95, 'And how did Vrinda become ★Tulasi★?'],
  [53.18, 55.72, 'Watch the full story — ★link below★'],
];

function wrap(text, max) {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { const plain = (cur + ' ' + w).replace(/★/g, '').trim(); if (plain.length > max && cur) { lines.push(cur); cur = w; } else cur = (cur ? cur + ' ' : '') + w; }
  if (cur) lines.push(cur); return lines;
}
function captionSVG(t) {
  let out = '';
  for (const [a, b, text, big = 1] of CAPS) {
    const op = fade(t, a - .08, b + .25, .15, .2); if (op <= 0) continue;
    const pop = lerp(.9, 1, prog(t, a - .08, a + .12, ease.out)), size = SPEC.caption.size * big;
    const lines = wrap(text, Math.round(SPEC.caption.maxChars / big));
    const y0 = SPEC.caption.y - (lines.length - 1) * SPEC.caption.lineH * big / 2;
    const ls = lines.map((ln, i) => { let hl = false;
      const spans = ln.split(/(★)/).filter(Boolean).map(p => { if (p === '★') { hl = !hl; return ''; } return `<tspan fill="${hl ? '#ffd66b' : '#fff8ec'}">${p.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</tspan>`; }).join('');
      return `<text x="${W / 2}" y="${y0 + i * SPEC.caption.lineH * big}" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="${size}" style="paint-order:stroke" stroke="#120604" stroke-width="10" stroke-linejoin="round">${spans}</text>`; }).join('');
    out += `<g opacity="${op}" transform="translate(${W / 2},${SPEC.caption.y}) scale(${pop}) translate(${-W / 2},${-SPEC.caption.y})">${ls}</g>`;
  }
  return out;
}

const defs = `<defs>
  <linearGradient id="bgTemple" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b0d24"/><stop offset=".55" stop-color="#4a1418"/><stop offset="1" stop-color="#1a0806"/></linearGradient>
  <linearGradient id="bgGrief" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1030"/><stop offset=".6" stop-color="#2a1430"/><stop offset="1" stop-color="#0a0610"/></linearGradient>
  <linearGradient id="asuraBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0408"/><stop offset=".6" stop-color="#4a0a12"/><stop offset="1" stop-color="#120206"/></linearGradient>
  <linearGradient id="battleSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0c24"/><stop offset=".6" stop-color="#2a1a3a"/><stop offset="1" stop-color="#4a1a1a"/></linearGradient>
  <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a4a3a" stop-opacity=".9"/><stop offset="1" stop-color="#0e2018" stop-opacity="0"/></linearGradient>
  <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a8ad8"/><stop offset=".6" stop-color="#a8c8f0"/><stop offset="1" stop-color="#f0e4c8"/></linearGradient>
  <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050822"/><stop offset=".7" stop-color="#1c1d52"/><stop offset="1" stop-color="#3a2a4a"/></linearGradient>
  <linearGradient id="wallNight" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#141a3a"/><stop offset=".5" stop-color="#1c2348"/><stop offset="1" stop-color="#2a2a44"/></linearGradient>
  <linearGradient id="moonSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff"/><stop offset=".5" stop-color="#7f9ad8"/><stop offset="1" stop-color="#34407a"/></linearGradient>
  <linearGradient id="moonPool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd2ff" stop-opacity=".55"/><stop offset="1" stop-color="#7f9ad8" stop-opacity="0"/></linearGradient>
  <linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a6a"/><stop offset=".35" stop-color="#c0507a"/><stop offset=".7" stop-color="#f59a4a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
  <linearGradient id="floorStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a3a"/><stop offset="1" stop-color="#3a2014"/></linearGradient>
  <radialGradient id="redEnergy" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#ffcf6a"/><stop offset=".3" stop-color="#e2541e"/><stop offset=".7" stop-color="#7a120c"/><stop offset="1" stop-color="#1a0404"/></radialGradient>
  <radialGradient id="sunDisc" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe6"/><stop offset=".5" stop-color="#ffe08a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
  <linearGradient id="topBand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
  <linearGradient id="cband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
  <filter id="shadowify" x="-20%" y="-20%" width="140%" height="140%"><feColorMatrix type="matrix" values="0 0 0 0 .03  0 0 0 0 .03  0 0 0 0 .07  0 0 0 .92 0"/><feGaussianBlur stdDeviation="3.5"/></filter>
  <filter id="silRim" x="-20%" y="-20%" width="140%" height="140%"><feMorphology operator="dilate" radius="3" in="SourceAlpha" result="d"/><feGaussianBlur in="d" stdDeviation="4" result="b"/><feFlood flood-color="#9fc0ff"/><feComposite in2="b" operator="in" result="rim"/><feMerge><feMergeNode in="rim"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <pattern id="grainPat" width="512" height="512" patternUnits="userSpaceOnUse"><image href="${GRAIN}" width="512" height="512"/></pattern>
  ${O.skinDefs}${MV.tiger}
</defs>`;

function frame(t) {
  let body = '', title = null, arrow = null;
  for (const s of S) {
    // no dip to black at cuts: the outgoing shot stays fully opaque until the incoming one has faded in on top of it
    if (t < s.a - .001 || t > s.b + SPEC.cut) continue;
    const op = s.a === 0 ? 1 : clamp((t - s.a) / SPEC.cut);
    if (op > 0) body += `<g opacity="${op.toFixed(3)}">${s.f(t)}</g>`;
    if (s.title && t >= s.title[0] && t <= s.title[1]) title = s.title;
    if (s.arrow && t >= s.arrow[0]) arrow = s.arrow;
  }
  const flash = Math.max(clamp(1 - Math.abs(t - 43.88) / .22), .6 * clamp(1 - Math.abs(t - 48.6) / .3), .35 * clamp(1 - Math.abs(t - 31.33) / .15), .3 * clamp(1 - Math.abs(t - 19.9) / .12));
  if (flash > 0) body += `<rect width="${W}" height="${H}" fill="#fff8ea" opacity="${flash.toFixed(3)}"/>`;
  const hook = fade(t, .25, 5.5, .3, .3);
  let titleSvg = '';
  if (title) { const p = prog(t, title[0], title[0] + .6, ease.out), big = title[3] === 'big';
    titleSvg = `<g opacity="${p * fade(t, title[0], title[1], .1, .25)}" transform="translate(${W / 2},${SPEC.safeTop + 60}) scale(${lerp(1.15, 1, p)})">
      <rect x="-540" y="-120" width="1080" height="200" fill="url(#topBand)" opacity=".6"/>
      <text text-anchor="middle" font-family="'Cinzel Decorative', Cinzel, serif" font-weight="900" font-size="${big ? 104 : 84}" letter-spacing="${big ? 6 : 10}" fill="url(#goldV)" style="paint-order:stroke" stroke="#2a0e04" stroke-width="9" filter="url(#glow)">${title[2]}</text></g>`; }
  const gx = Math.floor((t * 977) % 512), gy = Math.floor((t * 613) % 512);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${A.defs()}${C.defs2()}${JL.defs}${RI.defs}${defs}
    ${body}
    <rect width="${W}" height="${H}" fill="url(#vignette)"/>
    ${GRAIN ? `<rect x="${-gx}" y="${-gy}" width="${W + 512}" height="${H + 512}" fill="url(#grainPat)" opacity="${SPEC.grain}" style="mix-blend-mode:overlay"/>` : ''}
    <rect y="${SPEC.caption.y - 180}" width="${W}" height="320" fill="url(#cband)"/>
    ${hook > 0 && !title ? `<g opacity="${hook}"><rect width="${W}" height="330" fill="url(#topBand)"/><text x="${W / 2}" y="${SPEC.safeTop - 20}" text-anchor="middle" font-family="Cinzel, serif" font-weight="900" font-size="76" fill="url(#goldV)" style="paint-order:stroke" stroke="#120604" stroke-width="10">WHO CURSED GOD?</text></g>` : ''}
    ${titleSvg}
    ${captionSVG(t)}
    ${arrow ? `<g opacity="${fade(t, arrow[0], arrow[1], .15, .2)}" transform="translate(${W / 2},${1590 + Math.abs(Math.sin(t * 5)) * 22})"><path d="M-34 0 L 0 34 L 34 0" fill="none" stroke="#ffd66b" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M-34 -36 L 0 -2 L 34 -36" fill="none" stroke="#ffd66b" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/></g>` : ''}
  </svg>`;
}

const SHOTS = S.map((s, i) => ({ n: i + 1, a: s.a, b: s.b }));
module.exports = { W, H, FPS, DURATION, frame, CAPS, SHOTS };
