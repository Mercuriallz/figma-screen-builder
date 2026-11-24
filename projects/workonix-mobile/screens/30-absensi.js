/* Absensi (features/attendance, attendance-history, attendance_request, face) */
const AB_GROUP = 'Absensi';

registerIcons({
  'ab-play': '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>',
  'ab-cancel': '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  'ab-block': '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  'ab-history': '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  'ab-more-time': '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M18 2v4M16 4h4"/>',
  'ab-event-busy': '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M10 13l4 4M14 13l-4 4"/>',
  'ab-cloudoff': '<path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1 .5 9z"/><path d="M4 4l16 16"/>',
  'ab-hourglass': '<path d="M7 3h10M7 21h10M8 3c0 5 4 5 4 9s-4 4-4 9M16 3c0 5-4 5-4 9s4 4 4 9"/>',
  'ab-videooff': '<rect x="3" y="6" width="12" height="12" rx="2"/><path d="M15 10l6-3v10l-6-3M3 3l18 18"/>',
  'ab-groupoff': '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M4 4l16 16"/>',
  'ab-zoomin': '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M11 8v6M8 11h6"/>',
  'ab-forward': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'ab-tick': '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  'ab-refresh': '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
  'ab-edit-note': '<path d="M4 7h10M4 12h6M4 17h6M14 17l5-5 2 2-5 5h-2z"/>',
  'ab-chevron-left': '<path d="M15 6l-6 6 6 6"/>',
  'ab-radio-on': '<circle cx="12" cy="12" r="9"/><path d="M12 12h.01" stroke-width="9"/>',
  'ab-calc': '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/>',
  'ab-phone': '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
});

/* ---------- pembantu umum ---------- */
const AB_BLACK = { type: 'SOLID', color: { r: 0.06, g: 0.07, b: 0.08 } };
const abGrow = (n) => { n.layoutGrow = 1; n.layoutSizingHorizontal = 'FILL'; return n; };
const abGrad = (th) => ({ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [
  { position: 0, color: { ...hexToRgb(PALETTE['color/primary'][th === 'light' ? 0 : 1]), a: 1 } },
  { position: 1, color: { ...hexToRgb(PALETTE['color/primary-dark'][th === 'light' ? 0 : 1]), a: 1 } }] });
const abWrap = (th, parent, pad, name) => box(name || 'wrap', { dir: 'V', pad, theme: th, parent, fillW: true });
const abBack = (f, target) => { const b = f.findOne((n) => n.name === 'icon/back'); if (b) link(b, target, 'back'); };

function abLine(th, parent, indent) {
  const w = box('divider', { dir: 'V', pad: [0, 0, 0, indent || 0], theme: th, parent, fillW: true });
  const r = figma.createRectangle(); r.name = 'divider'; r.resize(10, 1); r.fills = [pv(th, 'color/border')]; w.appendChild(r); r.layoutSizingHorizontal = 'FILL';
  return w;
}
function abVDiv(th, parent) { const r = figma.createRectangle(); r.name = 'divider'; r.resize(1, 30); r.fills = [pv(th, 'color/border')]; parent.appendChild(r); return r; }

/** Tombol penuh berwarna (FilledButton 54 tinggi), tone: primary|warning. */
async function abBtn(label, ic, tone, th, parent, o = {}) {
  const b = box('Button/' + label, { dir: 'H', gap: 8, ax: 'CENTER', ay: 'CENTER', fill: o.disabled ? 'color/border' : tone === 'warning' ? 'color/warning' : 'color/primary', radius: 12, theme: th, parent, fixed: [328, o.h ?? 54] });
  b.layoutSizingHorizontal = 'FILL';
  const fg = o.disabled ? 'color/text/disabled' : 'white';
  if (ic) icon(ic, o.h ? 20 : 22, fg, th, b);
  await txt(label, 'body-strong', fg, th, { parent: b, size: o.h ? 14 : 15 });
  return b;
}
async function abSnack(th, f, msg, tone) {
  const s = box('SnackBar', { dir: 'H', ay: 'CENTER', pad: [14, 16, 14, 16], fill: tone === 'success' ? 'color/success' : 'color/danger', radius: 12, theme: th, parent: f });
  await txt(msg, 'body', th === 'light' ? 'white' : 'color/text/primary', th, { parent: s });
  s.resize(328, 48); s.layoutPositioning = 'ABSOLUTE'; s.x = 16; s.y = f.height - 24 - 16 - 48;
  return s;
}
function abScrim(th, f, y, a) {
  const s = box('scrim', { dir: 'V', theme: th, parent: f, fixed: [360, f.height - y] });
  s.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: a }]; s.layoutPositioning = 'ABSOLUTE'; s.x = 0; s.y = y;
  return s;
}

/* ---------- Beranda Absensi (attendance_page.dart) ---------- */
async function abHeader(th, parent, o) {
  const h = box('Header', { dir: 'V', pad: [0, 20, 20, 20], theme: th, parent, fillW: true });
  h.fills = [abGrad(th)];
  const logo = box('logo', { dir: 'H', ay: 'CENTER', theme: th, parent: h, fixed: [120, 40] });
  await txt('workonix', 'h1', 'white', th, { parent: logo, name: 'logo' });
  gap(h, 12);
  const g = await txt(o.greeting + ',', 'body', 'white', th, { parent: h }); g.opacity = 0.7;
  await txt('Budi Santoso', 'h1', 'white', th, { parent: h });
  gap(h, 16);
  const r = box('clock row', { dir: 'H', gap: 10, ay: 'MAX', theme: th, parent: h });
  await txt(o.time, 'display', 'white', th, { parent: r, size: 40 });
  const dw = box('date', { dir: 'V', pad: [0, 0, 6, 0], theme: th, parent: r });
  const d = await txt('Selasa, 24 November 2026', 'caption', 'white', th, { parent: dw }); d.opacity = 0.7;
}

