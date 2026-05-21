import { httpClient } from './httpClient';

/**
 * Helper enxuto pra GET requests.
 *
 * Inspirado no padrão `api.helpers.ts` que adoto no meuguru-guruia-app,
 * onde tenho variantes pra cada verbo HTTP (`APIGet`, `APIPost`, `APIPatch`...).
 * Aqui mantive só `apiGet` porque o app é read-only — adicionar mutations
 * sem ninguém consumir seria código morto (YAGNI).
 *
 * O helper extrai `.data` do `AxiosResponse` automaticamente e centraliza
 * a tipagem do response via generic.
 */
export async function apiGet<TResponse>(
  url: string,
  params?: Record<string, unknown>,
): Promise<TResponse> {
  const { data } = await httpClient.get<TResponse>(url, { params });
  return data;
}
