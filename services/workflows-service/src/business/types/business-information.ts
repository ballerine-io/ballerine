export interface TCompanyInformation {
  name: string;
  companyNumber: string;
  jurisdictionCode: string;
  incorporationDate: string;
  companyType: string;
}

export interface FetchCompanyInformationParams {
  jurisdictionCode: string;
  registrationNumber: string;
  vendor?: string;
}