async function abStat(label, value, th, parent, color) {
  const c = box('Stat', { dir: 'V', gap: 3, ay: 'CENTER', theme: th, parent }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
  await txt(label, 'label', 'color/text/secondary', th, { parent: c });
  await txt(value, 'body-strong', color || 'color/text/primary', th, { parent: c, size: 16 });
}

/** _PrimaryShiftCard. mode: upcoming | open */
async function abShiftCard(th, parent, mode, o = {}) {
  const c = box('PrimaryShiftCard', { dir: 'V', pad: 18, fill: 'color/surface', stroke: 'color/border', radius: 18, theme: th, parent, fillW: true });
  c.effects = [{ type: 'DROP_SHADOW', color: { r: 0.05, g: 0.28, b: 0.63, a: 0.10 }, offset: { x: 0, y: 6 }, radius: 20, spread: 0, visible: true, blendMode: 'NORMAL' }];
  const row = box('title row', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c, fillW: true });
  const t = await txt('Shift Pagi', 'h1', 'color/text/primary', th, { parent: row }); abGrow(t); t.textAutoResize = 'HEIGHT';
  if (mode === 'open') await badge('Sedang bekerja', 'info', 'ab-play', th, row); else await badge('Belum absen', 'neutral', 'clock', th, row);
  gap(c, 12);
  await infoRow('clock', '08:00 – 17:00', th, c); gap(c, 6);
  await infoRow('pin', 'Kantor Pusat · radius 100 m', th, c);
  if (mode === 'open') {
    gap(c, 16);
    const st = box('attendance', { dir: 'H', pad: [12, 0, 12, 0], fill: 'color/background', radius: 12, theme: th, parent: c, fillW: true });
    await abStat('MASUK', '07:56', th, st); abVDiv(th, st);
    await abStat('PULANG', '--:--', th, st); abVDiv(th, st);
    await abStat('TERLAMBAT', o.late ? o.late + 'm' : '–', th, st, o.late ? 'color/warning' : null);
  }
  gap(c, 18);
  const b = mode === 'open' ? await abBtn('Clock Out', 'logout', 'warning', th, c) : await abBtn('Clock In', 'fingerprint', 'primary', th, c);
  return { c, b };
}

async function abSecondary(th, parent, label, name, time) {
  const r = box('SecondaryShiftRow', { dir: 'H', gap: 12, ay: 'CENTER', pad: 14, fill: 'color/surface', stroke: 'color/border', radius: 14, theme: th, parent, fillW: true });
  const ib = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', radius: 10, theme: th, parent: r, fixed: [38, 38] });
  icon('calendar', 18, 'color/primary', th, ib);
  const col = box('text', { dir: 'V', gap: 1, theme: th, parent: r }); abGrow(col);
  await txt(label, 'label', 'color/text/secondary', th, { parent: col }); await txt(name, 'body-strong', 'color/text/primary', th, { parent: col });
  await txt(time, 'caption', 'color/text/secondary', th, { parent: r });
}

async function abPending(th, parent) {
  const w = abWrap(th, parent, [0, 16, 12, 16], 'PendingBanner');
  const c = box('banner', { dir: 'H', gap: 10, ay: 'MIN', pad: 14, fill: 'color/primary-surface', radius: 14, theme: th, parent: w, fillW: true });
  icon('clipboard', 18, 'color/primary', th, c);
  const col = box('text', { dir: 'V', gap: 2, theme: th, parent: c }); abGrow(col);
  await txt('2 pengajuan menunggu approval', 'body-strong', 'color/primary', th, { parent: col, fillW: true });
  await txt('Koreksi Absensi 1 · Lembur 1', 'caption', 'color/primary', th, { parent: col, fillW: true });
  return c;
}
async function abMonth(th, parent, zero) {
  const w = abWrap(th, parent, [0, 16, 12, 16], 'MonthSummary');
  const c = box('card', { dir: 'V', pad: 16, fill: 'color/surface', stroke: 'color/border', radius: 14, theme: th, parent: w, fillW: true });
  await txt('NOVEMBER', 'label', 'color/text/secondary', th, { parent: c }); gap(c, 12);
  const r = box('stats', { dir: 'H', theme: th, parent: c, fillW: true });
  const items = zero ? [['check', '0', 'Hadir', 'color/success'], ['clock', '0', 'Terlambat', 'color/text/secondary'], ['ab-cancel', '0', 'Alpa', 'color/text/secondary'], ['umbrella', '0', 'Cuti', 'color/text/secondary']]
    : [['check', '15', 'Hadir', 'color/success'], ['clock', '2', 'Terlambat', 'color/warning'], ['ab-cancel', '0', 'Alpa', 'color/text/secondary'], ['umbrella', '1', 'Cuti', 'color/text/secondary']];
  for (const [i, [ic, v, l, col]] of items.entries()) {
    if (i) { const sp = box('sp', { dir: 'H', pad: [0, 4, 0, 4], theme: th, parent: r }); abVDiv(th, sp); }
    const s = box('Stat', { dir: 'V', gap: 0, theme: th, parent: r }); s.layoutGrow = 1; s.layoutSizingHorizontal = 'FILL';
    icon(ic, 15, col, th, s); gap(s, 4);
    await txt(v, 'h1', col, th, { parent: s, size: 20 }); await txt(l, 'caption', 'color/text/secondary', th, { parent: s });
  }
  if (!zero) { gap(c, 10); await txt('Total keterlambatan 25 menit.', 'caption', 'color/text/secondary', th, { parent: c }); }
}
async function abUpcoming(th, parent) {
  await (async () => { const w = abWrap(th, parent, [4, 16, 10, 16], 'label'); await txt('JADWAL BERIKUTNYA', 'label', 'color/text/secondary', th, { parent: w }); })();
  const row = box('upcoming scroll', { dir: 'H', gap: 10, pad: [0, 16, 0, 16], clip: true, theme: th, parent, fillW: true });
  for (const [i, [d, n, t]] of [['Hari ini, 24 Nov', 'Shift Pagi', '08:00–17:00'], ['Besok, 25 Nov', 'Shift Pagi', '08:00–17:00'], ['Kam, 26 Nov', 'Shift Pagi', '08:00–17:00']].entries()) {
    const next = i === 0; const accent = next ? 'color/primary' : 'color/text/secondary';
    const c = box('UpcomingShift', { dir: 'V', ax: 'SPACE_BETWEEN', pad: 12, fill: next ? 'color/primary-surface' : 'color/surface', stroke: next ? 'color/primary' : 'color/border', radius: 12, theme: th, parent: row, fixed: [128, 100] });
    const top = box('top', { dir: 'V', gap: 6, theme: th, parent: c });
    const hr = box('day', { dir: 'H', gap: 4, ay: 'CENTER', theme: th, parent: top }); icon('calendar', 12, accent, th, hr); await txt(d, 'label', accent, th, { parent: hr });
    await txt(n, 'body-strong', 'color/text/primary', th, { parent: top });
    await txt(t, 'caption', 'color/text/secondary', th, { parent: c });
  }
  gap(parent, 16);
}
async function abMenu(th, parent) {
  const lw = abWrap(th, parent, [4, 16, 10, 16], 'label'); await txt('LAINNYA', 'label', 'color/text/secondary', th, { parent: lw });
  const w = abWrap(th, parent, [0, 16, 0, 16], 'menu wrap');
  const m = box('Menu', { dir: 'V', fill: 'color/surface', stroke: 'color/border', radius: 14, theme: th, parent: w, fillW: true });
  const rows = [
    ['ab-history', 'Riwayat Absensi', 'Rekap kehadiran per bulan, dan ajukan koreksi kalau ada yang keliru', 'riwayat-absensi', true],
    ['swap', 'Tukar Shift', 'Tukar jadwal dengan rekan dan pantau statusnya', 'tukar-shift-hub', true],
    ['inbox', 'Pengajuan Koreksi', 'Status pengajuan yang sudah Anda kirim', 'koreksi-list', false],
    ['ab-more-time', 'Lembur', 'Laporkan lembur dan lihat jam setara bulan ini', 'lembur-list', false],
    ['clipboard', 'Daily Timesheet', 'Catat pekerjaan harian dan lihat aktivitas tim', 'timesheet-saya', false],
  ];
  for (const [ic, title, sub, target, div] of rows) {
    const r = box('MenuRow/' + title, { dir: 'H', gap: 12, ay: 'CENTER', pad: [14, 16, 14, 16], theme: th, parent: m, fillW: true });
    const ib = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', radius: 10, theme: th, parent: r, fixed: [36, 36] });
    icon(ic, 18, 'color/primary', th, ib);
    const col = box('text', { dir: 'V', gap: 1, theme: th, parent: r }); abGrow(col);
    await txt(title, 'body-strong', 'color/text/primary', th, { parent: col, fillW: true });
    await txt(sub, 'caption', 'color/text/secondary', th, { parent: col, fillW: true });
    icon('chevron', 20, 'color/text/disabled', th, r);
    link(r, target);
    if (div) abLine(th, m, 56);
  }
  gap(parent, 24);
}
async function abFaceBanner(th, parent, required) {
  const w = abWrap(th, parent, [0, 16, 16, 16], 'FaceEnrollBanner');
  const tone = required ? 'color/warning' : 'color/primary';
  const b = box('banner', { dir: 'H', gap: 12, ay: 'CENTER', pad: [12, 8, 12, 14], fill: required ? 'color/warning-surface' : 'color/primary-surface', radius: 14, theme: th, parent: w, fillW: true });
  icon('face', 22, tone, th, b);
  const col = box('text', { dir: 'V', gap: 2, theme: th, parent: b }); abGrow(col);
  await txt('Wajah belum terdaftar', 'body-strong', 'color/text/primary', th, { parent: col, fillW: true });
  await txt(required ? 'Wajib didaftarkan sebelum bisa absen.' : 'Daftarkan agar absensi tidak ditandai untuk ditinjau HR.', 'caption', 'color/text/secondary', th, { parent: col, fillW: true });
  const tb = box('Daftarkan', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [0, 12, 0, 12], theme: th, parent: b, fixed: [96, 44] });
  await txt('Daftarkan', 'body-strong', tone, th, { parent: tb });
  return { b, tb };
}

