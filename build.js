#!/usr/bin/env node
// Menggabungkan core + proyek menjadi satu code.js (yang dimuat Figma) dan menulis manifest.json.
// Pakai: node build.js <nama-proyek>        mis. node build.js workonix-web
const fs = require('fs'), path = require('path');
const name = process.argv[2];
if (!name) { console.error('Pakai: node build.js <nama-proyek>  (folder di projects/)'); process.exit(1); }
const root = __dirname, pdir = path.join(root, 'projects', name);
if (!fs.existsSync(pdir)) { console.error('Proyek tidak ditemukan:', pdir); process.exit(1); }
const cfg = JSON.parse(fs.readFileSync(path.join(pdir, 'project.json'), 'utf8'));
const screensDir = path.join(pdir, 'screens');
const screens = fs.existsSync(screensDir) ? fs.readdirSync(screensDir).filter((f) => f.endsWith('.js')).sort().map((f) => path.join(screensDir, f)) : [];
const planFile = path.join(pdir, 'plan.generated.js');
if (cfg.runner === 'chunked' && !fs.existsSync(planFile)) fs.writeFileSync(planFile, 'const CHUNK_PLAN = [];\n');
const parts = [
  path.join(pdir, 'theme.config.js'),
  path.join(root, 'core/kit-base.js'),
  path.join(root, `core/kit-${cfg.kit}.js`),
  ...screens,
  ...(cfg.runner === 'chunked' ? [planFile] : []),
  path.join(root, `core/runner-${cfg.runner}.js`),
];
const out = parts.map((f) => `\n/* ===== ${path.relative(root, f)} ===== */\n` + fs.readFileSync(f, 'utf8')).join('\n');
fs.writeFileSync(path.join(pdir, 'code.js'), out);
const mfPath = path.join(pdir, 'manifest.json');
const old = fs.existsSync(mfPath) ? JSON.parse(fs.readFileSync(mfPath, 'utf8')) : {};
const mf = { name: cfg.name, id: cfg.id, api: '1.0.0', main: 'code.js', editorType: ['figma'], documentAccess: 'dynamic-page', networkAccess: { allowedDomains: ['none'] }, ...(old.menu ? { menu: old.menu } : {}) };
fs.writeFileSync(mfPath, JSON.stringify(mf, null, 2) + '\n');
console.log(`${name}: code.js dari ${parts.length} berkas (${screens.length} modul layar), ${Math.round(out.length / 1024)} KB`);
