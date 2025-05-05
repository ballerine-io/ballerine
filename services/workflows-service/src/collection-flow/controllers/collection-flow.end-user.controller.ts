import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import {
  TokenScope,
  type ITokenScopeWithEndUserId,
} from '@/common/decorators/token-scope.decorator';
import { EndUserUpdateDto } from '@/end-user/dtos/end-user-update';
import { EndUserModel } from '@/end-user/end-user.model';
import { EndUserService } from '@/end-user/end-user.service';
import * as common from '@nestjs/common';
import { Controller } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { UseWorkflowAuthGuard } from '@/common/guards/workflow-guard/workflow-auth.decorator';

@UseWorkflowAuthGuard()
@swagger.ApiExcludeController()
@Controller('collection-flow/end-user')
export class CollectionFlowEndUserController {
  constructor(
    protected readonly service: CollectionFlowService,
    protected readonly endUserService: EndUserService,
  ) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [EndUserModel] })
  updateEndUser(
    @TokenScope() tokenScope: ITokenScopeWithEndUserId,
    @common.Body() data: EndUserUpdateDto,
  ) {
    return this.endUserService.updateById(tokenScope.endUserId, { data: data });
  }
}