/** mode: upcoming | open | none | error. o: face (banner wajah), time, greeting, others, h. */
async function abHome(th, mode, o = {}) {
  const { f, body } = await phone('x', th, '', { noAppBar: true, h: o.h ?? 1500, pad: 0 });
  const sb = f.findOne((n) => n.name === 'status bar'); sb.fills = [pv(th, 'color/primary')];
  for (const t of sb.findAll((n) => n.type === 'TEXT')) t.fills = [pv(th, 'white')];
  await abHeader(th, body, { greeting: o.greeting ?? 'Selamat pagi', time: o.time ?? '07:42' });
  const cw = abWrap(th, body, [16, 16, 16, 16], 'card slot');
  let btn = null, retry = null;
  if (mode === 'upcoming' || mode === 'open') ({ b: btn } = await abShiftCard(th, cw, mode, { late: o.late }));
  else {
    const c = box(mode === 'none' ? 'NoShiftCard' : 'ErrorCard', { dir: 'V', pad: [12, 0, 12, 0], fill: 'color/surface', stroke: 'color/border', radius: 18, theme: th, parent: cw, fillW: true });
    if (mode === 'none') await emptyState('ab-event-busy', 'Tidak ada jadwal', 'Anda tidak punya shift kemarin, hari ini, atau besok. Kalau seharusnya ada, hubungi HR untuk memeriksa roster.', th, c);
    else { const e = await emptyState('ab-cloudoff', 'Gagal memuat', 'Tidak bisa menghubungi server. Periksa koneksi internet Anda.', th, c, 'danger'); retry = e.findOne((n) => n.name === 'retry'); }
  }
  let banner = null;
  if (o.face) banner = await abFaceBanner(th, body, false);
  if (o.others) {
    const lw = abWrap(th, body, [0, 16, 10, 16], 'label'); await txt('SHIFT LAINNYA', 'label', 'color/text/secondary', th, { parent: lw });
    const rw = abWrap(th, body, [0, 16, 18, 16], 'others'); await abSecondary(th, rw, 'BESOK', 'Shift Pagi', '08:00 – 17:00');
  }
  await abPending(th, body); await abMonth(th, body, false); await abUpcoming(th, body);
  await abMenu(th, body);
  await bottomNav(th, f, 0);
  if (btn) link(btn, o.btnTarget ?? 'face-scan');
  if (retry) link(retry, 'absensi-home');
  if (banner) link(banner.tb, 'face-enroll');
  return f;
}

registerScreen({ key: 'absensi-home', group: AB_GROUP, title: 'Beranda (belum absen)', build: (th) => abHome(th, 'upcoming', {}) });
registerScreen({ key: 'absensi-sudah-masuk', group: AB_GROUP, title: 'Beranda (sudah masuk)', build: (th) => abHome(th, 'open', { greeting: 'Selamat siang', time: '12:30', others: true, h: 1580 }) });
registerScreen({ key: 'absensi-libur', group: AB_GROUP, title: 'Kondisi: tanpa jadwal', build: (th) => abHome(th, 'none', { h: 1440 }) });
registerScreen({ key: 'absensi-error', group: AB_GROUP, title: 'Kondisi: error', build: (th) => abHome(th, 'error', { h: 1440 }) });
registerScreen({ key: 'absensi-wajah-belum', group: AB_GROUP, title: 'Beranda (wajah belum terdaftar)', build: (th) => abHome(th, 'upcoming', { face: true, h: 1580, btnTarget: 'absensi-dialog-wajah' }) });
registerScreen({ key: 'absensi-dialog-wajah', group: AB_GROUP, title: 'Dialog: daftarkan wajah dulu', build: async (th) => {
  const f = await abHome(th, 'upcoming', { face: true, h: 800, btnTarget: 'face-scan' });
  abScrim(th, f, 0, 0.54);
  const d = box('Dialog', { dir: 'V', pad: [24, 24, 16, 24], fill: 'color/surface', radius: 16, theme: th, parent: f });
  d.resize(312, 100); d.layoutSizingVertical = 'HUG'; d.layoutPositioning = 'ABSOLUTE'; d.x = 24; d.y = 190;
  const ic = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', radius: 999, theme: th, parent: d, fixed: [56, 56] });
  icon('face', 28, 'color/primary', th, ic); ic.layoutSizingHorizontal = 'FIXED';
  d.counterAxisAlignItems = 'CENTER';
  gap(d, 16);
  await txt('Daftarkan wajah dulu', 'h2', 'color/text/primary', th, { parent: d, fillW: true, align: 'CENTER' }); gap(d, 8);
  await txt('Perusahaan Anda memakai verifikasi wajah untuk absensi, dan wajah Anda belum terdaftar. Anda tetap bisa absen tanpa wajah, tapi absensinya akan ditandai untuk ditinjau HR.', 'body', 'color/text/secondary', th, { parent: d, fillW: true, align: 'CENTER' });
  gap(d, 20);
  const enr = await abBtn('Daftarkan Sekarang', 'camera', 'primary', th, d, { h: 52 });
  gap(d, 4);
  const skip = box('Absen Tanpa Wajah', { dir: 'H', ax: 'CENTER', ay: 'CENTER', theme: th, parent: d, fixed: [264, 44] }); skip.layoutSizingHorizontal = 'FILL';
  await txt('Absen Tanpa Wajah', 'body-strong', 'color/text/secondary', th, { parent: skip });
  link(enr, 'face-enroll'); link(skip, 'absensi-sudah-masuk');
  return f;
} });

