import { forwardRef, Module } from '@nestjs/common';
import { UnifiedApiClient } from '@/common/utils/unified-api-client/unified-api-client';
import { KycControllerExternal } from './kyc.controller.external';
import { HttpModule } from '@nestjs/axios';
import { KycService } from './kyc.service';
// eslint-disable-next-line import/no-cycle
import { EndUserModule } from '@/end-user/end-user.module';
import { EndUserService } from '@/end-user/end-user.service';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { ProjectScopeService } from '@/project/project-scope.service';
import { CustomerService } from '@/customer/customer.service';
import { CustomerRepository } from '@/customer/customer.repository';
import { MerchantMonitoringClient } from '@/merchant-monitoring/merchant-monitoring.client';

@Module({
  providers: [
    UnifiedApiClient,
    KycService,
    EndUserService,
    EndUserRepository,
    ProjectScopeService,
    CustomerService,
    CustomerRepository,
    MerchantMonitoringClient,
  ],
  imports: [HttpModule, forwardRef(() => EndUserModule)],
  controllers: [KycControllerExternal],
  exports: [KycService],
})
export class KycModule {}
