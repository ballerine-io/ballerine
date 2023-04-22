import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    return next.handle().pipe(
      tap(response => {
        const latency = `${Date.now() - now}ms`;
        response.latency = latency;
        Logger.log(`${method} ${url} ${latency}`);
      }),
    );
  }
}
