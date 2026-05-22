/**
 * Erros do domínio do GitHub.
 *
 * Cada erro estende `Error` (pra preservar stack trace em monitoramento)
 * e expõe um discriminador `kind` literal. Combinados, eles formam uma
 * união tipada (`GitHubError`) que dá ao TypeScript exhaustiveness check
 * quando a UI faz `switch (error.kind)` — impossível esquecer de tratar
 * um caso sem o compilador reclamar.
 */

export class RateLimitError extends Error {
  readonly kind = 'rate-limit' as const;

  constructor() {
    super('Limite de requisições do GitHub excedido. Tente novamente em alguns minutos.');
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends Error {
  readonly kind = 'network' as const;

  constructor() {
    super('Sem conexão com a internet. Verifique sua rede e tente novamente.');
    this.name = 'NetworkError';
  }
}

export class NotFoundError extends Error {
  readonly kind = 'not-found' as const;

  constructor() {
    super('Recurso não encontrado.');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  readonly kind = 'unauthorized' as const;

  constructor() {
    super('Token de acesso inválido ou expirado. Verifique seu .env.');
    this.name = 'UnauthorizedError';
  }
}

export class UnknownApiError extends Error {
  readonly kind = 'unknown' as const;

  constructor(public readonly status: number) {
    super(`Erro inesperado da API (status ${status}).`);
    this.name = 'UnknownApiError';
  }
}

export type GitHubError =
  | RateLimitError
  | NetworkError
  | NotFoundError
  | UnauthorizedError
  | UnknownApiError;

export const isGitHubError = (e: unknown): e is GitHubError =>
  e instanceof RateLimitError ||
  e instanceof NetworkError ||
  e instanceof NotFoundError ||
  e instanceof UnauthorizedError ||
  e instanceof UnknownApiError;
