import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { IncomingMessage } from 'node:http';

const createFilter = (filters: RegExp[] | string[]) => {
  const regexExpressions = filters.map(regex => {
    if (typeof regex === 'string') {
      return new RegExp(regex);
    }

    return regex;
  });

  return (url: string) => {
    return regexExpressions.some(reg => {
      return url.match(reg);
    });
  };
};

export class BallerineHttpInstrumentation extends HttpInstrumentation {
  constructor({ excludeUrls }: { excludeUrls: string[] | RegExp[] } = { excludeUrls: [] }) {
    const urlsFilter = createFilter(excludeUrls);
    super({
      ignoreOutgoingRequestHook: () => true,
      ignoreIncomingRequestHook: (request: IncomingMessage) => {
        if (!request.url) return false;

        return urlsFilter(request.url);
      },
      requestHook: undefined,
    });
  }
}
