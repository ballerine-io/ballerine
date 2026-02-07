import { Module } from '@nestjs/common';
import { RedisService, redisProvider } from './redis.service';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';

@Module({
  imports: [AppLoggerModule],
  providers: [RedisService, redisProvider],
  exports: [RedisService, redisProvider],
})
export class RedisModule {}
