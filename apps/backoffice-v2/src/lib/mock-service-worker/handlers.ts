import { individualsController } from '../../individuals/mock-service-worker/individuals.controller';
import { authController } from '../../auth/mock-service-worker/auth/auth.controller';
import { workflowsController } from '../../workflows/mock-service-worker/workflows/workflows.controller';

export const handlers = [
  // Auth
  ...authController,

  // End Users
  ...individualsController,

  // Workflows
  ...workflowsController,
];
