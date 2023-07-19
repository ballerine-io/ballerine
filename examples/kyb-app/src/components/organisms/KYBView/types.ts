export interface PersonalInformationContext {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
}

export interface DocumentsContext {
  information: {
    registrationNumber: string;
    website: string;
  };
  address: {
    address: string;
  };
  documents: {
    registrationCertificate: string;
    addressProof: string;
  };
  shareholders: {
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

export interface KYBContext {
  personalInformation: PersonalInformationContext | null;
  documents: DocumentsContext | null;
  shared: {
    endUserId?: string;
    businessId?: string;
  };
}
