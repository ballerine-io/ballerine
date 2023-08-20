import { disableSessionAuth } from '@/common/disable-session-auth';
import { DemoGuard } from '@/common/guards/demo.guard';
import { KeyAuthGuard } from '@/common/guards/key-auth.guard';
import { env } from '@/env';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { VerifyUnifiedApiSignatureGuard } from '@/common/guards/verify-unified-api-signature.guard';

export const VerifyUnifiedApiSignatureDecorator = () =>
  applyDecorators(UseGuards(VerifyUnifiedApiSignatureGuard), disableSessionAuth());
