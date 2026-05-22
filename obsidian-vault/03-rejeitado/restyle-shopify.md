# Rejeitado — Restyle (Shopify)

- **Data:** 2026-05-20
- **Tags:** #rejeitado #theme

## O que era

Lib de tema do Shopify. Permite componentes tipo `<Box bg="primary" padding="md" />` com tipagem rica. Popular no ecossistema RN.

## Por que recusei

- Dep externa pra resolver "tema do app" — algo que cabe em ~120 linhas de Context puro
- `<Box />` em tudo gera "Box hell" nas screens
- Lock-in à API da lib (se um dia quiser trocar, refator grande)
- PDF (seção 6.3) pede literal "`ThemeProvider` + hook `useTheme`" — Context puro atende mais diretamente

## O que fiz no lugar

`ThemeProvider` próprio (`src/presentation/theme/ThemeContext.tsx`) com:

- Estado de preferência (`'system' | 'light' | 'dark'`)
- Sync com `useColorScheme` do RN
- Tokens em `tokens.ts` (colors, spacing, radius, typography)
- Hook `useTheme()` retorna tudo tipado

Total: ~50 linhas no `ThemeContext.tsx` + ~70 nos tokens. Sem dep nova.

## Trade-off aceito

Não tenho componente `<Box bg="primary" />`. Cada componente do DS chama `useTheme()` manualmente. Aceitei pelo escopo do app — 7 componentes, não é "Box hell".
