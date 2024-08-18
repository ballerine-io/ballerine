import * as swagger from '@nestjs/swagger';
import * as common from '@nestjs/common';
import { RiskRuleService } from './risk-rule.service';
import { Type } from '@sinclair/typebox';
import { Validate } from 'ballerine-nestjs-typebox';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { CreateRiskRuleSchema, type TCreateRiskRule } from './schemas/create-risk-rule.schema';
import { UpdateRiskRuleSchema, type TUpdateRiskRule } from './schemas/update-risk-rule.schema';
import { DisconnectRiskRuleToRulesetSchema } from '@/risk-rules/risk-rule/schemas/disconnect-risk-rule-to-ruleset.schema';
import {
  ConnectRiskRuleToRulesetSchema,
  type TConnectRiskRuleToRuleset,
} from '@/risk-rules/risk-rule/schemas/connect-risk-rule-to-ruleset.schema';
import {
  CopyRiskRuleSchema,
  type TCopyRiskRule,
} from '@/risk-rules/risk-rule/schemas/copy-risk-rule.schema';

@swagger.ApiTags('Risk Rules')
@common.Controller('external/risk-rules')
export class RiskRuleController {
  constructor(protected readonly riskRuleService: RiskRuleService) {}

  @common.Post()
  @Validate({
    request: [
      {
        type: 'body',
        schema: CreateRiskRuleSchema,
      },
    ],
    response: Type.Any(),
  })
  async createRiskRule(
    @common.Body() data: TCreateRiskRule,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return this.riskRuleService.createNewRiskRule({
      riskRuleData: data,
      projectId: currentProjectId,
      ruleSetId: data.ruleSetId,
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
  async getRiskRule(@common.Param('id') id: string, @ProjectIds() projectIds: TProjectIds) {
    return this.riskRuleService.findById(id, projectIds);
  }

  @common.Get()
  @Validate({
    response: Type.Array(Type.Any()),
  })
  async listRiskRules(@ProjectIds() projectIds: TProjectIds) {
    return this.riskRuleService.findMany({}, projectIds);
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
        schema: UpdateRiskRuleSchema,
      },
    ],
    response: Type.Any(),
  })
  async updateRiskRule(
    @common.Param('id') id: string,
    @common.Body() updateData: TUpdateRiskRule,
    @CurrentProject() projectId: TProjectId,
  ) {
    return this.riskRuleService.updateRiskRule({ id, updateData, projectId });
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
  async deleteRiskRule(@common.Param('id') id: string, @ProjectIds() projectIds: TProjectIds) {
    return this.riskRuleService.deleteRiskRule(id, projectIds);
  }

  @common.Post(':id/copy')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: Type.String(),
      },
      {
        type: 'body',
        schema: CopyRiskRuleSchema,
      },
    ],
    response: Type.Any(),
  })
  async copyRiskRule(
    @common.Param('id') id: string,
    @common.Body() { newName }: TCopyRiskRule,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return this.riskRuleService.createCopyOfRiskRule({
      originalId: id,
      newName,
      projectId: currentProjectId,
      projectIds,
    });
  }
  @common.Post(':id/connect-ruleset')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: Type.String(),
      },
      {
        type: 'body',
        schema: ConnectRiskRuleToRulesetSchema,
      },
    ],
    response: Type.Object({ message: Type.String() }),
  })
  async connectRiskRuleToRuleset(
    @common.Param('id') id: string,
    @common.Body() body: TConnectRiskRuleToRuleset,
  ) {
    await this.riskRuleService.connectRiskRuleToRuleset(id, body.ruleSetId);

    return { message: 'RiskRule successfully connected to RuleSet' };
  }

  @common.Post(':id/disconnect-ruleset')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: Type.String(),
      },
      {
        type: 'body',
        schema: DisconnectRiskRuleToRulesetSchema,
      },
    ],
    response: Type.Object({ message: Type.String() }),
  })
  async disconnectRiskRuleFromRuleset(
    @common.Param('id') id: string,
    @common.Body() body: { ruleSetId: string },
  ) {
    await this.riskRuleService.disconnectRiskRuleFromRuleset(id, body.ruleSetId);
    return { message: 'RiskRule successfully disconnected from RuleSet' };
  }
}
