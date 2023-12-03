import { ClsService } from 'nestjs-cls';
import {
  CallHandler,
  ContextType,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { catchError, throwError } from 'rxjs';
import type { Request } from 'express';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError(error => {
        Sentry.withScope(scope => {
          switch (context.getType<ContextType>()) {
            case 'http':
              this.captureHttpException(scope, context.switchToHttp().getRequest<Request>(), error);
          }
        });

        return throwError(() => error);
      }),
    );
  }

  private captureHttpException(
    scope: Sentry.Scope,
    request: Request,
    error: HttpException | string,
  ): void {
    this._setExtraData(scope, request);

    this._setLevel(error, scope);

    this._setUser(request, scope);

    typeof error === 'string' ? Sentry.captureMessage(error) : Sentry.captureException(error);
  }

  private _setLevel(error: string | HttpException, scope: Sentry.Scope) {
    if (error instanceof HttpException) {
      const statusCode = error.getStatus();
      scope.setLevel(statusCode < 500 ? 'warning' : 'error');
    }
  }

  private _setExtraData(scope: Sentry.Scope, request: Request) {
    scope.setExtra('reqId', this.cls.get('requestId'));
    scope.setExtra('assigneeId', this.cls.get('assigneeId'));
    scope.setExtra('workflowId', this.cls.get('workflowId'));

    if (request) {
      const { method, url, body } = request;

      scope.setExtra('origin', url);
      scope.setExtra('body', body);
      scope.setExtra('action', method);
    }
  }

  private _setUser(request: Request, scope: Sentry.Scope) {
    let user = this.cls.get('entity');

    if (!user) {
      if (request.user) {
        user = request.user;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((request as any).tokenScope) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user = (request as any).tokenScope;
      }
    }

    if (user) {
      scope.setUser(user);
    }
  }
}
