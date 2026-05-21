import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useTheme } from '@presentation/theme/ThemeContext';
import type { TypographyVariant } from '@presentation/theme/tokens';

type TextColor = 'text' | 'textMuted' | 'textInverse' | 'primary' | 'danger' | 'success' | 'info';

interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?: TypographyVariant;
  color?: TextColor;
  align?: 'left' | 'center' | 'right';
}

export function Text({ variant = 'body', color = 'text', align, children, ...rest }: TextProps) {
  const { typography, colors } = useTheme();

  return (
    <RNText
      {...rest}
      style={{
        ...typography[variant],
        color: colors[color],
        textAlign: align,
      }}
    >
      {children}
    </RNText>
  );
}
