# ADR 001 — Clean Architecture em 4 camadas

- **Status:** aceita
- **Data:** 2026-05-20
- **Tags:** #architecture #domain #application #infrastructure #presentation

## Contexto

O PDF (seção 3.2) sugere literalmente a divisão `domain/application/infrastructure/presentation`. "Arquitetura & Desacoplamento" é a dimensão de maior peso no PDF.

## Opções consideradas

1. **Feature-Sliced puro** (sem camadas) — agrupa tudo por feature, sem domain isolado. Modernista, mas perde inversão de dependência clara.
2. **MVC/MVVM** — separação por papel (controller/view/model). Comum em RN mas o PDF não pede.
3. **Clean Arch 4 camadas** — separação por dependência: domain (núcleo) → application → infrastructure / presentation.

## Decisão

Opção 3 — Clean Arch 4 camadas, com adaptação Feature-Sliced **dentro** de `presentation/`. Estrutura:

```
src/
├── domain/          # entidades + contratos + erros (zero dependência externa)
├── application/     # use cases (orquestram domain via interface)
├── infrastructure/  # axios, mappers, container DI, errorTranslator
└── presentation/    # theme + components + features autocontidas + navigation
```

## Consequências

**Boas:**

- Inversão de dependência real (`IGitHubRepository` no domain, `GitHubRepositoryImpl` na infra)
- Domain testável em Node puro
- ESLint pode enforçar boundaries via `no-restricted-imports`
- Atende ao item de peso "Alta" do PDF (Arquitetura & Desacoplamento)

**Ruins:**

- Mais arquivos pra navegar
- Pode parecer over-engineering em escopo pequeno

## Onde está no código

- `src/domain/`
- `src/application/use-cases/`
- `src/infrastructure/{http,mappers,repositories,di}/`
- `src/presentation/{theme,components,features,navigation,providers,screens}/`
- Boundaries enforçados em `eslint.config.mjs`
