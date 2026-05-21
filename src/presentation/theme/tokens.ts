// Paleta inspirada no github.com — light e dark vêm direto do site real.

export interface ColorPalette {
  // Identidade
  primary: string;
  primaryContrast: string;
  // Superfícies
  background: string;
  surface: string;
  surfaceMuted: string;
  // Texto
  text: string;
  textMuted: string;
  textInverse: string;
  // Borda
  border: string;
  borderMuted: string;
  // Feedback
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export const lightColors: ColorPalette = {
  primary: '#1f883d', // verde Octocat
  primaryContrast: '#ffffff',

  background: '#ffffff',
  surface: '#f6f8fa', // cinza claríssimo do gh.com
  surfaceMuted: '#eaeef2', // hover, pressed

  text: '#1f2328', // texto principal do gh.com
  textMuted: '#656d76', // labels, datas, secundário
  textInverse: '#ffffff',

  border: '#d0d7de',
  borderMuted: '#eaeef2',

  success: '#1a7f37',
  warning: '#9a6700',
  danger: '#cf222e', // vermelho de issues do gh.com
  info: '#0969da', // azul de links
};

export const darkColors: ColorPalette = {
  primary: '#2ea043',
  primaryContrast: '#ffffff',

  background: '#0d1117', // fundo dark oficial do gh.com
  surface: '#161b22',
  surfaceMuted: '#1c2128',

  text: '#e6edf3',
  textMuted: '#8b949e',
  textInverse: '#0d1117',

  border: '#30363d',
  borderMuted: '#21262d',

  success: '#3fb950',
  warning: '#d29922',
  danger: '#f85149',
  info: '#58a6ff',
};

// Escala 4px.
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export const typography = {
  display: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  title: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  heading: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
} as const;

export type TypographyVariant = keyof typeof typography;
