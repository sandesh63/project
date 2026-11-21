// Deepa Chitra — vector art library.
// Every function returns an SVG string. All art is drawn from code; no external images.
// Conventions: Kerala-mural proportions, dark brown outlines, flat fills + soft shade,
// gold-foil ornaments, warm lamp light from below/front.

const P = {
  ink: '#2a1208',
  gold1: '#fff1b8', gold2: '#f2c14e', gold3: '#c8891f', gold4: '#7a4a10',
  vermilion: '#c2311d', vermDark: '#7d150c',
  green: '#1f7a52', greenDark: '#0e4430',
  indigo: '#141a3a', night: '#0a0d22', maroon: '#3a0f14',
  skinWarm: '#e9a866', skinWarmShade: '#b86d34',
  skinBlue: '#3f74c9', skinBlueShade: '#1d3f8c',
  jasmine: '#fff8ec', marigold: '#f39a1e', marigoldDeep: '#d9600f',
  eyeWhite: '#fff4e2',
};

// Seeded RNG so every render is identical.
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function defs() {
  return `
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${P.gold4}"/><stop offset=".28" stop-color="${P.gold2}"/>
      <stop offset=".45" stop-color="${P.gold1}"/><stop offset=".62" stop-color="${P.gold3}"/>
      <stop offset="1" stop-color="${P.gold4}"/>
    </linearGradient>
    <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${P.gold1}"/><stop offset=".4" stop-color="${P.gold2}"/>
      <stop offset="1" stop-color="${P.gold4}"/>
    </linearGradient>
    <radialGradient id="skinWarm" cx=".5" cy=".42" r=".65">
      <stop offset="0" stop-color="#f6c48a"/><stop offset=".6" stop-color="${P.skinWarm}"/>
      <stop offset="1" stop-color="${P.skinWarmShade}"/>
    </radialGradient>
    <radialGradient id="skinBlue" cx=".5" cy=".4" r=".7">
      <stop offset="0" stop-color="#7aa6ec"/><stop offset=".55" stop-color="${P.skinBlue}"/>
      <stop offset="1" stop-color="${P.skinBlueShade}"/>
    </radialGradient>
    <linearGradient id="saree" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e0462c"/><stop offset=".5" stop-color="${P.vermilion}"/>
      <stop offset="1" stop-color="${P.vermDark}"/>
    </linearGradient>
    <linearGradient id="greenCloth" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2fa36e"/><stop offset="1" stop-color="${P.greenDark}"/>
    </linearGradient>
    <linearGradient id="pitambara" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffd84a"/><stop offset=".6" stop-color="#f0a818"/>
      <stop offset="1" stop-color="#a8640a"/>
    </linearGradient>
    <radialGradient id="lampGlow" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#ffe7a0" stop-opacity=".95"/>
      <stop offset=".25" stop-color="#ffb347" stop-opacity=".55"/>
      <stop offset=".6" stop-color="#ff7a1a" stop-opacity=".15"/>
      <stop offset="1" stop-color="#ff5a00" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blueGlow" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#cfe4ff" stop-opacity=".9"/>
      <stop offset=".3" stop-color="#5f9bff" stop-opacity=".45"/>
      <stop offset="1" stop-color="#1b3fa8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="flame" cx=".5" cy=".75" r=".6">
      <stop offset="0" stop-color="#fffbe6"/><stop offset=".35" stop-color="#ffd85a"/>
      <stop offset=".75" stop-color="#ff8a1c"/><stop offset="1" stop-color="#d4400a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx=".5" cy=".5" r=".75">
      <stop offset=".55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".78"/>
    </radialGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <filter id="blur3"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" result="n"/>
      <feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .3  0 0 0 .55 0"/>
    </filter>
    <filter id="paint" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="3" result="t"/>
      <feDisplacementMap in="SourceGraphic" in2="t" scale="3"/>
    </filter>
    <pattern id="sareeMotif" width="34" height="34" patternUnits="userSpaceOnUse">
      <circle cx="17" cy="17" r="3.2" fill="${P.gold2}" opacity=".75"/>
      <path d="M17 6 l2.5 5 -2.5 2 -2.5 -2z M17 28 l2.5 -5 -2.5 -2 -2.5 2z" fill="${P.gold2}" opacity=".5"/>
    </pattern>
    <pattern id="borderMotif" width="22" height="22" patternUnits="userSpaceOnUse">
      <rect width="22" height="22" fill="url(#gold)"/>
      <path d="M0 11 Q5.5 2 11 11 T22 11" stroke="${P.vermDark}" stroke-width="2" fill="none"/>
      <circle cx="11" cy="11" r="2" fill="${P.green}"/>
    </pattern>
  </defs>`;
}

// ---------- ornaments ----------
function flame(x, y, s = 1, flick = 0) {
  const w = 14 * s, h = 46 * s;
  return `<g transform="translate(${x},${y})">
    <ellipse cx="0" cy="${-h * .3}" rx="${w * 4}" ry="${h * 1.6}" fill="url(#lampGlow)"/>
    <path d="M0 ${-h} C ${w * .9 + flick} ${-h * .55} ${w} ${-h * .15} 0 0 C ${-w} ${-h * .15} ${-w * .9 + flick} ${-h * .55} 0 ${-h}Z" fill="url(#flame)"/>
    <path d="M0 ${-h * .55} C ${w * .35} ${-h * .3} ${w * .35} ${-h * .1} 0 ${-h * .02} C ${-w * .35} ${-h * .1} ${-w * .35} ${-h * .3} 0 ${-h * .55}Z" fill="#fffef5"/>
  </g>`;
}

