import * as api from '@opentelemetry/api';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  NodeTracerProvider,
} from '@opentelemetry/sdk-trace-node';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { IgnoreByUrlHttpInstrumentation } from './http-instrumentation';
import { DnsInstrumentation } from '@opentelemetry/instrumentation-dns';
import { NetInstrumentation } from '@opentelemetry/instrumentation-net';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';

const contextManager = new AsyncHooksContextManager();
contextManager.enable();
api.context.setGlobalContextManager(contextManager);

const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'workflow-service',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
      process.env.ENVIRONMENT_NAME || process.env.NODE_ENV,
  }),
);

// Configure the trace provider
const provider = new NodeTracerProvider({
  resource,
});

// Configure how spans are processed and exported. In this case we're sending spans
// as we receive them to an OTLP-compatible collector (e.g. Jaeger).
// provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

// Register your auto-instrumentors
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [
    new DnsInstrumentation(),
    new NetInstrumentation(),
    new NestInstrumentation(),
    new IgnoreByUrlHttpInstrumentation([/favicon.ico/, /__vite_ping/, /health/]),
    new PrismaInstrumentation({
      enabled: true,
    }),
  ],
});

// Register the provider globally
provider.register();
