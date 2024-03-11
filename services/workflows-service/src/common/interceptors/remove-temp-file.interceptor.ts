import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import * as fs from 'fs';
import type { Request } from 'express';

@Injectable()
export class RemoveTempFileInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}
  private deleteTempFile(req: Request) {
    const filePath = req?.file?.path;

    if (filePath) {
      try {
        // Your logic to handle deletion (for example, using fs.unlink)
        fs.unlink(filePath, err => {
          if (err) {
            this.logger.error('Error deleting file:', err);
          }
        });
      } catch (err) {
        this.logger.error(`Error deleting file`, err as object);
      }
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        // This block executes for successful responses
        const req = context.switchToHttp().getRequest();

        return this.deleteTempFile(req);
      }),
      catchError(error => {
        const req = context.switchToHttp().getRequest();

        this.deleteTempFile(req);

        return throwError(() => error);
      }),
    );
  }
}
