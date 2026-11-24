#!/usr/bin/env node
// Untuk proyek runner "chunked": ukur simpul per layar di mock, kemas jadi bagian <= BUDGET simpul per kelompok,
// tulis projects/<p>/plan.generated.js + menu manifest.json. Pakai: node plan.js <proyek>   (BUDGET=12000 bawaan)
const fs = require('fs'), vm = require('vm'), path = require('path'), cp = require('child_process');
const name = process.argv[2]; const BUDGET = Number(process.env.BUDGET || 12000);
if (!name) { console.error('Pakai: node plan.js <proyek>'); process.exit(1); }
const pdir = path.join(__dirname, 'projects', name);
fs.writeFileSync(path.join(pdir, 'plan.generated.js'), 'const CHUNK_PLAN = [];\n');
cp.execSync(`node build.js ${name}`, { cwd: __dirname, stdio: 'ignore' });
const { figma, reset, mkPage } = require('./core/test/mock-figma');
reset(); mkPage('Screens'); mkPage('Flows');
const code = fs.readFileSync(path.join(pdir, 'code.js'), 'utf8').replace(/\nmain\(\)\.then[\s\S]*$/, '');
const ctx = vm.createContext({ figma, console, setTimeout, Promise });
vm.runInContext(code, ctx);
const count = (n) => 1 + n.children.reduce((a, c) => a + count(c), 0);
(async () => {
  await vm.runInContext('ensureFoundations()', ctx);
  const reg = vm.runInContext('REGISTRY', ctx); const info = [];
  for (const def of reg) {
    let nodes = 0;
    for (const th of ['light', 'dark']) { vm.runInContext(`CURRENT = { key: ${JSON.stringify(def.key)}, theme: ${JSON.stringify(th)} }`, ctx); const f = await def.build(th); nodes += count(f); f.remove(); }
    info.push({ key: def.key, group: def.group, nodes });
  }
  const groups = []; for (const i of info) { let g = groups.find((x) => x.name === i.group); if (!g) groups.push(g = { name: i.group, items: [] }); g.items.push(i); }
  const plan = [];
  for (const g of groups) {
    const total = g.items.reduce((a, b) => a + b.nodes, 0); const parts = Math.max(1, Math.ceil(total / BUDGET)); const target = total / parts;
    let cur = [], sum = 0; const chunks = [];
    for (const it of g.items) { if (cur.length && sum + it.nodes > target * 1.15 && chunks.length < parts - 1) { chunks.push(cur); cur = []; sum = 0; } cur.push(it); sum += it.nodes; }
    if (cur.length) chunks.push(cur);
    chunks.forEach((c, k) => plan.push({ name: g.name + (chunks.length > 1 ? ` (${k + 1}/${chunks.length})` : ''), keys: c.map((x) => x.key), nodes: c.reduce((a, b) => a + b.nodes, 0) }));
  }
  fs.writeFileSync(path.join(pdir, 'plan.generated.js'), 'const CHUNK_PLAN = ' + JSON.stringify(plan) + ';\n');
  const mfPath = path.join(pdir, 'manifest.json'); const mf = JSON.parse(fs.readFileSync(mfPath, 'utf8'));
  mf.menu = [...plan.map((c, i) => ({ name: `${String(i + 1).padStart(2, '0')}. ${c.name} — ${c.keys.length} layar`, command: `chunk-${i}` })), { separator: true }, { name: 'Semua sekaligus (SANGAT berat — jangan)', command: 'all' }];
  fs.writeFileSync(mfPath, JSON.stringify(mf, null, 2) + '\n');
  cp.execSync(`node build.js ${name}`, { cwd: __dirname, stdio: 'ignore' });
  console.log('bagian:', plan.length, '| total simpul:', info.reduce((a, b) => a + b.nodes, 0));
  plan.forEach((c, i) => console.log(String(i + 1).padStart(2), c.name.padEnd(34), String(c.keys.length).padStart(3), 'layar', String(c.nodes).padStart(7), 'simpul'));
})();
