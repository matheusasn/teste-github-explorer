# Pergunta — "Como prevenir confusão entre IDs de tipos diferentes em compile-time?"

- **Data:** 2026-05-20
- **Tags:** #estrategia #typescript #type-safety

## Contexto

A API GitHub retorna `id` como `number` em quase todo recurso: `Repo`, `Issue`, `Owner`, `Label`, `User`. No domínio, esses IDs aparecem em assinaturas de função, parâmetros de hook e props de componentes.

TypeScript trata todos esses números como o mesmo tipo. Nada impede um dev — incluindo o futuro-eu daqui a três meses — de passar `issueId` onde a função espera `repoId`. O bug fica em runtime, frequentemente como "buscou o recurso errado e renderizou dados estranhos".

## Por que essa pergunta foi central

Esse tipo de bug é silencioso. Não quebra o build, não dispara erro de TypeScript, não falha no lint. Só aparece em produção como "o card da issue está mostrando dados de outro repositório".

A pergunta correta antes de modelar entities é: _"o que impede em compile-time que IDs do mesmo tipo primitivo sejam usados intercambiavelmente?"_

## Alternativas analisadas

### 1. Aceitar `number` puro

Zero código extra. Aceita o risco do bug de troca de IDs.

**Problema:** o bug é silencioso e o custo de detectá-lo em produção é desproporcional ao custo de preveni-lo.

### 2. Classe wrapper (`class RepoId { constructor(public value: number) {} }`)

Cada ID é um objeto. Type-safety total porque a classe é nominal.

**Problema:** custo de runtime (alocação por ID), serialização ruim (`JSON.stringify` precisa de `toJSON`), logs verbosos. Em listas grandes (100+ repos), milhares de alocações desnecessárias.

### 3. Branded types — escolhida

Padrão idiomático em TypeScript para tipagem nominal sobre primitivos. Marca o tipo no nível do sistema de tipos sem alterar o runtime.

```ts
type Brand<T, B> = T & { readonly __brand: B };

export type RepoId = Brand<number, 'RepoId'>;
export type IssueId = Brand<number, 'IssueId'>;
export type IssueNumber = Brand<number, 'IssueNumber'>;
export type LabelId = Brand<number, 'LabelId'>;
export type OwnerId = Brand<number, 'OwnerId'>;
export type UserId = Brand<number, 'UserId'>;

export const repoId = (n: number): RepoId => n as RepoId;
// ...helpers para cada brand
```

Mappers chamam o helper na fronteira (única ponte entre `number` cru da API e o branded type do domínio). Resto do código trata cada ID como tipo opaco.

```ts
function deleteRepo(id: RepoId): Promise<void> {
  /* ... */
}

const issue: Issue = {
  /* ... */
};
deleteRepo(issue.id); // ❌ compile error: IssueId is not assignable to RepoId
```

## Resposta adotada

Branded types em `src/domain/types.ts` para `RepoId`, `IssueId`, `IssueNumber`, `LabelId`, `OwnerId`, `UserId`. Helpers de construção (`repoId(n)`, `issueId(n)`, etc.) usados pelos mappers no boundary da API.

Referência: padrão amplamente discutido na comunidade TypeScript desde 2018; recomendado pelo TypeScript Handbook para tipos nominais sobre primitivos.

## Impacto no projeto

- **`src/domain/types.ts`** — definição central
- **`src/domain/entities/*.ts`** — todos os IDs usam branded types
- **`src/infrastructure/mappers/*.ts`** — única camada que chama os helpers (conversão `number` → branded)
- **Zero custo runtime** — tipos são apagados na compilação para JavaScript
- **Refactor de signature é safe** — trocar `RepoId` por `RepoSlug` força atualização em todos os calls sites em compile-time

## Decisões relacionadas

- [[01-decisoes/2026-05-20-branded-types|ADR 003 — Branded types nos IDs]]