/* ---------- Riwayat Absensi (attendance_history_page.dart) ---------- */
async function abDay(th, parent, r) {
  const c = box('DayTile', { dir: 'H', gap: 12, ay: 'CENTER', pad: 14, fill: 'color/surface', stroke: 'color/border', radius: 14, theme: th, parent, fillW: true });
  const kinds = {
    present: ['Hadir', 'color/success', 'check'], late: ['Hadir, terlambat', 'color/warning', 'check'], incomplete: ['Tidak clock out', 'color/warning', 'alert'],
    absent: ['Tidak absen', 'color/danger', 'ab-cancel'], leave: ['Cuti Tahunan', 'color/info', 'umbrella'], pending: ['Belum berakhir', 'color/text/disabled', 'clock'],
  };
  const [label, color, ic] = kinds[r.st];
  icon(ic, 22, color, th, c);
  const col = box('text', { dir: 'V', theme: th, parent: c }); abGrow(col);
  const l1 = box('date', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: col });
  await txt(r.date, 'body-strong', 'color/text/primary', th, { parent: l1 }); await txt('Shift Pagi', 'caption', 'color/text/secondary', th, { parent: l1 });
  gap(col, 2); await txt(label, 'body-strong', color, th, { parent: col, size: 12 });
  if (r.late) { gap(col, 2); await txt(`Terlambat ${r.late} menit`, 'label', 'color/warning', th, { parent: col }); }
  if (r.review) { gap(col, 2); await txt('Ditandai untuk ditinjau HR', 'label', 'color/text/secondary', th, { parent: col }); }
  const links = [];
  for (const [show, ic2, t, target] of [[r.fix, 'ab-edit-note', 'Ajukan Koreksi', 'koreksi-form'], [r.swap, 'swap', 'Tukar Shift', 'tukar-shift']]) {
    if (!show) continue;
    gap(col, 8);
    const b = box('TextButton/' + t, { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: col, fixed: [140, 32] });
    b.layoutSizingHorizontal = 'HUG'; icon(ic2, 18, 'color/primary', th, b); await txt(t, 'body-strong', 'color/primary', th, { parent: b });
    links.push([b, target]);
  }
  const tm = box('times', { dir: 'V', ay: 'MAX', theme: th, parent: c });
  await txt(r.in, 'body', 'color/text/primary', th, { parent: tm }); await txt(r.out, 'caption', 'color/text/secondary', th, { parent: tm });
  for (const [b, t] of links) link(b, t);
  return c;
}
async function abRiwayat(th, mode) {
  const { f, body } = await phone('x', th, 'Riwayat Absensi', { actions: ['inbox'], h: mode === 'list' ? 1180 : 800, pad: 0 });
  const sw = box('MonthSwitcher', { dir: 'H', ax: 'SPACE_BETWEEN', ay: 'CENTER', pad: [4, 8, 4, 8], fill: 'color/surface', theme: th, parent: body, fillW: true });
  const prev = box('prev', { dir: 'H', ax: 'CENTER', ay: 'CENTER', theme: th, parent: sw, fixed: [48, 48] }); icon('ab-chevron-left', 24, 'color/text/primary', th, prev);
  if (mode !== 'error') {
    await txt('November 2026', 'h2', 'color/text/primary', th, { parent: sw });
    const nx = box('next', { dir: 'H', ax: 'CENTER', ay: 'CENTER', theme: th, parent: sw, fixed: [48, 48] }); icon('chevron', 24, 'color/text/disabled', th, nx);
  }
  if (mode === 'error') {
    sw.remove();
    const c = box('centered', { dir: 'V', gap: 0, ax: 'CENTER', ay: 'CENTER', pad: 32, theme: th, parent: body, fillW: true }); c.layoutGrow = 1; c.layoutSizingVertical = 'FILL';
    icon('ab-cloudoff', 56, 'color/text/disabled', th, c); gap(c, 16);
    await txt('Tidak bisa menghubungi server. Periksa koneksi internet Anda.', 'body', 'color/text/primary', th, { parent: c, fillW: true, align: 'CENTER' }); gap(c, 20);
    const rb = await abBtn('Coba Lagi', 'ab-refresh', 'primary', th, c, { h: 52 }); link(rb, 'riwayat-absensi');
    link(f.findOne((n) => n.name === 'icon/inbox'), 'koreksi-list'); abBack(f, 'absensi-home');
    return f;
  }
  const empty = mode === 'empty';
  const sbar = box('SummaryBar', { dir: 'H', pad: [0, 16, 16, 16], fill: 'color/surface', theme: th, parent: body, fillW: true });
  const items = empty ? [['0', 'Hadir', 'color/success', null], ['0', 'Terlambat', 'color/warning', null], ['0', 'Tidak absen', null, null], ['0', 'Cuti', null, null]]
    : [['15', 'Hadir', 'color/success', null], ['2', 'Terlambat', 'color/warning', '25 mnt'], ['1', 'Tidak absen', 'color/danger', null], ['1', 'Cuti', null, null]];
  for (const [v, l, col, cap] of items) {
    const it = box('SummaryItem', { dir: 'V', ay: 'CENTER', theme: th, parent: sbar }); it.layoutGrow = 1; it.layoutSizingHorizontal = 'FILL';
    await txt(v, 'h1', col || 'color/text/primary', th, { parent: it }); await txt(l, 'label', 'color/text/secondary', th, { parent: it });
    if (cap) await txt(cap, 'label', col, th, { parent: it });
  }
  if (empty) {
    const c = box('EmptyMonth', { dir: 'V', gap: 0, ay: 'CENTER', pad: 32, theme: th, parent: body, fillW: true });
    c.paddingTop = 120;
    icon('ab-event-busy', 56, 'color/text/disabled', th, c); gap(c, 16);
    await txt('Tidak ada jadwal di November 2026', 'body-strong', 'color/text/primary', th, { parent: c, fillW: true, align: 'CENTER' }); gap(c, 8);
    await txt('Anda tidak punya shift yang dijadwalkan di bulan ini. Kalau seharusnya ada, hubungi HR untuk memeriksa roster.', 'caption', 'color/text/secondary', th, { parent: c, fillW: true, align: 'CENTER' });
  } else {
    const list = box('list', { dir: 'V', gap: 8, pad: 16, theme: th, parent: body, fillW: true });
    const rows = [
      { date: 'Rab, 25 Nov', st: 'pending', in: '--:--', out: '--:--', swap: true },
      { date: 'Sel, 24 Nov', st: 'pending', in: '07:56', out: '--:--' },
      { date: 'Sen, 23 Nov', st: 'present', in: '07:55', out: '17:03' },
      { date: 'Sab, 21 Nov', st: 'late', late: 12, in: '08:12', out: '17:00' },
      { date: 'Jum, 20 Nov', st: 'incomplete', in: '07:58', out: '--:--', fix: true },
      { date: 'Kam, 19 Nov', st: 'absent', in: '--:--', out: '--:--', fix: true, review: true },
      { date: 'Rab, 18 Nov', st: 'leave', in: '--:--', out: '--:--' },
    ];
    for (const r of rows) await abDay(th, list, r);
  }
  link(f.findOne((n) => n.name === 'icon/inbox'), 'koreksi-list'); abBack(f, 'absensi-home');
  return f;
}
registerScreen({ key: 'riwayat-absensi', group: AB_GROUP, title: 'Riwayat Absensi', build: (th) => abRiwayat(th, 'list') });
registerScreen({ key: 'riwayat-kosong', group: AB_GROUP, title: 'Riwayat: bulan kosong', build: (th) => abRiwayat(th, 'empty') });
registerScreen({ key: 'riwayat-error', group: AB_GROUP, title: 'Riwayat: error', build: (th) => abRiwayat(th, 'error') });

