import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogRequestInterceptor.name);

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
