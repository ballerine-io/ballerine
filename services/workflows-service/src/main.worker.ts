import { NestFactory } from '@nestjs/core';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ClsMiddleware } from 'nestjs-cls';
import { WorkerAppModule } from './app.worker.module';
import { ConfigService } from '@nestjs/config';

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

  const port = configService.getOrThrow<string>('PORT');
  void app.listen(+port);

  logger.log(`Listening on port ${port}`);

  logger.log('Worker started');

  return app;
};

module.exports = workerMain();
