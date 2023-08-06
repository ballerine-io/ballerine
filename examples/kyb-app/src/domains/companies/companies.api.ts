import { request } from '@app/common/utils/request';
import { GetCompanyInformationDto, TCompanyInformation } from '@app/domains/companies/types';

export const fetchCompanyInformation = async ({
  registrationNumber,
  jurisdictionCode,
}: GetCompanyInformationDto): Promise<TCompanyInformation> => {
  const result = await request
    .get(`companies/${registrationNumber}`, {
      searchParams: { jurisdictionCode },
    })
    .json<TCompanyInformation>();

  return result;
};
