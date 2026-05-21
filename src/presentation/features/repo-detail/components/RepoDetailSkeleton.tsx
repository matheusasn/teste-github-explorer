import { View } from 'react-native';
import { Skeleton } from '@presentation/components/ds/Skeleton';
import { useTheme } from '@presentation/theme/ThemeContext';

export function RepoDetailSkeleton() {
  const { spacing } = useTheme();

  return (
    <View style={{ padding: spacing.lg, gap: spacing.lg }}>
      <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
        <Skeleton width={64} height={64} radius="full" />
        <View style={{ flex: 1, gap: spacing.sm }}>
          <Skeleton width="80%" height={20} />
          <Skeleton width="50%" height={14} />
        </View>
      </View>

      <View style={{ gap: spacing.sm }}>
        <Skeleton width="100%" height={14} />
        <Skeleton width="90%" height={14} />
        <Skeleton width="60%" height={14} />
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <Skeleton width="30%" height={70} radius="md" />
        <Skeleton width="30%" height={70} radius="md" />
        <Skeleton width="30%" height={70} radius="md" />
      </View>
    </View>
  );
}
