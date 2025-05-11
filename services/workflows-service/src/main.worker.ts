import { NestFactory } from '@nestjs/core';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ClsMiddleware } from 'nestjs-cls';
import { WorkerAppModule } from './app.worker.module';

const workerMain = async () => {
  const app = await NestFactory.create(WorkerAppModule, {
    bufferLogs: true,
    snapshot: true,
  });

  const logger = app.get(AppLoggerService);

  app.useLogger(logger);
  app.use(new ClsMiddleware({}).use);

  // Ensure Nest application and BullMQ workers shutdown gracefully to avoid
  // losing in-flight jobs when the container/process receives a termination
  // signal (e.g. during Kubernetes rolling updates).
  app.enableShutdownHooks();

  const closeApp = async (signal: NodeJS.Signals) => {
    logger.log(`Received ${signal}. Gracefully shutting down worker...`);
    try {
      await app.close();
      logger.log('Worker shut down gracefully');
      // eslint-disable-next-line no-process-exit
      process.exit(0);
    } catch (err) {
      logger.error('Error during graceful shutdown', { err });
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
  };

  process.once('SIGTERM', () => closeApp('SIGTERM'));
  process.once('SIGINT', () => closeApp('SIGINT'));

  logger.log('Worker started');

  return app;
};

module.exports = workerMain();
