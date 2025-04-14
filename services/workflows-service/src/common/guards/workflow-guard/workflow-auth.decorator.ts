import { applyDecorators, UseGuards } from '@nestjs/common';
import { WorkflowAuthGuard } from './workflow-auth.guard';
import { disableDefaultAuth } from '@/common/disable-default-auth';

export const UseWorkflowAuthGuard = () =>
  applyDecorators(UseGuards(WorkflowAuthGuard), disableDefaultAuth());
