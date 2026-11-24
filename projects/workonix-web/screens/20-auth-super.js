/* =====================================================================
 * Auth dan Super Admin — login, set/ganti kata sandi, privasi, dan panel Super Admin (prefiks wa / WA_)
 * Sumber: app/login, set-password, change-password, privacy, (dashboard)/{dashboard,groups,groups/[id],groups/new,plans},
 *         components/GroupStatusBanner.tsx, UsagePanel.tsx
 * ===================================================================== */
const WA_GROUP = 'Auth dan Super Admin';

registerIcons({
  'wa-eyeoff': '<path d="M3 3l18 18M10.6 5.1A9.6 9.6 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6C3.6 8.4 2 12 2 12s4 7 10 7c1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  'wa-bolt': '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  'wa-chart': '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8"/>',
  'wa-pause': '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
  'wa-play': '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/>',
  'wa-cancel': '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  'wa-minus': '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  'wa-arrow': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'wa-premium': '<circle cx="12" cy="9" r="5"/><path d="M9 13.5L7 21l5-3 5 3-2-7.5"/>',
});

/* ---------- Pembantu umum ---------- */
function waCol(th, parent, w, gap, name) {
  const c = box(name ?? 'col', { dir: 'V', gap: gap ?? 0, theme: th, parent });
  c.resize(w, 100); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
  return c;
}
function waDivider(th, parent) { const d = box('divider', { theme: th, parent, fixed: [10, 1], fill: 'color/border' }); d.layoutSizingHorizontal = 'FILL'; return d; }
function waBar(th, parent, w, ratio, color) {
  const b = box('LinearProgress', { dir: 'H', theme: th, parent, fixed: [w, 6], fill: 'color/border', radius: 3, clip: true });
  const r = figma.createRectangle(); r.name = 'bar'; r.resize(Math.max(1, Math.round(w * ratio)), 6); r.fills = [pv(th, color)]; b.appendChild(r);
  return b;
}
async function waLogo(th, parent, dark) {
  const row = box('Logo', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent });
  const m = box('mark', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 9, theme: th, parent: row, fixed: [36, 36], fill: dark ? null : 'color/primary' });
  if (dark) m.fills = [WHITE_PAINT];
  await txt('W', 'subtitle', dark ? 'color/primary' : onPrimary(th), th, { parent: m });
  await txt('workonix', 'h6', dark ? 'white' : 'color/text/primary', th, { parent: row });
  return row;
}
function waSpin(th, parent) { return icon('refresh', 28, 'color/primary', th, parent); }

/* ---------- Login ---------- */
const WA_HIGHLIGHTS = [
  ['wa-bolt', 'Absensi langsung tercatat', 'Pantau kehadiran tim dari mana saja.'],
  ['wa-chart', 'Laporan otomatis', 'Rekap cuti, lembur, dan payroll tanpa hitung manual.'],
  ['shield', 'Data aman', 'Data HR tersimpan aman dan terenkripsi.'],
];
async function waLogin(th, o = {}) {
  const { f, main } = await page('x', th, { noShell: true, h: 900 });
  main.paddingTop = main.paddingBottom = main.paddingLeft = main.paddingRight = 0; main.itemSpacing = 0; main.primaryAxisAlignItems = 'MIN'; main.counterAxisAlignItems = 'MIN';
  const row = box('login', { dir: 'H', theme: th, parent: main, fillW: true }); row.layoutSizingVertical = 'FILL';
  // Panel kiri (branding)
  const left = box('Panel branding', { dir: 'V', ax: 'SPACE_BETWEEN', pad: 48, fill: 'color/sidebar', theme: th, parent: row, fixed: [560, 900], clip: true });
  left.layoutSizingVertical = 'FILL';
  await waLogo(th, left, true);
  const mid = box('copy', { dir: 'V', gap: 32, theme: th, parent: left, fillW: true });
  const hd = box('headline', { dir: 'V', gap: 12, theme: th, parent: mid, fillW: true });
  await txt('Urusan HR jadi lebih gampang.', 'h4', 'white', th, { parent: hd, fillW: true });
  (await txt('Absensi, cuti, lembur, payroll, dan laporannya ada di satu tempat.', 'body', 'white', th, { parent: hd, fillW: true })).opacity = 0.75;
  const hl = box('highlights', { dir: 'V', gap: 20, theme: th, parent: mid, fillW: true });
  for (const [ic, title, desc] of WA_HIGHLIGHTS) {
    const r = box('highlight', { dir: 'H', gap: 16, ay: 'MIN', theme: th, parent: hl, fillW: true });
    const ib = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 8, theme: th, parent: r, fixed: [40, 40] }); ib.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.12 }];
    icon(ic, 20, 'white', th, ib);
    const t = box('text', { dir: 'V', gap: 2, theme: th, parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
    await txt(title, 'body-strong' in TEXT_STYLES ? 'body-strong' : 'subtitle', 'white', th, { parent: t, fillW: true });
    (await txt(desc, 'body2', 'white', th, { parent: t, fillW: true })).opacity = 0.7;
  }
  (await txt('© 2026 Workonix. Semua hak dilindungi.', 'body2', 'white', th, { parent: left })).opacity = 0.5;
  // Panel kanan (form)
  const right = box('Panel form', { dir: 'V', ax: 'CENTER', ay: 'CENTER', pad: 48, theme: th, parent: row }); right.layoutGrow = 1; right.layoutSizingHorizontal = 'FILL'; right.layoutSizingVertical = 'FILL';
  const col = waCol(th, right, 380, 0, 'form');
  const ttl = box('titles', { dir: 'V', gap: 6, pad: [0, 0, 32, 0], theme: th, parent: col, fillW: true });
  await txt('Selamat datang', 'h5', 'color/text/primary', th, { parent: ttl });
  await txt('Masuk untuk melanjutkan', 'body2', 'color/text/secondary', th, { parent: ttl });
  const form = box('Stack', { dir: 'V', gap: 18, theme: th, parent: col, fillW: true });
  if (o.error) await alertBox('error', o.error, th, form);
  await inputField('Email kantor atau pribadi', o.email ?? '', th, form, { icon: 'mail', required: true, focus: !o.error && !o.email, error: false });
  await inputField('Kata Sandi', o.pw ?? '', th, form, { icon: 'lock', endIcon: 'eye', required: true });
  const btn = box('submit', { dir: 'V', pad: [8, 0, 0, 0], theme: th, parent: form, fillW: true });
  await button(o.submitting ? 'Memproses...' : 'Masuk', th, btn, { size: 'large', fillW: true, disabled: !!o.submitting });
  return f;
}
registerScreen({ key: 'login', group: WA_GROUP, title: 'Login', build: (th) => waLogin(th) });
registerScreen({ key: 'login-galat', group: WA_GROUP, title: 'Login galat 401', build: (th) => waLogin(th, { email: 'budi.santoso@perusahaan.co.id', pw: '••••••••', error: 'Email atau kata sandi salah' }) });
registerScreen({ key: 'login-galat-429', group: WA_GROUP, title: 'Login galat 429', build: (th) => waLogin(th, { email: 'budi.santoso@perusahaan.co.id', pw: '••••••••', error: 'Terlalu banyak percobaan masuk untuk akun ini. Coba lagi dalam 15 menit.' }) });
registerScreen({ key: 'login-memproses', group: WA_GROUP, title: 'Login memproses', build: (th) => waLogin(th, { email: 'budi.santoso@perusahaan.co.id', pw: '••••••••', submitting: true }) });

