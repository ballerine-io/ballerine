import { Module } from '@nestjs/common';
import { NotionService } from '@/notion/notion.service';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';

@Module({
  imports: [AppLoggerModule],
  providers: [NotionService],
  exports: [NotionService],
})
export class NotionModule {}
