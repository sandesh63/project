// Shared helpers for the Tulasi Devi long video (16:9). Each part module uses these.
const fs = require('fs');
const path = require('path');
const A = require('../../engine/art.js');
const C = require('../../engine/characters.js');
const N = require('../../engine/anim.js');
const O = require('../../style-frames/face-options-2.js');
const MV = require('../../style-frames/mahadev-v2.js');
const JL = require('../../style-frames/jalandhar.js');
const RI = require('../../style-frames/rishi-indra.js');
const NP = require('../../style-frames/narada-parvati.js');
const SB = require('../../style-frames/samudra-baby.js');
const KD = require('../../style-frames/kalanemi-devas.js');
const { clamp, lerp, ease, prog, fade, noise } = N;

const W = 1920, H = 1080, FPS = 30;
const SPEC = { grain: .10, cut: .15, caption: { y: 1000, size: 46, maxChars: 52, lineH: 58 } };

let GRAIN = '';
const gp = path.join(__dirname, '..', 'tulasi-preview', 'grain.png');
if (fs.existsSync(gp)) GRAIN = 'data:image/png;base64,' + fs.readFileSync(gp).toString('base64');

const cam = (inner, { s = 1, fx = 960, fy = 540, px = 0, py = 0, rot = 0 } = {}) =>
  `<g transform="translate(${W / 2 + px},${H / 2 + py}) rotate(${rot}) scale(${s}) translate(${-fx},${-fy})">${inner}</g>`;
const BG = (fill, op = 1) => `<rect x="-900" y="-900" width="3720" height="2880" fill="${fill}" opacity="${op}"/>`;
const breathe = (svg, t, ax, ay, amp = .012, ph = 0) => { const b = Math.sin(t * 1.6 + ph); return `<g transform="translate(${ax},${ay}) scale(${1 + amp * .35 * b},${1 + amp * b}) translate(${-ax},${-ay})">${svg}</g>`; };
const sway = (svg, t, ax, ay, deg = 1.2, ph = 0) => `<g transform="rotate(${Math.sin(t * .6 + ph) * deg} ${ax} ${ay})">${svg}</g>`;
const blink = (t, base, seed = 0) => ((base === 'open' || base === 'lowered') && ((t + seed) % 4.1) < .12) ? 'closed' : base;
const lampDiya = (x, y, s, t, seed = 1, lit = 1) => `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-70 0 Q 0 46 70 0 Q 0 16 -70 0Z" fill="url(#goldV)" stroke="#7a4a10" stroke-width="2"/>
  ${lit > 0 ? `<g transform="translate(40,-2) scale(${1.6 * lit})">${A.flame(0, 0, 1, noise(t, seed) * 4)}</g>` : ''}</g>`;
const burst = (cx, cy, p, n = 46, seed = 4, col = '#ffe7a0', R = 260) => {
  if (p <= 0 || p >= 1) return ''; const r = A.rng(seed); let out = '';
  for (let i = 0; i < n; i++) { const a = r() * 6.283, d = R * (.2 + p * (.6 + r() * .8)); out += `<circle cx="${cx + Math.cos(a) * d}" cy="${cy + Math.sin(a) * d}" r="${(1.5 + r() * 3.5) * (1 - p * .6)}" fill="${col}" opacity="${(1 - p) * (.6 + r() * .4)}" filter="url(#glow)"/>`; }
  return out;
};
const shieldDome = (cx, cy, rx, ry, t, op = 1) => `<g opacity="${op}">
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffd66b" opacity=".10"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#ffd66b" stroke-width="5" opacity=".85" filter="url(#glow)"/>
  ${[0, 1, 2].map(k => { const ph = ((t + k * .6) % 1.8) / 1.8; return `<ellipse cx="${cx}" cy="${cy}" rx="${rx * (.7 + ph * .35)}" ry="${ry * (.7 + ph * .35)}" fill="none" stroke="#fff1b8" stroke-width="${4 * (1 - ph)}" opacity="${(1 - ph) * .7}"/>`; }).join('')}</g>`;
