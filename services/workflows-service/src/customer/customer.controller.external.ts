import { CustomerSubscriptionSchema } from './schemas/zod-schemas';
import * as common from '@nestjs/common';
import { Request, UseGuards, UsePipes } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { CustomerService } from '@/customer/customer.service';
import { Customer } from '@prisma/client';
import { CustomerModel } from '@/customer/customer.model';
import { AuthenticatedEntity } from '@/types';
import { CustomerAuthGuard } from '@/common/guards/customer-auth.guard';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { CustomerSubscriptionDto } from './dtos/customer-config-create.dto';
import { ValidationError } from '@/errors';

@swagger.ApiTags('Customers')
@swagger.ApiExcludeController()
@common.Controller('external/customers')
export class CustomerControllerExternal {
  constructor(protected readonly service: CustomerService) {}

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
