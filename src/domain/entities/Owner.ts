import type { OwnerId } from '@domain/types';

export interface Owner {
  id: OwnerId;
  login: string;
  avatarUrl: string;
}
