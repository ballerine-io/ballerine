import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/HttpExceptions.filter';
import { AppModule } from './app.module';
import { swaggerDocumentOptions, swaggerPath, swaggerSetupOptions } from './swagger';
import { ValidationPipe } from '@nestjs/common';
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - there is an issue with helemet types
import helmet from 'helmet';
import cookieSession from 'cookie-session';
import * as process from 'process';

const { PORT = 3000 } = process.env;

async function main() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    cors: {
      origin: process.env.CORS_ORIGIN!,
      credentials: true,
    },
  });

  app.use(helmet());
  app.use(
    cookieSession({
      name: 'session',
      httpOnly: true,
      keys: [process.env.JWT_SECRET_KEY!],
      domain: process.env.NODE_ENV === 'production' ? '.example.com' : undefined,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 1),
      maxAge: 1000 * 60 * 60 * 1,
    }),
  );
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

  void app.listen(PORT);
  console.log(`Listening on port ${PORT.toString()}`);

  return app;
}

module.exports = main();
