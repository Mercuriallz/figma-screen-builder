/* =====================================================================
 * Daily Timesheet (karyawan + panel HR) — prefiks wt / WT_
 * Sumber: TimesheetListView/Table/FormDialog/ImportDialog/DashboardView/OptionsSettings.tsx, lib/timesheet.ts
 * ===================================================================== */
const WT_GROUP = 'Daily Timesheet';
registerIcons({
  'wt-eyeoff': '<path d="M3 3l18 18"/><path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.8M6.5 7.5A17 17 0 0 0 2 12s4 7 10 7c1.5 0 2.8-.4 4-1"/>',
});

const WT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WT_VIS = { private: ['Private', 'default'], team: ['Team', 'info'], all: ['All', 'success'] };
const WT_SUBTITLE = {
  mine: ['My Activity', 'Catatan kerja harian Anda'],
  team: ['Team Activity', 'Aktivitas rekan departemen yang dibagikan (Team atau All)'],
  shared: ['Shared Activity', 'Aktivitas yang dibagikan ke semua orang (All)'],
  admin: ['All Department', 'Aktivitas semua departemen yang dibagikan. Yang Private tidak ditampilkan.'],
};

const WT_MINE = [
  { vis: 'all', type: 'Rutin', loc: 'Office', shift: 'Non-shift', title: 'Menyiapkan laporan mingguan tim Teknologi Informasi', output: 'Laporan mingguan (PDF)', date: '24 Nov 2026', time: '08:30 - 11:00', dur: '2 jam 30 mnt', appr: 'Dewi Lestari' },
  { vis: 'team', type: 'Non-rutin', loc: 'Client', shift: 'Non-shift', title: 'Rapat kebutuhan sistem dengan PT Maju Bersama', output: 'Notulen rapat', date: '24 Nov 2026', time: '13:00 - 14:30', dur: '1 jam 30 mnt', appr: 'Dewi Lestari' },
  { vis: 'private', type: 'Rutin', loc: 'Office', shift: 'Non-shift', title: 'Perbaikan galat modul absensi', output: '', date: '23 Nov 2026', time: '09:00 - 12:00', dur: '3 jam', appr: '' },
  { vis: 'all', type: 'Rutin', loc: 'Site', shift: 'Shift', title: 'Pemeriksaan perangkat jaringan kantor cabang', output: 'Daftar perangkat terperiksa', date: '22 Nov 2026', time: '07:00 - 07:45', dur: '45 mnt', appr: 'Hendra Gunawan' },
  { vis: 'team', type: 'Non-rutin', loc: 'Office', shift: 'Non-shift', title: 'Pelatihan penggunaan aplikasi untuk staf baru', output: 'Materi pelatihan', date: '21 Nov 2026', time: '10:00 - 12:00', dur: '2 jam', appr: 'Dewi Lestari' },
];
const WT_OTHERS = [
  { vis: 'team', type: 'Rutin', loc: 'Office', shift: 'Non-shift', title: 'Rekonsiliasi pengeluaran operasional bulan berjalan', output: 'Lembar rekonsiliasi', date: '24 Nov 2026', time: '08:00 - 10:30', dur: '2 jam 30 mnt', appr: 'Rina Kartika', owner: 'Siti Rahmawati', dept: 'Keuangan' },
  { vis: 'all', type: 'Non-rutin', loc: 'Client', shift: 'Non-shift', title: 'Presentasi jadwal pengiriman kepada pelanggan', output: 'Slide presentasi', date: '24 Nov 2026', time: '11:00 - 12:00', dur: '1 jam', appr: 'Agus Wijaya', owner: 'Eko Prasetyo', dept: 'Operasional' },
  { vis: 'all', type: 'Rutin', loc: 'Office', shift: 'Non-shift', title: 'Pembaruan data karyawan baru di sistem', output: '12 data terperbarui', date: '23 Nov 2026', time: '09:00 - 11:15', dur: '2 jam 15 mnt', appr: 'Dewi Lestari', owner: 'Maya Anggraini', dept: 'SDM' },
  { vis: 'team', type: 'Rutin', loc: 'Site', shift: 'Shift', title: 'Pengecekan stok gudang akhir bulan', output: '', date: '22 Nov 2026', time: '14:00 - 16:00', dur: '2 jam', appr: 'Agus Wijaya', owner: 'Doni Setiawan', dept: 'Operasional' },
];

