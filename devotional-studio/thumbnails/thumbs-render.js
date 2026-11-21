// Render thumbnails to JPG (YouTube limit 2 MB). usage: node thumbnails/thumbs-render.js <outDir> [nameFilter]
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const T = require('./thumbs.js');
const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Anton&family=Yatra+One&family=Cinzel+Decorative:wght@700;900&family=Kalam:wght@700&family=Baloo+2:wght@700;800&family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,500;1,500;1,600&display=swap" rel="stylesheet">`;
(async () => {
  const out = process.argv[2], filt = process.argv[3] || '';
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  for (const [name, fn] of Object.entries(T)) {
    if (!name.includes(filt)) continue;
    const svg = fn();
    const w = +svg.match(/width="(\d+)"/)[1], h = +svg.match(/height="(\d+)"/)[1];
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.setContent(`<!doctype html><html><head>${FONTS}<style>html,body{margin:0;background:#000}</style></head><body>${svg}</body></html>`);
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
    const png = path.join(out, name + '.png'); await page.screenshot({ path: png }); await page.close();
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', png, '-q:v', '2', path.join(out, name + '.jpg')]); fs.unlinkSync(png);
    console.log(name, (fs.statSync(path.join(out, name + '.jpg')).size / 1e6).toFixed(2) + 'MB');
  }
  await browser.close();
})();
