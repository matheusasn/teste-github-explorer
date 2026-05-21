import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text as RNText, View } from 'react-native';
import { useTheme } from '@presentation/theme/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const { colors, spacing, radius } = useTheme();
  const isDisabled = disabled || loading;

  const variants = {
    primary: { bg: colors.primary, fg: colors.primaryContrast, border: 'transparent' },
    secondary: { bg: 'transparent', fg: colors.text, border: colors.border },
    ghost: { bg: 'transparent', fg: colors.text, border: 'transparent' },
  };
  const v = variants[variant];

  const sizes = {
    sm: { paddingH: spacing.md, paddingV: spacing.xs, fontSize: 12 },
    md: { paddingH: spacing.lg, paddingV: spacing.sm, fontSize: 14 },
    lg: { paddingH: spacing.xl, paddingV: spacing.md, fontSize: 16 },
  };
  const s = sizes[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: v.bg,
        borderColor: v.border,
        borderWidth: 1,
        borderRadius: radius.md,
        paddingHorizontal: s.paddingH,
        paddingVertical: s.paddingV,
        opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        gap: spacing.sm,
      })}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.fg} />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          <RNText style={{ color: v.fg, fontSize: s.fontSize, fontWeight: '600' }}>{label}</RNText>
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
}