/** Kolom/baris dengan lebar tetap di dalam auto-layout. */
function wtFixed(name, dir, w, parent, th, o = {}) {
  const b = box(name, { dir, gap: o.gap ?? 0, ax: o.ax, ay: o.ay, theme: th, parent });
  b.resize(w, 10);
  if (dir === 'V') { b.counterAxisSizingMode = 'FIXED'; b.primaryAxisSizingMode = 'AUTO'; } else { b.primaryAxisSizingMode = 'FIXED'; b.counterAxisSizingMode = 'AUTO'; }
  return b;
}
/** Kotak tinggi tetap, lebar FILL. */
function wtFillBox(name, dir, h, parent, th, o = {}) {
  const b = box(name, { dir, gap: o.gap ?? 0, ax: o.ax, ay: o.ay, pad: o.pad ?? 0, theme: th, parent });
  b.resize(100, h); b.layoutSizingHorizontal = 'FILL';
  if (dir === 'H') { b.counterAxisSizingMode = 'FIXED'; b.primaryAxisSizingMode = 'FIXED'; } else { b.primaryAxisSizingMode = 'FIXED'; b.counterAxisSizingMode = 'FIXED'; }
  return b;
}
function wtBar(th, parent, w, h, token) {
  const r = figma.createRectangle(); r.name = 'bar'; r.resize(w, Math.max(2, h)); r.cornerRadius = 2; r.fills = [pv(th, token)]; parent.appendChild(r); return r;
}

/* ---------- Kartu aktivitas ---------- */
async function wtActivity(th, parent, r, o = {}) {
  const c = box('Activity', { dir: 'H', gap: 16, pad: 14, fill: 'color/surface', stroke: 'color/border', radius: 10, ay: 'CENTER', theme: th, parent, fillW: true });
  const left = box('info', { dir: 'V', gap: 4, theme: th, parent: c }); left.layoutGrow = 1; left.layoutSizingHorizontal = 'FILL';
  const chips = box('chips', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: left });
  await chip(WT_VIS[r.vis][0], th, chips, { color: WT_VIS[r.vis][1] });
  await chip(r.type, th, chips, { variant: 'outlined' }); await chip(r.loc, th, chips, { variant: 'outlined' }); await chip(r.shift, th, chips, { variant: 'outlined' });
  await txt(r.title, 'subtitle', 'color/text/primary', th, { parent: left, fillW: true });
  if (r.output) await txt('Output: ' + r.output, 'body2', 'color/text/secondary', th, { parent: left, fillW: true });
  if (o.showOwner) await txt(r.owner + (r.dept ? ' · ' + r.dept : ''), 'caption', 'color/text/secondary', th, { parent: left, fillW: true });
  const mid = wtFixed('tanggal', 'V', 210, c, th, { gap: 2 });
  await txt(r.date, 'body2', 'color/text/primary', th, { parent: mid, fillW: true });
  await txt(r.time + ' · ' + r.dur, 'body2', 'color/text/secondary', th, { parent: mid, fillW: true });
  const right = wtFixed('approved', 'H', 170, c, th, { ay: 'CENTER', ax: 'SPACE_BETWEEN' });
  const ap = box('approved by', { dir: 'V', theme: th, parent: right });
  await txt('Approved By', 'caption', 'color/text/secondary', th, { parent: ap });
  await txt(r.appr || '-', 'body2', 'color/text/primary', th, { parent: ap });
  if (o.actions) {
    const ac = box('aksi', { dir: 'H', theme: th, parent: right });
    await iconButton('edit', th, ac, { size: 32, iconSize: 18 }); await iconButton('trash', th, ac, { size: 32, iconSize: 18, color: 'color/danger' });
  }
  return c;
}

