import type { IGitHubRepository } from '@domain/repositories/IGitHubRepository';
import type { Repo } from '@domain/entities/Repo';

export interface GetRepoDetailsInput {
  owner: string;
  repoName: string;
}

export type GetRepoDetailsUseCase = (input: GetRepoDetailsInput) => Promise<Repo>;

/**
 * Use case que retorna os detalhes de um repositório específico.
 * Delega direto ao repositório — a validação dos parâmetros (owner e
 * repoName válidos) é responsabilidade do chamador (navegação).
 */
export function createGetRepoDetailsUseCase(repo: IGitHubRepository): GetRepoDetailsUseCase {
  return async ({ owner, repoName }) => repo.getRepoDetails(owner, repoName);
}
