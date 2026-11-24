/* THEME CONFIG — Workonix Web (sumber: components/ThemeRegistry.tsx, AppShell.tsx, app/(owner)/layout.tsx) */
const TOKEN_NAMES = [
  'color/primary', 'color/primary-light', 'color/primary-dark', 'color/primary-surface',
  'color/background', 'color/surface', 'color/border',
  'color/text/primary', 'color/text/secondary', 'color/text/disabled',
  'color/success', 'color/success-surface', 'color/warning', 'color/warning-surface',
  'color/danger', 'color/danger-surface', 'color/info', 'color/info-surface', 'color/sidebar',
];

const PALETTE = { // [light, dark] — dari buildTheme() di ThemeRegistry.tsx
  'color/primary': ['#1A56A7', '#5B9BF0'], 'color/primary-light': ['#1565C0', '#8AB9F5'], 'color/primary-dark': ['#154785', '#3F86E6'],
  'color/primary-surface': ['#E8EEF6', '#16263D'],
  'color/background': ['#F7F8FA', '#0B1220'], 'color/surface': ['#FFFFFF', '#121A2B'], 'color/border': ['#E7E9EC', '#273244'],
  'color/text/primary': ['#1A2028', '#E6EAF0'], 'color/text/secondary': ['#5C6470', '#9AA6B8'], 'color/text/disabled': ['#9AA1AC', '#5F6B7E'],
  'color/success': ['#1D9E75', '#34C38F'], 'color/success-surface': ['#E6F5F0', '#14302A'],
  'color/warning': ['#D97706', '#F5A524'], 'color/warning-surface': ['#FCF0E0', '#33291A'],
  'color/danger': ['#DC2626', '#F06A6A'], 'color/danger-surface': ['#FCE8E8', '#3A1F22'],
  'color/info': ['#0288D1', '#4FC3F7'], 'color/info-surface': ['#E1F2FA', '#15303D'],
  'color/sidebar': ['#1A56A7', '#0F2647'],
};

const TEXT_STYLES = { // Inter sebagai pengganti font sistem. [nama, style, ukuran, tinggi baris]
  h4: ['text/h4', 'Bold', 34, 41], h5: ['text/h5', 'Bold', 24, 32], h6: ['text/h6', 'Semi Bold', 20, 28],
  subtitle: ['text/subtitle', 'Semi Bold', 16, 24], body: ['text/body', 'Regular', 16, 24],
  body2: ['text/body2', 'Regular', 14, 20], 'body2-strong': ['text/body2-strong', 'Semi Bold', 14, 20],
  caption: ['text/caption', 'Regular', 12, 17], 'caption-strong': ['text/caption-strong', 'Semi Bold', 12, 17],
  th: ['text/table-head', 'Bold', 12, 16, 4], button: ['text/button', 'Semi Bold', 14, 20], label: ['text/label', 'Bold', 11, 14, 8],
};

/* ---------- Menu sidebar per peran (layout.tsx) ---------- */
const NAV = {
  owner: [
    { items: [{ label: 'Dasbor', icon: 'dashboard' }, { label: 'Persetujuan', icon: 'inbox', badge: 3 }] },
    { title: 'SDM', items: [{ label: 'Karyawan', icon: 'users' }, { label: 'Akses Akun', icon: 'key' }, { label: 'Surat Peringatan', icon: 'gavel' }] },
    { title: 'OPERASIONAL', items: [
      { label: 'Kehadiran', icon: 'fingerprint', children: ['Rekap Absensi', 'Koreksi Absensi', 'Roster', 'Shift', 'Hari Libur'] },
      { label: 'Cuti', icon: 'umbrella', children: ['Pengajuan Cuti', 'Saldo Cuti'] },
      { label: 'Lembur', icon: 'timer', children: ['Pengajuan Lembur', 'Rekap Lembur'] },
      { label: 'Daily Timesheet', icon: 'clipboard', children: ['All Department', 'Pengaturan Pilihan'] }] },
    { title: 'PAYROLL', items: [{ label: 'Payroll', icon: 'money', children: ['Proses Payroll', 'Laporan Payroll', 'Gaji Tambahan', 'Penetapan Gaji', 'Struktur Gaji', 'Komponen Gaji'] }] },
    { title: 'PERUSAHAAN', items: [{ label: 'Organisasi', icon: 'building', children: ['Daftar Perusahaan', 'Struktur Perusahaan', 'Jabatan', 'Struktur Organisasi', 'Lokasi Kantor'] }, { label: 'Laporan Pengajuan', icon: 'file' }] },
    { title: 'PENGATURAN', items: [{ label: 'Pengaturan', icon: 'settings', children: ['Aturan Absensi', 'Pengaturan Cuti', 'Pengaturan Lembur', 'Pengaturan Payroll'] }, { label: 'Hak Akses', icon: 'shield' }] },
    { title: 'SAYA', items: [{ label: 'Pengajuan Saya', icon: 'person', children: ['Koreksi Absensi ', 'Cuti ', 'Lembur ', 'Slip Gaji', 'Timesheet: Dashboard', 'Timesheet: My Activity'] }] },
  ],
  employee: [
    { title: 'SAYA', items: [{ label: 'Profil Saya', icon: 'person' }, { label: 'Cuti  ', icon: 'umbrella' }, { label: 'Lembur  ', icon: 'timer' }, { label: 'Koreksi Absensi  ', icon: 'file' }, { label: 'Daily Timesheet', icon: 'clipboard', children: ['Dashboard', 'My Activity', 'Team Activity', 'Shared (All)'] }] },
    { title: 'LAINNYA', items: [{ label: 'Persetujuan ', icon: 'inbox', badge: 2 }] },
  ],
  super: [{ title: 'PLATFORM', items: [{ label: 'Dasbor ', icon: 'dashboard' }, { label: 'Grup', icon: 'building' }, { label: 'Paket', icon: 'plans' }] }],
};
/** Label aktif: tulis persis label menu; spasi di ujung hanya pembeda label ganda (mis. "Cuti " = Cuti di Pengajuan Saya). */
const ROLE_META = { owner: ['Pemilik', '#C4B5FD'], employee: ['Karyawan', '#6EE7B7'], super: ['Super Admin', '#FCA5A5'] };

