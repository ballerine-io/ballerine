import { AuthModule } from '@/auth/auth.module';
import { ACLModule } from '@/common/access-control/acl.module';
import { CustomerModule } from '@/customer/customer.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectModule } from '@/project/project.module';
import { WorkflowDefinitionModule } from '@/workflow-defintion/workflow-definition.module';
import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { WorkflowService } from '@/workflow/workflow.service';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { BusinessRepository } from '@/business/business.repository';
import { EntityRepository } from '@/common/entity/entity.repository';
import { FileService } from '@/providers/file/file.service';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { UserService } from '@/user/user.service';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { StorageService } from '@/storage/storage.service';
import { UserRepository } from '@/user/user.repository';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { FileRepository } from '@/storage/storage.repository';
import { HookCallbackHandlerService } from '@/workflow/hook-callback-handler.service';
import { FilterService } from '@/filter/filter.service';
import { FilterRepository } from '@/filter/filter.repository';
import { WebhooksController } from '@/webhooks/webhooks.controller';
import { WebhooksService } from '@/webhooks/webhooks.service';
import { BusinessService } from '@/business/business.service';

@Module({
  controllers: [WebhooksController],
  imports: [
    ACLModule,
    forwardRef(() => AuthModule),
    HttpModule,
    ProjectModule,
    PrismaModule,
    CustomerModule,
    WorkflowDefinitionModule,
  ],
  providers: [
    WorkflowService,
    WorkflowRuntimeDataRepository,
    EndUserService,
    EndUserRepository,
    BusinessService,
    BusinessRepository,
    EntityRepository,
    FileService,
    FileRepository,
    WorkflowEventEmitterService,
    UserService,
    UserRepository,
    SalesforceService,
    SalesforceIntegrationRepository,
    WorkflowTokenService,
    WorkflowTokenRepository,
    UiDefinitionService,
    UiDefinitionRepository,
    StorageService,
    HookCallbackHandlerService,
    FilterService,
    FilterRepository,
    WebhooksService,
  ],
  exports: [],
})
export class WebhooksModule {}
