# Pergunta — "Como enforçar a Dependency Rule da Clean Architecture em compile-time?"

- **Data:** 2026-05-20
- **Tags:** #estrategia #arquitetura #linter

## Contexto

A Clean Architecture (Martin, 2012) tem como princípio fundamental a **Dependency Rule**: código em camada interna não pode mencionar nada de camada externa. Sem um mecanismo de verificação automatizada, esse princípio degrada para "convenção respeitada pelo dev cuidadoso e violada pelo dev apressado".

A dimensão "Arquitetura & Desacoplamento" do PDF tem peso Alta. Violações concretas (domínio importando axios, screen importando AsyncStorage diretamente) são exatamente o que o PDF prioriza eliminar.

## Por que essa pergunta foi central

Definir Clean Architecture **sem mecanismo de enforcement** transforma o princípio em decoração arquitetural. A primeira pergunta antes de codar qualquer linha deveria ser: _"o que impede meu código de violar a regra que acabei de declarar?"_

Sem resposta a essa pergunta:

- Domínio pode acabar importando React para "compor um helper de visualização"
- Use case pode acabar importando axios "só pra um caso específico"
- Screen pode acabar importando `GitHubRepositoryImpl` "porque é mais direto"

Cada violação é pequena isoladamente, mas elas se acumulam até comprometer a arquitetura inteira.

## Alternativas analisadas

### 1. Convenção + code review

Documentar em `CONTRIBUTING.md` que `domain/` é framework-free. Confiar no code review humano.

**Problema:** code review não é executado em pre-commit local. Violações chegam até pull request e dependem de revisor atento.

### 2. Estrutura de monorepo com packages isolados

Separar `domain/` em package npm próprio (`@projeto/domain`) sem dependência declarada em `react`/`axios`. Import inválido falha no `yarn install`.

**Problema:** overhead absurdo para projeto de três telas. Justifica em projetos com 50+ módulos.

### 3. ESLint `no-restricted-imports` por padrão de arquivo (escolhida)

Configuração flat config (ESLint 9+) permite blocos `files: ['src/domain/**']` com regras específicas. Cada camada tem seu conjunto de imports proibidos com mensagem explicativa.

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
}
```

Pre-commit hook (Husky) executa `yarn lint --max-warnings=0`. Violação bloqueia o commit local — não chega nem a virar PR.

## Resposta adotada

ESLint flat config com `no-restricted-imports` segregado por bloco `files: [...]`. Quatro blocos: regras gerais, regras de `domain/`, regras de `application/`, regras de `presentation/`. Mensagens explicativas em inglês indicando o princípio violado.

Referência: documentação oficial ESLint flat config (eslint.org/docs/latest/use/configure/configuration-files).

## Impacto no projeto

- **`eslint.config.mjs`** com 4 blocos de boundary
- **Pre-commit hook** (`.husky/pre-commit`) executa `yarn lint-staged && yarn typecheck`
- Tentativa de importar `axios` em `src/domain/` falha o commit local
- Tentativa de importar `@infrastructure/repositories/*` em `src/presentation/` falha o commit local

Decisão arquitetural deixou de ser "convenção" e virou "garantia executável".

## Decisões relacionadas

- [[01-decisoes/2026-05-20-clean-arch-4-camadas|ADR 001 — Clean Arch 4 camadas]]
- [[01-decisoes/2026-05-20-eslint-boundaries|ADR 007 — ESLint boundaries]]
