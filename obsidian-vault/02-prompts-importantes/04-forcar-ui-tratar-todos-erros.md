# Pergunta — "Como modelar erros de domínio de modo que a UI seja forçada pelo compilador a tratar todos os casos?"

- **Data:** 2026-05-20
- **Tags:** #estrategia #typescript #error-handling

## Contexto

A API GitHub responde com diferentes códigos de erro (401 token inválido, 403 rate limit, 404 não encontrado, 429 rate limit, 5xx erro do servidor, sem resposta = sem rede). Cada caso exige UX específica:

- Rate limit → "aguarde alguns minutos"
- Sem conexão → "verifique sua rede"
- Não encontrado → empty state
- Token inválido → "regenere o token"
- Outro → mensagem genérica

A modelagem do erro precisa habilitar essa diferenciação **de forma type-safe**. Se a UI receber um `error: unknown` ou `error: string`, ela depende de string matching (`error.message === '...'`) — frágil e silencioso a refactor.

## Por que essa pergunta foi central

Tratamento de erro é onde apps reais falham silenciosamente. UI que assume "qualquer erro = mensagem genérica" perde contexto e gera má UX. UI que faz string matching quebra na primeira refatoração de mensagem.

A pergunta certa é: _"como o compilador me obriga a tratar todos os casos de erro conhecidos, e me avisa quando um caso novo aparecer?"_

## Alternativas analisadas

### 1. Strings de erro (`throw new Error('rate limit')`)

UI faz `if (error.message === 'rate limit')`.

**Problema:** string matching. Renomear mensagem quebra UI silenciosamente. Sem exhaustiveness check.

### 2. Classes simples (`class RateLimitError extends Error`)

UI faz `if (error instanceof RateLimitError)`.

**Problema:** `instanceof` funciona, mas não há exhaustiveness check. Se um caso novo for adicionado (ex: `UnauthorizedError`), a UI continua compilando mesmo sem tratar o novo caso.

### 3. Discriminated union pura (`{ kind: 'rate-limit' } | { kind: 'network' }`)

UI faz `switch (error.kind)` — exhaustiveness check garantido.

**Problema:** sem stack trace nativa do JavaScript. Quando o erro chegar em Sentry/Crashlytics futuro, debug fica mais difícil.

### 4. Híbrido — classe extends Error + `kind` literal + union type + type guard (escolhida)

Cada erro estende `Error` (preserva stack trace) **e** expõe `readonly kind = 'rate-limit' as const`. Combinados formam `type GitHubError`. Type guard `isGitHubError` faz narrow seguro.

```ts
export class RateLimitError extends Error {
  readonly kind = 'rate-limit' as const;
  constructor() { super('...'); this.name = 'RateLimitError'; }
}
// ... outras 4 classes

export type GitHubError =
  | RateLimitError
  | NetworkError
  | NotFoundError
  | UnauthorizedError
  | UnknownApiError;

export const isGitHubError = (e: unknown): e is GitHubError => /* ... */;
```

UI:

```ts
if (isGitHubError(error)) {
  switch (error.kind) {
    case 'rate-limit':
      return /* ... */;
    case 'network':
      return /* ... */;
    case 'not-found':
      return /* ... */;
    case 'unauthorized':
      return /* ... */;
    case 'unknown':
      return /* ... */;
    default: {
      const _exhaustive: never = error;
      return _exhaustive;
    }
  }
}
```

Quando um caso novo for adicionado ao union e a UI esquecer de tratá-lo, o `const _exhaustive: never = error` falha em compile-time. O compilador avisa exatamente onde adicionar o case.

## Resposta adotada

Padrão híbrido: classes que estendem `Error` para preservar stack trace + propriedade `kind` literal para discriminação + union type `GitHubError` + type guard `isGitHubError` + exhaustiveness check via `const _: never` no default do switch.

Padrões referenciados:

- **Discriminated unions**: TypeScript Handbook — Narrowing
- **Exhaustiveness check**: TypeScript Handbook — Discriminated Unions
- **Anti-corruption layer**: Domain-Driven Design (Eric Evans, 2003) — tradução de modelo externo (erros HTTP) para modelo de domínio

## Impacto no projeto

- **`src/domain/errors/GitHubErrors.ts`** — definição com 5 classes + union + type guard
- **`src/infrastructure/http/errorTranslator.ts`** — traduz `AxiosError` para um dos 5 tipos do domínio
- **`src/presentation/features/profile/ProfileScreen.tsx`** — trata `unauthorized` com mensagem específica, outros com mensagem genérica
- **`src/domain/errors/GitHubErrors.test.ts`** — teste do exhaustiveness check garante que adicionar caso novo sem atualizar a UI gera erro de compilação

Adicionar `UnauthorizedError` posteriormente (durante feature de perfil) provou o valor do padrão: o test exhaustiveness apontou exatamente onde tratar.

## Decisões relacionadas

- [[01-decisoes/2026-05-20-discriminated-union-erros|ADR 004 — Erros como discriminated union]]
