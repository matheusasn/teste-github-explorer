import { createGetRepoDetailsUseCase } from './GetRepoDetailsUseCase';
import { InMemoryGitHubRepository } from '@test-utils/InMemoryGitHubRepository';
import { NotFoundError } from '@domain/errors/GitHubErrors';
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

describe('GetRepoDetailsUseCase', () => {
  it('retorna o repositório do repositório de dados', async () => {
    const repo = new InMemoryGitHubRepository();
    const expected = makeRepo({ stars: 200 });
    repo.setRepoDetails(expected);
    const getDetails = createGetRepoDetailsUseCase(repo);

    const result = await getDetails({ owner: 'facebook', repoName: 'react' });

    expect(result).toBe(expected);
    expect(repo.calls.getRepoDetails).toEqual([{ owner: 'facebook', repoName: 'react' }]);
  });

  it('propaga NotFoundError do repositório', async () => {
    const repo = new InMemoryGitHubRepository();
    repo.setError('getRepoDetails', new NotFoundError());
    const getDetails = createGetRepoDetailsUseCase(repo);

    await expect(getDetails({ owner: 'foo', repoName: 'bar' })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
