import * as swagger from '@nestjs/swagger';
import * as common from '@nestjs/common';
import { RiskRulePolicyService } from './risk-rule-policy.service';
import { Type } from '@sinclair/typebox';
import { Validate } from 'ballerine-nestjs-typebox';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import {
  CreateRiskRulePolicySchema,
  type TCreateRiskRulePolicy,
} from './schemas/create-risk-rule-policy-schema';
import {
  type TUpdateRiskRulePolicy,
  UpdateRiskRulePolicySchema,
} from './schemas/update-risk-rule-policy-schema';

@swagger.ApiTags('Risk Rule Policies')
@common.Controller('external/risk-rule-policies')
export class RiskRulePolicyController {
  constructor(protected readonly riskRulePolicyService: RiskRulePolicyService) {}

  @common.Post()
  @Validate({
    request: [
      {
        type: 'body',
        schema: CreateRiskRulePolicySchema,
      },
    ],
    response: Type.Any(),
  })
  async createRiskRulePolicy(
    @common.Body() data: TCreateRiskRulePolicy,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return this.riskRulePolicyService.createRiskRulePolicy({
      ...data,
      projectId: currentProjectId,
      isPublic: false,
    });
  }

  @common.Get(':id')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: Type.String(),
      },
    ],
    response: Type.Any(),
  })
  async getRiskRulePolicy(@common.Param('id') id: string, @ProjectIds() projectIds: TProjectIds) {
    return this.riskRulePolicyService.findById(id, projectIds);
  }

  @common.Get()
  @Validate({
    response: Type.Array(Type.Any()),
  })
  async listRiskRulePolicies(@ProjectIds() projectIds: TProjectIds) {
    return this.riskRulePolicyService.findMany({}, projectIds);
  }

  @common.Patch(':id')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: Type.String(),
      },
      {
        type: 'body',
        schema: UpdateRiskRulePolicySchema,
      },
    ],
    response: Type.Any(),
  })
  async updateRiskRulePolicy(
    @common.Param('id') id: string,
    @common.Body() updateData: TUpdateRiskRulePolicy,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.riskRulePolicyService.updateRiskRulePolicy(id, updateData, projectId);
  }

  @common.Delete(':id')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: Type.String(),
      },
    ],
    response: Type.Any(),
  })
  async deleteRiskRulePolicy(
    @common.Param('id') id: string,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    return this.riskRulePolicyService.deleteRiskRulePolicy(id, projectIds);
  }
}
