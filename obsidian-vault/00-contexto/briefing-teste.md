# Briefing — Mapeamento técnico do teste

> Leitura do PDF como especificação. Cada seção interpretada em requisito técnico verificável.
>
> Documento descreve **o que o teste pede**. As decisões tomadas em resposta a essa especificação estão em [[decisoes-iniciais|decisões iniciais]].

## Tags

#contexto #especificacao

## Resumo executivo

Especificação de aplicativo móvel para consulta da API REST do GitHub. PDF declara dimensões com pesos diferentes — não há bônus por features extras, mas há custo evidente em violação de princípios arquiteturais.

A natureza do escopo (três telas read-only consumindo API pública) deixa claro o foco do exercício: **maturidade arquitetural e disciplina de engenharia, não habilidade de construir features**. As dimensões "Arquitetura & Desacoplamento" e "Qualidade do Código" carregam o peso "Alta" no PDF.

## Mapeamento por seção

### Seção 1 — Objetivo

Cinco objetivos declarados:

1. Estruturar app Expo com TypeScript seguindo princípios de Clean Architecture
2. Criar Design System mínimo, tipado e consistente
3. Integrar com API pública do GitHub
4. Implementar cache com boa experiência de usuário
5. Demonstrar senso crítico e responsabilidade no uso de IA

A frase-chave é _"não apenas o código gerado, mas as decisões por trás dele"_ (parágrafo introdutório). O exercício é desenhado pra diferenciar **executor** (recebe instrução e implementa) de **engenheiro** (analisa contexto, justifica escolhas, identifica trade-offs).

### Seção 2 — Requisitos técnicos

| Requisito                                                               | Interpretação técnica                                                            |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Expo SDK 50+                                                            | Versão mínima — SDK 55 é a estável mais recente                                  |
| TypeScript sem `any` solto                                              | Implica `strict: true` + ESLint rule `@typescript-eslint/no-explicit-any: error` |
| Cache via lib (TanStack/SWR/RTK Query)                                  | TanStack Query é o padrão dominante no ecossistema React Native (2023+)          |
| Jest + React Native Testing Library                                     | Preset `jest-expo` resolve transformações nativas e mocks de módulos do Expo     |
| ESLint + Prettier configurados e passando                               | Implica pre-commit hook bloqueando código fora do padrão                         |
| Desacoplamento (domínio isolado, DI, interfaces antes de implementação) | Detalhado na seção 3.1 — princípios SOLID aplicados                              |

### Seção 3.1 — Princípios obrigatórios

Os cinco princípios listados são, na ordem do PDF:

1. **Inversão de Dependência** — quinto princípio SOLID. Módulos de alto nível não dependem de módulos de baixo nível; ambos dependem de abstrações
2. **Interfaces antes de implementações** — corolário do DIP. O contrato é definido antes do que implementa o contrato
3. **Domínio isolado** — o "núcleo" da Clean Architecture. Domínio rodável em qualquer ambiente que execute TypeScript/JavaScript puro, incluindo Node
4. **Camada de application separada** — equivalente à camada "Use Cases" da Clean Architecture original. Orquestra o domínio sem acoplar a frameworks
5. **Apresentação desacoplada** — telas consomem abstrações (hooks, use cases injetados), nunca dependências de infraestrutura diretamente

O peso "Alta" em "Arquitetura & Desacoplamento" deixa explícito que o PDF prioriza ausência de violações concretas: domínio importando React, use case chamando axios diretamente, screen acessando AsyncStorage.

### Seção 3.2 — Estrutura sugerida

A tabela `domain/application/presentation/infrastructure/` é apresentada explicitamente como **sugestão**, não obrigação. O PDF declara: _"Você pode seguir, adaptar ou propor uma estrutura diferente — desde que os princípios acima estejam presentes e justificados no README."_

Implicação técnica: a estrutura adotada precisa ser **justificável**, e desvios da sugestão precisam ser **documentados**.

### Seção 4 — Funcionalidades

Três telas funcionais + uma de Showcase:

| Tela                          | Estados de UX exigidos                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| 4.1 Busca de repositórios     | Loading, empty, erro (rate limit, sem conexão), infinite scroll, pull-to-refresh    |
| 4.2 Detalhes do repositório   | (não detalhado, mas implícito: loading, erro, dados)                                |
| 4.3 Issues do repositório     | Lista paginada com pull-to-refresh                                                  |
| 4.4 Showcase do Design System | Todos os componentes em todas as variações; switch de tema light/dark "recomendado" |

A presença explícita de **"loading, empty state, erro"** no item 4.1 indica que a dimensão "UX & Estados" (peso Média) exige esses três estados em todas as telas, não apenas na busca.

### Seção 5 — Integração com a API do GitHub

| Endpoint                                      | Notas                                          |
| --------------------------------------------- | ---------------------------------------------- |
| `GET /search/repositories`                    | Resposta envelopada em `items` + `total_count` |
| `GET /repos/{owner}/{repo}`                   | Resposta única                                 |
| `GET /repos/{owner}/{repo}/issues?state=open` | Resposta como array (sem envelope)             |

