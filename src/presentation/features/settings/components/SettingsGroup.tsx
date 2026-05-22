import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '@presentation/components/ds/Text';
import { useTheme } from '@presentation/theme/ThemeContext';

interface SettingsGroupProps {
  title?: string;
  footer?: string;
  children: ReactNode;
}

export function SettingsGroup({ title, footer, children }: SettingsGroupProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={{ gap: spacing.sm }}>
      {title && (
        <View style={{ marginLeft: spacing.lg }}>
          <Text variant="caption" color="textMuted">
            {title.toUpperCase()}
          </Text>
        </View>
      )}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.borderMuted,
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
      {footer && (
        <View style={{ marginHorizontal: spacing.lg }}>
          <Text variant="caption" color="textMuted">
            {footer}
          </Text>
        </View>
      )}
    </View>
  );
}
