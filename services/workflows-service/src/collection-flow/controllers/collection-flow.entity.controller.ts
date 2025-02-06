import { TokenScope, type ITokenScope } from '@/common/decorators/token-scope.decorator';
import { UseTokenAuthGuard } from '@/common/guards/token-guard/use-token-auth.decorator';
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CollectionFlowEntityService } from '../collection-flow-entity.service';
import { CreateEntityInputDto } from '../dto/create-entity-input.dto';

@UseTokenAuthGuard()
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

  @Delete(':entityId')
  async deleteEntity(@Param('entityId') entityId: string) {
    return this.collectionFlowEntityService.deleteEntity(entityId);
  }
}