const stars = (seed, n = 160) => { const r = A.rng(seed); let o = ''; for (let i = 0; i < n; i++) o += `<circle cx="${r() * 1920}" cy="${r() * 700}" r="${r() * 1.8 + .3}" fill="#fff" opacity="${r() * .8 + .15}"/>`; return o; };
const clouds = (y, seed, col = 'url(#cloud)', op = .95) => { const r = A.rng(seed); return [...Array(14)].map(() => `<ellipse cx="${r() * 1920}" cy="${y + r() * 80}" rx="${90 + r() * 140}" ry="${40 + r() * 40}" fill="${col}" opacity="${op}"/>`).join(''); };
const courtyard = (t, sky = 'url(#dawnSky)') => `${BG(sky)}
  <circle cx="960" cy="560" r="260" fill="url(#sunDisc)"/>
  ${A.templeSilhouette(1500, 760, .55, '#6a3048')}${A.templeSilhouette(420, 760, .45, '#7a3a50')}
  <path d="M-900 740 Q 480 700 960 730 T 2800 720 L 2800 1900 L -900 1900Z" fill="url(#floorStone)"/>
  ${[...Array(9)].map((_, i) => `<path d="M${960 + (i - 4) * 120} 740 L ${960 + (i - 4) * 420} 1080" stroke="#2a160c" stroke-width="2" opacity=".5"/>`).join('')}
  ${[...Array(4)].map((_, k) => `<ellipse cx="960" cy="1010" rx="${260 - k * 55}" ry="${60 - k * 13}" fill="none" stroke="${['#e8344e', '#f39a1e', '#fff6e0', '#1f8a52'][k]}" stroke-width="6" stroke-dasharray="${8 + k * 2} ${6 + k}"/>`).join('')}`;
const doorRoom = (t) => { const fl = noise(t, 9);
  return `${BG('url(#wallNight)')}
  <rect x="900" y="-300" width="1600" height="1200" fill="#6a5866"/>
  <ellipse cx="1500" cy="420" rx="760" ry="560" fill="url(#lampGlow)" opacity="${.42 + fl * .04}"/>
  <rect x="900" y="-300" width="40" height="1200" fill="#1c1a2c" opacity=".7"/>
  <path d="M360 900 L 360 330 Q 540 190 720 330 L 720 900Z" fill="url(#moonSky)"/><circle cx="610" cy="360" r="46" fill="#f4f6ff" opacity=".9"/>
  <path d="M330 910 L 330 320 Q 540 150 750 320 L 750 910 L 720 910 L 720 330 Q 540 190 360 330 L 360 910Z" fill="#4a2a16" stroke="#1e0e06" stroke-width="4"/>
  <rect x="-900" y="900" width="3720" height="1000" fill="#0e1024"/>`; };


// ---- sets added for Parts 2+
const kailash = (t, night = true) => `${BG(night ? 'url(#nightSky)' : 'url(#skyDay)')}${night ? stars(12) : ''}
  <path d="M-900 820 L 300 300 L 520 420 L 760 160 L 960 60 L 1160 160 L 1400 420 L 1620 300 L 2800 820 L 2800 1900 L -900 1900Z" fill="#c8d4ec"/>
  <path d="M760 160 L 960 60 L 1160 160 L 1080 230 L 1000 190 L 920 250 L 840 210Z" fill="#ffffff"/>
  <path d="M300 300 L 380 360 L 330 380Z M1620 300 L 1540 360 L 1590 380Z" fill="#ffffff"/>
  <path d="M960 60 L 1160 160 L 1400 420 L 1620 300 L 2800 820 L 2800 1900 L 960 1900Z" fill="#8a9ac8" opacity=".35"/>
  <path d="M-900 900 Q 480 820 960 860 T 2800 880 L 2800 1900 L -900 1900Z" fill="#e8eef8"/>
  ${[...Array(30)].map((_, i) => { const r = A.rng(i + 3); return `<circle cx="${r() * 1920}" cy="${((r() * 1080) + t * (30 + r() * 30)) % 1080}" r="${1 + r() * 2.4}" fill="#fff" opacity="${.5 + r() * .5}"/>`; }).join('')}`;
