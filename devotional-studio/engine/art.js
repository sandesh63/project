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
    <linearGradient id="blouseGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2fa36e"/><stop offset=".55" stop-color="#1f8a5a"/><stop offset="1" stop-color="${P.greenDark}"/>
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
  // Torso with natural shoulders (±172), waist and flared skirt.
  const torso = 'M-38 168 C -86 172 -140 180 -168 206 C -186 240 -184 330 -176 400 C -170 450 -168 470 -172 480 C -190 560 -214 630 -236 700 L 236 700 C 214 630 190 560 172 480 C 168 470 170 450 176 400 C 184 330 186 240 168 206 C 140 180 86 172 38 168Z';
  // One-piece blouse: body + elbow-length sleeves filled WITHOUT strokes, then a single outer outline,
  // so there is no seam between sleeve and bodice.
  const sleeveFill = (sx) => `<path transform="scale(${sx},1)" d="M-112 188 C -170 186 -214 206 -232 256 C -246 300 -246 380 -240 440 L -236 474 Q -206 488 -176 474 L -170 300 L -150 200Z" fill="url(#greenCloth)"/>`;
  const blouseOutline = `M-112 190 C -170 186 -214 206 -232 256 C -246 300 -246 380 -240 440 L -236 474 Q -206 488 -176 474 L -173 458 Q 0 502 173 458 L 176 474 Q 206 488 236 474 L 240 440 C 246 380 246 300 232 256 C 214 206 170 186 112 190 C 86 262 -86 262 -112 190Z`;
  const sleeveDetail = (sx) => `<g transform="scale(${sx},1)">
      <path d="M-226 270 C -236 320 -236 380 -230 440" stroke="${P.greenDark}" stroke-width="10" fill="none" opacity=".4"/>
      <path d="M-208 300 C -204 350 -204 400 -208 450" stroke="${P.greenDark}" stroke-width="2.5" fill="none" opacity=".55"/>
      <path d="M-176 372 C -174 410 -175 440 -176 470" stroke="${P.greenDark}" stroke-width="3" fill="none" opacity=".8"/>
      <path d="M-160 212 C -184 220 -200 236 -212 262" stroke="#5fd49e" stroke-width="4" fill="none" opacity=".45"/>
      <path d="M-239 458 Q -206 474 -175 458" stroke="url(#gold)" stroke-width="13" fill="none"/>
      <path d="M-239 458 Q -206 474 -175 458" stroke="${P.vermDark}" stroke-width="3" fill="none" stroke-dasharray="5 5"/>
      <path d="M-237 472 Q -206 486 -176 472" stroke="url(#gold)" stroke-width="4" fill="none"/>
      <path d="M-236 478 Q -206 492 -176 478 C -176 500 -196 512 -210 512 C -226 512 -238 498 -236 478Z" fill="url(#skinWarm)" stroke="${P.ink}" stroke-width="3"/>
    </g>`;
  const body = `
    <path d="${torso}" fill="url(#skinWarm)" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-60 200 Q 0 214 60 200" stroke="${P.skinWarmShade}" stroke-width="3" fill="none" opacity=".6"/>
    <!-- blouse (single garment) -->
    <path d="${blouseOutline}" fill="url(#blouseGrad)" stroke="${P.ink}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-112 190 C -86 262 86 262 112 190" fill="none" stroke="url(#gold)" stroke-width="11"/>
    <path d="M-112 190 C -86 262 86 262 112 190" fill="none" stroke="${P.vermDark}" stroke-width="3" stroke-dasharray="6 6"/>
    <path d="M-173 458 Q 0 502 173 458" fill="none" stroke="url(#gold)" stroke-width="9"/>
    <path d="M-96 300 C -88 350 -92 400 -104 450 M96 300 C 88 350 92 400 104 450" stroke="${P.greenDark}" stroke-width="2.5" fill="none" opacity=".6"/>
    <!-- waist + skirt pleats -->
    <path d="M-174 470 Q 0 515 174 470 L 236 700 L -236 700Z" fill="url(#saree)" stroke="${P.ink}" stroke-width="3"/>
    ${[-150, -90, -30, 30, 90, 150].map(px => `<path d="M${px * .85} ${505} Q ${px} 600 ${px * 1.1} 700" stroke="${P.vermDark}" stroke-width="3" fill="none" opacity=".6"/>`).join('')}
    ${sleeveDetail(1)}${sleeveDetail(-1)}
    <!-- pallu over left shoulder (screen right), covering that sleeve -->
    <path d="M62 188 C 140 190 222 214 246 290 L 256 700 L 10 700 C 30 590 60 480 112 380 C 78 320 56 250 62 188Z" fill="url(#saree)" stroke="${P.ink}" stroke-width="3"/>
    <path d="M62 188 C 140 190 222 214 246 290 L 256 700 L 10 700 C 30 590 60 480 112 380 C 78 320 56 250 62 188Z" fill="url(#sareeMotif)"/>
    <path d="M150 226 C 170 330 180 450 170 700 M206 260 C 220 380 226 500 220 700" stroke="${P.vermDark}" stroke-width="3" fill="none" opacity=".55"/>
    <path d="M62 188 C 56 250 78 320 112 380 C 60 480 30 590 10 700" fill="none" stroke="url(#borderMotif)" stroke-width="26"/>
    <path d="M246 290 L 256 700" fill="none" stroke="url(#borderMotif)" stroke-width="16"/>
    <path d="M-150 490 Q 0 530 150 490" stroke="url(#gold)" stroke-width="14" fill="none"/>
    <path d="M-150 490 Q 0 530 150 490" stroke="${P.gold4}" stroke-width="14" stroke-dasharray="4 10" fill="none" opacity=".6"/>
    ${necklaces(0, 194, 1.05)}`;
  // anjali mudra: elbows at sides, forearms rising to palms pressed at chest
  const hands = `
    <g>
      ${[-1, 1].map(sx => `<g transform="scale(${sx},1)">
        <path d="M-228 484 C -186 490 -110 452 -34 404 L -24 452 C -96 498 -170 518 -212 512 C -226 508 -232 496 -228 484Z" fill="url(#skinWarm)" stroke="${P.ink}" stroke-width="3"/>
        <path d="M-212 512 C -170 518 -96 498 -24 452 L -30 440 C -100 482 -166 502 -214 500Z" fill="${P.skinWarmShade}" opacity=".5"/>
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

