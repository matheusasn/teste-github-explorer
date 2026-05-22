/**
 * Tipos que espelham o payload bruto da REST API do GitHub.
 *
 * Mantemos esses tipos isolados do domain de propósito:
 * - A API usa `snake_case` (`full_name`, `stargazers_count`); domain usa
 *   `camelCase`. O mapper traduz no boundary.
 * - Se o GitHub mudar o shape (raro com `X-GitHub-Api-Version` fixado, mas
 *   possível), só esses tipos e os mappers mudam — o resto do app continua.
 * - Listamos somente os campos que realmente consumimos (YAGNI). Adicionar
 *   campo novo só quando uma feature precisar.
 */

export interface GitHubApiOwner {
  id: number;
  login: string;
  avatar_url: string;
}

export interface GitHubApiLabel {
  id: number;
  name: string;
  color: string;
}

export interface GitHubApiRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  owner: GitHubApiOwner;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
}

export interface GitHubApiIssue {
  id: number;
  number: number;
  title: string;
  user: GitHubApiOwner;
  labels: GitHubApiLabel[];
  created_at: string;
  state: 'open' | 'closed';
}

/**
 * Shape da resposta de `GET /search/repositories`. Note que ela envelopa
 * a lista em `items`, junto com o `total_count`. Outros endpoints (como
 * `/repos/.../issues`) devolvem a lista direto, sem envelope.
 */
export interface GitHubSearchResponse {
  total_count: number;
  items: GitHubApiRepo[];
}

export interface GitHubApiUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}