/* ---------- Set / ganti kata sandi ---------- */
async function waPassCard(th, f, main, o) {
  const c = box('Card', { dir: 'V', gap: 0, pad: 36, fill: 'color/surface', stroke: 'color/border', radius: 12, theme: th, parent: main });
  c.resize(440, 100); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
  return c;
}
async function waPassHead(th, parent, title, sub) {
  const h = box('header', { dir: 'V', gap: 12, ay: 'CENTER', pad: [0, 0, 24, 0], theme: th, parent, fillW: true });
  const av = box('Avatar', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary', radius: 999, theme: th, parent: h, fixed: [48, 48] });
  icon('lock', 24, onPrimary(th), th, av);
  const t = box('text', { dir: 'V', gap: 4, ay: 'CENTER', theme: th, parent: h, fillW: true });
  await txt(title, 'h6', 'color/text/primary', th, { parent: t, fillW: true, align: 'CENTER' });
  await txt(sub, 'body2', 'color/text/secondary', th, { parent: t, fillW: true, align: 'CENTER' });
}
async function waSetPassword(th, o = {}) {
  const { f, main } = await page('x', th, { noShell: true, h: 900 });
  f.fills = [pv(th, 'color/success')]; // pendekatan gradien hijau di kode asli
  const c = await waPassCard(th, f, main);
  await waPassHead(th, c, 'Halo, Budi Santoso', 'Buat kata sandi untuk akun budi.santoso@perusahaan.co.id');
  const form = box('Stack', { dir: 'V', gap: 18, theme: th, parent: c, fillW: true });
  if (o.error) await alertBox('error', o.error, th, form);
  await inputField('Kata sandi baru', o.pw ?? '', th, form, { icon: 'lock', required: true, helper: 'Minimal 8 karakter', focus: !o.error && !o.pw });
  await inputField('Ulangi kata sandi', o.confirm ?? '', th, form, { required: true });
  const b = box('submit', { dir: 'V', pad: [8, 0, 0, 0], theme: th, parent: form, fillW: true });
  await button(o.submitting ? 'Menyimpan...' : 'Buat Kata Sandi & Masuk', th, b, { size: 'large', fillW: true, disabled: !!o.submitting });
  return f;
}
registerScreen({ key: 'set-password', group: WA_GROUP, title: 'Buat kata sandi (undangan)', build: (th) => waSetPassword(th) });
registerScreen({ key: 'set-password-galat', group: WA_GROUP, title: 'Buat kata sandi galat pendek', build: (th) => waSetPassword(th, { pw: '••••', confirm: '••••', error: 'Kata sandi minimal 8 karakter.' }) });
registerScreen({ key: 'set-password-galat-beda', group: WA_GROUP, title: 'Buat kata sandi galat tidak sama', build: (th) => waSetPassword(th, { pw: '••••••••••', confirm: '•••••••••', error: 'Kata sandi yang diulang tidak sama.' }) });
registerScreen({ key: 'set-password-tautan-galat', group: WA_GROUP, title: 'Buat kata sandi tautan mati', build: async (th) => {
  const { f, main } = await page('x', th, { noShell: true, h: 900 });
  f.fills = [pv(th, 'color/success')];
  const c = await waPassCard(th, f, main);
  const g = box('stack', { dir: 'V', gap: 20, theme: th, parent: c, fillW: true });
  await alertBox('error', 'Tautan tidak lengkap. Buka lagi tautan dari email.', th, g);
  await txt('Tautan undangan berlaku 24 jam dan cuma bisa dipakai sekali. Minta HR kirim undangan baru.', 'body2', 'color/text/secondary', th, { parent: g, fillW: true });
  await button('Ke Halaman Masuk', th, g, { v: 'outlined', fillW: true });
  return f;
} });
async function waChangePassword(th, o = {}) {
  const { f, main } = await page('x', th, { noShell: true, h: 900 });
  const c = await waPassCard(th, f, main);
  await waPassHead(th, c, 'Ganti Kata Sandi', 'Kata sandi sementara dari HR perlu diganti dulu sebelum memakai aplikasi.');
  const form = box('Stack', { dir: 'V', gap: 18, theme: th, parent: c, fillW: true });
  if (o.error) await alertBox('error', o.error, th, form);
  await inputField('Kata sandi sementara', o.cur ?? '', th, form, { icon: 'lock', required: true, focus: !o.error && !o.cur });
  await inputField('Kata sandi baru', o.pw ?? '', th, form, { required: true, helper: 'Minimal 8 karakter' });
  await inputField('Ulangi kata sandi baru', o.confirm ?? '', th, form, { required: true });
  const b = box('submit', { dir: 'V', gap: 8, pad: [8, 0, 0, 0], theme: th, parent: form, fillW: true });
  await button(o.submitting ? 'Menyimpan...' : 'Simpan Kata Sandi', th, b, { size: 'large', fillW: true, disabled: !!o.submitting });
  const out = box('keluar', { dir: 'H', ax: 'CENTER', theme: th, parent: b, fillW: true });
  await button('Keluar', th, out, { v: 'text', color: 'default', size: 'small' });
  return f;
}
registerScreen({ key: 'change-password', group: WA_GROUP, title: 'Ganti kata sandi', build: (th) => waChangePassword(th) });
registerScreen({ key: 'change-password-galat', group: WA_GROUP, title: 'Ganti kata sandi galat pendek', build: (th) => waChangePassword(th, { cur: '••••••••', pw: '•••', confirm: '•••', error: 'Kata sandi baru minimal 8 karakter.' }) });
registerScreen({ key: 'change-password-galat-sama', group: WA_GROUP, title: 'Ganti kata sandi galat sama', build: (th) => waChangePassword(th, { cur: '••••••••••', pw: '••••••••••', confirm: '••••••••••', error: 'Kata sandi baru harus beda dari kata sandi sementara.' }) });
registerScreen({ key: 'change-password-galat-beda', group: WA_GROUP, title: 'Ganti kata sandi galat tidak sama', build: (th) => waChangePassword(th, { cur: '••••••••', pw: '••••••••••', confirm: '•••••••••', error: 'Kata sandi yang diulang tidak sama.' }) });

/* ---------- Kebijakan privasi ---------- */
async function waPrivBase(th, h) {
  const { f, main } = await page('x', th, { noShell: true, h });
  main.primaryAxisAlignItems = 'MIN'; main.paddingTop = 48; main.itemSpacing = 0;
  const wrap = waCol(th, main, 852, 0, 'Container');
  return { f, wrap };
}
async function waSection(th, parent, title) {
  const s = box('Section', { dir: 'V', gap: 12, pad: [32, 0, 0, 0], theme: th, parent, fillW: true });
  await txt(title, 'h6', 'color/text/primary', th, { parent: s, fillW: true });
  return s;
}
async function waP(th, parent, str) { return txt(str, 'body', 'color/text/primary', th, { parent, fillW: true }); }
async function waList(th, parent, items, ordered) {
  const l = box('List', { dir: 'V', gap: 6, pad: [0, 0, 0, 8], theme: th, parent, fillW: true });
  for (const [i, it] of items.entries()) {
    const r = box('item', { dir: 'H', gap: 8, ay: 'MIN', theme: th, parent: l, fillW: true });
    await txt(ordered ? `${i + 1}.` : '•', 'body', 'color/text/primary', th, { parent: r });
    await txt(it, 'body', 'color/text/primary', th, { parent: r, fillW: true });
  }
}
async function waDataTable(th, parent, head, rows, widths) {
  const t = box('Table', { dir: 'V', theme: th, parent, fillW: true, stroke: 'color/border', radius: 8, clip: true });
  const mk = async (cells, isHead) => {
    const r = box(isHead ? 'thead' : 'row', { dir: 'H', ay: 'MIN', pad: [10, 12, 10, 12], theme: th, parent: t, fillW: true, stroke: 'color/border' });
    r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; if (isHead) r.fills = [pv(th, 'color/background')];
    for (const [i, c] of cells.entries()) { const cell = box('cell', { dir: 'V', theme: th, parent: r, pad: [0, 8, 0, 0] }); await txt(c, isHead ? 'body2-strong' : 'body2', 'color/text/primary', th, { parent: cell, w: widths[i] - 8 }); cell.resize(widths[i], cell.height); cell.primaryAxisSizingMode = 'AUTO'; cell.counterAxisSizingMode = 'FIXED'; }
  };
  await mk(head, true); for (const r of rows) await mk(r, false);
}
registerScreen({ key: 'privacy', group: WA_GROUP, title: 'Kebijakan privasi (atas)', build: async (th) => {
  const { f, wrap } = await waPrivBase(th, 1700);
  await waLogo(th, wrap, false);
  const hd = box('title', { dir: 'V', gap: 8, pad: [32, 0, 0, 0], theme: th, parent: wrap, fillW: true });
  await txt('Kebijakan Privasi Workonix', 'h4', 'color/text/primary', th, { parent: hd, fillW: true });
  await txt('Berlaku sejak 18 November 2026', 'body2', 'color/text/secondary', th, { parent: hd });
  let s = await waSection(th, wrap, '1. Tentang kebijakan ini');
  await waP(th, s, 'Workonix adalah aplikasi absensi dan HR untuk karyawan perusahaan yang berlangganan Workonix. Aplikasi ini dikelola oleh PT Contoh Perusahaan ("kami").');
  await waP(th, s, 'Akun Anda dibuat oleh perusahaan tempat Anda bekerja ("Perusahaan"). Perusahaan menentukan data apa yang dipakai dan untuk apa, misalnya apakah verifikasi wajah dinyalakan. Kami memproses data atas nama Perusahaan, sesuai Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).');
  await waP(th, s, 'Kebijakan ini berlaku untuk aplikasi Workonix di Android dan iOS.');
  s = await waSection(th, wrap, '2. Data yang kami kumpulkan');
  await waP(th, s, 'Kami hanya mengumpulkan data yang diperlukan untuk absensi dan administrasi HR. Sebagian besar data kepegawaian dimasukkan oleh HR Perusahaan, bukan oleh aplikasi.');
  await waDataTable(th, s, ['Jenis data', 'Contoh', 'Sumber'], [
    ['Identitas dan kepegawaian', 'Nama lengkap, nomor karyawan, email kerja, jabatan, departemen, atasan, tanggal bergabung, status kontrak', 'HR Perusahaan'],
    ['Akun', 'Email untuk masuk, kata sandi (disimpan dalam bentuk hash)', 'HR Perusahaan, Anda'],
    ['Perangkat', 'ID perangkat buatan aplikasi, merek dan model HP, sistem operasi, waktu terakhir aktif', 'Aplikasi'],
    ['Lokasi', 'Koordinat, tingkat akurasi, dan penanda lokasi palsu saat clock in, clock out, atau pengajuan koreksi absensi', 'Aplikasi'],
    ['Data wajah', 'Representasi numerik wajah (embedding), versi model, waktu pendaftaran dan persetujuan; skor kemiripan setiap absensi', 'Aplikasi'],
    ['Foto', 'Foto profil, swafoto pengajuan koreksi absensi, foto lampiran cuti dan lembur', 'Anda'],
  ], [200, 452, 200]);
  await waP(th, s, 'Kami tidak mengumpulkan kontak, riwayat penelusuran, atau data iklan, dan tidak melacak Anda di aplikasi atau situs lain.');
  s = await waSection(th, wrap, '3. Data wajah');
  await waP(th, s, 'Verifikasi wajah hanya aktif jika Perusahaan menyalakannya, dan hanya setelah Anda memberi persetujuan.');
  await waList(th, s, ['Foto wajah tidak dikirim. Foto dari kamera diolah di HP Anda menjadi embedding.', 'Yang dikirim dan disimpan hanya embedding. Kami tidak menyimpan foto wajah.']);
  return f;
} });
registerScreen({ key: 'privacy-bawah', group: WA_GROUP, title: 'Kebijakan privasi (bawah)', build: async (th) => {
  const { f, wrap } = await waPrivBase(th, 1500);
  let s = await waSection(th, wrap, '5. Untuk apa data dipakai');
  await waP(th, s, 'Data Anda hanya dipakai untuk menjalankan fungsi aplikasi, bukan untuk iklan, profil pemasaran, atau dijual.');
  await waList(th, s, ['Mencatat kehadiran: jam masuk dan pulang, keterlambatan, lembur.', 'Memastikan absensi sah: verifikasi lokasi, verifikasi wajah, dan perangkat terdaftar, untuk mencegah titip absen.', 'Memproses pengajuan cuti, lembur, tukar shift, dan koreksi absensi, termasuk alur persetujuan atasan.', 'Mengirim notifikasi, misalnya pengajuan yang menunggu persetujuan atau keputusan atas pengajuan Anda.', 'Menyediakan rekap kehadiran bagi HR Perusahaan, termasuk penanda absensi yang perlu ditinjau.', 'Menjaga keamanan akun dan menyelidiki penyalahgunaan.'], true);
  s = await waSection(th, wrap, '6. Dengan siapa data dibagikan');
  await waP(th, s, 'Kami tidak menjual data Anda. Data hanya dibagikan kepada pihak berikut, sebatas yang diperlukan.');
  await waDataTable(th, s, ['Pihak', 'Data yang diterima', 'Keperluan'], [
    ['Perusahaan Anda (HR dan atasan)', 'Data kepegawaian, absensi, lokasi absen, skor kemiripan wajah, pengajuan dan lampirannya', 'Administrasi HR dan persetujuan'],
    ['OneSignal, Inc. (Amerika Serikat)', 'Token notifikasi, ID langganan, jenis perangkat, isi notifikasi', 'Mengirim notifikasi push'],
  ], [240, 400, 212]);
  s = await waSection(th, wrap, '8. Hak Anda');
  await waP(th, s, 'Sesuai UU PDP, Anda berhak atas data pribadi Anda. Ajukan permintaan ke HR Perusahaan atau ke kontak di bawah.');
  await waList(th, s, ['Mengakses data Anda dan mendapat salinannya.', 'Memperbaiki data yang salah atau tidak lengkap.', 'Menarik persetujuan verifikasi wajah. Data wajah Anda akan dihapus.', 'Meminta penghapusan data, kecuali data yang wajib disimpan menurut hukum.', 'Membatasi atau menolak pemrosesan tertentu, termasuk mencabut izin kamera, lokasi, dan notifikasi di pengaturan HP.', 'Mengajukan keberatan kepada lembaga pengawas pelindungan data pribadi.']);
  s = await waSection(th, wrap, '9. Perubahan dan kontak');
  await waP(th, s, 'Jika kebijakan ini berubah, kami memperbarui tanggal berlaku di bagian atas dan memberi tahu Anda lewat aplikasi bila perubahannya penting.');
  await waP(th, s, 'Pertanyaan atau permintaan soal data pribadi dapat dikirim ke:');
  await waList(th, s, ['PT Contoh Perusahaan', 'Email: info@contoh.co.id', 'Alamat: Jl. Contoh No. 1, Jakarta']);
  await waP(th, s, 'Untuk data kepegawaian seperti jabatan, kontrak, atau koreksi absensi, hubungi HR Perusahaan Anda terlebih dahulu.');
  const dv = box('divider', { theme: th, parent: wrap, fixed: [10, 1], fill: 'color/border' }); dv.layoutSizingHorizontal = 'FILL';
  const ft = box('footer', { dir: 'V', pad: [16, 0, 0, 0], theme: th, parent: wrap, fillW: true });
  await txt('© 2026 PT Contoh Perusahaan', 'body2', 'color/text/secondary', th, { parent: ft });
  return f;
} });

/* ---------- Super Admin ---------- */
const WA_GROUPS = [
  { name: 'PT Maju Bersama', owner: 'dewi.lestari@perusahaan.co.id', plan: 'Business', status: 'active', date: '12 Nov 2026' },
  { name: 'Grup Nusantara Retail', owner: 'agus.wijaya@perusahaan.co.id', plan: 'Basic', status: 'active', date: '03 Nov 2026' },
  { name: 'CV Kartika Logistik', owner: 'rina.kartika@perusahaan.co.id', plan: 'Free', status: 'suspended', date: '21 Okt 2026' },
  { name: 'PT Prasetyo Teknologi', owner: 'eko.prasetyo@perusahaan.co.id', plan: 'Enterprise', status: 'provisioning', date: '18 Okt 2026' },
  { name: 'Yayasan Anggraini Edu', owner: 'maya.anggraini@perusahaan.co.id', plan: 'Free', status: 'churned', date: '02 Sep 2026' },
];
const WA_STATUS_COLOR = { provisioning: 'default', active: 'success', suspended: 'warning', churned: 'error' };
const waCap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

async function waSuper(th, active, h) { return page('x', th, { role: 'super', active, h }); }

/* Dasbor */
async function waDashboard(th, o = {}) {
  const { f, main } = await waSuper(th, 'Dasbor ', 900);
  if (o.error) { await alertBox('error', 'Gagal memuat data. Coba lagi.', th, main); return f; }
  const gs = o.empty ? [] : WA_GROUPS;
  const act = await pageHeader(th, main, 'Dasbor', 'Ringkasan semua grup di platform');
  await button('Buat Grup Baru', th, act, { icon: 'plus' });
  const stats = box('stats', { dir: 'H', gap: 20, theme: th, parent: main, fillW: true });
  const n = (s) => gs.filter((g) => g.status === s).length;
  await statCard('Total Grup', String(gs.length), null, 'building', th, stats);
  await statCard('Aktif', String(n('active')), null, 'check', th, stats);
  await statCard('Ditangguhkan', String(n('suspended')), null, 'wa-pause', th, stats);
  await statCard('Sedang Disiapkan', String(n('provisioning')), null, 'refresh', th, stats);
  const row = box('row', { dir: 'H', gap: 20, ay: 'MIN', theme: th, parent: main, fillW: true });
  const left = card(th, row, { pad: 0, clip: true }); left.layoutGrow = 1;
  const lh = box('header', { dir: 'H', ay: 'CENTER', pad: [20, 20, 12, 20], theme: th, parent: left, fillW: true });
  await txt('Grup Terbaru', 'subtitle', 'color/text/primary', th, { parent: lh }); spacer(lh);
  await button('Lihat Semua', th, lh, { v: 'text', size: 'small', endIcon: 'wa-arrow' });
  waDivider(th, left);
  if (!gs.length) { const e = box('kosong', { dir: 'V', pad: 24, theme: th, parent: left, fillW: true }); await txt('Belum ada grup.', 'body2', 'color/text/secondary', th, { parent: e }); }
  for (const [i, g] of gs.entries()) {
    const r = box('row ' + g.name, { dir: 'H', ay: 'CENTER', pad: 20, theme: th, parent: left, fillW: true });
    const t = box('text', { dir: 'V', gap: 2, theme: th, parent: r }); await txt(g.name, 'body2-strong', 'color/text/primary', th, { parent: t }); await txt(g.owner, 'caption', 'color/text/secondary', th, { parent: t });
    spacer(r);
    const cs = box('chips', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: r });
    await chip(g.plan, th, cs, { variant: 'outlined' }); await chip(g.status, th, cs, { color: WA_STATUS_COLOR[g.status] });
    if (i < gs.length - 1) waDivider(th, left);
  }
  const right = card(th, row, { pad: 20, gap: 12, fillW: false }); right.resize(452, 100); right.primaryAxisSizingMode = 'AUTO'; right.counterAxisSizingMode = 'FIXED';
  await txt('Sebaran Paket', 'subtitle', 'color/text/primary', th, { parent: right });
  const dist = o.empty ? [] : [['Business', 1], ['Basic', 1], ['Free', 2], ['Enterprise', 1]];
  if (!dist.length) await txt('Belum ada data.', 'body2', 'color/text/secondary', th, { parent: right });
  for (const [c, k] of dist) { const r = box('plan ' + c, { dir: 'H', ay: 'CENTER', theme: th, parent: right, fillW: true }); await txt(c, 'body2', 'color/text/primary', th, { parent: r }); spacer(r); await chip(String(k), th, r, {}); }
  return f;
}
registerScreen({ key: 'super/dashboard', group: WA_GROUP, title: 'Super Dasbor', build: (th) => waDashboard(th) });
registerScreen({ key: 'super/dashboard-kosong', group: WA_GROUP, title: 'Super Dasbor kosong', build: (th) => waDashboard(th, { empty: true }) });
registerScreen({ key: 'super/dashboard-galat', group: WA_GROUP, title: 'Super Dasbor galat', build: (th) => waDashboard(th, { error: true }) });

