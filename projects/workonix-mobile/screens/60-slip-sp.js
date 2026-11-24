/* Slip Gaji (features/salary_slip) + Surat dari HR (features/warning_letter).
 * Dibuka dari tab Profil; halaman biasa dengan app bar + tombol kembali (bukan tab). */
const SL_SLIP_GROUP = 'Slip Gaji';
const SL_SP_GROUP = 'Surat Peringatan';

registerIcons({
  'sl-receipt': '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  'sl-pdf': '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 14h4M10 17h4"/>',
  'sl-undo': '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  'sl-hourglass': '<path d="M7 3h10M7 21h10M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>',
  'sl-refresh': '<path d="M20 11a8 8 0 1 0-2 5.5M20 4v7h-7"/>',
  'sl-cloudoff': '<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1 .5 9H7zM4 4l16 16"/>',
  'sl-spinner': '<path d="M12 3a9 9 0 1 0 9 9"/>',
});

/* ---------- Pembantu umum ---------- */
const slRp = (n) => 'Rp ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const slHidden = 'Rp •••••••';
const slBack = (f) => f.findOne((n) => n.name === 'icon/back');
// Warna tingkat surat (warningLevelColor): konstanta di Dart, bukan token tema.
const SL_LEVEL_HEX = { verbal: '#64748B', sp1: '#D97706', sp2: '#EA580C', sp3: '#DC2626' };
const slRaw = (hex, opacity) => ({ type: 'SOLID', color: hexToRgb(hex), opacity: opacity ?? 1 });

/** ErrorState (app_widget.dart): ikon cloud_off, 'Gagal memuat', tombol 'Coba Lagi' 160x44. */
async function slErrorState(th, parent, msg) {
  const w = box('ErrorState', { dir: 'V', gap: 0, ay: 'CENTER', pad: [64, 32, 32, 32], theme: th, parent, fillW: true });
  const c = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/danger-surface', radius: 999, theme: th, parent: w, fixed: [68, 68] });
  icon('sl-cloudoff', 30, 'color/danger', th, c);
  gap(w, 18); await txt('Gagal memuat', 'h2', 'color/text/primary', th, { parent: w, fillW: true, align: 'CENTER' });
  gap(w, 6); await txt(msg, 'caption', 'color/text/secondary', th, { parent: w, fillW: true, align: 'CENTER' });
  gap(w, 20);
  const b = box('Coba Lagi', { dir: 'H', gap: 8, ax: 'CENTER', ay: 'CENTER', stroke: 'color/border', radius: 12, theme: th, parent: w, fixed: [160, 44] });
  icon('sl-refresh', 18, 'color/primary', th, b); await txt('Coba Lagi', 'body-strong', 'color/primary', th, { parent: b });
  return w;
}

/** Tombol PDF (FilledButton.icon 50 tinggi). busy = state mengunduh (nonaktif + spinner). */
async function slPdfButton(th, parent, label, busy) {
  const b = box('Button/' + label, { dir: 'H', gap: 8, ax: 'CENTER', ay: 'CENTER', fill: busy ? 'color/border' : 'color/primary', radius: 12, theme: th, parent, fixed: [328, 50] });
  b.layoutSizingHorizontal = 'FILL';
  const fg = busy ? 'color/text/disabled' : 'white';
  icon(busy ? 'sl-spinner' : 'sl-pdf', busy ? 18 : 20, fg, th, b);
  await txt(busy ? 'Mengunduh...' : label, 'body-strong', fg, th, { parent: b });
  return b;
}

/** Kotak pemberitahuan (info/peringatan berlatar surface, radius 12, padding 14). */
async function slNotice(th, parent, ic, fg, bg, title, body) {
  const n = box('Notice', { dir: 'H', gap: 10, ay: 'MIN', pad: 14, fill: bg, radius: 12, theme: th, parent, fillW: true });
  const i = icon(ic, 18, fg, th, n);
  const col = box('text', { dir: 'V', gap: 4, theme: th, parent: n }); col.layoutGrow = 1; col.layoutSizingHorizontal = 'FILL';
  if (body === undefined) { await txt(title, 'body', fg, th, { parent: col, fillW: true }); }
  else { await txt(title, 'body-strong', fg, th, { parent: col, fillW: true }); if (body) await txt(body, 'body', fg, th, { parent: col, fillW: true }); }
  return n;
}

