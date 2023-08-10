import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import {CustomerService} from '@/customer/customer.service';
import {Prisma} from '@prisma/client';
import {CustomerCreateDto} from '@/customer/dtos/customer-create';
import {UseGuards} from "@nestjs/common";
import {AdminAuthGuard} from "@/common/guards/admin-auth.guard";


@swagger.ApiTags('external/customers')
@common.Controller('external/customers')
export class CustomerControllerExternal {
  constructor(protected readonly service: CustomerService) {
  }

  @common.Post()
  @UseGuards(AdminAuthGuard)
  @swagger.ApiCreatedResponse({type: [CustomerCreateDto]})
  @swagger.ApiForbiddenResponse()
  async create(@common.Body() customerCreateModel: CustomerCreateDto) {
    const customer: Prisma.CustomerCreateInput = customerCreateModel
    if (customerCreateModel.projectName) {
      customer.projects = {create: {name: customerCreateModel.projectName}}
    }

    return this.service.create({
      data: customer,
      select: {
        id: true,
        name: true,
        displayName: true,
        logoImageUri: true,
        country: true,
        language: true,
        customerStatus: true,
        projects: true
      },
    });
  }
}
