
/* ===== projects/workonix-mobile/theme.config.js ===== */
/* THEME CONFIG — Workonix Mobile (sumber: lib/constant/theme/app_color.dart, app_text.dart) */
const TOKEN_NAMES = [
  'color/primary', 'color/primary-dark', 'color/primary-light', 'color/primary-surface',
  'color/background', 'color/surface', 'color/border',
  'color/text/primary', 'color/text/secondary', 'color/text/disabled',
  'color/success', 'color/success-surface', 'color/warning', 'color/warning-surface',
  'color/danger', 'color/danger-surface', 'color/info', 'color/info-surface',
];

const PALETTE = { // AppPalette (app_color.dart): [light, dark]
  'color/primary': ['#1565C0', '#4C8DF6'], 'color/primary-dark': ['#0D47A1', '#0B3A82'],
  'color/primary-light': ['#42A5F5', '#90CAF9'], 'color/primary-surface': ['#E8F1FB', '#16263D'],
  'color/background': ['#F4F6F9', '#0F1419'], 'color/surface': ['#FFFFFF', '#1A2027'], 'color/border': ['#E3E8EF', '#2A333D'],
  'color/text/primary': ['#1A2027', '#E6EAF0'], 'color/text/secondary': ['#5A6672', '#9AA6B2'], 'color/text/disabled': ['#9AA4B0', '#5F6B78'],
  'color/success': ['#2E7D32', '#66BB6A'], 'color/success-surface': ['#E8F5E9', '#1B2E1F'],
  'color/warning': ['#EF6C00', '#FFA040'], 'color/warning-surface': ['#FFF3E0', '#33261A'],
  'color/danger': ['#C62828', '#EF5350'], 'color/danger-surface': ['#FFEBEE', '#3A1D1F'],
  'color/info': ['#0277BD', '#4FC3F7'], 'color/info-surface': ['#E1F5FE', '#15303D'],
};

const TEXT_STYLES = { // AppText (app_text.dart)
  display: ['text/display', 'Bold', 34, 37], h1: ['text/h1', 'Bold', 22, 28], h2: ['text/h2', 'Semi Bold', 17, 22],
  body: ['text/body', 'Regular', 14, 20], 'body-strong': ['text/body-strong', 'Semi Bold', 14, 20],
  caption: ['text/caption', 'Regular', 12, 17], label: ['text/label', 'Semi Bold', 11, 14, 4],
};

/** Tab bottom nav: [ikon, label, kunci layar tujuan, {badge:true}?] */
const BOTTOM_NAV = [['fingerprint', 'Absensi', 'absensi-home'], ['umbrella', 'Cuti', 'cuti-list'], ['inbox', 'Persetujuan', 'persetujuan-inbox', { badge: true }], ['person', 'Profil', 'profil']];


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


/* ===== core/kit-mobile.js ===== */
/* KIT MOBILE — komponen layar ponsel (360 x 800): badge, chip, button, card, field, phone, bottomNav, fab, ... Memakai BOTTOM_NAV dari theme.config.js. */
const TONES = {
  success: ['color/success-surface', 'color/success'], info: ['color/info-surface', 'color/info'],
  warning: ['color/warning-surface', 'color/warning'], danger: ['color/danger-surface', 'color/danger'],
  neutral: ['color/background', 'color/text/secondary'],
};
/** StatusBadge (app_widget.dart): tone = success|info|warning|danger|neutral. */
async function badge(label, tone, ic, theme, parent) {
  const [bg, fg] = TONES[tone];
  const b = box('badge/' + label, { dir: 'H', gap: 5, ay: 'CENTER', pad: [5, 10, 5, 10], fill: bg, radius: 20, theme, parent });
  if (ic) icon(ic, 13, fg, theme, b);
  await txt(label, 'label', fg, theme, { parent: b });
  return b;
}
/** Chip pilihan (pil). */
async function chip(label, selected, ic, theme, parent, o = {}) {
  const c = box('chip/' + label, { dir: 'H', gap: 6, ay: 'CENTER', pad: o.pad ?? [8, 12, 8, 12], fill: selected ? 'color/primary-surface' : 'color/surface', stroke: selected ? 'color/primary' : 'color/border', sw: selected ? 1.5 : 1, radius: 999, theme, parent });
  if (ic) icon(ic, 15, selected ? 'color/primary' : 'color/text/secondary', theme, c);
  await txt(label, 'body-strong', selected ? 'color/primary' : 'color/text/primary', theme, { parent: c });
  return c;
}
/** Tombol penuh (FilledButton): 52 tinggi, radius 12. variant: primary|outline|text|danger. */
async function button(label, theme, parent, o = {}) {
  const v = o.variant ?? 'primary';
  const b = box('Button/' + label, { dir: 'H', gap: 8, ax: 'CENTER', ay: 'CENTER', fill: v === 'primary' ? 'color/primary' : v === 'danger' ? 'color/danger' : null, stroke: v === 'outline' ? 'color/border' : null, radius: 12, theme, parent, fixed: [o.w ?? 328, o.h ?? (v === 'text' ? 44 : 52)] });
  if (o.fillW !== false && !o.w) b.layoutSizingHorizontal = 'FILL';
  const fg = v === 'primary' || v === 'danger' ? 'white' : 'color/primary';
  if (o.icon) icon(o.icon, 20, fg, theme, b);
  await txt(label, 'body-strong', fg, theme, { parent: b });
  return b;
}
/** Kartu bertepi (Card theme: radius 14, border). */
function card(theme, parent, o = {}) {
  return box(o.name ?? 'Card', { dir: o.dir ?? 'V', gap: o.gap ?? 0, pad: o.pad ?? 16, fill: 'color/surface', stroke: 'color/border', radius: 14, theme, parent, fillW: o.fillW !== false, ay: o.ay, ax: o.ax });
}
/** Kolom isian (InputDecoration): kotak bertepi radius 12. */
async function field(placeholder, theme, parent, o = {}) {
  const f = box('TextField', { dir: 'H', gap: 10, ay: 'CENTER', pad: [14, 14, 14, 14], fill: 'color/surface', stroke: o.focus ? 'color/primary' : o.error ? 'color/danger' : 'color/border', sw: o.focus ? 1.6 : 1, radius: 12, theme, parent, fillW: true });
  if (o.icon) icon(o.icon, 20, 'color/text/secondary', theme, f);
  await txt(o.value ?? placeholder, 'body', o.value ? 'color/text/primary' : 'color/text/disabled', theme, { parent: f, fillW: true });
  if (o.trailing) icon(o.trailing, 20, 'color/text/secondary', theme, f);
  return f;
}
/** Label kecil KAPITAL di atas bagian. */
function sectionLabel(text, theme, parent) { return txt(text, 'label', 'color/text/secondary', theme, { parent, upper: true }); }
/** InfoRow (ikon + teks keterangan). */
async function infoRow(ic, text, theme, parent) {
  const r = box('InfoRow', { dir: 'H', gap: 8, ay: 'CENTER', theme, parent, fillW: true });
  icon(ic, 15, 'color/text/secondary', theme, r);
  await txt(text, 'caption', 'color/text/secondary', theme, { parent: r, fillW: true });
  return r;
}
/** Avatar lingkaran dengan inisial. */
async function avatar(initials, size, theme, parent) {
  const a = box('avatar', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', radius: 999, theme, parent, fixed: [size, size] });
  await txt(initials, 'label', 'color/primary', theme, { parent: a, size: Math.max(9, Math.round(size * 0.38)) });
  return a;
}
/** EmptyState / ErrorState (app_widget.dart). tone: 'danger' untuk error. */
async function emptyState(iconName, title, msg, theme, parent, tone) {
  const w = box('EmptyState', { dir: 'V', gap: 18, ay: 'CENTER', pad: [48, 32, 32, 32], theme, parent, fillW: true });
  const c = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: tone === 'danger' ? 'color/danger-surface' : 'color/primary-surface', radius: 999, theme, parent: w, fixed: [68, 68] });
  icon(iconName, 30, tone === 'danger' ? 'color/danger' : 'color/primary', theme, c);
  await txt(title, 'h2', 'color/text/primary', theme, { parent: w, fillW: true, align: 'CENTER' });
  await txt(msg, 'caption', 'color/text/secondary', theme, { parent: w, fillW: true, align: 'CENTER' });
  if (tone === 'danger') { const b = box('retry', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [12, 24, 12, 24], stroke: 'color/border', radius: 12, theme, parent: w }); await txt('Coba lagi', 'body-strong', 'color/primary', theme, { parent: b }); }
  return w;
}
/** Hero gradasi biru (kartu ringkasan). Mengembalikan { hero, col } — isi kolom teks sendiri. */
function heroCard(theme, parent) {
  const h = box('HeroCard', { dir: 'H', ay: 'CENTER', pad: 18, radius: 16, theme, parent, fillW: true });
  h.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [
    { position: 0, color: { ...hexToRgb(PALETTE['color/primary'][theme === 'light' ? 0 : 1]), a: 1 } },
    { position: 1, color: { ...hexToRgb(PALETTE['color/primary-dark'][theme === 'light' ? 0 : 1]), a: 1 } }] }];
  const col = box('text', { dir: 'V', gap: 4, theme, parent: h }); col.layoutGrow = 1; col.layoutSizingHorizontal = 'FILL';
  return { hero: h, col };
}

