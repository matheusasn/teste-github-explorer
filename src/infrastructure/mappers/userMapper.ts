import type { User } from '@domain/entities/User';
import { userId } from '@domain/types';
import type { GitHubApiUser } from '@infrastructure/repositories/types/githubApiTypes';

export function mapUser(api: GitHubApiUser): User {
  return {
    id: userId(api.id),
    login: api.login,
    name: api.name,
    avatarUrl: api.avatar_url,
    bio: api.bio,
    location: api.location,
    htmlUrl: api.html_url,
    publicRepos: api.public_repos,
    followers: api.followers,
    following: api.following,
  };
}
