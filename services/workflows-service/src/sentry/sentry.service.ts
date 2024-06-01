import api from '@opentelemetry/api';
import { ClsService } from 'nestjs-cls';
import { HttpException, Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import type { Request } from 'express';

@Injectable()
export class SentryService {
  constructor(private readonly cls: ClsService) {}

  public captureException(error: Error | string): void {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);

      this._setExtraData(scope);

      this._setLevel(error, scope);

      this._setUser(scope);

      error instanceof Error ? Sentry.captureException(error) : Sentry.captureMessage(error);
    });
  }

  public captureHttpException(error: Error | string, request?: Request): void {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);

      this._setExtraData(scope, request);

      this._setLevel(error, scope);

      this._setUser(scope, request);

      error instanceof Error ? Sentry.captureException(error) : Sentry.captureMessage(error);
    });
  }

  private _setLevel(error: Error | string, scope: Sentry.Scope) {
    if (error instanceof HttpException) {
      const statusCode = error.getStatus();
      scope.setLevel(statusCode < 500 ? 'warning' : 'error');
    }
  }

  private _setExtraData(scope: Sentry.Scope, request?: Request) {
    let traceId = this.cls.get('traceId');
    if (!traceId) {
      const activeSpan = api.trace.getSpan(api.context.active());
      traceId = activeSpan?.spanContext().traceId;
    }

    scope.setExtra('traceId', traceId ?? 'N/A');
    scope.setExtra('assigneeId', this.cls.get('assigneeId'));
    scope.setExtra('workflowId', this.cls.get('workflowId'));

    if (request) {
      const { method, url, body } = request;

      scope.setExtra('origin', url);
      scope.setExtra('body', body);
      scope.setExtra('action', method);
    }
  }

  private _setUser(scope: Sentry.Scope, request?: Request) {
    let user = this.cls.get('entity');

    if (!user && request) {
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
