/* =====================================================================
 * Karyawan dan Hak Akses (prefiks wk / WK_)
 * Sumber: owner/employees, account-access, warning-letters, role-permissions (+ komponen terkait)
 * ===================================================================== */
const WK_GROUP = 'Karyawan dan Hak Akses';
registerIcons({
  'wk-chat': '<path d="M4 5h16v11H9l-5 4z"/>',
  'wk-sliders': '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  'wk-eye-off': '<path d="M3 3l18 18M10.6 6.1A9 9 0 0 1 12 6c5 0 9 6 9 6a15 15 0 0 1-3.2 3.7M6.6 7.6A15 15 0 0 0 3 12s4 6 9 6a8 8 0 0 0 3-.6"/>',
});

const WK_STATUS = { Aktif: 'success', 'Cuti Panjang': 'warning', Resign: 'default', Diberhentikan: 'error' };
const WK_EMPS = [
  ['EMP-000001', 'Dewi Lestari', 'Operasional', 'Manajer Operasional', 'dewi@perusahaan.co.id', 'Aktif'],
  ['EMP-000002', 'Hendra Gunawan', 'SDM', 'Admin HR', 'hendra@perusahaan.co.id', 'Aktif'],
  ['EMP-000003', 'Budi Santoso', 'Teknologi Informasi', 'Staf Pengembang', 'budi@perusahaan.co.id', 'Aktif'],
  ['EMP-000004', 'Siti Rahmawati', 'Keuangan', 'Staf Keuangan', 'siti@perusahaan.co.id', 'Aktif'],
  ['EMP-000005', 'Agus Wijaya', 'Operasional', 'Supervisor Gudang', 'agus@perusahaan.co.id', 'Cuti Panjang'],
  ['EMP-000006', 'Rina Kartika', 'Keuangan', 'Akuntan', 'Belum ada', 'Aktif'],
  ['EMP-000007', 'Eko Prasetyo', 'Teknologi Informasi', 'Analis Sistem', 'eko@perusahaan.co.id', 'Resign'],
  ['EMP-000008', 'Maya Anggraini', 'SDM', 'Staf Rekrutmen', 'maya@perusahaan.co.id', 'Aktif'],
  ['EMP-000009', 'Putri Handayani', 'Operasional', 'Staf Logistik', 'Belum ada', 'Aktif'],
  ['EMP-000010', 'Doni Setiawan', 'Operasional', 'Staf Gudang', 'doni@perusahaan.co.id', 'Diberhentikan'],
];

/* ---------- helper umum ---------- */
async function wkText(th, parent, str, style, color) { return txt(str, style ?? 'body2', color ?? 'color/text/secondary', th, { parent, fillW: true }); }
function wkDivider(th, parent) {
  const r = figma.createRectangle(); r.name = 'divider'; r.resize(10, 1); r.fills = [pv(th, 'color/border')]; parent.appendChild(r); r.layoutSizingHorizontal = 'FILL'; return r;
}
function wkCol(th, parent, gap, name) { return box(name ?? 'col', { dir: 'V', gap: gap ?? 8, theme: th, parent, fillW: true }); }
function wkRow(th, parent, gap, name) { return box(name ?? 'row', { dir: 'H', gap: gap ?? 16, ay: 'MIN', theme: th, parent, fillW: true }); }
async function wkSection(th, parent, title, sub) {
  const s = wkCol(th, parent, 6, 'section/' + title);
  await txt(title, 'body2-strong', 'color/text/primary', th, { parent: s, fillW: true });
  if (sub) await wkText(th, s, sub, 'body2');
  return s;
}
async function wkField(th, parent, label, value, o) { return inputField(label, value, th, parent, o ?? {}); }
async function wkDate(th, parent, label, value, o) { return inputField(label, value, th, parent, Object.assign({ endIcon: 'calendar' }, o ?? {})); }
async function wkSwitchRow(th, parent, on, label) {
  const r = box('switch row', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent });
  toggle(on, th, r); await txt(label, 'body2', 'color/text/primary', th, { parent: r }); return r;
}
/** Kotak berlatar (action.hover) berisi teks. */
function wkPanel(th, parent, o) { return box(o?.name ?? 'panel', { dir: 'V', gap: o?.gap ?? 4, pad: o?.pad ?? [12, 16, 12, 16], fill: 'color/background', radius: 8, theme: th, parent, fillW: true }); }

/** Segmen ala ToggleButtonGroup. kinds[i]: 'manage'|'view'|'none'. */
async function wkSegment(th, parent, labels, active, kinds) {
  const seg = box('ToggleButtonGroup', { dir: 'H', gap: 1, fill: 'color/border', stroke: 'color/border', radius: 8, clip: true, theme: th, parent });
  for (const [i, l] of labels.entries()) {
    const on = i === active; const k = kinds?.[i] ?? 'none';
    const fill = on ? (k === 'manage' ? 'color/primary-surface' : k === 'view' ? 'color/info-surface' : 'color/background') : 'color/surface';
    const fg = on ? (k === 'manage' ? 'color/primary' : k === 'view' ? 'color/info' : 'color/text/primary') : 'color/text/secondary';
    const c = box('seg/' + l, { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [0, 12, 0, 12], fill, theme: th, parent: seg });
    c.counterAxisSizingMode = 'FIXED'; c.resize(60, 30); c.primaryAxisSizingMode = 'AUTO';
    await txt(l, 'caption-strong', fg, th, { parent: c });
  }
  return seg;
}

/** Tabel sendiri dengan sel fungsi. cols: [{t,w,align,hfn}], rows: [[string|{t,sub}|{chip,color,variant}|async fn(cell)]]. */
async function wkTable(th, parent, o) {
  const rowH = o.rowH ?? 56;
  const wrap = box('Table', { dir: 'V', theme: th, parent, fillW: true, fill: 'color/surface', stroke: 'color/border', radius: 10, clip: true });
  const mkRow = (name, isHead, h) => { const r = box(name, { dir: 'H', ay: 'CENTER', pad: [0, 16, 0, 16], theme: th, parent: wrap, stroke: 'color/border' }); r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; r.counterAxisSizingMode = 'FIXED'; r.resize(100, isHead ? (o.headH ?? 44) : h); r.layoutSizingHorizontal = 'FILL'; if (isHead) r.fills = [pv(th, 'color/background')]; return r; };
  const mkCell = (r, col) => { const c = box('cell', { dir: 'H', gap: 8, ay: 'CENTER', ax: col.align === 'right' ? 'MAX' : col.align === 'center' ? 'CENTER' : 'MIN', theme: th, parent: r }); if (col.w === 'fill' || col.w == null) { c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL'; } else { c.counterAxisSizingMode = 'AUTO'; c.primaryAxisSizingMode = 'FIXED'; c.resize(col.w, 20); } return c; };
  const head = mkRow('thead', true);
  for (const col of o.cols) { const c = mkCell(head, col); if (col.hfn) await col.hfn(c); else if (col.t) await txt(col.t, 'th', 'color/text/secondary', th, { parent: c, upper: true }); }
  for (const [ri, row] of o.rows.entries()) {
    const r = mkRow('row ' + (ri + 1), false, o.rowHs?.[ri] ?? rowH);
    for (const [ci, col] of o.cols.entries()) {
      const c = mkCell(r, col); const v = row[ci];
      if (typeof v === 'function') await v(c);
      else if (typeof v === 'string' || typeof v === 'number') await txt(String(v), 'body2', 'color/text/primary', th, { parent: c });
      else if (v && v.chip) await chip(v.chip, th, c, { color: v.color, variant: v.variant ?? 'tint' });
      else if (v && v.t !== undefined) { const tx = box('t', { dir: 'V', theme: th, parent: c }); await txt(v.t, 'body2', v.tc ?? 'color/text/primary', th, { parent: tx }); if (v.sub) await txt(v.sub, 'caption', 'color/text/secondary', th, { parent: tx }); }
    }
  }
  return wrap;
}

/** Dialog bebas: kepala dapat dibangun sendiri (o.head), badan o.build, aksi o.actions. */
async function wkDialog(th, frame, o) {
  const scrim = figma.createRectangle(); scrim.name = 'scrim'; scrim.resize(frame.width, frame.height); scrim.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.5 }];
  frame.appendChild(scrim); scrim.layoutPositioning = 'ABSOLUTE'; scrim.x = 0; scrim.y = 0;
  const w = o.w ?? 560;
  const d = box('Dialog', { dir: 'V', fill: 'color/surface', radius: 12, theme: th, parent: frame, fixed: [w, 100] });
  d.primaryAxisSizingMode = 'AUTO'; d.layoutPositioning = 'ABSOLUTE';
  const hd = box('title', { dir: 'H', gap: 10, ay: 'CENTER', pad: [20, 24, 16, 24], theme: th, parent: d, fillW: true });
  if (o.head) await o.head(hd); else await txt(o.title, 'h6', 'color/text/primary', th, { parent: hd, fillW: true });
  if (o.close) { const sp = spacer(hd); icon('x', 22, 'color/text/secondary', th, hd); }
  if (o.divider) wkDivider(th, d);
  const body = box('content', { dir: 'V', gap: o.gap ?? 16, pad: [o.divider ? 16 : 0, 24, 8, 24], theme: th, parent: d, fillW: true });
  if (o.build) await o.build(body);
  if (o.divider) wkDivider(th, d);
  const ft = box('actions', { dir: 'H', gap: 8, ax: 'MAX', ay: 'CENTER', pad: [16, 24, 20, 24], theme: th, parent: d, fillW: true });
  if (o.left) await o.left(ft);
  for (const a of o.actions ?? []) await button(a.label, th, ft, { v: a.v ?? 'text', color: a.color, disabled: a.disabled, icon: a.icon });
  d.x = Math.round((frame.width - w) / 2); d.y = Math.max(40, Math.round((frame.height - d.height) / 2));
  return d;
}

