export const useProcessingDetailsBlock = ({ processingDetails, workflow }) => {
  if (Object.keys(processingDetails ?? {}).length === 0) {
    return [];
  }

  return [
    {
      name: 'processing-details',
      cells: [
        {
          type: 'heading',
          value: 'Processing details',
        },
        {
          type: 'subheading',
          value: 'User-provided Data',
        },
        {
          type: 'details',
          value: {
            data: Object.entries(processingDetails)?.map(([title, value]) => ({
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
