// Minimal CommonJS bundler for the film: inlines relative requires, shims fs/path with embedded files.
const fs = require('fs'), path = require('path');
const entry = path.resolve(process.argv[2]), out = process.argv[3];
const mods = {}, order = [];
function add(file) {
  if (mods[file]) return; mods[file] = true;
  let src = fs.readFileSync(file, 'utf8');
  src = src.replace(/require\(['"](\.{1,2}\/[^'"]+)['"]\)/g, (m, rel) => { let f = path.resolve(path.dirname(file), rel); if (!f.endsWith('.js')) f += '.js'; add(f); return `__req(${JSON.stringify(path.relative(path.dirname(entry), f))})`; });
  order.push([path.relative(path.dirname(entry), file), src]);
}
add(entry);
const embed = { 'grain.png': fs.readFileSync(path.resolve(path.dirname(entry), '../tulasi-preview/grain.png')).toString('base64'),
  'words.json': fs.readFileSync(path.resolve(path.dirname(entry), '../tulasi-short/words.json'), 'utf8') };
let js = `(function(){const __E=${JSON.stringify(embed)};
const __fs={existsSync:()=>true,readFileSync:(p,enc)=>{const k=p.split('/').pop();const v=__E[k];return enc?v:{toString:()=>v};}};
const __path={join:(...a)=>a.join('/')};
const __M={},__F={};function __req(k){if(k==='fs')return __fs;if(k==='path')return __path;if(__M[k])return __M[k].exports;const m={exports:{}};__M[k]=m;__F[k](m,m.exports,(x)=>__req(x));return m.exports;}\n`;
for (const [k, src] of order) js += `__F[${JSON.stringify(k)}]=function(module,exports,require){const __dirname='.';${src.replace(/require\(['"](fs|path)['"]\)/g, "__req('$1')").replace(/require\(['"]playwright['"]\)/g, '{}')}\n};\n`;
js += `window.FILM=__req(${JSON.stringify(path.basename(entry))});})();`;
fs.writeFileSync(out, js); console.log('bundle', (js.length / 1024).toFixed(0) + ' KB', order.length, 'modules');
