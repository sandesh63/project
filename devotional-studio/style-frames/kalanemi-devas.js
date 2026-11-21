// Kalanemi (asura king, Vrinda's father) — built on Jalandhar's body; Agni and Vayu (devas) — built on Indra's body.
const A = require('../engine/art.js');
const C = require('../engine/characters.js');
const O = require('./face-options-2.js');
const JL = require('./jalandhar.js');
const RI = require('./rishi-indra.js');

const defs = `<defs>
  <radialGradient id="kSkin" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#9a6a50"/><stop offset=".62" stop-color="#6e4430"/><stop offset="1" stop-color="#432618"/></radialGradient>
  <linearGradient id="kSkinL" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="#9a6a50"/><stop offset=".45" stop-color="#6e4430"/><stop offset="1" stop-color="#432618"/></linearGradient>
  <linearGradient id="kMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a2a1a"/><stop offset=".35" stop-color="#8a6a3a"/><stop offset=".5" stop-color="#c8a868"/><stop offset=".7" stop-color="#6a4a22"/><stop offset="1" stop-color="#2a1a0a"/></linearGradient>
  <linearGradient id="kCape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a1a5a"/><stop offset="1" stop-color="#1a0624"/></linearGradient>
  <radialGradient id="agSkin" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#ffc08a"/><stop offset=".62" stop-color="#e88454"/><stop offset="1" stop-color="#b04a26"/></radialGradient>
  <linearGradient id="agSkinL" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="#ffc08a"/><stop offset=".45" stop-color="#e88454"/><stop offset="1" stop-color="#b04a26"/></linearGradient>
  <linearGradient id="agSilk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e2452c"/><stop offset=".5" stop-color="#b42214"/><stop offset="1" stop-color="#6e0e08"/></linearGradient>
  <radialGradient id="vaSkin" cx=".42" cy=".42" r=".72"><stop offset="0" stop-color="#e4f0f4"/><stop offset=".62" stop-color="#b8d0dc"/><stop offset="1" stop-color="#7a98ac"/></radialGradient>
  <linearGradient id="vaSkinL" gradientUnits="userSpaceOnUse" x1="-140" y1="0" x2="140" y2="0"><stop offset="0" stop-color="#e4f0f4"/><stop offset=".45" stop-color="#b8d0dc"/><stop offset="1" stop-color="#7a98ac"/></linearGradient>
  <linearGradient id="vaSilk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5ac89a"/><stop offset=".5" stop-color="#2a9a6e"/><stop offset="1" stop-color="#145a40"/></linearGradient>
</defs>`;

