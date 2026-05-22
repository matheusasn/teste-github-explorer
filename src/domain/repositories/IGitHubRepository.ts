import type { Repo } from '@domain/entities/Repo';
import type { Issue } from '@domain/entities/Issue';
import type { User } from '@domain/entities/User';

export interface PaginatedResult<T> {
  items: T[];
  hasNextPage: boolean;
  totalCount?: number;
}

export interface IGitHubRepository {
  searchRepos(query: string, page: number): Promise<PaginatedResult<Repo>>;
  getRepoDetails(owner: string, repoName: string): Promise<Repo>;
  getRepoIssues(owner: string, repoName: string, page: number): Promise<PaginatedResult<Issue>>;
  getAuthenticatedUser(): Promise<User>;
}
