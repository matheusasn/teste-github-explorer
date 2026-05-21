import { View } from 'react-native';
import { Card } from '@presentation/components/ds/Card';
import { Text } from '@presentation/components/ds/Text';
import { useTheme } from '@presentation/theme/ThemeContext';

interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  const { spacing } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Card variant="muted">
        <View style={{ alignItems: 'center', gap: spacing.xs }}>
          <Text variant="title">{value}</Text>
          <Text variant="caption" color="textMuted">
            {label.toUpperCase()}
          </Text>
        </View>
      </Card>
    </View>
  );
}
