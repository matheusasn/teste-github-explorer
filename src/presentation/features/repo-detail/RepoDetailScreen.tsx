import { ScrollView, View, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Avatar } from '@presentation/components/ds/Avatar';
import { Badge } from '@presentation/components/ds/Badge';
import { Button } from '@presentation/components/ds/Button';
import { Text } from '@presentation/components/ds/Text';
import { useTheme } from '@presentation/theme/ThemeContext';
import type { ExploreStackParamList } from '@presentation/navigation/types';
import { useRepoDetails } from './hooks/useRepoDetails';
import { StatCard } from './components/StatCard';
import { RepoDetailSkeleton } from './components/RepoDetailSkeleton';

type NavProp = NativeStackNavigationProp<ExploreStackParamList, 'RepoDetail'>;
type RouteParams = RouteProp<ExploreStackParamList, 'RepoDetail'>;

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function RepoDetailScreen() {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<NavProp>();
  const { params } = useRoute<RouteParams>();
  const { repo, isLoading, isRefreshing, error, refresh, retry } = useRepoDetails(params);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <RepoDetailSkeleton />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          padding: spacing.xl,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.md,
        }}
      >
        <Text variant="heading" color="danger">
          Ops!
        </Text>
        <Text color="textMuted" align="center">
          {error}
        </Text>
        <Button label="Tentar novamente" onPress={retry} variant="secondary" />
      </View>
    );
  }

  if (!repo) return null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} />
      }
    >
      <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
        <Avatar uri={repo.owner.avatarUrl} name={repo.owner.login} size="lg" />
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text variant="title">{repo.name}</Text>
          <Text color="textMuted">{repo.owner.login}</Text>
        </View>
      </View>

      {repo.description && <Text variant="body">{repo.description}</Text>}

      {repo.language && (
        <View style={{ flexDirection: 'row' }}>
          <Badge label={repo.language} tone="info" />
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <StatCard label="stars" value={formatNumber(repo.stars)} />
        <StatCard label="forks" value={formatNumber(repo.forks)} />
        <StatCard label="watchers" value={formatNumber(repo.watchers)} />
      </View>

      <Button
        label="Ver issues abertas"
        onPress={() =>
          navigation.navigate('Issues', {
            owner: repo.owner.login,
            repoName: repo.name,
            repoFullName: repo.fullName,
          })
        }
      />
    </ScrollView>
  );
}