/** Bar filter daftar. scope 'mine' menambah Visibilitas. */
async function wtFilters(th, parent, scope, o = {}) {
  const row = box('Filter', { dir: 'H', gap: 12, ay: 'MIN', theme: th, parent, fillW: true });
  await inputField('Cari', o.search ?? '', th, row, { w: 220 });
  await inputField('Dari', '', th, row, { w: 140 });
  await inputField('Sampai', '', th, row, { w: 140 });
  if (scope === 'mine') await inputField('Visibilitas', o.vis ?? 'Semua', th, row, { w: 130, select: true });
  await inputField('Urutkan', 'Created Date', th, row, { w: 150, select: true });
  await inputField('Arah', 'Desc', th, row, { w: 100, select: true });
  await inputField('Per halaman', '30', th, row, { w: 110, select: true });
  return row;
}

/**
 * Halaman daftar. o: role, active, rows, state 'data'|'kosong'|'galat'|'memuat'|'tanpa-karyawan', h.
 * Mengembalikan { f, main } supaya dialog bisa ditumpuk.
 */
async function wtListPage(th, scope, o) {
  const { f, main } = await page('x', th, { role: o.role, active: o.active, h: o.h ?? 1100 });
  const state = o.state ?? 'data';
  if (state === 'tanpa-karyawan') { await alertBox('info', 'Akun ini belum terhubung ke data karyawan, jadi belum bisa mencatat aktivitas.', th, main); return { f, main }; }
  const act = await pageHeader(th, main, WT_SUBTITLE[scope][0], WT_SUBTITLE[scope][1]);
  if (scope === 'mine' || scope === 'admin') await button('Download', th, act, { v: 'outlined', icon: 'download' });
  if (scope === 'mine') { await button('Import', th, act, { color: 'success', icon: 'upload' }); await button('Add New', th, act, { icon: 'plus' }); }
  await wtFilters(th, main, scope);
  if (state === 'galat') { await alertBox('error', 'Gagal memuat aktivitas. Coba lagi.', th, main); return { f, main }; }
  if (state === 'memuat') {
    const w = box('loading', { dir: 'H', ax: 'CENTER', pad: 48, theme: th, parent: main, fillW: true });
    box('spinner', { dir: 'H', radius: 999, stroke: 'color/primary', sw: 4, theme: th, parent: w, fixed: [40, 40] });
    return { f, main };
  }
  if (state === 'kosong') { await alertBox('info', 'Belum ada aktivitas.', th, main); return { f, main }; }
  const rows = o.rows;
  await txt(`Showing 1 to ${rows.length} of ${rows.length} results`, 'body2', 'color/text/secondary', th, { parent: main });
  const list = box('TimesheetTable', { dir: 'V', gap: 10, theme: th, parent: main, fillW: true });
  for (const r of rows) await wtActivity(th, list, r, { showOwner: scope !== 'mine', actions: scope === 'mine' });
  return { f, main };
}

