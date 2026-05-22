import type { IGitHubRepository, PaginatedResult } from '@domain/repositories/IGitHubRepository';
import type { Repo } from '@domain/entities/Repo';
import type { Issue } from '@domain/entities/Issue';
import type { User } from '@domain/entities/User';

type SearchCall = { query: string; page: number };
type DetailsCall = { owner: string; repoName: string };
type IssuesCall = { owner: string; repoName: string; page: number };

/**
 * Implementação em memória do contrato `IGitHubRepository`, usada apenas
 * em testes de use cases. Não chama HTTP — devolve o que for configurado
 * via setters e guarda o histórico de chamadas pra asserções.
 *
 * É um fake (no sentido Fowler) e não um stub: mantém estado, pode lançar
 * erros configuráveis e expõe `calls` pra verificar como o consumidor
 * usou a interface.
 */
export class InMemoryGitHubRepository implements IGitHubRepository {
  private nextSearchResult: PaginatedResult<Repo> = {
    items: [],
    hasNextPage: false,
    totalCount: 0,
  };

  private nextRepoDetails: Repo | null = null;

  private nextIssuesResult: PaginatedResult<Issue> = {
    items: [],
    hasNextPage: false,
  };

  private nextUser: User | null = null;

  private errors: Partial<
    Record<'searchRepos' | 'getRepoDetails' | 'getRepoIssues' | 'getAuthenticatedUser', Error>
  > = {};

  readonly calls: {
    searchRepos: SearchCall[];
    getRepoDetails: DetailsCall[];
    getRepoIssues: IssuesCall[];
    getAuthenticatedUser: number;
  } = {
    searchRepos: [],
    getRepoDetails: [],
    getRepoIssues: [],
    getAuthenticatedUser: 0,
  };

  setSearchResult(result: PaginatedResult<Repo>) {
    this.nextSearchResult = result;
  }

  setRepoDetails(repo: Repo) {
    this.nextRepoDetails = repo;
  }

  setIssuesResult(result: PaginatedResult<Issue>) {
    this.nextIssuesResult = result;
  }

  setAuthenticatedUser(user: User) {
    this.nextUser = user;
  }

  /** Faz a próxima chamada do método informado lançar o erro. */
  setError(method: keyof InMemoryGitHubRepository['errors'], error: Error) {
    this.errors[method] = error;
  }

  async searchRepos(query: string, page: number): Promise<PaginatedResult<Repo>> {
    this.calls.searchRepos.push({ query, page });
    if (this.errors.searchRepos) throw this.errors.searchRepos;
    return this.nextSearchResult;
  }

  async getRepoDetails(owner: string, repoName: string): Promise<Repo> {
    this.calls.getRepoDetails.push({ owner, repoName });
    if (this.errors.getRepoDetails) throw this.errors.getRepoDetails;
    if (!this.nextRepoDetails) {
      throw new Error('InMemoryGitHubRepository: chame setRepoDetails antes de getRepoDetails');
    }
    return this.nextRepoDetails;
  }

  async getRepoIssues(
    owner: string,
    repoName: string,
    page: number,
  ): Promise<PaginatedResult<Issue>> {
    this.calls.getRepoIssues.push({ owner, repoName, page });
    if (this.errors.getRepoIssues) throw this.errors.getRepoIssues;
    return this.nextIssuesResult;
  }

  async getAuthenticatedUser(): Promise<User> {
    this.calls.getAuthenticatedUser += 1;
    if (this.errors.getAuthenticatedUser) throw this.errors.getAuthenticatedUser;
    if (!this.nextUser) {
      throw new Error('InMemoryGitHubRepository: chame setAuthenticatedUser antes');
    }
    return this.nextUser;
  }
}
