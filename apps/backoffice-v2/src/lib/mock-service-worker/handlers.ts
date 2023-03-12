import { endUsersController } from './end-users/end-users.controller';
import { authController } from './auth/auth.controller';
import { workflowsController } from './workflows/workflows.controller';

export const handlers = [
  // Auth
  ...authController,

  // End Users
  ...endUsersController,

  // Workflows
  ...workflowsController,
];
