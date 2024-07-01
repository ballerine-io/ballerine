import { AlertModule } from '@/alert/alert.module';
import { PasswordService } from '@/auth/password/password.service';
import { BusinessReportModule } from '@/business-report/business-report.module';
import { BusinessRepository } from '@/business/business.repository';
import { BusinessService } from '@/business/business.service';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { CollectionFlowBusinessController } from '@/collection-flow/controllers/collection-flow.business.controller';
import { ColectionFlowController } from '@/collection-flow/controllers/collection-flow.controller';
import { CollectionFlowEndUserController } from '@/collection-flow/controllers/collection-flow.end-user.controller';
import { CollectionFlowFilesController } from '@/collection-flow/controllers/collection-flow.files.controller';
import { WorkflowAdapterManager } from '@/collection-flow/workflow-adapter.manager';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { EntityRepository } from '@/common/entity/entity.repository';
import { TokenAuthModule } from '@/common/guards/token-guard/token-auth.module';
import { CustomerModule } from '@/customer/customer.module';
import { CustomerRepository } from '@/customer/customer.repository';
import { CustomerService } from '@/customer/customer.service';
import { DataAnalyticsModule } from '@/data-analytics/data-analytics.module';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { FilterRepository } from '@/filter/filter.repository';
import { FilterService } from '@/filter/filter.service';
import { ProjectModule } from '@/project/project.module';
import { FileService } from '@/providers/file/file.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { FileRepository } from '@/storage/storage.repository';
import { StorageService } from '@/storage/storage.service';
import { UiDefinitionModule } from '@/ui-definition/ui-definition.module';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { HookCallbackHandlerService } from '@/workflow/hook-callback-handler.service';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    AppLoggerModule,
    HttpModule,
    ProjectModule,
    CustomerModule,
    TokenAuthModule,
    UiDefinitionModule,
    BusinessReportModule,
    AlertModule,
    DataAnalyticsModule,
  ],
  controllers: [
    ColectionFlowController,
    CollectionFlowFilesController,
    CollectionFlowBusinessController,
    CollectionFlowEndUserController,
  ],
  providers: [
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
