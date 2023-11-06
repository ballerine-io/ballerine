import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { AppModule } from './app.module';
import { swaggerDocumentOptions, swaggerPath, swaggerSetupOptions } from './swagger';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - there is an issue with helemet types
import { env } from '@/env';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { json, NextFunction, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';
import { ClsMiddleware } from 'nestjs-cls';
import { WinstonLogger } from './common/utils/winston-logger/winston-logger';

// This line is used to improve Sentry's stack traces
// https://docs.sentry.io/platforms/node/typescript/#changing-events-frames
global.__rootdir__ = __dirname || process.cwd();

const corsOrigins =
  env.ENVIRONMENT_NAME === 'production'
    ? [
        env.BACKOFFICE_CORS_ORIGIN,
        env.WORKFLOW_DASHBOARD_CORS_ORIGIN,
        env.KYB_EXAMPLE_CORS_ORIGIN,
        /\.ballerine\.app$/,
      ]
    : [
        env.WORKFLOW_DASHBOARD_CORS_ORIGIN,
        env.KYB_EXAMPLE_CORS_ORIGIN,
        /\.ballerine\.dev$/,
        /\.ballerine\.app$/,
        /\.ballerine\.io$/,
        /^http:\/\/localhost:\d+$/,
      ];

async function main() {
  const logger = new WinstonLogger();
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    logger,
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });

  const configService = app.get(ConfigService);

  app.useLogger(logger);
  app.use(new ClsMiddleware({}).use);

  if (configService.get('SENTRY_DSN')) {
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
  }

  app.use(helmet());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.use(
    cookieSession({
      name: 'session',
      keys: [env.SESSION_SECRET],
      httpOnly: env.ENVIRONMENT_NAME === 'production',
      secure: false,
      sameSite: env.ENVIRONMENT_NAME === 'production' ? 'strict' : false,
      maxAge: 1000 * 60 * 60 * 1, // 1 hour(s),
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

  app.enableShutdownHooks();

  const port = configService.getOrThrow<string>('PORT');
  void app.listen(+port);

  logger.log(`Listening on port ${port}`);

  return app;
}

module.exports = main();
