# ADR 007 — ESLint com boundary rules por camada

- **Status:** aceita
- **Data:** 2026-05-20
- **Tags:** #tooling #architecture #eslint

## Contexto

Clean Arch só funciona se as regras de boundary entre camadas forem **enforçadas**. Convenção (comentário + code review) não basta — alguém vai importar `axios` em `domain/` por engano.

## Opções consideradas

1. **Confiar em convenção** — code review pega
2. **Documentar em `CONTRIBUTING.md`** — quem ler segue, quem não ler ignora
3. **Enforçar via ESLint** — `no-restricted-imports` por pasta, falha o lint

## Decisão

Opção 3 — `eslint.config.mjs` com flat config + `no-restricted-imports` por pasta:

```js
{
  files: ['src/domain/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        { group: ['react', 'react-native'], message: 'domain is framework-free' },
        { group: ['axios'], message: 'domain defines contracts, not transport' },
        { group: ['@application/*', '@infrastructure/*', '@presentation/*'],
          message: 'domain is the innermost layer' },
      ],
    }],
  },
},
```

Aplicado em `domain/`, `application/`, `presentation/`. Cada camada tem regras específicas.

## Consequências

**Boas:**

- Boundary violations falham o CI/pre-commit, não escapam
- Documenta a arquitetura no código (lê o `.mjs` e entende os limites)
- `pre-commit` hook (Husky) bloqueia
- Mensagens explicam o motivo

**Ruins:**

- Setup inicial trabalhoso (~95 linhas no `.mjs`)
- Eventual override pra exceções precisa ser documentado

## Onde está no código

- `eslint.config.mjs` — flat config com 4 blocos de boundary
- Pre-commit hook: `.husky/pre-commit` → `yarn lint-staged && yarn typecheck`