/**
 * Cangkang ponsel 360 x h (default 800): status bar 28, app bar 56 (judul + panah kembali), badan, gesture bar 24.
 * o: h, back (false = tanpa panah), gap, pad ([t,r,b,l], bawaan [4,16,24,16]), actions (nama ikon di kanan app bar),
 *    noAppBar (true untuk layar login/penuh).
 * Mengembalikan { f, body, appBar }. body = auto-layout vertikal yang tumbuh mengisi sisa tinggi.
 */
async function phone(name, theme, title, o = {}) {
  const f = box(name, { dir: 'V', fill: 'color/background', theme, fixed: [360, o.h ?? 800], clip: true });
  const sb = box('status bar', { dir: 'H', ax: 'SPACE_BETWEEN', ay: 'CENTER', pad: [0, 16, 0, 16], fill: o.noAppBar ? 'color/background' : 'color/surface', theme, parent: f, fixed: [360, 28] });
  sb.layoutSizingHorizontal = 'FILL';
  await txt('09:41', 'caption', 'color/text/primary', theme, { parent: sb }); await txt('100%', 'caption', 'color/text/primary', theme, { parent: sb });
  let ab = null;
  if (!o.noAppBar) {
    ab = box('app bar', { dir: 'H', gap: 16, ay: 'CENTER', pad: [0, 16, 0, 16], fill: 'color/surface', theme, parent: f, fixed: [360, 56] });
    ab.layoutSizingHorizontal = 'FILL';
    if (o.back !== false) { const b = icon('back', 24, 'color/text/primary', theme, ab); b.name = 'icon/back'; }
    const t = await txt(title, 'h2', 'color/text/primary', theme, { parent: ab }); t.layoutGrow = 1; t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT';
    for (const a of o.actions ?? []) icon(a, 22, 'color/text/primary', theme, ab);
  }
  const body = box('body', { dir: 'V', gap: o.gap ?? 0, pad: o.pad ?? [4, 16, 24, 16], theme, parent: f, clip: true });
  body.layoutSizingHorizontal = 'FILL'; body.layoutGrow = 1;
  const nav = box('system nav', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: o.noAppBar ? 'color/background' : 'color/surface', theme, parent: f, fixed: [360, 24] });
  nav.layoutSizingHorizontal = 'FILL';
  const pill = figma.createRectangle(); pill.name = 'gesture bar'; pill.resize(110, 4); pill.cornerRadius = 2; pill.fills = [pv(theme, 'color/text/disabled')]; nav.appendChild(pill);
  return { f, body, appBar: ab };
}
/** Bilah bawah menempel (mis. tombol Simpan). Tambahkan SEBELUM gesture bar: pakai phone().f dan sisipkan lewat insertChild. */
function bottomBar(theme, frame, o = {}) {
  const bar = box('bottom bar', { dir: 'V', gap: 10, pad: [12, 16, 12, 16], fill: 'color/surface', stroke: 'color/border', theme });
  frame.insertChild(frame.children.length - 1, bar); bar.layoutSizingHorizontal = 'FILL';
  return bar;
}
/** FAB melayang (absolut) di kanan bawah frame ponsel. */
async function fab(theme, frame, label, ic) {
  const f = box('FAB', { dir: 'H', gap: 8, ay: 'CENTER', pad: [0, 20, 0, 16], fill: 'color/primary', radius: 999, theme, parent: frame });
  f.counterAxisSizingMode = 'FIXED'; f.resize(110, 48);
  f.layoutPositioning = 'ABSOLUTE'; f.x = 360 - 16 - 118; f.y = frame.height - 24 - 16 - 48;
  icon(ic ?? 'plus', 22, 'white', theme, f); await txt(label, 'body-strong', 'white', theme, { parent: f });
  f.effects = [{ type: 'DROP_SHADOW', color: { r: 0.08, g: 0.4, b: 0.75, a: 0.35 }, offset: { x: 0, y: 6 }, radius: 16, spread: 0, visible: true, blendMode: 'NORMAL' }];
  return f;
}


/* ---------- Bottom navigation (constant/bottom_bar/bottom_main.dart) ---------- */
/**
 * Bottom nav 4 tab, ditempel di dasar frame ponsel (sebelum gesture bar).
 * active: 0 Absensi | 1 Cuti | 2 Persetujuan | 3 Profil. o.badge = angka merah pada Persetujuan.
 * Tab dari BOTTOM_NAV (theme.config.js): [ikon, label, kunciLayar, {badge:true}?]. Otomatis membuat tautan prototype ke tab lain.
 */
async function bottomNav(th, frame, active, o = {}) {
  const bar = box('BottomNav', { dir: 'H', pad: [6, 0, 6, 0], fill: 'color/surface', stroke: 'color/border', theme: th });
  frame.insertChild(frame.children.length - 1, bar); bar.layoutSizingHorizontal = 'FILL';
  for (const [i, [ic, label, targetKey, flags]] of BOTTOM_NAV.entries()) {
    const sel = i === active; const color = sel ? 'color/primary' : 'color/text/disabled';
    const it = box('tab/' + label, { dir: 'V', gap: 3, ay: 'CENTER', pad: [8, 0, 8, 0], theme: th, parent: bar }); it.layoutGrow = 1; it.layoutSizingHorizontal = 'FILL';
    const pillBox = box('icon pill', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [4, 16, 4, 16], fill: sel ? 'color/primary-surface' : null, radius: 20, theme: th, parent: it });
    icon(ic, 22, color, th, pillBox);
    await txt(label, 'label', color, th, { parent: it });
    if (flags && flags.badge && o.badge) {
      const bd = box('badge', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [1, 5, 1, 5], fill: 'color/danger', stroke: 'color/surface', sw: 1.5, radius: 10, theme: th, parent: it });
      bd.layoutPositioning = 'ABSOLUTE'; bd.x = 62; bd.y = 4;
      await txt(String(o.badge), 'label', 'white', th, { parent: bd, size: 10 });
    }
    if (i !== active) link(it, targetKey);
  }
  return bar;
}


/* ===== projects/workonix-mobile/screens/10-timesheet.js ===== */
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


/* ===== projects/workonix-mobile/screens/20-auth-profil.js ===== */
/* Auth dan Profil: splash, login, ganti sandi, profil, data diri.
 * Sumber: constant/splash, features/auth/{login,change-password,profile}. Semua nama top-level berawalan 'au'. */
const AU_GROUP = 'Auth dan Profil';

