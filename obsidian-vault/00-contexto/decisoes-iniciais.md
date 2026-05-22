# Decisões iniciais — padrões e referências arquiteturais

> Padrões adotados em resposta à especificação do teste, antes da primeira linha de código. As decisões pontuais que surgiram durante o desenvolvimento estão em [[01-decisoes]] (ADRs).
>
> Documento descreve **o que foi escolhido como base** e **por quê tecnicamente**, com referências bibliográficas.

## Tags

#contexto #arquitetura #padroes

## Visão geral das decisões iniciais

Antes de escrever código, foram fixados:

1. **Padrão arquitetural**: Clean Architecture em 4 camadas
2. **Padrão de organização interna**: Feature-Sliced Design dentro de `presentation/`
3. **Padrão de inversão de dependência**: container DI manual (factory function)
4. **Padrão de tipagem**: TypeScript strict + flags extras + branded types
5. **Padrão de tratamento de erro**: discriminated union + type guard
6. **Padrão de documentação de decisão**: ADRs (Michael Nygard)
7. **Padrão de commits**: Conventional Commits 1.0.0
8. **Padrão de enforcement**: ESLint flat config com `no-restricted-imports` por camada
9. **Padrão de design system**: tokens centralizados + `ThemeProvider` + `useTheme`
10. **Padrão de cache**: TanStack Query stale-while-revalidate em memória

Cada item detalhado abaixo.

## 1. Clean Architecture (Robert C. Martin, 2012)

**Referência:** _Clean Architecture: A Craftsman's Guide to Software Structure and Design_ (2017); post seminal "The Clean Architecture" (cleancoder.com, 2012).

**Regra fundamental:** _The Dependency Rule_ — código em camada interna não pode mencionar nada de camada externa.

**Aplicação no projeto:**

```
domain/          ← núcleo, zero dependência
  ↑
application/     ← orquestra domain
  ↑
infrastructure/  ← implementa contratos do domain (axios, http, mappers)
presentation/    ← consome application (hooks, screens)
```

`domain/` é rodável em Node puro. Sem imports de React, React Native, axios, ou qualquer SDK do Expo.

## 2. Inversão de Dependência (DIP — SOLID #5)

**Referência:** _Agile Software Development: Principles, Patterns, and Practices_ (Robert C. Martin, 2002).

**Princípio:** módulos de alto nível (use cases) não dependem de módulos de baixo nível (axios, AsyncStorage). Ambos dependem de abstrações.

**Aplicação concreta:**

- `IGitHubRepository` (interface) em `src/domain/repositories/`
- `GitHubRepositoryImpl` (implementação concreta) em `src/infrastructure/repositories/`
- Use cases recebem `IGitHubRepository` via closure (DI manual)
- Container factory (`createContainer(repository?)`) permite injetar implementação alternativa para testes ou Storybook

## 3. Feature-Sliced Design dentro de `presentation/`

**Referência:** feature-sliced.design — método de organização aceito amplamente em apps React/RN médio-grandes desde 2020.

**Aplicação:**

```
presentation/
├── theme/                  # Design System cross-feature
├── components/ds/           # Design System cross-feature
├── features/                # Feature-Sliced começa aqui
│   ├── search/
│   ├── repo-detail/
│   ├── issues/
│   ├── profile/
│   └── settings/
├── navigation/
└── providers/
```

Camadas externas seguem Clean Architecture clássica. FSD aplicado apenas onde traz valor — agrupamento por feature na UI.

## 4. TypeScript em modo strict + flags adicionais

**Referência:** TypeScript Handbook — `tsconfig` reference.

**Configuração adotada:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

- `strict: true` — agrupa todas as strict flags principais (noImplicitAny, strictNullChecks, etc.)
- `noUncheckedIndexedAccess` — `arr[i]` é tipado como `T | undefined`, força tratar caso de índice fora do array
- `noFallthroughCasesInSwitch` — proíbe `switch` case sem `break`/`return`

Regra adicional no ESLint: `@typescript-eslint/no-explicit-any: error`.

## 5. Branded types pros IDs do domínio

