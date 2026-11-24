/* Organisasi (owner): Daftar Perusahaan, Struktur Perusahaan, Jabatan, Struktur Organisasi, Lokasi Kantor. Prefiks: wo / WO_ */
const WO_GROUP = 'Organisasi';
registerIcons({
  'wo-minus': '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  'wo-plus-circle': '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  'wo-arrow': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'wo-unlink': '<path d="M9 15l-1 1a4 4 0 0 1-6-6l3-3M15 9l1-1a4 4 0 0 1 6 6l-3 3M4 4l16 16"/>',
  'wo-target': '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  'wo-tree': '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-4h12v4"/>',
  'wo-unfold': '<path d="M8 8l4-4 4 4M8 16l4 4 4-4"/>',
  'wo-fold': '<path d="M8 4l4 4 4-4M8 20l4-4 4 4"/>',
  'wo-external': '<path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5"/>',
});

const WO_COMPANY = 'PT Maju Bersama';
const woCancel = { label: 'Batal' };
const woSave = { label: 'Simpan', v: 'contained' };
const woDel = { label: 'Hapus', v: 'contained', color: 'error' };

async function woHeader(th, main, title, sub, btn, o = {}) {
  const act = await pageHeader(th, main, title, sub);
  await button(btn, th, act, { icon: 'plus', disabled: !!o.disabled });
  return act;
}
async function woGridCard(th, main, o) { // kartu berisi tabel (DataGrid)
  const c = card(th, main, { pad: 0, clip: true });
  if (o.filter) { const bar = box('filter', { dir: 'H', gap: 12, ay: 'CENTER', pad: 16, stroke: 'color/border', theme: th, parent: c, fillW: true }); bar.strokeTopWeight = 0; bar.strokeLeftWeight = 0; bar.strokeRightWeight = 0; await o.filter(bar); }
  const t = await table(th, c, o.table); t.strokeWeight = 0; t.cornerRadius = 0; t.layoutSizingHorizontal = 'FILL';
  return c;
}
async function woPage(th, active, h) { return page('x', th, { role: 'owner', active, h }); }
async function woSelectF(label, value, th, parent, o = {}) { return inputField(label, value, th, parent, Object.assign({ select: true }, o)); }

/* ---------- Daftar Perusahaan ---------- */
const WO_COMPANIES = [['PT Maju Bersama', '12 Jan 2025'], ['PT Maju Logistik', '03 Mar 2025'], ['PT Maju Digital', '21 Agu 2025']];
async function woCompaniesBase(th, rows, opts = {}) {
  const { f, main } = await woPage(th, 'Daftar Perusahaan', opts.h ?? 900);
  await woHeader(th, main, 'Perusahaan', `${rows.length} perusahaan di grup ini`, 'Tambah Perusahaan');
  if (opts.error) await alertBox('error', 'Gagal memuat data. Coba lagi.', th, main);
  if (rows.length === 0 && !opts.error) {
    const c = card(th, main, { pad: 0 });
    await emptyState('building', 'Belum ada perusahaan', 'Tambahkan perusahaan pertama untuk grup ini.', th, c);
  } else {
    await woGridCard(th, main, { table: { cols: [{ t: 'Nama Perusahaan', w: 'fill' }, { t: 'Dibuat', w: 160 }, { t: '', w: 100, align: 'right' }], rows: rows.map((r) => [r[0], r[1], { actions: ['edit', 'trash'] }]), foot: rows.length ? undefined : '0–0 dari 0' } });
  }
  return { f, main };
}
registerScreen({ key: 'owner/companies', group: WO_GROUP, title: 'Daftar Perusahaan', build: async (th) => (await woCompaniesBase(th, WO_COMPANIES)).f });
registerScreen({ key: 'owner/companies-kosong', group: WO_GROUP, title: 'Daftar Perusahaan (kosong)', build: async (th) => (await woCompaniesBase(th, [])).f });
registerScreen({ key: 'owner/companies-galat', group: WO_GROUP, title: 'Daftar Perusahaan (galat)', build: async (th) => (await woCompaniesBase(th, [], { error: true })).f });
registerScreen({ key: 'owner/companies-tambah', group: WO_GROUP, title: 'Perusahaan: Tambah', build: async (th) => {
  const { f } = await woCompaniesBase(th, WO_COMPANIES);
  await dialog(th, f, { title: 'Tambah Perusahaan', w: 444, build: async (b) => { await inputField('Nama Perusahaan', '', th, b, { required: true, focus: true }); }, actions: [woCancel, woSave] });
  return f;
} });
registerScreen({ key: 'owner/companies-ubah', group: WO_GROUP, title: 'Perusahaan: Ubah', build: async (th) => {
  const { f } = await woCompaniesBase(th, WO_COMPANIES);
  await dialog(th, f, { title: 'Ubah Perusahaan', w: 444, build: async (b) => { await inputField('Nama Perusahaan', 'PT Maju Logistik', th, b, { required: true, focus: true }); }, actions: [woCancel, woSave] });
  return f;
} });
registerScreen({ key: 'owner/companies-hapus', group: WO_GROUP, title: 'Perusahaan: Hapus', build: async (th) => {
  const { f } = await woCompaniesBase(th, WO_COMPANIES);
  await dialog(th, f, { title: 'Hapus Perusahaan?', w: 444, build: async (b) => { await txt('PT Maju Logistik akan dihapus bersama semua departemen, jabatan, dan karyawan di dalamnya. Ini tidak bisa dibatalkan.', 'body2', 'color/text/primary', th, { parent: b, fillW: true }); }, actions: [woCancel, woDel] });
  return f;
} });