/* ---------- Dashboard ---------- */
const WT_SER = {
  summary: { previous: [120, 132, 128, 141, 150, 138, 160, 155, 149, 162, 158, 170], current: [135, 140, 152, 148, 165, 172, 168, 175, 181, 190, 98, 0] },
  mine: { previous: [14, 18, 16, 20, 22, 19, 24, 21, 20, 23, 22, 25], current: [17, 19, 21, 18, 25, 26, 23, 27, 29, 31, 14, 0] },
  department: { previous: [38, 41, 40, 46, 48, 44, 52, 50, 47, 53, 51, 55], current: [42, 45, 49, 47, 54, 57, 55, 58, 60, 63, 30, 0] },
  team: [{ name: 'Budi Santoso', previous: 210, current: 245 }, { name: 'Putri Handayani', previous: 188, current: 201 }, { name: 'Hendra Gunawan', previous: 164, current: 152 }, { name: 'Maya Anggraini', previous: 130, current: 176 }],
};
async function wtLegend(th, parent, a, b) {
  const l = box('Legend', { dir: 'H', gap: 16, ay: 'CENTER', ax: 'CENTER', theme: th, parent, fillW: true });
  for (const [t, tok] of [[a, 'color/text/disabled'], [b, 'color/primary']]) {
    const i = box('item', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: l });
    wtBar(th, i, 10, 10, tok); await txt(t, 'caption', 'color/text/secondary', th, { parent: i });
  }
}
async function wtPanel(th, parent, title, s, y) {
  const c = card(th, parent, { gap: 12 });
  await txt(title, 'subtitle', 'color/text/primary', th, { parent: c });
  const max = Math.max(...s.previous, ...s.current);
  const area = wtFillBox('chart', 'H', 220, c, th, { gap: 6, ay: 'MAX', pad: [0, 8, 0, 8] });
  area.strokes = [pv(th, 'color/border')]; area.strokeWeight = 1; area.strokeTopWeight = 0; area.strokeLeftWeight = 0; area.strokeRightWeight = 0;
  for (let i = 0; i < 12; i++) {
    const g = box('bulan ' + WT_MONTHS[i], { dir: 'H', gap: 3, ax: 'CENTER', ay: 'MAX', theme: th, parent: area }); g.layoutGrow = 1; g.layoutSizingHorizontal = 'FILL';
    wtBar(th, g, 14, (s.previous[i] / max) * 200, 'color/text/disabled'); wtBar(th, g, 14, (s.current[i] / max) * 200, 'color/primary');
  }
  const lab = box('bulan', { dir: 'H', gap: 6, pad: [0, 8, 0, 8], theme: th, parent: c, fillW: true });
  for (const m of WT_MONTHS) { const w = box('m', { dir: 'H', ax: 'CENTER', theme: th, parent: lab }); w.layoutGrow = 1; w.layoutSizingHorizontal = 'FILL'; await txt(m, 'caption', 'color/text/secondary', th, { parent: w }); }
  await wtLegend(th, c, String(y - 1), String(y));
  return c;
}
async function wtTeamPanel(th, parent, y) {
  const c = card(th, parent, { gap: 14 });
  await txt('Team Activity', 'subtitle', 'color/text/primary', th, { parent: c });
  const max = Math.max(...WT_SER.team.flatMap((t) => [t.previous, t.current]));
  for (const t of WT_SER.team) {
    const r = box('baris ' + t.name, { dir: 'H', gap: 16, ay: 'CENTER', theme: th, parent: c, fillW: true });
    const n = await txt(t.name, 'body2', 'color/text/primary', th, { parent: r }); n.resize(140, n.height); n.textAutoResize = 'HEIGHT';
    const bars = box('bars', { dir: 'V', gap: 4, theme: th, parent: r });
    for (const [v, tok] of [[t.previous, 'color/text/disabled'], [t.current, 'color/primary']]) {
      const br = box('bar row', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: bars });
      wtBar(th, br, Math.round((v / max) * 760), 14, tok); await txt(String(v), 'caption', 'color/text/secondary', th, { parent: br });
    }
  }
  await wtLegend(th, c, String(y - 1), String(y));
  return c;
}
async function wtDashPage(th, role, active, o = {}) {
  const { f, main } = await page('x', th, { role, active, h: o.h ?? 1900 });
  if (o.error) { await alertBox('error', 'Gagal memuat dashboard. Coba lagi.', th, main); return f; }
  const y = 2026;
  await (async () => {
    const t = box('titles', { dir: 'V', gap: 4, theme: th, parent: main, fillW: true });
    await txt('Dashboard Timesheet', 'h5', 'color/text/primary', th, { parent: t });
    await txt(`Jumlah aktivitas per bulan, ${y - 1} dibanding ${y}`, 'body2', 'color/text/secondary', th, { parent: t });
  })();
  await wtPanel(th, main, 'Summary Activity (All Department)', WT_SER.summary, y);
  await wtPanel(th, main, 'My Activity', WT_SER.mine, y);
  if (o.dept !== false) await wtPanel(th, main, 'Department Activity', WT_SER.department, y);
  if (o.team !== false) await wtTeamPanel(th, main, y);
  return f;
}

