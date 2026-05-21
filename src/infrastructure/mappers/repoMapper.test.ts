import { mapOwner, mapRepo } from './repoMapper';
import type {
  GitHubApiOwner,
  GitHubApiRepo,
} from '@infrastructure/repositories/types/githubApiTypes';

function makeApiOwner(overrides: Partial<GitHubApiOwner> = {}): GitHubApiOwner {
  return {
    id: 1,
    login: 'facebook',
    avatar_url: 'https://avatars.test/facebook.png',
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

describe('repoMapper', () => {
  describe('mapOwner', () => {
    it('traduz snake_case → camelCase mantendo campos', () => {
      const result = mapOwner(makeApiOwner({ avatar_url: 'https://x.test/a.png' }));

      expect(result).toEqual({
        id: 1,
        login: 'facebook',
        avatarUrl: 'https://x.test/a.png',
      });
    });
  });

  describe('mapRepo', () => {
    it('traduz todos os campos snake_case → camelCase', () => {
      const result = mapRepo(makeApiRepo());

      expect(result).toEqual({
        id: 10270250,
        name: 'react',
        fullName: 'facebook/react',
        description: 'A JS library',
        owner: { id: 1, login: 'facebook', avatarUrl: 'https://avatars.test/facebook.png' },
        stars: 200_000,
        forks: 40_000,
        watchers: 200_000,
        language: 'JavaScript',
      });
    });

    it('preserva description null', () => {
      const result = mapRepo(makeApiRepo({ description: null }));
      expect(result.description).toBeNull();
    });

    it('preserva language null (repo sem linguagem detectada)', () => {
      const result = mapRepo(makeApiRepo({ language: null }));
      expect(result.language).toBeNull();
    });

    it('mapeia stargazers_count → stars', () => {
      const result = mapRepo(makeApiRepo({ stargazers_count: 42 }));
      expect(result.stars).toBe(42);
    });

    it('aninha o owner via mapOwner', () => {
      const result = mapRepo(makeApiRepo({ owner: makeApiOwner({ id: 99, login: 'matheus' }) }));
      expect(result.owner).toEqual({
        id: 99,
        login: 'matheus',
        avatarUrl: 'https://avatars.test/facebook.png',
      });
    });
  });
});
