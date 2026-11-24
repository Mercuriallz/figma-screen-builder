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
