import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from '@presentation/components/ds/Text';
import { useTheme } from '@presentation/theme/ThemeContext';

interface SettingsRowProps {
  icon?: ReactNode;
  iconBg?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isLast?: boolean;
  trailing?: ReactNode;
}

export function SettingsRow({
  icon,
  iconBg,
  label,
  value,
  onPress,
  showChevron = true,
  isLast = false,
  trailing,
}: SettingsRowProps) {
  const { colors, spacing, radius } = useTheme();

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.borderMuted,
      }}
    >
      {icon && (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: radius.sm,
            backgroundColor: iconBg ?? colors.surfaceMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text variant="body">{label}</Text>
      </View>

      {value && (
        <Text variant="body" color="textMuted">
          {value}
        </Text>
      )}

      {trailing}

      {showChevron && onPress && (
        <Feather name="chevron-right" size={18} color={colors.textMuted} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} android_ripple={{ color: colors.surfaceMuted }}>
        {({ pressed }) => <View style={{ opacity: pressed ? 0.6 : 1 }}>{content}</View>}
      </Pressable>
    );
  }

  return content;
}
