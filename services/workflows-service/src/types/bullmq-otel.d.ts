declare module 'bullmq-otel' {
  import type { Tracer } from '@opentelemetry/api';

  /**
   * Minimal type declaration for BullMQ OpenTelemetry integration.
   * Only includes the constructor used by the application. Extend if needed.
   */
  export class BullMQOtel {
    constructor(serviceName?: string, tracer?: Tracer);
  }
} 