/** Drawer kanan 520 px. o: header {avatar,title,number,chips:[[label,color,variant]]}, tabs {labels,active}, build, actions. */
async function wkDrawer(th, frame, o) {
  const scrim = figma.createRectangle(); scrim.name = 'scrim'; scrim.resize(frame.width, frame.height); scrim.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.5 }];
  frame.appendChild(scrim); scrim.layoutPositioning = 'ABSOLUTE'; scrim.x = 0; scrim.y = 0;
  const w = 520;
  const p = box('Drawer', { dir: 'V', fill: 'color/surface', stroke: 'color/border', theme: th, parent: frame, fixed: [w, frame.height], clip: true });
  p.layoutPositioning = 'ABSOLUTE'; p.x = frame.width - w; p.y = 0;
  const hd = box('header', { dir: 'H', gap: 14, ay: 'MIN', pad: [24, 24, 16, 24], theme: th, parent: p, fillW: true });
  if (o.header.avatar) await avatar(o.header.avatar, 44, th, hd);
  const tx = box('titles', { dir: 'V', gap: 6, theme: th, parent: hd }); tx.layoutGrow = 1; tx.layoutSizingHorizontal = 'FILL';
  await txt(o.header.title, 'h6', 'color/text/primary', th, { parent: tx, fillW: true });
  if (o.header.number) {
    const m = box('meta', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: tx });
    await txt(o.header.number, 'body2', 'color/text/secondary', th, { parent: m });
    for (const [l, c, v] of o.header.chips ?? []) await chip(l, th, m, { color: c, variant: v ?? 'solid' });
  }
  icon('x', 22, 'color/text/secondary', th, hd);
  if (o.tabs) await tabs(o.tabs.labels, o.tabs.active, th, p);
  else wkDivider(th, p);
  const bd = box('body', { dir: 'V', gap: 20, pad: 24, theme: th, parent: p, fillW: true, clip: true }); bd.layoutGrow = 1;
  await o.build(bd);
  const ft = box('footer', { dir: 'H', gap: 8, ax: 'MAX', ay: 'CENTER', pad: [12, 24, 12, 24], stroke: 'color/border', theme: th, parent: p, fillW: true });
  ft.strokeBottomWeight = 0; ft.strokeLeftWeight = 0; ft.strokeRightWeight = 0;
  for (const a of o.actions ?? []) await button(a.label, th, ft, { v: a.v ?? 'text', color: a.color, disabled: a.disabled });
  return p;
}

function wkReg(key, title, active, h, fn) {
  registerScreen({ key, group: WK_GROUP, title, build: async (th) => {
    const { f, main } = await page('x', th, { role: 'owner', active, h });
    await fn(th, f, main);
    return f;
  } });
}

/* =====================================================================
 * 1. Karyawan
 * ===================================================================== */
async function wkEmpBase(th, main, o = {}) {
  const act = await pageHeader(th, main, 'Karyawan', o.sub ?? '56 karyawan');
  await button('Template', th, act, { v: 'outlined', icon: 'file', disabled: o.noCompany });
  if (!o.noCompany) await button('Kirim Undangan (3)', th, act, { v: 'outlined', icon: 'mail' });
  await button('Impor Karyawan', th, act, { v: 'outlined', icon: 'upload', disabled: o.noCompany });
  await button('Data Karyawan', th, act, { v: 'outlined', icon: 'person', disabled: o.noCompany });
  await button('Tambah Karyawan', th, act, { icon: 'plus', disabled: o.noCompany });
  if (o.error) await alertBox('error', o.error, th, main);
  if (o.noCompany) await alertBox('info', 'Buat perusahaan dulu sebelum menambah karyawan.', th, main);
  const tb = toolbar(th, main);
  await inputField('Cari nama, nomor karyawan, atau email', '', th, tb.left, { w: 420, icon: 'search' });
  await inputField('Perusahaan', o.filterCompany ?? 'Semua Perusahaan', th, tb.left, { w: 220, select: true });
  await inputField('Status', o.filterStatus ?? 'Semua Status', th, tb.left, { w: 190, select: true });
  const rows = (o.empty ? [] : WK_EMPS.slice(0, o.rows ?? 10)).map((e) => [e[0], { avatar: e[1][0], name: e[1] }, 'PT Maju Bersama', e[2], e[3], e[4] === 'Belum ada' ? { t: 'Belum ada', tc: 'color/text/disabled' } : e[4], { chip: e[5], color: WK_STATUS[e[5]] }, { icon: 'chevron' }]);
  const t = await table(th, main, { cols: [{ t: 'No. Karyawan', w: 120 }, { t: 'Nama', w: 'fill' }, { t: 'Perusahaan', w: 130 }, { t: 'Departemen', w: 140 }, { t: 'Jabatan', w: 150 }, { t: 'Akun Login', w: 200 }, { t: 'Status', w: 120 }, { t: '', w: 30 }], rows, foot: o.foot ?? '1–10 dari 56' });
  if (o.empty) await emptyState('users', 'Tidak ada baris', 'Tidak ada karyawan yang cocok dengan pencarian atau filter.', th, main);
  return t;
}

wkReg('owner/employees', 'Karyawan', 'Karyawan', 1100, async (th, f, main) => { await wkEmpBase(th, main); });
wkReg('owner/employees-kosong', 'Karyawan - belum ada perusahaan', 'Karyawan', 800, async (th, f, main) => {
  await wkEmpBase(th, main, { noCompany: true, empty: true, sub: '0 karyawan', foot: '0–0 dari 0' });
});
wkReg('owner/employees-filter-kosong', 'Karyawan - filter tanpa hasil', 'Karyawan', 800, async (th, f, main) => {
  await wkEmpBase(th, main, { empty: true, sub: '0 dari 56 karyawan', filterStatus: 'Diberhentikan', foot: '0–0 dari 0' });
});
wkReg('owner/employees-galat', 'Karyawan - galat', 'Karyawan', 800, async (th, f, main) => {
  await wkEmpBase(th, main, { error: 'Gagal memuat data karyawan. Coba lagi.', empty: true, sub: '0 karyawan', foot: '0–0 dari 0' });
});

const WK_BUDI = { avatar: 'B', title: 'Budi Santoso', number: 'EMP-000003', chips: [['Aktif', 'success']] };
const WK_TABS = ['Kepegawaian', 'Data Pribadi', 'Akun & Status', 'Cuti', 'Riwayat'];

async function wkSelectField(th, parent, label, value, helper) { return inputField(label, value, th, parent, { select: true, helper }); }

/* Foto profil (EmployeePhotoUpload) */
async function wkPhoto(th, p, hasPhoto) {
  const s = wkCol(th, p, 12, 'EmployeePhotoUpload');
  const r = box('row', { dir: 'H', gap: 20, ay: 'CENTER', theme: th, parent: s });
  if (hasPhoto) { const ph = box('foto', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', radius: 999, theme: th, parent: r, fixed: [88, 88] }); icon('person', 40, 'color/primary', th, ph); }
  else await avatar('B', 88, th, r);
  const b = box('buttons', { dir: 'V', gap: 8, theme: th, parent: r });
  await button(hasPhoto ? 'Ganti Foto' : 'Unggah Foto', th, b, { v: 'outlined', size: 'small', icon: 'camera' });
  if (hasPhoto) await button('Hapus', th, b, { v: 'text', color: 'error', size: 'small', icon: 'trash' });
  if (!hasPhoto) await alertBox('info', 'Foto dipakai untuk mencocokkan wajah saat absen, jadi pilih foto wajah yang jelas, menghadap depan, dan tidak tertutup. Format JPG atau PNG, maksimal 3 MB.', th, s, 'Unggah foto profil karyawan');
  else await wkText(th, s, 'Format JPG atau PNG, maksimal 3 MB.', 'caption');
  wkDivider(th, p);
}

/* Penyetuju (ApproverListField) */
async function wkApprovers(th, p, list) {
  const s = wkCol(th, p, 8, 'ApproverListField');
  await wkText(th, s, 'Penyetuju Pengajuan', 'caption');
  if (list.length === 0) await alertBox('info', 'Mengikuti Atasan Langsung (Dewi Lestari), lalu atasannya lagi, terus ke atas. Isi daftar ini hanya kalau penyetujunya beda dari atasan.', th, s);
  else await alertBox('warning', 'Atasan Langsung tidak dipakai untuk persetujuan karyawan ini. Yang berlaku daftar di bawah, sesuai urutan.', th, s);
  for (const [i, a] of list.entries()) {
    const r = box('approver ' + (i + 1), { dir: 'H', gap: 8, ay: 'CENTER', pad: [8, 12, 8, 12], stroke: 'color/border', radius: 6, theme: th, parent: s, fillW: true });
    await chip(String(i + 1), th, r);
    const t = box('t', { dir: 'V', theme: th, parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
    await txt(a[0], 'body2', 'color/text/primary', th, { parent: t }); await txt(a[1], 'caption', 'color/text/secondary', th, { parent: t });
    const up = await iconButton('up', th, r, { size: 28, iconSize: 16 }); up.opacity = i === 0 ? 0.4 : 1;
    const dn = await iconButton('down', th, r, { size: 28, iconSize: 16 }); dn.opacity = i === list.length - 1 ? 0.4 : 1;
    await iconButton('trash', th, r, { size: 28, iconSize: 16 });
  }
  if (list.length < 5) await inputField(list.length === 0 ? '+ Tambah penyetuju...' : '+ Tambah penyetuju berikutnya...', '', th, s, { select: true });
  await wkText(th, s, 'Penyetuju kedua baru melihat pengajuan setelah penyetuju pertama memutuskan, dan seterusnya. Terakhir, pengajuan sampai ke HR. Penyetuju yang sudah resign otomatis dilewati.', 'caption');
}

/* Tab Kepegawaian. o: create, photo ('none'|'has'), approvers [], jobChanged, contract */
async function wkEmployment(th, p, o = {}) {
  const sel = !o.create;
  if (sel) await wkPhoto(th, p, o.photo === 'has');
  await wkField(th, p, 'Nama Lengkap', sel ? 'Budi Santoso' : 'Putri Handayani', { required: true, focus: o.create });
  await wkField(th, p, 'Email Kantor', sel ? 'budi@perusahaan.co.id' : '', { disabled: sel, helper: sel ? 'Email kantor yang sudah dipakai tidak bisa diubah' : 'Opsional. Kalau diisi, akun login dibuat otomatis.' });
  await wkSelectField(th, p, 'Kantor Utama', 'Kantor Pusat Jakarta', 'Jadi patokan radius absen. Kosongkan untuk karyawan lapangan.');
  const fx = wkCol(th, p, 6, 'lokasi fleksibel');
  await wkSwitchRow(th, fx, !!o.flex, 'Boleh absen di mana saja');
  await wkText(th, fx, o.flex ? 'Radius kantor tidak dicek. Karyawan bisa absen dari mana saja.' : 'Absen ditolak kalau karyawan di luar radius kantor utama.', 'caption');
  if (sel) {
    await wkSelectField(th, p, 'Atasan Langsung', 'Dewi Lestari · Manajer Operasional (L3)', 'Dipakai untuk struktur organisasi. Atasan ini juga jadi penyetuju pengajuan selama daftar Penyetuju di bawah kosong.');
    await wkApprovers(th, p, o.approvers ?? []);
  }
  await wkSelectField(th, p, 'Perusahaan', 'PT Maju Bersama');
  await wkSelectField(th, p, 'Departemen (opsional)', sel ? 'Teknologi Informasi' : 'Belum dipilih');
  await wkSelectField(th, p, 'Jabatan (opsional)', sel ? 'Staf Pengembang' : 'Belum dipilih');
  if (o.jobChanged) await wkDate(th, p, 'Perubahan jabatan berlaku mulai', '01/12/2026', { helper: 'Dicatat di tab Riwayat. Kosongkan kalau berlaku hari ini.' });
  await wkDate(th, p, 'Tanggal Masuk', sel ? '15/03/2022' : '24/11/2026', { required: true });
  await wkSelectField(th, p, 'Tipe Karyawan', o.contract ? 'Kontrak' : 'Tetap');
  if (o.contract) { const r = wkRow(th, p, 12); await wkDate(th, r, 'Mulai Kontrak', '01/01/2026'); await wkDate(th, r, 'Akhir Kontrak', '31/12/2026'); }
  await wkField(th, p, 'Golongan', sel ? 'III-A' : '', { helper: 'Contoh: III-A atau Grade 5. Beda dengan Jabatan (nama posisi).' });
  if (sel) { const m = wkPanel(th, p, { name: 'masa kerja' }); await wkText(th, m, 'Masa kerja', 'caption'); await wkText(th, m, '4 tahun 8 bulan', 'body2-strong', 'color/text/primary'); }
}

wkReg('owner/employees-form', 'Karyawan - Tambah Karyawan (panel)', 'Karyawan', 1500, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: { title: 'Tambah Karyawan' }, build: (b) => wkEmployment(th, b, { create: true }), actions: [{ label: 'Tutup' }, { label: 'Simpan', v: 'contained' }] });
});
wkReg('owner/employees-form-kontrak', 'Karyawan - Tambah Karyawan kontrak', 'Karyawan', 1600, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: { title: 'Tambah Karyawan' }, build: (b) => wkEmployment(th, b, { create: true, contract: true, flex: true }), actions: [{ label: 'Tutup' }, { label: 'Simpan', v: 'contained' }] });
});
wkReg('owner/employees-detail', 'Karyawan - Detail: Kepegawaian', 'Karyawan', 2100, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: WK_BUDI, tabs: { labels: WK_TABS, active: 0 }, build: (b) => wkEmployment(th, b, {}), actions: [{ label: 'Tutup' }, { label: 'Simpan', v: 'contained' }] });
});
wkReg('owner/employees-penyetuju', 'Karyawan - Penyetuju pengajuan terisi', 'Karyawan', 2300, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: Object.assign({}, WK_BUDI, { chips: [['Aktif', 'success'], ['Lokasi fleksibel', 'info', 'outlined']] }), tabs: { labels: WK_TABS, active: 0 }, build: (b) => wkEmployment(th, b, { photo: 'has', flex: true, jobChanged: true, approvers: [['Siti Rahmawati', 'EMP-000004 · Keuangan'], ['Agus Wijaya', 'EMP-000005 · Operasional']] }), actions: [{ label: 'Tutup' }, { label: 'Simpan', v: 'contained' }] });
});
wkReg('owner/employees-foto', 'Karyawan - Foto profil terunggah', 'Karyawan', 1100, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: WK_BUDI, tabs: { labels: WK_TABS, active: 0 }, build: async (b) => { await wkPhoto(th, b, true); await wkField(th, b, 'Nama Lengkap', 'Budi Santoso', { required: true }); await wkField(th, b, 'Email Kantor', 'budi@perusahaan.co.id', { disabled: true, helper: 'Email kantor yang sudah dipakai tidak bisa diubah' }); }, actions: [{ label: 'Tutup' }, { label: 'Simpan', v: 'contained' }] });
});

