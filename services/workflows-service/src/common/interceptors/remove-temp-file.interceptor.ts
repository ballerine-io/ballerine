import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, catchError, firstValueFrom, of, tap } from 'rxjs';
import * as fs from 'fs';

@Injectable()
export class RemoveTempFileInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}
  private async deleteTempFile(req: any) {
    if (req?.file?.path) {
      const filePath = req.file.path;
      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        this.logger.error(`Error deleting file`, err as object);
      }
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async () => {
        // This block executes for successful responses
        const req = context.switchToHttp().getRequest();
        await this.deleteTempFile(req);
      }),
      catchError(async error => {
        // This block executes for errors
        const req = context.switchToHttp().getRequest();
        await this.deleteTempFile(req);
        // Handle error from the response
        return error;
      }),
    );
  }
}
