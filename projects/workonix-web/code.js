
/* ===== projects/workonix-web/theme.config.js ===== */
/* THEME CONFIG — Workonix Web (sumber: components/ThemeRegistry.tsx, AppShell.tsx, app/(owner)/layout.tsx) */
const TOKEN_NAMES = [
  'color/primary', 'color/primary-light', 'color/primary-dark', 'color/primary-surface',
  'color/background', 'color/surface', 'color/border',
  'color/text/primary', 'color/text/secondary', 'color/text/disabled',
  'color/success', 'color/success-surface', 'color/warning', 'color/warning-surface',
  'color/danger', 'color/danger-surface', 'color/info', 'color/info-surface', 'color/sidebar',
];

const PALETTE = { // [light, dark] — dari buildTheme() di ThemeRegistry.tsx
  'color/primary': ['#1A56A7', '#5B9BF0'], 'color/primary-light': ['#1565C0', '#8AB9F5'], 'color/primary-dark': ['#154785', '#3F86E6'],
  'color/primary-surface': ['#E8EEF6', '#16263D'],
  'color/background': ['#F7F8FA', '#0B1220'], 'color/surface': ['#FFFFFF', '#121A2B'], 'color/border': ['#E7E9EC', '#273244'],
  'color/text/primary': ['#1A2028', '#E6EAF0'], 'color/text/secondary': ['#5C6470', '#9AA6B8'], 'color/text/disabled': ['#9AA1AC', '#5F6B7E'],
  'color/success': ['#1D9E75', '#34C38F'], 'color/success-surface': ['#E6F5F0', '#14302A'],
  'color/warning': ['#D97706', '#F5A524'], 'color/warning-surface': ['#FCF0E0', '#33291A'],
  'color/danger': ['#DC2626', '#F06A6A'], 'color/danger-surface': ['#FCE8E8', '#3A1F22'],
  'color/info': ['#0288D1', '#4FC3F7'], 'color/info-surface': ['#E1F2FA', '#15303D'],
  'color/sidebar': ['#1A56A7', '#0F2647'],
};

const TEXT_STYLES = { // Inter sebagai pengganti font sistem. [nama, style, ukuran, tinggi baris]
  h4: ['text/h4', 'Bold', 34, 41], h5: ['text/h5', 'Bold', 24, 32], h6: ['text/h6', 'Semi Bold', 20, 28],
  subtitle: ['text/subtitle', 'Semi Bold', 16, 24], body: ['text/body', 'Regular', 16, 24],
  body2: ['text/body2', 'Regular', 14, 20], 'body2-strong': ['text/body2-strong', 'Semi Bold', 14, 20],
  caption: ['text/caption', 'Regular', 12, 17], 'caption-strong': ['text/caption-strong', 'Semi Bold', 12, 17],
  th: ['text/table-head', 'Bold', 12, 16, 4], button: ['text/button', 'Semi Bold', 14, 20], label: ['text/label', 'Bold', 11, 14, 8],
};

/* ---------- Menu sidebar per peran (layout.tsx) ---------- */
const NAV = {
  owner: [
    { items: [{ label: 'Dasbor', icon: 'dashboard' }, { label: 'Persetujuan', icon: 'inbox', badge: 3 }] },
    { title: 'SDM', items: [{ label: 'Karyawan', icon: 'users' }, { label: 'Akses Akun', icon: 'key' }, { label: 'Surat Peringatan', icon: 'gavel' }] },
    { title: 'OPERASIONAL', items: [
      { label: 'Kehadiran', icon: 'fingerprint', children: ['Rekap Absensi', 'Koreksi Absensi', 'Roster', 'Shift', 'Hari Libur'] },
      { label: 'Cuti', icon: 'umbrella', children: ['Pengajuan Cuti', 'Saldo Cuti'] },
      { label: 'Lembur', icon: 'timer', children: ['Pengajuan Lembur', 'Rekap Lembur'] },
      { label: 'Daily Timesheet', icon: 'clipboard', children: ['All Department', 'Pengaturan Pilihan'] }] },
    { title: 'PAYROLL', items: [{ label: 'Payroll', icon: 'money', children: ['Proses Payroll', 'Laporan Payroll', 'Gaji Tambahan', 'Penetapan Gaji', 'Struktur Gaji', 'Komponen Gaji'] }] },
    { title: 'PERUSAHAAN', items: [{ label: 'Organisasi', icon: 'building', children: ['Daftar Perusahaan', 'Struktur Perusahaan', 'Jabatan', 'Struktur Organisasi', 'Lokasi Kantor'] }, { label: 'Laporan Pengajuan', icon: 'file' }] },
    { title: 'PENGATURAN', items: [{ label: 'Pengaturan', icon: 'settings', children: ['Aturan Absensi', 'Pengaturan Cuti', 'Pengaturan Lembur', 'Pengaturan Payroll'] }, { label: 'Hak Akses', icon: 'shield' }] },
    { title: 'SAYA', items: [{ label: 'Pengajuan Saya', icon: 'person', children: ['Koreksi Absensi ', 'Cuti ', 'Lembur ', 'Slip Gaji', 'Timesheet: Dashboard', 'Timesheet: My Activity'] }] },
  ],
  employee: [
    { title: 'SAYA', items: [{ label: 'Profil Saya', icon: 'person' }, { label: 'Cuti  ', icon: 'umbrella' }, { label: 'Lembur  ', icon: 'timer' }, { label: 'Koreksi Absensi  ', icon: 'file' }, { label: 'Daily Timesheet', icon: 'clipboard', children: ['Dashboard', 'My Activity', 'Team Activity', 'Shared (All)'] }] },
    { title: 'LAINNYA', items: [{ label: 'Persetujuan ', icon: 'inbox', badge: 2 }] },
  ],
  super: [{ title: 'PLATFORM', items: [{ label: 'Dasbor ', icon: 'dashboard' }, { label: 'Grup', icon: 'building' }, { label: 'Paket', icon: 'plans' }] }],
};
/** Label aktif: tulis persis label menu; spasi di ujung hanya pembeda label ganda (mis. "Cuti " = Cuti di Pengajuan Saya). */
const ROLE_META = { owner: ['Pemilik', '#C4B5FD'], employee: ['Karyawan', '#6EE7B7'], super: ['Super Admin', '#FCA5A5'] };



/* ===== core/kit-base.js ===== */
/* =====================================================================
 * KIT BASE — inti yang dipakai semua proyek (kit mobile maupun web).
 * Bergantung pada konstanta dari theme.config.js proyek: TOKEN_NAMES, PALETTE, TEXT_STYLES.
 * Warna dipakai lewat NAMA token; tema 'light' | 'dark'; 'white' = putih tetap.
 * Plan Starter Figma = 1 mode/koleksi, jadi gelap = koleksi "Color Dark" terpisah.
 * ===================================================================== */
const hexToRgb = (h) => { const n = parseInt(h.slice(1), 16); return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }; };
const KIT = { vars: { light: {}, dark: {} }, styles: {} };
const WHITE_PAINT = { type: 'SOLID', color: { r: 1, g: 1, b: 1 } };

async function ensureFoundations() {
  for (const s of ['Regular', 'Medium', 'Semi Bold', 'Bold']) await figma.loadFontAsync({ family: 'Inter', style: s });
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  for (const [theme, colName, idx] of [['light', 'Color Light', 0], ['dark', 'Color Dark', 1]]) {
    let col = cols.find((c) => c.name === colName);
    if (!col) { col = figma.variables.createVariableCollection(colName); col.renameMode(col.modes[0].modeId, 'Value'); }
    const existing = {};
    for (const id of col.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); existing[v.name] = v; }
    for (const name of TOKEN_NAMES) {
      let v = existing[name];
      if (!v) {
        v = figma.variables.createVariable(name, col, 'COLOR');
        v.scopes = name.startsWith('color/text/') ? ['TEXT_FILL'] : name === 'color/border' ? ['STROKE_COLOR'] : ['ALL_FILLS'];
        v.setValueForMode(col.modes[0].modeId, hexToRgb(PALETTE[name][idx]));
      }
      KIT.vars[theme][name] = v;
    }
  }
  const styles = await figma.getLocalTextStylesAsync();
  for (const [key, [name, style, size, lh, ls]] of Object.entries(TEXT_STYLES)) {
    let s = styles.find((x) => x.name === name);
    if (!s) {
      s = figma.createTextStyle(); s.name = name; s.fontName = { family: 'Inter', style }; s.fontSize = size; s.lineHeight = { unit: 'PIXELS', value: lh };
      if (ls) s.letterSpacing = { unit: 'PERCENT', value: ls };
    }
    KIT.styles[key] = s;
  }
}
function pv(theme, name) {
  if (name === 'white') return WHITE_PAINT;
  const v = KIT.vars[theme][name];
  if (!v) throw new Error('Token warna tidak dikenal: ' + name);
  return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v);
}
/** figma.createAutoLayout hanya ada di MCP; API plugin biasa tidak punya. */
function makeAutoLayout(dir) {
  const f = figma.createFrame(); f.layoutMode = dir === 'VERTICAL' ? 'VERTICAL' : 'HORIZONTAL';
  f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; return f;
}
/**
 * Auto-layout frame. o: dir 'H'|'V', gap, pad (n|[t,r,b,l]), ax (MIN|MAX|CENTER|SPACE_BETWEEN), ay (MIN|MAX|CENTER|BASELINE),
 * fill/stroke (token), sw, radius, theme, parent, fillW (lebar FILL), fixed [w,h], clip, opacity.
 */
function box(name, o = {}) {
  const f = makeAutoLayout(o.dir === 'H' ? 'HORIZONTAL' : 'VERTICAL');
  f.name = name; f.itemSpacing = o.gap ?? 0;
  const p = o.pad ?? 0; const [pt, pr, pb, pl] = Array.isArray(p) ? p : [p, p, p, p];
  f.paddingTop = pt; f.paddingRight = pr; f.paddingBottom = pb; f.paddingLeft = pl;
  if (o.ax) f.primaryAxisAlignItems = o.ax; if (o.ay) f.counterAxisAlignItems = o.ay;
  f.fills = o.fill ? [pv(o.theme, o.fill)] : [];
  if (o.stroke) { f.strokes = [pv(o.theme, o.stroke)]; f.strokeWeight = o.sw ?? 1; f.strokeAlign = 'INSIDE'; }
  if (o.radius != null) f.cornerRadius = o.radius;
  if (o.clip) f.clipsContent = true;
  if (o.parent) o.parent.appendChild(f);
  if (o.fillW) f.layoutSizingHorizontal = 'FILL';
  if (o.fixed) { f.resize(o.fixed[0], o.fixed[1]); f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED'; }
  return f;
}
/** Teks bergaya. style: h4|h5|h6|subtitle|body|body2|body2-strong|caption|caption-strong|th|button|label. o: parent, fillW, upper, align, name, size, w (lebar tetap + wrap). */
async function txt(str, style, color, theme, o = {}) {
  const t = figma.createText(); t.name = o.name ?? String(str).slice(0, 24);
  await t.setTextStyleIdAsync(KIT.styles[style].id);
  t.characters = String(str); t.fills = [pv(theme, color)];
  if (o.size) t.fontSize = o.size;
  if (o.parent) o.parent.appendChild(t);
  if (o.fillW) { t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; }
  if (o.w) { t.textAutoResize = 'HEIGHT'; t.resize(o.w, t.height); }
  if (o.upper) t.textCase = 'UPPER';
  if (o.align) t.textAlignHorizontal = o.align;
  return t;
}
function gap(parent, h) { const g = figma.createFrame(); g.name = 'gap'; g.resize(1, h); g.fills = []; parent.appendChild(g); return g; }
function vgap(parent, w) { const g = figma.createFrame(); g.name = 'gap'; g.resize(w, 1); g.fills = []; parent.appendChild(g); return g; }
/** Pengisi fleksibel yang mendorong sisanya ke ujung (di auto-layout H atau V). */
function spacer(parent) { const g = figma.createFrame(); g.name = 'spacer'; g.resize(1, 1); g.fills = []; parent.appendChild(g); g.layoutGrow = 1; return g; }

const ICONS = {
  "search": "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-3.5-3.5\"/>",
  "plus": "<path d=\"M12 5v14M5 12h14\"/>",
  "lock": "<rect x=\"5\" y=\"11\" width=\"14\" height=\"9\" rx=\"2\"/><path d=\"M8 11V8a4 4 0 0 1 8 0v3\"/>",
  "users": "<circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6\"/><circle cx=\"17\" cy=\"9\" r=\"2.5\"/><path d=\"M17 14c2.2 0 4 1.8 4 4\"/>",
  "globe": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18\"/>",
  "timer": "<circle cx=\"12\" cy=\"13\" r=\"8\"/><path d=\"M12 9v4l2.5 2M9 3h6\"/>",
  "pin": "<path d=\"M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/>",
  "repeat": "<path d=\"M17 2l3 3-3 3\"/><path d=\"M4 11V9a4 4 0 0 1 4-4h12\"/><path d=\"M7 22l-3-3 3-3\"/><path d=\"M20 13v2a4 4 0 0 1-4 4H4\"/>",
  "check": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M8 12.5l3 3 5-6\"/>",
  "verified": "<path d=\"M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z\"/><path d=\"M9 12l2 2 4-4\"/>",
  "more": "<circle cx=\"12\" cy=\"5\" r=\"1.3\"/><circle cx=\"12\" cy=\"12\" r=\"1.3\"/><circle cx=\"12\" cy=\"19\" r=\"1.3\"/>",
  "back": "<path d=\"M19 12H5M11 6l-6 6 6 6\"/>",
  "clipboard": "<rect x=\"6\" y=\"4\" width=\"12\" height=\"17\" rx=\"2\"/><path d=\"M9 4h6v3H9zM9 12h6M9 16h4\"/>",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>",
  "calendar": "<rect x=\"4\" y=\"5\" width=\"16\" height=\"15\" rx=\"2\"/><path d=\"M4 10h16M9 3v4M15 3v4\"/>",
  "person": "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8\"/>",
  "radio": "<circle cx=\"12\" cy=\"12\" r=\"9\"/>",
  "mylocation": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M12 2v3M12 19v3M2 12h3M19 12h3\"/>",
  "searchoff": "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-3.5-3.5M4 4l16 16\"/>",
  "alert": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 8v5M12 16.5v.5\"/>",
  "locoff": "<path d=\"M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z\"/><path d=\"M4 4l16 16\"/>",
  "chevron": "<path d=\"M9 6l6 6-6 6\"/>",
  "x": "<path d=\"M6 6l12 12M18 6L6 18\"/>",
  "eye": "<path d=\"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>",
  "eyeoff": "<path d=\"M3 3l18 18M10.6 5.1A9.8 9.8 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 4M6.3 6.3A17 17 0 0 0 2 12s4 7 10 7a9.7 9.7 0 0 0 4-.9\"/>",
  "edit": "<path d=\"M4 20h4L19 9l-4-4L4 16z\"/>",
  "trash": "<path d=\"M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3\"/>",
  "copy": "<rect x=\"9\" y=\"9\" width=\"11\" height=\"11\" rx=\"2\"/><path d=\"M5 15V6a2 2 0 0 1 2-2h9\"/>",
  "home": "<path d=\"M4 11l8-7 8 7v9h-5v-6H9v6H4z\"/>",
  "bell": "<path d=\"M6 17V11a6 6 0 0 1 12 0v6l2 2H4z\"/><path d=\"M10 21h4\"/>",
  "logout": "<path d=\"M10 4H5v16h5M15 8l4 4-4 4M19 12H9\"/>",
  "inbox": "<path d=\"M4 13l2-8h12l2 8v6H4z\"/><path d=\"M4 13h5l1 2h4l1-2h5\"/>",
  "file": "<path d=\"M7 3h7l5 5v13H7z\"/><path d=\"M14 3v5h5\"/>",
  "camera": "<path d=\"M4 8h3l2-3h6l2 3h3v12H4z\"/><circle cx=\"12\" cy=\"13\" r=\"3.5\"/>",
  "swap": "<path d=\"M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7\"/>",
  "money": "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"2.5\"/>",
  "mail": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M3 7l9 7 9-7\"/>",
  "warn": "<path d=\"M12 3l10 18H2z\"/><path d=\"M12 10v5M12 18v.5\"/>",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v6M12 7.5v.5\"/>",
  "gavel": "<path d=\"M14 4l6 6-4 4-6-6zM9 9L3 15l3 3 6-6M3 21h10\"/>",
  "face": "<path d=\"M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2\"/><circle cx=\"9.5\" cy=\"10\" r=\".6\"/><circle cx=\"14.5\" cy=\"10\" r=\".6\"/><path d=\"M9 15c1 1 5 1 6 0\"/>",
  "download": "<path d=\"M12 4v12M7 11l5 5 5-5M5 20h14\"/>",
  "upload": "<path d=\"M12 16V4M7 9l5-5 5 5M5 20h14\"/>",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4\"/>",
  "tick": "<path d=\"M5 12.5l4.5 4.5L19 7.5\"/>",
  "down": "<path d=\"M6 9l6 6 6-6\"/>",
  "up": "<path d=\"M6 15l6-6 6 6\"/>",
  "left": "<path d=\"M15 6l-6 6 6 6\"/>",
  "moon": "<path d=\"M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z\"/>",
  "dashboard": "<rect x=\"3\" y=\"3\" width=\"8\" height=\"10\" rx=\"1.5\"/><rect x=\"13\" y=\"3\" width=\"8\" height=\"6\" rx=\"1.5\"/><rect x=\"13\" y=\"11\" width=\"8\" height=\"10\" rx=\"1.5\"/><rect x=\"3\" y=\"15\" width=\"8\" height=\"6\" rx=\"1.5\"/>",
  "key": "<circle cx=\"8\" cy=\"15\" r=\"4\"/><path d=\"M11 12l9-9M16 7l3 3\"/>",
  "fingerprint": "<path d=\"M12 11v4c0 2 .5 3.5 1.5 5M8 11a4 4 0 0 1 8 0v1c0 2.5.3 4.5 1 6M5 12a7 7 0 0 1 14 0c0 2 .2 3.5.6 5\"/>",
  "umbrella": "<path d=\"M3 12a9 9 0 0 1 18 0zM12 12v7a2 2 0 0 0 4 0\"/>",
  "building": "<path d=\"M4 21V5l8-2v18M12 8l8 2v11M3 21h18M8 8v.5M8 12v.5M8 16v.5M16 14v.5M16 17v.5\"/>",
  "settings": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1\"/>",
  "shield": "<path d=\"M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z\"/>",
  "plans": "<path d=\"M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z\"/>",
  "filter": "<path d=\"M4 5h16l-6 8v6l-4-2v-4z\"/>",
  "refresh": "<path d=\"M20 11a8 8 0 0 0-14-4M4 5v4h4M4 13a8 8 0 0 0 14 4M20 19v-4h-4\"/>",
  "map": "<path d=\"M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z\"/><path d=\"M9 4v14M15 6v14\"/>",
};
function registerIcons(map) { Object.assign(ICONS, map); }
function icon(name, size, color, theme, parent, fillIcon) {
  if (!ICONS[name]) throw new Error('Ikon tidak dikenal: ' + name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
  const n = figma.createNodeFromSvg(svg); n.name = 'icon/' + name;
  const paint = pv(theme, color);
  for (const c of n.findAll((x) => 'strokes' in x)) { c.strokes = [paint]; if (fillIcon || name === 'more') c.fills = [paint]; }
  if (parent) parent.appendChild(n);
  return n;
}

/* ---------- Registry ---------- */
const REGISTRY = []; const LINKS = []; const FLOW_STARTS = []; let CURRENT = { key: null, theme: null };
function registerScreen(def) { REGISTRY.push(def); }
function link(node, target, kind) { LINKS.push({ fromKey: CURRENT.key, theme: CURRENT.theme, node, target, kind: kind ?? 'push' }); }
function flowStart(key, name) { FLOW_STARTS.push({ key, name }); }
const frameName = (def, theme) => `${def.group} / ${def.title} / ${theme}`;


/* ===== core/kit-web.js ===== */
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


/* ===== projects/workonix-web/screens/20-auth-super.js ===== */
/* =====================================================================
 * Auth dan Super Admin — login, set/ganti kata sandi, privasi, dan panel Super Admin (prefiks wa / WA_)
 * Sumber: app/login, set-password, change-password, privacy, (dashboard)/{dashboard,groups,groups/[id],groups/new,plans},
 *         components/GroupStatusBanner.tsx, UsagePanel.tsx
 * ===================================================================== */
const WA_GROUP = 'Auth dan Super Admin';

registerIcons({
  'wa-eyeoff': '<path d="M3 3l18 18M10.6 5.1A9.6 9.6 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6C3.6 8.4 2 12 2 12s4 7 10 7c1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  'wa-bolt': '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  'wa-chart': '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8"/>',
  'wa-pause': '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
  'wa-play': '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/>',
  'wa-cancel': '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  'wa-minus': '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  'wa-arrow': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'wa-premium': '<circle cx="12" cy="9" r="5"/><path d="M9 13.5L7 21l5-3 5 3-2-7.5"/>',
});

/* ---------- Pembantu umum ---------- */
function waCol(th, parent, w, gap, name) {
  const c = box(name ?? 'col', { dir: 'V', gap: gap ?? 0, theme: th, parent });
  c.resize(w, 100); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
  return c;
}
function waDivider(th, parent) { const d = box('divider', { theme: th, parent, fixed: [10, 1], fill: 'color/border' }); d.layoutSizingHorizontal = 'FILL'; return d; }
function waBar(th, parent, w, ratio, color) {
  const b = box('LinearProgress', { dir: 'H', theme: th, parent, fixed: [w, 6], fill: 'color/border', radius: 3, clip: true });
  const r = figma.createRectangle(); r.name = 'bar'; r.resize(Math.max(1, Math.round(w * ratio)), 6); r.fills = [pv(th, color)]; b.appendChild(r);
  return b;
}
async function waLogo(th, parent, dark) {
  const row = box('Logo', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent });
  const m = box('mark', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 9, theme: th, parent: row, fixed: [36, 36], fill: dark ? null : 'color/primary' });
  if (dark) m.fills = [WHITE_PAINT];
  await txt('W', 'subtitle', dark ? 'color/primary' : onPrimary(th), th, { parent: m });
  await txt('workonix', 'h6', dark ? 'white' : 'color/text/primary', th, { parent: row });
  return row;
}
function waSpin(th, parent) { return icon('refresh', 28, 'color/primary', th, parent); }

/* ---------- Login ---------- */
const WA_HIGHLIGHTS = [
  ['wa-bolt', 'Absensi langsung tercatat', 'Pantau kehadiran tim dari mana saja.'],
  ['wa-chart', 'Laporan otomatis', 'Rekap cuti, lembur, dan payroll tanpa hitung manual.'],
  ['shield', 'Data aman', 'Data HR tersimpan aman dan terenkripsi.'],
];
async function waLogin(th, o = {}) {
  const { f, main } = await page('x', th, { noShell: true, h: 900 });
  main.paddingTop = main.paddingBottom = main.paddingLeft = main.paddingRight = 0; main.itemSpacing = 0; main.primaryAxisAlignItems = 'MIN'; main.counterAxisAlignItems = 'MIN';
  const row = box('login', { dir: 'H', theme: th, parent: main, fillW: true }); row.layoutSizingVertical = 'FILL';
  // Panel kiri (branding)
  const left = box('Panel branding', { dir: 'V', ax: 'SPACE_BETWEEN', pad: 48, fill: 'color/sidebar', theme: th, parent: row, fixed: [560, 900], clip: true });
  left.layoutSizingVertical = 'FILL';
  await waLogo(th, left, true);
  const mid = box('copy', { dir: 'V', gap: 32, theme: th, parent: left, fillW: true });
  const hd = box('headline', { dir: 'V', gap: 12, theme: th, parent: mid, fillW: true });
  await txt('Urusan HR jadi lebih gampang.', 'h4', 'white', th, { parent: hd, fillW: true });
  (await txt('Absensi, cuti, lembur, payroll, dan laporannya ada di satu tempat.', 'body', 'white', th, { parent: hd, fillW: true })).opacity = 0.75;
  const hl = box('highlights', { dir: 'V', gap: 20, theme: th, parent: mid, fillW: true });
  for (const [ic, title, desc] of WA_HIGHLIGHTS) {
    const r = box('highlight', { dir: 'H', gap: 16, ay: 'MIN', theme: th, parent: hl, fillW: true });
    const ib = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 8, theme: th, parent: r, fixed: [40, 40] }); ib.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.12 }];
    icon(ic, 20, 'white', th, ib);
    const t = box('text', { dir: 'V', gap: 2, theme: th, parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
    await txt(title, 'body-strong' in TEXT_STYLES ? 'body-strong' : 'subtitle', 'white', th, { parent: t, fillW: true });
    (await txt(desc, 'body2', 'white', th, { parent: t, fillW: true })).opacity = 0.7;
  }
  (await txt('© 2026 Workonix. Semua hak dilindungi.', 'body2', 'white', th, { parent: left })).opacity = 0.5;
  // Panel kanan (form)
  const right = box('Panel form', { dir: 'V', ax: 'CENTER', ay: 'CENTER', pad: 48, theme: th, parent: row }); right.layoutGrow = 1; right.layoutSizingHorizontal = 'FILL'; right.layoutSizingVertical = 'FILL';
  const col = waCol(th, right, 380, 0, 'form');
  const ttl = box('titles', { dir: 'V', gap: 6, pad: [0, 0, 32, 0], theme: th, parent: col, fillW: true });
  await txt('Selamat datang', 'h5', 'color/text/primary', th, { parent: ttl });
  await txt('Masuk untuk melanjutkan', 'body2', 'color/text/secondary', th, { parent: ttl });
  const form = box('Stack', { dir: 'V', gap: 18, theme: th, parent: col, fillW: true });
  if (o.error) await alertBox('error', o.error, th, form);
  await inputField('Email kantor atau pribadi', o.email ?? '', th, form, { icon: 'mail', required: true, focus: !o.error && !o.email, error: false });
  await inputField('Kata Sandi', o.pw ?? '', th, form, { icon: 'lock', endIcon: 'eye', required: true });
  const btn = box('submit', { dir: 'V', pad: [8, 0, 0, 0], theme: th, parent: form, fillW: true });
  await button(o.submitting ? 'Memproses...' : 'Masuk', th, btn, { size: 'large', fillW: true, disabled: !!o.submitting });
  return f;
}
registerScreen({ key: 'login', group: WA_GROUP, title: 'Login', build: (th) => waLogin(th) });
registerScreen({ key: 'login-galat', group: WA_GROUP, title: 'Login galat 401', build: (th) => waLogin(th, { email: 'budi.santoso@perusahaan.co.id', pw: '••••••••', error: 'Email atau kata sandi salah' }) });
registerScreen({ key: 'login-galat-429', group: WA_GROUP, title: 'Login galat 429', build: (th) => waLogin(th, { email: 'budi.santoso@perusahaan.co.id', pw: '••••••••', error: 'Terlalu banyak percobaan masuk untuk akun ini. Coba lagi dalam 15 menit.' }) });
registerScreen({ key: 'login-memproses', group: WA_GROUP, title: 'Login memproses', build: (th) => waLogin(th, { email: 'budi.santoso@perusahaan.co.id', pw: '••••••••', submitting: true }) });

