/**
 * Tipos específicos para evitar misturar valores que têm o mesmo tipo base,
 * mas representam coisas diferentes no domínio.
 *
 * Exemplo: mesmo `IssueNumber` e `RepoId` sendo `number`, o TypeScript impede
 * que um seja usado no lugar do outro por engano.
 */
type Brand<T, B> = T & { readonly __brand: B };

export type RepoId = Brand<number, 'RepoId'>;
export type IssueId = Brand<number, 'IssueId'>;
export type IssueNumber = Brand<number, 'IssueNumber'>;
export type LabelId = Brand<number, 'LabelId'>;
export type OwnerId = Brand<number, 'OwnerId'>;

export const repoId = (n: number): RepoId => n as RepoId;
export const issueId = (n: number): IssueId => n as IssueId;
export const issueNumber = (n: number): IssueNumber => n as IssueNumber;
export const labelId = (n: number): LabelId => n as LabelId;
export const ownerId = (n: number): OwnerId => n as OwnerId;
