# ADR 006 — Theme custom (sem Restyle ou outra lib de tema)

- **Status:** aceita
- **Data:** 2026-05-20
- **Tags:** #presentation #theme #design-system

## Contexto

PDF (seção 6.3) cita literal "Preferir `ThemeProvider` + hook `useTheme`". Opções de implementação:

1. **Restyle (Shopify)** — lib popular RN com Box/Text componentizados e tema tipado
2. **styled-components** — CSS-in-JS clássico
3. **Custom (Context puro)** — `createContext + useTheme`, sem dep externa

## Opções consideradas

1. Restyle:
   - Pros: tipagem rica, componentes tipo `<Box bg="primary" />`, comunidade
   - Cons: dep externa, "Box hell" nas screens, lock-in à API da lib
2. styled-components:
   - Pros: familiar pra quem vem do web, suporte a animações
   - Cons: dep externa, custo de runtime (parsing), CSS-in-JS pode ser overkill
3. Custom:
   - Pros: zero dep, controle total, ~120 linhas resolvem
   - Cons: precisa implementar manualmente o que lib faria

## Decisão

Opção 3 — Custom. `ThemeProvider` com Context guardando `mode` ('system'/'light'/'dark') + tokens (colors, spacing, radius, typography). Hook `useTheme()` retorna tudo tipado.

```ts
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }) {
  const systemMode = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');
  const mode = preference === 'system' ? (systemMode === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo(() => ({ mode, colors, spacing, radius, typography, setPreference }), [mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
```

Suporta 3 modos (Automático/Claro/Escuro) — mais rico que toggle simples.

## Consequências

**Boas:**

- Zero dep externa pra theming
- Domínio claro do mecanismo (Context + useColorScheme)
- Modo "system" automático
- ~120 linhas no total (Theme + tokens)

**Ruins:**

- Componentes que usam tema precisam chamar `useTheme()` manualmente (Restyle teria `<Box />` com prop `bg="primary"`)
- Sem auto-binding via prop string ("primary" → colors.primary)

## Onde está no código

- `src/presentation/theme/tokens.ts`
- `src/presentation/theme/ThemeContext.tsx`
- Consumido em todos os componentes do DS via `useTheme()`
