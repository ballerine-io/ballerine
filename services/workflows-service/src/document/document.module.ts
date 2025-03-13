import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentRepository } from './document.repository';
import { DocumentControllerExternal } from './document.controller.external';
import { PrismaModule } from '@/prisma/prisma.module';
import { DocumentFileModule } from '@/document-file/document-file.module';
import { FileModule } from '@/providers/file/file.module';
import { WorkflowModule } from '@/workflow/workflow.module';
import { UiDefinitionModule } from '@/ui-definition/ui-definition.module';
import { WorkflowDefinitionModule } from '@/workflow-defintion/workflow-definition.module';
import { ProjectScopeService } from '@/project/project-scope.service';

@Module({
  imports: [
    PrismaModule,
    DocumentFileModule,
    FileModule,
    WorkflowModule,
    UiDefinitionModule,
    WorkflowDefinitionModule,
  ],
  controllers: [DocumentControllerExternal],
  providers: [DocumentService, DocumentRepository, ProjectScopeService],
  exports: [DocumentService],
})
export class DocumentModule {}