/** _Row: label caption 130 lebar + nilai body (padding vertikal 5). */
async function slRow(th, parent, label, value) {
  const r = box('Row', { dir: 'H', ay: 'MIN', pad: [5, 0, 5, 0], theme: th, parent, fillW: true });
  const l = box('label', { dir: 'H', theme: th, parent: r, fixed: [130, 17] }); l.layoutSizingVertical = 'HUG';
  await txt(label, 'caption', 'color/text/secondary', th, { parent: l, fillW: true });
  await txt(value, 'body', 'color/text/primary', th, { parent: r, fillW: true });
  r.children[1].layoutGrow = 1;
  return r;
}
function slDivider(th, parent, total) {
  gap(parent, (total - 1) / 2);
  const d = figma.createRectangle(); d.name = 'divider'; d.resize(296, 1); d.fills = [pv(th, 'color/border')]; parent.appendChild(d); d.layoutSizingHorizontal = 'FILL';
  gap(parent, (total - 1) / 2);
}

/* ================= SLIP GAJI ================= */
const SL_SLIPS = [
  { bulan: 'Oktober 2026', periode: '1 Okt 2026 – 31 Okt 2026', net: 8868636 },
  { bulan: 'September 2026', periode: '1 Sep 2026 – 30 Sep 2026', net: 9255000 },
  { bulan: 'Agustus 2026', periode: '1 Agu 2026 – 31 Agu 2026', net: 9255000 },
];

/** SalarySlipCard. */
async function slCardItem(s, show, th, parent) {
  const c = box('SalarySlipCard', { dir: 'H', gap: 0, ay: 'CENTER', pad: 16, fill: 'color/surface', stroke: 'color/border', radius: 14, theme: th, parent, fillW: true, clip: true });
  const col = box('content', { dir: 'V', gap: 0, theme: th, parent: c }); col.layoutGrow = 1; col.layoutSizingHorizontal = 'FILL';
  await txt(s.bulan, 'body-strong', 'color/text/primary', th, { parent: col, fillW: true }); gap(col, 8);
  await txt('GAJI BERSIH', 'label', 'color/text/secondary', th, { parent: col }); gap(col, 2);
  await txt(show ? slRp(s.net) : slHidden, 'h1', 'color/primary', th, { parent: col, fillW: true }); gap(col, 8);
  await infoRow('calendar', s.periode, th, col);
  icon('chevron', 24, 'color/text/secondary', th, c);
  return c;
}

function slSlipList(th, show) {
  return (async () => {
    const { f, body } = await phone('x', th, 'Slip Gaji', { actions: [show ? 'eyeoff' : 'eye'], pad: [16, 16, 24, 16] });
    await sectionLabel('RIWAYAT SLIP', th, body); gap(body, 10);
    const list = box('slips', { dir: 'V', gap: 10, theme: th, parent: body, fillW: true });
    const cards = [];
    for (const s of SL_SLIPS) cards.push(await slCardItem(s, show, th, list));
    for (const c of cards) link(c, 'slip-detail');
    link(slBack(f), 'profil');
    const toggle = f.findOne((n) => n.name === 'icon/eye' || n.name === 'icon/eyeoff');
    if (toggle) link(toggle, show ? 'slip-list' : 'slip-list-nominal', 'swap');
    return f;
  })();
}
registerScreen({ key: 'slip-list', group: SL_SLIP_GROUP, title: 'Daftar (nominal tersembunyi)', build: (th) => slSlipList(th, false) });
registerScreen({ key: 'slip-list-nominal', group: SL_SLIP_GROUP, title: 'Daftar (nominal tampil)', build: (th) => slSlipList(th, true) });

registerScreen({ key: 'slip-kosong', group: SL_SLIP_GROUP, title: 'Kondisi: kosong', build: async (th) => {
  const { f, body } = await phone('x', th, 'Slip Gaji', { actions: ['eye'], pad: [16, 16, 24, 16] });
  await emptyState('sl-receipt', 'Belum ada slip gaji', 'Slip gaji akan muncul di sini setelah penggajian bulan ini selesai diproses HR.', th, body);
  link(slBack(f), 'profil');
  return f;
} });
registerScreen({ key: 'slip-error', group: SL_SLIP_GROUP, title: 'Kondisi: error', build: async (th) => {
  const { f, body } = await phone('x', th, 'Slip Gaji', { actions: ['eye'], pad: [16, 16, 24, 16] });
  await slErrorState(th, body, 'Tidak bisa menghubungi server. Periksa koneksi internet Anda.');
  link(slBack(f), 'profil');
  return f;
} });

