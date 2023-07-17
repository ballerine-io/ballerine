export interface UpdateBusinessDto {
  businessId: string;
  companyName?: string;
  registrationNumber?: string;
  address?: string;
  website?: string;
  documents?: {
    registrationDocument?: string;
    financialStatement?: string;
  };
  shareholderStructure?: { name: string }[];
}
