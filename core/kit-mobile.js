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
