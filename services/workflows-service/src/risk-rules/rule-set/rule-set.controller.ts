import * as swagger from '@nestjs/swagger';
import * as common from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Type } from '@sinclair/typebox';
import { Validate } from 'ballerine-nestjs-typebox';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { type TUpdateRule, UpdateRuleSchema } from '@/risk-rules/rule/schemas/update-rule.schema';
import { RuleSetService } from '@/risk-rules/rule-set/rule-set.service';
import {
  CreateRulesetSchema,
  type TCreatedRuleset,
} from '@/risk-rules/rule-set/schemas/create-rule-set.schema';
import {
  AssignRuleSetToParentRuleSet,
  type TassignToParentRuleSet,
} from '@/risk-rules/rule-set/schemas/assign-rule-set.schema';
import {
  type TUnassignRulesetFromSchema,
  UnassignRulesetFromParentSchema,
} from '@/risk-rules/rule/schemas/unassign-ruleset-from-parent.schema';

@swagger.ApiTags('Rules')
@common.Controller('external/rule-set')
export class RuleSetController {
  constructor(protected readonly ruleSetService: RuleSetService) {}

  @common.Post('')
  @Validate({
    request: [
      {
        type: 'body',
        schema: CreateRulesetSchema,
      },
    ],
    response: Type.Any(),
  })
  async createRule(
    @common.Body() data: TCreatedRuleset,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const { parentRuleSetId, ...rulesetCreationData } = data;

    return await this.ruleSetService.createRuleSet({
      ruleSetData: rulesetCreationData,
      projectId: currentProjectId,
      parentRuleSetId: parentRuleSetId,
    });
  }

  @common.Put('/:ruleset/assign')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'ruleId',
        schema: Type.String(),
      },
      {
        type: 'body',
        schema: AssignRuleSetToParentRuleSet,
      },
    ],
    response: Type.Any(),
  })
  async assignRuleToParentRuleSet(
    @common.Query() ruleId: string,
    @common.Body() assignRuleDate: TassignToParentRuleSet,
  ) {
    const ruleSetAssociation = await this.ruleSetService.assignRuleSetToParentRuleset(
      ruleId,
      assignRuleDate.parentRuleSetId,
    );

    return ruleSetAssociation;
  }

  @common.Put('/:ruleSetId/unassign')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'ruleSetId',
        schema: Type.String(),
      },
      {
        type: 'body',
        schema: UnassignRulesetFromParentSchema,
      },
    ],
    response: Type.Any(),
  })
  async unassignRule(
    @common.Query() ruleSetId: string,
    @common.Body() parentRuleSet: TUnassignRulesetFromSchema,
  ) {
    return await this.ruleSetService.unassignRuleFromRuleset(
      ruleSetId,
      parentRuleSet.parentRuleSetId,
    );
  }

  @common.Patch('/:ruleId')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'ruleId',
        schema: Type.String(),
      },
      {
        type: 'body',
        schema: UpdateRuleSchema,
      },
    ],
    response: UpdateRuleSchema,
  })
  async updateRule(
    @common.Query() ruleId: string,
    @common.Body() updateRuleSchema: TUpdateRule,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const rule = await this.ruleSetService.updateRuleSet({
      ruleId,
      ruleData: updateRuleSchema,
      projectId: currentProjectId,
      projectIds,
    });

    return rule as TUpdateRule;
  }

  @Delete('/:ruleId')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'ruleId',
        schema: Type.String(),
      },
    ],
    response: Type.Any(),
  })
  async deleteRule(@common.Query() ruleId: string, @ProjectIds() projectIds: TProjectIds) {
    await this.ruleSetService.deleteRule({ ruleId, projectIds });
  }
}
