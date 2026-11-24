/* Persetujuan (features/approval) + Tukar Shift (features/shift-swap) */
const PJ_APR = 'Persetujuan';
const PJ_SWAP = 'Tukar Shift';

registerIcons({
  'pj-refresh': '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
  'pj-doneall': '<path d="M2 12.5l4.5 4.5L15 8M11 16l1 1L22 7"/>',
  'pj-cloudoff': '<path d="M3 3l18 18M7 18a5 5 0 0 1-.6-9.9M10 6.2A6 6 0 0 1 18 11a4 4 0 0 1 1.8 7.5M9 18h8"/>',
  'pj-tree': '<rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="4" width="6" height="5" rx="1"/><rect x="9" y="15" width="6" height="5" rx="1"/><path d="M6 9v3h12V9M12 12v3"/>',
  'pj-cancel': '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  'pj-radio-on': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  'pj-skip': '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  'pj-block': '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  'pj-eventbusy': '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M10 13l4 4M14 13l-4 4"/>',
});

const pjBack = (f) => f.findOne((n) => n.name === 'icon/back');
function pjDivider(th, parent) {
  const d = figma.createRectangle(); d.name = 'divider'; d.resize(296, 1); d.fills = [pv(th, 'color/border')];
  parent.appendChild(d); d.layoutSizingHorizontal = 'FILL'; return d;
}
/** Elemen yang tumbuh mengisi baris. */
function pjGrow(n) { n.layoutGrow = 1; n.layoutSizingHorizontal = 'FILL'; return n; }

/* ---------- Inbox ---------- */
const PJ_TYPE = { leave: ['Cuti', 'info', 'umbrella'], overtime: ['Lembur', 'warning', 'clock'], other: ['Koreksi Absensi', 'neutral', 'edit'] };
const PJ_ITEMS = [
  { type: 'leave', date: '24 Nov, 08:15', name: 'Hendra Gunawan', no: 'EMP-0042', summary: 'Cuti Tahunan 24–25 Nov (2 hari kerja)', step: 'Persetujuan ke-1 dari 2' },
  { type: 'overtime', date: '23 Nov, 18:40', name: 'Eko Prasetyo', no: 'EMP-0007', summary: 'Lembur 2 jam pada 23 Nov, 17:00–19:00', step: 'Persetujuan ke-2 dari 2 · lapis HR' },
  { type: 'other', date: '22 Nov, 17:20', name: 'Hendra Gunawan', no: 'EMP-0042', summary: 'Koreksi absensi 22 Nov: masuk 08:02, pulang 17:05' },
];
async function pjApprovalCard(it, th, parent) {
  const c = card(th, parent, { name: 'ApprovalCard', gap: 0, pad: 16 });
  const [lbl, tone, ic] = PJ_TYPE[it.type];
  const top = box('header', { dir: 'H', ax: 'SPACE_BETWEEN', ay: 'CENTER', theme: th, parent: c, fillW: true });
  await badge(lbl, tone, ic, th, top);
  await txt(it.date, 'label', 'color/text/secondary', th, { parent: top });
  gap(c, 12);
  await txt(it.name, 'body-strong', 'color/text/primary', th, { parent: c, fillW: true });
  await txt(it.no, 'label', 'color/text/secondary', th, { parent: c, fillW: true });
  gap(c, 8);
  const sm = box('summary', { dir: 'V', pad: 12, fill: 'color/background', radius: 10, theme: th, parent: c, fillW: true });
  await txt(it.summary, 'body', 'color/text/primary', th, { parent: sm, fillW: true });
  if (it.step) {
    gap(c, 10);
    const r = box('step', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: c, fillW: true });
    icon('pj-tree', 14, 'color/text/secondary', th, r);
    await txt(it.step, 'label', 'color/text/secondary', th, { parent: r, fillW: true });
  }
  gap(c, 14);
  const b = await button('Periksa & Putuskan', th, c, { h: 46, icon: 'eye' });
  link(b, 'persetujuan-detail');
  return c;
}
async function pjInbox(th, mode) {
  const { f, body } = await phone('x', th, 'Persetujuan', { h: mode === 'list' ? 1130 : 800, back: false, actions: ['pj-refresh'], pad: [16, 16, 16, 16], gap: 10 });
  if (mode === 'list') for (const it of PJ_ITEMS) await pjApprovalCard(it, th, body);
  else if (mode === 'empty') await emptyState('pj-doneall', 'Tidak ada yang menunggu', 'Semua pengajuan yang jadi giliran Anda sudah diputuskan. Tarik ke bawah untuk memeriksa lagi.', th, body);
  else await emptyState('pj-cloudoff', 'Gagal memuat', 'Tidak bisa menghubungi server. Periksa koneksi internet Anda.', th, body, 'danger');
  await bottomNav(th, f, 2, { badge: 3 });
  return f;
}
registerScreen({ key: 'persetujuan-inbox', group: PJ_APR, title: 'Inbox', build: (th) => pjInbox(th, 'list') });
registerScreen({ key: 'persetujuan-kosong', group: PJ_APR, title: 'Kondisi: kosong', build: (th) => pjInbox(th, 'empty') });
registerScreen({ key: 'persetujuan-error', group: PJ_APR, title: 'Kondisi: error', build: (th) => pjInbox(th, 'error') });

