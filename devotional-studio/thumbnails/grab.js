// Caption-free frames from the Tulasi long video, by global time in the final MP4.
const path = require('path');
const DUR = [37.07, 8.28, 51.49, 41.40, 43.39, 40.91, 47.39, 55.88, 53.55, 35.71, 10.84, 24.76];
const mods = {};
function locate(g) {
  let t0 = 0;
  for (let i = 0; i < 12; i++) {
    const len = DUR[i] + 0.5;
    if (i === 1) t0 += 3; // logo after part 1
    if (g < t0 + len || i === 11) return { p: String(i + 1).padStart(2, '0'), t: Math.min(g - t0, DUR[i] - .05) };
    t0 += len;
  }
}
function frame(g) {
  const { p, t } = locate(g);
  const m = mods[p] || (mods[p] = require(path.join(__dirname, '../videos/tulasi-long/part' + p + '.js')));
  return m.frame(t).replace(/<rect y="860"[\s\S]*<\/svg>\s*$/, '</svg>');
}
// embed a 1920x1080 frame cropped to viewBox vb into box [x,y,w,h]
function crop(g, vb, box, extra = '') {
  return frame(g).replace(/^\s*<svg[^>]*>/, `<svg x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" viewBox="${vb.join(' ')}" preserveAspectRatio="xMidYMid slice" ${extra}>`);
}
module.exports = { frame, crop, locate };
