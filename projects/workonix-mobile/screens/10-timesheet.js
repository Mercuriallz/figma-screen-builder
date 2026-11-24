/* Daily Timesheet (features/timesheet) */
const TS_GROUP = 'Daily Timesheet';

async function tsTabs(active, th, parent) {
  const w = box('PillTabs', { dir: 'H', pad: 4, fill: 'color/background', stroke: 'color/border', radius: 14, theme: th });
  const tabs = {};
  for (const [i, l] of ['Saya', 'Tim', 'Bersama', 'Statistik'].entries()) {
    const t = box('tab/' + l, { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [9, 0, 9, 0], fill: i === active ? 'color/primary' : null, radius: 10, theme: th, parent: w });
    t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
    await txt(l, 'body-strong', i === active ? 'white' : 'color/text/secondary', th, { parent: t });
    tabs[l] = t;
  }
  const wrap = box('tabs wrap', { dir: 'V', pad: [0, 0, 12, 0], theme: th, parent, fillW: true });
  wrap.appendChild(w); w.layoutSizingHorizontal = 'FILL';
  const target = { Saya: 'timesheet-saya', Tim: 'timesheet-tim', Bersama: 'timesheet-bersama', Statistik: 'timesheet-stat-saya' };
  for (const [l, node] of Object.entries(tabs)) if (target[l] !== CURRENT.key) link(node, target[l]);
  return wrap;
}
async function tsSearch(th, parent) {
  const s = box('Search', { dir: 'H', gap: 10, ay: 'CENTER', pad: [0, 14, 0, 14], fill: 'color/surface', stroke: 'color/border', radius: 12, theme: th, parent, fixed: [328, 48] });
  s.layoutSizingHorizontal = 'FILL';
  icon('search', 20, 'color/text/secondary', th, s); await txt('Cari aktivitas…', 'body', 'color/text/disabled', th, { parent: s });
  return s;
}
async function tsCard(a, th, parent, o = {}) {
  const c = box('ActivityCard', { dir: 'H', gap: 10, pad: [14, 6, 14, 14], fill: 'color/surface', stroke: 'color/border', radius: 14, theme: th, parent, fillW: true });
  const rail = box('time rail', { dir: 'V', gap: 3, theme: th, parent: c }); rail.resize(46, 40); rail.layoutSizingHorizontal = 'FIXED'; rail.layoutSizingVertical = 'HUG';
  await txt(a.start, 'body-strong', 'color/text/primary', th, { parent: rail });
  const line = figma.createRectangle(); line.name = 'rail'; line.resize(2, 14); line.cornerRadius = 1; line.fills = [pv(th, 'color/border')]; rail.appendChild(line);
  await txt(a.end, 'caption', 'color/text/secondary', th, { parent: rail });
  const main = box('content', { dir: 'V', gap: 4, theme: th, parent: c }); main.layoutGrow = 1; main.layoutSizingHorizontal = 'FILL';
  if (o.owner) {
    const r = box('owner', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: main, fillW: true });
    await avatar(o.owner.initials, 24, th, r);
    await txt(o.owner.name, 'caption', 'color/text/secondary', th, { parent: r, fillW: true });
    gap(main, 4);
  }
  await txt(a.title, 'body-strong', 'color/text/primary', th, { parent: main, fillW: true });
  if (a.output) { const r = box('output', { dir: 'H', gap: 6, theme: th, parent: main, fillW: true }); icon('check', 14, 'color/text/secondary', th, r); await txt(a.output, 'caption', 'color/text/secondary', th, { parent: r, fillW: true }); }
  gap(main, 6);
  const tags = box('tags', { dir: 'H', gap: 6, theme: th, parent: main, fillW: true }); tags.layoutWrap = 'WRAP'; tags.counterAxisSpacing = 6;
  const vis = { private: ['Private', 'neutral', 'lock'], team: ['Team', 'info', 'users'], all: ['All', 'success', 'globe'] }[a.vis];
  await badge(vis[0], vis[1], vis[2], th, tags); await badge(a.dur, 'neutral', 'timer', th, tags);
  for (const [ic, t] of [['pin', a.loc], ['repeat', a.type]]) { const m = box('meta', { dir: 'H', gap: 4, ay: 'CENTER', theme: th, parent: tags }); icon(ic, 14, 'color/text/secondary', th, m); await txt(t, 'caption', 'color/text/secondary', th, { parent: m }); }
  if (a.approved) { const r = box('approved', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: main, fillW: true }); icon('verified', 14, 'color/text/secondary', th, r); await txt('Disetujui oleh ' + a.approved, 'caption', 'color/text/secondary', th, { parent: r, fillW: true }); }
  if (o.menu) { const m = box('menu', { dir: 'V', pad: [2, 6, 0, 6], theme: th, parent: c }); icon('more', 20, 'color/text/secondary', th, m); }
  return c;
}
async function tsDayList(th, body, rows, o = {}) {
  for (const [a, owner, day] of rows) { await sectionLabel(day, th, body); gap(body, 8); await tsCard(a, th, body, { owner, menu: o.menu }); gap(body, 14); }
}

