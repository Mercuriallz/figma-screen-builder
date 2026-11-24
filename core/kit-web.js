/* KIT WEB — komponen desktop (1440 px): page/shell+sidebar, button, chip, inputField, tabs, table, dialog, alertBox, ... Memakai NAV dan ROLE_META dari theme.config.js. */
/* =====================================================================
 * KIT WEB — komponen desktop (shell, tombol, chip, field, tabel, tab, dialog, ...)
 * ===================================================================== */
const onPrimary = (th) => (th === 'dark' ? 'color/background' : 'white'); // contrastText MUI
const COLOR_TOKENS = { primary: ['color/primary', 'color/primary-surface'], success: ['color/success', 'color/success-surface'], warning: ['color/warning', 'color/warning-surface'], error: ['color/danger', 'color/danger-surface'], info: ['color/info', 'color/info-surface'], default: ['color/text/secondary', 'color/background'] };

async function sidebar(th, role, active, h) {
  const sb = box('Sidebar', { dir: 'V', fill: 'color/sidebar', theme: th, fixed: [264, h], clip: true });
  const head = box('brand', { dir: 'V', gap: 14, pad: [20, 24, 16, 24], theme: th, parent: sb, fillW: true });
  const logo = box('logo', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent: head });
  const lm = box('mark', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 9, theme: th, parent: logo, fixed: [36, 36] }); lm.fills = [WHITE_PAINT];
  await txt('W', 'subtitle', 'color/primary', th, { parent: lm });
  await txt('workonix', 'h6', 'white', th, { parent: logo });
  const pill = box('role pill', { dir: 'H', gap: 6, ay: 'CENTER', pad: [3, 10, 3, 10], radius: 10, theme: th, parent: head });
  pill.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.14 }];
  const dot = figma.createRectangle(); dot.name = 'dot'; dot.resize(7, 7); dot.cornerRadius = 4; dot.fills = [{ type: 'SOLID', color: hexToRgb(ROLE_META[role][1]) }]; pill.appendChild(dot);
  await txt(ROLE_META[role][0], 'caption-strong', 'white', th, { parent: pill });
  const list = box('nav', { dir: 'V', gap: 0, pad: [0, 12, 16, 12], theme: th, parent: sb, fillW: true });
  for (const g of NAV[role]) {
    if (g.title) { gap(list, 14); const t = await txt(g.title, 'label', 'white', th, { parent: list }); t.opacity = 0.55; gap(list, 6); } else gap(list, 4);
    for (const it of g.items) {
      const containsActive = it.children && it.children.includes(active);
      const isActive = it.label === active;
      const row = box('item/' + it.label.trim(), { dir: 'H', gap: 12, ay: 'CENTER', pad: [0, 12, 0, 14], radius: 8, theme: th, parent: list, fillW: true, fixed: [240, 40] });
      row.layoutSizingHorizontal = 'FILL';
      if (isActive) row.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.16 }];
      icon(it.icon, 20, 'white', th, row).opacity = isActive || containsActive ? 1 : 0.8;
      const lb = await txt(it.label.trim(), 'body2-strong', 'white', th, { parent: row }); lb.layoutGrow = 1; lb.layoutSizingHorizontal = 'FILL'; lb.textAutoResize = 'HEIGHT'; lb.opacity = isActive || containsActive ? 1 : 0.8;
      if (it.badge) { const b = box('badge', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [0, 6, 0, 6], fill: 'color/danger', radius: 10, theme: th, parent: row, fixed: [22, 20] }); b.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.27, b: 0.27 } }]; const bt = await txt(String(it.badge), 'label', 'white', th, { parent: b }); }
      if (it.children) { const c = icon(containsActive ? 'up' : 'down', 16, 'white', th, row); c.opacity = 0.7; }
      if (it.children && containsActive) {
        for (const ch of it.children) {
          const on = ch === active;
          const cr = box('child/' + ch.trim(), { dir: 'H', ay: 'CENTER', pad: [0, 12, 0, 48], radius: 8, theme: th, parent: list, fillW: true, fixed: [240, 32] }); cr.layoutSizingHorizontal = 'FILL';
          if (on) cr.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.16 }];
          const ct = await txt(ch.trim(), 'body2', 'white', th, { parent: cr }); ct.fontSize = 13; ct.opacity = on ? 1 : 0.78;
        }
      }
    }
  }
  return sb;
}

