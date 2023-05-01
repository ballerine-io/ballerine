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

@swagger.ApiTags('external/businesss')
@common.Controller('external/businesss')
export class BusinessControllerExternal {
  constructor(
    protected readonly service: BusinessService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  // @common.Post()
  // @swagger.ApiCreatedResponse({ type: [BusinessModel] })
  // @swagger.ApiForbiddenResponse()
  // async create(
  //   @common.Body() data: BusinessCreateDto,
  // ): Promise<Pick<BusinessModel, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>> {
  //   return this.service.create({
  //     data: {
  //       ...data,
  //       correlationId: faker.datatype.uuid(),
  //       email: faker.internet.email(data.firstName, data.lastName),
  //       phone: faker.phone.number('+##########'),
  //       dateOfBirth: faker.date.past(60),
  //       avatarUrl: faker.image.avatar(),
  //     },
  //     select: {
  //       id: true,
  //       firstName: true,
  //       lastName: true,
  //       avatarUrl: true,
  //     },
  //   });
  // }

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
