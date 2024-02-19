import { TProjectId } from '@/types';
import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertDefinitionService {
  constructor(private readonly alertDefinitionRepository: AlertDefinitionRepository) {}

  getByAlertId(alertId: string, projectIds: TProjectId[]) {
    return this.alertDefinitionRepository.findByAlertId(alertId, projectIds);
  }
}
