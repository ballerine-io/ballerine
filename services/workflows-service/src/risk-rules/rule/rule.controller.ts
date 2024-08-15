import * as swagger from '@nestjs/swagger';
import * as common from '@nestjs/common';
import { RuleService } from '@/risk-rules/rule/rule.service';
import { Type } from '@sinclair/typebox';
import { Validate } from 'ballerine-nestjs-typebox';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { CreateRuleSchema, type TCreateRule } from '@/risk-rules/rule/schemas/create-rule.schema';
import { AssignRuleSchema, type TAssignRule } from '@/risk-rules/rule/schemas/assign-rule.schema';
import { type TUpdateRule, UpdateRuleSchema } from '@/risk-rules/rule/schemas/update-rule.schema';
import { Delete } from '@nestjs/common';
import {
  type TUnassignRule,
  UnassignRuleFromRuleSetSchema,
} from '@/risk-rules/rule/schemas/unassign-rule-from-rule-set.schema';

@swagger.ApiTags('Rules')
@common.Controller('external/rules')
export class RuleController {
  constructor(protected readonly ruleService: RuleService) {}

  @common.Post('')
  @Validate({
    request: [
      {
        type: 'body',
        schema: CreateRuleSchema,
      },
    ],
    response: Type.Composite([CreateRuleSchema, Type.Object({ id: Type.String() })]),
  })
  async createRule(
    @common.Body() data: TCreateRule,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return (await this.ruleService.createNewRule({
      ruleData: data,
      projectId: currentProjectId,
      rulesetId: data.ruleSetId,
    })) as TCreateRule & { id: string };
  }

  @common.Put('/:ruleId/assign')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'ruleId',
        schema: Type.String(),
      },
      {
        type: 'body',
        schema: AssignRuleSchema,
      },
    ],
    response: Type.Composite([AssignRuleSchema, Type.Object({ ruleId: Type.String() })]),
  })
  async assignRuleToRuleset(
    @common.Query() ruleId: string,
    @common.Body() assignRuleDate: TAssignRule,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const rule = await this.ruleService.assignRuleToRuleset(
      ruleId,
      assignRuleDate.ruleSetId,
      currentProjectId,
      projectIds,
    );

    return {
      ruleId: rule.id,
      ...assignRuleDate,
    };
  }

  @common.Put('/:ruleId/unassign')
  @Validate({
    request: [
      {
        type: 'param',
        name: 'ruleId',
        schema: Type.String(),
      },
      {
        type: 'body',
        schema: UnassignRuleFromRuleSetSchema,
      },
    ],
    response: Type.Composite([
      UnassignRuleFromRuleSetSchema,
      Type.Object({ ruleId: Type.String() }),
    ]),
  })
  async unassignRule(
    @common.Query() ruleId: string,
    @common.Body() unassignRule: TUnassignRule,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const rule = await this.ruleService.unassignRuleFromRuleset(
      ruleId,
      unassignRule.ruleSetId,
      currentProjectId,
      projectIds,
    );

    return {
      ruleId: rule.id,
      ...unassignRule,
    };
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
    response: Type.Any(),
  })
  async updateRule(
    @common.Query() ruleId: string,
    @common.Body() updateRuleSchema: TUpdateRule,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const rule = await this.ruleService.updateRule({
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
    await this.ruleService.deleteRule({ ruleId, projectIds });
  }
}