**Referência:** padrão idiomático em TypeScript para tipos nominais sobre primitivos. Conhecido como "branded types" ou "nominal typing via tag".

**Definição:**

```ts
type Brand<T, B> = T & { readonly __brand: B };

export type RepoId = Brand<number, 'RepoId'>;
export type IssueId = Brand<number, 'IssueId'>;
// ...

export const repoId = (n: number): RepoId => n as RepoId;
```

**Benefício:** impossível confundir `IssueId` com `RepoId` em compile-time, mesmo ambos sendo `number` em runtime.

**Custo:** zero em runtime (apenas type assertion). Cognitive overhead inicial para quem desconhece o padrão.

## 6. Erros como discriminated union + class extends Error

**Referência:** padrão híbrido combinando classes do JavaScript (preserva stack trace) com discriminated union do TypeScript (habilita exhaustiveness check).

**Definição:**

```ts
export class RateLimitError extends Error {
  readonly kind = 'rate-limit' as const;
  // ...
}
// ... outras 4 classes

export type GitHubError = RateLimitError | NetworkError | NotFoundError | UnauthorizedError | UnknownApiError;
export const isGitHubError = (e: unknown): e is GitHubError => /* ... */;
```

**Uso na UI:**

```ts
if (isGitHubError(error)) {
  switch (error.kind) {
    case 'rate-limit':
      return /* ... */;
    case 'network':
      return /* ... */;
    case 'not-found':
      return /* ... */;
    case 'unauthorized':
      return /* ... */;
    case 'unknown':
      return /* ... */;
  }
}
```

**Benefício:**

- Stack trace preservado (importante para integração futura com Sentry/Crashlytics)
- TypeScript força tratamento de todos os casos (compile error se um caso novo for adicionado e esquecido)

## 7. Architecture Decision Records (Michael Nygard, 2011)

**Referência:** "Documenting Architecture Decisions" (cognitect.com, 2011); adr.github.io.

**Formato adotado:** Status, Contexto, Opções consideradas, Decisão, Consequências.

**Aplicação:** cada decisão arquitetural relevante registrada como ADR numerada em `01-decisoes/AAAA-MM-DD-titulo.md` deste vault.

Razão: decisões arquiteturais perdem contexto ao longo do tempo. ADRs preservam o **porquê** de cada escolha, permitindo reavaliação fundamentada no futuro.

## 8. Conventional Commits 1.0.0

**Referência:** conventionalcommits.org/en/v1.0.0/.

