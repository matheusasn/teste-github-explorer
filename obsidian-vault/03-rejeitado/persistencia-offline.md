# Rejeitado — PersistQueryClient + NetInfo

- **Data:** 2026-05-21
- **Tags:** #rejeitado #scope #offline

## O que era

Persistência do cache TanStack Query em AsyncStorage via `@tanstack/react-query-persist-client`. Combinado com `@react-native-community/netinfo` no `onlineManager` pra pausar retries quando offline.

## Por que recusei

PDF (seção 7) pede "cache com boa experiência de usuário: dados offline ou stale exibidos enquanto revalida". TanStack Query **já faz isso em memória** — stale-while-revalidate é default da lib.

Persistência **em disco** (entre sessões) é nivel acima — não pedido. Adicionaria:

- 2 deps externas
- ~50 linhas de setup (persister + onlineManager bridge)
- Decisão de `maxAge` da cache
- Tratamento de migração de schema do cache

Pra escopo de 3 telas read-only, valor marginal vs complexidade.

## O que fiz no lugar

TanStack Query padrão (em memória):

- `staleTime: 5min` em queries de lista
- `staleTime: 1h` em `/user` (perfil muda raramente)
- Retry inteligente: `NetworkError` não retry, outros até 2x
- Pull-to-refresh força revalidação

Comportamento offline: app mostra erro `NetworkError` com retry. Sem app reaberto = cache em memória vai. Aceitável pro escopo.

## Onde está documentado no README

Seção "O que faria diferente com mais tempo": `PersistQueryClient + MMKV` (MMKV é mais rápido que AsyncStorage) + `NetInfo + onlineManager`. Mostra que **conheço** mas **optei** por não fazer.
