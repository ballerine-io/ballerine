import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';
import type { Request } from 'express';
import { SentryService } from '@/sentry/sentry.service';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(private readonly sentryService: SentryService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError(error => {
        switch (context.getType<ContextType>()) {
          case 'http':
            this.sentryService.captureHttpException(
              error,
              context.switchToHttp().getRequest<Request>(),
            );
        }

        return throwError(() => error);
      }),
    );
  }
}
