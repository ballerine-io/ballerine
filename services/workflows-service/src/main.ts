import '@total-typescript/ts-reset';

import passport from 'passport';
import dayjs from 'dayjs';
import cookieSession from 'cookie-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - there is an issue with helmet types
import helmet from 'helmet';
import { env } from '@/env';
import { json, NextFunction, Request, Response, urlencoded } from 'express';
import { ClsMiddleware } from 'nestjs-cls';
import * as Sentry from '@sentry/node';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from './common/app-logger/app-logger.service';
import { exceptionValidationFactory } from './errors';
import swagger from '@/swagger/swagger';
import { applyFormats, patchNestJsSwagger } from 'ballerine-nestjs-typebox';

// provide swagger OpenAPI generator support
patchNestJsSwagger();

// provide custom JSON schema string format support
// currently only "email".
applyFormats();

// This line is used to improve Sentry's stack traces
// https://docs.sentry.io/platforms/node/typescript/#changing-events-frames
global.__rootdir__ = __dirname || process.cwd();

const devOrigins = [
  /\.ballerine\.dev$/,
  /\.ballerine\.io$/,
  /^http:\/\/localhost:\d+$/,
  'api-dev.eu.ballerine.io',
  'api-dev.ballerine.io',
];

const corsOrigins = [
  ...env.BACKOFFICE_CORS_ORIGIN,
  ...env.WORKFLOW_DASHBOARD_CORS_ORIGIN,
  ...env.KYB_EXAMPLE_CORS_ORIGIN,
  ...(env.KYC_EXAMPLE_CORS_ORIGIN ?? []),
  'api-sb.eu.ballerine.app',
  'api-sb.ballerine.app',
  /\.ballerine\.app$/,
  ...(env.ENVIRONMENT_NAME !== 'production' ? devOrigins : []),
];

const main = async () => {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, //will be buffered until a custom logger is attached
    snapshot: true,
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });

  const logger = app.get(AppLoggerService);
  const configService = app.get(ConfigService);

  app.useLogger(logger);
  app.use(new ClsMiddleware({}).use);

  if (configService.get('SENTRY_DSN')) {
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
  }

  app.use(
    helmet({
      hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
      },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: [
            "'self'",
            'https://api-dev.ballerine.io',
            'https://api-sb.ballerine.app',
            'https://api-sb.eu.ballerine.app',
            'https://api-dev.eu.ballerine.io',
          ],
        },
      },
    }),
  );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.use(
    cookieSession({
      name: 'session',
      keys: [env.SESSION_SECRET],
      httpOnly: env.ENVIRONMENT_NAME === 'production',
      secure: false,
      sameSite: env.ENVIRONMENT_NAME === 'production' ? 'strict' : false,
      maxAge: 1000 * 60 * env.SESSION_EXPIRATION_IN_MINUTES,
    }),
  );

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

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (
      !req.session ||
      !req.session?.passport?.user?.expires ||
      new Date(req.session.passport.user.expires) < new Date()
    ) {
      return next();
    }

    req.session.nowInMinutes = Math.floor(dayjs().unix() / 60);
    req.session.passport.user.expires = dayjs()
      .add(env.SESSION_EXPIRATION_IN_MINUTES, 'minute')
      .toDate();

    next();
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: exceptionValidationFactory,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  swagger.initialize(app);

  app.enableShutdownHooks();

  const port = configService.getOrThrow<string>('PORT');
  void app.listen(+port);

  logger.log(`Listening on port ${port}`);

  return app;
};

module.exports = main();