/** _LinesCard: judul label, caption opsional, baris dibayar, baris bantu redup, garis, total. */
async function slAmountRow(th, parent, label, value, o = {}) {
  const color = o.dimmed ? 'color/text/disabled' : 'color/text/primary';
  const r = box('AmountRow', { dir: 'H', gap: 12, ay: 'MIN', pad: [5, 0, 5, 0], theme: th, parent, fillW: true });
  const col = box('label', { dir: 'V', theme: th, parent: r }); col.layoutGrow = 1; col.layoutSizingHorizontal = 'FILL';
  await txt(label, o.strong ? 'body-strong' : 'body', color, th, { parent: col, fillW: true });
  if (o.note) await txt(o.note, 'caption', 'color/text/disabled', th, { parent: col, fillW: true });
  await txt(value, o.strong ? 'body-strong' : 'body', color, th, { parent: r });
  return r;
}
async function slLinesCard(th, parent, o) {
  const c = card(th, parent, { name: 'LinesCard/' + o.title, gap: 0 });
  await txt(o.title, 'label', 'color/text/secondary', th, { parent: c });
  if (o.caption) { gap(c, 4); await txt(o.caption, 'caption', 'color/text/secondary', th, { parent: c, fillW: true }); }
  gap(c, 8);
  const amt = (v) => (o.negative && v !== 0 ? '- ' + slRp(v) : slRp(v));
  if (!o.paid.length) { gap(c, 6); await txt('Tidak ada', 'caption', 'color/text/secondary', th, { parent: c }); gap(c, 6); }
  for (const [n, v] of o.paid) await slAmountRow(th, c, n, amt(v));
  for (const [n, v] of o.helpers ?? []) await slAmountRow(th, c, n, slRp(v), { note: 'komponen bantu, tidak dibayarkan', dimmed: true });
  slDivider(th, c, 20);
  await slAmountRow(th, c, o.totalLabel, amt(o.total), { strong: true });
  return c;
}

async function slSlipDetail(th, o) {
  const { f, body } = await phone('x', th, o.error ? 'Slip Gaji' : 'Oktober 2026', { h: o.error ? 800 : 1560, pad: [16, 16, 16, 16] });
  link(slBack(f), 'slip-list', 'back');
  if (o.error) { await slErrorState(th, body, 'Tidak bisa menghubungi server. Periksa koneksi internet Anda.'); return f; }
  const hd = box('NetPayHeader', { dir: 'V', gap: 0, pad: 18, fill: 'color/primary-surface', radius: 14, theme: th, parent: body, fillW: true });
  await txt('GAJI BERSIH', 'label', 'color/text/secondary', th, { parent: hd }); gap(hd, 4);
  await txt(slRp(8868636), 'display', 'color/primary', th, { parent: hd, fillW: true }); gap(hd, 6);
  await txt('1 Okt 2026 – 31 Okt 2026', 'caption', 'color/text/secondary', th, { parent: hd });
  gap(body, 12);
  await slNotice(th, body, 'info', 'color/warning', 'color/warning-surface', 'Ada 1 hari cuti tidak dibayar di periode ini.'); gap(body, 12);
  await slLinesCard(th, body, { title: 'PENDAPATAN', paid: [['Gaji Pokok', 8500000], ['Tunjangan Transport', 500000], ['Tunjangan Makan', 660000]], totalLabel: 'Total pendapatan', total: 9660000 }); gap(body, 12);
  await slLinesCard(th, body, { title: 'POTONGAN', negative: true, paid: [['BPJS Kesehatan (1%)', 85000], ['BPJS Ketenagakerjaan JHT (2%)', 170000], ['PPh 21', 150000], ['Cuti tidak dibayar', 386364]], helpers: [['Dasar pengenaan PPh 21', 9660000]], totalLabel: 'Total potongan', total: 791364 }); gap(body, 12);
  await slLinesCard(th, body, { title: 'DITANGGUNG PERUSAHAAN', caption: 'Dibayar perusahaan di luar gaji, tidak memotong gaji bersih.', paid: [['BPJS Kesehatan (4%)', 340000], ['BPJS JKK (0,24%)', 20400], ['BPJS JKM (0,3%)', 25500]], totalLabel: 'Total', total: 385900 }); gap(body, 12);
  const ic = card(th, body, { name: 'InfoCard' });
  await slRow(th, ic, 'Periode', '1 Okt 2026 – 31 Okt 2026');
  await slRow(th, ic, 'Hari dibayar', '21 dari 22 hari kerja');
  await slRow(th, ic, 'Jabatan', 'Staf Teknologi Informasi');
  await slRow(th, ic, 'Departemen', 'Teknologi Informasi');
  await slRow(th, ic, 'Rekening tujuan', 'Bank Mandiri · •••• 7890');
  gap(body, 20);
  const btn = await slPdfButton(th, body, 'Lihat Slip (PDF)', o.busy);
  return f;
}
registerScreen({ key: 'slip-detail', group: SL_SLIP_GROUP, title: 'Detail slip', build: (th) => slSlipDetail(th, {}) });
registerScreen({ key: 'slip-detail-unduh', group: SL_SLIP_GROUP, title: 'Detail: mengunduh PDF', build: (th) => slSlipDetail(th, { busy: true }) });
registerScreen({ key: 'slip-detail-batal', group: SL_SLIP_GROUP, title: 'Detail: gagal memuat', build: (th) => slSlipDetail(th, { error: true }) });

