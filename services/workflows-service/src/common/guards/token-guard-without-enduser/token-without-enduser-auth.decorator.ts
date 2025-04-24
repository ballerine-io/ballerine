import { applyDecorators, UseGuards } from '@nestjs/common';

import { disableSessionAuth } from '@/common/disable-session-auth';
import { TokenWithoutEnduserAuthGuard } from './token-without-enduser-auth.guard';

export const UseTokenWithoutEnduserAuthGuard = () =>
  applyDecorators(UseGuards(TokenWithoutEnduserAuthGuard), disableSessionAuth());
