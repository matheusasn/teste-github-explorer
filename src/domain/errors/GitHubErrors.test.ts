import {
  RateLimitError,
  NetworkError,
  NotFoundError,
  UnknownApiError,
  isGitHubError,
  type GitHubError,
} from '@domain/errors/GitHubErrors';

describe('GitHubErrors', () => {
  describe('RateLimitError', () => {
    it('é uma instância de Error', () => {
      expect(new RateLimitError()).toBeInstanceOf(Error);
    });

    it('tem o discriminador kind correto', () => {
      expect(new RateLimitError().kind).toBe('rate-limit');
    });

    it('tem mensagem amigável em pt-BR', () => {
      expect(new RateLimitError().message).toMatch(/limite de requisições/i);
    });
  });

  describe('NetworkError', () => {
    it('é uma instância de Error', () => {
      expect(new NetworkError()).toBeInstanceOf(Error);
    });

    it('tem o discriminador kind correto', () => {
      expect(new NetworkError().kind).toBe('network');
    });
  });

  describe('NotFoundError', () => {
    it('tem o discriminador kind correto', () => {
      expect(new NotFoundError().kind).toBe('not-found');
    });
  });

  describe('UnknownApiError', () => {
    it('tem o discriminador kind correto', () => {
      expect(new UnknownApiError(500).kind).toBe('unknown');
    });

    it('preserva o status code', () => {
      expect(new UnknownApiError(502).status).toBe(502);
    });

    it('inclui o status na mensagem', () => {
      expect(new UnknownApiError(503).message).toContain('503');
    });
  });

  describe('isGitHubError', () => {
    it('reconhece erros do domínio', () => {
      expect(isGitHubError(new RateLimitError())).toBe(true);
      expect(isGitHubError(new NetworkError())).toBe(true);
      expect(isGitHubError(new NotFoundError())).toBe(true);
      expect(isGitHubError(new UnknownApiError(500))).toBe(true);
    });

    it('rejeita erros genéricos e valores não-Error', () => {
      expect(isGitHubError(new Error('qualquer'))).toBe(false);
      expect(isGitHubError('string')).toBe(false);
      expect(isGitHubError(null)).toBe(false);
      expect(isGitHubError(undefined)).toBe(false);
    });

    it('permite exhaustiveness check via discriminated union', () => {
      // Esse teste documenta o uso típico — `switch (kind)` em todos os
      // possíveis valores. Se um caso novo for adicionado em `GitHubError`
      // sem update aqui, o TypeScript reclama no `_exhaustive: never`.
      const describeError = (e: GitHubError): string => {
        switch (e.kind) {
          case 'rate-limit':
            return 'rate';
          case 'network':
            return 'net';
          case 'not-found':
            return 'nf';
          case 'unknown':
            return 'unk';
          default: {
            const _exhaustive: never = e;
            return _exhaustive;
          }
        }
      };

      expect(describeError(new RateLimitError())).toBe('rate');
      expect(describeError(new NetworkError())).toBe('net');
      expect(describeError(new NotFoundError())).toBe('nf');
      expect(describeError(new UnknownApiError(500))).toBe('unk');
    });
  });
});
