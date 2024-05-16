import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { TokenScope, type ITokenScope } from '@/common/decorators/token-scope.decorator';
import { UseTokenAuthGuard } from '@/common/guards/token-guard/use-token-auth.decorator';
import { EndUserCreateDto } from '@/end-user/dtos/end-user-create';
import { EndUserModel } from '@/end-user/end-user.model';
import { EndUserService } from '@/end-user/end-user.service';
import * as common from '@nestjs/common';
import { Controller } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

@UseTokenAuthGuard()
@swagger.ApiExcludeController()
@Controller('collection-flow/end-user')
export class CollectionFlowEndUserController {
  constructor(
    protected readonly service: CollectionFlowService,
    protected readonly endUserService: EndUserService,
  ) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [EndUserModel] })
  getCompanyInfo(@TokenScope() tokenScope: ITokenScope, @common.Body() data: EndUserCreateDto) {
    return this.endUserService.updateById(tokenScope.endUserId, { data: data });
  }
}
