import { Public } from '@/common/decorators/public.decorator';
import { UseTokenAuthGuard } from '@/common/guards/token-guard/use-token-auth.decorator';
import * as common from '@nestjs/common';
import { Controller } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { EndUserModel } from '@/end-user/end-user.model';
import { EndUserCreateDto } from '@/end-user/dtos/end-user-create';
import { type ITokenScope, TokenScope } from '@/common/decorators/token-scope.decorator';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { EndUserService } from '@/end-user/end-user.service';

@Public()
@UseTokenAuthGuard()
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
