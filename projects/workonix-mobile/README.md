# Workonix Mobile Builder

Proyek contoh Workonix HRIS (mobile). Tema: `theme.config.js`; layar: `screens/`; hasil build: `code.js` + `manifest.json`.

```bash
# dari root repo
node build.js workonix-mobile
node test.js  workonix-mobile
```

## Menjalankan di Figma Desktop
1. Buka file kosong (mis. "Workonix Mobile").
2. **Plugins → Development → Import plugin from manifest…** → `projects/workonix-mobile/manifest.json`.
3. **Plugins → Development → Workonix Mobile Builder**. Sekali jalan ±5–10 menit; prototype terang ±263 tautan.
4. Tunggu toast "Selesai …". Galat: salin toast atau teks merah **WX Build log** di halaman **Flows**.

Isi: 93 layar × terang/gelap — Daily Timesheet, Auth dan Profil, Absensi, Cuti, Lembur, Persetujuan, Tukar Shift, Slip Gaji, Surat Peringatan. Titik awal prototype: Daily Timesheet, Alur masuk, Absensi harian, Ajukan cuti, Lapor lembur, Putuskan pengajuan, Tukar shift, Lihat slip gaji, Baca surat peringatan.
