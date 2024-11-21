import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { TProjectIds } from '@/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertDefinitionService {
  constructor(private readonly alertDefinitionRepository: AlertDefinitionRepository) {}

  getByAlertId(alertId: string, projectIds: TProjectIds) {
    return this.alertDefinitionRepository.findByAlertId(alertId, projectIds);
  }

  list(projectIds: TProjectIds) {
    return this.alertDefinitionRepository.findMany({}, projectIds);
  }
}
