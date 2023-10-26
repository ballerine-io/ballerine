import { Injectable } from '@nestjs/common';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { TProjectId } from '@/types';

@Injectable()
export class WorkflowTokenService {
  constructor(private readonly workflowTokenRepository: WorkflowTokenRepository) {}

  async create(
    projectId: TProjectId,
    data: Parameters<typeof this.workflowTokenRepository.create>[1],
  ) {
    return await this.workflowTokenRepository.create(projectId, data);
  }

  async findByToken(token: string) {
    return await this.workflowTokenRepository.findByTokenUnscoped(token);
  }

  async deleteByToken(token: string) {
    return await this.workflowTokenRepository.deleteByTokenUnscoped(token);
  }
}
