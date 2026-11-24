/* =====================================================================
 * Payroll (owner): proses payroll, laporan, gaji tambahan, penetapan, struktur, komponen, pengaturan, slip saya
 * Prefiks: wp / WP_
 * ===================================================================== */
const WP_GROUP = 'Payroll';
const WP_CO = 'PT Maju Bersama';
const wpRp = (n) => 'Rp ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const wpMk = (key, title, fn) => registerScreen({ key, group: WP_GROUP, title, build: async (th) => fn(th) });

/* ---------- pembantu ---------- */
function wpDivider(th, parent) { const d = figma.createRectangle(); d.name = 'divider'; d.resize(10, 1); d.fills = [pv(th, 'color/border')]; parent.appendChild(d); d.layoutSizingHorizontal = 'FILL'; return d; }
function wpRow(th, parent, o = {}) { return box(o.name ?? 'row', { dir: 'H', gap: o.gap ?? 12, ay: o.ay ?? 'CENTER', ax: o.ax, pad: o.pad ?? 0, theme: th, parent, fillW: true, fill: o.fill, stroke: o.stroke, radius: o.radius }); }
function wpCol(th, parent, o = {}) { return box(o.name ?? 'col', { dir: 'V', gap: o.gap ?? 4, pad: o.pad ?? 0, theme: th, parent, fillW: o.fillW !== false, fill: o.fill, stroke: o.stroke, radius: o.radius, ax: o.ax, ay: o.ay }); }
async function wpChipRows(th, parent, chips, per) {
  const col = wpCol(th, parent, { gap: 6, name: 'chips' });
  for (let i = 0; i < chips.length; i += per) {
    const r = box('chip row', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: col });
    for (const c of chips.slice(i, i + per)) await chip(c.l, th, r, { color: c.color ?? 'default', variant: c.v ?? 'outlined', icon: c.icon });
  }
  return col;
}
/** Kartu filter dengan satu kolom Perusahaan (SearchSelect). */
async function wpCompanyCard(th, main, o = {}) {
  const c = card(th, main, { pad: 16, dir: 'H', gap: 12, ay: 'CENTER' });
  await inputField('Perusahaan', o.value ?? WP_CO, th, c, { w: 360, select: true });
  return c;
}
async function wpPage(th, active, h, title, sub) {
  const { f, main } = await page('x', th, { role: 'owner', active, h });
  const act = await pageHeader(th, main, title, sub);
  return { f, main, act };
}
/** Hapus bingkai ganda tabel di dalam kartu. */
function wpFlat(tbl) { tbl.strokes = []; tbl.cornerRadius = 0; return tbl; }
/** Baris total di dasar tabel. cols sama dengan tabel; vals string/null per kolom. */
async function wpTotalRow(th, tbl, cols, vals) {
  const r = box('total', { dir: 'H', ay: 'CENTER', pad: [0, 16, 0, 16], fill: 'color/background', theme: th, parent: tbl });
  r.counterAxisSizingMode = 'FIXED'; r.resize(100, 48); r.layoutSizingHorizontal = 'FILL';
  for (const [i, col] of cols.entries()) {
    const c = box('cell', { dir: 'H', ay: 'CENTER', ax: col.align === 'right' ? 'MAX' : 'MIN', theme: th, parent: r });
    if (col.w === 'fill' || col.w == null) { c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL'; } else { c.counterAxisSizingMode = 'AUTO'; c.primaryAxisSizingMode = 'FIXED'; c.resize(col.w, 20); }
    if (vals[i]) await txt(vals[i], 'body2-strong', 'color/text/primary', th, { parent: c });
  }
  return r;
}
async function wpSwitch(th, parent, on, label, hint) {
  const r = box('switch/' + label, { dir: 'H', gap: 12, ay: 'MIN', theme: th, parent, fillW: true });
  toggle(on, th, r);
  const t = box('text', { dir: 'V', gap: 2, theme: th, parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
  await txt(label, 'body2-strong', 'color/text/primary', th, { parent: t, fillW: true });
  if (hint) await txt(hint, 'caption', 'color/text/secondary', th, { parent: t, fillW: true });
  return r;
}
function wpRadio(th, parent, on) {
  const o = box('radio', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 999, stroke: on ? 'color/primary' : 'color/text/secondary', sw: 2, theme: th, parent, fixed: [20, 20] });
  if (on) box('dot', { dir: 'H', fill: 'color/primary', radius: 999, theme: th, parent: o, fixed: [10, 10] });
  return o;
}
async function wpMonthField(th, parent, label, value, o = {}) { return inputField(label, value, th, parent, { w: o.w, endIcon: 'calendar', helper: o.helper, error: o.error }); }
async function wpErrorList(th, parent, title, lines) { return alertBox('error', lines.join('\n'), th, parent, title); }

/* ---------- Pratinjau slip (SlipPreviewView) ---------- */
async function wpLines(th, parent, title, lines, total, totalLabel) {
  const col = wpCol(th, parent, { gap: 8, name: 'Lines/' + title });
  await txt(title, 'label', 'color/text/secondary', th, { parent: col, upper: true });
  for (const l of lines) {
    const r = box('line', { dir: 'H', gap: 8, ay: 'MIN', theme: th, parent: col, fillW: true });
    const left = box('left', { dir: 'V', gap: 2, theme: th, parent: r }); left.layoutGrow = 1; left.layoutSizingHorizontal = 'FILL';
    const nr = box('name', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: left });
    await txt(l.name, 'body2', l.muted ? 'color/text/secondary' : 'color/text/primary', th, { parent: nr });
    await txt(l.abbr, 'caption', 'color/text/disabled', th, { parent: nr });
    if (l.tag) await chip(l.tag, th, nr, { variant: 'outlined' });
    await txt(l.source, 'caption', 'color/text/secondary', th, { parent: left, fillW: true });
    await txt(wpRp(l.amount), 'body2-strong', 'color/text/primary', th, { parent: r });
  }
  if (total !== undefined) {
    const tr = wpRow(th, col, { ax: 'SPACE_BETWEEN' });
    tr.paddingTop = 4;
    await txt(totalLabel, 'body2-strong', 'color/text/primary', th, { parent: tr });
    await txt(wpRp(total), 'body2-strong', 'color/text/primary', th, { parent: tr });
  }
  return col;
}
/** o: wide (lebar > 560, chip per baris lebih banyak), prorata (baris gaji pokok dikali hari dibayar). */
async function wpSlipView(th, parent, o = {}) {
  const wrap = wpCol(th, parent, { gap: 16, name: 'SlipPreviewView' });
  const head = wpCol(th, wrap, { gap: 4 });
  await txt('Budi Santoso', 'body2-strong', 'color/text/primary', th, { parent: head });
  await txt('Staf Tetap · 2026-11-01 s/d 2026-11-30', 'body2', 'color/text/secondary', th, { parent: head });
  const chips = [{ l: 'Hari dibayar 30/30 · Hari kalender', v: 'tint', color: 'primary' }, { l: '21 hari kerja riil' }, { l: '1 tanggal merah' }, { l: '19 hari hadir' }, { l: 'gaji dasar ' + wpRp(8000000) }, { l: 'gaji variabel ' + wpRp(500000) }];
  if (o.prorata) chips.splice(1, 0, { l: '1 hari cuti tidak dibayar', color: 'warning' });
  await wpChipRows(th, head, chips, o.wide ? 4 : 2);
  const gp = o.prorata ? { name: 'Gaji Pokok', abbr: 'GP', source: 'base · nilai penuh ' + wpRp(8000000), amount: 7733333 } : { name: 'Gaji Pokok', abbr: 'GP', source: 'base', amount: 8000000 };
  const earn = [gp, { name: 'Tunjangan Makan', abbr: 'TM', source: '25000 * present_days', amount: 550000 }, { name: 'Tunjangan Transport', abbr: 'TT', source: 'Nominal tetap', amount: 500000 }, { name: 'Upah Dasar BPJS', abbr: 'UB', source: 'base', amount: 8000000, muted: true, tag: 'komponen bantu' }];
  await wpLines(th, wrap, 'Pendapatan', earn, o.prorata ? 8783333 : 9050000, 'Total pendapatan kotor');
  wpDivider(th, wrap);
  await wpLines(th, wrap, 'Potongan', [{ name: 'BPJS Kesehatan (Karyawan)', abbr: 'BPK', source: 'GP * 0.01', amount: 80000 }, { name: 'BPJS JHT (Karyawan)', abbr: 'JHT', source: 'GP * 0.02', amount: 160000 }, { name: 'PPh 21', abbr: 'PPH', source: 'Gaji tambahan', amount: 150000 }], 390000, 'Total potongan');
  const thp = box('THP', { dir: 'H', ay: 'CENTER', ax: 'SPACE_BETWEEN', pad: 12, fill: 'color/primary', radius: 8, theme: th, parent: wrap, fillW: true });
  await txt('Gaji bersih (THP)', 'body2-strong', onPrimary(th), th, { parent: thp });
  await txt(wpRp(o.prorata ? 8393333 : 8660000), 'h6', onPrimary(th), th, { parent: thp });
  await wpLines(th, wrap, 'Ditanggung perusahaan (tidak memotong gaji)', [{ name: 'BPJS Kesehatan (Perusahaan)', abbr: 'BPP', source: 'GP * 0.04', amount: 320000 }], 320000, 'Total ditanggung perusahaan');
  await txt('Total biaya karyawan (pendapatan kotor + ditanggung perusahaan): ' + wpRp(o.prorata ? 9103333 : 9370000), 'caption', 'color/text/secondary', th, { parent: wrap, fillW: true });
  await txt('Penghasilan kena pajak bulan ini: ' + wpRp(o.prorata ? 8783333 : 9050000) + '. PPh 21 diisi manual di halaman Proses Payroll.', 'caption', 'color/text/secondary', th, { parent: wrap, fillW: true });
  return wrap;
}

/* =====================================================================
 * 1. Proses Payroll (daftar)
 * ===================================================================== */
const WP_ENTRIES = [
  { m: 'November 2026', st: 'draf', n: 48, net: 412350000, skip: 2, by: 'Dewi Lestari', at: '24 Nov 2026 09.15', note: 'Termasuk bonus akhir tahun' },
  { m: 'Oktober 2026', st: 'final', n: 47, net: 398720000, by: 'Dewi Lestari', at: '28 Okt 2026 10.02', fin: 'Dewi Lestari', finAt: '29 Okt 2026 14.30' },
  { m: 'September 2026', st: 'final', n: 47, net: 396180000, by: 'Dewi Lestari', at: '26 Sep 2026 09.40', fin: 'Dewi Lestari', finAt: '27 Sep 2026 16.10' },
  { m: 'Agustus 2026', st: 'batal', n: 45, net: 371900000, by: 'Dewi Lestari', at: '27 Agu 2026 11.00', cancel: 'Dewi Lestari', cancelAt: '28 Agu 2026 08.45' },
];
async function wpEntryCard(th, parent, e) {
  const c = card(th, parent, { dir: 'H', gap: 16, ay: 'CENTER', pad: 16 });
  if (e.st === 'batal') c.opacity = 0.7;
  const left = box('left', { dir: 'V', gap: 6, theme: th, parent: c }); left.layoutGrow = 1; left.layoutSizingHorizontal = 'FILL';
  const t = box('title', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: left });
  await txt(e.m, 'subtitle', 'color/text/primary', th, { parent: t });
  await chip(e.st === 'draf' ? 'Draf' : e.st === 'final' ? 'Final' : 'Dibatalkan', th, t, e.st === 'draf' ? { color: 'warning', variant: 'outlined' } : e.st === 'final' ? { color: 'success', variant: 'solid' } : { color: 'default', variant: 'outlined' });
  if (e.skip) await chip(`${e.skip} terlewat`, th, t, { color: 'warning', variant: 'tint', icon: 'warn' });
  const mt = box('meta', { dir: 'H', gap: 24, ay: 'CENTER', theme: th, parent: left });
  await txt(`${e.n} karyawan`, 'body2', 'color/text/secondary', th, { parent: mt });
  await txt('Total transfer ' + wpRp(e.net), 'body2-strong', 'color/text/primary', th, { parent: mt });
  let cap = `Dibuat oleh ${e.by} ${e.at}`;
  if (e.fin) cap += ` · difinalkan oleh ${e.fin} ${e.finAt}`;
  if (e.cancel) cap += ` · dibatalkan oleh ${e.cancel} ${e.cancelAt}`;
  await txt(cap, 'caption', 'color/text/secondary', th, { parent: left, fillW: true });
  if (e.note) await txt(e.note, 'caption', 'color/text/secondary', th, { parent: left, fillW: true });
  icon('chevron', 22, 'color/text/secondary', th, c);
  return c;
}
async function wpPayrollList(th, st) {
  const { f, main, act } = await wpPage(th, 'Proses Payroll', 1100, 'Proses Payroll', 'Hitung slip gaji semua karyawan untuk satu bulan, cek, finalkan, lalu unduh file transfer bank.');
  await button('Proses Bulan Baru', th, act, { icon: 'plus' });
  if (st === 'galat') await alertBox('error', 'Gagal memuat proses payroll. Coba lagi.', th, main);
  await wpCompanyCard(th, main);
  if (st === 'kosong') {
    const c = card(th, main, { gap: 8, pad: 24 });
    await txt('Belum ada proses payroll', 'subtitle', 'color/text/primary', th, { parent: c });
    await txt('Langkahnya tiap bulan:', 'body2', 'color/text/secondary', th, { parent: c });
    const steps = ['Buat. Klik "Proses Bulan Baru" lalu pilih bulan. Slip gaji semua karyawan langsung dihitung dari penetapan gaji, cuti tidak dibayar, lembur, dan gaji tambahan bulan itu.', 'Cek. Periksa slip gaji dan karyawan yang terlewat, isi PPh 21, lalu hitung ulang kalau ada data yang berubah.', 'Finalkan. Slip gaji dikunci sesuai hitungan terakhir.', 'Unduh file BCA. File Excel untuk transfer gaji sekaligus.'];
    for (const [i, s] of steps.entries()) await txt(`${i + 1}. ${s}`, 'body2', 'color/text/primary', th, { parent: c, fillW: true });
    gap(c, 4);
    await alertBox('info', 'Sebelum mulai, pastikan sudah ada komponen gaji, struktur gaji, dan penetapan gaji untuk tiap karyawan.', th, c);
  } else if (st !== 'galat') {
    const list = wpCol(th, main, { gap: 12 });
    for (const e of WP_ENTRIES) await wpEntryCard(th, list, e);
  }
  return { f, main };
}
wpMk('owner/payroll', 'Proses Payroll', async (th) => (await wpPayrollList(th, 'isi')).f);
wpMk('owner/payroll-kosong', 'Proses Payroll (kosong)', async (th) => (await wpPayrollList(th, 'kosong')).f);
wpMk('owner/payroll-galat', 'Proses Payroll (galat)', async (th) => (await wpPayrollList(th, 'galat')).f);
async function wpCreateDialog(th, withError) {
  const { f } = await wpPayrollList(th, 'isi');
  await dialog(th, f, { title: 'Proses Bulan Baru', w: 444, build: async (b) => {
    if (withError) await alertBox('error', 'Payroll November 2026 sudah ada untuk perusahaan ini.', th, b);
    await wpMonthField(th, b, 'Bulan', 'November 2026', { helper: 'Periode tanggal 1 sampai akhir November 2026' });
    await inputField('Catatan (opsional)', '', th, b, { multiline: 2 });
    await txt('Slip gaji semua karyawan langsung dihitung. Masih bisa dihitung ulang selama statusnya draf.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Buat & Hitung', v: 'contained' }] });
  return f;
}
wpMk('owner/payroll-buat', 'Dialog Proses Bulan Baru', (th) => wpCreateDialog(th, false));
wpMk('owner/payroll-buat-galat', 'Dialog Proses Bulan Baru (galat)', (th) => wpCreateDialog(th, true));

