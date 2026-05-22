import { useQuery } from '@tanstack/react-query';
import type { User } from '@domain/entities/User';
import { isGitHubError } from '@domain/errors/GitHubErrors';
import { container } from '@infrastructure/di/container';

interface UseAuthenticatedUserResult {
  user: User | undefined;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  isUnauthorized: boolean;
  refresh: () => void;
  retry: () => void;
}

function parseError(error: unknown): string {
  if (isGitHubError(error)) return error.message;
  return 'Erro inesperado. Tente novamente.';
}

function isUnauthorizedError(error: unknown): boolean {
  return isGitHubError(error) && error.kind === 'unauthorized';
}

export function useAuthenticatedUser(): UseAuthenticatedUserResult {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['authenticated-user'],
    queryFn: () => container.getAuthenticatedUserUseCase(),
    staleTime: 60 * 60 * 1000, // 1h — perfil muda raramente
  });

  return {
    user: data,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    error: error ? parseError(error) : null,
    isUnauthorized: isUnauthorizedError(error),
    refresh: () => {
      refetch();
    },
    retry: () => {
      refetch();
    },
  };
}
