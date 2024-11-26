import { AlertService } from '@/alert/alert.service';
import { AlertDefinition } from '@prisma/client';

export const createAlert = async (
  projectId: string,
  alertDefinition: AlertDefinition,
  alertService: AlertService,
) => {
  // Accessing private method for testing purposes while maintaining types
  return await alertService.createAlert(
    {
      ...alertDefinition,
      projectId,
    },
    [],
    {},
    {},
  );
};
