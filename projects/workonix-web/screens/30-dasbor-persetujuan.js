/* =====================================================================
 * Dasbor dan Persetujuan — dasbor owner, kotak masuk persetujuan, laporan pengajuan,
 * koreksi absensi saya, profil karyawan. Prefiks: wd / WD_
 * ===================================================================== */
const WD_GROUP = 'Dasbor dan Persetujuan';

registerIcons({
  'wd-cancel': '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  'wd-radio': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  'wd-circle': '<circle cx="12" cy="12" r="9"/>',
  'wd-skip': '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
});

/* ---------- Pembantu ---------- */
function wdRect(th, parent, w, h, tok, r) {
  const x = figma.createRectangle(); x.resize(w, h); x.cornerRadius = r ?? 0; x.fills = [pv(th, tok)]; parent.appendChild(x); return x;
}
function wdDivider(th, parent) {
  const x = figma.createRectangle(); x.name = 'divider'; x.resize(10, 1); x.fills = [pv(th, 'color/border')]; parent.appendChild(x); x.layoutSizingHorizontal = 'FILL'; return x;
}
const wdSurf = (tok) => (tok.startsWith('color/text') ? 'color/background' : tok + '-surface');
function wdRow(th, parent, gap) { return box('row', { dir: 'H', gap: gap ?? 24, theme: th, parent, fillW: true }); }
/** Kartu tetap lebar w (kolom V). */
function wdFixedCard(th, parent, w, o = {}) {
  const c = card(th, parent, { ...o, fillW: false });
  c.counterAxisSizingMode = 'FIXED'; c.resize(w, 100); c.primaryAxisSizingMode = 'AUTO'; return c;
}
async function wdSection(th, parent, title, subtitle, rightFn) {
  const r = box('SectionHeader', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent, fillW: true });
  wdRect(th, r, 4, 24, 'color/primary', 2);
  await txt(title, 'h6', 'color/text/primary', th, { parent: r });
  if (subtitle) await txt(subtitle, 'body', 'color/text/secondary', th, { parent: r });
  spacer(r);
  if (rightFn) { const a = box('right', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: r }); await rightFn(a); }
  return r;
}
/** Kartu bernada (ToneCard): ikon + judul huruf kapital kecil, anak mengisi sisanya. */
async function wdToneCard(th, parent, title, ic, tok) {
  const c = card(th, parent, { gap: 14, fillW: false }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
  const h = box('header', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent: c, fillW: true });
  const b = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: wdSurf(tok), radius: 8, theme: th, parent: h, fixed: [32, 32] }); icon(ic, 18, tok, th, b);
  await txt(title, 'th', 'color/text/secondary', th, { parent: h, upper: true });
  return c;
}
async function wdLegend(th, parent, tok, label, value) {
  const r = box('legend', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent }); r.layoutGrow = 1; r.layoutSizingHorizontal = 'FILL';
  wdRect(th, r, 10, 10, tok, 2);
  const t = await txt(label, 'body2', 'color/text/secondary', th, { parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT';
  await txt(String(value), 'body2-strong', 'color/text/primary', th, { parent: r });
  return r;
}
async function wdTile(th, parent, value, label, tok) {
  const t = box('StatTile', { dir: 'V', gap: 2, pad: [10, 12, 10, 12], fill: wdSurf(tok), radius: 8, theme: th, parent }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
  await txt(String(value), 'h5', tok, th, { parent: t }); await txt(label, 'body2', 'color/text/secondary', th, { parent: t, fillW: true });
  return t;
}
async function wdTileGrid(th, parent, list) {
  const g = box('tiles', { dir: 'V', gap: 12, theme: th, parent, fillW: true });
  for (let i = 0; i < list.length; i += 2) {
    const r = box('row', { dir: 'H', gap: 12, theme: th, parent: g, fillW: true });
    for (const it of list.slice(i, i + 2)) await wdTile(th, r, it[0], it[1], it[2]);
    if (list.slice(i, i + 2).length < 2) { const sp = box('sp', { dir: 'H', theme: th, parent: r }); sp.layoutGrow = 1; sp.layoutSizingHorizontal = 'FILL'; }
  }
  return g;
}
function wdStackBar(th, parent, w, segs) {
  const b = box('bar', { dir: 'H', radius: 5, clip: true, fill: 'color/border', theme: th, parent });
  b.counterAxisSizingMode = 'FIXED'; b.resize(w, 10); b.layoutSizingHorizontal = 'FILL';
  for (const [tok, sw] of segs) if (sw > 0) wdRect(th, b, sw, 10, tok, 0);
  return b;
}

/* ---------- Dasbor owner ---------- */
const WD_DAYS = [[17, 2, 0, 1, 0], [18, 1, 1, 1, 0], [18, 2, 0, 0, 0], [16, 3, 1, 0, 0], [17, 1, 0, 2, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [15, 3, 1, 1, 0], [17, 2, 0, 1, 0], [16, 2, 1, 0, 1], [18, 1, 0, 1, 0], [17, 2, 1, 0, 0], [18, 2, 0, 0, 0], [16, 3, 0, 1, 0]];
const WD_STACK_TOK = ['color/danger', 'color/text/disabled', 'color/info', 'color/warning', 'color/success']; // atas ke bawah: alpa, belum pulang, cuti, telat, hadir

async function wdActionItem(th, parent, sev, title, detail) {
  const tok = sev === 'error' ? 'color/danger' : sev === 'warning' ? 'color/warning' : 'color/info';
  const r = box('ActionItem', { dir: 'H', gap: 0, stroke: 'color/border', radius: 8, clip: true, theme: th, parent, fillW: true });
  const bar = wdRect(th, r, 3, 10, tok, 0); bar.layoutSizingVertical = 'FILL';
  const c = box('content', { dir: 'H', gap: 10, ay: 'MIN', pad: [10, 14, 10, 14], theme: th, parent: r }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
  icon(sev === 'error' ? 'alert' : sev === 'warning' ? 'warn' : 'info', 20, tok, th, c);
  const t = box('text', { dir: 'V', gap: 2, theme: th, parent: c }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
  await txt(title, 'body2-strong', 'color/text/primary', th, { parent: t, fillW: true });
  if (detail) await txt(detail, 'caption', 'color/text/secondary', th, { parent: t, fillW: true });
  icon('chevron', 18, 'color/text/disabled', th, c);
  return r;
}

async function wdDashboard(th, mode) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Dasbor', h: mode === 'data' || mode === 'kosong' ? 1760 : 700 });
  const empty = mode === 'kosong';
  const act = await pageHeader(th, main, 'Dasbor', mode === 'data' ? 'Halo, Dewi Lestari. 56 karyawan aktif di 2 perusahaan.' : 'Halo, Dewi Lestari.');
  await inputField('Perusahaan', 'Semua perusahaan', th, act, { w: 280, select: true });

  if (mode === 'galat') { await alertBox('error', 'Gagal memuat data. Coba lagi.', th, main); return f; }
  if (mode === 'memuat') {
    const w = box('loading', { dir: 'V', ax: 'CENTER', ay: 'CENTER', pad: 64, theme: th, parent: main, fillW: true });
    const c = box('CircularProgress', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 999, stroke: 'color/primary', sw: 4, theme: th, parent: w, fixed: [40, 40] }); icon('refresh', 18, 'color/primary', th, c);
    return f;
  }

  // --- Ringkasan hari ini
  const s1 = box('Ringkasan Hari Ini', { dir: 'V', gap: 16, theme: th, parent: main, fillW: true });
  await wdSection(th, s1, 'Ringkasan Hari Ini', 'Selasa, 24 November 2026', async (a) => {
    await txt('Diperbarui 09.41', 'body2', 'color/text/secondary', th, { parent: a }); await iconButton('refresh', th, a, { size: 32, iconSize: 18, color: 'color/primary' });
  });
  const r1 = wdRow(th, s1);
  const clocked = empty ? 0 : 38, total = empty ? 0 : 46;
  const a1 = await wdToneCard(th, r1, 'Kehadiran', 'users', 'color/primary');
  const big = box('big', { dir: 'H', gap: 8, ay: 'BASELINE', theme: th, parent: a1, fillW: true });
  await txt(String(clocked), 'h4', 'color/text/primary', th, { parent: big }); await txt(`/ ${total} jadwal hari ini sudah hadir`, 'body', 'color/text/secondary', th, { parent: big });
  if (!empty) { await txt('10 dari 56 karyawan aktif belum punya jadwal hari ini. Atur roster', 'caption', 'color/warning', th, { parent: a1, fillW: true }); }
  wdStackBar(th, a1, 314, empty ? [] : [['color/success', 215], ['color/warning', 40], ['color/info', 59]]);
  const lg1 = box('legend grid', { dir: 'V', gap: 10, theme: th, parent: a1, fillW: true });
  const lr1 = box('r', { dir: 'H', gap: 20, theme: th, parent: lg1, fillW: true }); await wdLegend(th, lr1, 'color/success', 'Tepat waktu', empty ? 0 : 31); await wdLegend(th, lr1, 'color/warning', 'Telat', empty ? 0 : 7);
  const lr2 = box('r', { dir: 'H', gap: 20, theme: th, parent: lg1, fillW: true }); await wdLegend(th, lr2, 'color/info', 'Izin / Cuti', empty ? 0 : 5); await wdLegend(th, lr2, 'color/border', 'Belum absen', empty ? 0 : 3);
  if (!empty) await txt('Belum absen, shift sudah mulai: Hendra Gunawan, Putri Handayani, Doni Setiawan', 'caption', 'color/text/secondary', th, { parent: a1, fillW: true });

  const a2 = await wdToneCard(th, r1, 'Persetujuan bulan ini', 'check', 'color/success');
  const a2r = box('row', { dir: 'H', gap: 20, ay: 'CENTER', theme: th, parent: a2, fillW: true });
  const dn = box('Donut', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 999, stroke: empty ? 'color/border' : 'color/success', sw: 10, theme: th, parent: a2r, fixed: [96, 96] });
  await txt(empty ? '0%' : '75%', 'h6', 'color/text/primary', th, { parent: dn });
  const a2t = box('legend', { dir: 'V', gap: 10, theme: th, parent: a2r }); a2t.layoutGrow = 1; a2t.layoutSizingHorizontal = 'FILL';
  await txt(empty ? '0 pengajuan masuk' : '24 pengajuan masuk', 'body', 'color/text/secondary', th, { parent: a2t, fillW: true });
  await wdLegend(th, a2t, 'color/success', 'Sudah diputuskan', empty ? 0 : 18); await wdLegend(th, a2t, 'color/border', 'Menunggu', empty ? 0 : 6);
  if (!empty) await button('Putuskan sekarang', th, a2t, { v: 'text', size: 'small' });

  const a3 = await wdToneCard(th, r1, 'Surat peringatan aktif', 'gavel', 'color/danger');
  await wdTileGrid(th, a3, [[empty ? 0 : 2, 'Teguran Lisan', 'color/text/secondary'], [empty ? 0 : 3, 'SP 1', 'color/warning'], [empty ? 0 : 1, 'SP 2', 'color/warning'], [empty ? 0 : 1, 'SP 3', 'color/danger']]);
  const a3f = box('foot', { dir: 'H', ay: 'CENTER', theme: th, parent: a3, fillW: true });
  const a3t = await txt(empty ? 'Tidak ada evaluasi SP 3 yang tertunda' : '1 evaluasi SP 3 perlu diputuskan', 'caption', empty ? 'color/text/secondary' : 'color/danger', th, { parent: a3f }); a3t.layoutGrow = 1; a3t.layoutSizingHorizontal = 'FILL'; a3t.textAutoResize = 'HEIGHT';
  await button('Lihat', th, a3f, { v: 'text', size: 'small' });

  // --- Pengajuan
  const s2 = box('Pengajuan', { dir: 'V', gap: 16, theme: th, parent: main, fillW: true });
  await wdSection(th, s2, 'Pengajuan Cuti, Izin & Lembur', 'November 2026', async (a) => {
    await button('Rekap Absensi', th, a, { v: 'outlined', icon: 'file' });
    await inputField('Bulan', 'November 2026', th, a, { w: 180, endIcon: 'calendar' });
  });
  const r2 = wdRow(th, s2);
  const reqs = [
    ['Total Cuti', 'umbrella', 'color/primary', empty ? 0 : 12, empty ? '' : '34 hari cuti disetujui', [[empty ? 0 : 8, 'Disetujui', 'color/success'], [empty ? 0 : 3, 'Menunggu aksi', 'color/warning'], [empty ? 0 : 1, 'Ditolak', 'color/danger']]],
    ['Total Izin', 'person', 'color/info', empty ? 0 : 9, 'Lupa absen, WFH, dan dinas luar', [[empty ? 0 : 6, 'Disetujui', 'color/success'], [empty ? 0 : 2, 'Menunggu aksi', 'color/warning'], [empty ? 0 : 1, 'Ditolak', 'color/danger']]],
    ['Total Lembur', 'timer', 'color/info', empty ? 0 : 15, empty ? '' : '48 jam lembur disetujui', [[empty ? 0 : 11, 'Disetujui', 'color/success'], [empty ? 0 : 3, 'Menunggu aksi', 'color/warning'], [empty ? 0 : 1, 'Ditolak', 'color/danger'], [empty ? 0 : 9, 'Dibayar', 'color/primary']]],
  ];
  for (const q of reqs) {
    const c = await wdToneCard(th, r2, q[0], q[1], q[2]);
    await txt(String(q[3]), 'h4', 'color/text/primary', th, { parent: c });
    await txt(q[4] || ' ', 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
    await wdTileGrid(th, c, q[5]);
    const br = box('buttons', { dir: 'H', gap: 12, theme: th, parent: c, fillW: true });
    await button('Lihat Detail', th, br, { v: 'text' }); await button('Export Excel', th, br, { v: 'outlined', color: 'default' });
  }

  // --- Perlu tindakan + tren
  const r3 = box('row', { dir: 'H', gap: 24, ay: 'MIN', theme: th, parent: main, fillW: true });
  const ac = wdFixedCard(th, r3, 448, { gap: 12 });
  await txt('Perlu tindakan', 'subtitle', 'color/text/primary', th, { parent: ac });
  if (empty) {
    const e = box('empty', { dir: 'V', gap: 8, ax: 'CENTER', ay: 'CENTER', pad: [28, 0, 28, 0], theme: th, parent: ac, fillW: true });
    icon('check', 40, 'color/success', th, e); await txt('Tidak ada yang perlu diurus saat ini.', 'body2', 'color/text/secondary', th, { parent: e });
  } else {
    await wdActionItem(th, ac, 'error', '1 evaluasi SP 3 menunggu keputusan', 'Agus Wijaya');
    await wdActionItem(th, ac, 'warning', '6 pengajuan menunggu persetujuan', 'Yang terlama sudah 5 hari');
    await wdActionItem(th, ac, 'warning', '10 karyawan belum punya jadwal hari ini', 'Atur roster');
    await wdActionItem(th, ac, 'info', 'Kontrak 2 karyawan berakhir dalam 30 hari', 'Rina Kartika, Eko Prasetyo');
  }
  const tc = card(th, r3, { gap: 16, fillW: false }); tc.layoutGrow = 1; tc.layoutSizingHorizontal = 'FILL';
  const th1 = box('head', { dir: 'H', ay: 'MIN', theme: th, parent: tc, fillW: true });
  const th2 = box('titles', { dir: 'V', gap: 2, theme: th, parent: th1 }); th2.layoutGrow = 1; th2.layoutSizingHorizontal = 'FILL';
  await txt('Kehadiran 14 hari terakhir', 'subtitle', 'color/text/primary', th, { parent: th2 });
  await txt('Persentase dari jadwal shift tiap hari. Cuti tidak dihitung tidak hadir.', 'caption', 'color/text/secondary', th, { parent: th2, fillW: true });
  if (!empty) {
    const rt = box('rate', { dir: 'V', ax: 'MAX', theme: th, parent: th1 });
    await txt('91%', 'h5', 'color/success', th, { parent: rt }); await txt('rata-rata hadir', 'caption', 'color/text/secondary', th, { parent: rt });
    const cols = box('chart', { dir: 'H', gap: 8, ay: 'MIN', theme: th, parent: tc, fillW: true });
    for (const [i, d] of WD_DAYS.entries()) {
      const col = box('day', { dir: 'V', gap: 6, ay: 'CENTER', theme: th, parent: cols });
      const bar = box('bar', { dir: 'V', radius: 3, clip: true, fill: 'color/background', theme: th, parent: col, fixed: [24, 170] });
      const sum = d.reduce((a, b) => a + b, 0);
      if (sum > 0) { const order = [4, 2, 3, 1, 0]; for (const k of order) { const hh = Math.round((d[k] / sum) * 170); if (hh > 0) wdRect(th, bar, 24, hh, WD_STACK_TOK[order.indexOf(k)], 0); } }
      await txt(`${11 + i}/11`, 'caption', 'color/text/secondary', th, { parent: col, size: 10 });
    }
    const lg = box('legend', { dir: 'H', gap: 16, theme: th, parent: tc, fillW: true });
    for (const [tok, l] of [['color/success', 'Hadir'], ['color/warning', 'Terlambat'], ['color/text/disabled', 'Belum absen pulang'], ['color/info', 'Cuti'], ['color/danger', 'Alpa']]) {
      const it = box('l', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: lg }); wdRect(th, it, 10, 10, tok, 2); await txt(l, 'caption', 'color/text/primary', th, { parent: it });
    }
  } else {
    await alertBox('info', 'Belum ada shift terjadwal di dua minggu terakhir. Grafik ini terisi setelah roster disusun di menu Penjadwalan.', th, tc);
  }
  return f;
}

registerScreen({ key: 'owner/dashboard', group: WD_GROUP, title: 'Dasbor', build: (th) => wdDashboard(th, 'data') });
registerScreen({ key: 'owner/dashboard-kosong', group: WD_GROUP, title: 'Dasbor (kosong)', build: (th) => wdDashboard(th, 'kosong') });
registerScreen({ key: 'owner/dashboard-galat', group: WD_GROUP, title: 'Dasbor (galat)', build: (th) => wdDashboard(th, 'galat') });
registerScreen({ key: 'owner/dashboard-memuat', group: WD_GROUP, title: 'Dasbor (memuat)', build: (th) => wdDashboard(th, 'memuat') });

/* ---------- Kotak masuk persetujuan (Approvalnbox) ---------- */
const WD_INBOX = [
  { type: 'Koreksi absensi', pos: 'Tahap 1 dari 2', last: false, name: 'Siti Rahmawati', summary: 'Lupa absen pulang, 2026-11-20 · Shift Pagi, seharusnya pulang 17:00', meta: 'Diajukan 21 November 2026 · giliran Budi Santoso · setelah ini lanjut ke penyetuju berikutnya' },
  { type: 'Cuti', pos: 'Tahap 2 dari 2', last: true, name: 'Agus Wijaya', summary: 'Cuti tahunan, 2 hari (3 Desember - 4 Desember 2026)', meta: 'Diajukan 22 November 2026 · giliran HR · ini persetujuan terakhir', prev: 'Disetujui Budi Santoso: "Aman, tim sudah ada pengganti"' },
  { type: 'Lembur', pos: 'Tahap 1 dari 1', last: true, name: 'Rina Kartika', summary: 'Lembur 3 jam pada 2026-11-23, penutupan laporan bulanan', meta: 'Diajukan 23 November 2026 · giliran Budi Santoso · ini persetujuan terakhir' },
];
async function wdInbox(th, main, items, busy) {
  await txt('Menunggu Persetujuan', 'h5', 'color/text/primary', th, { parent: main });
  await txt(items.length === 0 ? 'Tidak ada pengajuan yang perlu diputuskan' : `${items.length} pengajuan perlu diputuskan`, 'body2', 'color/text/secondary', th, { parent: main });
  if (items.length === 0) {
    const c = card(th, main, { pad: 48 });
    const e = box('empty', { dir: 'V', gap: 8, ax: 'CENTER', ay: 'CENTER', theme: th, parent: c, fillW: true });
    icon('inbox', 44, 'color/text/disabled', th, e); await txt('Pengajuan dari anggota tim akan muncul di sini.', 'body2', 'color/text/secondary', th, { parent: e });
    return;
  }
  const list = box('list', { dir: 'V', gap: 16, theme: th, parent: main, fillW: true });
  for (const [i, it] of items.entries()) {
    const c = card(th, list, { dir: 'H', gap: 16, ay: 'MIN', pad: 20 });
    const l = box('info', { dir: 'V', gap: 6, theme: th, parent: c }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL';
    const ch = box('chips', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: l });
    await chip(it.type, th, ch, {}); await chip(it.pos, th, ch, { variant: 'outlined', color: it.last ? 'success' : 'default' });
    await txt(it.name, 'body2-strong', 'color/text/primary', th, { parent: l, size: 15 });
    await txt(it.summary, 'body2', 'color/text/secondary', th, { parent: l, fillW: true });
    await txt(it.meta, 'caption', 'color/text/secondary', th, { parent: l, fillW: true });
    if (it.prev) await txt(it.prev, 'caption', 'color/text/secondary', th, { parent: l, fillW: true });
    const bt = box('buttons', { dir: 'H', gap: 8, theme: th, parent: c });
    await button('Tolak', th, bt, { v: 'outlined', color: 'error', size: 'small', icon: 'x', disabled: busy === i });
    await button('Setujui', th, bt, { size: 'small', icon: 'tick', disabled: busy === i });
  }
}
async function wdInboxPage(th, role, active, mode) {
  const { f, main } = await page('x', th, { role, active, h: mode === 'kosong' || mode === 'galat' ? 700 : 900 });
  main.itemSpacing = 4;
  if (mode === 'galat') { await alertBox('error', 'Gagal memuat daftar persetujuan. Coba lagi.', th, main); return f; }
  const body = box('body', { dir: 'V', gap: 4, theme: th, parent: main, fillW: true });
  await wdInbox(th, body, mode === 'kosong' ? [] : WD_INBOX, mode === 'sibuk' ? 0 : -1);
  if (mode === 'tolak') {
    await dialog(th, f, { title: 'Tolak Pengajuan', w: 444, build: async (b) => {
      await txt('Lupa absen pulang, 2026-11-20 · Shift Pagi, seharusnya pulang 17:00', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
      wdDivider(th, b);
      await inputField('Alasan penolakan', '', th, b, { multiline: 3, helper: 'Wajib diisi. Alasan ini dikirim ke karyawan lewat email.', focus: true });
    }, actions: [{ label: 'Batal' }, { label: 'Tolak Pengajuan', v: 'contained', color: 'error', disabled: true }] });
  }
  return f;
}
registerScreen({ key: 'owner/approvals', group: WD_GROUP, title: 'Persetujuan (owner)', build: (th) => wdInboxPage(th, 'owner', 'Persetujuan', 'data') });
registerScreen({ key: 'owner/approvals-kosong', group: WD_GROUP, title: 'Persetujuan (owner, kosong)', build: (th) => wdInboxPage(th, 'owner', 'Persetujuan', 'kosong') });
registerScreen({ key: 'owner/approvals-galat', group: WD_GROUP, title: 'Persetujuan (owner, galat)', build: (th) => wdInboxPage(th, 'owner', 'Persetujuan', 'galat') });
registerScreen({ key: 'owner/approvals-tolak', group: WD_GROUP, title: 'Tolak Pengajuan (dialog)', build: (th) => wdInboxPage(th, 'owner', 'Persetujuan', 'tolak') });
registerScreen({ key: 'employee/approvals', group: WD_GROUP, title: 'Persetujuan (karyawan)', build: (th) => wdInboxPage(th, 'employee', 'Persetujuan ', 'data') });
registerScreen({ key: 'employee/approvals-kosong', group: WD_GROUP, title: 'Persetujuan (karyawan, kosong)', build: (th) => wdInboxPage(th, 'employee', 'Persetujuan ', 'kosong') });
registerScreen({ key: 'employee/approvals-tolak', group: WD_GROUP, title: 'Tolak Pengajuan (karyawan, dialog)', build: (th) => wdInboxPage(th, 'employee', 'Persetujuan ', 'tolak') });

/* ---------- Laporan Pengajuan ---------- */
const WD_REPORT_ROWS = [
  [{ avatar: 'SR', name: 'Siti Rahmawati', sub: 'EMP-000012' }, { chip: 'Koreksi Absensi', color: 'info' }, 'Lupa absen pulang, 20 Nov 2026', { chip: 'Menunggu', color: 'warning' }, { t: 'Budi Santoso', sub: 'menunggu 4 hari' }, '-', '21 Nov 2026'],
  [{ avatar: 'AW', name: 'Agus Wijaya', sub: 'EMP-000008' }, { chip: 'Cuti', color: 'primary' }, 'Cuti tahunan, 3-4 Des 2026', { chip: 'Disetujui', color: 'success' }, { t: 'HR / Pemilik', sub: 'setelah 1 hari' }, 'Aman', '22 Nov 2026'],
  [{ avatar: 'RK', name: 'Rina Kartika', sub: 'EMP-000015' }, { chip: 'Lembur', color: 'primary' }, 'Lembur 3 jam, 23 Nov 2026', { chip: 'Menunggu', color: 'warning' }, { t: 'Budi Santoso', sub: 'menunggu 1 hari' }, '-', '23 Nov 2026'],
  [{ avatar: 'EP', name: 'Eko Prasetyo', sub: 'EMP-000021' }, { chip: 'Tukar Shift', color: 'default' }, 'Tukar shift dengan Doni, 26 Nov', { chip: 'Ditolak', color: 'error' }, { t: 'Atasan langsung', sub: 'setelah 2 hari' }, 'Jadwal penuh', '18 Nov 2026'],
  [{ avatar: 'MA', name: 'Maya Anggraini', sub: 'EMP-000019' }, { chip: 'Cuti', color: 'primary' }, 'Cuti sakit, 12 Nov 2026', { chip: 'Dibatalkan', color: 'default' }, { t: '-', sub: '' }, '-', '10 Nov 2026'],
];
async function wdReport(th, mode) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Laporan Pengajuan', h: mode === 'data' || mode === 'terpotong' || mode === 'detail' ? 1300 : 900 });
  main.itemSpacing = 20;
  const hd = box('head', { dir: 'V', gap: 4, theme: th, parent: main, fillW: true });
  await txt('Laporan Pengajuan', 'h5', 'color/text/primary', th, { parent: hd }); await txt('Semua pengajuan karyawan. Klik baris untuk melihat detailnya.', 'body2', 'color/text/secondary', th, { parent: hd });
  if (mode !== 'galat') {
    const sr = box('summary', { dir: 'H', gap: 16, theme: th, parent: main, fillW: true });
    const sums = mode === 'kosong' ? [['Total', '0', 'color/text/primary'], ['Menunggu', '0', 'color/text/primary'], ['Disetujui', '0', 'color/success'], ['Ditolak', '0', 'color/danger']]
      : [['Total', '48', 'color/text/primary'], ['Menunggu', '7', 'color/warning'], ['Disetujui', '33', 'color/success'], ['Ditolak', '6', 'color/danger'], ['Rata-rata waktu diputuskan', '1,4 hari', 'color/text/primary']];
    for (const [l, v, tok] of sums) { const c = card(th, sr, { gap: 2, pad: 16, fillW: false }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL'; await txt(l, 'caption', 'color/text/secondary', th, { parent: c }); await txt(v, 'h5', tok, th, { parent: c }); }
    if (mode !== 'kosong') await alertBox('warning', 'Klik untuk menampilkan yang menunggu saja. Kolom Menunggu di menunjukkan siapa yang perlu diingatkan.', th, main, '3 pengajuan belum diputuskan lebih dari 3 hari');
  }
  const fc = card(th, main, { pad: 16 });
  const fr = box('filters', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: fc, fillW: true });
  const se = await inputField('Cari nama atau nomor karyawan', '', th, fr, { icon: 'search' }); se.layoutGrow = 1;
  await inputField('Status', 'Semua status', th, fr, { w: 150, select: true });
  await inputField('Jenis', 'Semua jenis', th, fr, { w: 170, select: true });
  await inputField('Perusahaan', 'Semua perusahaan', th, fr, { w: 190, select: true });
  await inputField('Dari', '01/11/2026', th, fr, { w: 150, endIcon: 'calendar' });
  await inputField('Sampai', '24/11/2026', th, fr, { w: 150, endIcon: 'calendar' });
  if (mode === 'galat') { await alertBox('error', 'Gagal memuat laporan pengajuan. Coba lagi.', th, main); return f; }
  if (mode === 'terpotong') await alertBox('info', 'Hanya 500 baris pertama yang ditampilkan. Persempit tanggal atau filter untuk melihat sisanya.', th, main);
  if (mode === 'kosong') {
    const c = card(th, main, { pad: 0 }); await emptyState('file', 'Belum ada pengajuan', 'Belum ada pengajuan untuk filter ini. Coba perlebar rentang tanggalnya.', th, c);
  } else {
    await table(th, main, { rowH: 64, cols: [{ t: 'Karyawan', w: 200 }, { t: 'Jenis', w: 140 }, { t: 'Ringkasan', w: 'fill' }, { t: 'Status', w: 110 }, { t: 'Menunggu di / Diputuskan oleh', w: 190 }, { t: 'Catatan', w: 100 }, { t: 'Diajukan', w: 100 }], rows: WD_REPORT_ROWS, foot: '1-5 dari 48' });
  }
  if (mode === 'detail') await wdReportDrawer(th, f);
  return f;
}
async function wdStep(th, parent, state, name, meta) {
  const m = { approved: ['check', 'color/success'], rejected: ['wd-cancel', 'color/danger'], skipped: ['wd-skip', 'color/text/disabled'], current: ['wd-radio', 'color/warning'], wait: ['wd-circle', 'color/text/disabled'] }[state];
  const r = box('StepRow', { dir: 'H', gap: 12, ay: 'MIN', theme: th, parent, fillW: true });
  icon(m[0], 18, m[1], th, r);
  const t = box('text', { dir: 'V', gap: 2, theme: th, parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
  await txt(name, 'body2-strong', 'color/text/primary', th, { parent: t, fillW: true }); await txt(meta, 'caption', 'color/text/secondary', th, { parent: t, fillW: true });
}
async function wdReportDrawer(th, frame) {
  const scrim = figma.createRectangle(); scrim.name = 'scrim'; scrim.resize(frame.width, frame.height); scrim.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.5 }];
  frame.appendChild(scrim); scrim.layoutPositioning = 'ABSOLUTE'; scrim.x = 0; scrim.y = 0;
  const d = box('Drawer', { dir: 'V', fill: 'color/surface', theme: th, parent: frame, fixed: [460, frame.height], clip: true });
  d.layoutPositioning = 'ABSOLUTE'; d.x = frame.width - 460; d.y = 0;
  const hd = box('title', { dir: 'H', ay: 'CENTER', pad: [16, 24, 16, 24], theme: th, parent: d, fillW: true });
  const ht = await txt('Detail Pengajuan', 'h6', 'color/text/primary', th, { parent: hd }); ht.layoutGrow = 1; ht.layoutSizingHorizontal = 'FILL'; ht.textAutoResize = 'HEIGHT';
  await iconButton('x', th, hd, { size: 30, iconSize: 18 });
  wdDivider(th, d);
  const body = box('body', { dir: 'V', gap: 24, pad: [20, 24, 20, 24], theme: th, parent: d, fillW: true });
  const top = box('top', { dir: 'V', gap: 6, theme: th, parent: body, fillW: true });
  const ch = box('chips', { dir: 'H', gap: 8, theme: th, parent: top }); await chip('Menunggu', th, ch, { color: 'warning', variant: 'tint' }); await chip('Koreksi Absensi', th, ch, {});
  await txt('Koreksi absen pulang, 20 Nov 2026', 'subtitle', 'color/text/primary', th, { parent: top, fillW: true });
  await txt('Siti Rahmawati · EMP-000012', 'body2', 'color/text/secondary', th, { parent: top, fillW: true });
  await txt('Operasional · PT Maju Bersama', 'caption', 'color/text/secondary', th, { parent: top, fillW: true });
  const ph = box('photo', { dir: 'V', gap: 6, theme: th, parent: body, fillW: true });
  await txt('SELFIE', 'caption', 'color/text/secondary', th, { parent: ph });
  const pb = box('Foto', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/background', radius: 8, theme: th, parent: ph, fillW: true }); pb.counterAxisSizingMode = 'FIXED'; pb.resize(100, 150); pb.layoutSizingHorizontal = 'FILL'; icon('camera', 36, 'color/text/disabled', th, pb);
  const rc = box('rincian', { dir: 'V', gap: 8, theme: th, parent: body, fillW: true });
  await txt('RINCIAN', 'caption', 'color/text/secondary', th, { parent: rc });
  const cd = box('Card', { dir: 'V', stroke: 'color/border', radius: 10, theme: th, parent: rc, fillW: true });
  const fields = [['Jenis', 'Lupa absen pulang'], ['Tanggal kerja', '20 Nov 2026'], ['Shift', 'Shift Pagi (08:00-17:00)'], ['Jam diusulkan', '17:00']];
  for (const [i, fd] of fields.entries()) {
    if (i > 0) wdDivider(th, cd);
    const rr = box('field', { dir: 'H', gap: 16, ay: 'MIN', pad: [10, 16, 10, 16], theme: th, parent: cd, fillW: true });
    const l = await txt(fd[0], 'caption', 'color/text/secondary', th, { parent: rr }); l.resize(130, l.height); l.textAutoResize = 'HEIGHT';
    await txt(fd[1], 'body2-strong', 'color/text/primary', th, { parent: rr, fillW: true });
  }
  const al = box('alasan', { dir: 'V', gap: 8, theme: th, parent: body, fillW: true });
  await txt('ALASAN PENGAJU', 'caption', 'color/text/secondary', th, { parent: al });
  const ac = box('Card', { dir: 'V', pad: [12, 16, 12, 16], stroke: 'color/border', radius: 10, theme: th, parent: al, fillW: true });
  await txt('HP mati sebelum sempat absen pulang', 'body2', 'color/text/primary', th, { parent: ac, fillW: true });
  const rt = box('rantai', { dir: 'V', gap: 8, theme: th, parent: body, fillW: true });
  await txt('RANTAI PERSETUJUAN', 'caption', 'color/text/secondary', th, { parent: rt });
  const sc = box('Card', { dir: 'V', gap: 14, pad: [12, 16, 12, 16], stroke: 'color/border', radius: 10, theme: th, parent: rt, fillW: true });
  await wdStep(th, sc, 'approved', 'Budi Santoso', 'Atasan langsung · 21 Nov 2026, 09.12');
  await wdStep(th, sc, 'current', 'HR / Pemilik', 'HR / Pemilik · menunggu');
  await txt('Diajukan 21 Nov 2026, 08.45', 'caption', 'color/text/secondary', th, { parent: body, fillW: true });
}
registerScreen({ key: 'owner/approval-report', group: WD_GROUP, title: 'Laporan Pengajuan', build: (th) => wdReport(th, 'data') });
registerScreen({ key: 'owner/approval-report-kosong', group: WD_GROUP, title: 'Laporan Pengajuan (kosong)', build: (th) => wdReport(th, 'kosong') });
registerScreen({ key: 'owner/approval-report-galat', group: WD_GROUP, title: 'Laporan Pengajuan (galat)', build: (th) => wdReport(th, 'galat') });
registerScreen({ key: 'owner/approval-report-terpotong', group: WD_GROUP, title: 'Laporan Pengajuan (terpotong 500 baris)', build: (th) => wdReport(th, 'terpotong') });
registerScreen({ key: 'owner/approval-report-detail', group: WD_GROUP, title: 'Detail Pengajuan (drawer)', build: (th) => wdReport(th, 'detail') });

/* ---------- Koreksi absensi saya (MyAttendanceRequests) ---------- */
const WD_MY_REQ = [
  ['Lupa absen pulang', 'Menunggu', 'warning', '2026-11-20 · Shift Pagi', 'HP mati sebelum sempat absen pulang', 'Diajukan 21 November'],
  ['Lupa absen masuk', 'Disetujui', 'success', '2026-11-12 · Shift Siang', 'Lupa absen karena langsung rapat dengan klien', 'Diajukan 13 November'],
  ['Kerja dari rumah', 'Ditolak', 'error', '2026-11-05 · Shift Pagi', 'Akses jalan menuju kantor ditutup', 'Diajukan 5 November'],
];
async function wdMyReq(th, role, active, mode) {
  const tall = mode === 'form' || mode === 'form-galat';
  const { f, main } = await page('x', th, { role, active, h: tall ? 1100 : mode === 'data' ? 800 : 600 });
  if (mode === 'galat') { await alertBox('error', 'Gagal memuat riwayat pengajuan. Coba lagi.', th, main); return f; }
  if (mode === 'tanpa-karyawan') { await alertBox('info', 'Akun ini belum terhubung ke data karyawan, jadi belum ada absensi yang bisa dikoreksi.', th, main); return f; }
  const act = await pageHeader(th, main, 'Pengajuan Saya', 'Riwayat pengajuan koreksi absensi');
  await button('Ajukan Koreksi', th, act, { icon: 'plus' });
  if (mode === 'kosong') {
    const c = card(th, main, { pad: 48 }); const e = box('empty', { dir: 'V', gap: 8, ax: 'CENTER', ay: 'CENTER', theme: th, parent: c, fillW: true });
    icon('file', 44, 'color/text/disabled', th, e); await txt('Belum ada pengajuan. Kalau lupa absen, ajukan koreksinya di sini.', 'body2', 'color/text/secondary', th, { parent: e });
  } else {
    const list = box('list', { dir: 'V', gap: 16, theme: th, parent: main, fillW: true });
    for (const q of WD_MY_REQ) {
      const c = card(th, list, { gap: 6 });
      const ch = box('chips', { dir: 'H', gap: 8, theme: th, parent: c }); await chip(q[0], th, ch, {}); await chip(q[1], th, ch, { color: q[2] });
      await txt(q[3], 'body2-strong', 'color/text/primary', th, { parent: c, fillW: true });
      await txt(q[4], 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
      await txt(q[5], 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
    }
  }
  if (tall) {
    const err = mode === 'form-galat';
    await dialog(th, f, { title: 'Ajukan Koreksi Absensi', w: 444, build: async (b) => {
      if (err) await alertBox('error', 'Foto selfie wajib dilampirkan.', th, b);
      const g1 = box('g', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true });
      await inputField('Jenis pengajuan', 'Lupa absen pulang', th, g1, { select: true });
      await txt('Sudah absen masuk, tapi lupa absen pulang. Hanya bisa kalau absen masuknya sudah tercatat.', 'caption', 'color/text/secondary', th, { parent: g1, fillW: true });
      const g2 = box('g', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true });
      await inputField('Shift yang dikoreksi', '2026-11-20 · Shift Pagi', th, g2, { select: true });
      await txt('Hanya 30 hari terakhir. Kalau lebih lama, minta HR yang mengoreksi.', 'caption', 'color/text/secondary', th, { parent: g2, fillW: true });
      await inputField('Jam pulang seharusnya', '17:00', th, b, { endIcon: 'clock', helper: 'Jadwal shift 08:00-17:00' });
      await inputField('Alasan', err ? 'HP mati sebelum sempat absen pulang' : '', th, b, { multiline: 2, required: true });
      const g3 = box('g', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true });
      await button('Lampirkan foto selfie', th, g3, { v: 'outlined', icon: 'camera', fillW: true });
      await txt('Wajib. Atasan akan melihatnya saat memeriksa pengajuan.', 'caption', err ? 'color/danger' : 'color/text/secondary', th, { parent: g3, fillW: true });
      wdDivider(th, b);
      await txt('Pengajuan dikirim ke atasan langsung, lalu ke HR. Hasilnya dikabari lewat email.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
    }, actions: [{ label: 'Batal' }, { label: 'Kirim Pengajuan', v: 'contained' }] });
  }
  return f;
}
const WD_EMP = ['employee', 'Koreksi Absensi  '], WD_OWN = ['owner', 'Koreksi Absensi '];
for (const [pre, ro, ac, lbl] of [['employee/requests', ...WD_EMP, 'karyawan'], ['owner/my-requests', ...WD_OWN, 'owner']]) {
  for (const [sfx, mode, t] of [['', 'data', ''], ['-kosong', 'kosong', ' (kosong)'], ['-galat', 'galat', ' (galat)'], ['-form', 'form', ' (dialog ajukan)'], ['-form-galat', 'form-galat', ' (dialog ajukan, galat)']].concat(lbl === 'owner' ? [['-tanpa-karyawan', 'tanpa-karyawan', ' (belum terhubung ke karyawan)']] : [])) {
    registerScreen({ key: pre + sfx, group: WD_GROUP, title: 'Koreksi Absensi ' + lbl + t, build: (th) => wdMyReq(th, ro, ac, mode) });
  }
}

/* ---------- Profil Saya (karyawan) ---------- */
async function wdField(th, parent, label, value) {
  const r = box('Field', { dir: 'V', gap: 2, theme: th, parent, fillW: true });
  await txt(label, 'caption', 'color/text/secondary', th, { parent: r, fillW: true }); await txt(value || '-', 'body2', value ? 'color/text/primary' : 'color/text/disabled', th, { parent: r, fillW: true });
}
async function wdProfileCard(th, parent, title, sub, groups) {
  const c = card(th, parent, { gap: 16, pad: 24, fillW: false }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
  const tt = box('t', { dir: 'V', gap: 4, theme: th, parent: c, fillW: true }); await txt(title, 'subtitle', 'color/text/primary', th, { parent: tt });
  if (sub) await txt(sub, 'body2', 'color/text/secondary', th, { parent: tt, fillW: true });
  for (const [i, g] of groups.entries()) {
    if (g.title) { wdDivider(th, c); await txt(g.title, 'subtitle', 'color/text/primary', th, { parent: c }); }
    else if (i > 0) wdDivider(th, c);
    for (const [l, v] of g.f) await wdField(th, c, l, v);
  }
  return c;
}
async function wdProfile(th, mode) {
  const { f, main } = await page('x', th, { role: 'employee', active: 'Profil Saya', h: mode === 'galat' ? 600 : 1560 });
  if (mode === 'galat') { await alertBox('error', 'Gagal memuat profil. Coba muat ulang halaman.', th, main); return f; }
  const hd = box('head', { dir: 'V', gap: 4, theme: th, parent: main, fillW: true });
  await txt('Profil Saya', 'h5', 'color/text/primary', th, { parent: hd }); await txt('Selain foto, semua data di sini diatur HR. Hubungi HR kalau ada yang salah.', 'body2', 'color/text/secondary', th, { parent: hd });
  const hc = card(th, main, { gap: 20, pad: 24 });
  const r = box('row', { dir: 'H', gap: 24, ay: 'CENTER', theme: th, parent: hc, fillW: true });
  await avatar('B', 96, th, r);
  const t = box('text', { dir: 'V', gap: 4, theme: th, parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
  await txt('Budi Santoso', 'h6', 'color/text/primary', th, { parent: t }); await txt('EMP-000003 · budi@perusahaan.co.id', 'body2', 'color/text/secondary', th, { parent: t });
  const cr = box('chips', { dir: 'H', gap: 8, theme: th, parent: t }); await chip('Aktif', th, cr, { color: 'success' }); await chip('Lokasi fleksibel', th, cr, { color: 'info', variant: 'outlined' });
  await button(mode === 'tanpa-foto' ? 'Unggah Foto' : 'Ganti Foto', th, r, { v: 'outlined', icon: 'camera' });
  if (mode === 'tanpa-foto') await alertBox('info', 'Pakai foto wajah menghadap depan dengan cahaya terang, tanpa masker atau kacamata hitam. Jangan pakai foto bersama atau foto yang wajahnya terlalu kecil.', th, hc, 'Foto ini dipakai untuk memastikan yang absen memang pemilik akun');
  const r1 = wdRow(th, main, 20);
  await wdProfileCard(th, r1, 'Kepegawaian', null, [{ f: [['Perusahaan', 'PT Maju Bersama'], ['Departemen', 'Teknologi Informasi'], ['Jabatan', 'Staf IT'], ['Golongan', 'III-A'], ['Atasan langsung', 'Dewi Lestari'], ['Kantor utama', 'Kantor Pusat Jakarta']] }, { f: [['Tanggal bergabung', '15 Maret 2022'], ['Masa kerja', '4 tahun 8 bulan'], ['Tipe kepegawaian', 'Karyawan Tetap']] }]);
  await wdProfileCard(th, r1, 'Identitas', null, [{ f: [['NIK (KTP)', '3174000000000001'], ['Nomor Kartu Keluarga', '3174000000000002'], ['NPWP', '00.000.000.0-000.000'], ['Tempat, tanggal lahir', 'Bandung, 12 Agustus 1994'], ['Jenis kelamin', 'Laki-laki'], ['Status pernikahan', 'Menikah'], ['Agama', 'Islam'], ['Golongan darah', 'O'], ['Pendidikan terakhir', 'S1'], ['Nama ibu kandung', 'Siti Aminah']] }]);
  const r2 = wdRow(th, main, 20);
  await wdProfileCard(th, r2, 'Alamat dan Kontak', null, [{ f: [['Alamat sesuai KTP', 'Jl. Melati No. 10, Bandung'], ['Alamat domisili', 'Jl. Kenanga No. 5, Jakarta Selatan'], ['Email pribadi', 'budi.s@perusahaan.co.id'], ['Nomor telepon', '0812-0000-0001']] }, { title: 'Kontak Darurat', f: [['Nama', 'Ani Santoso'], ['Hubungan', 'Istri'], ['Nomor telepon', '0812-0000-0002']] }]);
  await wdProfileCard(th, r2, 'Jaminan Sosial dan Bank', 'Cek lagi nomor rekening. Kalau salah, gaji bisa masuk ke rekening orang lain.', [{ f: [['BPJS Ketenagakerjaan', '00000000001'], ['BPJS Kesehatan', '00000000002']] }, { f: [['Bank', 'Bank Contoh'], ['Nomor rekening', '1234567890'], ['Nama pemilik rekening', 'Budi Santoso']] }]);
  return f;
}
registerScreen({ key: 'employee/profile', group: WD_GROUP, title: 'Profil Saya', build: (th) => wdProfile(th, 'data') });
registerScreen({ key: 'employee/profile-tanpa-foto', group: WD_GROUP, title: 'Profil Saya (belum ada foto)', build: (th) => wdProfile(th, 'tanpa-foto') });
registerScreen({ key: 'employee/profile-galat', group: WD_GROUP, title: 'Profil Saya (galat)', build: (th) => wdProfile(th, 'galat') });
