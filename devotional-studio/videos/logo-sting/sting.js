// Divine Stories Studio — 3 s logo sting. Uses the channel's own logo artwork, animated in code.
// Orientation via env STING=wide (1920x1080, default) or STING=tall (1080x1920).
const fs = require('fs');
const path = require('path');
const A = require('../../engine/art.js');
const N = require('../../engine/anim.js');
const { clamp, lerp, ease, prog } = N;

const TALL = process.env.STING === 'tall';
const W = TALL ? 1080 : 1920, H = TALL ? 1920 : 1080, FPS = 30, DURATION = 3;
const LOGO = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'logo.jpg')).toString('base64');
// logo geometry (measured): image 1254 px, ring centre (610,608), ring radius ~575
const IMG = 1254, LCX = 610, LCY = 608, LR = 590;
const CX = W / 2, CY = TALL ? 860 : 490, R = TALL ? 440 : 380;   // on-screen circle
const S = R / LR;
const RR = 576 * S;   // radius of the logo's own gold ring on screen

function frame(t) {
  const ring = prog(t, .12, 1.0, ease.inOut);
  const reveal = prog(t, .7, 1.35, ease.out);
  const zoom = lerp(1.07, 1, prog(t, .7, 2.4, ease.out));
  const flash = clamp(1 - Math.abs(t - 1.02) / .22) * .8;
  const sweep = prog(t, 1.45, 2.25, ease.inOut);
  const studio = prog(t, 1.55, 2.35, ease.out);
  const halo = prog(t, .8, 1.6) * (.75 + .25 * Math.sin(t * 5));
  const endFade = prog(t, 2.8, 3.0);
  const ang = -Math.PI / 2 + ring * Math.PI * 2;
  const sx = CX + Math.cos(ang) * RR, sy = CY + Math.sin(ang) * RR;

  // burst of sparks outward from the ring at the reveal
  let burst = '';
  const bp = prog(t, 1.0, 2.0, ease.out);
  if (t > 1.0 && t < 2.1) {
    const r = A.rng(42);
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2, d = R * (1 + bp * (.25 + r() * .5)), sz = 1 + r() * 3;
      burst += `<circle cx="${CX + Math.cos(a) * d}" cy="${CY + Math.sin(a) * d}" r="${sz * (1 - bp * .6)}" fill="#ffe7a0" opacity="${(1 - bp) * (.5 + r() * .5)}" filter="url(#glow)"/>`;
    }
  }
  const sweepX = lerp(-R * 1.6, R * 1.6, sweep);
  const sp = TALL ? 30 : 26;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${A.defs()}
    <defs>
      <radialGradient id="bgS" cx=".5" cy="${CY / H}" r=".8"><stop offset="0" stop-color="#2a1630"/><stop offset=".5" stop-color="#140c22"/><stop offset="1" stop-color="#05040a"/></radialGradient>
      <clipPath id="reveal"><circle cx="${CX}" cy="${CY}" r="${Math.max(.01, R * 1.02 * reveal)}"/></clipPath>
      <clipPath id="disc"><circle cx="${CX}" cy="${CY}" r="${R}"/></clipPath>
      <linearGradient id="sweepG" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff6d8" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1b8"/><stop offset=".4" stop-color="#f2c14e"/><stop offset=".7" stop-color="#fff7d0"/><stop offset="1" stop-color="#c8891f"/></linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bgS)"/>
    ${N.embersAnim(3, 60, W, H, t, { speed: 50, op: .8 })}
    <circle cx="${CX}" cy="${CY}" r="${R * 1.45}" fill="url(#lampGlow)" opacity="${halo * .7}"/>
    <g transform="translate(${CX},${CY}) scale(${zoom}) translate(${-CX},${-CY})">
      <g clip-path="url(#reveal)">
        <image href="${LOGO}" x="${CX - LCX * S}" y="${CY - LCY * S}" width="${IMG * S}" height="${IMG * S}" clip-path="url(#disc)"/>
        <g clip-path="url(#disc)"><rect x="${CX + sweepX - R * .35}" y="${CY - R}" width="${R * .7}" height="${R * 2}" fill="url(#sweepG)" transform="rotate(20 ${CX} ${CY})" opacity="${sweep > 0 && sweep < 1 ? 1 : 0}" style="mix-blend-mode:screen"/></g>
      </g>
      <circle cx="${CX}" cy="${CY}" r="${R}" fill="#fff8e6" opacity="${flash}" clip-path="url(#disc)"/>
      <circle cx="${CX}" cy="${CY}" r="${RR}" fill="none" stroke="url(#ringG)" stroke-width="${TALL ? 12 : 10}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - ring}" transform="rotate(-90 ${CX} ${CY})" filter="url(#glow)"/>
    </g>
    ${ring > 0 && ring < 1 ? `<circle cx="${sx}" cy="${sy}" r="9" fill="#fffbe6" filter="url(#glow)"/><circle cx="${sx}" cy="${sy}" r="40" fill="url(#lampGlow)"/>` : ''}
    ${burst}
    <g opacity="${studio}">
      <path d="M${CX - 330} ${CY + R + (TALL ? 120 : 92)} L ${CX - 200} ${CY + R + (TALL ? 120 : 92)}" stroke="#e8b44a" stroke-width="2.5" transform="translate(${(1 - studio) * 40},0)"/>
      <path d="M${CX + 200} ${CY + R + (TALL ? 120 : 92)} L ${CX + 330} ${CY + R + (TALL ? 120 : 92)}" stroke="#e8b44a" stroke-width="2.5" transform="translate(${-(1 - studio) * 40},0)"/>
      <text x="${CX}" y="${CY + R + (TALL ? 134 : 104)}" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="${TALL ? 54 : 48}"
        letter-spacing="${lerp(sp * 2.2, sp, studio)}" fill="url(#goldV)" filter="url(#glow)">STUDIO</text>
    </g>
    <rect width="${W}" height="${H}" fill="url(#vignette)"/>
    <rect width="${W}" height="${H}" fill="#000" opacity="${endFade}"/>
  </svg>`;
}

module.exports = { W, H, FPS, DURATION, frame };
