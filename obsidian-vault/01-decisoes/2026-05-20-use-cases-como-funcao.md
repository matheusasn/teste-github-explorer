# ADR 002 — Use cases como function factory

- **Status:** aceita
- **Data:** 2026-05-20
- **Tags:** #application #functional

## Contexto

A camada `application/` orquestra o domain. PDF (seção 3.2) cita literal "use cases (...) orquestram o domínio sem depender de frameworks". Padrão clássico Uncle Bob é classe; padrão moderno TS é função pura.

## Opções consideradas

1. **`class XxxUseCase { execute() }`** — Uncle Bob clássico. Tem `this`, herança disponível.
2. **`createXxxUseCase(deps) → (input) => Promise<T>`** — função factory com closure. Sem `this`, sem boilerplate.
3. **Função pura com deps em parâmetro** — `searchRepos(repo, input)`. Mais funcional, mas obriga passar deps em cada chamada.

## Decisão

Opção 2 — factory function:

```ts
export type SearchReposUseCase = (input: SearchReposInput) => Promise<PaginatedResult<Repo>>;

export function createSearchReposUseCase(repo: IGitHubRepository): SearchReposUseCase {
  return async ({ query, page }) => {
    const trimmed = query.trim();
    if (!trimmed) return { items: [], hasNextPage: false, totalCount: 0 };
    return repo.searchRepos(trimmed, page);
  };
}
```

## Consequências

**Boas:**

- Sem `this` — elimina classe inteira de bugs
- Closure cuida da DI naturalmente
- Type alias (`SearchReposUseCase`) deixa explícita a interface de uso
- Testável trivialmente — sem `new`, sem `bind`

**Ruins:**

- Quem espera Uncle Bob clássico pode estranhar
- Sem herança disponível (não preciso aqui)

## Onde está no código

- `src/application/use-cases/SearchReposUseCase.ts`
- `src/application/use-cases/GetRepoDetailsUseCase.ts`
- `src/application/use-cases/GetRepoIssuesUseCase.ts`
- `src/application/use-cases/GetAuthenticatedUserUseCase.ts`
- Testes consumidores: `*UseCase.test.ts` (cada um)
