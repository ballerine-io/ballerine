import { AlertService } from '@/alert/alert.service';
import { INestApplication } from '@nestjs/common';
import { AlertDefinition } from '@prisma/client';

export const createAlert = async (app: INestApplication, alertDefinition: AlertDefinition) => {
  const alertService = app.get<AlertService>(AlertService);

  // Accessing private method for testing purposes while maintaining types
  return await alertService.createAlert(alertDefinition, [], {}, {});
};
