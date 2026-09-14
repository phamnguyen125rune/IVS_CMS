export const themeColors = {
  blue: '#2563eb',
  violet: '#7c3aed',
  green: '#16a34a',
  orange: '#ea580c',
  red: '#dc2626',
} as const;

export type ThemeColor = keyof typeof themeColors;

export const defaultThemeColor: ThemeColor = 'blue';
