import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntity/utils';

export const useDirectorsUserProvidedBlock = directorsUserProvided => {
  if (Object.keys(directorsUserProvided ?? {}).length === 0) {
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
          value: 'User-provided Data',
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
                accessorKey: 'nationality',
                header: 'Nationality',
              },
              {
                accessorKey: 'identityNumber',
                header: 'Identity number',
              },
              {
                accessorKey: 'email',
                header: 'Email',
              },
              {
                accessorKey: 'address',
                header: 'Address',
              },
            ],
            data: directorsUserProvided?.map(
              ({ firstName, lastName, nationalId: identityNumber, additionalInfo, ...rest }) => ({
                ...rest,
                name: `${firstName} ${lastName}`,
                address: additionalInfo?.fullAddress,
                nationality: additionalInfo?.nationality,
                identityNumber,
                ...omitPropsFromObject(additionalInfo, 'fullAddress', 'nationality'),
              }),
            ),
          },
        },
      ],
    },
  ];
};
