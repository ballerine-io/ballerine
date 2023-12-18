export const useWebsiteBasicRequirementBlock = ({ websiteBasicRequirement, workflow }) => {
  if (Object.keys(websiteBasicRequirement ?? {}).length === 0) {
    return [];
  }

  return [
    {
      cells: [
        {
          type: 'heading',
          value: 'Website Basic Requirement',
        },
        {
          type: 'subheading',
          value: 'User-provided Data',
        },
        {
          type: 'details',
          value: {
            data: Object.entries(websiteBasicRequirement)?.map(([title, value]) => ({
              title,
              value,
              isEditable: false,
            })),
          },
          workflowId: workflow?.id,
          documents: workflow?.context?.documents,
          hideSeparator: true,
        },
      ],
    },
  ];
};
