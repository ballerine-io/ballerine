import { Module } from '@nestjs/common';
import { NotionService } from '@/integrations/notion/notion.module';

@Module({
  imports: [],
  controllers: [],
  providers: [NotionService],
})
export class NotionModule {}
