import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { CustomerService } from '@/customer/customer.service';
import { Customer, Prisma, PrismaClient } from '@prisma/client';
import { CustomerCreateDto } from '@/customer/dtos/customer-create';
import { Request, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { CustomerModel } from '@/customer/customer.model';
import { AuthenticatedEntity } from '@/types';
import { CustomerAuthGuard } from '@/common/guards/customer-auth.guard';
import {
  createDemoMockData,
  createMockParentWithChildWorkflow,
} from '../../scripts/workflows/workflw-runtime';
import { PrismaService } from '@/prisma/prisma.service';

@swagger.ApiTags('external/customers')
@common.Controller('external/customers')
export class CustomerControllerExternal {
  constructor(
    protected readonly service: CustomerService,
    protected readonly prisma: PrismaService,
  ) {}

  @common.Post()
  @UseGuards(AdminAuthGuard)
  @swagger.ApiCreatedResponse({ type: [CustomerCreateDto] })
  @swagger.ApiForbiddenResponse()
  async create(@common.Body() customerCreateModel: CustomerCreateDto) {
    const { projectName, ...customer } = customerCreateModel;
    if (projectName) {
      (customer as Prisma.CustomerCreateInput).projects = {
        create: { name: customerCreateModel.projectName! },
      };
    }

    const createdCustomer = (await this.service.create({
      data: customer,
      select: {
        id: true,
        name: true,
        displayName: true,
        logoImageUri: true,
        country: true,
        language: true,
        customerStatus: true,
        projects: true,
      },
    })) as Customer & { projects: { id: string }[] };

    if (projectName == 'demo') {
      await createDemoMockData(this.prisma, customerCreateModel, createdCustomer);
    }
    return createdCustomer;
  }

  @common.Get('/me')
  @UseGuards(CustomerAuthGuard)
  @swagger.ApiOkResponse({ type: [CustomerModel] })
  @swagger.ApiForbiddenResponse()
  find(@Request() req: any): Partial<Customer> {
    return (req.user as AuthenticatedEntity).customer!;
  }
}
