import * as common from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { CustomerService } from '@/customer/customer.service';
import { CustomerModel } from '@/customer/customer.model';
import type { TProjectIds } from '@/types';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { TCustomerWithDefinitionsFeatures } from '@/customer/types';

@swagger.ApiExcludeController()
@common.Controller('internal/customers')
export class CustomerControllerInternal {
  constructor(protected readonly service: CustomerService) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [CustomerModel] })
  @swagger.ApiForbiddenResponse()
  async find(
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<TCustomerWithDefinitionsFeatures | null> {
    const projectId = projectIds?.[0];

    if (!projectId) throw new NotFoundException('Customer not found');

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
      },
    });
  }
}
