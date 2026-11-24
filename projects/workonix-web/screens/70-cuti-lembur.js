/* =====================================================================
 * 70 — Cuti dan Lembur (owner: pengajuan, saldo, pengaturan, rekap; self-service: owner + karyawan)
 * Prefiks: wc / WC_
 * ===================================================================== */
const WC_GROUP = 'Cuti dan Lembur';
const WC_ERR_LOAD = 'Gagal memuat data. Coba lagi.';

/* ---------- Pembantu ---------- */
function wcDiv(th, parent) { const d = box('Divider', { dir: 'H', fill: 'color/border', theme: th, parent, fixed: [100, 1] }); d.layoutSizingHorizontal = 'FILL'; return d; }
function wcBar(th, parent, ratio, w) {
  const t = box('LinearProgress', { dir: 'H', fill: 'color/border', radius: 4, theme: th, parent, fixed: [w, 8], clip: true });
  const r = figma.createRectangle(); r.name = 'bar'; r.resize(Math.max(1, Math.round(w * ratio)), 8); r.fills = [pv(th, 'color/primary')];
  t.appendChild(r); r.layoutPositioning = 'ABSOLUTE'; r.x = 0; r.y = 0; return t;
}
async function wcRow(th, parent, l, r, strong) {
  const row = box('row/' + l, { dir: 'H', ay: 'CENTER', theme: th, parent, fillW: true });
  const a = await txt(l, strong ? 'body2-strong' : 'body2', strong ? 'color/text/primary' : 'color/text/secondary', th, { parent: row }); a.layoutGrow = 1; a.layoutSizingHorizontal = 'FILL'; a.textAutoResize = 'HEIGHT';
  await txt(r, strong ? 'body2-strong' : 'body2', 'color/text/primary', th, { parent: row });
  return row;
}
/** Kartu berisi bar filter (border bawah) lalu tabel tanpa bingkai ganda (MUI Card + DataGrid). */
function wcGridCard(th, main) { return card(th, main, { pad: 0, gap: 0, clip: true, name: 'Card' }); }
function wcFilterBar(th, parent) {
  const r = box('filters', { dir: 'H', gap: 12, ay: 'CENTER', pad: 16, stroke: 'color/border', theme: th, parent, fillW: true });
  r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; return r;
}
async function wcGrid(th, card0, o) {
  const t = await table(th, card0, o); t.strokes = []; t.cornerRadius = 0; return t;
}
async function wcSearch(th, parent) { const s = await inputField('Cari nama atau nomor karyawan', '', th, parent, { icon: 'search' }); return s; }
async function wcDate(label, v, th, parent) { return inputField(label, v, th, parent, { w: 170, endIcon: 'calendar' }); }
async function wcStatusSel(th, parent, v) { return inputField('Status', v ?? 'Semua Status', th, parent, { w: 180, select: true }); }
async function wcTitleBlock(th, main, title, sub) { const act = await pageHeader(th, main, title, sub); return act; }
const WC_STATUS = { pending: ['Menunggu', 'warning'], approved: ['Disetujui', 'success'], rejected: ['Ditolak', 'error'], cancelled: ['Dibatalkan', 'default'] };
function wcSt(s) { return { chip: WC_STATUS[s][0], color: WC_STATUS[s][1] }; }
function wcEmp(i, n, no) { return { t: n, sub: no }; }
async function wcSectionCard(th, parent, title, sub) { const c = card(th, parent, { gap: 0, pad: 24 }); await cardTitle(th, c, title, sub); return c; }
async function wcCompanyField(th, parent, w) { return inputField('Perusahaan', 'PT Maju Bersama', th, parent, { w: w ?? 260, select: true }); }

/** Pilihan segmen (ToggleButtonGroup Choice). */
async function wcChoice(th, parent, labels, active) {
  const g = box('Choice', { dir: 'H', stroke: 'color/border', radius: 8, theme: th, parent, clip: true });
  for (const [i, l] of labels.entries()) {
    const s = box('opt/' + l, { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [0, 14, 0, 14], fill: i === active ? 'color/primary-surface' : null, theme: th, parent: g, fixed: [90, 34] });
    s.primaryAxisSizingMode = 'AUTO';
    await txt(l, 'body2-strong', i === active ? 'color/primary' : 'color/text/secondary', th, { parent: s });
  }
  return g;
}
async function wcNum(th, parent, v, unit) {
  const r = box('NumberInput', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent });
  const f = box('input', { dir: 'H', ay: 'CENTER', pad: [0, 14, 0, 14], stroke: 'color/border', radius: 10, theme: th, parent: r, fixed: [96, 40] });
  await txt(String(v), 'body', 'color/text/primary', th, { parent: f });
  if (unit) await txt(unit, 'body2', 'color/text/secondary', th, { parent: r });
  return r;
}
/** Baris pengaturan: penjelasan kiri, kontrol kanan (240); build(ctl) mengisi kontrol, below(b) isian tambahan. */
async function wcSettingRow(th, parent, title, desc, build, below, last) {
  const r = box('SettingRow/' + title, { dir: 'V', gap: 10, pad: [18, 0, 18, 0], stroke: last ? null : 'color/border', theme: th, parent, fillW: true });
  r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0;
  const top = box('grid', { dir: 'H', gap: 24, ay: 'CENTER', theme: th, parent: r, fillW: true });
  const l = box('text', { dir: 'V', gap: 2, theme: th, parent: top }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL';
  await txt(title, 'body2-strong', 'color/text/primary', th, { parent: l, fillW: true });
  if (desc) await txt(desc, 'caption', 'color/text/secondary', th, { parent: l, fillW: true });
  const ctl = box('control', { dir: 'H', ax: 'MAX', ay: 'CENTER', theme: th, parent: top, fixed: [240, 40] }); ctl.counterAxisSizingMode = 'AUTO';
  if (build) await build(ctl);
  if (below) await below(r);
  return r;
}
async function wcSection(th, parent, title, sub) {
  const c = card(th, parent, { gap: 0, pad: [20, 24, 6, 24] });
  const h = box('head', { dir: 'V', gap: 2, pad: [0, 0, 10, 0], theme: th, parent: c, fillW: true });
  await txt(title, 'subtitle', 'color/text/primary', th, { parent: h });
  if (sub) await txt(sub, 'body2', 'color/text/secondary', th, { parent: h, fillW: true });
  return c;
}
async function wcCompanyBlock(th, main, withCaption) {
  if (withCaption) { const b = box('company', { dir: 'V', gap: 4, theme: th, parent: main }); await txt('Perusahaan', 'caption', 'color/text/secondary', th, { parent: b }); await wcCompanyField(th, b, 260); }
  else await wcCompanyField(th, main, 260);
}

/* ---------- Data contoh ---------- */
const WC_LEAVE_ROWS = [
  [ '2026-12-14 s/d 2026-12-16', wcEmp(0, 'Budi Santoso', 'EMP-000003'), 'Cuti Tahunan', '3 hari', 'Acara keluarga di luar kota', { icon: 'file' }, wcSt('pending') ],
  [ '2026-12-22 s/d 2026-12-26', wcEmp(0, 'Dewi Lestari', 'EMP-000004'), 'Cuti Tahunan', { t: '5 hari', sub: '(2 tdk dibayar)' }, 'Liburan akhir tahun', '', wcSt('approved') ],
  [ '2026-12-03', wcEmp(0, 'Siti Rahmawati', 'EMP-000007'), 'Sakit', '1 hari', 'Demam dan flu', { icon: 'file' }, wcSt('approved') ],
  [ '2026-11-30 s/d 2026-12-02', wcEmp(0, 'Agus Wijaya', 'EMP-000009'), 'Cuti Menikah', '3 hari', 'Pernikahan adik kandung', { icon: 'file' }, wcSt('rejected') ],
  [ '2026-12-10', wcEmp(0, 'Rina Kartika', 'EMP-000011'), 'Cuti Tahunan', '1 hari', 'Mengurus dokumen kendaraan', '', wcSt('cancelled') ],
];
const WC_LEAVE_COLS = [{ t: 'Tanggal', w: 200 }, { t: 'Karyawan', w: 'fill' }, { t: 'Jenis', w: 150 }, { t: 'Hari', w: 130 }, { t: 'Alasan', w: 'fill' }, { t: '', w: 50, align: 'center' }, { t: 'Status', w: 130 }];

const WC_BAL_COLS = [{ t: 'No. Karyawan', w: 130 }, { t: 'Nama', w: 'fill' }, { t: 'Jabatan', w: 'fill' }, { t: 'Masa kerja', w: 150 }, { t: 'Jatah', w: 90, align: 'right' }, { t: 'Dipakai', w: 90, align: 'right' }, { t: 'Sisa', w: 100, align: 'right' }];
const WC_BAL_ROWS = [
  ['EMP-000003', 'Budi Santoso', 'Staf IT', '2 tahun 4 bulan', '12', '4', '8'],
  ['EMP-000004', 'Dewi Lestari', { t: 'Manajer SDM  L2' }, '5 tahun 1 bulan', '14', '14', '0'],
  ['EMP-000007', 'Siti Rahmawati', 'Staf Keuangan', '8 bulan', '12', '2', { icon: 'lock', t: '10' }],
  ['EMP-000009', 'Agus Wijaya', 'Staf Operasional', '1 tahun 9 bulan', '12', '9', '3'],
  ['EMP-000011', 'Rina Kartika', 'Supervisor Operasional  L2', '3 tahun 2 bulan', '14', '6', '8'],
];
const WC_LEDGER = [['Jatah cuti terbit', 'Jatah tahun 2026', '+12'], ['Dipakai', 'Cuti Tahunan 2026-03-12 s/d 2026-03-13', '-2'], ['Dipakai', 'Cuti Tahunan 2026-08-17', '-1'], ['Koreksi HR', 'Saldo pindahan dari sistem lama · oleh Dewi Lestari', '+3'], ['Dipakai', 'Cuti Tahunan 2026-10-05 s/d 2026-10-06', '-2']];

const WC_OT_COLS = [{ t: 'Tanggal', w: 110 }, { t: 'Karyawan', w: 'fill' }, { t: 'Jam', w: 130 }, { t: 'Durasi', w: 100 }, { t: 'Jenis Hari', w: 170 }, { t: 'Dibayar', w: 110 }, { t: 'Status', w: 130 }];
const WC_OT_ROWS = [
  ['2026-11-20', wcEmp(0, 'Budi Santoso', 'EMP-000003'), '19:00 – 22:00', '3 jam', { chip: 'Hari kerja', color: 'default' }, '4,5 jam', wcSt('approved')],
  ['2026-11-21', wcEmp(0, 'Eko Prasetyo', 'EMP-000013'), '09:00 – 15:00', '6 jam', { chip: 'Hari libur kerja', color: 'warning' }, '12 jam', wcSt('pending')],
  ['2026-11-18', wcEmp(0, 'Maya Anggraini', 'EMP-000015'), '18:00 – 20:30', '2,5 jam', { chip: 'Hari kerja', color: 'default' }, '3,75 jam', wcSt('approved')],
  ['2026-11-12', wcEmp(0, 'Hendra Gunawan', 'EMP-000017'), '08:00 – 13:00', '5 jam', { chip: 'Hari libur nasional', color: 'error' }, '10 jam', wcSt('rejected')],
  ['2026-11-10', wcEmp(0, 'Putri Handayani', 'EMP-000019'), '19:00 – 21:00', '2 jam', { chip: 'Hari kerja', color: 'default' }, '3 jam', wcSt('cancelled')],
];
const WC_DAYCHIP = { workday: ['Hari kerja', 'default'], rest: ['Hari libur kerja', 'warning'], holiday: ['Hari libur nasional', 'error'] };

/* ---------- Bagian halaman bersama ---------- */
async function wcAlertPending(th, main, n) { await alertBox('info', `${n} pengajuan menunggu persetujuan. Yang perlu disetujui akun ini ada di menu Persetujuan.`, th, main); }

/** Halaman daftar pengajuan cuti owner. v: 'data'|'kosong'|'galat'. */
async function wcBuildLeaveRequests(th, v) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Pengajuan Cuti', h: 1000 });
  await wcTitleBlock(th, main, 'Pengajuan Cuti', v === 'data' ? '5 dari 5 pengajuan' : '0 dari 0 pengajuan');
  if (v === 'galat') await alertBox('error', WC_ERR_LOAD, th, main);
  if (v === 'data') await wcAlertPending(th, main, 1);
  const c = wcGridCard(th, main); const fb = wcFilterBar(th, c);
  await wcSearch(th, fb); await wcDate('Dari', '2026-11-01', th, fb); await wcDate('Sampai', '2027-02-22', th, fb); await wcStatusSel(th, fb);
  if (v === 'data') await wcGrid(th, c, { cols: WC_LEAVE_COLS, rows: WC_LEAVE_ROWS, foot: '1–5 dari 5' });
  else await emptyState('umbrella', 'Tidak ada pengajuan cuti', 'Belum ada pengajuan pada rentang tanggal ini.', th, c);
  return f;
}