registerIcons({
  'au-at': '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
  'au-arrow': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'au-key': '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>',
  'au-wave': '<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-3l-2-4 2-1 2 2"/>',
  'au-mailopen': '<path d="M3 10l9-6 9 6v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 10l9 6 9-6"/>',
  'au-badge': '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.5-1.5 1.7-2 3-2s2.5.5 3 2M14 10h4M14 14h3"/>',
  'au-phone': '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  'au-receipt': '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  'au-moon': '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  'au-cloudoff': '<path d="M7 18a4 4 0 0 1-.5-7.9A6 6 0 0 1 18 9.5a4 4 0 0 1 1 7.5M3 3l18 18"/>',
  'au-refresh': '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
});

/* ---------- pembantu umum ---------- */
const auBlack = (a) => ({ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: a });
const auWhite = (a) => ({ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: a });

/** Gradasi diagonal (kepala biru Profil / Login). Hex hanya untuk gradasi. */
function auGradient(node, th, c1, c2) {
  const i = th === 'light' ? 0 : 1;
  node.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [
    { position: 0, color: { ...hexToRgb(PALETTE[c1][i]), a: 1 } },
    { position: 1, color: { ...hexToRgb(PALETTE[c2][i]), a: 1 } }] }];
}

/** Lingkaran cahaya (SoftGlow) absolut di belakang isi frame ponsel. */
function auGlow(f, th, size, color, x, y) {
  const g = box('SoftGlow', { dir: 'H', fill: color, radius: 999, theme: th, parent: f, fixed: [size, size] });
  g.layoutPositioning = 'ABSOLUTE'; g.x = x; g.y = y; g.opacity = 0.09;
  f.insertChild(1, g);
  return g;
}

/** Logo Workonix. dark=true: tanpa kotak biru, teks putih (workonix-logo-dark.svg). */
async function auLogo(th, parent, dark, size) {
  const r = box('logo', { dir: 'H', gap: 8, ay: 'CENTER', theme: th, parent });
  if (dark) {
    await txt('workonix', 'display', 'white', th, { parent: r, size });
    const dot = box('dot', { dir: 'H', fill: 'color/primary-light', radius: 999, theme: th, parent: r, fixed: [Math.round(size * 0.26), Math.round(size * 0.26)] });
    return r;
  }
  const m = box('mark', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary', radius: Math.round(size * 0.3), theme: th, parent: r, fixed: [size, size] });
  await txt('W', 'h1', 'white', th, { parent: m, size: Math.round(size * 0.6) });
  await txt('workonix', 'display', 'color/text/primary', th, { parent: r, size: Math.round(size * 0.78) });
  return r;
}

/** Teks dengan opasitas (mis. Colors.white70). */
async function auTxtA(str, style, color, th, parent, a, o = {}) {
  const t = await txt(str, style, color, th, { parent, ...o }); t.opacity = a; return t;
}

/** Scrim hitam semi-transparan penuh di atas frame. */
function auScrim(f, th, h) {
  const s = figma.createRectangle(); s.name = 'scrim'; s.resize(360, h); s.fills = [auBlack(0.45)];
  f.appendChild(s); s.layoutPositioning = 'ABSOLUTE'; s.x = 0; s.y = 0;
  return s;
}

/** Bidang kecil berputar (CircularProgressIndicator) sebagai cincin. */
function auSpinner(th, parent, size, color) {
  const s = box('spinner', { dir: 'H', stroke: color, sw: 2, radius: 999, theme: th, parent, fixed: [size, size] });
  s.opacity = 0.85; return s;
}

/* =====================================================================
 * SPLASH
 * ===================================================================== */
registerScreen({ key: 'splash', group: AU_GROUP, title: 'Splash', build: async (th) => {
  const { f, body } = await phone('x', th, '', { noAppBar: true, pad: [0, 24, 0, 24] });
  f.fills = [pv(th, 'color/surface')];
  f.children[0].fills = []; f.children[f.children.length - 1].fills = [];
  body.primaryAxisAlignItems = 'SPACE_BETWEEN'; body.counterAxisAlignItems = 'CENTER';
  auGlow(f, th, 360, 'color/primary-light', 360 - 360 + 120, -140 + 28);
  auGlow(f, th, 380, 'color/primary', -140, 800 - 380 + 160 - 24);
  gap(body, 14);
  const mid = box('center', { dir: 'V', gap: 14, ay: 'CENTER', theme: th, parent: body });
  await auLogo(th, mid, th === 'dark', 52);
  await txt('Absensi & HR dalam genggaman', 'caption', 'color/text/secondary', th, { parent: mid });
  const foot = box('footer', { dir: 'H', ax: 'CENTER', pad: [0, 0, 24, 0], theme: th, parent: body, fillW: true });
  await txt('© 2026 Workonix', 'label', 'color/text/disabled', th, { parent: foot });
  link(mid, 'login');
  return f;
} });

/* =====================================================================
 * LOGIN
 * ===================================================================== */
async function auLoginHeader(th, parent) {
  const h = box('Header', { dir: 'V', pad: [28, 24, 68, 24], theme: th, parent, fillW: true, clip: true });
  auGradient(h, th, 'color/primary-dark', 'color/primary-dark');
  h.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [
    { position: 0, color: { ...hexToRgb(PALETTE['color/primary-dark'][th === 'light' ? 0 : 1]), a: 1 } },
    { position: 1, color: { ...hexToRgb('#0A2C66'), a: 1 } }] }];
  const glow = box('SoftGlow', { dir: 'H', fill: 'color/primary-light', radius: 999, theme: th, parent: h, fixed: [380, 380] });
  glow.layoutPositioning = 'ABSOLUTE'; glow.x = 360 - 380 + 130; glow.y = -150; glow.opacity = 0.14;
  await auLogo(th, h, true, 36);
  gap(h, 40);
  const pill = box('greeting', { dir: 'H', gap: 6, ay: 'CENTER', pad: [5, 10, 5, 10], radius: 20, theme: th, parent: h });
  pill.fills = [auWhite(0.12)];
  icon('au-wave', 13, 'white', th, pill); await txt('Selamat pagi', 'label', 'white', th, { parent: pill });
  gap(h, 14);
  for (const [s, c] of [['Siap mulai', 'white'], ['bekerja hari ini?', 'color/primary-light']]) {
    const t = await txt(s, 'display', c, th, { parent: h, size: 30 }); t.lineHeight = { unit: 'PIXELS', value: 34.5 };
  }
  // tutup putih melengkung di dasar header
  const cap = box('sheet cap', { dir: 'H', fill: 'color/surface', radius: 28, theme: th, parent: h, fixed: [360, 28] });
  cap.bottomLeftRadius = 0; cap.bottomRightRadius = 0;
  cap.layoutPositioning = 'ABSOLUTE'; cap.x = 0; cap.y = 279 - 28;
  return h;
}
async function auFieldLabel(text, th, parent) { await txt(text, 'body-strong', 'color/text/primary', th, { parent }); gap(parent, 8); }

/** mode: 'aktif' (terisi) | 'kosong' (tombol nonaktif) | 'memuat' (spinner). */
async function auLoginBtn(th, parent, mode) {
  const dis = mode !== 'aktif';
  const b = box('Button/Masuk', { dir: 'H', gap: 8, ax: 'CENTER', ay: 'CENTER', fill: dis ? 'color/border' : 'color/primary', radius: 12, theme: th, parent, fixed: [312, 52] });
  b.layoutSizingHorizontal = 'FILL';
  if (mode === 'memuat') auSpinner(th, b, 20, 'white');
  else {
    const fg = dis ? 'color/text/disabled' : 'white';
    await txt('Masuk', 'body-strong', fg, th, { parent: b }); icon('au-arrow', 18, fg, th, b);
  }
  return b;
}

