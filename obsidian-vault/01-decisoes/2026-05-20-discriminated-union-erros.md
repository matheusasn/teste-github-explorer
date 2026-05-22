# ADR 004 — Erros como discriminated union (class + kind)

- **Status:** aceita
- **Data:** 2026-05-20
- **Tags:** #domain #typescript #error-handling

## Contexto

API GitHub responde com vários códigos de erro (401, 403, 404, 429, 5xx). UI precisa diferenciar:

- Rate limit → "aguarde alguns minutos"
- Sem conexão → "verifique sua rede"
- Não encontrado → empty state
- Token inválido → "regenere o token"
- Outro erro → mensagem genérica

Modelagem do erro precisa habilitar essa diferenciação **de forma type-safe**.

## Opções consideradas

1. **Strings de erro** (`throw new Error('rate limit')`) — frágil, string matching no consumidor
2. **Classes simples** (`class RateLimitError extends Error`) — `instanceof` funciona, mas sem exhaustiveness check
3. **Discriminated union pura** (`{ kind: 'rate-limit' | 'network' | ... }`) — exhaustiveness check completo mas sem stack trace
4. **Híbrido: classe + `kind` literal + union type + type guard**

## Decisão

Opção 4. Cada erro estende `Error` (preserva stack trace pra monitoring/Sentry futuro) **e** expõe `readonly kind = 'rate-limit' as const`. Combinados formam `type GitHubError` e exporta `isGitHubError(e): e is GitHubError`.

```ts
export class RateLimitError extends Error {
  readonly kind = 'rate-limit' as const;
  constructor() { super('...'); this.name = 'RateLimitError'; }
}

export type GitHubError = RateLimitError | NetworkError | NotFoundError | UnauthorizedError | UnknownApiError;
export const isGitHubError = (e: unknown): e is GitHubError => /* ... */;
```

Na UI:

```ts
if (isGitHubError(error)) {
  switch (error.kind) {
    case 'rate-limit': /* ... */
    case 'network': /* ... */
    // TS força tratar todos os casos
  }
}
```

## Consequências

**Boas:**

- Stack trace preservado pra monitoring
- Exhaustiveness check via TS — impossível esquecer um caso na UI
- Type guard explícito, evita `instanceof` espalhado
- Documenta os 5 estados de erro no tipo

**Ruins:**

- Mais código que classes simples
- Quem espera só `class extends Error` precisa entender o pattern

## Onde está no código

- Definição: `src/domain/errors/GitHubErrors.ts`
- Tradutor HTTP→domain: `src/infrastructure/http/errorTranslator.ts`
- Tests com exhaustiveness check: `src/domain/errors/GitHubErrors.test.ts`
- Uso na UI: `src/presentation/features/profile/ProfileScreen.tsx` (trata `unauthorized` diferente)