/** Saldo cuti. v: 'list'|'panel' (dialog panel bersama) |'panel-koreksi'|'dialog' (dialog dengan form koreksi)|'dialog-kosong'|'kosong'|'galat'. */
async function wcBalanceList(th, v, active) {
  const { f, main } = await page('x', th, { role: 'owner', active, h: v === 'list' || v === 'kosong' || v === 'galat' ? 1000 : 1300 });
  await wcTitleBlock(th, main, 'Saldo Cuti', v === 'kosong' ? '0 karyawan · total sisa 0 hari dari 0 hari jatah' : '5 karyawan · total sisa 29 hari dari 64 hari jatah');
  if (v === 'galat') await alertBox('error', 'Gagal memuat saldo cuti. Coba lagi.', th, main);
  const c = wcGridCard(th, main); const fb = wcFilterBar(th, c);
  await wcSearch(th, fb); await inputField('Perusahaan', 'PT Maju Bersama', th, fb, { w: 240, select: true });
  if (v === 'kosong' || v === 'galat') await emptyState('users', 'Belum ada data saldo', 'Saldo cuti karyawan akan tampil di sini.', th, c);
  else await wcGrid(th, c, { cols: WC_BAL_COLS, rows: WC_BAL_ROWS, foot: '1–5 dari 5' });
  return { f, main };
}
async function wcLedgerList(th, parent, entries) {
  const l = box('ledger', { dir: 'V', theme: th, parent, fillW: true });
  if (entries.length === 0) { await txt('Belum ada catatan di periode ini.', 'body2', 'color/text/disabled', th, { parent: l }); return l; }
  for (const e of entries) {
    const r = box('entry', { dir: 'H', gap: 12, ay: 'MIN', pad: [8, 0, 8, 0], stroke: 'color/border', theme: th, parent: l, fillW: true });
    r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0;
    const t = box('t', { dir: 'V', theme: th, parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
    await txt(e[0], 'body2', 'color/text/primary', th, { parent: t, fillW: true }); await txt(e[1], 'caption', 'color/text/secondary', th, { parent: t, fillW: true });
    await txt(e[2], 'body2-strong', e[2].startsWith('+') ? 'color/success' : 'color/text/primary', th, { parent: r });
  }
  return l;
}
async function wcKoreksiForm(th, parent, withTitle, name, filled) {
  const b = box('koreksi', { dir: 'V', gap: 14, theme: th, parent, fillW: true });
  await txt(withTitle ? 'Koreksi saldo' + (name ? ': ' + name : '') : 'Koreksi saldo', 'subtitle', 'color/text/primary', th, { parent: b });
  await inputField('Jumlah hari', filled ? '3' : '', th, b, { w: 260, helper: 'Positif menambah, negatif mengurangi. Setengah hari boleh, mis. 0,5' });
  await inputField('Alasan', filled ? 'Saldo pindahan dari sistem lama' : '', th, b, { multiline: 2, helper: 'Wajib diisi, supaya jelas kenapa saldo berubah kalau nanti ditanyakan.' });
  return b;
}
/** Dialog detail saldo versi halaman Saldo Cuti (rincian + form koreksi). */
async function wcBalanceDialogInline(th, f, filled) {
  await dialog(th, f, { title: 'Budi Santoso', w: 600, build: async (b) => {
    await txt('EMP-000003 · sisa 8 hari', 'body2', 'color/text/secondary', th, { parent: b });
    await txt('Rincian saldo', 'subtitle', 'color/text/primary', th, { parent: b });
    await wcLedgerList(th, b, WC_LEDGER);
    wcDiv(th, b);
    await wcKoreksiForm(th, b, false, null, filled);
    if (filled) { /* tombol simpan di bawah form */ }
    const ac = box('actions', { dir: 'H', gap: 8, theme: th, parent: b });
    await button('Simpan Koreksi', th, ac, { disabled: !filled });
  }, actions: [{ label: 'Tutup' }] });
}
/** Dialog dengan panel EmployeeLeaveBalancePanel. mode: 'ringkas' | 'koreksi' | 'memuat'. */
async function wcBalancePanelDialog(th, f, mode) {
  await dialog(th, f, { title: 'Budi Santoso', w: 600, build: async (b) => {
    await txt('EMP-000003 · Staf IT', 'body2', 'color/text/secondary', th, { parent: b });
    if (mode === 'memuat') { const c = box('loading', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: 40, theme: th, parent: b, fillW: true }); icon('refresh', 26, 'color/primary', th, c); return; }
    const top = box('saldo', { dir: 'H', gap: 24, ay: 'MAX', theme: th, parent: b });
    const big = box('big', { dir: 'V', theme: th, parent: top });
    await txt('8', 'h4', 'color/primary', th, { parent: big }); await txt('hari tersisa', 'caption', 'color/text/secondary', th, { parent: big });
    const kk = box('kk', { dir: 'V', gap: 2, theme: th, parent: top });
    await txt('Jatah 12 hari', 'body2', 'color/text/primary', th, { parent: kk }); await txt('Dipakai 4 hari', 'body2', 'color/text/secondary', th, { parent: kk });
    wcBar(th, b, 4 / 12, 552);
    await txt('Periode 2026-01-01 s/d 2026-12-31', 'caption', 'color/text/secondary', th, { parent: b });
    wcDiv(th, b);
    await txt('Rincian saldo', 'subtitle', 'color/text/primary', th, { parent: b });
    await wcLedgerList(th, b, WC_LEDGER);
    wcDiv(th, b);
    if (mode === 'ringkas') {
      const r = box('aksi', { dir: 'H', gap: 8, theme: th, parent: b });
      await button('Koreksi saldo', th, r, { v: 'text', size: 'small', icon: 'settings' }); await button('Sesuaikan dengan pengaturan', th, r, { v: 'text', size: 'small', color: 'default', icon: 'refresh' });
    } else {
      await wcKoreksiForm(th, b, true, 'Budi Santoso', true);
      const r = box('aksi', { dir: 'H', gap: 8, theme: th, parent: b }); await button('Batal', th, r, { v: 'text' }); await button('Simpan Koreksi', th, r);
      await alertBox('info', 'Koreksi dicatat sebagai baris baru di rincian saldo, catatan lama tidak berubah. Karyawan bisa melihat koreksi ini beserta nama yang mengoreksi.', th, b);
    }
  }, actions: [{ label: 'Tutup' }] });
}

/* ---------- Pengaturan cuti ---------- */
async function wcPolicyEditor(th, main, o = {}) {
  const grid = box('LeavePolicyEditor', { dir: 'H', gap: 24, ay: 'MIN', theme: th, parent: main, fillW: true });
  const left = box('form', { dir: 'V', gap: 24, theme: th, parent: grid }); left.layoutGrow = 1; left.layoutSizingHorizontal = 'FILL';
  const s1 = await wcSection(th, left, 'Jatah cuti', 'Berlaku untuk semua karyawan, kecuali yang kena Jatah Khusus.');
  await wcSettingRow(th, s1, 'Jumlah hari per tahun', 'Minimal 12 hari sesuai UU.', async (c) => { await wcNum(th, c, 12, 'hari'); });
  await wcSettingRow(th, s1, 'Kapan jatah muncul dan di-reset', o.anniv ? 'Periode tiap karyawan mengikuti tanggal masuknya. Contoh: masuk 15 Juni, periodenya 15 Juni sampai 14 Juni tahun depan. Lebih adil, tapi tutup periode belum bisa dipakai untuk pilihan ini.' : 'Semua karyawan pakai periode yang sama, 1 Januari sampai 31 Desember. Jatah terbit dan reset bersamaan, dan tutup periode cukup sekali untuk semua.',
    async (c) => { await wcChoice(th, c, ['1 Januari', 'Tanggal masuk'], o.anniv ? 1 : 0); },
    o.anniv ? async (r) => { await alertBox('warning', 'Dengan pilihan ini, Tutup Buku belum bisa dipakai, jadi sisa cuti tidak hangus atau terbawa otomatis.', th, r); } : null, true);
  const s2 = await wcSection(th, left, 'Karyawan baru', 'Kapan karyawan baru dapat jatah, dan kapan boleh dipakai.');
  await wcSettingRow(th, s2, 'Dapat jatah setelah', 'Jatah muncul sejak hari pertama kerja.', async (c) => { await wcNum(th, c, 0, 'bulan'); });
  await wcSettingRow(th, s2, 'Jatah baru bisa dipakai setelah', 'Jatah sudah terlihat di saldo, tapi baru bisa dipakai setelah genap 3 bulan kerja.', async (c) => { await wcNum(th, c, 3, 'bulan'); });
  await wcSettingRow(th, s2, 'Jatah di tahun pertama', 'Sebagian, sesuai sisa bulan. Contoh: mulai berhak Agustus dapat sekitar 5 hari.', async (c) => { await wcChoice(th, c, ['Penuh', 'Sebagian'], 1); }, null, true);
  const s3 = await wcSection(th, left, 'Saldo dan sisa cuti');
  await wcSettingRow(th, s3, 'Saldo boleh minus', 'Karyawan tetap bisa cuti walaupun saldo habis atau belum bisa dipakai. Minusnya memotong jatah tahun depan saat Tutup Buku.', async (c) => { toggle(true, th, c); },
    async (r) => { const q = box('batas', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: r }); await wcChoice(th, q, ['Tanpa batas', 'Ada batas'], 1); await wcNum(th, q, '6', 'hari'); });
  await wcSettingRow(th, s3, 'Sisa cuti di akhir periode', 'Terbawa maksimal 6 hari, sisanya hangus saat Tutup Buku.', async (c) => { await wcChoice(th, c, ['Hangus', 'Dibatasi', 'Semua'], 1); },
    async (r) => { await wcNum(th, r, '6', 'hari'); }, true);
  const s4 = await wcSection(th, left, 'Pengajuan cuti', 'Pengajuan yang tidak sesuai aturan ini otomatis ditolak.');
  await wcSettingRow(th, s4, 'Hari yang memotong jatah', 'Akhir pekan dan tanggal merah tidak dihitung. Cuti Jumat sampai Senin memotong 2 hari.', null,
    async (r) => { await inputField('Hari yang memotong jatah', 'Ikut roster, kalau belum ada pakai Senin–Jumat', th, r, { w: 520, select: true }); });
  await wcSettingRow(th, s4, 'Kalau melewati batas minus', 'Kelebihannya jadi cuti tidak dibayar. Contoh: sisa 2 hari, mengajukan 5 hari. 2 hari potong jatah, 3 hari tidak dibayar.', async (c) => { await wcChoice(th, c, ['Tidak dibayar', 'Tolak'], 0); });
  await wcSettingRow(th, s4, 'Diajukan minimal sebelum hari cuti', 'Cuti tahunan yang diajukan kurang dari 3 hari sebelumnya ditolak. Tidak berlaku untuk sakit dan cuti khusus.', async (c) => { await wcNum(th, c, 3, 'hari'); }, null, true);
  // Ringkasan
  const sum = card(th, grid, { gap: 6, pad: 20 }); sum.fills = [pv(th, 'color/primary-surface')]; sum.layoutSizingHorizontal = 'FIXED'; sum.resize(340, sum.height); sum.layoutSizingHorizontal = 'FIXED';
  await txt('Ringkasan aturan', 'label', 'color/text/secondary', th, { parent: sum, upper: true });
  const big = box('quota', { dir: 'H', gap: 8, ay: 'BASELINE', theme: th, parent: sum });
  await txt('12', 'h4', 'color/text/primary', th, { parent: big }); await txt('hari / tahun', 'body', 'color/text/secondary', th, { parent: big });
  const chips = box('chips', { dir: 'H', gap: 6, theme: th, parent: sum });
  await chip(o.anniv ? 'Reset di tanggal masuk' : 'Reset 1 Januari', th, chips); await chip('Boleh minus sampai 6 hari', th, chips, { color: 'warning', variant: 'outlined' });
  await chip('Terbawa maks 6 hari', th, sum, { variant: 'outlined' });
  gap(sum, 8);
  await txt('Contoh: karyawan masuk 15 Mar 2026', 'subtitle', 'color/text/primary', th, { parent: sum, fillW: true });
  gap(sum, 4);
  const steps = [['15 Mar 2026', 'Mulai kerja', null, 'login'], ['15 Mar 2026', 'Dapat 10 hari', 'Sebagian, sesuai sisa bulan. Langsung bisa dipakai.', 'check'], ['15 Jun 2026', 'Jatah bisa dipakai', 'Genap 3 bulan kerja.', 'check'], ['1 Jan 2027', 'Dapat 12 hari lagi', 'Setelah Tutup Buku, sisa tahun lalu terbawa maksimal 6 hari. Kalau saldo minus, jatah ini dipotong minusnya.', 'refresh']];
  for (const [d, t, det, ic] of steps) {
    const r = box('step', { dir: 'H', gap: 12, ay: 'MIN', pad: [0, 0, 14, 0], theme: th, parent: sum, fillW: true });
    const dot = box('dot', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', radius: 999, theme: th, parent: r, fixed: [28, 28] }); icon(ic === 'login' ? 'person' : ic, 16, 'color/primary', th, dot);
    const tx = box('t', { dir: 'V', theme: th, parent: r }); tx.layoutGrow = 1; tx.layoutSizingHorizontal = 'FILL';
    await txt(d, 'caption', 'color/text/secondary', th, { parent: tx }); await txt(t, 'body2-strong', 'color/text/primary', th, { parent: tx });
    if (det) await txt(det, 'caption', 'color/text/secondary', th, { parent: tx, fillW: true });
  }
}
async function wcSaveBar(th, main, dirty) {
  const wrap = box('sticky', { dir: 'H', ax: 'MAX', theme: th, parent: main, fillW: true });
  const c = card(th, wrap, { dir: 'H', gap: 12, ay: 'CENTER', pad: [10, 16, 10, 16] }); c.layoutSizingHorizontal = 'HUG';
  await txt(dirty ? 'Ada perubahan yang belum disimpan' : 'Semua perubahan sudah tersimpan', 'body2', dirty ? 'color/text/primary' : 'color/text/secondary', th, { parent: c });
  if (dirty) await button('Batalkan', th, c, { v: 'text', size: 'small' });
  await button('Simpan', th, c, { size: 'small', disabled: !dirty });
}
async function wcLeaveSettingsBase(th, tabIdx, o = {}) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Pengaturan Cuti', h: o.h ?? 1200 });
  await wcTitleBlock(th, main, 'Pengaturan Cuti', 'Tiap perusahaan punya pengaturan sendiri. Perubahan hanya berlaku untuk pengajuan baru. Cuti yang sudah disetujui tidak ikut berubah.');
  if (o.error) await alertBox('error', 'Gagal memuat pengaturan cuti. Coba muat ulang halaman.', th, main);
  await wcCompanyBlock(th, main, true);
  if (o.loading) { const c = box('loading', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: 48, theme: th, parent: main, fillW: true }); icon('refresh', 32, 'color/primary', th, c); return { f, main, stop: true }; }
  if (o.mismatch) {
    const a = await alertBox('warning', 'Jatah yang sudah terbit tidak ikut berubah otomatis saat pengaturan diubah. Klik Sesuaikan Semua untuk memperbaruinya.\n• Budi Santoso: dari 12 hari jadi 14 hari. Masa kerja sudah mencapai aturan jatah khusus.\n• Siti Rahmawati: dari 12 hari jadi 10 hari. Jatah tahun pertama dihitung sebagian.\nPenyesuaian dicatat di riwayat sisa cuti tiap karyawan, catatan lama tetap ada. Karyawan bisa melihat kapan dan kenapa jatahnya berubah.', th, main, 'Jatah 2 karyawan belum mengikuti pengaturan ini');
    await button('Sesuaikan Semua', th, a, { v: 'text', size: 'small', color: 'default' });
  }
  await tabs(['Aturan Jatah', o.noRules ? 'Jatah Khusus' : 'Jatah Khusus (2)', 'Jenis Cuti', 'Tutup Buku'], tabIdx, th, main);
  return { f, main };
}

