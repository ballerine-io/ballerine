import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { AxiosError, isAxiosError } from 'axios';
import { catchError, tap, throwError } from 'rxjs';
import { handleAxiosError } from '../http-service/utils';

@Injectable()
export class AxiosRequestErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest();
        req.startTime = new Date().getTime();
      }),
      catchError((error: AxiosError) => {
        // Translate axios http error
        if (isAxiosError(error)) {
          return throwError(() => {
            try {
              handleAxiosError(error);
            } catch (err) {
              return err;
            }
          });
        }

        return throwError(() => error);
      }),
    );
  }
}
