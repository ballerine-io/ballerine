import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import {CustomerService} from '@/customer/customer.service';
import {Customer, Prisma} from '@prisma/client';
import {CustomerCreateDto} from '@/customer/dtos/customer-create';
import {Request, UseGuards} from "@nestjs/common";
import {AdminAuthGuard} from "@/common/guards/admin-auth.guard";
import {CustomerModel} from "@/customer/customer.model";
import {AuthenticatedEntity} from "@/types";
import {CustomerAuthGuard} from "@/common/guards/customer-auth.guard";


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
    const {projectName, ...customer } = customerCreateModel
    if (projectName) {
      (customer as Prisma.CustomerCreateInput).projects = {create: {name: customerCreateModel.projectName!}}
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

  @common.Get()
  @UseGuards(CustomerAuthGuard)
  @swagger.ApiOkResponse({ type: [CustomerModel] })
  @swagger.ApiForbiddenResponse()
  find(
    @Request() req: any
  ): Partial<Customer> {
    return (req.user as AuthenticatedEntity).customer!
  }
}
