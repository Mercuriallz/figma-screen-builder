// Tiruan API Figma untuk menangkap kesalahan umum SEBELUM plugin dijalankan di Figma sungguhan.
// Memvalidasi enum dan aturan auto-layout yang pernah menyebabkan galat nyata.
const ENUMS = {
  layoutMode: ['NONE', 'HORIZONTAL', 'VERTICAL'],
  primaryAxisAlignItems: ['MIN', 'MAX', 'CENTER', 'SPACE_BETWEEN'],
  counterAxisAlignItems: ['MIN', 'MAX', 'CENTER', 'BASELINE'],
  primaryAxisSizingMode: ['FIXED', 'AUTO'], counterAxisSizingMode: ['FIXED', 'AUTO'],
  layoutPositioning: ['AUTO', 'ABSOLUTE'], layoutWrap: ['NO_WRAP', 'WRAP'],
  textAlignHorizontal: ['LEFT', 'CENTER', 'RIGHT', 'JUSTIFIED'], textAlignVertical: ['TOP', 'CENTER', 'BOTTOM'],
  textAutoResize: ['NONE', 'WIDTH_AND_HEIGHT', 'HEIGHT', 'TRUNCATE'], textCase: ['ORIGINAL', 'UPPER', 'LOWER', 'TITLE'],
  strokeAlign: ['INSIDE', 'OUTSIDE', 'CENTER'], layoutSizingHorizontal: ['FIXED', 'HUG', 'FILL'], layoutSizingVertical: ['FIXED', 'HUG', 'FILL'],
};
const FONTS = new Set(['Regular', 'Medium', 'Semi Bold', 'Bold', 'Italic', 'Light']);
const TEXT_ONLY = new Set(['characters', 'fontName', 'fontSize', 'lineHeight', 'letterSpacing', 'textCase', 'textAlignHorizontal', 'textAlignVertical', 'textAutoResize']);
const FRAME_ONLY = new Set(['layoutMode', 'itemSpacing', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'primaryAxisAlignItems', 'counterAxisAlignItems', 'primaryAxisSizingMode', 'counterAxisSizingMode', 'layoutWrap', 'counterAxisSpacing', 'clipsContent']);
const KNOWN = new Set(['id', 'name', 'type', 'children', 'parent', 'x', 'y', 'width', 'height', 'rotation', 'opacity', 'visible', 'locked', 'fills', 'strokes', 'strokeWeight', 'strokeAlign', 'strokeTopWeight', 'strokeBottomWeight', 'strokeLeftWeight', 'strokeRightWeight', 'cornerRadius', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius', 'effects', 'layoutSizingHorizontal', 'layoutSizingVertical', 'layoutPositioning', 'layoutGrow', 'layoutAlign', 'reactions', 'flowStartingPoints', 'maxLines', 'description']);
let nextId = 1;
const state = { loaded: new Set(), closed: null, pages: [], current: null, styles: [], collections: [], vars: new Map() };

function validPaint(p, where) {
  if (!p || typeof p.type !== 'string') throw new Error(`${where}: paint tidak valid`);
  if (p.type === 'SOLID' && p.color && 'a' in p.color) throw new Error(`${where}: warna SOLID tidak boleh punya field a`);
  if (p.type === 'SOLID') for (const k of ['r', 'g', 'b']) if (p.color[k] < 0 || p.color[k] > 1) throw new Error(`${where}: kanal warna di luar 0-1`);
}
class Node {
  constructor(type) {
    const self = this;
    this.id = `${nextId++}:${nextId}`; this.type = type; this.name = type; this.children = []; this.parent = null;
    this.width = 100; this.height = 100; this.x = 0; this.y = 0; this.fills = []; this.strokes = []; this.reactions = [];
    this.layoutMode = 'NONE'; this.layoutSizingHorizontal = 'FIXED'; this.layoutSizingVertical = 'FIXED';
    this.primaryAxisSizingMode = 'AUTO'; this.counterAxisSizingMode = 'AUTO'; this.layoutPositioning = 'AUTO';
    this.fontName = { family: 'Inter', style: 'Regular' }; this.characters = ''; this._store = {};
    Object.defineProperty(this, '_raw', { value: this, enumerable: false });
    return new Proxy(this, {
      set(t, k, v) {
        if (typeof k === 'string' && !k.startsWith('_')) {
          if (TEXT_ONLY.has(k) && t.type !== 'TEXT') throw new Error(`set ${k}: properti hanya untuk TEXT (node "${t.name}" bertipe ${t.type}) -> Figma: object is not extensible`);
          if (FRAME_ONLY.has(k) && t.type !== 'FRAME') throw new Error(`set ${k}: properti hanya untuk FRAME (node "${t.name}" bertipe ${t.type}) -> Figma: object is not extensible`);
          if (!(k in t) && !TEXT_ONLY.has(k) && !FRAME_ONLY.has(k) && !KNOWN.has(k) && !ENUMS[k]) throw new Error(`set ${k}: properti tidak dikenal pada node "${t.name}" (${t.type}) -> Figma: object is not extensible`);
        }
        if (ENUMS[k]) {
          if (!ENUMS[k].includes(v)) throw new Error(`set ${k}: nilai tidak valid "${v}" (pakai ${ENUMS[k].join('|')})`);
          if (k === 'layoutSizingHorizontal' || k === 'layoutSizingVertical') {
            const p = t.parent, parentAuto = p && p.layoutMode !== 'NONE';
            if (v === 'FILL' && !(parentAuto && t.layoutPositioning !== 'ABSOLUTE')) throw new Error(`${k}=FILL butuh induk auto-layout (node "${t.name}", induk "${p && p.name}")`);
            if (v === 'HUG' && !(t.layoutMode !== 'NONE' || (t.type === 'TEXT' && parentAuto))) throw new Error(`${k}=HUG hanya untuk frame auto-layout atau teks di dalamnya (node "${t.name}")`);
          }
          if (k === 'layoutPositioning' && v === 'ABSOLUTE' && !(t.parent && t.parent.layoutMode !== 'NONE')) throw new Error('layoutPositioning=ABSOLUTE butuh induk auto-layout');
        }
        if (k === 'characters') {
          if (!state.loaded.has(t.fontName.style) && !t._styled) throw new Error(`characters: font "${t.fontName.family} ${t.fontName.style}" belum dimuat`);
          if (typeof v !== 'string') throw new Error('characters harus string');
        }
        if (k === 'fills' || k === 'strokes') { if (!Array.isArray(v)) throw new Error(`${k} harus array`); v.forEach((p) => validPaint(p, k)); }
        if (['itemSpacing', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'cornerRadius', 'strokeWeight', 'fontSize', 'opacity'].includes(k) && typeof v !== 'number') throw new Error(`${k} harus angka, dapat ${typeof v}`);
        if (k === 'lineHeight' && !(v && typeof v === 'object' && 'unit' in v)) throw new Error('lineHeight harus {unit,value}');
        if (k === 'maxLines') throw new Error('maxLines tidak didukung');
        t[k] = v; return true;
      },
    });
  }
  appendChild(n) { if (this.type === 'TEXT') throw new Error('TEXT tidak bisa punya anak'); if (n.parent) n.parent.children.splice(n.parent.children.indexOf(n), 1); n.parent = this; this.children.push(n); return n; }
  insertChild(i, n) { if (n.parent) n.parent.children.splice(n.parent.children.indexOf(n), 1); n.parent = this; this.children.splice(i, 0, n); return n; }
  remove() { if (this.parent) this.parent.children.splice(this.parent.children.indexOf(this), 1); this.parent = null; }
  resize(w, h) { if (!(w >= 0.01 && h >= 0.01)) throw new Error(`resize ukuran tidak valid ${w}x${h}`); this.width = w; this.height = h; if (this.layoutMode !== 'NONE') { this.primaryAxisSizingMode = 'FIXED'; this.counterAxisSizingMode = 'FIXED'; } if (this.parent && this.parent.layoutMode !== 'NONE') { this.layoutSizingHorizontal = 'FIXED'; this.layoutSizingVertical = 'FIXED'; } }
  resizeWithoutConstraints(w, h) { this.width = w; this.height = h; }
  rescale(s) { this.width *= s; this.height *= s; }
  findAll(cb) { const out = []; const walk = (n) => { for (const c of n.children) { if (cb(c)) out.push(c); walk(c); } }; walk(this); return out; }
  findOne(cb) { return this.findAll(cb)[0] ?? null; }
  clone() { const c = new Node(this.type); Object.assign(c._raw, JSON.parse(JSON.stringify({ ...this._raw, parent: null, children: [], _store: {} }))); c.id = `${nextId++}:c`; c.parent = null; c.children = this.children.map((k) => { const kc = k.clone(); kc.parent = c; return kc; }); return c; }
  async setReactionsAsync(rs) {
    for (const r of rs) {
      if (!r.trigger || !r.trigger.type) throw new Error('reaction: trigger tidak valid');
      if (!Array.isArray(r.actions)) throw new Error('reaction: actions harus array');
      for (const a of r.actions) {
        if (a.type === 'NODE') { if (!a.destinationId || !a.navigation) throw new Error('reaction: NODE butuh destinationId + navigation'); const d = findById(a.destinationId); if (!d) throw new Error('reaction: tujuan tidak ada'); let top = d; while (top.parent && top.parent.type !== 'PAGE' && top.parent.type !== 'SECTION') top = top.parent; if (top !== d) throw new Error(`reaction: tujuan "${d.name}" bukan frame tingkat atas`); }
        else if (a.type !== 'BACK') throw new Error('reaction: tipe aksi tidak dikenal ' + a.type);
      }
    }
    this.reactions = rs;
  }
  async setTextStyleIdAsync(id) { const s = state.styles.find((x) => x.id === id); if (!s) throw new Error('setTextStyleIdAsync: style tidak ada'); if (!state.loaded.has(s.fontName.style)) throw new Error(`font style ${s.fontName.style} belum dimuat`); this.fontName = s.fontName; this._styled = true; }
  setRangeFills(a, b, f) { if (!(a >= 0 && b <= this.characters.length)) throw new Error('setRangeFills di luar rentang'); }
}
function findById(id) { let found = null; const walk = (n) => { if (n.id === id) found = n; n.children.forEach(walk); }; state.pages.forEach(walk); return found; }
const mkPage = (name) => { const p = new Node('PAGE'); p.name = name; p.flowStartingPoints = []; state.pages.push(p); return p; };
const make = (type, init = {}) => { const n = new Node(type); Object.assign(n, init); if (state.current) { state.current.children.push(n); n.parent = state.current; } return n; };

const figma = {
  root: { get children() { return state.pages; } },
  get currentPage() { return state.current; },
  async setCurrentPageAsync(p) { state.current = p; },
  createPage() { return mkPage('Page'); },
  createFrame() { return make('FRAME', { fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }] }); },
  createText() { return make('TEXT'); }, createRectangle() { return make('RECTANGLE'); }, createLine() { return make('LINE'); },
  createSection() { return make('SECTION'); },
  createNodeFromSvg(svg) { if (!svg.includes('<svg')) throw new Error('svg tidak valid'); const f = make('FRAME'); const v = new Node('VECTOR'); v.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; f.appendChild(v); return f; },
  createTextStyle() { const s = { id: 'S:' + nextId++, name: 'style', fontName: { family: 'Inter', style: 'Regular' } }; state.styles.push(s); return s; },
  async getLocalTextStylesAsync() { return state.styles; },
  async loadFontAsync(f) { if (f.family !== 'Inter' || !FONTS.has(f.style)) throw new Error(`font tidak tersedia: ${f.family} ${f.style}`); state.loaded.add(f.style); },
  command: undefined,
  notify() {},
  viewport: { scrollAndZoomIntoView() {} },
  closePlugin(msg) { state.closed = msg; },
  variables: {
    async getLocalVariableCollectionsAsync() { return state.collections; },
    createVariableCollection(name) { const c = { id: 'C:' + nextId++, name, modes: [{ modeId: 'm' + nextId, name: 'Mode 1' }], variableIds: [], renameMode(id, n) { this.modes[0].name = n; }, addMode() { throw new Error('Limited to 1 modes only'); } }; state.collections.push(c); return c; },
    createVariable(name, col, type) { if (type !== 'COLOR' && type !== 'FLOAT') throw new Error('tipe variabel'); const v = { id: 'V:' + nextId++, name, scopes: [], setValueForMode() {} }; col.variableIds.push(v.id); state.vars.set(v.id, v); return v; },
    async getVariableByIdAsync(id) { return state.vars.get(id) ?? null; },
    setBoundVariableForPaint(p, field, v) { if (!v || !v.id) throw new Error('setBoundVariableForPaint: variabel tidak valid'); return { ...p, boundVariables: { [field]: { type: 'VARIABLE_ALIAS', id: v.id } } }; },
  },
};
Object.preventExtensions(figma); // API plugin asli: objek figma tidak bisa ditambah properti
function reset() { nextId = 1; state.loaded.clear(); state.closed = null; state.pages.length = 0; state.styles.length = 0; state.collections.length = 0; state.vars.clear(); state.current = mkPage('Design System'); }
module.exports = { figma, state, Node, reset, mkPage };
