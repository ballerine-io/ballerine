import { NestFactory } from '@nestjs/core';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ClsMiddleware } from 'nestjs-cls';
import { WorkerAppModule } from '@/worker-app.module';

const workerMain = async () => {
  const app = await NestFactory.create(WorkerAppModule, {
    bufferLogs: true,
    snapshot: true,
  });

  const logger = app.get(AppLoggerService);

  app.useLogger(logger);
  app.use(new ClsMiddleware({}).use);
  logger.log('Worker started');

  return app;
};

module.exports = workerMain();
