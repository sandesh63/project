// Render an animation module (exports W,H,FPS,DURATION,frame(t)) to JPEG frames with parallel Playwright pages.
// usage: node engine/render-video.js <module.js> <framesDir> [--from s] [--to s] [--workers n] [--step k]
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const mod = require(path.resolve(args[0]));
const outDir = path.resolve(args[1]);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? Number(args[i + 1]) : d; };
const from = opt('from', 0), to = opt('to', mod.DURATION), workers = opt('workers', 4), step = opt('step', 1);

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:ital,wght@0,500;1,500;1,600&display=swap" rel="stylesheet">`;

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const frames = [];
  for (let f = Math.round(from * mod.FPS); f < Math.round(to * mod.FPS); f += step) frames.push(f);
  const browser = await chromium.launch();
  let next = 0, done = 0; const t0 = Date.now();
  const work = async () => {
    const page = await browser.newPage({ viewport: { width: mod.W, height: mod.H } });
    await page.setContent(`<!doctype html><html><head>${FONTS}<style>html,body{margin:0;background:#000;overflow:hidden}</style></head><body><div id="s"></div></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    while (next < frames.length) {
      const f = frames[next++];
      const svg = mod.frame(f / mod.FPS);
      await page.evaluate((s) => { document.getElementById('s').innerHTML = s; }, svg);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(outDir, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
      done++;
      if (done % 30 === 0) console.log(`${done}/${frames.length} frames  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    await page.close();
  };
  await Promise.all([...Array(workers)].map(work));
  await browser.close();
  console.log(`done ${done} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
})();
