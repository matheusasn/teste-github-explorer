# Pergunta — "Como testar use cases sem mockar a biblioteca HTTP?"

- **Data:** 2026-05-20
- **Tags:** #estrategia #testes #contratos

## Contexto

A camada `application/` (use cases) precisa ser testada. A abordagem instintiva — `jest.mock('axios')` — acopla o teste ao **detalhe de implementação** (axios), não ao **contrato** (o repositório).

Consequência prática: se a infraestrutura for trocada (axios → fetch, fetch → MSW server), todos os testes de use case quebram, mesmo o comportamento sendo idêntico. Isso indica que o teste estava medindo a coisa errada.

## Por que essa pergunta foi central

Testes que medem **detalhes de implementação** ao invés de **comportamento observável** envelhecem mal. Cada refactor de baixo nível obriga atualizar dezenas de mocks. O time perde tempo "consertando testes" sem que a feature mude.

A pergunta certa antes de escrever o primeiro teste é: _"qual é o contrato que esse use case respeita, e como testo só esse contrato?"_

## Alternativas analisadas

### 1. `jest.mock('axios')` em cada teste de use case

```ts
jest.mock('axios');
const mockedAxios = jest.mocked(axios);
mockedAxios.get.mockResolvedValueOnce({ data: { items: [...] } });
```

**Problema:** teste acoplado a axios. Sabe demais sobre como o use case obtém os dados. Se o use case passar a usar fetch, todo o teste é reescrito apesar do comportamento idêntico.

### 2. Mock manual do `httpClient` via `jest.mock('@infrastructure/http/httpClient')`

Mock no nível do módulo do projeto, não da lib.

**Problema:** ainda mocka **um nível de implementação**. Use case continua sabendo que existe um `httpClient` por baixo. O ideal é o teste tratar use case como caixa preta sobre o **contrato do domínio**.

### 3. Fake do repositório (`InMemoryGitHubRepository`) — escolhida

Criar uma classe que **implementa a interface `IGitHubRepository`** mas guarda dados em memória. Use cases recebem essa classe via DI. Teste configura os dados pelo setter e verifica chamadas pelo histórico (`calls`).

```ts
class InMemoryGitHubRepository implements IGitHubRepository {
  private nextSearchResult: PaginatedResult<Repo> = { items: [], hasNextPage: false };
  readonly calls = { searchRepos: [] as { query: string; page: number }[] /* ... */ };

  setSearchResult(result: PaginatedResult<Repo>) {
    this.nextSearchResult = result;
  }
  async searchRepos(query: string, page: number) {
    this.calls.searchRepos.push({ query, page });
    return this.nextSearchResult;
  }
  /* ... */
}
```

Teste:

```ts
const repo = new InMemoryGitHubRepository();
const search = createSearchReposUseCase(repo);
await search({ query: 'react', page: 1 });
expect(repo.calls.searchRepos).toEqual([{ query: 'react', page: 1 }]);
```

Nenhum `jest.mock`. Nenhuma referência a axios. Teste mede **contrato do domínio**.

## Resposta adotada

`src/test-utils/InMemoryGitHubRepository.ts` implementando `IGitHubRepository` com setters e histórico de chamadas. Todos os testes de use case usam essa classe.

Padrão referenciado: **Fake** (no sentido de Martin Fowler — _"Mocks Aren't Stubs"_, 2007). Fake mantém estado, pode lançar erros configuráveis, e expõe `calls` para asserções. Diferente de stub (retorna fixo) e de mock (verifica expectativas pré-declaradas).

## Impacto no projeto

- **`src/test-utils/InMemoryGitHubRepository.ts`** — implementação compartilhada entre testes
- **`src/application/use-cases/*UseCase.test.ts`** — todos consomem a fake, zero `jest.mock`
- Trocar axios por fetch quebraria os testes de `GitHubRepositoryImpl` (que testa **implementação HTTP**), mas **não** os testes de use case (que testam **contrato**)
- Refactor de baixo nível custa menos manutenção de teste

## Decisões relacionadas

- [[01-decisoes/2026-05-20-use-cases-como-funcao|ADR 002 — Use cases function factory]]
