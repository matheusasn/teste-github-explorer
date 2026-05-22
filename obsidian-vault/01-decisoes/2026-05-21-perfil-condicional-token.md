# ADR 010 — Perfil condicional ao token

- **Status:** aceita
- **Data:** 2026-05-21
- **Tags:** #presentation #navigation #ux

## Contexto

PDF não pede tela de perfil. Quando adicionamos suporte ao `EXPO_PUBLIC_GITHUB_TOKEN`, surgiu a oportunidade de consumir o endpoint `/user` (retorna o usuário autenticado) e mostrar perfil.

Problema: sem login interativo, "Perfil" sem usuário é mentira UX.

## Opções consideradas

1. **Sempre mostrar tab Perfil** — se sem token, mostra empty state "configure o token". Mas tab aparece pro usuário antes dele ter conteúdo
2. **Esconder tab quando sem token** — só aparece se o token estiver configurado. App tem "modo anônimo" (2 tabs) e "modo autenticado" (3 tabs)
3. **Não ter tab Perfil** — Settings comporta link pra perfil

## Decisão

Opção 2 — tab condicional. No `RootNavigator`:

```ts
const HAS_TOKEN = !!process.env.EXPO_PUBLIC_GITHUB_TOKEN;

return (
  <Tab.Navigator>
    <Tab.Screen name="ExploreTab" component={ExploreNavigator} />
    {HAS_TOKEN && <Tab.Screen name="ProfileTab" component={ProfileNavigator} />}
    <Tab.Screen name="SettingsTab" component={SettingsNavigator} />
  </Tab.Navigator>
);
```

Se token configurado: 3 tabs (Explorar / Perfil / Ajustes).
Se sem token: 2 tabs (Explorar / Ajustes).

Tela de Perfil em si:

- Loading skeleton enquanto busca `/user`
- Se token inválido (401 → `UnauthorizedError`), mensagem específica "Token inválido"
- Sucesso: avatar, nome, login, bio, location, 3 stat cards (repos/seguidores/seguindo), botão "Abrir no GitHub"

## Consequências

**Boas:**

- UX honesta — sem prometer perfil sem ter
- Demonstra que arquitetura suporta autenticação
- Aproveita o token que aumenta rate limit pra UX adicional
- Token configurado vira recurso, não obrigação

**Ruins:**

- App tem 2 estruturas de tab dependendo do env — comportamento dinâmico
- Quem rodar sem token vê 2 tabs em vez de 3 — pode parecer faltar feature à primeira vista

Mitigação: README explica claramente o comportamento (`.env.example` indica que token habilita Perfil).

## Onde está no código

- `src/presentation/navigation/RootNavigator.tsx` (constante `HAS_TOKEN`)
- `src/presentation/features/profile/`
- `src/domain/entities/User.ts`
- `src/application/use-cases/GetAuthenticatedUserUseCase.ts`
- README na seção "Como rodar" explica o efeito do token
