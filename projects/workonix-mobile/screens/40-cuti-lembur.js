/* Cuti & Lembur (features/leave, features/overtime) */
const CL_CUTI = 'Cuti';
const CL_LEMBUR = 'Lembur';

registerIcons({
  'cl-beach': '<path d="M3 20h18M12 20V10M4 10a8 7 0 0 1 16 0z"/>',
  'cl-moretime': '<circle cx="11" cy="13" r="8"/><path d="M11 9v4l2.5 2M18 3v4M16 5h4"/>',
  'cl-cloudoff': '<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1 .5 9z"/><path d="M4 4l16 16"/>',
  'cl-refresh': '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  'cl-hourglass': '<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>',
  'cl-cancel': '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  'cl-block': '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  'cl-calc': '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/>',
  'cl-night': '<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z"/>',
  'cl-attach': '<path d="M20 11l-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7"/>',
  'cl-radio-on': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/>',
  'cl-photo': '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M3 17l5-4 4 3 3-2 6 4"/>',
});

/* ---------- Pembantu umum ---------- */
const clTone = (st) => ({
  approved: ['Disetujui', 'success', 'check'],
  rejected: ['Ditolak', 'danger', 'cl-cancel'],
  cancelled: ['Dibatalkan', 'neutral', 'cl-block'],
  pending: ['Menunggu', 'warning', 'cl-hourglass'],
}[st]);
const clFg = { success: 'color/success', danger: 'color/danger', warning: 'color/warning', info: 'color/info', neutral: 'color/text/secondary' };
const clBg = { success: 'color/success-surface', danger: 'color/danger-surface', warning: 'color/warning-surface', info: 'color/info-surface', neutral: 'color/background' };

function clBack(f, target) { link(f.findOne((n) => n.name === 'icon/back'), target, 'back'); }

/** Gradasi biru (copy heroCard) untuk bidang penuh. */
function clGradient(th) {
  const i = th === 'light' ? 0 : 1;
  return [{ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [
    { position: 0, color: { ...hexToRgb(PALETTE['color/primary'][i]), a: 1 } },
    { position: 1, color: { ...hexToRgb(PALETTE['color/primary-dark'][i]), a: 1 } }] }];
}

/** Teks putih transparan (Colors.white70 / white60). */
async function clWhite(str, style, th, parent, op, o = {}) {
  const t = await txt(str, style, 'white', th, { parent, ...o }); t.opacity = op; return t;
}

/** Judul bagian KAPITAL (AppText.label) dengan warna opsional. */
async function clLabel(text, th, parent, color) {
  return txt(text, 'label', color ?? 'color/text/secondary', th, { parent, upper: true, fillW: true });
}

/** Kotak keputusan (DecisionBox): tone, ikon, judul, isi, footer. */
async function clDecision(tone, ic, title, body, footer, th, parent) {
  const b = box('DecisionBox', { dir: 'V', gap: 6, pad: 12, fill: clBg[tone], radius: 10, theme: th, parent, fillW: true });
  const h = box('title', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: b });
  icon(ic, 15, clFg[tone], th, h); await txt(title, 'label', clFg[tone], th, { parent: h, upper: true });
  await txt(body, 'body', clFg[tone], th, { parent: b, fillW: true });
  if (footer) await txt(footer, 'label', clFg[tone], th, { parent: b, fillW: true });
  return b;
}

/** Kotak alasan (latar background, radius 8). */
async function clReasonBox(text, th, parent) {
  const r = box('reason', { dir: 'V', pad: 10, fill: 'color/background', radius: 8, theme: th, parent, fillW: true });
  await txt(text, 'caption', 'color/text/primary', th, { parent: r, fillW: true });
  return r;
}

/** Ringkasan kartu kosong / error (EmptyState & ErrorState). */
async function clErrorState(th, parent, msg) {
  const w = box('ErrorState', { dir: 'V', gap: 0, ay: 'CENTER', pad: 32, theme: th, parent, fillW: true });
  const c = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/danger-surface', radius: 999, theme: th, parent: w, fixed: [68, 68] });
  icon('cl-cloudoff', 30, 'color/danger', th, c); gap(w, 18);
  await txt('Gagal memuat', 'h2', 'color/text/primary', th, { parent: w, fillW: true, align: 'CENTER' }); gap(w, 6);
  await txt(msg, 'caption', 'color/text/secondary', th, { parent: w, fillW: true, align: 'CENTER' }); gap(w, 20);
  const b = box('retry', { dir: 'H', gap: 8, ax: 'CENTER', ay: 'CENTER', stroke: 'color/border', radius: 12, theme: th, parent: w, fixed: [160, 44] });
  icon('cl-refresh', 18, 'color/primary', th, b); await txt('Coba Lagi', 'body-strong', 'color/primary', th, { parent: b });
  return w;
}

