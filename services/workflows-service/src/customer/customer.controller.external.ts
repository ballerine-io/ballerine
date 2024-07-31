import { CustomerSubscriptionSchema } from './schemas/zod-schemas';
import * as common from '@nestjs/common';
import { Request, UseGuards, UsePipes } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { CustomerService } from '@/customer/customer.service';
import { Customer, Prisma } from '@prisma/client';
import { CustomerCreateDto } from '@/customer/dtos/customer-create';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { CustomerModel } from '@/customer/customer.model';
import { AuthenticatedEntity, InputJsonValue } from '@/types';
import { CustomerAuthGuard } from '@/common/guards/customer-auth.guard';
import { createDemoMockData } from '../../scripts/workflows/workflow-runtime';
import { PrismaService } from '@/prisma/prisma.service';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { CustomerSubscriptionDto } from './dtos/customer-config-create.dto';
import { ValidationError } from '@/errors';
import { randomUUID } from 'node:crypto';
import { ConfigSchema } from '@/workflow/schemas/zod-schemas';

@swagger.ApiTags('Customers')
@swagger.ApiExcludeController()
@common.Controller('external/customers')
export class CustomerControllerExternal {
  constructor(
    protected readonly service: CustomerService,
    protected readonly prisma: PrismaService,
  ) {}

  @common.Get()
  @UseGuards(AdminAuthGuard)
  async list() {
    return await this.service.list();
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

  @common.Get('/me')
  @UseGuards(CustomerAuthGuard)
  @swagger.ApiOkResponse({ type: [CustomerModel] })
  @swagger.ApiForbiddenResponse()
  find(@Request() req: any): Partial<Customer> {
    return (req.user as AuthenticatedEntity).customer!;
  }

  @common.Post('subscriptions')
  @swagger.ApiOkResponse({ type: CustomerSubscriptionDto })
  @swagger.ApiForbiddenResponse()
  @swagger.ApiBadRequestResponse({ type: ValidationError })
  @UseGuards(CustomerAuthGuard)
  @UsePipes(new ZodValidationPipe(CustomerSubscriptionSchema, 'body'))
  async createSubscriptions(
    @common.Body() data: CustomerSubscriptionDto,
    @Request() req: any,
  ): Promise<Pick<Customer, 'subscriptions'>> {
    const customer = (req.user as AuthenticatedEntity).customer!;

    const { subscriptions, ...updatedCustomer } = await this.service.updateById(customer.id!, {
      data,
    });

    return { subscriptions: data.subscriptions };
  }
}
