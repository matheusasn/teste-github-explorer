# ADR 011 — Helper `apiGet` enxuto sobre axios

- **Status:** aceita
- **Data:** 2026-05-21
- **Tags:** #infrastructure #http

## Contexto

`GitHubRepositoryImpl` faz 4 chamadas HTTP (search, details, issues, user). Sem helper, cada uma teria boilerplate de `.then(r => r.data)` ou destructuring de `AxiosResponse`.

## Opções consideradas

1. **Chamar `httpClient.get<T>` direto** no Repository — explícito, sem camada extra
2. **Helper `apiGet<T>`** que extrai `.data` automaticamente — DRY, centraliza tipagem
3. **Família completa** (`apiGet`/`apiPost`/`apiPatch`/`apiDelete`) — útil em apps com mutations

## Decisão

Opção 2 — só `apiGet`. App é read-only, criar variantes pra POST/PATCH/DELETE sem ninguém consumir seria código morto (YAGNI).

```ts
export async function apiGet<TResponse>(
  url: string,
  params?: Record<string, unknown>,
): Promise<TResponse> {
  const { data } = await httpClient.get<TResponse>(url, { params });
  return data;
}
```

## Consequências

**Boas:**

- Boilerplate de `.data` extraído num lugar só
- Tipagem do response via generic claramente expressa
- Repository chama `apiGet<GitHubSearchResponse>('/search/repositories', params)` — limpo
- Quando o app crescer e precisar de mutations, expandir a família é trivial

**Ruins:**

- Camada extra entre Repository e axios — leitor precisa abrir `apiHelpers.ts` pra ver o que faz

## Onde está no código

- `src/infrastructure/http/apiHelpers.ts` (~10 linhas)
- Consumido em `src/infrastructure/repositories/GitHubRepositoryImpl.ts`

## Discussão registrada

Esse padrão foi sugerido por mim, baseado em repertório de apps maiores que mantenho — onde a família completa (`apiGet`/`apiPost`/`apiPatch`/`apiDelete`/`apiPostFormData`) é justificada pelo volume de endpoints com mutations. Aqui, só `apiGet` basta.