/** Kolom isian bergaya InputDecorator: label kecil di atas nilai. o: value, hint, trailing, error, helper, counter, lines. */
async function clField(label, th, parent, o = {}) {
  const wrap = box('field wrap', { dir: 'V', gap: 4, theme: th, parent, fillW: true });
  const f = box('TextField', { dir: 'H', gap: 10, ay: 'CENTER', pad: [10, 14, 10, 14], fill: 'color/surface', stroke: o.error ? 'color/danger' : 'color/border', radius: 12, theme: th, parent: wrap, fillW: true });
  const c = box('text', { dir: 'V', gap: 2, theme: th, parent: f }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
  await txt(label, 'caption', o.error ? 'color/danger' : 'color/text/secondary', th, { parent: c, fillW: true });
  await txt(o.value ?? o.hint, o.value ? (o.strong ? 'body-strong' : 'body') : 'body', o.value ? 'color/text/primary' : 'color/text/disabled', th, { parent: c, fillW: true });
  if (o.lines) for (let i = 1; i < o.lines; i++) gap(c, 17);
  if (o.trailing) icon(o.trailing, 20, 'color/text/secondary', th, f);
  if (o.helper) await txt(o.helper, 'caption', 'color/text/secondary', th, { parent: wrap, fillW: true });
  if (o.counter) await txt(o.counter, 'caption', 'color/text/secondary', th, { parent: wrap, fillW: true, align: 'RIGHT' });
  return wrap;
}

/** Tombol bawah form (FilledButton dalam daftar). disabled = tampilan nonaktif. */
async function clSubmit(label, th, parent, disabled) {
  if (!disabled) return button(label, th, parent);
  const b = box('Button/' + label, { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/border', radius: 12, theme: th, parent, fixed: [328, 52] });
  b.layoutSizingHorizontal = 'FILL'; b.opacity = 0.7;
  await txt(label, 'body-strong', 'color/text/disabled', th, { parent: b });
  return b;
}

/** Tombol garis (OutlinedButton). danger = teks merah. */
async function clOutline(label, ic, th, parent, danger, grow) {
  const b = box('Button/' + label, { dir: 'H', gap: 8, ax: 'CENTER', ay: 'CENTER', stroke: 'color/border', radius: 12, theme: th, parent, fixed: [328, 48] });
  b.layoutSizingHorizontal = 'FILL';
  if (grow) b.layoutGrow = 1;
  const fg = danger ? 'color/danger' : 'color/primary';
  icon(ic, 20, fg, th, b); await txt(label, 'body-strong', fg, th, { parent: b });
  return b;
}

/** Snackbar danger melayang di dasar frame. */
async function clSnack(f, msg, th, h) {
  const s = box('SnackBar', { dir: 'H', gap: 8, ay: 'CENTER', pad: [14, 16, 14, 16], fill: 'color/danger', radius: 12, theme: th, parent: f });
  s.layoutPositioning = 'ABSOLUTE'; s.x = 16; s.y = h - 24 - 8 - 60; s.resize(328, 60);
  await txt(msg, 'body', 'white', th, { parent: s, fillW: true });
  return s;
}

/** Baris tiga statistik pratinjau (label kecil + nilai). */
async function clStat(label, value, th, parent, hl, valStyle, size) {
  const c = box('stat', { dir: 'V', gap: 2, theme: th, parent }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
  await txt(label, 'label', 'color/text/secondary', th, { parent: c, fillW: true });
  await txt(value, valStyle, hl ? 'color/primary' : 'color/text/primary', th, { parent: c, size, fillW: true });
  return c;
}

/* ===================== CUTI: DAFTAR ===================== */
async function clBalanceHeader(th, parent, b) {
  const h = box('BalanceHeader', { dir: 'V', pad: [12, 20, 40, 20], theme: th, parent, fillW: true });
  h.fills = clGradient(th);
  await clWhite('Sisa jatah cuti', 'body', th, h, 0.7); gap(h, 4);
  const r = box('remaining', { dir: 'H', gap: 8, ay: 'BASELINE', theme: th, parent: h });
  await txt(b.remaining, 'display', 'white', th, { parent: r, size: 46 });
  await clWhite('hari', 'body', th, r, 0.7); gap(h, 4);
  await clWhite(b.period, 'caption', th, h, 0.7); gap(h, 18);
  const s = box('stats', { dir: 'H', ay: 'CENTER', pad: [12, 0, 12, 0], radius: 12, theme: th, parent: h, fillW: true });
  s.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.14 }];
  const stat = async (l, v) => {
    const c = box('stat', { dir: 'V', gap: 2, ay: 'CENTER', theme: th, parent: s }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
    await clWhite(l, 'label', th, c, 0.7); const t = await txt(v + ' hari', 'body-strong', 'white', th, { parent: c, size: 16 }); t.lineHeight = { unit: 'PIXELS', value: 20 };
  };
  await stat('JATAH', b.entitled);
  const d = figma.createRectangle(); d.name = 'divider'; d.resize(1, 28); d.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.25 }]; s.appendChild(d);
  await stat('TERPAKAI', b.used);
  return h;
}

async function clLeaveCard(r, th, parent) {
  const [bl, bt, bi] = clTone(r.status);
  const c = card(th, parent, { name: 'RequestCard' });
  const top = box('top', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c, fillW: true });
  await txt(r.type, 'body-strong', 'color/text/primary', th, { parent: top, fillW: true });
  await badge(bl, bt, bi, th, top); gap(c, 6);
  await infoRow('calendar', r.range, th, c); gap(c, 4);
  await infoRow('clock', r.days, th, c);
  if (r.reason) { gap(c, 10); await clReasonBox(r.reason, th, c); }
  if (r.status === 'rejected') {
    gap(c, 10);
    await clDecision('danger', 'info', 'Alasan penolakan', r.note, 'Ditolak oleh ' + r.by, th, c); gap(c, 8);
    await txt('Potongan jatah cuti Anda sudah dikembalikan.', 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
  }
  if (r.status === 'approved' && r.note) { gap(c, 10); await clDecision('success', 'check', 'Catatan penyetuju', r.note, 'Disetujui oleh ' + r.by, th, c); }
  if (r.status === 'pending') { gap(c, 8); await txt('Saldo Anda sudah dipotong sejak pengajuan dikirim. Kalau nanti ditolak, potongannya dikembalikan otomatis.', 'caption', 'color/text/secondary', th, { parent: c, fillW: true }); }
  return c;
}

const CL_BALANCE = { remaining: '8', entitled: '12', used: '4', period: '1 Jan 2026 – 31 Des 2026' };
const CL_REQUESTS = [
  { type: 'Cuti Tahunan', status: 'pending', range: '1 Des – 3 Des 2026', days: '3 hari kerja', reason: 'Urusan keluarga' },
  { type: 'Cuti Tahunan', status: 'approved', range: '10 Nov – 12 Nov 2026', days: '3 hari kerja', reason: 'Urusan keluarga', note: 'Selamat berlibur, pekerjaan sudah dialihkan.', by: 'Siti Rahayu' },
  { type: 'Cuti Sakit', status: 'rejected', range: '3 Nov 2026', days: '1 hari kerja · 1 tidak dibayar', reason: 'Kontrol ke dokter', note: 'Surat dokter belum dilampirkan.', by: 'Siti Rahayu' },
  { type: 'Cuti Tahunan', status: 'cancelled', range: '15 Okt – 16 Okt 2026', days: '2 hari kerja', reason: 'Rencana berubah' },
];

async function clLeaveList(th, o) {
  const { f, body } = await phone('x', th, 'Cuti', { noAppBar: true, h: o.h, pad: 0 });
  const header = await clBalanceHeader(th, body, o.balance ?? CL_BALANCE);
  const bw = box('actions', { dir: 'V', pad: [20, 16, 0, 16], theme: th, parent: body, fillW: true });
  const btn = await button('Ajukan Cuti', th, bw, { icon: 'plus' });
  link(btn, 'cuti-form');
  const list = box('list', { dir: 'V', pad: [16, 16, 24, 16], theme: th, parent: body, fillW: true });
  await sectionLabel('PENGAJUAN SAYA', th, list); gap(list, 10);
  if (o.empty) {
    await emptyState('cl-beach', 'Belum ada pengajuan', 'Pengajuan cuti Anda akan muncul di sini beserta status persetujuannya.', th, list);
  } else if (o.error) {
    list.remove();
    await clErrorState(th, body, 'Tidak bisa menghubungi server. Periksa koneksi internet Anda.');
  } else {
    const cards = box('cards', { dir: 'V', gap: 10, theme: th, parent: list, fillW: true });
    for (const r of CL_REQUESTS) await clLeaveCard(r, th, cards);
  }
  await bottomNav(th, f, 1);
  return f;
}
registerScreen({ key: 'cuti-list', group: CL_CUTI, title: 'Daftar cuti', build: (th) => clLeaveList(th, { h: 1560 }) });
registerScreen({ key: 'cuti-kosong', group: CL_CUTI, title: 'Kondisi: kosong', build: (th) => clLeaveList(th, { h: 900, empty: true, balance: { remaining: '12', entitled: '12', used: '0', period: '1 Jan 2026 – 31 Des 2026' } }) });
registerScreen({ key: 'cuti-error', group: CL_CUTI, title: 'Kondisi: error', build: async (th) => {
  const { f, body } = await phone('x', th, 'Cuti', { noAppBar: true, h: 800, pad: 0 });
  body.primaryAxisAlignItems = 'CENTER';
  await clErrorState(th, body, 'Tidak bisa menghubungi server. Periksa koneksi internet Anda.');
  await bottomNav(th, f, 1);
  return f;
} });

/* ===================== CUTI: FORM ===================== */
async function clTypeCard(t, sel, th, parent) {
  const c = box('TypeCard/' + t.name, { dir: 'H', gap: 12, ay: 'MIN', pad: 14, fill: sel ? 'color/primary-surface' : 'color/surface', stroke: sel ? 'color/primary' : 'color/border', sw: sel ? 1.6 : 1, radius: 12, theme: th, parent, fillW: true });
  icon(sel ? 'cl-radio-on' : 'radio', 20, sel ? 'color/primary' : 'color/text/disabled', th, c);
  const col = box('text', { dir: 'V', gap: 2, theme: th, parent: c }); col.layoutGrow = 1; col.layoutSizingHorizontal = 'FILL';
  const r = box('title', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: col, fillW: true });
  await txt(t.name, 'body-strong', sel ? 'color/primary' : 'color/text/primary', th, { parent: r, fillW: true });
  await txt(t.cat, 'label', 'color/text/secondary', th, { parent: r });
  await txt(t.desc, 'caption', 'color/text/secondary', th, { parent: col, fillW: true });
  return c;
}
const CL_TYPES = [
  { name: 'Cuti Tahunan', cat: 'Tahunan', desc: 'Memotong jatah cuti tahunan' },
  { name: 'Cuti Sakit', cat: 'Sakit', desc: 'Tidak memotong jatah tahunan · Maksimal 3 hari per kejadian · Wajib lampiran' },
  { name: 'Cuti Menikah', cat: 'Khusus', desc: 'Tidak memotong jatah tahunan · Maksimal 3 hari per kejadian' },
];
async function clDivider(th, parent) { gap(parent, 16); const d = figma.createRectangle(); d.name = 'divider'; d.resize(328, 1); d.fills = [pv(th, 'color/border')]; parent.appendChild(d); d.layoutSizingHorizontal = 'FILL'; gap(parent, 15); }