/* ================= SURAT DARI HR ================= */
const SL_LETTERS = {
  sp1: { level: 'sp1', label: 'SP 1', unread: false, status: 'Aktif', tone: 'warning', violation: 'Keterlambatan berulang', range: 'Berlaku 5 Okt 2026 – 5 Apr 2027', active: true },
  verbal: { level: 'verbal', label: 'Teguran Lisan', unread: true, status: 'Aktif', tone: 'warning', violation: 'Tidak mengisi absensi pulang', range: 'Berlaku 20 Nov 2026 – 20 Des 2026', active: true },
  lama: { level: 'sp1', label: 'SP 1', unread: false, status: 'Dicabut', tone: 'neutral', violation: 'Meninggalkan area kerja tanpa izin', range: 'Berlaku 3 Mar 2026 – 3 Sep 2026', active: false },
};

/** WarningLevelBadge: kotak radius 6, teks putih. large = body-strong, padding 12/6. */
async function slLevelBadge(level, label, large, th, parent) {
  const b = box('WarningLevelBadge', { dir: 'H', ay: 'CENTER', pad: large ? [6, 12, 6, 12] : [3, 8, 3, 8], radius: 6, theme: th, parent });
  b.fills = [slRaw(SL_LEVEL_HEX[level])];
  await txt(label, large ? 'body-strong' : 'label', 'white', th, { parent: b });
  return b;
}

/** WarningLetterCard: garis kiri 4 px (warna tingkat / border bila tidak aktif), padding 14. */
async function slLetterCard(l, th, parent) {
  const c = box('WarningLetterCard', { dir: 'H', theme: th, parent, fillW: true, fill: 'color/surface', stroke: 'color/border', radius: 14, clip: true });
  const bar = box('accent', { dir: 'H', theme: th, parent: c, fixed: [4, 10] });
  bar.layoutSizingVertical = 'FILL';
  if (l.active) bar.fills = [slRaw(SL_LEVEL_HEX[l.level])]; else bar.fills = [pv(th, 'color/border')];
  const col = box('content', { dir: 'V', gap: 0, pad: 14, theme: th, parent: c }); col.layoutGrow = 1; col.layoutSizingHorizontal = 'FILL';
  const top = box('badges', { dir: 'H', gap: 8, ay: 'MIN', ax: 'SPACE_BETWEEN', theme: th, parent: col, fillW: true });
  const left = box('level + baru', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: top });
  await slLevelBadge(l.level, l.label, false, th, left);
  if (l.unread) { const n = box('Baru', { dir: 'H', ay: 'CENTER', pad: [2, 6, 2, 6], fill: 'color/primary', radius: 10, theme: th, parent: left }); await txt('Baru', 'label', 'white', th, { parent: n }); }
  await badge(l.status, l.tone, null, th, top);
  gap(col, 10);
  await txt(l.violation, 'body-strong', l.active ? 'color/text/primary' : 'color/text/secondary', th, { parent: col, fillW: true }); gap(col, 6);
  await infoRow('calendar', l.range, th, col);
  return c;
}