/* ---------- Dialog ---------- */
function wtRadio(th, parent, selected) {
  const o = box('Radio', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 999, stroke: selected ? 'color/primary' : 'color/text/secondary', sw: 2, theme: th, parent, fixed: [18, 18] });
  if (selected) box('dot', { dir: 'H', radius: 999, fill: 'color/primary', theme: th, parent: o, fixed: [8, 8] });
  return o;
}
async function wtActivityForm(th, parent, i, v) {
  const n = String(i + 1).padStart(2, '0');
  const b = box('Activity ' + n, { dir: 'V', gap: 12, pad: 16, fill: 'color/background', radius: 10, theme: th, parent, fillW: true });
  await txt(`Activity ${n} *`, 'body2-strong', 'color/text/primary', th, { parent: b });
  await inputField(`Activity ${n}…`, v.title, th, b);
  await inputField('Output…', v.output, th, b);
  const r1 = box('baris 1', { dir: 'H', gap: 8, theme: th, parent: b, fillW: true });
  await inputField('Shift', v.shift, th, r1, { w: 124, select: true }); await inputField('Tanggal', v.date, th, r1, { w: 124 });
  await inputField('Mulai', v.start, th, r1, { w: 124 }); await inputField('Selesai', v.end, th, r1, { w: 124 });
  const r2 = box('baris 2', { dir: 'H', gap: 8, theme: th, parent: b, fillW: true });
  await inputField('Lokasi', v.loc, th, r2, { w: 168, select: true }); await inputField('Jenis', v.type, th, r2, { w: 168, select: true });
  await inputField('Approved By…', v.appr, th, r2, { w: 168 });
  const rg = box('visibilitas', { dir: 'H', gap: 20, ay: 'CENTER', theme: th, parent: b });
  for (const k of ['private', 'team', 'all']) { const it = box('opsi', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: rg }); wtRadio(th, it, k === v.vis); await txt(WT_VIS[k][0], 'body2', 'color/text/primary', th, { parent: it }); }
  return b;
}
const WT_BLANK = { title: '', output: '', shift: 'Non-shift', date: '24/11/2026', start: '09:41', end: '09:41', loc: 'Office', type: 'Rutin', appr: '', vis: 'private' };
const WT_FILLED = { title: 'Menyiapkan laporan mingguan tim Teknologi Informasi', output: 'Laporan mingguan (PDF)', shift: 'Non-shift', date: '24/11/2026', start: '08:30', end: '11:00', loc: 'Office', type: 'Rutin', appr: 'Dewi Lestari', vis: 'all' };
async function wtFormDialog(th, role, active, o) {
  const { f } = await wtListPage(th, 'mine', { role, active, rows: WT_MINE, h: o.h ?? 1500 });
  await dialog(th, f, {
    title: o.edit ? 'Ubah Aktivitas' : 'Add New', w: 600,
    build: async (b) => {
      await alertBox('info', 'Your current position at -6.200000, 106.816666 (See on Maps).', th, b);
      for (const [i, v] of o.items.entries()) await wtActivityForm(th, b, i, v);
      if (!o.edit) { const r = box('add more', { dir: 'H', ax: 'MAX', theme: th, parent: b, fillW: true }); await button('Add More', th, r, { color: 'warning', size: 'small', icon: 'plus' }); }
      if (o.error) await alertBox('error', o.error, th, b);
    },
    actions: [{ label: 'Cancel' }, { label: 'Submit', v: 'contained', disabled: !!o.disabled }],
  });
  return f;
}
async function wtImportDialog(th, role, active, o = {}) {
  const { f } = await wtListPage(th, 'mine', { role, active, rows: WT_MINE });
  await dialog(th, f, {
    title: 'Import File', w: 600,
    build: async (b) => {
      const r = box('pilih berkas', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: b, fillW: true });
      await button('Telusuri…', th, r, { v: 'outlined' });
      await txt(o.file ?? 'Tidak ada berkas dipilih.', 'body2', 'color/text/secondary', th, { parent: r });
      await txt('* Hanya menerima format *.csv dan *.xlsx, ukuran maksimal 5 MB, maksimal 500 baris. Jika ada satu baris yang salah, tidak ada data yang disimpan.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
      await alertBox('warning', 'Jika unggah *.xls gagal, simpan ulang sebagai *.xlsx atau *.csv.', th, b);
      if (o.errors) {
        const a = await alertBox('error', o.errors.msg, th, b);
        const tb = a.children[1];
        for (const l of o.errors.rows) await txt('• ' + l, 'body2', 'color/text/primary', th, { parent: tb, fillW: true });
      }
    },
    actions: [{ label: 'Download Template' }, { label: 'Cancel' }, { label: 'Upload', v: 'contained', color: 'success', disabled: !o.file }],
  });
  return f;
}
async function wtDeleteDialog(th, role, active) {
  const { f } = await wtListPage(th, 'mine', { role, active, rows: WT_MINE });
  await dialog(th, f, {
    title: 'Hapus aktivitas', w: 440,
    build: async (b) => { await txt('Hapus aktivitas "Perbaikan galat modul absensi"?', 'body', 'color/text/primary', th, { parent: b, fillW: true }); },
    actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }],
  });
  return f;
}

