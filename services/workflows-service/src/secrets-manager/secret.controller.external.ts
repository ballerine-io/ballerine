import * as common from '@nestjs/common';

import { SecretsManagerFactory } from '@/secrets-manager/secrets-manager.factory';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type Static, Type } from '@sinclair/typebox';
import { Validate } from 'ballerine-nestjs-typebox';
import type { TProjectId } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { env } from '@/env';
import { CustomerService } from '@/customer/customer.service';
import { CreateSecretInputSchema } from '@/secrets-manager/schemas/create-secret-input-schema';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { Res } from '@nestjs/common';
import express from 'express';

@ApiTags('Secrets')
@common.Controller('external/secrets')
export class SecretControllerExternal {
  @common.Get('')
  @UseCustomerAuthGuard()
  @ApiBearerAuth()
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @ApiResponse({
    status: 200,
    description: 'All secrets returned successfully',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @ApiOperation({
    summary: 'List all secrets',
    description: "An endpoint that returns all the current customer's secrets",
  })
  async list(@CurrentProject() projectId: TProjectId) {
    const customer = await this.customerService.getByProjectId(projectId);

    const secretsManager = this.secretsManagerFactory.create({
      provider: env.SECRETS_MANAGER_PROVIDER,
      customerId: customer.id,
    });

    return await secretsManager.getAll();
  }

  constructor(
    private readonly secretsManagerFactory: SecretsManagerFactory,
    private readonly customerService: CustomerService,
  ) {}

  @common.Post('')
  @UseCustomerAuthGuard()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Set a secret',
    description: 'An endpoint that sets a secret for the current customer',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @ApiResponse({
    status: 204,
    description: 'Secret set successfully',
  })
  @Validate({
    request: [
      {
        type: 'body',
        schema: CreateSecretInputSchema,
      },
    ],
  })
  async create(
    @common.Body() { key, value }: Static<typeof CreateSecretInputSchema>,
    @CurrentProject() currentProjectId: TProjectId,
    @Res() res: express.Response,
  ): Promise<any> {
    const customer = await this.customerService.getByProjectId(currentProjectId);

    const secretsManager = this.secretsManagerFactory.create({
      provider: env.SECRETS_MANAGER_PROVIDER,
      customerId: customer.id,
    });

    await secretsManager.set({ [key]: value });

    res.status(204).send();
  }

  @common.Delete('/:key')
  @UseCustomerAuthGuard()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a secret',
    description: 'An endpoint that deletes a secret for the current customer',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @ApiResponse({
    status: 204,
    description: 'Secret deleted successfully',
  })
  async delete(
    @common.Param('key') key: string,
    @CurrentProject() projectId: TProjectId,
    @Res() res: express.Response,
  ) {
    const customer = await this.customerService.getByProjectId(projectId);

    const secretsManager = this.secretsManagerFactory.create({
      provider: env.SECRETS_MANAGER_PROVIDER,
      customerId: customer.id,
    });

    await secretsManager.delete(key);

    res.status(204).send();
  }
}
