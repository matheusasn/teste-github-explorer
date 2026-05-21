import { createGetRepoIssuesUseCase } from './GetRepoIssuesUseCase';
import { InMemoryGitHubRepository } from '@test-utils/InMemoryGitHubRepository';
import type { Issue } from '@domain/entities/Issue';
import type { PaginatedResult } from '@domain/repositories/IGitHubRepository';
import { issueId, issueNumber, ownerId, labelId } from '@domain/types';

function makeIssue(overrides: Partial<Issue> = {}): Issue {
  return {
    id: issueId(1),
    number: issueNumber(42),
    title: 'Bug no scroll',
    author: { id: ownerId(1), login: 'matheus', avatarUrl: 'https://x.test/a.png' },
    labels: [{ id: labelId(1), name: 'bug', color: 'ff0000' }],
    createdAt: '2026-01-15T10:30:00Z',
    state: 'open',
    ...overrides,
  };
}

describe('GetRepoIssuesUseCase', () => {
  it('retorna a página de issues do repositório', async () => {
    const repo = new InMemoryGitHubRepository();
    const expected: PaginatedResult<Issue> = {
      items: [makeIssue(), makeIssue({ id: issueId(2), number: issueNumber(43) })],
      hasNextPage: true,
    };
    repo.setIssuesResult(expected);
    const getIssues = createGetRepoIssuesUseCase(repo);

    const result = await getIssues({ owner: 'facebook', repoName: 'react', page: 1 });

    expect(result).toBe(expected);
    expect(repo.calls.getRepoIssues).toEqual([{ owner: 'facebook', repoName: 'react', page: 1 }]);
  });

  it('passa o número da página adiante sem modificar', async () => {
    const repo = new InMemoryGitHubRepository();
    const getIssues = createGetRepoIssuesUseCase(repo);

    await getIssues({ owner: 'facebook', repoName: 'react', page: 3 });

    expect(repo.calls.getRepoIssues[0]?.page).toBe(3);
  });

  it('propaga erros do repositório', async () => {
    const repo = new InMemoryGitHubRepository();
    repo.setError('getRepoIssues', new Error('boom'));
    const getIssues = createGetRepoIssuesUseCase(repo);

    await expect(getIssues({ owner: 'foo', repoName: 'bar', page: 1 })).rejects.toThrow('boom');
  });
});