/** o: mode, error (teks), filled. */
async function auLogin(th, o = {}) {
  const { f, body } = await phone('x', th, '', { noAppBar: true, h: 880, pad: [0, 0, 0, 0] });
  f.fills = [pv(th, 'color/surface')];
  f.children[0].fills = [pv(th, 'color/primary-dark')]; // status bar di atas kepala biru
  f.children[f.children.length - 1].fills = [pv(th, 'color/surface')];
  const sbTexts = f.children[0].findAll((n) => n.type === 'TEXT');
  for (const t of sbTexts) t.fills = [WHITE_PAINT];
  await auLoginHeader(th, body);
  const sheet = box('sheet', { dir: 'V', pad: [0, 24, 16, 24], theme: th, parent: body, fillW: true });
  await txt('Masuk ke akun Anda', 'h1', 'color/text/primary', th, { parent: sheet }); gap(sheet, 4);
  await txt('Gunakan email kantor atau email pribadi yang terdaftar di HR.', 'caption', 'color/text/secondary', th, { parent: sheet, fillW: true });
  gap(sheet, 28);
  const filled = o.mode !== 'kosong';
  const dim = o.mode === 'memuat';
  await auFieldLabel('Email kantor atau pribadi', th, sheet);
  const e = await field('nama@perusahaan.com atau email pribadi', th, sheet, { icon: 'au-at', value: filled ? 'budi@perusahaan.co.id' : null });
  if (dim) e.opacity = 0.6;
  gap(sheet, 18);
  await auFieldLabel('Password', th, sheet);
  const p = await field('Masukkan password', th, sheet, { icon: 'lock', trailing: 'eyeoff', value: filled ? '••••••••••' : null });
  if (dim) p.opacity = 0.6;
  if (o.error) {
    gap(sheet, 16);
    const eb = box('ErrorBox', { dir: 'H', gap: 10, pad: 14, fill: 'color/danger-surface', stroke: 'color/danger', radius: 12, theme: th, parent: sheet, fillW: true });
    eb.strokes = [{ ...pv(th, 'color/danger'), opacity: 0.2 }];
    icon('alert', 18, 'color/danger', th, eb);
    await txt(o.error, 'body', 'color/danger', th, { parent: eb, fillW: true });
  }
  gap(sheet, 28);
  const go = await auLoginBtn(th, sheet, o.mode ?? 'aktif');
  gap(sheet, 16);
  const help = await button('Belum punya password?', th, sheet, { variant: 'text' });
  if (!o.noLinks) {
    if (!o.error || o.mode === 'aktif') link(go, 'absensi-home');
    link(help, 'login-bantuan', 'modal');
    if (o.mode === 'aktif' && !o.error) { /* login sukses -> absensi-home; wajib ganti sandi -> ganti-sandi */ }
  }
  return f;
}
registerScreen({ key: 'login', group: AU_GROUP, title: 'Login', build: async (th) => {
  const f = await auLogin(th, { mode: 'aktif' });
  const go = f.findOne((n) => n.name === 'Button/Masuk');
  // login pertama / sandi sementara -> wajib ganti sandi: tautan sekunder lewat teks bantuan tidak ada di Dart; alur utama ke absensi-home
  return f;
} });
registerScreen({ key: 'login-kosong', group: AU_GROUP, title: 'Login (kosong, tombol nonaktif)', build: (th) => auLogin(th, { mode: 'kosong' }) });
registerScreen({ key: 'login-memuat', group: AU_GROUP, title: 'Login (memuat)', build: (th) => auLogin(th, { mode: 'memuat', noLinks: true }) });
registerScreen({ key: 'login-error', group: AU_GROUP, title: 'Login (kata sandi salah)', build: async (th) => {
  const f = await auLogin(th, { mode: 'aktif', error: 'Email atau password salah.' });
  return f;
} });
registerScreen({ key: 'login-error-batas', group: AU_GROUP, title: 'Login (batas percobaan)', build: (th) => auLogin(th, { mode: 'aktif', error: 'Terlalu banyak percobaan masuk. Coba lagi beberapa menit lagi.' }) });

/* Bottom sheet "Login pertama kali" (modal) */
registerScreen({ key: 'login-bantuan', group: AU_GROUP, title: 'Login: bantuan login pertama', build: async (th) => {
  const f = await auLogin(th, { mode: 'kosong', noLinks: true });
  auScrim(f, th, 880);
  const s = box('BottomSheet', { dir: 'V', pad: [12, 24, 24, 24], fill: 'color/surface', radius: 24, theme: th, parent: f, fixed: [360, 372] });
  s.bottomLeftRadius = 0; s.bottomRightRadius = 0; s.layoutPositioning = 'ABSOLUTE'; s.x = 0; s.y = 880 - 372;
  const hw = box('handle wrap', { dir: 'H', ax: 'CENTER', theme: th, parent: s, fillW: true });
  const hd = figma.createRectangle(); hd.name = 'handle'; hd.resize(36, 4); hd.cornerRadius = 2; hd.fills = [pv(th, 'color/border')]; hw.appendChild(hd);
  gap(s, 24);
  const ic = box('icon', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'color/primary-surface', radius: 14, theme: th, parent: s, fixed: [48, 48] });
  icon('au-mailopen', 24, 'color/primary', th, ic);
  gap(s, 16);
  await txt('Login pertama kali', 'h2', 'color/text/primary', th, { parent: s, fillW: true }); gap(s, 8);
  await txt('Cek email undangan dari HR, lalu buat password Anda lewat tautan di dalamnya. Setelah itu kembali ke sini dan masuk dengan email kantor Anda.', 'body', 'color/text/secondary', th, { parent: s, fillW: true }); gap(s, 8);
  await txt('Tidak menemukan emailnya? Periksa folder spam, atau minta HR mengirim ulang undangan.', 'caption', 'color/text/secondary', th, { parent: s, fillW: true });
  gap(s, 24);
  const ok = await button('Mengerti', th, s);
  link(ok, 'login', 'back');
  return f;
} });

/* =====================================================================
 * GANTI SANDI (tanpa tombol kembali: automaticallyImplyLeading false)
 * ===================================================================== */
/** o: mismatch (teks "Password tidak sama"), error (kotak galat server), loading. */
async function auChangePw(th, o = {}) {
  const { f, body } = await phone('x', th, 'Buat Password Baru', { back: false, pad: [24, 24, 24, 24], h: 800 });
  f.fills = [pv(th, 'color/surface')];
  const info = box('info', { dir: 'H', gap: 10, pad: 14, fill: 'color/primary-surface', radius: 12, theme: th, parent: body, fillW: true });
  icon('lock', 18, 'color/primary', th, info);
  await txt('Password Anda perlu diganti sebelum bisa memakai aplikasi. Pilih password yang hanya Anda tahu — HR tidak bisa melihatnya.', 'caption', 'color/primary-dark', th, { parent: info, fillW: true });
  // Teks di atas primary-surface memakai primaryDark di Dart; di mode gelap token ini tetap terbaca.
  gap(body, 24);
  const dim = o.loading ? 0.6 : 1;
  const cur = await field('Password saat ini', th, body, { icon: 'au-key', trailing: 'eyeoff', value: o.filled ? '••••••••' : null }); cur.opacity = dim; gap(body, 14);
  const nw = await field('Password baru', th, body, { icon: 'lock', trailing: 'eyeoff', value: o.filled ? '••••••••••' : null }); nw.opacity = dim;
  gap(body, 4);
  const hp = box('helper', { dir: 'H', pad: [0, 14, 0, 14], theme: th, parent: body, fillW: true });
  await txt('Minimal 8 karakter', 'caption', 'color/text/secondary', th, { parent: hp, fillW: true });
  gap(body, 10);
  const cf = await field('Ulangi password baru', th, body, { icon: 'lock', value: o.filled ? (o.mismatch ? '••••••••' : '••••••••••') : null }); cf.opacity = dim;
  if (o.mismatch) {
    gap(body, 8);
    const r = box('mismatch', { dir: 'H', gap: 6, ay: 'CENTER', theme: th, parent: body, fillW: true });
    icon('alert', 15, 'color/danger', th, r); await txt('Password tidak sama', 'caption', 'color/danger', th, { parent: r });
  }
  if (o.error) {
    gap(body, 16);
    const eb = box('ErrorBox', { dir: 'H', gap: 10, pad: 14, fill: 'color/danger-surface', radius: 12, theme: th, parent: body, fillW: true });
    icon('alert', 18, 'color/danger', th, eb);
    await txt(o.error, 'body', 'color/danger', th, { parent: eb, fillW: true });
  }
  gap(body, 24);
  const b = box('Button/Simpan Password', { dir: 'H', gap: 8, ax: 'CENTER', ay: 'CENTER', fill: o.loading ? 'color/border' : 'color/primary', radius: 12, theme: th, parent: body, fixed: [312, 52] });
  b.layoutSizingHorizontal = 'FILL';
  if (o.loading) auSpinner(th, b, 20, 'white'); else await txt('Simpan Password', 'body-strong', 'white', th, { parent: b });
  if (!o.loading && !o.error && !o.mismatch) link(b, 'absensi-home');
  return f;
}
registerScreen({ key: 'ganti-sandi', group: AU_GROUP, title: 'Ganti sandi', build: (th) => auChangePw(th, {}) });
registerScreen({ key: 'ganti-sandi-tak-sama', group: AU_GROUP, title: 'Ganti sandi (tidak sama)', build: (th) => auChangePw(th, { filled: true, mismatch: true }) });
registerScreen({ key: 'ganti-sandi-error', group: AU_GROUP, title: 'Ganti sandi (galat server)', build: (th) => auChangePw(th, { filled: true, error: 'Password saat ini salah.' }) });
registerScreen({ key: 'ganti-sandi-memuat', group: AU_GROUP, title: 'Ganti sandi (memuat)', build: (th) => auChangePw(th, { filled: true, loading: true }) });

