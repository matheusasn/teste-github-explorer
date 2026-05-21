import type { IGitHubRepository, PaginatedResult } from '@domain/repositories/IGitHubRepository';
import type { Repo } from '@domain/entities/Repo';

export interface SearchReposInput {
  query: string;
  page: number;
}

export type SearchReposUseCase = (input: SearchReposInput) => Promise<PaginatedResult<Repo>>;

/**
 * Use case de busca de repositórios.
 *
 * - Query vazia (ou só whitespace) retorna lista vazia, sem chamar a API.
 *   Evita consumir rate limit em estado intermediário (usuário ainda digitando).
 * - Senão, delega ao repositório com a query já normalizada (trim).
 */
export function createSearchReposUseCase(repo: IGitHubRepository): SearchReposUseCase {
  return async ({ query, page }) => {
    const trimmed = query.trim();
    if (!trimmed) return { items: [], hasNextPage: false, totalCount: 0 };
    return repo.searchRepos(trimmed, page);
  };
}