/* ---------- Pengaturan Pilihan ---------- */
async function wtOptChip(th, parent, label, active) {
  const c = box('Chip/' + label, { dir: 'H', gap: 8, ay: 'CENTER', pad: [0, 10, 0, 14], radius: 16, fill: active ? 'color/primary' : null, stroke: active ? null : 'color/border', theme: th, parent });
  c.counterAxisSizingMode = 'FIXED'; c.resize(40, 32); c.primaryAxisSizingMode = 'AUTO';
  const fg = active ? onPrimary(th) : 'color/text/secondary';
  await txt(label, 'body2', fg, th, { parent: c });
  icon(active ? 'wt-eyeoff' : 'eye', 16, fg, th, c);
  return c;
}
const WT_OPT_KINDS = [
  ['Lokasi Kerja', 'Pilihan dropdown lokasi di formulir, mis. Office, Client, Site.', [['Office', 1], ['Client', 1], ['Site', 1], ['Work From Home', 0]], 'Pilihan baru…'],
  ['Jenis Pekerjaan', 'Pilihan dropdown jenis pekerjaan, mis. Rutin, Non-rutin.', [['Rutin', 1], ['Non-rutin', 1], ['Proyek', 1], ['Lembur Khusus', 0]], 'Pilihan baru…'],
];
async function wtSettingsPage(th, o = {}) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Pengaturan Pilihan', h: o.h ?? 900 });
  if (o.error) { await alertBox('error', 'Gagal memuat pilihan. Coba lagi.', th, main); return f; }
  const t = box('titles', { dir: 'V', gap: 4, theme: th, parent: main, fillW: true });
  await txt('Pengaturan Timesheet', 'h5', 'color/text/primary', th, { parent: t });
  await txt('Atur pilihan dropdown di formulir Daily Timesheet.', 'body2', 'color/text/secondary', th, { parent: t });
  for (const [title, hint, chips, ph] of WT_OPT_KINDS) {
    const c = card(th, main, { gap: 8 });
    await txt(title, 'subtitle', 'color/text/primary', th, { parent: c });
    await txt(hint, 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
    const row = box('chips', { dir: 'H', gap: 8, ay: 'CENTER', pad: [8, 0, 8, 0], theme: th, parent: c, fillW: true });
    for (const [l, a] of chips) await wtOptChip(th, row, l, !!a);
    const add = box('tambah', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c });
    await inputField(ph, o.draft && title === 'Lokasi Kerja' ? o.draft : '', th, add, { w: 280 });
    await button('Tambah', th, add, { icon: 'plus' });
  }
  return f;
}