/* =====================================================================
 * PROFIL (tab ke-4)
 * ===================================================================== */
function auSection(th, parent, title, upper) {
  const w = box('Section', { dir: 'V', pad: [0, 0, 16, 0], theme: th, parent, fillW: true });
  const lw = box('title', { dir: 'H', pad: [0, 20, 8, 20], theme: th, parent: w, fillW: true });
  txt(title, 'label', 'color/text/secondary', th, { parent: lw, upper: !!upper });
  const cw = box('card wrap', { dir: 'V', pad: [0, 16, 0, 16], theme: th, parent: w, fillW: true });
  const c = box('card', { dir: 'V', fill: 'color/surface', stroke: 'color/border', radius: 14, clip: true, theme: th, parent: cw, fillW: true });
  return c;
}
function auDivider(th, parent, indent) {
  const w = box('divider', { dir: 'H', pad: [0, 0, 0, indent], theme: th, parent, fillW: true });
  const d = figma.createRectangle(); d.name = 'line'; d.resize(100, 1); d.fills = [pv(th, 'color/border')]; w.appendChild(d); d.layoutSizingHorizontal = 'FILL';
}
/** _Tile: ikon 20, teks, chevron / trailing. tone: 'color/danger' | null. */
async function auTile(th, parent, ic, title, sub, o = {}) {
  const t = box('Tile/' + title, { dir: 'H', gap: 16, ay: 'CENTER', pad: [14, 16, 14, 16], theme: th, parent, fillW: true });
  icon(ic, 20, o.tone ?? 'color/text/secondary', th, t);
  const col = box('text', { dir: 'V', theme: th, parent: t }); col.layoutGrow = 1; col.layoutSizingHorizontal = 'FILL';
  await txt(title, 'body', o.tone ?? 'color/text/primary', th, { parent: col, fillW: true });
  if (sub) await txt(sub, 'caption', 'color/text/secondary', th, { parent: col, fillW: true });
  if (o.trailing) await o.trailing(t);
  else if (o.go) icon('chevron', 20, 'color/text/disabled', th, t);
  return t;
}
/** Switch Material: mati (tepi) atau menyala (biru). */
function auSwitch(th, parent, on) {
  const tr = box('Switch', { dir: 'H', ay: 'CENTER', ax: on ? 'MAX' : 'MIN', pad: on ? 4 : 8, fill: on ? 'color/primary' : 'color/background', stroke: on ? null : 'color/text/disabled', sw: 2, radius: 16, theme: th, parent, fixed: [52, 32] });
  box('thumb', { dir: 'H', fill: on ? 'white' : 'color/text/disabled', radius: 999, theme: th, parent: tr, fixed: [on ? 24 : 16, on ? 24 : 16] });
  return tr;
}

