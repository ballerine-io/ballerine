export const associatedCompanyToWorkflowAdapter = (associatedCompany: {
  companyName: string;
  registrationNumber: string;
  country: string;
  additionalInfo: {
    associationRelationship: string;
    mainRepresentative: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}) => {
  return {
    id: '',
    entity: {
      name: associatedCompany.companyName,
    },
    context: {
      entity: {
        data: {
          companyName: associatedCompany.companyName,
          registrationNumber: associatedCompany.registrationNumber,
          country: associatedCompany.country,
          additionalInfo: associatedCompany.additionalInfo,
        },
      },
    },
    nextEvents: [],
    tags: [],
    metadata: {
      collectionFlowUrl: '',
      token: '',
    },
  };
};