/* ---------- Pengaturan lembur ---------- */
const WC_RATES = {
  workday: [['Jam pertama', '0', '1', '1,5 kali'], ['Jam berikutnya', '1', 'tanpa batas', '2 kali']],
  rest_day: [['Delapan jam pertama', '0', '8', '2 kali'], ['Jam kesembilan', '8', '9', '3 kali'], ['Jam kesepuluh dan seterusnya', '9', 'tanpa batas', '4 kali']],
  public_holiday: [['Delapan jam pertama', '0', '8', '2 kali'], ['Jam kesembilan', '8', '9', '3 kali'], ['Jam kesepuluh dan seterusnya', '9', 'tanpa batas', '4 kali']],
};
async function wcOvertimeSettings(th, v) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Pengaturan Lembur', h: v === 'data' ? 1900 : 900 });
  await wcTitleBlock(th, main, 'Pengaturan Lembur', 'Berlaku per perusahaan. Perubahan hanya berlaku untuk pengajuan baru, yang lama tidak ikut berubah.');
  if (v === 'galat') await alertBox('error', 'Gagal memuat pengaturan lembur. Coba muat ulang halaman.', th, main);
  await wcCompanyField(th, main, 260);
  if (v !== 'data') { const c = box('loading', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: 48, theme: th, parent: main, fillW: true }); icon(v === 'galat' ? 'alert' : 'refresh', 32, v === 'galat' ? 'color/danger' : 'color/primary', th, c); return f; }
  const c1 = card(th, main, { gap: 0, pad: 24 });
  await txt('Batas dan aturan', 'subtitle', 'color/text/primary', th, { parent: c1 });
  gap(c1, 20);
  const fl = box('fields', { dir: 'V', gap: 20, theme: th, parent: c1, fillW: true });
  await inputField('Batas lembur per hari (jam)', '4', th, fl, { w: 340, helper: 'Maksimal 4 jam sesuai UU. Boleh lebih sedikit.' });
  await inputField('Batas lembur per minggu (jam)', '18', th, fl, { w: 340, helper: 'Maksimal 18 jam sesuai UU. Seminggu dihitung Senin sampai Minggu.' });
  const wk = box('hariKerja', { dir: 'V', gap: 4, theme: th, parent: fl, fillW: true });
  await txt('Hari kerja per minggu', 'caption', 'color/text/secondary', th, { parent: wk });
  await inputField('Hari kerja per minggu', '5 hari (Senin–Jumat)', th, wk, { w: 220, select: true });
  await txt('Memengaruhi kapan tarif tertinggi berlaku di hari libur. Kalau 6 hari kerja, tarif naik satu jam lebih awal. Tarif di bawah tidak ikut berubah otomatis.', 'caption', 'color/text/secondary', th, { parent: wk, fillW: true });
  await inputField('Batas pengajuan setelah tanggal lembur (hari)', '7', th, fl, { w: 460, helper: 'Lembur yang terlalu lama baru diajukan sulit dicek kebenarannya.' });
  const sw = box('switch', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent: fl }); toggle(true, th, sw); await txt('Wajib lampirkan foto bukti', 'body', 'color/text/primary', th, { parent: sw });
  gap(c1, 24); wcDiv(th, c1); gap(c1, 24);
  await button('Simpan Pengaturan', th, c1);
  const c2 = card(th, main, { gap: 12, pad: 24 });
  const hd = box('head', { dir: 'H', ay: 'MIN', theme: th, parent: c2, fillW: true });
  const ht = box('t', { dir: 'V', gap: 2, theme: th, parent: hd }); await txt('Tarif lembur', 'subtitle', 'color/text/primary', th, { parent: ht }); await txt('Bawaan sesuai aturan pemerintah', 'body2', 'color/text/secondary', th, { parent: ht });
  spacer(hd); await button('Kembali ke Bawaan', th, hd, { v: 'text', size: 'small', icon: 'refresh' });
  await alertBox('info', 'Tarif dihitung berurutan dari jam awal. Kalau ada jam yang bolong atau tumpang tindih, hasilnya bisa salah. Kalau ragu, klik Kembali ke Bawaan.', th, c2);
  for (const dt of ['workday', 'rest_day', 'public_holiday']) {
    const g = box('grup/' + dt, { dir: 'V', gap: 8, pad: [8, 0, 0, 0], theme: th, parent: c2, fillW: true });
    const ch = WC_DAYCHIP[dt === 'rest_day' ? 'rest' : dt === 'public_holiday' ? 'holiday' : 'workday']; await chip(ch[0], th, g, { color: ch[1], variant: 'tint' });
    await wcGrid(th, g, { rowH: 44, foot: false, cols: [{ t: 'Keterangan', w: 'fill' }, { t: 'Dari jam', w: 140, align: 'right' }, { t: 'Sampai jam', w: 140, align: 'right' }, { t: 'Kali upah', w: 140, align: 'right' }, { t: '', w: 60, align: 'right' }],
      rows: WC_RATES[dt].map((r) => [r[0], r[1], r[2], r[3], { actions: ['trash'] }]) });
  }
  return f;
}