/**
 * Halaman penuh 1440 x h dengan sidebar + app bar (shell). o: role 'owner'|'employee'|'super', active (label menu aktif), h (900),
 * user {name,email}, noShell:true (halaman tanpa sidebar: login dsb; main dipusatkan).
 * Mengembalikan { f, main } — main = kolom konten (padding 32, gap 24).
 */
async function page(name, th, o = {}) {
  const h = o.h ?? 900;
  const f = box(name, { dir: 'H', fill: 'color/background', theme: th, fixed: [1440, h], clip: true });
  if (o.noShell) {
    const main = box('main', { dir: 'V', gap: 24, ax: 'CENTER', ay: 'CENTER', pad: 32, theme: th, parent: f }); main.layoutGrow = 1; main.layoutSizingHorizontal = 'FILL'; main.layoutSizingVertical = 'FILL';
    return { f, main };
  }
  const role = o.role ?? 'owner';
  const sb = await sidebar(th, role, o.active, h); f.appendChild(sb); sb.layoutSizingVertical = 'FILL';
  const col = box('content', { dir: 'V', theme: th, parent: f }); col.layoutGrow = 1; col.layoutSizingHorizontal = 'FILL'; col.layoutSizingVertical = 'FILL';
  const ab = box('app bar', { dir: 'H', gap: 12, ay: 'CENTER', pad: [0, 24, 0, 24], fill: 'color/surface', stroke: 'color/border', theme: th, parent: col, fixed: [1176, 64] }); ab.layoutSizingHorizontal = 'FILL';
  spacer(ab);
  const mode = box('mode toggle', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 999, theme: th, parent: ab, fixed: [40, 40] });
  icon(th === 'dark' ? 'sun' : 'moon', 22, 'color/text/secondary', th, mode);
  const u = o.user ?? (role === 'super' ? { name: 'Super Admin', email: 'admin@workonix.id' } : role === 'employee' ? { name: 'Budi Santoso', email: 'budi@perusahaan.co.id' } : { name: 'Dewi Lestari', email: 'dewi@perusahaan.co.id' });
  const ur = box('user', { dir: 'H', gap: 10, ay: 'CENTER', pad: [4, 8, 4, 8], theme: th, parent: ab });
  await avatar(u.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase(), 34, th, ur);
  const un = box('user text', { dir: 'V', theme: th, parent: ur });
  await txt(u.name, 'body2-strong', 'color/text/primary', th, { parent: un }); await txt(ROLE_META[role][0], 'caption', 'color/text/secondary', th, { parent: un });
  const main = box('main', { dir: 'V', gap: 24, pad: 32, theme: th, parent: col, clip: true }); main.layoutSizingHorizontal = 'FILL'; main.layoutGrow = 1;
  return { f, main };
}