/* ---------- Set / ganti kata sandi ---------- */
async function waPassCard(th, f, main, o) {
  const c = box('Card', { dir: 'V', gap: 0, pad: 36, fill: 'color/surface', stroke: 'color/border', radius: 12, theme: th, parent: main });
  c.resize(440, 100); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
  return c;
}
async function waPassHead(th, parent, title, sub) {
  const h = box('header', { dir: 'V', gap: 12, ay: 'CENTER', pad: [0, 0, 24, 0], theme: th, parent, fillW: true });
  const av = box('Avatar', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary', radius: 999, theme: th, parent: h, fixed: [48, 48] });
  icon('lock', 24, onPrimary(th), th, av);
  const t = box('text', { dir: 'V', gap: 4, ay: 'CENTER', theme: th, parent: h, fillW: true });
  await txt(title, 'h6', 'color/text/primary', th, { parent: t, fillW: true, align: 'CENTER' });
  await txt(sub, 'body2', 'color/text/secondary', th, { parent: t, fillW: true, align: 'CENTER' });
}
async function waSetPassword(th, o = {}) {
  const { f, main } = await page('x', th, { noShell: true, h: 900 });
  f.fills = [pv(th, 'color/success')]; // pendekatan gradien hijau di kode asli
  const c = await waPassCard(th, f, main);
  await waPassHead(th, c, 'Halo, Budi Santoso', 'Buat kata sandi untuk akun budi.santoso@perusahaan.co.id');
  const form = box('Stack', { dir: 'V', gap: 18, theme: th, parent: c, fillW: true });
  if (o.error) await alertBox('error', o.error, th, form);
  await inputField('Kata sandi baru', o.pw ?? '', th, form, { icon: 'lock', required: true, helper: 'Minimal 8 karakter', focus: !o.error && !o.pw });
  await inputField('Ulangi kata sandi', o.confirm ?? '', th, form, { required: true });
  const b = box('submit', { dir: 'V', pad: [8, 0, 0, 0], theme: th, parent: form, fillW: true });
  await button(o.submitting ? 'Menyimpan...' : 'Buat Kata Sandi & Masuk', th, b, { size: 'large', fillW: true, disabled: !!o.submitting });
  return f;
}
registerScreen({ key: 'set-password', group: WA_GROUP, title: 'Buat kata sandi (undangan)', build: (th) => waSetPassword(th) });
registerScreen({ key: 'set-password-galat', group: WA_GROUP, title: 'Buat kata sandi galat pendek', build: (th) => waSetPassword(th, { pw: '••••', confirm: '••••', error: 'Kata sandi minimal 8 karakter.' }) });
registerScreen({ key: 'set-password-galat-beda', group: WA_GROUP, title: 'Buat kata sandi galat tidak sama', build: (th) => waSetPassword(th, { pw: '••••••••••', confirm: '•••••••••', error: 'Kata sandi yang diulang tidak sama.' }) });
registerScreen({ key: 'set-password-tautan-galat', group: WA_GROUP, title: 'Buat kata sandi tautan mati', build: async (th) => {
  const { f, main } = await page('x', th, { noShell: true, h: 900 });
  f.fills = [pv(th, 'color/success')];
  const c = await waPassCard(th, f, main);
  const g = box('stack', { dir: 'V', gap: 20, theme: th, parent: c, fillW: true });
  await alertBox('error', 'Tautan tidak lengkap. Buka lagi tautan dari email.', th, g);
  await txt('Tautan undangan berlaku 24 jam dan cuma bisa dipakai sekali. Minta HR kirim undangan baru.', 'body2', 'color/text/secondary', th, { parent: g, fillW: true });
  await button('Ke Halaman Masuk', th, g, { v: 'outlined', fillW: true });
  return f;
} });
async function waChangePassword(th, o = {}) {
  const { f, main } = await page('x', th, { noShell: true, h: 900 });
  const c = await waPassCard(th, f, main);
  await waPassHead(th, c, 'Ganti Kata Sandi', 'Kata sandi sementara dari HR perlu diganti dulu sebelum memakai aplikasi.');
  const form = box('Stack', { dir: 'V', gap: 18, theme: th, parent: c, fillW: true });
  if (o.error) await alertBox('error', o.error, th, form);
  await inputField('Kata sandi sementara', o.cur ?? '', th, form, { icon: 'lock', required: true, focus: !o.error && !o.cur });
  await inputField('Kata sandi baru', o.pw ?? '', th, form, { required: true, helper: 'Minimal 8 karakter' });
  await inputField('Ulangi kata sandi baru', o.confirm ?? '', th, form, { required: true });
  const b = box('submit', { dir: 'V', gap: 8, pad: [8, 0, 0, 0], theme: th, parent: form, fillW: true });
  await button(o.submitting ? 'Menyimpan...' : 'Simpan Kata Sandi', th, b, { size: 'large', fillW: true, disabled: !!o.submitting });
  const out = box('keluar', { dir: 'H', ax: 'CENTER', theme: th, parent: b, fillW: true });
  await button('Keluar', th, out, { v: 'text', color: 'default', size: 'small' });
  return f;
}
registerScreen({ key: 'change-password', group: WA_GROUP, title: 'Ganti kata sandi', build: (th) => waChangePassword(th) });
registerScreen({ key: 'change-password-galat', group: WA_GROUP, title: 'Ganti kata sandi galat pendek', build: (th) => waChangePassword(th, { cur: '••••••••', pw: '•••', confirm: '•••', error: 'Kata sandi baru minimal 8 karakter.' }) });
registerScreen({ key: 'change-password-galat-sama', group: WA_GROUP, title: 'Ganti kata sandi galat sama', build: (th) => waChangePassword(th, { cur: '••••••••••', pw: '••••••••••', confirm: '••••••••••', error: 'Kata sandi baru harus beda dari kata sandi sementara.' }) });
registerScreen({ key: 'change-password-galat-beda', group: WA_GROUP, title: 'Ganti kata sandi galat tidak sama', build: (th) => waChangePassword(th, { cur: '••••••••', pw: '••••••••••', confirm: '•••••••••', error: 'Kata sandi yang diulang tidak sama.' }) });

/* ---------- Kebijakan privasi ---------- */
async function waPrivBase(th, h) {
  const { f, main } = await page('x', th, { noShell: true, h });
  main.primaryAxisAlignItems = 'MIN'; main.paddingTop = 48; main.itemSpacing = 0;
  const wrap = waCol(th, main, 852, 0, 'Container');
  return { f, wrap };
}
async function waSection(th, parent, title) {
  const s = box('Section', { dir: 'V', gap: 12, pad: [32, 0, 0, 0], theme: th, parent, fillW: true });
  await txt(title, 'h6', 'color/text/primary', th, { parent: s, fillW: true });
  return s;
}
async function waP(th, parent, str) { return txt(str, 'body', 'color/text/primary', th, { parent, fillW: true }); }
async function waList(th, parent, items, ordered) {
  const l = box('List', { dir: 'V', gap: 6, pad: [0, 0, 0, 8], theme: th, parent, fillW: true });
  for (const [i, it] of items.entries()) {
    const r = box('item', { dir: 'H', gap: 8, ay: 'MIN', theme: th, parent: l, fillW: true });
    await txt(ordered ? `${i + 1}.` : '•', 'body', 'color/text/primary', th, { parent: r });
    await txt(it, 'body', 'color/text/primary', th, { parent: r, fillW: true });
  }
}
async function waDataTable(th, parent, head, rows, widths) {
  const t = box('Table', { dir: 'V', theme: th, parent, fillW: true, stroke: 'color/border', radius: 8, clip: true });
  const mk = async (cells, isHead) => {
    const r = box(isHead ? 'thead' : 'row', { dir: 'H', ay: 'MIN', pad: [10, 12, 10, 12], theme: th, parent: t, fillW: true, stroke: 'color/border' });
    r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; if (isHead) r.fills = [pv(th, 'color/background')];
    for (const [i, c] of cells.entries()) { const cell = box('cell', { dir: 'V', theme: th, parent: r, pad: [0, 8, 0, 0] }); await txt(c, isHead ? 'body2-strong' : 'body2', 'color/text/primary', th, { parent: cell, w: widths[i] - 8 }); cell.resize(widths[i], cell.height); cell.primaryAxisSizingMode = 'AUTO'; cell.counterAxisSizingMode = 'FIXED'; }
  };
  await mk(head, true); for (const r of rows) await mk(r, false);
}
registerScreen({ key: 'privacy', group: WA_GROUP, title: 'Kebijakan privasi (atas)', build: async (th) => {
  const { f, wrap } = await waPrivBase(th, 1700);
  await waLogo(th, wrap, false);
  const hd = box('title', { dir: 'V', gap: 8, pad: [32, 0, 0, 0], theme: th, parent: wrap, fillW: true });
  await txt('Kebijakan Privasi Workonix', 'h4', 'color/text/primary', th, { parent: hd, fillW: true });
  await txt('Berlaku sejak 18 November 2026', 'body2', 'color/text/secondary', th, { parent: hd });
  let s = await waSection(th, wrap, '1. Tentang kebijakan ini');
  await waP(th, s, 'Workonix adalah aplikasi absensi dan HR untuk karyawan perusahaan yang berlangganan Workonix. Aplikasi ini dikelola oleh PT Contoh Perusahaan ("kami").');
  await waP(th, s, 'Akun Anda dibuat oleh perusahaan tempat Anda bekerja ("Perusahaan"). Perusahaan menentukan data apa yang dipakai dan untuk apa, misalnya apakah verifikasi wajah dinyalakan. Kami memproses data atas nama Perusahaan, sesuai Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).');
  await waP(th, s, 'Kebijakan ini berlaku untuk aplikasi Workonix di Android dan iOS.');
  s = await waSection(th, wrap, '2. Data yang kami kumpulkan');
  await waP(th, s, 'Kami hanya mengumpulkan data yang diperlukan untuk absensi dan administrasi HR. Sebagian besar data kepegawaian dimasukkan oleh HR Perusahaan, bukan oleh aplikasi.');
  await waDataTable(th, s, ['Jenis data', 'Contoh', 'Sumber'], [
    ['Identitas dan kepegawaian', 'Nama lengkap, nomor karyawan, email kerja, jabatan, departemen, atasan, tanggal bergabung, status kontrak', 'HR Perusahaan'],
    ['Akun', 'Email untuk masuk, kata sandi (disimpan dalam bentuk hash)', 'HR Perusahaan, Anda'],
    ['Perangkat', 'ID perangkat buatan aplikasi, merek dan model HP, sistem operasi, waktu terakhir aktif', 'Aplikasi'],
    ['Lokasi', 'Koordinat, tingkat akurasi, dan penanda lokasi palsu saat clock in, clock out, atau pengajuan koreksi absensi', 'Aplikasi'],
    ['Data wajah', 'Representasi numerik wajah (embedding), versi model, waktu pendaftaran dan persetujuan; skor kemiripan setiap absensi', 'Aplikasi'],
    ['Foto', 'Foto profil, swafoto pengajuan koreksi absensi, foto lampiran cuti dan lembur', 'Anda'],
  ], [200, 452, 200]);
  await waP(th, s, 'Kami tidak mengumpulkan kontak, riwayat penelusuran, atau data iklan, dan tidak melacak Anda di aplikasi atau situs lain.');
  s = await waSection(th, wrap, '3. Data wajah');
  await waP(th, s, 'Verifikasi wajah hanya aktif jika Perusahaan menyalakannya, dan hanya setelah Anda memberi persetujuan.');
  await waList(th, s, ['Foto wajah tidak dikirim. Foto dari kamera diolah di HP Anda menjadi embedding.', 'Yang dikirim dan disimpan hanya embedding. Kami tidak menyimpan foto wajah.']);
  return f;
} });
registerScreen({ key: 'privacy-bawah', group: WA_GROUP, title: 'Kebijakan privasi (bawah)', build: async (th) => {
  const { f, wrap } = await waPrivBase(th, 1500);
  let s = await waSection(th, wrap, '5. Untuk apa data dipakai');
  await waP(th, s, 'Data Anda hanya dipakai untuk menjalankan fungsi aplikasi, bukan untuk iklan, profil pemasaran, atau dijual.');
  await waList(th, s, ['Mencatat kehadiran: jam masuk dan pulang, keterlambatan, lembur.', 'Memastikan absensi sah: verifikasi lokasi, verifikasi wajah, dan perangkat terdaftar, untuk mencegah titip absen.', 'Memproses pengajuan cuti, lembur, tukar shift, dan koreksi absensi, termasuk alur persetujuan atasan.', 'Mengirim notifikasi, misalnya pengajuan yang menunggu persetujuan atau keputusan atas pengajuan Anda.', 'Menyediakan rekap kehadiran bagi HR Perusahaan, termasuk penanda absensi yang perlu ditinjau.', 'Menjaga keamanan akun dan menyelidiki penyalahgunaan.'], true);
  s = await waSection(th, wrap, '6. Dengan siapa data dibagikan');
  await waP(th, s, 'Kami tidak menjual data Anda. Data hanya dibagikan kepada pihak berikut, sebatas yang diperlukan.');
  await waDataTable(th, s, ['Pihak', 'Data yang diterima', 'Keperluan'], [
    ['Perusahaan Anda (HR dan atasan)', 'Data kepegawaian, absensi, lokasi absen, skor kemiripan wajah, pengajuan dan lampirannya', 'Administrasi HR dan persetujuan'],
    ['OneSignal, Inc. (Amerika Serikat)', 'Token notifikasi, ID langganan, jenis perangkat, isi notifikasi', 'Mengirim notifikasi push'],
  ], [240, 400, 212]);
  s = await waSection(th, wrap, '8. Hak Anda');
  await waP(th, s, 'Sesuai UU PDP, Anda berhak atas data pribadi Anda. Ajukan permintaan ke HR Perusahaan atau ke kontak di bawah.');
  await waList(th, s, ['Mengakses data Anda dan mendapat salinannya.', 'Memperbaiki data yang salah atau tidak lengkap.', 'Menarik persetujuan verifikasi wajah. Data wajah Anda akan dihapus.', 'Meminta penghapusan data, kecuali data yang wajib disimpan menurut hukum.', 'Membatasi atau menolak pemrosesan tertentu, termasuk mencabut izin kamera, lokasi, dan notifikasi di pengaturan HP.', 'Mengajukan keberatan kepada lembaga pengawas pelindungan data pribadi.']);
  s = await waSection(th, wrap, '9. Perubahan dan kontak');
  await waP(th, s, 'Jika kebijakan ini berubah, kami memperbarui tanggal berlaku di bagian atas dan memberi tahu Anda lewat aplikasi bila perubahannya penting.');
  await waP(th, s, 'Pertanyaan atau permintaan soal data pribadi dapat dikirim ke:');
  await waList(th, s, ['PT Contoh Perusahaan', 'Email: info@contoh.co.id', 'Alamat: Jl. Contoh No. 1, Jakarta']);
  await waP(th, s, 'Untuk data kepegawaian seperti jabatan, kontrak, atau koreksi absensi, hubungi HR Perusahaan Anda terlebih dahulu.');
  const dv = box('divider', { theme: th, parent: wrap, fixed: [10, 1], fill: 'color/border' }); dv.layoutSizingHorizontal = 'FILL';
  const ft = box('footer', { dir: 'V', pad: [16, 0, 0, 0], theme: th, parent: wrap, fillW: true });
  await txt('© 2026 PT Contoh Perusahaan', 'body2', 'color/text/secondary', th, { parent: ft });
  return f;
} });

/* ---------- Super Admin ---------- */
const WA_GROUPS = [
  { name: 'PT Maju Bersama', owner: 'dewi.lestari@perusahaan.co.id', plan: 'Business', status: 'active', date: '12 Nov 2026' },
  { name: 'Grup Nusantara Retail', owner: 'agus.wijaya@perusahaan.co.id', plan: 'Basic', status: 'active', date: '03 Nov 2026' },
  { name: 'CV Kartika Logistik', owner: 'rina.kartika@perusahaan.co.id', plan: 'Free', status: 'suspended', date: '21 Okt 2026' },
  { name: 'PT Prasetyo Teknologi', owner: 'eko.prasetyo@perusahaan.co.id', plan: 'Enterprise', status: 'provisioning', date: '18 Okt 2026' },
  { name: 'Yayasan Anggraini Edu', owner: 'maya.anggraini@perusahaan.co.id', plan: 'Free', status: 'churned', date: '02 Sep 2026' },
];
const WA_STATUS_COLOR = { provisioning: 'default', active: 'success', suspended: 'warning', churned: 'error' };
const waCap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

async function waSuper(th, active, h) { return page('x', th, { role: 'super', active, h }); }

/* Dasbor */
async function waDashboard(th, o = {}) {
  const { f, main } = await waSuper(th, 'Dasbor ', 900);
  if (o.error) { await alertBox('error', 'Gagal memuat data. Coba lagi.', th, main); return f; }
  const gs = o.empty ? [] : WA_GROUPS;
  const act = await pageHeader(th, main, 'Dasbor', 'Ringkasan semua grup di platform');
  await button('Buat Grup Baru', th, act, { icon: 'plus' });
  const stats = box('stats', { dir: 'H', gap: 20, theme: th, parent: main, fillW: true });
  const n = (s) => gs.filter((g) => g.status === s).length;
  await statCard('Total Grup', String(gs.length), null, 'building', th, stats);
  await statCard('Aktif', String(n('active')), null, 'check', th, stats);
  await statCard('Ditangguhkan', String(n('suspended')), null, 'wa-pause', th, stats);
  await statCard('Sedang Disiapkan', String(n('provisioning')), null, 'refresh', th, stats);
  const row = box('row', { dir: 'H', gap: 20, ay: 'MIN', theme: th, parent: main, fillW: true });
  const left = card(th, row, { pad: 0, clip: true }); left.layoutGrow = 1;
  const lh = box('header', { dir: 'H', ay: 'CENTER', pad: [20, 20, 12, 20], theme: th, parent: left, fillW: true });
  await txt('Grup Terbaru', 'subtitle', 'color/text/primary', th, { parent: lh }); spacer(lh);
  await button('Lihat Semua', th, lh, { v: 'text', size: 'small', endIcon: 'wa-arrow' });
  waDivider(th, left);
  if (!gs.length) { const e = box('kosong', { dir: 'V', pad: 24, theme: th, parent: left, fillW: true }); await txt('Belum ada grup.', 'body2', 'color/text/secondary', th, { parent: e }); }
  for (const [i, g] of gs.entries()) {
    const r = box('row ' + g.name, { dir: 'H', ay: 'CENTER', pad: 20, theme: th, parent: left, fillW: true });
    const t = box('text', { dir: 'V', gap: 2, theme: th, parent: r }); await txt(g.name, 'body2-strong', 'color/text/primary', th, { parent: t }); await txt(g.owner, 'caption', 'color/text/secondary', th, { parent: t });
    spacer(r);
    const cs = box('chips', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: r });
    await chip(g.plan, th, cs, { variant: 'outlined' }); await chip(g.status, th, cs, { color: WA_STATUS_COLOR[g.status] });
    if (i < gs.length - 1) waDivider(th, left);
  }
  const right = card(th, row, { pad: 20, gap: 12, fillW: false }); right.resize(452, 100); right.primaryAxisSizingMode = 'AUTO'; right.counterAxisSizingMode = 'FIXED';
  await txt('Sebaran Paket', 'subtitle', 'color/text/primary', th, { parent: right });
  const dist = o.empty ? [] : [['Business', 1], ['Basic', 1], ['Free', 2], ['Enterprise', 1]];
  if (!dist.length) await txt('Belum ada data.', 'body2', 'color/text/secondary', th, { parent: right });
  for (const [c, k] of dist) { const r = box('plan ' + c, { dir: 'H', ay: 'CENTER', theme: th, parent: right, fillW: true }); await txt(c, 'body2', 'color/text/primary', th, { parent: r }); spacer(r); await chip(String(k), th, r, {}); }
  return f;
}
registerScreen({ key: 'super/dashboard', group: WA_GROUP, title: 'Super Dasbor', build: (th) => waDashboard(th) });
registerScreen({ key: 'super/dashboard-kosong', group: WA_GROUP, title: 'Super Dasbor kosong', build: (th) => waDashboard(th, { empty: true }) });
registerScreen({ key: 'super/dashboard-galat', group: WA_GROUP, title: 'Super Dasbor galat', build: (th) => waDashboard(th, { error: true }) });

/* Daftar grup */
async function waGroups(th, o = {}) {
  const { f, main } = await waSuper(th, 'Grup', 900);
  const gs = o.empty ? [] : WA_GROUPS;
  const act = await pageHeader(th, main, 'Grup', `${gs.length} grup terdaftar di platform`);
  await button('Buat Grup Baru', th, act, { icon: 'plus' });
  if (o.error) await alertBox('error', 'Gagal memuat daftar grup. Coba lagi.', th, main);
  const c = card(th, main, { pad: 0, clip: true });
  const sb = box('search', { dir: 'H', pad: 16, theme: th, parent: c, fillW: true, stroke: 'color/border' });
  sb.strokeTopWeight = 0; sb.strokeLeftWeight = 0; sb.strokeRightWeight = 0;
  const si = await inputField('Cari nama grup atau email pemilik...', '', th, sb, { w: 340, icon: 'search' });
  if (gs.length) {
    const t = await table(th, c, { cols: [{ t: 'Nama Grup', w: 'fill' }, { t: 'Pemilik', w: 'fill' }, { t: 'Paket', w: 130 }, { t: 'Status', w: 140 }, { t: 'Dibuat', w: 180 }], rows: gs.map((g) => [g.name, g.owner, { chip: g.plan, color: 'default', variant: 'outlined' }, { chip: waCap(g.status), color: WA_STATUS_COLOR[g.status] }, g.date]), foot: `1–${gs.length} dari ${gs.length}` });
    t.strokes = []; // kartu sudah punya border
  } else {
    const e = box('No rows', { dir: 'V', ax: 'CENTER', ay: 'CENTER', pad: [64, 0, 64, 0], theme: th, parent: c, fillW: true });
    await txt('No rows', 'body2', 'color/text/secondary', th, { parent: e });
  }
  return f;
}
registerScreen({ key: 'super/groups', group: WA_GROUP, title: 'Super Grup', build: (th) => waGroups(th) });
registerScreen({ key: 'super/groups-kosong', group: WA_GROUP, title: 'Super Grup kosong', build: (th) => waGroups(th, { empty: true }) });
registerScreen({ key: 'super/groups-galat', group: WA_GROUP, title: 'Super Grup galat', build: (th) => waGroups(th, { error: true, empty: true }) });

/* Detail grup */
async function waInfoRow(th, parent, label, value) {
  const r = box('InfoRow', { dir: 'H', pad: [8, 0, 8, 0], theme: th, parent, fillW: true });
  await txt(label, 'body2', 'color/text/secondary', th, { parent: r }); spacer(r);
  await txt(value, 'body2', 'color/text/primary', th, { parent: r });
}
async function waInfoCard(th, parent, title, rows, fixedW) {
  const c = card(th, parent, { pad: 20, gap: 8, fillW: !fixedW });
  if (fixedW) { c.resize(fixedW, 100); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED'; } else { c.layoutGrow = 1; }
  await txt(title, 'subtitle', 'color/text/primary', th, { parent: c }); waDivider(th, c);
  for (const [l, v] of rows) await waInfoRow(th, c, l, v);
  return c;
}
async function waUsagePanel(th, parent, w) {
  const c = card(th, parent, { pad: 20, gap: 16, fillW: false }); c.resize(w, 100); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
  const hd = box('header', { dir: 'H', ay: 'CENTER', theme: th, parent: c, fillW: true });
  await txt('Kuota Paket', 'subtitle', 'color/text/primary', th, { parent: hd }); spacer(hd); await chip('Business', th, hd, { color: 'primary', variant: 'tint' });
  const bw = w - 40;
  const items = [['Perusahaan', '2 / 5', 0.4, 'color/primary', null], ['Karyawan aktif', '84 / 100', 0.84, 'color/warning', 'Sisa 16 lagi.', 'color/warning'], ['Akun admin', '3 / 3', 1, 'color/danger', 'Kuota habis. Naikkan paket untuk menambah akun admin.', 'color/danger'], ['Shift', '6 / 20', 0.3, 'color/primary', null], ['Penyimpanan (GB)', '- / 10', 0, 'color/primary', null]];
  for (const [l, v, r, col, msg, mc] of items) {
    const it = box('LimitRow', { dir: 'V', gap: 6, theme: th, parent: c, fillW: true });
    const tr = box('label', { dir: 'H', ay: 'MAX', theme: th, parent: it, fillW: true });
    await txt(l, 'body2-strong', 'color/text/primary', th, { parent: tr }); spacer(tr);
    await txt(v, msg && mc === 'color/danger' ? 'body2-strong' : 'body2', mc === 'color/danger' ? 'color/danger' : 'color/text/secondary', th, { parent: tr });
    const b = waBar(th, it, bw, r, col); if (l === 'Penyimpanan (GB)') b.opacity = 0.4;
    if (msg) await txt(msg, 'caption', mc, th, { parent: it, fillW: true });
  }
  waDivider(th, c);
  await txt('Fitur', 'body2-strong', 'color/text/primary', th, { parent: c });
  const fr = box('features', { dir: 'H', gap: 8, theme: th, parent: c, fillW: true });
  await chip('Multi-perusahaan', th, fr, { color: 'primary', variant: 'tint', icon: 'check' });
  await chip('Modul Payroll', th, fr, { color: 'primary', variant: 'tint', icon: 'check' });
  await chip('Modul Absensi', th, fr, { variant: 'outlined', icon: 'wa-minus' });
  return c;
}
async function waDetail(th, o = {}) {
  const status = o.status ?? 'active';
  const { f, main } = await waSuper(th, 'Grup', o.h ?? 1000);
  if (o.error) {
    const w0 = waCol(th, main, 820, 16, 'wrap');
    await button('Kembali', th, w0, { v: 'text', icon: 'back' });
    await alertBox('error', 'Grup tidak ditemukan', th, w0);
    return f;
  }
  const w = waCol(th, main, 820, 0, 'wrap');
  const bk = box('kembali', { dir: 'H', pad: [0, 0, 16, 0], theme: th, parent: w }); await button('Kembali', th, bk, { v: 'text', icon: 'back' });
  const hd = box('header', { dir: 'H', ay: 'CENTER', pad: [0, 0, 24, 0], theme: th, parent: w, fillW: true });
  const tt = box('title', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: hd });
  await txt('PT Maju Bersama', 'h5', 'color/text/primary', th, { parent: tt }); await chip(waCap(status), th, tt, { color: WA_STATUS_COLOR[status] });
  spacer(hd);
  const ac = box('actions', { dir: 'H', gap: 8, theme: th, parent: hd });
  if (status === 'suspended') await button('Aktifkan', th, ac, { v: 'outlined', color: 'success', size: 'small', icon: 'wa-play' });
  else await button('Tangguhkan', th, ac, { v: 'outlined', color: 'warning', size: 'small', icon: 'wa-pause' });
  await button('Ubah Paket', th, ac, { v: 'outlined', size: 'small', icon: 'wa-premium' });
  await button('Reset Kata Sandi', th, ac, { v: 'outlined', size: 'small', icon: 'key' });
  const grid = box('grid', { dir: 'V', gap: 20, theme: th, parent: w, fillW: true });
  if (o.banner) await alertBox(status === 'churned' ? 'error' : 'warning', 'Data masih bisa dilihat, tapi belum bisa ditambah atau diubah sampai langganan aktif lagi. Hubungi admin platform.', th, grid, 'Langganan sedang ditangguhkan');
  const r1 = box('row', { dir: 'H', gap: 20, ay: 'MIN', theme: th, parent: grid, fillW: true });
  await waInfoCard(th, r1, 'Info Grup', [['ID Grup', '3f9c2a10-7b1e-4c55-9d0a-8e21b6a4c7d2'], ['Database', 'tenant_maju_bersama'], ['Dibuat', '12/11/2026 09.30.00']]);
  await waInfoCard(th, r1, 'Pemilik', [['Nama', 'Dewi Lestari'], ['Email', 'dewi.lestari@perusahaan.co.id']]);
  await waInfoCard(th, grid, 'Langganan', [['Paket', 'Business'], ['Mulai', '2026-11-12'], ['Berakhir', 'Tidak ada batas']]);
  if (o.usage) await waUsagePanel(th, grid, 820);
  if (o.dlg) await o.dlg(f);
  return f;
}
registerScreen({ key: 'super/groups-detail', group: WA_GROUP, title: 'Super Detail grup', build: (th) => waDetail(th) });
registerScreen({ key: 'super/groups-detail-ditangguhkan', group: WA_GROUP, title: 'Super Detail grup ditangguhkan', build: (th) => waDetail(th, { status: 'suspended' }) });
registerScreen({ key: 'super/groups-detail-galat', group: WA_GROUP, title: 'Super Detail grup galat', build: (th) => waDetail(th, { error: true }) });
// Komponen UsagePanel + GroupStatusBanner (dipakai Dasbor Owner; ditampilkan di sini sebagai gambaran detail tenant)
registerScreen({ key: 'super/groups-detail-kuota', group: WA_GROUP, title: 'Super Detail grup kuota (UsagePanel)', build: (th) => waDetail(th, { status: 'suspended', banner: true, usage: true, h: 1500 }) });

