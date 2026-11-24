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
