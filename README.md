# Figma Screen Builder

Kerangka **plugin Figma lokal** yang menggambar layar sebuah aplikasi (**mobile** 360 × 800 atau **web** 1440 px) ke Figma — **terang dan gelap**, terikat variabel warna dan gaya teks,
dengan **prototype klik** (mobile) — langsung dari definisi layar berupa kode JavaScript. Jalan di Figma Desktop, **tanpa jaringan dan tanpa kuota MCP Figma**
(plan Starter hanya memberi 20 panggilan MCP per bulan).

Dipakai pertama kali untuk Workonix HRIS (contoh lengkap di `projects/`):

| Proyek | Layar | Frame | Catatan |
|---|---|---|---|
| [`projects/workonix-mobile`](projects/workonix-mobile) | 93 | 186 (terang+gelap) | runner `single`, prototype klik mode terang |
| [`projects/workonix-web`](projects/workonix-web) | 395 | 790 (terang+gelap) | runner `chunked`: 21 bagian agar Figma tidak membeku |

> Catatan penting: plugin Figma **tidak bisa membaca kodebase**. Yang menerjemahkan kode aplikasi menjadi *modul layar* adalah Anda — atau **Claude**
> (lihat [`docs/WRITING-SCREENS.md`](docs/WRITING-SCREENS.md) untuk panduan dan prompt siap pakai). Kerangka ini yang menggambar, menguji, dan memasang prototype.

## Mulai cepat (mencoba contoh Workonix)
```bash
git clone <repo-ini> && cd figma-screen-builder
node build.js workonix-mobile        # menulis projects/workonix-mobile/code.js + manifest.json
node test.js  workonix-mobile        # uji terhadap mock API Figma (harus: "0 masalah")
```
Di **Figma Desktop**: buka file kosong → **Plugins → Development → Import plugin from manifest…** → pilih `projects/workonix-mobile/manifest.json`
→ **Plugins → Development → Workonix Mobile Builder**. Tunggu toast **"Selesai: …"** (beberapa menit; Figma bisa terasa lambat — biarkan).
Hasil: halaman **Screens** (satu Section per modul, terang di kiri, gelap di kanan) dan **Flows** (hanya log bila ada masalah).
Untuk web: `node build.js workonix-web` lalu impor `projects/workonix-web/manifest.json` dan jalankan **satu bagian per kali** dari submenu plugin.

## Membuat proyek untuk aplikasi lain
```bash
node scaffold.js aplikasi-saya --kit mobile      # atau --kit web
# 1. edit projects/aplikasi-saya/theme.config.js  (palet terang/gelap, gaya teks, menu)   -> docs/THEME-CONFIG.md
# 2. tulis layar di projects/aplikasi-saya/screens/*.js (manual atau dengan Claude)         -> docs/WRITING-SCREENS.md
node build.js aplikasi-saya && node test.js aplikasi-saya
# (web) node plan.js aplikasi-saya   -> membagi jadi bagian + menu plugin
```
Panduan lengkap dari nol sampai tergambar di Figma: [`docs/NEW-PROJECT.md`](docs/NEW-PROJECT.md).

## Struktur
```
core/
  kit-base.js       token warna (variabel Figma), gaya teks, box/txt/icon, registry layar  — dipakai semua proyek
  kit-mobile.js     komponen ponsel: phone, bottomNav, badge, chip, button, card, field, fab, ...
  kit-web.js        komponen desktop: page/shell+sidebar, table, dialog, tabs, inputField, alertBox, ...
  runner-single.js  bangun semua layar sekali jalan + susun Section + pasang prototype
  runner-chunked.js bangun per bagian (menu plugin per bagian), tanpa prototype
  test/mock-figma.js  tiruan API Figma (menolak enum salah, FILL tanpa induk auto-layout, properti yang tidak ada)
projects/<nama>/
  project.json      { name, id, kit: mobile|web, runner: single|chunked }
  theme.config.js   palet + gaya teks + menu (satu-satunya berkas tema)
  screens/NN-*.js   modul layar (registerScreen)
  code.js, manifest.json   hasil build — yang dimuat Figma (di-commit supaya bisa langsung diimpor)
build.js  test.js  plan.js  scaffold.js    alat bantu (Node 18+, tanpa dependensi)
docs/
```

## Perintah
| Perintah | Fungsi |
|---|---|
| `node build.js <proyek>` | gabungkan core + proyek → `code.js` + `manifest.json` |
| `node test.js <proyek> [chunk-N]` | jalankan di mock Figma; keluar dengan kode ≠ 0 bila ada masalah |
| `node plan.js <proyek>` | (runner chunked) ukur simpul, buat rencana bagian + menu plugin (`BUDGET=12000` bawaan) |
| `node scaffold.js <nama> --kit mobile\|web` | buat kerangka proyek baru |

## Yang perlu diketahui
- **Uji mock ≠ jaminan.** Mock menangkap sebagian besar kesalahan (enum salah, `FILL` sebelum punya induk, properti tak dikenal), tetapi galat yang hanya muncul di Figma asli tetap mungkin.
  Jalankan di Figma dan laporkan teks toast / teks merah **"WX Build log"** di halaman Flows.
- **Starter**: 1 mode per koleksi variabel → mode gelap = koleksi `Color Dark` terpisah (nama variabel sama). Maksimal 3 halaman per file (plugin memakai *Screens* dan *Flows*).
- **Beban**: satu run nyaman sampai ±12–15 ribu simpul; lebih dari itu pakai runner `chunked`. Prototype butuh ±1 detik per tautan.
- **Hasil bukan piksel-sempurna.** Mengikuti struktur dan teks kode; grafik, peta, foto, spinner, dropdown terbuka, dan tooltip diwakili bentuk sederhana.
- **Data contoh harus fiktif** bila file Figma akan dibagikan.
- Catatan teknis API Figma yang sering menjebak: [`docs/FIGMA-NOTES.md`](docs/FIGMA-NOTES.md). Daftar fungsi kit: [`docs/KIT-API.md`](docs/KIT-API.md).