const waDlgText = async (th, b, str) => { await txt(str, 'body2', 'color/text/secondary', th, { parent: b, fillW: true }); };
registerScreen({ key: 'super/groups-detail-tangguhkan', group: WA_GROUP, title: 'Dialog tangguhkan grup', build: (th) => waDetail(th, { dlg: (f) => dialog(th, f, { title: 'Tangguhkan grup ini?', w: 444, build: (b) => waDlgText(th, b, 'PT Maju Bersama akan ditangguhkan. Datanya tidak dihapus, hanya ditandai tidak aktif.'), actions: [{ label: 'Batal' }, { label: 'Ya, Lanjutkan', v: 'contained', color: 'warning' }] }) }) });
registerScreen({ key: 'super/groups-detail-aktifkan', group: WA_GROUP, title: 'Dialog aktifkan grup', build: (th) => waDetail(th, { status: 'suspended', dlg: (f) => dialog(th, f, { title: 'Aktifkan lagi grup ini?', w: 444, build: (b) => waDlgText(th, b, 'PT Maju Bersama akan aktif lagi.'), actions: [{ label: 'Batal' }, { label: 'Ya, Lanjutkan', v: 'contained', color: 'success' }] }) }) });
registerScreen({ key: 'super/groups-detail-ubah-paket', group: WA_GROUP, title: 'Dialog ubah paket', build: (th) => waDetail(th, { dlg: (f) => dialog(th, f, { title: 'Ubah Paket Grup', w: 444, build: async (b) => { await waDlgText(th, b, 'Pilih paket baru untuk PT Maju Bersama.'); await inputField('Paket', 'Business (saat ini)', th, b, { select: true, focus: true }); }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained', disabled: true }] }) }) });
registerScreen({ key: 'super/groups-detail-ubah-paket-memuat', group: WA_GROUP, title: 'Dialog ubah paket memuat', build: (th) => waDetail(th, { dlg: (f) => dialog(th, f, { title: 'Ubah Paket Grup', w: 444, build: async (b) => { await waDlgText(th, b, 'Pilih paket baru untuk PT Maju Bersama.'); const c = box('spin', { dir: 'H', ax: 'CENTER', pad: [8, 0, 8, 0], theme: th, parent: b, fillW: true }); waSpin(th, c); }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained', disabled: true }] }) }) });
registerScreen({ key: 'super/groups-detail-reset', group: WA_GROUP, title: 'Dialog reset kata sandi pemilik', build: (th) => waDetail(th, { dlg: (f) => dialog(th, f, { title: 'Reset kata sandi pemilik?', w: 444, build: (b) => waDlgText(th, b, 'Kata sandi baru dibuat acak untuk dewi.lestari@perusahaan.co.id. Kata sandi lama langsung tidak berlaku.'), actions: [{ label: 'Batal' }, { label: 'Ya, Reset', v: 'contained' }] }) }) });
registerScreen({ key: 'super/groups-detail-reset-hasil', group: WA_GROUP, title: 'Dialog hasil reset kata sandi', build: (th) => waDetail(th, { dlg: (f) => dialog(th, f, { title: 'Kata Sandi Baru', w: 444, build: async (b) => { await alertBox('warning', 'Kata sandi ini cuma tampil sekali. Segera kirim ke pemilik lewat jalur yang aman.', th, b); await txt('dewi.lestari@perusahaan.co.id', 'body2', 'color/text/secondary', th, { parent: b, fillW: true }); await inputField('Kata sandi', 'Xk7p-Q2mv-9RtA', th, b, { endIcon: 'copy' }); }, actions: [{ label: 'Selesai', v: 'contained' }] }) }) });

/* Buat grup baru */
async function waNewGroup(th, o = {}) {
  const { f, main } = await waSuper(th, 'Grup', 1000);
  const w = waCol(th, main, 560, 0, 'wrap');
  const bk = box('kembali', { dir: 'H', pad: [0, 0, 8, 0], theme: th, parent: w }); await button('Kembali', th, bk, { v: 'text', icon: 'back' });
  const ttl = box('titles', { dir: 'V', gap: 4, pad: [0, 0, 24, 0], theme: th, parent: w, fillW: true });
  await txt('Buat Grup Baru', 'h5', 'color/text/primary', th, { parent: ttl });
  await txt('Grup baru otomatis dapat paket Free, satu perusahaan, dan satu akun pemilik.', 'body2', 'color/text/secondary', th, { parent: ttl, fillW: true });
  const c = card(th, w, { pad: 24, gap: 20 });
  if (o.error) await alertBox('error', o.error, th, c);
  const v = o.filled;
  await inputField('Nama Grup', v ? 'Grup Nusantara Retail' : '', th, c, { required: true, focus: !v });
  await inputField('Nama Perusahaan Pertama', v ? 'PT Nusantara Retail' : '', th, c, { required: true });
  const dv = box('Divider', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: c, fillW: true });
  const l1 = box('line', { theme: th, parent: dv, fixed: [10, 1], fill: 'color/border' }); l1.layoutGrow = 1; l1.layoutSizingHorizontal = 'FILL';
  await txt('Data Pemilik', 'body2', 'color/text/secondary', th, { parent: dv });
  const l2 = box('line', { theme: th, parent: dv, fixed: [10, 1], fill: 'color/border' }); l2.layoutGrow = 1; l2.layoutSizingHorizontal = 'FILL';
  await inputField('Nama Pemilik', v ? 'Agus Wijaya' : '', th, c, { required: true });
  await inputField('Email Pemilik', v ? 'agus.wijaya@perusahaan.co.id' : '', th, c, { required: true });
  await inputField('Kata Sandi Pemilik', v ? '••••••••' : '', th, c, { required: true, helper: 'Minimal 6 karakter' });
  const ac = box('actions', { dir: 'H', gap: 16, pad: [4, 0, 0, 0], theme: th, parent: c });
  await button(o.submitting ? 'Membuat...' : 'Buat Grup', th, ac, { disabled: !!o.submitting }); await button('Batal', th, ac, { v: 'text', disabled: !!o.submitting });
  return f;
}
registerScreen({ key: 'super/groups-new', group: WA_GROUP, title: 'Super Buat grup', build: (th) => waNewGroup(th) });
registerScreen({ key: 'super/groups-new-galat', group: WA_GROUP, title: 'Super Buat grup galat', build: (th) => waNewGroup(th, { filled: true, error: 'Gagal membuat grup. Coba lagi.' }) });
registerScreen({ key: 'super/groups-new-memproses', group: WA_GROUP, title: 'Super Buat grup memproses', build: (th) => waNewGroup(th, { filled: true, submitting: true }) });

/* Katalog paket */
const WA_PLANS = [
  { name: 'Free', price: 'Rp 0', cycle: '/bulan', def: true, lim: [['max_company', 1], ['max_employee_total', 10], ['max_admin_user', 1], ['max_shift', 3], ['storage_gb', 1]], feat: [['multi_company', 0], ['payroll_module', 0], ['attendance_module', 1]] },
  { name: 'Basic', price: 'Rp 299.000', cycle: '/bulan', lim: [['max_company', 1], ['max_employee_total', 50], ['max_admin_user', 2], ['max_shift', 10], ['storage_gb', 5]], feat: [['multi_company', 0], ['payroll_module', 1], ['attendance_module', 1]] },
  { name: 'Business', price: 'Rp 899.000', cycle: '/bulan · uji coba 14 hari', lim: [['max_company', 5], ['max_employee_total', 100], ['max_admin_user', 3], ['max_shift', 20], ['storage_gb', 10]], feat: [['multi_company', 1], ['payroll_module', 1], ['attendance_module', 1]] },
  { name: 'Enterprise', price: 'Rp 24.990.000', cycle: '/tahun', lim: [['max_company', 20], ['max_employee_total', 1000], ['max_admin_user', 10], ['max_shift', 100], ['storage_gb', 100]], feat: [['multi_company', 1], ['payroll_module', 1], ['attendance_module', 1]] },
];
registerScreen({ key: 'super/plans', group: WA_GROUP, title: 'Super Paket', build: async (th) => {
  const { f, main } = await waSuper(th, 'Paket', 1000);
  const ttl = box('titles', { dir: 'V', gap: 4, theme: th, parent: main, fillW: true });
  await txt('Katalog Paket', 'h5', 'color/text/primary', th, { parent: ttl });
  await txt('Daftar paket langganan beserta fitur dan batasannya', 'body2', 'color/text/secondary', th, { parent: ttl });
  const row = box('grid', { dir: 'H', gap: 24, ay: 'MIN', theme: th, parent: main, fillW: true });
  for (const p of WA_PLANS) {
    const c = card(th, row, { pad: 20, gap: 0 }); c.layoutGrow = 1;
    const hd = box('header', { dir: 'H', ay: 'CENTER', pad: [0, 0, 8, 0], theme: th, parent: c, fillW: true });
    await txt(p.name, 'h6', 'color/text/primary', th, { parent: hd }); spacer(hd);
    if (p.def) await chip('Bawaan', th, hd, { color: 'primary' });
    await txt(p.price, 'h5', 'color/text/primary', th, { parent: c });
    await txt(p.cycle, 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
    const d1 = box('gap', { pad: [8, 0, 8, 0], theme: th, parent: c, fillW: true }); waDivider(th, d1);
    await txt('BATAS', 'caption-strong', 'color/text/secondary', th, { parent: c });
    const ls = box('limits', { dir: 'V', gap: 4, pad: [4, 0, 16, 0], theme: th, parent: c, fillW: true });
    for (const [k, v] of p.lim) { const r = box('limit', { dir: 'H', ay: 'MIN', theme: th, parent: ls, fillW: true }); await txt(k, 'body2', 'color/text/secondary', th, { parent: r }); spacer(r); await txt(String(v), 'body2', 'color/text/primary', th, { parent: r }); }
    await txt('FITUR', 'caption-strong', 'color/text/secondary', th, { parent: c });
    const fs = box('features', { dir: 'V', gap: 4, pad: [4, 0, 0, 0], theme: th, parent: c, fillW: true });
    for (const [k, on] of p.feat) { const r = box('feature', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: fs, fillW: true }); icon(on ? 'check' : 'wa-cancel', 20, on ? 'color/success' : 'color/text/disabled', th, r); await txt(k, 'body2', on ? 'color/text/primary' : 'color/text/disabled', th, { parent: r }); }
  }
  return f;
} });
registerScreen({ key: 'super/plans-galat', group: WA_GROUP, title: 'Super Paket galat', build: async (th) => {
  const { f, main } = await waSuper(th, 'Paket', 900);
  await alertBox('error', 'Gagal memuat daftar paket. Coba lagi.', th, main);
  return f;
} });
registerScreen({ key: 'super/plans-memuat', group: WA_GROUP, title: 'Super Paket memuat', build: async (th) => {
  const { f, main } = await waSuper(th, 'Paket', 900);
  const c = box('spinner', { dir: 'H', ax: 'CENTER', pad: [48, 0, 0, 0], theme: th, parent: main, fillW: true }); waSpin(th, c);
  return f;
} });


/* ===== projects/workonix-web/screens/30-dasbor-persetujuan.js ===== */
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


/* ===== projects/workonix-web/screens/40-karyawan-akses.js ===== */
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


/* ===== projects/workonix-web/screens/50-organisasi.js ===== */
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


/* ===== projects/workonix-web/screens/60-kehadiran-jadwal.js ===== */
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


/* ===== projects/workonix-web/screens/70-cuti-lembur.js ===== */
/* =====================================================================
 * 70 — Cuti dan Lembur (owner: pengajuan, saldo, pengaturan, rekap; self-service: owner + karyawan)
 * Prefiks: wc / WC_
 * ===================================================================== */
const WC_GROUP = 'Cuti dan Lembur';
const WC_ERR_LOAD = 'Gagal memuat data. Coba lagi.';

/* ---------- Pembantu ---------- */
function wcDiv(th, parent) { const d = box('Divider', { dir: 'H', fill: 'color/border', theme: th, parent, fixed: [100, 1] }); d.layoutSizingHorizontal = 'FILL'; return d; }
function wcBar(th, parent, ratio, w) {
  const t = box('LinearProgress', { dir: 'H', fill: 'color/border', radius: 4, theme: th, parent, fixed: [w, 8], clip: true });
  const r = figma.createRectangle(); r.name = 'bar'; r.resize(Math.max(1, Math.round(w * ratio)), 8); r.fills = [pv(th, 'color/primary')];
  t.appendChild(r); r.layoutPositioning = 'ABSOLUTE'; r.x = 0; r.y = 0; return t;
}
async function wcRow(th, parent, l, r, strong) {
  const row = box('row/' + l, { dir: 'H', ay: 'CENTER', theme: th, parent, fillW: true });
  const a = await txt(l, strong ? 'body2-strong' : 'body2', strong ? 'color/text/primary' : 'color/text/secondary', th, { parent: row }); a.layoutGrow = 1; a.layoutSizingHorizontal = 'FILL'; a.textAutoResize = 'HEIGHT';
  await txt(r, strong ? 'body2-strong' : 'body2', 'color/text/primary', th, { parent: row });
  return row;
}
/** Kartu berisi bar filter (border bawah) lalu tabel tanpa bingkai ganda (MUI Card + DataGrid). */
function wcGridCard(th, main) { return card(th, main, { pad: 0, gap: 0, clip: true, name: 'Card' }); }
function wcFilterBar(th, parent) {
  const r = box('filters', { dir: 'H', gap: 12, ay: 'CENTER', pad: 16, stroke: 'color/border', theme: th, parent, fillW: true });
  r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; return r;
}
async function wcGrid(th, card0, o) {
  const t = await table(th, card0, o); t.strokes = []; t.cornerRadius = 0; return t;
}
async function wcSearch(th, parent) { const s = await inputField('Cari nama atau nomor karyawan', '', th, parent, { icon: 'search' }); return s; }
async function wcDate(label, v, th, parent) { return inputField(label, v, th, parent, { w: 170, endIcon: 'calendar' }); }
async function wcStatusSel(th, parent, v) { return inputField('Status', v ?? 'Semua Status', th, parent, { w: 180, select: true }); }
async function wcTitleBlock(th, main, title, sub) { const act = await pageHeader(th, main, title, sub); return act; }
const WC_STATUS = { pending: ['Menunggu', 'warning'], approved: ['Disetujui', 'success'], rejected: ['Ditolak', 'error'], cancelled: ['Dibatalkan', 'default'] };
function wcSt(s) { return { chip: WC_STATUS[s][0], color: WC_STATUS[s][1] }; }
function wcEmp(i, n, no) { return { t: n, sub: no }; }
async function wcSectionCard(th, parent, title, sub) { const c = card(th, parent, { gap: 0, pad: 24 }); await cardTitle(th, c, title, sub); return c; }
async function wcCompanyField(th, parent, w) { return inputField('Perusahaan', 'PT Maju Bersama', th, parent, { w: w ?? 260, select: true }); }

/** Pilihan segmen (ToggleButtonGroup Choice). */
async function wcChoice(th, parent, labels, active) {
  const g = box('Choice', { dir: 'H', stroke: 'color/border', radius: 8, theme: th, parent, clip: true });
  for (const [i, l] of labels.entries()) {
    const s = box('opt/' + l, { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [0, 14, 0, 14], fill: i === active ? 'color/primary-surface' : null, theme: th, parent: g, fixed: [90, 34] });
    s.primaryAxisSizingMode = 'AUTO';
    await txt(l, 'body2-strong', i === active ? 'color/primary' : 'color/text/secondary', th, { parent: s });
  }
  return g;
}
async function wcNum(th, parent, v, unit) {
  const r = box('NumberInput', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent });
  const f = box('input', { dir: 'H', ay: 'CENTER', pad: [0, 14, 0, 14], stroke: 'color/border', radius: 10, theme: th, parent: r, fixed: [96, 40] });
  await txt(String(v), 'body', 'color/text/primary', th, { parent: f });
  if (unit) await txt(unit, 'body2', 'color/text/secondary', th, { parent: r });
  return r;
}
/** Baris pengaturan: penjelasan kiri, kontrol kanan (240); build(ctl) mengisi kontrol, below(b) isian tambahan. */
async function wcSettingRow(th, parent, title, desc, build, below, last) {
  const r = box('SettingRow/' + title, { dir: 'V', gap: 10, pad: [18, 0, 18, 0], stroke: last ? null : 'color/border', theme: th, parent, fillW: true });
  r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0;
  const top = box('grid', { dir: 'H', gap: 24, ay: 'CENTER', theme: th, parent: r, fillW: true });
  const l = box('text', { dir: 'V', gap: 2, theme: th, parent: top }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL';
  await txt(title, 'body2-strong', 'color/text/primary', th, { parent: l, fillW: true });
  if (desc) await txt(desc, 'caption', 'color/text/secondary', th, { parent: l, fillW: true });
  const ctl = box('control', { dir: 'H', ax: 'MAX', ay: 'CENTER', theme: th, parent: top, fixed: [240, 40] }); ctl.counterAxisSizingMode = 'AUTO';
  if (build) await build(ctl);
  if (below) await below(r);
  return r;
}
async function wcSection(th, parent, title, sub) {
  const c = card(th, parent, { gap: 0, pad: [20, 24, 6, 24] });
  const h = box('head', { dir: 'V', gap: 2, pad: [0, 0, 10, 0], theme: th, parent: c, fillW: true });
  await txt(title, 'subtitle', 'color/text/primary', th, { parent: h });
  if (sub) await txt(sub, 'body2', 'color/text/secondary', th, { parent: h, fillW: true });
  return c;
}
async function wcCompanyBlock(th, main, withCaption) {
  if (withCaption) { const b = box('company', { dir: 'V', gap: 4, theme: th, parent: main }); await txt('Perusahaan', 'caption', 'color/text/secondary', th, { parent: b }); await wcCompanyField(th, b, 260); }
  else await wcCompanyField(th, main, 260);
}

/* ---------- Data contoh ---------- */
const WC_LEAVE_ROWS = [
  [ '2026-12-14 s/d 2026-12-16', wcEmp(0, 'Budi Santoso', 'EMP-000003'), 'Cuti Tahunan', '3 hari', 'Acara keluarga di luar kota', { icon: 'file' }, wcSt('pending') ],
  [ '2026-12-22 s/d 2026-12-26', wcEmp(0, 'Dewi Lestari', 'EMP-000004'), 'Cuti Tahunan', { t: '5 hari', sub: '(2 tdk dibayar)' }, 'Liburan akhir tahun', '', wcSt('approved') ],
  [ '2026-12-03', wcEmp(0, 'Siti Rahmawati', 'EMP-000007'), 'Sakit', '1 hari', 'Demam dan flu', { icon: 'file' }, wcSt('approved') ],
  [ '2026-11-30 s/d 2026-12-02', wcEmp(0, 'Agus Wijaya', 'EMP-000009'), 'Cuti Menikah', '3 hari', 'Pernikahan adik kandung', { icon: 'file' }, wcSt('rejected') ],
  [ '2026-12-10', wcEmp(0, 'Rina Kartika', 'EMP-000011'), 'Cuti Tahunan', '1 hari', 'Mengurus dokumen kendaraan', '', wcSt('cancelled') ],
];
const WC_LEAVE_COLS = [{ t: 'Tanggal', w: 200 }, { t: 'Karyawan', w: 'fill' }, { t: 'Jenis', w: 150 }, { t: 'Hari', w: 130 }, { t: 'Alasan', w: 'fill' }, { t: '', w: 50, align: 'center' }, { t: 'Status', w: 130 }];

const WC_BAL_COLS = [{ t: 'No. Karyawan', w: 130 }, { t: 'Nama', w: 'fill' }, { t: 'Jabatan', w: 'fill' }, { t: 'Masa kerja', w: 150 }, { t: 'Jatah', w: 90, align: 'right' }, { t: 'Dipakai', w: 90, align: 'right' }, { t: 'Sisa', w: 100, align: 'right' }];
const WC_BAL_ROWS = [
  ['EMP-000003', 'Budi Santoso', 'Staf IT', '2 tahun 4 bulan', '12', '4', '8'],
  ['EMP-000004', 'Dewi Lestari', { t: 'Manajer SDM  L2' }, '5 tahun 1 bulan', '14', '14', '0'],
  ['EMP-000007', 'Siti Rahmawati', 'Staf Keuangan', '8 bulan', '12', '2', { icon: 'lock', t: '10' }],
  ['EMP-000009', 'Agus Wijaya', 'Staf Operasional', '1 tahun 9 bulan', '12', '9', '3'],
  ['EMP-000011', 'Rina Kartika', 'Supervisor Operasional  L2', '3 tahun 2 bulan', '14', '6', '8'],
];
const WC_LEDGER = [['Jatah cuti terbit', 'Jatah tahun 2026', '+12'], ['Dipakai', 'Cuti Tahunan 2026-03-12 s/d 2026-03-13', '-2'], ['Dipakai', 'Cuti Tahunan 2026-08-17', '-1'], ['Koreksi HR', 'Saldo pindahan dari sistem lama · oleh Dewi Lestari', '+3'], ['Dipakai', 'Cuti Tahunan 2026-10-05 s/d 2026-10-06', '-2']];

const WC_OT_COLS = [{ t: 'Tanggal', w: 110 }, { t: 'Karyawan', w: 'fill' }, { t: 'Jam', w: 130 }, { t: 'Durasi', w: 100 }, { t: 'Jenis Hari', w: 170 }, { t: 'Dibayar', w: 110 }, { t: 'Status', w: 130 }];
const WC_OT_ROWS = [
  ['2026-11-20', wcEmp(0, 'Budi Santoso', 'EMP-000003'), '19:00 – 22:00', '3 jam', { chip: 'Hari kerja', color: 'default' }, '4,5 jam', wcSt('approved')],
  ['2026-11-21', wcEmp(0, 'Eko Prasetyo', 'EMP-000013'), '09:00 – 15:00', '6 jam', { chip: 'Hari libur kerja', color: 'warning' }, '12 jam', wcSt('pending')],
  ['2026-11-18', wcEmp(0, 'Maya Anggraini', 'EMP-000015'), '18:00 – 20:30', '2,5 jam', { chip: 'Hari kerja', color: 'default' }, '3,75 jam', wcSt('approved')],
  ['2026-11-12', wcEmp(0, 'Hendra Gunawan', 'EMP-000017'), '08:00 – 13:00', '5 jam', { chip: 'Hari libur nasional', color: 'error' }, '10 jam', wcSt('rejected')],
  ['2026-11-10', wcEmp(0, 'Putri Handayani', 'EMP-000019'), '19:00 – 21:00', '2 jam', { chip: 'Hari kerja', color: 'default' }, '3 jam', wcSt('cancelled')],
];
const WC_DAYCHIP = { workday: ['Hari kerja', 'default'], rest: ['Hari libur kerja', 'warning'], holiday: ['Hari libur nasional', 'error'] };

/* ---------- Bagian halaman bersama ---------- */
async function wcAlertPending(th, main, n) { await alertBox('info', `${n} pengajuan menunggu persetujuan. Yang perlu disetujui akun ini ada di menu Persetujuan.`, th, main); }

/** Halaman daftar pengajuan cuti owner. v: 'data'|'kosong'|'galat'. */
async function wcBuildLeaveRequests(th, v) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Pengajuan Cuti', h: 1000 });
  await wcTitleBlock(th, main, 'Pengajuan Cuti', v === 'data' ? '5 dari 5 pengajuan' : '0 dari 0 pengajuan');
  if (v === 'galat') await alertBox('error', WC_ERR_LOAD, th, main);
  if (v === 'data') await wcAlertPending(th, main, 1);
  const c = wcGridCard(th, main); const fb = wcFilterBar(th, c);
  await wcSearch(th, fb); await wcDate('Dari', '2026-11-01', th, fb); await wcDate('Sampai', '2027-02-22', th, fb); await wcStatusSel(th, fb);
  if (v === 'data') await wcGrid(th, c, { cols: WC_LEAVE_COLS, rows: WC_LEAVE_ROWS, foot: '1–5 dari 5' });
  else await emptyState('umbrella', 'Tidak ada pengajuan cuti', 'Belum ada pengajuan pada rentang tanggal ini.', th, c);
  return f;
}

/** Saldo cuti. v: 'list'|'panel' (dialog panel bersama) |'panel-koreksi'|'dialog' (dialog dengan form koreksi)|'dialog-kosong'|'kosong'|'galat'. */
async function wcBalanceList(th, v, active) {
  const { f, main } = await page('x', th, { role: 'owner', active, h: v === 'list' || v === 'kosong' || v === 'galat' ? 1000 : 1300 });
  await wcTitleBlock(th, main, 'Saldo Cuti', v === 'kosong' ? '0 karyawan · total sisa 0 hari dari 0 hari jatah' : '5 karyawan · total sisa 29 hari dari 64 hari jatah');
  if (v === 'galat') await alertBox('error', 'Gagal memuat saldo cuti. Coba lagi.', th, main);
  const c = wcGridCard(th, main); const fb = wcFilterBar(th, c);
  await wcSearch(th, fb); await inputField('Perusahaan', 'PT Maju Bersama', th, fb, { w: 240, select: true });
  if (v === 'kosong' || v === 'galat') await emptyState('users', 'Belum ada data saldo', 'Saldo cuti karyawan akan tampil di sini.', th, c);
  else await wcGrid(th, c, { cols: WC_BAL_COLS, rows: WC_BAL_ROWS, foot: '1–5 dari 5' });
  return { f, main };
}
async function wcLedgerList(th, parent, entries) {
  const l = box('ledger', { dir: 'V', theme: th, parent, fillW: true });
  if (entries.length === 0) { await txt('Belum ada catatan di periode ini.', 'body2', 'color/text/disabled', th, { parent: l }); return l; }
  for (const e of entries) {
    const r = box('entry', { dir: 'H', gap: 12, ay: 'MIN', pad: [8, 0, 8, 0], stroke: 'color/border', theme: th, parent: l, fillW: true });
    r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0;
    const t = box('t', { dir: 'V', theme: th, parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
    await txt(e[0], 'body2', 'color/text/primary', th, { parent: t, fillW: true }); await txt(e[1], 'caption', 'color/text/secondary', th, { parent: t, fillW: true });
    await txt(e[2], 'body2-strong', e[2].startsWith('+') ? 'color/success' : 'color/text/primary', th, { parent: r });
  }
  return l;
}
async function wcKoreksiForm(th, parent, withTitle, name, filled) {
  const b = box('koreksi', { dir: 'V', gap: 14, theme: th, parent, fillW: true });
  await txt(withTitle ? 'Koreksi saldo' + (name ? ': ' + name : '') : 'Koreksi saldo', 'subtitle', 'color/text/primary', th, { parent: b });
  await inputField('Jumlah hari', filled ? '3' : '', th, b, { w: 260, helper: 'Positif menambah, negatif mengurangi. Setengah hari boleh, mis. 0,5' });
  await inputField('Alasan', filled ? 'Saldo pindahan dari sistem lama' : '', th, b, { multiline: 2, helper: 'Wajib diisi, supaya jelas kenapa saldo berubah kalau nanti ditanyakan.' });
  return b;
}
/** Dialog detail saldo versi halaman Saldo Cuti (rincian + form koreksi). */
async function wcBalanceDialogInline(th, f, filled) {
  await dialog(th, f, { title: 'Budi Santoso', w: 600, build: async (b) => {
    await txt('EMP-000003 · sisa 8 hari', 'body2', 'color/text/secondary', th, { parent: b });
    await txt('Rincian saldo', 'subtitle', 'color/text/primary', th, { parent: b });
    await wcLedgerList(th, b, WC_LEDGER);
    wcDiv(th, b);
    await wcKoreksiForm(th, b, false, null, filled);
    if (filled) { /* tombol simpan di bawah form */ }
    const ac = box('actions', { dir: 'H', gap: 8, theme: th, parent: b });
    await button('Simpan Koreksi', th, ac, { disabled: !filled });
  }, actions: [{ label: 'Tutup' }] });
}
/** Dialog dengan panel EmployeeLeaveBalancePanel. mode: 'ringkas' | 'koreksi' | 'memuat'. */
async function wcBalancePanelDialog(th, f, mode) {
  await dialog(th, f, { title: 'Budi Santoso', w: 600, build: async (b) => {
    await txt('EMP-000003 · Staf IT', 'body2', 'color/text/secondary', th, { parent: b });
    if (mode === 'memuat') { const c = box('loading', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: 40, theme: th, parent: b, fillW: true }); icon('refresh', 26, 'color/primary', th, c); return; }
    const top = box('saldo', { dir: 'H', gap: 24, ay: 'MAX', theme: th, parent: b });
    const big = box('big', { dir: 'V', theme: th, parent: top });
    await txt('8', 'h4', 'color/primary', th, { parent: big }); await txt('hari tersisa', 'caption', 'color/text/secondary', th, { parent: big });
    const kk = box('kk', { dir: 'V', gap: 2, theme: th, parent: top });
    await txt('Jatah 12 hari', 'body2', 'color/text/primary', th, { parent: kk }); await txt('Dipakai 4 hari', 'body2', 'color/text/secondary', th, { parent: kk });
    wcBar(th, b, 4 / 12, 552);
    await txt('Periode 2026-01-01 s/d 2026-12-31', 'caption', 'color/text/secondary', th, { parent: b });
    wcDiv(th, b);
    await txt('Rincian saldo', 'subtitle', 'color/text/primary', th, { parent: b });
    await wcLedgerList(th, b, WC_LEDGER);
    wcDiv(th, b);
    if (mode === 'ringkas') {
      const r = box('aksi', { dir: 'H', gap: 8, theme: th, parent: b });
      await button('Koreksi saldo', th, r, { v: 'text', size: 'small', icon: 'settings' }); await button('Sesuaikan dengan pengaturan', th, r, { v: 'text', size: 'small', color: 'default', icon: 'refresh' });
    } else {
      await wcKoreksiForm(th, b, true, 'Budi Santoso', true);
      const r = box('aksi', { dir: 'H', gap: 8, theme: th, parent: b }); await button('Batal', th, r, { v: 'text' }); await button('Simpan Koreksi', th, r);
      await alertBox('info', 'Koreksi dicatat sebagai baris baru di rincian saldo, catatan lama tidak berubah. Karyawan bisa melihat koreksi ini beserta nama yang mengoreksi.', th, b);
    }
  }, actions: [{ label: 'Tutup' }] });
}

/* ---------- Pengaturan cuti ---------- */
async function wcPolicyEditor(th, main, o = {}) {
  const grid = box('LeavePolicyEditor', { dir: 'H', gap: 24, ay: 'MIN', theme: th, parent: main, fillW: true });
  const left = box('form', { dir: 'V', gap: 24, theme: th, parent: grid }); left.layoutGrow = 1; left.layoutSizingHorizontal = 'FILL';
  const s1 = await wcSection(th, left, 'Jatah cuti', 'Berlaku untuk semua karyawan, kecuali yang kena Jatah Khusus.');
  await wcSettingRow(th, s1, 'Jumlah hari per tahun', 'Minimal 12 hari sesuai UU.', async (c) => { await wcNum(th, c, 12, 'hari'); });
  await wcSettingRow(th, s1, 'Kapan jatah muncul dan di-reset', o.anniv ? 'Periode tiap karyawan mengikuti tanggal masuknya. Contoh: masuk 15 Juni, periodenya 15 Juni sampai 14 Juni tahun depan. Lebih adil, tapi tutup periode belum bisa dipakai untuk pilihan ini.' : 'Semua karyawan pakai periode yang sama, 1 Januari sampai 31 Desember. Jatah terbit dan reset bersamaan, dan tutup periode cukup sekali untuk semua.',
    async (c) => { await wcChoice(th, c, ['1 Januari', 'Tanggal masuk'], o.anniv ? 1 : 0); },
    o.anniv ? async (r) => { await alertBox('warning', 'Dengan pilihan ini, Tutup Buku belum bisa dipakai, jadi sisa cuti tidak hangus atau terbawa otomatis.', th, r); } : null, true);
  const s2 = await wcSection(th, left, 'Karyawan baru', 'Kapan karyawan baru dapat jatah, dan kapan boleh dipakai.');
  await wcSettingRow(th, s2, 'Dapat jatah setelah', 'Jatah muncul sejak hari pertama kerja.', async (c) => { await wcNum(th, c, 0, 'bulan'); });
  await wcSettingRow(th, s2, 'Jatah baru bisa dipakai setelah', 'Jatah sudah terlihat di saldo, tapi baru bisa dipakai setelah genap 3 bulan kerja.', async (c) => { await wcNum(th, c, 3, 'bulan'); });
  await wcSettingRow(th, s2, 'Jatah di tahun pertama', 'Sebagian, sesuai sisa bulan. Contoh: mulai berhak Agustus dapat sekitar 5 hari.', async (c) => { await wcChoice(th, c, ['Penuh', 'Sebagian'], 1); }, null, true);
  const s3 = await wcSection(th, left, 'Saldo dan sisa cuti');
  await wcSettingRow(th, s3, 'Saldo boleh minus', 'Karyawan tetap bisa cuti walaupun saldo habis atau belum bisa dipakai. Minusnya memotong jatah tahun depan saat Tutup Buku.', async (c) => { toggle(true, th, c); },
    async (r) => { const q = box('batas', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: r }); await wcChoice(th, q, ['Tanpa batas', 'Ada batas'], 1); await wcNum(th, q, '6', 'hari'); });
  await wcSettingRow(th, s3, 'Sisa cuti di akhir periode', 'Terbawa maksimal 6 hari, sisanya hangus saat Tutup Buku.', async (c) => { await wcChoice(th, c, ['Hangus', 'Dibatasi', 'Semua'], 1); },
    async (r) => { await wcNum(th, r, '6', 'hari'); }, true);
  const s4 = await wcSection(th, left, 'Pengajuan cuti', 'Pengajuan yang tidak sesuai aturan ini otomatis ditolak.');
  await wcSettingRow(th, s4, 'Hari yang memotong jatah', 'Akhir pekan dan tanggal merah tidak dihitung. Cuti Jumat sampai Senin memotong 2 hari.', null,
    async (r) => { await inputField('Hari yang memotong jatah', 'Ikut roster, kalau belum ada pakai Senin–Jumat', th, r, { w: 520, select: true }); });
  await wcSettingRow(th, s4, 'Kalau melewati batas minus', 'Kelebihannya jadi cuti tidak dibayar. Contoh: sisa 2 hari, mengajukan 5 hari. 2 hari potong jatah, 3 hari tidak dibayar.', async (c) => { await wcChoice(th, c, ['Tidak dibayar', 'Tolak'], 0); });
  await wcSettingRow(th, s4, 'Diajukan minimal sebelum hari cuti', 'Cuti tahunan yang diajukan kurang dari 3 hari sebelumnya ditolak. Tidak berlaku untuk sakit dan cuti khusus.', async (c) => { await wcNum(th, c, 3, 'hari'); }, null, true);
  // Ringkasan
  const sum = card(th, grid, { gap: 6, pad: 20 }); sum.fills = [pv(th, 'color/primary-surface')]; sum.layoutSizingHorizontal = 'FIXED'; sum.resize(340, sum.height); sum.layoutSizingHorizontal = 'FIXED';
  await txt('Ringkasan aturan', 'label', 'color/text/secondary', th, { parent: sum, upper: true });
  const big = box('quota', { dir: 'H', gap: 8, ay: 'BASELINE', theme: th, parent: sum });
  await txt('12', 'h4', 'color/text/primary', th, { parent: big }); await txt('hari / tahun', 'body', 'color/text/secondary', th, { parent: big });
  const chips = box('chips', { dir: 'H', gap: 6, theme: th, parent: sum });
  await chip(o.anniv ? 'Reset di tanggal masuk' : 'Reset 1 Januari', th, chips); await chip('Boleh minus sampai 6 hari', th, chips, { color: 'warning', variant: 'outlined' });
  await chip('Terbawa maks 6 hari', th, sum, { variant: 'outlined' });
  gap(sum, 8);
  await txt('Contoh: karyawan masuk 15 Mar 2026', 'subtitle', 'color/text/primary', th, { parent: sum, fillW: true });
  gap(sum, 4);
  const steps = [['15 Mar 2026', 'Mulai kerja', null, 'login'], ['15 Mar 2026', 'Dapat 10 hari', 'Sebagian, sesuai sisa bulan. Langsung bisa dipakai.', 'check'], ['15 Jun 2026', 'Jatah bisa dipakai', 'Genap 3 bulan kerja.', 'check'], ['1 Jan 2027', 'Dapat 12 hari lagi', 'Setelah Tutup Buku, sisa tahun lalu terbawa maksimal 6 hari. Kalau saldo minus, jatah ini dipotong minusnya.', 'refresh']];
  for (const [d, t, det, ic] of steps) {
    const r = box('step', { dir: 'H', gap: 12, ay: 'MIN', pad: [0, 0, 14, 0], theme: th, parent: sum, fillW: true });
    const dot = box('dot', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', radius: 999, theme: th, parent: r, fixed: [28, 28] }); icon(ic === 'login' ? 'person' : ic, 16, 'color/primary', th, dot);
    const tx = box('t', { dir: 'V', theme: th, parent: r }); tx.layoutGrow = 1; tx.layoutSizingHorizontal = 'FILL';
    await txt(d, 'caption', 'color/text/secondary', th, { parent: tx }); await txt(t, 'body2-strong', 'color/text/primary', th, { parent: tx });
    if (det) await txt(det, 'caption', 'color/text/secondary', th, { parent: tx, fillW: true });
  }
}
async function wcSaveBar(th, main, dirty) {
  const wrap = box('sticky', { dir: 'H', ax: 'MAX', theme: th, parent: main, fillW: true });
  const c = card(th, wrap, { dir: 'H', gap: 12, ay: 'CENTER', pad: [10, 16, 10, 16] }); c.layoutSizingHorizontal = 'HUG';
  await txt(dirty ? 'Ada perubahan yang belum disimpan' : 'Semua perubahan sudah tersimpan', 'body2', dirty ? 'color/text/primary' : 'color/text/secondary', th, { parent: c });
  if (dirty) await button('Batalkan', th, c, { v: 'text', size: 'small' });
  await button('Simpan', th, c, { size: 'small', disabled: !dirty });
}
async function wcLeaveSettingsBase(th, tabIdx, o = {}) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Pengaturan Cuti', h: o.h ?? 1200 });
  await wcTitleBlock(th, main, 'Pengaturan Cuti', 'Tiap perusahaan punya pengaturan sendiri. Perubahan hanya berlaku untuk pengajuan baru. Cuti yang sudah disetujui tidak ikut berubah.');
  if (o.error) await alertBox('error', 'Gagal memuat pengaturan cuti. Coba muat ulang halaman.', th, main);
  await wcCompanyBlock(th, main, true);
  if (o.loading) { const c = box('loading', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: 48, theme: th, parent: main, fillW: true }); icon('refresh', 32, 'color/primary', th, c); return { f, main, stop: true }; }
  if (o.mismatch) {
    const a = await alertBox('warning', 'Jatah yang sudah terbit tidak ikut berubah otomatis saat pengaturan diubah. Klik Sesuaikan Semua untuk memperbaruinya.\n• Budi Santoso: dari 12 hari jadi 14 hari. Masa kerja sudah mencapai aturan jatah khusus.\n• Siti Rahmawati: dari 12 hari jadi 10 hari. Jatah tahun pertama dihitung sebagian.\nPenyesuaian dicatat di riwayat sisa cuti tiap karyawan, catatan lama tetap ada. Karyawan bisa melihat kapan dan kenapa jatahnya berubah.', th, main, 'Jatah 2 karyawan belum mengikuti pengaturan ini');
    await button('Sesuaikan Semua', th, a, { v: 'text', size: 'small', color: 'default' });
  }
  await tabs(['Aturan Jatah', o.noRules ? 'Jatah Khusus' : 'Jatah Khusus (2)', 'Jenis Cuti', 'Tutup Buku'], tabIdx, th, main);
  return { f, main };
}

/* ---------- Pengaturan lembur ---------- */
const WC_RATES = {
  workday: [['Jam pertama', '0', '1', '1,5 kali'], ['Jam berikutnya', '1', 'tanpa batas', '2 kali']],
  rest_day: [['Delapan jam pertama', '0', '8', '2 kali'], ['Jam kesembilan', '8', '9', '3 kali'], ['Jam kesepuluh dan seterusnya', '9', 'tanpa batas', '4 kali']],
  public_holiday: [['Delapan jam pertama', '0', '8', '2 kali'], ['Jam kesembilan', '8', '9', '3 kali'], ['Jam kesepuluh dan seterusnya', '9', 'tanpa batas', '4 kali']],
};
async function wcOvertimeSettings(th, v) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Pengaturan Lembur', h: v === 'data' ? 1900 : 900 });
  await wcTitleBlock(th, main, 'Pengaturan Lembur', 'Berlaku per perusahaan. Perubahan hanya berlaku untuk pengajuan baru, yang lama tidak ikut berubah.');
  if (v === 'galat') await alertBox('error', 'Gagal memuat pengaturan lembur. Coba muat ulang halaman.', th, main);
  await wcCompanyField(th, main, 260);
  if (v !== 'data') { const c = box('loading', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: 48, theme: th, parent: main, fillW: true }); icon(v === 'galat' ? 'alert' : 'refresh', 32, v === 'galat' ? 'color/danger' : 'color/primary', th, c); return f; }
  const c1 = card(th, main, { gap: 0, pad: 24 });
  await txt('Batas dan aturan', 'subtitle', 'color/text/primary', th, { parent: c1 });
  gap(c1, 20);
  const fl = box('fields', { dir: 'V', gap: 20, theme: th, parent: c1, fillW: true });
  await inputField('Batas lembur per hari (jam)', '4', th, fl, { w: 340, helper: 'Maksimal 4 jam sesuai UU. Boleh lebih sedikit.' });
  await inputField('Batas lembur per minggu (jam)', '18', th, fl, { w: 340, helper: 'Maksimal 18 jam sesuai UU. Seminggu dihitung Senin sampai Minggu.' });
  const wk = box('hariKerja', { dir: 'V', gap: 4, theme: th, parent: fl, fillW: true });
  await txt('Hari kerja per minggu', 'caption', 'color/text/secondary', th, { parent: wk });
  await inputField('Hari kerja per minggu', '5 hari (Senin–Jumat)', th, wk, { w: 220, select: true });
  await txt('Memengaruhi kapan tarif tertinggi berlaku di hari libur. Kalau 6 hari kerja, tarif naik satu jam lebih awal. Tarif di bawah tidak ikut berubah otomatis.', 'caption', 'color/text/secondary', th, { parent: wk, fillW: true });
  await inputField('Batas pengajuan setelah tanggal lembur (hari)', '7', th, fl, { w: 460, helper: 'Lembur yang terlalu lama baru diajukan sulit dicek kebenarannya.' });
  const sw = box('switch', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent: fl }); toggle(true, th, sw); await txt('Wajib lampirkan foto bukti', 'body', 'color/text/primary', th, { parent: sw });
  gap(c1, 24); wcDiv(th, c1); gap(c1, 24);
  await button('Simpan Pengaturan', th, c1);
  const c2 = card(th, main, { gap: 12, pad: 24 });
  const hd = box('head', { dir: 'H', ay: 'MIN', theme: th, parent: c2, fillW: true });
  const ht = box('t', { dir: 'V', gap: 2, theme: th, parent: hd }); await txt('Tarif lembur', 'subtitle', 'color/text/primary', th, { parent: ht }); await txt('Bawaan sesuai aturan pemerintah', 'body2', 'color/text/secondary', th, { parent: ht });
  spacer(hd); await button('Kembali ke Bawaan', th, hd, { v: 'text', size: 'small', icon: 'refresh' });
  await alertBox('info', 'Tarif dihitung berurutan dari jam awal. Kalau ada jam yang bolong atau tumpang tindih, hasilnya bisa salah. Kalau ragu, klik Kembali ke Bawaan.', th, c2);
  for (const dt of ['workday', 'rest_day', 'public_holiday']) {
    const g = box('grup/' + dt, { dir: 'V', gap: 8, pad: [8, 0, 0, 0], theme: th, parent: c2, fillW: true });
    const ch = WC_DAYCHIP[dt === 'rest_day' ? 'rest' : dt === 'public_holiday' ? 'holiday' : 'workday']; await chip(ch[0], th, g, { color: ch[1], variant: 'tint' });
    await wcGrid(th, g, { rowH: 44, foot: false, cols: [{ t: 'Keterangan', w: 'fill' }, { t: 'Dari jam', w: 140, align: 'right' }, { t: 'Sampai jam', w: 140, align: 'right' }, { t: 'Kali upah', w: 140, align: 'right' }, { t: '', w: 60, align: 'right' }],
      rows: WC_RATES[dt].map((r) => [r[0], r[1], r[2], r[3], { actions: ['trash'] }]) });
  }
  return f;
}

/* ---------- Self-service ---------- */
async function wcMyLeaveBody(th, main, v) {
  if (v === 'noemp') { await alertBox('info', 'Akun ini belum terhubung ke data karyawan, jadi belum punya jatah cuti.', th, main); return; }
  if (v === 'loading') { const c = box('loading', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: 48, theme: th, parent: main, fillW: true }); icon('refresh', 32, 'color/primary', th, c); return; }
  if (v === 'galat') { await alertBox('error', 'Gagal memuat data cuti. Coba lagi.', th, main); return; }
  const act = await pageHeader(th, main, 'Cuti', 'Periode 2026-01-01 s/d 2026-12-31');
  await button('Ajukan Cuti', th, act, { icon: 'plus' });
  const bc = card(th, main, { gap: 16, pad: 24 });
  const top = box('saldo', { dir: 'H', gap: 28, ay: 'CENTER', theme: th, parent: bc });
  const big = box('big', { dir: 'V', theme: th, parent: top });
  await txt(v === 'locked' ? '5' : '8', 'h4', 'color/primary', th, { parent: big });
  await txt(v === 'locked' ? 'hari bisa dipakai sekarang' : 'hari tersisa', 'body2', 'color/text/secondary', th, { parent: big });
  const dv = box('divider', { dir: 'H', fill: 'color/border', theme: th, parent: top, fixed: [1, 56] });
  const kk = box('kk', { dir: 'V', gap: 6, theme: th, parent: top });
  await txt('Jatah periode ini: 12 hari', 'body2', 'color/text/primary', th, { parent: kk }); await txt('Sudah dipakai: 4 hari', 'body2', 'color/text/primary', th, { parent: kk });
  if (v === 'locked') await txt('3 hari baru bisa dipakai mulai 15 Jan 2027', 'body2', 'color/warning', th, { parent: kk });
  wcBar(th, bc, 4 / 12, 1062);
  await button(v === 'ledger' ? 'Sembunyikan rincian' : 'Lihat rincian sisa cuti', th, bc, { v: 'text', size: 'small' });
  if (v === 'ledger') await wcLedgerList(th, bc, WC_LEDGER);
  await txt('Riwayat pengajuan', 'subtitle', 'color/text/primary', th, { parent: main });
  if (v === 'kosong') {
    const ec = card(th, main, { pad: 0 }); await emptyState('umbrella', 'Belum ada pengajuan cuti.', 'Pengajuan cuti yang kamu kirim akan muncul di sini.', th, ec); return;
  }
  const reqs = [
    ['Cuti Tahunan', 'pending', null, '2026-12-14 s/d 2026-12-16 · 3 hari', 'Acara keluarga di luar kota'],
    ['Cuti Tahunan', 'approved', '2 hari tidak dibayar', '2026-12-22 s/d 2026-12-26 · 5 hari', 'Liburan akhir tahun'],
    ['Sakit', 'approved', null, '2026-12-03 · 1 hari', 'Demam dan flu'],
  ];
  const list = box('list', { dir: 'V', gap: 12, theme: th, parent: main, fillW: true });
  for (const r of reqs) {
    const c = card(th, list, { gap: 6, pad: 20 });
    const cr = box('chips', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c });
    await chip(r[0], th, cr); await chip(WC_STATUS[r[1]][0], th, cr, { color: WC_STATUS[r[1]][1] });
    if (r[2]) await chip(r[2], th, cr, { color: 'warning', variant: 'outlined' });
    await txt(r[3], 'body2-strong', 'color/text/primary', th, { parent: c }); await txt(r[4], 'body2', 'color/text/secondary', th, { parent: c });
  }
}
async function wcLeaveForm(th, f, v) {
  // v: 'kosong' | 'info' | 'warn' | 'attach' | 'error'
  const filled = v !== 'kosong';
  await dialog(th, f, { title: 'Ajukan Cuti', w: 480, build: async (b) => {
    const jt = box('jenis', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true });
    await txt('Jenis cuti', 'caption', 'color/text/secondary', th, { parent: jt });
    await inputField('Jenis cuti', v === 'attach' ? 'Sakit' : 'Cuti Tahunan', th, jt, { select: true });
    await txt(v === 'attach' ? 'Sakit · tidak memotong jatah tahunan' : 'Cuti Tahunan · memotong jatah tahunan', 'caption', 'color/text/secondary', th, { parent: jt });
    const dr = box('tanggal', { dir: 'H', gap: 16, theme: th, parent: b, fillW: true });
    await inputField('Mulai', filled ? '2026-12-22' : '', th, dr, { endIcon: 'calendar', required: true }); await inputField('Selesai', filled ? '2026-12-26' : '', th, dr, { endIcon: 'calendar', required: true });
    const sr = box('half', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent: b }); toggle(false, th, sr); await txt('Setengah hari', 'body', 'color/text/primary', th, { parent: sr });
    if (v === 'info') await alertBox('info', 'Saldo 8 → 3 hari.', th, b, '5 hari kerja');
    if (v === 'warn') await alertBox('warning', '3 hari dari jatah, 2 hari tidak dibayar karena melebihi sisa jatah.\n2026-12-25 tidak dihitung: Hari libur nasional', th, b, '5 hari kerja');
    if (v === 'attach') await alertBox('info', 'Saldo 8 → 8 hari.', th, b, '1 hari kerja');
    if (v === 'error') await alertBox('error', 'Sakit wajib ada lampiran dokumen.', th, b);
    await inputField('Alasan', filled ? 'Liburan akhir tahun' : '', th, b, { multiline: 2, required: true });
    await inputField('Nomor yang bisa dihubungi (opsional)', filled ? '0812-0000-1111' : '', th, b, {});
    if (v === 'attach' || v === 'error') {
      const ab = box('lampiran', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true });
      await button('Lampirkan dokumen', th, ab, { v: 'outlined', icon: 'upload', fillW: true });
      await txt('Wajib untuk Sakit. Contoh: surat dokter atau surat keterangan.', 'caption', 'color/text/secondary', th, { parent: ab, fillW: true });
    }
    wcDiv(th, b);
    await txt('Pengajuan dikirim ke atasan langsung, lalu ke HR. Jatah cuti langsung dipotong saat dikirim, dan dikembalikan kalau ditolak atau dibatalkan.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Kirim Pengajuan', v: 'contained', disabled: v === 'kosong' || v === 'error' }] });
}
async function wcMyOvertimeBody(th, main, v) {
  if (v === 'noemp') { await alertBox('info', 'Akun ini belum terhubung ke data karyawan, jadi belum bisa mengajukan lembur.', th, main); return; }
  if (v === 'galat') { await alertBox('error', 'Gagal memuat data lembur. Coba lagi.', th, main); return; }
  const act = await pageHeader(th, main, 'Lembur', 'Riwayat pengajuan lembur');
  await button('Ajukan Lembur', th, act, { icon: 'plus' });
  if (v === 'loading') { const c = box('loading', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: 48, theme: th, parent: main, fillW: true }); icon('refresh', 32, 'color/primary', th, c); return; }
  if (v === 'kosong') { const ec = card(th, main, { pad: 0 }); await emptyState('timer', 'Belum ada pengajuan lembur.', 'Pengajuan lembur yang kamu kirim akan muncul di sini.', th, ec); return; }
  const reqs = [
    ['workday', 'pending', '2026-11-20 · 19:00 – 22:00 · 3 jam', 'Menyelesaikan stok opname akhir bulan', [['1 jam × 1,5 kali'], ['2 jam × 2 kali']], 'Dibayar setara 5,5 jam'],
    ['rest', 'approved', '2026-11-21 · 09:00 – 15:00 · 6 jam', 'Perbaikan server di akhir pekan', [['6 jam × 2 kali']], 'Dibayar setara 12 jam'],
    ['holiday', 'rejected', '2026-11-12 · 08:00 – 13:00 · 5 jam', 'Menyiapkan laporan bulanan', [['5 jam × 2 kali']], 'Dibayar setara 10 jam'],
  ];
  const list = box('list', { dir: 'V', gap: 12, theme: th, parent: main, fillW: true });
  for (const r of reqs) {
    const c = card(th, list, { gap: 6, pad: 20 });
    const cr = box('chips', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c });
    await chip(WC_DAYCHIP[r[0]][0], th, cr, { color: WC_DAYCHIP[r[0]][1] }); await chip(WC_STATUS[r[1]][0], th, cr, { color: WC_STATUS[r[1]][1] });
    await txt(r[2], 'body2-strong', 'color/text/primary', th, { parent: c }); await txt(r[3], 'body2', 'color/text/secondary', th, { parent: c });
    const tr = box('tiers', { dir: 'H', gap: 8, pad: [4, 0, 0, 0], theme: th, parent: c });
    for (const t of r[4]) await chip(t[0], th, tr, { variant: 'outlined' });
    await chip(r[5], th, tr, { color: 'primary' });
  }
}
async function wcOvertimeForm(th, f, v) {
  // v: 'kosong' | 'hari-kerja' | 'libur' | 'error'
  const filled = v !== 'kosong';
  await dialog(th, f, { title: 'Ajukan Lembur', w: 480, build: async (b) => {
    await inputField('Mulai', filled ? '2026-11-21T09:00' : '', th, b, { endIcon: 'calendar', required: true });
    await inputField('Selesai', filled ? '2026-11-21T15:00' : '', th, b, { endIcon: 'calendar', required: true });
    if (v === 'hari-kerja') await alertBox('info', 'Hari kerja biasa, menurut jadwal kerja.\n1 jam pertama: 1 jam × 1,5 kali\nJam berikutnya: 2 jam × 2 kali\nDibayar setara 5,5 jam\nSudah tercatat 0 jam hari itu, 3 jam minggu itu.', th, b, '3 jam · Hari kerja');
    if (v === 'libur') await alertBox('warning', 'Tanggal itu hari libur dalam jadwal kerja.\nDelapan jam pertama: 6 jam × 2 kali\nDibayar setara 12 jam', th, b, '6 jam · Hari libur kerja');
    if (v === 'error') await alertBox('error', 'Foto bukti lembur wajib dilampirkan.', th, b);
    await inputField('Alasan lembur', filled ? 'Menyelesaikan stok opname akhir bulan' : '', th, b, { multiline: 2, required: true });
    const pb = box('bukti', { dir: 'V', gap: 4, theme: th, parent: b, fillW: true });
    await button('Lampirkan foto bukti', th, pb, { v: 'outlined', icon: 'camera', fillW: true });
    await txt('Wajib. Atasan akan melihatnya saat memeriksa pengajuan.', 'caption', 'color/text/secondary', th, { parent: pb, fillW: true });
    wcDiv(th, b);
    await txt('Jenis hari otomatis diisi sistem dari kalender libur dan jadwal kerja. Pengajuan dikirim ke atasan langsung, lalu ke HR.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Kirim Pengajuan', v: 'contained', disabled: v === 'kosong' || v === 'error' }] });
}

