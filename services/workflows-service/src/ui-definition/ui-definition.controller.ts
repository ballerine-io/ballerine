import { CurrentProject } from '@/common/decorators/current-project.decorator';
import type { TProjectId } from '@/types';
import { UIDefinitionWhereUniqueInputSchema } from '@/ui-definition/dtos/ui-definition-where-unique-input';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import * as common from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import * as typebox from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';
import { Validate } from 'ballerine-nestjs-typebox';

@Controller('ui-definition')
export class UIDefinitionController {
  constructor(protected readonly uiDefinitionService: UiDefinitionService) {}

  @ApiResponse({
    status: 200,
    description: 'UI Definition copied successfully.',
    schema: Type.Object({}),
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: typebox.Type.Record(typebox.Type.String(), typebox.Type.Unknown()),
  })
  @Validate({
    request: [
      {
        type: 'param',
        name: 'id',
        schema: UIDefinitionWhereUniqueInputSchema,
      },
    ],
    response: Type.Any(),
  })
  @common.Post(':id/copy')
  async copyUIDefinition(
    @common.Param('id') id: string,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return this.uiDefinitionService.cloneUIDefinitionById(id, currentProjectId);
  }
}
