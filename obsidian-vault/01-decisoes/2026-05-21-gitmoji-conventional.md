# ADR 009 — Gitmoji + Conventional Commits

- **Status:** aceita
- **Data:** 2026-05-21
- **Tags:** #git #commits #workflow

## Contexto

Dimensão "README & Commits" do PDF exige "commits pequenos e descritivos". Padrões mais usados:

1. **Conventional Commits puro** (`feat(scope): desc`) — padrão da indústria, integra com semantic-release
2. **Gitmoji puro** (`✨ desc`) — visual, mais open source friendly
3. **Tim Pope clássico** (Pro Git) — natural mas sem prefixo padronizado
4. **Free-form** — sem padrão, "fix login" "wip" — descartado de saída, não dá pra automatizar nada em cima disso

## Opções consideradas

1. Conventional puro:
   - Pros: padrão dominante, validável via commitlint
   - Cons: pode ficar "robotizado" se 100% rigoroso
2. Gitmoji puro:
   - Pros: visual, scanning rápido
   - Cons: perde estrutura do Conventional (changelog automático)
3. **Híbrido Gitmoji + Conventional** + variabilidade humana:
   - Pros: melhor dos dois mundos + mostra senso crítico (não é só seguir spec religiosamente)

## Decisão

Híbrido Gitmoji + Conventional, em PT-BR, com **variabilidade deliberada**:

- Maioria: `🔧 chore(git): adiciona husky` — emoji + conventional + scope
- Algumas exceções: `setup do projeto expo sdk 55 + typescript + lint` — sem prefixo, soltinho
- Primeiro commit deliberadamente sem prefixo — narrativa "comecei rápido, disciplinei depois"

Customizei o parser do `commitlint` pra aceitar emoji opcional **antes** do tipo:

```js
parserOpts: {
  headerPattern: /^(?:(\S+)\s+)?(\w+)(?:\(([^)]+)\))?(!?):\s+(.+)$/u,
  headerCorrespondence: ['emoji', 'type', 'scope', 'breaking', 'subject'],
}
```

## Consequências

**Boas:**

- Histórico visualmente rico (scanning rápido por emoji)
- Estrutura conventional preservada — permite changelog automático futuro
- Sinaliza senso crítico (não é só "Conventional rigoroso porque alguém disse")
- Primeiro commit sem prefixo conta história orgânica de evolução

**Ruins:**

- Emojis quebram em terminais antigos / e-mail texto puro
- Custom parser do commitlint precisa de manutenção se evoluir o padrão

## Onde está no código

- `commitlint.config.js` (parser custom)
- `.husky/commit-msg` (valida toda mensagem)
- Histórico: `git log --oneline`
