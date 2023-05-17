import { forwardRef, Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowControllerExternal } from './workflow.controller.external';
import { WorkflowControllerInternal } from './workflow.controller.internal';
import { MorganModule } from 'nest-morgan';
import { ACLModule } from '../access-control/acl.module';
import { AuthModule } from '../auth/auth.module';
import { WorkflowDefinitionRepository } from './workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from './workflow-runtime-data.repository';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { WorkflowEventEmitterService } from './workflow-event-emitter.service';
import { EventConsumerListener } from '@/events/event-consumer';
import { BusinessRepository } from '@/business/business.repository';

@Module({
  imports: [ACLModule, forwardRef(() => AuthModule), MorganModule],
  controllers: [WorkflowControllerExternal, WorkflowControllerInternal],
  providers: [
    WorkflowDefinitionRepository,
    WorkflowRuntimeDataRepository,
    EndUserRepository,
    BusinessRepository,
    WorkflowService,
    WorkflowEventEmitterService,
    EventConsumerListener,
  ],
  exports: [WorkflowService, ACLModule, AuthModule, MorganModule],
})
export class WorkflowModule {}