/* ---------- Komponen dasar ---------- */
async function avatar(initials, size, th, parent) {
  const a = box('avatar', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary', radius: 999, theme: th, parent, fixed: [size, size] });
  await txt(initials, 'caption-strong', onPrimary(th), th, { parent: a, size: Math.max(10, Math.round(size * 0.4)) });
  return a;
}
/** Tombol MUI. o: v 'contained'|'outlined'|'text', color 'primary'|'error'|'success'|'default', size 'small'|'medium'|'large', icon, endIcon, disabled, fillW. */
async function button(label, th, parent, o = {}) {
  const v = o.v ?? 'contained', c = o.color ?? 'primary', size = o.size ?? 'medium';
  const main = c === 'default' ? 'color/text/primary' : COLOR_TOKENS[c][0];
  const hgt = { small: 30, medium: 36, large: 42 }[size], padX = { small: 10, medium: 16, large: 22 }[size];
  const dis = !!o.disabled;
  const b = box('Button/' + label, { dir: 'H', gap: 8, ax: 'CENTER', ay: 'CENTER', pad: [0, padX, 0, padX], fill: v === 'contained' ? (dis ? 'color/border' : main) : null, stroke: v === 'outlined' ? (dis ? 'color/border' : (c === 'default' ? 'color/border' : main)) : null, radius: 8, theme: th, parent });
  b.counterAxisSizingMode = 'FIXED'; b.resize(80, hgt); b.primaryAxisSizingMode = 'AUTO';
  const fg = dis ? 'color/text/disabled' : v === 'contained' ? (c === 'default' ? 'color/background' : onPrimary(th)) : main;
  if (o.icon) icon(o.icon, size === 'small' ? 16 : 18, fg, th, b);
  await txt(label, 'button', fg, th, { parent: b });
  if (o.endIcon) icon(o.endIcon, 16, fg, th, b);
  if (o.fillW) b.layoutSizingHorizontal = 'FILL';
  return b;
}
async function iconButton(name, th, parent, o = {}) {
  const b = box('IconButton/' + name, { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 999, theme: th, parent, fixed: [o.size ?? 34, o.size ?? 34] });
  icon(name, o.iconSize ?? 20, o.color ?? 'color/text/secondary', th, b); return b;
}
/** MUI Chip kecil. o: color 'default'|'primary'|'success'|'warning'|'error'|'info', variant 'solid'|'tint'|'outlined', icon, size 'small'|'medium'. */
async function chip(label, th, parent, o = {}) {
  const c = o.color ?? 'default', v = o.variant ?? 'solid';
  const [main, surf] = COLOR_TOKENS[c];
  const solidDefault = c === 'default' && v === 'solid';
  const fill = v === 'outlined' ? null : v === 'tint' ? surf : solidDefault ? 'color/border' : main;
  const fg = v === 'outlined' || v === 'tint' ? main : solidDefault ? 'color/text/primary' : onPrimary(th);
  const h = (o.size ?? 'small') === 'small' ? 24 : 32;
  const ch = box('Chip/' + label, { dir: 'H', gap: 6, ay: 'CENTER', pad: [0, h === 24 ? 9 : 12, 0, h === 24 ? 9 : 12], fill, stroke: v === 'outlined' ? main : null, radius: 16, theme: th, parent });
  ch.counterAxisSizingMode = 'FIXED'; ch.resize(40, h); ch.primaryAxisSizingMode = 'AUTO';
  if (o.icon) icon(o.icon, 14, fg, th, ch);
  await txt(label, 'caption-strong', fg, th, { parent: ch });
  return ch;
}
/** Kolom isian MUI outlined. o: w (lebar tetap, bila kosong FILL), select, multiline (jumlah baris), error, helper, icon, required, disabled, focus, endIcon. */
async function inputField(label, value, th, parent, o = {}) {
  const wrap = box('TextField/' + label, { dir: 'V', gap: 4, theme: th, parent });
  if (o.w) { wrap.resize(o.w, 56); wrap.primaryAxisSizingMode = 'AUTO'; wrap.counterAxisSizingMode = 'FIXED'; } else wrap.layoutSizingHorizontal = 'FILL';
  const hgt = o.multiline ? 24 * o.multiline + 32 : 56;
  const f = box('input', { dir: 'H', gap: 10, ay: o.multiline ? 'MIN' : 'CENTER', pad: o.multiline ? [16, 14, 16, 14] : [0, 14, 0, 14], stroke: o.error ? 'color/danger' : o.focus ? 'color/primary' : 'color/border', sw: o.focus ? 2 : 1, radius: 10, fill: o.disabled ? 'color/background' : null, theme: th, parent: wrap, fillW: true });
  f.counterAxisSizingMode = 'FIXED'; f.resize(200, hgt); f.layoutSizingHorizontal = 'FILL'; f.primaryAxisSizingMode = 'FIXED';
  if (o.icon) icon(o.icon, 20, 'color/text/secondary', th, f);
  const filled = value !== undefined && value !== null && value !== '';
  const vt = await txt(filled ? value : (label + (o.required ? ' *' : '')), 'body', filled ? (o.disabled ? 'color/text/disabled' : 'color/text/primary') : 'color/text/secondary', th, { parent: f }); vt.layoutGrow = 1; vt.layoutSizingHorizontal = 'FILL'; vt.textAutoResize = 'HEIGHT';
  if (o.select) icon('down', 20, 'color/text/secondary', th, f);
  if (o.endIcon) icon(o.endIcon, 20, 'color/text/secondary', th, f);
  if (filled) {
    const lab = box('label', { dir: 'H', pad: [0, 4, 0, 4], fill: 'color/surface', theme: th, parent: f });
    lab.layoutPositioning = 'ABSOLUTE'; lab.x = 10; lab.y = -9;
    await txt(label + (o.required ? ' *' : ''), 'caption', o.error ? 'color/danger' : o.focus ? 'color/primary' : 'color/text/secondary', th, { parent: lab });
  }
  if (o.helper) await txt(o.helper, 'caption', o.error ? 'color/danger' : 'color/text/secondary', th, { parent: wrap, fillW: true });
  return wrap;
}
/** Tab MUI (garis bawah). */
async function tabs(labels, active, th, parent) {
  const row = box('Tabs', { dir: 'H', stroke: 'color/border', theme: th, parent, fillW: true });
  row.strokeTopWeight = 0; row.strokeLeftWeight = 0; row.strokeRightWeight = 0;
  for (const [i, l] of labels.entries()) {
    const t = box('tab/' + l, { dir: 'V', ax: 'MAX', ay: 'CENTER', theme: th, parent: row });
    const inner = box('label', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [14, 20, 14, 20], theme: th, parent: t });
    await txt(l, 'body2-strong', i === active ? 'color/primary' : 'color/text/secondary', th, { parent: inner });
    const ind = figma.createRectangle(); ind.name = 'indicator'; ind.resize(80, 2); ind.fills = i === active ? [pv(th, 'color/primary')] : []; t.appendChild(ind); ind.layoutSizingHorizontal = 'FILL';
  }
  return row;
}
/** Kartu (MUI Card): radius 10 + border. */
function card(th, parent, o = {}) {
  const c = box(o.name ?? 'Card', { dir: o.dir ?? 'V', gap: o.gap ?? 0, pad: o.pad ?? 20, fill: 'color/surface', stroke: 'color/border', radius: 10, theme: th, parent, fillW: o.fillW !== false, ax: o.ax, ay: o.ay });
  if (o.clip) c.clipsContent = true;
  return c;
}
/** Judul halaman: kiri judul (h5) + subjudul, kanan tombol aksi. Mengembalikan baris aksi (isi dengan button()). */
async function pageHeader(th, parent, title, subtitle) {
  const row = box('PageHeader', { dir: 'H', ay: 'CENTER', theme: th, parent, fillW: true });
  const left = box('titles', { dir: 'V', gap: 4, theme: th, parent: row });
  await txt(title, 'h5', 'color/text/primary', th, { parent: left });
  if (subtitle) await txt(subtitle, 'body2', 'color/text/secondary', th, { parent: left });
  spacer(row);
  const actions = box('actions', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: row });
  return actions;
}
async function cardTitle(th, parent, title, subtitle) {
  const r = box('CardTitle', { dir: 'V', gap: 2, pad: [0, 0, 12, 0], theme: th, parent, fillW: true });
  await txt(title, 'subtitle', 'color/text/primary', th, { parent: r });
  if (subtitle) await txt(subtitle, 'body2', 'color/text/secondary', th, { parent: r });
  return r;
}
async function statCard(label, value, sub, ic, th, parent, o = {}) {
  const c = card(th, parent, { dir: 'H', gap: 12, ay: 'CENTER' }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
  const t = box('text', { dir: 'V', gap: 4, theme: th, parent: c }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
  await txt(label, 'body2', 'color/text/secondary', th, { parent: t }); await txt(value, 'h5', 'color/text/primary', th, { parent: t });
  if (sub) await txt(sub, 'caption', o.subColor ?? 'color/text/secondary', th, { parent: t });
  if (ic) { const b = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', radius: 12, theme: th, parent: c, fixed: [48, 48] }); icon(ic, 24, 'color/primary', th, b); }
  return c;
}
/** Alert MUI (standard, tinted). severity: success|warning|error|info. */
async function alertBox(severity, message, th, parent, title) {
  const [main, surf] = COLOR_TOKENS[severity];
  const a = box('Alert/' + severity, { dir: 'H', gap: 12, ay: 'MIN', pad: [10, 16, 10, 16], fill: surf, radius: 8, theme: th, parent, fillW: true });
  icon(severity === 'error' ? 'alert' : severity === 'warning' ? 'warn' : severity === 'success' ? 'check' : 'info', 22, main, th, a);
  const t = box('text', { dir: 'V', gap: 2, theme: th, parent: a }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
  if (title) await txt(title, 'body2-strong', 'color/text/primary', th, { parent: t, fillW: true });
  await txt(message, 'body2', 'color/text/primary', th, { parent: t, fillW: true });
  return a;
}
function checkbox(checked, th, parent) {
  const c = box('Checkbox', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 4, fill: checked ? 'color/primary' : null, stroke: checked ? 'color/primary' : 'color/text/secondary', sw: 2, theme: th, parent, fixed: [18, 18] });
  if (checked) icon('tick', 14, onPrimary(th), th, c); return c;
}
function toggle(on, th, parent) {
  const w = box('Switch', { dir: 'H', theme: th, parent, fixed: [40, 22] });
  const tr = figma.createRectangle(); tr.name = 'track'; tr.resize(34, 14); tr.cornerRadius = 7; tr.fills = [pv(th, on ? 'color/primary' : 'color/border')]; tr.opacity = on ? 0.5 : 1; w.appendChild(tr); tr.layoutPositioning = 'ABSOLUTE'; tr.x = 3; tr.y = 4;
  const th2 = figma.createRectangle(); th2.name = 'thumb'; th2.resize(20, 20); th2.cornerRadius = 10; th2.fills = [pv(th, on ? 'color/primary' : 'color/surface')]; th2.strokes = on ? [] : [pv(th, 'color/border')]; th2.strokeWeight = 1; w.appendChild(th2); th2.layoutPositioning = 'ABSOLUTE'; th2.x = on ? 19 : 1; th2.y = 1;
  return w;
}
/** Kotak pencarian. */
async function searchInput(th, parent, placeholder, w) { return inputField(placeholder ?? 'Cari…', '', th, parent, { w: w ?? 280, icon: 'search' }); }

/**
 * Tabel MUI. o.cols = [{ t:'Nama', w: 240 | 'fill', align: 'left'|'right'|'center' }], o.rows = [[sel,...]], o.rowH (52), o.foot (teks paginasi).
 * Sel: string | { t, sub } | { chip, color, variant } | { avatar:'BS', name, sub } | { actions:['edit','trash'] } | { check:true } | { switch:true } | { icon:'pin', t }
 */
async function table(th, parent, o) {
  const rowH = o.rowH ?? 52;
  const wrap = box('Table', { dir: 'V', theme: th, parent, fillW: true, fill: 'color/surface', stroke: 'color/border', radius: 10, clip: true });
  const mkRow = (name, isHead) => { const r = box(name, { dir: 'H', ay: 'CENTER', pad: [0, 16, 0, 16], theme: th, parent: wrap, stroke: 'color/border' }); r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; r.counterAxisSizingMode = 'FIXED'; r.resize(100, isHead ? 44 : rowH); r.layoutSizingHorizontal = 'FILL'; if (isHead) r.fills = [pv(th, 'color/background')]; return r; };
  const mkCell = (r, col) => { const c = box('cell', { dir: 'H', gap: 10, ay: 'CENTER', ax: col.align === 'right' ? 'MAX' : col.align === 'center' ? 'CENTER' : 'MIN', theme: th, parent: r }); if (col.w === 'fill' || col.w == null) { c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL'; } else { c.counterAxisSizingMode = 'AUTO'; c.primaryAxisSizingMode = 'FIXED'; c.resize(col.w, 20); } return c; };
  const head = mkRow('thead', true);
  for (const col of o.cols) { const c = mkCell(head, col); await txt(col.t, 'th', 'color/text/secondary', th, { parent: c, upper: true }); }
  for (const [ri, row] of o.rows.entries()) {
    const r = mkRow('row ' + (ri + 1), false);
    for (const [ci, col] of o.cols.entries()) {
      const c = mkCell(r, col); const v = row[ci];
      if (typeof v === 'string' || typeof v === 'number') await txt(String(v), 'body2', 'color/text/primary', th, { parent: c });
      else if (v && v.chip) await chip(v.chip, th, c, { color: v.color, variant: v.variant ?? 'tint' });
      else if (v && v.avatar) { await avatar(v.avatar, 32, th, c); const tx = box('t', { dir: 'V', theme: th, parent: c }); await txt(v.name, 'body2-strong', 'color/text/primary', th, { parent: tx }); if (v.sub) await txt(v.sub, 'caption', 'color/text/secondary', th, { parent: tx }); }
      else if (v && v.actions) { for (const a of v.actions) await iconButton(a, th, c, { size: 32, iconSize: 18 }); }
      else if (v && 'check' in v) checkbox(v.check, th, c);
      else if (v && 'switch' in v) toggle(v.switch, th, c);
      else if (v && v.icon) { icon(v.icon, 16, 'color/text/secondary', th, c); if (v.t) await txt(v.t, 'body2', 'color/text/primary', th, { parent: c }); }
      else if (v && v.t !== undefined) { const tx = box('t', { dir: 'V', theme: th, parent: c }); await txt(v.t, 'body2', 'color/text/primary', th, { parent: tx }); if (v.sub) await txt(v.sub, 'caption', 'color/text/secondary', th, { parent: tx }); }
    }
  }
  if (o.foot !== false) {
    const foot = box('pagination', { dir: 'H', gap: 20, ay: 'CENTER', ax: 'MAX', pad: [0, 16, 0, 16], theme: th, parent: wrap, fillW: true }); foot.counterAxisSizingMode = 'FIXED'; foot.resize(100, 52); foot.layoutSizingHorizontal = 'FILL';
    await txt('Baris per halaman:', 'body2', 'color/text/secondary', th, { parent: foot }); const sel = box('sel', { dir: 'H', gap: 4, ay: 'CENTER', theme: th, parent: foot }); await txt('10', 'body2', 'color/text/primary', th, { parent: sel }); icon('down', 16, 'color/text/secondary', th, sel);
    await txt(o.foot ?? `1–${o.rows.length} dari ${o.rows.length}`, 'body2', 'color/text/primary', th, { parent: foot });
    const nv = box('arrows', { dir: 'H', gap: 4, theme: th, parent: foot }); icon('left', 20, 'color/text/disabled', th, nv); icon('chevron', 20, 'color/text/secondary', th, nv);
  }
  return wrap;
}
/** Dialog modal di atas halaman: scrim + kertas. o: title, w (560), build(content) async, actions [{label, v, color}] (tombol di kanan bawah). */
async function dialog(th, frame, o) {
  const scrim = figma.createRectangle(); scrim.name = 'scrim'; scrim.resize(frame.width, frame.height); scrim.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.5 }];
  frame.appendChild(scrim); scrim.layoutPositioning = 'ABSOLUTE'; scrim.x = 0; scrim.y = 0;
  const w = o.w ?? 560;
  const d = box('Dialog', { dir: 'V', fill: 'color/surface', radius: 12, theme: th, parent: frame, fixed: [w, 100] });
  d.primaryAxisSizingMode = 'AUTO'; d.layoutPositioning = 'ABSOLUTE';
  const hd = box('title', { dir: 'H', ay: 'CENTER', pad: [20, 24, 16, 24], theme: th, parent: d, fillW: true });
  await txt(o.title, 'h6', 'color/text/primary', th, { parent: hd, fillW: true });
  const body = box('content', { dir: 'V', gap: 16, pad: [0, 24, 8, 24], theme: th, parent: d, fillW: true });
  if (o.build) await o.build(body);
  const ft = box('actions', { dir: 'H', gap: 8, ax: 'MAX', ay: 'CENTER', pad: [16, 24, 20, 24], theme: th, parent: d, fillW: true });
  for (const a of o.actions ?? []) await button(a.label, th, ft, { v: a.v ?? 'text', color: a.color, disabled: a.disabled });
  d.x = Math.round((frame.width - w) / 2); d.y = Math.max(40, Math.round((frame.height - d.height) / 2));
  return d;
}
async function emptyState(iconName, title, msg, th, parent, o = {}) {
  const w = box('EmptyState', { dir: 'V', gap: 12, ay: 'CENTER', pad: [48, 24, 48, 24], theme: th, parent, fillW: true });
  const c = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: o.danger ? 'color/danger-surface' : 'color/primary-surface', radius: 999, theme: th, parent: w, fixed: [64, 64] });
  icon(iconName, 28, o.danger ? 'color/danger' : 'color/primary', th, c);
  await txt(title, 'subtitle', 'color/text/primary', th, { parent: w, align: 'CENTER' }); await txt(msg, 'body2', 'color/text/secondary', th, { parent: w, align: 'CENTER' });
  return w;
}
/** Baris label : nilai untuk kartu rincian. */
async function kv(label, value, th, parent, o = {}) {
  const r = box('kv/' + label, { dir: 'H', gap: 16, ay: 'MIN', theme: th, parent, fillW: true });
  const l = await txt(label, 'body2', 'color/text/secondary', th, { parent: r }); l.resize(o.lw ?? 160, l.height); l.textAutoResize = 'HEIGHT';
  await txt(value, 'body2', 'color/text/primary', th, { parent: r, fillW: true });
  return r;
}
/** Bar filter di atas tabel: kotak cari + chip/field filter di kiri, aksi di kanan (kembalikan {left,right}). */
function toolbar(th, parent) {
  const r = box('Toolbar', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent, fillW: true });
  const left = box('filters', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: r }); spacer(r);
  const right = box('actions', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: r });
  return { left, right };
}