**Formato:** `<type>(<scope>): <description>`. Tipos validados pelo padrão: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`.

**Implementação:**

- `@commitlint/config-conventional` valida mensagem
- Hook `commit-msg` via Husky bloqueia commit fora do padrão
- Parser customizado em `commitlint.config.js` aceita Gitmoji opcional antes do tipo

Razão: histórico de commits estruturado habilita geração automática de changelog e adoção de semantic-release no futuro.

## 9. ESLint flat config com boundary rules

**Referência:** eslint.org/docs/latest/use/configure/configuration-files (flat config introduzido no ESLint 9).

**Aplicação:**

- Configuração programática em `eslint.config.mjs` (substitui `.eslintrc.json` legado)
- Composição de regras por padrão de arquivo via blocos `files: [...]`
- Boundary rules por camada via `no-restricted-imports`:
  - `src/domain/**` não pode importar React, React Native, axios, `@tanstack/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`
  - `src/application/**` não pode importar React Native, axios, `@tanstack/*`, `@presentation/*`, `@infrastructure/repositories/*`, `@infrastructure/http/*`
  - `src/presentation/**` não pode importar axios, `@react-native-async-storage/async-storage`, `@infrastructure/repositories/*`, `@infrastructure/http/*`

Razão: Clean Architecture não é convenção — é regra. ESLint enforça automaticamente no `pre-commit` hook.

## 10. Design System: tokens + Theme via Context

**Referência:** PDF seção 6.3 cita explicitamente "Preferir `ThemeProvider` + hook `useTheme`".

**Aplicação:**

- Tokens centralizados em `src/presentation/theme/tokens.ts` (colors light/dark, spacing, radius, typography)
- `ThemeContext` próprio (sem dependência externa)
- 3 modos: `system` (padrão, segue OS), `light`, `dark`
- Hook `useTheme()` retorna tudo tipado
- Componentes do DS consomem `useTheme()` — sem `style` solto nas screens

## 11. Cache: TanStack Query stale-while-revalidate

**Referência:** documentação oficial TanStack Query v5 (tanstack.com/query).

**Aplicação:**

- `QueryClient` configurado com `staleTime: 5min` por padrão
- `useInfiniteQuery` em listas paginadas (busca, issues)
- `useQuery` em recursos únicos (detalhe do repo, perfil do usuário)
- Retry inteligente: `NetworkError` não retry, outros até 2 tentativas
- Pull-to-refresh aciona `refetch()`

Persistência em disco não implementada — fora do escopo do PDF. Registrado em "faria diferente com mais tempo".

## Trade-offs principais identificados

### Inversão de Dependência: custo vs benefício

**Custo:**

- Mais arquivos (interface + implementação separadas)
- Container de DI manual (boilerplate inicial)
- Cognitive overhead para quem desconhece o padrão

**Benefício:**

- Use cases testáveis em Node puro
- Implementação concreta substituível sem refactor de use case
- Domínio rodável em qualquer ambiente JS

**Decisão:** o peso "Alta" da dimensão de arquitetura no PDF justifica o custo. Apenas três use cases — boilerplate é pequeno na prática.

### Branded types vs `number` puro

**Custo:**

- Helpers de construção (`repoId(n)`, `issueId(n)`, etc.)
- Cognitive overhead — dev novo precisa entender a convenção

**Benefício:**

- Impossível confundir IDs em compile-time
- Zero overhead em runtime (tipos apagados no JS final)

**Decisão:** custo cognitivo é pequeno (uma vez aprendido o padrão), benefício é refactor-safe ao longo da vida do projeto.

### Theme custom vs biblioteca de tema

**Custo:**

- Implementar manualmente o que biblioteca faria (Context, hook, switching, `useColorScheme`)
- Sem componentes prontos como `<Box bg="primary" />`

**Benefício:**

- Zero dependência externa para algo que cabe em ~120 linhas
- Controle total sobre tipos da paleta
- Sem lock-in a API de biblioteca

**Decisão:** escopo do projeto (7 componentes do DS) não justifica a dependência externa. Em projeto com 30+ componentes a balança inverte.

### Cache em memória vs persistente

**Custo de persistência:**

- Dependência adicional (`@tanstack/react-query-persist-client` + storage driver)
- Decisões de migração de schema do cache
- Comportamento offline a especificar

**Benefício de persistência:**

- Dados disponíveis em reabertura do app sem conexão
- Reduz percepção de loading na primeira tela após cold start

**Decisão:** PDF não exige persistência. Stale-while-revalidate em memória atende a especificação. Persistência registrada como item de "faria diferente com mais tempo" no README.

### Use cases como função vs classe

**Custo de função:**

- Quem espera o padrão Uncle Bob clássico estranha inicialmente
- Sem herança disponível (não necessária no escopo)

**Benefício de função:**

- Sem `this` — elimina classe inteira de bugs
- DI natural via closure
- Type alias (`SearchReposUseCase = (input) => Promise<T>`) explicita o contrato

**Decisão:** função pura cobre o caso de uso. Classe seria conveniente apenas se houvesse estado compartilhado entre métodos (não há).

## Estrutura final adotada

```
src/
├── domain/          # entities, repositories (interfaces), errors, types (branded)
├── application/     # use cases como function factories
├── infrastructure/  # axios, mappers, repositoryImpl, errorTranslator, container DI
└── presentation/    # theme, components/ds, features/, navigation/, providers
```

Boundary rules entre camadas: enforçadas via ESLint `no-restricted-imports`.

Stack de qualidade: TS strict + ESLint flat config + Prettier + Husky + Commitlint + Jest 29 + React Native Testing Library 13 + jest-expo preset.
