import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { FetchCompanyInformationParams, TCompanyInformation } from '@/companies/companies.types';
import { CompanyInformationModel } from '@/companies/models/company-information.module';
import { env } from '@/env';
import { HttpService } from '@nestjs/axios';
import * as common from '@nestjs/common';
import { AxiosError } from 'axios';
import { plainToClass } from 'class-transformer';
import { lastValueFrom } from 'rxjs';

@common.Injectable()
export class CompaniesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: AppLoggerService,
  ) {}

  async fetchCompanyInformation({
    registrationNumber,
    jurisdictionCode,
    vendor = 'open-corporates',
  }: FetchCompanyInformationParams): Promise<CompanyInformationModel> {
    this.logger.log(`Starting company information fetch`, {
      registrationNumber,
      jurisdictionCode,
      vendor,
    });

    try {
      const request$ = this.httpService.get<TCompanyInformation>(
        `${env.UNIFIED_API_URL}/companies/${jurisdictionCode}/${registrationNumber}`,
        { params: { vendor } },
      );
      const result = (await lastValueFrom(request$)).data;

      this.logger.log('Finished company information fetch');

      const companyInformation = plainToClass(CompanyInformationModel, {
        name: result.name,
        companyNumber: result.companyType,
        companyType: result.companyType,
        jurisdictionCode: result.jurisdictionCode,
        incorporationDate: result.incorporationDate,
        vat: '',
      });

      return companyInformation;
    } catch (e) {
      if (e instanceof AxiosError) {
        const axiosError = e as AxiosError;
        this.logger.error(`Failed to fetch company information.Error ${axiosError.message}`);

        if (axiosError.status === 500) {
          throw new common.InternalServerErrorException();
        }

        throw axiosError;
      }

      throw e;
    }
  }
}
