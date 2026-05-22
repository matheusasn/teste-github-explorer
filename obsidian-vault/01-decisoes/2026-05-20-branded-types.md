# ADR 003 — Branded types pros IDs

- **Status:** aceita
- **Data:** 2026-05-20
- **Tags:** #domain #typescript #type-safety

## Contexto

A API GitHub retorna `id` como `number` em quase todo recurso: Repo, Issue, Owner, Label, User. No domínio, esses IDs aparecem em assinaturas, params de hook, props.

TypeScript trata todos como `number` — nada impede passar `issueId` onde se espera `repoId`. Bug de runtime difícil de pegar.

## Opções consideradas

1. **`number` puro** — zero código extra, zero proteção, aceita o risco
2. **Classes `RepoId`, `IssueId`** — proteção total, mas custo runtime (alocação por ID) e ergonomia ruim em logs/serialização
3. **Branded types** (`number & { __brand: 'RepoId' }`) — proteção só em compile-time, zero runtime

## Decisão

Opção 3 — branded types em `src/domain/types.ts`:

```ts
type Brand<T, B> = T & { readonly __brand: B };
export type RepoId = Brand<number, 'RepoId'>;
export const repoId = (n: number): RepoId => n as RepoId;
```

Aplicado em `RepoId`, `IssueId`, `IssueNumber`, `LabelId`, `OwnerId`, `UserId`. Mappers chamam o helper na fronteira (única ponte de `number` cru → branded).

## Consequências

**Boas:**

- Impossível confundir `IssueId` com `RepoId` em compile-time
- Zero overhead runtime (apenas assertion)
- Refactors de signature ficam type-safe
- Sinal claro de senioridade de tipagem

**Ruins:**

- 6 helpers (`repoId`, `issueId`, etc.)
- Onboarding: dev novo estranha no início

## Onde está no código

- Definição: `src/domain/types.ts`
- Uso: `src/domain/entities/*.ts`
- Conversão API → domain: `src/infrastructure/mappers/*.ts`

## Discussão registrada

Esse padrão foi adição minha sobre a proposta inicial (que sugeria `number` puro). Identifiquei o trade-off ao revisar o primeiro `Repo.ts` e propus a mudança.
