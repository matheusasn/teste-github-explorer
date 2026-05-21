import { QueryClient } from '@tanstack/react-query';
import { NetworkError } from '@domain/errors/GitHubErrors';

const STALE_TIME_MS = 5 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      retry: (failureCount, error) => {
        if (error instanceof NetworkError) return false;
        return failureCount < 2;
      },
    },
  },
});
