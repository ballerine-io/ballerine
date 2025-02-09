import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentRepository } from './document.repository';
import { DocumentControllerExternal } from './document.controller.external';
import { PrismaModule } from '@/prisma/prisma.module';
import { DocumentFileModule } from '@/document-file/document-file.module';
import { FileModule } from '@/providers/file/file.module';
import { WorkflowModule } from '@/workflow/workflow.module';

@Module({
  imports: [PrismaModule, DocumentFileModule, FileModule, WorkflowModule],
  controllers: [DocumentControllerExternal],
  providers: [DocumentService, DocumentRepository],
  exports: [DocumentService],
})
export class DocumentModule {}
