import type { Issue } from '@domain/entities/Issue';
import type { Label } from '@domain/entities/Label';
import { issueId, issueNumber, labelId } from '@domain/types';
import type {
  GitHubApiIssue,
  GitHubApiLabel,
} from '@infrastructure/repositories/types/githubApiTypes';
import { mapOwner } from './repoMapper';

export function mapLabel(api: GitHubApiLabel): Label {
  return {
    id: labelId(api.id),
    name: api.name,
    color: api.color,
  };
}

/**
 * Mapeia uma issue da API GitHub pra entidade do domain.
 *
 * Conversões notáveis:
 * - `user` (API) → `author` (domain): mais semântico no contexto de issue,
 *   já que a API usa `user` genericamente em vários endpoints.
 * - `created_at` (snake_case) → `createdAt`. Mantemos como string ISO —
 *   o consumidor (UI) parseia quando precisar formatar.
 */
export function mapIssue(api: GitHubApiIssue): Issue {
  return {
    id: issueId(api.id),
    number: issueNumber(api.number),
    title: api.title,
    author: mapOwner(api.user),
    labels: api.labels.map(mapLabel),
    createdAt: api.created_at,
    state: api.state,
  };
}
