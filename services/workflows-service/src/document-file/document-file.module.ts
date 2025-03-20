import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectScopeService } from '@/project/project-scope.service';
import { Module } from '@nestjs/common';
import { DocumentFileRepository } from './document-file.repository';
import { DocumentFileService } from './document-file.service';

@Module({
  imports: [PrismaModule],
  providers: [DocumentFileService, DocumentFileRepository, ProjectScopeService],
  exports: [DocumentFileService],
})
export class DocumentFileModule {}
