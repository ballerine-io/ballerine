import * as common from '@nestjs/common';
import { NotFoundException, UseGuards } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { Customer, Prisma } from '@prisma/client';
import { merge } from 'lodash';
import { randomUUID } from 'node:crypto';

import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { CustomerModel } from '@/customer/customer.model';
import { CustomerService } from '@/customer/customer.service';
import { CustomerCreateDto } from '@/customer/dtos/customer-create';
import { TCustomerWithFeatures } from '@/customer/types';
import { PrismaService } from '@/prisma/prisma.service';
import { InputJsonValue, type TProjectIds } from '@/types';
import { ConfigSchema } from '@/workflow/schemas/zod-schemas';
import { createDemoMockData } from '../../scripts/workflows/workflow-runtime';
import { CustomerUpdateDto } from './dtos/customer-update';
import { cleanUndefinedValues } from '@/common/utils/clean-undefined-values';

@swagger.ApiExcludeController()
@common.Controller('internal/customers')
export class CustomerControllerInternal {
  constructor(
    protected readonly service: CustomerService,
    protected readonly prisma: PrismaService,
  ) {}

  @common.Get()
  @UseGuards(AdminAuthGuard)
  async list() {
    return await this.service.list({ include: { projects: true } });
  }

  @common.Get()
  @swagger.ApiOkResponse({ type: [CustomerModel] })
  @swagger.ApiForbiddenResponse()
  async find(@ProjectIds() projectIds: TProjectIds): Promise<TCustomerWithFeatures | null> {
    const projectId = projectIds?.[0];

    if (!projectId) {
      throw new NotFoundException('Customer not found');
    }

    return this.service.getByProjectId(projectId, {
      select: {
        id: true,
        name: true,
        displayName: true,
        logoImageUri: true,
        faviconImageUri: true,
        country: true,
        language: true,
        customerStatus: true,
        config: true,
      },
    });
  }

  @common.Post()
  @UseGuards(AdminAuthGuard)
  @swagger.ApiCreatedResponse({ type: [CustomerCreateDto] })
  @swagger.ApiForbiddenResponse()
  async create(@common.Body() customerCreateModel: CustomerCreateDto) {
    const { projectName, config, ...customer } = customerCreateModel;

    const parsedConfig = ConfigSchema.parse(config);

    if (projectName) {
      (customer as Prisma.CustomerCreateInput).projects = {
        create: { name: customerCreateModel.projectName! },
      };
    }

    const apiKey = customer.authenticationConfiguration?.authValue ?? randomUUID();

    const createdCustomer = (await this.service.create({
      data: {
        ...customer,
        config: parsedConfig as InputJsonValue,
        authenticationConfiguration: {
          ...customer.authenticationConfiguration,
          authValue: apiKey,
        },
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        logoImageUri: true,
        faviconImageUri: true,
        country: true,
        language: true,
        customerStatus: true,
        projects: true,
        config: true,
      },
    })) as Customer & { projects: Array<{ id: string }> };

    if (projectName == 'demo') {
      await createDemoMockData({
        prismaClient: this.prisma,
        customer: customerCreateModel,
        projects: createdCustomer.projects,
      });
    }

    return {
      ...createdCustomer,
      apiKey,
    };
  }

  @common.Put(':id')
  @UseGuards(AdminAuthGuard)
  @swagger.ApiCreatedResponse({ type: [CustomerUpdateDto] })
  @swagger.ApiForbiddenResponse()
  async edit(@common.Param('id') id: string, @common.Body() payload: CustomerUpdateDto) {
    const { config, ...customer } = payload;

    const existingCustomer = await this.service.getById(id);

    if (!existingCustomer) {
      throw new NotFoundException('Customer not found');
    }

    return this.service.updateById(id, {
      data: cleanUndefinedValues({
        ...(config && { config: merge(existingCustomer.config, ConfigSchema.parse(config)) }),
        ...customer,
      }),
    });
  }
}
