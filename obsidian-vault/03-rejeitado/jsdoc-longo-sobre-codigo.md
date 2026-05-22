# Rejeitado — JSDoc longo descrevendo o que o código faz

- **Data:** 2026-05-21
- **Tags:** #rejeitado #code-quality #comentarios

## O que era

Bloco JSDoc longo em arquivos do design system e do repository, descrevendo a função em narrativa: o que ela é, qual a regra de composição, qual escolha foi feita entre alternativas.

Exemplos do estado anterior:

- `Text` — "Componente base de texto. `variant` define typography. `color` aceita só nomes da paleta. `style` é proibido."
- `Card` — "Card unificado: se receber `onPress`, vira `Pressable`; senão, `View` estático. Evita ter `Card` e `PressableCard` separados."
- `Badge` — "Componentes do DS controlam o que tá dentro deles" (justificando uso de `RNText`).

## Por que recusei

Comentário tem dois custos: ocupa espaço de leitura e **mente quando o código muda**. Justifica-se apenas quando carrega informação que o código sozinho não consegue transmitir:

- Workaround pra bug externo
- Invariante escondida no domínio
- Restrição de framework não-óbvia
- Armadilha que vai pegar quem editar depois

Os JSDocs removidos não atendiam nenhum desses critérios. Eram descrição do que o código já dizia (nome do componente, tipo das props, lógica do `if`).

Decisão de design ("Card unificado em vez de `Card` + `PressableCard`") pertence a ADR, não a comentário inline. ADR sobrevive a refactor; comentário inline morre com o arquivo.

## O que fiz no lugar

Comentário **curto** e **só onde o porquê não é óbvio**:

```ts
// Reanimated 4 usa o plugin do worklets — DEVE ser o último plugin da lista.
```

```ts
// Não exponho per_page no contrato do domain; viraria config do Repository se precisar variar.
```

```ts
// Fallback em cascata: image → iniciais → "?"
```

Sem `*` block. Uma linha. Foco em armadilha pro futuro leitor, não em descrição do código.

## Critério aplicado

Se removendo o comentário ninguém perde informação, o comentário é ruído. Mantive a heurística do [[../00-contexto/meu-perfil-tecnico|perfil técnico]]: _"código fala o quê, comentário fala o porquê não-óbvio"_.

## Trade-off aceito

Quem abre o arquivo pela primeira vez não tem narrativa explicativa nas primeiras linhas. Tem que ler o código. O preço foi consciente — narrativa de decisão fica em ADR ([[../01-decisoes/2026-05-20-feature-sliced-presentation|005]], [[../01-decisoes/2026-05-21-api-get-helper|010]]) e no [[../00-contexto/decisoes-iniciais|documento de decisões iniciais]].
