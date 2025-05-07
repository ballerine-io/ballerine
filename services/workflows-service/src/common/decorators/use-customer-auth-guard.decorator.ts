import { disableDefaultAuth } from '@/common/disable-default-auth';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { CustomerAuthGuard } from '@/common/guards/customer-auth.guard';

export const UseCustomerAuthGuard = () =>
  applyDecorators(UseGuards(CustomerAuthGuard), disableDefaultAuth());
