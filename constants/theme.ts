export const colors = {
  dark: {
    bg: '#121212',
    surface: '#1C1C1E',
    surfaceBorder: 'rgba(255,255,255,0.08)',
    text: '#F2F2F2',
    textSecondary: '#8E8E93',
    income: '#34C759',
    expense: '#FF453A',
    warning: '#FF9F0A',
    accent: '#0A84FF',
  },
  light: {
    bg: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceBorder: 'rgba(0,0,0,0.06)',
    text: '#18181B',
    textSecondary: '#8E8E93',
    income: '#34C759',
    expense: '#FF453A',
    warning: '#FF9F0A',
    accent: '#0A84FF',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
};

export const typography = {
  fontFamily: 'Inter',
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

export const touchTarget = 44;
