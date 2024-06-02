import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { IncomingMessage } from 'node:http';

const createFilter = (filters: RegExp[] | string[]) => {
  let f: RegExp[];
  const regexExpressions = filters.map(r => {
    if (typeof r === 'string') {
      return new RegExp(r);
    }
    return r;
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
