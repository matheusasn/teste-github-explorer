import { useQuery } from '@tanstack/react-query';
import type { Repo } from '@domain/entities/Repo';
import { isGitHubError } from '@domain/errors/GitHubErrors';
import { container } from '@infrastructure/di/container';

interface Params {
  owner: string;
  repoName: string;
}

interface UseRepoDetailsResult {
  repo: Repo | undefined;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => void;
  retry: () => void;
}

function parseError(error: unknown): string {
  if (isGitHubError(error)) return error.message;
  return 'Erro inesperado. Tente novamente.';
}

export function useRepoDetails({ owner, repoName }: Params): UseRepoDetailsResult {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['repo', owner, repoName],
    queryFn: () => container.getRepoDetailsUseCase({ owner, repoName }),
    enabled: !!owner && !!repoName,
  });

  return {
    repo: data,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    error: error ? parseError(error) : null,
    refresh: () => {
      refetch();
    },
    retry: () => {
      refetch();
    },
  };
}
