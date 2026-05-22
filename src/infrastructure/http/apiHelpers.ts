import { httpClient } from './httpClient';

// Wrapper enxuto sobre o axios.get — extrai `.data` e tipa o response via generic.
// Mantido só `apiGet` porque o app é read-only (sem POST/PATCH/DELETE).
export async function apiGet<TResponse>(
  url: string,
  params?: Record<string, unknown>,
): Promise<TResponse> {
  const { data } = await httpClient.get<TResponse>(url, { params });
  return data;
}
