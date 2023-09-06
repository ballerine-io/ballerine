import { Module } from '@nestjs/common';
import { SalesforceController } from '@/salesforce/salesforce.controller';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';

@Module({
  controllers: [SalesforceController],
  providers: [SalesforceService, SalesforceIntegrationRepository],
})
export class SalesforceModule {}
