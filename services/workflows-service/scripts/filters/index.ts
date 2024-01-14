export const baseFilterDefinitionSelect = {
  workflowDefinition: {
    select: {
      id: true,
      name: true,
      contextSchema: true,
      documentsSchema: true,
      config: true,
      definition: true,
      variant: true,
      version: true,
    },
  },
} as const;

export const baseFilterBusinessSelect = {
  business: {
    select: {
      id: true,
      companyName: true,
      registrationNumber: true,
      legalForm: true,
      countryOfIncorporation: true,
      dateOfIncorporation: true,
      address: true,
      phoneNumber: true,
      email: true,
      website: true,
      industry: true,
      taxIdentificationNumber: true,
      vatNumber: true,
      shareholderStructure: true,
      numberOfEmployees: true,
      businessPurpose: true,
      documents: true,
      approvalState: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const;

export const baseFilterEndUserSelect = {
  endUser: {
    select: {
      id: true,
      correlationId: true,
      endUserType: true,
      approvalState: true,
      stateReason: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      avatarUrl: true,
      additionalInfo: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

export const baseFilterAssigneeSelect = {
  assignee: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
    },
  },
} as const;
