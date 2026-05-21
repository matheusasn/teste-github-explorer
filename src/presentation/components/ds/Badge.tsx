import { Text as RNText, View } from 'react-native';
import { useTheme } from '@presentation/theme/ThemeContext';
import type { ColorPalette } from '@presentation/theme/tokens';

type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  size?: BadgeSize;
}

interface ToneStyle {
  background: string;
  foreground: string;
}

function getToneStyle(tone: BadgeTone, colors: ColorPalette): ToneStyle {
  switch (tone) {
    case 'neutral':
      return { background: colors.surfaceMuted, foreground: colors.textMuted };
    case 'primary':
      return { background: colors.primary, foreground: colors.primaryContrast };
    case 'success':
      return { background: colors.success, foreground: colors.primaryContrast };
    case 'warning':
      return { background: colors.warning, foreground: colors.primaryContrast };
    case 'danger':
      return { background: colors.danger, foreground: colors.primaryContrast };
    case 'info':
      return { background: colors.info, foreground: colors.primaryContrast };
  }
}

export function Badge({ label, tone = 'neutral', size = 'sm' }: BadgeProps) {
  const { colors, spacing, radius } = useTheme();
  const t = getToneStyle(tone, colors);

  const paddingH = size === 'sm' ? spacing.sm : spacing.md;
  const paddingV = size === 'sm' ? 2 : spacing.xs;
  const fontSize = size === 'sm' ? 11 : 12;

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: t.background,
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
        borderRadius: radius.full,
      }}
    >
      <RNText
        style={{
          color: t.foreground,
          fontSize,
          lineHeight: fontSize + 4,
          fontWeight: '600',
        }}
      >
        {label}
      </RNText>
    </View>
  );
}
