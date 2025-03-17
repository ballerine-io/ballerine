import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as errors from '../errors';
import { BusinessWhereUniqueInput } from './dtos/business-where-unique-input';
import { BusinessFindManyArgs } from './dtos/business-find-many-args';
import { BusinessModel } from './business.model';
import { plainToClass } from 'class-transformer';
import type { Request } from 'express';
import { BusinessService } from './business.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import type { InputJsonValue, TProjectIds } from '@/types';
import type { JsonValue } from 'type-fest';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { BusinessRepository } from './business.repository';
import { PrismaService } from '../prisma/prisma.service';
import {
  BusinessPayload,
  UnifiedApiClient,
} from '@/common/utils/unified-api-client/unified-api-client';

@swagger.ApiTags('internal/businesses')
@swagger.ApiExcludeController()
@common.Controller('internal/businesses')
export class BusinessControllerInternal {
  constructor(
    protected readonly service: BusinessService,
    protected readonly repository: BusinessRepository,
    protected readonly prisma: PrismaService,
  ) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [BusinessModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(BusinessFindManyArgs)
  async list(
    @ProjectIds() projectIds: TProjectIds,
    @common.Req() request: Request,
  ): Promise<BusinessModel[]> {
    const args = plainToClass(BusinessFindManyArgs, request.query);
    const query: JsonValue = {};

    return this.service.list(
      {
        ...args,
        ...(query as InputJsonValue),
      },
      projectIds,
    );
  }

  @common.Get('sync')
  @common.UseGuards(AdminAuthGuard)
  @ApiExcludeEndpoint()
  async getAllBusinesses() {
    const businesses = (await this.repository.findManyUnscoped({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        correlationId: true,
        companyName: true,
        metadata: true,
        project: {
          select: {
            customer: { select: { id: true, config: true } },
          },
        },
      },
      where: {
        NOT: {
          project: {
            customer: {
              config: {
                path: ['disableBusinessSyncToUnifiedApi'],
                equals: true,
              },
            },
          },
        },
      },
    })) as BusinessPayload[];

    const unifiedApiClient = new UnifiedApiClient();

    return businesses.map(business => unifiedApiClient.formatBusiness(business));
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: BusinessModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
  async getById(
    @common.Param() params: BusinessWhereUniqueInput,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<BusinessModel | null> {
    try {
      return await this.service.getById(params?.id, {}, projectIds);
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw err;
    }
  }
}
