# Menulis modul layar (manual atau dengan Claude)

Satu modul = satu berkas `projects/<proyek>/screens/NN-nama.js` yang mendaftarkan layar lewat `registerScreen`. Semua berkas digabung ke satu `code.js`, jadi **semua nama top-level bersifat global**:
beri setiap berkas **prefiks** (mis. `ab` / `AB_`) agar tidak bentrok.

## Kerangka sebuah layar
```js
const AB_GROUP = 'Absensi';                       // satu Section per grup
registerScreen({
  key: 'absensi-home',                            // unik; juga tujuan link()
  group: AB_GROUP, title: 'Beranda',
  build: async (th) => {                          // th = 'light' | 'dark'
    const { f, body } = await phone('x', th, 'Absensi');   // web: const { f, main } = await page('x', th, { role, active, h })
    await sectionLabel('Hari ini', th, body);
    const c = card(th, body, { gap: 8 });
    await txt('08:00 – 17:00', 'h2', 'color/text/primary', th, { parent: c });
    const b = await button('Clock In', th, body);
    link(b, 'face-scan');                         // prototype (mobile)
    return f;                                     // WAJIB mengembalikan frame penuh
  },
});
flowStart('absensi-home', 'Absensi harian');      // titik awal prototype
```
Fungsi kit yang tersedia: [`KIT-API.md`](KIT-API.md).

## Aturan yang menjaga gambar tetap benar (mock menolak pelanggaran)
- **Warna hanya lewat nama token** (`'color/primary'`, …) atau `'white'`. Jangan hard-code hex (kecuali gradasi di `heroCard`). Teks di atas warna primer pakai `'white'` (mobile) / `onPrimary(th)` (web).
- `box()` dan `icon()` sinkron; `txt/button/chip/…` async — pakai `await`.
- `layoutSizingHorizontal = 'FILL'` hanya **setelah** simpul jadi anak auto-layout (opsi `parent` + `fillW: true` pada `box` sudah menangani). `resize()` mereset ke FIXED → panggil sebelum `layoutSizing*`.
- `ax` ∈ `MIN|MAX|CENTER|SPACE_BETWEEN`, `ay` ∈ `MIN|MAX|CENTER|BASELINE` (bukan `START/END`).
- Teks panjang: `fillW: true`. Properti teks (`fontSize`, …) hanya untuk simpul TEXT; properti auto-layout (`paddingLeft`, `itemSpacing`, …) hanya untuk FRAME — Figma menolak yang lain dengan *"object is not extensible"*.
- Grafik/peta/foto/kamera: wakili dengan kotak berwarna + ikon atau batang dari `figma.createRectangle()` berwarna token.
- Ikon baru: `registerIcons({ 'ab-nama': '<path d="..."/>' })` (garis 24×24, stroke 2; SVG valid).
- Data contoh **fiktif**.
- Kondisi yang dimiliki layar (terisi, kosong, galat, memuat) dan tiap dialog/sheet = **layar terpisah** dengan `key` sendiri.

## Dengan Claude (disarankan untuk aplikasi besar)
Beri tiap modul ke satu agen; jalankan beberapa agen paralel, masing-masing menulis **satu berkas dengan prefiks sendiri** dan tidak menyentuh berkas lain. Sebelum itu pastikan `theme.config.js` sudah benar dan `node build.js`/`node test.js` lulus untuk proyek kosong.

### Prompt 1 — turunkan tema dari kode
```text
Baca kodebase di <PATH-APLIKASI>. Isi /<PATH-REPO>/projects/<proyek>/theme.config.js:
- PALETTE: nilai hex TERANG dan GELAP untuk semua nama token yang sudah ada (jangan ganti namanya), diambil dari tema aplikasi (<file tema>).
- TEXT_STYLES: ukuran/ketebalan/tinggi baris dari tema tipografi aplikasi (font diganti Inter; gaya valid: Regular, Medium, Semi Bold, Bold).
- <mobile> BOTTOM_NAV: tab bottom navigation (ikon dari daftar ICONS di core/kit-base.js, label asli, kunci layar tujuan).
  <web> NAV dan ROLE_META: menu sidebar per peran dari <file layout>, label persis.
Baca docs/THEME-CONFIG.md dulu. Jangan mengubah berkas lain. Jalankan `node build.js <proyek> && node test.js <proyek>` dan laporkan hasilnya.
```

### Prompt 2 — satu modul layar
```text
Tulis SATU berkas /<PATH-REPO>/projects/<proyek>/screens/<NN-nama>.js untuk fitur "<FITUR>". Prefiks nama top-level: `<xx>` / `<XX>_`. group: '<NAMA GRUP>'.
Sumber kebenaran: <daftar file/halaman kode fitur> (baca juga komponen, model, dan label/enum yang dipakai untuk teks asli). Salin teks asli (judul, label, tombol, pesan kosong/galat).
Setia pada hierarki widget/komponen, jarak, dan kolom/filter. Gambar kondisi: terisi, kosong, galat (+ memuat bila ada), dan setiap dialog/sheet/form sebagai layar terpisah.
Baca dulu: docs/WRITING-SCREENS.md, docs/KIT-API.md, core/kit-base.js, core/kit-<mobile|web>.js, dan satu modul contoh di projects/workonix-<mobile|web>/screens/.
Data contoh fiktif (tanpa nama orang asli). Jangan mengubah berkas lain (kit, runner, tema, modul agen lain).
Verifikasi wajib: `node build.js <proyek> && node test.js <proyek>` harus berakhir "0 masalah" (agen lain menulis berkas lain bersamaan; bila galat berasal dari berkas yang bukan milikmu, tunggu lalu ulangi).
Laporan akhir singkat: kunci layar yang didaftarkan, bagian yang tidak digambar/disederhanakan, output uji. Jangan menempel kode.
```
Setelah semua modul masuk: `node build.js && node test.js` (web: `node plan.js` dulu), lalu jalankan di Figma.

### Prompt 3 — tinjau hasil di Figma
```text
Ini galat/temuan dari Figma: <tempel toast atau WX Build log atau screenshot>. Cari penyebabnya di core/ atau modul terkait, perbaiki,
dan PERKETAT core/test/mock-figma.js agar kesalahan jenis ini tertangkap di uji berikutnya.
```
