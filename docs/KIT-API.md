# Daftar fungsi kit

Dokumentasi rinci ada sebagai komentar di atas tiap fungsi di `core/`. Ringkasan:

## `core/kit-base.js` (semua proyek)
| Fungsi | Ringkas |
|---|---|
| `box(name, o)` | auto-layout frame. `o`: `dir 'H'\|'V'`, `gap`, `pad` (n atau `[t,r,b,l]`), `ax`, `ay`, `fill`/`stroke` (token), `sw`, `radius`, `theme`, `parent`, `fillW`, `fixed [w,h]`, `clip` |
| `txt(str, style, color, theme, o)` | teks bergaya. `o`: `parent`, `fillW`, `w`, `upper`, `align`, `size`, `name` |
| `icon(name, size, color, theme, parent, fill?)` | ikon garis dari `ICONS`; `registerIcons({nama: '<path…/>'})` menambah |
| `gap(parent, h)`, `vgap(parent, w)`, `spacer(parent)` | pengisi ruang |
| `pv(theme, token)` | paint terikat variabel (atau putih) |
| `makeAutoLayout(dir)` | pengganti `figma.createAutoLayout` (yang tidak ada di API plugin) |
| `registerScreen(def)`, `link(node, target, kind)`, `flowStart(key, name)` | registry layar dan prototype. `kind`: `push`, `modal`, `back` |
| `ensureFoundations()` | membuat variabel + gaya teks dari `theme.config.js` bila belum ada |

## `core/kit-mobile.js`
`phone(name, th, title, {h, back, gap, pad, actions, noAppBar})` → `{ f, body }` · `bottomNav(th, frame, activeIdx, {badge})` · `bottomBar(th, frame)` · `fab(th, frame, label, icon)` ·
`badge(label, tone, icon, th, parent)` · `chip(label, selected, icon, th, parent)` · `button(label, th, parent, {variant, w, h, icon})` · `card(th, parent, {…})` ·
`field(placeholder, th, parent, {value, icon, trailing, focus, error})` · `sectionLabel` · `infoRow` · `avatar` · `emptyState(icon, title, msg, th, parent, tone)` · `heroCard(th, parent)`.

## `core/kit-web.js`
`page(name, th, {role, active, h, user, noShell})` → `{ f, main }` (shell: sidebar dari `NAV` + app bar) · `pageHeader(th, parent, title, subtitle)` → baris aksi · `toolbar(th, parent)` → `{left,right}` ·
`button(label, th, parent, {v, color, size, icon, endIcon, disabled})` · `iconButton` · `chip(label, th, parent, {color, variant})` · `inputField(label, value, th, parent, {w, select, multiline, error, helper, icon, focus})` ·
`searchInput` · `tabs(labels, activeIdx, th, parent)` · `card(th, parent, {…})` · `cardTitle` · `statCard(label, value, sub, icon, th, parent)` · `alertBox(severity, msg, th, parent, title?)` ·
`table(th, parent, {cols, rows, rowH, foot})` (sel: string, `{t,sub}`, `{chip,color}`, `{avatar,name,sub}`, `{actions:[]}`, `{check}`, `{switch}`, `{icon,t}`) · `dialog(th, frame, {title, w, build, actions})` ·
`emptyState` · `kv(label, value, th, parent)` · `checkbox` · `toggle` · `avatar`.
