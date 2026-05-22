import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Button } from '@presentation/components/ds/Button';
import { Skeleton } from '@presentation/components/ds/Skeleton';
import { Text } from '@presentation/components/ds/Text';
import { useTheme } from '@presentation/theme/ThemeContext';
import type { ExploreStackParamList } from '@presentation/navigation/types';
import { useRepoIssues } from './hooks/useRepoIssues';
import { IssueItem } from './components/IssueItem';

type RouteParams = RouteProp<ExploreStackParamList, 'Issues'>;

function IssuesSkeleton() {
  const { spacing } = useTheme();
  return (
    <View style={{ padding: spacing.lg, gap: spacing.md }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} style={{ gap: spacing.sm, padding: spacing.lg }}>
          <Skeleton width="90%" height={18} />
          <Skeleton width="60%" height={14} />
        </View>
      ))}
    </View>
  );
}

export function IssuesScreen() {
  const { colors, spacing } = useTheme();
  const { params } = useRoute<RouteParams>();
  const issuesQuery = useRepoIssues(params);

  if (issuesQuery.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <IssuesSkeleton />
      </View>
    );
  }

  if (issuesQuery.error) {
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
          {issuesQuery.error}
        </Text>
        <Button label="Tentar novamente" onPress={issuesQuery.retry} variant="secondary" />
      </View>
    );
  }

  if (issuesQuery.issues.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          padding: spacing.xl,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
        }}
      >
        <Text variant="heading">Sem issues abertas</Text>
        <Text color="textMuted" align="center">
          {params.repoFullName} não tem issues no estado open agora.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
      data={issuesQuery.issues}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <IssueItem issue={item} />}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      onEndReached={issuesQuery.loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        issuesQuery.isFetchingMore ? (
          <View style={{ padding: spacing.lg }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={issuesQuery.isRefreshing}
          onRefresh={issuesQuery.refresh}
          tintColor={colors.primary}
        />
      }
    />
  );
}
