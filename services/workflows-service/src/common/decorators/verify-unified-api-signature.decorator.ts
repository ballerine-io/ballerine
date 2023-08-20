import { disableSessionAuth } from '@/common/disable-session-auth';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { VerifyUnifiedApiSignatureGuard } from '@/common/guards/verify-unified-api-signature.guard';

export const VerifyUnifiedApiSignatureDecorator = () =>
  applyDecorators(UseGuards(VerifyUnifiedApiSignatureGuard), disableSessionAuth());