// ---------- hands ----------
// Open palm facing the viewer, fingers up. Origin = wrist centre. side=+1 puts the thumb on +x.
function openPalm(skin, shade, side = 1) {
  const fingers = [[-19, 40, 11], [-6, 47, 12], [7, 44, 12], [19, 34, 10.5]];
  const f = fingers.map(([fx, len, w]) => {
    const hw = w / 2, top = -58 - len;
    return `<path d="M${fx - hw} -56 L ${fx - hw} ${top + hw} A ${hw} ${hw} 0 0 1 ${fx + hw} ${top + hw} L ${fx + hw} -56Z" fill="${skin}" stroke="${P.ink}" stroke-width="2.4"/>
      <path d="M${fx - hw + 2} ${-58 - len * .38} h ${w - 4} M${fx - hw + 2} ${-58 - len * .7} h ${w - 4}" stroke="${shade}" stroke-width="1.6"/>
      <ellipse cx="${fx}" cy="${top + hw + 3}" rx="${hw * .55}" ry="${hw * .7}" fill="#f2b7a8" opacity=".55"/>`;
  }).join('');
  const thumb = `<path transform="scale(${side},1)" d="M22 -14 C 34 -18 46 -34 48 -50 C 49 -60 40 -63 35 -55 C 32 -44 28 -36 20 -32Z" fill="${skin}" stroke="${P.ink}" stroke-width="2.4"/>`;
  return `${thumb}
    <path d="M-25 2 C -28 -18 -29 -40 -25 -60 L 25 -60 C 29 -40 28 -18 25 2 Q 0 10 -25 2Z" fill="${skin}" stroke="${P.ink}" stroke-width="2.6"/>
    ${f}
    <path d="M-25 -58 L 25 -58" stroke="${shade}" stroke-width="1.5" opacity=".6"/>
    <path transform="scale(${side},1)" d="M-18 -44 Q 0 -36 18 -46 M-20 -28 Q -2 -22 12 -30 M14 -10 Q 4 -30 14 -52" stroke="${shade}" stroke-width="1.8" fill="none"/>
    <circle cx="0" cy="-30" r="8" fill="none" stroke="${P.vermilion}" stroke-width="2.6"/>
    <circle cx="0" cy="-30" r="2.5" fill="${P.vermilion}"/>
    <path d="M-27 4 Q 0 14 27 4" stroke="url(#gold)" stroke-width="11" fill="none"/>
    <path d="M-27 4 Q 0 14 27 4" stroke="${P.vermilion}" stroke-width="2.5" fill="none" stroke-dasharray="4 6"/>`;
}

