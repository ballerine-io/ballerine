import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';
import { Response } from 'express';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();

        this.logger.log(`Outgoing response`, {
          request: {
            id: response.req.id,
          },
          response: {
            statusCode: response.statusCode,
          },
          responseTime: Date.now() - response.req.startTime,
        });
      }),
    );
  }
}
