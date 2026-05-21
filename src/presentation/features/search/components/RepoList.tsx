import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import type { Repo } from '@domain/entities/Repo';
import { Button } from '@presentation/components/ds/Button';
import { Skeleton } from '@presentation/components/ds/Skeleton';
import { Text } from '@presentation/components/ds/Text';
import { useTheme } from '@presentation/theme/ThemeContext';
import { RepoCard } from './RepoCard';

interface RepoListProps {
  repos: Repo[];
  query: string;
  isLoading: boolean;
  isFetchingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  totalCount: number;
  onRepoPress: (repo: Repo) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  onRetry: () => void;
}

function ListSkeleton() {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.md, paddingTop: spacing.md }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: spacing.md, padding: spacing.lg }}>
          <Skeleton width={40} height={40} radius="full" />
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Skeleton width="60%" height={16} />
            <Skeleton width="90%" height={14} />
            <Skeleton width="40%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}

function EmptyState({ query }: { query: string }) {
  const { spacing } = useTheme();
  const hasQuery = query.trim().length > 0;

  return (
    <View style={{ padding: spacing.xl, alignItems: 'center', gap: spacing.sm }}>
      <Text variant="heading">{hasQuery ? 'Nenhum resultado' : 'Comece a buscar'}</Text>
      <Text color="textMuted" align="center">
        {hasQuery
          ? `Não achei nada pra "${query.trim()}". Tenta outro termo.`
          : 'Digite o nome de um repositório, linguagem ou tópico.'}
      </Text>
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { spacing } = useTheme();
  return (
    <View style={{ padding: spacing.xl, alignItems: 'center', gap: spacing.md }}>
      <Text variant="heading" color="danger">
        Ops!
      </Text>
      <Text color="textMuted" align="center">
        {message}
      </Text>
      <Button label="Tentar novamente" onPress={onRetry} variant="secondary" />
    </View>
  );
}

function ListFooter({ isFetchingMore }: { isFetchingMore: boolean }) {
  const { colors, spacing } = useTheme();
  if (!isFetchingMore) return null;
  return (
    <View style={{ padding: spacing.lg }}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

export function RepoList({
  repos,
  query,
  isLoading,
  isFetchingMore,
  isRefreshing,
  error,
  totalCount,
  onRepoPress,
  onLoadMore,
  onRefresh,
  onRetry,
}: RepoListProps) {
  const { colors, spacing } = useTheme();

  if (isLoading) return <ListSkeleton />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (repos.length === 0) return <EmptyState query={query} />;

  return (
    <FlatList
      data={repos}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <RepoCard repo={item} onPress={() => onRepoPress(item)} />}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      ListHeaderComponent={
        totalCount > 0 ? (
          <Text variant="caption" color="textMuted" align="right">
            {totalCount.toLocaleString('pt-BR')} resultado{totalCount !== 1 ? 's' : ''}
          </Text>
        ) : null
      }
      ListHeaderComponentStyle={{ paddingBottom: spacing.sm }}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={<ListFooter isFetchingMore={isFetchingMore} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
      contentContainerStyle={{ paddingBottom: spacing.xxxl }}
    />
  );
}
