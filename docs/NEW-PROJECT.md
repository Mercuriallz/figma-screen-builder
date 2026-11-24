# Memulai proyek baru (dari nol sampai tergambar di Figma)

Prasyarat: Figma Desktop, Node 18+, kodebase aplikasi yang ingin digambar. Untuk menulis modul layar secara otomatis: Claude Code (atau agen sejenis).

## 1. Buat kerangka
```bash
node scaffold.js aplikasi-saya --kit mobile     # mobile 360x800, runner single (prototype)
node scaffold.js aplikasi-saya --kit web        # web 1440px, runner chunked (per bagian)
```
Memilih jenis: **mobile** bila aplikasinya layar ponsel (satu run, ada prototype). **web** untuk panel desktop (sidebar, tabel, dialog); halaman web jauh lebih berat sehingga dibagi per bagian.
Aplikasi mobile yang sangat besar (>±15 ribu simpul) juga bisa memakai runner `chunked`: ubah `runner` di `project.json` (prototype dimatikan karena tujuan tautan harus ada di run yang sama).

## 2. Isi tema (`projects/aplikasi-saya/theme.config.js`)
Salin nilai asli dari kode aplikasi: palet terang dan gelap, gaya teks, dan menu/tab. Detail setiap field: [`THEME-CONFIG.md`](THEME-CONFIG.md).
Dengan Claude: gunakan prompt "Turunkan tema" di [`WRITING-SCREENS.md`](WRITING-SCREENS.md).

## 3. Tulis layar (`projects/aplikasi-saya/screens/NN-modul.js`)
Satu berkas per modul/fitur. Tiap berkas memanggil `registerScreen({ key, group, title, build })`. Panduan, aturan, dan prompt untuk Claude: [`WRITING-SCREENS.md`](WRITING-SCREENS.md).
Mulai dari satu modul kecil, uji, baru tambah modul lain.

## 4. Bangun dan uji (di mock)
```bash
node build.js aplikasi-saya
node test.js  aplikasi-saya            # harus berakhir "... 0 masalah"
```
Web: `node plan.js aplikasi-saya` sesudah menambah/mengubah layar (membuat rencana bagian dan menu plugin), lalu `node test.js aplikasi-saya chunk-0` dst.

## 5. Jalankan di Figma
1. Buat file Figma kosong (Starter: akan memakai 2 halaman, *Screens* dan *Flows*).
2. **Plugins → Development → Import plugin from manifest…** → `projects/aplikasi-saya/manifest.json` (impor ulang bila `manifest.json` berubah, mis. setelah `plan.js`).
3. **Plugins → Development → <nama plugin>** (web: pilih satu bagian).
4. Tunggu toast "Selesai …". Jika ada masalah: salin toast atau teks merah **WX Build log** di halaman **Flows**, perbaiki modul, ulangi.
Plugin menghapus hasil lamanya sendiri (nama berawalan `WX `) sebelum menggambar ulang.

## 6. Prototype (mobile)
Panggil `link(node, 'kunci-layar-tujuan', 'push'|'modal'|'back')` pada tombol/menu, dan `flowStart('kunci-layar', 'Nama alur')`. Prototype dipasang untuk mode terang
(`WIRE_THEMES` di `core/runner-single.js`). Tujuan harus layar yang ada di run yang sama.

## Ukuran yang wajar
Mobile ≈ 75 simpul per frame; web ≈ 500 simpul per frame. Satu run nyaman ≤ ±12–15 ribu simpul. `node test.js` menampilkan jumlah simpul.