/* ---------- Detail ---------- */
async function pjSectionTitle(text, th, parent) { await sectionLabel(text, th, parent); gap(parent, 8); }
async function pjFieldRow(label, value, th, parent) {
  const r = box('FieldRow', { dir: 'H', pad: [12, 14, 12, 14], theme: th, parent, fillW: true });
  const l = box('label', { dir: 'V', theme: th, parent: r, fixed: [130, 20] }); l.layoutSizingVertical = 'HUG';
  await txt(label, 'caption', 'color/text/secondary', th, { parent: l, fillW: true });
  const v = box('value', { dir: 'V', theme: th, parent: r }); pjGrow(v);
  await txt(value, 'body-strong', 'color/text/primary', th, { parent: v, fillW: true });
}
const PJ_STEP_VIS = {
  approved: ['check', 'color/success'], rejected: ['pj-cancel', 'color/danger'], skipped: ['pj-skip', 'color/text/disabled'],
  current: ['pj-radio-on', 'color/warning'], waiting: ['radio', 'color/text/disabled'],
};
async function pjStepRow(s, th, parent) {
  const [ic, col] = PJ_STEP_VIS[s.vis];
  const r = box('StepRow', { dir: 'H', gap: 12, pad: [8, 14, 8, 14], theme: th, parent, fillW: true });
  icon(ic, 18, col, th, r);
  const m = box('text', { dir: 'V', theme: th, parent: r }); pjGrow(m);
  const n = await txt(s.name, 'body', 'color/text/primary', th, { parent: m, fillW: true });
  if (s.current) n.fontName = { family: 'Inter', style: 'Bold' };
  await txt(s.sub, 'label', 'color/text/secondary', th, { parent: m, fillW: true });
  if (s.note) { gap(m, 4); await txt(s.note, 'caption', col, th, { parent: m, fillW: true }); }
}
async function pjDetailBuild(th, o) {
  const { f, body } = await phone('x', th, 'Detail Pengajuan', { h: 880, pad: [16, 16, 16, 16], gap: 0 });
  // _RequesterCard
  const rc = card(th, body, { name: 'RequesterCard', dir: 'H', gap: 14, pad: 16, ay: 'CENTER' });
  const av = box('avatar', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', radius: 999, theme: th, parent: rc, fixed: [44, 44] });
  await txt('H', 'h2', 'color/primary', th, { parent: av });
  const rm = box('text', { dir: 'V', theme: th, parent: rc }); pjGrow(rm);
  await txt('Hendra Gunawan', 'body-strong', 'color/text/primary', th, { parent: rm, fillW: true });
  await txt('EMP-0042', 'label', 'color/text/secondary', th, { parent: rm, fillW: true });
  gap(rm, 4);
  await txt('Cuti Tahunan 24–25 Nov', 'caption', 'color/text/secondary', th, { parent: rm, fillW: true });
  gap(body, 16);
  await pjSectionTitle('RINCIAN', th, body);
  const fc = card(th, body, { name: 'Rincian', pad: 0 });
  const rows = [['Jenis cuti', 'Cuti Tahunan'], ['Tanggal', '24–25 Nov 2026'], ['Durasi', '2 hari kerja'], ['Sisa saldo', '8 hari']];
  for (const [i, [l, v]] of rows.entries()) { if (i) pjDivider(th, fc); await pjFieldRow(l, v, th, fc); }
  gap(body, 16);
  await pjSectionTitle('ALASAN PENGAJU', th, body);
  const nc = card(th, body, { name: 'Alasan', pad: 14 });
  await txt('Menghadiri acara keluarga di luar kota.', 'body', 'color/text/primary', th, { parent: nc, fillW: true });
  gap(body, 16);
  await pjSectionTitle('RANTAI PERSETUJUAN', th, body);
  const sc = card(th, body, { name: 'Rantai', pad: [6, 0, 6, 0] });
  const steps = o.done
    ? [{ vis: 'approved', name: 'Budi Santoso', sub: 'Atasan langsung · 24 Nov, 09:10', note: 'Silakan, tim sudah siap.' }, { vis: 'approved', name: 'Dewi Lestari', sub: 'HR · 24 Nov, 10:02', current: true }]
    : [{ vis: 'current', name: 'Budi Santoso', sub: 'Atasan langsung · menunggu', current: true }, { vis: 'waiting', name: 'HR', sub: 'HR' }];
  for (const s of steps) await pjStepRow(s, th, sc);
  if (!o.done) {
    // _DecisionBar: Tolak (outline danger) + Setujui (success)
    const bar = bottomBar(th, f); bar.paddingTop = 16; bar.paddingBottom = 16;
    const row = box('decision', { dir: 'H', gap: 12, theme: th, parent: bar, fillW: true });
    const tolak = box('Button/Tolak', { dir: 'H', ax: 'CENTER', ay: 'CENTER', stroke: 'color/danger', radius: 12, theme: th, parent: row, fixed: [150, 50] }); pjGrow(tolak);
    await txt('Tolak', 'body-strong', 'color/danger', th, { parent: tolak });
    const ok = box('Button/Setujui', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/success', radius: 12, theme: th, parent: row, fixed: [150, 50] }); pjGrow(ok);
    await txt('Setujui', 'body-strong', 'white', th, { parent: ok });
    link(tolak, 'persetujuan-tolak', 'modal'); link(ok, 'persetujuan-selesai');
  }
  link(pjBack(f), 'persetujuan-inbox', 'back');
  return f;
}
registerScreen({ key: 'persetujuan-detail', group: PJ_APR, title: 'Detail', build: (th) => pjDetailBuild(th, {}) });
registerScreen({ key: 'persetujuan-selesai', group: PJ_APR, title: 'Detail: sudah diputuskan', build: (th) => pjDetailBuild(th, { done: true }) });

/* ---------- Tolak: bottom sheet alasan ---------- */
registerScreen({ key: 'persetujuan-tolak', group: PJ_APR, title: 'Tolak: alasan', build: async (th) => {
  const f = await pjDetailBuild(th, {});
  const scrim = figma.createRectangle(); scrim.name = 'scrim'; scrim.resize(360, 800); f.appendChild(scrim);
  scrim.layoutPositioning = 'ABSOLUTE'; scrim.x = 0; scrim.y = 0; scrim.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.4 }];
  link(scrim, 'persetujuan-detail', 'back');
  const sh = box('BottomSheet', { dir: 'V', pad: 20, fill: 'color/surface', theme: th, parent: f, fixed: [360, 330] });
  sh.topLeftRadius = 20; sh.topRightRadius = 20; sh.bottomLeftRadius = 0; sh.bottomRightRadius = 0;
  sh.layoutPositioning = 'ABSOLUTE'; sh.x = 0; sh.y = 800 - 330;
  await txt('Tolak pengajuan', 'h2', 'color/text/primary', th, { parent: sh, fillW: true });
  gap(sh, 4);
  await txt('Alasan wajib diisi. Hendra Gunawan akan melihatnya di aplikasinya.', 'caption', 'color/text/secondary', th, { parent: sh, fillW: true });
  gap(sh, 16);
  const tf = box('TextField', { dir: 'V', pad: 14, fill: 'color/surface', stroke: 'color/primary', sw: 1.6, radius: 12, theme: th, parent: sh, fillW: true });
  await txt('Tanggal 24–25 Nov bentrok dengan jadwal rilis. Mohon ajukan ulang setelah 28 Nov.', 'body', 'color/text/primary', th, { parent: tf, fillW: true });
  gap(sh, 4);
  const cnt = box('counter', { dir: 'H', ax: 'MAX', pad: [0, 12, 0, 12], theme: th, parent: sh, fillW: true });
  await txt('84/500', 'caption', 'color/text/secondary', th, { parent: cnt });
  gap(sh, 4);
  const b = await button('Tolak Pengajuan', th, sh, { variant: 'danger', h: 48 });
  link(b, 'persetujuan-inbox');
  return f;
} });
flowStart('persetujuan-inbox', 'Putuskan pengajuan');