// Back of a hand holding something from below: curled fingers, index raised (for the chakra).
function holdingHand(skin, shade, side = 1, indexUp = true) {
  const curled = [[-12, 0], [0, 2], [12, 4]].map(([fx, dy]) => `<path d="M${fx - 6} ${-50 + dy} C ${fx - 7} ${-66 + dy} ${fx + 7} ${-66 + dy} ${fx + 6} ${-50 + dy}" fill="${skin}" stroke="${P.ink}" stroke-width="2.2"/>`).join('');
  const index = indexUp ? `<path transform="scale(${side},1)" d="M-24 -48 L -25 -98 A 5.5 5.5 0 0 1 -14 -98 L -13 -48Z" fill="${skin}" stroke="${P.ink}" stroke-width="2.2"/>`
    : `<path transform="scale(${side},1)" d="M-25 -50 C -27 -66 -11 -66 -12 -50" fill="${skin}" stroke="${P.ink}" stroke-width="2.2"/>`;
  return `<path d="M-24 2 C -27 -16 -27 -34 -24 -50 L 24 -50 C 27 -34 27 -16 24 2 Q 0 10 -24 2Z" fill="${skin}" stroke="${P.ink}" stroke-width="2.6"/>
    ${index}${curled}
    <path transform="scale(${side},1)" d="M24 -20 C 34 -24 38 -36 32 -44 C 28 -48 22 -44 22 -40" fill="${skin}" stroke="${P.ink}" stroke-width="2.2"/>
    <path d="M-16 -18 Q 0 -12 16 -18" stroke="${shade}" stroke-width="1.6" fill="none"/>
    <path d="M-26 4 Q 0 14 26 4" stroke="url(#gold)" stroke-width="11" fill="none"/>`;
}

// A limb segment as a tapered capsule between two joints (ax,ay)->(bx,by).
function limb(ax, ay, bx, by, wa, wb, fill, shade) {
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const p = (x, y, w, k) => [x + nx * w * k, y + ny * w * k];
  const [a1x, a1y] = p(ax, ay, wa / 2, 1), [a2x, a2y] = p(ax, ay, wa / 2, -1);
  const [b1x, b1y] = p(bx, by, wb / 2, 1), [b2x, b2y] = p(bx, by, wb / 2, -1);
  const bulge = .08 * L;
  const m1x = (a1x + b1x) / 2 + nx * bulge, m1y = (a1y + b1y) / 2 + ny * bulge;
  const m2x = (a2x + b2x) / 2 - nx * bulge * .6, m2y = (a2y + b2y) / 2 - ny * bulge * .6;
  return `<path d="M${a1x} ${a1y} Q ${m1x} ${m1y} ${b1x} ${b1y} A ${wb / 2} ${wb / 2} 0 0 0 ${b2x} ${b2y} Q ${m2x} ${m2y} ${a2x} ${a2y} A ${wa / 2} ${wa / 2} 0 0 0 ${a1x} ${a1y}Z" fill="${fill}" stroke="${P.ink}" stroke-width="3"/>
    <path d="M${a2x} ${a2y} Q ${m2x} ${m2y} ${b2x} ${b2y}" stroke="${shade}" stroke-width="${Math.min(wa, wb) * .28}" fill="none" opacity=".45" stroke-linecap="round"/>`;
}


