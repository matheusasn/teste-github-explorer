# Pergunta — "Como diferenciar primeira carga de revalidação em background na UX?"

- **Data:** 2026-05-20
- **Tags:** #estrategia #cache #ux

## Contexto

PDF (seção 7) cita explicitamente: _"dados offline ou stale exibidos enquanto revalida, estados de loading **discretos** em recarregamentos subsequentes"_.

A distinção é importante: na primeira vez que o usuário abre a busca, faz sentido cobrir a tela com skeleton. Mas se ele já está vendo resultados e fez pull-to-refresh, **não faz sentido** sumir com a lista e mostrar skeleton — ele estaria perdendo o contexto do que estava lendo.

## Por que essa pergunta foi central

A maior parte dos apps trata "loading" como booleano único: `if (loading) return <Spinner />`. Isso degrada UX em revalidações:

- Usuário scrolla até o fim, lista some, spinner aparece, lista volta. **Posição perdida.**
- Pull-to-refresh aciona, lista some, skeleton aparece, lista volta. **Contexto perdido.**

A pergunta certa antes de modelar o hook é: _"quais estados distintos de loading existem e como expô-los separadamente para a UI tratar cada um com tratamento adequado?"_

## Alternativas analisadas

### 1. Booleano único (`isLoading`)

```tsx
if (isLoading) return <Skeleton />;
return <List data={data} />;
```

**Problema:** revalidação esconde dados. Pull-to-refresh some com a lista.

### 2. Manual com state local

```tsx
const [phase, setPhase] = useState<'initial' | 'revalidating' | 'paging'>('initial');
```

**Problema:** lógica espalhada, sincronização manual com a query lib.

### 3. Aproveitar a separação nativa do TanStack Query — escolhida

TanStack Query expõe múltiplos estados distintos no mesmo hook:

| Estado               | Significado                                                          |
| -------------------- | -------------------------------------------------------------------- |
| `isLoading`          | Primeira vez carregando, sem dados em cache ainda                    |
| `isFetching`         | Qualquer fetch em andamento (inclui revalidações com dados em cache) |
| `isFetchingNextPage` | Fetch da próxima página em infinite query                            |
| `isRefetching`       | Refetch via `refetch()` (pull-to-refresh)                            |
| `data`               | Dados disponíveis, podem ser stale                                   |

Hook customizado expõe estes estados separadamente:

```ts
return {
  repos,
  isLoading: isLoading && hasQuery, // skeleton de tela cheia
  isFetchingMore: isFetchingNextPage, // spinner no footer
  isRefreshing: isFetching && !isLoading && !isFetchingNextPage, // pull-to-refresh
  // ...
};
```

UI consome cada um onde faz sentido:

```tsx
if (isLoading) return <ListSkeleton />; // primeira carga = skeleton
return (
  <FlatList
    data={repos}
    refreshControl={
      // revalidação = só o spinner do RefreshControl
      <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
    }
    ListFooterComponent={
      isFetchingMore ? <ActivityIndicator /> : null // próxima página = spinner discreto no footer
    }
    onEndReached={loadMore}
  />
);
```

Resultado: três estados de loading visíveis ao usuário, cada um com tratamento próprio. Em revalidação, lista permanece visível.

## Resposta adotada

Aproveitar a granularidade nativa do TanStack Query. Hook expõe `isLoading`, `isFetchingMore`, `isRefreshing` como três booleanos separados. UI consome cada um no componente adequado (skeleton de tela cheia / spinner de footer / `RefreshControl`).

Referência: TanStack Query v5 docs — `useQuery` reference + Background Refetching Guide.

## Impacto no projeto

- **`src/presentation/features/search/hooks/useSearchRepos.ts`** — três booleanos derivados
- **`src/presentation/features/search/components/RepoList.tsx`** — usa cada um no slot apropriado
- **`src/presentation/features/repo-detail/hooks/useRepoDetails.ts`** — distingue `isLoading` (primeira carga) de `isRefreshing` (refetch)
- **`src/presentation/features/issues/hooks/useRepoIssues.ts`** — idem com `isFetchingMore` para paginação
- Pull-to-refresh em qualquer lista **não esconde os dados** durante revalidação
- Infinite scroll mostra spinner pequeno no footer, sem afetar itens visíveis

UX final: usuário nunca perde contexto durante revalidação em background, e percebe loading discreto quando há fetch ativo.

## Decisões relacionadas

- [[01-decisoes/2026-05-21-perfil-condicional-token|ADR 010 — Perfil condicional]] (aplica o mesmo padrão em `useAuthenticatedUser`)
