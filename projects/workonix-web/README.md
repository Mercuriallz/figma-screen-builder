# Workonix Web Builder

Proyek contoh Workonix HRIS (web). Tema: `theme.config.js`; layar: `screens/`; hasil build: `code.js` + `manifest.json`.

```bash
# dari root repo
node build.js workonix-web
node test.js  workonix-web chunk-0     # uji satu bagian
node plan.js  workonix-web             # setelah mengubah layar: bagi ulang jadi bagian + menu plugin
```

## Menjalankan di Figma Desktop
1. Buka file kosong (mis. "Workonix Web").
2. **Plugins → Development → Import plugin from manifest…** → `projects/workonix-web/manifest.json`.
3. **Plugins → Development → Workonix Web Builder →** pilih **satu bagian** (01…21). Jalankan bagian lain satu per satu; jangan pilih "Semua sekaligus".
4. Tunggu toast "Selesai …". Galat: salin toast atau teks merah **WX Build log** di halaman **Flows**.

Isi: 395 layar × terang/gelap dalam 21 bagian — Auth+Super Admin (1), Dasbor+Persetujuan (1), Karyawan+Hak Akses (4), Organisasi (2), Kehadiran+Jadwal (3), Cuti+Lembur (3), Payroll (5), Daily Timesheet (2). Prototype web belum dipasang.