// Kerala nilavilakku brass lamp
function nilavilakku(x, y, s = 1, flick = 0) {
  const g = (d) => `<path d="${d}" fill="url(#goldV)" stroke="${P.gold4}" stroke-width="2"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="110" ry="18" fill="#000" opacity=".35"/>
    ${g('M-95 0 Q-90 -30 -40 -36 L40 -36 Q90 -30 95 0 Z')}
    ${g('M-16 -36 L-12 -250 L12 -250 L16 -36 Z')}
    ${[-70, -130, -190].map(yy => g(`M-28 ${yy} Q0 ${yy - 16} 28 ${yy} Q0 ${yy + 10} -28 ${yy}Z`)).join('')}
    ${g('M-90 -262 Q-80 -232 0 -228 Q80 -232 90 -262 Q0 -250 -90 -262Z')}
    ${g('M-10 -262 L-6 -320 Q0 -345 6 -320 L10 -262Z')}
    ${flame(-78, -266, 1, flick)}${flame(78, -266, 1, -flick)}
    ${flame(-40, -258, .85, -flick)}${flame(40, -258, .85, flick)}
    ${flame(0, -340, 1.1, flick)}
  </g>`;
}

// Prabhavali / thiruvachi — the flaming temple arch behind a deity
function prabhavali(cx, baseY, r, opts = {}) {
  const n = opts.flames || 23, thick = opts.thick || 26;
  let flames = '';
  for (let i = 0; i < n; i++) {
    const a = Math.PI + (Math.PI * i) / (n - 1);
    const x = cx + Math.cos(a) * (r + thick * .5), y = baseY + Math.sin(a) * (r + thick * .5);
    const rot = (a * 180) / Math.PI + 90;
    flames += `<path transform="translate(${x},${y}) rotate(${rot})" d="M0 -46 C 14 -30 16 -10 0 0 C -16 -10 -14 -30 0 -46Z M0 -46 C 10 -54 12 -64 4 -72" fill="url(#gold)" stroke="${P.gold4}" stroke-width="1.5"/>`;
  }
  const arc = (rr) => `M ${cx - rr} ${baseY} A ${rr} ${rr} 0 0 1 ${cx + rr} ${baseY}`;
  return `<g>
    ${flames}
    <path d="${arc(r)}" stroke="url(#gold)" stroke-width="${thick}" fill="none"/>
    <path d="${arc(r)}" stroke="${P.gold4}" stroke-width="${thick + 4}" fill="none" opacity=".35" stroke-dasharray="2 14"/>
    <path d="${arc(r - thick * .5)}" stroke="${P.gold4}" stroke-width="2" fill="none"/>
    <path d="${arc(r + thick * .5)}" stroke="${P.gold4}" stroke-width="2" fill="none"/>
    <path d="${arc(r)}" stroke="${P.vermDark}" stroke-width="6" fill="none" stroke-dasharray="10 12"/>
    ${kirtimukha(cx, baseY - r - thick * .5 - 40, 1)}
    <rect x="${cx - r - thick}" y="${baseY}" width="${thick * 2}" height="${opts.pillar || 0}" fill="url(#gold)"/>
    <rect x="${cx + r - thick}" y="${baseY}" width="${thick * 2}" height="${opts.pillar || 0}" fill="url(#gold)"/>
  </g>`;
}

