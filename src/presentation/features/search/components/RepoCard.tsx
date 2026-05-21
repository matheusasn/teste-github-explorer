import { View } from 'react-native';
import type { Repo } from '@domain/entities/Repo';
import { Avatar } from '@presentation/components/ds/Avatar';
import { Badge } from '@presentation/components/ds/Badge';
import { Card } from '@presentation/components/ds/Card';
import { Text } from '@presentation/components/ds/Text';
import { useTheme } from '@presentation/theme/ThemeContext';

interface RepoCardProps {
  repo: Repo;
  onPress: () => void;
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function RepoCard({ repo, onPress }: RepoCardProps) {
  const { spacing } = useTheme();

  return (
    <Card onPress={onPress}>
      <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
        <Avatar uri={repo.owner.avatarUrl} name={repo.owner.login} size="md" />

        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text variant="heading" numberOfLines={1}>
            {repo.fullName}
          </Text>

          {repo.description && (
            <Text variant="body" color="textMuted" numberOfLines={2}>
              {repo.description}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              gap: spacing.sm,
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: spacing.xs,
            }}
          >
            <Text variant="caption" color="textMuted">
              ★ {formatNumber(repo.stars)}
            </Text>
            <Text variant="caption" color="textMuted">
              ⑂ {formatNumber(repo.forks)}
            </Text>
            {repo.language && <Badge label={repo.language} tone="info" size="sm" />}
          </View>
        </View>
      </View>
    </Card>
  );
}