/** _Summary: tingkat tertinggi yang berlaku (warna tingkat, alpha 8% + border alpha 40%), atau kotak hijau bila tak ada. */
async function slSummary(th, parent, current) {
  if (!current) {
    const c = box('Summary/aman', { dir: 'H', gap: 12, ay: 'CENTER', pad: 16, fill: 'color/success-surface', radius: 14, theme: th, parent, fillW: true });
    icon('check', 24, 'color/success', th, c);
    await txt('Tidak ada teguran atau SP yang sedang berlaku.', 'body', 'color/success', th, { parent: c, fillW: true });
    return c;
  }
  const hex = SL_LEVEL_HEX[current.level];
  const c = box('Summary', { dir: 'V', gap: 6, pad: 16, radius: 14, theme: th, parent, fillW: true });
  c.fills = [slRaw(hex, 0.08)]; c.strokes = [slRaw(hex, 0.4)]; c.strokeWeight = 1; c.strokeAlign = 'INSIDE';
  const r = box('title', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c, fillW: true });
  const wi = icon('warn', 24, 'white', th, r);
  for (const s of wi.findAll((x) => 'strokes' in x)) s.strokes = [slRaw(hex)];
  const t = await txt('Sedang berlaku: ' + current.label, 'body-strong', 'white', th, { parent: r, fillW: true }); t.fills = [slRaw(hex)];
  await txt('Berlaku sampai 5 Apr 2027. Pelanggaran berikutnya dalam masa ini akan naik ke tingkat selanjutnya.', 'caption', 'color/text/primary', th, { parent: c, fillW: true });
  return c;
}

async function slSpList(th, o) {
  const { f, body } = await phone('x', th, 'Surat dari HR', { h: o.h ?? 800, pad: [16, 16, 24, 16] });
  link(slBack(f), 'profil');
  const links = [];
  if (o.empty) { await emptyState('verified', 'Tidak ada surat', 'Teguran dan surat peringatan dari HR akan muncul di sini.', th, body); return f; }
  await slSummary(th, body, o.noActive ? null : SL_LETTERS.sp1); gap(body, 20);
  if (!o.noActive) {
    await sectionLabel('MASIH BERLAKU', th, body); gap(body, 10);
    const a = box('aktif', { dir: 'V', gap: 10, theme: th, parent: body, fillW: true });
    link(await slLetterCard(SL_LETTERS.sp1, th, a), 'sp-detail');
    link(await slLetterCard(SL_LETTERS.verbal, th, a), 'sp-detail-baru');
    gap(body, 20);
  }
  await sectionLabel('RIWAYAT', th, body); gap(body, 10);
  const p = box('riwayat', { dir: 'V', gap: 10, theme: th, parent: body, fillW: true });
  link(await slLetterCard(SL_LETTERS.lama, th, p), 'sp-detail-cabut');
  return f;
}
registerScreen({ key: 'sp-list', group: SL_SP_GROUP, title: 'Daftar surat', build: (th) => slSpList(th, {}) });
registerScreen({ key: 'sp-list-aman', group: SL_SP_GROUP, title: 'Daftar: tidak ada yang berlaku', build: (th) => slSpList(th, { noActive: true }) });
registerScreen({ key: 'sp-kosong', group: SL_SP_GROUP, title: 'Kondisi: kosong', build: (th) => slSpList(th, { empty: true }) });

