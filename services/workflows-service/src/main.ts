import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/HttpExceptions.filter';
import { AppModule } from './app.module';
import { swaggerPath, swaggerDocumentOptions, swaggerSetupOptions } from './swagger';
import { ValidationPipe } from '@nestjs/common';
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import helmet from 'helmet';
import { LoggerInterceptor } from './access-control/interceptors/logger.interceptor';

const { PORT = 3000 } = process.env;

async function main() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);

  /** check if there is Public decorator for each path (action) and its method (findMany / findOne) on each controller */
  Object.values(document.paths).forEach((path: PathItemObject) => {
    Object.values(path).forEach((method: { security: string[] | unknown }) => {
      if (Array.isArray(method.security) && method.security.includes('isPublic')) {
        method.security = [];
      }
    });
  });

  SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new LoggerInterceptor());

  void app.listen(PORT);
  console.log(`Listening on port ${PORT.toString()}`);

  return app;
}

module.exports = main();
