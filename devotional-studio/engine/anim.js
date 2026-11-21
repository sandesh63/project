// Animation helpers: easing, timing, particles, camera.
const A = require('./art.js');

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = {
  inOut: (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  out: (t) => 1 - Math.pow(1 - t, 3),
  in: (t) => t * t * t,
  sine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
};
// 0..1 progress of t inside [a,b], eased
const prog = (t, a, b, e = ease.inOut) => e(clamp((t - a) / (b - a)));
// fade in at [a, a+fi], fade out at [b-fo, b]
const fade = (t, a, b, fi = .4, fo = .4) => clamp(Math.min((t - a) / fi, (b - t) / fo));
// smooth pseudo-noise for flicker
const noise = (t, seed = 0) => Math.sin(t * 7.3 + seed) * .5 + Math.sin(t * 13.1 + seed * 2.1) * .3 + Math.sin(t * 23.7 + seed * 3.7) * .2;

// camera: zoom s around focus (fx,fy), plus pan (px,py)
const camera = (inner, W, H, { s = 1, fx = W / 2, fy = H / 2, px = 0, py = 0, rot = 0 } = {}) =>
  `<g transform="translate(${W / 2 + px},${H / 2 + py}) rotate(${rot}) scale(${s}) translate(${-fx},${-fy})">${inner}</g>`;

// falling marigold petals, deterministic, looping
function petalsAnim(seed, n, W, H, t, { speed = 60, op = .9, scale = 1 } = {}) {
  const r = A.rng(seed); let out = '';
  for (let i = 0; i < n; i++) {
    const x0 = r() * W, y0 = r() * H, sp = speed * (.6 + r() * .8), sw = 20 + r() * 40, ph = r() * 6.28, s = (.5 + r() * 1.1) * scale, spin = 40 + r() * 120;
    const c = r() < .7 ? '#f39a1e' : (r() < .5 ? '#d9600f' : '#e8344e');
    const y = ((y0 + t * sp) % (H + 60)) - 30, x = x0 + Math.sin(t * 1.3 + ph) * sw;
    const blur = s < .8 ? 'filter="url(#blur3)"' : '';
    out += `<path ${blur} transform="translate(${x},${y}) rotate(${ph * 57 + t * spin}) scale(${s},${s * (.6 + .4 * Math.abs(Math.sin(t * 2 + ph)))})" d="M0 -11 C 8 -8 9 6 0 11 C -9 6 -8 -8 0 -11Z" fill="${c}" opacity="${op}"/>`;
  }
  return out;
}

// rising embers / sparkles
function embersAnim(seed, n, W, H, t, { color = '#ffd27a', speed = 40, op = 1 } = {}) {
  const r = A.rng(seed); let out = '';
  for (let i = 0; i < n; i++) {
    const x0 = r() * W, y0 = r() * H, sp = speed * (.5 + r()), rr = .8 + r() * 2.6, ph = r() * 6.28;
    const y = H - ((H - y0 + t * sp) % (H + 20)), x = x0 + Math.sin(t * .9 + ph) * 18;
    const tw = .45 + .55 * Math.abs(Math.sin(t * 3 + ph));
    out += `<circle cx="${x}" cy="${y}" r="${rr}" fill="${color}" opacity="${(.35 + r() * .6) * tw * op}" filter="url(#glow)"/>`;
  }
  return out;
}

// caption with highlighted words: parts = [[text, highlight], ...]
function caption(W, H, parts, op, size = 50) {
  if (op <= 0) return '';
  const spans = parts.map(([t, hl]) => `<tspan fill="${hl ? '#ffd66b' : '#fff7ea'}" ${hl ? 'font-weight="700"' : ''}>${t}</tspan>`).join('');
  return `<g opacity="${op}">
    <text x="${W / 2}" y="${H - 78}" text-anchor="middle" font-family="Cinzel, serif" font-size="${size}" letter-spacing="3"
      style="paint-order:stroke" stroke="#140804" stroke-width="8" stroke-linejoin="round" transform="translate(0,${(1 - op) * 10})">${spans}</text></g>`;
}

module.exports = { clamp, lerp, ease, prog, fade, noise, camera, petalsAnim, embersAnim, caption };
