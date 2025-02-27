import { Module } from '@nestjs/common';
import { MerchantMonitoringClient } from './merchant-monitoring.client';

@Module({
  providers: [MerchantMonitoringClient],
  exports: [MerchantMonitoringClient],
})
export class MerchantMonitoringModule {}
