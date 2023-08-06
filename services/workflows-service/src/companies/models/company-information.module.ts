export interface TCompanyInformation {
  name: string;
  companyNumber: string;
  jurisdictionCode: string;
  incorporationDate: string;
  companyType: string;
}

export class CompanyInformationModel {
  name!: string;
  companyNumber!: string;
  companyType!: string;
  jurisdictionCode!: string;
  vat!: string;
  incorporationDate!: string;
}
