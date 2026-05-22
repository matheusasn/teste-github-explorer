import type { UserId } from '@domain/types';

export interface User {
  id: UserId;
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
}
