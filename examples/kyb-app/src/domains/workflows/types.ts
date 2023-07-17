export interface RunWorkflowDto {
  workflowId: string;
  context: {
    entity: {
      id?: string;
      endUserId: string;
      ballerineEntityId: string;
      type: 'business';
      data: {
        website: string;
        correlationId?: string;
        companyName: string;
        address: {
          street?: string;
          postalCode?: string;
          city?: string;
          countryCode?: string;
          country?: string;
          text?: string;
        };
        registrationNumber: string;
        additionalInfo?: {
          ubos: [
            {
              entity: {
                type: string; //'individual';
                data: {
                  firstName: string;
                  lastName: string;
                  email: string;
                  additionalInfo: {
                    companyName: string;
                    customerCompany?: string;
                  };
                };
              };
            },
          ];
        };
      };
    };
  };
}
