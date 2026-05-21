import { createSearchReposUseCase } from './SearchReposUseCase';
import { InMemoryGitHubRepository } from '@test-utils/InMemoryGitHubRepository';
import type { PaginatedResult } from '@domain/repositories/IGitHubRepository';
import type { Repo } from '@domain/entities/Repo';
import { repoId, ownerId } from '@domain/types';

function makeRepo(overrides: Partial<Repo> = {}): Repo {
  return {
    id: repoId(1),
    name: 'react',
    fullName: 'facebook/react',
    description: 'A JS lib',
    owner: { id: ownerId(1), login: 'facebook', avatarUrl: 'https://x.test/a.png' },
    stars: 100,
    forks: 10,
    watchers: 50,
    language: 'JavaScript',
    ...overrides,
  };
}

describe('SearchReposUseCase', () => {
  it('retorna lista vazia sem chamar o repositório quando a query é vazia', async () => {
    const repo = new InMemoryGitHubRepository();
    const search = createSearchReposUseCase(repo);

    const result = await search({ query: '', page: 1 });

    expect(result).toEqual({ items: [], hasNextPage: false, totalCount: 0 });
    expect(repo.calls.searchRepos).toHaveLength(0);
  });

  it('trata query com apenas espaços como vazia', async () => {
    const repo = new InMemoryGitHubRepository();
    const search = createSearchReposUseCase(repo);

    await search({ query: '   ', page: 1 });

    expect(repo.calls.searchRepos).toHaveLength(0);
  });

  it('normaliza (trim) a query antes de delegar ao repositório', async () => {
    const repo = new InMemoryGitHubRepository();
    const search = createSearchReposUseCase(repo);

    await search({ query: '  react  ', page: 1 });

    expect(repo.calls.searchRepos).toEqual([{ query: 'react', page: 1 }]);
  });

  it('retorna o resultado paginado do repositório', async () => {
    const repo = new InMemoryGitHubRepository();
    const expected: PaginatedResult<Repo> = {
      items: [makeRepo({ name: 'react' }), makeRepo({ id: repoId(2), name: 'redux' })],
      hasNextPage: true,
      totalCount: 42,
    };
    repo.setSearchResult(expected);
    const search = createSearchReposUseCase(repo);

    const result = await search({ query: 'react', page: 2 });

    expect(result).toBe(expected);
    expect(repo.calls.searchRepos).toEqual([{ query: 'react', page: 2 }]);
  });

  it('propaga erros do repositório', async () => {
    const repo = new InMemoryGitHubRepository();
    repo.setError('searchRepos', new Error('boom'));
    const search = createSearchReposUseCase(repo);

    await expect(search({ query: 'react', page: 1 })).rejects.toThrow('boom');
  });
});
