export interface TBusinessInformation {
  name: string;
  companyNumber: string;
  companyType: string;
  jurisdictionCode: string;
  incorporationDate: string;
}

export interface GetBusinessInformationDto {
  jurisdictionCode: string;
  registrationNumber: string;
}
