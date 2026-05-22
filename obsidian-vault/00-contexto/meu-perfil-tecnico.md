# Perfil técnico — calibragem de decisões

## Para que serve este documento

Documento de **calibragem**. Existe para responder uma pergunta única:

> _"Dada uma decisão técnica a tomar, qual escolha é coerente com o repertório e os padrões do autor?"_

Lido por:

- **Claude Code** em sessões futuras — antes de propor refactors, novas features ou mudanças estruturais, consulta este perfil para garantir que sugestões fiquem alinhadas ao que já é familiar e idiomático para o autor
- **Pelo próprio autor** em revisões — quando uma decisão precisa ser tomada rapidamente, este documento serve como vetor de coerência

Não documenta histórico de carreira nem lista projetos passados. Documenta **padrões técnicos internalizados** que se manifestam naturalmente no código.

## Repertório técnico ativo

Stack que opero diariamente:

- React Native + Expo SDK 54+
- TypeScript em modo strict
- React Navigation (stack + tabs + drawer)
- TanStack Query 5
- Zustand para estado local de cliente
- Reanimated 4 + Gesture Handler
- MMKV para storage de alta performance
- i18next para internacionalização
- IAP nativo + sistema de assinaturas
- Sentry / Crashlytics para observabilidade
- Firebase (Auth, Analytics, Messaging, Performance, Remote Config)

## Padrões internalizados

Estes padrões saem **automaticamente** no código. Decisões que os contradigam exigem justificativa explícita.

### Arquitetura

- Camadas externas (`domain`, `application`, `infrastructure`) seguem regra de dependência clássica
- Feature-Sliced Design aplicado dentro de `presentation/` (cada feature autocontida)
- Adapter pattern para tudo que toca SDK ou cliente externo
- Inversão de dependência via interface no domínio + implementação na infraestrutura

### TypeScript

- Modo strict puro, com `noUncheckedIndexedAccess`
- Zero `any` em código de produção (apenas em testes específicos quando justificado)
- Branded types para IDs nominais sobre primitivos
- Discriminated union para modelar estados e erros (não `enum`, não strings)
- Type guard (`isXxx`) sempre que narrow de `unknown` for necessário
- `as const` em objetos imutáveis para inferência estrita

### Estilo de código

- Função pura > classe quando não há estado interno
- Objeto literal > switch + helper function para mapeamento simples
- Composição > herança
- Comentário curto explica o "por quê" não-óbvio; código fala o "o quê"
- Sem JSDoc explicativo em função privada

### Tratamento de erro

- Erros tipados com `kind` literal, não strings
- Type guard para narrow no boundary do try/catch
- Exhaustiveness check via `switch (kind)` na UI
- Stack trace preservado (classe que estende `Error`)

### HTTP

- Cliente único configurado na infraestrutura
- Helper wrapper sobre o cliente que extrai `.data` e tipa response via generic
- Tradutor centralizado de erro HTTP → erro de domínio (anti-corruption layer)

### Git

- Conventional Commits
- Commits atômicos
- `pre-commit` hook valida lint + typecheck
- `commit-msg` hook valida formato

## Decisões que NÃO trago — e por quê

Padrões conhecidos mas deliberadamente fora do escopo deste projeto:

### MVVM com ViewModels separados

Conhecido (padrão clássico em apps de tamanho médio com fluxos complexos). Não aplicado aqui porque o PDF cita literal `hooks/useSearchRepos.ts` — hooks customizados cobrem o mesmo papel sem adicionar camada.

### Restyle ou outras libs de tema

Conhecido. Não aplicado aqui porque tema do app cabe em ~120 linhas de Context puro. Lib externa traz overhead injustificado para o escopo.

### Cache offline com persistência em disco

Conhecido (`PersistQueryClient` + storage driver). Não aplicado aqui porque PDF não exige. Stale-while-revalidate em memória do TanStack Query atende ao que a seção 7 do PDF descreve.

### Múltiplos agentes Claude **geradores** orquestrados

Conhecido (padrão de "AI agents especializados por área de produção"). Não aplicado neste formato porque overhead de orquestração de geração não compensa pra escopo de três telas read-only.

No mesmo dia 2026-05-20, à tarde, adotei o formato **auditor** — quatro agentes que validam código e vault já existentes sem produzir código novo. Detalhes em [[../01-decisoes/2026-05-20-agentes-auditores|ADR 008]].

## Sinais de alerta no código

Padrões que aparecem **não são do meu estilo** — se forem detectados, indicam que houve influência externa não revisada e devem ser questionados:

| Padrão suspeito                                                 | Por que não é meu estilo                                        |
| --------------------------------------------------------------- | --------------------------------------------------------------- |
| JSDoc longo (`*` block) explicando função privada               | Comentário curto basta; JSDoc é para API pública                |
| Switch case com helper function quando objeto literal serve     | Lookup por chave é mais legível                                 |
| `useColors()` ou hook atalho de `useTheme()` quando ninguém usa | Solução procurando problema                                     |
| Naming Material Design 3 nas cores (`surfaceContainerHighest`)  | Vocabulário de Figma, não de dev                                |
| Comentário tipo "decisão consciente porque..."                  | Pertence ao ADR, não ao código                                  |
| `Array<T>` em vez de `T[]`                                      | Inconsistente com regra ESLint do projeto                       |
| ViewModels separados de hooks                                   | Camada redundante quando hook customizado resolve               |
| `any` em código de produção                                     | Quebra contrato com `@typescript-eslint/no-explicit-any: error` |

Esses sinais não invalidam o código automaticamente — mas exigem **questionamento** antes de aceitar.
