import { Injectable, NestMiddleware } from '@nestjs/common';
import { getTraceId } from './tracing-utils';
import * as opentelemetry from '@opentelemetry/api';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.url.includes('health')) {
      // TODO: add live/rediness
      return next();
    }

    const span = opentelemetry.trace.getActiveSpan();
    if (span && span.spanContext()) {
      const traceId = getTraceId(span);
      res.setHeader('x-trace-id', traceId);
    }
    return next();
  }
}
