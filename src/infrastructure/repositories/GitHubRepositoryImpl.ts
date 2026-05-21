import type { IGitHubRepository, PaginatedResult } from '@domain/repositories/IGitHubRepository';
import type { Repo } from '@domain/entities/Repo';
import type { Issue } from '@domain/entities/Issue';
import { apiGet } from '@infrastructure/http/apiHelpers';
import { translateHttpError } from '@infrastructure/http/errorTranslator';
import { mapRepo } from '@infrastructure/mappers/repoMapper';
import { mapIssue } from '@infrastructure/mappers/issueMapper';
import type { GitHubApiIssue, GitHubApiRepo, GitHubSearchResponse } from './types/githubApiTypes';

/**
 * Tamanho fixo de cada página de resultado. Não exponho como parâmetro
 * pra manter o contrato do domain limpo (`page`, sem `per_page`).
 * Se um dia precisar variar, viraria config do Repository.
 */
const PER_PAGE = 20;

/**
 * Implementação concreta do `IGitHubRepository` falando com a REST API
 * do GitHub via `apiGet`. Cada método segue o mesmo padrão:
 *  1. Chama o endpoint, tipando a resposta como o shape bruto da API.
 *  2. Mapeia pro domain via `mapRepo` / `mapIssue`.
 *  3. Se qualquer erro escapa, `translateHttpError` traduz pra erro
 *     tipado do domain (nunca propaga `AxiosError` pra fora daqui).
 *
 * `hasNextPage` é inferido por convenção: se a página voltou com EXATAMENTE
 * `PER_PAGE` items, presumo que tem próxima. Pode disparar uma chamada
 * "vazia" no fim, aceitável pelo custo/benefício.
 */
export class GitHubRepositoryImpl implements IGitHubRepository {
  async searchRepos(query: string, page: number): Promise<PaginatedResult<Repo>> {
    try {
      const data = await apiGet<GitHubSearchResponse>('/search/repositories', {
        q: query,
        sort: 'stars',
        order: 'desc',
        page,
        per_page: PER_PAGE,
      });

      return {
        items: data.items.map(mapRepo),
        hasNextPage: data.items.length === PER_PAGE,
        totalCount: data.total_count,
      };
    } catch (error) {
      translateHttpError(error);
    }
  }

  async getRepoDetails(owner: string, repoName: string): Promise<Repo> {
    try {
      const data = await apiGet<GitHubApiRepo>(`/repos/${owner}/${repoName}`);
      return mapRepo(data);
    } catch (error) {
      translateHttpError(error);
    }
  }

  async getRepoIssues(
    owner: string,
    repoName: string,
    page: number,
  ): Promise<PaginatedResult<Issue>> {
    try {
      const data = await apiGet<GitHubApiIssue[]>(`/repos/${owner}/${repoName}/issues`, {
        state: 'open',
        page,
        per_page: PER_PAGE,
      });

      return {
        items: data.map(mapIssue),
        hasNextPage: data.length === PER_PAGE,
      };
    } catch (error) {
      translateHttpError(error);
    }
  }
}
