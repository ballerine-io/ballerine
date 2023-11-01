import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { IncomingMessage } from 'http';

export function createFilter(filters: RegExp[] | string) {
  let f: RegExp[];
  if (typeof filters === 'string') {
    f = filters.split(',').map(r => new RegExp(r));
  } else {
    f = filters;
  }

  return (url: string) => {
    return f.some(reg => {
      return url.match(reg);
    });
  };
}

export class IgnoreByUrlHttpInstrumentation extends HttpInstrumentation {
  constructor(excludeUrls: RegExp[] | string = []) {
    const urlsFilter = createFilter(excludeUrls);
    super({
      ignoreOutgoingRequestHook: () => true,
      ignoreIncomingRequestHook: (request: IncomingMessage) => {
        if (!request.url) return false;

        return urlsFilter(request.url);
      },
    });
  }
}