registerScreen({ key: 'timesheet-saya', group: TS_GROUP, title: 'Saya (hari ini)', build: async (th) => {
  const { f, body } = await phone('x', th, 'Daily Timesheet');
  await tsTabs(0, th, body);
  const { hero, col } = heroCard(th, body);
  const l = await txt('HARI INI', 'label', 'white', th, { parent: col }); l.opacity = 0.75;
  await txt('3 jam 30 mnt', 'h1', 'white', th, { parent: col, size: 28 });
  const s = await txt('2 aktivitas tercatat', 'caption', 'white', th, { parent: col }); s.opacity = 0.75;
  const ib = box('icon bg', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 999, theme: th, parent: hero, fixed: [52, 52] });
  ib.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.16 }]; icon('clipboard', 26, 'white', th, ib);
  gap(body, 14); await tsSearch(th, body); gap(body, 10);
  const chips = box('filter chips', { dir: 'H', gap: 8, theme: th, parent: body, fillW: true });
  await chip('Semua', true, null, th, chips); await chip('Private', false, 'lock', th, chips); await chip('Team', false, 'users', th, chips); await chip('All', false, 'globe', th, chips);
  gap(body, 14); await sectionLabel('Hari ini · 23 Nov', th, body); gap(body, 8);
  const cards = box('cards', { dir: 'V', gap: 10, theme: th, parent: body, fillW: true });
  const first = await tsCard({ start: '13:00', end: '15:30', title: 'Menyusun laporan mingguan dan merapikan data timesheet seluruh tim', output: 'Laporan PDF', vis: 'team', dur: '2 jam 30 mnt', loc: 'Office', type: 'Rutin', approved: 'QA Manajer' }, th, cards, { menu: true });
  await tsCard({ start: '10:00', end: '11:00', title: 'Rapat koordinasi', vis: 'all', dur: '1 jam', loc: 'Office', type: 'Non-rutin' }, th, cards, { menu: true });
  const fb = await fab(th, f, 'Catat');
  link(fb, 'timesheet-form', 'modal'); link(first, 'timesheet-form', 'modal'); link(f.findOne((n) => n.name === 'icon/back'), 'absensi-home', 'back');
  return f;
} });

for (const [key, idx, title, rows] of [
  ['timesheet-tim', 1, 'Tim', [[{ start: '09:00', end: '10:30', title: 'Review pull request modul cuti', vis: 'team', dur: '1 jam 30 mnt', loc: 'Office', type: 'Rutin' }, { initials: 'HG', name: 'Hendra Gunawan · Teknologi Informasi' }, 'Hari ini · 23 Nov'], [{ start: '09:00', end: '10:30', title: 'Deploy backend', vis: 'all', dur: '1 jam 30 mnt', loc: 'Site', type: 'Rutin' }, { initials: 'EP', name: 'Eko Prasetyo · Teknologi Informasi' }, 'Kemarin · 22 Nov']]],
  ['timesheet-bersama', 2, 'Bersama', [[{ start: '09:00', end: '10:30', title: 'Deploy backend', vis: 'all', dur: '1 jam 30 mnt', loc: 'Site', type: 'Rutin' }, { initials: 'EP', name: 'Eko Prasetyo · Teknologi Informasi' }, 'Kemarin · 22 Nov']]],
]) {
  registerScreen({ key, group: TS_GROUP, title, build: async (th) => {
    const { f, body } = await phone('x', th, 'Daily Timesheet');
    await tsTabs(idx, th, body); await tsSearch(th, body); gap(body, 14);
    await tsDayList(th, body, rows);
    link(f.findOne((n) => n.name === 'icon/back'), 'absensi-home', 'back');
    return f;
  } });
}