/* ---------- Self-service ---------- */
async function wcMyLeaveBody(th, main, v) {
  if (v === 'noemp') { await alertBox('info', 'Akun ini belum terhubung ke data karyawan, jadi belum punya jatah cuti.', th, main); return; }
  if (v === 'loading') { const c = box('loading', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: 48, theme: th, parent: main, fillW: true }); icon('refresh', 32, 'color/primary', th, c); return; }
  if (v === 'galat') { await alertBox('error', 'Gagal memuat data cuti. Coba lagi.', th, main); return; }
  const act = await pageHeader(th, main, 'Cuti', 'Periode 2026-01-01 s/d 2026-12-31');
  await button('Ajukan Cuti', th, act, { icon: 'plus' });
  const bc = card(th, main, { gap: 16, pad: 24 });
  const top = box('saldo', { dir: 'H', gap: 28, ay: 'CENTER', theme: th, parent: bc });
  const big = box('big', { dir: 'V', theme: th, parent: top });
  await txt(v === 'locked' ? '5' : '8', 'h4', 'color/primary', th, { parent: big });
  await txt(v === 'locked' ? 'hari bisa dipakai sekarang' : 'hari tersisa', 'body2', 'color/text/secondary', th, { parent: big });
  const dv = box('divider', { dir: 'H', fill: 'color/border', theme: th, parent: top, fixed: [1, 56] });
  const kk = box('kk', { dir: 'V', gap: 6, theme: th, parent: top });
  await txt('Jatah periode ini: 12 hari', 'body2', 'color/text/primary', th, { parent: kk }); await txt('Sudah dipakai: 4 hari', 'body2', 'color/text/primary', th, { parent: kk });
  if (v === 'locked') await txt('3 hari baru bisa dipakai mulai 15 Jan 2027', 'body2', 'color/warning', th, { parent: kk });
  wcBar(th, bc, 4 / 12, 1062);
  await button(v === 'ledger' ? 'Sembunyikan rincian' : 'Lihat rincian sisa cuti', th, bc, { v: 'text', size: 'small' });
  if (v === 'ledger') await wcLedgerList(th, bc, WC_LEDGER);
  await txt('Riwayat pengajuan', 'subtitle', 'color/text/primary', th, { parent: main });
  if (v === 'kosong') {
    const ec = card(th, main, { pad: 0 }); await emptyState('umbrella', 'Belum ada pengajuan cuti.', 'Pengajuan cuti yang kamu kirim akan muncul di sini.', th, ec); return;
  }
  const reqs = [
    ['Cuti Tahunan', 'pending', null, '2026-12-14 s/d 2026-12-16 · 3 hari', 'Acara keluarga di luar kota'],
    ['Cuti Tahunan', 'approved', '2 hari tidak dibayar', '2026-12-22 s/d 2026-12-26 · 5 hari', 'Liburan akhir tahun'],
    ['Sakit', 'approved', null, '2026-12-03 · 1 hari', 'Demam dan flu'],
  ];
  const list = box('list', { dir: 'V', gap: 12, theme: th, parent: main, fillW: true });
  for (const r of reqs) {
    const c = card(th, list, { gap: 6, pad: 20 });
    const cr = box('chips', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c });
    await chip(r[0], th, cr); await chip(WC_STATUS[r[1]][0], th, cr, { color: WC_STATUS[r[1]][1] });
    if (r[2]) await chip(r[2], th, cr, { color: 'warning', variant: 'outlined' });
    await txt(r[3], 'body2-strong', 'color/text/primary', th, { parent: c }); await txt(r[4], 'body2', 'color/text/secondary', th, { parent: c });
  }
}
async function wcLeaveForm(th, f, v) {
  // v: 'kosong' | 'info' | 'warn' | 'attach' | 'error'
  const filled = v !== 'kosong';
  await dialog(th, f, { title: 'Ajukan Cuti', w: 480, build: async (b) => {
    const jt = box('jenis', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true });
    await txt('Jenis cuti', 'caption', 'color/text/secondary', th, { parent: jt });
    await inputField('Jenis cuti', v === 'attach' ? 'Sakit' : 'Cuti Tahunan', th, jt, { select: true });
    await txt(v === 'attach' ? 'Sakit · tidak memotong jatah tahunan' : 'Cuti Tahunan · memotong jatah tahunan', 'caption', 'color/text/secondary', th, { parent: jt });
    const dr = box('tanggal', { dir: 'H', gap: 16, theme: th, parent: b, fillW: true });
    await inputField('Mulai', filled ? '2026-12-22' : '', th, dr, { endIcon: 'calendar', required: true }); await inputField('Selesai', filled ? '2026-12-26' : '', th, dr, { endIcon: 'calendar', required: true });
    const sr = box('half', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent: b }); toggle(false, th, sr); await txt('Setengah hari', 'body', 'color/text/primary', th, { parent: sr });
    if (v === 'info') await alertBox('info', 'Saldo 8 → 3 hari.', th, b, '5 hari kerja');
    if (v === 'warn') await alertBox('warning', '3 hari dari jatah, 2 hari tidak dibayar karena melebihi sisa jatah.\n2026-12-25 tidak dihitung: Hari libur nasional', th, b, '5 hari kerja');
    if (v === 'attach') await alertBox('info', 'Saldo 8 → 8 hari.', th, b, '1 hari kerja');
    if (v === 'error') await alertBox('error', 'Sakit wajib ada lampiran dokumen.', th, b);
    await inputField('Alasan', filled ? 'Liburan akhir tahun' : '', th, b, { multiline: 2, required: true });
    await inputField('Nomor yang bisa dihubungi (opsional)', filled ? '0812-0000-1111' : '', th, b, {});
    if (v === 'attach' || v === 'error') {
      const ab = box('lampiran', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true });
      await button('Lampirkan dokumen', th, ab, { v: 'outlined', icon: 'upload', fillW: true });
      await txt('Wajib untuk Sakit. Contoh: surat dokter atau surat keterangan.', 'caption', 'color/text/secondary', th, { parent: ab, fillW: true });
    }
    wcDiv(th, b);
    await txt('Pengajuan dikirim ke atasan langsung, lalu ke HR. Jatah cuti langsung dipotong saat dikirim, dan dikembalikan kalau ditolak atau dibatalkan.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Kirim Pengajuan', v: 'contained', disabled: v === 'kosong' || v === 'error' }] });
}
async function wcMyOvertimeBody(th, main, v) {
  if (v === 'noemp') { await alertBox('info', 'Akun ini belum terhubung ke data karyawan, jadi belum bisa mengajukan lembur.', th, main); return; }
  if (v === 'galat') { await alertBox('error', 'Gagal memuat data lembur. Coba lagi.', th, main); return; }
  const act = await pageHeader(th, main, 'Lembur', 'Riwayat pengajuan lembur');
  await button('Ajukan Lembur', th, act, { icon: 'plus' });
  if (v === 'loading') { const c = box('loading', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: 48, theme: th, parent: main, fillW: true }); icon('refresh', 32, 'color/primary', th, c); return; }
  if (v === 'kosong') { const ec = card(th, main, { pad: 0 }); await emptyState('timer', 'Belum ada pengajuan lembur.', 'Pengajuan lembur yang kamu kirim akan muncul di sini.', th, ec); return; }
  const reqs = [
    ['workday', 'pending', '2026-11-20 · 19:00 – 22:00 · 3 jam', 'Menyelesaikan stok opname akhir bulan', [['1 jam × 1,5 kali'], ['2 jam × 2 kali']], 'Dibayar setara 5,5 jam'],
    ['rest', 'approved', '2026-11-21 · 09:00 – 15:00 · 6 jam', 'Perbaikan server di akhir pekan', [['6 jam × 2 kali']], 'Dibayar setara 12 jam'],
    ['holiday', 'rejected', '2026-11-12 · 08:00 – 13:00 · 5 jam', 'Menyiapkan laporan bulanan', [['5 jam × 2 kali']], 'Dibayar setara 10 jam'],
  ];
  const list = box('list', { dir: 'V', gap: 12, theme: th, parent: main, fillW: true });
  for (const r of reqs) {
    const c = card(th, list, { gap: 6, pad: 20 });
    const cr = box('chips', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c });
    await chip(WC_DAYCHIP[r[0]][0], th, cr, { color: WC_DAYCHIP[r[0]][1] }); await chip(WC_STATUS[r[1]][0], th, cr, { color: WC_STATUS[r[1]][1] });
    await txt(r[2], 'body2-strong', 'color/text/primary', th, { parent: c }); await txt(r[3], 'body2', 'color/text/secondary', th, { parent: c });
    const tr = box('tiers', { dir: 'H', gap: 8, pad: [4, 0, 0, 0], theme: th, parent: c });
    for (const t of r[4]) await chip(t[0], th, tr, { variant: 'outlined' });
    await chip(r[5], th, tr, { color: 'primary' });
  }
}
async function wcOvertimeForm(th, f, v) {
  // v: 'kosong' | 'hari-kerja' | 'libur' | 'error'
  const filled = v !== 'kosong';
  await dialog(th, f, { title: 'Ajukan Lembur', w: 480, build: async (b) => {
    await inputField('Mulai', filled ? '2026-11-21T09:00' : '', th, b, { endIcon: 'calendar', required: true });
    await inputField('Selesai', filled ? '2026-11-21T15:00' : '', th, b, { endIcon: 'calendar', required: true });
    if (v === 'hari-kerja') await alertBox('info', 'Hari kerja biasa, menurut jadwal kerja.\n1 jam pertama: 1 jam × 1,5 kali\nJam berikutnya: 2 jam × 2 kali\nDibayar setara 5,5 jam\nSudah tercatat 0 jam hari itu, 3 jam minggu itu.', th, b, '3 jam · Hari kerja');
    if (v === 'libur') await alertBox('warning', 'Tanggal itu hari libur dalam jadwal kerja.\nDelapan jam pertama: 6 jam × 2 kali\nDibayar setara 12 jam', th, b, '6 jam · Hari libur kerja');
    if (v === 'error') await alertBox('error', 'Foto bukti lembur wajib dilampirkan.', th, b);
    await inputField('Alasan lembur', filled ? 'Menyelesaikan stok opname akhir bulan' : '', th, b, { multiline: 2, required: true });
    const pb = box('bukti', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true });
    await button('Lampirkan foto bukti', th, pb, { v: 'outlined', icon: 'camera', fillW: true });
    await txt('Wajib. Atasan akan melihatnya saat memeriksa pengajuan.', 'caption', 'color/text/secondary', th, { parent: pb, fillW: true });
    wcDiv(th, b);
    await txt('Jenis hari otomatis diisi sistem dari kalender libur dan jadwal kerja. Pengajuan dikirim ke atasan langsung, lalu ke HR.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Kirim Pengajuan', v: 'contained', disabled: v === 'kosong' || v === 'error' }] });
}

