import { Module } from '@nestjs/common';
import { CaseFileService } from './case-file.service';
import { CaseFileController } from './case-file.controller';

@Module({
  controllers: [CaseFileController],
  providers: [CaseFileService],
})
export class CaseFileModule {}
