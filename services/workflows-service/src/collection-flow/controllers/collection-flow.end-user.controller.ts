import { BusinessService } from '@/business/business.service';
import { Public } from '@/common/decorators/public.decorator';
import { UseTokenAuthGuard } from '@/common/guards/token-guard/use-token-auth.decorator';
import { Controller, Post, Query } from '@nestjs/common';
import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { EndUserModel } from "@/end-user/end-user.model";
import { EndUserCreateDto } from "@/end-user/dtos/end-user-create";
import { CurrentProject } from "@/common/decorators/current-project.decorator";
import { TProjectId } from "@/types";
import { BusinessInformation } from "@/business/dtos/business-information";
import { ITokenScope, TokenScope } from "@/common/decorators/token-scope.decorator";
import { CollectionFlowService } from "@/collection-flow/collection-flow.service";
import { EndUserService } from "@/end-user/end-user.service";

@Public()
@UseTokenAuthGuard()
@Controller('collection-flow/end-user')
export class CollectionFlowBusinessController {
  constructor(
    protected readonly service: CollectionFlowService,
    protected readonly endUserService: EndUserService,
  ) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [EndUserModel] })
  getCompanyInfo(
    @TokenScope() tokenScope: ITokenScope,
    @common.Body() data: EndUserCreateDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return this.endUserService.updateById(tokenScope.endUserId, {data: data}, currentProjectId)
  }
}