/* ---------- Pengajuan Koreksi: daftar (attendance_request_list_page.dart) ---------- */
async function abDecision(th, parent, tone, ic, title, bodyText, footer) {
  const [bg, fg] = TONES[tone];
  const d = box('DecisionBox', { dir: 'V', gap: 6, pad: 12, fill: bg, radius: 10, theme: th, parent, fillW: true });
  const h = box('head', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: d }); icon(ic, 15, fg, th, h); await txt(title, 'label', fg, th, { parent: h });
  await txt(bodyText, 'body', fg, th, { parent: d, fillW: true });
  if (footer) await txt(footer, 'label', fg, th, { parent: d });
}
async function abReq(th, parent, r) {
  const c = card(th, parent, { name: 'RequestTile', pad: 16 });
  const top = box('top', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c, fillW: true });
  const t = await txt(r.date, 'body-strong', 'color/text/primary', th, { parent: top }); abGrow(t); t.textAutoResize = 'HEIGHT';
  const bd = { pending: ['Menunggu', 'warning', 'ab-hourglass'], approved: ['Disetujui', 'success', 'check'], rejected: ['Ditolak', 'danger', 'ab-cancel'], cancelled: ['Dibatalkan', 'neutral', 'ab-block'] }[r.st];
  await badge(bd[0], bd[1], bd[2], th, top);
  gap(c, 8); await txt(r.type, 'body', 'color/text/primary', th, { parent: c, fillW: true });
  if (r.times) { gap(c, 4); await txt(r.times, 'caption', 'color/text/secondary', th, { parent: c, fillW: true }); }
  if (r.reason) { gap(c, 8); const b = box('reason', { dir: 'V', pad: 10, fill: 'color/background', radius: 8, theme: th, parent: c, fillW: true }); await txt(r.reason, 'caption', 'color/text/secondary', th, { parent: b, fillW: true }); }
  if (r.st === 'rejected') { gap(c, 10); await abDecision(th, c, 'danger', 'info', 'Alasan penolakan', r.note, 'Ditolak oleh Hendra Wijaya'); }
  if (r.st === 'approved' && r.note) { gap(c, 10); await abDecision(th, c, 'success', 'check', 'Catatan penyetuju', r.note, 'Disetujui oleh Siti Rahma'); }
  if (r.st === 'pending') { gap(c, 10); await txt('Menunggu keputusan atasan Anda. Absensi belum berubah sampai HR ikut menyetujui.', 'caption', 'color/text/secondary', th, { parent: c, fillW: true }); }
  return c;
}
registerScreen({ key: 'koreksi-list', group: AB_GROUP, title: 'Pengajuan Koreksi', build: async (th) => {
  const { f, body } = await phone('x', th, 'Pengajuan Koreksi', { h: 1280, gap: 10, pad: [16, 16, 16, 16] });
  await abReq(th, body, { date: 'Kam, 19 Nov 2026', st: 'pending', type: 'Lupa clock in', times: 'Masuk 08:00  ·  Pulang 17:00', reason: 'HP mati saat sampai kantor, dan baru bisa dicas siang.' });
  await abReq(th, body, { date: 'Rab, 18 Nov 2026', st: 'approved', type: 'Lupa clock out', times: 'Pulang 17:00', reason: 'Lupa absen pulang karena langsung rapat dengan klien.', note: 'Sudah dikonfirmasi dengan klien.' });
  await abReq(th, body, { date: 'Sel, 17 Nov 2026', st: 'rejected', type: 'Kerja dari rumah', times: 'Masuk 08:00', reason: 'Bekerja dari rumah karena sakit.', note: 'Tidak ada pengajuan WFH sebelumnya.' });
  await abReq(th, body, { date: 'Sen, 16 Nov 2026', st: 'cancelled', type: 'Dinas luar kota', times: 'Masuk 08:00  ·  Pulang 17:00' });
  abBack(f, 'absensi-home');
  return f;
} });
for (const [key, title, ic, t, m, tone] of [
  ['koreksi-kosong', 'Pengajuan Koreksi: kosong', 'inbox', 'Belum ada pengajuan', 'Buka tab Riwayat, lalu ketuk Ajukan Koreksi di hari yang absensinya perlu diperbaiki.', null],
  ['koreksi-error', 'Pengajuan Koreksi: error', 'ab-cloudoff', 'Gagal memuat', 'Tidak bisa menghubungi server. Periksa koneksi internet Anda.', 'danger'],
]) {
  registerScreen({ key, group: AB_GROUP, title, build: async (th) => {
    const { f, body } = await phone('x', th, 'Pengajuan Koreksi');
    await emptyState(ic, t, m, th, body, tone);
    abBack(f, 'absensi-home');
    return f;
  } });
}

