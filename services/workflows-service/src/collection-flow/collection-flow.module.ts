import { PasswordService } from '@/auth/password/password.service';
import { BusinessRepository } from '@/business/business.repository';
import { BusinessService } from '@/business/business.service';
import { ColectionFlowController } from '@/collection-flow/controllers/collection-flow.controller';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { WorkflowAdapterManager } from '@/collection-flow/workflow-adapter.manager';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { EntityRepository } from '@/common/entity/entity.repository';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { FilterRepository } from '@/filter/filter.repository';
import { FilterService } from '@/filter/filter.service';
import { ProjectModule } from '@/project/project.module';
import { FileService } from '@/providers/file/file.service';
import { FileRepository } from '@/storage/storage.repository';
import { StorageService } from '@/storage/storage.service';
import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';
import { HookCallbackHandlerService } from '@/workflow/hook-callback-handler.service';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CustomerModule } from '@/customer/customer.module';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { UiDefinitionModule } from '@/ui-definition/ui-definition.module';
import { TokenAuthModule } from '@/common/guards/token-guard/token-auth.module';
import { CollectionFlowFilesController } from '@/collection-flow/controllers/collection-flow.files.controller';
import { CollectionFlowBusinessController } from '@/collection-flow/controllers/collection-flow.business.controller';
import { CustomerService } from '@/customer/customer.service';
import { CustomerRepository } from '@/customer/customer.repository';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { CollectionFlowEndUserController } from '@/collection-flow/controllers/collection-flow.end-user.controller';
import { TranslationService } from '@/providers/translation/translation.service';

@Module({
  imports: [
    AppLoggerModule,
    HttpModule,
    ProjectModule,
    CustomerModule,
    TokenAuthModule,
    UiDefinitionModule,
  ],
  controllers: [
    ColectionFlowController,
    CollectionFlowFilesController,
    CollectionFlowBusinessController,
    CollectionFlowEndUserController,
  ],
  providers: [
    TranslationService,
    CollectionFlowService,
    EndUserService,
    EndUserRepository,
    WorkflowRuntimeDataRepository,
    UiDefinitionService,
    WorkflowAdapterManager,
    WorkflowDefinitionRepository,
    BusinessRepository,
    BusinessService,
    EntityRepository,
    StorageService,
    FileRepository,
    WorkflowService,
    HookCallbackHandlerService,
    FileService,
    WorkflowEventEmitterService,
    FilterRepository,
    FilterService,
    UserService,
    UserRepository,
    PasswordService,
    CustomerService,
    CustomerRepository,
    StorageService,
    FileRepository,
    SalesforceService,
    SalesforceIntegrationRepository,
  ],
})
export class CollectionFlowModule {}
