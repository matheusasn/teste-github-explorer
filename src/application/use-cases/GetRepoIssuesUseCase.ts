import type { IGitHubRepository, PaginatedResult } from '@domain/repositories/IGitHubRepository';
import type { Issue } from '@domain/entities/Issue';

export interface GetRepoIssuesInput {
  owner: string;
  repoName: string;
  page: number;
}

export type GetRepoIssuesUseCase = (input: GetRepoIssuesInput) => Promise<PaginatedResult<Issue>>;

/**
 * Use case que lista as issues abertas de um repositório (paginadas).
 * Delega direto ao repositório — a paginação é orquestrada pelo consumidor
 * (hook) que decide quando pedir a próxima página.
 */
export function createGetRepoIssuesUseCase(repo: IGitHubRepository): GetRepoIssuesUseCase {
  return async ({ owner, repoName, page }) => repo.getRepoIssues(owner, repoName, page);
}