/* Tab Data Pribadi */
async function wkPersonal(th, p, o = {}) {
  const sec = async (title, sub) => { const s = await wkSection(th, p, title, sub); return s; };
  const grp = () => wkCol(th, p, 16, 'fields');
  await sec('Identitas'); let g = grp();
  await wkField(th, g, 'NIK (KTP)', '3171012345670001');
  await wkField(th, g, 'Nomor Kartu Keluarga', '3171019876540002');
  await wkField(th, g, 'NPWP', o.npwpError ? '12.345.678.9' : '12.345.678.9-012.000', o.npwpError ? { error: true, helper: 'Baru 9 digit. NPWP lama 15 digit, NPWP baru (pakai NIK) 16 digit.' } : { helper: 'Kosongkan kalau belum punya. Bisa diisi nanti.' });
  let r = wkRow(th, g, 12); await wkField(th, r, 'Tempat Lahir', 'Bandung'); await wkDate(th, r, 'Tanggal Lahir', '12/08/1994');
  await wkSelectField(th, g, 'Jenis Kelamin', 'Laki-laki');
  await wkSelectField(th, g, 'Status Pernikahan', 'Menikah', 'Dipakai untuk menentukan PTKP saat hitung pajak.');
  r = wkRow(th, g, 12); await wkSelectField(th, r, 'Agama', 'Islam'); await wkSelectField(th, r, 'Golongan Darah', 'O');
  await wkSelectField(th, g, 'Pendidikan Terakhir', 'S1');
  await wkField(th, g, 'Nama Ibu Kandung', 'Sri Wahyuni');
  wkDivider(th, p);
  await sec('Alamat dan Kontak'); g = grp();
  await wkField(th, g, 'Alamat sesuai KTP', 'Jl. Merdeka No. 12, Bandung', { multiline: 2 });
  await wkField(th, g, 'Alamat Domisili', 'Jl. Kenanga No. 5, Jakarta Selatan', { multiline: 2, helper: 'Tempat tinggal sekarang, kalau beda dengan KTP.' });
  await wkField(th, g, 'Email Pribadi', 'budi.santoso@contoh.id', { helper: 'Bisa dipakai login selain email kantor. Harus milik karyawan ini saja.' });
  await wkField(th, g, 'Nomor Telepon', '081234567890');
  wkDivider(th, p);
  await sec('Jaminan Sosial dan Bank', 'Dipakai untuk payroll. Boleh diisi nanti.'); g = grp();
  await wkField(th, g, 'BPJS Ketenagakerjaan', '12345678901');
  await wkField(th, g, 'BPJS Kesehatan', '0001234567890');
  r = wkRow(th, g, 12); await wkField(th, r, 'Nama Bank', 'Bank Mandiri'); await wkField(th, r, 'Nomor Rekening', '1230004567890');
  await wkField(th, g, 'Nama Pemilik Rekening', 'BUDI SANTOSO', { helper: 'Tulis persis seperti di buku tabungan. Kalau ejaannya beda, transfer gaji bisa ditolak.' });
  wkDivider(th, p);
  await sec('Kontak Darurat'); g = grp();
  await wkField(th, g, 'Nama', 'Ani Santoso');
  await wkField(th, g, 'Hubungan (contoh: Suami/Istri/Orang Tua)', 'Istri');
  await wkField(th, g, 'Nomor Telepon', '081298765432');
}
wkReg('owner/employees-pribadi', 'Karyawan - Detail: Data Pribadi', 'Karyawan', 2400, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: WK_BUDI, tabs: { labels: WK_TABS, active: 1 }, build: (b) => wkPersonal(th, b), actions: [{ label: 'Tutup' }, { label: 'Simpan Data Pribadi', v: 'contained' }] });
});
wkReg('owner/employees-pribadi-npwp', 'Karyawan - Data Pribadi, NPWP salah', 'Karyawan', 1000, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: WK_BUDI, tabs: { labels: WK_TABS, active: 1 }, build: async (b) => { await wkSection(th, b, 'Identitas'); await wkField(th, b, 'NIK (KTP)', '3171012345670001'); await wkField(th, b, 'Nomor Kartu Keluarga', '3171019876540002'); await wkField(th, b, 'NPWP', '12.345.678.9', { error: true, helper: 'Baru 9 digit. NPWP lama 15 digit, NPWP baru (pakai NIK) 16 digit.' }); }, actions: [{ label: 'Tutup' }, { label: 'Simpan Data Pribadi', v: 'contained' }] });
});

/* Tab Akun & Status */
async function wkAccount(th, p, o = {}) {
  const hasAcc = !o.noAccount;
  let s = await wkSection(th, p, 'Akun Login');
  if (hasAcc) {
    const r = box('akun', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: s, fillW: true });
    icon('lock', 20, 'color/text/secondary', th, r);
    const t = box('t', { dir: 'V', theme: th, parent: r }); await txt('budi@perusahaan.co.id', 'body2-strong', 'color/text/primary', th, { parent: t }); await txt('Kata sandi dibuat sendiri oleh karyawan lewat tautan undangan', 'caption', 'color/text/secondary', th, { parent: t });
    await button('Kirim Ulang Undangan', th, s, { v: 'outlined', size: 'small' });
  } else await alertBox('info', 'Belum punya akun login. Isi Email Kantor di tab Kepegawaian supaya akun dibuat otomatis.', th, s);
  wkDivider(th, p);
  s = await wkSection(th, p, 'Peran Akun');
  if (hasAcc) {
    await wkSelectField(th, s, 'Peran', o.hr ? 'Admin HR' : 'Manajer');
    await wkText(th, s, o.hr ? 'Mengelola karyawan, jadwal, dan absensi. Juga jadi penyetuju terakhir pengajuan.' : 'Menyetujui pengajuan bawahannya. Selain itu, aksesnya sama seperti karyawan biasa.', 'caption');
    if (o.hr) await alertBox('warning', 'Admin HR bisa melihat dan mengubah data semua karyawan, termasuk data atasannya sendiri.', th, s);
  } else await wkText(th, s, 'Belum punya akun login, jadi belum ada peran. Isi Email Kantor di tab Kepegawaian dulu.', 'body2', 'color/text/disabled');
  wkDivider(th, p);
  s = await wkSection(th, p, 'Perangkat Absen');
  if (hasAcc) {
    const d = wkPanel(th, s, { name: 'perangkat' });
    await wkText(th, d, 'Samsung Galaxy A54 · android', 'body2-strong', 'color/text/primary');
    await wkText(th, d, 'Terdaftar 02/03/2026 · terakhir dipakai 24/11/2026', 'caption');
  } else await wkText(th, s, 'Belum ada perangkat terdaftar. HP pertama yang dipakai login di aplikasi otomatis terdaftar.', 'body2');
  await button('Reset Perangkat', th, s, { v: 'outlined', size: 'small', disabled: !hasAcc });
  await wkText(th, s, 'Pakai "Reset Perangkat" kalau karyawan ganti HP, supaya bisa login dari HP baru.', 'caption');
  wkDivider(th, p);
  s = await wkSection(th, p, 'Status Kepegawaian');
  await wkSelectField(th, s, 'Status', o.resign ? 'Resign' : 'Aktif');
  if (o.resign) { await wkDate(th, s, 'Tanggal Berlaku', '30/11/2026'); await alertBox('warning', 'Akses login akan dicabut, dan email budi@perusahaan.co.id dilepas supaya bisa dipakai lagi kalau orangnya pindah perusahaan.', th, s); }
  wkDivider(th, p);
  s = await wkSection(th, p, 'Hapus Permanen', 'Data karyawan ini akan hilang dan tidak bisa dikembalikan.');
  await button('Hapus Karyawan', th, s, { v: 'outlined', color: 'error', size: 'small', icon: 'trash' });
}
wkReg('owner/employees-akun', 'Karyawan - Detail: Akun & Status', 'Karyawan', 1500, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: WK_BUDI, tabs: { labels: WK_TABS, active: 2 }, build: (b) => wkAccount(th, b), actions: [{ label: 'Tutup' }, { label: 'Simpan Status', v: 'contained', disabled: true }] });
});
wkReg('owner/employees-akun-resign', 'Karyawan - Akun & Status, ubah ke Resign', 'Karyawan', 1650, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: WK_BUDI, tabs: { labels: WK_TABS, active: 2 }, build: (b) => wkAccount(th, b, { resign: true, hr: true }), actions: [{ label: 'Tutup' }, { label: 'Simpan Status', v: 'contained' }] });
});
wkReg('owner/employees-akun-tanpa-akun', 'Karyawan - Akun & Status tanpa akun', 'Karyawan', 1400, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: { avatar: 'R', title: 'Rina Kartika', number: 'EMP-000006', chips: [['Aktif', 'success']] }, tabs: { labels: WK_TABS, active: 2 }, build: (b) => wkAccount(th, b, { noAccount: true }), actions: [{ label: 'Tutup' }, { label: 'Simpan Status', v: 'contained', disabled: true }] });
});

