#!/usr/bin/env node
// Menjalankan code.js proyek terhadap mock API Figma. Pakai: node test.js <proyek> [chunk-N|all]   (atau env CMD)
const fs = require('fs'), vm = require('vm'), path = require('path');
const name = process.argv[2]; const cmd = process.argv[3] || process.env.CMD;
if (!name) { console.error('Pakai: node test.js <proyek> [chunk-N|all]'); process.exit(1); }
const { figma, state, reset, mkPage } = require('./core/test/mock-figma');
reset(); mkPage('Screens'); mkPage('Flows');
if (cmd) { figma.command = cmd; if (figma.command !== cmd) { console.error('Mock tidak menerima figma.command — perbaiki core/test/mock-figma.js'); process.exit(2); } }
const code = fs.readFileSync(path.join(__dirname, 'projects', name, 'code.js'), 'utf8');
const ctx = vm.createContext({ figma, console, setTimeout, Promise });
vm.runInContext(code, ctx, { filename: 'code.js' });
const count = (n) => 1 + n.children.reduce((a, c) => a + count(c), 0);
const done = (n) => (state.closed || n <= 0) ? finish() : setTimeout(() => done(n - 1), 100);
function finish() {
  const screens = state.pages.find((p) => p.name === 'Screens'), flows = state.pages.find((p) => p.name === 'Flows');
  console.log('closePlugin :', state.closed);
  console.log('Screens     :', screens.children.map((c) => `${c.type}:${c.name}(${c.children.length})`).join(' | '));
  console.log('simpul      :', count(screens));
  const log = flows.children.find((c) => c.name === 'WX Build log');
  if (log) { console.log('\n--- BUILD LOG ---\n' + log.characters); process.exitCode = 1; }
  const stray = screens.children.filter((c) => c.type !== 'SECTION');
  if (stray.length) { console.log('\nSIMPUL LEPAS di halaman Screens:', stray.map((s) => s.name).join(', ')); process.exitCode = 1; }
  if (!state.closed || state.closed.startsWith('GAGAL')) process.exitCode = 1;
}
done(600);
