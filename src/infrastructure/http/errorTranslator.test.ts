import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { translateHttpError } from './errorTranslator';
import {
  RateLimitError,
  NetworkError,
  NotFoundError,
  UnknownApiError,
} from '@domain/errors/GitHubErrors';

function makeAxiosError(opts: { status?: number; withResponse?: boolean } = {}): AxiosError {
  const { status, withResponse = true } = opts;
  const err = new AxiosError('boom');

  if (withResponse && status !== undefined) {
    const response: AxiosResponse = {
      status,
      statusText: '',
      data: null,
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
    };
    err.response = response;
  }

  return err;
}

describe('translateHttpError', () => {
  it('traduz erro sem response (timeout/sem rede) pra NetworkError', () => {
    const err = makeAxiosError({ withResponse: false });

    expect(() => translateHttpError(err)).toThrow(NetworkError);
  });

  it('traduz status 403 pra RateLimitError', () => {
    expect(() => translateHttpError(makeAxiosError({ status: 403 }))).toThrow(RateLimitError);
  });

  it('traduz status 429 pra RateLimitError', () => {
    expect(() => translateHttpError(makeAxiosError({ status: 429 }))).toThrow(RateLimitError);
  });

  it('traduz status 404 pra NotFoundError', () => {
    expect(() => translateHttpError(makeAxiosError({ status: 404 }))).toThrow(NotFoundError);
  });

  it('traduz qualquer outro status pra UnknownApiError preservando o número', () => {
    let captured: unknown;
    try {
      translateHttpError(makeAxiosError({ status: 502 }));
    } catch (e) {
      captured = e;
    }
    expect(captured).toBeInstanceOf(UnknownApiError);
    expect((captured as UnknownApiError).status).toBe(502);
  });

  it('re-lança intacto erros que não são de axios', () => {
    const plainError = new Error('algo de cliente');

    expect(() => translateHttpError(plainError)).toThrow(plainError);
  });

  it('re-lança valores não-Error (string, null, etc)', () => {
    expect(() => translateHttpError('boom')).toThrow();
    expect(() => translateHttpError(null)).toThrow();
  });
});
