import type { IGitHubRepository } from '@domain/repositories/IGitHubRepository';
import type { User } from '@domain/entities/User';

export type GetAuthenticatedUserUseCase = () => Promise<User>;

export function createGetAuthenticatedUserUseCase(
  repo: IGitHubRepository,
): GetAuthenticatedUserUseCase {
  return async () => repo.getAuthenticatedUser();
}
