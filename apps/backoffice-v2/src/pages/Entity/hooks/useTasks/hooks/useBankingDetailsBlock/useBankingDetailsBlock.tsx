export const useBankingDetailsBlock = ({ bankDetails, workflow }) => {
  if (Object.keys(bankDetails ?? {}).length === 0) {
    return [];
  }

  return [
    {
      cells: [
        {
          type: 'heading',
          value: 'Banking details',
        },
        {
          type: 'subheading',
          value: 'User-provided Data',
        },
        {
          type: 'details',
          value: {
            data: Object.entries(bankDetails)?.map(([title, value]) => ({
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
