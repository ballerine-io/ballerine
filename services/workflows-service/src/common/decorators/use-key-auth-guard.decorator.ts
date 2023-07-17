import { disableSessionAuth } from '@/common/disable-session-auth';
import { DemoGuard } from '@/common/guards/demo.guard';
import { KeyAuthGuard } from '@/common/guards/key-auth.guard';
import { env } from '@/env';
import { applyDecorators, UseGuards } from '@nestjs/common';

export const UseKeyAuthGuard = () =>
  applyDecorators(UseGuards(env.IS_DEMO ? DemoGuard : KeyAuthGuard), disableSessionAuth());
