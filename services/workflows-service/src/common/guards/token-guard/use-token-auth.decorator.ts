import { applyDecorators, UseGuards } from '@nestjs/common';
import { disableSessionAuth } from '@/common/disable-session-auth';
import { TokenAuthGuard } from '@/common/guards/token-guard/token-auth.guard';

export const UseTokenAuthGuard = () =>
  applyDecorators(UseGuards(TokenAuthGuard), disableSessionAuth());
