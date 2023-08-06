import { UseKeyAuthGuard } from '@/common/decorators/use-key-auth-guard.decorator';
import { CompaniesService } from '@/companies/companies.serivce';
import { GetCompanyInfoDto } from '@/companies/dto/get-company-info.dto';
import { CompanyInformationModel } from '@/companies/models/company-information.module';
import * as common from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@common.Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseKeyAuthGuard()
  @common.Get('info/:registrationNumber')
  async getCompanyInfo(
    @common.Query() query: GetCompanyInfoDto,
    @common.Param('registrationNumber') registrationNumber: string,
  ) {
    const { jurisdictionCode, vendor } = query;

    // return this.companiesService.fetchCompanyInformation({
    //   registrationNumber,
    //   countryAlpha2Code: countryCode || state,
    // });

    return Promise.resolve(
      plainToClass(CompanyInformationModel, {
        name: 'PFIZER SERVICE COMPANY',
        companyNumber: '0478242365',
        companyType: 'Société à responsabilité limitée',
        jurisdictionCode: 'be',
        incorporationDate: '2002-09-02',
        vat: '',
      }),
    );
  }
}