/* =====================================================================
 * 2. Detail proses payroll
 * ===================================================================== */
const WP_SLIP_COLS = [{ t: 'Karyawan', w: 'fill' }, { t: 'Hari dibayar', w: 260 }, { t: 'Pendapatan kotor', w: 170, align: 'right' }, { t: 'Potongan', w: 130, align: 'right' }, { t: 'Gaji bersih', w: 150, align: 'right' }];
const WP_SLIP_ROWS = [
  [{ t: 'Budi Santoso', sub: 'EMP-000003 · Teknologi Informasi' }, '30/30', wpRp(9050000), wpRp(390000), wpRp(8660000)],
  [{ t: 'Dewi Lestari', sub: 'EMP-000004 · SDM' }, '30/30', wpRp(16200000), wpRp(1150000), wpRp(15050000)],
  [{ t: 'Siti Rahmawati', sub: 'EMP-000005 · Keuangan' }, { t: '29/30', sub: 'cuti tidak dibayar 1 hari' }, wpRp(8150000), wpRp(420000), wpRp(7730000)],
  [{ t: 'Agus Wijaya', sub: 'EMP-000006 · Operasional' }, { t: '30/30', sub: 'lembur 8 jam' }, wpRp(7620000), wpRp(360000), wpRp(7260000)],
  [{ t: 'Rina Kartika', sub: 'EMP-000007 · Operasional' }, '30/30', wpRp(6900000), wpRp(330000), wpRp(6570000)],
  [{ t: 'Maya Anggraini', sub: 'EMP-000008 · Keuangan · belum ada rekening' }, '30/30', wpRp(7300000), wpRp(350000), wpRp(6950000)],
];
async function wpDetailPage(th, st, h) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Proses Payroll', h: h ?? 1500 });
  const draft = st === 'draft' || st === 'noslips', final = st === 'final', cancelled = st === 'cancelled';
  await button('Proses Payroll', th, main, { v: 'text', size: 'small', icon: 'back' });
  const hd = wpCol(th, main, { gap: 4 });
  const tr = box('title', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent: hd });
  await txt('Payroll November 2026', 'h5', 'color/text/primary', th, { parent: tr });
  await chip(draft ? 'Draf' : final ? 'Final' : 'Dibatalkan', th, tr, draft ? { color: 'warning', variant: 'outlined' } : final ? { color: 'success', variant: 'solid' } : { color: 'default', variant: 'outlined' });
  await txt(`${WP_CO} · 1 Nov 2026 – 30 Nov 2026`, 'body2', 'color/text/secondary', th, { parent: hd });
  await txt(draft ? 'Dihitung 5 menit lalu' : final ? 'Difinalkan oleh Dewi Lestari 29 Nov 2026 14.30' : 'Dibatalkan oleh Dewi Lestari 30 Nov 2026 08.45', 'caption', 'color/text/secondary', th, { parent: hd });
  await txt('Termasuk bonus akhir tahun', 'body2', 'color/text/secondary', th, { parent: hd });
  if (!cancelled) {
    const acts = box('actions', { dir: 'H', gap: 12, ay: 'CENTER', ax: 'MAX', theme: th, parent: main, fillW: true });
    if (draft) { await button('Hitung Ulang', th, acts, { v: 'outlined', icon: 'refresh' }); await button('Isi PPh 21', th, acts, { v: 'outlined', icon: 'money' }); }
    await button('Unduh File BCA', th, acts, { v: 'outlined', icon: 'download', disabled: st === 'noslips' });
    await button('Unduh Semua Slip (PDF)', th, acts, { v: 'outlined', icon: 'file', disabled: st === 'noslips' });
    if (draft) { await button('Finalkan', th, acts, { icon: 'lock', disabled: st === 'noslips' }); await button('Hapus Draf', th, acts, { v: 'text', color: 'error', icon: 'trash' }); }
    if (final) await button('Batalkan', th, acts, { v: 'outlined', color: 'error', icon: 'x' });
  } else await alertBox('info', 'Payroll ini sudah dibatalkan, jadi hanya bisa dilihat. Bulan November 2026 bisa diproses lagi dari halaman Proses Payroll.', th, main);
  const tiles = box('tiles', { dir: 'H', gap: 12, theme: th, parent: main, fillW: true });
  const tv = st === 'noslips' ? ['0', wpRp(0), wpRp(0), wpRp(0), wpRp(0)] : ['48', wpRp(455600000), wpRp(43250000), wpRp(18400000), wpRp(412350000)];
  for (const [i, l] of ['Karyawan', 'Total pendapatan kotor', 'Total potongan', 'Ditanggung perusahaan', 'Total transfer'].entries()) {
    const c = card(th, tiles, { pad: 14, gap: 4 }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
    if (i === 4) c.strokes = [pv(th, 'color/primary')];
    await txt(l, 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
    await txt(tv[i], i === 4 ? 'h6' : 'subtitle', i === 4 ? 'color/primary' : 'color/text/primary', th, { parent: c });
  }
  if (draft) await alertBox('warning', 'Perbaiki datanya, lalu klik Hitung Ulang.\n• Hendra Gunawan (EMP-000009): Belum punya penetapan gaji\n• Putri Handayani (EMP-000010): Struktur gaji tidak aktif', th, main, '2 karyawan tidak dapat slip gaji');
  if (draft && st !== 'noslips') await alertBox('info', '• Agus Wijaya (EMP-000006): Gaji dasar berubah lebih dari 20% dari bulan lalu', th, main, '1 slip gaji perlu dicek');
  const c = card(th, main, { pad: 0, clip: true });
  const hr = wpRow(th, c, { pad: 16, ax: 'SPACE_BETWEEN' });
  const hl = wpCol(th, hr, { gap: 2, fillW: false });
  await txt('Slip Gaji', 'subtitle', 'color/text/primary', th, { parent: hl });
  if (st !== 'noslips') await txt('1 karyawan belum punya nomor rekening', 'caption', 'color/warning', th, { parent: hl });
  await searchInput(th, hr, 'Cari nama, nomor, atau departemen', 340);
  wpDivider(th, c);
  if (st === 'noslips') {
    const eb = wpCol(th, c, { pad: [48, 16, 48, 16], ax: 'CENTER', ay: 'CENTER' });
    await txt('Belum ada slip gaji. Cek daftar karyawan yang terlewat di atas.', 'body', 'color/text/secondary', th, { parent: eb, align: 'CENTER' });
  } else if (st === 'cari') {
    await txt('Tidak ada slip gaji yang cocok.', 'body', 'color/text/secondary', th, { parent: c });
  } else {
    const t = wpFlat(await table(th, c, { cols: WP_SLIP_COLS, rows: WP_SLIP_ROWS, foot: false }));
    await wpTotalRow(th, t, WP_SLIP_COLS, ['Total (48)', null, wpRp(455600000), wpRp(43250000), wpRp(412350000)]);
  }
  return { f, main };
}
wpMk('owner/payroll-detail', 'Detail Payroll (draf)', async (th) => (await wpDetailPage(th, 'draft')).f);
wpMk('owner/payroll-detail-final', 'Detail Payroll (final)', async (th) => (await wpDetailPage(th, 'final')).f);
wpMk('owner/payroll-detail-batal', 'Detail Payroll (dibatalkan)', async (th) => (await wpDetailPage(th, 'cancelled')).f);
wpMk('owner/payroll-detail-kosong', 'Detail Payroll (belum ada slip)', async (th) => (await wpDetailPage(th, 'noslips', 1100)).f);
wpMk('owner/payroll-detail-galat', 'Detail Payroll (tidak ditemukan)', async (th) => {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Proses Payroll', h: 700 });
  await button('Proses Payroll', th, main, { v: 'text', size: 'small', icon: 'back' });
  await alertBox('error', 'Proses payroll tidak ditemukan.', th, main);
  return f;
});
/** Dialog slip karyawan (di atas detail). */
wpMk('owner/payroll-detail-slip', 'Dialog Slip Gaji Karyawan', async (th) => {
  const { f } = await wpDetailPage(th, 'draft', 2300);
  await dialog(th, f, { title: 'Slip Gaji Budi Santoso', w: 600, build: async (b) => {
    await txt('EMP-000003 · Staf IT · Teknologi Informasi', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    const c = card(th, b, { pad: 12, gap: 6 });
    await txt('Rekening transfer', 'label', 'color/text/secondary', th, { parent: c, upper: true });
    await txt('Bank BCA · 1234567890', 'body2', 'color/text/primary', th, { parent: c, fillW: true });
    await txt('a.n. Budi Santoso', 'body2', 'color/text/secondary', th, { parent: c });
    await wpSlipView(th, b);
  }, actions: [{ label: 'Tutup' }, { label: 'Unduh PDF', v: 'contained' }] });
  return f;
});
wpMk('owner/payroll-detail-slip-tanpa-rekening', 'Dialog Slip Gaji (tanpa rekening)', async (th) => {
  const { f } = await wpDetailPage(th, 'draft', 2300);
  await dialog(th, f, { title: 'Slip Gaji Maya Anggraini', w: 600, build: async (b) => {
    await txt('EMP-000008 · Staf Keuangan · Keuangan', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    const c = card(th, b, { pad: 12, gap: 8 });
    const r = wpRow(th, c, { ax: 'SPACE_BETWEEN' });
    await txt('Rekening transfer', 'label', 'color/text/secondary', th, { parent: r, upper: true });
    await chip('Belum ada nomor rekening', th, r, { color: 'warning', variant: 'tint', icon: 'warn' });
    await txt('Karyawan ini akan masuk sheet "Perlu dicek" di file BCA. Lengkapi nomor rekening di profil karyawan.', 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
    await wpSlipView(th, b);
  }, actions: [{ label: 'Tutup' }, { label: 'Unduh PDF', v: 'contained' }] });
  return f;
});
/** Dialog konfirmasi: finalkan / batalkan / hapus. */
async function wpConfirm(th, kind) {
  const { f } = await wpDetailPage(th, kind === 'cancel' ? 'final' : 'draft');
  const cfg = {
    submit: { title: 'Finalkan payroll November 2026?', ok: 'Finalkan & Kunci', color: 'primary' },
    cancel: { title: 'Batalkan payroll November 2026?', ok: 'Batalkan Payroll', color: 'error' },
    delete: { title: 'Hapus draf payroll?', ok: 'Hapus', color: 'error' },
  }[kind];
  await dialog(th, f, { title: cfg.title, w: 444, build: async (b) => {
    if (kind === 'submit') {
      await txt('Slip gaji akan dikunci sesuai hitungan terakhir (5 menit lalu) dan tidak bisa dihitung ulang lagi.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
      for (const [l, v, s] of [['Karyawan', '48'], ['Total pendapatan kotor', wpRp(455600000)], ['Total potongan', wpRp(43250000)], ['Total transfer', wpRp(412350000), true]]) {
        const r = wpRow(th, b, { ax: 'SPACE_BETWEEN' });
        await txt(l, 'body2', 'color/text/secondary', th, { parent: r });
        await txt(v, s ? 'body2-strong' : 'body2', 'color/text/primary', th, { parent: r });
      }
      await alertBox('warning', '2 karyawan terlewat dan tidak akan dapat slip gaji di payroll ini.', th, b);
    } else if (kind === 'cancel') await txt('Payroll ini dan semua slip gajinya akan dibatalkan. Setelah itu bulan November 2026 bisa diproses lagi. Pastikan transfer gajinya belum dikirim, atau sudah diurus.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
    else await txt('Draf ini dan semua slip gajinya akan dihapus permanen. Gaji tambahan (mis. PPh 21) yang sudah diisi tetap tersimpan.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Kembali' }, { label: cfg.ok, v: 'contained', color: cfg.color }] });
  return f;
}
wpMk('owner/payroll-detail-finalkan', 'Dialog Finalkan Payroll', (th) => wpConfirm(th, 'submit'));
wpMk('owner/payroll-detail-batalkan', 'Dialog Batalkan Payroll', (th) => wpConfirm(th, 'cancel'));
wpMk('owner/payroll-detail-hapus', 'Dialog Hapus Draf Payroll', (th) => wpConfirm(th, 'delete'));
/** Dialog Isi PPh 21. */
async function wpPphDialog(th, st) {
  const { f } = await wpDetailPage(th, 'draft', 1700);
  await dialog(th, f, { title: 'Isi PPh 21 · November 2026', w: 900, build: async (b) => {
    await txt('Nominal disimpan sebagai gaji tambahan bulan ini. Isi 0 atau kosongkan untuk menghapus. Slip gaji langsung dihitung ulang setelah disimpan.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    if (st === 'galat') await alertBox('error', 'Pilih komponen potongan untuk PPh 21 dulu.', th, b);
    if (st === 'kosong') { await alertBox('info', 'Belum ada komponen potongan yang aktif. Buat dulu komponen jenis Potongan (mis. "PPh 21") di Komponen Gaji.', th, b); return; }
    const r = wpRow(th, b, { gap: 12 });
    await inputField('Komponen potongan', 'PPh 21 (PPH)', th, r, { select: true });
    await inputField('Cari karyawan', '', th, r, { icon: 'search' });
    const t = box('pph table', { dir: 'V', theme: th, parent: b, fillW: true, stroke: 'color/border', radius: 10, clip: true });
    const hd = wpRow(th, t, { pad: [12, 16, 12, 16], fill: 'color/background', ax: 'SPACE_BETWEEN' });
    await txt('Karyawan', 'th', 'color/text/secondary', th, { parent: hd, upper: true });
    await txt('Nominal', 'th', 'color/text/secondary', th, { parent: hd, upper: true });
    const rows = [['Budi Santoso', 'EMP-000003', '150000', wpRp(150000)], ['Dewi Lestari', 'EMP-000004', '1000000', wpRp(1000000)], ['Siti Rahmawati', 'EMP-000005', '', ''], ['Hendra Gunawan', 'EMP-000009 · terlewat: Belum punya penetapan gaji', '', 'off']];
    for (const [n, s, v, h] of rows) {
      const rr = wpRow(th, t, { pad: [8, 16, 8, 16], ax: 'SPACE_BETWEEN', stroke: 'color/border' }); rr.strokeTopWeight = 1; rr.strokeLeftWeight = 0; rr.strokeRightWeight = 0; rr.strokeBottomWeight = 0;
      const l = wpCol(th, rr, { gap: 2, fillW: false }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL';
      const dis = h === 'off';
      await txt(n, 'body2-strong', dis ? 'color/text/disabled' : 'color/text/primary', th, { parent: l });
      await txt(s, 'caption', dis ? 'color/text/disabled' : 'color/text/secondary', th, { parent: l });
      await inputField('Nominal', v, th, rr, { w: 200, disabled: dis, helper: dis ? ' ' : (h || ' ') });
    }
  }, actions: st === 'kosong' ? [{ label: 'Batal' }, { label: 'Simpan & Hitung Ulang', v: 'contained', disabled: true }] : [{ label: 'Batal' }, { label: 'Simpan & Hitung Ulang', v: 'contained' }] });
  return f;
}
wpMk('owner/payroll-detail-pph', 'Dialog Isi PPh 21', (th) => wpPphDialog(th, 'isi'));
wpMk('owner/payroll-detail-pph-kosong', 'Dialog Isi PPh 21 (tanpa komponen potongan)', (th) => wpPphDialog(th, 'kosong'));
wpMk('owner/payroll-detail-pph-galat', 'Dialog Isi PPh 21 (galat)', (th) => wpPphDialog(th, 'galat'));

/* =====================================================================
 * 3. Laporan Payroll
 * ===================================================================== */
const WP_MONEY = (r) => [wpRp(r[0]), wpRp(r[1]), wpRp(r[2]), wpRp(r[3])];
async function wpReportPage(th, st) {
  const { f, main, act } = await wpPage(th, 'Laporan Payroll', 1300, 'Laporan Payroll', 'Rekap biaya gaji dari slip yang sudah final, per bulan, departemen, dan komponen.');
  await button('Export Excel', th, act, { icon: 'download', disabled: st === 'kosong' || st === 'galat' });
  const fc = card(th, main, { pad: 16, dir: 'H', gap: 12, ay: st === 'galat' ? 'MIN' : 'CENTER' });
  await wpMonthField(th, fc, 'Dari bulan', st === 'galat' ? 'November 2026' : 'Juli 2026', { w: 200 });
  await wpMonthField(th, fc, 'Sampai bulan', st === 'galat' ? 'Juli 2026' : 'November 2026', { w: 200 });
  await inputField('Perusahaan', 'Semua Perusahaan', th, fc, { w: 260, select: true });
  if (st === 'galat') { await alertBox('error', 'Bulan awal tidak boleh setelah bulan akhir.', th, main); return { f, main }; }
  if (st === 'kosong') {
    const c = card(th, main, { pad: 48, ax: 'CENTER', ay: 'CENTER' });
    await txt('Belum ada slip gaji final untuk Juli 2026 sampai November 2026. Laporan terisi setelah payroll bulan itu difinalkan.', 'body', 'color/text/secondary', th, { parent: c, align: 'CENTER' });
    return { f, main };
  }
  const sm = box('summary', { dir: 'H', gap: 12, theme: th, parent: main, fillW: true });
  for (const [l, v, h, strong] of [['Gaji Kotor', wpRp(2184500000), '235 slip · 48 karyawan'], ['Total Potongan', wpRp(207300000)], ['Ditanggung Perusahaan', wpRp(88400000), 'Di luar gaji, mis. BPJS bagian perusahaan'], ['Gaji Bersih Dibayar', wpRp(1977200000), 'Juli 2026 sampai November 2026', true]]) {
    const c = card(th, sm, { pad: 16, gap: 4 }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
    if (strong) c.strokes = [pv(th, 'color/primary')];
    await txt(l, 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
    await txt(v, 'h6', strong ? 'color/primary' : 'color/text/primary', th, { parent: c });
    if (h) await txt(h, 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
  }
  const c = card(th, main, { pad: 0, clip: true });
  const view = st === 'departemen' ? 1 : st === 'komponen' ? 2 : 0;
  await tabs(['Per Bulan', 'Per Departemen', 'Per Komponen'], view, th, c);
  const money = [{ t: 'Slip', w: 80, align: 'right' }, { t: 'Gaji Kotor', w: 170, align: 'right' }, { t: 'Potongan', w: 150, align: 'right' }, { t: 'Ditanggung Perusahaan', w: 200, align: 'right' }, { t: 'Gaji Bersih', w: 170, align: 'right' }];
  let cols, rows, tot;
  if (view === 0) {
    cols = [{ t: 'Bulan', w: 'fill' }, ...money];
    rows = [['November 2026', '48', ...WP_MONEY([455600000, 43250000, 18400000, 412350000])], ['Oktober 2026', '47', ...WP_MONEY([446300000, 41100000, 18100000, 405200000])], ['September 2026', '47', ...WP_MONEY([441200000, 40800000, 17900000, 400400000])], ['Agustus 2026', '47', ...WP_MONEY([437800000, 40200000, 17800000, 397600000])], ['Juli 2026', '46', ...WP_MONEY([403600000, 41950000, 16200000, 361650000])]];
    tot = ['Total', '235', wpRp(2184500000), wpRp(207300000), wpRp(88400000), wpRp(1977200000)];
  } else if (view === 1) {
    cols = [{ t: 'Departemen', w: 'fill' }, ...money];
    rows = [['Teknologi Informasi', '60', ...WP_MONEY([612000000, 55400000, 24800000, 556600000])], ['Keuangan', '45', ...WP_MONEY([498500000, 47100000, 20100000, 451400000])], ['Operasional', '85', ...WP_MONEY([701000000, 68900000, 28800000, 632100000])], ['SDM', '40', ...WP_MONEY([373000000, 35900000, 14700000, 337100000])], [{ t: 'Tanpa departemen' }, '5', ...WP_MONEY([0, 0, 0, 0])]];
    rows[4] = ['Tanpa departemen', '5', ...WP_MONEY([0, 0, 0, 0])];
    tot = ['Total', '235', wpRp(2184500000), wpRp(207300000), wpRp(88400000), wpRp(1977200000)];
  } else {
    cols = [{ t: 'Komponen', w: 'fill' }, { t: 'Jenis', w: 200 }, { t: 'Slip', w: 100, align: 'right' }, { t: 'Total', w: 200, align: 'right' }];
    rows = [[{ t: 'Gaji Pokok', sub: 'GP' }, 'Pendapatan', '235', wpRp(1860000000)], [{ t: 'Tunjangan Makan', sub: 'TM' }, 'Pendapatan', '235', wpRp(129200000)], [{ t: 'Upah Dasar BPJS', sub: 'UB · tidak masuk total' }, 'Pendapatan', '235', wpRp(1860000000)], [{ t: 'BPJS Kesehatan (Karyawan)', sub: 'BPK' }, 'Potongan', '235', wpRp(18600000)], [{ t: 'PPh 21', sub: 'PPH' }, 'Potongan', '180', wpRp(95700000)], [{ t: 'BPJS Kesehatan (Perusahaan)', sub: 'BPP' }, 'Ditanggung Perusahaan', '235', wpRp(74400000)]];
  }
  const t = wpFlat(await table(th, c, { cols, rows, foot: false }));
  if (tot) await wpTotalRow(th, t, cols, tot);
  await txt('Departemen dan jabatan mengikuti data saat slip dibuat. Export Excel juga berisi detail per slip dengan semua komponen.', 'caption', 'color/text/secondary', th, { parent: main, fillW: true });
  return { f, main };
}
wpMk('owner/payroll-report', 'Laporan Payroll (per bulan)', async (th) => (await wpReportPage(th, 'bulan')).f);
wpMk('owner/payroll-report-departemen', 'Laporan Payroll (per departemen)', async (th) => (await wpReportPage(th, 'departemen')).f);
wpMk('owner/payroll-report-komponen', 'Laporan Payroll (per komponen)', async (th) => (await wpReportPage(th, 'komponen')).f);
wpMk('owner/payroll-report-kosong', 'Laporan Payroll (kosong)', async (th) => (await wpReportPage(th, 'kosong')).f);
wpMk('owner/payroll-report-galat', 'Laporan Payroll (rentang salah)', async (th) => (await wpReportPage(th, 'galat')).f);

/* =====================================================================
 * 4. Gaji Tambahan
 * ===================================================================== */
const WP_AS_COLS = [{ t: 'Karyawan', w: 'fill' }, { t: 'Komponen gaji', w: 190 }, { t: 'Nominal', w: 120, align: 'right' }, { t: 'Periode', w: 190 }, { t: 'Cara hitung', w: 110 }, { t: 'Catatan', w: 150 }, { t: 'Dibuat oleh', w: 110 }, { t: 'Aksi', w: 80, align: 'right' }];
const WP_AS_ROWS = [
  [{ t: 'Budi Santoso', sub: 'EMP-000003' }, { t: 'Bonus Kinerja', sub: 'BNS · Pendapatan' }, wpRp(2500000), 'Nov 2026', { chip: 'menambah', color: 'info' }, 'Bonus kinerja Q3', 'Dewi Lestari', { actions: ['edit', 'trash'] }],
  [{ t: 'Siti Rahmawati', sub: 'EMP-000005' }, { t: 'PPh 21', sub: 'PPH · Potongan' }, wpRp(150000), 'Nov 2026', { chip: 'menambah', color: 'info' }, 'PPh 21 manual', 'Dewi Lestari', { actions: ['edit', 'trash'] }],
  [{ t: 'Agus Wijaya', sub: 'EMP-000006' }, { t: 'Potongan Kasbon', sub: 'KSB · Potongan' }, wpRp(500000), 'Okt 2026 – Des 2026 · berulang', { chip: 'menambah', color: 'info' }, 'Cicilan kasbon 1/3', 'Dewi Lestari', { actions: ['edit', 'trash'] }],
  [{ t: 'Rina Kartika', sub: 'EMP-000007' }, { t: 'Insentif Penjualan', sub: 'INS · Pendapatan' }, wpRp(1750000), 'Nov 2026', { chip: 'mengganti', color: 'warning' }, 'Target tercapai', 'Dewi Lestari', { actions: ['edit', 'trash'] }],
  [{ t: 'Eko Prasetyo', sub: 'EMP-000011' }, { t: 'Rapel Gaji', sub: 'RPL · Pendapatan' }, wpRp(3200000), 'Nov 2026', { chip: 'menambah', color: 'info' }, 'Rapel Sep–Okt', 'Dewi Lestari', { actions: ['edit', 'trash'] }],
];
async function wpAdditionalPage(th, st, h) {
  const { f, main, act } = await wpPage(th, 'Gaji Tambahan', h ?? 1200, 'Gaji Tambahan', 'Bonus, insentif, rapel, potongan kasbon atau pinjaman, PPh 21 manual, dan sejenisnya. Satu komponen untuk satu karyawan, di satu bulan atau beberapa bulan berturut-turut.');
  await button('Unduh Template', th, act, { v: 'outlined', icon: 'file' });
  await button('Unggah Excel', th, act, { v: 'outlined', icon: 'upload' });
  await button('Tambah Gaji Tambahan', th, act, { icon: 'plus' });
  await alertBox('info', 'Perubahan masuk ke payroll yang masih draf setelah dihitung ulang. Slip gaji yang sudah final tidak berubah.', th, main);
  if (st === 'galat') await alertBox('error', 'Gagal memuat gaji tambahan. Coba lagi.', th, main);
  const fc = card(th, main, { pad: 16, dir: 'H', gap: 12, ay: 'CENTER' });
  await inputField('Perusahaan', WP_CO, th, fc, { w: 260, select: true });
  await wpMonthField(th, fc, 'Bulan', 'November 2026', { w: 200 });
  const sw = box('sw', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: fc }); toggle(false, th, sw); await txt('Tampilkan semua bulan', 'body2', 'color/text/primary', th, { parent: sw });
  const sp = box('sp', { dir: 'H', theme: th, parent: fc }); sp.layoutGrow = 1; sp.layoutSizingHorizontal = 'FILL';
  await inputField('Cari nama atau nomor karyawan', '', th, fc, { w: 280, icon: 'search' });
  const c = card(th, main, { pad: 0, clip: true });
  const tr = wpRow(th, c, { gap: 12, pad: [0, 16, 0, 0] });
  await tabs(['Semua', 'Pendapatan', 'Potongan'], 0, th, tr);
  await txt('Pendapatan ' + wpRp(7450000), 'caption', 'color/text/secondary', th, { parent: tr });
  await txt('Potongan ' + wpRp(650000), 'caption', 'color/text/secondary', th, { parent: tr });
  if (st === 'kosong') {
    const eb = wpCol(th, c, { pad: [48, 16, 48, 16], ax: 'CENTER', ay: 'CENTER' });
    await txt('Belum ada gaji tambahan yang berlaku di Nov 2026.', 'body', 'color/text/secondary', th, { parent: eb, align: 'CENTER' });
  } else if (st === 'cari') {
    const eb = wpCol(th, c, { pad: [48, 16, 48, 16], ax: 'CENTER', ay: 'CENTER' });
    await txt('Tidak ada data yang cocok dengan filter.', 'body', 'color/text/secondary', th, { parent: eb, align: 'CENTER' });
  } else wpFlat(await table(th, c, { cols: WP_AS_COLS, rows: WP_AS_ROWS, foot: false }));
  return { f, main };
}
wpMk('owner/additional-salaries', 'Gaji Tambahan', async (th) => (await wpAdditionalPage(th, 'isi')).f);
wpMk('owner/additional-salaries-kosong', 'Gaji Tambahan (kosong)', async (th) => (await wpAdditionalPage(th, 'kosong')).f);
wpMk('owner/additional-salaries-tidak-cocok', 'Gaji Tambahan (filter tidak cocok)', async (th) => (await wpAdditionalPage(th, 'cari')).f);
wpMk('owner/additional-salaries-galat', 'Gaji Tambahan (galat)', async (th) => (await wpAdditionalPage(th, 'galat')).f);
/** Form tambah/ubah gaji tambahan. mode: tambah | ubah | berulang | galat */
async function wpAdditionalForm(th, mode) {
  const { f } = await wpAdditionalPage(th, 'isi', 1400);
  const edit = mode === 'ubah', rec = mode === 'berulang';
  await dialog(th, f, { title: edit ? 'Ubah Gaji Tambahan' : 'Tambah Gaji Tambahan', w: 600, build: async (b) => {
    if (mode === 'galat') await alertBox('error', 'Pilih karyawan dulu.', th, b);
    if (edit) await inputField('Karyawan', 'Budi Santoso (EMP-000003)', th, b, { disabled: true, helper: 'Karyawan tidak bisa diganti. Kalau salah, hapus lalu buat baru.' });
    else await inputField('Karyawan', mode === 'galat' ? '' : 'Agus Wijaya (EMP-000006)', th, b, { select: true, required: true, error: mode === 'galat' });
    await inputField('Komponen gaji', edit ? 'Bonus Kinerja (BNS)' : 'Potongan Kasbon (KSB)', th, b, { select: true, required: true });
    await inputField('Nominal', edit ? '2500000' : '500000', th, b, { required: true, helper: (edit ? wpRp(2500000) : wpRp(500000)) + ' · dibayar penuh, tidak dihitung sesuai hari dibayar' });
    await wpSwitch(th, b, rec, 'Berlaku beberapa bulan');
    const r = wpRow(th, b, { gap: 16, ay: 'MIN' });
    await wpMonthField(th, r, rec ? 'Mulai bulan' : 'Bulan', 'November 2026');
    if (rec) await wpMonthField(th, r, 'Sampai bulan', 'Januari 2027');
    await wpSwitch(th, b, mode === 'ubah', 'Ganti nilai di struktur gaji', edit ? 'Kalau komponen ini ada di struktur gaji karyawan, nilainya bulan itu diganti dengan nominal ini.' : 'Kalau komponen ini ada di struktur gaji karyawan, nominal ini ditambahkan ke nilainya.');
    await inputField('Catatan', edit ? 'Bonus kinerja Q3' : '', th, b, { multiline: 2 });
    if (!edit) await txt('Mis. cicilan kasbon 1/6, bonus kinerja Q3', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained' }] });
  return f;
}
wpMk('owner/additional-salaries-tambah', 'Dialog Tambah Gaji Tambahan', (th) => wpAdditionalForm(th, 'tambah'));
wpMk('owner/additional-salaries-tambah-berulang', 'Dialog Tambah Gaji Tambahan (beberapa bulan)', (th) => wpAdditionalForm(th, 'berulang'));
wpMk('owner/additional-salaries-tambah-galat', 'Dialog Tambah Gaji Tambahan (galat)', (th) => wpAdditionalForm(th, 'galat'));
wpMk('owner/additional-salaries-ubah', 'Dialog Ubah Gaji Tambahan', (th) => wpAdditionalForm(th, 'ubah'));
wpMk('owner/additional-salaries-hapus', 'Dialog Hapus Gaji Tambahan', async (th) => {
  const { f } = await wpAdditionalPage(th, 'isi', 1100);
  await dialog(th, f, { title: 'Hapus gaji tambahan?', w: 444, build: async (b) => {
    await txt('Potongan Kasbon ' + wpRp(500000) + ' untuk Agus Wijaya (Okt 2026 – Des 2026 · berulang) akan dihapus. Payroll yang masih draf perlu dihitung ulang. Slip gaji yang sudah final tidak berubah.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }] });
  return f;
});
/** Dialog impor Excel. st: awal | file | galat | pesan | tanpa-perubahan */
async function wpImportDialog(th, st) {
  const { f } = await wpAdditionalPage(th, 'isi', 1700);
  const preview = st === 'file';
  await dialog(th, f, { title: 'Unggah Gaji Tambahan dari Excel', w: 900, build: async (b) => {
    await txt(`${WP_CO} · November 2026`, 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    await txt('Satu sel berisi nominal satu komponen untuk satu karyawan di bulan ini.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
    await txt('• Sel kosong tidak mengubah apa-apa.\n• Angka menggantikan nilai bulan ini, bukan menambah.\n• Isi 0 untuk menghapus gaji tambahan komponen itu.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    const r = box('tpl', { dir: 'H', theme: th, parent: b }); await button('Unduh Template November 2026', th, r, { v: 'outlined', size: 'small', icon: 'file' });
    await txt('Template berisi karyawan aktif dan nilai gaji tambahan yang sudah ada bulan ini, jadi tinggal diubah.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
    wpDivider(th, b);
    await button(st === 'awal' || st === 'pesan' ? 'Pilih File Excel' : 'gaji-tambahan-2026-11.xlsx', th, b, { v: 'outlined', icon: 'upload', fillW: true });
    if (st === 'pesan') await alertBox('error', 'File gagal dicek. Coba lagi.', th, b);
    if (st === 'galat') {
      await alertBox('error', 'Baris 4 · Karyawan = "EMP-009999": Nomor karyawan tidak ditemukan\nBaris 7 · Bonus Kinerja = "dua juta": Nominal harus berupa angka\nBaris 12 · Potongan Kasbon = "-500000": Nominal tidak boleh negatif\ndan 9 lainnya.', th, b, '12 isian bermasalah, belum ada yang tersimpan');
    }
    if (st === 'tanpa') await alertBox('info', '0 baru · 0 diubah · 0 dihapus · 14 isian sama dengan yang sudah ada', th, b, 'Tidak ada perubahan');
    if (preview) {
      await alertBox('success', '3 baru · 1 diubah · 1 dihapus · 6 isian sama dengan yang sudah ada\nKomponen: Bonus Kinerja, Potongan Kasbon, PPh 21', th, b, '5 perubahan siap disimpan');
      const cols = [{ t: 'Karyawan', w: 'fill' }, { t: 'Komponen', w: 200 }, { t: 'Sebelumnya', w: 130, align: 'right' }, { t: 'Menjadi', w: 130, align: 'right' }, { t: '', w: 100 }];
      await table(th, b, { cols, foot: false, rowH: 56, rows: [
        [{ t: 'Budi Santoso', sub: 'EMP-000003 · baris 2' }, { t: 'Bonus Kinerja', sub: 'BNS' }, '–', wpRp(2500000), { chip: 'Baru', color: 'success', variant: 'outlined' }],
        [{ t: 'Siti Rahmawati', sub: 'EMP-000005 · baris 3' }, { t: 'PPh 21', sub: 'PPH' }, '–', wpRp(150000), { chip: 'Baru', color: 'success', variant: 'outlined' }],
        [{ t: 'Rina Kartika', sub: 'EMP-000007 · baris 5' }, { t: 'Bonus Kinerja', sub: 'BNS' }, wpRp(1000000), wpRp(1750000), { chip: 'Diubah', color: 'warning', variant: 'outlined' }],
        [{ t: 'Agus Wijaya', sub: 'EMP-000006 · baris 6' }, { t: 'Potongan Kasbon', sub: 'KSB' }, wpRp(500000), '–', { chip: 'Dihapus', color: 'error', variant: 'outlined' }]] });
    }
  }, actions: [{ label: 'Batal' }, { label: preview ? 'Simpan 5 Perubahan' : 'Simpan', v: 'contained', disabled: !preview }] });
  return f;
}
wpMk('owner/additional-salaries-impor', 'Dialog Impor Excel (awal)', (th) => wpImportDialog(th, 'awal'));
wpMk('owner/additional-salaries-impor-pratinjau', 'Dialog Impor Excel (pratinjau perubahan)', (th) => wpImportDialog(th, 'file'));
wpMk('owner/additional-salaries-impor-galat', 'Dialog Impor Excel (galat baris)', (th) => wpImportDialog(th, 'galat'));
wpMk('owner/additional-salaries-impor-pesan', 'Dialog Impor Excel (galat umum)', (th) => wpImportDialog(th, 'pesan'));
wpMk('owner/additional-salaries-impor-tanpa-perubahan', 'Dialog Impor Excel (tanpa perubahan)', (th) => wpImportDialog(th, 'tanpa'));

/* =====================================================================
 * 5. Penetapan Gaji
 * ===================================================================== */
const WP_SA_COLS = [{ t: 'Karyawan', w: 'fill' }, { t: 'Departemen', w: 160 }, { t: 'Struktur gaji', w: 170 }, { t: 'Gaji dasar', w: 130, align: 'right' }, { t: 'Gaji variabel', w: 120, align: 'right' }, { t: 'Berlaku sejak', w: 200 }, { t: '', w: 110, align: 'right' }];
const WP_SA_ROWS = [
  [{ t: 'Budi Santoso', sub: 'EMP-000003' }, 'Teknologi Informasi', 'Staf Tetap', wpRp(9500000), wpRp(500000), { t: '1 Jan 2026', sub: 'naik mulai 2027-01-01' }, '2 riwayat'],
  [{ t: 'Dewi Lestari', sub: 'EMP-000004' }, 'SDM', 'Manajer', wpRp(15000000), wpRp(0), '1 Mar 2025', '1 riwayat'],
  [{ t: 'Siti Rahmawati', sub: 'EMP-000005' }, 'Keuangan', 'Staf Tetap', wpRp(8000000), wpRp(0), '1 Jul 2025', '3 riwayat'],
  [{ t: 'Agus Wijaya', sub: 'EMP-000006' }, 'Operasional', { chip: 'Belum ditetapkan', color: 'warning', variant: 'solid' }, '', '', '', { chip: 'Tetapkan', color: 'primary', variant: 'solid' }],
  [{ t: 'Rina Kartika', sub: 'EMP-000007' }, 'Operasional', 'Staf Operasional', wpRp(6500000), wpRp(250000), '1 Sep 2026', '1 riwayat'],
];
async function wpAssignPage(th, st, h) {
  const { f, main, act } = await wpPage(th, 'Penetapan Gaji', h ?? 1100, 'Penetapan Gaji', 'Struktur gaji dan gaji dasar tiap karyawan. Untuk kenaikan gaji, buat penetapan baru dengan tanggal berlaku yang lebih baru.');
  const noStruct = st === 'tanpa-struktur';
  await button('Tetapkan Sekaligus', th, act, { v: 'outlined', icon: 'users', disabled: noStruct });
  await button('Tetapkan Gaji', th, act, { icon: 'plus', disabled: noStruct });
  if (st === 'galat') await alertBox('error', 'Gagal memuat penetapan gaji. Coba lagi.', th, main);
  const fc = card(th, main, { pad: 16, dir: 'H', gap: 12, ay: 'CENTER' });
  await inputField('Perusahaan', WP_CO, th, fc, { w: 240, select: true });
  await inputField('Cari nama atau nomor karyawan', '', th, fc, { w: 260, icon: 'search' });
  await inputField('Departemen', 'Semua Departemen', th, fc, { w: 220, select: true });
  const sw = box('sw', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: fc }); toggle(false, th, sw); await txt('Hanya yang belum ditetapkan (1)', 'body2', 'color/text/primary', th, { parent: sw });
  if (noStruct) await alertBox('info', 'Belum ada struktur gaji yang aktif di perusahaan ini. Buat struktur gaji dulu sebelum menetapkan gaji.', th, main);
  if (st === 'kosong') { const c = card(th, main, { pad: 48, ax: 'CENTER', ay: 'CENTER' }); await txt('Belum ada karyawan aktif di perusahaan ini.', 'body', 'color/text/secondary', th, { parent: c, align: 'CENTER' }); }
  else if (st === 'cari') { const c = card(th, main, { pad: 48, ax: 'CENTER', ay: 'CENTER' }); await txt('Tidak ada karyawan yang cocok.', 'body', 'color/text/secondary', th, { parent: c, align: 'CENTER' }); }
  else await table(th, main, { cols: WP_SA_COLS, rows: WP_SA_ROWS, foot: false });
  return { f, main };
}
wpMk('owner/salary-assignments', 'Penetapan Gaji', async (th) => (await wpAssignPage(th, 'isi')).f);
wpMk('owner/salary-assignments-kosong', 'Penetapan Gaji (tanpa karyawan)', async (th) => (await wpAssignPage(th, 'kosong')).f);
wpMk('owner/salary-assignments-tidak-cocok', 'Penetapan Gaji (filter tidak cocok)', async (th) => (await wpAssignPage(th, 'cari')).f);
wpMk('owner/salary-assignments-tanpa-struktur', 'Penetapan Gaji (belum ada struktur)', async (th) => (await wpAssignPage(th, 'tanpa-struktur')).f);
wpMk('owner/salary-assignments-galat', 'Penetapan Gaji (galat)', async (th) => (await wpAssignPage(th, 'galat')).f);
/** Dialog riwayat karyawan (+ pratinjau slip). st: riwayat | pratinjau | kosong | galat */
async function wpAssignDetail(th, st) {
  const { f } = await wpAssignPage(th, 'isi', st === 'pratinjau' ? 2700 : 1500);
  await dialog(th, f, { title: 'Budi Santoso', w: 900, build: async (b) => {
    await txt('EMP-000003 · Teknologi Informasi', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    const hr = wpRow(th, b, { ax: 'SPACE_BETWEEN' });
    await txt('Riwayat penetapan gaji', 'subtitle', 'color/text/primary', th, { parent: hr });
    await button('Tambah Penetapan Baru', th, hr, { v: 'text', size: 'small', icon: 'plus' });
    if (st === 'kosong') await alertBox('warning', 'Karyawan ini belum punya penetapan gaji.', th, b);
    else await table(th, b, { foot: false, rowH: 60, cols: [{ t: 'Berlaku sejak', w: 170 }, { t: 'Struktur gaji', w: 'fill' }, { t: 'Gaji dasar', w: 130, align: 'right' }, { t: 'Gaji variabel', w: 130, align: 'right' }, { t: 'Dibuat oleh', w: 150 }, { t: '', w: 60, align: 'right' }], rows: [
      [{ t: '1 Jan 2027', sub: 'Akan datang' }, { t: 'Staf Tetap', sub: 'Kenaikan tahunan 2027' }, wpRp(10500000), wpRp(500000), { t: 'Dewi Lestari', sub: '20 Nov 2026' }, { actions: ['trash'] }],
      [{ t: '1 Jan 2026', sub: 'Berlaku' }, { t: 'Staf Tetap' }, wpRp(9500000), wpRp(500000), { t: 'Dewi Lestari', sub: '2 Jan 2026' }, { actions: ['trash'] }],
      [{ t: '1 Mar 2025' }, { t: 'Staf Kontrak', sub: 'Gaji awal' }, wpRp(8000000), wpRp(0), { t: 'Dewi Lestari', sub: '28 Feb 2025' }, { actions: ['trash'] }]] });
    wpDivider(th, b);
    await txt('Pratinjau slip gaji', 'subtitle', 'color/text/primary', th, { parent: b });
    const r = wpRow(th, b, { gap: 12, ay: 'MIN' });
    await wpMonthField(th, r, 'Bulan', 'November 2026');
    await inputField('Hari cuti tidak dibayar', '0', th, r, {});
    await button('Pratinjau', th, r, { v: 'outlined', icon: 'money' });
    if (st === 'galat') await alertBox('error', 'Gagal membuat pratinjau slip gaji. Coba lagi.', th, b);
    if (st === 'pratinjau') { const c = card(th, b, { pad: 16 }); await wpSlipView(th, c, { wide: true }); }
  }, actions: [{ label: 'Tutup' }] });
  return f;
}
wpMk('owner/salary-assignments-riwayat', 'Dialog Riwayat Penetapan Gaji', (th) => wpAssignDetail(th, 'riwayat'));
wpMk('owner/salary-assignments-pratinjau', 'Dialog Riwayat + Pratinjau Slip', (th) => wpAssignDetail(th, 'pratinjau'));
wpMk('owner/salary-assignments-pratinjau-galat', 'Dialog Riwayat (pratinjau galat)', (th) => wpAssignDetail(th, 'galat'));
wpMk('owner/salary-assignments-riwayat-kosong', 'Dialog Riwayat (belum ada penetapan)', (th) => wpAssignDetail(th, 'kosong'));
wpMk('owner/salary-assignments-hapus', 'Dialog Hapus Penetapan Gaji', async (th) => {
  const { f } = await wpAssignPage(th, 'isi', 1100);
  await dialog(th, f, { title: 'Hapus penetapan gaji?', w: 444, build: async (b) => {
    await txt('Penetapan Staf Tetap sejak 1 Jan 2027 dengan gaji dasar ' + wpRp(10500000) + ' akan dihapus. Bulan-bulan itu akan pakai penetapan sebelumnya (kalau ada).', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }] });
  return f;
});
async function wpAssignSingle(th, galat) {
  const { f } = await wpAssignPage(th, 'isi', 1100);
  await dialog(th, f, { title: 'Tetapkan Gaji', w: 600, build: async (b) => {
    if (galat) await alertBox('error', 'Pilih karyawan dan struktur gaji dulu.', th, b);
    await inputField('Karyawan', galat ? '' : 'Rina Kartika (EMP-000007)', th, b, { select: true, required: true, error: galat, helper: galat ? undefined : 'Saat ini: Staf Operasional · ' + wpRp(6500000) + ' sejak 1 Sep 2026' });
    await inputField('Struktur gaji', galat ? '' : 'Staf Operasional', th, b, { select: true, required: true });
    await inputField('Berlaku sejak', '01/01/2027', th, b, { required: true, endIcon: 'calendar' });
    const r = wpRow(th, b, { gap: 16, ay: 'MIN' });
    await inputField('Gaji dasar', galat ? '' : '7000000', th, r, { required: true, helper: galat ? ' ' : wpRp(7000000) });
    await inputField('Gaji variabel (opsional)', '250000', th, r, { helper: wpRp(250000) });
    await inputField('Catatan', '', th, b, { multiline: 2 });
    await txt('Mis. kenaikan tahunan 2027', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained' }] });
  return f;
}
wpMk('owner/salary-assignments-tetapkan', 'Dialog Tetapkan Gaji', (th) => wpAssignSingle(th, false));
wpMk('owner/salary-assignments-tetapkan-galat', 'Dialog Tetapkan Gaji (galat)', (th) => wpAssignSingle(th, true));
async function wpAssignBulk(th, galat) {
  const { f } = await wpAssignPage(th, 'isi', 1500);
  await dialog(th, f, { title: 'Tetapkan Gaji Sekaligus', w: 900, build: async (b) => {
    await txt('Pakai satu struktur gaji dan tanggal berlaku untuk banyak karyawan sekaligus. Kalau ada yang gagal, tidak ada yang tersimpan.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    if (galat) await alertBox('error', 'Gaji dasar belum diisi untuk 2 karyawan (Agus Wijaya, Maya Anggraini).', th, b);
    const r = wpRow(th, b, { gap: 16, ay: 'MIN' });
    await inputField('Struktur gaji', 'Staf Operasional', th, r, { select: true, required: true });
    await inputField('Berlaku sejak', '01/01/2027', th, r, { required: true, endIcon: 'calendar' });
    await inputField('Catatan', 'Penyesuaian UMK 2027', th, b, {});
    wpDivider(th, b);
    const r2 = wpRow(th, b, { gap: 12 });
    await inputField('Departemen', 'Operasional', th, r2, { select: true });
    await inputField('Cari nama atau nomor', '', th, r2, { icon: 'search' });
    const r3 = wpRow(th, b, { gap: 12, ay: 'MIN' });
    const l = box('l', { dir: 'H', ay: 'CENTER', theme: th, parent: r3 }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL'; l.counterAxisSizingMode = 'FIXED'; l.resize(100, 56); l.layoutSizingHorizontal = 'FILL';
    await txt('2 karyawan dipilih', 'body2-strong', 'color/text/primary', th, { parent: l });
    await inputField('Samakan gaji dasar untuk semua yang dipilih', '7000000', th, r3, { w: 360, helper: wpRp(7000000) });
    await button('Samakan', th, r3, { v: 'outlined' });
    const t = box('bulk', { dir: 'V', theme: th, parent: b, fillW: true, stroke: 'color/border', radius: 10, clip: true });
    const hd = wpRow(th, t, { gap: 10, pad: [12, 16, 12, 16], fill: 'color/background' });
    checkbox(true, th, hd);
    const hn = await txt('Karyawan', 'th', 'color/text/secondary', th, { parent: hd, upper: true }); hn.layoutGrow = 1;
    const hs = await txt('Saat ini', 'th', 'color/text/secondary', th, { parent: hd, upper: true }); hs.resize(220, hs.height); hs.textAutoResize = 'HEIGHT';
    const hb = await txt('Gaji dasar baru', 'th', 'color/text/secondary', th, { parent: hd, upper: true }); hb.resize(200, hb.height); hb.textAutoResize = 'HEIGHT';
    const rows = [[true, 'Agus Wijaya', 'EMP-000006', 'warn', galat ? '' : '7000000'], [true, 'Rina Kartika', 'EMP-000007', 'Staf Operasional · ' + wpRp(6500000), '7000000'], [false, 'Eko Prasetyo', 'EMP-000011', 'Staf Operasional · ' + wpRp(6800000), '']];
    for (const [ck, n, num, cur, v] of rows) {
      const rr = wpRow(th, t, { gap: 10, pad: [8, 16, 8, 16], stroke: 'color/border' }); rr.strokeTopWeight = 1; rr.strokeLeftWeight = 0; rr.strokeRightWeight = 0; rr.strokeBottomWeight = 0;
      checkbox(ck, th, rr);
      const nc = box('n', { dir: 'V', theme: th, parent: rr }); nc.layoutGrow = 1; nc.layoutSizingHorizontal = 'FILL';
      await txt(n, 'body2-strong', 'color/text/primary', th, { parent: nc }); await txt(num, 'caption', 'color/text/secondary', th, { parent: nc });
      const cc = box('cur', { dir: 'H', ay: 'CENTER', theme: th, parent: rr }); cc.counterAxisSizingMode = 'AUTO'; cc.primaryAxisSizingMode = 'FIXED'; cc.resize(220, 20);
      if (cur === 'warn') await chip('Belum ditetapkan', th, cc, { color: 'warning', variant: 'solid' }); else await txt(cur, 'body2', 'color/text/primary', th, { parent: cc });
      await inputField('Gaji dasar', v, th, rr, { w: 200, disabled: !ck, error: galat && ck && v === '', helper: v ? wpRp(Number(v)) : ' ' });
    }
  }, actions: [{ label: 'Batal' }, { label: 'Simpan 2 Penetapan', v: 'contained' }] });
  return f;
}
wpMk('owner/salary-assignments-sekaligus', 'Dialog Tetapkan Gaji Sekaligus', (th) => wpAssignBulk(th, false));
wpMk('owner/salary-assignments-sekaligus-galat', 'Dialog Tetapkan Gaji Sekaligus (galat)', (th) => wpAssignBulk(th, true));

/* =====================================================================
 * 6. Struktur Gaji
 * ===================================================================== */
const WP_STRUCTS = [
  { n: 'Staf Tetap', on: true, note: 'Untuk karyawan tetap kantor pusat', e: 4, d: 3, c: 1, k: 38 },
  { n: 'Staf Kontrak', on: true, note: '', e: 3, d: 2, c: 0, k: 9 },
  { n: 'Struktur Lama 2024', on: false, note: 'Tidak dipakai lagi', e: 3, d: 2, c: 1, k: 0 },
];
async function wpStructPage(th, st, h) {
  const { f, main, act } = await wpPage(th, 'Struktur Gaji', h ?? 1000, 'Struktur Gaji', 'Kumpulan komponen pendapatan dan potongan untuk menghitung slip gaji karyawan.');
  await button('Buat Struktur Gaji', th, act, { icon: 'plus' });
  if (st === 'galat') await alertBox('error', 'Gagal memuat struktur gaji. Coba lagi.', th, main);
  if (st === 'tanpa-perusahaan') await alertBox('info', 'Tambahkan perusahaan dulu sebelum membuat struktur gaji.', th, main);
  const fc = card(th, main, { pad: 16 }); await inputField('Perusahaan', st === 'tanpa-perusahaan' ? '' : WP_CO, th, fc, { w: 360, select: true });
  if (st === 'tanpa-komponen') await alertBox('warning', 'Perusahaan ini belum punya komponen gaji. Buat komponen gaji dulu. [Buka]', th, main);
  if (st === 'kosong' || st === 'tanpa-komponen') {
    const c = card(th, main, { pad: 40, gap: 8, ax: 'CENTER', ay: 'CENTER' });
    icon('plans', 48, 'color/text/disabled', th, c);
    await txt('Belum ada struktur gaji', 'subtitle', 'color/text/primary', th, { parent: c });
    await txt('Struktur gaji adalah daftar komponen (gaji pokok, tunjangan, potongan, iuran BPJS, dll.) untuk sekelompok karyawan. Hubungkan karyawan ke struktur gaji lewat penetapan gaji, lalu slip gaji bulanan dihitung dari situ.', 'body2', 'color/text/secondary', th, { parent: c, w: 520, align: 'CENTER' });
    await button('Buat Struktur Gaji', th, c, { icon: 'plus' });
  } else if (st !== 'tanpa-perusahaan') {
    const list = wpCol(th, main, { gap: 12 });
    for (const s of WP_STRUCTS) {
      const c = card(th, list, { dir: 'H', gap: 12, ay: 'CENTER', pad: 16 });
      const l = box('l', { dir: 'V', gap: 4, theme: th, parent: c }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL';
      const t = box('t', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: l });
      await txt(s.n, 'body2-strong', 'color/text/primary', th, { parent: t });
      await chip(s.on ? 'Aktif' : 'Nonaktif', th, t, s.on ? { color: 'success', variant: 'solid' } : { color: 'default', variant: 'outlined' });
      if (s.note) await txt(s.note, 'body2', 'color/text/secondary', th, { parent: l, fillW: true });
      await txt(`${s.e} pendapatan · ${s.d} potongan${s.c ? ` · ${s.c} ditanggung perusahaan` : ''} · dipakai ${s.k} karyawan`, 'caption', 'color/text/secondary', th, { parent: l, fillW: true });
      await button('Ubah', th, c, { v: 'text', size: 'small', icon: 'edit' });
      await button('Pratinjau', th, c, { v: 'text', size: 'small', icon: 'eye' });
      await button('Hapus', th, c, { v: 'text', size: 'small', color: 'error', icon: 'trash' });
    }
  }
  return { f, main };
}
wpMk('owner/salary-structures', 'Struktur Gaji', async (th) => (await wpStructPage(th, 'isi')).f);
wpMk('owner/salary-structures-kosong', 'Struktur Gaji (kosong)', async (th) => (await wpStructPage(th, 'kosong')).f);
wpMk('owner/salary-structures-tanpa-komponen', 'Struktur Gaji (belum ada komponen)', async (th) => (await wpStructPage(th, 'tanpa-komponen')).f);
wpMk('owner/salary-structures-tanpa-perusahaan', 'Struktur Gaji (belum ada perusahaan)', async (th) => (await wpStructPage(th, 'tanpa-perusahaan', 700)).f);
wpMk('owner/salary-structures-galat', 'Struktur Gaji (galat)', async (th) => (await wpStructPage(th, 'galat')).f);
/** Satu kartu komponen di editor struktur. */
async function wpStructRow(th, parent, r) {
  const c = card(th, parent, { pad: 10, gap: 6, radius: 8 });
  const top = wpRow(th, c, { ay: 'MIN', gap: 8 });
  const l = box('l', { dir: 'V', gap: 2, theme: th, parent: top }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL';
  const t = box('t', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: l });
  await txt(r.n, 'body2-strong', 'color/text/primary', th, { parent: t });
  await txt(r.abbr, 'caption', 'color/text/secondary', th, { parent: t });
  if (r.off) await chip('komponen nonaktif', th, t, { color: 'warning', variant: 'outlined' });
  if (r.ov) await chip('diatur khusus', th, t, { color: 'primary', variant: 'outlined' });
  await txt(r.calc, 'caption', 'color/text/secondary', th, { parent: l, fillW: true });
  const ab = box('arrows', { dir: 'H', theme: th, parent: top });
  await iconButton('up', th, ab, { size: 30, iconSize: 18 }); await iconButton('down', th, ab, { size: 30, iconSize: 18 }); await iconButton('trash', th, ab, { size: 30, iconSize: 18, color: 'color/danger' });
  const bt = box('exp', { dir: 'H', theme: th, parent: c });
  await button('Atur khusus di struktur gaji ini', th, bt, { v: 'text', size: 'small', icon: r.exp ? 'down' : 'chevron' });
  if (r.exp) {
    await wpSwitch(th, c, r.ov, r.ov ? 'Pakai pengaturan khusus' : 'Ikut pengaturan komponen');
    if (r.ov) {
      await wpSwitch(th, c, true, 'Pakai rumus');
      await inputField('Rumus', r.formula ?? 'base * 0.5', th, c, {});
      await inputField('Kondisi', '', th, c, { helper: 'Komponen hanya dihitung saat kondisinya terpenuhi.' });
    }
  }
  return c;
}
async function wpStructEditor(th, st) {
  const { f } = await wpStructPage(th, 'isi', 2000);
  const edit = st !== 'buat';
  await dialog(th, f, { title: edit ? 'Ubah Struktur Gaji' : 'Buat Struktur Gaji', w: 900, build: async (b) => {
    await inputField('Nama', edit ? 'Staf Tetap' : '', th, b, { required: true });
    await inputField('Catatan', edit ? 'Untuk karyawan tetap kantor pusat' : '', th, b, { multiline: 2 });
    await wpSwitch(th, b, true, 'Aktif');
    wpDivider(th, b);
    await alertBox('info', 'Pendapatan dihitung duluan, baru potongan. Rumus hanya bisa pakai komponen yang ada di atasnya.', th, b);
    if (st === 'galat') await alertBox('error', '• Rumus komponen "BPK" memakai "XYZ" yang tidak ada di atasnya\n• Komponen "PPH" tidak boleh dipakai di pendapatan', th, b, 'Struktur gaji belum bisa disimpan:');
    if (st === 'tanpa-komponen') await alertBox('warning', 'Buat komponen gaji dulu. [Buka]', th, b);
    const groups = st === 'buat' ? [['Pendapatan', []], ['Potongan', []], ['Ditanggung Perusahaan', []]] : [
      ['Pendapatan', [{ n: 'Gaji Pokok', abbr: 'GP', calc: 'base' }, { n: 'Tunjangan Makan', abbr: 'TM', calc: '25000 * present_days', ov: st === 'khusus', exp: st === 'khusus', formula: '30000 * present_days' }, { n: 'Tunjangan Transport', abbr: 'TT', calc: wpRp(500000), off: st === 'galat' }]],
      ['Potongan', [{ n: 'BPJS Kesehatan (Karyawan)', abbr: 'BPK', calc: 'GP * 0.01' }, { n: 'PPh 21', abbr: 'PPH', calc: wpRp(0) }]],
      ['Ditanggung Perusahaan', [{ n: 'BPJS Kesehatan (Perusahaan)', abbr: 'BPP', calc: 'GP * 0.04' }]]];
    for (const [g, rows] of groups) {
      const gc = wpCol(th, b, { gap: 8 });
      await txt(`${g} (${rows.length})`, 'label', 'color/text/secondary', th, { parent: gc, upper: true });
      if (rows.length === 0) await txt(`Belum ada komponen ${g.toLowerCase()}.`, 'body2', 'color/text/disabled', th, { parent: gc });
      for (const r of rows) await wpStructRow(th, gc, r);
    }
    await inputField('Tambah komponen', '', th, b, { select: true, helper: st === 'penuh' ? 'Semua komponen aktif sudah ada di struktur gaji ini.' : undefined });
  }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained' }] });
  return f;
}
wpMk('owner/salary-structures-buat', 'Dialog Buat Struktur Gaji', (th) => wpStructEditor(th, 'buat'));
wpMk('owner/salary-structures-ubah', 'Dialog Ubah Struktur Gaji', (th) => wpStructEditor(th, 'ubah'));
wpMk('owner/salary-structures-ubah-khusus', 'Dialog Ubah Struktur (pengaturan khusus komponen)', (th) => wpStructEditor(th, 'khusus'));
wpMk('owner/salary-structures-ubah-galat', 'Dialog Ubah Struktur (galat validasi)', (th) => wpStructEditor(th, 'galat'));
wpMk('owner/salary-structures-ubah-penuh', 'Dialog Ubah Struktur (semua komponen sudah ditambahkan)', (th) => wpStructEditor(th, 'penuh'));
wpMk('owner/salary-structures-pratinjau', 'Dialog Pratinjau Slip Struktur', async (th) => {
  const { f } = await wpStructPage(th, 'isi', 2400);
  await dialog(th, f, { title: 'Pratinjau Slip Gaji · Staf Tetap', w: 600, build: async (b) => {
    await txt('Coba hitung slip gaji pakai struktur ini. Tidak ada yang disimpan.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    await inputField('Karyawan', 'Budi Santoso (EMP-000003)', th, b, { select: true });
    const r = wpRow(th, b, { gap: 16 });
    await wpMonthField(th, r, 'Bulan', 'November 2026');
    await inputField('Hari cuti tidak dibayar', '0', th, r, {});
    await inputField('Gaji dasar', '', th, b, { helper: 'kosongkan untuk pakai penetapan gaji karyawan' });
    const bt = box('bt', { dir: 'H', theme: th, parent: b }); await button('Hitung', th, bt, { icon: 'money' });
    wpDivider(th, b);
    await wpSlipView(th, b);
  }, actions: [{ label: 'Tutup' }] });
  return f;
});
wpMk('owner/salary-structures-pratinjau-galat', 'Dialog Pratinjau Slip Struktur (galat)', async (th) => {
  const { f } = await wpStructPage(th, 'isi', 1100);
  await dialog(th, f, { title: 'Pratinjau Slip Gaji · Staf Tetap', w: 600, build: async (b) => {
    await txt('Coba hitung slip gaji pakai struktur ini. Tidak ada yang disimpan.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    await inputField('Karyawan', 'Agus Wijaya (EMP-000006)', th, b, { select: true });
    const r = wpRow(th, b, { gap: 16 });
    await wpMonthField(th, r, 'Bulan', 'November 2026');
    await inputField('Hari cuti tidak dibayar', '0', th, r, {});
    await inputField('Gaji dasar', '', th, b, { helper: 'kosongkan untuk pakai penetapan gaji karyawan' });
    const bt = box('bt', { dir: 'H', theme: th, parent: b }); await button('Hitung', th, bt, { icon: 'money' });
    await alertBox('error', 'Karyawan belum punya penetapan gaji. Kalau karyawan ini belum punya penetapan gaji, isi Gaji dasar lalu hitung lagi.', th, b);
  }, actions: [{ label: 'Tutup' }] });
  return f;
});
async function wpStructDelete(th, dipakai) {
  const { f } = await wpStructPage(th, 'isi', 1000);
  await dialog(th, f, { title: 'Hapus Struktur Gaji?', w: 444, build: async (b) => {
    await txt(dipakai ? 'Hapus struktur gaji Staf Tetap? Ini tidak bisa dibatalkan.' : 'Hapus struktur gaji Struktur Lama 2024? Ini tidak bisa dibatalkan.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
    if (dipakai) await alertBox('warning', 'Struktur gaji ini dipakai 38 karyawan. Lebih aman dinonaktifkan saja.', th, b);
  }, actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }] });
  return f;
}
wpMk('owner/salary-structures-hapus', 'Dialog Hapus Struktur Gaji', (th) => wpStructDelete(th, false));
wpMk('owner/salary-structures-hapus-dipakai', 'Dialog Hapus Struktur Gaji (dipakai karyawan)', (th) => wpStructDelete(th, true));

/* =====================================================================
 * 7. Komponen Gaji
 * ===================================================================== */
const WP_COMP_COLS = [{ t: 'Nama', w: 'fill' }, { t: 'Singkatan', w: 110 }, { t: 'Nilai', w: 240 }, { t: 'Keterangan', w: 250 }, { t: 'Status', w: 100 }, { t: 'Aksi', w: 100, align: 'right' }];
const WP_COMP_ROWS = {
  earning: [
    [{ t: 'Gaji Pokok', sub: 'Gaji dasar karyawan' }, { chip: 'GP', variant: 'outlined' }, { t: 'base' }, 'Sesuai hari dibayar · Kena pajak', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
    [{ t: 'Lembur' }, { chip: 'LMB', variant: 'outlined' }, { t: 'round(base / 173 * overtime_hours)' }, 'Kena pajak', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
    [{ t: 'Tunjangan Makan' }, { chip: 'TM', variant: 'outlined' }, { t: '25000 * present_days' }, 'Kena pajak', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
    [{ t: 'Tunjangan Transport' }, { chip: 'TT', variant: 'outlined' }, { t: wpRp(500000), sub: "kalau employment_type == 'permanent'" }, 'Kena pajak', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
    [{ t: 'Upah Dasar BPJS' }, { chip: 'UB', variant: 'outlined' }, { t: 'base' }, 'Komponen bantu · Tidak masuk total', { chip: 'Nonaktif', color: 'default', variant: 'outlined' }, { actions: ['edit', 'trash'] }],
  ],
  deduction: [
    [{ t: 'BPJS Kesehatan (Karyawan)' }, { chip: 'BPK', variant: 'outlined' }, { t: 'GP * 0.01' }, 'Sesuai hari dibayar', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
    [{ t: 'BPJS JHT (Karyawan)' }, { chip: 'JHT', variant: 'outlined' }, { t: 'GP * 0.02' }, '', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
    [{ t: 'PPh 21' }, { chip: 'PPH', variant: 'outlined' }, { t: wpRp(0) }, '', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
  ],
  employer_contribution: [[{ t: 'BPJS Kesehatan (Perusahaan)' }, { chip: 'BPP', variant: 'outlined' }, { t: 'GP * 0.04' }, 'Sesuai hari dibayar', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }]],
};
async function wpCompPage(th, st, h) {
  const { f, main, act } = await wpPage(th, 'Komponen Gaji', h ?? 1100, 'Komponen Gaji', '8 komponen · 5 pendapatan · 2 potongan · 1 ditanggung perusahaan');
  await button('Tambah Komponen', th, act, { icon: 'plus' });
  if (st === 'galat') await alertBox('error', 'Gagal memuat komponen gaji. Coba lagi.', th, main);
  if (st === 'tanpa-perusahaan') await alertBox('info', 'Tambahkan perusahaan dulu sebelum membuat komponen gaji.', th, main);
  const c = card(th, main, { pad: 0, clip: true });
  const tb = wpRow(th, c, { pad: 16, ax: 'SPACE_BETWEEN' });
  await inputField('Perusahaan', WP_CO, th, tb, { w: 240, select: true });
  await inputField('Cari nama atau singkatan', st === 'cari' ? 'xyz' : '', th, tb, { w: 280, icon: 'search' });
  const tab = st === 'potongan' ? 1 : st === 'kosong' ? 2 : 0;
  await tabs(['Pendapatan (5)', 'Potongan (3)', st === 'kosong' ? 'Ditanggung Perusahaan (0)' : 'Ditanggung Perusahaan (1)'], tab, th, c);
  if (st === 'cari') { const eb = wpCol(th, c, { pad: [40, 16, 40, 16], ax: 'CENTER', ay: 'CENTER' }); await txt('Tidak ada komponen gaji yang cocok dengan "xyz".', 'body', 'color/text/secondary', th, { parent: eb, align: 'CENTER' }); }
  else if (st === 'kosong') {
    const eb = wpCol(th, c, { pad: 32, gap: 12, ax: 'CENTER', ay: 'CENTER' });
    await txt('Belum ada komponen ditanggung perusahaan', 'body2-strong', 'color/text/primary', th, { parent: eb });
    await txt('Komponen gaji adalah satu baris di slip gaji: dibayar perusahaan, tidak menambah atau memotong gaji karyawan, mis. BPJS bagian perusahaan. Nilainya bisa nominal tetap atau rumus. Singkatannya bisa dipakai di rumus komponen lain.', 'body2', 'color/text/secondary', th, { parent: eb, w: 520, align: 'CENTER' });
    const ex = card(th, eb, { pad: 12, gap: 4 }); ex.fills = [pv(th, 'color/background')]; ex.resize(520, 80); ex.layoutSizingHorizontal = 'FIXED';
    await txt('Contoh', 'caption', 'color/text/secondary', th, { parent: ex });
    await txt('Gaji Pokok · singkatan GP · rumus base', 'body2', 'color/text/primary', th, { parent: ex });
    await txt('Lalu komponen lain bisa pakai GP * 0.04', 'body2', 'color/text/primary', th, { parent: ex });
    await button('Tambah Komponen', th, eb, { icon: 'plus' });
  } else wpFlat(await table(th, c, { cols: WP_COMP_COLS, rows: tab === 1 ? WP_COMP_ROWS.deduction : WP_COMP_ROWS.earning, rowH: 60, foot: false }));
  return { f, main };
}
wpMk('owner/salary-components', 'Komponen Gaji (pendapatan)', async (th) => (await wpCompPage(th, 'isi')).f);
wpMk('owner/salary-components-potongan', 'Komponen Gaji (potongan)', async (th) => (await wpCompPage(th, 'potongan')).f);
wpMk('owner/salary-components-kosong', 'Komponen Gaji (kosong)', async (th) => (await wpCompPage(th, 'kosong')).f);
wpMk('owner/salary-components-tidak-cocok', 'Komponen Gaji (pencarian tidak cocok)', async (th) => (await wpCompPage(th, 'cari')).f);
wpMk('owner/salary-components-tanpa-perusahaan', 'Komponen Gaji (belum ada perusahaan)', async (th) => (await wpCompPage(th, 'tanpa-perusahaan', 800)).f);
wpMk('owner/salary-components-galat', 'Komponen Gaji (galat)', async (th) => (await wpCompPage(th, 'galat')).f);
/** Form komponen. st: formula | nominal | ubah | galat | rumus-salah */
async function wpCompForm(th, st) {
  const { f } = await wpCompPage(th, 'isi', 2300);
  const nominal = st === 'nominal', edit = st === 'ubah';
  await dialog(th, f, { title: edit ? 'Ubah Komponen Gaji' : 'Tambah Komponen Gaji', w: 900, build: async (b) => {
    const r = wpRow(th, b, { gap: 16, ay: 'MIN' });
    await inputField('Nama', edit ? 'Tunjangan Makan' : nominal ? 'Tunjangan Transport' : 'Bonus Kehadiran', th, r, { required: true });
    await inputField('Singkatan', st === 'galat' ? '1BK' : edit ? 'TM' : nominal ? 'TT' : 'BK', th, r, { required: true, error: st === 'galat', helper: st === 'galat' ? 'Harus diawali huruf, lalu huruf, angka, atau _' : 'Dipakai sebagai nama di rumus' });
    await inputField('Jenis', 'Pendapatan', th, b, { select: true, required: true });
    await inputField('Deskripsi', '', th, b, {});
    wpDivider(th, b);
    await wpSwitch(th, b, !nominal, 'Pakai rumus', 'Matikan kalau nominalnya tetap dan sama untuk semua karyawan.');
    if (nominal) await inputField('Nominal', '500000', th, b, { required: true, helper: wpRp(500000) });
    else {
      await inputField('Rumus', edit ? '25000 * present_days' : st === 'rumus-salah' ? 'GP * * 0.04' : 'base * 0.04', th, b, { multiline: 2, required: true, error: st === 'rumus-salah', focus: st !== 'rumus-salah' });
      const ok = st !== 'rumus-salah';
      const fr = box('feedback', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: b });
      icon(ok ? 'check' : 'alert', 16, ok ? 'color/success' : 'color/danger', th, fr);
      await txt(ok ? 'Rumus sudah benar' : 'Rumusnya belum benar: operator tidak boleh berurutan', 'caption', ok ? 'color/success' : 'color/danger', th, { parent: fr });
    }
    await inputField('Kondisi (opsional)', '', th, b, { helper: "Kosongkan kalau selalu berlaku. Kalau diisi, komponen hanya dihitung saat kondisinya terpenuhi. Contoh: employment_type == 'permanent'" });
    // Panel variabel & fungsi
    const p = box('panel', { dir: 'V', gap: 8, pad: 12, fill: 'color/background', radius: 8, theme: th, parent: b, fillW: true });
    const hint = box('hint', { dir: 'H', gap: 4, theme: th, parent: p });
    await txt('Klik untuk memasukkan ke kolom', 'caption', 'color/text/secondary', th, { parent: hint }); await txt(nominal ? 'Kondisi' : 'Rumus', 'caption-strong', 'color/text/primary', th, { parent: hint });
    await txt('Variabel bawaan', 'caption-strong', 'color/text/primary', th, { parent: p });
    const vars = ['base', 'variable', 'payment_days', 'total_working_days', 'calendar_days', 'working_days', 'holidays', 'present_days', 'rostered_days', 'absent_days', 'holiday_present_days', 'month', 'year', 'gross_pay', 'lwp_days', 'overtime_hours', 'overtime_raw_hours'];
    await wpChipRows(th, p, vars.map((v) => ({ l: v, color: 'primary' })), 5);
    await txt('Komponen lain', 'caption-strong', 'color/text/primary', th, { parent: p });
    await wpChipRows(th, p, ['GP', 'TM', 'TT', 'LMB', 'BPK', 'JHT'].map((v) => ({ l: v, color: 'info' })), 8);
    await txt('Fungsi', 'caption-strong', 'color/text/primary', th, { parent: p });
    await wpChipRows(th, p, ['round', 'int', 'flt', 'ceil', 'floor', 'abs', 'min', 'max', 'rounded'].map((v) => ({ l: v + '()' })), 9);
    wpDivider(th, b);
    await wpSwitch(th, b, edit, 'Hitung sesuai hari dibayar (prorata)', 'Nilainya dikurangi kalau karyawan tidak kerja sebulan penuh, mis. baru masuk atau ambil cuti tidak dibayar.');
    await wpSwitch(th, b, true, 'Kena pajak', 'Ikut dihitung sebagai penghasilan kotor untuk PPh 21.');
    await wpSwitch(th, b, false, 'Komponen bantu (tidak dibayar)', 'Hanya dipakai untuk rumus komponen lain. Tidak dibayar dan tidak ikut dijumlah ke total.');
    await wpSwitch(th, b, false, 'Tidak masuk total', 'Tampil di slip gaji, tapi tidak ikut dijumlah ke total pendapatan atau potongan.');
    await wpSwitch(th, b, false, 'Bulatkan ke rupiah penuh', 'Hasilnya dibulatkan, tanpa sen.');
    await wpSwitch(th, b, true, 'Aktif', 'Komponen nonaktif tidak ikut dihitung di slip gaji.');
  }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained', disabled: st === 'galat' || st === 'rumus-salah' }] });
  return f;
}
wpMk('owner/salary-components-tambah', 'Dialog Tambah Komponen (rumus)', (th) => wpCompForm(th, 'formula'));
wpMk('owner/salary-components-tambah-nominal', 'Dialog Tambah Komponen (nominal tetap)', (th) => wpCompForm(th, 'nominal'));
wpMk('owner/salary-components-tambah-galat', 'Dialog Tambah Komponen (singkatan salah)', (th) => wpCompForm(th, 'galat'));
wpMk('owner/salary-components-tambah-rumus-salah', 'Dialog Tambah Komponen (rumus salah)', (th) => wpCompForm(th, 'rumus-salah'));
wpMk('owner/salary-components-ubah', 'Dialog Ubah Komponen', (th) => wpCompForm(th, 'ubah'));
wpMk('owner/salary-components-hapus', 'Dialog Hapus Komponen Gaji', async (th) => {
  const { f } = await wpCompPage(th, 'isi', 1100);
  await dialog(th, f, { title: 'Hapus Komponen Gaji?', w: 444, build: async (b) => {
    await txt('Tunjangan Makan (TM) akan dihapus. Komponen yang masih dipakai di struktur gaji atau di rumus komponen lain tidak bisa dihapus. Nonaktifkan saja.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }] });
  return f;
});

/* =====================================================================
 * 8. Pengaturan Payroll
 * ===================================================================== */
const WP_BASIS = [
  { v: 'calendar_days', t: 'Hari kalender (30/31)', d: 'Sabtu, Minggu, dan tanggal merah ikut dihitung. Karyawan yang kerja sebulan penuh selalu dapat gaji utuh, berapa pun jumlah liburnya.', x: 'Contoh: masuk tanggal 16 November, dibayar 15/30. Potongan 1 hari cuti tidak dibayar = 1/30.' },
  { v: 'actual_working_days', t: 'Hari kerja riil (sesuai roster)', d: 'Karyawan yang punya roster: hari yang dijadwalkan masuk (termasuk Sabtu dan Minggu, mis. untuk security), dikurangi tanggal merah. Karyawan tanpa roster: Senin–Jumat atau Senin–Sabtu, dikurangi tanggal merah.', x: 'Contoh: security pola 2 pagi, 2 malam, 2 libur punya 20 hari terjadwal di November, jadi dibayar 20/20 dan potongan 1 hari = 1/20. Staf kantor: 21 hari kerja.' },
  { v: 'fixed_days', t: 'Angka tetap', d: 'Pembaginya selalu sama, mis. 21 (5 hari kerja) atau 25 (6 hari kerja), sesuai aturan upah harian. Karyawan yang kerja sebulan penuh selalu dapat gaji utuh.', x: 'Contoh angka 21: sebulan penuh selalu 21/21. Masuk atau keluar di tengah bulan, 21 dikurangi hari kerja yang terlewat (dari roster kalau ada), sama seperti cuti tanpa upah.' },
];
async function wpSettingsPage(th, sel, st) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Pengaturan Payroll', h: 2300 });
  const hd = wpCol(th, main, { gap: 4 });
  await txt('Pengaturan Payroll', 'h5', 'color/text/primary', th, { parent: hd });
  await txt('Berlaku per perusahaan. Payroll yang masih draf perlu dihitung ulang supaya ikut berubah. Slip gaji yang sudah final tidak berubah.', 'body2', 'color/text/secondary', th, { parent: hd, fillW: true });
  if (st === 'galat') { await alertBox('error', 'Gagal memuat pengaturan. Coba lagi.', th, main); await inputField('Perusahaan', WP_CO, th, main, { w: 260, select: true }); return { f, main }; }
  await inputField('Perusahaan', WP_CO, th, main, { w: 260, select: true });
  const c = card(th, main, { pad: 24, gap: 8 });
  await txt('Cara menghitung hari kerja sebulan', 'subtitle', 'color/text/primary', th, { parent: c });
  await txt('Dipakai untuk menghitung gaji karyawan yang masuk atau keluar di tengah bulan, dan potongan cuti tidak dibayar. Di rumus, angka ini bernama total_working_days.', 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
  gap(c, 4);
  for (const o of WP_BASIS) {
    const on = o.v === sel;
    const b = box('opsi/' + o.v, { dir: 'V', gap: 4, pad: [12, 16, 12, 16], stroke: on ? 'color/primary' : 'color/border', radius: 8, theme: th, parent: c, fillW: true });
    const hr = box('hr', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent: b }); wpRadio(th, hr, on); await txt(o.t, 'body2-strong', 'color/text/primary', th, { parent: hr });
    const d = await txt(o.d, 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    const x = await txt(o.x, 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
    if (on && o.v === 'fixed_days') await inputField('Jumlah hari kerja sebulan', st === 'kosong-angka' ? '' : '21', th, b, { w: 280, error: st === 'kosong-angka', helper: 'Biasanya 21 untuk 5 hari kerja, 25 untuk 6 hari kerja.' });
  }
  wpDivider(th, c);
  await txt('Hari kerja per pekan', 'subtitle', 'color/text/primary', th, { parent: c });
  await inputField('Hari kerja per pekan', '5 hari (Senin–Jumat)', th, c, { w: 240, select: true });
  await txt('Hanya untuk karyawan yang tidak punya roster di bulan itu. Karyawan yang punya roster selalu ikut rosternya.', 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
  gap(c, 4);
  await alertBox('info', 'Apa pun pilihannya, rumus juga bisa pakai working_days (hari kerja riil), holidays (tanggal merah di hari kerja), calendar_days (hari kalender), present_days (hari hadir), rostered_days (hari terjadwal), absent_days (mangkir: terjadwal tapi tidak absen dan tidak cuti), dan holiday_present_days (masuk di tanggal merah). Contoh: Uang Makan 25000 * present_days, Potongan Mangkir round(base / total_working_days * absent_days).', th, c);
  wpDivider(th, c);
  const bt = box('bt', { dir: 'H', theme: th, parent: c }); await button('Simpan Pengaturan', th, bt);
  if (st === 'kosong-angka') await txt('Isi jumlah hari kerja dulu, mis. 21 atau 25', 'caption', 'color/danger', th, { parent: c });
  // Cek hari kerja per karyawan
  const c2 = card(th, main, { pad: 24, gap: 12 });
  const hr = wpRow(th, c2, { ay: 'MIN', ax: 'SPACE_BETWEEN' });
  const hl = wpCol(th, hr, { gap: 2, fillW: false }); hl.layoutGrow = 1; hl.layoutSizingHorizontal = 'FILL';
  await txt('Cek hari kerja per karyawan', 'subtitle', 'color/text/primary', th, { parent: hl });
  await txt('Dihitung dari roster, tanggal merah, absensi, dan cuti di November 2026, pakai pengaturan yang sudah disimpan. Cek dulu di sini sebelum proses payroll.', 'body2', 'color/text/secondary', th, { parent: hl, fillW: true });
  await wpMonthField(th, hr, 'Bulan', 'November 2026', { w: 220 });
  const cols = [{ t: 'Karyawan', w: 'fill' }, { t: 'Sumber', w: 120 }, { t: 'Terjadwal', w: 90, align: 'right' }, { t: 'Tgl merah', w: 90, align: 'right' }, { t: 'Hari kerja riil', w: 110, align: 'right' }, { t: 'Pembagi', w: 80, align: 'right' }, { t: 'Hadir', w: 70, align: 'right' }, { t: 'Mangkir', w: 80, align: 'right' }, { t: 'Masuk tgl merah', w: 120, align: 'right' }];
  await table(th, c2, { cols, foot: false, rows: [
    [{ t: 'Agus Wijaya', sub: 'EMP-000006' }, { chip: 'Roster', color: 'primary', variant: 'outlined' }, '20', '—', '20', '20', '18', '2', '—'],
    [{ t: 'Budi Santoso', sub: 'EMP-000003' }, { chip: 'Senin–Jumat', color: 'default', variant: 'outlined' }, '—', '—', '21', '21', '21', '—', '—'],
    [{ t: 'Dewi Lestari', sub: 'EMP-000004' }, { chip: 'Senin–Jumat', color: 'default', variant: 'outlined' }, '—', '—', '21', '21', '20', '—', '—'],
    [{ t: 'Rina Kartika', sub: 'EMP-000007' }, { chip: 'Roster', color: 'primary', variant: 'outlined' }, '22', '1', '21', '21', '21', '0', '1']] });
  await txt('Mangkir hanya dihitung untuk tanggal yang sudah lewat, dan hanya untuk karyawan yang punya roster. Hari dengan koreksi absensi atau cuti yang disetujui tidak dihitung mangkir.', 'caption', 'color/text/secondary', th, { parent: c2, fillW: true });
  return { f, main };
}
wpMk('owner/payroll-settings', 'Pengaturan Payroll (hari kalender)', async (th) => (await wpSettingsPage(th, 'calendar_days')).f);
wpMk('owner/payroll-settings-roster', 'Pengaturan Payroll (hari kerja riil)', async (th) => (await wpSettingsPage(th, 'actual_working_days')).f);
wpMk('owner/payroll-settings-angka-tetap', 'Pengaturan Payroll (angka tetap)', async (th) => (await wpSettingsPage(th, 'fixed_days')).f);
wpMk('owner/payroll-settings-angka-kosong', 'Pengaturan Payroll (angka tetap belum diisi)', async (th) => (await wpSettingsPage(th, 'fixed_days', 'kosong-angka')).f);
wpMk('owner/payroll-settings-galat', 'Pengaturan Payroll (galat)', async (th) => {
  const { f } = await wpSettingsPage(th, 'calendar_days', 'galat'); return f;
});

/* =====================================================================
 * 9. Slip Gaji Saya
 * ===================================================================== */
const WP_MY = [['November 2026', 'Staf Tetap', 9050000, 390000, 8660000], ['Oktober 2026', 'Staf Tetap', 9050000, 390000, 8660000], ['September 2026', 'Staf Tetap', 8550000, 370000, 8180000], ['Agustus 2026', 'Staf Kontrak', 8000000, 320000, 7680000]];
async function wpMyPage(th, st, h) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Slip Gaji', h: h ?? 900 });
  const hd = wpCol(th, main, { gap: 4 });
  await txt('Slip Gaji Saya', 'h5', 'color/text/primary', th, { parent: hd });
  await txt('Rincian gaji tiap bulan yang sudah dibayar.', 'body2', 'color/text/secondary', th, { parent: hd });
  if (st === 'galat') await alertBox('error', 'Gagal memuat slip gaji. Coba lagi.', th, main);
  if (st === 'belum-terhubung') await alertBox('info', 'Akun ini belum terhubung ke data karyawan, jadi slip gaji belum bisa ditampilkan. Minta HR untuk menghubungkannya.', th, main);
  else if (st === 'kosong') {
    const c = card(th, main, { pad: 48, gap: 12, ax: 'CENTER', ay: 'CENTER' });
    icon('file', 40, 'color/text/disabled', th, c);
    await txt('Belum ada slip gaji. Slip gaji muncul setelah HR memfinalkan payroll bulan itu.', 'body', 'color/text/secondary', th, { parent: c, align: 'CENTER' });
  } else if (st !== 'galat') {
    const list = wpCol(th, main, { gap: 12 });
    for (const [m, s, g, d, n] of WP_MY) {
      const c = card(th, list, { dir: 'H', gap: 24, ay: 'CENTER', pad: 16 });
      const l = box('l', { dir: 'V', gap: 2, theme: th, parent: c }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL';
      await txt(m, 'body2-strong', 'color/text/primary', th, { parent: l }); await txt(s, 'body2', 'color/text/secondary', th, { parent: l });
      for (const [lb, v, b] of [['Pendapatan Kotor', g], ['Potongan', d], ['Gaji bersih (THP)', n, true]]) {
        const a = box('amount', { dir: 'V', gap: 2, theme: th, parent: c }); a.counterAxisSizingMode = 'AUTO'; a.primaryAxisSizingMode = 'FIXED'; a.resize(150, 20);
        await txt(lb, 'caption', 'color/text/secondary', th, { parent: a }); await txt(wpRp(v), b ? 'subtitle' : 'body2', 'color/text/primary', th, { parent: a });
      }
    }
  }
  return { f, main };
}
wpMk('owner/my-salary-slips', 'Slip Gaji Saya', async (th) => (await wpMyPage(th, 'isi')).f);
wpMk('owner/my-salary-slips-kosong', 'Slip Gaji Saya (kosong)', async (th) => (await wpMyPage(th, 'kosong')).f);
wpMk('owner/my-salary-slips-belum-terhubung', 'Slip Gaji Saya (akun belum terhubung)', async (th) => (await wpMyPage(th, 'belum-terhubung')).f);
wpMk('owner/my-salary-slips-galat', 'Slip Gaji Saya (galat)', async (th) => (await wpMyPage(th, 'galat')).f);
async function wpMyDialog(th, st) {
  const { f } = await wpMyPage(th, 'isi', 2300);
  await dialog(th, f, { title: 'Slip Gaji November 2026', w: 600, build: async (b) => {
    if (st === 'galat') { await alertBox('error', 'Gagal memuat slip gaji. Coba lagi.', th, b); return; }
    if (st === 'unduh-galat') await alertBox('error', 'Gagal mengunduh PDF. Coba lagi.', th, b);
    const h = wpCol(th, b, { gap: 2 });
    await txt('Slip Gaji November 2026', 'label', 'color/text/secondary', th, { parent: h, upper: true });
    await txt('EMP-000003 · Staf IT · Teknologi Informasi', 'body2', 'color/text/secondary', th, { parent: h, fillW: true });
    await txt('BCA 1234567890 a.n. Budi Santoso', 'body2', 'color/text/secondary', th, { parent: h, fillW: true });
    wpDivider(th, b);
    await wpSlipView(th, b);
  }, actions: [{ label: 'Tutup' }, { label: 'Unduh PDF', v: 'outlined', icon: 'file' }, { label: 'Cetak', v: 'contained' }] });
  return f;
}
wpMk('owner/my-salary-slips-detail', 'Dialog Slip Gaji Saya', (th) => wpMyDialog(th, 'isi'));
wpMk('owner/my-salary-slips-detail-galat', 'Dialog Slip Gaji Saya (galat)', (th) => wpMyDialog(th, 'galat'));
wpMk('owner/my-salary-slips-detail-unduh-galat', 'Dialog Slip Gaji Saya (unduh PDF gagal)', (th) => wpMyDialog(th, 'unduh-galat'));