/* ---------- Registrasi layar ---------- */
const wcReg = (key, title, build) => registerScreen({ key, group: WC_GROUP, title, build });

// --- Owner: Pengajuan Cuti
wcReg('owner/leave-requests', 'Pengajuan Cuti', (th) => wcBuildLeaveRequests(th, 'data'));
wcReg('owner/leave-requests-kosong', 'Pengajuan Cuti (kosong)', (th) => wcBuildLeaveRequests(th, 'kosong'));
wcReg('owner/leave-requests-galat', 'Pengajuan Cuti (galat)', (th) => wcBuildLeaveRequests(th, 'galat'));

// --- Owner: Saldo Cuti
wcReg('owner/leave-balances', 'Saldo Cuti', async (th) => (await wcBalanceList(th, 'list', 'Saldo Cuti')).f);
wcReg('owner/leave-balances-kosong', 'Saldo Cuti (kosong)', async (th) => (await wcBalanceList(th, 'kosong', 'Saldo Cuti')).f);
wcReg('owner/leave-balances-galat', 'Saldo Cuti (galat)', async (th) => (await wcBalanceList(th, 'galat', 'Saldo Cuti')).f);
wcReg('owner/leave-balances-detail', 'Saldo Cuti: dialog detail dan koreksi', async (th) => { const { f } = await wcBalanceList(th, 'dialog', 'Saldo Cuti'); await wcBalanceDialogInline(th, f, false); return f; });
wcReg('owner/leave-balances-koreksi', 'Saldo Cuti: dialog koreksi terisi', async (th) => { const { f } = await wcBalanceList(th, 'dialog', 'Saldo Cuti'); await wcBalanceDialogInline(th, f, true); return f; });
wcReg('owner/leave-balance', 'Saldo Cuti (panel detail)', async (th) => (await wcBalanceList(th, 'list', 'Saldo Cuti')).f);
wcReg('owner/leave-balance-detail', 'Saldo Cuti: panel detail karyawan', async (th) => { const { f } = await wcBalanceList(th, 'panel', 'Saldo Cuti'); await wcBalancePanelDialog(th, f, 'ringkas'); return f; });
wcReg('owner/leave-balance-koreksi', 'Saldo Cuti: panel dengan form koreksi', async (th) => { const { f } = await wcBalanceList(th, 'panel', 'Saldo Cuti'); await wcBalancePanelDialog(th, f, 'koreksi'); return f; });
wcReg('owner/leave-balance-memuat', 'Saldo Cuti: panel memuat', async (th) => { const { f } = await wcBalanceList(th, 'panel', 'Saldo Cuti'); await wcBalancePanelDialog(th, f, 'memuat'); return f; });