// Catmull-Rom spline through points -> SVG cubic path segments (no leading M).
function crPath(pts) {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

// One continuous arm: shoulder -> elbow -> wrist, smooth bend, bicep + forearm bulge.
// w = [shoulder, bicep, elbow, forearm, wrist] widths.
function arm(sh, el, wr, fill, shade, w = [74, 72, 52, 54, 40]) {
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const nrm = (v) => { const L = Math.hypot(v[0], v[1]); return [-v[1] / L, v[0] / L]; };
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const n1 = nrm(sub(el, sh)), n2 = nrm(sub(wr, el));
  let ne = [n1[0] + n2[0], n1[1] + n2[1]]; const L = Math.hypot(ne[0], ne[1]) || 1; ne = [ne[0] / L, ne[1] / L];
  const off = (p, n, d) => [p[0] + n[0] * d, p[1] + n[1] * d];
  const mid1 = lerp(sh, el, .45), mid2 = lerp(el, wr, .35);
  const sideA = [off(sh, n1, w[0] / 2), off(mid1, n1, w[1] / 2), off(el, ne, w[2] / 2), off(mid2, n2, w[3] / 2), off(wr, n2, w[4] / 2)];
  const sideB = [off(sh, n1, -w[0] / 2), off(mid1, n1, -w[1] / 2 * .92), off(el, ne, -w[2] / 2), off(mid2, n2, -w[3] / 2 * .95), off(wr, n2, -w[4] / 2)];
  const rb = [...sideB].reverse();
  const d = `M ${sideA[0][0]} ${sideA[0][1]}${crPath(sideA)} A ${w[4] / 2} ${w[4] / 2} 0 0 1 ${rb[0][0]} ${rb[0][1]}${crPath(rb)} A ${w[0] / 2} ${w[0] / 2} 0 0 1 ${sideA[0][0]} ${sideA[0][1]}Z`;
  const shadeLine = `M ${sideB[0][0]} ${sideB[0][1]}${crPath(sideB)}`;
  const eIn = off(el, ne, -w[2] * .32), eIn2 = off(lerp(el, wr, .12), n2, -w[3] * .2);
  return `<path d="${d}" fill="${fill}" stroke="${P.ink}" stroke-width="3" stroke-linejoin="round"/>
    <path d="${shadeLine}" stroke="${shade}" stroke-width="${w[4] * .45}" fill="none" opacity=".4" stroke-linecap="round"/>
    <path d="M ${sideA[1][0]} ${sideA[1][1]} Q ${off(mid1, n1, w[1] * .2)[0]} ${off(mid1, n1, w[1] * .2)[1]} ${off(lerp(sh, el, .75), n1, w[1] * .1)[0]} ${off(lerp(sh, el, .75), n1, w[1] * .1)[1]}" stroke="#9cc0ff" stroke-width="3" fill="none" opacity=".35"/>
    <path d="M ${eIn[0]} ${eIn[1]} Q ${el[0]} ${el[1]} ${eIn2[0]} ${eIn2[1]}" stroke="${shade}" stroke-width="2.5" fill="none" opacity=".8"/>`;
}

const bandOn = (a, b, t, w) => {
  const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI + 90;
  return armBand(x, y, ang, w);
};
const armBand = (x, y, ang, w) => `<g transform="translate(${x},${y}) rotate(${ang})">
  <rect x="${-w / 2 - 3}" y="-7" width="${w + 6}" height="14" rx="5" fill="url(#gold)" stroke="${P.gold4}" stroke-width="1.5"/>
  <path d="M0 -7 l 8 -12 -8 -8 -8 8z" fill="url(#gold)" stroke="${P.gold4}" stroke-width="1.5"/><circle cx="0" cy="-16" r="3.5" fill="${P.vermilion}"/></g>`;

// Vishnu — frontal, Kerala-mural proportions. Four arms:
// back-right: chakra, back-left: shankha, front-right: abhaya (palm raised), front-left: varada (palm down).
// "right"/"left" are his; on screen his right hand is at -x.
function vishnu(x, y, s = 1, o = {}) {
  const SK = 'url(#skinBlue)', SH = P.skinBlueShade;
  const namam = `<path d="M-14 -40 L -10 -88 M14 -40 L 10 -88" stroke="#fff6e0" stroke-width="7" stroke-linecap="round"/>
    <path d="M0 -40 L 0 -90" stroke="${P.vermilion}" stroke-width="6" stroke-linecap="round"/>
    <path d="M-14 -40 Q 0 -26 14 -40" stroke="#fff6e0" stroke-width="7" fill="none"/>`;
  const f = face({ id: 'vi', x: 0, y: 0, s: 1, skin: SK, shade: SH, eyeOpen: o.eyeOpen ?? .7, browW: 5, blush: 0, lip: '#9c2a3a', lip2: '#c2414e', rim: '#cfe2ff', extra: namam });

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
      <path d="M-114 -58 C -160 -50 -172 20 -150 80 M114 -58 C 160 -50 172 20 150 80" fill="none" stroke="url(#gold)" stroke-width="12"/>
    </g>`;
  const curls = (sx) => [...Array(7)].map((_, i) => `<path transform="scale(${sx},1)" d="M104 ${-56 + i * 28} q 30 6 22 32 q -16 8 -22 -6" fill="#120a1a" stroke="#000" stroke-width="1.5"/>`).join('');

  // Joints (screen coords, local units). Shoulders at ±188, y 236.
  const J = {
    bR: { sh: [-150, 222], el: [-272, 176], wr: [-310, 62] },  // back right (chakra)
    bL: { sh: [150, 222], el: [272, 176], wr: [310, 62] },     // back left (shankha)
    fR: { sh: [-164, 242], el: [-218, 440], wr: [-284, 336] }, // front right (abhaya: forearm raised, angled out)
    fL: { sh: [164, 242], el: [214, 436], wr: [252, 544] },    // front left (varada: forearm lowered, palm out)
  };
  const backArm = (j, sx) => `
    ${arm(j.sh, j.el, j.wr, SK, SH, [64, 62, 46, 46, 36])}
    ${bandOn(j.sh, j.el, .42, 64)}
    ${bandOn(j.el, j.wr, .9, 44)}`;
  const chakra = (cx, cy) => `<g transform="translate(${cx},${cy})">
    <circle r="96" fill="url(#lampGlow)"/>
    ${[...Array(16)].map((_, i) => `<path transform="rotate(${i * 22.5})" d="M0 -44 C 9 -56 10 -68 0 -78 C -10 -68 -9 -56 0 -44Z" fill="url(#gold)" stroke="${P.gold4}"/>`).join('')}
    <circle r="46" fill="url(#gold)" stroke="${P.gold4}" stroke-width="3"/>
    <circle r="38" fill="none" stroke="${P.gold4}" stroke-width="2"/>
    ${[...Array(12)].map((_, i) => `<path transform="rotate(${i * 30})" d="M0 -10 L 3 -36 L 0 -38 L -3 -36Z" fill="${P.gold4}"/>`).join('')}
    <circle r="12" fill="${P.vermilion}" stroke="${P.gold4}" stroke-width="2"/></g>`;
  const shankha = (cx, cy) => `<g transform="translate(${cx},${cy})">
    <circle r="86" fill="url(#lampGlow)" opacity=".6"/>
    <path d="M0 -64 C 38 -54 48 -10 34 32 C 24 54 -24 54 -34 32 C -48 -10 -38 -54 0 -64Z" fill="#fffaf0" stroke="${P.gold4}" stroke-width="3"/>
    <path d="M-20 -32 Q 0 -12 22 -36 M-26 0 Q 0 18 28 -4 M-22 28 Q 0 42 22 26" fill="none" stroke="#d8c8a8" stroke-width="3"/>
    <path d="M30 -16 Q 50 -34 40 -58" stroke="url(#gold)" stroke-width="8" fill="none"/>
    <path d="M-16 50 Q 0 74 16 50" fill="url(#gold)" stroke="${P.gold4}"/></g>`;
  // Torso: broad shoulders, chest tapering to a narrow waist (classic lion-chest, slim-waist ideal).
  const torso = 'M-40 170 C -94 174 -146 182 -170 204 C -188 230 -186 288 -174 336 C -160 388 -138 440 -128 520 L -126 600 L 126 600 L 128 520 C 138 440 160 388 174 336 C 186 288 188 230 170 204 C 146 182 94 174 40 170Z';

  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M-150 -40 C -168 60 -176 150 -168 236 L 168 236 C 176 150 168 60 150 -40Z" fill="#120a1a"/>
    ${curls(1)}${curls(-1)}
    <!-- back arms (behind torso) -->
    ${backArm(J.bR, -1)}${backArm(J.bL, 1)}
    <g transform="translate(${J.bR.wr[0]},${J.bR.wr[1]})">${holdingHand(SK, SH, -1, true)}</g>
    ${chakra(J.bR.wr[0] - 19, J.bR.wr[1] - 150)}
    ${shankha(J.bL.wr[0], J.bL.wr[1] - 96)}
    <g transform="translate(${J.bL.wr[0]},${J.bL.wr[1]})">${holdingHand(SK, SH, 1, false)}</g>
    <!-- torso -->
    <path d="${torso}" fill="${SK}" stroke="${P.ink}" stroke-width="3"/>
    <path d="M-170 204 C -188 230 -186 288 -174 336 C -160 388 -138 440 -128 520 C -142 450 -160 390 -166 330 C -170 290 -170 240 -160 216Z" fill="${SH}" opacity=".45"/>
    <path d="M-110 316 Q -66 334 -22 320 M110 316 Q 66 334 22 320" stroke="${SH}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".55"/>
    <ellipse cx="-70" cy="270" rx="46" ry="30" fill="#9cc0ff" opacity=".18"/>
    <ellipse cx="70" cy="270" rx="46" ry="30" fill="#9cc0ff" opacity=".12"/>
    <path d="M0 470 Q 6 480 0 490" stroke="${SH}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M-60 210 Q 0 222 60 210" stroke="${SH}" stroke-width="3" fill="none" opacity=".5"/>
    <!-- sacred thread from his left shoulder to right hip -->
    <path d="M136 200 C 70 300 -20 420 -104 590" stroke="#fff6e0" stroke-width="5" fill="none"/>
    <path d="M136 200 C 70 300 -20 420 -104 590" stroke="#d8c8a8" stroke-width="5" fill="none" stroke-dasharray="2 10"/>
    <!-- pitambara + waist belt -->
    <path d="M-136 540 Q 0 566 136 540 L 150 700 L -150 700Z" fill="url(#pitambara)" stroke="${P.ink}" stroke-width="3"/>
    ${[-90, -30, 30, 90].map(px => `<path d="M${px} 560 Q ${px * 1.05} 630 ${px * 1.12} 700" stroke="#a8640a" stroke-width="3" fill="none" opacity=".6"/>`).join('')}
    <path d="M-138 516 Q 0 546 138 516 L 136 552 Q 0 580 -136 552Z" fill="url(#borderMotif)" stroke="${P.ink}" stroke-width="2"/>
    <path d="M0 548 l 18 20 -18 26 -18 -26z" fill="url(#gold)" stroke="${P.gold4}" stroke-width="2"/><circle cx="0" cy="572" r="7" fill="${P.vermilion}"/>
    ${necklaces(0, 192, 1.15, 1.0)}
    <!-- vanamala: forest garland -->
    <path d="M-136 204 C -136 380 -74 540 0 610 C 74 540 136 380 136 204" fill="none" stroke="${P.green}" stroke-width="16" stroke-dasharray="14 6"/>
    <path d="M-136 204 C -136 380 -74 540 0 610 C 74 540 136 380 136 204" fill="none" stroke="#f0d26a" stroke-width="5" stroke-dasharray="4 16"/>
    <!-- front arms -->
    ${arm(J.fR.sh, J.fR.el, J.fR.wr, SK, SH)}
    ${bandOn(J.fR.sh, J.fR.el, .3, 72)}
    <g transform="translate(${J.fR.wr[0]},${J.fR.wr[1]}) rotate(-16) scale(1.3)">${openPalm(SK, SH, 1)}</g>
    ${arm(J.fL.sh, J.fL.el, J.fL.wr, SK, SH)}
    ${bandOn(J.fL.sh, J.fL.el, .3, 72)}
    <g transform="translate(${J.fL.wr[0]},${J.fL.wr[1]}) rotate(${180 - 18}) scale(1.2)">${openPalm(SK, SH, 1)}</g>
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

if (typeof module !== 'undefined') module.exports = { P, rng, defs, flame, nilavilakku, prabhavali, kirtimukha, lotus, petals, embers, mandalaGlow, face, jhumka, necklaces, vrinda, vishnu, tulasiKatte, shaligram, templeSilhouette, frameBorder, captionBand, finish, openPalm, holdingHand, crPath, arm, bandOn, armBand };