/* ---------- Registrasi layar ---------- */
const wcReg = (key, title, build) => registerScreen({ key, group: WC_GROUP, title, build });

// --- Owner: Pengajuan Cuti
wcReg('owner/leave-requests', 'Pengajuan Cuti', (th) => wcBuildLeaveRequests(th, 'data'));
wcReg('owner/leave-requests-kosong', 'Pengajuan Cuti (kosong)', (th) => wcBuildLeaveRequests(th, 'kosong'));
wcReg('owner/leave-requests-galat', 'Pengajuan Cuti (galat)', (th) => wcBuildLeaveRequests(th, 'galat'));

// --- Owner: Saldo Cuti
wcReg('owner/leave-balances', 'Saldo Cuti', async (th) => (await wcBalanceList(th, 'list', 'Saldo Cuti')).f);
wcReg('owner/leave-balances-kosong', 'Saldo Cuti (kosong)', async (th) => (await wcBalanceList(th, 'kosong', 'Saldo Cuti')).f);
wcReg('owner/leave-balances-galat', 'Saldo Cuti (galat)', async (th) => (await wcBalanceList(th, 'galat', 'Saldo Cuti')).f);
wcReg('owner/leave-balances-detail', 'Saldo Cuti: dialog detail dan koreksi', async (th) => { const { f } = await wcBalanceList(th, 'dialog', 'Saldo Cuti'); await wcBalanceDialogInline(th, f, false); return f; });
wcReg('owner/leave-balances-koreksi', 'Saldo Cuti: dialog koreksi terisi', async (th) => { const { f } = await wcBalanceList(th, 'dialog', 'Saldo Cuti'); await wcBalanceDialogInline(th, f, true); return f; });
wcReg('owner/leave-balance', 'Saldo Cuti (panel detail)', async (th) => (await wcBalanceList(th, 'list', 'Saldo Cuti')).f);
wcReg('owner/leave-balance-detail', 'Saldo Cuti: panel detail karyawan', async (th) => { const { f } = await wcBalanceList(th, 'panel', 'Saldo Cuti'); await wcBalancePanelDialog(th, f, 'ringkas'); return f; });
wcReg('owner/leave-balance-koreksi', 'Saldo Cuti: panel dengan form koreksi', async (th) => { const { f } = await wcBalanceList(th, 'panel', 'Saldo Cuti'); await wcBalancePanelDialog(th, f, 'koreksi'); return f; });
wcReg('owner/leave-balance-memuat', 'Saldo Cuti: panel memuat', async (th) => { const { f } = await wcBalanceList(th, 'panel', 'Saldo Cuti'); await wcBalancePanelDialog(th, f, 'memuat'); return f; });

