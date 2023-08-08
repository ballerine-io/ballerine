import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

import { UserCreateDto } from '@/user/dtos/user-create';
import {CustomerService} from "@/customer/customer.service";
import {CustomerModel} from "@/customer/customer.model";
import {Customer} from "@prisma/client";
import {CustomerCreateDto} from "@/customer/dtos/customer-create";

@swagger.ApiTags('internal/users')
@common.Controller('internal/users')
export class CustomerControllerInternal {
  constructor(protected readonly service: CustomerService) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [CustomerModel] })
  @swagger.ApiForbiddenResponse()
  async list(): Promise<Customer[]> {
    return this.service.list({
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
