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