// --- Owner: Pengaturan Cuti
wcReg('owner/leave-settings', 'Pengaturan Cuti: Aturan Jatah', async (th) => { const { f, main } = await wcLeaveSettingsBase(th, 0, { h: 2300, mismatch: true }); await wcPolicyEditor(th, main); await wcSaveBar(th, main, false); return f; });
wcReg('owner/leave-settings-diubah', 'Pengaturan Cuti: ada perubahan (tanggal masuk)', async (th) => { const { f, main } = await wcLeaveSettingsBase(th, 0, { h: 2300 }); await wcPolicyEditor(th, main, { anniv: true }); await wcSaveBar(th, main, true); return f; });
wcReg('owner/leave-settings-memuat', 'Pengaturan Cuti (memuat)', async (th) => (await wcLeaveSettingsBase(th, 0, { h: 700, loading: true })).f);
wcReg('owner/leave-settings-galat', 'Pengaturan Cuti (galat)', async (th) => (await wcLeaveSettingsBase(th, 0, { h: 700, loading: true, error: true })).f);
async function wcSpecialTab(th, empty) {
  const { f, main } = await wcLeaveSettingsBase(th, 1, { h: 1100, noRules: empty });
  const c = card(th, main, { gap: 12, pad: 24 });
  const hd = box('head', { dir: 'H', ay: 'MIN', theme: th, parent: c, fillW: true });
  const ht = box('t', { dir: 'V', gap: 2, theme: th, parent: hd }); ht.layoutGrow = 1; ht.layoutSizingHorizontal = 'FILL';
  await txt('Jatah khusus per jabatan dan masa kerja', 'subtitle', 'color/text/primary', th, { parent: ht });
  await txt('Untuk memberi jatah lebih banyak ke sebagian karyawan. Kalau karyawan cocok dengan beberapa aturan, dipakai jatah yang paling banyak.', 'body2', 'color/text/secondary', th, { parent: ht, fillW: true });
  await button('Tambah', th, hd, { v: 'text', size: 'small', icon: 'plus' });
  if (empty) await alertBox('info', 'Belum ada jatah khusus. Semua karyawan dapat jatah dasar 12 hari.', th, c);
  else {
    await wcGrid(th, c, { foot: false, rowH: 48, cols: [{ t: 'Keterangan', w: 'fill' }, { t: 'Level jabatan minimal', w: 200, align: 'right' }, { t: 'Masa kerja minimal', w: 180, align: 'right' }, { t: 'Jatah cuti', w: 120, align: 'right' }, { t: '', w: 60, align: 'right' }],
      rows: [['Supervisor senior', 'Level 2', '3 tahun', '14 hari', { actions: ['trash'] }], ['Semua staf, loyalitas', 'Semua level', '5 tahun', '15 hari', { actions: ['trash'] }]] });
    await txt('Kedua syarat harus terpenuhi. Contoh: aturan "level 2, masa kerja 3 tahun" tidak berlaku untuk Supervisor yang baru kerja setahun.', 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
  }
  await alertBox('warning', 'Level jabatan diatur di menu Perusahaan → Jabatan. Selama semua jabatan masih Level 1, aturan dengan syarat level tidak akan berlaku untuk siapa pun.', th, c);
  return f;
}
wcReg('owner/leave-settings-khusus', 'Pengaturan Cuti: Jatah Khusus', (th) => wcSpecialTab(th, false));
wcReg('owner/leave-settings-khusus-kosong', 'Pengaturan Cuti: Jatah Khusus (kosong)', (th) => wcSpecialTab(th, true));
async function wcRuleDialog(th, filled) {
  const f = await wcSpecialTab(th, false);
  await dialog(th, f, { title: 'Tambah Jatah Khusus', w: 480, build: async (b) => {
    await txt('Karyawan yang memenuhi kedua syarat di bawah dapat jatah ini, bukan jatah dasar.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    await inputField('Keterangan', filled ? 'Supervisor senior' : '', th, b, { focus: !filled, helper: 'Catatan untuk HR, supaya ingat kenapa aturan ini dibuat.' });
    await inputField('Syarat 1: level jabatan minimal', filled ? '2' : '1', th, b, { helper: filled ? 'Hanya untuk jabatan Level 2 ke atas.' : 'Level 1 berarti berlaku untuk semua jabatan.' });
    await inputField('Syarat 2: masa kerja minimal (bulan)', filled ? '36' : '0', th, b, { helper: filled ? 'Setara 3 tahun bekerja.' : 'Isi 0 kalau berlaku sejak hari pertama kerja.' });
    await inputField('Jatah cuti (hari per tahun)', filled ? '14' : '12', th, b, {});
  }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained', disabled: !filled }] });
  return f;
}
wcReg('owner/leave-settings-aturan-kuota', 'Dialog Tambah Jatah Khusus (kosong)', (th) => wcRuleDialog(th, false));
wcReg('owner/leave-settings-aturan-kuota-terisi', 'Dialog Tambah Jatah Khusus (terisi)', (th) => wcRuleDialog(th, true));
async function wcTypesTab(th) {
  const { f, main } = await wcLeaveSettingsBase(th, 2, { h: 1300 });
  const c = card(th, main, { gap: 12, pad: 24 });
  await txt('Jenis cuti yang bisa diajukan', 'subtitle', 'color/text/primary', th, { parent: c });
  await txt('Jenis cuti bawaan sudah sesuai UU. Matikan yang tidak berlaku di perusahaan ini, nanti tidak muncul di pilihan karyawan.', 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
  await wcGrid(th, c, { foot: false, rowH: 56, cols: [{ t: 'Nama', w: 'fill' }, { t: 'Kelompok', w: 150 }, { t: 'Maksimal per kejadian', w: 190, align: 'right' }, { t: 'Memotong jatah tahunan', w: 200 }, { t: 'Aktif', w: 80, align: 'right' }],
    rows: [
      [{ t: 'Cuti Tahunan' }, { chip: 'Cuti Tahunan', color: 'default', variant: 'tint' }, 'Tanpa batas', 'Ya', { switch: true }],
      [{ t: 'Sakit', sub: 'Wajib lampiran' }, { chip: 'Sakit', color: 'default', variant: 'tint' }, 'Tanpa batas', 'Tidak', { switch: true }],
      [{ t: 'Cuti Menikah', sub: 'Wajib lampiran' }, { chip: 'Cuti Khusus', color: 'default', variant: 'tint' }, '3 hari', 'Tidak', { switch: true }],
      [{ t: 'Cuti Kematian Keluarga', sub: 'Wajib lampiran' }, { chip: 'Cuti Khusus', color: 'default', variant: 'tint' }, '2 hari', 'Tidak', { switch: true }],
      [{ t: 'Cuti Tidak Dibayar', sub: 'Tidak dibayar' }, { chip: 'Tidak Dibayar', color: 'default', variant: 'tint' }, 'Tanpa batas', 'Tidak', { switch: false }],
    ] });
  await txt('"Maksimal per kejadian" beda dengan jatah tahunan. Contoh: cuti menikah 3 hari diberikan saat menikah, dan tidak memotong jatah cuti tahunan.', 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
  await alertBox('info', 'Cuti melahirkan tidak termasuk bawaan karena aturannya bisa berubah. Tambahkan sendiri setelah memastikan jumlah hari yang berlaku.', th, c);
  return f;
}
wcReg('owner/leave-settings-jenis', 'Pengaturan Cuti: Jenis Cuti', wcTypesTab);
async function wcClosingTab(th, st) {
  const { f, main } = await wcLeaveSettingsBase(th, 3, { h: 1300 });
  const c = card(th, main, { gap: 12, pad: 24 });
  await txt('Tutup Buku Periode', 'subtitle', 'color/text/primary', th, { parent: c });
  await txt('Jalankan sekali di awal tahun untuk tahun sebelumnya. Sisa cuti dibawa ke tahun depan sesuai aturan di tab Aturan Jatah. Tidak bisa dibatalkan. Saldo minus dipindah untuk memotong jatah tahun depan.', 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
  const r = box('form', { dir: 'H', gap: 12, ay: 'MIN', theme: th, parent: c });
  await inputField('Tahun yang ditutup', st === 'sudah' ? '2024' : '2025', th, r, { w: 170 }); const bw = box('btn', { dir: 'V', pad: [10, 0, 0, 0], theme: th, parent: r }); await button('Cek Dampaknya', th, bw, { v: 'outlined' });
  if (st === 'hasil') {
    const a = await alertBox('warning', '312 hari terbawa ke tahun depan, 88 hari hangus. Saldo minus 6 hari memotong jatah tahun depan.', th, c, '48 karyawan akan terpengaruh');
    await button('Ya, Tutup Tahun 2025', th, a, { color: 'warning', size: 'small' });
  }
  if (st === 'sudah') await alertBox('success', 'Tahun 2024 sudah ditutup dan tidak bisa ditutup lagi.', th, c);
  await txt('Riwayat penutupan', 'subtitle', 'color/text/primary', th, { parent: c });
  await wcGrid(th, c, { foot: false, rowH: 56, cols: [{ t: 'Tahun', w: 90 }, { t: 'Karyawan', w: 110, align: 'right' }, { t: 'Terbawa', w: 130, align: 'right' }, { t: 'Hangus', w: 130, align: 'right' }, { t: 'Minus dipindah', w: 150, align: 'right' }, { t: 'Ditutup oleh', w: 'fill' }],
    rows: [['2024', '45', '280 hari', '70 hari', '—', { t: 'Dewi Lestari', sub: '6/1/2025' }], ['2023', '41', '240 hari', '95 hari', '4 hari', { t: 'Dewi Lestari', sub: '5/1/2024' }]] });
  return f;
}
wcReg('owner/leave-settings-tutup-buku', 'Pengaturan Cuti: Tutup Buku', (th) => wcClosingTab(th, 'awal'));
wcReg('owner/leave-settings-tutup-buku-hasil', 'Pengaturan Cuti: Tutup Buku (hasil cek dampak)', (th) => wcClosingTab(th, 'hasil'));
wcReg('owner/leave-settings-tutup-buku-sudah', 'Pengaturan Cuti: Tutup Buku (sudah ditutup)', (th) => wcClosingTab(th, 'sudah'));

// --- Owner: Lembur
async function wcOtRequests(th, v) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Pengajuan Lembur', h: v === 'data' || v === 'detail' ? 1100 : 900 });
  await wcTitleBlock(th, main, 'Pengajuan Lembur', v === 'data' || v === 'detail' ? '5 dari 5 pengajuan · disetujui 5,5 jam, dibayar setara 8,25 jam' : '0 dari 0 pengajuan · disetujui 0 jam, dibayar setara 0 jam');
  if (v === 'galat') await alertBox('error', WC_ERR_LOAD, th, main);
  if (v === 'data' || v === 'detail') await wcAlertPending(th, main, 1);
  const c = wcGridCard(th, main); const fb = wcFilterBar(th, c);
  await wcSearch(th, fb); await wcDate('Dari', '2026-11-01', th, fb); await wcDate('Sampai', '2026-11-30', th, fb); await wcStatusSel(th, fb);
  if (v === 'data' || v === 'detail') await wcGrid(th, c, { cols: WC_OT_COLS, rows: WC_OT_ROWS, foot: '1–5 dari 5' });
  else await emptyState('timer', 'Tidak ada pengajuan lembur', 'Belum ada pengajuan pada rentang tanggal ini.', th, c);
  if (v === 'detail' || v === 'detail-memuat') {
    await dialog(th, f, { title: 'Detail Lembur', w: 480, build: async (b) => {
      const pr = box('bukti', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/background', radius: 8, theme: th, parent: b, fillW: true }); pr.counterAxisSizingMode = 'FIXED'; pr.resize(100, v === 'detail' ? 220 : 140); pr.layoutSizingHorizontal = 'FILL';
      icon(v === 'detail' ? 'camera' : 'refresh', 32, 'color/text/secondary', th, pr);
      wcDiv(th, b);
      const inf = box('info', { dir: 'V', gap: 8, theme: th, parent: b, fillW: true });
      await txt('Budi Santoso · 2026-11-20', 'body2-strong', 'color/text/primary', th, { parent: inf });
      await txt('19:00 – 22:00 · 3 jam', 'body2', 'color/text/secondary', th, { parent: inf });
      await txt('Hari kerja. Hari kerja biasa menurut jadwal kerja.', 'body2', 'color/text/secondary', th, { parent: inf, fillW: true });
      await txt('Menyelesaikan stok opname akhir bulan', 'body2', 'color/text/primary', th, { parent: inf, fillW: true });
      wcDiv(th, b);
      await txt('Rincian perhitungan', 'subtitle', 'color/text/primary', th, { parent: b });
      const rr = box('rincian', { dir: 'V', gap: 6, theme: th, parent: b, fillW: true });
      await wcRow(th, rr, 'Jam pertama', '1 jam × 1,5 kali'); await wcRow(th, rr, 'Jam berikutnya', '2 jam × 2 kali'); wcDiv(th, rr);
      await wcRow(th, rr, 'Total dibayar', '5,5 jam', true);
    }, actions: [] });
  }
  return f;
}
wcReg('owner/overtime-requests', 'Pengajuan Lembur', (th) => wcOtRequests(th, 'data'));
wcReg('owner/overtime-requests-kosong', 'Pengajuan Lembur (kosong)', (th) => wcOtRequests(th, 'kosong'));
wcReg('owner/overtime-requests-galat', 'Pengajuan Lembur (galat)', (th) => wcOtRequests(th, 'galat'));
wcReg('owner/overtime-requests-detail', 'Pengajuan Lembur: dialog Detail Lembur', (th) => wcOtRequests(th, 'detail'));
wcReg('owner/overtime-requests-detail-memuat', 'Pengajuan Lembur: dialog Detail (bukti memuat)', (th) => wcOtRequests(th, 'detail-memuat'));

async function wcOtSummary(th, v) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Rekap Lembur', h: 950 });
  const act = await pageHeader(th, main, 'Rekap Lembur', v === 'data' ? '5 karyawan · 21,5 jam lembur, setara 36,25 jam' : '0 karyawan · 0 jam lembur, setara 0 jam');
  await button('Export Excel', th, act, { icon: 'download', disabled: v !== 'data' });
  if (v === 'galat') await alertBox('error', 'Gagal memuat rekap lembur. Coba lagi.', th, main);
  await alertBox('info', 'Hanya berisi lembur yang sudah disetujui penuh. Jam Dibayar sudah dikali tarif lembur, tinggal dikali upah per jam untuk payroll.', th, main);
  const c = wcGridCard(th, main); const fb = wcFilterBar(th, c);
  await wcDate('Dari', '2026-11-01', th, fb); await wcDate('Sampai', '2026-11-30', th, fb); await inputField('Perusahaan', 'Semua Perusahaan', th, fb, { w: 220, select: true });
  if (v === 'data') await wcGrid(th, c, { cols: [{ t: 'No. Karyawan', w: 140 }, { t: 'Nama', w: 'fill' }, { t: 'Pengajuan', w: 110, align: 'right' }, { t: 'Total Jam', w: 130, align: 'right' }, { t: 'Jam Dibayar', w: 140, align: 'right' }],
    rows: [['EMP-000003', 'Budi Santoso', '4', '9 jam', '15 jam'], ['EMP-000013', 'Eko Prasetyo', '2', '6 jam', '12 jam'], ['EMP-000015', 'Maya Anggraini', '2', '2,5 jam', '3,75 jam'], ['EMP-000019', 'Putri Handayani', '1', '2 jam', '3 jam'], ['EMP-000021', 'Doni Setiawan', '1', '2 jam', '2,5 jam']], foot: '1–5 dari 5' });
  else await emptyState('clock', 'Belum ada rekap lembur', 'Tidak ada lembur yang disetujui pada periode ini.', th, c);
  return f;
}
wcReg('owner/overtime-summary', 'Rekap Lembur', (th) => wcOtSummary(th, 'data'));
wcReg('owner/overtime-summary-kosong', 'Rekap Lembur (kosong)', (th) => wcOtSummary(th, 'kosong'));
wcReg('owner/overtime-summary-galat', 'Rekap Lembur (galat)', (th) => wcOtSummary(th, 'galat'));
wcReg('owner/overtime-settings', 'Pengaturan Lembur', (th) => wcOvertimeSettings(th, 'data'));
wcReg('owner/overtime-settings-memuat', 'Pengaturan Lembur (memuat)', (th) => wcOvertimeSettings(th, 'memuat'));
wcReg('owner/overtime-settings-galat', 'Pengaturan Lembur (galat)', (th) => wcOvertimeSettings(th, 'galat'));

// --- Self-service: owner (panel HR) dan karyawan
async function wcSelfLeave(th, role, v, form) {
  const active = role === 'owner' ? 'Cuti ' : 'Cuti  ';
  const { f, main } = await page('x', th, { role, active, h: form ? 1500 : 1100 });
  await wcMyLeaveBody(th, main, v);
  if (form) await wcLeaveForm(th, f, form);
  return f;
}
async function wcSelfOt(th, role, v, form) {
  const active = role === 'owner' ? 'Lembur ' : 'Lembur  ';
  const { f, main } = await page('x', th, { role, active, h: form ? 1300 : 1000 });
  await wcMyOvertimeBody(th, main, v);
  if (form) await wcOvertimeForm(th, f, form);
  return f;
}
for (const [role, pre, who] of [['owner', 'owner/my-', 'Saya (HR)'], ['employee', 'employee/', 'Karyawan']]) {
  const L = role === 'owner' ? 'my-leave' : 'leave', O = role === 'owner' ? 'my-overtime' : 'overtime';
  wcReg(pre + L, `Cuti ${who}`, (th) => wcSelfLeave(th, role, 'data'));
  wcReg(pre + L + '-rincian', `Cuti ${who}: rincian sisa dibuka`, (th) => wcSelfLeave(th, role, 'ledger'));
  wcReg(pre + L + '-terkunci', `Cuti ${who}: sebagian jatah belum bisa dipakai`, (th) => wcSelfLeave(th, role, 'locked'));
  wcReg(pre + L + '-kosong', `Cuti ${who} (belum ada pengajuan)`, (th) => wcSelfLeave(th, role, 'kosong'));
  wcReg(pre + L + '-galat', `Cuti ${who} (galat)`, (th) => wcSelfLeave(th, role, 'galat'));
  wcReg(pre + L + '-memuat', `Cuti ${who} (memuat)`, (th) => wcSelfLeave(th, role, 'loading'));
  wcReg(pre + L + '-tanpa-karyawan', `Cuti ${who} (akun belum terhubung karyawan)`, (th) => wcSelfLeave(th, role, 'noemp'));
  wcReg(pre + L + '-ajukan', `Cuti ${who}: dialog Ajukan Cuti (kosong)`, (th) => wcSelfLeave(th, role, 'data', 'kosong'));
  wcReg(pre + L + '-ajukan-pratinjau', `Cuti ${who}: dialog Ajukan Cuti (pratinjau)`, (th) => wcSelfLeave(th, role, 'data', 'info'));
  wcReg(pre + L + '-ajukan-melebihi', `Cuti ${who}: dialog Ajukan Cuti (melebihi jatah)`, (th) => wcSelfLeave(th, role, 'data', 'warn'));
  wcReg(pre + L + '-ajukan-lampiran', `Cuti ${who}: dialog Ajukan Cuti (wajib lampiran)`, (th) => wcSelfLeave(th, role, 'data', 'attach'));
  wcReg(pre + L + '-ajukan-galat', `Cuti ${who}: dialog Ajukan Cuti (galat)`, (th) => wcSelfLeave(th, role, 'data', 'error'));
  wcReg(pre + O, `Lembur ${who}`, (th) => wcSelfOt(th, role, 'data'));
  wcReg(pre + O + '-kosong', `Lembur ${who} (belum ada pengajuan)`, (th) => wcSelfOt(th, role, 'kosong'));
  wcReg(pre + O + '-galat', `Lembur ${who} (galat)`, (th) => wcSelfOt(th, role, 'galat'));
  wcReg(pre + O + '-memuat', `Lembur ${who} (memuat)`, (th) => wcSelfOt(th, role, 'loading'));
  wcReg(pre + O + '-tanpa-karyawan', `Lembur ${who} (akun belum terhubung karyawan)`, (th) => wcSelfOt(th, role, 'noemp'));
  wcReg(pre + O + '-ajukan', `Lembur ${who}: dialog Ajukan Lembur (kosong)`, (th) => wcSelfOt(th, role, 'data', 'kosong'));
  wcReg(pre + O + '-ajukan-hari-kerja', `Lembur ${who}: dialog Ajukan Lembur (pratinjau hari kerja)`, (th) => wcSelfOt(th, role, 'data', 'hari-kerja'));
  wcReg(pre + O + '-ajukan-libur', `Lembur ${who}: dialog Ajukan Lembur (pratinjau hari libur)`, (th) => wcSelfOt(th, role, 'data', 'libur'));
  wcReg(pre + O + '-ajukan-galat', `Lembur ${who}: dialog Ajukan Lembur (galat)`, (th) => wcSelfOt(th, role, 'data', 'error'));
}
