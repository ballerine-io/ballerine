import { Module } from '@nestjs/common';
import { TranslationService } from '@/providers/translation/translation.service';

@Module({
  controllers: [],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
