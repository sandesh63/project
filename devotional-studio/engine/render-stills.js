// Render style frames to PNG via the pre-installed Playwright Chromium.
// usage: node engine/render-stills.js <outDir> [scale] [framesModule]
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const frames = require(process.argv[4] ? require('path').resolve(process.argv[4]) : '../style-frames/frames.js');

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:ital,wght@0,500;1,500;1,600&display=swap" rel="stylesheet">`;

(async () => {
  const out = process.argv[2] || 'out';
  const scale = Number(process.argv[3] || 1);
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  for (const [name, fn] of Object.entries(frames)) {
    const svg = fn();
    const w = Number(svg.match(/width="(\d+)"/)[1]), h = Number(svg.match(/height="(\d+)"/)[1]);
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
    await page.setContent(`<!doctype html><html><head>${FONTS}<style>html,body{margin:0;background:#000}</style></head><body>${svg}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(out, `${name}.png`) });
    await page.close();
    console.log('rendered', name);
  }
  await browser.close();
})();
