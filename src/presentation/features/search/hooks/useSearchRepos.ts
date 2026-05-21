import { useCallback, useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { Repo } from '@domain/entities/Repo';
import { isGitHubError } from '@domain/errors/GitHubErrors';
import { container } from '@infrastructure/di/container';

const DEBOUNCE_MS = 300;

function parseError(error: unknown): string {
  if (isGitHubError(error)) return error.message;
  return 'Erro inesperado. Tente novamente.';
}

export interface UseSearchReposResult {
  query: string;
  setQuery: (q: string) => void;
  repos: Repo[];
  isLoading: boolean;
  isFetchingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasNextPage: boolean;
  totalCount: number;
  loadMore: () => void;
  refresh: () => void;
  retry: () => void;
}

export function useSearchRepos(): UseSearchReposResult {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const hasQuery = debouncedQuery.trim().length > 0;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['repos', 'search', debouncedQuery],
    queryFn: ({ pageParam }) =>
      container.searchReposUseCase({ query: debouncedQuery, page: pageParam as number }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: hasQuery,
  });

  const repos = data?.pages.flatMap((p) => p.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    query,
    setQuery,
    repos,
    isLoading: isLoading && hasQuery,
    isFetchingMore: isFetchingNextPage,
    isRefreshing: isFetching && !isLoading && !isFetchingNextPage,
    error: error ? parseError(error) : null,
    hasNextPage: hasNextPage ?? false,
    totalCount,
    loadMore,
    refresh: () => {
      refetch();
    },
    retry: () => {
      refetch();
    },
  };
}
