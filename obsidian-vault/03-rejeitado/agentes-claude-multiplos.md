# Rejeitado — Múltiplos agentes Claude genéricos por área

- **Data:** 2026-05-20 (manhã — rejeitado; tarde — reconsiderado)
- **Tags:** #rejeitado #ai-process

## O que era

Estruturar `.claude/agents/` com agentes **genéricos por área de produção** (ex: `domain-builder`, `infrastructure-builder`, `design-system-builder`, `screens-builder`, `testing-builder`). Cada agente seria invocado pra **escrever código** da sua área.

## Por que continuo recusando esse formato

- **Geração distribuída fragmenta contexto.** Cada agente gera código sem ver o que os outros geraram — consistência depende de orquestração externa.
- **Overhead de orquestração desproporcional ao escopo.** Três telas read-only não justificam pipeline de geração multi-agente.
- **Histórico de prompts gigante sinaliza "tudo IA".** O artefato fica indistinguível de produção amadora com LLM.

## O que adotei no lugar — 4 agentes auditores

Reconsiderei: o problema não era "ter agentes", era **"agentes geradores genéricos"**. Agentes que **auditam** trabalho já feito têm valor diferente — protegem coerência ao longo do tempo sem inflar artefatos.

Decidi por 4 agentes especializados em auditoria/curadoria. Detalhes em [[01-decisoes/2026-05-20-agentes-auditores]].

- **`architecture-auditor`** — fiscaliza Dependency Rule e boundaries.
- **`code-style-auditor`** — detecta drift contra [[00-contexto/meu-perfil-tecnico]].
- **`adr-keeper`** — formaliza decisão pronta em ADR Nygard.
- **`vault-curator`** — captura, processa, conecta e revisa pensamento em construção neste vault.

## Diferença essencial

| Eixo                  | Agentes-geradores (rejeitado)     | Agentes-auditores (adotado)                  |
| --------------------- | --------------------------------- | -------------------------------------------- |
| Output                | Código novo                       | Relatório de conformidade ou nota organizada |
| Risco                 | Drift entre áreas, inconsistência | Zero — não escrevem código de produção       |
| Quando dispara        | "Preciso do recurso X"            | "Acabei de escrever, valida pra mim"         |
| Custo de orquestração | Alto (sequenciar geração)         | Baixo (paralelo, idempotente)                |

## Trade-off aceito

Cada agente tem propósito **diferente do trabalho de geração** — eles existem porque o projeto **já existe**, não pra produzir o projeto.
