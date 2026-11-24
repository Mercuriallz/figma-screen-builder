/* THEME CONFIG — Workonix Mobile (sumber: lib/constant/theme/app_color.dart, app_text.dart) */
const TOKEN_NAMES = [
  'color/primary', 'color/primary-dark', 'color/primary-light', 'color/primary-surface',
  'color/background', 'color/surface', 'color/border',
  'color/text/primary', 'color/text/secondary', 'color/text/disabled',
  'color/success', 'color/success-surface', 'color/warning', 'color/warning-surface',
  'color/danger', 'color/danger-surface', 'color/info', 'color/info-surface',
];

const PALETTE = { // AppPalette (app_color.dart): [light, dark]
  'color/primary': ['#1565C0', '#4C8DF6'], 'color/primary-dark': ['#0D47A1', '#0B3A82'],
  'color/primary-light': ['#42A5F5', '#90CAF9'], 'color/primary-surface': ['#E8F1FB', '#16263D'],
  'color/background': ['#F4F6F9', '#0F1419'], 'color/surface': ['#FFFFFF', '#1A2027'], 'color/border': ['#E3E8EF', '#2A333D'],
  'color/text/primary': ['#1A2027', '#E6EAF0'], 'color/text/secondary': ['#5A6672', '#9AA6B2'], 'color/text/disabled': ['#9AA4B0', '#5F6B78'],
  'color/success': ['#2E7D32', '#66BB6A'], 'color/success-surface': ['#E8F5E9', '#1B2E1F'],
  'color/warning': ['#EF6C00', '#FFA040'], 'color/warning-surface': ['#FFF3E0', '#33261A'],
  'color/danger': ['#C62828', '#EF5350'], 'color/danger-surface': ['#FFEBEE', '#3A1D1F'],
  'color/info': ['#0277BD', '#4FC3F7'], 'color/info-surface': ['#E1F5FE', '#15303D'],
};

const TEXT_STYLES = { // AppText (app_text.dart)
  display: ['text/display', 'Bold', 34, 37], h1: ['text/h1', 'Bold', 22, 28], h2: ['text/h2', 'Semi Bold', 17, 22],
  body: ['text/body', 'Regular', 14, 20], 'body-strong': ['text/body-strong', 'Semi Bold', 14, 20],
  caption: ['text/caption', 'Regular', 12, 17], label: ['text/label', 'Semi Bold', 11, 14, 4],
};

/** Tab bottom nav: [ikon, label, kunci layar tujuan, {badge:true}?] */
const BOTTOM_NAV = [['fingerprint', 'Absensi', 'absensi-home'], ['umbrella', 'Cuti', 'cuti-list'], ['inbox', 'Persetujuan', 'persetujuan-inbox', { badge: true }], ['person', 'Profil', 'profil']];
