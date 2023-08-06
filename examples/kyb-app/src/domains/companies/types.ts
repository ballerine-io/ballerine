export interface TCompanyInformation {
  name: string;
  companyNumber: string;
  companyType: string;
  jurisdictionsCode: string;
}

export interface GetCompanyInformationDto {
  jurisdictionCode: string;
  registrationNumber: string;
}
