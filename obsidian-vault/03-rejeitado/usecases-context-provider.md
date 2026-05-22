# Rejeitado — `UseCasesContext` provider

- **Data:** 2026-05-20
- **Tags:** #rejeitado #architecture #di

## O que era

Provider React (`<UseCasesProvider value={useCases}>`) que injeta use cases via Context. Hooks consomem via `useUseCases()`. Permite injetar fakes em testes integrados sem `jest.mock`.

## Por que recusei

- Container já é singleton no módulo (`src/infrastructure/di/container.ts` exporta `container`)
- Hooks importam direto: `import { container } from '@infrastructure/di/container'`
- Pra mockar em testes integrados: `jest.mock('@infrastructure/di/container')` — funciona, é padrão Jest
- Context adicional pra resolver problema que não temos (não tem multi-tenant, não tem A/B testing de container)

Vale `UseCasesContext` quando:

- App tem múltiplos containers convivendo (raro)
- Teste integrado quer fake repository sem `jest.mock` (estilo válido mas custo da camada extra)

## O que fiz no lugar

Container exportado como singleton, importado direto. Factory function (`createContainer(repo?)`) permite criar containers alternativos (ex: Storybook), mas o **padrão** é `container.searchReposUseCase(...)`.

```ts
// src/infrastructure/di/container.ts
export function createContainer(repo = new GitHubRepositoryImpl()): Container { /* ... */ }
export const container = createContainer();

// Em hook:
import { container } from '@infrastructure/di/container';
const { data } = useQuery({ queryFn: () => container.searchReposUseCase({...}) });
```

## Trade-off aceito

Em teste integrado de hook que precise mockar use case, terei que usar `jest.mock`. Aceitei — é padrão Jest, dev RN conhece.