const ocean = (t, sky = 'url(#nightSky)', y0 = 640) => `${BG(sky)}${sky === 'url(#nightSky)' ? stars(14, 120) : ''}
  <g transform="translate(960,0)">${SB.waves(t, 1100, y0, 2)}</g>`;
const shake = (t, a, amp) => ({ px: noise(t * 6, 1) * amp, py: noise(t * 6, 4) * amp });

const defs = `<defs>
  <linearGradient id="bgTemple" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b0d24"/><stop offset=".55" stop-color="#4a1418"/><stop offset="1" stop-color="#1a0806"/></linearGradient>
  <linearGradient id="bgGrief" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1030"/><stop offset=".6" stop-color="#2a1430"/><stop offset="1" stop-color="#0a0610"/></linearGradient>
  <linearGradient id="asuraBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0408"/><stop offset=".6" stop-color="#4a0a12"/><stop offset="1" stop-color="#120206"/></linearGradient>
  <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a8ad8"/><stop offset=".6" stop-color="#a8c8f0"/><stop offset="1" stop-color="#f0e4c8"/></linearGradient>
  <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050822"/><stop offset=".7" stop-color="#1c1d52"/><stop offset="1" stop-color="#3a2a4a"/></linearGradient>
  <linearGradient id="wallNight" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#141a3a"/><stop offset=".5" stop-color="#1c2348"/><stop offset="1" stop-color="#2a2a44"/></linearGradient>
  <linearGradient id="moonSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ff"/><stop offset=".5" stop-color="#7f9ad8"/><stop offset="1" stop-color="#34407a"/></linearGradient>
  <linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a6a"/><stop offset=".35" stop-color="#c0507a"/><stop offset=".7" stop-color="#f59a4a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
  <linearGradient id="floorStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a3a"/><stop offset="1" stop-color="#3a2014"/></linearGradient>
  <radialGradient id="redEnergy" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#ffcf6a"/><stop offset=".3" stop-color="#e2541e"/><stop offset=".7" stop-color="#7a120c"/><stop offset="1" stop-color="#1a0404"/></radialGradient>
  <radialGradient id="sunDisc" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe6"/><stop offset=".5" stop-color="#ffe08a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
  <radialGradient id="loveGlow" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#ffd8c8"/><stop offset=".5" stop-color="#e86a7a"/><stop offset="1" stop-color="#3a0c1a"/></radialGradient>
  <linearGradient id="cband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></linearGradient>
  <linearGradient id="topBand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
  <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset=".45" stop-color="#d89a2a"/><stop offset="1" stop-color="#7a4a10"/></linearGradient>
  <filter id="shadowify" x="-20%" y="-20%" width="140%" height="140%"><feColorMatrix type="matrix" values="0 0 0 0 .03  0 0 0 0 .03  0 0 0 0 .07  0 0 0 .92 0"/><feGaussianBlur stdDeviation="3.5"/></filter>
  <filter id="silRim" x="-20%" y="-20%" width="140%" height="140%"><feMorphology operator="dilate" radius="3" in="SourceAlpha" result="d"/><feGaussianBlur in="d" stdDeviation="4" result="b"/><feFlood flood-color="#9fc0ff"/><feComposite in2="b" operator="in" result="rim"/><feMerge><feMergeNode in="rim"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <linearGradient id="battleSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0c24"/><stop offset=".6" stop-color="#2a1a3a"/><stop offset="1" stop-color="#4a1a1a"/></linearGradient>
  <pattern id="grainPat" width="512" height="512" patternUnits="userSpaceOnUse"><image href="${GRAIN}" width="512" height="512"/></pattern>
  ${O.skinDefs}${MV.tiger}
</defs>`;