/* Tab Cuti (EmployeeLeaveBalancePanel) */
async function wkLeave(th, p, o = {}) {
  const top = box('saldo', { dir: 'H', gap: 24, ay: 'MAX', theme: th, parent: p, fillW: true });
  const a = box('sisa', { dir: 'V', gap: 2, theme: th, parent: top });
  await txt('9', 'h4', 'color/primary', th, { parent: a }); await txt('hari tersisa', 'caption', 'color/text/secondary', th, { parent: a });
  await txt('2 hari baru bisa dipakai mulai 01 Jan 2027', 'caption', 'color/warning', th, { parent: a });
  const b = box('jatah', { dir: 'V', gap: 2, theme: th, parent: top });
  await txt('Jatah 12 hari', 'body2', 'color/text/primary', th, { parent: b }); await txt('Dipakai 3 hari', 'body2', 'color/text/secondary', th, { parent: b });
  const tr = box('progress', { dir: 'H', fill: 'color/border', radius: 4, theme: th, parent: p, fillW: true, clip: true });
  const fl = figma.createRectangle(); fl.resize(110, 8); fl.cornerRadius = 4; fl.fills = [pv(th, 'color/primary')]; tr.appendChild(fl);
  await wkText(th, p, 'Periode 2026-01-01 s/d 2026-12-31', 'caption');
  wkDivider(th, p);
  const s = await wkSection(th, p, 'Rincian saldo');
  const entries = [['Jatah cuti terbit', 'Jatah tahunan 2026', '+12', true], ['Dipakai', 'Cuti tahunan 3–5 Agu 2026 · oleh Dewi Lestari', '-3', false], ['Koreksi HR', 'Saldo pindahan dari sistem lama · oleh Hendra Gunawan', '+2', true]];
  for (const e of entries) {
    const r = box('entry', { dir: 'H', gap: 12, ay: 'MIN', theme: th, parent: s, fillW: true });
    const t = box('t', { dir: 'V', theme: th, parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
    await txt(e[0], 'body2', 'color/text/primary', th, { parent: t }); await txt(e[1], 'caption', 'color/text/secondary', th, { parent: t, fillW: true });
    await txt(e[2], 'body2-strong', e[3] ? 'color/success' : 'color/text/primary', th, { parent: r });
  }
  wkDivider(th, p);
  if (!o.adjust) {
    const r = box('aksi', { dir: 'H', gap: 8, theme: th, parent: p });
    await button('Koreksi saldo', th, r, { v: 'text', size: 'small', icon: 'wk-sliders' });
    await button('Sesuaikan dengan pengaturan', th, r, { v: 'text', color: 'default', size: 'small', icon: 'refresh' });
  } else {
    await wkSection(th, p, 'Koreksi saldo: Budi Santoso');
    await wkField(th, p, 'Jumlah hari', '-2', { helper: 'Positif menambah, negatif mengurangi. Setengah hari boleh, mis. 0,5' });
    await wkField(th, p, 'Alasan', 'Cuti bersama dipotong dari jatah', { multiline: 2, helper: 'Wajib diisi, supaya jelas kenapa saldo berubah kalau nanti ditanyakan.' });
    const r = box('aksi', { dir: 'H', gap: 8, theme: th, parent: p }); await button('Batal', th, r, { v: 'text', size: 'small' }); await button('Simpan Koreksi', th, r, { size: 'small' });
    await alertBox('info', 'Koreksi dicatat sebagai baris baru di rincian saldo, catatan lama tidak berubah. Karyawan bisa melihat koreksi ini beserta nama yang mengoreksi.', th, p);
  }
}
wkReg('owner/employees-cuti', 'Karyawan - Detail: Cuti', 'Karyawan', 1100, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: WK_BUDI, tabs: { labels: WK_TABS, active: 3 }, build: (b) => wkLeave(th, b), actions: [{ label: 'Tutup' }] });
});
wkReg('owner/employees-cuti-koreksi', 'Karyawan - Cuti, form koreksi saldo', 'Karyawan', 1300, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: WK_BUDI, tabs: { labels: WK_TABS, active: 3 }, build: (b) => wkLeave(th, b, { adjust: true }), actions: [{ label: 'Tutup' }] });
});

/* Tab Riwayat (EmployeeHistoryPanel) */
async function wkHistory(th, p, o = {}) {
  let r = box('judul', { dir: 'H', ay: 'CENTER', theme: th, parent: p, fillW: true });
  await txt('Riwayat Jabatan', 'body2-strong', 'color/text/primary', th, { parent: r }); spacer(r);
  if (!o.form) await button('Tambah catatan', th, r, { v: 'text', size: 'small', icon: 'plus' });
  if (o.form) {
    const fp = box('form', { dir: 'V', gap: 16, pad: 16, fill: 'color/background', stroke: 'color/border', radius: 8, theme: th, parent: p, fillW: true });
    await wkText(th, fp, 'Untuk mencatat perubahan yang terjadi sebelumnya, mis. promosi tahun lalu. Jabatan yang berlaku sekarang tidak ikut berubah.', 'body2');
    const rr = wkRow(th, fp, 12); await wkSelectField(th, rr, 'Jenis', 'Promosi'); await wkDate(th, rr, 'Berlaku mulai', '01/04/2025', { required: true });
    await wkSelectField(th, fp, 'Jabatan', 'Sama dengan sekarang');
    await wkField(th, fp, 'Catatan (opsional)', 'Promosi dari Staf Junior');
    const ar = box('aksi', { dir: 'H', gap: 8, ax: 'MAX', theme: th, parent: fp, fillW: true }); await button('Batal', th, ar, { v: 'text', size: 'small' }); await button('Simpan', th, ar, { size: 'small' });
  }
  if (o.empty) await wkText(th, p, 'Belum ada riwayat jabatan.', 'body2');
  else {
    const items = [['01 Apr 2025', 'Promosi', 'primary', 'PT Maju Bersama · Teknologi Informasi · Staf Pengembang', 'Dicatat oleh Hendra Gunawan'], ['15 Mar 2022', 'Bergabung', 'success', 'PT Maju Bersama · Teknologi Informasi · Staf Junior', 'Dicatat otomatis']];
    const tl = box('timeline', { dir: 'V', gap: 16, pad: [0, 0, 0, 20], stroke: 'color/border', theme: th, parent: p, fillW: true });
    tl.strokeTopWeight = 0; tl.strokeRightWeight = 0; tl.strokeBottomWeight = 0; tl.strokeWeight = 2;
    for (const it of items) {
      const c = wkCol(th, tl, 4, 'jabatan');
      const h = box('h', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c }); await txt(it[0], 'body2-strong', 'color/text/primary', th, { parent: h }); await chip(it[1], th, h, { color: it[2], variant: 'outlined' });
      await wkText(th, c, it[3], 'body2', 'color/text/primary'); await wkText(th, c, it[4], 'caption');
    }
  }
  wkDivider(th, p);
  await txt('Riwayat Gaji', 'body2-strong', 'color/text/primary', th, { parent: p, fillW: true });
  if (o.empty) await wkText(th, p, 'Belum ada penetapan gaji. Gaji diatur dari menu Payroll.', 'body2');
  else {
    for (const [i, s] of [['01 Apr 2025', 'Struktur Staf IT', 'Rp 9.500.000', '+ variabel Rp 1.000.000', 'Kenaikan setelah promosi · oleh Hendra Gunawan'], ['15 Mar 2022', 'Struktur Staf IT', 'Rp 7.000.000', '', '']].entries()) {
      const c = box('gaji', { dir: 'V', gap: 4, pad: 12, fill: i === 0 ? 'color/primary-surface' : null, stroke: 'color/border', radius: 8, theme: th, parent: p, fillW: true });
      const rr = box('r', { dir: 'H', ay: 'MIN', theme: th, parent: c, fillW: true });
      const l = box('l', { dir: 'V', theme: th, parent: rr }); await txt(s[0], 'body2-strong', 'color/text/primary', th, { parent: l }); await txt(s[1], 'caption', 'color/text/secondary', th, { parent: l });
      spacer(rr);
      const rt = box('rt', { dir: 'V', ay: 'MAX', theme: th, parent: rr }); await txt(s[2], 'body2-strong', 'color/text/primary', th, { parent: rt }); if (s[3]) await txt(s[3], 'caption', 'color/text/secondary', th, { parent: rt });
      if (s[4]) await wkText(th, c, s[4], 'caption');
    }
  }
}
wkReg('owner/employees-riwayat', 'Karyawan - Detail: Riwayat', 'Karyawan', 1100, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: WK_BUDI, tabs: { labels: WK_TABS, active: 4 }, build: (b) => wkHistory(th, b), actions: [{ label: 'Tutup' }] });
});
wkReg('owner/employees-riwayat-form', 'Karyawan - Riwayat, tambah catatan', 'Karyawan', 1300, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: WK_BUDI, tabs: { labels: WK_TABS, active: 4 }, build: (b) => wkHistory(th, b, { form: true }), actions: [{ label: 'Tutup' }] });
});
wkReg('owner/employees-riwayat-kosong', 'Karyawan - Riwayat kosong', 'Karyawan', 900, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDrawer(th, f, { header: WK_BUDI, tabs: { labels: WK_TABS, active: 4 }, build: (b) => wkHistory(th, b, { empty: true }), actions: [{ label: 'Tutup' }] });
});

