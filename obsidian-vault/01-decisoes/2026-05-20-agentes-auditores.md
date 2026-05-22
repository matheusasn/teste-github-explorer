# ADR 008 — Quatro agentes auditores no `.claude/agents/`

- **Status:** aceita
- **Data:** 2026-05-20
- **Tags:** #ai-process #agentes #qualidade

## Contexto

De manhã, durante a montagem do vault e das decisões iniciais, rejeitei usar agentes Claude no projeto ([[03-rejeitado/agentes-claude-multiplos]]). A justificativa: agentes **geradores genéricos por área** (domain-builder, screens-builder etc.) fragmentam contexto e inflam artefatos pra um app de 3 telas read-only.

À tarde, durante o trabalho no domain e a leitura crítica do que o vault já estava acumulando, reconsiderei. A rejeição original mirava no formato errado — agentes **geradores**. Mas existe outro uso de agentes que serve diferente: **agentes auditores**, que operam sobre código e vault **já existentes** garantindo coerência ao longo do tempo, sem produzir código novo.

O projeto já tem características que dão valor a esse uso:

- Boundaries arquiteturais serão enforçadas via ESLint, mas isso só pega imports — a Dependency Rule semântica continua precisando de revisão humana ou agentificada
- Vault começou hoje de manhã e vai crescer ao longo do projeto — sem curadoria explícita vira pasta morta
- [[00-contexto/meu-perfil-tecnico|Perfil técnico]] tem lista explícita de "sinais de alerta" — só faz sentido se alguém usa pra auditar drift
- ADRs no formato Michael Nygard — formato consistente exige formalização repetida

## Opções consideradas

1. **Manter zero agentes** — defesa: "agentes inflam artefato". Aceitável, mas perde-se enforcement de coerência ao longo de sessões.
2. **Agentes-geradores por área** — rejeitado mais cedo no mesmo dia, registrado em [[03-rejeitado/agentes-claude-multiplos]].
3. **Quatro agentes auditores especializados** — `architecture-auditor`, `code-style-auditor`, `adr-keeper`, `vault-curator`. Atuam sobre o que já existe.

## Decisão

Opção 3. Quatro agentes em `.claude/agents/`, cada um com escopo bem delimitado, **sem responsabilidade de gerar código de produção**.

### `architecture-auditor`

- **Função:** valida Dependency Rule e boundaries entre `domain/`, `application/`, `infrastructure/`, `presentation/`.
- **Quando invocar:** antes de criar arquivo novo em camada interna; após edição que possa cruzar camadas.
- **Lê:** ADRs 001 ([[01-decisoes/2026-05-20-clean-arch-4-camadas]]), 005 ([[01-decisoes/2026-05-20-feature-sliced-presentation]]), 007 ([[01-decisoes/2026-05-20-eslint-boundaries]]).
- **Output:** lista de violações com arquivo:linha + sugestão de correção. Não modifica código.

### `code-style-auditor`

- **Função:** detectar drift contra os padrões internalizados no perfil técnico.
- **Sinais que ele caça:** JSDoc longo, switch+helper quando objeto literal serve, `useColors()`, naming Material Design 3, `Array<T>` em vez de `T[]`, ViewModels separados, `any` em produção, comentário "decisão consciente".
- **Quando invocar:** após qualquer geração maior por IA.
- **Lê:** [[00-contexto/meu-perfil-tecnico]].

### `adr-keeper`

- **Função:** formalizar decisão pronta em ADR Nygard.
- **Quando invocar:** decisão arquitetural amadureceu e merece ADR.
- **Produz:** `01-decisoes/AAAA-MM-DD-titulo.md`, atualiza README do vault, linka via wikilinks.
- **Detecta drift:** ADR existe mas código não implementa, ou vice-versa.

### `vault-curator`

- **Função:** cuidar do pensamento **em construção** — diferente de decisão pronta.
- **Seis operações:** captura rápida, processamento de daily, sugestão de conexões, weekly review (`05-revisoes/AAAA-WW.md`), refinamento de nota, detecção de drift.
- **Limite:** não cria ADR formal (esse é o `adr-keeper`); apenas sugere migração.

## Consequências

**Boas:**

- Cada agente tem **escopo único** — zero duplicação de responsabilidade
- Nenhum agente escreve código de produção — risco de geração inconsistente eliminado
- Quatro arquivos `.md` em `.claude/agents/` (não dezenas)
- Vault deixa de ser depósito morto e ganha curadoria explícita
- Coerência entre [[00-contexto/meu-perfil-tecnico]] e código é continuamente auditada
- ADRs deixam de depender de eu lembrar do formato

**Ruins:**

- Presença de 4 agentes num projeto pequeno pode soar como overengineering à primeira vista — exige documentação clara em `CLAUDE.md` de que são **auditores**, não geradores
- Quatro arquivos extras no repo (mas em pasta `.claude/`, padrão Claude Code)
- Curva de uso: lembrar qual agente chamar pra cada situação

**Mitigações:**

- README do vault e `CLAUDE.md` documentam responsabilidade de cada agente
- Cada agente tem `description:` explicando quando ser invocado — Claude escolhe automaticamente em muitos casos

## Diferenciação do rejeitado

| Eixo                    | Rejeitado (manhã)          | Adotado (tarde)                         |
| ----------------------- | -------------------------- | --------------------------------------- |
| Tipo de agente          | Gerador de código por área | Auditor de código/vault existente       |
| Output                  | Novos arquivos             | Relatório ou nota organizada            |
| Risco de inconsistência | Alto                       | Inexistente — não escrevem produção     |
| Quando dispara          | "Preciso do recurso X"     | "Acabei de escrever, valida" / "anota:" |

## Onde está no código

- `.claude/agents/architecture-auditor.md`
- `.claude/agents/code-style-auditor.md`
- `.claude/agents/adr-keeper.md`
- `.claude/agents/vault-curator.md`
- `CLAUDE.md` (raiz do projeto) referencia os quatro agentes

## Notas

Atualizei [[00-contexto/meu-perfil-tecnico]] removendo a entrada "Múltiplos agentes Claude orquestrados" da seção "Decisões que não trago" — a posição mudou, e essa mudança está documentada aqui.
