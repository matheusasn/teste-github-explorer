# Glossário

- **Tags:** #glossario

## Conceitos de Clean Architecture

**Entity** — modelo de dados puro do domínio. Sem comportamento, sem dependência externa.

**Use case** — operação de negócio (`SearchReposUseCase`, `GetRepoDetailsUseCase`). Recebe um repository via DI, orquestra a chamada.

**Repository (interface)** — contrato no domínio (`IGitHubRepository`). Define o que precisa, não como.

**Repository (implementação)** — classe na infra (`GitHubRepositoryImpl`) que implementa o contrato usando axios + mappers.

**Mapper** — função pura que traduz payload bruto da API (snake_case) em entity do domínio (camelCase + branded IDs).

**Anti-Corruption Layer (ACL)** — barreira entre sistema externo (API GitHub) e o domínio. O mapper é o ACL pra dados; o `errorTranslator` é o ACL pra erros.

**Inversão de dependência (DIP)** — módulos de alto nível (use cases) não dependem de baixo nível (axios). Ambos dependem da abstração (`IGitHubRepository`).

## Conceitos de TypeScript

**Branded type** — tipo nominal forjado sobre primitivo: `type RepoId = number & { __brand: 'RepoId' }`. Impede confusão entre IDs do mesmo tipo base.

**Discriminated union** — `type GitHubError = RateLimitError | NetworkError | ...` com `kind` literal em cada variante. Habilita exhaustiveness check via `switch`.

**Exhaustiveness check** — em `switch (e.kind)`, o `default` pode ter `const _: never = e`. TS força tratar todos os casos do union — se um caso novo for adicionado e esquecido, compile error.

**Type guard** — função `is X` (`isGitHubError(e): e is GitHubError`) que estreita o tipo de `unknown` pra X.

## Conceitos do projeto

**Vault** — esse aqui. Pasta com `.md` interlinkados, lida pelo Obsidian e pelo Claude.

**ADR (Architecture Decision Record)** — nota documentando uma decisão: contexto, opções, decisão, consequências. Padrão Michael Nygard / ThoughtWorks.

**Feature-Sliced Design (FSD)** — organização por feature autocontida (`features/search/`, `features/issues/`) em vez de por tipo (`screens/`, `hooks/`, `components/` flat).

**Container DI** — módulo que conecta use cases ao repository concreto. Aqui é factory function (`createContainer(repo?)`) que aceita repository opcional.

**Pre-commit hook (Husky)** — script que roda antes de criar um commit. No projeto: `yarn lint-staged && yarn typecheck`.

**Commit-msg hook (Husky)** — script que valida a mensagem do commit. Roda `commitlint` que verifica padrão Conventional.

**`@expo/vector-icons`** — pacote que vem com Expo, expõe famílias de ícones (Feather, Material, Ionicons, etc.) como componentes RN.

## Padrões de commit

**Conventional Commits** — `<type>(<scope>): <description>`. Tipos: feat, fix, chore, docs, test, refactor, perf, style, build, ci, revert.

**Gitmoji** — emoji no começo da mensagem (`✨ feat: ...`). Visual, scanning rápido.

## Endpoints da API GitHub usados

- `GET /search/repositories?q={query}&sort=stars&order=desc&page={n}&per_page=20`
- `GET /repos/{owner}/{repo}`
- `GET /repos/{owner}/{repo}/issues?state=open&page={n}&per_page=20`
- `GET /user` (requer Authorization Bearer)

## Pesos das dimensões no PDF

| Dimensão                     | Peso        |
| ---------------------------- | ----------- |
| Arquitetura & Desacoplamento | Alta        |
| Qualidade do Código          | Alta        |
| Design System                | Média       |
| UX & Estados                 | Média       |
| Testes                       | Média       |
| Uso de IA                    | Diferencial |
| README & Commits             | Baixa       |