/* Penempatan kantor (AssignmentOffice, dipakai di form Roster) */
wkReg('owner/employees-penempatan', 'Penempatan kantor (komponen Lokasi Kerja)', 'Karyawan', 900, async (th, f, main) => {
  await pageHeader(th, main, 'Karyawan', 'Komponen Lokasi Kerja pada penempatan jadwal');
  const row = box('cards', { dir: 'H', gap: 16, ay: 'MIN', theme: th, parent: main, fillW: true });
  for (const v of [false, true]) {
    const c = card(th, row, { gap: 8 }); c.layoutGrow = 1;
    await wkText(th, c, 'Lokasi Kerja', 'caption');
    await inputField('Lokasi Kerja', v ? 'Kantor Cabang Bandung' : 'Kantor utama: Kantor Pusat Jakarta', th, c, { select: true });
    await wkText(th, c, v ? 'Radius dan zona waktu absen ikut lokasi ini, bukan kantor utama.' : 'Biarkan kosong kalau kerja di kantor utama. Isi kalau shift ini di cabang lain.', 'caption');
    if (v) { const b = box('badge', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: c }); icon('pin', 16, 'color/warning', th, b); await txt('Kerja di Kantor Cabang Bandung, bukan kantor utama', 'caption', 'color/text/secondary', th, { parent: b }); }
  }
  const c2 = card(th, main, { gap: 8 });
  await wkText(th, c2, 'Lokasi Kerja', 'caption');
  await wkText(th, c2, 'Belum ada lokasi kantor aktif di perusahaan ini.', 'caption');
});

/* Dialog-dialog karyawan */
wkReg('owner/employees-hapus', 'Karyawan - Hapus Karyawan?', 'Karyawan', 1000, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDialog(th, f, { title: 'Hapus Karyawan?', w: 444, build: async (b) => { await wkText(th, b, 'Budi Santoso akan dihapus permanen, termasuk data pribadi dan akun loginnya. Ini tidak bisa dibatalkan.', 'body2', 'color/text/primary'); }, actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }] });
});
wkReg('owner/employees-undangan', 'Karyawan - Kirim Undangan Login?', 'Karyawan', 1000, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDialog(th, f, { title: 'Kirim Undangan Login?', w: 444, build: async (b) => {
    await wkText(th, b, '3 karyawan punya email kantor tapi belum punya akun login. Masing-masing akan dapat email berisi tautan untuk membuat kata sandi sendiri.', 'body2', 'color/text/primary');
    await alertBox('warning', 'Email yang sudah terkirim tidak bisa ditarik. Cek dulu data dan alamat emailnya.', th, b);
  }, actions: [{ label: 'Batal' }, { label: 'Kirim 3 Undangan', v: 'contained' }] });
});
wkReg('owner/employees-undangan-akun', 'Karyawan - Undangan terkirim', 'Karyawan', 1000, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDialog(th, f, { title: 'Undangan terkirim', w: 444, build: async (b) => {
    const r = box('r', { dir: 'H', gap: 12, ay: 'MIN', theme: th, parent: b, fillW: true }); icon('check', 24, 'color/success', th, r);
    await txt('Tautan untuk membuat kata sandi sudah dikirim ke budi@perusahaan.co.id. Budi Santoso tinggal membuka tautan itu dan membuat kata sandinya sendiri.', 'body2', 'color/text/primary', th, { parent: r, fillW: true });
    await wkText(th, b, 'Tautan berlaku 24 jam. Kalau email tidak sampai, buka detail karyawan lalu kirim ulang undangan.', 'caption');
  }, actions: [{ label: 'Tutup' }] });
});
wkReg('owner/employees-undangan-gagal', 'Karyawan - Akun dibuat, email gagal terkirim', 'Karyawan', 1000, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDialog(th, f, { title: 'Akun dibuat, tapi email gagal terkirim', w: 444, build: async (b) => {
    await alertBox('warning', 'Akun sudah dibuat, tapi email ke putri@perusahaan.co.id tidak terkirim. Salin tautan di bawah lalu kirim langsung ke karyawan.', th, b);
    await inputField('Tautan undangan', 'https://app.workonix.id/aktivasi?token=CONTOH-TOKEN', th, b, { multiline: 2, endIcon: 'copy' });
    await wkText(th, b, 'Tautan berlaku 24 jam dan cuma bisa dipakai sekali.', 'caption');
  }, actions: [{ label: 'Sudah Disalin' }] });
});

/* Impor Excel */
async function wkImportBody(th, b, stage) {
  await alertBox('info', 'Sheet Petunjuk di template berisi daftar perusahaan, departemen, jabatan, dan lokasi kantor yang sudah terdaftar.', th, b);
  await button(stage === 'awal' ? 'Pilih file .xlsx' : 'karyawan-baru.xlsx', th, b, { v: 'outlined', icon: 'upload', fillW: true });
  if (stage === 'galat') {
    await alertBox('error', 'Ada 2 baris yang bermasalah. Belum ada yang tersimpan.', th, b, 'Impor gagal');
    await table(th, b, { foot: false, cols: [{ t: 'Baris', w: 70 }, { t: 'Kolom', w: 150 }, { t: 'Masalah', w: 'fill' }], rows: [['4', 'Email Kantor', { t: 'Format email tidak valid', sub: 'Isi sel: budi@perusahaan' }], ['7', 'Tanggal Masuk', { t: 'Tanggal harus berformat YYYY-MM-DD', sub: 'Isi sel: 15 Maret 2026' }]] });
  }
  if (stage === 'siap') {
    wkDivider(th, b);
    await alertBox('success', '8 karyawan baru di PT Maju Bersama. 6 di antaranya punya email kantor.', th, b, 'File siap diimpor');
    await alertBox('info', 'Impor tidak mengirim email apa pun. Setelah datanya dicek, pakai tombol Kirim Undangan untuk membuatkan akun login mereka.', th, b);
    await alertBox('warning', 'Baris 3: Jabatan "Staf Gudang" tidak ditemukan, dikosongkan.\nBaris 6: Kantor utama kosong.\nIni hanya peringatan. Impor tetap bisa dilanjutkan.', th, b, '2 peringatan');
  }
}
wkReg('owner/employees-impor', 'Karyawan - Impor Karyawan dari Excel', 'Karyawan', 1000, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDialog(th, f, { title: 'Impor Karyawan dari Excel', w: 600, build: (b) => wkImportBody(th, b, 'awal'), actions: [{ label: 'Batal' }, { label: 'Impor', v: 'contained', disabled: true }] });
});
wkReg('owner/employees-impor-galat', 'Karyawan - Impor gagal (galat baris)', 'Karyawan', 1100, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDialog(th, f, { title: 'Impor Karyawan dari Excel', w: 600, build: (b) => wkImportBody(th, b, 'galat'), actions: [{ label: 'Batal' }, { label: 'Impor', v: 'contained', disabled: true }] });
});
wkReg('owner/employees-impor-siap', 'Karyawan - Impor, file siap', 'Karyawan', 1200, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDialog(th, f, { title: 'Impor Karyawan dari Excel', w: 600, build: (b) => wkImportBody(th, b, 'siap'), actions: [{ label: 'Batal' }, { label: 'Impor', v: 'contained' }] });
});