/* Daftar grup */
async function waGroups(th, o = {}) {
  const { f, main } = await waSuper(th, 'Grup', 900);
  const gs = o.empty ? [] : WA_GROUPS;
  const act = await pageHeader(th, main, 'Grup', `${gs.length} grup terdaftar di platform`);
  await button('Buat Grup Baru', th, act, { icon: 'plus' });
  if (o.error) await alertBox('error', 'Gagal memuat daftar grup. Coba lagi.', th, main);
  const c = card(th, main, { pad: 0, clip: true });
  const sb = box('search', { dir: 'H', pad: 16, theme: th, parent: c, fillW: true, stroke: 'color/border' });
  sb.strokeTopWeight = 0; sb.strokeLeftWeight = 0; sb.strokeRightWeight = 0;
  const si = await inputField('Cari nama grup atau email pemilik...', '', th, sb, { w: 340, icon: 'search' });
  if (gs.length) {
    const t = await table(th, c, { cols: [{ t: 'Nama Grup', w: 'fill' }, { t: 'Pemilik', w: 'fill' }, { t: 'Paket', w: 130 }, { t: 'Status', w: 140 }, { t: 'Dibuat', w: 180 }], rows: gs.map((g) => [g.name, g.owner, { chip: g.plan, color: 'default', variant: 'outlined' }, { chip: waCap(g.status), color: WA_STATUS_COLOR[g.status] }, g.date]), foot: `1–${gs.length} dari ${gs.length}` });
    t.strokes = []; // kartu sudah punya border
  } else {
    const e = box('No rows', { dir: 'V', ax: 'CENTER', ay: 'CENTER', pad: [64, 0, 64, 0], theme: th, parent: c, fillW: true });
    await txt('No rows', 'body2', 'color/text/secondary', th, { parent: e });
  }
  return f;
}
registerScreen({ key: 'super/groups', group: WA_GROUP, title: 'Super Grup', build: (th) => waGroups(th) });
registerScreen({ key: 'super/groups-kosong', group: WA_GROUP, title: 'Super Grup kosong', build: (th) => waGroups(th, { empty: true }) });
registerScreen({ key: 'super/groups-galat', group: WA_GROUP, title: 'Super Grup galat', build: (th) => waGroups(th, { error: true, empty: true }) });

