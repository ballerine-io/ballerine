export const useKybRegistryInfoBlock = ({ pluginsOutput, workflow }) => {
  if (Object.keys(pluginsOutput?.businessInformation?.data?.[0] ?? {}).length === 0) {
    return [];
  }

  return [
    {
      cells: [
        {
          type: 'container',
          value: [
            {
              id: 'nested-details-heading',
              type: 'heading',
              value: 'Registry Information',
            },
            {
              type: 'subheading',
              value: 'Registry-provided data',
            },
          ],
        },
        {
          type: 'details',
          hideSeparator: true,
          value: {
            data: Object.entries(pluginsOutput?.businessInformation?.data?.[0])?.map(
              ([title, value]) => ({
                title,
                value,
              }),
            ),
          },
          workflowId: workflow?.id,
          documents: workflow?.context?.documents,
        },
      ],
    },
  ];
};
