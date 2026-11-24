/* =====================================================================
 * Kehadiran dan Jadwal (owner): Rekap Absensi, Koreksi Absensi, Aturan Absensi, Roster, Shift, Hari Libur
 * Prefiks: wh / WH_
 * ===================================================================== */
const WH_GROUP = 'Kehadiran dan Jadwal';
registerIcons({
  'wh-flag': '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>', 'wh-night': '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  'wh-place': '<path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>', 'wh-open': '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
});

/* ---------- helper ---------- */
function whDivider(th, parent) { const d = box('divider', { dir: 'H', fill: 'color/border', theme: th, parent }); d.resize(100, 1); d.layoutSizingHorizontal = 'FILL'; return d; }
function whFixedH(node, h) { node.counterAxisSizingMode = 'FIXED'; node.primaryAxisSizingMode = 'FIXED'; node.resize(100, h); node.layoutSizingHorizontal = 'FILL'; return node; }
async function whRow(label, value, th, parent, o = {}) {
  const r = box('row/' + label, { dir: 'H', gap: 16, ax: 'SPACE_BETWEEN', ay: 'MIN', theme: th, parent, fillW: true });
  await txt(label, 'body2', 'color/text/secondary', th, { parent: r });
  await txt(value, o.muted ? 'body2' : 'body2-strong', o.muted ? 'color/text/disabled' : (o.color ?? 'color/text/primary'), th, { parent: r, align: 'RIGHT' });
  return r;
}
async function whHeading(text, th, parent) { await txt(text, 'body2-strong', 'color/text/primary', th, { parent, fillW: true }); }
async function whSwitchRow(label, on, th, parent, helper) {
  const r = box('switch/' + label, { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent });
  toggle(on, th, r); await txt(label, 'body', 'color/text/primary', th, { parent: r });
  if (helper) { const h = box('helper', { dir: 'H', pad: [0, 0, 0, 48], theme: th, parent, fillW: true }); await txt(helper, 'caption', 'color/text/secondary', th, { parent: h, fillW: true }); }
}
function whCardPage(th, parent) { return card(th, parent, { pad: 0, clip: true }); }
async function whFilterBar(th, parent, items) {
  const b = box('filters', { dir: 'H', gap: 12, ay: 'CENTER', pad: 16, stroke: 'color/border', theme: th, parent, fillW: true });
  b.strokeTopWeight = 0; b.strokeLeftWeight = 0; b.strokeRightWeight = 0;
  for (const it of items) {
    if (it.search) { const s = await inputField(it.search, '', th, b, { icon: 'search' }); s.layoutGrow = 1; }
    else { const w = await inputField(it.label, it.value ?? '', th, b, { w: it.w ?? 170, select: it.select, endIcon: it.endIcon }); }
  }
  return b;
}
/** Tabel DataGrid: kosong menampilkan "No rows" di tengah. */
async function whGridOrEmpty(th, parent, cols, rows, foot) {
  if (rows.length) return table(th, parent, { cols, rows, foot });
  const e = box('No rows', { dir: 'H', ax: 'CENTER', ay: 'CENTER', theme: th, parent, fillW: true }); whFixedH(e, 160);
  await txt('No rows', 'body2', 'color/text/secondary', th, { parent: e });
  return e;
}
async function whLoadError(th, main, msg) { await alertBox('error', msg, th, main); }
async function whTwoActions(th, f, title, build, actions, w) { return dialog(th, f, { title, w, build, actions }); }

/* =====================================================================
 * REKAP ABSENSI
 * ===================================================================== */
const WH_ATT_COLS = [{ t: 'Tanggal', w: 110 }, { t: 'No. Karyawan', w: 125 }, { t: 'Nama', w: 'fill' }, { t: 'Shift', w: 160 }, { t: 'Masuk', w: 125 }, { t: 'Pulang', w: 110 }, { t: 'Status', w: 150 }, { t: '', w: 48, align: 'center' }];
const WH_ATT_ROWS = [
  ['2026-11-23', 'EMP-000003', 'Budi Santoso', { t: 'Shift Pagi', sub: '08:00–17:00' }, '07:56', '17:04', { chip: 'Hadir', color: 'success' }, { icon: 'chevron' }],
  ['2026-11-23', 'EMP-000004', 'Dewi Lestari', { t: 'Shift Pagi', sub: '08:00–17:00' }, '08:27 +12m', '17:10', { chip: 'Terlambat', color: 'warning' }, { icon: 'chevron' }],
  ['2026-11-23', 'EMP-000005', 'Siti Rahmawati', { t: 'Shift Siang', sub: '14:00–23:00' }, '13:58', '—', { chip: 'Belum absen pulang', color: 'warning' }, { icon: 'chevron' }],
  ['2026-11-23', 'EMP-000006', 'Agus Wijaya', { t: 'Shift Pagi', sub: '08:00–17:00' }, '—', '—', { chip: 'Mangkir', color: 'error' }, { icon: 'chevron' }],
  ['2026-11-23', 'EMP-000007', 'Rina Kartika', { t: 'Shift Malam', sub: '22:00–06:00 +1' }, '21:52', '—', { chip: 'Terjadwal', color: 'default' }, { icon: 'chevron' }],
  ['2026-11-22', 'EMP-000008', 'Eko Prasetyo', { t: 'Shift Malam', sub: '22:00–06:00 +1' }, '22:03', '06:01 +1', { chip: 'Hadir', color: 'success' }, { icon: 'chevron' }],
];
async function whAttBase(th, o = {}) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Rekap Absensi', h: o.h ?? 1200 });
  const rows = o.empty ? [] : WH_ATT_ROWS;
  const act = await pageHeader(th, main, 'Rekap Absensi', o.empty ? '0 dari 0 jadwal' : '6 dari 128 jadwal');
  await button('Ekspor Excel', th, act, { icon: 'download', disabled: !!o.empty });
  if (o.error) await whLoadError(th, main, 'Gagal memuat rekap. Coba lagi.');
  if (!o.empty && !o.error) await alertBox('warning', '2 absen perlu dicek: di luar radius, GPS palsu, atau dikirim setelah offline. Klik untuk lihat yang perlu dicek saja.', th, main);
  if (!o.empty) {
    const cr = box('summary', { dir: 'H', gap: 8, theme: th, parent: main, fillW: true });
    await chip('Hadir: 86', th, cr, { color: 'success', variant: 'outlined' }); await chip('Terlambat: 21', th, cr, { color: 'warning', variant: 'outlined' });
    await chip('Belum absen pulang: 6', th, cr, { color: 'warning', variant: 'outlined' }); await chip('Mangkir: 4', th, cr, { color: 'error', variant: 'outlined' }); await chip('Terjadwal: 11', th, cr, { color: 'default', variant: 'outlined' });
  }
  const c = whCardPage(th, main);
  await whFilterBar(th, c, [{ search: 'Cari nama atau nomor karyawan' }, { label: 'Dari', value: '2026-11-01', endIcon: 'calendar', w: 170 }, { label: 'Sampai', value: '2026-11-30', endIcon: 'calendar', w: 170 }, { label: 'Perusahaan', value: 'Semua Perusahaan', select: true, w: 200 }]);
  const t = await whGridOrEmpty(th, c, WH_ATT_COLS, rows, rows.length ? '1–6 dari 128' : '0–0 dari 0');
  if (rows.length && !o.error) { // penanda "perlu dicek" di sel Status
    for (const ri of [2, 3]) { const cell = t.children[ri + 1].children[6]; icon('wh-flag', 16, 'color/warning', th, cell); }
  }
  return { f, main };
}
registerScreen({ key: 'owner/attendances', group: WH_GROUP, title: 'Rekap Absensi', build: async (th) => (await whAttBase(th)).f });
registerScreen({ key: 'owner/attendances-kosong', group: WH_GROUP, title: 'Rekap Absensi (kosong)', build: async (th) => (await whAttBase(th, { empty: true, h: 760 })).f });
registerScreen({ key: 'owner/attendances-galat', group: WH_GROUP, title: 'Rekap Absensi (galat)', build: async (th) => (await whAttBase(th, { empty: true, error: true, h: 800 })).f });

