import type { Owner } from './Owner';
import type { RepoId } from '@domain/types';

export interface Repo {
  id: RepoId;
  name: string;
  fullName: string;
  description: string | null;
  owner: Owner;
  stars: number;
  forks: number;
  watchers: number;
  language: string | null;
}
