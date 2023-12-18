export const useDirectorsRegistryProvidedBlock = directorsRegistryProvided => {
  if (!Array.isArray(directorsRegistryProvided) || !directorsRegistryProvided?.length) {
    return [];
  }

  return [
    {
      cells: [
        {
          type: 'heading',
          value: 'Directors',
        },
        {
          type: 'subheading',
          value: 'Registry-provided Data',
          props: {
            className: 'mb-4',
          },
        },
        {
          type: 'table',
          value: {
            columns: [
              {
                accessorKey: 'name',
                header: 'Name',
              },
              {
                accessorKey: 'position',
                header: 'Position',
              },
            ],
            data: directorsRegistryProvided,
          },
        },
      ],
    },
  ];
};