// stylised face-of-glory finial at the top of an arch
function kirtimukha(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})" stroke="${P.gold4}" stroke-width="2">
    <path d="M-60 30 C -70 -10 -40 -50 0 -54 C 40 -50 70 -10 60 30 C 40 18 -40 18 -60 30Z" fill="url(#gold)"/>
    <circle cx="-22" cy="-8" r="9" fill="${P.vermilion}"/><circle cx="22" cy="-8" r="9" fill="${P.vermilion}"/>
    <path d="M-30 14 Q0 30 30 14" fill="none" stroke-width="4"/>
    <path d="M-12 -50 Q0 -90 12 -50" fill="url(#gold)"/>
  </g>`;
}

function lotus(x, y, s = 1, col = '#f2a0b4', col2 = '#c64f73') {
  let petals = '';
  const pet = (rot, len, w, fill) => `<path transform="rotate(${rot})" d="M0 0 C ${w} ${-len * .4} ${w * .6} ${-len * .85} 0 ${-len} C ${-w * .6} ${-len * .85} ${-w} ${-len * .4} 0 0Z" fill="${fill}" stroke="${col2}" stroke-width="2"/>`;
  [-70, 70, -48, 48].forEach(r => petals += pet(r, 70, 26, col));
  [-24, 24].forEach(r => petals += pet(r, 84, 28, col));
  petals += pet(0, 92, 30, '#fbd2dc');
  return `<g transform="translate(${x},${y}) scale(${s})">${petals}
    <path d="M-60 6 Q0 26 60 6 Q0 14 -60 6Z" fill="${P.green}"/></g>`;
}

function petals(seed, n, w, h, opts = {}) {
  const r = rng(seed); let out = '';
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = r() * h, rot = r() * 360, s = .5 + r() * 1.1;
    const c = r() < .7 ? P.marigold : (r() < .5 ? P.marigoldDeep : '#e8344e');
    const blur = s < .8 ? 'filter="url(#blur3)"' : '';
    out += `<path ${blur} transform="translate(${x},${y}) rotate(${rot}) scale(${s})" d="M0 -11 C 8 -8 9 6 0 11 C -9 6 -8 -8 0 -11Z" fill="${c}" opacity="${opts.op || .9}"/>`;
  }
  return out;
}

function embers(seed, n, w, h, color = '#ffd27a') {
  const r = rng(seed); let out = '';
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = r() * h, rr = .8 + r() * 2.6;
    out += `<circle cx="${x}" cy="${y}" r="${rr}" fill="${color}" opacity="${.35 + r() * .6}" filter="url(#glow)"/>`;
  }
  return out;
}

function mandalaGlow(cx, cy, r, color = '#ffcf6a', op = .5) {
  let rays = '';
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * 360, L = i % 3 === 0 ? 1 : .78;
    rays += `<path transform="rotate(${a})" d="M0 ${-r * .3} L ${r * .012} ${-r * L} L ${-r * .012} ${-r * L}Z" fill="${color}" opacity="${i % 3 === 0 ? .32 : .16}"/>`;
  }
  let petalsRing = '';
  for (let i = 0; i < 24; i++) {
    petalsRing += `<path transform="rotate(${i * 15})" d="M0 ${-r * .42} C ${r * .05} ${-r * .48} ${r * .05} ${-r * .56} 0 ${-r * .62} C ${-r * .05} ${-r * .56} ${-r * .05} ${-r * .48} 0 ${-r * .42}Z" fill="none" stroke="${color}" stroke-width="2" opacity=".6"/>`;
  }
  let rings = '';
  for (let k = 1; k <= 3; k++) rings += `<circle r="${r * (.36 + k * .1)}" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="${k * 2} ${k * 7}" opacity=".5"/>`;
  return `<g transform="translate(${cx},${cy})" opacity="${op}">
    <circle r="${r}" fill="url(#lampGlow)"/><g filter="url(#blur3)">${rays}</g>${petalsRing}${rings}</g>`;
}

// ---------- characters ----------
// Frontal Kerala-mural face. Origin = face centre; head ~200 wide.
function face(o) {
  const skin = o.skin, shade = o.shade, eyeOpen = o.eyeOpen ?? 1;
  const eye = (sx) => {
    const m = (d) => d; // eye drawn for right side then mirrored with scale(-1,1)
    const lidY = -10 - 12 * eyeOpen;
    return `<g transform="scale(${sx},1)">
      <path d="M12 -6 C 30 ${lidY - 6} 60 ${lidY - 6} 82 -12 C 62 6 32 8 12 -6Z" fill="${P.eyeWhite}"/>
      <clipPath id="ec${sx}${o.id}"><path d="M12 -6 C 30 ${lidY - 6} 60 ${lidY - 6} 82 -12 C 62 6 32 8 12 -6Z"/></clipPath>
      <g clip-path="url(#ec${sx}${o.id})">
        <circle cx="${44 + (o.look || 0) * sx}" cy="-8" r="12" fill="#3a1d0e"/>
        <circle cx="${44 + (o.look || 0) * sx}" cy="-8" r="7" fill="#0d0603"/>
        <circle cx="${48 + (o.look || 0) * sx}" cy="-12" r="3" fill="#fff"/>
      </g>
      <path d="M10 -5 C 30 ${lidY - 7} 60 ${lidY - 7} 84 -12 L 98 -24 L 86 -9 C 62 8 32 9 10 -5" fill="none" stroke="${P.ink}" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M8 -38 Q 46 -60 92 -34" fill="none" stroke="${P.ink}" stroke-width="${o.browW || 4}" stroke-linecap="round"/>
      <path d="M16 -18 C 34 ${lidY - 16} 62 ${lidY - 16} 80 -24" fill="none" stroke="${shade}" stroke-width="2" opacity=".6"/>
    </g>`;
  };
  return `<g transform="translate(${o.x},${o.y}) scale(${o.s})">
    <path d="M-34 96 L-38 175 Q0 190 38 175 L34 96Z" fill="${skin}" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-34 120 Q0 150 34 120 L34 96 L-34 96Z" fill="${shade}" opacity=".45"/>
    <path d="M-100 -10 C -118 -20 -122 20 -100 34Z M100 -10 C 118 -20 122 20 100 34Z" fill="${skin}" stroke="${P.ink}" stroke-width="3"/>
    <path d="M0 -132 C 72 -132 104 -82 104 -20 C 104 44 72 98 0 126 C -72 98 -104 44 -104 -20 C -104 -82 -72 -132 0 -132Z" fill="${skin}" stroke="${P.ink}" stroke-width="3.5"/>
    <path d="M-104 -20 C -104 44 -72 98 0 126 C -56 92 -86 44 -90 -20Z" fill="${shade}" opacity=".35"/>
    <path d="M58 -120 C 100 -86 110 -10 98 40 C 88 76 60 102 26 120" fill="none" stroke="${o.rim || '#ffd9a0'}" stroke-width="5" opacity=".55" filter="url(#blur3)"/>
    <ellipse cx="-58" cy="40" rx="20" ry="11" fill="#e8705a" opacity="${o.blush ?? .22}"/>
    <ellipse cx="58" cy="40" rx="20" ry="11" fill="#e8705a" opacity="${o.blush ?? .22}"/>
    ${eye(1)}${eye(-1)}
    <path d="M-2 -22 C -4 6 -9 26 -12 34 Q 0 46 13 35" fill="none" stroke="${P.ink}" stroke-width="3" stroke-linecap="round"/>
    <path d="M-22 64 Q -10 54 0 60 Q 10 54 22 64 Q 0 70 -22 64Z" fill="${o.lip || '#b4302a'}" stroke="${P.ink}" stroke-width="1.6"/>
    <path d="M-20 65 Q 0 84 20 65 Q 0 72 -20 65Z" fill="${o.lip2 || '#d24a3c'}" stroke="${P.ink}" stroke-width="1.6"/>
    <path d="M-12 74 Q0 78 12 74" stroke="#fff" stroke-width="1.5" opacity=".35" fill="none"/>
    ${o.extra || ''}
  </g>`;
}

function jhumka(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})" stroke="${P.gold4}" stroke-width="1.5">
    <circle cy="0" r="9" fill="url(#gold)"/><circle cy="0" r="4" fill="${P.vermilion}"/>
    <path d="M-16 34 Q-16 10 0 10 Q16 10 16 34Z" fill="url(#gold)"/>
    ${[-12, -6, 0, 6, 12].map(dx => `<circle cx="${dx}" cy="38" r="2.6" fill="${P.jasmine}"/>`).join('')}
  </g>`;
}

