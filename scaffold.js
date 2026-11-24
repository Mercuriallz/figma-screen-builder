#!/usr/bin/env node
// Membuat kerangka proyek baru. Pakai: node scaffold.js <nama-proyek> --kit mobile|web
// Menyalin tema Workonix sebagai titik awal (GANTI sesuai proyekmu — lihat docs/THEME-CONFIG.md) + satu layar contoh.
const fs = require('fs'), path = require('path');
const name = process.argv[2]; const ki = process.argv.indexOf('--kit'); const kit = ki > 0 ? process.argv[ki + 1] : null;
if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name) || !['mobile', 'web'].includes(kit)) {
  console.error('Pakai: node scaffold.js <nama-proyek> --kit mobile|web   (nama: huruf kecil, angka, tanda minus)'); process.exit(1);
}
const root = __dirname, dir = path.join(root, 'projects', name);
if (fs.existsSync(dir)) { console.error('Sudah ada:', dir); process.exit(1); }
fs.mkdirSync(path.join(dir, 'screens'), { recursive: true });
const title = name.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
const runner = kit === 'mobile' ? 'single' : 'chunked';
fs.writeFileSync(path.join(dir, 'project.json'), JSON.stringify({ name: `${title} Builder`, id: `${name}-builder-dev`, kit, runner }, null, 2) + '\n');
const base = fs.readFileSync(path.join(root, 'projects', `workonix-${kit}`, 'theme.config.js'), 'utf8').replace(/^\/\*.*\*\/\n/, '');
fs.writeFileSync(path.join(dir, 'theme.config.js'), `/* THEME CONFIG — ${title}\n * TODO: ganti PALETTE (terang/gelap), TEXT_STYLES${kit === 'mobile' ? ', BOTTOM_NAV' : ', NAV, ROLE_META'} dengan nilai dari kode proyekmu.\n * Penjelasan field: docs/THEME-CONFIG.md. Nama token (kunci PALETTE) jangan diubah; ubah nilainya saja. */\n` + base);
const example = kit === 'mobile'
  ? `/* Contoh layar mobile. Ganti dengan layar proyekmu (lihat docs/WRITING-SCREENS.md). */
registerScreen({ key: 'contoh-beranda', group: 'Contoh', title: 'Beranda', build: async (th) => {
  const { f, body } = await phone('x', th, 'Beranda', { back: false });
  await sectionLabel('Ringkasan', th, body); gap(body, 8);
  const c = card(th, body, { gap: 8 });
  await txt('Halo dari kerangka baru', 'h2', 'color/text/primary', th, { parent: c });
  await txt('Ganti layar ini dengan layar aplikasimu.', 'caption', 'color/text/secondary', th, { parent: c });
  gap(body, 16); await button('Mulai', th, body);
  return f;
} });
flowStart('contoh-beranda', 'Contoh');
`
  : `/* Contoh halaman web. Ganti dengan halaman proyekmu (lihat docs/WRITING-SCREENS.md). */
registerScreen({ key: 'contoh-daftar', group: 'Contoh', title: 'Daftar', build: async (th) => {
  const role = Object.keys(NAV)[0]; const active = NAV[role][0].items[0].label;
  const { f, main } = await page('x', th, { role, active, h: 900 });
  const act = await pageHeader(th, main, 'Daftar', 'Contoh halaman'); await button('Tambah', th, act, { icon: 'plus' });
  await table(th, main, { cols: [{ t: 'Nama', w: 'fill' }, { t: 'Status', w: 140 }], rows: [['Satu', { chip: 'Aktif', color: 'success' }], ['Dua', { chip: 'Nonaktif', color: 'default' }]] });
  return f;
} });
`;
fs.writeFileSync(path.join(dir, 'screens/10-contoh.js'), example);
fs.writeFileSync(path.join(dir, 'README.md'), `# ${title} Builder\n\nProyek ${kit} (runner ${runner}). Bangun: \`node build.js ${name}\`; uji: \`node test.js ${name}\`${kit === 'web' ? `; rencana bagian: \`node plan.js ${name}\`` : ''}.\nLihat docs/NEW-PROJECT.md di root.\n`);
console.log(`Dibuat: projects/${name}  (kit ${kit}, runner ${runner})\nLangkah berikut: edit theme.config.js, tulis layar di screens/, lalu  node build.js ${name} && node test.js ${name}`);