async function clLeaveForm(th, o) {
  const H = 1760;
  const { f, body } = await phone('x', th, 'Ajukan Cuti', { h: H, pad: [16, 16, 32, 16] });
  await clLabel('JENIS CUTI', th, body); gap(body, 10);
  const types = box('types', { dir: 'V', gap: 8, theme: th, parent: body, fillW: true });
  for (const [i, t] of CL_TYPES.entries()) await clTypeCard(t, i === (o.sick ? 1 : 0), th, types);
  await clDivider(th, body);
  await clLabel('TANGGAL', th, body); gap(body, 10);
  const dr = box('dates', { dir: 'H', gap: 12, theme: th, parent: body, fillW: true });
  for (const [l, v] of [['Mulai', '1 Des 2026'], ['Selesai', o.sick ? '12 Des 2026' : '3 Des 2026']]) {
    const w = await clField(l, th, dr, { value: v, strong: true, trailing: 'calendar', error: o.sick && l === 'Mulai' });
    w.layoutGrow = 1; w.layoutSizingHorizontal = 'FILL';
  }
  gap(body, 16);
  if (o.sick) {
    const e = box('PreviewRejected', { dir: 'H', gap: 10, pad: 16, fill: 'color/danger-surface', radius: 14, theme: th, parent: body, fillW: true });
    e.counterAxisAlignItems = 'MIN'; icon('alert', 18, 'color/danger', th, e);
    await txt('Rentang cuti sakit melebihi batas 3 hari per kejadian dan sisa jatah Anda tidak mencukupi.', 'body', 'color/danger', th, { parent: e, fillW: true });
  } else {
    const p = box('PreviewCard', { dir: 'V', gap: 10, pad: 16, fill: 'color/primary-surface', radius: 14, theme: th, parent: body, fillW: true });
    await clLabel('DAMPAK PENGAJUAN', th, p, 'color/text/secondary');
    const sr = box('stats', { dir: 'H', theme: th, parent: p, fillW: true });
    await clStat('Hari kerja', '3', th, sr, false, 'h1', 22); await clStat('Sisa jatah', '8', th, sr, false, 'h1', 22); await clStat('Jadi', '5', th, sr, true, 'h1', 22);
    gap(p, 2);
    await txt('Tidak dihitung: 5 Des (Sabtu), 6 Des (Minggu)', 'caption', 'color/text/secondary', th, { parent: p, fillW: true });
  }
  await clDivider(th, body);
  await clField('Alasan', th, body, { value: o.sick ? null : 'Urusan keluarga', hint: 'mis. Acara keluarga di luar kota', lines: 3, counter: o.sick ? '0/500' : '15/500' });
  gap(body, 8);
  await clField('Nomor yang bisa dihubungi (opsional)', th, body, { hint: '08xx xxxx xxxx', helper: 'Diisi kalau ada yang perlu menghubungi Anda selama cuti.', counter: '0/40' });
  gap(body, 8);
  await txt(o.sick ? 'LAMPIRAN (WAJIB)' : 'LAMPIRAN (OPSIONAL)', 'label', o.sick ? 'color/danger' : 'color/text/secondary', th, { parent: body, fillW: true, upper: true }); gap(body, 8);
  await clOutline('Pilih Dokumen', 'cl-attach', th, body);
  if (o.sick) { gap(body, 6); await txt('Cuti Sakit wajib melampirkan dokumen pendukung — biasanya surat dokter.', 'caption', 'color/danger', th, { parent: body, fillW: true }); }
  gap(body, 20);
  const send = await clSubmit('Kirim Pengajuan', th, body, o.sick);
  if (o.sick) { gap(body, 8); await txt('Pilih jenis dan tanggal dulu — pengajuan baru bisa dikirim setelah dampaknya dihitung.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true, align: 'CENTER' }); }
  else link(send, 'cuti-list');
  gap(body, 16);
  await txt('Saldo dipotong sejak pengajuan dikirim, bukan setelah disetujui — supaya tidak ada dua pengajuan yang sama-sama lolos pemeriksaan jatah. Kalau ditolak, potongannya dikembalikan otomatis.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true, align: 'CENTER' });
  clBack(f, 'cuti-list');
  return f;
}
registerScreen({ key: 'cuti-form', group: CL_CUTI, title: 'Form ajukan cuti', build: (th) => clLeaveForm(th, {}) });
registerScreen({ key: 'cuti-form-galat', group: CL_CUTI, title: 'Form: galat validasi', build: (th) => clLeaveForm(th, { sick: true }) });

/* ===================== LEMBUR: DAFTAR ===================== */
async function clMonthTotal(th, parent, approved, pending) {
  const { hero, col } = heroCard(th, parent);
  await clWhite('NOVEMBER 2026', 'label', th, col, 0.7, { upper: true }); gap(col, 2);
  const r = box('total', { dir: 'H', gap: 8, ay: 'BASELINE', theme: th, parent: col });
  await txt(approved, 'display', 'white', th, { parent: r, size: 42 });
  await clWhite('jam setara disetujui', 'body', th, r, 0.7);
  if (pending) { gap(col, 2); await clWhite(pending + ' jam lagi menunggu keputusan.', 'caption', th, col, 0.7, { fillW: true }); }
  gap(col, 4);
  await clWhite('Jam setara sudah dikali tarif hari dan tingkatannya, bukan jam sebenarnya.', 'caption', th, col, 0.6, { fillW: true });
  return hero;
}

async function clOtCard(r, th, parent) {
  const [bl, bt, bi] = clTone(r.status);
  const c = card(th, parent, { name: 'RequestCard' });
  const top = box('top', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c, fillW: true });
  await txt(r.date, 'body-strong', 'color/text/primary', th, { parent: top, fillW: true });
  await badge(bl, bt, bi, th, top); gap(c, 6);
  await infoRow('clock', r.time, th, c); gap(c, 4);
  await infoRow('cl-calc', r.eq, th, c);
  if (r.dayReason) { gap(c, 4); await txt(r.dayReason, 'caption', 'color/text/secondary', th, { parent: c, fillW: true }); }
  if (r.reason) { gap(c, 10); await clReasonBox(r.reason, th, c); }
  if (r.status === 'rejected') { gap(c, 10); await clDecision('danger', 'info', 'Alasan penolakan', r.note, 'Ditolak oleh ' + r.by, th, c); }
  return c;
}
const CL_OT = [
  { date: 'Sen, 23 Nov 2026', status: 'pending', time: '18:00 – 20:00 · 2 jam', eq: '3,5 jam setara · Hari kerja', reason: 'Menyelesaikan laporan bulanan untuk presentasi besok pagi' },
  { date: 'Sab, 14 Nov 2026', status: 'approved', time: '09:00 – 13:00 · 4 jam', eq: '8 jam setara · Akhir pekan', dayReason: 'Sabtu bukan hari kerja pada jadwal Anda.', reason: 'Migrasi data pelanggan' },
  { date: 'Rab, 11 Nov 2026', status: 'rejected', time: '19:00 – 20:30 · 1,5 jam', eq: '2,75 jam setara · Hari kerja', reason: 'Lembur', note: 'Pekerjaan yang dikerjakan belum jelas.', by: 'Siti Rahayu' },
  { date: 'Jum, 6 Nov 2026', status: 'cancelled', time: '18:00 – 19:00 · 1 jam', eq: '1,5 jam setara · Hari kerja', reason: 'Salah memasukkan tanggal' },
];
async function clOtList(th, o) {
  const { f, body } = await phone('x', th, 'Lembur', { h: o.h, pad: [16, 16, 24, 16] });
  await clMonthTotal(th, body, o.approved, o.pending); gap(body, 16);
  const btn = await button('Laporkan Lembur', th, body, { icon: 'plus' });
  gap(body, 20); await sectionLabel('LAPORAN SAYA', th, body); gap(body, 10);
  if (o.empty) await emptyState('cl-moretime', 'Belum ada laporan lembur', 'Laporan lembur Anda akan muncul di sini beserta status persetujuannya.', th, body);
  else { const cards = box('cards', { dir: 'V', gap: 10, theme: th, parent: body, fillW: true }); for (const r of CL_OT) await clOtCard(r, th, cards); }
  link(btn, 'lembur-form'); clBack(f, 'absensi-home');
  return f;
}
registerScreen({ key: 'lembur-list', group: CL_LEMBUR, title: 'Daftar lembur', build: (th) => clOtList(th, { h: 1280, approved: '8', pending: '3,5' }) });
registerScreen({ key: 'lembur-kosong', group: CL_LEMBUR, title: 'Kondisi: kosong', build: (th) => clOtList(th, { h: 800, approved: '0', empty: true }) });

/* ===================== LEMBUR: FORM ===================== */
async function clOtForm(th, o) {
  const H = 1500;
  const { f, body } = await phone('x', th, 'Laporkan Lembur', { h: H, pad: [16, 16, 32, 16] });
  await clLabel('WAKTU LEMBUR', th, body); gap(body, 10);
  await clField('Tanggal', th, body, { value: 'Sen, 23 Nov 2026', strong: true, trailing: 'calendar' }); gap(body, 14);
  const tr = box('times', { dir: 'H', gap: 12, theme: th, parent: body, fillW: true });
  for (const [l, v] of [['Mulai', o.night ? '22:00' : '18:00'], ['Selesai', o.night ? '02:00' : '20:00']]) {
    const w = await clField(l, th, tr, { value: v, strong: true, trailing: 'clock' }); w.layoutGrow = 1; w.layoutSizingHorizontal = 'FILL';
  }
  if (o.night) {
    gap(body, 8);
    const n = box('midnight note', { dir: 'H', gap: 6, theme: th, parent: body, fillW: true }); n.counterAxisAlignItems = 'MIN';
    icon('cl-night', 15, 'color/info', th, n);
    await txt('Melewati tengah malam, selesai Sel, 24 Nov 2026. Tarifnya mengikuti hari mulai.', 'caption', 'color/info', th, { parent: n, fillW: true });
  }
  gap(body, 18);
  const p = box('PreviewCard', { dir: 'V', gap: 0, pad: 16, fill: 'color/primary-surface', radius: 14, theme: th, parent: body, fillW: true });
  await clLabel('PERHITUNGAN', th, p); gap(p, 10);
  const sr = box('stats', { dir: 'H', theme: th, parent: p, fillW: true });
  await clStat('Durasi', o.night ? '4 jam' : '2 jam', th, sr, false, 'body-strong', 16);
  await clStat('Jenis hari', 'Hari kerja', th, sr, false, 'body-strong', 16);
  await clStat('Setara', o.night ? '7,5 jam' : '3,5 jam', th, sr, true, 'body-strong', 16);
  gap(p, 12);
  const dv = figma.createRectangle(); dv.name = 'divider'; dv.resize(296, 1); dv.fills = [pv(th, 'color/border')]; p.appendChild(dv); dv.layoutSizingHorizontal = 'FILL'; gap(p, 10);
  const tiers = o.night ? [['Jam pertama — 1 jam × 1,5', '1,5 jam'], ['Jam berikutnya — 3 jam × 2', '6 jam']] : [['Jam pertama — 1 jam × 1,5', '1,5 jam'], ['Jam berikutnya — 1 jam × 2', '2 jam']];
  for (const [l, v] of tiers) {
    const r = box('tier', { dir: 'H', gap: 8, theme: th, parent: p, fillW: true });
    await txt(l, 'caption', 'color/text/primary', th, { parent: r, fillW: true }); await txt(v, 'caption', 'color/text/primary', th, { parent: r });
    gap(p, 4);
  }
  gap(p, 6); await txt('Sudah 1 jam hari ini · 6 jam pekan ini', 'caption', 'color/text/secondary', th, { parent: p, fillW: true });
  await clDivider(th, body);
  await clField('Pekerjaan yang dikerjakan', th, body, { value: o.night ? null : 'Menyelesaikan laporan bulanan untuk presentasi besok pagi', hint: 'mis. Menyelesaikan laporan bulanan untuk presentasi besok pagi', lines: 3, counter: o.night ? '0/500' : '56/500', helper: 'Atasan memutuskan berdasarkan ini. Sebutkan pekerjaannya, bukan cuma "lembur".' });
  gap(body, 12);
  await clLabel('BUKTI (WAJIB)', th, body); gap(body, 8);
  if (o.night) await clOutline('Lampirkan Bukti', 'cl-attach', th, body);
  else {
    const ph = box('proof photo', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', radius: 12, theme: th, parent: body, fixed: [328, 180] });
    ph.layoutSizingHorizontal = 'FILL'; icon('cl-photo', 40, 'color/primary', th, ph);
    gap(body, 8);
    const br = box('proof actions', { dir: 'H', gap: 10, theme: th, parent: body, fillW: true });
    await clOutline('Ganti', 'cl-refresh', th, br, false, true); await clOutline('Hapus', 'trash', th, br, true, true);
  }
  gap(body, 6);
  await txt('Sebagian perusahaan mewajibkan bukti. Kalau wajib dan belum dilampirkan, laporannya ditolak saat dikirim.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true });
  gap(body, 20);
  const send = await button('Kirim Laporan', th, body);
  if (!o.night) link(send, 'lembur-list');
  clBack(f, 'lembur-list');
  if (o.night) await clSnack(f, 'Bukti lembur wajib dilampirkan sebelum laporan dikirim.', th, H);
  return f;
}
registerScreen({ key: 'lembur-form', group: CL_LEMBUR, title: 'Form lapor lembur', build: (th) => clOtForm(th, {}) });
registerScreen({ key: 'lembur-form-galat', group: CL_LEMBUR, title: 'Form: galat validasi', build: (th) => clOtForm(th, { night: true }) });

flowStart('cuti-list', 'Ajukan cuti');
flowStart('lembur-list', 'Lapor lembur');
