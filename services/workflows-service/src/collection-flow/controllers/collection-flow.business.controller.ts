import { BusinessService } from '@/business/business.service';
import { Controller, Get, Query } from '@nestjs/common';
import { GetBusinessInformationDto } from '../dto/get-business-information-input.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import { UseWorkflowAuthGuard } from '@/common/guards/workflow-guard/workflow-auth.decorator';

@UseWorkflowAuthGuard()
@ApiExcludeController()
@Controller('collection-flow/business')
export class CollectionFlowBusinessController {
  constructor(protected readonly businessService: BusinessService) {}

  @Get('/business-information')
  getCompanyInfo(@Query() query: GetBusinessInformationDto) {
    const { countryCode, state, vendor, registrationNumber } = query;

    const jurisdictionCode = this.buildJurisdictionCode(countryCode, state);

    return this.businessService.fetchCompanyInformation({
      registrationNumber,
      jurisdictionCode,
      vendor,
    });
  }

  private buildJurisdictionCode(country: string, state?: string | null): string {
    return [country, state].filter(Boolean).join('-');
  }
}
