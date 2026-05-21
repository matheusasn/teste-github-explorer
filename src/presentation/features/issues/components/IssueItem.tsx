import { View } from 'react-native';
import type { Issue } from '@domain/entities/Issue';
import { Badge } from '@presentation/components/ds/Badge';
import { Card } from '@presentation/components/ds/Card';
import { Text } from '@presentation/components/ds/Text';
import { useTheme } from '@presentation/theme/ThemeContext';

interface IssueItemProps {
  issue: Issue;
}

// Distância relativa simples em pt-BR (sem dep externa pra economizar bundle).
function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const units: [string, number][] = [
    ['ano', 60 * 60 * 24 * 365],
    ['mês', 60 * 60 * 24 * 30],
    ['dia', 60 * 60 * 24],
    ['hora', 60 * 60],
    ['minuto', 60],
  ];

  for (const [unit, secondsInUnit] of units) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) {
      const plural = count > 1 ? (unit === 'mês' ? 'meses' : `${unit}s`) : unit;
      return `há ${count} ${plural}`;
    }
  }
  return 'agora';
}

export function IssueItem({ issue }: IssueItemProps) {
  const { spacing } = useTheme();

  return (
    <Card>
      <View style={{ gap: spacing.sm }}>
        <Text variant="heading" numberOfLines={2}>
          #{issue.number} {issue.title}
        </Text>

        {issue.labels.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
            {issue.labels.map((label) => (
              <Badge key={label.id} label={label.name} tone="neutral" size="sm" />
            ))}
          </View>
        )}

        <Text variant="caption" color="textMuted">
          aberto por {issue.author.login} · {formatRelativeDate(issue.createdAt)}
        </Text>
      </View>
    </Card>
  );
}
