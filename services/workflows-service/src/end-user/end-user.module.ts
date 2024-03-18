import { Module } from '@nestjs/common';
import { EndUserControllerExternal } from './end-user.controller.external';
import { EndUserControllerInternal } from './end-user.controller.internal';
import { EndUserRepository } from './end-user.repository';
import { EndUserService } from './end-user.service';
import { FilterService } from '@/filter/filter.service';
import { FilterRepository } from '@/filter/filter.repository';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { BusinessRepository } from '@/business/business.repository';
import { StorageService } from '@/storage/storage.service';
import { FileService } from '@/providers/file/file.service';
import { FileRepository } from '@/storage/storage.repository';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { EntityRepository } from '@/common/entity/entity.repository';
import { ProjectModule } from '@/project/project.module';
import { CustomerModule } from '@/customer/customer.module';
import { UserService } from '@/user/user.service';
import { UserRepository } from '@/user/user.repository';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { PasswordService } from '@/auth/password/password.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { HttpModule } from '@nestjs/axios';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { BusinessService } from '@/business/business.service';

@Module({
  imports: [ProjectModule, CustomerModule, HttpModule],
  controllers: [EndUserControllerInternal, EndUserControllerExternal],
  providers: [
    EndUserRepository,
    EntityRepository,
    EndUserService,
    FilterService,
    FilterRepository,
    FileRepository,
    FileService,
    StorageService,
    WorkflowEventEmitterService,
    BusinessRepository,
    BusinessService,
    WorkflowDefinitionRepository,
    WorkflowRuntimeDataRepository,
    WorkflowService,
    UserService,
    UserRepository,
    PasswordService,
    SalesforceService,
    SalesforceIntegrationRepository,
    WorkflowTokenService,
    WorkflowTokenRepository,
    UiDefinitionRepository,
    UiDefinitionService,
  ],
})
export class EndUserModule {}
