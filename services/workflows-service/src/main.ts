import passport from 'passport';
import session from 'express-session';
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
import * as process from 'process';

const { PORT = 3000 } = process.env;
//
async function main() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    cors: {
      origin: [process.env.BACKOFFICE_CORS_ORIGIN!, process.env.HEADLESS_EXAMPLE_CORS_ORIGIN!],
      credentials: true,
    },
  });

  app.use(helmet());
  app.use(
    session({
      name: 'session',
      secret: process.env.SESSION_SECRET!,
      saveUninitialized: false,
      resave: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        domain: process.env.NODE_ENV === 'production' ? '.ballerine.app' : undefined,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 1, // 1 hour(s)
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
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