async function tsBars(th, parent, series, month) {
  const max = Math.max(...series.cur, ...series.prev, 1); const H = 120;
  const row = box('bars', { dir: 'H', gap: 0, ay: 'MAX', theme: th, parent, fillW: true }); row.counterAxisSizingMode = 'FIXED'; row.resize(300, H + 18); row.layoutSizingHorizontal = 'FILL';
  const labels = box('month labels', { dir: 'H', theme: th, parent, fillW: true });
  const M = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  for (let i = 0; i < 12; i++) {
    const col = box('m' + (i + 1), { dir: 'V', ax: 'MAX', ay: 'CENTER', theme: th, parent: row }); col.layoutGrow = 1; col.layoutSizingHorizontal = 'FILL'; col.layoutSizingVertical = 'FILL';
    if (series.cur[i] > 0) await txt(String(series.cur[i]), 'label', i + 1 === month ? 'color/primary' : 'color/text/secondary', th, { parent: col, size: 10 });
    const pair = box('bar pair', { dir: 'H', gap: 2, ay: 'MAX', theme: th, parent: col });
    for (const [val, colr] of [[series.prev[i], 'color/border'], [series.cur[i], i + 1 === month ? 'color/primary' : 'color/primary-light']]) {
      const r = figma.createRectangle(); r.name = 'bar'; const h = val <= 0 ? 2 : Math.max(3, Math.round(H * val / max)); r.resize(8, h);
      r.topLeftRadius = 3; r.topRightRadius = 3; r.bottomLeftRadius = 0; r.bottomRightRadius = 0; r.fills = [pv(th, colr)]; pair.appendChild(r);
    }
    const lt = await txt(M[i], 'label', i + 1 === month ? 'color/primary' : 'color/text/secondary', th, { parent: labels, size: 9, align: 'CENTER' });
    lt.layoutGrow = 1; lt.layoutSizingHorizontal = 'FILL'; lt.textAutoResize = 'HEIGHT';
  }
  const lg = box('legend', { dir: 'H', gap: 16, pad: [12, 0, 0, 0], theme: th, parent });
  for (const [c, l] of [['color/primary-light', '2026'], ['color/border', '2025']]) { const it = box('lg', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: lg }); const s = figma.createRectangle(); s.resize(10, 10); s.cornerRadius = 3; s.fills = [pv(th, c)]; it.appendChild(s); await txt(l, 'caption', 'color/text/secondary', th, { parent: it }); }
}
async function tsStatTile(label, val, note, th, parent) {
  const c = box('StatTile', { dir: 'V', gap: 6, pad: 14, fill: 'color/surface', stroke: 'color/border', radius: 14, theme: th, parent }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
  await sectionLabel(label, th, c);
  const r = box('v', { dir: 'H', gap: 6, ay: 'MAX', theme: th, parent: c });
  const v = await txt(val, 'h1', 'color/text/primary', th, { parent: r, size: 26 }); v.lineHeight = { unit: 'PIXELS', value: 32 };
  await txt('aktivitas', 'caption', 'color/text/secondary', th, { parent: r });
  await txt(note, 'caption', 'color/text/secondary', th, { parent: c });
}
const TS_MINE = { prev: [0, 0, 0, 3, 2, 0, 0, 0, 4, 6, 0, 0], cur: [0, 5, 35, 111, 29, 16, 42, 78, 111, 116, 51, 0] };
const TS_DEPT = { prev: Array(12).fill(0), cur: [0, 20, 230, 330, 175, 190, 270, 265, 280, 405, 220, 0] };

for (const [key, sc, series, total, tile2, h] of [['timesheet-stat-saya', 'Saya', TS_MINE, 594, 51, 800], ['timesheet-stat-dept', 'Departemen', TS_DEPT, 2385, 220, 1100]]) {
  registerScreen({ key, group: TS_GROUP, title: 'Statistik — ' + sc, build: async (th) => {
    const { f, body } = await phone('x', th, 'Daily Timesheet', { h });
    await tsTabs(3, th, body);
    const scope = box('scope chips', { dir: 'H', gap: 8, theme: th, parent: body, fillW: true });
    const chips = {};
    for (const s of ['Saya', 'Departemen', 'Semua']) chips[s] = await chip(s, s === sc, null, th, scope);
    gap(body, 14);
    const tiles = box('stat tiles', { dir: 'H', gap: 12, theme: th, parent: body, fillW: true });
    await tsStatTile('Tahun 2026', String(total), `Tahun 2025: ${series.prev.reduce((a, b) => a + b, 0)}`, th, tiles); await tsStatTile('Bulan ini', String(tile2), 'Bulan lalu: ' + series.cur[9], th, tiles);
    gap(body, 14);
    const c = box('chart card', { dir: 'V', gap: 2, pad: 16, fill: 'color/surface', stroke: 'color/border', radius: 14, theme: th, parent: body, fillW: true });
    await txt('Aktivitas per bulan', 'body-strong', 'color/text/primary', th, { parent: c });
    await txt(sc === 'Saya' ? 'Catatan milik Anda' : 'Semua anggota departemen Anda', 'caption', 'color/text/secondary', th, { parent: c }); gap(c, 14);
    await tsBars(th, c, series, 11);
    if (sc === 'Departemen') {
      gap(body, 14);
      const tc = box('team card', { dir: 'V', gap: 12, pad: 16, fill: 'color/surface', stroke: 'color/border', radius: 14, theme: th, parent: body, fillW: true });
      await txt('Anggota tim', 'body-strong', 'color/text/primary', th, { parent: tc }); await txt('Jumlah aktivitas tahun 2026', 'caption', 'color/text/secondary', th, { parent: tc });
      for (const [n, ini, v] of [['Eko Prasetyo', 'EP', 815], ['Agus Wijaya', 'AW', 590], ['Doni Setiawan', 'DS', 310], ['Hendra Gunawan', 'HG', 80]]) {
        const r = box('member', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent: tc, fillW: true });
        await avatar(ini, 28, th, r);
        const mid = box('mid', { dir: 'V', gap: 5, theme: th, parent: r }); mid.layoutGrow = 1; mid.layoutSizingHorizontal = 'FILL';
        await txt(n, 'body', 'color/text/primary', th, { parent: mid });
        const tr = box('progress', { dir: 'H', fill: 'color/border', radius: 3, theme: th, parent: mid, fillW: true }); tr.counterAxisSizingMode = 'FIXED'; tr.resize(200, 6); tr.layoutSizingHorizontal = 'FILL';
        const fl = figma.createRectangle(); fl.name = 'value'; fl.resize(Math.max(10, Math.round(170 * v / 815)), 6); fl.cornerRadius = 3; fl.fills = [pv(th, 'color/primary')]; tr.appendChild(fl);
        const vv = box('count', { dir: 'H', ax: 'MAX', theme: th, parent: r, fixed: [44, 20] }); await txt(String(v), 'body-strong', 'color/text/primary', th, { parent: vv, align: 'RIGHT' });
      }
    }
    if (sc === 'Saya') link(chips['Departemen'], 'timesheet-stat-dept'); else link(chips['Saya'], 'timesheet-stat-saya');
    link(f.findOne((n) => n.name === 'icon/back'), 'absensi-home', 'back');
    return f;
  } });
}