Rate limit anônimo: 60 req/hora. Autenticado: 5.000 req/hora. PDF cita: _"Aceitar opcionalmente `GITHUB_TOKEN` via `.env` para aumentar o limite. Não commitar credenciais."_

Implicação: `.env` deve estar no `.gitignore` antes do primeiro commit. Variáveis com prefixo `EXPO_PUBLIC_*` são expostas no bundle JavaScript (limitação do Expo SDK 49+).

### Seção 6 — Design System

#### 6.1 Tokens tipados (4 categorias)

- `spacing` (escala xs-xl) — múltiplos de 4 é padrão (Material Design, Apple HIG, Tailwind)
- `sizes` (tipografia e ícones)
- `colors` (light + dark) — pelo menos 8 papéis semânticos
- `radius` (escala sm-lg)

#### 6.2 Componentes base obrigatórios (6)

`Text`/`Heading`, `Button`, `Input`, `Card`/`Surface`, `Badge`/`Tag`, `Avatar`.

#### 6.3 Restrições explícitas

- Evitar componentes não tipados
- Evitar `style` solto por instância
- Props controladas (`variant`, `size`, `tone`)
- Preferir `ThemeProvider` + `useTheme`

Essas restrições indicam o padrão de Design System estruturado: tokens centralizados, componentes com API constrita por props enumeradas, sem escape via `style` inline.

### Seção 7 — Cache

Especificação implícita:

- "Dados offline ou stale exibidos enquanto revalida" — comportamento stale-while-revalidate (TanStack Query implementa por default)
- "Estados de loading discretos em recarregamentos subsequentes" — distinguir primeira carga (`isLoading`) de revalidação em background (`isFetching`)

Não pede persistência em disco. Cache em memória do TanStack Query atende ao requisito.

### Seção 8 — Uso de IA

Política explícita: uso permitido, declaração obrigatória. Três artefatos exigidos no README:

1. **Quais partes** foram geradas/assistidas
2. **Quais prompts** foram utilizados
3. **O que foi modificado, revisado ou rejeitado** do output e por quê

A última linha da seção (em destaque no PDF): _"submissões que aparentem ser integralmente geradas por IA sem nenhuma evidência de entendimento ou adaptação do candidato poderão resultar em uma entrevista técnica aprofundada sobre cada decisão"_.

Implicação: a entrega é tratada como um **par {código, raciocínio}**. Cada decisão precisa estar registrada e justificável tecnicamente — daí o vault existir desde o primeiro dia, com ADRs, rejeitados e perfil de calibragem.

### Seção 9 — Entrega

Nove itens de checklist obrigatório:

- Repositório público no GitHub
- App Expo + TypeScript funcional iniciando sem erros
- Busca de repositórios com paginação
- Tela de detalhes acessível por tap no repositório
- Design System mínimo tipado (tokens + componentes)
- Tela de Showcase
- Cache via biblioteca
- Testes cobrindo pelo menos use cases do domínio
- Commits pequenos e descritivos

Mais o README com quatro seções obrigatórias:

1. Instruções de instalação e execução
2. Explicação das decisões arquiteturais (por que Clean Architecture? quais trade-offs?)
3. Declaração de uso de IA
4. O que faria diferente com mais tempo

### Seção 10 — Dimensões e pesos

| Dimensão                     | Peso        | Foco técnico                                             |
| ---------------------------- | ----------- | -------------------------------------------------------- |
| Arquitetura & Desacoplamento | Alta        | Clean Architecture, inversão de dependências, interfaces |
| Qualidade do Código          | Alta        | TypeScript rigoroso, sem `any`, componentes tipados      |
| Design System                | Média       | Tokens, componentes base, showcase completo              |
| UX & Estados                 | Média       | Loading, erro, empty state, pull-to-refresh              |
| Testes                       | Média       | Cobertura dos use cases, testes de componentes           |
| Uso de IA                    | Diferencial | Transparência, senso crítico, adaptações                 |
| README & Commits             | Baixa       | Clareza, commits atômicos e descritivos                  |

"Diferencial" indica que o item não é obrigatório, mas soma quando bem trabalhado.

## Verificação de aderência (auto-check)

Lista derivada da seção 9 + dimensões da seção 10 pra validar antes da entrega:

- [x] Repositório público no GitHub (matheusasn/teste-github-explorer)
- [x] App Expo + TypeScript funcional iniciando sem erros
- [x] Busca com paginação funcionando
- [x] Tela de detalhes acessível por tap
- [x] Design System mínimo tipado (tokens + 6 componentes obrigatórios + 1 extra)
- [x] Tela de Showcase
- [x] Cache controlado via biblioteca (TanStack Query)
- [x] Testes cobrindo use cases do domínio (79 testes total)
- [x] Commits pequenos e descritivos (Conventional + Gitmoji)
- [x] README com instalação, execução, decisões, IA, "faria diferente"
- [x] Declaração de uso de IA dentro do README
- [x] Sem `any` no código (ESLint enforça)
- [x] ESLint passando com `--max-warnings=0`
- [x] TypeScript strict + flags extras
- [x] Loading, empty, erro tratados em todas as telas
- [x] Pull-to-refresh em todas as listas
- [x] Infinite scroll em listas paginadas
- [x] Sem credenciais commitadas (`.env` no `.gitignore`)