async function wkProfileImportBody(th, b, stage) {
  await alertBox('info', 'Untuk menambah karyawan baru, pakai tombol Impor Karyawan. Sel yang dibiarkan kosong diabaikan, data lama tidak terhapus.', th, b, 'File ini untuk melengkapi data karyawan yang sudah ada.');
  await button('Unduh Data Karyawan', th, b, { v: 'outlined', size: 'small', icon: 'download' });
  await wkText(th, b, 'File ini sudah berisi data saat ini. Isi kolom yang masih kosong, lalu unggah lagi.', 'caption');
  await button(stage === 'awal' ? 'Pilih File Excel' : 'data-karyawan.xlsx', th, b, { v: 'outlined', icon: 'upload', fillW: true });
  if (stage === 'galat') await alertBox('error', 'Baris 5 · NPWP = "123": NPWP harus 15 atau 16 digit.\nBaris 9 · Tanggal Lahir = "31/02/1990": Tanggal tidak valid.', th, b, '2 baris bermasalah. Belum ada yang tersimpan.');
  if (stage === 'siap') {
    const a = await alertBox('success', 'Dari 12 baris di file.\n4 baris isinya sama dengan data saat ini, jadi tidak diubah.', th, b, '8 karyawan akan diperbarui');
    await txt('YANG AKAN BERUBAH', 'label', 'color/text/secondary', th, { parent: b });
    const list = box('perubahan', { dir: 'V', stroke: 'color/border', radius: 8, theme: th, parent: b, fillW: true, clip: true });
    for (const [n, no, fields] of [['Budi Santoso', 'EMP-000003', ['NIK', 'NPWP', 'Nomor rekening']], ['Siti Rahmawati', 'EMP-000004', ['Alamat Domisili', 'Nomor Telepon']], ['Agus Wijaya', 'EMP-000005', ['BPJS Kesehatan']]]) {
      const r = box('perubahan row', { dir: 'V', gap: 4, pad: [10, 14, 10, 14], stroke: 'color/border', theme: th, parent: list, fillW: true });
      r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0;
      await txt(n, 'body2-strong', 'color/text/primary', th, { parent: r }); await txt(no, 'caption', 'color/text/secondary', th, { parent: r });
      const cr = box('fields', { dir: 'H', gap: 4, theme: th, parent: r }); for (const fl of fields) await chip(fl, th, cr, { variant: 'outlined' });
    }
    await wkText(th, b, 'dan 5 karyawan lainnya.', 'caption');
    await alertBox('warning', 'Impor tetap bisa dilanjutkan. Kolom di bawah ini tidak akan diubah. Perbaiki lewat halaman Karyawan kalau perlu.\nBaris 4 · Email Pribadi sudah dipakai karyawan lain.', th, b, '1 peringatan');
  }
}
wkReg('owner/employees-data-impor', 'Karyawan - Impor Data Karyawan', 'Karyawan', 1000, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDialog(th, f, { title: 'Impor Data Karyawan', w: 600, build: (b) => wkProfileImportBody(th, b, 'awal'), actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained', disabled: true }] });
});
wkReg('owner/employees-data-impor-galat', 'Karyawan - Impor Data Karyawan, galat', 'Karyawan', 1100, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDialog(th, f, { title: 'Impor Data Karyawan', w: 600, build: (b) => wkProfileImportBody(th, b, 'galat'), actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained', disabled: true }] });
});
wkReg('owner/employees-data-impor-siap', 'Karyawan - Impor Data Karyawan, pratinjau', 'Karyawan', 1300, async (th, f, main) => {
  await wkEmpBase(th, main);
  await wkDialog(th, f, { title: 'Impor Data Karyawan', w: 600, build: (b) => wkProfileImportBody(th, b, 'siap'), actions: [{ label: 'Batal' }, { label: 'Perbarui 8 Karyawan', v: 'contained' }] });
});

/* =====================================================================
 * 2. Akses Akun
 * ===================================================================== */
const WK_ACC = [
  ['Budi Santoso', 'EMP-000003 · Teknologi Informasi', 'budi@perusahaan.co.id', false, '+6281234567890', 'Aktif', 'success', 'filled'],
  ['Siti Rahmawati', 'EMP-000004 · Keuangan', 'siti@perusahaan.co.id', false, '+6281311122233', 'Menunggu aktivasi', 'info', 'tint'],
  ['Agus Wijaya', 'EMP-000005 · Operasional', 'agus.w@contoh.id', true, '', 'Belum punya akun', 'warning', 'tint'],
  ['Rina Kartika', 'EMP-000006 · Keuangan', '', false, '08123', 'Belum ada email', 'default', 'tint'],
  ['Putri Handayani', 'EMP-000009 · Operasional', 'putri@perusahaan.co.id', false, '+6285677788899', 'Belum punya akun', 'warning', 'tint'],
];
async function wkAccountPage(th, main, o = {}) {
  await pageHeader(th, main, 'Akses Akun', 'Cek siapa yang sudah bisa login dan siapa yang belum. Buat tautan untuk karyawan baru, yang belum aktivasi, atau yang lupa kata sandi.');
  await alertBox('warning', 'Kirim hanya ke nomor karyawan itu sendiri, jangan ke grup. Membuat tautan baru otomatis membatalkan tautan sebelumnya.', th, main, 'Tautan ini rahasia dan cuma bisa dipakai sekali');
  if (!o.empty) {
    const sr = box('ringkasan', { dir: 'H', gap: 16, theme: th, parent: main, fillW: true });
    await statCard('Total karyawan aktif', '48', null, null, th, sr); await statCard('Belum ada email', '3', null, null, th, sr); await statCard('Belum punya akun', '5', null, null, th, sr); await statCard('Menunggu aktivasi', '7', null, null, th, sr); await statCard('Aktif', '33', null, null, th, sr);
  }
  const tb = toolbar(th, main);
  await inputField('Cari nama atau nomor karyawan', '', th, tb.left, { w: 340, icon: 'search' });
  await inputField('Status akun', o.status ?? 'Semua status', th, tb.left, { w: 220, select: true });
  await inputField('Perusahaan', 'Semua perusahaan', th, tb.left, { w: 210, select: true });
  if (o.error) await alertBox('error', 'Gagal memuat data akses akun. Coba lagi.', th, main);
  if (o.selected) {
    const bar = box('terpilih', { dir: 'H', gap: 12, ay: 'CENTER', pad: [12, 20, 12, 20], fill: 'color/primary', radius: 10, theme: th, parent: main, fillW: true });
    await txt('2 karyawan dipilih', 'body2-strong', onPrimary(th), th, { parent: bar }); spacer(bar);
    const bb = await button('Buat Tautan & Unduh CSV', th, bar, { v: 'contained', color: 'default', size: 'small', icon: 'download' });
    await button('Batal', th, bar, { v: 'text', color: 'default', size: 'small' });
  }
  if (o.empty) {
    const c = card(th, main, { pad: 32, ay: 'CENTER' }); await txt('Tidak ada karyawan yang cocok dengan filter ini. Coba pilih "Semua status".', 'body2', 'color/text/secondary', th, { parent: c, fillW: true, align: 'CENTER' });
    return;
  }
  const rows = WK_ACC.map((a, i) => {
    const noEmail = a[5] === 'Belum ada email'; const noWa = !a[4] || a[4] === '08123';
    return [
      async (c) => checkbox(!!o.selected && (i === 1 || i === 2), th, c),
      { t: a[0], sub: a[1] },
      async (c) => { const t = box('t', { dir: 'V', theme: th, parent: c }); if (a[2]) { await txt(a[2], 'body2', 'color/text/primary', th, { parent: t }); if (a[3]) await txt('Email pribadi', 'caption', 'color/text/secondary', th, { parent: t }); } else await txt('Isi email kantor/pribadi', 'body2', 'color/primary', th, { parent: t }); },
      async (c) => { if (a[4] && !noWa) await txt(a[4], 'body2', 'color/text/primary', th, { parent: c }); else await txt(a[4] ? a[4] + ' (format tidak dikenali)' : 'Belum diisi', 'caption', 'color/text/disabled', th, { parent: c }); },
      { chip: a[5], color: a[6], variant: a[7] === 'filled' ? 'solid' : 'outlined' },
      async (c) => { await button('Kirim WA', th, c, { size: 'small', icon: 'wk-chat', disabled: noEmail || noWa }); await button('Salin', th, c, { v: 'outlined', size: 'small', icon: 'copy', disabled: noEmail }); },
    ];
  });
  await wkTable(th, main, { rowH: 60, cols: [{ w: 28, hfn: async (c) => checkbox(false, th, c) }, { t: 'Karyawan', w: 'fill' }, { t: 'Email Kantor', w: 230 }, { t: 'WhatsApp', w: 190 }, { t: 'Status', w: 160 }, { t: 'Aksi', w: 220, align: 'right' }], rows });
}
wkReg('owner/account-access', 'Akses Akun', 'Akses Akun', 1000, async (th, f, main) => { await wkAccountPage(th, main); });
wkReg('owner/account-access-terpilih', 'Akses Akun - baris dipilih', 'Akses Akun', 1100, async (th, f, main) => { await wkAccountPage(th, main, { selected: true }); });
wkReg('owner/account-access-kosong', 'Akses Akun - kosong', 'Akses Akun', 800, async (th, f, main) => { await wkAccountPage(th, main, { empty: true, status: 'Aktif' }); });
wkReg('owner/account-access-galat', 'Akses Akun - galat', 'Akses Akun', 900, async (th, f, main) => { await wkAccountPage(th, main, { error: true }); });

/* =====================================================================
 * 3. Surat Peringatan
 * ===================================================================== */
const WK_LV = { 'Teguran Lisan': 'default', 'SP 1': 'warning', 'SP 2': 'warning', 'SP 3': 'error' };
async function wkWarnPage(th, main, o = {}) {
  const act = await pageHeader(th, main, 'Surat Peringatan', 'Teguran Lisan, SP 1, SP 2, dan SP 3. Wajib berurutan, dan karyawan langsung dapat notifikasi di aplikasi.');
  await button('Pengaturan', th, act, { v: 'outlined', icon: 'settings' }); await button('Terbitkan Surat', th, act, { icon: 'plus' });
  const tb = toolbar(th, main);
  await inputField('Perusahaan', 'PT Maju Bersama', th, tb.left, { w: 260, select: true });
  await inputField('Cari nama, nomor, atau pelanggaran', '', th, tb.left, { w: 360, icon: 'search' });
  await tabs(['Aktif', 'Perlu evaluasi SP 3', 'Berakhir', 'Dicabut', 'Semua'], o.tab ?? 0, th, main);
  if (o.empty) { await emptyState('gavel', 'Belum ada surat di daftar ini.', '', th, main); return; }
  const rows = [
    [{ t: 'Budi Santoso', sub: 'EMP-000003' }, { chip: 'SP 1', color: 'warning', variant: 'solid' }, { t: 'Terlambat masuk kerja berulang', sub: 'SP/001/SP1/XI/2026' }, '03 Nov 2026', { t: '03 Mei 2027', sub: '160 hari lagi' }, { chip: 'Aktif', color: 'success', variant: 'outlined' }, { icon: 'eye' }],
    [{ t: 'Agus Wijaya', sub: 'EMP-000005' }, { chip: 'SP 2', color: 'warning', variant: 'solid' }, { t: 'Meninggalkan area kerja tanpa izin', sub: 'SP/004/SP2/X/2026' }, '12 Okt 2026', { t: '30 Nov 2026', sub: '6 hari lagi', tc: 'color/warning' }, { chip: 'Aktif', color: 'success', variant: 'outlined' }, { icon: 'wk-eye-off' }],
    [{ t: 'Doni Setiawan', sub: 'EMP-000010' }, { chip: 'SP 3', color: 'error', variant: 'solid' }, { t: 'Absen tanpa keterangan 5 hari', sub: 'SP/002/SP3/V/2026' }, '15 Mei 2026', { t: '15 Nov 2026', sub: 'lewat 9 hari' }, { chip: 'Perlu evaluasi', color: 'error', variant: 'outlined' }, { icon: 'eye' }],
    [{ t: 'Rina Kartika', sub: 'EMP-000006' }, { chip: 'Teguran Lisan', color: 'default', variant: 'solid' }, { t: 'Tidak mengisi laporan harian', sub: 'SP/005/LISAN/XI/2026' }, '18 Nov 2026', { t: '18 Mei 2027', sub: '175 hari lagi' }, { chip: 'Aktif', color: 'success', variant: 'outlined' }, { icon: 'wk-eye-off' }],
  ];
  await table(th, main, { foot: false, cols: [{ t: 'Karyawan', w: 190 }, { t: 'Jenis', w: 140 }, { t: 'Pelanggaran', w: 'fill' }, { t: 'Terbit', w: 120 }, { t: 'Berlaku sampai', w: 150 }, { t: 'Status', w: 150 }, { t: 'Dibaca', w: 70, align: 'center' }], rows });
}
wkReg('owner/warning-letters', 'Surat Peringatan', 'Surat Peringatan', 900, async (th, f, main) => { await wkWarnPage(th, main); });
wkReg('owner/warning-letters-kosong', 'Surat Peringatan - kosong', 'Surat Peringatan', 800, async (th, f, main) => { await wkWarnPage(th, main, { empty: true, tab: 3 }); });

async function wkLevelRow(th, parent, level, title, sub) {
  const r = box('next level', { dir: 'H', gap: 12, ay: 'CENTER', pad: 16, stroke: level === 'SP 3' ? 'color/danger' : 'color/warning', radius: 8, theme: th, parent, fillW: true });
  await chip(level, th, r, { color: WK_LV[level], variant: 'solid', size: 'medium' });
  const t = box('t', { dir: 'V', gap: 2, theme: th, parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
  await txt(title, 'body2-strong', 'color/text/primary', th, { parent: t, fillW: true }); await txt(sub, 'caption', 'color/text/secondary', th, { parent: t, fillW: true });
}
wkReg('owner/warning-letters-terbit', 'Surat Peringatan - Terbitkan Surat', 'Surat Peringatan', 1100, async (th, f, main) => {
  await wkWarnPage(th, main);
  await wkDialog(th, f, { title: 'Terbitkan Surat', w: 600, build: async (b) => {
    await inputField('Karyawan', 'Budi Santoso', th, b, { select: true });
    await wkDate(th, b, 'Tanggal terbit', '24/11/2026');
    await wkLevelRow(th, b, 'SP 2', 'Yang akan diterbitkan: SP 2', 'Berlaku 24 Nov 2026 sampai 24 Mei 2027');
    await wkText(th, b, 'Masih punya SP 1 aktif (SP/001/SP1/XI/2026) sampai 03 Mei 2027, jadi naik satu tingkat.', 'caption');
    await inputField('Pelanggaran', 'Terlambat masuk kerja berulang', th, b, { helper: 'Satu kalimat singkat. Tampil sebagai judul di surat dan di aplikasi karyawan.' });
    await inputField('Detail atau alasan', 'Terlambat lebih dari 30 menit pada 5, 9, dan 12 November 2026 sesuai catatan absensi.', th, b, { multiline: 4, helper: '86 karakter, minimal 10' });
  }, actions: [{ label: 'Batal' }, { label: 'Terbitkan SP 2', v: 'contained' }] });
});
wkReg('owner/warning-letters-terbit-awal', 'Surat Peringatan - Terbitkan, belum pilih karyawan', 'Surat Peringatan', 900, async (th, f, main) => {
  await wkWarnPage(th, main);
  await wkDialog(th, f, { title: 'Terbitkan Surat', w: 600, build: async (b) => {
    await inputField('Karyawan', '', th, b, { select: true });
    await wkDate(th, b, 'Tanggal terbit', '24/11/2026');
    await inputField('Pelanggaran', '', th, b, { helper: 'Satu kalimat singkat. Tampil sebagai judul di surat dan di aplikasi karyawan.' });
    await inputField('Detail atau alasan', '', th, b, { multiline: 4, helper: '0 karakter, minimal 10' });
  }, actions: [{ label: 'Batal' }, { label: 'Terbitkan', v: 'contained', disabled: true }] });
});
wkReg('owner/warning-letters-terbit-blokir', 'Surat Peringatan - Terbitkan, diblokir', 'Surat Peringatan', 900, async (th, f, main) => {
  await wkWarnPage(th, main);
  await wkDialog(th, f, { title: 'Terbitkan Surat', w: 600, build: async (b) => {
    await inputField('Karyawan', 'Doni Setiawan', th, b, { select: true });
    await wkDate(th, b, 'Tanggal terbit', '24/11/2026');
    await alertBox('error', 'Doni Setiawan sudah punya SP 3 yang menunggu evaluasi. Catat hasil evaluasinya dulu sebelum menerbitkan surat baru.', th, b);
    await inputField('Pelanggaran', '', th, b); await inputField('Detail atau alasan', '', th, b, { multiline: 4, helper: '0 karakter, minimal 10' });
  }, actions: [{ label: 'Batal' }, { label: 'Terbitkan', v: 'contained', disabled: true }] });
});

async function wkWarnDetail(th, f, main, o = {}) {
  await wkWarnPage(th, main);
  const sp3 = !!o.sp3; const lv = sp3 ? 'SP 3' : 'SP 2';
  await wkDialog(th, f, { w: 840, close: true, divider: true, gap: 16,
    head: async (hd) => { await chip(lv, th, hd, { color: WK_LV[lv], variant: 'solid', size: 'medium' }); await txt(sp3 ? 'Doni Setiawan' : 'Agus Wijaya', 'h6', 'color/text/primary', th, { parent: hd }); await chip(o.due ? 'Perlu evaluasi' : 'Aktif', th, hd, { color: o.due ? 'error' : 'success', variant: 'outlined' }); },
    build: async (b) => {
      if (o.due) await alertBox('error', 'Masa evaluasi SP 3 berakhir 15 Nov 2026. Catat hasilnya: membaik atau diberhentikan.', th, b);
      const rows = [['Nomor surat', sp3 ? 'SP/002/SP3/V/2026' : 'SP/004/SP2/X/2026'], ['Karyawan', sp3 ? 'Doni Setiawan · EMP-000010 · Staf Gudang · Operasional' : 'Agus Wijaya · EMP-000005 · Supervisor Gudang · Operasional'], [sp3 ? 'Masa evaluasi' : 'Berlaku', sp3 ? '15 Mei 2026 sampai 15 Nov 2026' : '12 Okt 2026 sampai 30 Nov 2026'], ['Diterbitkan oleh', 'Hendra Gunawan'], ['Dibuka karyawan', 'Belum dibuka']];
      for (const r of rows) await kv(r[0], r[1], th, b);
      wkDivider(th, b);
      await txt(sp3 ? 'Absen tanpa keterangan 5 hari' : 'Meninggalkan area kerja tanpa izin', 'subtitle', 'color/text/primary', th, { parent: b, fillW: true });
      await wkText(th, b, sp3 ? 'Tidak masuk kerja pada 4 sampai 8 Mei 2026 tanpa keterangan dan tidak dapat dihubungi, melanggar peraturan perusahaan pasal 12.' : 'Meninggalkan area gudang selama jam kerja pada 9 Oktober 2026 tanpa izin atasan, melanggar peraturan perusahaan pasal 8.', 'body2', 'color/text/primary');
      wkDivider(th, b);
      await txt('Riwayat surat karyawan ini', 'body2-strong', 'color/text/primary', th, { parent: b, fillW: true });
      const hr = box('riwayat', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: b, fillW: true });
      await chip('SP 1', th, hr, { color: 'warning', variant: 'solid' }); const ht = await txt('03 Agu 2026 · Terlambat masuk kerja berulang', 'body2', 'color/text/primary', th, { parent: hr }); ht.layoutGrow = 1; ht.layoutSizingHorizontal = 'FILL'; ht.textAutoResize = 'HEIGHT';
      await chip('Berakhir', th, hr, { color: 'default', variant: 'outlined' });
      if (o.mode === 'revoke') {
        wkDivider(th, b);
        await txt('Cabut surat ini', 'body2-strong', 'color/text/primary', th, { parent: b, fillW: true });
        await inputField('Alasan pencabutan', 'Surat diterbitkan untuk karyawan yang salah', th, b, { multiline: 2, helper: 'Tercatat di surat dan terlihat oleh karyawan.' });
        const ar = box('aksi', { dir: 'H', gap: 8, ax: 'MAX', theme: th, parent: b, fillW: true }); await button('Batal', th, ar, { v: 'text' }); await button('Cabut Surat', th, ar, { color: 'error' });
      }
      if (o.mode === 'evaluate') {
        wkDivider(th, b);
        await txt('Hasil evaluasi SP 3', 'body2-strong', 'color/text/primary', th, { parent: b, fillW: true });
        const br = box('hasil', { dir: 'H', gap: 12, theme: th, parent: b }); await button('Ada perbaikan', th, br, { v: 'outlined', color: 'success' }); await button('Tidak ada perbaikan', th, br, { color: 'error' });
        await inputField('Catatan (opsional)', 'Tidak ada perbaikan selama masa evaluasi', th, b, { multiline: 2 });
        const sr = box('ubah status', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: b }); checkbox(true, th, sr); await txt('Ubah status Doni Setiawan jadi Diberhentikan per hari ini', 'body2', 'color/text/primary', th, { parent: sr });
        await wkText(th, b, 'Akses login karyawan akan ditutup. Kalau tanggal berhentinya berbeda, matikan pilihan ini lalu ubah lewat halaman Karyawan.', 'caption');
        const ar = box('aksi', { dir: 'H', gap: 8, ax: 'MAX', theme: th, parent: b, fillW: true }); await button('Batal', th, ar, { v: 'text' }); await button('Simpan Hasil', th, ar, { color: 'error' });
      }
    },
    left: async (ft) => { if (o.mode) return; await button('Unduh PDF', th, ft, { v: 'text', icon: 'download' }); spacer(ft); },
    actions: o.mode ? [] : (sp3 ? [{ label: 'Cabut', color: 'error' }, { label: 'Catat Hasil Evaluasi', v: 'contained' }] : [{ label: 'Cabut', color: 'error' }]) });
}
wkReg('owner/warning-letters-detail', 'Surat Peringatan - Pratinjau SP 2', 'Surat Peringatan', 1200, async (th, f, main) => { await wkWarnDetail(th, f, main, {}); });
wkReg('owner/warning-letters-cabut', 'Surat Peringatan - Cabut surat', 'Surat Peringatan', 1300, async (th, f, main) => { await wkWarnDetail(th, f, main, { mode: 'revoke' }); });
wkReg('owner/warning-letters-evaluasi-due', 'Surat Peringatan - SP 3 perlu evaluasi', 'Surat Peringatan', 1300, async (th, f, main) => { await wkWarnDetail(th, f, main, { sp3: true, due: true }); });
wkReg('owner/warning-letters-evaluasi', 'Surat Peringatan - Catat hasil evaluasi SP 3', 'Surat Peringatan', 1500, async (th, f, main) => { await wkWarnDetail(th, f, main, { sp3: true, due: true, mode: 'evaluate' }); });
wkReg('owner/warning-letters-dicabut', 'Surat Peringatan - Surat dicabut', 'Surat Peringatan', 1200, async (th, f, main) => {
  await wkWarnPage(th, main, { tab: 3 });
  await wkDialog(th, f, { w: 840, close: true, divider: true,
    head: async (hd) => { await chip('SP 1', th, hd, { color: 'warning', variant: 'solid', size: 'medium' }); await txt('Rina Kartika', 'h6', 'color/text/primary', th, { parent: hd }); await chip('Dicabut', th, hd, { color: 'default', variant: 'outlined' }); },
    build: async (b) => {
      await alertBox('info', 'Dicabut 20/11/2026 oleh Hendra Gunawan. Alasan: Surat diterbitkan untuk karyawan yang salah', th, b);
      for (const r of [['Nomor surat', 'SP/003/SP1/XI/2026'], ['Karyawan', 'Rina Kartika · EMP-000006 · Akuntan · Keuangan'], ['Berlaku', '18 Nov 2026 sampai 18 Mei 2027'], ['Diterbitkan oleh', 'Hendra Gunawan'], ['Dibuka karyawan', '19/11/2026 08.14']]) await kv(r[0], r[1], th, b);
    }, left: async (ft) => { await button('Unduh PDF', th, ft, { v: 'text', icon: 'download' }); spacer(ft); }, actions: [] });
});
wkReg('owner/warning-letters-pengaturan', 'Surat Peringatan - Pengaturan Surat Peringatan', 'Surat Peringatan', 1300, async (th, f, main) => {
  await wkWarnPage(th, main);
  await wkDialog(th, f, { title: 'Pengaturan Surat Peringatan', w: 600, build: async (b) => {
    await wkSection(th, b, 'Masa berlaku');
    const r1 = wkRow(th, b, 12); await inputField('Teguran Lisan', '3', th, r1, { endIcon: 'calendar' }); await inputField('SP 1', '6', th, r1, { helper: undefined });
    const r2 = wkRow(th, b, 12); await inputField('SP 2', '6', th, r2); await inputField('SP 3 (masa evaluasi)', '6', th, r2);
    await wkText(th, b, 'Nilai dalam bulan. Berlaku untuk surat yang terbit setelah disimpan. Surat lama tetap memakai tanggal berakhirnya.', 'caption');
    await wkSection(th, b, 'Nomor surat');
    await inputField('Format', '{no}/SP/{jenis}/{bulan}/{tahun}', th, b, { helper: 'Penanda: {no} nomor urut, {jenis} LISAN/SP1/SP2/SP3, {bulan} bulan romawi, {tahun}. Contoh: 001/SP/SP1/XI/2026' });
    await wkSection(th, b, 'Kop dan tanda tangan di PDF');
    await inputField('Alamat perusahaan', 'Jl. Jenderal Sudirman No. 10, Jakarta Pusat', th, b, { multiline: 2 });
    await inputField('Kota tempat surat dibuat', 'Jakarta', th, b);
    const r3 = wkRow(th, b, 12); await inputField('Nama penandatangan', 'Hendra Gunawan', th, r3); await inputField('Jabatan penandatangan', 'HRD Manager', th, r3);
  }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained' }] });
});

/* =====================================================================
 * 4. Hak Akses
 * ===================================================================== */
const WK_MODULES = [
  ['Dasbor & Laporan', 'Dasbor dan Laporan Pengajuan'], ['Karyawan', 'Data karyawan, profil, riwayat, penyetuju, impor'], ['Akses Akun', 'Tautan aktivasi, reset perangkat'],
  ['Surat Peringatan', 'Teguran lisan dan SP'], ['Kehadiran', 'Rekap absensi, koreksi absensi, aturan absensi, lokasi kantor'], ['Jadwal & Shift', 'Roster, shift, hari libur'],
  ['Cuti', 'Pengajuan, saldo, dan pengaturan cuti'], ['Lembur', 'Pengajuan, rekap, dan pengaturan lembur'], ['Payroll', 'Komponen, struktur, penetapan, proses payroll, slip'],
  ['Organisasi', 'Perusahaan, struktur, jabatan'], ['Daily Timesheet', 'Catatan kerja harian semua departemen dan pilihan formulir'],
];
const WK_LEVELS = ['Tidak ada', 'Lihat', 'Kelola']; const WK_KINDS = ['none', 'view', 'manage'];
const WK_MGR = [1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1]; // 0 Tidak ada, 1 Lihat, 2 Kelola (manajer)
const WK_RP_TABS = ['Per Peran', 'Per Karyawan'];

async function wkRolePageHead(th, main, o = {}) {
  const act = await pageHeader(th, main, 'Hak Akses', 'Atur apa yang boleh dibuka Admin HR, Manajer, dan karyawan tertentu. Pemilik selalu punya akses penuh.');
  if (o.role) { if (o.dirty) await button('Batalkan', th, act, { v: 'text' }); await button('Simpan', th, act, { v: 'contained', disabled: !o.dirty }); }
  await tabs(WK_RP_TABS, o.role ? 0 : 1, th, main);
}
wkReg('owner/role-permissions', 'Hak Akses - Per Peran', 'Hak Akses', 1250, async (th, f, main) => {
  await wkRolePageHead(th, main, { role: true, dirty: true });
  const al = await alertBox('info', 'Lihat: bisa membuka halaman, tidak bisa mengubah apa pun. Kelola: bisa menambah, mengubah, dan menghapus. Manajer yang diberi akses apa pun akan mendapat menu Panel HR. Untuk memberi akses ke karyawan tertentu (mis. staf finance), pakai tab Per Karyawan. Persetujuan pengajuan tetap mengikuti atasan masing-masing, tidak diatur di sini.', th, main);
  const rows = WK_MODULES.map((m, i) => [
    { t: m[0], sub: m[1] },
    async (c) => wkSegment(th, c, WK_LEVELS, 2, WK_KINDS),
    async (c) => wkSegment(th, c, WK_LEVELS, i === 2 ? 1 : WK_MGR[i], WK_KINDS),
  ]);
  const hdr = (label, hint) => async (c) => { const t = box('t', { dir: 'V', ay: 'CENTER', theme: th, parent: c }); await txt(label, 'th', 'color/text/secondary', th, { parent: t, upper: true }); await txt(hint, 'caption', 'color/text/secondary', th, { parent: t }); };
  await wkTable(th, main, { rowH: 60, headH: 56, cols: [{ t: 'Modul', w: 'fill' }, { w: 330, align: 'center', hfn: hdr('Admin HR', 'Bawaan: kelola semua') }, { w: 330, align: 'center', hfn: hdr('Manajer', 'Bawaan: tidak masuk dashboard HR') }], rows });
});
wkReg('owner/role-permissions-galat', 'Hak Akses - galat memuat', 'Hak Akses', 700, async (th, f, main) => {
  await wkRolePageHead(th, main, { role: true });
  await alertBox('error', 'Gagal memuat hak akses. Coba lagi.', th, main);
});

const WK_OVR = [
  ['Siti Rahmawati', 'EMP-000004', 'Staf Keuangan', 'Karyawan', [['Payroll', 'Kelola'], ['Dasbor & Laporan', 'Lihat']], 'Hendra Gunawan', '20 Nov 2026 14.05'],
  ['Maya Anggraini', 'EMP-000008', 'Staf Rekrutmen', 'Karyawan', [['Karyawan', 'Kelola'], ['Akses Akun', 'Lihat'], ['Surat Peringatan', 'Lihat']], 'Hendra Gunawan', '12 Nov 2026 09.30'],
  ['Agus Wijaya', 'EMP-000005', 'Supervisor Gudang', 'Manajer', [['Daily Timesheet', 'Kelola'], ['Lembur', 'Lihat']], 'Dewi Lestari', '02 Nov 2026 16.45'],
];
async function wkEmpAccessList(th, main, o = {}) {
  await wkRolePageHead(th, main, {});
  const top = box('intro', { dir: 'H', gap: 24, ay: 'MIN', theme: th, parent: main, fillW: true });
  const t = await txt('Beri karyawan tertentu akses ke modul dashboard HR tanpa menjadikannya Admin HR, misalnya staf finance untuk Payroll. Karyawan biasa yang diberi akses dihitung sebagai akun admin di paket langganan.', 'body2', 'color/text/secondary', th, { parent: top }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT';
  await button('Tambah karyawan', th, top, { icon: 'plus' });
  if (o.error) await alertBox('error', 'Gagal memuat akses khusus. Coba lagi.', th, main);
  if (o.empty) {
    const c = card(th, main, { pad: 32, gap: 4, ay: 'CENTER' });
    await txt('Belum ada karyawan dengan akses khusus', 'body2-strong', 'color/text/primary', th, { parent: c, align: 'CENTER' });
    await txt('Semua karyawan dan manajer mengikuti hak akses perannya.', 'body2', 'color/text/secondary', th, { parent: c, align: 'CENTER' });
    return;
  }
  const rows = WK_OVR.map((r) => [
    async (c) => { const t2 = box('t', { dir: 'V', gap: 2, theme: th, parent: c }); const h = box('h', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: t2 }); await txt(r[0], 'body2-strong', 'color/text/primary', th, { parent: h }); await chip(r[3], th, h); await txt(r[1] + ' · ' + r[2], 'caption', 'color/text/secondary', th, { parent: t2 }); },
    async (c) => { const w = box('chips', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: c }); for (const [m, l] of r[4]) await chip(m + ': ' + l, th, w, { color: l === 'Kelola' ? 'primary' : 'info', variant: 'outlined' }); },
    { t: r[5], sub: r[6] },
    async (c) => { await button('Ubah', th, c, { v: 'text', size: 'small' }); await button('Cabut', th, c, { v: 'text', color: 'error', size: 'small' }); },
  ]);
  await wkTable(th, main, { rowH: 64, cols: [{ t: 'Karyawan', w: 280 }, { t: 'Akses khusus', w: 'fill' }, { t: 'Terakhir diubah', w: 180 }, { t: '', w: 150, align: 'right' }], rows });
}
wkReg('owner/role-permissions-karyawan', 'Hak Akses - Per Karyawan', 'Hak Akses', 800, async (th, f, main) => { await wkEmpAccessList(th, main); });
wkReg('owner/role-permissions-karyawan-kosong', 'Hak Akses - Per Karyawan kosong', 'Hak Akses', 700, async (th, f, main) => { await wkEmpAccessList(th, main, { empty: true }); });
wkReg('owner/role-permissions-karyawan-galat', 'Hak Akses - Per Karyawan galat', 'Hak Akses', 700, async (th, f, main) => { await wkEmpAccessList(th, main, { error: true, empty: true }); });

async function wkAccessDialog(th, f, main, o = {}) {
  await wkEmpAccessList(th, main);
  const choice = o.edit ? [3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0] : [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2]; // 0 Ikut peran, 1 Tidak ada, 2 Lihat, 3 Kelola
  const lv = (i) => (i === 3 ? 2 : i === 2 ? 1 : i === 1 ? 0 : 0);
  await wkDialog(th, f, { title: o.edit ? 'Akses khusus: Siti Rahmawati' : 'Tambah akses khusus', w: 900, divider: true, gap: 16, build: async (b) => {
    if (!o.edit) await inputField('Karyawan', o.picked ? 'Putri Handayani' : '', th, b, { select: true, helper: o.picked ? undefined : 'Cari nama atau nomor karyawan' });
    const ch = ['Ikut peran (Tidak ada)', 'Tidak ada', 'Lihat', 'Kelola']; const kinds = ['none', 'none', 'view', 'manage'];
    await wkText(th, b, 'Ikut peran: memakai hak akses peran Karyawan (karyawan biasa tidak punya akses lewat perannya).', 'caption');
    const rows = WK_MODULES.map((m, i) => [{ t: m[0], sub: m[1] }, async (c) => wkSegment(th, c, ch, o.edit ? ([8].includes(i) ? 3 : i === 0 ? 2 : 0) : (o.picked ? ([8, 10].includes(i) ? 3 : 0) : 0), kinds)]);
    await wkTable(th, b, { rowH: 52, headH: 8, cols: [{ w: 'fill' }, { w: 360, align: 'right' }], rows });
    if (!o.edit && o.picked) await alertBox('warning', 'Karyawan ini akan dihitung sebagai akun admin di paket langganan dan mendapat menu Panel HR di portal karyawan.', th, b);
    if (o.error) await alertBox('error', 'Gagal menyimpan akses khusus. Coba lagi.', th, b);
  }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained', disabled: !o.edit && !o.picked }] });
}
wkReg('owner/role-permissions-karyawan-tambah', 'Hak Akses - Tambah akses khusus', 'Hak Akses', 1250, async (th, f, main) => { await wkAccessDialog(th, f, main, {}); });
wkReg('owner/role-permissions-karyawan-tambah-pilih', 'Hak Akses - Tambah akses khusus, karyawan dipilih', 'Hak Akses', 1350, async (th, f, main) => { await wkAccessDialog(th, f, main, { picked: true }); });
wkReg('owner/role-permissions-karyawan-ubah', 'Hak Akses - Ubah akses khusus karyawan', 'Hak Akses', 1250, async (th, f, main) => { await wkAccessDialog(th, f, main, { edit: true }); });
wkReg('owner/role-permissions-karyawan-cabut', 'Hak Akses - Cabut akses khusus?', 'Hak Akses', 800, async (th, f, main) => {
  await wkEmpAccessList(th, main);
  await wkDialog(th, f, { title: 'Cabut akses khusus?', w: 444, build: async (b) => { await wkText(th, b, 'Siti Rahmawati akan kembali mengikuti hak akses perannya dan tidak bisa lagi membuka dashboard HR.', 'body2', 'color/text/secondary'); }, actions: [{ label: 'Batal' }, { label: 'Cabut akses', v: 'contained', color: 'error' }] });
});
