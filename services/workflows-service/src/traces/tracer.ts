import { trace } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { AwsInstrumentation } from '@opentelemetry/instrumentation-aws-sdk';
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express';
// import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { awsEksDetector } from '@opentelemetry/resource-detector-aws';
import { dockerCGroupV1Detector } from '@opentelemetry/resource-detector-docker';
import { Resource, detectResourcesSync } from '@opentelemetry/resources';
import * as opentelemetry from '@opentelemetry/sdk-node';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { version } from '../../package.json';
import { BallerineHttpInstrumentation } from './http-intrumentation';
import { env } from '@/env';

const traceExporter = new OTLPTraceExporter();

export const getTracer = () => {
  return trace.getTracer('default');
};

const processor =
  env.ENVIRONMENT_NAME === 'local'
    ? new opentelemetry.tracing.SimpleSpanProcessor(new opentelemetry.tracing.ConsoleSpanExporter())
    : new opentelemetry.tracing.BatchSpanProcessor(traceExporter, {
        maxExportBatchSize: 512,
        maxQueueSize: 2048,
      });

export const tracingSdk = new opentelemetry.NodeSDK({
  traceExporter,
  textMapPropagator: new B3Propagator(),
  sampler: new opentelemetry.tracing.ParentBasedSampler({
    root: new opentelemetry.tracing.TraceIdRatioBasedSampler(0.5), // Sample 50% of traces
  }),
  resource: detectResourcesSync({
    detectors: [awsEksDetector, dockerCGroupV1Detector],
  }).merge(
    Resource.default().merge(
      new Resource({
        [SEMRESATTRS_SERVICE_NAME]: 'wf-service',
        [SEMRESATTRS_SERVICE_VERSION]: version,
      }),
    ),
  ),
  spanProcessors: [processor],
  instrumentations: [
    new BallerineHttpInstrumentation({
      excludeUrls: [/(api\/v\d\/_health).*/g, /favicon.ico/g],
    }),
    new WinstonInstrumentation(),
    new AwsInstrumentation(),
    new PrismaInstrumentation({ middleware: true }),
    new ExpressInstrumentation({
      ignoreLayersType: [ExpressLayerType.REQUEST_HANDLER, ExpressLayerType.MIDDLEWARE],
    }),
  ],
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  tracingSdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error: unknown) => console.error('Error terminating tracing', error));
});
