import passport from 'passport';
import session from 'express-session';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@/common/filters/HttpExceptions.filter';
import { AppModule } from './app.module';
import { swaggerDocumentOptions, swaggerPath, swaggerSetupOptions } from './swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - there is an issue with helemet types
import helmet from 'helmet';
import { env } from '@/env';
import { AllExceptionsFilter } from '@/common/filters/AllExceptions.filter';
import { WsAdapter } from '@nestjs/platform-ws';

// This line is used to improve Sentry's stack traces
// https://docs.sentry.io/platforms/node/typescript/#changing-events-frames
global.__rootdir__ = __dirname || process.cwd();

async function main() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    cors: {
      origin: [env.BACKOFFICE_CORS_ORIGIN, env.HEADLESS_EXAMPLE_CORS_ORIGIN],
      credentials: true,
    },
  });

  app.use(helmet());
  app.use(
    session({
      name: 'session',
      secret: env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        domain: env.NODE_ENV === 'production' ? '.ballerine.app' : undefined,
        secure: env.NODE_ENV === 'production',
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
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);

  app.useWebSocketAdapter(new WsAdapter(app));
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
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  app.enableShutdownHooks();

  void app.listen(env.PORT);
  console.log(`Listening on port ${env.PORT}`);

  return app;
}

module.exports = main();
