export const useUbosBlock = ubos => {
  if (!Array.isArray(ubos) || !ubos?.length) {
    return [];
  }

  return [
    {
      cells: [
        {
          type: 'heading',
          value: 'UBOs',
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
                accessorKey: 'percentage',
                header: 'Percentage (25% or higher)',
              },
              {
                accessorKey: 'type',
                header: 'Type',
              },
              {
                accessorKey: 'level',
                header: 'Level',
              },
            ],
            data: ubos?.map(({ name, percentage, type, level }) => ({
              name,
              percentage,
              type,
              level,
            })),
          },
        },
      ],
    },
  ];
};
