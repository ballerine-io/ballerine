import {
  SEMRESATTRS_SERVICE_VERSION,
  SEMRESATTRS_SERVICE_NAME,
} from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { trace } from '@opentelemetry/api';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { dockerCGroupV1Detector } from '@opentelemetry/resource-detector-docker';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { version } from '../../package.json';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { AwsInstrumentation } from '@opentelemetry/instrumentation-aws-sdk';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PrismaInstrumentation } from '@prisma/instrumentation';

const traceExporter = new OTLPTraceExporter();

export const getTracer = () => {
  return trace.getTracer('default');
};

export const tracingSdk = new opentelemetry.NodeSDK({
  traceExporter,
  textMapPropagator: new B3Propagator(),
  resourceDetectors: [dockerCGroupV1Detector],
  resource: Resource.default().merge(
    new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'wf-service',
      [SEMRESATTRS_SERVICE_VERSION]: version,
    }),
  ),
  spanProcessors: [
    new opentelemetry.tracing.BatchSpanProcessor(traceExporter, {
      maxExportBatchSize: 1000,
      maxQueueSize: 1000,
    }),
    new opentelemetry.tracing.SimpleSpanProcessor(new opentelemetry.tracing.ConsoleSpanExporter()),
  ],
  instrumentations: [
    new HttpInstrumentation(),
    new WinstonInstrumentation(),
    new NestInstrumentation({ enabled: false }),
    new AwsInstrumentation(),
    new PrismaInstrumentation({ middleware: true }),
    new ExpressInstrumentation({
      requestHook: (span: any, reqInfo: any) => {
        span.setAttribute('request-headers', reqInfo.request.headers);
      },
    }),
  ],
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  tracingSdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error: unknown) => logger.error('Error terminating tracing', error));
});
