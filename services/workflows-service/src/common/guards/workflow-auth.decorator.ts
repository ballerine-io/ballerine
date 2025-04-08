import { applyDecorators, UseGuards } from '@nestjs/common';
import { WorkflowAuthGuard } from './workflow-auth.guard';

export const UseWorkflowAuthGuard = () => applyDecorators(UseGuards(WorkflowAuthGuard));
