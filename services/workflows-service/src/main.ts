import passport from 'passport';
import cookieSession from 'cookie-session';
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
import { NextFunction, Request, Response } from 'express';
import { PrismaClientValidationFilter } from '@/common/filters/prisma-client-validation-filter/PrismaClientValidation.filter';

// This line is used to improve Sentry's stack traces
// https://docs.sentry.io/platforms/node/typescript/#changing-events-frames
global.__rootdir__ = __dirname || process.cwd();

const corsOrigins =
  env.NODE_ENV === 'production'
    ? [env.BACKOFFICE_CORS_ORIGIN, /\.ballerine\.app$/]
    : [
        env.BACKOFFICE_CORS_ORIGIN,
        env.HEADLESS_EXAMPLE_CORS_ORIGIN,
        /\.ballerine\.dev$/,
        /\.ballerine\.app$/,
      ];

async function main() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });

  app.use(helmet());
  app.use(
    cookieSession({
      name: 'session',
      keys: [env.SESSION_SECRET],
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 1, // 1 hour(s)
    }),
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.session) return next();

    req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
    next();
  });

  // register regenerate & save after the cookieSession middleware initialization
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.session && !req.session.regenerate) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      req.session.regenerate = (cb: Function) => {
        cb();
      };
    }
    if (req.session && !req.session.save) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      req.session.save = (cb: Function) => {
        cb();
      };
    }
    next();
  });
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
  app.useGlobalFilters(new PrismaClientValidationFilter());

  app.enableShutdownHooks();

  void app.listen(env.PORT);
  console.log(`Listening on port ${env.PORT}`);

  return app;
}

module.exports = main();
