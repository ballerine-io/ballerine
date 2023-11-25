import { PasswordService } from '@/auth/password/password.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { AppLoggerModule } from '@/common/app-logger/app-logger.module';
import { EntityRepository } from '@/common/entity/entity.repository';
import { CustomerModule } from '@/customer/customer.module';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { FilterRepository } from '@/filter/filter.repository';
import { FilterService } from '@/filter/filter.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { ProjectModule } from '@/project/project.module';
import { FileService } from '@/providers/file/file.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { FileRepository } from '@/storage/storage.repository';
import { StorageService } from '@/storage/storage.service';
import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';
import { WorkflowDefinitionRepository } from '@/workflow/workflow-definition.repository';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { Module } from '@nestjs/common';
import { initHttpMoudle } from './../common/http-service/http-config.service';
import { BusinessControllerExternal } from './business.controller.external';
import { BusinessControllerInternal } from './business.controller.internal';
import { BusinessRepository } from './business.repository';
import { BusinessService } from './business.service';

@Module({
  imports: [initHttpMoudle(), AppLoggerModule, ProjectModule, CustomerModule],
  controllers: [BusinessControllerInternal, BusinessControllerExternal],
  providers: [
    BusinessRepository,
    BusinessService,
    EntityRepository,
    FilterRepository,
    FilterService,
    FileRepository,
    FileService,
    StorageService,
    ProjectScopeService,
    EndUserRepository,
    EndUserService,
    WorkflowEventEmitterService,
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
  ],
})
export class BusinessModule {}
