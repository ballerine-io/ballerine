import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { CustomerService } from '@/customer/customer.service';
import { CustomerModel } from '@/customer/customer.model';
import { Customer } from '@prisma/client';
import { TProjectId } from '@/types';
import { NotFoundException } from '@nestjs/common';
import { CurrentProject } from '@/common/decorators/current-project.decorator';

@swagger.ApiTags('internal/customers')
@common.Controller('internal/customers')
export class CustomerControllerInternal {
  constructor(protected readonly service: CustomerService) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [CustomerModel] })
  @swagger.ApiForbiddenResponse()
  async find(@CurrentProject() projectIds: TProjectId): Promise<Customer | null> {
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
}
