import { useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { Issue } from '@domain/entities/Issue';
import { isGitHubError } from '@domain/errors/GitHubErrors';
import { container } from '@infrastructure/di/container';

interface Params {
  owner: string;
  repoName: string;
}

interface UseRepoIssuesResult {
  issues: Issue[];
  isLoading: boolean;
  isFetchingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasNextPage: boolean;
  loadMore: () => void;
  refresh: () => void;
  retry: () => void;
}

function parseError(error: unknown): string {
  if (isGitHubError(error)) return error.message;
  return 'Erro inesperado. Tente novamente.';
}

export function useRepoIssues({ owner, repoName }: Params): UseRepoIssuesResult {
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
    queryKey: ['issues', owner, repoName],
    queryFn: ({ pageParam }) =>
      container.getRepoIssuesUseCase({ owner, repoName, page: pageParam as number }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasNextPage ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: !!owner && !!repoName,
  });

  const issues = data?.pages.flatMap((p) => p.items) ?? [];

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    issues,
    isLoading,
    isFetchingMore: isFetchingNextPage,
    isRefreshing: isFetching && !isLoading && !isFetchingNextPage,
    error: error ? parseError(error) : null,
    hasNextPage: hasNextPage ?? false,
    loadMore,
    refresh: () => {
      refetch();
    },
    retry: () => {
      refetch();
    },
  };
}
