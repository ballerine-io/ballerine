import { forwardRef, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentRepository } from './document.repository';
import { DocumentControllerExternal } from './document.controller.external';
import { PrismaModule } from '@/prisma/prisma.module';
import { DocumentFileModule } from '@/document-file/document-file.module';
import { FileModule } from '@/providers/file/file.module';
// eslint-disable-next-line import/no-cycle
import { WorkflowModule } from '@/workflow/workflow.module';
import { UiDefinitionModule } from '@/ui-definition/ui-definition.module';
import { WorkflowDefinitionModule } from '@/workflow-defintion/workflow-definition.module';
import { ProjectScopeService } from '@/project/project-scope.service';
import { CollectionFlowUtilityModule } from '@/collection-flow/services/сollection-flow-utility/collection-flow-utility.module';

@Module({
  imports: [
    PrismaModule,
    DocumentFileModule,
    FileModule,
    forwardRef(() => WorkflowModule),
    UiDefinitionModule,
    WorkflowDefinitionModule,
    CollectionFlowUtilityModule,
  ],
  controllers: [DocumentControllerExternal],
  providers: [DocumentService, DocumentRepository, ProjectScopeService],
  exports: [DocumentService, DocumentRepository],
})
export class DocumentModule {}
