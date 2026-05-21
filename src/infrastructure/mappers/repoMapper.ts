import type { Repo } from '@domain/entities/Repo';
import type { Owner } from '@domain/entities/Owner';
import { repoId, ownerId } from '@domain/types';
import type {
  GitHubApiRepo,
  GitHubApiOwner,
} from '@infrastructure/repositories/types/githubApiTypes';

/**
 * Mappers do GitHub para o domain.
 *
 * São funções puras e síncronas: recebem o payload bruto da API (em
 * `snake_case`, com tudo que o GitHub manda) e devolvem a entidade do
 * domain (em `camelCase`, com branded IDs e só os campos que o app usa).
 *
 * Esses mappers são o ÚNICO lugar do código que conhece o nome dos
 * campos da API. Qualquer renomeação ou mudança de shape começa aqui.
 */

export function mapOwner(api: GitHubApiOwner): Owner {
  return {
    id: ownerId(api.id),
    login: api.login,
    avatarUrl: api.avatar_url,
  };
}

export function mapRepo(api: GitHubApiRepo): Repo {
  return {
    id: repoId(api.id),
    name: api.name,
    fullName: api.full_name,
    description: api.description,
    owner: mapOwner(api.owner),
    stars: api.stargazers_count,
    forks: api.forks_count,
    watchers: api.watchers_count,
    language: api.language,
  };
}
