export const generateBusinessesFilter = ({
  filterName,
  definitionId,
  projectId,
}: {
  filterName: string;
  definitionId: string;
  projectId: string;
}) => {
  return {
    name: filterName,
    entity: 'businesses',
    query: {
      select: {
        id: true,
        status: true,
        assigneeId: true,
        createdAt: true,
        context: true,
        state: true,
        tags: true,
        config: true,
        workflowDefinition: {
          select: {
            id: true,
            name: true,
            contextSchema: true,
            documentsSchema: true,
            config: true,
            definition: true,
            version: true,
          },
        },
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
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        childWorkflowsRuntimeData: true,
      },
      where: {
        workflowDefinitionId: { in: [definitionId] },
        businessId: { not: null },
      },
    },
    projectId: projectId,
  };
};
