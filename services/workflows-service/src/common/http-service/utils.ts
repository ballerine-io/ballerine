import { HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import { AxiosError, AxiosInstance, isAxiosError } from 'axios';
import { removeSensitiveHeaders } from '../utils/request-response/request';

const __httpStatusFromAxiosMap = {
  ENOTFOUND: HttpStatus.NOT_FOUND,
  ECONNABORTED: HttpStatus.INTERNAL_SERVER_ERROR,
  ERR_CANCELED: HttpStatus.INTERNAL_SERVER_ERROR, // connection canceled
  ERR_NETWORK: HttpStatus.INTERNAL_SERVER_ERROR, // connection problems
} as const;

export const getLightweightAxiosError = (error: AxiosError) => {
  const { config } = error; // request + response can be extraced from error

  return {
    message: error.message,
    code: error.code,
    stack: error.stack,
    status: error?.response?.status,
    config: {
      method: config?.method?.toUpperCase(),
      url: config?.url,
      timeout: config?.timeout,
    },
  };
};

export const getHttpStatusFromAxiosError = (
  code?: keyof typeof __httpStatusFromAxiosMap | string,
) => {
  if (!code || !(code in __httpStatusFromAxiosMap)) {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  // @ts-ignore
  return __httpStatusFromAxiosMap[code];
};

export const handleAxiosError = (error: AxiosError) => {
  if (!isAxiosError(error)) {
    throw error;
  }

  const lightweightError = getLightweightAxiosError(error);

  throw new HttpException(lightweightError, getHttpStatusFromAxiosError(lightweightError.code), {
    cause: error.cause,
  });
};

export const interceptAxiosRequests = (
  logger: LoggerService,
  client: AxiosInstance,
  component: string,
) => {
  client.interceptors.request.use(config => {
    logger.debug?.('Axios outgoing request interceptor', {
      component,
      headers: removeSensitiveHeaders(config.headers),
      url: config.url,
      method: config.method?.toUpperCase(),
    });

    return config;
  });

  client.interceptors.response.use(response => {
    if (Buffer.isBuffer(response.data) || response.headers['Content-Type'] !== 'application/json') {
      return response;
    }

    logger.debug?.('Axios outgoing response interceptor', {
      component,
      data: response.data,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      // TODO: should we add also response's headers?
    });

    return response;
  });
};