/* ---------- Registrasi layar ---------- */
const WT_EMP = { role: 'employee' };
const WT_OWN = { role: 'owner' };
const WT_ACT_EMP_MY = 'My Activity', WT_ACT_OWN_MY = 'Timesheet: My Activity';
const wtReg = (key, title, build) => registerScreen({ key, group: WT_GROUP, title, build });

// Karyawan
wtReg('employee/timesheet-dashboard', 'Karyawan - Dashboard', (th) => wtDashPage(th, 'employee', 'Dashboard'));
wtReg('employee/timesheet-dashboard-tanpa-departemen', 'Karyawan - Dashboard (tanpa departemen/tim)', (th) => wtDashPage(th, 'employee', 'Dashboard', { dept: false, team: false, h: 1250 }));
wtReg('employee/timesheet-dashboard-galat', 'Karyawan - Dashboard galat', (th) => wtDashPage(th, 'employee', 'Dashboard', { error: true, h: 600 }));
wtReg('employee/timesheet-my', 'Karyawan - My Activity', async (th) => (await wtListPage(th, 'mine', { ...WT_EMP, active: WT_ACT_EMP_MY, rows: WT_MINE })).f);
wtReg('employee/timesheet-my-kosong', 'Karyawan - My Activity kosong', async (th) => (await wtListPage(th, 'mine', { ...WT_EMP, active: WT_ACT_EMP_MY, state: 'kosong', h: 700 })).f);
wtReg('employee/timesheet-my-galat', 'Karyawan - My Activity galat', async (th) => (await wtListPage(th, 'mine', { ...WT_EMP, active: WT_ACT_EMP_MY, state: 'galat', h: 700 })).f);
wtReg('employee/timesheet-my-memuat', 'Karyawan - My Activity memuat', async (th) => (await wtListPage(th, 'mine', { ...WT_EMP, active: WT_ACT_EMP_MY, state: 'memuat', h: 700 })).f);
wtReg('employee/timesheet-my-tanpa-karyawan', 'Karyawan - My Activity akun belum terhubung', async (th) => (await wtListPage(th, 'mine', { ...WT_EMP, active: WT_ACT_EMP_MY, state: 'tanpa-karyawan', h: 600 })).f);
wtReg('employee/timesheet-my-tambah', 'Karyawan - Dialog Add New', (th) => wtFormDialog(th, 'employee', WT_ACT_EMP_MY, { items: [WT_BLANK], disabled: true, h: 1300 }));
wtReg('employee/timesheet-my-tambah-banyak', 'Karyawan - Dialog Add New (Add More)', (th) => wtFormDialog(th, 'employee', WT_ACT_EMP_MY, { items: [WT_FILLED, { ...WT_BLANK, title: 'Rapat koordinasi proyek', output: 'Notulen rapat', start: '13:00', end: '14:30', type: 'Non-rutin', vis: 'team' }], h: 1700 }));
wtReg('employee/timesheet-my-tambah-galat', 'Karyawan - Dialog Add New galat simpan', (th) => wtFormDialog(th, 'employee', WT_ACT_EMP_MY, { items: [WT_FILLED], error: 'Gagal menyimpan. Coba lagi.', h: 1400 }));
wtReg('employee/timesheet-my-ubah', 'Karyawan - Dialog Ubah Aktivitas', (th) => wtFormDialog(th, 'employee', WT_ACT_EMP_MY, { items: [WT_FILLED], edit: true, h: 1300 }));
wtReg('employee/timesheet-my-impor', 'Karyawan - Dialog Import File', (th) => wtImportDialog(th, 'employee', WT_ACT_EMP_MY));
wtReg('employee/timesheet-my-impor-galat', 'Karyawan - Dialog Import galat baris', (th) => wtImportDialog(th, 'employee', WT_ACT_EMP_MY, { file: 'aktivitas-november.xlsx', errors: { msg: 'Berkas tidak valid. Tidak ada data yang disimpan.', rows: ['Baris 3 (workDate): Tanggal tidak valid — "31/02/2026"', 'Baris 7 (startTime): Jam mulai wajib diisi', 'Baris 12 (visibility): Visibilitas harus Private, Team, atau All — "Publik"'] } }));
wtReg('employee/timesheet-my-hapus', 'Karyawan - Konfirmasi hapus aktivitas', (th) => wtDeleteDialog(th, 'employee', WT_ACT_EMP_MY));
wtReg('employee/timesheet-team', 'Karyawan - Team Activity', async (th) => (await wtListPage(th, 'team', { ...WT_EMP, active: 'Team Activity', rows: WT_OTHERS, h: 1000 })).f);
wtReg('employee/timesheet-team-kosong', 'Karyawan - Team Activity kosong', async (th) => (await wtListPage(th, 'team', { ...WT_EMP, active: 'Team Activity', state: 'kosong', h: 700 })).f);
wtReg('employee/timesheet-shared', 'Karyawan - Shared (All)', async (th) => (await wtListPage(th, 'shared', { ...WT_EMP, active: 'Shared (All)', rows: WT_OTHERS.filter((r) => r.vis === 'all'), h: 800 })).f);
wtReg('employee/timesheet-shared-kosong', 'Karyawan - Shared (All) kosong', async (th) => (await wtListPage(th, 'shared', { ...WT_EMP, active: 'Shared (All)', state: 'kosong', h: 700 })).f);

