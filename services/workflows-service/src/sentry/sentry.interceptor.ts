import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
  ContextType,
  HttpException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { catchError, throwError } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    // @TODO: Start a new transaction for each request

    return next.handle().pipe(
      catchError(exception => {
        Sentry.withScope(scope => {
          switch (context.getType<ContextType>()) {
            case 'http':
              this.captureHttpException(
                scope,
                context.switchToHttp().getRequest<Request>(),
                exception,
              );
          }
        });

        return throwError(exception);
      }),
    );
  }

  private captureHttpException(
    scope: Sentry.Scope,
    request: Request,
    exception: HttpException,
  ): void {
    // @TODO: Add more information to the scope

    if (request.user) {
      scope.setUser({ id: request.user.id });
    }

    Sentry.captureException(exception);
  }
}
