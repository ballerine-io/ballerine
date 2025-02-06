export type UboToEntityAdapter = (ubo: Record<string, any>) => {
  id: string;
  type: 'individual';
  variant: 'ubo';
  data: {
    firstName: string;
    lastName: string;
    email: string;
    percentageOfOwnership: number;
    role: string;
    phoneNumber: string;
    isAuthorizedSignatory: boolean;
    country: string;
    city: string;
    street: string;
    sourceOfWealth: string;
    sourceOfFunds: string;
    additionalInfo: {
      companyName: string;
      customerCompany: string;
    };
  };
};
