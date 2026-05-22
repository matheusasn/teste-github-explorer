# Pergunta — "Como traduzir erros de transporte HTTP em erros de domínio sem vazar AxiosError?"

- **Data:** 2026-05-20
- **Tags:** #estrategia #infrastructure #acl

## Contexto

O `GitHubRepositoryImpl` chama axios. Quando algo falha, axios lança `AxiosError` (com `response`, `request`, `config`, etc.). Use cases não devem ver `AxiosError` — eles operam no vocabulário do domínio (`RateLimitError`, `NetworkError`, etc.).

Sem tradução explícita, `AxiosError` "vaza" da camada de infraestrutura para camada de application e presentation. Resultado: hooks de UI passam a inspecionar `axios.isAxiosError(error)` e `error.response.status` — código que tinha lugar único agora se espalha por toda a UI.

## Por que essa pergunta foi central

Este é o problema clássico do **Anti-Corruption Layer (ACL)** descrito em _Domain-Driven Design_ (Eric Evans, 2003). Sistemas externos têm seus próprios modelos de erro, formato de dados, vocabulário. Sem uma camada de tradução, o vocabulário externo contamina o domínio.

A pergunta certa antes de implementar o Repository é: _"onde fica o único lugar do código que entende AxiosError, e como garanto que ninguém mais precisa entender?"_

## Alternativas analisadas

### 1. Cada método do Repository com try/catch inline

```ts
async searchRepos(query, page) {
  try { /* ... */ }
  catch (error) {
    if (isAxiosError(error)) {
      if (!error.response) throw new NetworkError();
      if (error.response.status === 403) throw new RateLimitError();
      // ... 5 ifs por método
    }
    throw error;
  }
}
```

**Problema:** lógica duplicada em cada método. Adicionar `UnauthorizedError` (401) exige editar todos os métodos.

### 2. Interceptor do axios

Configurar `httpClient.interceptors.response.use(success, error)` para transformar `AxiosError` em erro de domínio antes de retornar.

**Problema:** mistura preocupações no `httpClient`. O cliente HTTP passa a conhecer tipos de domínio — inversão de dependência prejudicada. Além disso, interceptor global afeta TODAS as chamadas, incluindo chamadas que poderiam querer tratamento diferente.

### 3. Tradutor centralizado em função pura — escolhida

Função única (`translateHttpError`) que recebe `unknown`, identifica `AxiosError` via `isAxiosError`, e lança o erro de domínio apropriado. Use no `catch` de cada método do Repository.

```ts
// src/infrastructure/http/errorTranslator.ts
export function translateHttpError(error: unknown): never {
  if (isAxiosError(error)) {
    if (!error.response) throw new NetworkError();
    const status = error.response.status;
    if (status === 401) throw new UnauthorizedError();
    if (status === 403 || status === 429) throw new RateLimitError();
    if (status === 404) throw new NotFoundError();
    throw new UnknownApiError(status);
  }
  throw error; // não é axios — propaga intacto
}
```

Repository fica limpo:

```ts
async searchRepos(query, page) {
  try {
    const data = await apiGet<GitHubSearchResponse>('/search/repositories', { ... });
    return { items: data.items.map(mapRepo), /* ... */ };
  } catch (error) {
    translateHttpError(error); // never — sempre lança
  }
}
```

Type-wise, `translateHttpError(error): never` informa o compilador que essa chamada nunca retorna. TypeScript entende que após o catch, o controle de fluxo encerra.

## Resposta adotada

`src/infrastructure/http/errorTranslator.ts` com a função `translateHttpError`. **Único lugar do código que entende AxiosError**. Todos os métodos do `GitHubRepositoryImpl` chamam essa função no catch.

Padrão referenciado: **Anti-Corruption Layer** (DDD, Evans 2003). Tradução de modelos entre bounded contexts. Implementação concreta como função pura (sem side effects exceto o `throw`).

## Impacto no projeto

- **`src/infrastructure/http/errorTranslator.ts`** — ACL para erros HTTP
- **`src/infrastructure/repositories/GitHubRepositoryImpl.ts`** — todos os métodos com `catch (e) { translateHttpError(e); }`
- **`src/infrastructure/http/errorTranslator.test.ts`** — 7 testes cobrindo todos os status codes mapeados + erro não-axios
- Trocar axios por fetch exige mudar **apenas** `httpClient.ts` e `errorTranslator.ts` (substituir `isAxiosError` por equivalente)

Quando `UnauthorizedError` foi adicionado posteriormente, a alteração ficou em **uma linha** do `translateHttpError`. Todo o resto (use cases, hooks, UI) consumiu a mudança via discriminated union sem refactor.

## Decisões relacionadas

- [[01-decisoes/2026-05-20-discriminated-union-erros|ADR 004 — Erros como discriminated union]]
