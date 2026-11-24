# Catatan teknis Figma (jebakan yang sudah ditemui)

- **`figma.createAutoLayout` tidak ada di API plugin.** Itu pembantu lingkungan MCP. Kit memakai `makeAutoLayout` (frame + `layoutMode`).
- **Objek `figma` tidak bisa ditambah properti** (*"object is not extensible"*); jangan membuat polyfill dengan menugaskan ke `figma.*`.
- **Menugaskan properti yang tidak ada pada jenis simpul** juga memunculkan *"object is not extensible"* (mis. `paddingLeft` pada TEXT, `gap` pada FRAME — yang benar `itemSpacing`). Mock uji menangkap kelas galat ini.
- **Plan Starter**: 1 mode per koleksi variabel → `Color Light` dan `Color Dark` sebagai dua koleksi. Maksimal 3 halaman per file. Kuota MCP: 20 panggilan/bulan (plugin lokal tidak terhitung).
- **Prototype**: tujuan `NAVIGATE` harus **frame tingkat atas di halaman yang sama** (frame di dalam Section boleh, frame bersarang tidak). `setReactionsAsync` ±1 detik per tautan pada file besar.
- **Font**: Inter; gaya valid `Regular|Medium|Semi Bold|Bold` ("Semi Bold" pakai spasi). Muat font (`loadFontAsync`) sebelum mengubah `characters`.
- **Warna**: kanal 0–1; paint SOLID tidak punya field `a` (opasitas di paint). Gradasi tidak bisa terikat variabel → pakai hex dari palet (kit `heroCard`).
- **`layoutSizing`**: `FILL` hanya untuk anak auto-layout yang tidak absolut; `HUG` hanya untuk frame auto-layout atau teks di dalamnya; `resize()` mereset ke FIXED.
- **`layoutPositioning = 'ABSOLUTE'`** hanya untuk anak auto-layout (dipakai FAB, scrim dialog, badge).
- **Section**: `figma.createSection()`, anak dipindah dengan `appendChild`, ukuran `resizeWithoutConstraints`.
- **Beban**: ±12–15 ribu simpul per run nyaman. Frame yang dibuat menumpuk di (0,0) sampai tahap "Menyusun section" — itu wajar.
- **`figma.command`**: nilai `command` dari `manifest.json` → `menu` (dipakai runner chunked untuk memilih bagian). Di mock, properti `command` harus sudah ada di objek `figma`.
- **Dokumentasi MCP Figma resmi** (tersedia lewat resource MCP `file://figma/docs/*`) berguna untuk batas kuota dan perilaku `generate_figma_design`.
