import { Module } from '@nestjs/common';
import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';
import { KycControllerExternal } from './kyc.controller.external';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [UnifiedApiClient],
  imports: [HttpModule],
  controllers: [KycControllerExternal],
  exports: [],
})
export class KycModule {}
