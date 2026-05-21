import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '@presentation/theme/ThemeContext';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'muted';
  testID?: string;
}

export function Card({ children, onPress, variant = 'default', testID }: CardProps) {
  const { colors, spacing, radius } = useTheme();

  const baseStyle = {
    backgroundColor: variant === 'muted' ? colors.surfaceMuted : colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        testID={testID}
        style={({ pressed }) => ({ ...baseStyle, opacity: pressed ? 0.85 : 1 })}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={baseStyle} testID={testID}>
      {children}
    </View>
  );
}