/** o: photo (bool), uploading (teks langkah), unread (angka), dialog (bool). */
async function auProfil(th, o = {}) {
  const { f, body } = await phone('x', th, '', { noAppBar: true, h: 1440, pad: [0, 0, 24, 0] });
  const hd = box('Header', { dir: 'V', ay: 'CENTER', pad: [20, 20, 32, 20], theme: th, parent: body, fillW: true });
  auGradient(hd, th, 'color/primary', 'color/primary-dark');
  f.children[0].fills = [pv(th, 'color/primary')];
  for (const t of f.children[0].findAll((n) => n.type === 'TEXT')) t.fills = [WHITE_PAINT];
  const av = box('avatar', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 999, clip: true, theme: th, parent: hd, fixed: [76, 76] });
  av.strokes = [auWhite(0.35)]; av.strokeWeight = 2; av.strokeAlign = 'INSIDE';
  if (o.photo) {
    av.fills = [pv(th, 'color/primary-light')]; icon('person', 40, 'white', th, av);
  } else {
    av.fills = [auWhite(0.2)]; await txt('B', 'display', 'white', th, { parent: av });
  }
  if (o.uploading) {
    const dim = box('uploading', { dir: 'H', ax: 'CENTER', ay: 'CENTER', radius: 999, theme: th, parent: av, fixed: [76, 76] });
    dim.fills = [auBlack(0.4)]; dim.layoutPositioning = 'ABSOLUTE'; dim.x = 0; dim.y = 0;
    auSpinner(th, dim, 24, 'white');
  } else {
    const cam = box('camera badge', { dir: 'H', ax: 'CENTER', ay: 'CENTER', fill: 'white', stroke: 'color/primary', sw: 1.5, radius: 999, theme: th, parent: av, fixed: [26, 26] });
    cam.layoutPositioning = 'ABSOLUTE'; cam.x = 50; cam.y = 50;
    icon('camera', 14, 'color/primary', th, cam);
  }
  gap(hd, 6);
  await auTxtA(o.uploading ?? (o.photo ? 'Ketuk untuk ganti foto' : 'Ketuk untuk ambil foto profil'), 'caption', 'white', th, hd, 0.7);
  gap(hd, 10);
  await txt('Budi Santoso', 'h1', 'white', th, { parent: hd }); gap(hd, 2);
  await auTxtA('budi@perusahaan.co.id', 'caption', 'white', th, hd, 0.7);
  gap(body, 20);

  const links = {};
  let c = auSection(th, body, 'DATA DIRI', true);
  links.data = await auTile(th, c, 'au-badge', 'Data diri lengkap', 'Kepegawaian, data pribadi, rekening', { go: true });
  c = auSection(th, body, 'PERANGKAT ABSENSI', true);
  await auTile(th, c, 'au-phone', 'Samsung Galaxy A54', 'Perangkat terdaftar', {});
  auDivider(th, c, 56);
  c = auSection(th, body, 'GAJI', true);
  links.slip = await auTile(th, c, 'au-receipt', 'Slip gaji', 'Rincian gaji setiap bulan', { go: true });
  c = auSection(th, body, 'SURAT DARI HR', true);
  const un = o.unread ?? 0;
  links.sp = await auTile(th, c, 'mail', 'Teguran dan surat peringatan', un > 0 ? un + ' surat belum dibaca' : 'Riwayat surat dari HR', { go: true, tone: un > 0 ? 'color/danger' : null });
  c = auSection(th, body, 'PERSETUJUAN', true);
  links.appr = await auTile(th, c, 'inbox', 'Kotak masuk persetujuan', 'Pengajuan yang menunggu persetujuan', { go: true });
  c = auSection(th, body, 'Wajah', false);
  links.face = await auTile(th, c, 'face', 'Verifikasi Wajah', 'Daftarkan wajah untuk keperluan absensi', { go: true });
  c = auSection(th, body, 'TAMPILAN', true);
  await auTile(th, c, th === 'dark' ? 'au-moon' : 'sun', 'Mode gelap', null, { trailing: async (t) => { auSwitch(th, t, th === 'dark'); } });
  c = auSection(th, body, 'AKUN', true);
  links.pw = await auTile(th, c, 'lock', 'Ganti password', null, { go: true });
  auDivider(th, c, 56);
  links.out = await auTile(th, c, 'logout', 'Keluar', null, { tone: 'color/danger' });
  gap(body, 8);
  const ft = box('footnote', { dir: 'H', ax: 'CENTER', pad: [0, 32, 0, 32], theme: th, parent: body, fillW: true });
  await txt('Cuti, lembur, dan persetujuan sementara masih lewat dashboard web.', 'caption', 'color/text/secondary', th, { parent: ft, fillW: true, align: 'CENTER' });

  await bottomNav(th, f, 3);
  if (!o.dialog) {
    link(links.data, 'data-diri'); link(links.slip, 'slip-list'); link(links.sp, 'sp-list'); link(links.appr, 'persetujuan-inbox');
    link(links.face, 'face-enroll'); link(links.pw, 'ganti-sandi'); link(links.out, 'profil-keluar', 'modal');
  }
  if (o.dialog) {
    auScrim(f, th, 1440);
    const d = box('AlertDialog', { dir: 'V', pad: 24, fill: 'color/surface', radius: 20, theme: th, parent: f, fixed: [312, 244] });
    d.primaryAxisSizingMode = 'AUTO'; d.layoutPositioning = 'ABSOLUTE'; d.x = 24; d.y = 330;
    await txt('Keluar dari aplikasi?', 'h2', 'color/text/primary', th, { parent: d, fillW: true }); gap(d, 16);
    await txt('Anda perlu memasukkan email dan password lagi untuk masuk. Perangkat ini tetap terdaftar, jadi tidak perlu minta reset ke HR.', 'body', 'color/text/secondary', th, { parent: d, fillW: true });
    gap(d, 24);
    const ac = box('actions', { dir: 'H', gap: 8, ax: 'MAX', ay: 'CENTER', theme: th, parent: d, fillW: true });
    const cancel = box('Batal', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [10, 12, 10, 12], theme: th, parent: ac });
    await txt('Batal', 'body-strong', 'color/primary', th, { parent: cancel });
    const out = box('Keluar', { dir: 'H', ax: 'CENTER', ay: 'CENTER', pad: [10, 12, 10, 12], theme: th, parent: ac });
    await txt('Keluar', 'body-strong', 'color/danger', th, { parent: out });
    link(cancel, 'profil', 'back'); link(out, 'login');
  }
  return f;
}
registerScreen({ key: 'profil', group: AU_GROUP, title: 'Profil', build: (th) => auProfil(th, {}) });
registerScreen({ key: 'profil-foto', group: AU_GROUP, title: 'Profil (foto + surat belum dibaca)', build: (th) => auProfil(th, { photo: true, unread: 2 }) });
registerScreen({ key: 'profil-unggah', group: AU_GROUP, title: 'Profil (mengunggah foto)', build: (th) => auProfil(th, { uploading: 'Mengunggah foto...' }) });
registerScreen({ key: 'profil-keluar', group: AU_GROUP, title: 'Profil: dialog keluar', build: (th) => auProfil(th, { dialog: true }) });

/* =====================================================================
 * DATA DIRI
 * ===================================================================== */
async function auPdCard(th, parent, title, caption) {
  const w = box('Card/' + title, { dir: 'V', theme: th, parent, fillW: true });
  const lw = box('title', { dir: 'H', pad: [0, 4, 8, 4], theme: th, parent: w, fillW: true });
  await txt(title, 'label', 'color/text/secondary', th, { parent: lw, upper: true });
  if (caption) { const cw = box('caption', { dir: 'H', pad: [0, 4, 8, 4], theme: th, parent: w, fillW: true }); await txt(caption, 'caption', 'color/text/secondary', th, { parent: cw, fillW: true }); }
  const c = box('rows', { dir: 'V', fill: 'color/surface', stroke: 'color/border', radius: 14, clip: true, theme: th, parent: w, fillW: true });
  gap(parent, 16);
  return c;
}
async function auPdField(th, card, label, value) {
  if (card.children.length > 0) auDivider(th, card, 16);
  const empty = !value || value === '-';
  const r = box('Field/' + label, { dir: 'V', gap: 2, pad: [12, 16, 12, 16], theme: th, parent: card, fillW: true });
  await txt(label, 'caption', 'color/text/secondary', th, { parent: r, fillW: true });
  await txt(empty ? '-' : value, 'body', empty ? 'color/text/disabled' : 'color/text/primary', th, { parent: r, fillW: true });
}
/** Nomor sensitif: tersamar atau terbuka, dengan ikon mata dan salin. Mengembalikan simpul ikon mata. */
async function auPdSensitive(th, card, label, masked, revealed, shown) {
  if (card.children.length > 0) auDivider(th, card, 16);
  const r = box('Sensitive/' + label, { dir: 'H', ay: 'CENTER', pad: [12, 4, 12, 16], theme: th, parent: card, fillW: true });
  const col = box('text', { dir: 'V', gap: 2, theme: th, parent: r }); col.layoutGrow = 1; col.layoutSizingHorizontal = 'FILL';
  await txt(label, 'caption', 'color/text/secondary', th, { parent: col, fillW: true });
  await txt(revealed ? shown : masked, 'body', 'color/text/primary', th, { parent: col, fillW: true });
  const eye = box('eye', { dir: 'H', ax: 'CENTER', ay: 'CENTER', theme: th, parent: r, fixed: [48, 48] });
  icon(revealed ? 'eyeoff' : 'eye', 20, 'color/text/secondary', th, eye);
  const cp = box('copy', { dir: 'H', ax: 'CENTER', ay: 'CENTER', theme: th, parent: r, fixed: [48, 48] });
  icon('copy', 18, 'color/text/secondary', th, cp);
  return eye;
}

