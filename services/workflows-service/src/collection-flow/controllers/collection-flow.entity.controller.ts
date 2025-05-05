import { TokenScope, type ITokenScope } from '@/common/decorators/token-scope.decorator';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CollectionFlowEntityService } from '../collection-flow-entity.service';
import { CreateEntityInputDto, EntityCreateDto } from '../dto/create-entity-input.dto';
import { UseWorkflowAuthGuard } from '@/common/guards/workflow-guard/workflow-auth.decorator';

@UseWorkflowAuthGuard()
@ApiExcludeController()
@Controller('collection-flow/entity')
export class CollectionFlowEntityController {
  constructor(private readonly collectionFlowEntityService: CollectionFlowEntityService) {}

  @Post()
  async createEntity(@TokenScope() tokenScope: ITokenScope, @Body() body: CreateEntityInputDto) {
    const { entityType, entity } = body;

    return this.collectionFlowEntityService.createEntity(
      tokenScope.workflowRuntimeDataId,
      entityType,
      entity,
      tokenScope.projectId,
    );
  }

  @Put(':entityId')
  async updateEntity(@Param('entityId') entityId: string, @Body() body: EntityCreateDto) {
    return this.collectionFlowEntityService.updateEntity(entityId, body);
  }

  @Delete(':entityId')
  async deleteEntity(@Param('entityId') entityId: string) {
    return this.collectionFlowEntityService.deleteEntity(entityId);
  }
}
