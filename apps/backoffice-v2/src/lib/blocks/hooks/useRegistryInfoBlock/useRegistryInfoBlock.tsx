export const useRegistryInfoBlock = ({ pluginsOutputKeys, filteredPluginsOutput, workflow }) => {
  if (Object.keys(filteredPluginsOutput ?? {}).length === 0) {
    return [];
  }

  return pluginsOutputKeys
    ?.filter(
      key =>
        !!Object.keys(filteredPluginsOutput[key] ?? {})?.length &&
        !('error' in filteredPluginsOutput[key]),
    )
    ?.map((key, index, collection) => ({
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
          hideSeparator: index === collection.length - 1,
          value: {
            data: Object.entries(filteredPluginsOutput[key] ?? {})?.map(([title, value]) => ({
              title,
              value,
            })),
          },
          workflowId: workflow?.id,
          documents: workflow?.context?.documents,
        },
      ],
    }));
};
