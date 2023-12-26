import path from 'path';
import * as HealhConsts from '@/health/consts';
import { Request } from 'express';

const _IGNORE_URL_PATH = [
  path.join(HealhConsts.CONTROLLER_NAME, HealhConsts.ROUTES.LIVE),
  path.join(HealhConsts.CONTROLLER_NAME, HealhConsts.ROUTES.READY),
];

export const isRelevantRequest = (url: string) => {
  const pathOnlyWithoutVersion: string = url.replace(/\/api\/v\d+\//, '');

  return !_IGNORE_URL_PATH.some(ignorePath => pathOnlyWithoutVersion.startsWith(ignorePath));
};
export const removeSensitiveHeaders = (headers: Record<string, unknown>) => ({
  headers: { ...headers, authorization: undefined, cookie: undefined },
});

export const getReqMetadataObj = (req: Request<unknown>) => {
  const cleanHeaders = removeSensitiveHeaders(req.headers);

  return {
    startTime: req.startTime ? new Date(req.startTime)?.toISOString() : new Date().toISOString(),
    'X-Request-ID': req.id,
    query: req.query,
    params: req.params,
    url: req.originalUrl,
    method: req.method,
    headers: cleanHeaders,
  };
};
