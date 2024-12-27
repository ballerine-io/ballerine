export type UboToEntityAdapter = (ubo: Record<string, any>) => {
  id: string;
  type: 'individual';
  variant: 'ubo';
  data: {
    firstName: string;
    lastName: string;
    email: string;
    nationalId: string;
    percentageOfOwnership: number;
    additionalInfo: {
      fullAddress: string;
      nationality: string;
      companyName: string;
      customerCompany: string;
    };
  };
};