/* ---------- Tukar Shift ---------- */
const PJ_DATE = { a: 'Kam, 26 Nov 2026', b: 'Jum, 27 Nov 2026', c: 'Sen, 30 Nov 2026' };
async function pjShiftCard(date, shift, th, parent) {
  const c = card(th, parent, { name: 'ShiftCard', dir: 'H', gap: 12, pad: 14, ay: 'CENTER' });
  const ib = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', radius: 10, theme: th, parent: c, fixed: [40, 40] });
  icon('swap', 24, 'color/primary', th, ib);
  const m = box('text', { dir: 'V', gap: 2, theme: th, parent: c }); pjGrow(m);
  await txt(date, 'body-strong', 'color/text/primary', th, { parent: m, fillW: true });
  await txt(shift, 'caption', 'color/text/secondary', th, { parent: m, fillW: true });
  icon('chevron', 24, 'color/text/disabled', th, c);
  link(c, 'tukar-shift');
  return c;
}
async function pjRequestCard(r, th, parent) {
  const c = card(th, parent, { name: 'RequestCard', pad: 14 });
  const top = box('header', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c, fillW: true });
  await txt(r.title, 'body-strong', 'color/text/primary', th, { parent: top, fillW: true });
  await badge(r.label, r.tone, null, th, top);
  gap(c, 6);
  await infoRow('calendar', r.a, th, c);
  gap(c, 4);
  await infoRow('swap', r.b, th, c);
  if (r.reason) { gap(c, 8); await txt('Alasan: ' + r.reason, 'caption', 'color/danger', th, { parent: c, fillW: true }); }
}
registerScreen({ key: 'tukar-shift-hub', group: PJ_SWAP, title: 'Hub', build: async (th) => {
  const { f, body } = await phone('x', th, 'Tukar Shift', { h: 1000, pad: [16, 16, 16, 16] });
  await txt('Pilih shift yang mau ditukar, lalu pilih rekan yang bisa menggantikan. Tukar shift berlaku setelah disetujui.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true });
  gap(body, 16); await sectionLabel('SHIFT MENDATANG', th, body); gap(body, 10);
  const list = box('shifts', { dir: 'V', gap: 10, theme: th, parent: body, fillW: true });
  await pjShiftCard(PJ_DATE.a, 'Shift Pagi · 07:00–15:00', th, list);
  await pjShiftCard(PJ_DATE.b, 'Shift Siang · 15:00–23:00', th, list);
  await pjShiftCard(PJ_DATE.c, 'Shift Malam · 23:00–07:00', th, list);
  gap(body, 14); await sectionLabel('PENGAJUAN SAYA', th, body); gap(body, 10);
  const reqs = box('requests', { dir: 'V', gap: 10, theme: th, parent: body, fillW: true });
  await pjRequestCard({ title: 'Tukar dengan Hendra Gunawan', label: 'Menunggu', tone: 'warning', a: PJ_DATE.a + ' · Shift Pagi', b: PJ_DATE.a + ' · Shift Siang' }, th, reqs);
  await pjRequestCard({ title: 'Diajak tukar oleh Eko Prasetyo', label: 'Disetujui', tone: 'success', a: PJ_DATE.b + ' · Shift Malam', b: PJ_DATE.b + ' · Shift Siang' }, th, reqs);
  await pjRequestCard({ title: 'Tukar dengan Agus Wijaya', label: 'Ditolak', tone: 'danger', a: PJ_DATE.c + ' · Shift Malam', b: PJ_DATE.c + ' · Shift Pagi', reason: 'Jadwal Agil bentrok dengan pelatihan.' }, th, reqs);
  link(pjBack(f), 'absensi-home', 'back');
  return f;
} });

/* Form tukar shift */
async function pjCandidate(name, shift, selected, th, parent) {
  const c = box('CandidateCard', { dir: 'H', gap: 12, ay: 'CENTER', pad: 14, fill: selected ? 'color/primary-surface' : 'color/surface', stroke: selected ? 'color/primary' : 'color/border', sw: selected ? 2 : 1, radius: 12, theme: th, parent, fillW: true });
  const av = box('avatar', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: selected ? 'color/primary' : 'color/background', radius: 999, theme: th, parent: c, fixed: [36, 36] });
  await txt(name[0], 'body-strong', selected ? 'white' : 'color/text/secondary', th, { parent: av });
  const m = box('text', { dir: 'V', gap: 2, theme: th, parent: c }); pjGrow(m);
  await txt(name, 'body-strong', 'color/text/primary', th, { parent: m, fillW: true });
  await txt(shift, 'caption', 'color/text/secondary', th, { parent: m, fillW: true });
  icon(selected ? 'check' : 'radio', 20, selected ? 'color/primary' : 'color/text/disabled', th, c);
  return c;
}
async function pjLine(ic, text, strong, th, parent) {
  const r = box('Line', { dir: 'H', gap: 10, theme: th, parent, fillW: true });
  icon(ic, 16, 'color/text/secondary', th, r);
  await txt(text, strong ? 'body-strong' : 'body', 'color/text/primary', th, { parent: r, fillW: true });
}
async function pjNoteBox(kind, title, lines, foot, th, parent) {
  const danger = kind === 'danger'; const fg = danger ? 'color/danger' : 'color/warning';
  const b = box(danger ? 'Blockers' : 'Warnings', { dir: 'V', pad: 14, fill: danger ? 'color/danger-surface' : 'color/warning-surface', radius: 12, theme: th, parent, fillW: true });
  const h = box('title', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: b });
  icon(danger ? 'pj-block' : 'info', 16, fg, th, h); await txt(title, 'body-strong', fg, th, { parent: h });
  gap(b, 6);
  for (const l of lines) { await txt(l, 'body', fg, th, { parent: b, fillW: true }); gap(b, 4); }
  if (foot) { gap(b, 4); await txt(foot, 'caption', fg, th, { parent: b, fillW: true }); }
}
async function pjSwapForm(th, o) {
  const { f, body } = await phone('x', th, 'Tukar Shift', { h: o.h ?? 1260, pad: [16, 16, 16, 16] });
  const mine = box('MyShiftCard', { dir: 'V', pad: 16, fill: 'color/primary-surface', radius: 14, theme: th, parent: body, fillW: true });
  await txt('SHIFT ANDA', 'label', 'color/text/secondary', th, { parent: mine, fillW: true }); gap(mine, 6);
  await txt('Shift Pagi', 'h2', 'color/text/primary', th, { parent: mine, fillW: true }); gap(mine, 2);
  await txt(PJ_DATE.a, 'body', 'color/text/primary', th, { parent: mine, fillW: true });
  gap(body, 20);
  await txt('TUKAR DENGAN', 'label', 'color/text/secondary', th, { parent: body, fillW: true }); gap(body, 4);
  await txt('Hanya rekan satu departemen yang shiftnya berbeda di tanggal ini.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true }); gap(body, 12);
  const cl = box('candidates', { dir: 'V', gap: 10, theme: th, parent: body, fillW: true });
  const sel = o.blocked ? 1 : 0;
  const cands = [['Hendra Gunawan', 'Shift Siang · 15:00–23:00'], ['Eko Prasetyo', 'Shift Malam · 23:00–07:00'], ['Agus Wijaya', 'Shift Siang · 15:00–23:00']];
  for (const [i, [n, s]] of cands.entries()) await pjCandidate(n, s, i === sel, th, cl);
  const who = cands[sel][0]; const other = o.blocked ? 'Shift Malam' : 'Shift Siang';
  gap(body, 10);
  const pv_ = box('PreviewCard', { dir: 'V', pad: 16, fill: 'color/background', stroke: 'color/border', radius: 14, theme: th, parent: body, fillW: true });
  await txt('SETELAH DITUKAR', 'label', 'color/text/secondary', th, { parent: pv_, fillW: true }); gap(pv_, 10);
  await pjLine('person', 'Anda masuk ' + other, true, th, pv_); gap(pv_, 6);
  await pjLine('users', who + ' masuk Shift Pagi', false, th, pv_);
  if (o.blocked) { gap(body, 10); await pjNoteBox('danger', 'Tidak bisa ditukar', ['Shift Eko Prasetyo pada tanggal ini sudah dipakai absensi.'], null, th, body); }
  else { gap(body, 10); await pjNoteBox('warning', 'Perlu diperhatikan', ['Hendra Gunawan sudah bekerja 6 hari berturut-turut.'], 'Pengajuan tetap bisa dikirim. Atasan akan melihat catatan ini juga.', th, body); }
  gap(body, 18);
  const tf = box('TextField', { dir: 'V', gap: 4, pad: 14, fill: 'color/surface', stroke: 'color/border', radius: 12, theme: th, parent: body, fillW: true });
  await txt('Alasan (opsional)', 'caption', 'color/text/secondary', th, { parent: tf, fillW: true });
  await txt('mis. Ada urusan keluarga pagi itu', 'body', 'color/text/disabled', th, { parent: tf, fillW: true });
  gap(tf, 20);
  gap(body, 4);
  const cnt = box('counter', { dir: 'H', ax: 'MAX', pad: [0, 12, 0, 12], theme: th, parent: body, fillW: true });
  await txt('0/500', 'caption', 'color/text/secondary', th, { parent: cnt });
  gap(body, 4);
  const b = await button('Ajukan ke ' + who, th, body, { h: 50 });
  if (o.blocked) b.opacity = 0.4; else link(b, 'tukar-shift-hub');
  gap(body, 8);
  await txt('Pengajuan dikirim ke ' + who + ' dulu. Setelah dia setuju, baru diteruskan ke atasan.', 'caption', 'color/text/secondary', th, { parent: body, fillW: true, align: 'CENTER' });
  link(pjBack(f), 'tukar-shift-hub', 'back');
  return f;
}
registerScreen({ key: 'tukar-shift', group: PJ_SWAP, title: 'Form (pratinjau)', build: (th) => pjSwapForm(th, {}) });
registerScreen({ key: 'tukar-shift-halangan', group: PJ_SWAP, title: 'Form: ada penghalang', build: (th) => pjSwapForm(th, { blocked: true, h: 1160 }) });

registerScreen({ key: 'tukar-shift-kosong', group: PJ_SWAP, title: 'Kondisi: tanpa rekan', build: async (th) => {
  const { f, body } = await phone('x', th, 'Tukar Shift', { pad: [24, 24, 24, 24] });
  gap(body, 60);
  const w = box('NoCandidates', { dir: 'V', ay: 'CENTER', theme: th, parent: body, fillW: true });
  icon('swap', 44, 'color/text/disabled', th, w); gap(w, 16);
  await txt('Tidak ada rekan yang bisa diajak', 'h2', 'color/text/primary', th, { parent: w, fillW: true, align: 'CENTER' }); gap(w, 10);
  await txt('Tukar shift hanya bisa dengan rekan satu departemen yang shiftnya berbeda di tanggal ini.', 'body', 'color/text/primary', th, { parent: w, fillW: true, align: 'CENTER' }); gap(w, 16);
  const c = box('causes', { dir: 'V', pad: 14, fill: 'color/background', radius: 12, theme: th, parent: w, fillW: true });
  await txt('KEMUNGKINAN PENYEBABNYA', 'label', 'color/text/secondary', th, { parent: c, fillW: true }); gap(c, 8);
  await txt('Rekan sedepartemen punya shift yang sama.\nMereka tidak dijadwalkan di tanggal ini.\nShiftnya sudah dipakai absensi.\nMereka sedang cuti.\nShiftnya sedang dalam proses tukar yang lain.', 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
  link(pjBack(f), 'tukar-shift-hub', 'back');
  return f;
} });

registerScreen({ key: 'tukar-shift-galat', group: PJ_SWAP, title: 'Kondisi: error', build: async (th) => {
  const { f, body } = await phone('x', th, 'Tukar Shift');
  await emptyState('pj-cloudoff', 'Gagal memuat', 'Tidak bisa menghubungi server. Periksa koneksi internet Anda.', th, body, 'danger');
  const sb = box('SnackBar', { dir: 'H', ay: 'CENTER', pad: [0, 16, 0, 16], fill: 'color/danger', theme: th, parent: f, fixed: [360, 52] });
  sb.layoutPositioning = 'ABSOLUTE'; sb.x = 0; sb.y = 800 - 24 - 52;
  await txt('Tidak bisa menghubungi server. Periksa koneksi internet Anda.', 'body', 'white', th, { parent: sb, fillW: true });
  link(pjBack(f), 'tukar-shift-hub', 'back');
  return f;
} });
flowStart('tukar-shift-hub', 'Tukar shift');
