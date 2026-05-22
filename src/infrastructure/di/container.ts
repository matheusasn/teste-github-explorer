import type { IGitHubRepository } from '@domain/repositories/IGitHubRepository';
import { GitHubRepositoryImpl } from '@infrastructure/repositories/GitHubRepositoryImpl';
import {
  createSearchReposUseCase,
  type SearchReposUseCase,
} from '@application/use-cases/SearchReposUseCase';
import {
  createGetRepoDetailsUseCase,
  type GetRepoDetailsUseCase,
} from '@application/use-cases/GetRepoDetailsUseCase';
import {
  createGetRepoIssuesUseCase,
  type GetRepoIssuesUseCase,
} from '@application/use-cases/GetRepoIssuesUseCase';
import {
  createGetAuthenticatedUserUseCase,
  type GetAuthenticatedUserUseCase,
} from '@application/use-cases/GetAuthenticatedUserUseCase';

export interface Container {
  searchReposUseCase: SearchReposUseCase;
  getRepoDetailsUseCase: GetRepoDetailsUseCase;
  getRepoIssuesUseCase: GetRepoIssuesUseCase;
  getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase;
}

/**
 * Composição de dependências do app.
 *
 * Recebe um `IGitHubRepository` opcional — útil pra Storybook, testes de
 * integração ou ambientes alternativos onde a impl real não serve.
 * Por padrão, instancia `GitHubRepositoryImpl` (que fala com a API).
 *
 * Diferente de um singleton fixo no módulo, o `createContainer` deixa
 * explícito o ponto de injeção e permite múltiplos containers convivendo
 * (ex.: um pra produção, um pra Storybook).
 */
export function createContainer(
  repository: IGitHubRepository = new GitHubRepositoryImpl(),
): Container {
  return {
    searchReposUseCase: createSearchReposUseCase(repository),
    getRepoDetailsUseCase: createGetRepoDetailsUseCase(repository),
    getRepoIssuesUseCase: createGetRepoIssuesUseCase(repository),
    getAuthenticatedUserUseCase: createGetAuthenticatedUserUseCase(repository),
  };
}

/** Container padrão usado pelo app. */
export const container = createContainer();
