import { applyDecorators, UseGuards } from '@nestjs/common';

import { disableDefaultAuth } from '@/common/disable-default-auth';
import { TokenWithoutEnduserAuthGuard } from './token-without-enduser-auth.guard';

export const UseTokenWithoutEnduserAuthGuard = () =>
  applyDecorators(UseGuards(TokenWithoutEnduserAuthGuard), disableDefaultAuth());