const SL_NEXT = {
  verbal: 'Kalau terjadi pelanggaran lagi sebelum teguran ini berakhir, HR akan memberikan SP 1.',
  sp1: 'Kalau terjadi pelanggaran lagi sebelum SP 1 berakhir, HR akan memberikan SP 2.',
  sp3: 'Selama masa evaluasi, HR menilai ada tidaknya perbaikan. Kalau tidak ada perbaikan, perusahaan dapat mengakhiri hubungan kerja.',
  inactive: 'Surat ini sudah tidak berlaku, tapi tetap tersimpan sebagai riwayat.',
};
async function slSpDetail(th, d) {
  const { f, body } = await phone('x', th, d.label, { h: d.h ?? 900, pad: [16, 16, 16, 16] });
  link(slBack(f), 'sp-list', 'back');
  const hd = box('Header', { dir: 'H', gap: 8, ay: 'CENTER', ax: 'SPACE_BETWEEN', theme: th, parent: body, fillW: true });
  await slLevelBadge(d.level, d.label, true, th, hd);
  await badge(d.status, d.tone, null, th, hd);
  gap(body, 16);
  if (d.notice) { const n = d.notice; await slNotice(th, body, n[0], n[1], n[2], n[3], n[4]); gap(body, 12); }
  const c1 = card(th, body, { name: 'Isi surat' });
  await txt('PELANGGARAN', 'label', 'color/text/secondary', th, { parent: c1 }); gap(c1, 6);
  await txt(d.violation, 'h2', 'color/text/primary', th, { parent: c1, fillW: true }); gap(c1, 14);
  await txt('DETAIL', 'label', 'color/text/secondary', th, { parent: c1 }); gap(c1, 6);
  await txt(d.detail, 'body', 'color/text/primary', th, { parent: c1, fillW: true });
  gap(body, 12);
  const c2 = card(th, body, { name: 'Info surat' });
  await slRow(th, c2, 'Nomor surat', d.number);
  await slRow(th, c2, 'Tanggal terbit', d.issued);
  await slRow(th, c2, d.level === 'sp3' ? 'Akhir masa evaluasi' : 'Berlaku sampai', d.expires);
  await slRow(th, c2, 'Perusahaan', 'PT Workonix Teknologi');
  gap(body, 12);
  await txt(d.active ? SL_NEXT[d.level] : SL_NEXT.inactive, 'caption', 'color/text/secondary', th, { parent: body, fillW: true });
  gap(body, 20);
  await slPdfButton(th, body, 'Lihat Surat (PDF)', false);
  return f;
}
const SL_DETAIL = 'Terlambat lebih dari 15 menit sebanyak 6 kali dalam bulan September 2026 tanpa keterangan, meskipun sudah mendapat teguran lisan pada 8 September 2026.';
registerScreen({ key: 'sp-detail', group: SL_SP_GROUP, title: 'Detail: SP 1 aktif', build: (th) => slSpDetail(th, { level: 'sp1', label: 'SP 1', status: 'Aktif', tone: 'warning', active: true, violation: 'Keterlambatan berulang', detail: SL_DETAIL, number: 'SP1/012/HRD/X/2026', issued: '5 Okt 2026', expires: '5 Apr 2027' }) });
registerScreen({ key: 'sp-detail-baru', group: SL_SP_GROUP, title: 'Detail: Teguran Lisan baru', build: (th) => slSpDetail(th, { level: 'verbal', label: 'Teguran Lisan', status: 'Aktif', tone: 'warning', active: true, violation: 'Tidak mengisi absensi pulang', detail: 'Tidak mengisi absensi pulang pada 17, 18, dan 19 November 2026 sehingga jam kerja tidak tercatat.', number: 'TL/031/HRD/XI/2026', issued: '20 Nov 2026', expires: '20 Des 2026', h: 860 }) });
registerScreen({ key: 'sp-detail-cabut', group: SL_SP_GROUP, title: 'Detail: surat dicabut', build: (th) => slSpDetail(th, { level: 'sp1', label: 'SP 1', status: 'Dicabut', tone: 'neutral', active: false, violation: 'Meninggalkan area kerja tanpa izin', detail: 'Meninggalkan area kerja pada jam kerja tanpa izin atasan pada 12 Februari 2026.', number: 'SP1/004/HRD/III/2026', issued: '3 Mar 2026', expires: '3 Sep 2026', h: 1000, notice: ['sl-undo', 'color/info', 'color/info-surface', 'Surat ini sudah dicabut HR', 'Surat dicabut setelah klarifikasi bahwa karyawan sedang menjalankan tugas dinas.'] }) });
registerScreen({ key: 'sp-detail-sp3', group: SL_SP_GROUP, title: 'Detail: SP 3 evaluasi selesai', build: (th) => slSpDetail(th, { level: 'sp3', label: 'SP 3', status: 'Menunggu hasil evaluasi', tone: 'danger', active: true, violation: 'Pelanggaran tata tertib berulang', detail: SL_DETAIL, number: 'SP3/002/HRD/IX/2026', issued: '1 Sep 2026', expires: '1 Des 2026', h: 1000, notice: ['sl-hourglass', 'color/warning', 'color/warning-surface', 'Masa evaluasi sudah selesai', 'HR sedang memutuskan hasil evaluasinya.'] }) });

flowStart('slip-list', 'Lihat slip gaji');
flowStart('sp-list', 'Baca surat peringatan');