// ---------------- KALANEMI
function kalanemi(x, y, s, o = {}) {
  let svg = JL.jalandharFull(x, y, s, {
    ...o, idPrefix: 'ka', crown: 'horns', hairCol: '#5e5864', mustache: 'thick',
    faceOverride: { brow: { x0: 4, x1: 39, y: 52, arch: 2, t: 5.2 }, irisCol: '#6a2a10', eye: { ex: 21, ey: 67, ew: 26, eh: 8.5, tilt: 3, irisK: .82, flick: 3 } },
    overlayExtra: (f) => `${O.beard(f.mouthY, f.chin + 26, '#6a6470')}
      ${[-14, -4, 6, 16].map(xx => `<path d="M${xx} ${f.mouthY + 8} q ${xx > 0 ? 4 : -4} 16 0 30" stroke="#8a8490" stroke-width="1.4" fill="none"/>`).join('')}
      <path d="M-20 ${f.brow.y - 14} Q 0 ${f.brow.y - 18} 20 ${f.brow.y - 14} M-16 ${f.brow.y - 8} Q 0 ${f.brow.y - 11} 16 ${f.brow.y - 8}" stroke="#432618" stroke-width="1.3" fill="none" opacity=".7"/>
      <path d="M-34 ${f.eye.ey + 8} q 6 5 12 2 M34 ${f.eye.ey + 8} q -6 5 -12 2" stroke="#432618" stroke-width="1.2" fill="none" opacity=".7"/>`,
  });
  return svg.replace(/url\(#jSkinL\)/g, 'url(#kSkinL)').replace(/url\(#jSkin\)/g, 'url(#kSkin)').replace(/url\(#darkGold\)/g, 'url(#kMetal)').replace(/url\(#cape\)/g, 'url(#kCape)');
}

// ---------------- AGNI
const flames = (t = 0, n = 9, w = 210, y0 = 930) => [...Array(n)].map((_, i) => {
  const x = -w + i * (2 * w / (n - 1)), h = 70 + ((i * 37) % 50) + Math.sin(t * 6 + i) * 10;
  return `<path d="M${x - 26} ${y0} C ${x - 24} ${y0 - h * .5} ${x - 6} ${y0 - h * .7} ${x} ${y0 - h} C ${x + 6} ${y0 - h * .7} ${x + 24} ${y0 - h * .5} ${x + 26} ${y0}Z" fill="url(#flame)" opacity=".95"/>`;
}).join('') + `<ellipse cx="0" cy="${y0}" rx="${w + 40}" ry="34" fill="#ff7a1a" opacity=".55" filter="url(#blur8)"/>`;
const fireSpear = (t = 0) => `<g>
  <rect x="-149" y="40" width="12" height="740" rx="5" fill="url(#gold)" stroke="#7a4a10" stroke-width="1.4"/>
  <path d="M-143 -40 L -128 40 L -143 52 L -158 40Z" fill="url(#goldV)" stroke="#7a4a10" stroke-width="1.6"/>
  <g transform="translate(-143,-40)">${A.flame(0, 0, 1.2, Math.sin(t * 9) * 3)}</g></g>`;
function agni(x, y, s, o = {}) {
  let svg = RI.indra(x, y, s, {
    ...o, idPrefix: 'ag', eyes: o.eyes || 'open',
    faceOverride: { irisCol: '#7a2a0a', brow: { x0: 5, x1: 37, y: 51, arch: 3, t: 4.2 } },
    overlay: (f) => `<path d="M-38 ${f.mouthY - 14} C -44 ${f.mouthY + 30} -22 ${f.mouthY + 62} 0 ${f.mouthY + 74} C 22 ${f.mouthY + 62} 44 ${f.mouthY + 30} 38 ${f.mouthY - 14} C 24 ${f.mouthY + 2} -24 ${f.mouthY + 2} -38 ${f.mouthY - 14}Z" fill="#c2401a"/>
      ${[-20, -8, 4, 16].map(xx => `<path d="M${xx} ${f.mouthY + 10} q ${xx > 0 ? 6 : -6} 22 0 44" stroke="#ff9a3a" stroke-width="1.8" fill="none"/>`).join('')}
      <path d="M0 ${f.mouthY - 7} C -10 ${f.mouthY - 12} -22 ${f.mouthY - 9} -28 ${f.mouthY + 2} C -18 ${f.mouthY - 3} -9 ${f.mouthY - 3} 0 ${f.mouthY - 4} C 9 ${f.mouthY - 3} 18 ${f.mouthY - 3} 28 ${f.mouthY + 2} C 22 ${f.mouthY - 9} 10 ${f.mouthY - 12} 0 ${f.mouthY - 7}Z" fill="#a8300e"/>`,
    weapon: fireSpear(o.t || 0), base: flames(o.t || 0),
  });
  svg = svg.replace(/url\(#iSkinL\)/g, 'url(#agSkinL)').replace(/url\(#iSkin\)/g, 'url(#agSkin)').replace(/url\(#iSilk\)/g, 'url(#agSilk)').replace(/#2a6ab8/g, '#e8a818').replace(/#2a8ad8/g, '#ff6a1a').replace(/#123a6a/g, '#7a4a08');
  // flame halo behind the head
  return `<g><g transform="translate(${x},${y + 30 * s}) scale(${s})">${[...Array(11)].map((_, i) => `<g transform="rotate(${-75 + i * 15}) translate(0,-150)">${A.flame(0, 0, .9, 0)}</g>`).join('')}</g>${svg}</g>`;
}

// ---------------- VAYU
const windSwirls = (t = 0, y0 = 900) => [...Array(6)].map((_, i) => {
  const x = -200 + i * 80, r = 26 + (i % 3) * 10, ph = t * 3 + i;
  return `<path d="M${x - 70} ${y0 + (i % 2) * 30} C ${x - 30} ${y0 - 20} ${x + 10} ${y0 + 20} ${x + r} ${y0 + (i % 2) * 30 - r * .3} A ${r * .6} ${r * .6} 0 1 0 ${x + r * .4} ${y0 + (i % 2) * 30 - r}" stroke="#e8f8ff" stroke-width="${5 - (i % 3)}" fill="none" stroke-linecap="round" opacity="${.7 + .2 * Math.sin(ph)}"/>`;
}).join('') + [...Array(5)].map((_, i) => `<ellipse cx="${-160 + i * 80}" cy="${950 + (i % 2) * 10}" rx="70" ry="30" fill="url(#cloud)" opacity=".85"/>`).join('');
const banner = (t = 0) => { const w = (k) => Math.sin(t * 5 + k) * 8;
  return `<g><rect x="-149" y="-80" width="10" height="860" rx="4" fill="#d8d0c0" stroke="#6a6250" stroke-width="1.4"/>
    <circle cx="-144" cy="-86" r="9" fill="url(#gold)" stroke="#7a4a10"/>
    <path d="M-149 -70 C -190 ${-80 + w(0)} -230 ${-50 + w(1)} -280 ${-66 + w(2)} C -250 ${-30 + w(3)} -250 ${-6 + w(4)} -284 ${10 + w(5)} C -230 ${0 + w(1)} -190 ${24 + w(2)} -149 ${10}Z" fill="#2a9a6e" stroke="#145a40" stroke-width="1.6"/>
    <path d="M-160 -40 C -200 ${-48 + w(1)} -230 ${-30 + w(2)} -258 ${-36 + w(3)}" stroke="#e8f8ff" stroke-width="2" fill="none" opacity=".7"/></g>`; };
function vayu(x, y, s, o = {}) {
  let svg = RI.indra(x, y, s, {
    ...o, idPrefix: 'va', eyes: o.eyes || 'open',
    faceOverride: { irisCol: '#2a5a7a', eye: { ex: 21, ey: 66, ew: 28, eh: 11.5, tilt: 1, irisK: .88, flick: 3 }, brow: { x0: 6, x1: 36, y: 50, arch: 5, t: 2.8 } },
    overlay: () => '', weapon: banner(o.t || 0), base: windSwirls(o.t || 0),
  });
  return svg.replace(/url\(#iSkinL\)/g, 'url(#vaSkinL)').replace(/url\(#iSkin\)/g, 'url(#vaSkin)').replace(/url\(#iSilk\)/g, 'url(#vaSilk)').replace(/#2a6ab8/g, '#e8f4f0').replace(/#123a6a/g, '#8aa8b0').replace(/#2a8ad8/g, '#2a9a6e');
}

function kalanemiDevasSheet() {
  const W = 1920, H = 1080;
  const card = (cy, inner, id, label, bg) => `<clipPath id="kd${id}"><rect x="1530" y="${cy - 120}" width="230" height="240" rx="14"/></clipPath>
    <rect x="1530" y="${cy - 120}" width="230" height="240" rx="14" fill="${bg}" stroke="#c8b894" stroke-width="2"/>
    <g clip-path="url(#kd${id})">${inner}</g>
    <text x="1645" y="${cy + 146}" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic" font-size="22" fill="#4a3a20">${label}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${A.defs()}${C.defs2()}${JL.defs}${RI.defs}${defs}
    <rect width="${W}" height="${H}" fill="#f4ecdc"/>
    <rect width="500" height="${H}" fill="#2a1424"/>
    <text x="250" y="62" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="40" fill="#c8a868">KALANEMI</text>
    ${kalanemi(250, 230, .78, { id: 'full' })}
    <rect x="500" y="0" width="460" height="${H}" fill="#3a1408"/>
    <text x="730" y="62" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="40" fill="#ffb24a">AGNI</text>
    ${agni(730, 240, .74, { id: 'full' })}
    <rect x="960" y="0" width="460" height="${H}" fill="#cfe2ee"/>
    <text x="1190" y="62" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="40" fill="#145a40">VAYU</text>
    ${vayu(1190, 220, .74, { id: 'full' })}
    ${card(190, kalanemi(1645, 70, 1.15, { id: 'c1', eyes: 'angry' }), 1, 'kalanemi · stern', '#2a1424')}
    ${card(520, agni(1645, 400, 1.1, { id: 'c2', eyes: 'wide', mouth: 'open' }), 2, 'agni · afraid (heaven falls)', '#3a1408')}
    ${card(850, vayu(1645, 730, 1.1, { id: 'c3', eyes: 'wide', mouth: 'open' }), 3, 'vayu · afraid (heaven falls)', '#cfe2ee')}
  </svg>`;
}

module.exports = { kalanemiDevasSheet, kalanemi, agni, vayu, defs };
