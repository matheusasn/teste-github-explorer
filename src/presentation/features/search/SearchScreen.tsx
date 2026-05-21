import { useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Repo } from '@domain/entities/Repo';
import { useTheme } from '@presentation/theme/ThemeContext';
import type { RootStackParamList } from '@presentation/navigation/types';
import { useSearchRepos } from './hooks/useSearchRepos';
import { SearchBar } from './components/SearchBar';
import { RepoList } from './components/RepoList';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export function SearchScreen() {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation<NavProp>();
  const search = useSearchRepos();

  const handleRepoPress = useCallback(
    (repo: Repo) => {
      navigation.navigate('RepoDetail', {
        owner: repo.owner.login,
        repoName: repo.name,
      });
    },
    [navigation],
  );

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.lg, gap: spacing.md, flex: 1 }}>
        <SearchBar value={search.query} onChangeText={search.setQuery} />
        <View style={{ flex: 1 }}>
          <RepoList
            repos={search.repos}
            query={search.query}
            isLoading={search.isLoading}
            isFetchingMore={search.isFetchingMore}
            isRefreshing={search.isRefreshing}
            error={search.error}
            totalCount={search.totalCount}
            onRepoPress={handleRepoPress}
            onLoadMore={search.loadMore}
            onRefresh={search.refresh}
            onRetry={search.retry}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
