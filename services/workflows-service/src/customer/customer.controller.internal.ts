import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

import { UserCreateDto } from '@/user/dtos/user-create';
import { CustomerService } from '@/customer/customer.service';
import { CustomerModel } from '@/customer/customer.model';
import { Customer } from '@prisma/client';
import { CustomerCreateDto } from '@/customer/dtos/customer-create';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { TProjectIds } from '@/types';
import { NotFoundException } from '@nestjs/common';

@swagger.ApiTags('internal/customers')
@common.Controller('internal/customers')
export class CustomerControllerInternal {
  constructor(protected readonly service: CustomerService) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [CustomerModel] })
  @swagger.ApiForbiddenResponse()
  async find(@ProjectIds() projectIds: TProjectIds): Promise<Customer | null> {
    const projectId = projectIds?.[0];
    if (!projectId) throw new NotFoundException('Customer not found');

    return this.service.getByProjectId(projectId, {
      select: {
        id: true,
        name: true,
        displayName: true,
        logoImageUri: true,
        country: true,
        language: true,
        customerStatus: true,
      },
    });
  }

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [CustomerCreateDto] })
  @swagger.ApiForbiddenResponse()
  async create(@common.Body() customerCreateModel: CustomerCreateDto) {
    return this.service.create({
      data: customerCreateModel,
      select: {
        id: true,
        name: true,
        displayName: true,
        logoImageUri: true,
        country: true,
        language: true,
        customerStatus: true,
      },
    });
  }
}
