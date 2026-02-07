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
<<<<<<< HEAD
import { CollectionFlowUtilityModule } from '@/collection-flow/services/сollection-flow-utility/collection-flow-utility.module';
=======
import { HttpModule } from '@nestjs/axios';
>>>>>>> 5dfa6587b (fix: fixed rendering of csv documents)

@Module({
  imports: [
    PrismaModule,
    DocumentFileModule,
    FileModule,
    forwardRef(() => WorkflowModule),
    UiDefinitionModule,
    WorkflowDefinitionModule,
<<<<<<< HEAD
    CollectionFlowUtilityModule,
=======
    HttpModule,
>>>>>>> 5dfa6587b (fix: fixed rendering of csv documents)
  ],
  controllers: [DocumentControllerExternal],
  providers: [DocumentService, DocumentRepository, ProjectScopeService],
  exports: [DocumentService, DocumentRepository],
})
export class DocumentModule {}
