// render one still per shot (mid-point) into argv[2]
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright');
const m = require(require('path').resolve(process.argv[4] || 'videos/tulasi-short-v2/short.js'));
const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Noto+Serif+Devanagari:wght@600;800&display=swap" rel="stylesheet">`;
(async () => { const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: m.W, height: m.H } });
  await p.setContent(`<!doctype html><html><head>${FONTS}<style>body{margin:0}</style></head><body><div id=s></div></body></html>`); await p.evaluate(() => document.fonts.ready);
  const ts = process.argv[3] ? process.argv[3].split(',').map(Number) : m.SHOTS.map(s => +((s.a + s.b) / 2 + .2).toFixed(2));
  for (const [i, t] of ts.entries()) { await p.evaluate(s => document.getElementById('s').innerHTML = s, m.frame(t)); await p.waitForTimeout(60); await p.screenshot({ path: path.join(out, `s${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 80 }); }
  await b.close(); })();