/* ---------- Struktur Perusahaan (pohon departemen) ---------- */
async function woTreeCard(th, parent, n) { // kartu simpul pohon
  const c = box('node', { dir: 'H', gap: 8, ay: 'CENTER', pad: [8, 10, 8, 10], stroke: 'color/border', fill: 'color/surface', radius: 12, theme: th, parent });
  c.counterAxisSizingMode = 'FIXED'; c.resize(380, 52); c.primaryAxisSizingMode = 'FIXED';
  if (n.add) icon('wo-plus-circle', 22, 'color/primary', th, c); else vgap(c, 22);
  const lab = box('label', { dir: 'H', gap: 4, ay: 'CENTER', theme: th, parent: c }); lab.layoutGrow = 1; lab.layoutSizingHorizontal = 'FILL';
  if (n.chev) icon(n.chev === 'open' ? 'down' : 'chevron', 18, 'color/text/secondary', th, lab);
  const t = await txt(n.label + (n.count ? ` (${n.count} orang)` : ''), n.company ? 'body2-strong' : 'body2', 'color/primary-dark', th, { parent: lab }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT';
  if (n.hidden) await txt(`· ${n.hidden} sub-unit tersembunyi`, 'caption', 'color/text/secondary', th, { parent: lab });
  if (n.del) icon('wo-minus', 20, 'color/danger', th, c);
  if (!n.group) icon('edit', 18, 'color/warning', th, c);
  if (n.count) icon('users', 18, 'color/text/secondary', th, c);
  return c;
}
async function woTreeNode(th, parent, n) {
  const w = box('tree', { dir: 'V', theme: th, parent });
  await woTreeCard(th, w, n);
  if (n.kids && n.kids.length) {
    const ind = box('children', { dir: 'V', gap: 12, pad: [12, 0, 0, 24], stroke: 'color/border', theme: th, parent: w });
    ind.strokeTopWeight = 0; ind.strokeRightWeight = 0; ind.strokeBottomWeight = 0; ind.strokeWeight = 1;
    ind.paddingLeft = 24;
    const wrap = box('indent', { dir: 'V', pad: [0, 0, 0, 24], theme: th, parent: w });
    wrap.appendChild(ind);
    for (const k of n.kids) await woTreeNode(th, ind, k);
  }
  return w;
}
const WO_TREE = { label: 'PT Maju Bersama', company: true, add: true, kids: [
  { label: 'Teknologi Informasi', add: true, chev: 'open', count: 6, kids: [{ label: 'Pengembangan Aplikasi', add: true, count: 4 }, { label: 'Infrastruktur', add: true, del: true }] },
  { label: 'Keuangan', add: true, chev: 'closed', count: 3, hidden: 2 },
  { label: 'Operasional', add: true, count: 8 },
  { label: 'SDM', add: true, count: 3 }] };
async function woDeptBase(th, o = {}) {
  const { f, main } = await woPage(th, 'Struktur Perusahaan', o.h ?? 1000);
  const act = await pageHeader(th, main, 'Struktur Perusahaan', o.empty ? '0 perusahaan · 0 departemen' : '3 perusahaan · 12 departemen');
  await button('Tambah Departemen', th, act, { icon: 'plus', disabled: !!o.empty });
  if (o.error) await alertBox('error', 'Gagal memuat data. Coba lagi.', th, main);
  if (o.empty) await alertBox('info', 'Tambah perusahaan dulu sebelum membuat departemen.', th, main);
  const c = card(th, main, { pad: 0, clip: true });
  const bar = box('filter', { dir: 'H', ay: 'CENTER', pad: 16, stroke: 'color/border', theme: th, parent: c, fillW: true }); bar.strokeTopWeight = 0; bar.strokeLeftWeight = 0; bar.strokeRightWeight = 0;
  await woSelectF('Semua Perusahaan', '', th, bar, { w: 240 }); spacer(bar);
  const bb = box('bulk', { dir: 'H', gap: 8, theme: th, parent: bar });
  await button('Buka semua', th, bb, { v: 'text', size: 'small', icon: 'wo-unfold' }); await button('Tutup semua', th, bb, { v: 'text', size: 'small', icon: 'wo-fold' });
  const body = box('tree', { dir: 'V', pad: 24, theme: th, parent: c, fillW: true });
  if (o.loading) { const l = box('loading', { dir: 'V', ay: 'CENTER', ax: 'CENTER', pad: [48, 0, 48, 0], theme: th, parent: body, fillW: true }); icon('refresh', 32, 'color/primary', th, l); }
  else if (o.empty) await emptyState('wo-tree', 'Belum ada struktur', 'Tambahkan perusahaan dan departemen untuk membentuk struktur.', th, body);
  else await woTreeNode(th, body, WO_TREE);
  return { f, main };
}
registerScreen({ key: 'owner/departments', group: WO_GROUP, title: 'Struktur Perusahaan', build: async (th) => (await woDeptBase(th)).f });
registerScreen({ key: 'owner/departments-memuat', group: WO_GROUP, title: 'Struktur Perusahaan (memuat)', build: async (th) => (await woDeptBase(th, { loading: true, h: 700 })).f });
registerScreen({ key: 'owner/departments-kosong', group: WO_GROUP, title: 'Struktur Perusahaan (kosong)', build: async (th) => (await woDeptBase(th, { empty: true, h: 700 })).f });
registerScreen({ key: 'owner/departments-galat', group: WO_GROUP, title: 'Struktur Perusahaan (galat)', build: async (th) => (await woDeptBase(th, { error: true, loading: true, h: 700 })).f });
registerScreen({ key: 'owner/departments-tambah', group: WO_GROUP, title: 'Departemen: Tambah', build: async (th) => {
  const { f } = await woDeptBase(th);
  await dialog(th, f, { title: 'Tambah Departemen', w: 444, build: async (b) => {
    await woSelectF('Perusahaan', WO_COMPANY, th, b, { required: true }); await woSelectF('Berada di bawah', 'Langsung di bawah PT Maju Bersama', th, b);
    await inputField('Nama Departemen', '', th, b, { required: true, focus: true }); }, actions: [woCancel, { label: 'Simpan', v: 'contained', disabled: true }] });
  return f;
} });
registerScreen({ key: 'owner/departments-ubah', group: WO_GROUP, title: 'Departemen: Ubah', build: async (th) => {
  const { f } = await woDeptBase(th);
  await dialog(th, f, { title: 'Ubah Departemen', w: 444, build: async (b) => {
    await woSelectF('Berada di bawah', 'Teknologi Informasi', th, b); await inputField('Nama Departemen', 'Infrastruktur', th, b, { required: true, focus: true }); }, actions: [woCancel, woSave] });
  return f;
} });
registerScreen({ key: 'owner/departments-ubah-perusahaan', group: WO_GROUP, title: 'Departemen: Ubah Perusahaan', build: async (th) => {
  const { f } = await woDeptBase(th);
  await dialog(th, f, { title: 'Ubah Perusahaan', w: 444, build: async (b) => { await inputField('Nama Perusahaan', WO_COMPANY, th, b, { required: true, focus: true }); }, actions: [woCancel, woSave] });
  return f;
} });
registerScreen({ key: 'owner/departments-hapus', group: WO_GROUP, title: 'Departemen: Hapus', build: async (th) => {
  const { f } = await woDeptBase(th);
  await dialog(th, f, { title: 'Hapus Departemen?', w: 444, build: async (b) => { await txt('Infrastruktur akan dihapus bersama semua jabatan di dalamnya.', 'body2', 'color/text/primary', th, { parent: b, fillW: true }); }, actions: [woCancel, woDel] });
  return f;
} });
registerScreen({ key: 'owner/departments-anggota', group: WO_GROUP, title: 'Departemen: Anggota', build: async (th) => {
  const { f } = await woDeptBase(th);
  const members = [['BS', 'Budi Santoso', 'EMP-000003 · Staf IT'], ['DL', 'Dewi Lestari', 'EMP-000004 · Manajer TI'], ['AW', 'Agus Wijaya', 'EMP-000007 · Staf IT'], ['DS', 'Doni Setiawan', 'EMP-000010 · Staf IT']];
  await dialog(th, f, { title: 'Teknologi Informasi', w: 444, build: async (b) => {
    await txt('6 karyawan aktif', 'body2', 'color/text/secondary', th, { parent: b });
    for (const m of members) { const r = box('member', { dir: 'H', gap: 12, ay: 'CENTER', pad: [4, 0, 4, 0], theme: th, parent: b, fillW: true }); await avatar(m[0], 32, th, r); const t = box('t', { dir: 'V', theme: th, parent: r }); await txt(m[1], 'body2-strong', 'color/text/primary', th, { parent: t }); await txt(m[2], 'caption', 'color/text/secondary', th, { parent: t }); }
  }, actions: [{ label: 'Tutup' }] });
  return f;
} });

/* ---------- Jabatan ---------- */
const WO_POS = [['Staf IT', 1, 'Teknologi Informasi'], ['Supervisor IT', 2, 'Teknologi Informasi'], ['Manajer Keuangan', 3, 'Keuangan'], ['Staf Operasional', 1, 'Operasional'], ['Manajer SDM', 3, 'SDM'], ['Direktur Operasional', 5, 'Operasional']];
const WO_LEVEL_HINT = { 1: 'Staff / pelaksana', 2: 'Supervisor / koordinator', 3: 'Manager', 4: 'General Manager', 5: 'Direksi' };
async function woPosBase(th, o = {}) {
  const rows = o.empty ? [] : (o.flat ? WO_POS.map((p) => [p[0], 1, p[2]]) : WO_POS);
  const { f, main } = await woPage(th, 'Jabatan', o.h ?? 1000);
  const act = await pageHeader(th, main, 'Jabatan', `${rows.length} jabatan`);
  await button('Tambah Jabatan', th, act, { icon: 'plus', disabled: !!o.noDept });
  if (o.error) await alertBox('error', 'Gagal memuat data. Coba lagi.', th, main);
  if (o.noDept) await alertBox('info', 'Tambah departemen dulu sebelum membuat jabatan.', th, main);
  if (o.flat) await alertBox('warning', 'Semua jabatan masih level 1. Aturan jatah cuti per level belum akan berlaku sampai levelnya diisi, misalnya Staff 1, Supervisor 2, Manager 3.', th, main);
  if (rows.length === 0 && !o.error) {
    const c = card(th, main, { pad: 0 });
    await emptyState('users', 'Belum ada jabatan', 'Tambahkan jabatan pertama untuk departemen.', th, c);
  } else {
    await woGridCard(th, main, { filter: async (bar) => { await woSelectF('Semua Departemen', '', th, bar, { w: 360 }); },
      table: { cols: [{ t: 'Jabatan', w: 'fill' }, { t: 'Level', w: 160 }, { t: 'Departemen', w: 'fill' }, { t: '', w: 100, align: 'right' }],
        rows: rows.map((p) => [p[0], p[1] > 1 ? { chip: 'L' + p[1], color: 'primary', variant: 'solid' } : { chip: 'L1', color: 'default', variant: 'outlined' }, p[2], { actions: ['edit', 'trash'] }]) } });
  }
  return { f, main };
}
registerScreen({ key: 'owner/positions', group: WO_GROUP, title: 'Jabatan', build: async (th) => (await woPosBase(th)).f });
registerScreen({ key: 'owner/positions-level-1', group: WO_GROUP, title: 'Jabatan (semua level 1)', build: async (th) => (await woPosBase(th, { flat: true, h: 1100 })).f });
registerScreen({ key: 'owner/positions-kosong', group: WO_GROUP, title: 'Jabatan (kosong)', build: async (th) => (await woPosBase(th, { empty: true, h: 700 })).f });
registerScreen({ key: 'owner/positions-tanpa-departemen', group: WO_GROUP, title: 'Jabatan (belum ada departemen)', build: async (th) => (await woPosBase(th, { empty: true, noDept: true, h: 700 })).f });
registerScreen({ key: 'owner/positions-galat', group: WO_GROUP, title: 'Jabatan (galat)', build: async (th) => (await woPosBase(th, { empty: true, error: true, h: 700 })).f });
registerScreen({ key: 'owner/positions-tambah', group: WO_GROUP, title: 'Jabatan: Tambah', build: async (th) => {
  const { f } = await woPosBase(th);
  await dialog(th, f, { title: 'Tambah Jabatan', w: 444, build: async (b) => {
    await woSelectF('Departemen', 'Teknologi Informasi', th, b, { required: true }); await inputField('Nama Jabatan', '', th, b, { required: true, focus: true });
    await txt('Level Jabatan', 'caption', 'color/text/secondary', th, { parent: b }); await woSelectF('Level', 'Level 1: ' + WO_LEVEL_HINT[1], th, b); }, actions: [woCancel, woSave] });
  return f;
} });
registerScreen({ key: 'owner/positions-ubah', group: WO_GROUP, title: 'Jabatan: Ubah', build: async (th) => {
  const { f } = await woPosBase(th);
  await dialog(th, f, { title: 'Ubah Jabatan', w: 444, build: async (b) => {
    await inputField('Nama Jabatan', 'Supervisor IT', th, b, { required: true, focus: true });
    await txt('Level Jabatan', 'caption', 'color/text/secondary', th, { parent: b }); await woSelectF('Level', 'Level 2: ' + WO_LEVEL_HINT[2], th, b); }, actions: [woCancel, woSave] });
  return f;
} });
registerScreen({ key: 'owner/positions-hapus', group: WO_GROUP, title: 'Jabatan: Hapus', build: async (th) => {
  const { f } = await woPosBase(th);
  await dialog(th, f, { title: 'Hapus Jabatan?', w: 444, build: async (b) => { await txt('Supervisor IT akan dihapus. Kalau masih ada karyawan di jabatan ini, pindahkan dulu ke jabatan lain.', 'body2', 'color/text/primary', th, { parent: b, fillW: true }); }, actions: [woCancel, woDel] });
  return f;
} });

/* ---------- Struktur Organisasi (bagan) ---------- */
const WO_LEVEL_COL = { 1: 'color/info', 2: 'color/success', 3: 'color/warning', 4: 'color/primary', 5: 'color/danger' };
function woRect(th, parent, w, h, tok) { const r = figma.createRectangle(); r.name = 'line'; r.resize(w, h); r.fills = [pv(th, tok)]; parent.appendChild(r); return r; }
async function woOrgCard(th, parent, n) {
  const c = box('OrgCard', { dir: 'V', fill: 'color/surface', stroke: 'color/border', radius: 12, theme: th, parent, clip: true });
  c.counterAxisSizingMode = 'FIXED'; c.resize(220, 100); c.primaryAxisSizingMode = 'AUTO';
  const bar = woRect(th, c, 220, 4, WO_LEVEL_COL[n.lv] ?? 'color/info'); bar.layoutSizingHorizontal = 'FILL';
  const body = box('body', { dir: 'V', gap: 10, pad: 12, theme: th, parent: c, fillW: true });
  const r = box('person', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent: body, fillW: true });
  await avatar(n.ini, 38, th, r);
  const t = box('t', { dir: 'V', theme: th, parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
  await txt(n.name, 'body2-strong', 'color/text/primary', th, { parent: t }); await txt(n.pos, 'caption', 'color/text/secondary', th, { parent: t });
  const chips = box('chips', { dir: 'H', gap: 6, theme: th, parent: body });
  await chip(n.dept, th, chips, { color: 'default', icon: 'building' });
  if (n.status) await chip(n.status, th, chips, { color: n.status === 'Cuti' ? 'warning' : 'error', variant: 'tint' });
  if (n.kids) { const b = box('toggle', { dir: 'H', gap: 2, ax: 'CENTER', ay: 'CENTER', pad: [0, 10, 0, 10], fill: n.closed ? 'color/primary' : 'color/surface', stroke: n.closed ? 'color/primary' : 'color/border', radius: 999, theme: th, parent: body }); b.counterAxisSizingMode = 'FIXED'; b.resize(60, 24); b.primaryAxisSizingMode = 'AUTO'; await txt(String(n.kids.length), 'caption-strong', n.closed ? onPrimary(th) : 'color/text/secondary', th, { parent: b }); icon(n.closed ? 'down' : 'up', 14, n.closed ? onPrimary(th) : 'color/text/secondary', th, b); }
  return c;
}
async function woOrgNode(th, parent, n) {
  const w = box('node', { dir: 'V', ax: 'MIN', ay: 'CENTER', theme: th, parent });
  await woOrgCard(th, w, n);
  if (n.kids && !n.closed) {
    woRect(th, w, 2, 20, 'color/border');
    const row = box('children', { dir: 'H', theme: th, parent: w });
    for (const k of n.kids) {
      const cw = box('child', { dir: 'V', ay: 'CENTER', pad: [0, 12, 0, 12], stroke: 'color/border', theme: th, parent: row });
      cw.strokeBottomWeight = 0; cw.strokeLeftWeight = 0; cw.strokeRightWeight = 0;
      woRect(th, cw, 2, 20, 'color/border');
      await woOrgNode(th, cw, k);
    }
  }
  return w;
}
const WO_ORG = { name: 'Hendra Gunawan', ini: 'HG', pos: 'Direktur Utama', dept: 'Direksi', lv: 5, kids: [
  { name: 'Dewi Lestari', ini: 'DL', pos: 'Manajer TI', dept: 'Teknologi Informasi', lv: 3, kids: [{ name: 'Budi Santoso', ini: 'BS', pos: 'Staf IT', dept: 'Teknologi Informasi', lv: 1 }, { name: 'Agus Wijaya', ini: 'AW', pos: 'Staf IT', dept: 'Teknologi Informasi', lv: 1, status: 'Cuti' }] },
  { name: 'Siti Rahmawati', ini: 'SR', pos: 'Manajer Keuangan', dept: 'Keuangan', lv: 3, kids: [{ name: 'Rina Kartika', ini: 'RK', pos: 'Staf Keuangan', dept: 'Keuangan', lv: 1 }] },
  { name: 'Eko Prasetyo', ini: 'EP', pos: 'Manajer Operasional', dept: 'Operasional', lv: 3, closed: true, kids: [{}, {}, {}, {}] }] };
async function woOrgBase(th, o = {}) {
  const { f, main } = await woPage(th, 'Struktur Organisasi', o.h ?? 1200);
  const hd = box('hd', { dir: 'H', ay: 'MAX', theme: th, parent: main, fillW: true });
  const tl = box('titles', { dir: 'V', gap: 4, theme: th, parent: hd }); await txt('Struktur Organisasi', 'h5', 'color/text/primary', th, { parent: tl }); await txt('Siapa melapor ke siapa. Seret kartu ke kartu lain untuk mengubah atasannya.', 'body2', 'color/text/secondary', th, { parent: tl });
  spacer(hd); await inputField('Perusahaan', WO_COMPANY, th, hd, { w: 260, select: true, icon: 'building' });
  if (o.error) await alertBox('error', 'Gagal memuat data. Coba lagi.', th, main);
  const stats = box('stats', { dir: 'H', gap: 16, theme: th, parent: main, fillW: true });
  const sv = o.empty || o.loading ? ['–', '–', '–', '–'] : ['7', '2', '3', '1'];
  await statCard('Karyawan', sv[0], null, 'users', th, stats); await statCard('Punya bawahan', sv[1], null, 'person', th, stats); await statCard('Lapisan', sv[2], null, 'wo-tree', th, stats); await statCard('Tanpa atasan', sv[3], null, 'wo-unlink', th, stats);
  const c = card(th, main, { pad: 0, clip: true });
  const bar = box('toolbar', { dir: 'H', gap: 12, ay: 'CENTER', pad: [12, 16, 12, 16], stroke: 'color/border', theme: th, parent: c, fillW: true }); bar.strokeTopWeight = 0; bar.strokeLeftWeight = 0; bar.strokeRightWeight = 0;
  await inputField('Cari nama, NIK, jabatan, departemen', o.query ?? '', th, bar, { w: 340, icon: 'search' });
  const sw = box('sw', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: bar }); toggle(false, th, sw); await txt('Tampilkan yang sudah keluar', 'body2', 'color/text/primary', th, { parent: sw });
  spacer(bar); await button('Tutup semua', th, bar, { v: 'outlined', color: 'default', size: 'small', icon: 'wo-fold' }); await button('Buka semua', th, bar, { v: 'outlined', color: 'default', size: 'small', icon: 'wo-unfold' });
  if (o.warn) { const w = box('alerts', { dir: 'V', gap: 8, pad: [12, 16, 0, 16], theme: th, parent: c, fillW: true }); await alertBox('warning', 'Belum ada karyawan yang punya atasan di perusahaan ini. Semua pengajuan langsung ke HR tanpa lewat atasan.', th, w); await alertBox('info', '2 karyawan punya atasan di perusahaan lain atau yang sudah keluar, jadi ditaruh di paling atas.', th, w); }
  const canvas = box('canvas', { dir: 'V', ax: 'MIN', ay: 'CENTER', pad: [40, 40, 64, 40], fill: 'color/background', theme: th, parent: c, fillW: true });
  canvas.counterAxisSizingMode = 'FIXED'; canvas.resize(100, o.canvasH ?? 700); canvas.layoutSizingHorizontal = 'FILL'; canvas.primaryAxisSizingMode = 'FIXED'; canvas.clipsContent = true;
  if (o.loading) { const l = box('loading', { dir: 'V', gap: 12, ay: 'CENTER', pad: [120, 0, 0, 0], theme: th, parent: canvas }); icon('refresh', 28, 'color/primary', th, l); await txt('Memuat struktur...', 'body2', 'color/text/secondary', th, { parent: l }); }
  else if (o.empty) { const e = box('empty', { dir: 'V', gap: 8, ay: 'CENTER', pad: [120, 0, 0, 0], theme: th, parent: canvas }); icon('wo-tree', 48, 'color/text/disabled', th, e); await txt('Belum ada karyawan', 'subtitle', 'color/text/primary', th, { parent: e }); await txt('Perusahaan ini belum punya karyawan untuk disusun.', 'body2', 'color/text/secondary', th, { parent: e }); }
  else { await woOrgNode(th, canvas, o.warn ? { name: 'Hendra Gunawan', ini: 'HG', pos: 'Direktur Utama', dept: 'Direksi', lv: 5 } : WO_ORG); }
  if (!o.empty && !o.loading) {
    const lg = box('legend', { dir: 'H', gap: 12, ay: 'CENTER', pad: [8, 12, 8, 12], fill: 'color/surface', stroke: 'color/border', radius: 8, theme: th, parent: canvas });
    lg.layoutPositioning = 'ABSOLUTE'; lg.x = 16; lg.y = (o.canvasH ?? 700) - 56;
    await txt('Level jabatan', 'caption-strong', 'color/text/secondary', th, { parent: lg });
    for (const [lv, tk] of [['1', 'color/info'], ['2', 'color/success'], ['3', 'color/warning'], ['4', 'color/primary'], ['5+', 'color/danger']]) { const it = box('lv', { dir: 'H', gap: 4, ay: 'CENTER', theme: th, parent: lg }); const sq = woRect(th, it, 10, 10, tk); sq.cornerRadius = 2; await txt(lv, 'caption', 'color/text/primary', th, { parent: it }); }
    const zm = box('zoom', { dir: 'H', ay: 'CENTER', fill: 'color/surface', stroke: 'color/border', radius: 8, theme: th, parent: canvas });
    zm.layoutPositioning = 'ABSOLUTE'; zm.x = 1440 - 256 - 64 - 140 - 16 - 40; zm.y = (o.canvasH ?? 700) - 56;
    await iconButton('wo-minus', th, zm, { size: 32, iconSize: 18 }); const z = box('pct', { dir: 'H', ax: 'CENTER', pad: [0, 12, 0, 12], theme: th, parent: zm }); await txt('100%', 'caption-strong', 'color/text/secondary', th, { parent: z }); await iconButton('plus', th, zm, { size: 32, iconSize: 18 });
  }
  return { f, main };
}
registerScreen({ key: 'owner/org-chart', group: WO_GROUP, title: 'Struktur Organisasi', build: async (th) => (await woOrgBase(th)).f });
registerScreen({ key: 'owner/org-chart-memuat', group: WO_GROUP, title: 'Struktur Organisasi (memuat)', build: async (th) => (await woOrgBase(th, { loading: true, h: 1000, canvasH: 480 })).f });
registerScreen({ key: 'owner/org-chart-kosong', group: WO_GROUP, title: 'Struktur Organisasi (kosong)', build: async (th) => (await woOrgBase(th, { empty: true, h: 1000, canvasH: 480 })).f });
registerScreen({ key: 'owner/org-chart-galat', group: WO_GROUP, title: 'Struktur Organisasi (galat)', build: async (th) => (await woOrgBase(th, { error: true, empty: true, h: 1000, canvasH: 480 })).f });
registerScreen({ key: 'owner/org-chart-peringatan', group: WO_GROUP, title: 'Struktur Organisasi (peringatan)', build: async (th) => (await woOrgBase(th, { warn: true, h: 1100, canvasH: 480 })).f });
registerScreen({ key: 'owner/org-chart-pindah', group: WO_GROUP, title: 'Struktur Organisasi: Pindahkan atasan', build: async (th) => {
  const { f } = await woOrgBase(th);
  await dialog(th, f, { title: 'Pindahkan atasan?', w: 444, build: async (b) => {
    const pr = box('preview', { dir: 'H', gap: 12, ax: 'CENTER', ay: 'CENTER', pad: [16, 0, 16, 0], fill: 'color/background', radius: 8, theme: th, parent: b, fillW: true });
    for (const [i, p] of [['BS', 'Budi Santoso'], ['SR', 'Siti Rahmawati']].entries()) {
      if (i === 1) icon('wo-arrow', 22, 'color/text/secondary', th, pr);
      const col = box('p', { dir: 'V', gap: 4, ay: 'CENTER', theme: th, parent: pr }); col.counterAxisSizingMode = 'FIXED'; col.resize(120, 60); col.primaryAxisSizingMode = 'AUTO';
      await avatar(p[0], 40, th, col); await txt(p[1], 'caption-strong', 'color/text/primary', th, { parent: col });
    }
    await txt('Budi Santoso akan melapor ke Siti Rahmawati.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
    await alertBox('warning', '2 orang di bawahnya ikut berpindah, dan rantai persetujuan mereka semua berubah.', th, b);
  }, actions: [woCancel, { label: 'Pindahkan', v: 'contained' }] });
  return f;
} });
registerScreen({ key: 'owner/org-chart-lepas-atasan', group: WO_GROUP, title: 'Struktur Organisasi: Lepas atasan', build: async (th) => {
  const { f } = await woOrgBase(th);
  await dialog(th, f, { title: 'Pindahkan atasan?', w: 444, build: async (b) => {
    const pr = box('preview', { dir: 'H', gap: 12, ax: 'CENTER', ay: 'CENTER', pad: [16, 0, 16, 0], fill: 'color/background', radius: 8, theme: th, parent: b, fillW: true });
    const c1 = box('p', { dir: 'V', gap: 4, ay: 'CENTER', theme: th, parent: pr }); await avatar('BS', 40, th, c1); await txt('Budi Santoso', 'caption-strong', 'color/text/primary', th, { parent: c1 });
    icon('wo-arrow', 22, 'color/text/secondary', th, pr);
    const c2 = box('p', { dir: 'V', gap: 4, ay: 'CENTER', theme: th, parent: pr }); const ub = box('av', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/border', radius: 999, theme: th, parent: c2, fixed: [40, 40] }); icon('wo-unlink', 18, 'color/text/secondary', th, ub); await txt('Tanpa atasan', 'caption-strong', 'color/text/primary', th, { parent: c2 });
    await txt('Budi Santoso tidak akan punya atasan lagi.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
    await alertBox('info', 'Tanpa atasan, pengajuannya langsung ke HR.', th, b);
  }, actions: [woCancel, { label: 'Pindahkan', v: 'contained' }] });
  return f;
} });

/* ---------- Lokasi Kantor ---------- */
const WO_OFFICES = [['PUSAT', 'Kantor Pusat Jakarta', WO_COMPANY, '-6.20880, 106.84560', '150 m', 'WIB (UTC+7)', true], ['CABANG-BDG', 'Cabang Bandung', WO_COMPANY, '-6.91750, 107.61910', '100 m', 'WIB (UTC+7)', true], ['CABANG-DPS', 'Cabang Denpasar', 'PT Maju Logistik', '-8.65000, 115.21670', '200 m', 'WITA (UTC+8)', false]];
async function woOfficeBase(th, o = {}) {
  const rows = o.empty ? [] : WO_OFFICES;
  const { f, main } = await woPage(th, 'Lokasi Kantor', o.h ?? 900);
  const act = await pageHeader(th, main, 'Lokasi Kantor', `${rows.length} lokasi terdaftar`);
  await button('Tambah Lokasi', th, act, { icon: 'plus' });
  if (o.error) await alertBox('error', 'Gagal memuat data. Coba lagi.', th, main);
  if (rows.length === 0 && !o.error) { const c = card(th, main, { pad: 0 }); await emptyState('pin', 'Belum ada lokasi kantor', 'Tambahkan lokasi kantor agar karyawan bisa absen di dalam radiusnya.', th, c); }
  else await woGridCard(th, main, { filter: async (bar) => { await woSelectF('Semua Perusahaan', '', th, bar, { w: 220 }); },
    table: { cols: [{ t: 'Kode', w: 110 }, { t: 'Nama', w: 'fill' }, { t: 'Perusahaan', w: 'fill' }, { t: 'Koordinat', w: 200 }, { t: 'Radius', w: 90 }, { t: 'Zona', w: 120 }, { t: 'Status', w: 100 }, { t: '', w: 90, align: 'right' }],
      rows: rows.map((r) => [r[0], r[1], r[2], { icon: 'wo-external', t: r[3] }, r[4], r[5], { chip: r[6] ? 'Aktif' : 'Nonaktif', color: r[6] ? 'success' : 'default', variant: 'solid' }, { actions: ['edit', 'trash'] }]) } });
  return { f, main };
}
async function woPicker(th, b, o = {}) { // LocationPicker: cari + peta + keterangan
  const col = box('LocationPicker', { dir: 'V', gap: 8, theme: th, parent: b, fillW: true });
  const row = box('search', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: col, fillW: true });
  const si = await inputField('Cari alamat atau tempat', '', th, row, { icon: 'search' }); si.layoutGrow = 1;
  await button('Cari', th, row, { v: 'text', size: 'small' }); await button('Lokasi saya', th, row, { v: 'text', size: 'small', icon: 'wo-target' });
  if (o.msg) await alertBox('warning', o.msg, th, col);
  const map = box('map', { dir: 'V', ax: 'CENTER', ay: 'CENTER', fill: 'color/info-surface', stroke: 'color/border', radius: 8, theme: th, parent: col, fillW: true, clip: true });
  map.counterAxisSizingMode = 'FIXED'; map.resize(100, 220); map.layoutSizingHorizontal = 'FILL'; map.primaryAxisSizingMode = 'FIXED';
  for (const [x, y, w, h] of [[0, 70, 552, 10], [0, 150, 552, 8], [160, 0, 10, 220], [390, 0, 8, 220]]) { const r = woRect(th, map, w, h, 'color/surface'); r.layoutPositioning = 'ABSOLUTE'; r.x = x; r.y = y; }
  const ring = figma.createRectangle(); ring.name = 'radius'; ring.cornerRadius = 60; ring.resize(120, 120); ring.fills = [pv(th, 'color/success')]; ring.opacity = 0.25; ring.strokes = [pv(th, 'color/success')]; ring.strokeWeight = 2; map.appendChild(ring); ring.layoutPositioning = 'ABSOLUTE'; ring.x = 216; ring.y = 50;
  const pin = icon('pin', 36, 'color/danger', th, map); pin.layoutPositioning = 'ABSOLUTE'; pin.x = 258; pin.y = 78;
  await txt('Klik di peta atau geser penanda untuk memilih titik. Lingkaran hijau adalah radius absen. Karyawan hanya bisa absen masuk di dalamnya.' + (o.noPoint ? ' Titik belum dipilih, jadi peta mulai dari Jakarta.' : ''), 'caption', 'color/text/secondary', th, { parent: col, fillW: true });
}
async function woOfficeForm(th, edit) {
  const { f } = await woOfficeBase(th, { h: 1000 });
  await dialog(th, f, { title: edit ? 'Ubah Lokasi' : 'Tambah Lokasi', w: 600, build: async (b) => {
    if (!edit) { await txt('Perusahaan', 'caption', 'color/text/secondary', th, { parent: b }); await woSelectF('Perusahaan', WO_COMPANY, th, b, { required: true }); }
    await inputField('Kode', edit ? 'CABANG-BDG' : '', th, b, { required: true, helper: 'Contoh: PUSAT, CABANG-BDG', focus: !edit });
    await inputField('Nama', edit ? 'Cabang Bandung' : '', th, b, { required: true });
    await inputField('Alamat (opsional)', edit ? 'Jl. Asia Afrika No. 12, Bandung' : '', th, b, { multiline: 2 });
    await inputField('Radius (meter)', edit ? '100' : '150', th, b, { helper: 'GPS di dalam gedung bisa meleset 50–200 meter. Kalau radius terlalu kecil, karyawan yang sudah di kantor bisa gagal absen.' });
    await woPicker(th, b, { noPoint: !edit });
    const ll = box('latlng', { dir: 'H', gap: 16, theme: th, parent: b, fillW: true });
    await inputField('Latitude', edit ? '-6.917500' : '', th, ll, { required: true }); await inputField('Longitude', edit ? '107.619100' : '', th, ll, { required: true });
    await txt('Zona waktu', 'caption', 'color/text/secondary', th, { parent: b }); await woSelectF('Zona waktu', 'WIB (UTC+7)', th, b);
    const sw = box('aktif', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: b }); toggle(true, th, sw); await txt('Aktif', 'body2', 'color/text/primary', th, { parent: sw });
  }, actions: [woCancel, woSave] });
  return f;
}
registerScreen({ key: 'owner/office-locations', group: WO_GROUP, title: 'Lokasi Kantor', build: async (th) => (await woOfficeBase(th)).f });
registerScreen({ key: 'owner/office-locations-kosong', group: WO_GROUP, title: 'Lokasi Kantor (kosong)', build: async (th) => (await woOfficeBase(th, { empty: true, h: 700 })).f });
registerScreen({ key: 'owner/office-locations-galat', group: WO_GROUP, title: 'Lokasi Kantor (galat)', build: async (th) => (await woOfficeBase(th, { empty: true, error: true, h: 700 })).f });
registerScreen({ key: 'owner/office-locations-tambah', group: WO_GROUP, title: 'Lokasi: Tambah', build: async (th) => woOfficeForm(th, false) });
registerScreen({ key: 'owner/office-locations-ubah', group: WO_GROUP, title: 'Lokasi: Ubah', build: async (th) => woOfficeForm(th, true) });
registerScreen({ key: 'owner/office-locations-hapus', group: WO_GROUP, title: 'Lokasi: Hapus', build: async (th) => {
  const { f } = await woOfficeBase(th);
  await dialog(th, f, { title: 'Hapus Lokasi?', w: 444, build: async (b) => { await txt('Cabang Bandung akan dihapus. Kalau masih jadi kantor utama karyawan, pindahkan karyawannya dulu atau nonaktifkan saja lokasinya.', 'body2', 'color/text/primary', th, { parent: b, fillW: true }); }, actions: [woCancel, woDel] });
  return f;
} });
