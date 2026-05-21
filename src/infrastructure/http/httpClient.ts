import { create } from 'axios';

const BASE_URL = 'https://api.github.com';

/**
 * Versão da REST API do GitHub. O GitHub versiona por data — fixar essa
 * versão protege o app de breaking changes em releases futuros da API.
 * Quando uma nova versão sair, atualizamos aqui de forma controlada.
 * Ref: https://docs.github.com/en/rest/overview/api-versions
 */
const GITHUB_API_VERSION = '2022-11-28';

const REQUEST_TIMEOUT_MS = 10_000;

const GITHUB_TOKEN = process.env.EXPO_PUBLIC_GITHUB_TOKEN;

/**
 * Instância única do axios configurada pra API do GitHub.
 *
 * - `baseURL` evita repetir o host em cada chamada.
 * - `Accept` e `X-GitHub-Api-Version` seguem o que o GitHub recomenda.
 * - Token opcional via `.env`. Se não houver, vamos no rate-limit
 *   anônimo (60 req/hora) — suficiente pra dev.
 * - Timeout defensivo pra requisições não pendurarem o app.
 */
export const httpClient = create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  },
  timeout: REQUEST_TIMEOUT_MS,
});
