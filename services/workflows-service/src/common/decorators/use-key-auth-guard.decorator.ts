import { disableSessionAuth } from '@/common/disable-session-auth';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { KeyAuthGuard } from '@/auth/key-auth.guard';

export const UseKeyAuthGuard = () => applyDecorators(UseGuards(KeyAuthGuard), disableSessionAuth());
