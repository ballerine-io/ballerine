import { disableSessionAuth } from '@/common/disable-session-auth';
import { DemoGuard } from '@/common/guards/demo.guard';
import { env } from '@/env';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { CustomerAuthGuard } from '@/common/guards/customer-auth.guard';

export const UseCustomerAuthGuard = () =>
  applyDecorators(UseGuards(env.IS_DEMO ? DemoGuard : CustomerAuthGuard), disableSessionAuth());
