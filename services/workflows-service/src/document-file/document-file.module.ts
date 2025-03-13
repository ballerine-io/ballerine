import { Module } from '@nestjs/common';
import { DocumentFileService } from './document-file.service';
import { DocumentFileRepository } from './document-file.repository';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectScopeService } from '@/project/project-scope.service';

@Module({
  imports: [PrismaModule],
  providers: [DocumentFileService, DocumentFileRepository, ProjectScopeService],
  exports: [DocumentFileService],
})
export class DocumentFileModule {}
