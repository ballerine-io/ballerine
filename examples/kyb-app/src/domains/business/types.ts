export interface UpdateBusinessDto {
  businessId: string;
  companyName?: string;
  registrationNumber?: string;
  address?: string;
  website?: string;
}

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
