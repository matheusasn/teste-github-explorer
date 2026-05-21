import { mapIssue, mapLabel } from './issueMapper';
import type {
  GitHubApiIssue,
  GitHubApiLabel,
  GitHubApiOwner,
} from '@infrastructure/repositories/types/githubApiTypes';

function makeApiOwner(overrides: Partial<GitHubApiOwner> = {}): GitHubApiOwner {
  return {
    id: 1,
    login: 'matheus',
    avatar_url: 'https://avatars.test/m.png',
    ...overrides,
  };
}

function makeApiLabel(overrides: Partial<GitHubApiLabel> = {}): GitHubApiLabel {
  return {
    id: 100,
    name: 'bug',
    color: 'd73a4a',
    ...overrides,
  };
}

function makeApiIssue(overrides: Partial<GitHubApiIssue> = {}): GitHubApiIssue {
  return {
    id: 5000,
    number: 42,
    title: 'Botão de busca não funciona no Android',
    user: makeApiOwner(),
    labels: [makeApiLabel()],
    created_at: '2026-01-15T10:30:00Z',
    state: 'open',
    ...overrides,
  };
}

describe('issueMapper', () => {
  describe('mapLabel', () => {
    it('traduz os campos preservando o id e a cor', () => {
      const result = mapLabel(makeApiLabel());

      expect(result).toEqual({ id: 100, name: 'bug', color: 'd73a4a' });
    });
  });

  describe('mapIssue', () => {
    it('traduz todos os campos snake_case → camelCase', () => {
      const result = mapIssue(makeApiIssue());

      expect(result).toEqual({
        id: 5000,
        number: 42,
        title: 'Botão de busca não funciona no Android',
        author: { id: 1, login: 'matheus', avatarUrl: 'https://avatars.test/m.png' },
        labels: [{ id: 100, name: 'bug', color: 'd73a4a' }],
        createdAt: '2026-01-15T10:30:00Z',
        state: 'open',
      });
    });

    it('renomeia `user` (API) → `author` (domain)', () => {
      const result = mapIssue(makeApiIssue({ user: makeApiOwner({ login: 'outro' }) }));
      expect(result.author.login).toBe('outro');
    });

    it('mapeia múltiplas labels via mapLabel', () => {
      const result = mapIssue(
        makeApiIssue({
          labels: [
            makeApiLabel({ id: 1, name: 'bug', color: 'ff0000' }),
            makeApiLabel({ id: 2, name: 'help wanted', color: '00ff00' }),
          ],
        }),
      );

      expect(result.labels).toEqual([
        { id: 1, name: 'bug', color: 'ff0000' },
        { id: 2, name: 'help wanted', color: '00ff00' },
      ]);
    });

    it('mantém createdAt como string ISO (sem parsear pra Date)', () => {
      const result = mapIssue(makeApiIssue({ created_at: '2025-12-31T23:59:59Z' }));
      expect(result.createdAt).toBe('2025-12-31T23:59:59Z');
      expect(typeof result.createdAt).toBe('string');
    });

    it('preserva o estado da issue', () => {
      const closed = mapIssue(makeApiIssue({ state: 'closed' }));
      expect(closed.state).toBe('closed');
    });
  });
});
