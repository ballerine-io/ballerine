import { HttpException, HttpStatus } from '@nestjs/common';
import axios, { isAxiosError } from 'axios';

const _httpStatusFromAxiosMap = {
  ENOTFOUND: HttpStatus.NOT_FOUND,
  ECONNABORTED: HttpStatus.INTERNAL_SERVER_ERROR,
  ERR_CANCELED: HttpStatus.INTERNAL_SERVER_ERROR, // connection canceled
  ERR_NETWORK: HttpStatus.INTERNAL_SERVER_ERROR, // connection problems
};

export function getLightweightAxiosError(error: axios.AxiosError) {
  const { config } = error; // request + response can be extraced from error

  return {
    message: error.message,
    code: error.code,
    stack: error.stack,
    status: error?.response?.status,
    config: {
      method: config?.method,
      url: config?.url,
      timeout: config?.timeout,
    },
  };
}

export const getHttpStatusFromAxiosError = (
  code?: keyof typeof _httpStatusFromAxiosMap | string,
) => {
  if (!code || !(code in _httpStatusFromAxiosMap)) {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  // @ts-ignore
  return _httpStatusFromAxiosMap[code];
};

export function handleAxiosError(error: axios.AxiosError) {
  if (!isAxiosError(error)) {
    throw error;
  }

  const lightweightError = getLightweightAxiosError(error);

  throw new HttpException(lightweightError, getHttpStatusFromAxiosError(lightweightError.code), {
    cause: error.cause,
  });
}
