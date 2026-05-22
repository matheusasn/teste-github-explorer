# Rejeitado — ViewModels (MVVM)

- **Data:** 2026-05-20
- **Tags:** #rejeitado #architecture

## O que era

Padrão MVVM clássico: cada tela tem um `useSearchViewModel`, `useRepoDetailViewModel`, etc., que retornam `[state, actions]`. Encapsula chamada ao use case, parsing de erro, derivações de state.

## Por que recusei

PDF (seção 3.2) cita literalmente o exemplo `hooks/useSearchRepos.ts` — não fala em "ViewModel". MVVM adiciona camada quando React Hooks já cobrem o padrão (custom hook = ViewModel).

- ViewModel `[state, actions]` é só uma tuple wrapper de hook
- Tela vai consumir `const [state, actions] = useSearchViewModel()` vs `const search = useSearchRepos()` — diferença cosmética
- Padrão mais alinhado com web React (Vue Composition API vibe) que não traz vantagem específica em RN
- Em apps com hooks já maduros, ViewModel vira ritual

## O que fiz no lugar

Custom hooks puros:

- `useSearchRepos` → retorna `{ query, setQuery, repos, isLoading, error, ... }`
- `useRepoDetails({ owner, repoName })` → idem
- `useRepoIssues({ owner, repoName })` → idem
- `useAuthenticatedUser` → idem

Cada hook usa `useInfiniteQuery`/`useQuery` do TanStack diretamente. Sem camada extra.

## Trade-off aceito

Quem chega esperando MVVM precisa entender que "o hook é o ViewModel". Documento isso no README e nos ADRs.
