import MockAdapter from 'axios-mock-adapter';
import { GitHubRepositoryImpl } from './GitHubRepositoryImpl';
import { httpClient } from '@infrastructure/http/httpClient';
import {
  RateLimitError,
  NetworkError,
  NotFoundError,
  UnknownApiError,
} from '@domain/errors/GitHubErrors';
import type { GitHubApiIssue, GitHubApiOwner, GitHubApiRepo } from './types/githubApiTypes';

const PER_PAGE = 20;

function makeApiOwner(overrides: Partial<GitHubApiOwner> = {}): GitHubApiOwner {
  return {
    id: 1,
    login: 'facebook',
    avatar_url: 'https://avatars.test/f.png',
    ...overrides,
  };
}

function makeApiRepo(overrides: Partial<GitHubApiRepo> = {}): GitHubApiRepo {
  return {
    id: 10270250,
    name: 'react',
    full_name: 'facebook/react',
    description: 'A JS library',
    owner: makeApiOwner(),
    stargazers_count: 200_000,
    forks_count: 40_000,
    watchers_count: 200_000,
    language: 'JavaScript',
    ...overrides,
  };
}

function makeApiIssue(overrides: Partial<GitHubApiIssue> = {}): GitHubApiIssue {
  return {
    id: 5000,
    number: 42,
    title: 'Bug X',
    user: makeApiOwner({ id: 7, login: 'someone' }),
    labels: [],
    created_at: '2026-01-15T10:30:00Z',
    state: 'open',
    ...overrides,
  };
}

describe('GitHubRepositoryImpl (integração com axios)', () => {
  let mock: MockAdapter;
  let repo: GitHubRepositoryImpl;

  beforeEach(() => {
    mock = new MockAdapter(httpClient);
    repo = new GitHubRepositoryImpl();
  });

  afterEach(() => {
    mock.restore();
  });

  // ─── searchRepos ──────────────────────────────────────────────────────────
  describe('searchRepos', () => {
    it('retorna entidades mapeadas + hasNextPage=true quando vem página cheia', async () => {
      const items = Array.from({ length: PER_PAGE }, (_, i) =>
        makeApiRepo({ id: i + 1, name: `repo${i}` }),
      );
      mock.onGet('/search/repositories').reply(200, { total_count: 100, items });

      const result = await repo.searchRepos('react', 1);

      expect(result.items).toHaveLength(PER_PAGE);
      expect(result.totalCount).toBe(100);
      expect(result.hasNextPage).toBe(true);
      expect(result.items[0]?.fullName).toBe('facebook/react');
    });

    it('hasNextPage=false quando vem página parcial', async () => {
      mock.onGet('/search/repositories').reply(200, {
        total_count: 3,
        items: [makeApiRepo(), makeApiRepo({ id: 2 }), makeApiRepo({ id: 3 })],
      });

      const result = await repo.searchRepos('react', 1);

      expect(result.hasNextPage).toBe(false);
    });

    it('envia os query params esperados (q, sort, order, page, per_page)', async () => {
      mock.onGet('/search/repositories').reply(200, { total_count: 0, items: [] });

      await repo.searchRepos('react native', 2);

      expect(mock.history.get[0]?.params).toEqual({
        q: 'react native',
        sort: 'stars',
        order: 'desc',
        page: 2,
        per_page: PER_PAGE,
      });
    });

    it('lança RateLimitError em 403', async () => {
      mock.onGet('/search/repositories').reply(403);
      await expect(repo.searchRepos('react', 1)).rejects.toBeInstanceOf(RateLimitError);
    });

    it('lança RateLimitError em 429', async () => {
      mock.onGet('/search/repositories').reply(429);
      await expect(repo.searchRepos('react', 1)).rejects.toBeInstanceOf(RateLimitError);
    });

    it('lança NetworkError quando não há resposta', async () => {
      mock.onGet('/search/repositories').networkError();
      await expect(repo.searchRepos('react', 1)).rejects.toBeInstanceOf(NetworkError);
    });

    it('lança UnknownApiError preservando o status em outros códigos', async () => {
      mock.onGet('/search/repositories').reply(502);

      let captured: unknown;
      try {
        await repo.searchRepos('react', 1);
      } catch (e) {
        captured = e;
      }
      expect(captured).toBeInstanceOf(UnknownApiError);
      expect((captured as UnknownApiError).status).toBe(502);
    });
  });

  // ─── getRepoDetails ───────────────────────────────────────────────────────
  describe('getRepoDetails', () => {
    it('retorna a entidade Repo no sucesso', async () => {
      mock.onGet('/repos/facebook/react').reply(200, makeApiRepo());

      const result = await repo.getRepoDetails('facebook', 'react');

      expect(result.fullName).toBe('facebook/react');
      expect(result.stars).toBe(200_000);
      expect(result.owner.login).toBe('facebook');
    });

    it('lança NotFoundError em 404', async () => {
      mock.onGet('/repos/foo/bar').reply(404);
      await expect(repo.getRepoDetails('foo', 'bar')).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  // ─── getRepoIssues ────────────────────────────────────────────────────────
  describe('getRepoIssues', () => {
    it('retorna issues mapeadas + hasNextPage=true em página cheia', async () => {
      const items = Array.from({ length: PER_PAGE }, (_, i) =>
        makeApiIssue({ id: i + 1, number: i + 1, title: `Issue ${i}` }),
      );
      mock.onGet('/repos/facebook/react/issues').reply(200, items);

      const result = await repo.getRepoIssues('facebook', 'react', 1);

      expect(result.items).toHaveLength(PER_PAGE);
      expect(result.hasNextPage).toBe(true);
      expect(result.items[0]?.title).toBe('Issue 0');
    });

    it('envia state=open nos query params', async () => {
      mock.onGet('/repos/facebook/react/issues').reply(200, []);

      await repo.getRepoIssues('facebook', 'react', 3);

      expect(mock.history.get[0]?.params).toEqual({
        state: 'open',
        page: 3,
        per_page: PER_PAGE,
      });
    });

    it('lança NotFoundError em 404', async () => {
      mock.onGet('/repos/foo/bar/issues').reply(404);
      await expect(repo.getRepoIssues('foo', 'bar', 1)).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