/** o: reveal (nama bidang yang dibuka, mis. 'NPWP'). */
async function auPersonal(th, o = {}) {
  const { f, body } = await phone('x', th, 'Data Diri', { h: 2420, pad: [16, 16, 24, 16] });
  const sm = box('Summary', { dir: 'V', gap: 2, pad: 16, fill: 'color/primary-surface', radius: 14, theme: th, parent: body, fillW: true });
  await txt('Budi Santoso', 'h2', 'color/text/primary', th, { parent: sm, fillW: true });
  await txt('EMP-000003 · budi@perusahaan.co.id', 'caption', 'color/text/secondary', th, { parent: sm, fillW: true });
  gap(sm, 8);
  const bw = box('badges', { dir: 'H', gap: 8, theme: th, parent: sm, fillW: true }); bw.layoutWrap = 'WRAP'; bw.counterAxisSpacing = 6;
  await badge('Aktif', 'success', null, th, bw); await badge('Lokasi fleksibel', 'info', null, th, bw);
  gap(body, 20);

  let c = await auPdCard(th, body, 'Kepegawaian');
  for (const [l, v] of [['Perusahaan', 'PT Workonix Indonesia'], ['Departemen', 'Teknologi Informasi'], ['Jabatan', 'Staf IT'], ['Golongan', '-'], ['Atasan langsung', 'Eko Prasetyo'], ['Kantor utama', 'Kantor Pusat Jakarta'], ['Tanggal bergabung', '15 Maret 2023'], ['Masa kerja', '3 tahun 8 bulan'], ['Tipe kepegawaian', 'Tetap'], ['Status', 'Aktif']]) await auPdField(th, c, l, v);

  const rv = o.reveal;
  const eyes = {};
  c = await auPdCard(th, body, 'Data pribadi');
  eyes.NIK = await auPdSensitive(th, c, 'NIK (KTP)', '3201 •••••••• 0001', rv === 'NIK', '3201234567890001');
  eyes.KK = await auPdSensitive(th, c, 'Nomor Kartu Keluarga', '3201 •••••••• 0002', rv === 'KK', '3201234567890002');
  eyes.NPWP = await auPdSensitive(th, c, 'NPWP', '1234 ••••••• 2345', rv === 'NPWP', '12.345.678.9-012.345');
  for (const [l, v] of [['Tempat, tanggal lahir', 'Bandung, 12 Maret 1998'], ['Jenis kelamin', 'Laki-laki'], ['Status pernikahan', 'Belum Menikah'], ['Agama', 'Islam'], ['Golongan darah', 'O'], ['Pendidikan terakhir', 'S1'], ['Nama ibu kandung', 'Siti Aminah']]) await auPdField(th, c, l, v);

  c = await auPdCard(th, body, 'Alamat & kontak');
  for (const [l, v] of [['Alamat sesuai KTP', 'Jl. Merdeka No. 12, Bandung, Jawa Barat 40115'], ['Alamat domisili', 'Jl. Sudirman No. 45, Jakarta Selatan 12190'], ['Email pribadi', 'budi.santoso@gmail.com'], ['Nomor telepon', '0812-3456-7890']]) await auPdField(th, c, l, v);

  c = await auPdCard(th, body, 'Kontak darurat');
  for (const [l, v] of [['Nama', 'Siti Aminah'], ['Hubungan', 'Ibu'], ['Nomor telepon', '0813-9876-5432']]) await auPdField(th, c, l, v);

  c = await auPdCard(th, body, 'BPJS & rekening', 'Cek lagi nomor rekening. Kalau salah, gaji bisa masuk ke rekening orang lain.');
  await auPdSensitive(th, c, 'BPJS Ketenagakerjaan', '1234 ••• 8901', false, '12345678901');
  await auPdSensitive(th, c, 'BPJS Kesehatan', '0001 ••••• 7890', false, '0001234567890');
  await auPdField(th, c, 'Bank', 'BCA');
  await auPdSensitive(th, c, 'Nomor rekening', '1234 •• 7890', false, '1234567890');
  await auPdField(th, c, 'Nama pemilik rekening', 'Budi Santoso');
  gap(body, 4);
  const ib = box('info', { dir: 'H', gap: 10, pad: 14, fill: 'color/info-surface', radius: 12, theme: th, parent: body, fillW: true });
  icon('info', 18, 'color/info', th, ib);
  await txt('Semua data di sini diatur HR. Hubungi HR kalau ada yang salah.', 'caption', 'color/info', th, { parent: ib, fillW: true });

  link(f.findOne((n) => n.name === 'icon/back'), 'profil', 'back');
  if (!rv) link(eyes.NPWP, 'data-diri-terbuka'); else link(eyes.NPWP, 'data-diri');
  return f;
}
registerScreen({ key: 'data-diri', group: AU_GROUP, title: 'Data diri (tersamar)', build: (th) => auPersonal(th, {}) });
registerScreen({ key: 'data-diri-terbuka', group: AU_GROUP, title: 'Data diri (NPWP dibuka)', build: (th) => auPersonal(th, { reveal: 'NPWP' }) });
registerScreen({ key: 'data-diri-memuat', group: AU_GROUP, title: 'Data diri (memuat)', build: async (th) => {
  const { f, body } = await phone('x', th, 'Data Diri');
  body.primaryAxisAlignItems = 'CENTER'; body.counterAxisAlignItems = 'CENTER';
  auSpinner(th, body, 36, 'color/primary');
  link(f.findOne((n) => n.name === 'icon/back'), 'profil', 'back');
  return f;
} });
registerScreen({ key: 'data-diri-error', group: AU_GROUP, title: 'Data diri (gagal memuat)', build: async (th) => {
  const { f, body } = await phone('x', th, 'Data Diri');
  await emptyState('au-cloudoff', 'Gagal memuat', 'Tidak bisa menghubungi server. Periksa koneksi internet Anda.', th, body, 'danger');
  link(f.findOne((n) => n.name === 'icon/back'), 'profil', 'back');
  return f;
} });

flowStart('splash', 'Alur masuk');


/* ===== projects/workonix-mobile/screens/30-absensi.js ===== */
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


/* ===== projects/workonix-mobile/screens/40-cuti-lembur.js ===== */
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


/* ===== projects/workonix-mobile/screens/50-persetujuan-tukar-shift.js ===== */
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


/* ===== projects/workonix-mobile/screens/60-slip-sp.js ===== */
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


/* ===== core/runner-single.js ===== */
/* RUNNER SINGLE — bangun semua layar sekali jalan, susun Section, pasang prototype (cocok untuk <= ±15 ribu simpul). */
/* =====================================================================
 * RUNNER — membangun semua layar, menyusun ke Section, memasang prototype
 * ===================================================================== */
const PAGE_SCREENS = 'Screens';
const PAGE_FLOWS = 'Flows';
const PHONE_W = 360, PAIR_GAP = 48, ROW_GAP = 110, SECTION_PAD = 60, PAIRS_PER_ROW = 2, SECTION_GAP = 220;

async function findOrCreatePage(name) {
  let p = figma.root.children.find((x) => x.name === name);
  if (!p) { p = figma.createPage(); p.name = name; }
  return p;
}
function isOurs(n) { return n.name.startsWith('WX ') || n.name === 'Section / Timesheet'; }

const tick = () => new Promise((r) => setTimeout(r, 0));
const notify = (m, ms) => { try { if (typeof figma.notify === 'function') figma.notify(m, { timeout: ms ?? 4000 }); } catch (e) { /* abaikan */ } };