/* Detail grup */
async function waInfoRow(th, parent, label, value) {
  const r = box('InfoRow', { dir: 'H', pad: [8, 0, 8, 0], theme: th, parent, fillW: true });
  await txt(label, 'body2', 'color/text/secondary', th, { parent: r }); spacer(r);
  await txt(value, 'body2', 'color/text/primary', th, { parent: r });
}
async function waInfoCard(th, parent, title, rows, fixedW) {
  const c = card(th, parent, { pad: 20, gap: 8, fillW: !fixedW });
  if (fixedW) { c.resize(fixedW, 100); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED'; } else { c.layoutGrow = 1; }
  await txt(title, 'subtitle', 'color/text/primary', th, { parent: c }); waDivider(th, c);
  for (const [l, v] of rows) await waInfoRow(th, c, l, v);
  return c;
}
async function waUsagePanel(th, parent, w) {
  const c = card(th, parent, { pad: 20, gap: 16, fillW: false }); c.resize(w, 100); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
  const hd = box('header', { dir: 'H', ay: 'CENTER', theme: th, parent: c, fillW: true });
  await txt('Kuota Paket', 'subtitle', 'color/text/primary', th, { parent: hd }); spacer(hd); await chip('Business', th, hd, { color: 'primary', variant: 'tint' });
  const bw = w - 40;
  const items = [['Perusahaan', '2 / 5', 0.4, 'color/primary', null], ['Karyawan aktif', '84 / 100', 0.84, 'color/warning', 'Sisa 16 lagi.', 'color/warning'], ['Akun admin', '3 / 3', 1, 'color/danger', 'Kuota habis. Naikkan paket untuk menambah akun admin.', 'color/danger'], ['Shift', '6 / 20', 0.3, 'color/primary', null], ['Penyimpanan (GB)', '- / 10', 0, 'color/primary', null]];
  for (const [l, v, r, col, msg, mc] of items) {
    const it = box('LimitRow', { dir: 'V', gap: 6, theme: th, parent: c, fillW: true });
    const tr = box('label', { dir: 'H', ay: 'MAX', theme: th, parent: it, fillW: true });
    await txt(l, 'body2-strong', 'color/text/primary', th, { parent: tr }); spacer(tr);
    await txt(v, msg && mc === 'color/danger' ? 'body2-strong' : 'body2', mc === 'color/danger' ? 'color/danger' : 'color/text/secondary', th, { parent: tr });
    const b = waBar(th, it, bw, r, col); if (l === 'Penyimpanan (GB)') b.opacity = 0.4;
    if (msg) await txt(msg, 'caption', mc, th, { parent: it, fillW: true });
  }
  waDivider(th, c);
  await txt('Fitur', 'body2-strong', 'color/text/primary', th, { parent: c });
  const fr = box('features', { dir: 'H', gap: 8, theme: th, parent: c, fillW: true });
  await chip('Multi-perusahaan', th, fr, { color: 'primary', variant: 'tint', icon: 'check' });
  await chip('Modul Payroll', th, fr, { color: 'primary', variant: 'tint', icon: 'check' });
  await chip('Modul Absensi', th, fr, { variant: 'outlined', icon: 'wa-minus' });
  return c;
}
async function waDetail(th, o = {}) {
  const status = o.status ?? 'active';
  const { f, main } = await waSuper(th, 'Grup', o.h ?? 1000);
  if (o.error) {
    const w0 = waCol(th, main, 820, 16, 'wrap');
    await button('Kembali', th, w0, { v: 'text', icon: 'back' });
    await alertBox('error', 'Grup tidak ditemukan', th, w0);
    return f;
  }
  const w = waCol(th, main, 820, 0, 'wrap');
  const bk = box('kembali', { dir: 'H', pad: [0, 0, 16, 0], theme: th, parent: w }); await button('Kembali', th, bk, { v: 'text', icon: 'back' });
  const hd = box('header', { dir: 'H', ay: 'CENTER', pad: [0, 0, 24, 0], theme: th, parent: w, fillW: true });
  const tt = box('title', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: hd });
  await txt('PT Maju Bersama', 'h5', 'color/text/primary', th, { parent: tt }); await chip(waCap(status), th, tt, { color: WA_STATUS_COLOR[status] });
  spacer(hd);
  const ac = box('actions', { dir: 'H', gap: 8, theme: th, parent: hd });
  if (status === 'suspended') await button('Aktifkan', th, ac, { v: 'outlined', color: 'success', size: 'small', icon: 'wa-play' });
  else await button('Tangguhkan', th, ac, { v: 'outlined', color: 'warning', size: 'small', icon: 'wa-pause' });
  await button('Ubah Paket', th, ac, { v: 'outlined', size: 'small', icon: 'wa-premium' });
  await button('Reset Kata Sandi', th, ac, { v: 'outlined', size: 'small', icon: 'key' });
  const grid = box('grid', { dir: 'V', gap: 20, theme: th, parent: w, fillW: true });
  if (o.banner) await alertBox(status === 'churned' ? 'error' : 'warning', 'Data masih bisa dilihat, tapi belum bisa ditambah atau diubah sampai langganan aktif lagi. Hubungi admin platform.', th, grid, 'Langganan sedang ditangguhkan');
  const r1 = box('row', { dir: 'H', gap: 20, ay: 'MIN', theme: th, parent: grid, fillW: true });
  await waInfoCard(th, r1, 'Info Grup', [['ID Grup', '3f9c2a10-7b1e-4c55-9d0a-8e21b6a4c7d2'], ['Database', 'tenant_maju_bersama'], ['Dibuat', '12/11/2026 09.30.00']]);
  await waInfoCard(th, r1, 'Pemilik', [['Nama', 'Dewi Lestari'], ['Email', 'dewi.lestari@perusahaan.co.id']]);
  await waInfoCard(th, grid, 'Langganan', [['Paket', 'Business'], ['Mulai', '2026-11-12'], ['Berakhir', 'Tidak ada batas']]);
  if (o.usage) await waUsagePanel(th, grid, 820);
  if (o.dlg) await o.dlg(f);
  return f;
}
registerScreen({ key: 'super/groups-detail', group: WA_GROUP, title: 'Super Detail grup', build: (th) => waDetail(th) });
registerScreen({ key: 'super/groups-detail-ditangguhkan', group: WA_GROUP, title: 'Super Detail grup ditangguhkan', build: (th) => waDetail(th, { status: 'suspended' }) });
registerScreen({ key: 'super/groups-detail-galat', group: WA_GROUP, title: 'Super Detail grup galat', build: (th) => waDetail(th, { error: true }) });
// Komponen UsagePanel + GroupStatusBanner (dipakai Dasbor Owner; ditampilkan di sini sebagai gambaran detail tenant)
registerScreen({ key: 'super/groups-detail-kuota', group: WA_GROUP, title: 'Super Detail grup kuota (UsagePanel)', build: (th) => waDetail(th, { status: 'suspended', banner: true, usage: true, h: 1500 }) });

