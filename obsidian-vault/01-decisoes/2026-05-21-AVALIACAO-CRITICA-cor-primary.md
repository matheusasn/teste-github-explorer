# ⚠️ Avaliação crítica — Cor primary vs cor de ação

- **Status:** identificada via revisão retroativa, fix proposto **não aplicado** (registrado pra discussão)
- **Data:** 2026-05-21
- **Tags:** #design-system #identidade-visual #autocritica #decisao-ruim

## Contexto

Durante o setup do tema, escolhi o token `colors.primary` como **verde** (`#1f883d` — verde do logo do GitHub, "Octocat green"). Justificativa na hora: paleta GitHub-flavored, coerência com o domínio.

Mais tarde, ao construir Tab Bar (Bloco 9) e Badges (Bloco 4), usei `colors.info` (azul `#0969da` — azul de links do GitHub) como cor de **ação**:

- `tabBarActiveTintColor: colors.info`
- Badge "linguagem" no `RepoCard` com tone `'info'`
- Botão "Abrir no GitHub" no perfil herda `secondary` (borda + texto neutro)
- `Button variant="primary"` usa **verde** (`colors.primary`)

## O problema que isso cria

O app tem **duas cores competindo pelo papel de "cor de destaque"**:

| Onde aparece                  | Cor usada       |
| ----------------------------- | --------------- |
| Botão Primary do DS           | verde `#1f883d` |
| Tab ativa                     | azul `#0969da`  |
| Badge "linguagem" do repo     | azul `#0969da`  |
| Checkmark da tela "Aparência" | azul `#0969da`  |
| Spinner de loading            | verde `#1f883d` |

**Inconsistência de identidade visual.** Usuário não tem dica clara de "qual é a cor que o app valoriza". Em apps reais o GitHub Mobile usa **azul** como cor de destaque (links, ações, navegação ativa). O verde fica reservado pra ações específicas (criar PR, fazer merge — coisas de **escrita**).

Como o app é **read-only**, o verde "Octocat" do `primary` fica **órfão** — não tem ação criativa onde caiba naturalmente.

## Como descobri

Essa avaliação só apareceu **graças ao processo de documentar as decisões nesse vault**. Quando fui registrar o ADR 006 (theme custom) e ADR 010 (perfil), revisei os usos da paleta e bateu: verde primary não está sendo usado pra nada "primário" no app — está fazendo o trabalho de azul info na maior parte do contexto.

## Opções pra corrigir

1. **Trocar `primary` pra azul** (`#0969da`) e mover o verde Octocat pra `colors.success` (que hoje é `#1a7f37`). App ganha identidade azul coesa.
2. **Manter `primary` verde** mas **trocar `tabBarActiveTintColor` pra `colors.primary`** e mudar Badges de linguagem pra `tone="neutral"`. App ganha identidade verde coesa.
3. **Deixar como está** — assumir o "GitHub Mobile mistura" e documentar.

## Decisão atual

**Não aplicar fix agora** — risco de quebrar testes visuais e introduzir bug à última hora num projeto que já está estabilizado. Mas **registrar a observação** no README na seção "o que faria diferente" e neste ADR, deixando o senso crítico documentado.

Se este fosse um projeto de produção com janela mais larga, aplicaria a Opção 1 (azul como primary) — o GitHub Mobile faz isso e funciona melhor pra apps read-heavy.

## Onde está no código

- Paleta: `src/presentation/theme/tokens.ts` (`primary`, `info`, `success`)
- Uso conflitante: `src/presentation/navigation/RootNavigator.tsx` (tab bar), `src/presentation/features/search/components/RepoCard.tsx` (badge), `src/presentation/components/ds/Button.tsx` (variant primary)