/** Drawer detail baris (kanan, 480). v: 'tandai' | 'belum' */
async function whAttDrawer(th, f, v) {
  const scrim = figma.createRectangle(); scrim.name = 'scrim'; scrim.resize(f.width, f.height); scrim.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.5 }];
  f.appendChild(scrim); scrim.layoutPositioning = 'ABSOLUTE'; scrim.x = 0; scrim.y = 0;
  const d = box('Drawer', { dir: 'V', fill: 'color/surface', theme: th, parent: f, fixed: [480, f.height] }); d.layoutPositioning = 'ABSOLUTE'; d.x = f.width - 480; d.y = 0;
  const hd = box('header', { dir: 'H', ay: 'MIN', pad: [24, 24, 16, 24], theme: th, parent: d, fillW: true });
  const hl = box('title', { dir: 'V', gap: 6, theme: th, parent: hd }); hl.layoutGrow = 1; hl.layoutSizingHorizontal = 'FILL';
  const tn = v === 'tandai' ? 'Dewi Lestari' : 'Agus Wijaya';
  await txt(tn, 'h6', 'color/text/primary', th, { parent: hl });
  const sub = box('sub', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: hl });
  await txt((v === 'tandai' ? 'EMP-000004' : 'EMP-000006') + ' · 2026-11-23', 'body2', 'color/text/secondary', th, { parent: sub });
  await chip(v === 'tandai' ? 'Terlambat' : 'Mangkir', th, sub, { color: v === 'tandai' ? 'warning' : 'error', variant: 'tint' });
  await iconButton('x', th, hd, { size: 34 });
  const body = box('body', { dir: 'V', gap: 24, pad: [0, 24, 24, 24], theme: th, parent: d, fillW: true }); body.layoutGrow = 1; body.layoutSizingVertical = 'FILL';
  if (v === 'tandai') {
    await alertBox('warning', 'Absen masuk 412 m dari kantor, di luar radius 100 m.', th, body, 'Perlu dicek');
    const m = box('AttendanceMap', { dir: 'V', gap: 8, ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', stroke: 'color/border', radius: 8, theme: th, parent: body }); whFixedH(m, 220);
    icon('map', 40, 'color/primary', th, m); const lg = box('legend', { dir: 'H', gap: 16, theme: th, parent: m });
    const l1 = box('masuk', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: lg }); const r1 = figma.createRectangle(); r1.resize(10, 10); r1.cornerRadius = 5; r1.fills = [pv(th, 'color/success')]; l1.appendChild(r1); await txt('Masuk', 'caption', 'color/text/primary', th, { parent: l1 });
    const l2 = box('pulang', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: lg }); const r2 = figma.createRectangle(); r2.resize(10, 10); r2.cornerRadius = 5; r2.fills = [pv(th, 'color/warning')]; l2.appendChild(r2); await txt('Pulang', 'caption', 'color/text/primary', th, { parent: l2 });
    await txt('Lingkaran hijau radius 100 m di Kantor Pusat Jakarta.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true });
  }
  const sec = async (title, rows, tail) => {
    const s = box('section/' + title, { dir: 'V', gap: 8, theme: th, parent: body, fillW: true });
    await txt(title, 'subtitle', 'color/text/primary', th, { parent: s, fillW: true }); gap(s, 4);
    for (const r of rows) await whRow(r[0], r[1], th, s, { muted: r[2] });
    if (tail) await txt(tail, 'body2', 'color/text/disabled', th, { parent: s, fillW: true });
  };
  await sec('Jadwal', v === 'tandai'
    ? [['Shift', 'Shift Pagi (PAGI)'], ['Jam kerja', '08:00'], ['Sampai', '17:00'], ['Toleransi terlambat', '15 menit'], ['Kantor', 'Kantor Pusat Jakarta']]
    : [['Shift', 'Shift Pagi (PAGI)'], ['Jam kerja', '08:00'], ['Sampai', '17:00'], ['Toleransi terlambat', '15 menit'], ['Kantor', 'Tanpa kantor tetap', true]]);
  whDivider(th, body);
  if (v === 'tandai') {
    await sec('Absen masuk', [['Waktu', '08:27'], ['Terlambat', '12 menit'], ['Jarak dari kantor', '412 m'], ['Akurasi GPS', '18 m'], ['GPS palsu', 'Terdeteksi', false], ['Koordinat', '-6.20876, 106.84560']]);
    whDivider(th, body);
    await sec('Absen pulang', [['Waktu', '17:10'], ['Jarak dari kantor', '38 m'], ['Akurasi GPS', '9 m']]);
    whDivider(th, body);
    await sec('Perangkat', [['Sumber', 'Sinkron offline'], ['ID perangkat', 'a1f3c9e27b40'], ['Waktu menurut HP', '08:26']]);
  } else {
    await sec('Absen masuk', [], 'Belum absen masuk.'); whDivider(th, body);
    await sec('Absen pulang', [], 'Belum absen pulang. Perbaiki lewat pengajuan koreksi absen.'); whDivider(th, body);
    await sec('Perangkat', [['Sumber', '—'], ['ID perangkat', '—']]);
  }
  const ft = box('footer', { dir: 'H', ax: 'MAX', pad: 24, stroke: 'color/border', theme: th, parent: d, fillW: true });
  ft.strokeBottomWeight = 0; ft.strokeLeftWeight = 0; ft.strokeRightWeight = 0;
  await button('Tutup', th, ft, { v: 'text' });
}
registerScreen({ key: 'owner/attendances-detail', group: WH_GROUP, title: 'Rekap Absensi (detail, perlu dicek)', build: async (th) => { const { f } = await whAttBase(th, { h: 1300 }); await whAttDrawer(th, f, 'tandai'); return f; } });
registerScreen({ key: 'owner/attendances-detail-mangkir', group: WH_GROUP, title: 'Rekap Absensi (detail, mangkir)', build: async (th) => { const { f } = await whAttBase(th, { h: 1000 }); await whAttDrawer(th, f, 'belum'); return f; } });