for (const [key, title, ic, t, m, tone] of [
  ['timesheet-kosong', 'Kondisi: kosong', 'clipboard', 'Belum ada aktivitas', 'Catat pekerjaan harian Anda dengan tombol Catat di bawah.', null],
  ['timesheet-takcocok', 'Kondisi: tidak cocok', 'searchoff', 'Tidak ada yang cocok', 'Coba kata kunci lain atau hapus filter.', null],
  ['timesheet-error', 'Kondisi: error', 'alert', 'Gagal memuat', 'Tidak bisa menghubungi server. Periksa koneksi internet Anda.', 'danger'],
]) {
  registerScreen({ key, group: TS_GROUP, title, build: async (th) => {
    const { f, body } = await phone('x', th, 'Daily Timesheet');
    await tsTabs(0, th, body); await tsSearch(th, body); gap(body, 10);
    await emptyState(ic, t, m, th, body, tone);
    return f;
  } });
}

// ---------- Form ----------
async function tsLabel(text, th, parent, required) {
  const t = await txt(required ? text + ' *' : text, 'body-strong', 'color/text/primary', th, { parent });
  if (required) t.setRangeFills(text.length, text.length + 2, [pv(th, 'color/danger')]);
  gap(parent, 4); return t;
}
async function tsDivider(th, parent) { gap(parent, 16); const d = figma.createRectangle(); d.name = 'divider'; d.resize(296, 1); d.fills = [pv(th, 'color/border')]; parent.appendChild(d); d.layoutSizingHorizontal = 'FILL'; gap(parent, 16); }
const tsWrap = (parent, th, name) => { const r = box(name || 'choices', { dir: 'H', gap: 8, theme: th, parent, fillW: true }); r.layoutWrap = 'WRAP'; r.counterAxisSpacing = 8; return r; };
async function tsTimeTile(lbl, val, th, parent) {
  const t = box('TimeTile', { dir: 'V', gap: 2, pad: [10, 14, 10, 14], fill: 'color/surface', stroke: 'color/border', radius: 12, theme: th, parent }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
  await sectionLabel(lbl, th, t);
  const r = box('v', { dir: 'H', ay: 'CENTER', ax: 'SPACE_BETWEEN', theme: th, parent: t, fillW: true });
  const v = await txt(val, 'h2', 'color/text/primary', th, { parent: r, size: 20 }); v.lineHeight = { unit: 'PIXELS', value: 26 };
  icon('clock', 18, 'color/text/secondary', th, r);
}
async function tsVisTile(kind, selected, th, parent) {
  const m = { private: ['Private', 'Hanya saya', 'lock'], team: ['Team', 'Rekan satu departemen', 'users'], all: ['All', 'Semua karyawan', 'globe'] }[kind];
  const t = box('VisibilityTile/' + m[0], { dir: 'H', gap: 12, ay: 'CENTER', pad: [10, 12, 10, 12], fill: selected ? 'color/primary-surface' : 'color/surface', stroke: selected ? 'color/primary' : 'color/border', sw: selected ? 1.5 : 1, radius: 12, theme: th, parent, fillW: true });
  icon(m[2], 20, selected ? 'color/primary' : 'color/text/secondary', th, t);
  const c = box('text', { dir: 'V', theme: th, parent: t }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
  await txt(m[0], 'body-strong', 'color/text/primary', th, { parent: c }); await txt(m[1], 'caption', 'color/text/secondary', th, { parent: c });
  icon(selected ? 'check' : 'radio', 20, selected ? 'color/primary' : 'color/text/disabled', th, t);
}
async function tsForm(th, o) {
  const { f, body } = await phone('x', th, 'Catat aktivitas', { h: 1480, gap: 14, pad: [4, 16, 16, 16] });
  const loc = box('LocationNote', { dir: 'H', gap: 10, ay: 'CENTER', pad: [10, 12, 10, 12], fill: 'color/success-surface', radius: 12, theme: th, parent: body, fillW: true });
  icon('mylocation', 18, 'color/success', th, loc); await txt('Lokasi tercatat (-6.2750, 106.8302)', 'caption', 'color/success', th, { parent: loc, fillW: true });
  const c = box('draft card', { dir: 'V', pad: 16, fill: 'color/surface', stroke: 'color/border', radius: 14, theme: th, parent: body, fillW: true });
  await tsLabel('Apa yang dikerjakan?', th, c, true); await field('Mis. Menyusun laporan mingguan', th, c, { value: o.title }); gap(c, 12);
  await tsLabel('Hasil / output', th, c); await field('Opsional, mis. Laporan PDF', th, c);
  await tsDivider(th, c);
  await tsLabel('Kapan?', th, c); const dr = tsWrap(c, th); await chip('Hari ini', true, null, th, dr, { pad: [9, 14, 9, 14] }); await chip('Kemarin', false, null, th, dr, { pad: [9, 14, 9, 14] }); await chip('Pilih tanggal', false, 'calendar', th, dr, { pad: [9, 14, 9, 14] }); gap(c, 12);
  const tr = box('times', { dir: 'H', gap: 10, theme: th, parent: c, fillW: true }); await tsTimeTile('Mulai', '17:12', th, tr); await tsTimeTile('Selesai', o.badTime ? '16:00' : '18:12', th, tr); gap(c, 8);
  const du = box('duration', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: c, fillW: true });
  icon(o.badTime ? 'alert' : 'timer', 16, o.badTime ? 'color/danger' : 'color/text/secondary', th, du);
  await txt(o.badTime ? 'Jam selesai harus setelah jam mulai' : 'Durasi 1 jam', 'caption', o.badTime ? 'color/danger' : 'color/text/secondary', th, { parent: du, fillW: true });
  await tsDivider(th, c);
  await tsLabel('Jam kerja', th, c);
  const seg = box('Segmented', { dir: 'H', pad: 3, fill: 'color/background', stroke: 'color/border', radius: 12, theme: th, parent: c, fillW: true });
  for (const [t, sel] of [['Non-shift', true], ['Shift', false]]) { const s = box('seg/' + t, { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [10, 0, 10, 0], fill: sel ? 'color/primary' : null, radius: 9, theme: th, parent: seg }); s.layoutGrow = 1; s.layoutSizingHorizontal = 'FILL'; await txt(t, 'body-strong', sel ? 'white' : 'color/text/secondary', th, { parent: s }); }
  gap(c, 14);
  await tsLabel('Lokasi kerja', th, c); const lr = tsWrap(c, th); for (const [i, n] of ['Office', 'Client', 'Site', 'Other', 'Remote'].entries()) await chip(n, i === 0, null, th, lr, { pad: [9, 14, 9, 14] }); gap(c, 14);
  await tsLabel('Jenis pekerjaan', th, c); const jr = tsWrap(c, th); await chip('Rutin', true, null, th, jr, { pad: [9, 14, 9, 14] }); await chip('Non-rutin', false, null, th, jr, { pad: [9, 14, 9, 14] });
  await tsDivider(th, c);
  await tsLabel('Disetujui oleh', th, c); await field('Opsional, nama atasan', th, c); gap(c, 8);
  const ar = tsWrap(c, th, 'approver suggestions'); await chip('QA Manajer', false, 'person', th, ar, { pad: [9, 14, 9, 14] }); await chip('Budi Santoso', false, 'person', th, ar, { pad: [9, 14, 9, 14] });
  await tsDivider(th, c);
  await tsLabel('Siapa yang boleh melihat?', th, c);
  const vt = box('visibility', { dir: 'V', gap: 8, theme: th, parent: c, fillW: true });
  await tsVisTile('private', true, th, vt); await tsVisTile('team', false, th, vt); await tsVisTile('all', false, th, vt);
  const more = box('Tambah aktivitas lain', { dir: 'H', gap: 8, ax: 'CENTER', ay: 'CENTER', pad: [14, 0, 14, 0], stroke: 'color/border', radius: 12, theme: th, parent: body, fillW: true });
  icon('plus', 20, 'color/primary', th, more); await txt('Tambah aktivitas lain', 'body-strong', 'color/primary', th, { parent: more });
  const bar = bottomBar(th, f);
  if (o.error) { const e = box('error', { dir: 'H', gap: 8, pad: 10, fill: 'color/danger-surface', radius: 10, theme: th, parent: bar, fillW: true }); icon('alert', 18, 'color/danger', th, e); await txt(o.error, 'caption', 'color/danger', th, { parent: e, fillW: true }); }
  const save = await button('Simpan aktivitas', th, bar);
  if (!o.error) link(save, 'timesheet-saya');
  link(f.findOne((n) => n.name === 'icon/back'), 'timesheet-saya');
  return f;
}
registerScreen({ key: 'timesheet-form', group: TS_GROUP, title: 'Form catat', build: (th) => tsForm(th, {}) });
registerScreen({ key: 'timesheet-form-galat', group: TS_GROUP, title: 'Form: galat validasi', build: (th) => tsForm(th, { title: '', badTime: true, error: 'Isi dulu apa yang dikerjakan.' }) });
flowStart('timesheet-saya', 'Daily Timesheet');
