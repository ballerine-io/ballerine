import * as common from '@nestjs/common';

import { SecretsManagerFactory } from '@/secrets-manager/secrets-manager.factory';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { type Static, Type } from '@sinclair/typebox';
import { Validate } from 'ballerine-nestjs-typebox';
import type { TProjectId } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { env } from '@/env';
import { CustomerService } from '@/customer/customer.service';
import { CreateSecretInputSchema } from '@/secrets-manager/schemas/create-secret-input-schema';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';

@ApiTags('Secrets')
@common.Controller('external/secrets')
export class SecretControllerExternal {
  constructor(
    private readonly secretsManagerFactory: SecretsManagerFactory,
    private readonly customerService: CustomerService,
  ) {}

  @UseCustomerAuthGuard()
  @common.Post('')
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @Validate({
    request: [
      {
        type: 'body',
        schema: CreateSecretInputSchema,
      },
    ],
    response: Type.Any(),
  })
  async create(
    @common.Body() { secrets }: Static<typeof CreateSecretInputSchema>,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const customer = await this.customerService.getByProjectId(currentProjectId);

    const secretsManager = this.secretsManagerFactory.create({
      provider: env.SECRETS_MANAGER_PROVIDER,
      customerId: customer.id,
    });

    await secretsManager.set(secrets);
  }
}
