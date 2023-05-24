import { individualsController } from '../../domains/individuals/mock-service-worker/individuals.controller';
import { authController } from '../../domains/auth/mock-service-worker/auth/auth.controller';
import { workflowsController } from '../../domains/workflows/mock-service-worker/workflows/workflows.controller';

export const handlers = [
  // Auth
  ...authController,

  // End Users
  ...individualsController,

  // Workflows
  ...workflowsController,
];