/* =====================================================================
 * KOREKSI ABSENSI
 * ===================================================================== */
const WH_REQ_COLS = [{ t: 'Tanggal Shift', w: 130 }, { t: 'Karyawan', w: 'fill' }, { t: 'Jenis', w: 160 }, { t: 'Alasan', w: 360 }, { t: 'Status', w: 130 }];
const WH_REQ_ROWS = [
  ['2026-11-21', { t: 'Budi Santoso', sub: 'EMP-000003' }, 'Lupa absen masuk', 'Ponsel mati saat tiba di kantor', { chip: 'Menunggu', color: 'warning' }],
  ['2026-11-20', { t: 'Siti Rahmawati', sub: 'EMP-000005' }, 'Lupa absen pulang', 'Rapat dengan klien sampai malam', { chip: 'Disetujui', color: 'success' }],
  ['2026-11-19', { t: 'Hendra Gunawan', sub: 'EMP-000010' }, 'Kerja dari rumah', 'Jaringan listrik kantor padam', { chip: 'Menunggu', color: 'warning' }],
  ['2026-11-18', { t: 'Putri Handayani', sub: 'EMP-000011' }, 'Dinas luar kota', 'Kunjungan ke cabang Bandung', { chip: 'Ditolak', color: 'error' }],
  ['2026-11-17', { t: 'Doni Setiawan', sub: 'EMP-000012' }, 'Lupa absen masuk', 'Lupa membuka aplikasi', { chip: 'Dibatalkan', color: 'default' }],
];
async function whReqBase(th, o = {}) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Koreksi Absensi', h: o.h ?? 960 });
  const rows = o.empty ? [] : WH_REQ_ROWS;
  const hd = box('hd', { dir: 'V', gap: 4, theme: th, parent: main, fillW: true });
  await txt('Pengajuan Koreksi Absensi', 'h5', 'color/text/primary', th, { parent: hd }); await txt(o.empty ? '0 dari 0 pengajuan' : '5 dari 18 pengajuan', 'body2', 'color/text/secondary', th, { parent: hd });
  if (o.error) await whLoadError(th, main, 'Gagal memuat pengajuan. Coba lagi.');
  if (!o.empty) await alertBox('info', '2 pengajuan masih menunggu persetujuan. Urutan penyetujunya ikut atasan tiap karyawan. Buka menu Persetujuan untuk memproses yang sudah sampai di akun ini.', th, main);
  const c = whCardPage(th, main);
  await whFilterBar(th, c, [{ search: 'Cari nama atau nomor karyawan' }, { label: 'Status', value: 'Semua Status', select: true, w: 170 }]);
  await whGridOrEmpty(th, c, WH_REQ_COLS, rows, rows.length ? '1–5 dari 18' : '0–0 dari 0');
  return { f, main };
}
registerScreen({ key: 'owner/attendance-requests', group: WH_GROUP, title: 'Koreksi Absensi', build: async (th) => (await whReqBase(th)).f });
registerScreen({ key: 'owner/attendance-requests-kosong', group: WH_GROUP, title: 'Koreksi Absensi (kosong)', build: async (th) => (await whReqBase(th, { empty: true, h: 640 })).f });
registerScreen({ key: 'owner/attendance-requests-galat', group: WH_GROUP, title: 'Koreksi Absensi (galat)', build: async (th) => (await whReqBase(th, { empty: true, error: true, h: 700 })).f });
registerScreen({ key: 'owner/attendance-requests-detail', group: WH_GROUP, title: 'Koreksi Absensi (detail)', build: async (th) => {
  const { f } = await whReqBase(th);
  const ctx = async (b) => {
    const ph = box('selfie', { dir: 'V', ax: 'CENTER', ay: 'CENTER', fill: 'color/background', radius: 8, theme: th, parent: b }); whFixedH(ph, 220); icon('camera', 36, 'color/text/secondary', th, ph);
    whDivider(th, b);
    const s = box('info', { dir: 'V', gap: 8, theme: th, parent: b, fillW: true });
    await txt('Budi Santoso · 2026-11-21', 'body2-strong', 'color/text/primary', th, { parent: s, fillW: true });
    await txt('Lupa absen masuk · Shift Pagi', 'body2', 'color/text/secondary', th, { parent: s, fillW: true });
    await txt('Ponsel mati saat tiba di kantor', 'body2', 'color/text/primary', th, { parent: s, fillW: true });
    await txt('Lokasi saat mengajukan: -6.20876, 106.84560', 'caption', 'color/text/secondary', th, { parent: s, fillW: true });
  };
  await dialog(th, f, { title: 'Detail Pengajuan', w: 444, build: ctx, actions: [] });
  return f;
} });
registerScreen({ key: 'owner/attendance-requests-detail-memuat', group: WH_GROUP, title: 'Koreksi Absensi (detail, memuat swafoto)', build: async (th) => {
  const { f } = await whReqBase(th);
  await dialog(th, f, { title: 'Detail Pengajuan', w: 444, actions: [], build: async (b) => {
    const ph = box('loading', { dir: 'V', ax: 'CENTER', ay: 'CENTER', gap: 8, fill: 'color/background', radius: 8, theme: th, parent: b }); whFixedH(ph, 160); icon('refresh', 22, 'color/primary', th, ph);
    whDivider(th, b);
    await txt('Hendra Gunawan · 2026-11-19', 'body2-strong', 'color/text/primary', th, { parent: b, fillW: true });
    await txt('Kerja dari rumah · Shift Pagi', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    await txt('Jaringan listrik kantor padam', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
  } });
  return f;
} });

/* =====================================================================
 * ATURAN ABSENSI
 * ===================================================================== */
function whSlider(th, parent, value, min, max, w) {
  const box0 = box('Slider', { dir: 'H', theme: th, parent, fixed: [w, 22] });
  const pos = (v) => Math.round(((v - min) / (max - min)) * (w - 16)) + 8;
  const tr = figma.createRectangle(); tr.name = 'rail'; tr.resize(w - 8, 4); tr.cornerRadius = 2; tr.fills = [pv(th, 'color/border')]; box0.appendChild(tr); tr.layoutPositioning = 'ABSOLUTE'; tr.x = 4; tr.y = 9;
  const fl = figma.createRectangle(); fl.name = 'track'; fl.resize(Math.max(4, pos(value) - 4), 4); fl.cornerRadius = 2; fl.fills = [pv(th, 'color/primary')]; box0.appendChild(fl); fl.layoutPositioning = 'ABSOLUTE'; fl.x = 4; fl.y = 9;
  const tb = figma.createRectangle(); tb.name = 'thumb'; tb.resize(16, 16); tb.cornerRadius = 8; tb.fills = [pv(th, 'color/primary')]; box0.appendChild(tb); tb.layoutPositioning = 'ABSOLUTE'; tb.x = pos(value) - 8; tb.y = 3;
  return box0;
}
async function whSliderBlock(th, parent, label, value, min, max, help) {
  const b = box('slider/' + label, { dir: 'V', gap: 4, pad: [0, 8, 0, 8], theme: th, parent, fillW: true });
  await txt(`${label} ${value}%`, 'body2', 'color/text/primary', th, { parent: b, fillW: true });
  whSlider(th, b, value, min, max, 760);
  const marks = box('marks', { dir: 'H', ax: 'SPACE_BETWEEN', pad: [0, 56, 0, 56], theme: th, parent: b, fillW: true });
  for (const m of ['30%', '50%', '70%', '90%']) await txt(m, 'caption', 'color/text/secondary', th, { parent: marks });
  await txt(help, 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
}
async function whFaceChart(th, parent, reject, review, empty) {
  const w = box('chart', { dir: 'V', gap: 8, theme: th, parent, fillW: true });
  if (empty) { await alertBox('info', 'Grafik ini terisi setelah karyawan absen dengan cek wajah. Jalankan dulu beberapa minggu tanpa diwajibkan, lalu kembali ke sini untuk menentukan batas skor berdasarkan data.', th, w, 'Belum ada skor wajah'); return w; }
  await txt('Sebaran skor kemiripan wajah', 'body2-strong', 'color/text/primary', th, { parent: w, fillW: true });
  await txt('412 cek wajah dari 2026-10-24 sampai 2026-11-23. Warna batang ikut berubah saat batas skor digeser.', 'body2', 'color/text/secondary', th, { parent: w, fillW: true });
  const area = box('bars', { dir: 'H', gap: 6, ay: 'MAX', pad: [8, 8, 0, 8], theme: th, parent: w, stroke: 'color/border', radius: 8, fillW: true });
  area.counterAxisSizingMode = 'FIXED'; area.primaryAxisSizingMode = 'FIXED'; area.resize(100, 190); area.layoutSizingHorizontal = 'FILL';
  const froms = []; for (let i = 20; i < 100; i += 5) froms.push(i);
  const counts = [0, 1, 0, 2, 1, 3, 4, 6, 9, 14, 22, 38, 61, 88, 97, 66];
  for (const [i, from] of froms.entries()) {
    const r = figma.createRectangle(); r.name = 'bar ' + from; const hh = Math.max(2, Math.round(counts[i] * 1.55)); r.resize(40, hh);
    r.fills = [pv(th, from < reject ? 'color/danger' : from < review ? 'color/warning' : 'color/success')]; area.appendChild(r);
  }
  const ax = box('axis', { dir: 'H', ax: 'SPACE_BETWEEN', pad: [0, 8, 0, 8], theme: th, parent: w, fillW: true });
  for (const l of ['20', '40', '60', '80', '95']) await txt(l + '%', 'caption', 'color/text/secondary', th, { parent: ax });
  await alertBox('error', 'Semua skor ini dari absen asli, orangnya memang masuk kerja. Kalau batas ' + reject + '% disimpan, 3 di antaranya akan ditolak.', th, w, '3 dari 412 cek wajah akan ditolak');
  await txt('14 cek wajah akan ditandai. Absennya tetap diterima, tapi masuk daftar cek HR.', 'caption', 'color/text/secondary', th, { parent: w, fillW: true });
  await txt('Dengan batas yang tersimpan sekarang, 9 absen sudah ditandai karena wajah kurang mirip.', 'caption', 'color/text/secondary', th, { parent: w, fillW: true });
  await alertBox('info', 'Cari celah di grafik: kumpulan skor tinggi dari orang yang benar, lalu ruang kosong di bawahnya. Taruh batas tolak di ruang kosong itu, jangan di tengah kumpulan.', th, w);
  return w;
}
/** Kartu aturan satu perusahaan. v: 'aktif' | 'mati' | 'aktif-aman' | 'aktif-belum-skor' */
async function whPolicyCard(th, parent, name, enrolled, total, v) {
  const c = card(th, parent, { pad: 24, gap: 16 });
  const hd = box('hd', { dir: 'H', ay: 'MIN', theme: th, parent: c, fillW: true });
  const l = box('t', { dir: 'V', gap: 2, theme: th, parent: hd }); await txt(name, 'subtitle', 'color/text/primary', th, { parent: l }); await txt(`${enrolled} dari ${total} karyawan sudah mendaftarkan wajah`, 'body2', 'color/text/secondary', th, { parent: l });
  spacer(hd); const on = v !== 'mati';
  await chip(on ? 'Cek wajah aktif' : 'Cek wajah mati', th, hd, { color: on ? 'success' : 'default', variant: 'solid' });
  await whSwitchRow('Cek wajah saat absen', on, th, c, on ? 'Kamera terbuka saat absen masuk dan absen pulang, lalu wajah dicocokkan dengan yang terdaftar.' : 'Absen cuma cek lokasi. Kamera tidak dibuka.');
  if (on) {
    whDivider(th, c);
    await txt('Batas kemiripan wajah', 'body2-strong', 'color/text/primary', th, { parent: c, fillW: true });
    await txt('Angka bawaan ini cuma titik awal. Jalankan dulu sebulan tanpa diwajibkan, lalu sesuaikan dengan grafik skor di bawah.', 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
    await whSliderBlock(th, c, 'Tolak di bawah', 45, 20, 95, 'Di bawah angka ini, absen ditolak dan tidak tersimpan. Wajah dua orang yang berbeda biasanya cuma dapat 10–30%.');
    await whSliderBlock(th, c, 'Tandai di bawah', 65, 20, 99, 'Di antara 45% dan 65%, absen tetap diterima tapi ditandai untuk dicek HR. Skor di sini biasanya karena cahaya redup atau wajah berubah, jadi jangan langsung ditolak.');
    whDivider(th, c);
    await whFaceChart(th, c, 45, 65, v === 'aktif-belum-skor');
    whDivider(th, c);
    const req = v !== 'aktif-aman-tidak-wajib';
    await whSwitchRow('Wajib daftar wajah', req, th, c, 'Karyawan yang belum daftar wajah tidak bisa absen sama sekali.');
    if (v === 'aktif' || v === 'aktif-belum-skor') await alertBox('error', `Dari ${total} karyawan aktif, baru ${enrolled} yang daftar wajah. Kalau ini disimpan, ${total - enrolled} orang akan gagal absen masuk besok.\nMinta mereka daftar wajah dulu lewat menu Profil di aplikasi, baru nyalakan ini.`, th, c, `${total - enrolled} karyawan tidak akan bisa absen`);
    else await alertBox('info', `Semua ${total} karyawan aktif sudah daftar wajah. Aman untuk diwajibkan.`, th, c);
    await alertBox('warning', 'Data wajah termasuk data pribadi yang dilindungi UU. Aplikasi minta izin karyawan sebelum menyimpannya, dan izinnya tercatat. Karyawan yang menolak tetap bisa absen selama "Wajib daftar wajah" tidak dinyalakan.', th, c);
  }
  const ft = box('footer', { dir: 'H', ax: 'MAX', theme: th, parent: c, fillW: true });
  await button('Simpan', th, ft, { disabled: v === 'mati' || v === 'aktif-aman' });
  return c;
}
async function whPolicyPage(th, o) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Aturan Absensi', h: o.h });
  const hd = box('hd', { dir: 'V', gap: 4, theme: th, parent: main, fillW: true });
  await txt('Aturan Absensi', 'h5', 'color/text/primary', th, { parent: hd });
  await txt('Cek wajah diatur per perusahaan. Misalnya pabrik wajib cek wajah, kantor pusat tidak.', 'body2', 'color/text/secondary', th, { parent: hd, fillW: true });
  await o.body(main);
  return f;
}
registerScreen({ key: 'owner/attendance-policy', group: WH_GROUP, title: 'Aturan Absensi', build: async (th) => whPolicyPage(th, { h: 2500, body: async (m) => {
  const st = box('stack', { dir: 'V', gap: 20, theme: th, parent: m, fillW: true });
  await whPolicyCard(th, st, 'PT Maju Bersama - Pabrik Cikarang', 112, 149, 'aktif'); await whPolicyCard(th, st, 'PT Maju Bersama - Kantor Pusat', 0, 38, 'mati');
} }) });
registerScreen({ key: 'owner/attendance-policy-aman', group: WH_GROUP, title: 'Aturan Absensi (semua sudah daftar)', build: async (th) => whPolicyPage(th, { h: 2300, body: async (m) => { await whPolicyCard(th, m, 'PT Maju Bersama - Kantor Pusat', 38, 38, 'aktif-aman'); } }) });
registerScreen({ key: 'owner/attendance-policy-belum-skor', group: WH_GROUP, title: 'Aturan Absensi (belum ada skor wajah)', build: async (th) => whPolicyPage(th, { h: 1800, body: async (m) => { await whPolicyCard(th, m, 'PT Maju Bersama - Pabrik Cikarang', 12, 149, 'aktif-belum-skor'); } }) });
registerScreen({ key: 'owner/attendance-policy-kosong', group: WH_GROUP, title: 'Aturan Absensi (belum ada perusahaan)', build: async (th) => whPolicyPage(th, { h: 600, body: async (m) => { await alertBox('info', 'Belum ada perusahaan. Tambah dulu di menu Perusahaan.', th, m); } }) });
registerScreen({ key: 'owner/attendance-policy-galat', group: WH_GROUP, title: 'Aturan Absensi (galat)', build: async (th) => {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Aturan Absensi', h: 500 }); await alertBox('error', 'Gagal memuat data. Coba lagi.', th, main); return f;
} });
registerScreen({ key: 'owner/attendance-policy-memuat', group: WH_GROUP, title: 'Aturan Absensi (memuat)', build: async (th) => {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Aturan Absensi', h: 500 });
  const c = box('loading', { dir: 'V', ax: 'CENTER', ay: 'CENTER', pad: 64, theme: th, parent: main, fillW: true }); icon('refresh', 32, 'color/primary', th, c); return f;
} });

/* =====================================================================
 * ROSTER
 * ===================================================================== */
const WH_DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const WH_EMPS = [['Budi Santoso', 'EMP-000003'], ['Dewi Lestari', 'EMP-000004'], ['Siti Rahmawati', 'EMP-000005'], ['Agus Wijaya', 'EMP-000006'], ['Rina Kartika', 'EMP-000007'], ['Eko Prasetyo', 'EMP-000008'], ['Maya Anggraini', 'EMP-000009']];
const WH_HOLIDAYS = { 11: 'Cuti Bersama' };
async function whRosterGrid(th, parent, emps) {
  const NAMEW = 200, CW = 64, N = 14;
  const g = box('grid', { dir: 'V', theme: th, parent, fillW: true, clip: true });
  const mk = async (isHead, e, ei) => {
    const r = box(isHead ? 'thead' : 'row ' + ei, { dir: 'H', theme: th, parent: g });
    const nc = box('sticky name', { dir: 'V', gap: 2, ax: 'CENTER', pad: [0, 12, 0, 12], fill: 'color/surface', stroke: 'color/border', theme: th, parent: r }); nc.counterAxisSizingMode = 'FIXED'; nc.primaryAxisSizingMode = 'FIXED'; nc.resize(NAMEW, isHead ? 48 : 52);
    nc.strokeTopWeight = 0; nc.strokeLeftWeight = 0;
    if (isHead) await txt('Karyawan', 'caption', 'color/text/secondary', th, { parent: nc }); else { await txt(e[0], 'body2-strong', 'color/text/primary', th, { parent: nc }); await txt(e[1], 'caption', 'color/text/secondary', th, { parent: nc }); }
    for (let d = 1; d <= N; d++) {
      const hol = WH_HOLIDAYS[d]; const we = (d - 1) % 7 === 0 || (d - 1) % 7 === 6;
      const cell = box('d' + d, { dir: 'V', gap: 2, ax: 'CENTER', ay: 'CENTER', pad: 4, fill: hol ? 'color/danger-surface' : we ? 'color/background' : null, stroke: 'color/border', theme: th, parent: r }); cell.strokeTopWeight = 0; cell.strokeLeftWeight = 0; cell.strokeRightWeight = 0;
      cell.counterAxisSizingMode = 'FIXED'; cell.primaryAxisSizingMode = 'FIXED'; cell.resize(CW, isHead ? 48 : 52);
      if (isHead) { await txt(WH_DAYS[(d - 1) % 7], 'caption', 'color/text/secondary', th, { parent: cell }); await txt(String(d).padStart(2, '0'), 'body2-strong', 'color/text/primary', th, { parent: cell }); }
      else if (!hol && !we) {
        const code = ['PAGI', 'PAGI', 'SIANG', 'PAGI', 'MALAM'][(ei + d) % 5]; const rw = box('assign', { dir: 'H', gap: 2, ay: 'CENTER', theme: th, parent: cell });
        await chip(code, th, rw, { color: 'default' });
        if (ei === 1 && d === 4) icon('wh-place', 13, 'color/info', th, rw);
      }
    }
  };
  await mk(true);
  for (const [i, e] of emps.entries()) await mk(false, e, i + 1);
  return g;
}
async function whRosterBase(th, o = {}) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Roster', h: o.h ?? 1000 });
  const act = await pageHeader(th, main, 'Roster', o.empty ? '0 karyawan, 0 jadwal' : '7 karyawan, 71 jadwal · 3 tanpa jadwal disembunyikan');
  await button('Template', th, act, { v: 'outlined', icon: 'file' }); await button('Ekspor Excel', th, act, { v: 'outlined', icon: 'download' }); await button('Impor Excel', th, act, { v: 'outlined', icon: 'upload' });
  if (o.error) await whLoadError(th, main, 'Gagal memuat roster. Coba lagi.');
  if (o.noShift) await alertBox('info', 'Belum ada shift. Buat dulu di menu Shift sebelum menyusun roster.', th, main);
  const c = whCardPage(th, main);
  const fb = await whFilterBar(th, c, [{ label: 'Dari', value: '2026-11-01', endIcon: 'calendar', w: 160 }, { label: 'Sampai', value: '2026-11-14', endIcon: 'calendar', w: 160 }, { label: 'Perusahaan', value: 'Semua Perusahaan', select: true, w: 190 }, { label: 'Departemen', value: 'Semua Departemen', select: true, w: 190 }]);
  const sw = box('only', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: fb }); toggle(true, th, sw); await txt('Hanya yang terjadwal', 'body2', 'color/text/primary', th, { parent: sw });
  if (o.loading) { const l = box('loading', { dir: 'H', ax: 'CENTER', ay: 'CENTER', theme: th, parent: c, fillW: true }); whFixedH(l, 240); icon('refresh', 32, 'color/primary', th, l); }
  else if (o.empty) { const e = box('empty', { dir: 'H', ax: 'CENTER', ay: 'CENTER', theme: th, parent: c, fillW: true }); whFixedH(e, 200); await txt('Tidak ada karyawan yang cocok dengan filter.', 'body2', 'color/text/secondary', th, { parent: e }); }
  else await whRosterGrid(th, c, WH_EMPS);
  return { f, main };
}
registerScreen({ key: 'owner/roster', group: WH_GROUP, title: 'Roster', build: async (th) => (await whRosterBase(th)).f });
registerScreen({ key: 'owner/roster-kosong', group: WH_GROUP, title: 'Roster (kosong, belum ada shift)', build: async (th) => (await whRosterBase(th, { empty: true, noShift: true, h: 700 })).f });
registerScreen({ key: 'owner/roster-galat', group: WH_GROUP, title: 'Roster (galat)', build: async (th) => (await whRosterBase(th, { empty: true, error: true, h: 700 })).f });
registerScreen({ key: 'owner/roster-memuat', group: WH_GROUP, title: 'Roster (memuat)', build: async (th) => (await whRosterBase(th, { loading: true, h: 700 })).f });
registerScreen({ key: 'owner/roster-sel', group: WH_GROUP, title: 'Roster (dialog sel)', build: async (th) => {
  const { f } = await whRosterBase(th, { h: 1100 });
  await dialog(th, f, { title: 'Dewi Lestari', w: 444, actions: [{ label: 'Tutup' }], build: async (b) => {
    await txt('2026-11-04 (Rab)', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    const it = box('assignment', { dir: 'H', ay: 'CENTER', pad: 10, stroke: 'color/border', radius: 8, theme: th, parent: b, fillW: true });
    const tx = box('t', { dir: 'V', gap: 2, theme: th, parent: it }); tx.layoutGrow = 1; tx.layoutSizingHorizontal = 'FILL';
    await txt('Shift Pagi', 'body2-strong', 'color/text/primary', th, { parent: tx }); await txt('08:00–17:00 · manual', 'caption', 'color/text/secondary', th, { parent: tx });
    const lo = box('lokasi', { dir: 'H', gap: 4, ay: 'CENTER', theme: th, parent: tx }); icon('wh-place', 13, 'color/info', th, lo); await txt('Di Kantor Cabang Bandung, bukan kantor utamanya', 'caption', 'color/info', th, { parent: lo });
    await iconButton('trash', th, it, { size: 32, iconSize: 18 });
    whDivider(th, b);
    const s = box('add', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true }); await txt('Tambah shift', 'caption', 'color/text/secondary', th, { parent: s });
    await inputField('Shift', 'Shift Siang (14:00–23:00)', th, s, { select: true });
    const l2 = box('lokasi kerja', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true }); await txt('Lokasi Kerja', 'caption', 'color/text/secondary', th, { parent: l2 });
    await inputField('Lokasi Kerja', 'Kantor utama: Kantor Pusat Jakarta', th, l2, { select: true });
    await txt('Biarkan kosong kalau kerja di kantor utama. Isi kalau shift ini di cabang lain.', 'caption', 'color/text/secondary', th, { parent: l2, fillW: true });
    await button('Jadwalkan', th, b, { icon: 'plus', fillW: true });
  } });
  return f;
} });
registerScreen({ key: 'owner/roster-sel-kosong', group: WH_GROUP, title: 'Roster (dialog sel, belum ada jadwal)', build: async (th) => {
  const { f } = await whRosterBase(th, { h: 1100 });
  await dialog(th, f, { title: 'Eko Prasetyo', w: 444, actions: [{ label: 'Tutup' }], build: async (b) => {
    await txt('2026-11-02 (Sen)', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    await txt('Belum ada jadwal. Tanggal tanpa jadwal berarti karyawan tidak masuk kerja.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    whDivider(th, b);
    const s = box('add', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true }); await txt('Tambah shift', 'caption', 'color/text/secondary', th, { parent: s });
    await inputField('Shift', '', th, s, { select: true });
    await inputField('Lokasi Kerja', 'Kantor utama: Kantor Pusat Jakarta', th, b, { select: true });
    await txt('Biarkan kosong kalau kerja di kantor utama. Isi kalau shift ini di cabang lain.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
    await button('Jadwalkan', th, b, { icon: 'plus', fillW: true, disabled: true });
  } });
  return f;
} });

/* ---------- Dialog impor roster (ShiftImportDialog) ---------- */
async function whRosterImportBody(th, b, st) {
  await button('Unduh Template', th, b, { v: 'outlined', size: 'small', icon: 'file' });
  await txt('Template sudah berisi kode shift, kode lokasi, dan nomor karyawan yang ada di sistem. Pakai kode dan nomor yang sama persis saat mengisi.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
  whDivider(th, b);
  await button(st === 'awal' ? 'Pilih File Excel' : 'roster-november.xlsx', th, b, { v: 'outlined', icon: 'upload' });
  if (st === 'memeriksa') await txt('Mengecek file...', 'body2', 'color/text/secondary', th, { parent: b });
  if (st === 'galat') await alertBox('error', 'Baris 4 · Kode Shift = "PAGII": Kode shift tidak ditemukan.\nBaris 9 · Nomor Karyawan = "EMP-009999": Karyawan tidak ditemukan.\nBaris 15 · Tanggal Selesai = "31/13/2026": Format tanggal tidak valid.\ndan 5 baris lainnya.', th, b, '8 baris bermasalah, belum ada yang tersimpan');
  if (st === 'siap') {
    await alertBox('success', 'Dari 12 baris di file, untuk 9 karyawan.\nRentang tanggal 2026-11-01 sampai 2026-11-30.\n18 jadwal sudah ada di roster, jadi dilewati.', th, b, '210 jadwal akan dibuat');
    await alertBox('warning', 'Impor tetap bisa dilanjutkan. Cek dulu kalau ada yang terasa salah.\nBaris 7 · Jeda istirahat antara shift Malam dan Pagi kurang dari 11 jam.', th, b, '1 peringatan');
  }
}
const whRosterImport = (st) => async (th) => {
  const { f } = await whRosterBase(th, { h: 1000 });
  await dialog(th, f, { title: 'Impor Roster dari Excel', w: 600, build: (b) => whRosterImportBody(th, b, st), actions: [{ label: 'Batal' }, { label: st === 'siap' ? 'Simpan 210 Jadwal' : 'Simpan', v: 'contained', disabled: st !== 'siap' }] });
  return f;
};
registerScreen({ key: 'owner/roster-impor', group: WH_GROUP, title: 'Roster (impor Excel)', build: whRosterImport('awal') });
registerScreen({ key: 'owner/roster-impor-memeriksa', group: WH_GROUP, title: 'Roster (impor, memeriksa file)', build: whRosterImport('memeriksa') });
registerScreen({ key: 'owner/roster-impor-siap', group: WH_GROUP, title: 'Roster (impor, siap disimpan)', build: whRosterImport('siap') });
registerScreen({ key: 'owner/roster-impor-galat', group: WH_GROUP, title: 'Roster (impor, baris bermasalah)', build: whRosterImport('galat') });

/* =====================================================================
 * SHIFT
 * ===================================================================== */
const WH_SHIFT_COLS = [{ t: 'Kode', w: 110 }, { t: 'Nama', w: 'fill' }, { t: 'Perusahaan', w: 220 }, { t: 'Jam', w: 160 }, { t: 'Toleransi', w: 100 }, { t: 'Status', w: 110 }, { t: '', w: 90 }];
const WH_SHIFT_ROWS = [
  ['PAGI', 'Shift Pagi', 'PT Maju Bersama', '08:00–17:00', '15 mnt', { chip: 'Aktif', color: 'success' }, { actions: ['edit', 'trash'] }],
  ['SIANG', 'Shift Siang', 'PT Maju Bersama', '14:00–23:00', '15 mnt', { chip: 'Aktif', color: 'success' }, { actions: ['edit', 'trash'] }],
  ['MALAM', 'Shift Malam', 'PT Maju Bersama', { icon: 'wh-night', t: '22:00–06:00' }, '10 mnt', { chip: 'Aktif', color: 'success' }, { actions: ['edit', 'trash'] }],
  ['OFFICE', 'Jam Kantor', 'PT Maju Bersama', '09:00–18:00', '30 mnt', { chip: 'Nonaktif', color: 'default' }, { actions: ['edit', 'trash'] }],
];
async function whShiftBase(th, o = {}) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Shift', h: o.h ?? 900 });
  const act = await pageHeader(th, main, 'Shift', o.empty ? '0 shift terdaftar' : '4 shift terdaftar');
  await button('Impor Excel', th, act, { v: 'outlined', icon: 'upload' }); await button('Tambah Shift', th, act, { icon: 'plus' });
  if (o.error) await whLoadError(th, main, 'Gagal memuat data. Coba lagi.');
  const c = whCardPage(th, main);
  await whFilterBar(th, c, [{ label: 'Perusahaan', value: 'Semua Perusahaan', select: true, w: 220 }]);
  await whGridOrEmpty(th, c, WH_SHIFT_COLS, o.empty ? [] : WH_SHIFT_ROWS, o.empty ? '0–0 dari 0' : '1–4 dari 4');
  return { f, main };
}
registerScreen({ key: 'owner/shifts', group: WH_GROUP, title: 'Shift', build: async (th) => (await whShiftBase(th)).f });
registerScreen({ key: 'owner/shifts-kosong', group: WH_GROUP, title: 'Shift (kosong)', build: async (th) => (await whShiftBase(th, { empty: true, h: 640 })).f });
registerScreen({ key: 'owner/shifts-galat', group: WH_GROUP, title: 'Shift (galat)', build: async (th) => (await whShiftBase(th, { empty: true, error: true, h: 700 })).f });
async function whShiftForm(th, b, edit, night) {
  if (!edit) await inputField('Perusahaan', 'PT Maju Bersama', th, b, { select: true, required: true });
  await inputField('Kode', edit ? 'PAGI' : (night ? 'MALAM' : ''), th, b, { required: true, helper: 'Dipakai di file Excel. Boleh huruf kapital, angka, garis bawah (_), dan strip (-).' });
  await inputField('Nama', edit ? 'Shift Pagi' : (night ? 'Shift Malam' : ''), th, b, { required: true });
  const r = box('jam', { dir: 'H', gap: 16, theme: th, parent: b, fillW: true });
  await inputField('Jam Mulai', night ? '22:00' : '08:00', th, r, { required: true, endIcon: 'clock' }); await inputField('Jam Selesai', night ? '06:00' : '17:00', th, r, { required: true, endIcon: 'clock' });
  if (night) await alertBox('info', 'Shift ini lewat tengah malam. Jadwal tanggal 10 berarti mulai tanggal 10 dan selesai tanggal 11.', th, b);
  await inputField('Toleransi terlambat (menit)', '15', th, b, { helper: 'Datang dalam batas ini masih dihitung tepat waktu' });
  await inputField('Boleh absen masuk berapa menit sebelum mulai', '60', th, b);
  const sw = box('aktif', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: b }); toggle(true, th, sw); await txt('Aktif', 'body', 'color/text/primary', th, { parent: sw });
}
registerScreen({ key: 'owner/shifts-tambah', group: WH_GROUP, title: 'Shift (dialog tambah)', build: async (th) => { const { f } = await whShiftBase(th, { h: 1100 }); await dialog(th, f, { title: 'Tambah Shift', w: 444, build: (b) => whShiftForm(th, b, false, false), actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained' }] }); return f; } });
registerScreen({ key: 'owner/shifts-tambah-malam', group: WH_GROUP, title: 'Shift (dialog tambah, lewat tengah malam)', build: async (th) => { const { f } = await whShiftBase(th, { h: 1200 }); await dialog(th, f, { title: 'Tambah Shift', w: 444, build: (b) => whShiftForm(th, b, false, true), actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained' }] }); return f; } });
registerScreen({ key: 'owner/shifts-ubah', group: WH_GROUP, title: 'Shift (dialog ubah)', build: async (th) => { const { f } = await whShiftBase(th, { h: 1100 }); await dialog(th, f, { title: 'Ubah Shift', w: 444, build: (b) => whShiftForm(th, b, true, false), actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained' }] }); return f; } });
registerScreen({ key: 'owner/shifts-hapus', group: WH_GROUP, title: 'Shift (dialog hapus)', build: async (th) => { const { f } = await whShiftBase(th); await dialog(th, f, { title: 'Hapus Shift?', w: 444, build: async (b) => { await txt('Shift Pagi akan dihapus. Kalau shift ini sudah pernah dipakai di roster, shift tidak bisa dihapus. Nonaktifkan saja supaya roster dan riwayat absensinya tetap aman.', 'body2', 'color/text/primary', th, { parent: b, fillW: true }); }, actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }] }); return f; } });
async function whShiftImportBody(th, b, st) {
  await alertBox('info', 'Shift diatur per perusahaan. Kalau satu kode shift dipakai di beberapa perusahaan, tulis satu baris untuk tiap perusahaan.', th, b);
  await button('Unduh Template', th, b, { v: 'outlined', icon: 'file' });
  await button(st === 'awal' ? 'Pilih File Excel' : 'shift-master.xlsx', th, b, { v: 'outlined', icon: 'upload' });
  if (st === 'galat') {
    await alertBox('error', 'File berisi baris yang tidak valid.', th, b, 'Impor gagal');
    const l = box('errors', { dir: 'V', stroke: 'color/border', radius: 6, theme: th, parent: b, fillW: true });
    for (const [i, e] of [['Baris 3 · Jam Mulai · "25:00"', 'Format jam harus HH:MM.'], ['Baris 7 · Kode · "pagi 2"', 'Kode hanya boleh huruf kapital, angka, garis bawah, dan strip.'], ['Baris 8 · Perusahaan · "PT Lain"', 'Perusahaan tidak ditemukan.']].entries()) {
      const r = box('err', { dir: 'V', gap: 2, pad: [10, 16, 10, 16], stroke: i ? 'color/border' : null, theme: th, parent: l, fillW: true }); if (i) { r.strokeBottomWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; }
      await txt(e[0], 'caption', 'color/text/secondary', th, { parent: r, fillW: true }); await txt(e[1], 'body2', 'color/text/primary', th, { parent: r, fillW: true });
    }
    await txt('Menampilkan 3 dari 5 masalah.', 'caption', 'color/text/secondary', th, { parent: b });
  }
  if (st === 'siap') await alertBox('warning', 'Dari 6 baris, di 1 perusahaan.\n2 shift sudah ada dan jamnya akan diubah. Roster yang sudah memakai shift ini ikut berubah jamnya.\nBaris 5: Shift MALAM lewat tengah malam.', th, b, '4 shift akan dibuat, 2 diperbarui');
}
const whShiftImport = (st) => async (th) => {
  const { f } = await whShiftBase(th, { h: 1000 });
  await dialog(th, f, { title: 'Impor Shift dari Excel', w: 600, build: (b) => whShiftImportBody(th, b, st), actions: [{ label: 'Batal' }, { label: st === 'siap' ? 'Simpan 6 Shift' : 'Simpan', v: 'contained', disabled: st !== 'siap' }] });
  return f;
};
registerScreen({ key: 'owner/shifts-impor', group: WH_GROUP, title: 'Shift (impor Excel)', build: whShiftImport('awal') });
registerScreen({ key: 'owner/shifts-impor-siap', group: WH_GROUP, title: 'Shift (impor, siap disimpan)', build: whShiftImport('siap') });
registerScreen({ key: 'owner/shifts-impor-galat', group: WH_GROUP, title: 'Shift (impor, baris bermasalah)', build: whShiftImport('galat') });

/* =====================================================================
 * HARI LIBUR
 * ===================================================================== */
const WH_HOL_COLS = [{ t: 'Tanggal', w: 160 }, { t: 'Keterangan', w: 'fill' }, { t: 'Berlaku di', w: 260 }, { t: '', w: 60 }];
const WH_HOL_ROWS = [
  ['2026-12-25 (Jum)', 'Hari Raya Natal', { chip: 'Semua Perusahaan', color: 'default', variant: 'solid' }, { actions: ['trash'] }],
  ['2026-12-24 (Kam)', 'Cuti Bersama Natal', { chip: 'Semua Perusahaan', color: 'default', variant: 'solid' }, { actions: ['trash'] }],
  ['2026-11-12 (Kam)', 'Libur Perusahaan: Hari Ulang Tahun PT Maju Bersama', 'PT Maju Bersama', { actions: ['trash'] }],
  ['2026-08-17 (Sen)', 'Hari Kemerdekaan Republik Indonesia', { chip: 'Semua Perusahaan', color: 'default', variant: 'solid' }, { actions: ['trash'] }],
];
async function whHolBase(th, o = {}) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Hari Libur', h: o.h ?? 800 });
  const act = await pageHeader(th, main, 'Hari Libur', o.empty ? '0 tanggal terdaftar' : '4 tanggal terdaftar');
  await button('Tambah Hari Libur', th, act, { icon: 'plus' });
  if (o.error) await whLoadError(th, main, 'Gagal memuat data. Coba lagi.');
  await alertBox('info', 'Libur nasional dan cuti bersama diisi manual di sini. Tanggalnya berubah tiap tahun, jadi cek lagi setiap awal tahun.', th, main);
  const c = whCardPage(th, main);
  await whGridOrEmpty(th, c, WH_HOL_COLS, o.empty ? [] : WH_HOL_ROWS, o.empty ? '0–0 dari 0' : '1–4 dari 4');
  return { f, main };
}
registerScreen({ key: 'owner/holidays', group: WH_GROUP, title: 'Hari Libur', build: async (th) => (await whHolBase(th)).f });
registerScreen({ key: 'owner/holidays-kosong', group: WH_GROUP, title: 'Hari Libur (kosong)', build: async (th) => (await whHolBase(th, { empty: true, h: 600 })).f });
registerScreen({ key: 'owner/holidays-galat', group: WH_GROUP, title: 'Hari Libur (galat)', build: async (th) => (await whHolBase(th, { empty: true, error: true, h: 650 })).f });
registerScreen({ key: 'owner/holidays-tambah', group: WH_GROUP, title: 'Hari Libur (dialog tambah)', build: async (th) => {
  const { f } = await whHolBase(th);
  await dialog(th, f, { title: 'Tambah Hari Libur', w: 444, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained' }], build: async (b) => {
    await inputField('Tanggal', '2026-12-31', th, b, { required: true, endIcon: 'calendar' });
    await inputField('Keterangan', '', th, b, { required: true });
    const s = box('berlaku', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true }); await txt('Berlaku di', 'caption', 'color/text/secondary', th, { parent: s });
    await inputField('Berlaku di', 'Semua Perusahaan', th, s, { select: true });
  } });
  return f;
} });
registerScreen({ key: 'owner/holidays-tambah-galat', group: WH_GROUP, title: 'Hari Libur (dialog tambah, isian kosong)', build: async (th) => {
  const { f } = await whHolBase(th);
  await dialog(th, f, { title: 'Tambah Hari Libur', w: 444, actions: [{ label: 'Batal' }, { label: 'Menyimpan...', v: 'contained', disabled: true }], build: async (b) => {
    await inputField('Tanggal', '2026-12-31', th, b, { required: true, endIcon: 'calendar' });
    await inputField('Keterangan', 'Cuti Bersama Tahun Baru', th, b, { required: true });
    const s = box('berlaku', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true }); await txt('Berlaku di', 'caption', 'color/text/secondary', th, { parent: s });
    await inputField('Berlaku di', 'PT Maju Bersama', th, s, { select: true });
  } });
  return f;
} });
registerScreen({ key: 'owner/holidays-hapus', group: WH_GROUP, title: 'Hari Libur (dialog hapus)', build: async (th) => {
  const { f } = await whHolBase(th);
  await dialog(th, f, { title: 'Hapus Hari Libur?', w: 444, actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }], build: async (b) => { await txt('Hari Raya Natal (2026-12-25) akan dihapus.', 'body2', 'color/text/primary', th, { parent: b, fillW: true }); } });
  return f;
} });