function wrap(text, max) {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { const plain = (cur + ' ' + w).replace(/★/g, '').trim(); if (plain.length > max && cur) { lines.push(cur); cur = w; } else cur = (cur ? cur + ' ' : '') + w; }
  if (cur) lines.push(cur); return lines;
}
function captionSVG(t, CAPS) {
  let out = '';
  for (const [a, b, text, big = 1] of CAPS) {
    const op = fade(t, a - .08, b + .25, .15, .2); if (op <= 0) continue;
    const pop = lerp(.92, 1, prog(t, a - .08, a + .12, ease.out)), size = SPEC.caption.size * big;
    const lines = wrap(text, Math.round(SPEC.caption.maxChars / big));
    const y0 = SPEC.caption.y - (lines.length - 1) * SPEC.caption.lineH * big;
    const ls = lines.map((ln, i) => { let hl = false;
      const spans = ln.split(/(★)/).filter(Boolean).map(p => { if (p === '★') { hl = !hl; return ''; } return `<tspan fill="${hl ? '#ffd66b' : '#fff8ec'}">${p.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</tspan>`; }).join('');
      return `<text x="${W / 2}" y="${y0 + i * SPEC.caption.lineH * big}" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="${size}" style="paint-order:stroke" stroke="#120604" stroke-width="8" stroke-linejoin="round">${spans}</text>`; }).join('');
    out += `<g opacity="${op}" transform="translate(${W / 2},${SPEC.caption.y}) scale(${pop}) translate(${-W / 2},${-SPEC.caption.y})">${ls}</g>`;
  }
  return out;
}

// Build a frame function from shots [{a,b,f,title}] and captions
function makeFrame(S, CAPS, extra = () => '') {
  return function frame(t) {
    let body = '', title = null;
    for (const s of S) {
      if (t < s.a - .001 || t > s.b + SPEC.cut) continue;
      const op = s.a <= 0 ? 1 : clamp((t - s.a) / SPEC.cut);
      if (op > 0) body += `<g opacity="${op.toFixed(3)}">${s.f(t)}</g>`;
      if (s.title && t >= s.title[0] && t <= s.title[1]) title = s.title;
    }
    body += extra(t);
    let titleSvg = '';
    if (title) { const p = prog(t, title[0], title[0] + .6, ease.out);
      titleSvg = `<g opacity="${p * fade(t, title[0], title[1], .1, .3)}" transform="translate(${W / 2},${title[3] || 170}) scale(${lerp(1.12, 1, p)})">
        <text text-anchor="middle" font-family="'Cinzel Decorative', Cinzel, serif" font-weight="900" font-size="${title[4] || 120}" letter-spacing="8" fill="url(#goldV)" style="paint-order:stroke" stroke="#2a0e04" stroke-width="8" filter="url(#glow)">${title[2]}</text></g>`; }
    const gx = Math.floor((t * 977) % 512), gy = Math.floor((t * 613) % 512);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      ${A.defs()}${C.defs2()}${JL.defs}${RI.defs}${NP.defs}${SB.defs}${KD.defs}${defs}
      ${body}
      <rect width="${W}" height="${H}" fill="url(#vignette)"/>
      ${GRAIN ? `<rect x="${-gx}" y="${-gy}" width="${W + 512}" height="${H + 512}" fill="url(#grainPat)" opacity="${SPEC.grain}" style="mix-blend-mode:overlay"/>` : ''}
      <rect y="${H - 220}" width="${W}" height="220" fill="url(#cband)"/>
      ${titleSvg}
      ${captionSVG(t, CAPS)}
    </svg>`;
  };
}

module.exports = { kailash, ocean, shake, A, C, N, O, MV, JL, RI, NP, SB, KD, W, H, FPS, SPEC, cam, BG, breathe, sway, blink, lampDiya, burst, shieldDome, stars, clouds, courtyard, doorRoom, makeFrame, clamp, lerp, ease, prog, fade, noise };