/* ---------- Pengajuan Koreksi: form (attendance_request_form_page.dart) ---------- */
async function abOutField(th, parent, label, value, ic) {
  const b = box('TimeField', { dir: 'H', gap: 10, ay: 'CENTER', pad: [10, 14, 10, 14], fill: 'color/surface', stroke: 'color/border', radius: 12, theme: th, parent, fillW: true });
  const col = box('text', { dir: 'V', gap: 1, theme: th, parent: b }); abGrow(col);
  await txt(label, 'caption', 'color/text/secondary', th, { parent: col, size: 12 });
  await txt(value, 'body-strong', 'color/text/primary', th, { parent: col });
  icon(ic, 20, 'color/text/secondary', th, b);
}
async function abTypeCard(th, parent, label, desc, selected) {
  const c = box('TypeCard/' + label, { dir: 'H', gap: 12, ay: 'MIN', pad: 14, fill: selected ? 'color/primary-surface' : 'color/surface', stroke: selected ? 'color/primary' : 'color/border', sw: selected ? 1.6 : 1, radius: 12, theme: th, parent, fillW: true });
  icon(selected ? 'ab-radio-on' : 'radio', 20, selected ? 'color/primary' : 'color/text/disabled', th, c);
  const col = box('text', { dir: 'V', gap: 2, theme: th, parent: c }); abGrow(col);
  await txt(label, 'body-strong', selected ? 'color/primary' : 'color/text/primary', th, { parent: col, fillW: true });
  await txt(desc, 'caption', 'color/text/secondary', th, { parent: col, fillW: true });
}
/** o.out: hanya lupa clock out (sudah ada catatan masuk); o.selfie; o.error. */
async function abKoreksiForm(th, o) {
  const { f, body } = await phone('x', th, 'Ajukan Koreksi', { h: o.out ? 1400 : 1560, pad: [16, 16, 16, 16] });
  const hd = box('ShiftHeader', { dir: 'V', gap: 4, pad: 16, fill: 'color/primary-surface', radius: 14, theme: th, parent: body, fillW: true });
  await txt('SHIFT YANG DIKOREKSI', 'label', 'color/text/secondary', th, { parent: hd }); gap(hd, 2);
  await txt('Kamis, 19 November 2026', 'body-strong', 'color/text/primary', th, { parent: hd, fillW: true });
  await txt('Shift Pagi · 08:00 – 17:00', 'body', 'color/text/primary', th, { parent: hd, fillW: true });
  gap(hd, 4);
  await txt(o.out ? 'Tercatat masuk 07:58, belum ada catatan pulang' : 'Tidak ada catatan absensi untuk shift ini', 'caption', 'color/text/secondary', th, { parent: hd, fillW: true });
  gap(body, 20); await txt('JENIS PENGAJUAN', 'label', 'color/text/secondary', th, { parent: body }); gap(body, 10);
  const types = box('types', { dir: 'V', gap: 8, theme: th, parent: body, fillW: true });
  if (o.out) await abTypeCard(th, types, 'Lupa clock out', 'Anda sudah absen masuk tapi lupa absen pulang.', true);
  else {
    await abTypeCard(th, types, 'Lupa clock in', 'Anda bekerja tapi tidak sempat absen masuk lewat aplikasi.', true);
    await abTypeCard(th, types, 'Kerja dari rumah', 'Anda bekerja dari rumah, jadi tidak bisa absen di radius kantor.', false);
    await abTypeCard(th, types, 'Dinas luar kota', 'Anda bertugas di luar kota, jadi tidak bisa absen di radius kantor.', false);
  }
  if (o.out) { gap(body, 12); await txt('Catatan absen masuk untuk shift ini sudah ada, jadi yang bisa diajukan hanya jam pulangnya. Kalau jam masuknya yang salah, minta HR mengoreksinya langsung.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true }); }
  gap(body, 16); abLine(th, body); gap(body, 16);
  if (!o.out) { await abOutField(th, body, 'Jam masuk sebenarnya', '08:00', 'clock'); gap(body, 12); }
  await abOutField(th, body, o.out ? 'Jam pulang sebenarnya' : 'Jam pulang (opsional)', '17:00', 'clock');
  gap(body, 8); await txt('Sudah diisi sesuai jadwal shift. Ubah kalau jam sebenarnya berbeda.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true });
  gap(body, 16); abLine(th, body); gap(body, 16);
  const rs = box('reason', { dir: 'V', gap: 4, pad: [10, 14, 10, 14], fill: 'color/surface', stroke: 'color/border', radius: 12, theme: th, parent: body, fillW: true });
  await txt('Alasan', 'caption', 'color/text/secondary', th, { parent: rs, size: 12 });
  await txt('mis. HP mati saat sampai kantor, dan baru bisa dicas siang', 'body', 'color/text/disabled', th, { parent: rs, fillW: true }); gap(rs, 40);
  const cnt = box('counter', { dir: 'H', ax: 'MAX', pad: [4, 12, 0, 12], theme: th, parent: body, fillW: true }); await txt('0/500', 'caption', 'color/text/secondary', th, { parent: cnt });
  gap(body, 8);
  if (o.selfie) {
    const img = box('Selfie', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/border', radius: 12, theme: th, parent: body, fixed: [328, 200] }); img.layoutSizingHorizontal = 'FILL';
    icon('person', 72, 'color/text/disabled', th, img); gap(body, 8);
    const rt = box('Ambil Ulang', { dir: 'H', gap: 8, ax: 'CENTER', ay: 'CENTER', stroke: 'color/border', radius: 12, theme: th, parent: body, fixed: [328, 48] }); rt.layoutSizingHorizontal = 'FILL';
    icon('ab-refresh', 20, 'color/primary', th, rt); await txt('Ambil Ulang', 'body-strong', 'color/primary', th, { parent: rt });
  } else {
    const sf = box('Ambil Swafoto', { dir: 'H', gap: 8, ax: 'CENTER', ay: 'CENTER', stroke: 'color/border', radius: 12, theme: th, parent: body, fixed: [328, 52] }); sf.layoutSizingHorizontal = 'FILL';
    icon('camera', 20, 'color/primary', th, sf); await txt('Ambil Swafoto', 'body-strong', 'color/primary', th, { parent: sf });
  }
  gap(body, 24);
  const send = await abBtn('Kirim Pengajuan', null, 'primary', th, body, { disabled: !o.selfie, h: 52 });
  if (!o.selfie) { gap(body, 8); await txt('Swafoto wajib dilampirkan sebelum bisa dikirim.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true, align: 'CENTER' }); }
  gap(body, 16); await txt('Pengajuan diteruskan ke atasan langsung Anda, lalu ke HR. Absensi baru berubah setelah keduanya menyetujui.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true, align: 'CENTER' });
  if (o.error) await abSnack(th, f, o.error, 'danger');
  if (o.selfie && !o.error) link(send, 'koreksi-list');
  abBack(f, 'riwayat-absensi');
  return f;
}
registerScreen({ key: 'koreksi-form', group: AB_GROUP, title: 'Ajukan Koreksi (lupa clock in)', build: (th) => abKoreksiForm(th, {}) });
registerScreen({ key: 'koreksi-form-lupa-pulang', group: AB_GROUP, title: 'Ajukan Koreksi (lupa clock out)', build: (th) => abKoreksiForm(th, { out: true, selfie: true }) });
registerScreen({ key: 'koreksi-form-galat', group: AB_GROUP, title: 'Ajukan Koreksi: galat validasi', build: (th) => abKoreksiForm(th, { selfie: true, error: 'Alasan wajib diisi.' }) });

/* ---------- Pendaftaran wajah (face_enroll_page.dart) ---------- */
async function abCheck(th, parent, checked) {
  const r = box('CheckboxListTile', { dir: 'H', gap: 12, ay: 'CENTER', pad: [8, 0, 8, 0], theme: th, parent, fillW: true });
  const cb = box('checkbox', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: checked ? 'color/primary' : null, stroke: checked ? 'color/primary' : 'color/text/secondary', sw: 2, radius: 3, theme: th, parent: r, fixed: [18, 18] });
  if (checked) icon('ab-tick', 14, 'white', th, cb);
  await txt('Saya membaca penjelasan di atas dan setuju data wajah saya disimpan untuk verifikasi absensi.', 'body', 'color/text/primary', th, { parent: r, fillW: true });
}
/** o: status (none|enrolled|reenroll), required, consent, busy. */
async function abEnroll(th, o) {
  const { f, body } = await phone('x', th, 'Daftarkan Wajah', { h: 1260, pad: [16, 16, 16, 16] });
  if (o.status === 'reenroll') {
    const c = box('StatusCard', { dir: 'H', gap: 10, ay: 'MIN', pad: 16, fill: 'color/warning-surface', radius: 14, theme: th, parent: body, fillW: true });
    icon('ab-refresh', 18, 'color/warning', th, c);
    const col = box('text', { dir: 'V', gap: 4, theme: th, parent: c }); abGrow(col);
    await txt('Perlu didaftarkan ulang', 'body-strong', 'color/warning', th, { parent: col, fillW: true });
    await txt('Aplikasi sudah diperbarui, dan data wajah lama tidak bisa dipakai lagi. Daftarkan ulang supaya absensi Anda tidak selalu ditandai.', 'caption', 'color/warning', th, { parent: col, fillW: true });
  } else {
    const en = o.status === 'enrolled';
    const c = box('StatusCard', { dir: 'H', gap: 10, ay: 'CENTER', pad: 16, fill: en ? 'color/success-surface' : 'color/background', stroke: en ? null : 'color/border', radius: 14, theme: th, parent: body, fillW: true });
    icon(en ? 'verified' : 'face', 18, en ? 'color/success' : 'color/text/secondary', th, c);
    const col = box('text', { dir: 'V', gap: 2, theme: th, parent: c }); abGrow(col);
    await txt(en ? 'Wajah sudah terdaftar' : 'Wajah belum terdaftar', 'body-strong', en ? 'color/success' : 'color/text/primary', th, { parent: col, fillW: true });
    if (en) await txt('Didaftarkan 12 Nov 2026', 'caption', 'color/success', th, { parent: col, fillW: true });
    if (!en && o.required) { gap(col, 2); await txt('Perusahaan Anda mewajibkan verifikasi wajah. Absensi belum bisa dilakukan sebelum wajah didaftarkan.', 'caption', 'color/text/secondary', th, { parent: col, fillW: true }); }
  }
  gap(body, 20); await txt('YANG DISIMPAN', 'label', 'color/text/secondary', th, { parent: body }); gap(body, 10);
  for (const [ic, t] of [
    ['ab-calc', 'Yang disimpan bukan foto, melainkan deret angka hasil perhitungan bentuk wajah Anda. Angka itu tidak bisa dibalik menjadi foto.'],
    ['ab-phone', 'Fotonya diproses di HP ini lalu dihapus. Foto tidak pernah dikirim ke server dan tidak disimpan di mana pun.'],
    ['clipboard', 'Angka itu dipakai memastikan yang absen memang Anda, bukan rekan yang memegang HP Anda.'],
    ['gavel', 'Data wajah termasuk data pribadi spesifik menurut UU Perlindungan Data Pribadi. Anda berhak menolak, dan absensi tetap bisa dilakukan tanpa ini.'],
  ]) {
    const r = box('Point', { dir: 'H', gap: 12, ay: 'MIN', pad: [0, 0, 14, 0], theme: th, parent: body, fillW: true });
    icon(ic, 18, 'color/primary', th, r); await txt(t, 'body', 'color/text/primary', th, { parent: r, fillW: true });
  }
  gap(body, 8); abLine(th, body);
  await abCheck(th, body, o.consent);
  gap(body, 8); await txt('AGAR PENCOCOKAN BERHASIL', 'label', 'color/text/secondary', th, { parent: body }); gap(body, 8);
  await txt('Wajah menghadap kamera, cahaya rata, tanpa masker atau kacamata gelap. Ambil di tempat yang mirip dengan tempat Anda biasa absen — wajah yang didaftarkan di ruang terang lalu diperiksa di parkiran gelap lebih sering gagal.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true });
  gap(body, 20);
  const label = o.busy ? 'Memeriksa wajah...' : o.status === 'enrolled' ? 'Daftarkan Ulang' : 'Ambil Foto Wajah';
  const btn = await abBtn(label, o.busy ? null : 'camera', 'primary', th, body, { disabled: o.busy || !o.consent, h: 50 });
  if (!o.consent) { gap(body, 8); await txt('Centang persetujuan di atas untuk melanjutkan.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true, align: 'CENTER' }); }
  if (o.busy) abScrim(th, f, 84, 0.2);
  if (o.consent && !o.busy) link(btn, 'face-scan-daftar');
  abBack(f, 'absensi-home');
  return f;
}
registerScreen({ key: 'face-enroll', group: AB_GROUP, title: 'Daftarkan Wajah', build: (th) => abEnroll(th, { status: 'none', required: true, consent: false }) });
registerScreen({ key: 'face-enroll-setuju', group: AB_GROUP, title: 'Daftarkan Wajah: sudah terdaftar, setuju', build: (th) => abEnroll(th, { status: 'enrolled', consent: true }) });
registerScreen({ key: 'face-enroll-ulang', group: AB_GROUP, title: 'Daftarkan Wajah: perlu ulang', build: (th) => abEnroll(th, { status: 'reenroll', consent: true }) });
registerScreen({ key: 'face-enroll-proses', group: AB_GROUP, title: 'Daftarkan Wajah: memproses', build: (th) => abEnroll(th, { status: 'none', consent: true, busy: true }) });

/* ---------- Pemindaian wajah (face_scan_page.dart) ---------- */
/** o: title, text, ic, tone (idle|adjust|ready), spinner, done, back (layar tujuan tombol tutup / hasil). */
async function abScan(th, o) {
  const { f, body } = await phone('x', th, '', { noAppBar: true, pad: 0 });
  f.fills = [AB_BLACK];
  for (const n of f.children) if (n.name === 'status bar' || n.name === 'system nav') n.fills = [];
  for (const t of f.findAll((n) => n.type === 'TEXT')) t.fills = [pv(th, 'white')];
  const ring = { idle: 'white', adjust: 'color/warning', ready: 'color/success' }[o.tone];
  // Bingkai oval (kamera = kotak gelap + wajah samar)
  const oval = box('oval frame', { dir: 'H', ax: 'CENTER', ay: 'CENTER', stroke: ring, sw: 3, radius: 130, theme: th, parent: f, fixed: [260, 340] });
  oval.fills = [{ type: 'SOLID', color: { r: 0.23, g: 0.25, b: 0.29 } }]; oval.layoutPositioning = 'ABSOLUTE'; oval.x = 50; oval.y = 230;
  const face = icon('person', 150, 'white', th, oval); face.opacity = 0.25;
  if (o.done) {
    const ok = box('check', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/success', radius: 999, theme: th, parent: f, fixed: [96, 96] });
    ok.layoutPositioning = 'ABSOLUTE'; ok.x = 132; ok.y = 352; icon('ab-tick', 56, 'white', th, ok);
  }
  // Atas: tutup + judul; bawah: pil petunjuk
  body.primaryAxisAlignItems = 'SPACE_BETWEEN';
  const top = box('top', { dir: 'H', ay: 'CENTER', pad: 8, theme: th, parent: body, fillW: true });
  const cl = box('icon/close', { dir: 'H', ax: 'CENTER', ay: 'CENTER', theme: th, parent: top, fixed: [48, 48] }); icon('x', 24, 'white', th, cl);
  const ti = await txt(o.title, 'body-strong', 'white', th, { parent: top, align: 'CENTER' }); abGrow(ti); ti.textAutoResize = 'HEIGHT';
  box('spacer', { dir: 'H', theme: th, parent: top, fixed: [48, 48] });
  const bw = box('bottom', { dir: 'V', ay: 'CENTER', pad: 20, theme: th, parent: body, fillW: true });
  const pill = box('GuidancePill', { dir: 'H', gap: o.ic || o.spinner ? 10 : 0, ay: 'CENTER', pad: [14, 20, 14, 20], fill: o.tone === 'ready' ? 'color/success' : null, radius: 14, theme: th, parent: bw });
  if (o.tone !== 'ready') pill.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.6 }];
  if (o.spinner) icon('ab-refresh', 20, 'white', th, pill);
  else if (o.ic) icon(o.ic, 20, o.tone === 'adjust' ? 'color/warning' : 'white', th, pill);
  await txt(o.text, 'body', 'white', th, { parent: pill });
  link(cl, o.back ?? 'absensi-home', 'back');
  if (o.next) link(pill, o.next);
  return f;
}
const AB_SCAN = [
  ['face-scan', 'Pindai wajah (mencari)', { title: 'Verifikasi Wajah', text: 'Posisikan wajah di dalam bingkai', ic: 'face', tone: 'idle', next: 'absensi-sudah-masuk' }],
  ['face-scan-dekat', 'Pindai wajah: terlalu jauh', { title: 'Verifikasi Wajah', text: 'Dekatkan wajah ke kamera', ic: 'ab-zoomin', tone: 'adjust' }],
  ['face-scan-geser', 'Pindai wajah: geser', { title: 'Verifikasi Wajah', text: 'Geser ke kiri', ic: 'back', tone: 'adjust' }],
  ['face-scan-banyak', 'Pindai wajah: lebih dari satu wajah', { title: 'Verifikasi Wajah', text: 'Pastikan hanya Anda di dalam bingkai', ic: 'ab-groupoff', tone: 'adjust' }],
  ['face-scan-mata', 'Pindai wajah: mata tertutup', { title: 'Verifikasi Wajah', text: 'Buka mata', ic: 'eye', tone: 'adjust' }],
  ['face-scan-tahan', 'Pindai wajah: tahan', { title: 'Verifikasi Wajah', text: 'Tahan sebentar...', ic: 'check', tone: 'ready' }],
  ['face-scan-ambil', 'Pindai wajah: mengambil foto', { title: 'Verifikasi Wajah', text: 'Mengambil foto', spinner: true, tone: 'ready' }],
  ['face-scan-ulang', 'Pindai wajah: mengambil ulang', { title: 'Verifikasi Wajah', text: 'Tahan sebentar, mengambil ulang...', ic: 'ab-refresh', tone: 'adjust' }],
  ['face-scan-berhasil', 'Pindai wajah: berhasil', { title: 'Verifikasi Wajah', text: 'Berhasil', ic: 'ab-tick', tone: 'ready', done: true, next: 'absensi-sudah-masuk' }],
  ['face-scan-daftar', 'Pindai wajah (pendaftaran)', { title: 'Daftarkan Wajah', text: 'Posisikan wajah di dalam bingkai', ic: 'face', tone: 'idle', back: 'face-enroll', next: 'face-enroll-proses' }],
];
for (const [key, title, o] of AB_SCAN) registerScreen({ key, group: AB_GROUP, title, build: (th) => abScan(th, o) });
registerScreen({ key: 'face-scan-galat', group: AB_GROUP, title: 'Pindai wajah: kamera gagal', build: async (th) => {
  const { f, body } = await phone('x', th, 'Verifikasi Wajah', { pad: 24 });
  body.primaryAxisAlignItems = 'CENTER'; body.counterAxisAlignItems = 'CENTER';
  icon('ab-videooff', 44, 'color/text/disabled', th, body); gap(body, 16);
  await txt('Kamera tidak bisa dibuka. Periksa izinnya di pengaturan HP.', 'body', 'color/text/primary', th, { parent: body, fillW: true, align: 'CENTER' }); gap(body, 20);
  const rb = await abBtn('Coba Lagi', null, 'primary', th, body, { h: 52 });
  link(rb, 'face-scan'); abBack(f, 'absensi-home');
  return f;
} });

flowStart('absensi-home', 'Absensi harian');
