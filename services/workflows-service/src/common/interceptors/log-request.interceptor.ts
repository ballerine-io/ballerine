import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isAxiosError } from 'axios';
import { catchError, tap, throwError } from 'rxjs';

@Injectable()
export class AxiosRequestErrorInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest();
        req.startTime = new Date().getTime();
      }),
      catchError((exception: Error) => {
        // Translate axios http error
        if (isAxiosError(exception)) {
          const status =
            exception.response?.status || exception.code === 'ENOTFOUND'
              ? HttpStatus.NOT_FOUND
              : HttpStatus.INTERNAL_SERVER_ERROR;

          return throwError(
            () =>
              new HttpException(
                exception.code !== 'ENOTFOUND'
                  ? exception?.cause?.message ?? exception.message
                  : '',
                status,
              ),
          );
        }

        return throwError(() => exception);
      }),
    );
  }
}
