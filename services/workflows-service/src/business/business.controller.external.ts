import { ApiNestedQuery } from '@/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import * as errors from '../errors';
import * as nestAccessControl from 'nest-access-control';
import { BusinessFindManyArgs } from './dtos/business-find-many-args';
import { BusinessWhereUniqueInput } from './dtos/business-where-unique-input';
import { BusinessModel } from './business.model';
import { BusinessService } from './business.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { BusinessCreateDto } from './dtos/business-create';

@swagger.ApiTags('external/businesses')
@common.Controller('external/businesses')
export class BusinessControllerExternal {
  constructor(
    protected readonly service: BusinessService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [BusinessModel] })
  @swagger.ApiForbiddenResponse()
  async create(
    @common.Body() data: BusinessCreateDto,
  ): Promise<Pick<BusinessModel, 'id' | 'companyName'>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.service.create({
      data: {
        ...data,
        legalForm: 'name',
        countryOfIncorporation: 'US',
        address: 'addess',
        industry: 'telecom',
        documents: 's',
      },
      select: {
        id: true,
        companyName: true,
      },
    });
  }

  @common.Get()
  @swagger.ApiOkResponse({ type: [BusinessModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(BusinessFindManyArgs)
  async list(@common.Req() request: Request): Promise<BusinessModel[]> {
    const args = plainToClass(BusinessFindManyArgs, request.query);
    return this.service.list(args);
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: BusinessModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
  async getById(@common.Param() params: BusinessWhereUniqueInput): Promise<BusinessModel | null> {
    try {
      const business = await this.service.getById(params.id);

      return business;
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw err;
    }
  }
}
