import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const VoltDarkPalette = {
  // Surfaces
  background: '#0b1326',
  surface: '#0b1326',
  surfaceContainerLowest: '#060e20',
  surfaceContainerLow: '#131b2e',
  surfaceContainer: '#171f33',
  surfaceContainerHigh: '#222a3d',
  surfaceContainerHighest: '#2d3449',
  surfaceBright: '#31394d',
  surfaceVariant: '#1e293b',

  // Accents
  primary: '#4cd7f6', // Cyber Cyan
  primaryContainer: '#06b6d4',
  onPrimary: '#003640',
  onPrimaryContainer: '#001f26',

  secondary: '#8b5cf6', // Electric Violet
  secondaryLight: '#d0bcff',
  secondaryContainer: '#571bc1',
  onSecondary: '#ffffff',

  tertiary: '#10b981', // Precision Emerald
  tertiaryContainer: '#1bbd85',
  onTertiary: '#002113',

  error: '#ffb4ab',
  errorContainer: '#93000a',
  onError: '#690005',

  // Text & Outlines
  textPrimary: '#dae2fd',
  textSecondary: '#94a3b8',
  textTertiary: '#64748b',
  textInverse: '#0b1326',
  outline: '#3d494c',
  outlineVariant: '#1e293b',
  divider: 'rgba(255, 255, 255, 0.08)',

  // Special
  gold: '#fbbf24',
  pureWhite: '#ffffff',
  pureBlack: '#000000',
  overlay: 'rgba(6, 14, 32, 0.75)',
};

export const VoltLightPalette = {
  // Surfaces
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f1f5f9',
  surfaceContainer: '#e2e8f0',
  surfaceContainerHigh: '#cbd5e1',
  surfaceContainerHighest: '#94a3b8',
  surfaceBright: '#ffffff',
  surfaceVariant: '#e2e8f0',

  // Accents
  primary: '#0891b2',
  primaryContainer: '#06b6d4',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#083344',

  secondary: '#7c3aed',
  secondaryLight: '#a78bfa',
  secondaryContainer: '#ddd6fe',
  onSecondary: '#ffffff',

  tertiary: '#059669',
  tertiaryContainer: '#34d399',
  onTertiary: '#ffffff',

  error: '#dc2626',
  errorContainer: '#fee2e2',
  onError: '#ffffff',

  // Text & Outlines
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textTertiary: '#94a3b8',
  textInverse: '#ffffff',
  outline: '#cbd5e1',
  outlineVariant: '#e2e8f0',
  divider: 'rgba(0, 0, 0, 0.08)',

  // Special
  gold: '#d97706',
  pureWhite: '#ffffff',
  pureBlack: '#000000',
  overlay: 'rgba(15, 23, 42, 0.6)',
};

export const Typography = {
  displayLg: {
    fontSize: 30,
    fontWeight: '800' as const,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  headlineLg: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  headlineMd: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  headlineSm: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  bodyLg: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySm: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  labelLg: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  labelMd: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
  labelSm: {
    fontSize: 10,
    fontWeight: '700' as const,
    lineHeight: 14,
    letterSpacing: 0.5,
  },
  priceHero: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  priceCard: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 22,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Roundness = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export type ThemeColors = typeof VoltDarkPalette;

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  currency: 'INR' | 'USD' | 'EUR';
  setCurrency: (c: 'INR' | 'USD' | 'EUR') => void;
  formatPrice: (amountInInr: number) => string;
}

const THEME_STORAGE_KEY = '@volttech_theme_mode';
const CURRENCY_STORAGE_KEY = '@volttech_currency';

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  colors: VoltDarkPalette,
  toggleTheme: () => {},
  currency: 'INR',
  setCurrency: () => {},
  formatPrice: (amt) => `₹${amt.toLocaleString('en-IN')}`,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [currency, setCurrencyState] = useState<'INR' | 'USD' | 'EUR'>('INR');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((val) => {
      if (val !== null) {
        setIsDark(val === 'dark');
      }
    });
    AsyncStorage.getItem(CURRENCY_STORAGE_KEY).then((val) => {
      if (val === 'INR' || val === 'USD' || val === 'EUR') {
        setCurrencyState(val);
      }
    });
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  };

  const setCurrency = (c: 'INR' | 'USD' | 'EUR') => {
    setCurrencyState(c);
    AsyncStorage.setItem(CURRENCY_STORAGE_KEY, c);
  };

  const formatPrice = (amountInInr: number): string => {
    if (currency === 'USD') {
      const usd = Math.round(amountInInr / 85);
      return `$${usd.toLocaleString('en-US')}`;
    }
    if (currency === 'EUR') {
      const eur = Math.round(amountInInr / 92);
      return `€${eur.toLocaleString('en-EU')}`;
    }
    return `₹${amountInInr.toLocaleString('en-IN')}`;
  };

  const colors = isDark ? VoltDarkPalette : VoltLightPalette;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors,
        toggleTheme,
        currency,
        setCurrency,
        formatPrice,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