async function buildAll(report) {
  const frames = {}; // `${key}/${theme}` -> frame
  notify(`Membangun ${REGISTRY.length * 2} frame… mohon tunggu, Figma bisa terasa lambat.`, 8000);
  let n = 0;
  for (const def of REGISTRY) {
    if (++n % 10 === 0) { notify(`Membangun layar ${n}/${REGISTRY.length}…`, 2000); }
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

function layoutSections(frames) {
  const groups = [];
  for (const def of REGISTRY) {
    let g = groups.find((x) => x.name === def.group);
    if (!g) { g = { name: def.group, defs: [] }; groups.push(g); }
    g.defs.push(def);
  }
  const sections = [];
  let y = 0;
  for (const g of groups) {
    const rows = [];
    for (let i = 0; i < g.defs.length; i += PAIRS_PER_ROW) rows.push(g.defs.slice(i, i + PAIRS_PER_ROW));
    const sec = figma.createSection(); sec.name = 'WX ' + g.name;
    const secW = PAIRS_PER_ROW * (PHONE_W * 2 + PAIR_GAP) + (PAIRS_PER_ROW - 1) * 96 + SECTION_PAD * 2;
    let cy = SECTION_PAD + 40, maxY = cy;
    for (const row of rows) {
      let cx = SECTION_PAD, rowH = 0;
      for (const def of row) {
        const pair = ['light', 'dark'].map((t) => frames[`${def.key}/${t}`]).filter(Boolean);
        if (!pair.length) continue;
        const lbl = figma.createText(); lbl.fontName = { family: 'Inter', style: 'Semi Bold' }; lbl.fontSize = 16;
        lbl.characters = `${def.title}`; lbl.fills = [{ type: 'SOLID', color: { r: 0.15, g: 0.17, b: 0.22 } }]; lbl.name = 'WX label ' + def.title;
        sec.appendChild(lbl); lbl.x = cx; lbl.y = cy - 30;
        let px = cx;
        for (const fr of pair) { sec.appendChild(fr); fr.x = px; fr.y = cy; px += PHONE_W + PAIR_GAP; rowH = Math.max(rowH, fr.height); }
        cx += PHONE_W * 2 + PAIR_GAP + 96;
      }
      cy += rowH + ROW_GAP; maxY = cy;
    }
    sec.resizeWithoutConstraints(secW, maxY - ROW_GAP + SECTION_PAD);
    sec.x = 0; sec.y = y; y += sec.height + SECTION_GAP;
    sections.push(sec);
  }
  return sections;
}

/** Thumbnail di halaman Flows mengklon 93 frame (±7 ribu simpul) dan SANGAT berat. Ubah ke true bila ingin. */
const FLOW_THUMBNAILS = false;
/** Tema yang dipasangi prototype. Tiap tautan butuh ±1 detik di Figma; ['light'] memangkas waktu separuh. */
const WIRE_THEMES = ['light'];

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

async function buildFlowsPage(frames, report) {
  const page = await findOrCreatePage(PAGE_FLOWS);
  await figma.setCurrentPageAsync(page);
  for (const n of [...page.children]) if (isOurs(n)) n.remove();
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' }); await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
  const groups = [];
  for (const def of REGISTRY) { let g = groups.find((x) => x.name === def.group); if (!g) { g = { name: def.group, defs: [] }; groups.push(g); } g.defs.push(def); }
  let y = 0;
  for (const g of groups) {
    const wrap = makeAutoLayout('VERTICAL'); wrap.name = 'WX Flow / ' + g.name; wrap.itemSpacing = 24; wrap.paddingTop = wrap.paddingBottom = wrap.paddingLeft = wrap.paddingRight = 40;
    wrap.cornerRadius = 20; wrap.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    const title = figma.createText(); title.fontName = { family: 'Inter', style: 'Semi Bold' }; title.fontSize = 28; title.characters = 'Alur: ' + g.name; title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.13, b: 0.16 } }];
    wrap.appendChild(title);
    const row = makeAutoLayout('HORIZONTAL'); row.name = 'thumbnails'; row.itemSpacing = 40; row.fills = [];
    wrap.appendChild(row);
    for (const def of g.defs) {
      const src = frames[`${def.key}/light`]; if (!src) continue;
      if (!FLOW_THUMBNAILS) { const t = figma.createText(); t.fontName = { family: 'Inter', style: 'Regular' }; t.fontSize = 14; t.characters = '▪ ' + def.title; t.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.22, b: 0.27 } }]; row.layoutMode = 'VERTICAL'; row.itemSpacing = 4; row.appendChild(t); continue; }
      const col = makeAutoLayout('VERTICAL'); col.itemSpacing = 10; col.fills = []; col.counterAxisAlignItems = 'CENTER'; col.name = def.title;
      let c = null;
      try {
        c = src.clone(); c.name = 'thumb ' + def.title;
        for (const n of c.findAll((x) => x.reactions && x.reactions.length)) { try { await n.setReactionsAsync([]); } catch (e) { /* abaikan */ } }
        try { await c.setReactionsAsync([]); } catch (e) { /* abaikan */ }
        col.appendChild(c); c.rescale(0.45);
      } catch (e) {
        if (c) { try { c.remove(); } catch (e2) { /* abaikan */ } }
        report.errors.push(`thumbnail ${def.key}: ${e.message || e} (daftar navigasi tetap dibuat)`);
      }
      const cap = figma.createText(); cap.fontName = { family: 'Inter', style: 'Semi Bold' }; cap.fontSize = 14; cap.characters = def.title; cap.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.22, b: 0.27 } }];
      col.appendChild(cap); row.appendChild(col);
    }
    const edges = LINKS.filter((l) => l.theme === 'light' && l.kind !== 'back' && g.defs.some((d) => d.key === l.fromKey)).map((l) => {
      const f = REGISTRY.find((d) => d.key === l.fromKey), t = REGISTRY.find((d) => d.key === l.target);
      return `• ${f ? f.title : l.fromKey}  →  ${t ? t.title : l.target}   (${l.node.name})`;
    });
    if (edges.length) {
      const e = figma.createText(); e.fontName = { family: 'Inter', style: 'Regular' }; e.fontSize = 13; e.lineHeight = { unit: 'PIXELS', value: 20 };
      e.characters = 'Navigasi prototype:\n' + [...new Set(edges)].join('\n'); e.fills = [{ type: 'SOLID', color: { r: 0.3, g: 0.33, b: 0.38 } }];
      wrap.appendChild(e);
    }
    page.appendChild(wrap); wrap.x = 0; wrap.y = y; y += wrap.height + 80;
  }
  if (report.errors.length) {
    const t = figma.createText(); t.name = 'WX Build log'; t.fontName = { family: 'Inter', style: 'Regular' }; t.fontSize = 13;
    t.characters = 'Build log (' + report.errors.length + ' masalah)\n' + dedupe(report.errors).join('\n'); t.fills = [{ type: 'SOLID', color: { r: 0.75, g: 0.1, b: 0.1 } }];
    page.appendChild(t); t.x = 0; t.y = y;
  }
}

/** Uji cepat pembuat dasar sebelum membangun 186 frame, supaya galat mendasar langsung jelas. */
async function smokeTest() {
  const before = new Set(figma.currentPage.children);
  const sweep = () => { for (const n of [...figma.currentPage.children]) if (!before.has(n)) { try { n.remove(); } catch (e) { /* abaikan */ } } };
  const steps = ['createAutoLayout', 'box', 'txt', 'icon'];
  let at = steps[0];
  const made = [];
  try {
    const f = box('WX smoke', { dir: 'V', gap: 4, pad: 8, fill: 'color/surface', stroke: 'color/border', radius: 8, theme: 'light', fixed: [100, 100] });
    made.push(f); at = 'txt';
    const t = await txt('uji', 'body', 'color/text/primary', 'light', { parent: f, fillW: true });
    at = 'icon'; icon('search', 20, 'color/primary', 'light', f);
    at = 'badge'; await badge('uji', 'success', 'check', 'light', f);
    at = 'phone'; const p = await phone('WX smoke phone', 'dark', 'Uji'); made.push(p.f);
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
  const page = await findOrCreatePage(PAGE_SCREENS);
  await figma.setCurrentPageAsync(page);
  for (const n of [...page.children]) if (isOurs(n)) n.remove();

  const frames = await buildAll(report);
  // Frame harus berada di halaman agar bisa dipindah ke Section: buat di halaman Screens dulu.
  for (const f of Object.values(frames)) if (f.parent !== page && !f.parent) page.appendChild(f);
  notify('Menyusun section…', 3000);
  const sections = layoutSections(frames);
  const wired = await wireLinks(frames, report);
  page.flowStartingPoints = FLOW_STARTS.flatMap((s) => WIRE_THEMES.map((t) => frames[`${s.key}/${t}`] ? { nodeId: frames[`${s.key}/${t}`].id, name: `${s.name} — ${t === 'light' ? 'Terang' : 'Gelap'}` } : null).filter(Boolean));
  notify('Membuat halaman Flows…', 3000);
  try { await buildFlowsPage(frames, report); } catch (e) { report.errors.push('halaman Flows: ' + (e.message || e)); }
  await figma.setCurrentPageAsync(page);
  figma.viewport.scrollAndZoomIntoView(sections);
  return { screens: REGISTRY.length, frames: Object.keys(frames).length, sections: sections.length, links: wired, errors: report.errors };
}

main().then((r) => {
  figma.closePlugin(`Selesai: ${r.frames} frame, ${r.links} tautan prototype, ${r.errors.length} masalah${r.errors.length ? ' (lihat halaman Flows → "WX Build log")' : ''}`);
}).catch((e) => { figma.closePlugin('GAGAL: ' + (e && e.message ? e.message : e)); });
