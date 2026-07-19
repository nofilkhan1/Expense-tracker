export const colors = {
  dark: {
    bg: '#0F172A',
    surface: '#1E293B',
    surfaceBorder: 'rgba(255,255,255,0.06)',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    income: '#34C759',
    expense: '#FF453A',
    warning: '#F59E0B',
    accent: '#8B5CF6',
    primary: '#F59E0B',
    primaryLight: '#FBBF24',
  },
  light: {
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceBorder: 'rgba(0,0,0,0.06)',
    text: '#0F172A',
    textSecondary: '#64748B',
    income: '#34C759',
    expense: '#FF453A',
    warning: '#F59E0B',
    accent: '#7C3AED',
    primary: '#D97706',
    primaryLight: '#F59E0B',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
};

export const typography = {
  fontFamily: 'System',
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 22,
    xxl: 34,
    xxxl: 42,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  lg: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

export const touchTarget = 44;
