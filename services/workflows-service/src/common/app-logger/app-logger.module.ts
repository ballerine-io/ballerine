import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { WinstonLogger } from '@/common/utils/winston-logger/winston-logger';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [{ useClass: WinstonLogger, provide: 'LOGGER' }, AppLoggerService],
  exports: [AppLoggerService],
})
export class AppLoggerModule {}
