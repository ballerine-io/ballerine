export interface TCompanyInformation {
  name: string;
  companyNumber: string;
  companyType: string;
  jurisdictionCode: string;
  incorporationDate: string;
}

export interface GetCompanyInformationDto {
  jurisdictionCode: string;
  registrationNumber: string;
}
