import { NestFactory } from '@nestjs/core';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ClsMiddleware } from 'nestjs-cls';
import { WorkerAppModule } from './app.worker.module';
import { ConfigService } from '@nestjs/config';
import {
  getEnvWebhookSharedSecret,
  isPlaceholderWebhookSharedSecret,
} from '@/events/resolve-webhook-shared-secret';

const workerMain = async () => {
  const app = await NestFactory.create(WorkerAppModule, {
    bufferLogs: true,
    snapshot: true,
  });

  const logger = app.get(AppLoggerService);

  app.useLogger(logger);
  app.use(new ClsMiddleware({}).use);

  app.enableShutdownHooks();

  const closeApp = async (signal: NodeJS.Signals) => {
    logger.log(`Received ${signal}. Gracefully shutting down worker...`);
    try {
      await app.close();
      logger.log('Worker shut down gracefully');
      process.exit(0);
    } catch (err) {
      logger.error('Error during graceful shutdown', { err });
      process.exit(1);
    }
  };

  process.once('SIGTERM', () => closeApp('SIGTERM'));
  process.once('SIGINT', () => closeApp('SIGINT'));
  const configService = app.get(ConfigService);

  const envWebhookSharedSecret = getEnvWebhookSharedSecret(configService);
  if (isPlaceholderWebhookSharedSecret(envWebhookSharedSecret)) {
    logger.error(
      'LOANCUBE_WEBHOOK_SECRET/BALLERINE_WEBHOOK_SECRET is missing or set to TODO_SET_ME. Outgoing webhooks may fail signature verification.',
      {
        environmentName: configService.get<string>('ENVIRONMENT_NAME'),
      },
    );
  }

  const port = configService.getOrThrow<string>('WORKER_PORT');
  void app.listen(+port);

  logger.log(`Listening on port ${port}`);

  logger.log('Worker started');

  return app;
};

module.exports = workerMain();
