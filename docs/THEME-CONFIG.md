# `theme.config.js` — satu-satunya berkas tema per proyek

Berkas ini didefinisikan sebagai konstanta global yang dibaca `core/kit-base.js` dan kit mobile/web. **Jangan mengubah nama token (kunci), ubah nilainya.**

## `TOKEN_NAMES`
Daftar nama token warna (variabel Figma). Pertahankan 18 nama bawaan (mobile) / 19 (web, ditambah `color/sidebar`). Nama dipakai kit dan modul layar:
`color/primary`, `-light`, `-dark`, `-surface`, `color/background`, `color/surface`, `color/border`, `color/text/primary|secondary|disabled`,
`color/success|warning|danger|info` dan `-surface`-nya.

## `PALETTE`
`{ 'color/primary': ['#TERANG', '#GELAP'], ... }` — hex terang dan gelap per token. Ambil dari tema aplikasi (mis. `ThemeData`/`AppColor` di Flutter, `createTheme` di MUI, CSS variable di web).
Mode gelap bukan sekadar membalik warna: ambil nilai gelap yang benar-benar dipakai aplikasi.
Token `-surface` = latar tipis untuk badge/alert status (mis. hijau muda untuk "sukses").

## `TEXT_STYLES`
`{ kunci: ['text/nama', 'Gaya Inter', ukuran, tinggiBaris, letterSpacingPersen?] }`. Gaya Inter yang valid: `Regular`, `Medium`, `Semi Bold`, `Bold` (perhatikan spasi pada "Semi Bold").
- Kunci yang dipakai kit **mobile**: `display, h1, h2, body, body-strong, caption, label`.
- Kunci yang dipakai kit **web**: `h4, h5, h6, subtitle, body, body2, body2-strong, caption, caption-strong, th, button, label`.
Font aplikasi yang bukan Inter diganti Inter (Figma menyediakannya untuk semua akun).

## Khusus mobile — `BOTTOM_NAV`
`[[ikon, label, kunciLayarTujuan, { badge: true }?], ...]` — tab bottom navigation. `bottomNav(th, frame, indexAktif, { badge: 3 })` menggambarnya dan membuat tautan prototype antar tab.

## Khusus web — `NAV` dan `ROLE_META`
- `NAV = { peran: [ { title?: 'GRUP', items: [ { label, icon, badge?, children?: ['sub1', 'sub2'] } ] } ] }` — menu sidebar per peran. `page(...,{ role, active })` menandai item aktif lewat **label persis sama**
  (label ganda di peran yang sama dibedakan spasi di ujung).
- `ROLE_META = { peran: ['Label Peran', '#warnaTitik'] }` — label dan titik warna di bawah logo sidebar.
- Logo: kotak "W" + teks "workonix" ada di `sidebar()` di `core/kit-web.js`; ubah di sana (atau jadikan konfigurasi) untuk merek lain.

## Ikon
Ikon garis 24×24 di `core/kit-base.js` (`ICONS`). Tambah ikon proyek dengan `registerIcons({ 'nama': '<path d="..."/>' })` di dalam modul layar (beri awalan proyek agar tidak bentrok). SVG harus valid.
