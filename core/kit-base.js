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
