import { isAxiosError } from 'axios';
import {
  RateLimitError,
  NetworkError,
  NotFoundError,
  UnknownApiError,
} from '@domain/errors/GitHubErrors';

/**
 * Traduz qualquer erro lançado por `axios` em um erro tipado do domain.
 *
 * Esse é o ponto de Anti-Corruption Layer pra transporte HTTP:
 * - Quem chama (Repository → use case → hook) nunca vê `AxiosError`.
 * - Só vê os 4 kinds do domain: rate-limit, network, not-found, unknown.
 * - Se o erro NÃO for de axios (ex.: erro de programação), re-lança
 *   intacto pra subir até o ErrorBoundary global.
 *
 * Mapeamento:
 * - sem `response` (timeout, sem rede) → NetworkError
 * - status 403 ou 429              → RateLimitError (rate limit do GitHub)
 * - status 404                     → NotFoundError
 * - qualquer outro status          → UnknownApiError(status)
 */
export function translateHttpError(error: unknown): never {
  if (isAxiosError(error)) {
    if (!error.response) throw new NetworkError();

    const status = error.response.status;
    if (status === 403 || status === 429) throw new RateLimitError();
    if (status === 404) throw new NotFoundError();

    throw new UnknownApiError(status);
  }

  throw error;
}