function necklaces(x, y, s, w = 1) {
  let beads = '';
  for (let i = 0; i <= 18; i++) {
    const t = i / 18, a = Math.PI * t;
    beads += `<circle cx="${-Math.cos(a) * 92 * w}" cy="${Math.sin(a) * 70}" r="6" fill="url(#gold)" stroke="${P.gold4}" stroke-width="1"/>`;
  }
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M-80 -6 Q0 60 80 -6" fill="none" stroke="url(#gold)" stroke-width="16"/>
    <path d="M-80 -6 Q0 60 80 -6" fill="none" stroke="${P.gold4}" stroke-width="16" stroke-dasharray="3 9" opacity=".6"/>
    ${[-50, -25, 0, 25, 50].map(dx => `<circle cx="${dx}" cy="${30 - Math.abs(dx) * .35}" r="5" fill="${dx ? P.green : P.vermilion}" stroke="${P.gold4}"/>`).join('')}
    <g transform="translate(0,${8})">${beads}</g>
    <path d="M0 84 l 22 22 -22 30 -22 -30z" fill="url(#gold)" stroke="${P.gold4}" stroke-width="2"/>
    <circle cx="0" cy="110" r="9" fill="${P.vermilion}" stroke="${P.gold4}" stroke-width="2"/>
  </g>`;
}

// Vrinda (Tulasi Devi) — portrait, hands in anjali mudra.
function vrinda(x, y, s = 1, o = {}) {
  const hairBack = `
    <path d="M-150 -60 C -178 -250 178 -250 150 -60 C 168 40 196 150 182 250 Q 0 285 -182 250 C -196 150 -168 40 -150 -60Z" fill="#1a0c08"/>
    <path d="M-140 -40 C -150 60 -170 150 -160 230 M140 -40 C 150 60 170 150 160 230" stroke="#3a2016" stroke-width="3" fill="none" opacity=".7"/>
    <ellipse cx="0" cy="-205" rx="70" ry="44" fill="#1a0c08"/>
    ${[...Array(12)].map((_, i) => { const a = Math.PI * (1.05 + i * .075); return `<circle cx="${Math.cos(a) * 78}" cy="${-205 + Math.sin(a) * 50}" r="9" fill="${P.jasmine}" stroke="#d8c8a8"/>`; }).join('')}
    <circle cx="0" cy="-246" r="12" fill="url(#gold)" stroke="${P.gold4}"/>`;
  const hairFront = `
    <path d="M0 -134 C -64 -136 -108 -96 -112 -20 C -104 -40 -96 -54 -84 -62 C -70 -100 -40 -116 0 -116 C 40 -116 70 -100 84 -62 C 96 -54 104 -40 112 -20 C 108 -96 64 -136 0 -134Z" fill="#1a0c08" stroke="#000" stroke-width="2"/>
    <path d="M-60 -122 C -80 -100 -92 -80 -98 -50 M60 -122 C 80 -100 92 -80 98 -50" stroke="#4a2a1c" stroke-width="2" fill="none"/>
    <path d="M-2 -134 L 2 -134 L 1.5 -114 L -1.5 -114Z" fill="${P.vermilion}"/>
    <path d="M0 -134 L 0 -62" stroke="url(#gold)" stroke-width="4"/>
    <path d="M0 -60 l 9 8 -9 12 -9 -12z" fill="url(#gold)" stroke="${P.gold4}"/><circle cx="0" cy="-50" r="3.5" fill="${P.vermilion}"/>
    <path d="M0 -132 Q -62 -118 -102 -60 M0 -132 Q 62 -118 102 -60" stroke="url(#gold)" stroke-width="3.5" fill="none"/>
    ${[-1, 1].map(sx => [...Array(6)].map((_, i) => `<circle cx="${sx * (14 + i * 15)}" cy="${-130 + i * i * 2.1}" r="3" fill="${i % 2 ? P.vermilion : P.gold2}"/>`).join('')).join('')}`;
  const jasmine = (sx) => {
    let d = '';
    for (let i = 0; i < 14; i++) d += `<circle cx="${sx * (130 + Math.sin(i * .7) * 6)}" cy="${-60 + i * 17}" r="7" fill="${P.jasmine}" stroke="#d8c8a8" stroke-width="1"/>`;
    return d;
  };
  const tilak = `<circle cx="0" cy="-40" r="7" fill="${P.vermilion}" stroke="${P.vermDark}" stroke-width="1.5"/>`;
  const f = face({ id: 'vr' + (o.id || ''), x: 0, y: 0, s: 1, skin: 'url(#skinWarm)', shade: P.skinWarmShade, eyeOpen: o.eyeOpen ?? .85, look: o.look || 0, extra: tilak });
  const torso = 'M-38 168 C -90 174 -168 188 -206 236 C -238 282 -240 372 -224 440 C -210 520 -220 600 -246 700 L 246 700 C 220 600 210 520 224 440 C 240 372 238 282 206 236 C 168 188 90 174 38 168Z';
  const body = `
    <path d="${torso}" fill="url(#skinWarm)" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-206 236 C -238 282 -240 372 -224 440 C -214 380 -210 300 -190 250Z" fill="${P.skinWarmShade}" opacity=".45"/>
    <path d="M-60 200 Q 0 214 60 200" stroke="${P.skinWarmShade}" stroke-width="3" fill="none" opacity=".6"/>
    <!-- blouse -->
    <path d="M-198 268 C -150 330 150 330 198 268 L 214 452 Q 0 500 -214 452Z" fill="url(#greenCloth)" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-198 268 C -150 330 150 330 198 268" fill="none" stroke="url(#gold)" stroke-width="10"/>
    <path d="M-214 452 Q 0 500 214 452" fill="none" stroke="url(#gold)" stroke-width="8"/>
    <path d="M-120 330 C -110 380 -112 420 -126 460 M120 330 C 110 380 112 420 126 460" stroke="${P.greenDark}" stroke-width="3" fill="none" opacity=".7"/>
    <!-- waist + skirt pleats -->
    <path d="M-214 470 Q 0 520 214 470 L 246 700 L -246 700Z" fill="url(#saree)" stroke="${P.ink}" stroke-width="3"/>
    ${[-150, -90, -30, 30, 90, 150].map(px => `<path d="M${px * .9} ${500} Q ${px} 600 ${px * 1.1} 700" stroke="${P.vermDark}" stroke-width="3" fill="none" opacity=".6"/>`).join('')}
    <!-- pallu over left shoulder -->
    <path d="M62 188 C 140 196 214 226 236 300 L 252 700 L 10 700 C 30 590 60 480 112 380 C 78 320 56 250 62 188Z" fill="url(#saree)" stroke="${P.ink}" stroke-width="3"/>
    <path d="M62 188 C 140 196 214 226 236 300 L 252 700 L 10 700 C 30 590 60 480 112 380 C 78 320 56 250 62 188Z" fill="url(#sareeMotif)"/>
    <path d="M150 230 C 170 330 180 450 170 700 M200 270 C 214 380 220 500 214 700" stroke="${P.vermDark}" stroke-width="3" fill="none" opacity=".55"/>
    <path d="M62 188 C 56 250 78 320 112 380 C 60 480 30 590 10 700" fill="none" stroke="url(#borderMotif)" stroke-width="26"/>
    <path d="M-170 486 Q 0 530 170 486" stroke="url(#gold)" stroke-width="14" fill="none"/>
    <path d="M-170 486 Q 0 530 170 486" stroke="${P.gold4}" stroke-width="14" stroke-dasharray="4 10" fill="none" opacity=".6"/>
    ${necklaces(0, 194, 1.1)}
    <path d="M-206 236 C -238 300 -236 400 -218 470" stroke="${P.ink}" stroke-width="3" fill="none"/>
    <path d="M206 236 C 238 300 236 400 218 470" stroke="${P.ink}" stroke-width="3" fill="none"/>
    ${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M-232 296 Q -210 310 -196 296" stroke="url(#gold)" stroke-width="12" fill="none"/>`).join('')}`;
  // anjali mudra: elbows at sides, forearms rising to palms pressed at chest
  const hands = `
    <g>
      ${[-1, 1].map(sx => `<g transform="scale(${sx},1)">
        <path d="M-228 470 C -190 480 -110 452 -34 404 L -24 452 C -96 498 -176 522 -226 516Z" fill="url(#skinWarm)" stroke="${P.ink}" stroke-width="3"/>
        <path d="M-226 516 C -176 522 -96 498 -24 452 L -30 440 C -100 482 -170 502 -224 500Z" fill="${P.skinWarmShade}" opacity=".5"/>
        ${[0, 13, 26].map(d => `<path d="M${-62 - d} ${428 + d * .45} L ${-50 - d} ${480 + d * .4}" stroke="${d === 13 ? P.vermilion : 'url(#gold)'}" stroke-width="9" stroke-linecap="round"/>`).join('')}
      </g>`).join('')}
      <path d="M0 246 C 16 256 26 296 30 346 C 33 388 30 426 0 452 C -30 426 -33 388 -30 346 C -26 296 -16 256 0 246Z" fill="url(#skinWarm)" stroke="${P.ink}" stroke-width="3"/>
      <path d="M0 248 L 0 450" stroke="${P.ink}" stroke-width="2.5"/>
      ${[290, 316, 342].map(yy => `<path d="M-27 ${yy} Q -12 ${yy + 5} 0 ${yy + 2} M27 ${yy} Q 12 ${yy + 5} 0 ${yy + 2}" stroke="${P.skinWarmShade}" stroke-width="2" fill="none"/>`).join('')}
      <path d="M-30 380 Q -14 372 -4 392 M30 380 Q 14 372 4 392" stroke="${P.skinWarmShade}" stroke-width="2.5" fill="none"/>
      <circle cx="-14" cy="400" r="5" fill="${P.vermilion}" opacity=".85"/><circle cx="14" cy="400" r="5" fill="${P.vermilion}" opacity=".85"/>
      ${o.offering ? `<g transform="translate(0,252)">${[...Array(5)].map((_, i) => `<path transform="rotate(${-40 + i * 20}) translate(0,-6)" d="M0 0 C 4 -6 10 -6 14 0 C 10 6 4 6 0 0Z" fill="#2e8a4a"/>`).join('')}</g>` : ''}
    </g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    ${hairBack}${jasmine(1)}${jasmine(-1)}${body}${f}${hairFront}
    ${jhumka(-106, 24, 1.4)}${jhumka(106, 24, 1.4)}
    <circle cx="-26" cy="20" r="4" fill="url(#gold)"/>
    ${o.hands !== false ? hands : ''}
  </g>`;
}

// Vishnu — frontal bust, four arms: chakra, shankha, abhaya and varada.
function vishnu(x, y, s = 1, o = {}) {
  const namam = `<path d="M-14 -40 L -10 -88 M14 -40 L 10 -88" stroke="#fff6e0" stroke-width="7" stroke-linecap="round"/>
    <path d="M0 -40 L 0 -90" stroke="${P.vermilion}" stroke-width="6" stroke-linecap="round"/>
    <path d="M-14 -40 Q 0 -26 14 -40" stroke="#fff6e0" stroke-width="7" fill="none"/>`;
  const f = face({ id: 'vi', x: 0, y: 0, s: 1, skin: 'url(#skinBlue)', shade: P.skinBlueShade, eyeOpen: o.eyeOpen ?? .7, browW: 5, blush: 0, lip: '#9c2a3a', lip2: '#c2414e', rim: '#cfe2ff', extra: namam });
  const crown = `
    <g stroke="${P.gold4}" stroke-width="2">
      <path d="M-114 -58 L -104 -140 L 104 -140 L 114 -58 Q 0 -84 -114 -58Z" fill="url(#gold)"/>
      <path d="M-114 -66 Q 0 -92 114 -66" fill="none" stroke="${P.vermilion}" stroke-width="6" stroke-dasharray="8 8"/>
      ${[-70, -35, 0, 35, 70].map(dx => `<circle cx="${dx}" cy="${-110 - (dx === 0 ? 8 : 0)}" r="${dx === 0 ? 18 : 9}" fill="${dx === 0 ? P.vermilion : (Math.abs(dx) === 35 ? P.green : '#fff2d0')}" stroke="${P.gold4}"/>`).join('')}
      <path d="M-104 -140 L -84 -300 Q 0 -324 84 -300 L 104 -140Z" fill="url(#goldV)"/>
      ${[-180, -220, -260].map((yy, i) => `<path d="M${-98 + i * 6} ${yy} Q 0 ${yy - 14} ${98 - i * 6} ${yy}" fill="none" stroke="${P.gold4}" stroke-width="4"/>
        ${[-60, -30, 0, 30, 60].map(dx => `<path d="M${dx * (1 - i * .08)} ${yy - 22} l 7 9 -7 9 -7 -9z" fill="${(dx / 30 + i) % 2 ? P.green : P.vermilion}"/>`).join('')}`).join('')}
      <path d="M-84 -300 Q 0 -340 84 -300 L 46 -360 Q 0 -390 -46 -360Z" fill="url(#gold)"/>
      <path d="M0 -380 C 22 -400 18 -430 0 -450 C -18 -430 -22 -400 0 -380Z" fill="url(#gold)"/>
      <circle cx="0" cy="-404" r="6" fill="${P.vermilion}"/>
      <path d="M-114 -58 C -170 -50 -184 30 -156 96 M114 -58 C 170 -50 184 30 156 96" fill="none" stroke="url(#gold)" stroke-width="14"/>
    </g>`;
  const curls = (sx) => [...Array(7)].map((_, i) => `<path transform="scale(${sx},1)" d="M104 ${-56 + i * 28} q 30 6 22 32 q -16 8 -22 -6" fill="#120a1a" stroke="#000" stroke-width="1.5"/>`).join('');
  const torso = 'M-36 168 C -110 172 -210 184 -240 236 C -262 280 -246 340 -214 380 C -190 420 -176 480 -170 600 L 170 600 C 176 480 190 420 214 380 C 246 340 262 280 240 236 C 210 184 110 172 36 168Z';
  const upperArm = (sx) => `<g transform="scale(${sx},1)">
      <path d="M200 226 C 260 200 300 120 314 30 L 364 40 C 356 150 304 250 228 290Z" fill="url(#skinBlue)" stroke="${P.ink}" stroke-width="3"/>
      <path d="M316 56 L 362 64" stroke="url(#gold)" stroke-width="16"/>
      <path d="M244 214 L 286 236" stroke="url(#gold)" stroke-width="12"/></g>`;
  const palm = (cx, cy, rot = 0) => `<g transform="translate(${cx},${cy}) rotate(${rot})">
      <path d="M-30 30 L -32 -20 C -32 -32 -22 -34 -20 -22 L -20 -50 C -20 -62 -8 -62 -8 -50 L -8 -58 C -8 -70 6 -70 6 -58 L 6 -52 C 6 -64 20 -64 20 -52 L 20 -36 C 20 -46 32 -46 32 -34 L 30 30 Q 0 42 -30 30Z" fill="url(#skinBlue)" stroke="${P.ink}" stroke-width="2.5"/>
      <circle cx="0" cy="4" r="9" fill="none" stroke="${P.vermilion}" stroke-width="3"/>
      <path d="M-30 34 Q 0 46 30 34" stroke="url(#gold)" stroke-width="10" fill="none"/></g>`;
  const chakra = (cx, cy) => `<g transform="translate(${cx},${cy})">
    <circle r="90" fill="url(#lampGlow)"/>
    <circle r="46" fill="url(#gold)" stroke="${P.gold4}" stroke-width="3"/>
    ${[...Array(16)].map((_, i) => `<path transform="rotate(${i * 22.5})" d="M0 -46 C 8 -56 10 -66 0 -74 C -10 -66 -8 -56 0 -46Z" fill="url(#gold)" stroke="${P.gold4}"/>`).join('')}
    ${[...Array(8)].map((_, i) => `<path transform="rotate(${i * 45})" d="M0 0 L 0 -40" stroke="${P.gold4}" stroke-width="4"/>`).join('')}
    <circle r="30" fill="none" stroke="${P.vermDark}" stroke-width="3"/>
    <circle r="12" fill="${P.vermilion}" stroke="${P.gold4}" stroke-width="2"/></g>`;
  const shankha = (cx, cy) => `<g transform="translate(${cx},${cy})">
    <circle r="80" fill="url(#lampGlow)" opacity=".6"/>
    <path d="M0 -62 C 36 -52 46 -10 32 30 C 22 52 -22 52 -32 30 C -46 -10 -36 -52 0 -62Z" fill="#fffaf0" stroke="${P.gold4}" stroke-width="3"/>
    <path d="M-20 -30 Q 0 -10 22 -34 M-26 0 Q 0 18 28 -4 M-22 26 Q 0 40 22 24" fill="none" stroke="#d8c8a8" stroke-width="3"/>
    <path d="M-34 -10 Q -52 -30 -40 -54" stroke="url(#gold)" stroke-width="8" fill="none"/>
    <path d="M-14 50 Q 0 72 14 50" fill="url(#gold)" stroke="${P.gold4}"/></g>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M-150 -40 C -170 60 -180 160 -170 240 L 170 240 C 180 160 170 60 150 -40Z" fill="#120a1a"/>
    ${curls(1)}${curls(-1)}
    ${upperArm(1)}${upperArm(-1)}
    ${chakra(-340, -10)}${shankha(340, -10)}
    <path d="${torso}" fill="url(#skinBlue)" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-240 236 C -262 280 -246 340 -214 380 C -230 330 -232 280 -214 246Z" fill="${P.skinBlueShade}" opacity=".5"/>
    <path d="M-120 300 Q -60 328 -12 304 M120 300 Q 60 328 12 304" stroke="${P.skinBlueShade}" stroke-width="4" fill="none"/>
    <path d="M0 420 Q 6 440 0 456" stroke="${P.skinBlueShade}" stroke-width="4" fill="none"/>
    <path d="M-60 400 Q 0 410 60 400" stroke="${P.skinBlueShade}" stroke-width="3" fill="none" opacity=".6"/>
    <path d="M-158 204 C -60 300 40 420 110 600" stroke="#fff6e0" stroke-width="6" fill="none"/>
    <!-- lower arms: abhaya (screen right) and varada (screen left) -->
    <path d="M226 250 C 280 300 300 380 290 450 L 250 462 C 250 400 240 330 214 300Z" fill="url(#skinBlue)" stroke="${P.ink}" stroke-width="3"/>
    <path d="M252 470 C 266 430 276 390 280 360 L 318 362 C 316 410 304 452 290 480 Q 270 490 252 470Z" fill="url(#skinBlue)" stroke="${P.ink}" stroke-width="3"/>
    <g transform="translate(300,318) scale(1.35)">${palm(0, 0, 0).replace(/translate\(0,0\) /, '')}</g>
    <path d="M-226 250 C -280 300 -300 380 -292 450 L -252 462 C -252 400 -240 330 -214 300Z" fill="url(#skinBlue)" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-292 448 C -300 520 -304 570 -300 600 L -262 600 C -260 560 -256 510 -252 460Z" fill="url(#skinBlue)" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-296 470 L -256 476" stroke="url(#gold)" stroke-width="12"/>
    <g transform="translate(-281,646) scale(1.35)">${palm(0, 0, 180)}</g>
    <path d="M-190 600 Q 0 630 190 600 L 200 700 L -200 700Z" fill="url(#pitambara)" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-196 560 Q 0 600 196 560 L 190 610 Q 0 640 -190 610Z" fill="url(#borderMotif)" stroke="${P.ink}" stroke-width="2"/>
    ${necklaces(0, 192, 1.2, 1.1)}
    <path d="M-176 210 C -156 400 -70 540 0 580 C 70 540 156 400 176 210" fill="none" stroke="${P.green}" stroke-width="16" stroke-dasharray="14 6"/>
    <path d="M-176 210 C -156 400 -70 540 0 580 C 70 540 156 400 176 210" fill="none" stroke="#f0d26a" stroke-width="5" stroke-dasharray="4 16"/>
    <path d="M-36 380 C -30 330 30 330 36 380 L 0 410Z" fill="#fff2d0" opacity=".0"/>
    ${f}${crown}
    ${jhumka(-112, 34, 1.6)}${jhumka(112, 34, 1.6)}
  </g>`;
}

// Tulasi plant in a brindavan (tulasi katte) pedestal.
function tulasiKatte(x, y, s = 1, seed = 11, grow = 1) {
  const r = rng(seed); let plant = '';
  const leaf = (lx, ly, rot, sc) => `<path transform="translate(${lx},${ly}) rotate(${rot}) scale(${sc})" d="M0 0 C 8 -9 24 -8 32 0 C 24 8 8 9 0 0Z" fill="${r() < .5 ? '#2e8a4a' : (r() < .5 ? '#3fa35a' : '#1f6e3a')}" stroke="#0e3d1f" stroke-width="1"/>`;
  const stem = (bx, by, len, ang, depth) => {
    if (depth > 3) return '';
    const bend = (r() - .5) * .5;
    const ex = bx + Math.cos(ang + bend) * len * grow, ey = by + Math.sin(ang + bend) * len * grow;
    const mx = bx + Math.cos(ang) * len * .5 * grow, my = by + Math.sin(ang) * len * .5 * grow;
    let out = `<path d="M${bx} ${by} Q ${mx} ${my} ${ex} ${ey}" stroke="#5a3418" stroke-width="${5 - depth}" fill="none" stroke-linecap="round"/>`;
    const nl = 6 + depth * 2;
    for (let i = 0; i < nl; i++) {
      const t = .25 + (i / nl) * .75, lx = bx + (ex - bx) * t, ly = by + (ey - by) * t;
      const side = i % 2 ? 1 : -1;
      out += leaf(lx, ly, (ang * 180) / Math.PI + side * (50 + r() * 30), .7 + r() * .5);
    }
    // manjari (flower spike)
    out += `<g transform="translate(${ex},${ey}) rotate(${(ang * 180) / Math.PI})">${[0, 6, 12, 18].map(d => `<ellipse cx="${d}" cy="0" rx="4" ry="5" fill="${d % 12 ? '#8a3a7a' : '#a8509a'}"/>`).join('')}</g>`;
    const kids = depth < 2 ? 2 + (r() < .5 ? 1 : 0) : 1;
    for (let k = 0; k < kids; k++) out += stem(bx + (ex - bx) * (.5 + r() * .4), by + (ey - by) * (.5 + r() * .4), len * (.55 + r() * .2), ang + (r() - .5) * 1.4, depth + 1);
    return out;
  };
  for (let i = 0; i < 5; i++) plant += stem((r() - .5) * 40, -250, 100 + r() * 70, -Math.PI / 2 + (i - 2) * .32 + (r() - .5) * .2, 0);
  return `<g transform="translate(${x},${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="190" ry="26" fill="#000" opacity=".4"/>
    <path d="M-170 0 L -160 -40 L 160 -40 L 170 0Z" fill="#d9c7a3" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-130 -40 L -120 -220 L 120 -220 L 130 -40Z" fill="#efe1c0" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-130 -40 L -120 -220 L -90 -220 L -100 -40Z" fill="#c9b48c" opacity=".6"/>
    <path d="M-150 -220 L 150 -220 L 130 -250 L -130 -250Z" fill="#d9c7a3" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-60 -70 L -60 -170 Q 0 -210 60 -170 L 60 -70Z" fill="#5a1a0c" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-48 -76 L -48 -164 Q 0 -196 48 -164 L 48 -76Z" fill="none" stroke="${P.gold3}" stroke-width="3"/>
    <path d="M-110 -200 L 110 -200" stroke="${P.vermilion}" stroke-width="6" stroke-dasharray="16 10"/>
    <path d="M-120 -60 L 120 -60" stroke="${P.gold3}" stroke-width="4"/>
    <path d="M-150 -232 Q -75 -190 0 -232 Q 75 -190 150 -232" fill="none" stroke="${P.marigold}" stroke-width="12" stroke-dasharray="9 3"/>
    ${[...Array(5)].map((_, i) => `<circle cx="${-100 + i * 50}" cy="-28" r="7" fill="${P.marigold}"/>`).join('')}
    ${flame(0, -82, .7)}
    <path d="M-110 -250 Q 0 -270 110 -250 L 110 -246 Q 0 -262 -110 -246Z" fill="#3a2410"/>
    ${plant}
  </g>`;
}

function shaligram(x, y, s = 1, glow = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <ellipse cx="0" cy="-10" rx="240" ry="220" fill="url(#blueGlow)" opacity="${glow}"/>
    ${lotus(0, 104, 1.5, '#f6b6c6', '#c64f73')}
    <path d="M0 -92 C 76 -92 112 -36 112 20 C 112 78 64 106 0 106 C -64 106 -112 78 -112 20 C -112 -36 -76 -92 0 -92Z" fill="#17151d" stroke="#000" stroke-width="3"/>
    <path d="M-70 -50 C -40 -84 20 -86 50 -64 C 10 -70 -36 -62 -70 -50Z" fill="#6a6880" opacity=".55"/>
    <ellipse cx="-44" cy="-44" rx="14" ry="7" fill="#fff" opacity=".35"/>
    <g transform="translate(18,34)" fill="none" stroke="${P.gold2}" stroke-width="3" opacity=".85">
      <path d="M0 0 m -4 0 a 4 4 0 1 1 8 0 a 9 9 0 1 1 -18 0 a 14 14 0 1 1 28 0 a 20 20 0 1 1 -40 0"/>
    </g>
    <path d="M-112 20 C -112 78 -64 106 0 106 C -50 96 -96 70 -104 20Z" fill="#000" opacity=".4"/>
    ${[-1, 1].map(sx => `<path transform="scale(${sx},1)" d="M8 -96 C 18 -110 36 -112 46 -104 C 36 -96 18 -94 8 -96Z" fill="#2e8a4a" stroke="#0e3d1f"/>`).join('')}
    <path d="M0 -96 L 0 -112" stroke="#5a3418" stroke-width="3"/>
  </g>`;
}

function templeSilhouette(x, y, s = 1, col = '#0b0e24') {
  return `<g transform="translate(${x},${y}) scale(${s})" fill="${col}">
    <path d="M-300 0 L -300 -120 L -260 -120 L -240 -200 L -200 -200 L -180 -300 L -140 -300 L -120 -420 L -80 -420 L -60 -520 L 60 -520 L 80 -420 L 120 -420 L 140 -300 L 180 -300 L 200 -200 L 240 -200 L 260 -120 L 300 -120 L 300 0Z"/>
    <path d="M-60 -520 Q 0 -600 60 -520Z"/>
    ${[...Array(5)].map((_, i) => `<path d="M${-12 + i * 0} ${-600 - i * 0} " />`).join('')}
    <path d="M-10 -600 L 0 -660 L 10 -600Z"/>
  </g>`;
}

function frameBorder(w, h) {
  return `<g opacity=".9">
    <rect x="22" y="22" width="${w - 44}" height="${h - 44}" fill="none" stroke="url(#gold)" stroke-width="3"/>
    <rect x="34" y="34" width="${w - 68}" height="${h - 68}" fill="none" stroke="url(#gold)" stroke-width="1" opacity=".6"/>
  </g>`;
}

function captionBand(w, h, hh = 240) {
  return `<linearGradient id="cband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></linearGradient>
    <rect y="${h - hh}" width="${w}" height="${hh}" fill="url(#cband)"/>`;
}

function finish(w, h) {
  return `<rect width="${w}" height="${h}" fill="url(#vignette)"/>
    <rect width="${w}" height="${h}" filter="url(#grain)" opacity=".22" style="mix-blend-mode:overlay"/>`;
}

if (typeof module !== 'undefined') module.exports = { P, rng, defs, flame, nilavilakku, prabhavali, kirtimukha, lotus, petals, embers, mandalaGlow, face, jhumka, necklaces, vrinda, vishnu, tulasiKatte, shaligram, templeSilhouette, frameBorder, captionBand, finish };
