import { BusinessService } from '@/business/business.service';
import { BusinessInformation } from '@/business/dtos/business-information';
import { Public } from '@/common/decorators/public.decorator';
import { UseTokenAuthGuard } from '@/common/guards/token-guard/use-token-auth.decorator';
import { Controller, Get, Query } from '@nestjs/common';

@Public()
@UseTokenAuthGuard()
@Controller('collection-flow/business')
export class CollectionFlowBusinessController {
  constructor(protected readonly businessService: BusinessService) {}

  @Get('/business-information')
  getCompanyInfo(@Query() query: BusinessInformation) {
    const { jurisdictionCode, vendor, registrationNumber } = query;

    return this.businessService.fetchCompanyInformation({
      registrationNumber,
      jurisdictionCode,
      vendor,
    });
  }
}
