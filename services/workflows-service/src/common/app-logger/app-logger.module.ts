import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { WinstonLogger } from '@/common/utils/winston-logger/winston-logger';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  exports: [AppLoggerService],
  providers: [
    { useClass: WinstonLogger, provide: 'LOGGER' },
    AppLoggerService,
    {
      provide: 'LOGGER_SETTINGS',
      useFactory: (config: ConfigService) => {
        return {
          logLevel: config.getOrThrow<string>('LOG_LEVEL'),
          envName: config.getOrThrow<string>('ENVIRONMENT_NAME'),
        };
      },
      inject: [ConfigService],
    },
  ],
  imports: [ConfigModule],
})
export class AppLoggerModule {}
