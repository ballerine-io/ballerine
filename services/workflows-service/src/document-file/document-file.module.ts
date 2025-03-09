import { Module } from '@nestjs/common';
import { DocumentFileService } from './document-file.service';
import { DocumentFileRepository } from './document-file.repository';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DocumentFileService, DocumentFileRepository],
  exports: [DocumentFileService],
})
export class DocumentFileModule {}