const waDlgText = async (th, b, str) => { await txt(str, 'body2', 'color/text/secondary', th, { parent: b, fillW: true }); };
registerScreen({ key: 'super/groups-detail-tangguhkan', group: WA_GROUP, title: 'Dialog tangguhkan grup', build: (th) => waDetail(th, { dlg: (f) => dialog(th, f, { title: 'Tangguhkan grup ini?', w: 444, build: (b) => waDlgText(th, b, 'PT Maju Bersama akan ditangguhkan. Datanya tidak dihapus, hanya ditandai tidak aktif.'), actions: [{ label: 'Batal' }, { label: 'Ya, Lanjutkan', v: 'contained', color: 'warning' }] }) }) });
registerScreen({ key: 'super/groups-detail-aktifkan', group: WA_GROUP, title: 'Dialog aktifkan grup', build: (th) => waDetail(th, { status: 'suspended', dlg: (f) => dialog(th, f, { title: 'Aktifkan lagi grup ini?', w: 444, build: (b) => waDlgText(th, b, 'PT Maju Bersama akan aktif lagi.'), actions: [{ label: 'Batal' }, { label: 'Ya, Lanjutkan', v: 'contained', color: 'success' }] }) }) });
registerScreen({ key: 'super/groups-detail-ubah-paket', group: WA_GROUP, title: 'Dialog ubah paket', build: (th) => waDetail(th, { dlg: (f) => dialog(th, f, { title: 'Ubah Paket Grup', w: 444, build: async (b) => { await waDlgText(th, b, 'Pilih paket baru untuk PT Maju Bersama.'); await inputField('Paket', 'Business (saat ini)', th, b, { select: true, focus: true }); }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained', disabled: true }] }) }) });
registerScreen({ key: 'super/groups-detail-ubah-paket-memuat', group: WA_GROUP, title: 'Dialog ubah paket memuat', build: (th) => waDetail(th, { dlg: (f) => dialog(th, f, { title: 'Ubah Paket Grup', w: 444, build: async (b) => { await waDlgText(th, b, 'Pilih paket baru untuk PT Maju Bersama.'); const c = box('spin', { dir: 'H', ax: 'CENTER', pad: [8, 0, 8, 0], theme: th, parent: b, fillW: true }); waSpin(th, c); }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained', disabled: true }] }) }) });
registerScreen({ key: 'super/groups-detail-reset', group: WA_GROUP, title: 'Dialog reset kata sandi pemilik', build: (th) => waDetail(th, { dlg: (f) => dialog(th, f, { title: 'Reset kata sandi pemilik?', w: 444, build: (b) => waDlgText(th, b, 'Kata sandi baru dibuat acak untuk dewi.lestari@perusahaan.co.id. Kata sandi lama langsung tidak berlaku.'), actions: [{ label: 'Batal' }, { label: 'Ya, Reset', v: 'contained' }] }) }) });
registerScreen({ key: 'super/groups-detail-reset-hasil', group: WA_GROUP, title: 'Dialog hasil reset kata sandi', build: (th) => waDetail(th, { dlg: (f) => dialog(th, f, { title: 'Kata Sandi Baru', w: 444, build: async (b) => { await alertBox('warning', 'Kata sandi ini cuma tampil sekali. Segera kirim ke pemilik lewat jalur yang aman.', th, b); await txt('dewi.lestari@perusahaan.co.id', 'body2', 'color/text/secondary', th, { parent: b, fillW: true }); await inputField('Kata sandi', 'Xk7p-Q2mv-9RtA', th, b, { endIcon: 'copy' }); }, actions: [{ label: 'Selesai', v: 'contained' }] }) }) });

/* Buat grup baru */
async function waNewGroup(th, o = {}) {
  const { f, main } = await waSuper(th, 'Grup', 1000);
  const w = waCol(th, main, 560, 0, 'wrap');
  const bk = box('kembali', { dir: 'H', pad: [0, 0, 8, 0], theme: th, parent: w }); await button('Kembali', th, bk, { v: 'text', icon: 'back' });
  const ttl = box('titles', { dir: 'V', gap: 4, pad: [0, 0, 24, 0], theme: th, parent: w, fillW: true });
  await txt('Buat Grup Baru', 'h5', 'color/text/primary', th, { parent: ttl });
  await txt('Grup baru otomatis dapat paket Free, satu perusahaan, dan satu akun pemilik.', 'body2', 'color/text/secondary', th, { parent: ttl, fillW: true });
  const c = card(th, w, { pad: 24, gap: 20 });
  if (o.error) await alertBox('error', o.error, th, c);
  const v = o.filled;
  await inputField('Nama Grup', v ? 'Grup Nusantara Retail' : '', th, c, { required: true, focus: !v });
  await inputField('Nama Perusahaan Pertama', v ? 'PT Nusantara Retail' : '', th, c, { required: true });
  const dv = box('Divider', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: c, fillW: true });
  const l1 = box('line', { theme: th, parent: dv, fixed: [10, 1], fill: 'color/border' }); l1.layoutGrow = 1; l1.layoutSizingHorizontal = 'FILL';
  await txt('Data Pemilik', 'body2', 'color/text/secondary', th, { parent: dv });
  const l2 = box('line', { theme: th, parent: dv, fixed: [10, 1], fill: 'color/border' }); l2.layoutGrow = 1; l2.layoutSizingHorizontal = 'FILL';
  await inputField('Nama Pemilik', v ? 'Agus Wijaya' : '', th, c, { required: true });
  await inputField('Email Pemilik', v ? 'agus.wijaya@perusahaan.co.id' : '', th, c, { required: true });
  await inputField('Kata Sandi Pemilik', v ? '••••••••' : '', th, c, { required: true, helper: 'Minimal 6 karakter' });
  const ac = box('actions', { dir: 'H', gap: 16, pad: [4, 0, 0, 0], theme: th, parent: c });
  await button(o.submitting ? 'Membuat...' : 'Buat Grup', th, ac, { disabled: !!o.submitting }); await button('Batal', th, ac, { v: 'text', disabled: !!o.submitting });
  return f;
}
registerScreen({ key: 'super/groups-new', group: WA_GROUP, title: 'Super Buat grup', build: (th) => waNewGroup(th) });
registerScreen({ key: 'super/groups-new-galat', group: WA_GROUP, title: 'Super Buat grup galat', build: (th) => waNewGroup(th, { filled: true, error: 'Gagal membuat grup. Coba lagi.' }) });
registerScreen({ key: 'super/groups-new-memproses', group: WA_GROUP, title: 'Super Buat grup memproses', build: (th) => waNewGroup(th, { filled: true, submitting: true }) });

/* Katalog paket */
const WA_PLANS = [
  { name: 'Free', price: 'Rp 0', cycle: '/bulan', def: true, lim: [['max_company', 1], ['max_employee_total', 10], ['max_admin_user', 1], ['max_shift', 3], ['storage_gb', 1]], feat: [['multi_company', 0], ['payroll_module', 0], ['attendance_module', 1]] },
  { name: 'Basic', price: 'Rp 299.000', cycle: '/bulan', lim: [['max_company', 1], ['max_employee_total', 50], ['max_admin_user', 2], ['max_shift', 10], ['storage_gb', 5]], feat: [['multi_company', 0], ['payroll_module', 1], ['attendance_module', 1]] },
  { name: 'Business', price: 'Rp 899.000', cycle: '/bulan · uji coba 14 hari', lim: [['max_company', 5], ['max_employee_total', 100], ['max_admin_user', 3], ['max_shift', 20], ['storage_gb', 10]], feat: [['multi_company', 1], ['payroll_module', 1], ['attendance_module', 1]] },
  { name: 'Enterprise', price: 'Rp 24.990.000', cycle: '/tahun', lim: [['max_company', 20], ['max_employee_total', 1000], ['max_admin_user', 10], ['max_shift', 100], ['storage_gb', 100]], feat: [['multi_company', 1], ['payroll_module', 1], ['attendance_module', 1]] },
];
registerScreen({ key: 'super/plans', group: WA_GROUP, title: 'Super Paket', build: async (th) => {
  const { f, main } = await waSuper(th, 'Paket', 1000);
  const ttl = box('titles', { dir: 'V', gap: 4, theme: th, parent: main, fillW: true });
  await txt('Katalog Paket', 'h5', 'color/text/primary', th, { parent: ttl });
  await txt('Daftar paket langganan beserta fitur dan batasannya', 'body2', 'color/text/secondary', th, { parent: ttl });
  const row = box('grid', { dir: 'H', gap: 24, ay: 'MIN', theme: th, parent: main, fillW: true });
  for (const p of WA_PLANS) {
    const c = card(th, row, { pad: 20, gap: 0 }); c.layoutGrow = 1;
    const hd = box('header', { dir: 'H', ay: 'CENTER', pad: [0, 0, 8, 0], theme: th, parent: c, fillW: true });
    await txt(p.name, 'h6', 'color/text/primary', th, { parent: hd }); spacer(hd);
    if (p.def) await chip('Bawaan', th, hd, { color: 'primary' });
    await txt(p.price, 'h5', 'color/text/primary', th, { parent: c });
    await txt(p.cycle, 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
    const d1 = box('gap', { pad: [8, 0, 8, 0], theme: th, parent: c, fillW: true }); waDivider(th, d1);
    await txt('BATAS', 'caption-strong', 'color/text/secondary', th, { parent: c });
    const ls = box('limits', { dir: 'V', gap: 4, pad: [4, 0, 16, 0], theme: th, parent: c, fillW: true });
    for (const [k, v] of p.lim) { const r = box('limit', { dir: 'H', ay: 'MIN', theme: th, parent: ls, fillW: true }); await txt(k, 'body2', 'color/text/secondary', th, { parent: r }); spacer(r); await txt(String(v), 'body2', 'color/text/primary', th, { parent: r }); }
    await txt('FITUR', 'caption-strong', 'color/text/secondary', th, { parent: c });
    const fs = box('features', { dir: 'V', gap: 4, pad: [4, 0, 0, 0], theme: th, parent: c, fillW: true });
    for (const [k, on] of p.feat) { const r = box('feature', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: fs, fillW: true }); icon(on ? 'check' : 'wa-cancel', 20, on ? 'color/success' : 'color/text/disabled', th, r); await txt(k, 'body2', on ? 'color/text/primary' : 'color/text/disabled', th, { parent: r }); }
  }
  return f;
} });
registerScreen({ key: 'super/plans-galat', group: WA_GROUP, title: 'Super Paket galat', build: async (th) => {
  const { f, main } = await waSuper(th, 'Paket', 900);
  await alertBox('error', 'Gagal memuat daftar paket. Coba lagi.', th, main);
  return f;
} });
registerScreen({ key: 'super/plans-memuat', group: WA_GROUP, title: 'Super Paket memuat', build: async (th) => {
  const { f, main } = await waSuper(th, 'Paket', 900);
  const c = box('spinner', { dir: 'H', ax: 'CENTER', pad: [48, 0, 0, 0], theme: th, parent: main, fillW: true }); waSpin(th, c);
  return f;
} });