// --- Owner: Pengaturan Cuti
wcReg('owner/leave-settings', 'Pengaturan Cuti: Aturan Jatah', async (th) => { const { f, main } = await wcLeaveSettingsBase(th, 0, { h: 2300, mismatch: true }); await wcPolicyEditor(th, main); await wcSaveBar(th, main, false); return f; });
wcReg('owner/leave-settings-diubah', 'Pengaturan Cuti: ada perubahan (tanggal masuk)', async (th) => { const { f, main } = await wcLeaveSettingsBase(th, 0, { h: 2300 }); await wcPolicyEditor(th, main, { anniv: true }); await wcSaveBar(th, main, true); return f; });
wcReg('owner/leave-settings-memuat', 'Pengaturan Cuti (memuat)', async (th) => (await wcLeaveSettingsBase(th, 0, { h: 700, loading: true })).f);
wcReg('owner/leave-settings-galat', 'Pengaturan Cuti (galat)', async (th) => (await wcLeaveSettingsBase(th, 0, { h: 700, loading: true, error: true })).f);
async function wcSpecialTab(th, empty) {
  const { f, main } = await wcLeaveSettingsBase(th, 1, { h: 1100, noRules: empty });
  const c = card(th, main, { gap: 12, pad: 24 });
  const hd = box('head', { dir: 'H', ay: 'MIN', theme: th, parent: c, fillW: true });
  const ht = box('t', { dir: 'V', gap: 2, theme: th, parent: hd }); ht.layoutGrow = 1; ht.layoutSizingHorizontal = 'FILL';
  await txt('Jatah khusus per jabatan dan masa kerja', 'subtitle', 'color/text/primary', th, { parent: ht });
  await txt('Untuk memberi jatah lebih banyak ke sebagian karyawan. Kalau karyawan cocok dengan beberapa aturan, dipakai jatah yang paling banyak.', 'body2', 'color/text/secondary', th, { parent: ht, fillW: true });
  await button('Tambah', th, hd, { v: 'text', size: 'small', icon: 'plus' });
  if (empty) await alertBox('info', 'Belum ada jatah khusus. Semua karyawan dapat jatah dasar 12 hari.', th, c);
  else {
    await wcGrid(th, c, { foot: false, rowH: 48, cols: [{ t: 'Keterangan', w: 'fill' }, { t: 'Level jabatan minimal', w: 200, align: 'right' }, { t: 'Masa kerja minimal', w: 180, align: 'right' }, { t: 'Jatah cuti', w: 120, align: 'right' }, { t: '', w: 60, align: 'right' }],
      rows: [['Supervisor senior', 'Level 2', '3 tahun', '14 hari', { actions: ['trash'] }], ['Semua staf, loyalitas', 'Semua level', '5 tahun', '15 hari', { actions: ['trash'] }]] });
    await txt('Kedua syarat harus terpenuhi. Contoh: aturan "level 2, masa kerja 3 tahun" tidak berlaku untuk Supervisor yang baru kerja setahun.', 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
  }
  await alertBox('warning', 'Level jabatan diatur di menu Perusahaan → Jabatan. Selama semua jabatan masih Level 1, aturan dengan syarat level tidak akan berlaku untuk siapa pun.', th, c);
  return f;
}
wcReg('owner/leave-settings-khusus', 'Pengaturan Cuti: Jatah Khusus', (th) => wcSpecialTab(th, false));
wcReg('owner/leave-settings-khusus-kosong', 'Pengaturan Cuti: Jatah Khusus (kosong)', (th) => wcSpecialTab(th, true));
async function wcRuleDialog(th, filled) {
  const f = await wcSpecialTab(th, false);
  await dialog(th, f, { title: 'Tambah Jatah Khusus', w: 480, build: async (b) => {
    await txt('Karyawan yang memenuhi kedua syarat di bawah dapat jatah ini, bukan jatah dasar.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    await inputField('Keterangan', filled ? 'Supervisor senior' : '', th, b, { focus: !filled, helper: 'Catatan untuk HR, supaya ingat kenapa aturan ini dibuat.' });
    await inputField('Syarat 1: level jabatan minimal', filled ? '2' : '1', th, b, { helper: filled ? 'Hanya untuk jabatan Level 2 ke atas.' : 'Level 1 berarti berlaku untuk semua jabatan.' });
    await inputField('Syarat 2: masa kerja minimal (bulan)', filled ? '36' : '0', th, b, { helper: filled ? 'Setara 3 tahun bekerja.' : 'Isi 0 kalau berlaku sejak hari pertama kerja.' });
    await inputField('Jatah cuti (hari per tahun)', filled ? '14' : '12', th, b, {});
  }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained', disabled: !filled }] });
  return f;
}
wcReg('owner/leave-settings-aturan-kuota', 'Dialog Tambah Jatah Khusus (kosong)', (th) => wcRuleDialog(th, false));
wcReg('owner/leave-settings-aturan-kuota-terisi', 'Dialog Tambah Jatah Khusus (terisi)', (th) => wcRuleDialog(th, true));
async function wcTypesTab(th) {
  const { f, main } = await wcLeaveSettingsBase(th, 2, { h: 1300 });
  const c = card(th, main, { gap: 12, pad: 24 });
  await txt('Jenis cuti yang bisa diajukan', 'subtitle', 'color/text/primary', th, { parent: c });
  await txt('Jenis cuti bawaan sudah sesuai UU. Matikan yang tidak berlaku di perusahaan ini, nanti tidak muncul di pilihan karyawan.', 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
  await wcGrid(th, c, { foot: false, rowH: 56, cols: [{ t: 'Nama', w: 'fill' }, { t: 'Kelompok', w: 150 }, { t: 'Maksimal per kejadian', w: 190, align: 'right' }, { t: 'Memotong jatah tahunan', w: 200 }, { t: 'Aktif', w: 80, align: 'right' }],
    rows: [
      [{ t: 'Cuti Tahunan' }, { chip: 'Cuti Tahunan', color: 'default', variant: 'tint' }, 'Tanpa batas', 'Ya', { switch: true }],
      [{ t: 'Sakit', sub: 'Wajib lampiran' }, { chip: 'Sakit', color: 'default', variant: 'tint' }, 'Tanpa batas', 'Tidak', { switch: true }],
      [{ t: 'Cuti Menikah', sub: 'Wajib lampiran' }, { chip: 'Cuti Khusus', color: 'default', variant: 'tint' }, '3 hari', 'Tidak', { switch: true }],
      [{ t: 'Cuti Kematian Keluarga', sub: 'Wajib lampiran' }, { chip: 'Cuti Khusus', color: 'default', variant: 'tint' }, '2 hari', 'Tidak', { switch: true }],
      [{ t: 'Cuti Tidak Dibayar', sub: 'Tidak dibayar' }, { chip: 'Tidak Dibayar', color: 'default', variant: 'tint' }, 'Tanpa batas', 'Tidak', { switch: false }],
    ] });
  await txt('"Maksimal per kejadian" beda dengan jatah tahunan. Contoh: cuti menikah 3 hari diberikan saat menikah, dan tidak memotong jatah cuti tahunan.', 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
  await alertBox('info', 'Cuti melahirkan tidak termasuk bawaan karena aturannya bisa berubah. Tambahkan sendiri setelah memastikan jumlah hari yang berlaku.', th, c);
  return f;
}
wcReg('owner/leave-settings-jenis', 'Pengaturan Cuti: Jenis Cuti', wcTypesTab);
async function wcClosingTab(th, st) {
  const { f, main } = await wcLeaveSettingsBase(th, 3, { h: 1300 });
  const c = card(th, main, { gap: 12, pad: 24 });
  await txt('Tutup Buku Periode', 'subtitle', 'color/text/primary', th, { parent: c });
  await txt('Jalankan sekali di awal tahun untuk tahun sebelumnya. Sisa cuti dibawa ke tahun depan sesuai aturan di tab Aturan Jatah. Tidak bisa dibatalkan. Saldo minus dipindah untuk memotong jatah tahun depan.', 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
  const r = box('form', { dir: 'H', gap: 12, ay: 'MIN', theme: th, parent: c });
  await inputField('Tahun yang ditutup', st === 'sudah' ? '2024' : '2025', th, r, { w: 170 }); const bw = box('btn', { dir: 'V', pad: [10, 0, 0, 0], theme: th, parent: r }); await button('Cek Dampaknya', th, bw, { v: 'outlined' });
  if (st === 'hasil') {
    const a = await alertBox('warning', '312 hari terbawa ke tahun depan, 88 hari hangus. Saldo minus 6 hari memotong jatah tahun depan.', th, c, '48 karyawan akan terpengaruh');
    await button('Ya, Tutup Tahun 2025', th, a, { color: 'warning', size: 'small' });
  }
  if (st === 'sudah') await alertBox('success', 'Tahun 2024 sudah ditutup dan tidak bisa ditutup lagi.', th, c);
  await txt('Riwayat penutupan', 'subtitle', 'color/text/primary', th, { parent: c });
  await wcGrid(th, c, { foot: false, rowH: 56, cols: [{ t: 'Tahun', w: 90 }, { t: 'Karyawan', w: 110, align: 'right' }, { t: 'Terbawa', w: 130, align: 'right' }, { t: 'Hangus', w: 130, align: 'right' }, { t: 'Minus dipindah', w: 150, align: 'right' }, { t: 'Ditutup oleh', w: 'fill' }],
    rows: [['2024', '45', '280 hari', '70 hari', '—', { t: 'Dewi Lestari', sub: '6/1/2025' }], ['2023', '41', '240 hari', '95 hari', '4 hari', { t: 'Dewi Lestari', sub: '5/1/2024' }]] });
  return f;
}
wcReg('owner/leave-settings-tutup-buku', 'Pengaturan Cuti: Tutup Buku', (th) => wcClosingTab(th, 'awal'));
wcReg('owner/leave-settings-tutup-buku-hasil', 'Pengaturan Cuti: Tutup Buku (hasil cek dampak)', (th) => wcClosingTab(th, 'hasil'));
wcReg('owner/leave-settings-tutup-buku-sudah', 'Pengaturan Cuti: Tutup Buku (sudah ditutup)', (th) => wcClosingTab(th, 'sudah'));

// --- Owner: Lembur
async function wcOtRequests(th, v) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Pengajuan Lembur', h: v === 'data' || v === 'detail' ? 1100 : 900 });
  await wcTitleBlock(th, main, 'Pengajuan Lembur', v === 'data' || v === 'detail' ? '5 dari 5 pengajuan · disetujui 5,5 jam, dibayar setara 8,25 jam' : '0 dari 0 pengajuan · disetujui 0 jam, dibayar setara 0 jam');
  if (v === 'galat') await alertBox('error', WC_ERR_LOAD, th, main);
  if (v === 'data' || v === 'detail') await wcAlertPending(th, main, 1);
  const c = wcGridCard(th, main); const fb = wcFilterBar(th, c);
  await wcSearch(th, fb); await wcDate('Dari', '2026-11-01', th, fb); await wcDate('Sampai', '2026-11-30', th, fb); await wcStatusSel(th, fb);
  if (v === 'data' || v === 'detail') await wcGrid(th, c, { cols: WC_OT_COLS, rows: WC_OT_ROWS, foot: '1–5 dari 5' });
  else await emptyState('timer', 'Tidak ada pengajuan lembur', 'Belum ada pengajuan pada rentang tanggal ini.', th, c);
  if (v === 'detail' || v === 'detail-memuat') {
    await dialog(th, f, { title: 'Detail Lembur', w: 480, build: async (b) => {
      const pr = box('bukti', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/background', radius: 8, theme: th, parent: b, fillW: true }); pr.counterAxisSizingMode = 'FIXED'; pr.resize(100, v === 'detail' ? 220 : 140); pr.layoutSizingHorizontal = 'FILL';
      icon(v === 'detail' ? 'camera' : 'refresh', 32, 'color/text/secondary', th, pr);
      wcDiv(th, b);
      const inf = box('info', { dir: 'V', gap: 8, theme: th, parent: b, fillW: true });
      await txt('Budi Santoso · 2026-11-20', 'body2-strong', 'color/text/primary', th, { parent: inf });
      await txt('19:00 – 22:00 · 3 jam', 'body2', 'color/text/secondary', th, { parent: inf });
      await txt('Hari kerja. Hari kerja biasa menurut jadwal kerja.', 'body2', 'color/text/secondary', th, { parent: inf, fillW: true });
      await txt('Menyelesaikan stok opname akhir bulan', 'body2', 'color/text/primary', th, { parent: inf, fillW: true });
      wcDiv(th, b);
      await txt('Rincian perhitungan', 'subtitle', 'color/text/primary', th, { parent: b });
      const rr = box('rincian', { dir: 'V', gap: 6, theme: th, parent: b, fillW: true });
      await wcRow(th, rr, 'Jam pertama', '1 jam × 1,5 kali'); await wcRow(th, rr, 'Jam berikutnya', '2 jam × 2 kali'); wcDiv(th, rr);
      await wcRow(th, rr, 'Total dibayar', '5,5 jam', true);
    }, actions: [] });
  }
  return f;
}
wcReg('owner/overtime-requests', 'Pengajuan Lembur', (th) => wcOtRequests(th, 'data'));
wcReg('owner/overtime-requests-kosong', 'Pengajuan Lembur (kosong)', (th) => wcOtRequests(th, 'kosong'));
wcReg('owner/overtime-requests-galat', 'Pengajuan Lembur (galat)', (th) => wcOtRequests(th, 'galat'));
wcReg('owner/overtime-requests-detail', 'Pengajuan Lembur: dialog Detail Lembur', (th) => wcOtRequests(th, 'detail'));
wcReg('owner/overtime-requests-detail-memuat', 'Pengajuan Lembur: dialog Detail (bukti memuat)', (th) => wcOtRequests(th, 'detail-memuat'));

async function wcOtSummary(th, v) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Rekap Lembur', h: 950 });
  const act = await pageHeader(th, main, 'Rekap Lembur', v === 'data' ? '5 karyawan · 21,5 jam lembur, setara 36,25 jam' : '0 karyawan · 0 jam lembur, setara 0 jam');
  await button('Export Excel', th, act, { icon: 'download', disabled: v !== 'data' });
  if (v === 'galat') await alertBox('error', 'Gagal memuat rekap lembur. Coba lagi.', th, main);
  await alertBox('info', 'Hanya berisi lembur yang sudah disetujui penuh. Jam Dibayar sudah dikali tarif lembur, tinggal dikali upah per jam untuk payroll.', th, main);
  const c = wcGridCard(th, main); const fb = wcFilterBar(th, c);
  await wcDate('Dari', '2026-11-01', th, fb); await wcDate('Sampai', '2026-11-30', th, fb); await inputField('Perusahaan', 'Semua Perusahaan', th, fb, { w: 220, select: true });
  if (v === 'data') await wcGrid(th, c, { cols: [{ t: 'No. Karyawan', w: 140 }, { t: 'Nama', w: 'fill' }, { t: 'Pengajuan', w: 110, align: 'right' }, { t: 'Total Jam', w: 130, align: 'right' }, { t: 'Jam Dibayar', w: 140, align: 'right' }],
    rows: [['EMP-000003', 'Budi Santoso', '4', '9 jam', '15 jam'], ['EMP-000013', 'Eko Prasetyo', '2', '6 jam', '12 jam'], ['EMP-000015', 'Maya Anggraini', '2', '2,5 jam', '3,75 jam'], ['EMP-000019', 'Putri Handayani', '1', '2 jam', '3 jam'], ['EMP-000021', 'Doni Setiawan', '1', '2 jam', '2,5 jam']], foot: '1–5 dari 5' });
  else await emptyState('clock', 'Belum ada rekap lembur', 'Tidak ada lembur yang disetujui pada periode ini.', th, c);
  return f;
}
wcReg('owner/overtime-summary', 'Rekap Lembur', (th) => wcOtSummary(th, 'data'));
wcReg('owner/overtime-summary-kosong', 'Rekap Lembur (kosong)', (th) => wcOtSummary(th, 'kosong'));
wcReg('owner/overtime-summary-galat', 'Rekap Lembur (galat)', (th) => wcOtSummary(th, 'galat'));
wcReg('owner/overtime-settings', 'Pengaturan Lembur', (th) => wcOvertimeSettings(th, 'data'));
wcReg('owner/overtime-settings-memuat', 'Pengaturan Lembur (memuat)', (th) => wcOvertimeSettings(th, 'memuat'));
wcReg('owner/overtime-settings-galat', 'Pengaturan Lembur (galat)', (th) => wcOvertimeSettings(th, 'galat'));

// --- Self-service: owner (panel HR) dan karyawan
async function wcSelfLeave(th, role, v, form) {
  const active = role === 'owner' ? 'Cuti ' : 'Cuti  ';
  const { f, main } = await page('x', th, { role, active, h: form ? 1500 : 1100 });
  await wcMyLeaveBody(th, main, v);
  if (form) await wcLeaveForm(th, f, form);
  return f;
}
async function wcSelfOt(th, role, v, form) {
  const active = role === 'owner' ? 'Lembur ' : 'Lembur  ';
  const { f, main } = await page('x', th, { role, active, h: form ? 1300 : 1000 });
  await wcMyOvertimeBody(th, main, v);
  if (form) await wcOvertimeForm(th, f, form);
  return f;
}
for (const [role, pre, who] of [['owner', 'owner/my-', 'Saya (HR)'], ['employee', 'employee/', 'Karyawan']]) {
  const L = role === 'owner' ? 'my-leave' : 'leave', O = role === 'owner' ? 'my-overtime' : 'overtime';
  wcReg(pre + L, `Cuti ${who}`, (th) => wcSelfLeave(th, role, 'data'));
  wcReg(pre + L + '-rincian', `Cuti ${who}: rincian sisa dibuka`, (th) => wcSelfLeave(th, role, 'ledger'));
  wcReg(pre + L + '-terkunci', `Cuti ${who}: sebagian jatah belum bisa dipakai`, (th) => wcSelfLeave(th, role, 'locked'));
  wcReg(pre + L + '-kosong', `Cuti ${who} (belum ada pengajuan)`, (th) => wcSelfLeave(th, role, 'kosong'));
  wcReg(pre + L + '-galat', `Cuti ${who} (galat)`, (th) => wcSelfLeave(th, role, 'galat'));
  wcReg(pre + L + '-memuat', `Cuti ${who} (memuat)`, (th) => wcSelfLeave(th, role, 'loading'));
  wcReg(pre + L + '-tanpa-karyawan', `Cuti ${who} (akun belum terhubung karyawan)`, (th) => wcSelfLeave(th, role, 'noemp'));
  wcReg(pre + L + '-ajukan', `Cuti ${who}: dialog Ajukan Cuti (kosong)`, (th) => wcSelfLeave(th, role, 'data', 'kosong'));
  wcReg(pre + L + '-ajukan-pratinjau', `Cuti ${who}: dialog Ajukan Cuti (pratinjau)`, (th) => wcSelfLeave(th, role, 'data', 'info'));
  wcReg(pre + L + '-ajukan-melebihi', `Cuti ${who}: dialog Ajukan Cuti (melebihi jatah)`, (th) => wcSelfLeave(th, role, 'data', 'warn'));
  wcReg(pre + L + '-ajukan-lampiran', `Cuti ${who}: dialog Ajukan Cuti (wajib lampiran)`, (th) => wcSelfLeave(th, role, 'data', 'attach'));
  wcReg(pre + L + '-ajukan-galat', `Cuti ${who}: dialog Ajukan Cuti (galat)`, (th) => wcSelfLeave(th, role, 'data', 'error'));
  wcReg(pre + O, `Lembur ${who}`, (th) => wcSelfOt(th, role, 'data'));
  wcReg(pre + O + '-kosong', `Lembur ${who} (belum ada pengajuan)`, (th) => wcSelfOt(th, role, 'kosong'));
  wcReg(pre + O + '-galat', `Lembur ${who} (galat)`, (th) => wcSelfOt(th, role, 'galat'));
  wcReg(pre + O + '-memuat', `Lembur ${who} (memuat)`, (th) => wcSelfOt(th, role, 'loading'));
  wcReg(pre + O + '-tanpa-karyawan', `Lembur ${who} (akun belum terhubung karyawan)`, (th) => wcSelfOt(th, role, 'noemp'));
  wcReg(pre + O + '-ajukan', `Lembur ${who}: dialog Ajukan Lembur (kosong)`, (th) => wcSelfOt(th, role, 'data', 'kosong'));
  wcReg(pre + O + '-ajukan-hari-kerja', `Lembur ${who}: dialog Ajukan Lembur (pratinjau hari kerja)`, (th) => wcSelfOt(th, role, 'data', 'hari-kerja'));
  wcReg(pre + O + '-ajukan-libur', `Lembur ${who}: dialog Ajukan Lembur (pratinjau hari libur)`, (th) => wcSelfOt(th, role, 'data', 'libur'));
  wcReg(pre + O + '-ajukan-galat', `Lembur ${who}: dialog Ajukan Lembur (galat)`, (th) => wcSelfOt(th, role, 'data', 'error'));
}


/* ===== projects/workonix-web/screens/80-payroll.js ===== */
/* =====================================================================
 * Payroll (owner): proses payroll, laporan, gaji tambahan, penetapan, struktur, komponen, pengaturan, slip saya
 * Prefiks: wp / WP_
 * ===================================================================== */
const WP_GROUP = 'Payroll';
const WP_CO = 'PT Maju Bersama';
const wpRp = (n) => 'Rp ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const wpMk = (key, title, fn) => registerScreen({ key, group: WP_GROUP, title, build: async (th) => fn(th) });

/* ---------- pembantu ---------- */
function wpDivider(th, parent) { const d = figma.createRectangle(); d.name = 'divider'; d.resize(10, 1); d.fills = [pv(th, 'color/border')]; parent.appendChild(d); d.layoutSizingHorizontal = 'FILL'; return d; }
function wpRow(th, parent, o = {}) { return box(o.name ?? 'row', { dir: 'H', gap: o.gap ?? 12, ay: o.ay ?? 'CENTER', ax: o.ax, pad: o.pad ?? 0, theme: th, parent, fillW: true, fill: o.fill, stroke: o.stroke, radius: o.radius }); }
function wpCol(th, parent, o = {}) { return box(o.name ?? 'col', { dir: 'V', gap: o.gap ?? 4, pad: o.pad ?? 0, theme: th, parent, fillW: o.fillW !== false, fill: o.fill, stroke: o.stroke, radius: o.radius, ax: o.ax, ay: o.ay }); }
async function wpChipRows(th, parent, chips, per) {
  const col = wpCol(th, parent, { gap: 6, name: 'chips' });
  for (let i = 0; i < chips.length; i += per) {
    const r = box('chip row', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: col });
    for (const c of chips.slice(i, i + per)) await chip(c.l, th, r, { color: c.color ?? 'default', variant: c.v ?? 'outlined', icon: c.icon });
  }
  return col;
}
/** Kartu filter dengan satu kolom Perusahaan (SearchSelect). */
async function wpCompanyCard(th, main, o = {}) {
  const c = card(th, main, { pad: 16, dir: 'H', gap: 12, ay: 'CENTER' });
  await inputField('Perusahaan', o.value ?? WP_CO, th, c, { w: 360, select: true });
  return c;
}
async function wpPage(th, active, h, title, sub) {
  const { f, main } = await page('x', th, { role: 'owner', active, h });
  const act = await pageHeader(th, main, title, sub);
  return { f, main, act };
}
/** Hapus bingkai ganda tabel di dalam kartu. */
function wpFlat(tbl) { tbl.strokes = []; tbl.cornerRadius = 0; return tbl; }
/** Baris total di dasar tabel. cols sama dengan tabel; vals string/null per kolom. */
async function wpTotalRow(th, tbl, cols, vals) {
  const r = box('total', { dir: 'H', ay: 'CENTER', pad: [0, 16, 0, 16], fill: 'color/background', theme: th, parent: tbl });
  r.counterAxisSizingMode = 'FIXED'; r.resize(100, 48); r.layoutSizingHorizontal = 'FILL';
  for (const [i, col] of cols.entries()) {
    const c = box('cell', { dir: 'H', ay: 'CENTER', ax: col.align === 'right' ? 'MAX' : 'MIN', theme: th, parent: r });
    if (col.w === 'fill' || col.w == null) { c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL'; } else { c.counterAxisSizingMode = 'AUTO'; c.primaryAxisSizingMode = 'FIXED'; c.resize(col.w, 20); }
    if (vals[i]) await txt(vals[i], 'body2-strong', 'color/text/primary', th, { parent: c });
  }
  return r;
}
async function wpSwitch(th, parent, on, label, hint) {
  const r = box('switch/' + label, { dir: 'H', gap: 12, ay: 'MIN', theme: th, parent, fillW: true });
  toggle(on, th, r);
  const t = box('text', { dir: 'V', gap: 2, theme: th, parent: r }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL';
  await txt(label, 'body2-strong', 'color/text/primary', th, { parent: t, fillW: true });
  if (hint) await txt(hint, 'caption', 'color/text/secondary', th, { parent: t, fillW: true });
  return r;
}
function wpRadio(th, parent, on) {
  const o = box('radio', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 999, stroke: on ? 'color/primary' : 'color/text/secondary', sw: 2, theme: th, parent, fixed: [20, 20] });
  if (on) box('dot', { dir: 'H', fill: 'color/primary', radius: 999, theme: th, parent: o, fixed: [10, 10] });
  return o;
}
async function wpMonthField(th, parent, label, value, o = {}) { return inputField(label, value, th, parent, { w: o.w, endIcon: 'calendar', helper: o.helper, error: o.error }); }
async function wpErrorList(th, parent, title, lines) { return alertBox('error', lines.join('\n'), th, parent, title); }

/* ---------- Pratinjau slip (SlipPreviewView) ---------- */
async function wpLines(th, parent, title, lines, total, totalLabel) {
  const col = wpCol(th, parent, { gap: 8, name: 'Lines/' + title });
  await txt(title, 'label', 'color/text/secondary', th, { parent: col, upper: true });
  for (const l of lines) {
    const r = box('line', { dir: 'H', gap: 8, ay: 'MIN', theme: th, parent: col, fillW: true });
    const left = box('left', { dir: 'V', gap: 2, theme: th, parent: r }); left.layoutGrow = 1; left.layoutSizingHorizontal = 'FILL';
    const nr = box('name', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: left });
    await txt(l.name, 'body2', l.muted ? 'color/text/secondary' : 'color/text/primary', th, { parent: nr });
    await txt(l.abbr, 'caption', 'color/text/disabled', th, { parent: nr });
    if (l.tag) await chip(l.tag, th, nr, { variant: 'outlined' });
    await txt(l.source, 'caption', 'color/text/secondary', th, { parent: left, fillW: true });
    await txt(wpRp(l.amount), 'body2-strong', 'color/text/primary', th, { parent: r });
  }
  if (total !== undefined) {
    const tr = wpRow(th, col, { ax: 'SPACE_BETWEEN' });
    tr.paddingTop = 4;
    await txt(totalLabel, 'body2-strong', 'color/text/primary', th, { parent: tr });
    await txt(wpRp(total), 'body2-strong', 'color/text/primary', th, { parent: tr });
  }
  return col;
}
/** o: wide (lebar > 560, chip per baris lebih banyak), prorata (baris gaji pokok dikali hari dibayar). */
async function wpSlipView(th, parent, o = {}) {
  const wrap = wpCol(th, parent, { gap: 16, name: 'SlipPreviewView' });
  const head = wpCol(th, wrap, { gap: 4 });
  await txt('Budi Santoso', 'body2-strong', 'color/text/primary', th, { parent: head });
  await txt('Staf Tetap · 2026-11-01 s/d 2026-11-30', 'body2', 'color/text/secondary', th, { parent: head });
  const chips = [{ l: 'Hari dibayar 30/30 · Hari kalender', v: 'tint', color: 'primary' }, { l: '21 hari kerja riil' }, { l: '1 tanggal merah' }, { l: '19 hari hadir' }, { l: 'gaji dasar ' + wpRp(8000000) }, { l: 'gaji variabel ' + wpRp(500000) }];
  if (o.prorata) chips.splice(1, 0, { l: '1 hari cuti tidak dibayar', color: 'warning' });
  await wpChipRows(th, head, chips, o.wide ? 4 : 2);
  const gp = o.prorata ? { name: 'Gaji Pokok', abbr: 'GP', source: 'base · nilai penuh ' + wpRp(8000000), amount: 7733333 } : { name: 'Gaji Pokok', abbr: 'GP', source: 'base', amount: 8000000 };
  const earn = [gp, { name: 'Tunjangan Makan', abbr: 'TM', source: '25000 * present_days', amount: 550000 }, { name: 'Tunjangan Transport', abbr: 'TT', source: 'Nominal tetap', amount: 500000 }, { name: 'Upah Dasar BPJS', abbr: 'UB', source: 'base', amount: 8000000, muted: true, tag: 'komponen bantu' }];
  await wpLines(th, wrap, 'Pendapatan', earn, o.prorata ? 8783333 : 9050000, 'Total pendapatan kotor');
  wpDivider(th, wrap);
  await wpLines(th, wrap, 'Potongan', [{ name: 'BPJS Kesehatan (Karyawan)', abbr: 'BPK', source: 'GP * 0.01', amount: 80000 }, { name: 'BPJS JHT (Karyawan)', abbr: 'JHT', source: 'GP * 0.02', amount: 160000 }, { name: 'PPh 21', abbr: 'PPH', source: 'Gaji tambahan', amount: 150000 }], 390000, 'Total potongan');
  const thp = box('THP', { dir: 'H', ay: 'CENTER', ax: 'SPACE_BETWEEN', pad: 12, fill: 'color/primary', radius: 8, theme: th, parent: wrap, fillW: true });
  await txt('Gaji bersih (THP)', 'body2-strong', onPrimary(th), th, { parent: thp });
  await txt(wpRp(o.prorata ? 8393333 : 8660000), 'h6', onPrimary(th), th, { parent: thp });
  await wpLines(th, wrap, 'Ditanggung perusahaan (tidak memotong gaji)', [{ name: 'BPJS Kesehatan (Perusahaan)', abbr: 'BPP', source: 'GP * 0.04', amount: 320000 }], 320000, 'Total ditanggung perusahaan');
  await txt('Total biaya karyawan (pendapatan kotor + ditanggung perusahaan): ' + wpRp(o.prorata ? 9103333 : 9370000), 'caption', 'color/text/secondary', th, { parent: wrap, fillW: true });
  await txt('Penghasilan kena pajak bulan ini: ' + wpRp(o.prorata ? 8783333 : 9050000) + '. PPh 21 diisi manual di halaman Proses Payroll.', 'caption', 'color/text/secondary', th, { parent: wrap, fillW: true });
  return wrap;
}

/* =====================================================================
 * 1. Proses Payroll (daftar)
 * ===================================================================== */
const WP_ENTRIES = [
  { m: 'November 2026', st: 'draf', n: 48, net: 412350000, skip: 2, by: 'Dewi Lestari', at: '24 Nov 2026 09.15', note: 'Termasuk bonus akhir tahun' },
  { m: 'Oktober 2026', st: 'final', n: 47, net: 398720000, by: 'Dewi Lestari', at: '28 Okt 2026 10.02', fin: 'Dewi Lestari', finAt: '29 Okt 2026 14.30' },
  { m: 'September 2026', st: 'final', n: 47, net: 396180000, by: 'Dewi Lestari', at: '26 Sep 2026 09.40', fin: 'Dewi Lestari', finAt: '27 Sep 2026 16.10' },
  { m: 'Agustus 2026', st: 'batal', n: 45, net: 371900000, by: 'Dewi Lestari', at: '27 Agu 2026 11.00', cancel: 'Dewi Lestari', cancelAt: '28 Agu 2026 08.45' },
];
async function wpEntryCard(th, parent, e) {
  const c = card(th, parent, { dir: 'H', gap: 16, ay: 'CENTER', pad: 16 });
  if (e.st === 'batal') c.opacity = 0.7;
  const left = box('left', { dir: 'V', gap: 6, theme: th, parent: c }); left.layoutGrow = 1; left.layoutSizingHorizontal = 'FILL';
  const t = box('title', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: left });
  await txt(e.m, 'subtitle', 'color/text/primary', th, { parent: t });
  await chip(e.st === 'draf' ? 'Draf' : e.st === 'final' ? 'Final' : 'Dibatalkan', th, t, e.st === 'draf' ? { color: 'warning', variant: 'outlined' } : e.st === 'final' ? { color: 'success', variant: 'solid' } : { color: 'default', variant: 'outlined' });
  if (e.skip) await chip(`${e.skip} terlewat`, th, t, { color: 'warning', variant: 'tint', icon: 'warn' });
  const mt = box('meta', { dir: 'H', gap: 24, ay: 'CENTER', theme: th, parent: left });
  await txt(`${e.n} karyawan`, 'body2', 'color/text/secondary', th, { parent: mt });
  await txt('Total transfer ' + wpRp(e.net), 'body2-strong', 'color/text/primary', th, { parent: mt });
  let cap = `Dibuat oleh ${e.by} ${e.at}`;
  if (e.fin) cap += ` · difinalkan oleh ${e.fin} ${e.finAt}`;
  if (e.cancel) cap += ` · dibatalkan oleh ${e.cancel} ${e.cancelAt}`;
  await txt(cap, 'caption', 'color/text/secondary', th, { parent: left, fillW: true });
  if (e.note) await txt(e.note, 'caption', 'color/text/secondary', th, { parent: left, fillW: true });
  icon('chevron', 22, 'color/text/secondary', th, c);
  return c;
}
async function wpPayrollList(th, st) {
  const { f, main, act } = await wpPage(th, 'Proses Payroll', 1100, 'Proses Payroll', 'Hitung slip gaji semua karyawan untuk satu bulan, cek, finalkan, lalu unduh file transfer bank.');
  await button('Proses Bulan Baru', th, act, { icon: 'plus' });
  if (st === 'galat') await alertBox('error', 'Gagal memuat proses payroll. Coba lagi.', th, main);
  await wpCompanyCard(th, main);
  if (st === 'kosong') {
    const c = card(th, main, { gap: 8, pad: 24 });
    await txt('Belum ada proses payroll', 'subtitle', 'color/text/primary', th, { parent: c });
    await txt('Langkahnya tiap bulan:', 'body2', 'color/text/secondary', th, { parent: c });
    const steps = ['Buat. Klik "Proses Bulan Baru" lalu pilih bulan. Slip gaji semua karyawan langsung dihitung dari penetapan gaji, cuti tidak dibayar, lembur, dan gaji tambahan bulan itu.', 'Cek. Periksa slip gaji dan karyawan yang terlewat, isi PPh 21, lalu hitung ulang kalau ada data yang berubah.', 'Finalkan. Slip gaji dikunci sesuai hitungan terakhir.', 'Unduh file BCA. File Excel untuk transfer gaji sekaligus.'];
    for (const [i, s] of steps.entries()) await txt(`${i + 1}. ${s}`, 'body2', 'color/text/primary', th, { parent: c, fillW: true });
    gap(c, 4);
    await alertBox('info', 'Sebelum mulai, pastikan sudah ada komponen gaji, struktur gaji, dan penetapan gaji untuk tiap karyawan.', th, c);
  } else if (st !== 'galat') {
    const list = wpCol(th, main, { gap: 12 });
    for (const e of WP_ENTRIES) await wpEntryCard(th, list, e);
  }
  return { f, main };
}
wpMk('owner/payroll', 'Proses Payroll', async (th) => (await wpPayrollList(th, 'isi')).f);
wpMk('owner/payroll-kosong', 'Proses Payroll (kosong)', async (th) => (await wpPayrollList(th, 'kosong')).f);
wpMk('owner/payroll-galat', 'Proses Payroll (galat)', async (th) => (await wpPayrollList(th, 'galat')).f);
async function wpCreateDialog(th, withError) {
  const { f } = await wpPayrollList(th, 'isi');
  await dialog(th, f, { title: 'Proses Bulan Baru', w: 444, build: async (b) => {
    if (withError) await alertBox('error', 'Payroll November 2026 sudah ada untuk perusahaan ini.', th, b);
    await wpMonthField(th, b, 'Bulan', 'November 2026', { helper: 'Periode tanggal 1 sampai akhir November 2026' });
    await inputField('Catatan (opsional)', '', th, b, { multiline: 2 });
    await txt('Slip gaji semua karyawan langsung dihitung. Masih bisa dihitung ulang selama statusnya draf.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Buat & Hitung', v: 'contained' }] });
  return f;
}
wpMk('owner/payroll-buat', 'Dialog Proses Bulan Baru', (th) => wpCreateDialog(th, false));
wpMk('owner/payroll-buat-galat', 'Dialog Proses Bulan Baru (galat)', (th) => wpCreateDialog(th, true));

/* =====================================================================
 * 2. Detail proses payroll
 * ===================================================================== */
const WP_SLIP_COLS = [{ t: 'Karyawan', w: 'fill' }, { t: 'Hari dibayar', w: 260 }, { t: 'Pendapatan kotor', w: 170, align: 'right' }, { t: 'Potongan', w: 130, align: 'right' }, { t: 'Gaji bersih', w: 150, align: 'right' }];
const WP_SLIP_ROWS = [
  [{ t: 'Budi Santoso', sub: 'EMP-000003 · Teknologi Informasi' }, '30/30', wpRp(9050000), wpRp(390000), wpRp(8660000)],
  [{ t: 'Dewi Lestari', sub: 'EMP-000004 · SDM' }, '30/30', wpRp(16200000), wpRp(1150000), wpRp(15050000)],
  [{ t: 'Siti Rahmawati', sub: 'EMP-000005 · Keuangan' }, { t: '29/30', sub: 'cuti tidak dibayar 1 hari' }, wpRp(8150000), wpRp(420000), wpRp(7730000)],
  [{ t: 'Agus Wijaya', sub: 'EMP-000006 · Operasional' }, { t: '30/30', sub: 'lembur 8 jam' }, wpRp(7620000), wpRp(360000), wpRp(7260000)],
  [{ t: 'Rina Kartika', sub: 'EMP-000007 · Operasional' }, '30/30', wpRp(6900000), wpRp(330000), wpRp(6570000)],
  [{ t: 'Maya Anggraini', sub: 'EMP-000008 · Keuangan · belum ada rekening' }, '30/30', wpRp(7300000), wpRp(350000), wpRp(6950000)],
];
async function wpDetailPage(th, st, h) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Proses Payroll', h: h ?? 1500 });
  const draft = st === 'draft' || st === 'noslips', final = st === 'final', cancelled = st === 'cancelled';
  await button('Proses Payroll', th, main, { v: 'text', size: 'small', icon: 'back' });
  const hd = wpCol(th, main, { gap: 4 });
  const tr = box('title', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent: hd });
  await txt('Payroll November 2026', 'h5', 'color/text/primary', th, { parent: tr });
  await chip(draft ? 'Draf' : final ? 'Final' : 'Dibatalkan', th, tr, draft ? { color: 'warning', variant: 'outlined' } : final ? { color: 'success', variant: 'solid' } : { color: 'default', variant: 'outlined' });
  await txt(`${WP_CO} · 1 Nov 2026 – 30 Nov 2026`, 'body2', 'color/text/secondary', th, { parent: hd });
  await txt(draft ? 'Dihitung 5 menit lalu' : final ? 'Difinalkan oleh Dewi Lestari 29 Nov 2026 14.30' : 'Dibatalkan oleh Dewi Lestari 30 Nov 2026 08.45', 'caption', 'color/text/secondary', th, { parent: hd });
  await txt('Termasuk bonus akhir tahun', 'body2', 'color/text/secondary', th, { parent: hd });
  if (!cancelled) {
    const acts = box('actions', { dir: 'H', gap: 12, ay: 'CENTER', ax: 'MAX', theme: th, parent: main, fillW: true });
    if (draft) { await button('Hitung Ulang', th, acts, { v: 'outlined', icon: 'refresh' }); await button('Isi PPh 21', th, acts, { v: 'outlined', icon: 'money' }); }
    await button('Unduh File BCA', th, acts, { v: 'outlined', icon: 'download', disabled: st === 'noslips' });
    await button('Unduh Semua Slip (PDF)', th, acts, { v: 'outlined', icon: 'file', disabled: st === 'noslips' });
    if (draft) { await button('Finalkan', th, acts, { icon: 'lock', disabled: st === 'noslips' }); await button('Hapus Draf', th, acts, { v: 'text', color: 'error', icon: 'trash' }); }
    if (final) await button('Batalkan', th, acts, { v: 'outlined', color: 'error', icon: 'x' });
  } else await alertBox('info', 'Payroll ini sudah dibatalkan, jadi hanya bisa dilihat. Bulan November 2026 bisa diproses lagi dari halaman Proses Payroll.', th, main);
  const tiles = box('tiles', { dir: 'H', gap: 12, theme: th, parent: main, fillW: true });
  const tv = st === 'noslips' ? ['0', wpRp(0), wpRp(0), wpRp(0), wpRp(0)] : ['48', wpRp(455600000), wpRp(43250000), wpRp(18400000), wpRp(412350000)];
  for (const [i, l] of ['Karyawan', 'Total pendapatan kotor', 'Total potongan', 'Ditanggung perusahaan', 'Total transfer'].entries()) {
    const c = card(th, tiles, { pad: 14, gap: 4 }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
    if (i === 4) c.strokes = [pv(th, 'color/primary')];
    await txt(l, 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
    await txt(tv[i], i === 4 ? 'h6' : 'subtitle', i === 4 ? 'color/primary' : 'color/text/primary', th, { parent: c });
  }
  if (draft) await alertBox('warning', 'Perbaiki datanya, lalu klik Hitung Ulang.\n• Hendra Gunawan (EMP-000009): Belum punya penetapan gaji\n• Putri Handayani (EMP-000010): Struktur gaji tidak aktif', th, main, '2 karyawan tidak dapat slip gaji');
  if (draft && st !== 'noslips') await alertBox('info', '• Agus Wijaya (EMP-000006): Gaji dasar berubah lebih dari 20% dari bulan lalu', th, main, '1 slip gaji perlu dicek');
  const c = card(th, main, { pad: 0, clip: true });
  const hr = wpRow(th, c, { pad: 16, ax: 'SPACE_BETWEEN' });
  const hl = wpCol(th, hr, { gap: 2, fillW: false });
  await txt('Slip Gaji', 'subtitle', 'color/text/primary', th, { parent: hl });
  if (st !== 'noslips') await txt('1 karyawan belum punya nomor rekening', 'caption', 'color/warning', th, { parent: hl });
  await searchInput(th, hr, 'Cari nama, nomor, atau departemen', 340);
  wpDivider(th, c);
  if (st === 'noslips') {
    const eb = wpCol(th, c, { pad: [48, 16, 48, 16], ax: 'CENTER', ay: 'CENTER' });
    await txt('Belum ada slip gaji. Cek daftar karyawan yang terlewat di atas.', 'body', 'color/text/secondary', th, { parent: eb, align: 'CENTER' });
  } else if (st === 'cari') {
    await txt('Tidak ada slip gaji yang cocok.', 'body', 'color/text/secondary', th, { parent: c });
  } else {
    const t = wpFlat(await table(th, c, { cols: WP_SLIP_COLS, rows: WP_SLIP_ROWS, foot: false }));
    await wpTotalRow(th, t, WP_SLIP_COLS, ['Total (48)', null, wpRp(455600000), wpRp(43250000), wpRp(412350000)]);
  }
  return { f, main };
}
wpMk('owner/payroll-detail', 'Detail Payroll (draf)', async (th) => (await wpDetailPage(th, 'draft')).f);
wpMk('owner/payroll-detail-final', 'Detail Payroll (final)', async (th) => (await wpDetailPage(th, 'final')).f);
wpMk('owner/payroll-detail-batal', 'Detail Payroll (dibatalkan)', async (th) => (await wpDetailPage(th, 'cancelled')).f);
wpMk('owner/payroll-detail-kosong', 'Detail Payroll (belum ada slip)', async (th) => (await wpDetailPage(th, 'noslips', 1100)).f);
wpMk('owner/payroll-detail-galat', 'Detail Payroll (tidak ditemukan)', async (th) => {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Proses Payroll', h: 700 });
  await button('Proses Payroll', th, main, { v: 'text', size: 'small', icon: 'back' });
  await alertBox('error', 'Proses payroll tidak ditemukan.', th, main);
  return f;
});
/** Dialog slip karyawan (di atas detail). */
wpMk('owner/payroll-detail-slip', 'Dialog Slip Gaji Karyawan', async (th) => {
  const { f } = await wpDetailPage(th, 'draft', 2300);
  await dialog(th, f, { title: 'Slip Gaji Budi Santoso', w: 600, build: async (b) => {
    await txt('EMP-000003 · Staf IT · Teknologi Informasi', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    const c = card(th, b, { pad: 12, gap: 6 });
    await txt('Rekening transfer', 'label', 'color/text/secondary', th, { parent: c, upper: true });
    await txt('Bank BCA · 1234567890', 'body2', 'color/text/primary', th, { parent: c, fillW: true });
    await txt('a.n. Budi Santoso', 'body2', 'color/text/secondary', th, { parent: c });
    await wpSlipView(th, b);
  }, actions: [{ label: 'Tutup' }, { label: 'Unduh PDF', v: 'contained' }] });
  return f;
});
wpMk('owner/payroll-detail-slip-tanpa-rekening', 'Dialog Slip Gaji (tanpa rekening)', async (th) => {
  const { f } = await wpDetailPage(th, 'draft', 2300);
  await dialog(th, f, { title: 'Slip Gaji Maya Anggraini', w: 600, build: async (b) => {
    await txt('EMP-000008 · Staf Keuangan · Keuangan', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    const c = card(th, b, { pad: 12, gap: 8 });
    const r = wpRow(th, c, { ax: 'SPACE_BETWEEN' });
    await txt('Rekening transfer', 'label', 'color/text/secondary', th, { parent: r, upper: true });
    await chip('Belum ada nomor rekening', th, r, { color: 'warning', variant: 'tint', icon: 'warn' });
    await txt('Karyawan ini akan masuk sheet "Perlu dicek" di file BCA. Lengkapi nomor rekening di profil karyawan.', 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
    await wpSlipView(th, b);
  }, actions: [{ label: 'Tutup' }, { label: 'Unduh PDF', v: 'contained' }] });
  return f;
});
/** Dialog konfirmasi: finalkan / batalkan / hapus. */
async function wpConfirm(th, kind) {
  const { f } = await wpDetailPage(th, kind === 'cancel' ? 'final' : 'draft');
  const cfg = {
    submit: { title: 'Finalkan payroll November 2026?', ok: 'Finalkan & Kunci', color: 'primary' },
    cancel: { title: 'Batalkan payroll November 2026?', ok: 'Batalkan Payroll', color: 'error' },
    delete: { title: 'Hapus draf payroll?', ok: 'Hapus', color: 'error' },
  }[kind];
  await dialog(th, f, { title: cfg.title, w: 444, build: async (b) => {
    if (kind === 'submit') {
      await txt('Slip gaji akan dikunci sesuai hitungan terakhir (5 menit lalu) dan tidak bisa dihitung ulang lagi.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
      for (const [l, v, s] of [['Karyawan', '48'], ['Total pendapatan kotor', wpRp(455600000)], ['Total potongan', wpRp(43250000)], ['Total transfer', wpRp(412350000), true]]) {
        const r = wpRow(th, b, { ax: 'SPACE_BETWEEN' });
        await txt(l, 'body2', 'color/text/secondary', th, { parent: r });
        await txt(v, s ? 'body2-strong' : 'body2', 'color/text/primary', th, { parent: r });
      }
      await alertBox('warning', '2 karyawan terlewat dan tidak akan dapat slip gaji di payroll ini.', th, b);
    } else if (kind === 'cancel') await txt('Payroll ini dan semua slip gajinya akan dibatalkan. Setelah itu bulan November 2026 bisa diproses lagi. Pastikan transfer gajinya belum dikirim, atau sudah diurus.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
    else await txt('Draf ini dan semua slip gajinya akan dihapus permanen. Gaji tambahan (mis. PPh 21) yang sudah diisi tetap tersimpan.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Kembali' }, { label: cfg.ok, v: 'contained', color: cfg.color }] });
  return f;
}
wpMk('owner/payroll-detail-finalkan', 'Dialog Finalkan Payroll', (th) => wpConfirm(th, 'submit'));
wpMk('owner/payroll-detail-batalkan', 'Dialog Batalkan Payroll', (th) => wpConfirm(th, 'cancel'));
wpMk('owner/payroll-detail-hapus', 'Dialog Hapus Draf Payroll', (th) => wpConfirm(th, 'delete'));
/** Dialog Isi PPh 21. */
async function wpPphDialog(th, st) {
  const { f } = await wpDetailPage(th, 'draft', 1700);
  await dialog(th, f, { title: 'Isi PPh 21 · November 2026', w: 900, build: async (b) => {
    await txt('Nominal disimpan sebagai gaji tambahan bulan ini. Isi 0 atau kosongkan untuk menghapus. Slip gaji langsung dihitung ulang setelah disimpan.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    if (st === 'galat') await alertBox('error', 'Pilih komponen potongan untuk PPh 21 dulu.', th, b);
    if (st === 'kosong') { await alertBox('info', 'Belum ada komponen potongan yang aktif. Buat dulu komponen jenis Potongan (mis. "PPh 21") di Komponen Gaji.', th, b); return; }
    const r = wpRow(th, b, { gap: 12 });
    await inputField('Komponen potongan', 'PPh 21 (PPH)', th, r, { select: true });
    await inputField('Cari karyawan', '', th, r, { icon: 'search' });
    const t = box('pph table', { dir: 'V', theme: th, parent: b, fillW: true, stroke: 'color/border', radius: 10, clip: true });
    const hd = wpRow(th, t, { pad: [12, 16, 12, 16], fill: 'color/background', ax: 'SPACE_BETWEEN' });
    await txt('Karyawan', 'th', 'color/text/secondary', th, { parent: hd, upper: true });
    await txt('Nominal', 'th', 'color/text/secondary', th, { parent: hd, upper: true });
    const rows = [['Budi Santoso', 'EMP-000003', '150000', wpRp(150000)], ['Dewi Lestari', 'EMP-000004', '1000000', wpRp(1000000)], ['Siti Rahmawati', 'EMP-000005', '', ''], ['Hendra Gunawan', 'EMP-000009 · terlewat: Belum punya penetapan gaji', '', 'off']];
    for (const [n, s, v, h] of rows) {
      const rr = wpRow(th, t, { pad: [8, 16, 8, 16], ax: 'SPACE_BETWEEN', stroke: 'color/border' }); rr.strokeTopWeight = 1; rr.strokeLeftWeight = 0; rr.strokeRightWeight = 0; rr.strokeBottomWeight = 0;
      const l = wpCol(th, rr, { gap: 2, fillW: false }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL';
      const dis = h === 'off';
      await txt(n, 'body2-strong', dis ? 'color/text/disabled' : 'color/text/primary', th, { parent: l });
      await txt(s, 'caption', dis ? 'color/text/disabled' : 'color/text/secondary', th, { parent: l });
      await inputField('Nominal', v, th, rr, { w: 200, disabled: dis, helper: dis ? ' ' : (h || ' ') });
    }
  }, actions: st === 'kosong' ? [{ label: 'Batal' }, { label: 'Simpan & Hitung Ulang', v: 'contained', disabled: true }] : [{ label: 'Batal' }, { label: 'Simpan & Hitung Ulang', v: 'contained' }] });
  return f;
}
wpMk('owner/payroll-detail-pph', 'Dialog Isi PPh 21', (th) => wpPphDialog(th, 'isi'));
wpMk('owner/payroll-detail-pph-kosong', 'Dialog Isi PPh 21 (tanpa komponen potongan)', (th) => wpPphDialog(th, 'kosong'));
wpMk('owner/payroll-detail-pph-galat', 'Dialog Isi PPh 21 (galat)', (th) => wpPphDialog(th, 'galat'));

/* =====================================================================
 * 3. Laporan Payroll
 * ===================================================================== */
const WP_MONEY = (r) => [wpRp(r[0]), wpRp(r[1]), wpRp(r[2]), wpRp(r[3])];
async function wpReportPage(th, st) {
  const { f, main, act } = await wpPage(th, 'Laporan Payroll', 1300, 'Laporan Payroll', 'Rekap biaya gaji dari slip yang sudah final, per bulan, departemen, dan komponen.');
  await button('Export Excel', th, act, { icon: 'download', disabled: st === 'kosong' || st === 'galat' });
  const fc = card(th, main, { pad: 16, dir: 'H', gap: 12, ay: st === 'galat' ? 'MIN' : 'CENTER' });
  await wpMonthField(th, fc, 'Dari bulan', st === 'galat' ? 'November 2026' : 'Juli 2026', { w: 200 });
  await wpMonthField(th, fc, 'Sampai bulan', st === 'galat' ? 'Juli 2026' : 'November 2026', { w: 200 });
  await inputField('Perusahaan', 'Semua Perusahaan', th, fc, { w: 260, select: true });
  if (st === 'galat') { await alertBox('error', 'Bulan awal tidak boleh setelah bulan akhir.', th, main); return { f, main }; }
  if (st === 'kosong') {
    const c = card(th, main, { pad: 48, ax: 'CENTER', ay: 'CENTER' });
    await txt('Belum ada slip gaji final untuk Juli 2026 sampai November 2026. Laporan terisi setelah payroll bulan itu difinalkan.', 'body', 'color/text/secondary', th, { parent: c, align: 'CENTER' });
    return { f, main };
  }
  const sm = box('summary', { dir: 'H', gap: 12, theme: th, parent: main, fillW: true });
  for (const [l, v, h, strong] of [['Gaji Kotor', wpRp(2184500000), '235 slip · 48 karyawan'], ['Total Potongan', wpRp(207300000)], ['Ditanggung Perusahaan', wpRp(88400000), 'Di luar gaji, mis. BPJS bagian perusahaan'], ['Gaji Bersih Dibayar', wpRp(1977200000), 'Juli 2026 sampai November 2026', true]]) {
    const c = card(th, sm, { pad: 16, gap: 4 }); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
    if (strong) c.strokes = [pv(th, 'color/primary')];
    await txt(l, 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
    await txt(v, 'h6', strong ? 'color/primary' : 'color/text/primary', th, { parent: c });
    if (h) await txt(h, 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
  }
  const c = card(th, main, { pad: 0, clip: true });
  const view = st === 'departemen' ? 1 : st === 'komponen' ? 2 : 0;
  await tabs(['Per Bulan', 'Per Departemen', 'Per Komponen'], view, th, c);
  const money = [{ t: 'Slip', w: 80, align: 'right' }, { t: 'Gaji Kotor', w: 170, align: 'right' }, { t: 'Potongan', w: 150, align: 'right' }, { t: 'Ditanggung Perusahaan', w: 200, align: 'right' }, { t: 'Gaji Bersih', w: 170, align: 'right' }];
  let cols, rows, tot;
  if (view === 0) {
    cols = [{ t: 'Bulan', w: 'fill' }, ...money];
    rows = [['November 2026', '48', ...WP_MONEY([455600000, 43250000, 18400000, 412350000])], ['Oktober 2026', '47', ...WP_MONEY([446300000, 41100000, 18100000, 405200000])], ['September 2026', '47', ...WP_MONEY([441200000, 40800000, 17900000, 400400000])], ['Agustus 2026', '47', ...WP_MONEY([437800000, 40200000, 17800000, 397600000])], ['Juli 2026', '46', ...WP_MONEY([403600000, 41950000, 16200000, 361650000])]];
    tot = ['Total', '235', wpRp(2184500000), wpRp(207300000), wpRp(88400000), wpRp(1977200000)];
  } else if (view === 1) {
    cols = [{ t: 'Departemen', w: 'fill' }, ...money];
    rows = [['Teknologi Informasi', '60', ...WP_MONEY([612000000, 55400000, 24800000, 556600000])], ['Keuangan', '45', ...WP_MONEY([498500000, 47100000, 20100000, 451400000])], ['Operasional', '85', ...WP_MONEY([701000000, 68900000, 28800000, 632100000])], ['SDM', '40', ...WP_MONEY([373000000, 35900000, 14700000, 337100000])], [{ t: 'Tanpa departemen' }, '5', ...WP_MONEY([0, 0, 0, 0])]];
    rows[4] = ['Tanpa departemen', '5', ...WP_MONEY([0, 0, 0, 0])];
    tot = ['Total', '235', wpRp(2184500000), wpRp(207300000), wpRp(88400000), wpRp(1977200000)];
  } else {
    cols = [{ t: 'Komponen', w: 'fill' }, { t: 'Jenis', w: 200 }, { t: 'Slip', w: 100, align: 'right' }, { t: 'Total', w: 200, align: 'right' }];
    rows = [[{ t: 'Gaji Pokok', sub: 'GP' }, 'Pendapatan', '235', wpRp(1860000000)], [{ t: 'Tunjangan Makan', sub: 'TM' }, 'Pendapatan', '235', wpRp(129200000)], [{ t: 'Upah Dasar BPJS', sub: 'UB · tidak masuk total' }, 'Pendapatan', '235', wpRp(1860000000)], [{ t: 'BPJS Kesehatan (Karyawan)', sub: 'BPK' }, 'Potongan', '235', wpRp(18600000)], [{ t: 'PPh 21', sub: 'PPH' }, 'Potongan', '180', wpRp(95700000)], [{ t: 'BPJS Kesehatan (Perusahaan)', sub: 'BPP' }, 'Ditanggung Perusahaan', '235', wpRp(74400000)]];
  }
  const t = wpFlat(await table(th, c, { cols, rows, foot: false }));
  if (tot) await wpTotalRow(th, t, cols, tot);
  await txt('Departemen dan jabatan mengikuti data saat slip dibuat. Export Excel juga berisi detail per slip dengan semua komponen.', 'caption', 'color/text/secondary', th, { parent: main, fillW: true });
  return { f, main };
}
wpMk('owner/payroll-report', 'Laporan Payroll (per bulan)', async (th) => (await wpReportPage(th, 'bulan')).f);
wpMk('owner/payroll-report-departemen', 'Laporan Payroll (per departemen)', async (th) => (await wpReportPage(th, 'departemen')).f);
wpMk('owner/payroll-report-komponen', 'Laporan Payroll (per komponen)', async (th) => (await wpReportPage(th, 'komponen')).f);
wpMk('owner/payroll-report-kosong', 'Laporan Payroll (kosong)', async (th) => (await wpReportPage(th, 'kosong')).f);
wpMk('owner/payroll-report-galat', 'Laporan Payroll (rentang salah)', async (th) => (await wpReportPage(th, 'galat')).f);

/* =====================================================================
 * 4. Gaji Tambahan
 * ===================================================================== */
const WP_AS_COLS = [{ t: 'Karyawan', w: 'fill' }, { t: 'Komponen gaji', w: 190 }, { t: 'Nominal', w: 120, align: 'right' }, { t: 'Periode', w: 190 }, { t: 'Cara hitung', w: 110 }, { t: 'Catatan', w: 150 }, { t: 'Dibuat oleh', w: 110 }, { t: 'Aksi', w: 80, align: 'right' }];
const WP_AS_ROWS = [
  [{ t: 'Budi Santoso', sub: 'EMP-000003' }, { t: 'Bonus Kinerja', sub: 'BNS · Pendapatan' }, wpRp(2500000), 'Nov 2026', { chip: 'menambah', color: 'info' }, 'Bonus kinerja Q3', 'Dewi Lestari', { actions: ['edit', 'trash'] }],
  [{ t: 'Siti Rahmawati', sub: 'EMP-000005' }, { t: 'PPh 21', sub: 'PPH · Potongan' }, wpRp(150000), 'Nov 2026', { chip: 'menambah', color: 'info' }, 'PPh 21 manual', 'Dewi Lestari', { actions: ['edit', 'trash'] }],
  [{ t: 'Agus Wijaya', sub: 'EMP-000006' }, { t: 'Potongan Kasbon', sub: 'KSB · Potongan' }, wpRp(500000), 'Okt 2026 – Des 2026 · berulang', { chip: 'menambah', color: 'info' }, 'Cicilan kasbon 1/3', 'Dewi Lestari', { actions: ['edit', 'trash'] }],
  [{ t: 'Rina Kartika', sub: 'EMP-000007' }, { t: 'Insentif Penjualan', sub: 'INS · Pendapatan' }, wpRp(1750000), 'Nov 2026', { chip: 'mengganti', color: 'warning' }, 'Target tercapai', 'Dewi Lestari', { actions: ['edit', 'trash'] }],
  [{ t: 'Eko Prasetyo', sub: 'EMP-000011' }, { t: 'Rapel Gaji', sub: 'RPL · Pendapatan' }, wpRp(3200000), 'Nov 2026', { chip: 'menambah', color: 'info' }, 'Rapel Sep–Okt', 'Dewi Lestari', { actions: ['edit', 'trash'] }],
];
async function wpAdditionalPage(th, st, h) {
  const { f, main, act } = await wpPage(th, 'Gaji Tambahan', h ?? 1200, 'Gaji Tambahan', 'Bonus, insentif, rapel, potongan kasbon atau pinjaman, PPh 21 manual, dan sejenisnya. Satu komponen untuk satu karyawan, di satu bulan atau beberapa bulan berturut-turut.');
  await button('Unduh Template', th, act, { v: 'outlined', icon: 'file' });
  await button('Unggah Excel', th, act, { v: 'outlined', icon: 'upload' });
  await button('Tambah Gaji Tambahan', th, act, { icon: 'plus' });
  await alertBox('info', 'Perubahan masuk ke payroll yang masih draf setelah dihitung ulang. Slip gaji yang sudah final tidak berubah.', th, main);
  if (st === 'galat') await alertBox('error', 'Gagal memuat gaji tambahan. Coba lagi.', th, main);
  const fc = card(th, main, { pad: 16, dir: 'H', gap: 12, ay: 'CENTER' });
  await inputField('Perusahaan', WP_CO, th, fc, { w: 260, select: true });
  await wpMonthField(th, fc, 'Bulan', 'November 2026', { w: 200 });
  const sw = box('sw', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: fc }); toggle(false, th, sw); await txt('Tampilkan semua bulan', 'body2', 'color/text/primary', th, { parent: sw });
  const sp = box('sp', { dir: 'H', theme: th, parent: fc }); sp.layoutGrow = 1; sp.layoutSizingHorizontal = 'FILL';
  await inputField('Cari nama atau nomor karyawan', '', th, fc, { w: 280, icon: 'search' });
  const c = card(th, main, { pad: 0, clip: true });
  const tr = wpRow(th, c, { gap: 12, pad: [0, 16, 0, 0] });
  await tabs(['Semua', 'Pendapatan', 'Potongan'], 0, th, tr);
  await txt('Pendapatan ' + wpRp(7450000), 'caption', 'color/text/secondary', th, { parent: tr });
  await txt('Potongan ' + wpRp(650000), 'caption', 'color/text/secondary', th, { parent: tr });
  if (st === 'kosong') {
    const eb = wpCol(th, c, { pad: [48, 16, 48, 16], ax: 'CENTER', ay: 'CENTER' });
    await txt('Belum ada gaji tambahan yang berlaku di Nov 2026.', 'body', 'color/text/secondary', th, { parent: eb, align: 'CENTER' });
  } else if (st === 'cari') {
    const eb = wpCol(th, c, { pad: [48, 16, 48, 16], ax: 'CENTER', ay: 'CENTER' });
    await txt('Tidak ada data yang cocok dengan filter.', 'body', 'color/text/secondary', th, { parent: eb, align: 'CENTER' });
  } else wpFlat(await table(th, c, { cols: WP_AS_COLS, rows: WP_AS_ROWS, foot: false }));
  return { f, main };
}
wpMk('owner/additional-salaries', 'Gaji Tambahan', async (th) => (await wpAdditionalPage(th, 'isi')).f);
wpMk('owner/additional-salaries-kosong', 'Gaji Tambahan (kosong)', async (th) => (await wpAdditionalPage(th, 'kosong')).f);
wpMk('owner/additional-salaries-tidak-cocok', 'Gaji Tambahan (filter tidak cocok)', async (th) => (await wpAdditionalPage(th, 'cari')).f);
wpMk('owner/additional-salaries-galat', 'Gaji Tambahan (galat)', async (th) => (await wpAdditionalPage(th, 'galat')).f);
/** Form tambah/ubah gaji tambahan. mode: tambah | ubah | berulang | galat */
async function wpAdditionalForm(th, mode) {
  const { f } = await wpAdditionalPage(th, 'isi', 1400);
  const edit = mode === 'ubah', rec = mode === 'berulang';
  await dialog(th, f, { title: edit ? 'Ubah Gaji Tambahan' : 'Tambah Gaji Tambahan', w: 600, build: async (b) => {
    if (mode === 'galat') await alertBox('error', 'Pilih karyawan dulu.', th, b);
    if (edit) await inputField('Karyawan', 'Budi Santoso (EMP-000003)', th, b, { disabled: true, helper: 'Karyawan tidak bisa diganti. Kalau salah, hapus lalu buat baru.' });
    else await inputField('Karyawan', mode === 'galat' ? '' : 'Agus Wijaya (EMP-000006)', th, b, { select: true, required: true, error: mode === 'galat' });
    await inputField('Komponen gaji', edit ? 'Bonus Kinerja (BNS)' : 'Potongan Kasbon (KSB)', th, b, { select: true, required: true });
    await inputField('Nominal', edit ? '2500000' : '500000', th, b, { required: true, helper: (edit ? wpRp(2500000) : wpRp(500000)) + ' · dibayar penuh, tidak dihitung sesuai hari dibayar' });
    await wpSwitch(th, b, rec, 'Berlaku beberapa bulan');
    const r = wpRow(th, b, { gap: 16, ay: 'MIN' });
    await wpMonthField(th, r, rec ? 'Mulai bulan' : 'Bulan', 'November 2026');
    if (rec) await wpMonthField(th, r, 'Sampai bulan', 'Januari 2027');
    await wpSwitch(th, b, mode === 'ubah', 'Ganti nilai di struktur gaji', edit ? 'Kalau komponen ini ada di struktur gaji karyawan, nilainya bulan itu diganti dengan nominal ini.' : 'Kalau komponen ini ada di struktur gaji karyawan, nominal ini ditambahkan ke nilainya.');
    await inputField('Catatan', edit ? 'Bonus kinerja Q3' : '', th, b, { multiline: 2 });
    if (!edit) await txt('Mis. cicilan kasbon 1/6, bonus kinerja Q3', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained' }] });
  return f;
}
wpMk('owner/additional-salaries-tambah', 'Dialog Tambah Gaji Tambahan', (th) => wpAdditionalForm(th, 'tambah'));
wpMk('owner/additional-salaries-tambah-berulang', 'Dialog Tambah Gaji Tambahan (beberapa bulan)', (th) => wpAdditionalForm(th, 'berulang'));
wpMk('owner/additional-salaries-tambah-galat', 'Dialog Tambah Gaji Tambahan (galat)', (th) => wpAdditionalForm(th, 'galat'));
wpMk('owner/additional-salaries-ubah', 'Dialog Ubah Gaji Tambahan', (th) => wpAdditionalForm(th, 'ubah'));
wpMk('owner/additional-salaries-hapus', 'Dialog Hapus Gaji Tambahan', async (th) => {
  const { f } = await wpAdditionalPage(th, 'isi', 1100);
  await dialog(th, f, { title: 'Hapus gaji tambahan?', w: 444, build: async (b) => {
    await txt('Potongan Kasbon ' + wpRp(500000) + ' untuk Agus Wijaya (Okt 2026 – Des 2026 · berulang) akan dihapus. Payroll yang masih draf perlu dihitung ulang. Slip gaji yang sudah final tidak berubah.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }] });
  return f;
});
/** Dialog impor Excel. st: awal | file | galat | pesan | tanpa-perubahan */
async function wpImportDialog(th, st) {
  const { f } = await wpAdditionalPage(th, 'isi', 1700);
  const preview = st === 'file';
  await dialog(th, f, { title: 'Unggah Gaji Tambahan dari Excel', w: 900, build: async (b) => {
    await txt(`${WP_CO} · November 2026`, 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    await txt('Satu sel berisi nominal satu komponen untuk satu karyawan di bulan ini.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
    await txt('• Sel kosong tidak mengubah apa-apa.\n• Angka menggantikan nilai bulan ini, bukan menambah.\n• Isi 0 untuk menghapus gaji tambahan komponen itu.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    const r = box('tpl', { dir: 'H', theme: th, parent: b }); await button('Unduh Template November 2026', th, r, { v: 'outlined', size: 'small', icon: 'file' });
    await txt('Template berisi karyawan aktif dan nilai gaji tambahan yang sudah ada bulan ini, jadi tinggal diubah.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
    wpDivider(th, b);
    await button(st === 'awal' || st === 'pesan' ? 'Pilih File Excel' : 'gaji-tambahan-2026-11.xlsx', th, b, { v: 'outlined', icon: 'upload', fillW: true });
    if (st === 'pesan') await alertBox('error', 'File gagal dicek. Coba lagi.', th, b);
    if (st === 'galat') {
      await alertBox('error', 'Baris 4 · Karyawan = "EMP-009999": Nomor karyawan tidak ditemukan\nBaris 7 · Bonus Kinerja = "dua juta": Nominal harus berupa angka\nBaris 12 · Potongan Kasbon = "-500000": Nominal tidak boleh negatif\ndan 9 lainnya.', th, b, '12 isian bermasalah, belum ada yang tersimpan');
    }
    if (st === 'tanpa') await alertBox('info', '0 baru · 0 diubah · 0 dihapus · 14 isian sama dengan yang sudah ada', th, b, 'Tidak ada perubahan');
    if (preview) {
      await alertBox('success', '3 baru · 1 diubah · 1 dihapus · 6 isian sama dengan yang sudah ada\nKomponen: Bonus Kinerja, Potongan Kasbon, PPh 21', th, b, '5 perubahan siap disimpan');
      const cols = [{ t: 'Karyawan', w: 'fill' }, { t: 'Komponen', w: 200 }, { t: 'Sebelumnya', w: 130, align: 'right' }, { t: 'Menjadi', w: 130, align: 'right' }, { t: '', w: 100 }];
      await table(th, b, { cols, foot: false, rowH: 56, rows: [
        [{ t: 'Budi Santoso', sub: 'EMP-000003 · baris 2' }, { t: 'Bonus Kinerja', sub: 'BNS' }, '–', wpRp(2500000), { chip: 'Baru', color: 'success', variant: 'outlined' }],
        [{ t: 'Siti Rahmawati', sub: 'EMP-000005 · baris 3' }, { t: 'PPh 21', sub: 'PPH' }, '–', wpRp(150000), { chip: 'Baru', color: 'success', variant: 'outlined' }],
        [{ t: 'Rina Kartika', sub: 'EMP-000007 · baris 5' }, { t: 'Bonus Kinerja', sub: 'BNS' }, wpRp(1000000), wpRp(1750000), { chip: 'Diubah', color: 'warning', variant: 'outlined' }],
        [{ t: 'Agus Wijaya', sub: 'EMP-000006 · baris 6' }, { t: 'Potongan Kasbon', sub: 'KSB' }, wpRp(500000), '–', { chip: 'Dihapus', color: 'error', variant: 'outlined' }]] });
    }
  }, actions: [{ label: 'Batal' }, { label: preview ? 'Simpan 5 Perubahan' : 'Simpan', v: 'contained', disabled: !preview }] });
  return f;
}
wpMk('owner/additional-salaries-impor', 'Dialog Impor Excel (awal)', (th) => wpImportDialog(th, 'awal'));
wpMk('owner/additional-salaries-impor-pratinjau', 'Dialog Impor Excel (pratinjau perubahan)', (th) => wpImportDialog(th, 'file'));
wpMk('owner/additional-salaries-impor-galat', 'Dialog Impor Excel (galat baris)', (th) => wpImportDialog(th, 'galat'));
wpMk('owner/additional-salaries-impor-pesan', 'Dialog Impor Excel (galat umum)', (th) => wpImportDialog(th, 'pesan'));
wpMk('owner/additional-salaries-impor-tanpa-perubahan', 'Dialog Impor Excel (tanpa perubahan)', (th) => wpImportDialog(th, 'tanpa'));

/* =====================================================================
 * 5. Penetapan Gaji
 * ===================================================================== */
const WP_SA_COLS = [{ t: 'Karyawan', w: 'fill' }, { t: 'Departemen', w: 160 }, { t: 'Struktur gaji', w: 170 }, { t: 'Gaji dasar', w: 130, align: 'right' }, { t: 'Gaji variabel', w: 120, align: 'right' }, { t: 'Berlaku sejak', w: 200 }, { t: '', w: 110, align: 'right' }];
const WP_SA_ROWS = [
  [{ t: 'Budi Santoso', sub: 'EMP-000003' }, 'Teknologi Informasi', 'Staf Tetap', wpRp(9500000), wpRp(500000), { t: '1 Jan 2026', sub: 'naik mulai 2027-01-01' }, '2 riwayat'],
  [{ t: 'Dewi Lestari', sub: 'EMP-000004' }, 'SDM', 'Manajer', wpRp(15000000), wpRp(0), '1 Mar 2025', '1 riwayat'],
  [{ t: 'Siti Rahmawati', sub: 'EMP-000005' }, 'Keuangan', 'Staf Tetap', wpRp(8000000), wpRp(0), '1 Jul 2025', '3 riwayat'],
  [{ t: 'Agus Wijaya', sub: 'EMP-000006' }, 'Operasional', { chip: 'Belum ditetapkan', color: 'warning', variant: 'solid' }, '', '', '', { chip: 'Tetapkan', color: 'primary', variant: 'solid' }],
  [{ t: 'Rina Kartika', sub: 'EMP-000007' }, 'Operasional', 'Staf Operasional', wpRp(6500000), wpRp(250000), '1 Sep 2026', '1 riwayat'],
];
async function wpAssignPage(th, st, h) {
  const { f, main, act } = await wpPage(th, 'Penetapan Gaji', h ?? 1100, 'Penetapan Gaji', 'Struktur gaji dan gaji dasar tiap karyawan. Untuk kenaikan gaji, buat penetapan baru dengan tanggal berlaku yang lebih baru.');
  const noStruct = st === 'tanpa-struktur';
  await button('Tetapkan Sekaligus', th, act, { v: 'outlined', icon: 'users', disabled: noStruct });
  await button('Tetapkan Gaji', th, act, { icon: 'plus', disabled: noStruct });
  if (st === 'galat') await alertBox('error', 'Gagal memuat penetapan gaji. Coba lagi.', th, main);
  const fc = card(th, main, { pad: 16, dir: 'H', gap: 12, ay: 'CENTER' });
  await inputField('Perusahaan', WP_CO, th, fc, { w: 240, select: true });
  await inputField('Cari nama atau nomor karyawan', '', th, fc, { w: 260, icon: 'search' });
  await inputField('Departemen', 'Semua Departemen', th, fc, { w: 220, select: true });
  const sw = box('sw', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: fc }); toggle(false, th, sw); await txt('Hanya yang belum ditetapkan (1)', 'body2', 'color/text/primary', th, { parent: sw });
  if (noStruct) await alertBox('info', 'Belum ada struktur gaji yang aktif di perusahaan ini. Buat struktur gaji dulu sebelum menetapkan gaji.', th, main);
  if (st === 'kosong') { const c = card(th, main, { pad: 48, ax: 'CENTER', ay: 'CENTER' }); await txt('Belum ada karyawan aktif di perusahaan ini.', 'body', 'color/text/secondary', th, { parent: c, align: 'CENTER' }); }
  else if (st === 'cari') { const c = card(th, main, { pad: 48, ax: 'CENTER', ay: 'CENTER' }); await txt('Tidak ada karyawan yang cocok.', 'body', 'color/text/secondary', th, { parent: c, align: 'CENTER' }); }
  else await table(th, main, { cols: WP_SA_COLS, rows: WP_SA_ROWS, foot: false });
  return { f, main };
}
wpMk('owner/salary-assignments', 'Penetapan Gaji', async (th) => (await wpAssignPage(th, 'isi')).f);
wpMk('owner/salary-assignments-kosong', 'Penetapan Gaji (tanpa karyawan)', async (th) => (await wpAssignPage(th, 'kosong')).f);
wpMk('owner/salary-assignments-tidak-cocok', 'Penetapan Gaji (filter tidak cocok)', async (th) => (await wpAssignPage(th, 'cari')).f);
wpMk('owner/salary-assignments-tanpa-struktur', 'Penetapan Gaji (belum ada struktur)', async (th) => (await wpAssignPage(th, 'tanpa-struktur')).f);
wpMk('owner/salary-assignments-galat', 'Penetapan Gaji (galat)', async (th) => (await wpAssignPage(th, 'galat')).f);
/** Dialog riwayat karyawan (+ pratinjau slip). st: riwayat | pratinjau | kosong | galat */
async function wpAssignDetail(th, st) {
  const { f } = await wpAssignPage(th, 'isi', st === 'pratinjau' ? 2700 : 1500);
  await dialog(th, f, { title: 'Budi Santoso', w: 900, build: async (b) => {
    await txt('EMP-000003 · Teknologi Informasi', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    const hr = wpRow(th, b, { ax: 'SPACE_BETWEEN' });
    await txt('Riwayat penetapan gaji', 'subtitle', 'color/text/primary', th, { parent: hr });
    await button('Tambah Penetapan Baru', th, hr, { v: 'text', size: 'small', icon: 'plus' });
    if (st === 'kosong') await alertBox('warning', 'Karyawan ini belum punya penetapan gaji.', th, b);
    else await table(th, b, { foot: false, rowH: 60, cols: [{ t: 'Berlaku sejak', w: 170 }, { t: 'Struktur gaji', w: 'fill' }, { t: 'Gaji dasar', w: 130, align: 'right' }, { t: 'Gaji variabel', w: 130, align: 'right' }, { t: 'Dibuat oleh', w: 150 }, { t: '', w: 60, align: 'right' }], rows: [
      [{ t: '1 Jan 2027', sub: 'Akan datang' }, { t: 'Staf Tetap', sub: 'Kenaikan tahunan 2027' }, wpRp(10500000), wpRp(500000), { t: 'Dewi Lestari', sub: '20 Nov 2026' }, { actions: ['trash'] }],
      [{ t: '1 Jan 2026', sub: 'Berlaku' }, { t: 'Staf Tetap' }, wpRp(9500000), wpRp(500000), { t: 'Dewi Lestari', sub: '2 Jan 2026' }, { actions: ['trash'] }],
      [{ t: '1 Mar 2025' }, { t: 'Staf Kontrak', sub: 'Gaji awal' }, wpRp(8000000), wpRp(0), { t: 'Dewi Lestari', sub: '28 Feb 2025' }, { actions: ['trash'] }]] });
    wpDivider(th, b);
    await txt('Pratinjau slip gaji', 'subtitle', 'color/text/primary', th, { parent: b });
    const r = wpRow(th, b, { gap: 12, ay: 'MIN' });
    await wpMonthField(th, r, 'Bulan', 'November 2026');
    await inputField('Hari cuti tidak dibayar', '0', th, r, {});
    await button('Pratinjau', th, r, { v: 'outlined', icon: 'money' });
    if (st === 'galat') await alertBox('error', 'Gagal membuat pratinjau slip gaji. Coba lagi.', th, b);
    if (st === 'pratinjau') { const c = card(th, b, { pad: 16 }); await wpSlipView(th, c, { wide: true }); }
  }, actions: [{ label: 'Tutup' }] });
  return f;
}
wpMk('owner/salary-assignments-riwayat', 'Dialog Riwayat Penetapan Gaji', (th) => wpAssignDetail(th, 'riwayat'));
wpMk('owner/salary-assignments-pratinjau', 'Dialog Riwayat + Pratinjau Slip', (th) => wpAssignDetail(th, 'pratinjau'));
wpMk('owner/salary-assignments-pratinjau-galat', 'Dialog Riwayat (pratinjau galat)', (th) => wpAssignDetail(th, 'galat'));
wpMk('owner/salary-assignments-riwayat-kosong', 'Dialog Riwayat (belum ada penetapan)', (th) => wpAssignDetail(th, 'kosong'));
wpMk('owner/salary-assignments-hapus', 'Dialog Hapus Penetapan Gaji', async (th) => {
  const { f } = await wpAssignPage(th, 'isi', 1100);
  await dialog(th, f, { title: 'Hapus penetapan gaji?', w: 444, build: async (b) => {
    await txt('Penetapan Staf Tetap sejak 1 Jan 2027 dengan gaji dasar ' + wpRp(10500000) + ' akan dihapus. Bulan-bulan itu akan pakai penetapan sebelumnya (kalau ada).', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }] });
  return f;
});
async function wpAssignSingle(th, galat) {
  const { f } = await wpAssignPage(th, 'isi', 1100);
  await dialog(th, f, { title: 'Tetapkan Gaji', w: 600, build: async (b) => {
    if (galat) await alertBox('error', 'Pilih karyawan dan struktur gaji dulu.', th, b);
    await inputField('Karyawan', galat ? '' : 'Rina Kartika (EMP-000007)', th, b, { select: true, required: true, error: galat, helper: galat ? undefined : 'Saat ini: Staf Operasional · ' + wpRp(6500000) + ' sejak 1 Sep 2026' });
    await inputField('Struktur gaji', galat ? '' : 'Staf Operasional', th, b, { select: true, required: true });
    await inputField('Berlaku sejak', '01/01/2027', th, b, { required: true, endIcon: 'calendar' });
    const r = wpRow(th, b, { gap: 16, ay: 'MIN' });
    await inputField('Gaji dasar', galat ? '' : '7000000', th, r, { required: true, helper: galat ? ' ' : wpRp(7000000) });
    await inputField('Gaji variabel (opsional)', '250000', th, r, { helper: wpRp(250000) });
    await inputField('Catatan', '', th, b, { multiline: 2 });
    await txt('Mis. kenaikan tahunan 2027', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained' }] });
  return f;
}
wpMk('owner/salary-assignments-tetapkan', 'Dialog Tetapkan Gaji', (th) => wpAssignSingle(th, false));
wpMk('owner/salary-assignments-tetapkan-galat', 'Dialog Tetapkan Gaji (galat)', (th) => wpAssignSingle(th, true));
async function wpAssignBulk(th, galat) {
  const { f } = await wpAssignPage(th, 'isi', 1500);
  await dialog(th, f, { title: 'Tetapkan Gaji Sekaligus', w: 900, build: async (b) => {
    await txt('Pakai satu struktur gaji dan tanggal berlaku untuk banyak karyawan sekaligus. Kalau ada yang gagal, tidak ada yang tersimpan.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    if (galat) await alertBox('error', 'Gaji dasar belum diisi untuk 2 karyawan (Agus Wijaya, Maya Anggraini).', th, b);
    const r = wpRow(th, b, { gap: 16, ay: 'MIN' });
    await inputField('Struktur gaji', 'Staf Operasional', th, r, { select: true, required: true });
    await inputField('Berlaku sejak', '01/01/2027', th, r, { required: true, endIcon: 'calendar' });
    await inputField('Catatan', 'Penyesuaian UMK 2027', th, b, {});
    wpDivider(th, b);
    const r2 = wpRow(th, b, { gap: 12 });
    await inputField('Departemen', 'Operasional', th, r2, { select: true });
    await inputField('Cari nama atau nomor', '', th, r2, { icon: 'search' });
    const r3 = wpRow(th, b, { gap: 12, ay: 'MIN' });
    const l = box('l', { dir: 'H', ay: 'CENTER', theme: th, parent: r3 }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL'; l.counterAxisSizingMode = 'FIXED'; l.resize(100, 56); l.layoutSizingHorizontal = 'FILL';
    await txt('2 karyawan dipilih', 'body2-strong', 'color/text/primary', th, { parent: l });
    await inputField('Samakan gaji dasar untuk semua yang dipilih', '7000000', th, r3, { w: 360, helper: wpRp(7000000) });
    await button('Samakan', th, r3, { v: 'outlined' });
    const t = box('bulk', { dir: 'V', theme: th, parent: b, fillW: true, stroke: 'color/border', radius: 10, clip: true });
    const hd = wpRow(th, t, { gap: 10, pad: [12, 16, 12, 16], fill: 'color/background' });
    checkbox(true, th, hd);
    const hn = await txt('Karyawan', 'th', 'color/text/secondary', th, { parent: hd, upper: true }); hn.layoutGrow = 1;
    const hs = await txt('Saat ini', 'th', 'color/text/secondary', th, { parent: hd, upper: true }); hs.resize(220, hs.height); hs.textAutoResize = 'HEIGHT';
    const hb = await txt('Gaji dasar baru', 'th', 'color/text/secondary', th, { parent: hd, upper: true }); hb.resize(200, hb.height); hb.textAutoResize = 'HEIGHT';
    const rows = [[true, 'Agus Wijaya', 'EMP-000006', 'warn', galat ? '' : '7000000'], [true, 'Rina Kartika', 'EMP-000007', 'Staf Operasional · ' + wpRp(6500000), '7000000'], [false, 'Eko Prasetyo', 'EMP-000011', 'Staf Operasional · ' + wpRp(6800000), '']];
    for (const [ck, n, num, cur, v] of rows) {
      const rr = wpRow(th, t, { gap: 10, pad: [8, 16, 8, 16], stroke: 'color/border' }); rr.strokeTopWeight = 1; rr.strokeLeftWeight = 0; rr.strokeRightWeight = 0; rr.strokeBottomWeight = 0;
      checkbox(ck, th, rr);
      const nc = box('n', { dir: 'V', theme: th, parent: rr }); nc.layoutGrow = 1; nc.layoutSizingHorizontal = 'FILL';
      await txt(n, 'body2-strong', 'color/text/primary', th, { parent: nc }); await txt(num, 'caption', 'color/text/secondary', th, { parent: nc });
      const cc = box('cur', { dir: 'H', ay: 'CENTER', theme: th, parent: rr }); cc.counterAxisSizingMode = 'AUTO'; cc.primaryAxisSizingMode = 'FIXED'; cc.resize(220, 20);
      if (cur === 'warn') await chip('Belum ditetapkan', th, cc, { color: 'warning', variant: 'solid' }); else await txt(cur, 'body2', 'color/text/primary', th, { parent: cc });
      await inputField('Gaji dasar', v, th, rr, { w: 200, disabled: !ck, error: galat && ck && v === '', helper: v ? wpRp(Number(v)) : ' ' });
    }
  }, actions: [{ label: 'Batal' }, { label: 'Simpan 2 Penetapan', v: 'contained' }] });
  return f;
}
wpMk('owner/salary-assignments-sekaligus', 'Dialog Tetapkan Gaji Sekaligus', (th) => wpAssignBulk(th, false));
wpMk('owner/salary-assignments-sekaligus-galat', 'Dialog Tetapkan Gaji Sekaligus (galat)', (th) => wpAssignBulk(th, true));

/* =====================================================================
 * 6. Struktur Gaji
 * ===================================================================== */
const WP_STRUCTS = [
  { n: 'Staf Tetap', on: true, note: 'Untuk karyawan tetap kantor pusat', e: 4, d: 3, c: 1, k: 38 },
  { n: 'Staf Kontrak', on: true, note: '', e: 3, d: 2, c: 0, k: 9 },
  { n: 'Struktur Lama 2024', on: false, note: 'Tidak dipakai lagi', e: 3, d: 2, c: 1, k: 0 },
];
async function wpStructPage(th, st, h) {
  const { f, main, act } = await wpPage(th, 'Struktur Gaji', h ?? 1000, 'Struktur Gaji', 'Kumpulan komponen pendapatan dan potongan untuk menghitung slip gaji karyawan.');
  await button('Buat Struktur Gaji', th, act, { icon: 'plus' });
  if (st === 'galat') await alertBox('error', 'Gagal memuat struktur gaji. Coba lagi.', th, main);
  if (st === 'tanpa-perusahaan') await alertBox('info', 'Tambahkan perusahaan dulu sebelum membuat struktur gaji.', th, main);
  const fc = card(th, main, { pad: 16 }); await inputField('Perusahaan', st === 'tanpa-perusahaan' ? '' : WP_CO, th, fc, { w: 360, select: true });
  if (st === 'tanpa-komponen') await alertBox('warning', 'Perusahaan ini belum punya komponen gaji. Buat komponen gaji dulu. [Buka]', th, main);
  if (st === 'kosong' || st === 'tanpa-komponen') {
    const c = card(th, main, { pad: 40, gap: 8, ax: 'CENTER', ay: 'CENTER' });
    icon('plans', 48, 'color/text/disabled', th, c);
    await txt('Belum ada struktur gaji', 'subtitle', 'color/text/primary', th, { parent: c });
    await txt('Struktur gaji adalah daftar komponen (gaji pokok, tunjangan, potongan, iuran BPJS, dll.) untuk sekelompok karyawan. Hubungkan karyawan ke struktur gaji lewat penetapan gaji, lalu slip gaji bulanan dihitung dari situ.', 'body2', 'color/text/secondary', th, { parent: c, w: 520, align: 'CENTER' });
    await button('Buat Struktur Gaji', th, c, { icon: 'plus' });
  } else if (st !== 'tanpa-perusahaan') {
    const list = wpCol(th, main, { gap: 12 });
    for (const s of WP_STRUCTS) {
      const c = card(th, list, { dir: 'H', gap: 12, ay: 'CENTER', pad: 16 });
      const l = box('l', { dir: 'V', gap: 4, theme: th, parent: c }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL';
      const t = box('t', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: l });
      await txt(s.n, 'body2-strong', 'color/text/primary', th, { parent: t });
      await chip(s.on ? 'Aktif' : 'Nonaktif', th, t, s.on ? { color: 'success', variant: 'solid' } : { color: 'default', variant: 'outlined' });
      if (s.note) await txt(s.note, 'body2', 'color/text/secondary', th, { parent: l, fillW: true });
      await txt(`${s.e} pendapatan · ${s.d} potongan${s.c ? ` · ${s.c} ditanggung perusahaan` : ''} · dipakai ${s.k} karyawan`, 'caption', 'color/text/secondary', th, { parent: l, fillW: true });
      await button('Ubah', th, c, { v: 'text', size: 'small', icon: 'edit' });
      await button('Pratinjau', th, c, { v: 'text', size: 'small', icon: 'eye' });
      await button('Hapus', th, c, { v: 'text', size: 'small', color: 'error', icon: 'trash' });
    }
  }
  return { f, main };
}
wpMk('owner/salary-structures', 'Struktur Gaji', async (th) => (await wpStructPage(th, 'isi')).f);
wpMk('owner/salary-structures-kosong', 'Struktur Gaji (kosong)', async (th) => (await wpStructPage(th, 'kosong')).f);
wpMk('owner/salary-structures-tanpa-komponen', 'Struktur Gaji (belum ada komponen)', async (th) => (await wpStructPage(th, 'tanpa-komponen')).f);
wpMk('owner/salary-structures-tanpa-perusahaan', 'Struktur Gaji (belum ada perusahaan)', async (th) => (await wpStructPage(th, 'tanpa-perusahaan', 700)).f);
wpMk('owner/salary-structures-galat', 'Struktur Gaji (galat)', async (th) => (await wpStructPage(th, 'galat')).f);
/** Satu kartu komponen di editor struktur. */
async function wpStructRow(th, parent, r) {
  const c = card(th, parent, { pad: 10, gap: 6, radius: 8 });
  const top = wpRow(th, c, { ay: 'MIN', gap: 8 });
  const l = box('l', { dir: 'V', gap: 2, theme: th, parent: top }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL';
  const t = box('t', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: l });
  await txt(r.n, 'body2-strong', 'color/text/primary', th, { parent: t });
  await txt(r.abbr, 'caption', 'color/text/secondary', th, { parent: t });
  if (r.off) await chip('komponen nonaktif', th, t, { color: 'warning', variant: 'outlined' });
  if (r.ov) await chip('diatur khusus', th, t, { color: 'primary', variant: 'outlined' });
  await txt(r.calc, 'caption', 'color/text/secondary', th, { parent: l, fillW: true });
  const ab = box('arrows', { dir: 'H', theme: th, parent: top });
  await iconButton('up', th, ab, { size: 30, iconSize: 18 }); await iconButton('down', th, ab, { size: 30, iconSize: 18 }); await iconButton('trash', th, ab, { size: 30, iconSize: 18, color: 'color/danger' });
  const bt = box('exp', { dir: 'H', theme: th, parent: c });
  await button('Atur khusus di struktur gaji ini', th, bt, { v: 'text', size: 'small', icon: r.exp ? 'down' : 'chevron' });
  if (r.exp) {
    await wpSwitch(th, c, r.ov, r.ov ? 'Pakai pengaturan khusus' : 'Ikut pengaturan komponen');
    if (r.ov) {
      await wpSwitch(th, c, true, 'Pakai rumus');
      await inputField('Rumus', r.formula ?? 'base * 0.5', th, c, {});
      await inputField('Kondisi', '', th, c, { helper: 'Komponen hanya dihitung saat kondisinya terpenuhi.' });
    }
  }
  return c;
}
async function wpStructEditor(th, st) {
  const { f } = await wpStructPage(th, 'isi', 2000);
  const edit = st !== 'buat';
  await dialog(th, f, { title: edit ? 'Ubah Struktur Gaji' : 'Buat Struktur Gaji', w: 900, build: async (b) => {
    await inputField('Nama', edit ? 'Staf Tetap' : '', th, b, { required: true });
    await inputField('Catatan', edit ? 'Untuk karyawan tetap kantor pusat' : '', th, b, { multiline: 2 });
    await wpSwitch(th, b, true, 'Aktif');
    wpDivider(th, b);
    await alertBox('info', 'Pendapatan dihitung duluan, baru potongan. Rumus hanya bisa pakai komponen yang ada di atasnya.', th, b);
    if (st === 'galat') await alertBox('error', '• Rumus komponen "BPK" memakai "XYZ" yang tidak ada di atasnya\n• Komponen "PPH" tidak boleh dipakai di pendapatan', th, b, 'Struktur gaji belum bisa disimpan:');
    if (st === 'tanpa-komponen') await alertBox('warning', 'Buat komponen gaji dulu. [Buka]', th, b);
    const groups = st === 'buat' ? [['Pendapatan', []], ['Potongan', []], ['Ditanggung Perusahaan', []]] : [
      ['Pendapatan', [{ n: 'Gaji Pokok', abbr: 'GP', calc: 'base' }, { n: 'Tunjangan Makan', abbr: 'TM', calc: '25000 * present_days', ov: st === 'khusus', exp: st === 'khusus', formula: '30000 * present_days' }, { n: 'Tunjangan Transport', abbr: 'TT', calc: wpRp(500000), off: st === 'galat' }]],
      ['Potongan', [{ n: 'BPJS Kesehatan (Karyawan)', abbr: 'BPK', calc: 'GP * 0.01' }, { n: 'PPh 21', abbr: 'PPH', calc: wpRp(0) }]],
      ['Ditanggung Perusahaan', [{ n: 'BPJS Kesehatan (Perusahaan)', abbr: 'BPP', calc: 'GP * 0.04' }]]];
    for (const [g, rows] of groups) {
      const gc = wpCol(th, b, { gap: 8 });
      await txt(`${g} (${rows.length})`, 'label', 'color/text/secondary', th, { parent: gc, upper: true });
      if (rows.length === 0) await txt(`Belum ada komponen ${g.toLowerCase()}.`, 'body2', 'color/text/disabled', th, { parent: gc });
      for (const r of rows) await wpStructRow(th, gc, r);
    }
    await inputField('Tambah komponen', '', th, b, { select: true, helper: st === 'penuh' ? 'Semua komponen aktif sudah ada di struktur gaji ini.' : undefined });
  }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained' }] });
  return f;
}
wpMk('owner/salary-structures-buat', 'Dialog Buat Struktur Gaji', (th) => wpStructEditor(th, 'buat'));
wpMk('owner/salary-structures-ubah', 'Dialog Ubah Struktur Gaji', (th) => wpStructEditor(th, 'ubah'));
wpMk('owner/salary-structures-ubah-khusus', 'Dialog Ubah Struktur (pengaturan khusus komponen)', (th) => wpStructEditor(th, 'khusus'));
wpMk('owner/salary-structures-ubah-galat', 'Dialog Ubah Struktur (galat validasi)', (th) => wpStructEditor(th, 'galat'));
wpMk('owner/salary-structures-ubah-penuh', 'Dialog Ubah Struktur (semua komponen sudah ditambahkan)', (th) => wpStructEditor(th, 'penuh'));
wpMk('owner/salary-structures-pratinjau', 'Dialog Pratinjau Slip Struktur', async (th) => {
  const { f } = await wpStructPage(th, 'isi', 2400);
  await dialog(th, f, { title: 'Pratinjau Slip Gaji · Staf Tetap', w: 600, build: async (b) => {
    await txt('Coba hitung slip gaji pakai struktur ini. Tidak ada yang disimpan.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    await inputField('Karyawan', 'Budi Santoso (EMP-000003)', th, b, { select: true });
    const r = wpRow(th, b, { gap: 16 });
    await wpMonthField(th, r, 'Bulan', 'November 2026');
    await inputField('Hari cuti tidak dibayar', '0', th, r, {});
    await inputField('Gaji dasar', '', th, b, { helper: 'kosongkan untuk pakai penetapan gaji karyawan' });
    const bt = box('bt', { dir: 'H', theme: th, parent: b }); await button('Hitung', th, bt, { icon: 'money' });
    wpDivider(th, b);
    await wpSlipView(th, b);
  }, actions: [{ label: 'Tutup' }] });
  return f;
});
wpMk('owner/salary-structures-pratinjau-galat', 'Dialog Pratinjau Slip Struktur (galat)', async (th) => {
  const { f } = await wpStructPage(th, 'isi', 1100);
  await dialog(th, f, { title: 'Pratinjau Slip Gaji · Staf Tetap', w: 600, build: async (b) => {
    await txt('Coba hitung slip gaji pakai struktur ini. Tidak ada yang disimpan.', 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    await inputField('Karyawan', 'Agus Wijaya (EMP-000006)', th, b, { select: true });
    const r = wpRow(th, b, { gap: 16 });
    await wpMonthField(th, r, 'Bulan', 'November 2026');
    await inputField('Hari cuti tidak dibayar', '0', th, r, {});
    await inputField('Gaji dasar', '', th, b, { helper: 'kosongkan untuk pakai penetapan gaji karyawan' });
    const bt = box('bt', { dir: 'H', theme: th, parent: b }); await button('Hitung', th, bt, { icon: 'money' });
    await alertBox('error', 'Karyawan belum punya penetapan gaji. Kalau karyawan ini belum punya penetapan gaji, isi Gaji dasar lalu hitung lagi.', th, b);
  }, actions: [{ label: 'Tutup' }] });
  return f;
});
async function wpStructDelete(th, dipakai) {
  const { f } = await wpStructPage(th, 'isi', 1000);
  await dialog(th, f, { title: 'Hapus Struktur Gaji?', w: 444, build: async (b) => {
    await txt(dipakai ? 'Hapus struktur gaji Staf Tetap? Ini tidak bisa dibatalkan.' : 'Hapus struktur gaji Struktur Lama 2024? Ini tidak bisa dibatalkan.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
    if (dipakai) await alertBox('warning', 'Struktur gaji ini dipakai 38 karyawan. Lebih aman dinonaktifkan saja.', th, b);
  }, actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }] });
  return f;
}
wpMk('owner/salary-structures-hapus', 'Dialog Hapus Struktur Gaji', (th) => wpStructDelete(th, false));
wpMk('owner/salary-structures-hapus-dipakai', 'Dialog Hapus Struktur Gaji (dipakai karyawan)', (th) => wpStructDelete(th, true));

/* =====================================================================
 * 7. Komponen Gaji
 * ===================================================================== */
const WP_COMP_COLS = [{ t: 'Nama', w: 'fill' }, { t: 'Singkatan', w: 110 }, { t: 'Nilai', w: 240 }, { t: 'Keterangan', w: 250 }, { t: 'Status', w: 100 }, { t: 'Aksi', w: 100, align: 'right' }];
const WP_COMP_ROWS = {
  earning: [
    [{ t: 'Gaji Pokok', sub: 'Gaji dasar karyawan' }, { chip: 'GP', variant: 'outlined' }, { t: 'base' }, 'Sesuai hari dibayar · Kena pajak', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
    [{ t: 'Lembur' }, { chip: 'LMB', variant: 'outlined' }, { t: 'round(base / 173 * overtime_hours)' }, 'Kena pajak', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
    [{ t: 'Tunjangan Makan' }, { chip: 'TM', variant: 'outlined' }, { t: '25000 * present_days' }, 'Kena pajak', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
    [{ t: 'Tunjangan Transport' }, { chip: 'TT', variant: 'outlined' }, { t: wpRp(500000), sub: "kalau employment_type == 'permanent'" }, 'Kena pajak', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
    [{ t: 'Upah Dasar BPJS' }, { chip: 'UB', variant: 'outlined' }, { t: 'base' }, 'Komponen bantu · Tidak masuk total', { chip: 'Nonaktif', color: 'default', variant: 'outlined' }, { actions: ['edit', 'trash'] }],
  ],
  deduction: [
    [{ t: 'BPJS Kesehatan (Karyawan)' }, { chip: 'BPK', variant: 'outlined' }, { t: 'GP * 0.01' }, 'Sesuai hari dibayar', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
    [{ t: 'BPJS JHT (Karyawan)' }, { chip: 'JHT', variant: 'outlined' }, { t: 'GP * 0.02' }, '', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
    [{ t: 'PPh 21' }, { chip: 'PPH', variant: 'outlined' }, { t: wpRp(0) }, '', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }],
  ],
  employer_contribution: [[{ t: 'BPJS Kesehatan (Perusahaan)' }, { chip: 'BPP', variant: 'outlined' }, { t: 'GP * 0.04' }, 'Sesuai hari dibayar', { chip: 'Aktif', color: 'success', variant: 'solid' }, { actions: ['edit', 'trash'] }]],
};
async function wpCompPage(th, st, h) {
  const { f, main, act } = await wpPage(th, 'Komponen Gaji', h ?? 1100, 'Komponen Gaji', '8 komponen · 5 pendapatan · 2 potongan · 1 ditanggung perusahaan');
  await button('Tambah Komponen', th, act, { icon: 'plus' });
  if (st === 'galat') await alertBox('error', 'Gagal memuat komponen gaji. Coba lagi.', th, main);
  if (st === 'tanpa-perusahaan') await alertBox('info', 'Tambahkan perusahaan dulu sebelum membuat komponen gaji.', th, main);
  const c = card(th, main, { pad: 0, clip: true });
  const tb = wpRow(th, c, { pad: 16, ax: 'SPACE_BETWEEN' });
  await inputField('Perusahaan', WP_CO, th, tb, { w: 240, select: true });
  await inputField('Cari nama atau singkatan', st === 'cari' ? 'xyz' : '', th, tb, { w: 280, icon: 'search' });
  const tab = st === 'potongan' ? 1 : st === 'kosong' ? 2 : 0;
  await tabs(['Pendapatan (5)', 'Potongan (3)', st === 'kosong' ? 'Ditanggung Perusahaan (0)' : 'Ditanggung Perusahaan (1)'], tab, th, c);
  if (st === 'cari') { const eb = wpCol(th, c, { pad: [40, 16, 40, 16], ax: 'CENTER', ay: 'CENTER' }); await txt('Tidak ada komponen gaji yang cocok dengan "xyz".', 'body', 'color/text/secondary', th, { parent: eb, align: 'CENTER' }); }
  else if (st === 'kosong') {
    const eb = wpCol(th, c, { pad: 32, gap: 12, ax: 'CENTER', ay: 'CENTER' });
    await txt('Belum ada komponen ditanggung perusahaan', 'body2-strong', 'color/text/primary', th, { parent: eb });
    await txt('Komponen gaji adalah satu baris di slip gaji: dibayar perusahaan, tidak menambah atau memotong gaji karyawan, mis. BPJS bagian perusahaan. Nilainya bisa nominal tetap atau rumus. Singkatannya bisa dipakai di rumus komponen lain.', 'body2', 'color/text/secondary', th, { parent: eb, w: 520, align: 'CENTER' });
    const ex = card(th, eb, { pad: 12, gap: 4 }); ex.fills = [pv(th, 'color/background')]; ex.resize(520, 80); ex.layoutSizingHorizontal = 'FIXED';
    await txt('Contoh', 'caption', 'color/text/secondary', th, { parent: ex });
    await txt('Gaji Pokok · singkatan GP · rumus base', 'body2', 'color/text/primary', th, { parent: ex });
    await txt('Lalu komponen lain bisa pakai GP * 0.04', 'body2', 'color/text/primary', th, { parent: ex });
    await button('Tambah Komponen', th, eb, { icon: 'plus' });
  } else wpFlat(await table(th, c, { cols: WP_COMP_COLS, rows: tab === 1 ? WP_COMP_ROWS.deduction : WP_COMP_ROWS.earning, rowH: 60, foot: false }));
  return { f, main };
}
wpMk('owner/salary-components', 'Komponen Gaji (pendapatan)', async (th) => (await wpCompPage(th, 'isi')).f);
wpMk('owner/salary-components-potongan', 'Komponen Gaji (potongan)', async (th) => (await wpCompPage(th, 'potongan')).f);
wpMk('owner/salary-components-kosong', 'Komponen Gaji (kosong)', async (th) => (await wpCompPage(th, 'kosong')).f);
wpMk('owner/salary-components-tidak-cocok', 'Komponen Gaji (pencarian tidak cocok)', async (th) => (await wpCompPage(th, 'cari')).f);
wpMk('owner/salary-components-tanpa-perusahaan', 'Komponen Gaji (belum ada perusahaan)', async (th) => (await wpCompPage(th, 'tanpa-perusahaan', 800)).f);
wpMk('owner/salary-components-galat', 'Komponen Gaji (galat)', async (th) => (await wpCompPage(th, 'galat')).f);
/** Form komponen. st: formula | nominal | ubah | galat | rumus-salah */
async function wpCompForm(th, st) {
  const { f } = await wpCompPage(th, 'isi', 2300);
  const nominal = st === 'nominal', edit = st === 'ubah';
  await dialog(th, f, { title: edit ? 'Ubah Komponen Gaji' : 'Tambah Komponen Gaji', w: 900, build: async (b) => {
    const r = wpRow(th, b, { gap: 16, ay: 'MIN' });
    await inputField('Nama', edit ? 'Tunjangan Makan' : nominal ? 'Tunjangan Transport' : 'Bonus Kehadiran', th, r, { required: true });
    await inputField('Singkatan', st === 'galat' ? '1BK' : edit ? 'TM' : nominal ? 'TT' : 'BK', th, r, { required: true, error: st === 'galat', helper: st === 'galat' ? 'Harus diawali huruf, lalu huruf, angka, atau _' : 'Dipakai sebagai nama di rumus' });
    await inputField('Jenis', 'Pendapatan', th, b, { select: true, required: true });
    await inputField('Deskripsi', '', th, b, {});
    wpDivider(th, b);
    await wpSwitch(th, b, !nominal, 'Pakai rumus', 'Matikan kalau nominalnya tetap dan sama untuk semua karyawan.');
    if (nominal) await inputField('Nominal', '500000', th, b, { required: true, helper: wpRp(500000) });
    else {
      await inputField('Rumus', edit ? '25000 * present_days' : st === 'rumus-salah' ? 'GP * * 0.04' : 'base * 0.04', th, b, { multiline: 2, required: true, error: st === 'rumus-salah', focus: st !== 'rumus-salah' });
      const ok = st !== 'rumus-salah';
      const fr = box('feedback', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: b });
      icon(ok ? 'check' : 'alert', 16, ok ? 'color/success' : 'color/danger', th, fr);
      await txt(ok ? 'Rumus sudah benar' : 'Rumusnya belum benar: operator tidak boleh berurutan', 'caption', ok ? 'color/success' : 'color/danger', th, { parent: fr });
    }
    await inputField('Kondisi (opsional)', '', th, b, { helper: "Kosongkan kalau selalu berlaku. Kalau diisi, komponen hanya dihitung saat kondisinya terpenuhi. Contoh: employment_type == 'permanent'" });
    // Panel variabel & fungsi
    const p = box('panel', { dir: 'V', gap: 8, pad: 12, fill: 'color/background', radius: 8, theme: th, parent: b, fillW: true });
    const hint = box('hint', { dir: 'H', gap: 4, theme: th, parent: p });
    await txt('Klik untuk memasukkan ke kolom', 'caption', 'color/text/secondary', th, { parent: hint }); await txt(nominal ? 'Kondisi' : 'Rumus', 'caption-strong', 'color/text/primary', th, { parent: hint });
    await txt('Variabel bawaan', 'caption-strong', 'color/text/primary', th, { parent: p });
    const vars = ['base', 'variable', 'payment_days', 'total_working_days', 'calendar_days', 'working_days', 'holidays', 'present_days', 'rostered_days', 'absent_days', 'holiday_present_days', 'month', 'year', 'gross_pay', 'lwp_days', 'overtime_hours', 'overtime_raw_hours'];
    await wpChipRows(th, p, vars.map((v) => ({ l: v, color: 'primary' })), 5);
    await txt('Komponen lain', 'caption-strong', 'color/text/primary', th, { parent: p });
    await wpChipRows(th, p, ['GP', 'TM', 'TT', 'LMB', 'BPK', 'JHT'].map((v) => ({ l: v, color: 'info' })), 8);
    await txt('Fungsi', 'caption-strong', 'color/text/primary', th, { parent: p });
    await wpChipRows(th, p, ['round', 'int', 'flt', 'ceil', 'floor', 'abs', 'min', 'max', 'rounded'].map((v) => ({ l: v + '()' })), 9);
    wpDivider(th, b);
    await wpSwitch(th, b, edit, 'Hitung sesuai hari dibayar (prorata)', 'Nilainya dikurangi kalau karyawan tidak kerja sebulan penuh, mis. baru masuk atau ambil cuti tidak dibayar.');
    await wpSwitch(th, b, true, 'Kena pajak', 'Ikut dihitung sebagai penghasilan kotor untuk PPh 21.');
    await wpSwitch(th, b, false, 'Komponen bantu (tidak dibayar)', 'Hanya dipakai untuk rumus komponen lain. Tidak dibayar dan tidak ikut dijumlah ke total.');
    await wpSwitch(th, b, false, 'Tidak masuk total', 'Tampil di slip gaji, tapi tidak ikut dijumlah ke total pendapatan atau potongan.');
    await wpSwitch(th, b, false, 'Bulatkan ke rupiah penuh', 'Hasilnya dibulatkan, tanpa sen.');
    await wpSwitch(th, b, true, 'Aktif', 'Komponen nonaktif tidak ikut dihitung di slip gaji.');
  }, actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained', disabled: st === 'galat' || st === 'rumus-salah' }] });
  return f;
}
wpMk('owner/salary-components-tambah', 'Dialog Tambah Komponen (rumus)', (th) => wpCompForm(th, 'formula'));
wpMk('owner/salary-components-tambah-nominal', 'Dialog Tambah Komponen (nominal tetap)', (th) => wpCompForm(th, 'nominal'));
wpMk('owner/salary-components-tambah-galat', 'Dialog Tambah Komponen (singkatan salah)', (th) => wpCompForm(th, 'galat'));
wpMk('owner/salary-components-tambah-rumus-salah', 'Dialog Tambah Komponen (rumus salah)', (th) => wpCompForm(th, 'rumus-salah'));
wpMk('owner/salary-components-ubah', 'Dialog Ubah Komponen', (th) => wpCompForm(th, 'ubah'));
wpMk('owner/salary-components-hapus', 'Dialog Hapus Komponen Gaji', async (th) => {
  const { f } = await wpCompPage(th, 'isi', 1100);
  await dialog(th, f, { title: 'Hapus Komponen Gaji?', w: 444, build: async (b) => {
    await txt('Tunjangan Makan (TM) akan dihapus. Komponen yang masih dipakai di struktur gaji atau di rumus komponen lain tidak bisa dihapus. Nonaktifkan saja.', 'body2', 'color/text/primary', th, { parent: b, fillW: true });
  }, actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }] });
  return f;
});

/* =====================================================================
 * 8. Pengaturan Payroll
 * ===================================================================== */
const WP_BASIS = [
  { v: 'calendar_days', t: 'Hari kalender (30/31)', d: 'Sabtu, Minggu, dan tanggal merah ikut dihitung. Karyawan yang kerja sebulan penuh selalu dapat gaji utuh, berapa pun jumlah liburnya.', x: 'Contoh: masuk tanggal 16 November, dibayar 15/30. Potongan 1 hari cuti tidak dibayar = 1/30.' },
  { v: 'actual_working_days', t: 'Hari kerja riil (sesuai roster)', d: 'Karyawan yang punya roster: hari yang dijadwalkan masuk (termasuk Sabtu dan Minggu, mis. untuk security), dikurangi tanggal merah. Karyawan tanpa roster: Senin–Jumat atau Senin–Sabtu, dikurangi tanggal merah.', x: 'Contoh: security pola 2 pagi, 2 malam, 2 libur punya 20 hari terjadwal di November, jadi dibayar 20/20 dan potongan 1 hari = 1/20. Staf kantor: 21 hari kerja.' },
  { v: 'fixed_days', t: 'Angka tetap', d: 'Pembaginya selalu sama, mis. 21 (5 hari kerja) atau 25 (6 hari kerja), sesuai aturan upah harian. Karyawan yang kerja sebulan penuh selalu dapat gaji utuh.', x: 'Contoh angka 21: sebulan penuh selalu 21/21. Masuk atau keluar di tengah bulan, 21 dikurangi hari kerja yang terlewat (dari roster kalau ada), sama seperti cuti tanpa upah.' },
];
async function wpSettingsPage(th, sel, st) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Pengaturan Payroll', h: 2300 });
  const hd = wpCol(th, main, { gap: 4 });
  await txt('Pengaturan Payroll', 'h5', 'color/text/primary', th, { parent: hd });
  await txt('Berlaku per perusahaan. Payroll yang masih draf perlu dihitung ulang supaya ikut berubah. Slip gaji yang sudah final tidak berubah.', 'body2', 'color/text/secondary', th, { parent: hd, fillW: true });
  if (st === 'galat') { await alertBox('error', 'Gagal memuat pengaturan. Coba lagi.', th, main); await inputField('Perusahaan', WP_CO, th, main, { w: 260, select: true }); return { f, main }; }
  await inputField('Perusahaan', WP_CO, th, main, { w: 260, select: true });
  const c = card(th, main, { pad: 24, gap: 8 });
  await txt('Cara menghitung hari kerja sebulan', 'subtitle', 'color/text/primary', th, { parent: c });
  await txt('Dipakai untuk menghitung gaji karyawan yang masuk atau keluar di tengah bulan, dan potongan cuti tidak dibayar. Di rumus, angka ini bernama total_working_days.', 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
  gap(c, 4);
  for (const o of WP_BASIS) {
    const on = o.v === sel;
    const b = box('opsi/' + o.v, { dir: 'V', gap: 4, pad: [12, 16, 12, 16], stroke: on ? 'color/primary' : 'color/border', radius: 8, theme: th, parent: c, fillW: true });
    const hr = box('hr', { dir: 'H', gap: 10, ay: 'CENTER', theme: th, parent: b }); wpRadio(th, hr, on); await txt(o.t, 'body2-strong', 'color/text/primary', th, { parent: hr });
    const d = await txt(o.d, 'body2', 'color/text/secondary', th, { parent: b, fillW: true });
    const x = await txt(o.x, 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
    if (on && o.v === 'fixed_days') await inputField('Jumlah hari kerja sebulan', st === 'kosong-angka' ? '' : '21', th, b, { w: 280, error: st === 'kosong-angka', helper: 'Biasanya 21 untuk 5 hari kerja, 25 untuk 6 hari kerja.' });
  }
  wpDivider(th, c);
  await txt('Hari kerja per pekan', 'subtitle', 'color/text/primary', th, { parent: c });
  await inputField('Hari kerja per pekan', '5 hari (Senin–Jumat)', th, c, { w: 240, select: true });
  await txt('Hanya untuk karyawan yang tidak punya roster di bulan itu. Karyawan yang punya roster selalu ikut rosternya.', 'caption', 'color/text/secondary', th, { parent: c, fillW: true });
  gap(c, 4);
  await alertBox('info', 'Apa pun pilihannya, rumus juga bisa pakai working_days (hari kerja riil), holidays (tanggal merah di hari kerja), calendar_days (hari kalender), present_days (hari hadir), rostered_days (hari terjadwal), absent_days (mangkir: terjadwal tapi tidak absen dan tidak cuti), dan holiday_present_days (masuk di tanggal merah). Contoh: Uang Makan 25000 * present_days, Potongan Mangkir round(base / total_working_days * absent_days).', th, c);
  wpDivider(th, c);
  const bt = box('bt', { dir: 'H', theme: th, parent: c }); await button('Simpan Pengaturan', th, bt);
  if (st === 'kosong-angka') await txt('Isi jumlah hari kerja dulu, mis. 21 atau 25', 'caption', 'color/danger', th, { parent: c });
  // Cek hari kerja per karyawan
  const c2 = card(th, main, { pad: 24, gap: 12 });
  const hr = wpRow(th, c2, { ay: 'MIN', ax: 'SPACE_BETWEEN' });
  const hl = wpCol(th, hr, { gap: 2, fillW: false }); hl.layoutGrow = 1; hl.layoutSizingHorizontal = 'FILL';
  await txt('Cek hari kerja per karyawan', 'subtitle', 'color/text/primary', th, { parent: hl });
  await txt('Dihitung dari roster, tanggal merah, absensi, dan cuti di November 2026, pakai pengaturan yang sudah disimpan. Cek dulu di sini sebelum proses payroll.', 'body2', 'color/text/secondary', th, { parent: hl, fillW: true });
  await wpMonthField(th, hr, 'Bulan', 'November 2026', { w: 220 });
  const cols = [{ t: 'Karyawan', w: 'fill' }, { t: 'Sumber', w: 120 }, { t: 'Terjadwal', w: 90, align: 'right' }, { t: 'Tgl merah', w: 90, align: 'right' }, { t: 'Hari kerja riil', w: 110, align: 'right' }, { t: 'Pembagi', w: 80, align: 'right' }, { t: 'Hadir', w: 70, align: 'right' }, { t: 'Mangkir', w: 80, align: 'right' }, { t: 'Masuk tgl merah', w: 120, align: 'right' }];
  await table(th, c2, { cols, foot: false, rows: [
    [{ t: 'Agus Wijaya', sub: 'EMP-000006' }, { chip: 'Roster', color: 'primary', variant: 'outlined' }, '20', '—', '20', '20', '18', '2', '—'],
    [{ t: 'Budi Santoso', sub: 'EMP-000003' }, { chip: 'Senin–Jumat', color: 'default', variant: 'outlined' }, '—', '—', '21', '21', '21', '—', '—'],
    [{ t: 'Dewi Lestari', sub: 'EMP-000004' }, { chip: 'Senin–Jumat', color: 'default', variant: 'outlined' }, '—', '—', '21', '21', '20', '—', '—'],
    [{ t: 'Rina Kartika', sub: 'EMP-000007' }, { chip: 'Roster', color: 'primary', variant: 'outlined' }, '22', '1', '21', '21', '21', '0', '1']] });
  await txt('Mangkir hanya dihitung untuk tanggal yang sudah lewat, dan hanya untuk karyawan yang punya roster. Hari dengan koreksi absensi atau cuti yang disetujui tidak dihitung mangkir.', 'caption', 'color/text/secondary', th, { parent: c2, fillW: true });
  return { f, main };
}
wpMk('owner/payroll-settings', 'Pengaturan Payroll (hari kalender)', async (th) => (await wpSettingsPage(th, 'calendar_days')).f);
wpMk('owner/payroll-settings-roster', 'Pengaturan Payroll (hari kerja riil)', async (th) => (await wpSettingsPage(th, 'actual_working_days')).f);
wpMk('owner/payroll-settings-angka-tetap', 'Pengaturan Payroll (angka tetap)', async (th) => (await wpSettingsPage(th, 'fixed_days')).f);
wpMk('owner/payroll-settings-angka-kosong', 'Pengaturan Payroll (angka tetap belum diisi)', async (th) => (await wpSettingsPage(th, 'fixed_days', 'kosong-angka')).f);
wpMk('owner/payroll-settings-galat', 'Pengaturan Payroll (galat)', async (th) => {
  const { f } = await wpSettingsPage(th, 'calendar_days', 'galat'); return f;
});

/* =====================================================================
 * 9. Slip Gaji Saya
 * ===================================================================== */
const WP_MY = [['November 2026', 'Staf Tetap', 9050000, 390000, 8660000], ['Oktober 2026', 'Staf Tetap', 9050000, 390000, 8660000], ['September 2026', 'Staf Tetap', 8550000, 370000, 8180000], ['Agustus 2026', 'Staf Kontrak', 8000000, 320000, 7680000]];
async function wpMyPage(th, st, h) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Slip Gaji', h: h ?? 900 });
  const hd = wpCol(th, main, { gap: 4 });
  await txt('Slip Gaji Saya', 'h5', 'color/text/primary', th, { parent: hd });
  await txt('Rincian gaji tiap bulan yang sudah dibayar.', 'body2', 'color/text/secondary', th, { parent: hd });
  if (st === 'galat') await alertBox('error', 'Gagal memuat slip gaji. Coba lagi.', th, main);
  if (st === 'belum-terhubung') await alertBox('info', 'Akun ini belum terhubung ke data karyawan, jadi slip gaji belum bisa ditampilkan. Minta HR untuk menghubungkannya.', th, main);
  else if (st === 'kosong') {
    const c = card(th, main, { pad: 48, gap: 12, ax: 'CENTER', ay: 'CENTER' });
    icon('file', 40, 'color/text/disabled', th, c);
    await txt('Belum ada slip gaji. Slip gaji muncul setelah HR memfinalkan payroll bulan itu.', 'body', 'color/text/secondary', th, { parent: c, align: 'CENTER' });
  } else if (st !== 'galat') {
    const list = wpCol(th, main, { gap: 12 });
    for (const [m, s, g, d, n] of WP_MY) {
      const c = card(th, list, { dir: 'H', gap: 24, ay: 'CENTER', pad: 16 });
      const l = box('l', { dir: 'V', gap: 2, theme: th, parent: c }); l.layoutGrow = 1; l.layoutSizingHorizontal = 'FILL';
      await txt(m, 'body2-strong', 'color/text/primary', th, { parent: l }); await txt(s, 'body2', 'color/text/secondary', th, { parent: l });
      for (const [lb, v, b] of [['Pendapatan Kotor', g], ['Potongan', d], ['Gaji bersih (THP)', n, true]]) {
        const a = box('amount', { dir: 'V', gap: 2, theme: th, parent: c }); a.counterAxisSizingMode = 'AUTO'; a.primaryAxisSizingMode = 'FIXED'; a.resize(150, 20);
        await txt(lb, 'caption', 'color/text/secondary', th, { parent: a }); await txt(wpRp(v), b ? 'subtitle' : 'body2', 'color/text/primary', th, { parent: a });
      }
    }
  }
  return { f, main };
}
wpMk('owner/my-salary-slips', 'Slip Gaji Saya', async (th) => (await wpMyPage(th, 'isi')).f);
wpMk('owner/my-salary-slips-kosong', 'Slip Gaji Saya (kosong)', async (th) => (await wpMyPage(th, 'kosong')).f);
wpMk('owner/my-salary-slips-belum-terhubung', 'Slip Gaji Saya (akun belum terhubung)', async (th) => (await wpMyPage(th, 'belum-terhubung')).f);
wpMk('owner/my-salary-slips-galat', 'Slip Gaji Saya (galat)', async (th) => (await wpMyPage(th, 'galat')).f);
async function wpMyDialog(th, st) {
  const { f } = await wpMyPage(th, 'isi', 2300);
  await dialog(th, f, { title: 'Slip Gaji November 2026', w: 600, build: async (b) => {
    if (st === 'galat') { await alertBox('error', 'Gagal memuat slip gaji. Coba lagi.', th, b); return; }
    if (st === 'unduh-galat') await alertBox('error', 'Gagal mengunduh PDF. Coba lagi.', th, b);
    const h = wpCol(th, b, { gap: 2 });
    await txt('Slip Gaji November 2026', 'label', 'color/text/secondary', th, { parent: h, upper: true });
    await txt('EMP-000003 · Staf IT · Teknologi Informasi', 'body2', 'color/text/secondary', th, { parent: h, fillW: true });
    await txt('BCA 1234567890 a.n. Budi Santoso', 'body2', 'color/text/secondary', th, { parent: h, fillW: true });
    wpDivider(th, b);
    await wpSlipView(th, b);
  }, actions: [{ label: 'Tutup' }, { label: 'Unduh PDF', v: 'outlined', icon: 'file' }, { label: 'Cetak', v: 'contained' }] });
  return f;
}
wpMk('owner/my-salary-slips-detail', 'Dialog Slip Gaji Saya', (th) => wpMyDialog(th, 'isi'));
wpMk('owner/my-salary-slips-detail-galat', 'Dialog Slip Gaji Saya (galat)', (th) => wpMyDialog(th, 'galat'));
wpMk('owner/my-salary-slips-detail-unduh-galat', 'Dialog Slip Gaji Saya (unduh PDF gagal)', (th) => wpMyDialog(th, 'unduh-galat'));


/* ===== projects/workonix-web/screens/90-timesheet.js ===== */
/* =====================================================================
 * Daily Timesheet (karyawan + panel HR) — prefiks wt / WT_
 * Sumber: TimesheetListView/Table/FormDialog/ImportDialog/DashboardView/OptionsSettings.tsx, lib/timesheet.ts
 * ===================================================================== */
const WT_GROUP = 'Daily Timesheet';
registerIcons({
  'wt-eyeoff': '<path d="M3 3l18 18"/><path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.8M6.5 7.5A17 17 0 0 0 2 12s4 7 10 7c1.5 0 2.8-.4 4-1"/>',
});

const WT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WT_VIS = { private: ['Private', 'default'], team: ['Team', 'info'], all: ['All', 'success'] };
const WT_SUBTITLE = {
  mine: ['My Activity', 'Catatan kerja harian Anda'],
  team: ['Team Activity', 'Aktivitas rekan departemen yang dibagikan (Team atau All)'],
  shared: ['Shared Activity', 'Aktivitas yang dibagikan ke semua orang (All)'],
  admin: ['All Department', 'Aktivitas semua departemen yang dibagikan. Yang Private tidak ditampilkan.'],
};

const WT_MINE = [
  { vis: 'all', type: 'Rutin', loc: 'Office', shift: 'Non-shift', title: 'Menyiapkan laporan mingguan tim Teknologi Informasi', output: 'Laporan mingguan (PDF)', date: '24 Nov 2026', time: '08:30 - 11:00', dur: '2 jam 30 mnt', appr: 'Dewi Lestari' },
  { vis: 'team', type: 'Non-rutin', loc: 'Client', shift: 'Non-shift', title: 'Rapat kebutuhan sistem dengan PT Maju Bersama', output: 'Notulen rapat', date: '24 Nov 2026', time: '13:00 - 14:30', dur: '1 jam 30 mnt', appr: 'Dewi Lestari' },
  { vis: 'private', type: 'Rutin', loc: 'Office', shift: 'Non-shift', title: 'Perbaikan galat modul absensi', output: '', date: '23 Nov 2026', time: '09:00 - 12:00', dur: '3 jam', appr: '' },
  { vis: 'all', type: 'Rutin', loc: 'Site', shift: 'Shift', title: 'Pemeriksaan perangkat jaringan kantor cabang', output: 'Daftar perangkat terperiksa', date: '22 Nov 2026', time: '07:00 - 07:45', dur: '45 mnt', appr: 'Hendra Gunawan' },
  { vis: 'team', type: 'Non-rutin', loc: 'Office', shift: 'Non-shift', title: 'Pelatihan penggunaan aplikasi untuk staf baru', output: 'Materi pelatihan', date: '21 Nov 2026', time: '10:00 - 12:00', dur: '2 jam', appr: 'Dewi Lestari' },
];
const WT_OTHERS = [
  { vis: 'team', type: 'Rutin', loc: 'Office', shift: 'Non-shift', title: 'Rekonsiliasi pengeluaran operasional bulan berjalan', output: 'Lembar rekonsiliasi', date: '24 Nov 2026', time: '08:00 - 10:30', dur: '2 jam 30 mnt', appr: 'Rina Kartika', owner: 'Siti Rahmawati', dept: 'Keuangan' },
  { vis: 'all', type: 'Non-rutin', loc: 'Client', shift: 'Non-shift', title: 'Presentasi jadwal pengiriman kepada pelanggan', output: 'Slide presentasi', date: '24 Nov 2026', time: '11:00 - 12:00', dur: '1 jam', appr: 'Agus Wijaya', owner: 'Eko Prasetyo', dept: 'Operasional' },
  { vis: 'all', type: 'Rutin', loc: 'Office', shift: 'Non-shift', title: 'Pembaruan data karyawan baru di sistem', output: '12 data terperbarui', date: '23 Nov 2026', time: '09:00 - 11:15', dur: '2 jam 15 mnt', appr: 'Dewi Lestari', owner: 'Maya Anggraini', dept: 'SDM' },
  { vis: 'team', type: 'Rutin', loc: 'Site', shift: 'Shift', title: 'Pengecekan stok gudang akhir bulan', output: '', date: '22 Nov 2026', time: '14:00 - 16:00', dur: '2 jam', appr: 'Agus Wijaya', owner: 'Doni Setiawan', dept: 'Operasional' },
];

/** Kolom/baris dengan lebar tetap di dalam auto-layout. */
function wtFixed(name, dir, w, parent, th, o = {}) {
  const b = box(name, { dir, gap: o.gap ?? 0, ax: o.ax, ay: o.ay, theme: th, parent });
  b.resize(w, 10);
  if (dir === 'V') { b.counterAxisSizingMode = 'FIXED'; b.primaryAxisSizingMode = 'AUTO'; } else { b.primaryAxisSizingMode = 'FIXED'; b.counterAxisSizingMode = 'AUTO'; }
  return b;
}
/** Kotak tinggi tetap, lebar FILL. */
function wtFillBox(name, dir, h, parent, th, o = {}) {
  const b = box(name, { dir, gap: o.gap ?? 0, ax: o.ax, ay: o.ay, pad: o.pad ?? 0, theme: th, parent });
  b.resize(100, h); b.layoutSizingHorizontal = 'FILL';
  if (dir === 'H') { b.counterAxisSizingMode = 'FIXED'; b.primaryAxisSizingMode = 'FIXED'; } else { b.primaryAxisSizingMode = 'FIXED'; b.counterAxisSizingMode = 'FIXED'; }
  return b;
}
function wtBar(th, parent, w, h, token) {
  const r = figma.createRectangle(); r.name = 'bar'; r.resize(w, Math.max(2, h)); r.cornerRadius = 2; r.fills = [pv(th, token)]; parent.appendChild(r); return r;
}

/* ---------- Kartu aktivitas ---------- */
async function wtActivity(th, parent, r, o = {}) {
  const c = box('Activity', { dir: 'H', gap: 16, pad: 14, fill: 'color/surface', stroke: 'color/border', radius: 10, ay: 'CENTER', theme: th, parent, fillW: true });
  const left = box('info', { dir: 'V', gap: 4, theme: th, parent: c }); left.layoutGrow = 1; left.layoutSizingHorizontal = 'FILL';
  const chips = box('chips', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: left });
  await chip(WT_VIS[r.vis][0], th, chips, { color: WT_VIS[r.vis][1] });
  await chip(r.type, th, chips, { variant: 'outlined' }); await chip(r.loc, th, chips, { variant: 'outlined' }); await chip(r.shift, th, chips, { variant: 'outlined' });
  await txt(r.title, 'subtitle', 'color/text/primary', th, { parent: left, fillW: true });
  if (r.output) await txt('Output: ' + r.output, 'body2', 'color/text/secondary', th, { parent: left, fillW: true });
  if (o.showOwner) await txt(r.owner + (r.dept ? ' · ' + r.dept : ''), 'caption', 'color/text/secondary', th, { parent: left, fillW: true });
  const mid = wtFixed('tanggal', 'V', 210, c, th, { gap: 2 });
  await txt(r.date, 'body2', 'color/text/primary', th, { parent: mid, fillW: true });
  await txt(r.time + ' · ' + r.dur, 'body2', 'color/text/secondary', th, { parent: mid, fillW: true });
  const right = wtFixed('approved', 'H', 170, c, th, { ay: 'CENTER', ax: 'SPACE_BETWEEN' });
  const ap = box('approved by', { dir: 'V', theme: th, parent: right });
  await txt('Approved By', 'caption', 'color/text/secondary', th, { parent: ap });
  await txt(r.appr || '-', 'body2', 'color/text/primary', th, { parent: ap });
  if (o.actions) {
    const ac = box('aksi', { dir: 'H', theme: th, parent: right });
    await iconButton('edit', th, ac, { size: 32, iconSize: 18 }); await iconButton('trash', th, ac, { size: 32, iconSize: 18, color: 'color/danger' });
  }
  return c;
}

/** Bar filter daftar. scope 'mine' menambah Visibilitas. */
async function wtFilters(th, parent, scope, o = {}) {
  const row = box('Filter', { dir: 'H', gap: 12, ay: 'MIN', theme: th, parent, fillW: true });
  await inputField('Cari', o.search ?? '', th, row, { w: 220 });
  await inputField('Dari', '', th, row, { w: 140 });
  await inputField('Sampai', '', th, row, { w: 140 });
  if (scope === 'mine') await inputField('Visibilitas', o.vis ?? 'Semua', th, row, { w: 130, select: true });
  await inputField('Urutkan', 'Created Date', th, row, { w: 150, select: true });
  await inputField('Arah', 'Desc', th, row, { w: 100, select: true });
  await inputField('Per halaman', '30', th, row, { w: 110, select: true });
  return row;
}

/**
 * Halaman daftar. o: role, active, rows, state 'data'|'kosong'|'galat'|'memuat'|'tanpa-karyawan', h.
 * Mengembalikan { f, main } supaya dialog bisa ditumpuk.
 */
async function wtListPage(th, scope, o) {
  const { f, main } = await page('x', th, { role: o.role, active: o.active, h: o.h ?? 1100 });
  const state = o.state ?? 'data';
  if (state === 'tanpa-karyawan') { await alertBox('info', 'Akun ini belum terhubung ke data karyawan, jadi belum bisa mencatat aktivitas.', th, main); return { f, main }; }
  const act = await pageHeader(th, main, WT_SUBTITLE[scope][0], WT_SUBTITLE[scope][1]);
  if (scope === 'mine' || scope === 'admin') await button('Download', th, act, { v: 'outlined', icon: 'download' });
  if (scope === 'mine') { await button('Import', th, act, { color: 'success', icon: 'upload' }); await button('Add New', th, act, { icon: 'plus' }); }
  await wtFilters(th, main, scope);
  if (state === 'galat') { await alertBox('error', 'Gagal memuat aktivitas. Coba lagi.', th, main); return { f, main }; }
  if (state === 'memuat') {
    const w = box('loading', { dir: 'H', ax: 'CENTER', pad: 48, theme: th, parent: main, fillW: true });
    box('spinner', { dir: 'H', radius: 999, stroke: 'color/primary', sw: 4, theme: th, parent: w, fixed: [40, 40] });
    return { f, main };
  }
  if (state === 'kosong') { await alertBox('info', 'Belum ada aktivitas.', th, main); return { f, main }; }
  const rows = o.rows;
  await txt(`Showing 1 to ${rows.length} of ${rows.length} results`, 'body2', 'color/text/secondary', th, { parent: main });
  const list = box('TimesheetTable', { dir: 'V', gap: 10, theme: th, parent: main, fillW: true });
  for (const r of rows) await wtActivity(th, list, r, { showOwner: scope !== 'mine', actions: scope === 'mine' });
  return { f, main };
}

/* ---------- Dashboard ---------- */
const WT_SER = {
  summary: { previous: [120, 132, 128, 141, 150, 138, 160, 155, 149, 162, 158, 170], current: [135, 140, 152, 148, 165, 172, 168, 175, 181, 190, 98, 0] },
  mine: { previous: [14, 18, 16, 20, 22, 19, 24, 21, 20, 23, 22, 25], current: [17, 19, 21, 18, 25, 26, 23, 27, 29, 31, 14, 0] },
  department: { previous: [38, 41, 40, 46, 48, 44, 52, 50, 47, 53, 51, 55], current: [42, 45, 49, 47, 54, 57, 55, 58, 60, 63, 30, 0] },
  team: [{ name: 'Budi Santoso', previous: 210, current: 245 }, { name: 'Putri Handayani', previous: 188, current: 201 }, { name: 'Hendra Gunawan', previous: 164, current: 152 }, { name: 'Maya Anggraini', previous: 130, current: 176 }],
};
async function wtLegend(th, parent, a, b) {
  const l = box('Legend', { dir: 'H', gap: 16, ay: 'CENTER', ax: 'CENTER', theme: th, parent, fillW: true });
  for (const [t, tok] of [[a, 'color/text/disabled'], [b, 'color/primary']]) {
    const i = box('item', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: l });
    wtBar(th, i, 10, 10, tok); await txt(t, 'caption', 'color/text/secondary', th, { parent: i });
  }
}
async function wtPanel(th, parent, title, s, y) {
  const c = card(th, parent, { gap: 12 });
  await txt(title, 'subtitle', 'color/text/primary', th, { parent: c });
  const max = Math.max(...s.previous, ...s.current);
  const area = wtFillBox('chart', 'H', 220, c, th, { gap: 6, ay: 'MAX', pad: [0, 8, 0, 8] });
  area.strokes = [pv(th, 'color/border')]; area.strokeWeight = 1; area.strokeTopWeight = 0; area.strokeLeftWeight = 0; area.strokeRightWeight = 0;
  for (let i = 0; i < 12; i++) {
    const g = box('bulan ' + WT_MONTHS[i], { dir: 'H', gap: 3, ax: 'CENTER', ay: 'MAX', theme: th, parent: area }); g.layoutGrow = 1; g.layoutSizingHorizontal = 'FILL';
    wtBar(th, g, 14, (s.previous[i] / max) * 200, 'color/text/disabled'); wtBar(th, g, 14, (s.current[i] / max) * 200, 'color/primary');
  }
  const lab = box('bulan', { dir: 'H', gap: 6, pad: [0, 8, 0, 8], theme: th, parent: c, fillW: true });
  for (const m of WT_MONTHS) { const w = box('m', { dir: 'H', ax: 'CENTER', theme: th, parent: lab }); w.layoutGrow = 1; w.layoutSizingHorizontal = 'FILL'; await txt(m, 'caption', 'color/text/secondary', th, { parent: w }); }
  await wtLegend(th, c, String(y - 1), String(y));
  return c;
}
async function wtTeamPanel(th, parent, y) {
  const c = card(th, parent, { gap: 14 });
  await txt('Team Activity', 'subtitle', 'color/text/primary', th, { parent: c });
  const max = Math.max(...WT_SER.team.flatMap((t) => [t.previous, t.current]));
  for (const t of WT_SER.team) {
    const r = box('baris ' + t.name, { dir: 'H', gap: 16, ay: 'CENTER', theme: th, parent: c, fillW: true });
    const n = await txt(t.name, 'body2', 'color/text/primary', th, { parent: r }); n.resize(140, n.height); n.textAutoResize = 'HEIGHT';
    const bars = box('bars', { dir: 'V', gap: 4, theme: th, parent: r });
    for (const [v, tok] of [[t.previous, 'color/text/disabled'], [t.current, 'color/primary']]) {
      const br = box('bar row', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: bars });
      wtBar(th, br, Math.round((v / max) * 760), 14, tok); await txt(String(v), 'caption', 'color/text/secondary', th, { parent: br });
    }
  }
  await wtLegend(th, c, String(y - 1), String(y));
  return c;
}
async function wtDashPage(th, role, active, o = {}) {
  const { f, main } = await page('x', th, { role, active, h: o.h ?? 1900 });
  if (o.error) { await alertBox('error', 'Gagal memuat dashboard. Coba lagi.', th, main); return f; }
  const y = 2026;
  await (async () => {
    const t = box('titles', { dir: 'V', gap: 4, theme: th, parent: main, fillW: true });
    await txt('Dashboard Timesheet', 'h5', 'color/text/primary', th, { parent: t });
    await txt(`Jumlah aktivitas per bulan, ${y - 1} dibanding ${y}`, 'body2', 'color/text/secondary', th, { parent: t });
  })();
  await wtPanel(th, main, 'Summary Activity (All Department)', WT_SER.summary, y);
  await wtPanel(th, main, 'My Activity', WT_SER.mine, y);
  if (o.dept !== false) await wtPanel(th, main, 'Department Activity', WT_SER.department, y);
  if (o.team !== false) await wtTeamPanel(th, main, y);
  return f;
}

/* ---------- Dialog ---------- */
function wtRadio(th, parent, selected) {
  const o = box('Radio', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 999, stroke: selected ? 'color/primary' : 'color/text/secondary', sw: 2, theme: th, parent, fixed: [18, 18] });
  if (selected) box('dot', { dir: 'H', radius: 999, fill: 'color/primary', theme: th, parent: o, fixed: [8, 8] });
  return o;
}
async function wtActivityForm(th, parent, i, v) {
  const n = String(i + 1).padStart(2, '0');
  const b = box('Activity ' + n, { dir: 'V', gap: 12, pad: 16, fill: 'color/background', radius: 10, theme: th, parent, fillW: true });
  await txt(`Activity ${n} *`, 'body2-strong', 'color/text/primary', th, { parent: b });
  await inputField(`Activity ${n}…`, v.title, th, b);
  await inputField('Output…', v.output, th, b);
  const r1 = box('baris 1', { dir: 'H', gap: 8, theme: th, parent: b, fillW: true });
  await inputField('Shift', v.shift, th, r1, { w: 124, select: true }); await inputField('Tanggal', v.date, th, r1, { w: 124 });
  await inputField('Mulai', v.start, th, r1, { w: 124 }); await inputField('Selesai', v.end, th, r1, { w: 124 });
  const r2 = box('baris 2', { dir: 'H', gap: 8, theme: th, parent: b, fillW: true });
  await inputField('Lokasi', v.loc, th, r2, { w: 168, select: true }); await inputField('Jenis', v.type, th, r2, { w: 168, select: true });
  await inputField('Approved By…', v.appr, th, r2, { w: 168 });
  const rg = box('visibilitas', { dir: 'H', gap: 20, ay: 'CENTER', theme: th, parent: b });
  for (const k of ['private', 'team', 'all']) { const it = box('opsi', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: rg }); wtRadio(th, it, k === v.vis); await txt(WT_VIS[k][0], 'body2', 'color/text/primary', th, { parent: it }); }
  return b;
}
const WT_BLANK = { title: '', output: '', shift: 'Non-shift', date: '24/11/2026', start: '09:41', end: '09:41', loc: 'Office', type: 'Rutin', appr: '', vis: 'private' };
const WT_FILLED = { title: 'Menyiapkan laporan mingguan tim Teknologi Informasi', output: 'Laporan mingguan (PDF)', shift: 'Non-shift', date: '24/11/2026', start: '08:30', end: '11:00', loc: 'Office', type: 'Rutin', appr: 'Dewi Lestari', vis: 'all' };
async function wtFormDialog(th, role, active, o) {
  const { f } = await wtListPage(th, 'mine', { role, active, rows: WT_MINE, h: o.h ?? 1500 });
  await dialog(th, f, {
    title: o.edit ? 'Ubah Aktivitas' : 'Add New', w: 600,
    build: async (b) => {
      await alertBox('info', 'Your current position at -6.200000, 106.816666 (See on Maps).', th, b);
      for (const [i, v] of o.items.entries()) await wtActivityForm(th, b, i, v);
      if (!o.edit) { const r = box('add more', { dir: 'H', ax: 'MAX', theme: th, parent: b, fillW: true }); await button('Add More', th, r, { color: 'warning', size: 'small', icon: 'plus' }); }
      if (o.error) await alertBox('error', o.error, th, b);
    },
    actions: [{ label: 'Cancel' }, { label: 'Submit', v: 'contained', disabled: !!o.disabled }],
  });
  return f;
}
async function wtImportDialog(th, role, active, o = {}) {
  const { f } = await wtListPage(th, 'mine', { role, active, rows: WT_MINE });
  await dialog(th, f, {
    title: 'Import File', w: 600,
    build: async (b) => {
      const r = box('pilih berkas', { dir: 'H', gap: 12, ay: 'CENTER', theme: th, parent: b, fillW: true });
      await button('Telusuri…', th, r, { v: 'outlined' });
      await txt(o.file ?? 'Tidak ada berkas dipilih.', 'body2', 'color/text/secondary', th, { parent: r });
      await txt('* Hanya menerima format *.csv dan *.xlsx, ukuran maksimal 5 MB, maksimal 500 baris. Jika ada satu baris yang salah, tidak ada data yang disimpan.', 'caption', 'color/text/secondary', th, { parent: b, fillW: true });
      await alertBox('warning', 'Jika unggah *.xls gagal, simpan ulang sebagai *.xlsx atau *.csv.', th, b);
      if (o.errors) {
        const a = await alertBox('error', o.errors.msg, th, b);
        const tb = a.children[1];
        for (const l of o.errors.rows) await txt('• ' + l, 'body2', 'color/text/primary', th, { parent: tb, fillW: true });
      }
    },
    actions: [{ label: 'Download Template' }, { label: 'Cancel' }, { label: 'Upload', v: 'contained', color: 'success', disabled: !o.file }],
  });
  return f;
}
async function wtDeleteDialog(th, role, active) {
  const { f } = await wtListPage(th, 'mine', { role, active, rows: WT_MINE });
  await dialog(th, f, {
    title: 'Hapus aktivitas', w: 440,
    build: async (b) => { await txt('Hapus aktivitas "Perbaikan galat modul absensi"?', 'body', 'color/text/primary', th, { parent: b, fillW: true }); },
    actions: [{ label: 'Batal' }, { label: 'Hapus', v: 'contained', color: 'error' }],
  });
  return f;
}

/* ---------- Pengaturan Pilihan ---------- */
async function wtOptChip(th, parent, label, active) {
  const c = box('Chip/' + label, { dir: 'H', gap: 8, ay: 'CENTER', pad: [0, 10, 0, 14], radius: 16, fill: active ? 'color/primary' : null, stroke: active ? null : 'color/border', theme: th, parent });
  c.counterAxisSizingMode = 'FIXED'; c.resize(40, 32); c.primaryAxisSizingMode = 'AUTO';
  const fg = active ? onPrimary(th) : 'color/text/secondary';
  await txt(label, 'body2', fg, th, { parent: c });
  icon(active ? 'wt-eyeoff' : 'eye', 16, fg, th, c);
  return c;
}
const WT_OPT_KINDS = [
  ['Lokasi Kerja', 'Pilihan dropdown lokasi di formulir, mis. Office, Client, Site.', [['Office', 1], ['Client', 1], ['Site', 1], ['Work From Home', 0]], 'Pilihan baru…'],
  ['Jenis Pekerjaan', 'Pilihan dropdown jenis pekerjaan, mis. Rutin, Non-rutin.', [['Rutin', 1], ['Non-rutin', 1], ['Proyek', 1], ['Lembur Khusus', 0]], 'Pilihan baru…'],
];
async function wtSettingsPage(th, o = {}) {
  const { f, main } = await page('x', th, { role: 'owner', active: 'Pengaturan Pilihan', h: o.h ?? 900 });
  if (o.error) { await alertBox('error', 'Gagal memuat pilihan. Coba lagi.', th, main); return f; }
  const t = box('titles', { dir: 'V', gap: 4, theme: th, parent: main, fillW: true });
  await txt('Pengaturan Timesheet', 'h5', 'color/text/primary', th, { parent: t });
  await txt('Atur pilihan dropdown di formulir Daily Timesheet.', 'body2', 'color/text/secondary', th, { parent: t });
  for (const [title, hint, chips, ph] of WT_OPT_KINDS) {
    const c = card(th, main, { gap: 8 });
    await txt(title, 'subtitle', 'color/text/primary', th, { parent: c });
    await txt(hint, 'body2', 'color/text/secondary', th, { parent: c, fillW: true });
    const row = box('chips', { dir: 'H', gap: 8, ay: 'CENTER', pad: [8, 0, 8, 0], theme: th, parent: c, fillW: true });
    for (const [l, a] of chips) await wtOptChip(th, row, l, !!a);
    const add = box('tambah', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent: c });
    await inputField(ph, o.draft && title === 'Lokasi Kerja' ? o.draft : '', th, add, { w: 280 });
    await button('Tambah', th, add, { icon: 'plus' });
  }
  return f;
}

/* ---------- Registrasi layar ---------- */
const WT_EMP = { role: 'employee' };
const WT_OWN = { role: 'owner' };
const WT_ACT_EMP_MY = 'My Activity', WT_ACT_OWN_MY = 'Timesheet: My Activity';
const wtReg = (key, title, build) => registerScreen({ key, group: WT_GROUP, title, build });

// Karyawan
wtReg('employee/timesheet-dashboard', 'Karyawan - Dashboard', (th) => wtDashPage(th, 'employee', 'Dashboard'));
wtReg('employee/timesheet-dashboard-tanpa-departemen', 'Karyawan - Dashboard (tanpa departemen/tim)', (th) => wtDashPage(th, 'employee', 'Dashboard', { dept: false, team: false, h: 1250 }));
wtReg('employee/timesheet-dashboard-galat', 'Karyawan - Dashboard galat', (th) => wtDashPage(th, 'employee', 'Dashboard', { error: true, h: 600 }));
wtReg('employee/timesheet-my', 'Karyawan - My Activity', async (th) => (await wtListPage(th, 'mine', { ...WT_EMP, active: WT_ACT_EMP_MY, rows: WT_MINE })).f);
wtReg('employee/timesheet-my-kosong', 'Karyawan - My Activity kosong', async (th) => (await wtListPage(th, 'mine', { ...WT_EMP, active: WT_ACT_EMP_MY, state: 'kosong', h: 700 })).f);
wtReg('employee/timesheet-my-galat', 'Karyawan - My Activity galat', async (th) => (await wtListPage(th, 'mine', { ...WT_EMP, active: WT_ACT_EMP_MY, state: 'galat', h: 700 })).f);
wtReg('employee/timesheet-my-memuat', 'Karyawan - My Activity memuat', async (th) => (await wtListPage(th, 'mine', { ...WT_EMP, active: WT_ACT_EMP_MY, state: 'memuat', h: 700 })).f);
wtReg('employee/timesheet-my-tanpa-karyawan', 'Karyawan - My Activity akun belum terhubung', async (th) => (await wtListPage(th, 'mine', { ...WT_EMP, active: WT_ACT_EMP_MY, state: 'tanpa-karyawan', h: 600 })).f);
wtReg('employee/timesheet-my-tambah', 'Karyawan - Dialog Add New', (th) => wtFormDialog(th, 'employee', WT_ACT_EMP_MY, { items: [WT_BLANK], disabled: true, h: 1300 }));
wtReg('employee/timesheet-my-tambah-banyak', 'Karyawan - Dialog Add New (Add More)', (th) => wtFormDialog(th, 'employee', WT_ACT_EMP_MY, { items: [WT_FILLED, { ...WT_BLANK, title: 'Rapat koordinasi proyek', output: 'Notulen rapat', start: '13:00', end: '14:30', type: 'Non-rutin', vis: 'team' }], h: 1700 }));
wtReg('employee/timesheet-my-tambah-galat', 'Karyawan - Dialog Add New galat simpan', (th) => wtFormDialog(th, 'employee', WT_ACT_EMP_MY, { items: [WT_FILLED], error: 'Gagal menyimpan. Coba lagi.', h: 1400 }));
wtReg('employee/timesheet-my-ubah', 'Karyawan - Dialog Ubah Aktivitas', (th) => wtFormDialog(th, 'employee', WT_ACT_EMP_MY, { items: [WT_FILLED], edit: true, h: 1300 }));
wtReg('employee/timesheet-my-impor', 'Karyawan - Dialog Import File', (th) => wtImportDialog(th, 'employee', WT_ACT_EMP_MY));
wtReg('employee/timesheet-my-impor-galat', 'Karyawan - Dialog Import galat baris', (th) => wtImportDialog(th, 'employee', WT_ACT_EMP_MY, { file: 'aktivitas-november.xlsx', errors: { msg: 'Berkas tidak valid. Tidak ada data yang disimpan.', rows: ['Baris 3 (workDate): Tanggal tidak valid — "31/02/2026"', 'Baris 7 (startTime): Jam mulai wajib diisi', 'Baris 12 (visibility): Visibilitas harus Private, Team, atau All — "Publik"'] } }));
wtReg('employee/timesheet-my-hapus', 'Karyawan - Konfirmasi hapus aktivitas', (th) => wtDeleteDialog(th, 'employee', WT_ACT_EMP_MY));
wtReg('employee/timesheet-team', 'Karyawan - Team Activity', async (th) => (await wtListPage(th, 'team', { ...WT_EMP, active: 'Team Activity', rows: WT_OTHERS, h: 1000 })).f);
wtReg('employee/timesheet-team-kosong', 'Karyawan - Team Activity kosong', async (th) => (await wtListPage(th, 'team', { ...WT_EMP, active: 'Team Activity', state: 'kosong', h: 700 })).f);
wtReg('employee/timesheet-shared', 'Karyawan - Shared (All)', async (th) => (await wtListPage(th, 'shared', { ...WT_EMP, active: 'Shared (All)', rows: WT_OTHERS.filter((r) => r.vis === 'all'), h: 800 })).f);
wtReg('employee/timesheet-shared-kosong', 'Karyawan - Shared (All) kosong', async (th) => (await wtListPage(th, 'shared', { ...WT_EMP, active: 'Shared (All)', state: 'kosong', h: 700 })).f);

// Panel HR (owner)
wtReg('owner/timesheet-dashboard', 'HR - Timesheet: Dashboard', (th) => wtDashPage(th, 'owner', 'Timesheet: Dashboard', { team: false, h: 1500 }));
wtReg('owner/my-timesheet', 'HR - Timesheet: My Activity', async (th) => (await wtListPage(th, 'mine', { ...WT_OWN, active: WT_ACT_OWN_MY, rows: WT_MINE })).f);
wtReg('owner/my-timesheet-kosong', 'HR - Timesheet: My Activity kosong', async (th) => (await wtListPage(th, 'mine', { ...WT_OWN, active: WT_ACT_OWN_MY, state: 'kosong', h: 700 })).f);
wtReg('owner/my-timesheet-tambah', 'HR - Dialog Add New', (th) => wtFormDialog(th, 'owner', WT_ACT_OWN_MY, { items: [WT_BLANK], disabled: true, h: 1300 }));
wtReg('owner/my-timesheet-impor', 'HR - Dialog Import File', (th) => wtImportDialog(th, 'owner', WT_ACT_OWN_MY));
wtReg('owner/my-timesheet-hapus', 'HR - Konfirmasi hapus aktivitas', (th) => wtDeleteDialog(th, 'owner', WT_ACT_OWN_MY));
wtReg('owner/timesheet-all', 'HR - All Department', async (th) => (await wtListPage(th, 'admin', { ...WT_OWN, active: 'All Department', rows: WT_OTHERS, h: 1000 })).f);
wtReg('owner/timesheet-all-kosong', 'HR - All Department kosong', async (th) => (await wtListPage(th, 'admin', { ...WT_OWN, active: 'All Department', state: 'kosong', h: 700 })).f);
wtReg('owner/timesheet-all-galat', 'HR - All Department galat', async (th) => (await wtListPage(th, 'admin', { ...WT_OWN, active: 'All Department', state: 'galat', h: 700 })).f);
wtReg('owner/timesheet-settings', 'HR - Pengaturan Pilihan', (th) => wtSettingsPage(th));
wtReg('owner/timesheet-settings-isi', 'HR - Pengaturan Pilihan (mengetik pilihan baru)', (th) => wtSettingsPage(th, { draft: 'Remote Client' }));
wtReg('owner/timesheet-settings-galat', 'HR - Pengaturan Pilihan galat', (th) => wtSettingsPage(th, { error: true, h: 600 }));


/* ===== projects/workonix-web/plan.generated.js ===== */
const CHUNK_PLAN = [{"name":"Auth dan Super Admin","keys":["login","login-galat","login-galat-429","login-memproses","set-password","set-password-galat","set-password-galat-beda","set-password-tautan-galat","change-password","change-password-galat","change-password-galat-sama","change-password-galat-beda","privacy","privacy-bawah","super/dashboard","super/dashboard-kosong","super/dashboard-galat","super/groups","super/groups-kosong","super/groups-galat","super/groups-detail","super/groups-detail-ditangguhkan","super/groups-detail-galat","super/groups-detail-kuota","super/groups-detail-tangguhkan","super/groups-detail-aktifkan","super/groups-detail-ubah-paket","super/groups-detail-ubah-paket-memuat","super/groups-detail-reset","super/groups-detail-reset-hasil","super/groups-new","super/groups-new-galat","super/groups-new-memproses","super/plans","super/plans-galat","super/plans-memuat"],"nodes":5892},{"name":"Dasbor dan Persetujuan","keys":["owner/dashboard","owner/dashboard-kosong","owner/dashboard-galat","owner/dashboard-memuat","owner/approvals","owner/approvals-kosong","owner/approvals-galat","owner/approvals-tolak","employee/approvals","employee/approvals-kosong","employee/approvals-tolak","owner/approval-report","owner/approval-report-kosong","owner/approval-report-galat","owner/approval-report-terpotong","owner/approval-report-detail","employee/requests","employee/requests-kosong","employee/requests-galat","employee/requests-form","employee/requests-form-galat","owner/my-requests","owner/my-requests-kosong","owner/my-requests-galat","owner/my-requests-form","owner/my-requests-form-galat","owner/my-requests-tanpa-karyawan","employee/profile","employee/profile-tanpa-foto","employee/profile-galat"],"nodes":10932},{"name":"Karyawan dan Hak Akses (1/4)","keys":["owner/employees","owner/employees-kosong","owner/employees-filter-kosong","owner/employees-galat","owner/employees-form","owner/employees-form-kontrak","owner/employees-detail","owner/employees-penyetuju","owner/employees-foto","owner/employees-pribadi","owner/employees-pribadi-npwp","owner/employees-akun","owner/employees-akun-resign"],"nodes":11712},{"name":"Karyawan dan Hak Akses (2/4)","keys":["owner/employees-akun-tanpa-akun","owner/employees-cuti","owner/employees-cuti-koreksi","owner/employees-riwayat","owner/employees-riwayat-form","owner/employees-riwayat-kosong","owner/employees-penempatan","owner/employees-hapus","owner/employees-undangan","owner/employees-undangan-akun","owner/employees-undangan-gagal","owner/employees-impor","owner/employees-impor-galat"],"nodes":11668},{"name":"Karyawan dan Hak Akses (3/4)","keys":["owner/employees-impor-siap","owner/employees-data-impor","owner/employees-data-impor-galat","owner/employees-data-impor-siap","owner/account-access","owner/account-access-terpilih","owner/account-access-kosong","owner/account-access-galat","owner/warning-letters","owner/warning-letters-kosong","owner/warning-letters-terbit","owner/warning-letters-terbit-awal","owner/warning-letters-terbit-blokir","owner/warning-letters-detail","owner/warning-letters-cabut","owner/warning-letters-evaluasi-due","owner/warning-letters-evaluasi"],"nodes":11484},{"name":"Karyawan dan Hak Akses (4/4)","keys":["owner/warning-letters-dicabut","owner/warning-letters-pengaturan","owner/role-permissions","owner/role-permissions-galat","owner/role-permissions-karyawan","owner/role-permissions-karyawan-kosong","owner/role-permissions-karyawan-galat","owner/role-permissions-karyawan-tambah","owner/role-permissions-karyawan-tambah-pilih","owner/role-permissions-karyawan-ubah","owner/role-permissions-karyawan-cabut"],"nodes":6374},{"name":"Organisasi (1/2)","keys":["owner/companies","owner/companies-kosong","owner/companies-galat","owner/companies-tambah","owner/companies-ubah","owner/companies-hapus","owner/departments","owner/departments-memuat","owner/departments-kosong","owner/departments-galat","owner/departments-tambah","owner/departments-ubah","owner/departments-ubah-perusahaan","owner/departments-hapus","owner/departments-anggota","owner/positions","owner/positions-level-1","owner/positions-kosong","owner/positions-tanpa-departemen","owner/positions-galat","owner/positions-tambah","owner/positions-ubah"],"nodes":9482},{"name":"Organisasi (2/2)","keys":["owner/positions-hapus","owner/org-chart","owner/org-chart-memuat","owner/org-chart-kosong","owner/org-chart-galat","owner/org-chart-peringatan","owner/org-chart-pindah","owner/org-chart-lepas-atasan","owner/office-locations","owner/office-locations-kosong","owner/office-locations-galat","owner/office-locations-tambah","owner/office-locations-ubah","owner/office-locations-hapus"],"nodes":7556},{"name":"Kehadiran dan Jadwal (1/3)","keys":["owner/attendances","owner/attendances-kosong","owner/attendances-galat","owner/attendances-detail","owner/attendances-detail-mangkir","owner/attendance-requests","owner/attendance-requests-kosong","owner/attendance-requests-galat","owner/attendance-requests-detail","owner/attendance-requests-detail-memuat","owner/attendance-policy","owner/attendance-policy-aman","owner/attendance-policy-belum-skor","owner/attendance-policy-kosong","owner/attendance-policy-galat","owner/attendance-policy-memuat","owner/roster","owner/roster-kosong","owner/roster-galat"],"nodes":9270},{"name":"Kehadiran dan Jadwal (2/3)","keys":["owner/roster-memuat","owner/roster-sel","owner/roster-sel-kosong","owner/roster-impor","owner/roster-impor-memeriksa","owner/roster-impor-siap","owner/roster-impor-galat","owner/shifts","owner/shifts-kosong","owner/shifts-galat","owner/shifts-tambah"],"nodes":9100},{"name":"Kehadiran dan Jadwal (3/3)","keys":["owner/shifts-tambah-malam","owner/shifts-ubah","owner/shifts-hapus","owner/shifts-impor","owner/shifts-impor-siap","owner/shifts-impor-galat","owner/holidays","owner/holidays-kosong","owner/holidays-galat","owner/holidays-tambah","owner/holidays-tambah-galat","owner/holidays-hapus"],"nodes":6130},{"name":"Cuti dan Lembur (1/3)","keys":["owner/leave-requests","owner/leave-requests-kosong","owner/leave-requests-galat","owner/leave-balances","owner/leave-balances-kosong","owner/leave-balances-galat","owner/leave-balances-detail","owner/leave-balances-koreksi","owner/leave-balance","owner/leave-balance-detail","owner/leave-balance-koreksi","owner/leave-balance-memuat","owner/leave-settings","owner/leave-settings-diubah","owner/leave-settings-memuat","owner/leave-settings-galat","owner/leave-settings-khusus","owner/leave-settings-khusus-kosong","owner/leave-settings-aturan-kuota","owner/leave-settings-aturan-kuota-terisi","owner/leave-settings-jenis","owner/leave-settings-tutup-buku","owner/leave-settings-tutup-buku-hasil"],"nodes":11080},{"name":"Cuti dan Lembur (2/3)","keys":["owner/leave-settings-tutup-buku-sudah","owner/overtime-requests","owner/overtime-requests-kosong","owner/overtime-requests-galat","owner/overtime-requests-detail","owner/overtime-requests-detail-memuat","owner/overtime-summary","owner/overtime-summary-kosong","owner/overtime-summary-galat","owner/overtime-settings","owner/overtime-settings-memuat","owner/overtime-settings-galat","owner/my-my-leave","owner/my-my-leave-rincian","owner/my-my-leave-terkunci","owner/my-my-leave-kosong","owner/my-my-leave-galat","owner/my-my-leave-memuat","owner/my-my-leave-tanpa-karyawan","owner/my-my-leave-ajukan","owner/my-my-leave-ajukan-pratinjau","owner/my-my-leave-ajukan-melebihi","owner/my-my-leave-ajukan-lampiran","owner/my-my-leave-ajukan-galat","owner/my-my-overtime","owner/my-my-overtime-kosong","owner/my-my-overtime-galat","owner/my-my-overtime-memuat"],"nodes":11124},{"name":"Cuti dan Lembur (3/3)","keys":["owner/my-my-overtime-tanpa-karyawan","owner/my-my-overtime-ajukan","owner/my-my-overtime-ajukan-hari-kerja","owner/my-my-overtime-ajukan-libur","owner/my-my-overtime-ajukan-galat","employee/leave","employee/leave-rincian","employee/leave-terkunci","employee/leave-kosong","employee/leave-galat","employee/leave-memuat","employee/leave-tanpa-karyawan","employee/leave-ajukan","employee/leave-ajukan-pratinjau","employee/leave-ajukan-melebihi","employee/leave-ajukan-lampiran","employee/leave-ajukan-galat","employee/overtime","employee/overtime-kosong","employee/overtime-galat","employee/overtime-memuat","employee/overtime-tanpa-karyawan","employee/overtime-ajukan","employee/overtime-ajukan-hari-kerja","employee/overtime-ajukan-libur","employee/overtime-ajukan-galat"],"nodes":6960},{"name":"Payroll (1/5)","keys":["owner/payroll","owner/payroll-kosong","owner/payroll-galat","owner/payroll-buat","owner/payroll-buat-galat","owner/payroll-detail","owner/payroll-detail-final","owner/payroll-detail-batal","owner/payroll-detail-kosong","owner/payroll-detail-galat","owner/payroll-detail-slip","owner/payroll-detail-slip-tanpa-rekening","owner/payroll-detail-finalkan","owner/payroll-detail-batalkan","owner/payroll-detail-hapus","owner/payroll-detail-pph","owner/payroll-detail-pph-kosong","owner/payroll-detail-pph-galat","owner/payroll-report","owner/payroll-report-departemen","owner/payroll-report-komponen"],"nodes":11944},{"name":"Payroll (2/5)","keys":["owner/payroll-report-kosong","owner/payroll-report-galat","owner/additional-salaries","owner/additional-salaries-kosong","owner/additional-salaries-tidak-cocok","owner/additional-salaries-galat","owner/additional-salaries-tambah","owner/additional-salaries-tambah-berulang","owner/additional-salaries-tambah-galat","owner/additional-salaries-ubah","owner/additional-salaries-hapus","owner/additional-salaries-impor","owner/additional-salaries-impor-pratinjau","owner/additional-salaries-impor-galat","owner/additional-salaries-impor-pesan","owner/additional-salaries-impor-tanpa-perubahan","owner/salary-assignments","owner/salary-assignments-kosong","owner/salary-assignments-tidak-cocok"],"nodes":12106},{"name":"Payroll (3/5)","keys":["owner/salary-assignments-tanpa-struktur","owner/salary-assignments-galat","owner/salary-assignments-riwayat","owner/salary-assignments-pratinjau","owner/salary-assignments-pratinjau-galat","owner/salary-assignments-riwayat-kosong","owner/salary-assignments-hapus","owner/salary-assignments-tetapkan","owner/salary-assignments-tetapkan-galat","owner/salary-assignments-sekaligus","owner/salary-assignments-sekaligus-galat","owner/salary-structures","owner/salary-structures-kosong","owner/salary-structures-tanpa-komponen","owner/salary-structures-tanpa-perusahaan","owner/salary-structures-galat","owner/salary-structures-buat","owner/salary-structures-ubah","owner/salary-structures-ubah-khusus"],"nodes":11606},{"name":"Payroll (4/5)","keys":["owner/salary-structures-ubah-galat","owner/salary-structures-ubah-penuh","owner/salary-structures-pratinjau","owner/salary-structures-pratinjau-galat","owner/salary-structures-hapus","owner/salary-structures-hapus-dipakai","owner/salary-components","owner/salary-components-potongan","owner/salary-components-kosong","owner/salary-components-tidak-cocok","owner/salary-components-tanpa-perusahaan","owner/salary-components-galat","owner/salary-components-tambah","owner/salary-components-tambah-nominal","owner/salary-components-tambah-galat","owner/salary-components-tambah-rumus-salah","owner/salary-components-ubah","owner/salary-components-hapus"],"nodes":12000},{"name":"Payroll (5/5)","keys":["owner/payroll-settings","owner/payroll-settings-roster","owner/payroll-settings-angka-tetap","owner/payroll-settings-angka-kosong","owner/payroll-settings-galat","owner/my-salary-slips","owner/my-salary-slips-kosong","owner/my-salary-slips-belum-terhubung","owner/my-salary-slips-galat","owner/my-salary-slips-detail","owner/my-salary-slips-detail-galat","owner/my-salary-slips-detail-unduh-galat"],"nodes":5598},{"name":"Daily Timesheet (1/2)","keys":["employee/timesheet-dashboard","employee/timesheet-dashboard-tanpa-departemen","employee/timesheet-dashboard-galat","employee/timesheet-my","employee/timesheet-my-kosong","employee/timesheet-my-galat","employee/timesheet-my-memuat","employee/timesheet-my-tanpa-karyawan","employee/timesheet-my-tambah","employee/timesheet-my-tambah-banyak","employee/timesheet-my-tambah-galat","employee/timesheet-my-ubah","employee/timesheet-my-impor","employee/timesheet-my-impor-galat","employee/timesheet-my-hapus","employee/timesheet-team","employee/timesheet-team-kosong","employee/timesheet-shared"],"nodes":8060},{"name":"Daily Timesheet (2/2)","keys":["employee/timesheet-shared-kosong","owner/timesheet-dashboard","owner/my-timesheet","owner/my-timesheet-kosong","owner/my-timesheet-tambah","owner/my-timesheet-impor","owner/my-timesheet-hapus","owner/timesheet-all","owner/timesheet-all-kosong","owner/timesheet-all-galat","owner/timesheet-settings","owner/timesheet-settings-isi","owner/timesheet-settings-galat"],"nodes":6314}];


/* ===== core/runner-chunked.js ===== */
/* RUNNER CHUNKED — bagi layar per bagian (CHUNK_PLAN dari plan.js); tiap bagian = item menu plugin. Tanpa prototype. */
/* =====================================================================
 * RUNNER — membangun semua layar, menyusun ke Section, memasang prototype
 * ===================================================================== */
const PAGE_SCREENS = 'Screens';
const PAGE_FLOWS = 'Flows';
const PHONE_W = 1440, PAIR_GAP = 80, ROW_GAP = 140, SECTION_PAD = 80, PAIRS_PER_ROW = 1, SECTION_GAP = 300;

async function findOrCreatePage(name) {
  let p = figma.root.children.find((x) => x.name === name);
  if (!p) { p = figma.createPage(); p.name = name; }
  return p;
}
function isOurs(n) { return n.name.startsWith('WX ') || n.name === 'Section / Timesheet'; }

const tick = () => new Promise((r) => setTimeout(r, 0));
const notify = (m, ms) => { try { if (typeof figma.notify === 'function') figma.notify(m, { timeout: ms ?? 4000 }); } catch (e) { /* abaikan */ } };

async function buildAll(report, defs) {
  const frames = {}; // `${key}/${theme}` -> frame
  notify(`Membangun ${defs.length * 2} frame… mohon tunggu, Figma bisa terasa lambat.`, 8000);
  let n = 0;
  for (const def of defs) {
    if (++n % 10 === 0) { notify(`Membangun layar ${n}/${defs.length}…`, 2000); }
    await tick();
    for (const theme of ['light', 'dark']) {
      CURRENT = { key: def.key, theme };
      const orphans = new Set(figma.currentPage.children);
      try {
        const f = await def.build(theme);
        f.name = frameName(def, theme);
        frames[`${def.key}/${theme}`] = f;
      } catch (e) {
        for (const n of [...figma.currentPage.children]) if (!orphans.has(n)) { try { n.remove(); } catch (e2) { /* abaikan */ } }
        report.errors.push(`${def.key}/${theme}: ${e && e.message ? e.message : e}`);
      }
    }
  }
  return frames;
}

function layoutSections(frames, defs, secName, startY) {
  const sec = figma.createSection(); sec.name = secName;
  const secW = PHONE_W * 2 + PAIR_GAP + SECTION_PAD * 2;
  let cy = SECTION_PAD + 60;
  for (const def of defs) {
    const pair = ['light', 'dark'].map((t) => frames[`${def.key}/${t}`]).filter(Boolean);
    if (!pair.length) continue;
    const lbl = figma.createText(); lbl.fontName = { family: 'Inter', style: 'Semi Bold' }; lbl.fontSize = 22;
    lbl.characters = def.title; lbl.fills = [{ type: 'SOLID', color: { r: 0.15, g: 0.17, b: 0.22 } }]; lbl.name = 'WX label ' + def.title;
    sec.appendChild(lbl); lbl.x = SECTION_PAD; lbl.y = cy - 40;
    let px = SECTION_PAD, rowH = 0;
    for (const fr of pair) { sec.appendChild(fr); fr.x = px; fr.y = cy; px += PHONE_W + PAIR_GAP; rowH = Math.max(rowH, fr.height); }
    cy += rowH + ROW_GAP;
  }
  sec.resizeWithoutConstraints(secW, cy - ROW_GAP + SECTION_PAD);
  sec.x = 0; sec.y = startY;
  return sec;
}

/** Thumbnail di halaman Flows mengklon 93 frame (±7 ribu simpul) dan SANGAT berat. Ubah ke true bila ingin. */
const FLOW_THUMBNAILS = false;
/** Tema yang dipasangi prototype. Tiap tautan butuh ±1 detik di Figma; ['light'] memangkas waktu separuh. */
const WIRE_THEMES = []; // prototype web ditunda

const PUSH = { type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: 0.2 };
const MODAL = { type: 'MOVE_IN', direction: 'BOTTOM', matchLayers: false, easing: { type: 'EASE_OUT' }, duration: 0.3 };
async function wireLinks(frames, report) {
  let ok = 0, i = 0;
  notify(`Memasang ${LINKS.filter((l) => WIRE_THEMES.includes(l.theme)).length} tautan prototype (±1 detik per tautan)…`, 5000);
  const todo = LINKS.filter((l) => WIRE_THEMES.includes(l.theme));
  for (const l of todo) {
    if (++i % 25 === 0) { await tick(); notify(`Prototype ${i}/${todo.length}…`, 1500); }
    try {
      let actions;
      if (l.kind === 'back') actions = [{ type: 'BACK' }];
      else {
        const dest = frames[`${l.target}/${l.theme}`]; const from = frames[`${l.fromKey}/${l.theme}`];
        if (!dest) { report.errors.push(`link ${l.fromKey} → ${l.target}: layar tujuan tidak ada`); continue; }
        if (dest === from) continue;
        actions = [{ type: 'NODE', destinationId: dest.id, navigation: 'NAVIGATE', transition: l.kind === 'modal' ? MODAL : PUSH, preserveScrollPosition: false }];
      }
      try { await l.node.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions }]); }
      catch (e1) {
        if (actions[0].transition) { actions[0].transition = PUSH; await l.node.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions }]); } else throw e1;
      }
      ok++;
    } catch (e) { report.errors.push(`link ${l.fromKey} → ${l.target}: ${e.message || e}`); }
  }
  return ok;
}

async function writeBuildLog(report) {
  const page = await findOrCreatePage(PAGE_FLOWS);
  await figma.setCurrentPageAsync(page);
  for (const n of [...page.children]) if (n.name === 'WX Build log') n.remove();
  if (!report.errors.length) return;
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  const t = figma.createText(); t.name = 'WX Build log'; t.fontName = { family: 'Inter', style: 'Regular' }; t.fontSize = 13;
  t.characters = 'Build log (' + report.errors.length + ' masalah)\n' + dedupe(report.errors).join('\n'); t.fills = [{ type: 'SOLID', color: { r: 0.75, g: 0.1, b: 0.1 } }];
  page.appendChild(t); t.x = 0; t.y = 0;
}

/** Bagian yang dipilih dari menu Plugins (figma.command = 'chunk-N' atau 'all'). */
function selection() {
  const cmd = figma.command || 'all';
  const m = /^chunk-(\d+)$/.exec(cmd);
  if (!m || !CHUNK_PLAN[Number(m[1])]) return { all: true, name: null, defs: REGISTRY };
  const c = CHUNK_PLAN[Number(m[1])]; const keys = new Set(c.keys);
  return { all: false, name: 'WX ' + c.name, defs: REGISTRY.filter((d) => keys.has(d.key)) };
}

/** Uji cepat pembuat dasar sebelum membangun 186 frame, supaya galat mendasar langsung jelas. */
async function smokeTest() {
  const before = new Set(figma.currentPage.children);
  const sweep = () => { for (const n of [...figma.currentPage.children]) if (!before.has(n)) { try { n.remove(); } catch (e) { /* abaikan */ } } };
  let at = 'box'; const made = [];
  try {
    const f = box('WX smoke', { dir: 'V', gap: 4, pad: 8, fill: 'color/surface', stroke: 'color/border', radius: 8, theme: 'light', fixed: [200, 200] }); made.push(f);
    at = 'txt'; await txt('uji', 'body2', 'color/text/primary', 'light', { parent: f, fillW: true });
    at = 'icon'; icon('search', 20, 'color/primary', 'light', f);
    at = 'button'; await button('Uji', 'light', f);
    at = 'chip'; await chip('Uji', 'light', f, { color: 'success' });
    at = 'inputField'; await inputField('Nama', 'Budi', 'light', f, { w: 160 });
    at = 'page'; const p = await page('WX smoke page', 'dark', { role: 'owner', active: 'Karyawan', h: 700 }); made.push(p.f);
    at = 'table'; await table('dark', p.main, { cols: [{ t: 'Nama', w: 'fill' }, { t: 'Status', w: 120 }], rows: [[{ avatar: 'BS', name: 'Budi', sub: 'EMP-1' }, { chip: 'Aktif', color: 'success' }]] });
    at = 'dialog'; await dialog('dark', p.f, { title: 'Uji', actions: [{ label: 'Batal' }, { label: 'Simpan', v: 'contained' }] });
  } catch (e) {
    for (const n of made) { try { n.remove(); } catch (e2) { /* abaikan */ } }
    sweep();
    throw new Error(`smoke test gagal di "${at}": ${e && e.message ? e.message : e}`);
  }
  for (const n of made) { try { n.remove(); } catch (e2) { /* abaikan */ } }
  sweep();
}

function dedupe(list) {
  const map = new Map();
  for (const m of list) { const k = m.replace(/^[^:]+:\s*/, ''); const e = map.get(k) || { n: 0, first: m }; e.n++; map.set(k, e); }
  return [...map.values()].map((e) => (e.n > 1 ? `[${e.n}x] ${e.first}` : e.first));
}

async function main() {
  const report = { errors: [] };
  await ensureFoundations();
  await smokeTest();
  const sel = selection();
  const page = await findOrCreatePage(PAGE_SCREENS);
  await figma.setCurrentPageAsync(page);
  for (const n of [...page.children]) { if (sel.all ? isOurs(n) : n.name === sel.name) n.remove(); }

  const frames = await buildAll(report, sel.defs);
  // Letakkan di bawah section lain yang sudah ada.
  let startY = 0;
  for (const n of page.children) { if (n.type === 'SECTION' && n.name.startsWith('WX ')) startY = Math.max(startY, n.y + n.height + SECTION_GAP); }
  notify('Menyusun section…', 3000);
  const sec = layoutSections(frames, sel.defs, sel.all ? 'WX Semua layar' : sel.name, startY);
  await writeBuildLog(report);
  await figma.setCurrentPageAsync(page);
  figma.viewport.scrollAndZoomIntoView([sec]);
  return { name: sel.all ? 'semua' : sel.name, screens: sel.defs.length, frames: Object.keys(frames).length, errors: report.errors };
}

main().then((r) => {
  figma.closePlugin(`Selesai ${r.name}: ${r.frames} frame dari ${r.screens} layar, ${r.errors.length} masalah${r.errors.length ? ' (lihat halaman Flows → "WX Build log")' : ''}`);
}).catch((e) => { figma.closePlugin('GAGAL: ' + (e && e.message ? e.message : e)); });
