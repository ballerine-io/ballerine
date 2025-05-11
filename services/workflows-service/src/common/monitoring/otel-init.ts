import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { env } from '@/env';

let sdk: NodeSDK | null = null;
let meterProvider: MeterProvider | null = null;

export function initializeOpenTelemetry() {
  if (sdk) {
    return { sdk, meterProvider };
  }

  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'ballerine-workflows-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: env.ENVIRONMENT_NAME || 'local',
  });

  const traceExporter = new OTLPTraceExporter({
    url: env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  });

  sdk = new NodeSDK({
    resource,
    spanProcessor: new BatchSpanProcessor(traceExporter),
  });

  sdk.start();

  meterProvider = new MeterProvider({
    resource,
  });

  process.on('beforeExit', () => {
    sdk
      ?.shutdown()
      .then(() => console.log('OpenTelemetry SDK shut down successfully'))
      .catch(error => console.error('Error shutting down OpenTelemetry SDK', error));
  });

  return { sdk, meterProvider };
}

export function getMeterProvider(): MeterProvider | null {
  return meterProvider;
}
