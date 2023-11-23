import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';
import type { Response } from 'express';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();

        this.logger.log(`Outgoing response`, {
          response: {
            statusCode: response.statusCode,
          },
          responseTime: Date.now() - response.req.startTime,
        });
      }),
    );
  }
}
