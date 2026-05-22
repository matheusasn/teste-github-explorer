# Pergunta — "Como construir um Design System que impeça inconsistência nas telas sem depender de code review?"

- **Data:** 2026-05-20
- **Tags:** #estrategia #design-system #api-design

## Contexto

PDF (seção 6.3) cita três restrições explícitas para o Design System:

- Evitar componentes não tipados
- Evitar liberdade de personalização por instância via `style` solto
- Preferir props controladas (`variant`, `size`, `tone`) em vez de estilos livres

Sem essas restrições enforçadas pela API dos componentes, screens podem fazer `<Text style={{ color: '#1f883d' }}>` em vez de `<Text color="primary">`. Cor hardcoded espalha; quando o tema muda, screens não atualizam.

## Por que essa pergunta foi central

Design System só funciona se ele **impede** o uso incorreto, não se ele **convence** o dev a usar corretamente. Documentação que diz "não use `style` inline" é violada na primeira sprint apertada.

A pergunta certa antes de desenhar a API dos componentes é: _"como tipar os props de forma que `style` inline seja impossível em compile-time, mas variants permitidas continuem ergonômicas?"_

## Alternativas analisadas

### 1. Permitir `style` opcional em todos os componentes

```tsx
<Text style={{ fontSize: 18, color: 'red' }}>...</Text>
```

**Problema:** screens passam cores e tamanhos arbitrários. Tokens viram opcionais. Tema light/dark não propaga.

### 2. Documentar "não use style" em CONTRIBUTING.md

Sem enforcement, fica como aviso. Code review depende de revisor atento.

### 3. `Omit<TextProps, 'style'>` na assinatura do componente — escolhida

A API do componente **remove** a prop `style` da interface herdada do React Native. Compilador rejeita uso direto.

```tsx
interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?: TypographyVariant; // display | title | heading | body | caption | label
  color?: TextColor; // text | textMuted | textInverse | primary | danger | success | info
  align?: 'left' | 'center' | 'right';
}
```

Tentativa de uso inválido:

```tsx
<Text style={{ color: 'red' }}>...</Text>
// ❌ TS2322: Type '{ style: ... }' is not assignable to type 'TextProps'.
//          Object literal may only specify known properties, and 'style' does not exist in type 'TextProps'.
```

Uso correto:

```tsx
<Text variant="heading" color="primary">
  ...
</Text>
```

Mesma técnica aplicada em `Button`, `Input`, `Card`, `Badge`, `Avatar`, `Skeleton`. Componentes do DS controlam **internamente** o estilo via `useTheme()`.

## Resposta adotada

API dos componentes via `Omit<NativeProps, 'style'>` + props enumerados (`variant`, `size`, `tone`). Tokens centralizados em `src/presentation/theme/tokens.ts`. Componentes consomem `useTheme()` para resolver tokens em estilo concreto.

Padrões referenciados:

- **Constrained API**: técnica de tornar API impossível de usar errado (concept popularizado por Scott Wlaschin em _Domain Modeling Made Functional_, 2018)
- **PDF seção 6.3**: restrições explícitas alinhadas ao princípio

## Impacto no projeto

- **`src/presentation/components/ds/Text.tsx`** com `Omit<RNTextProps, 'style'>` — `style` inline rejeitado em compile-time
- **`src/presentation/components/ds/Input.tsx`** com `Omit<TextInputProps, 'style' | 'placeholderTextColor'>` — mesmo princípio extendido
- **Restantes 5 componentes do DS** seguem a mesma constraint
- Screens consomem só via `variant`/`color`/`size`/`tone`
- Trocar tema light↔dark propaga automaticamente — nenhuma cor hardcoded em screen para "ficar para trás"

A restrição na API tornou impossível introduzir inconsistência visual sem **deliberadamente** quebrar tipos. Code review humano não precisa procurar `style={` em pull requests.

## Decisões relacionadas

- [[01-decisoes/2026-05-20-theme-custom-sem-restyle|ADR 006 — Theme custom sem lib]]
