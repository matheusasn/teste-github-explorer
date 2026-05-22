# Vault — Teste Técnico React Native

Vault privado de processo (journal + ADRs + prompts) do projeto `teste-github-explorer`. Não vai pro GitHub. Lido pelo Claude Code via `CLAUDE.md` no root do projeto.

## Contexto

- **[[00-contexto/briefing-teste|Briefing do teste]]** — mapeamento técnico do PDF: o que cada seção pede e como é interpretada
- **[[00-contexto/decisoes-iniciais|Decisões iniciais]]** — padrões e referências arquiteturais adotados em resposta ao briefing, com trade-offs
- **[[00-contexto/meu-perfil-tecnico|Perfil técnico]]** — calibragem de decisões: repertório do autor para validar coerência de novas escolhas

## Decisões (ADRs)

- [[01-decisoes/2026-05-20-clean-arch-4-camadas|001 — Clean Arch em 4 camadas]]
- [[01-decisoes/2026-05-20-use-cases-como-funcao|002 — Use cases como function factory]]
- [[01-decisoes/2026-05-20-branded-types|003 — Branded types pros IDs]]
- [[01-decisoes/2026-05-20-discriminated-union-erros|004 — Erros como discriminated union]]
- [[01-decisoes/2026-05-20-feature-sliced-presentation|005 — Feature-Sliced no presentation]]
- [[01-decisoes/2026-05-20-theme-custom-sem-restyle|006 — Theme custom sem Restyle]]
- [[01-decisoes/2026-05-20-eslint-boundaries|007 — ESLint boundaries por camada]]
- [[01-decisoes/2026-05-20-agentes-auditores|008 — Quatro agentes auditores no `.claude/agents/`]]
- [[01-decisoes/2026-05-21-gitmoji-conventional|009 — Gitmoji + Conventional Commits]]
- [[01-decisoes/2026-05-21-perfil-condicional-token|010 — Perfil condicional ao token]]
- [[01-decisoes/2026-05-21-api-get-helper|011 — apiGet helper enxuto]]
- **[[01-decisoes/2026-05-21-AVALIACAO-CRITICA-cor-primary|⚠️ Decisão ruim identificada — primary verde vs azul info]]**

## Perguntas estratégicas que orientaram o projeto

- [[02-prompts-importantes/01-enforcement-da-regra-de-dependencia|01 — Como enforçar a Dependency Rule em compile-time?]]
- [[02-prompts-importantes/02-testar-use-case-sem-mockar-http|02 — Como testar use cases sem mockar HTTP?]]
- [[02-prompts-importantes/03-prevenir-confusao-de-ids|03 — Como prevenir confusão de IDs em compile-time?]]
- [[02-prompts-importantes/04-forcar-ui-tratar-todos-erros|04 — Como forçar a UI a tratar todos os erros?]]
- [[02-prompts-importantes/05-traduzir-erro-http-em-erro-de-dominio|05 — Como traduzir AxiosError em erro de domínio?]]
- [[02-prompts-importantes/06-design-system-impede-inconsistencia|06 — Como o DS impede inconsistência sem code review?]]
- [[02-prompts-importantes/07-diferenciar-carga-inicial-de-revalidacao|07 — Como diferenciar primeira carga de revalidação?]]

## Rejeitado da IA

- [[03-rejeitado/restyle-shopify|Restyle Shopify]]
- [[03-rejeitado/viewmodels-mvvm|ViewModels MVVM]]
- [[03-rejeitado/agentes-claude-multiplos|Agentes Claude geradores por área]] _(rejeitado o formato gerador; ver [[01-decisoes/2026-05-20-agentes-auditores|ADR 008]] pro formato adotado)_
- [[03-rejeitado/jsdoc-longo-sobre-codigo|JSDoc longo descrevendo o código]]
- [[03-rejeitado/usecases-context-provider|UseCasesContext provider]]
- [[03-rejeitado/persistencia-offline|PersistQueryClient + NetInfo]]

## Diário

- [[04-diario/2026-05-20|2026-05-20 — setup + domínio + application + infra + DS + agentes auditores]]
- [[04-diario/2026-05-21|2026-05-21 — search + detail + issues + perfil + tab bar + README]]

## Revisões

- _(vazio — primeiro weekly review será criado pelo `vault-curator` ao fim da semana corrente)_

## Outros

- [[99-glossario|Glossário]]