// Panel HR (owner)
wtReg('owner/timesheet-dashboard', 'HR - Timesheet: Dashboard', (th) => wtDashPage(th, 'owner', 'Timesheet: Dashboard', { team: false, h: 1500 }));
wtReg('owner/my-timesheet', 'HR - Timesheet: My Activity', async (th) => (await wtListPage(th, 'mine', { ...WT_OWN, active: WT_ACT_OWN_MY, rows: WT_MINE })).f);
wtReg('owner/my-timesheet-kosong', 'HR - Timesheet: My Activity kosong', async (th) => (await wtListPage(th, 'mine', { ...WT_OWN, active: WT_ACT_OWN_MY, state: 'kosong', h: 700 })).f);
wtReg('owner/my-timesheet-tambah', 'HR - Dialog Add New', (th) => wtFormDialog(th, 'owner', WT_ACT_OWN_MY, { items: [WT_BLANK], disabled: true, h: 1300 }));
wtReg('owner/my-timesheet-impor', 'HR - Dialog Import File', (th) => wtImportDialog(th, 'owner', WT_ACT_OWN_MY));
wtReg('owner/my-timesheet-hapus', 'HR - Konfirmasi hapus aktivitas', (th) => wtDeleteDialog(th, 'owner', WT_ACT_OWN_MY));
wtReg('owner/timesheet-all', 'HR - All Department', async (th) => (await wtListPage(th, 'admin', { ...WT_OWN, active: 'All Department', rows: WT_OTHERS, h: 1000 })).f);
wtReg('owner/timesheet-all-kosong', 'HR - All Department kosong', async (th) => (await wtListPage(th, 'admin', { ...WT_OWN, active: 'All Department', state: 'kosong', h: 700 })).f);
wtReg('owner/timesheet-all-galat', 'HR - All Department galat', async (th) => (await wtListPage(th, 'admin', { ...WT_OWN, active: 'All Department', state: 'galat', h: 700 })).f);
wtReg('owner/timesheet-settings', 'HR - Pengaturan Pilihan', (th) => wtSettingsPage(th));
wtReg('owner/timesheet-settings-isi', 'HR - Pengaturan Pilihan (mengetik pilihan baru)', (th) => wtSettingsPage(th, { draft: 'Remote Client' }));
wtReg('owner/timesheet-settings-galat', 'HR - Pengaturan Pilihan galat', (th) => wtSettingsPage(th, { error: true, h: 600 }));
