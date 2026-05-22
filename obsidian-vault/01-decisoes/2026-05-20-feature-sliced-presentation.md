# ADR 005 — Feature-Sliced dentro de presentation

- **Status:** aceita
- **Data:** 2026-05-20
- **Tags:** #presentation #architecture

## Contexto

`presentation/` precisa abrigar telas, hooks, componentes de cada feature. Duas organizações dominantes:

1. **Por tipo (flat):** `presentation/{screens, hooks, components}/` — cada coisa na sua pasta global
2. **Por feature (sliced):** `presentation/features/<nome>/{screen, hooks, components}/` — cada feature autocontida

## Opções consideradas

1. **Flat por tipo** — recomendação clássica do React, fácil pra projetos pequenos
2. **Feature-Sliced Design** — padrão de apps médios/grandes (FSD: https://feature-sliced.design)
3. **Híbrido** — DS compartilhado em `components/ds/`, features autocontidas em `features/`

## Decisão

Opção 3 — híbrido.

```
src/presentation/
├── components/
│   └── ds/             # Design System compartilhado (Text, Button, ...)
├── features/
│   ├── search/         # SearchScreen + hooks + components da feature
│   ├── repo-detail/
│   ├── issues/
│   ├── profile/
│   └── settings/
├── theme/              # tokens + ThemeContext
├── navigation/         # navigators
├── providers/          # AppProviders
└── screens/            # screens "soltas" sem feature (Showcase)
```

## Consequências

**Boas:**

- Encontrar código de uma feature inteira em 1 lugar — facilita refactor e onboarding
- Fácil extrair pra módulo isolado se um dia precisar
- DS continua compartilhado (não duplica)
- Convive bem com Clean Arch das camadas externas

**Ruins:**

- Mais aninhamento (mais cliques no IDE)
- Dev acostumado com flat por tipo precisa ajustar mental model

## Onde está no código

- `src/presentation/features/{search,repo-detail,issues,profile,settings}/`
- DS compartilhado: `src/presentation/components/ds/`
- Showcase fica em `src/presentation/screens/` porque é meta-feature (visualização do próprio DS)
