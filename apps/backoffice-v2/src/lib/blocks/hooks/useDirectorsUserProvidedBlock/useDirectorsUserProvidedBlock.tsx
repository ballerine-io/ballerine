import { useMemo } from 'react';
import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useDirectorsUserProvidedBlock = directorsUserProvided => {
  return useMemo(() => {
    if (Object.keys(directorsUserProvided ?? {}).length === 0) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'heading',
            value: 'Directors',
          })
          .addCell({
            type: 'subheading',
            value: 'User-Provided Data',
            props: {
              className: 'mb-4',
            },
          })
          .addCell({
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
          })
          .build()
          .flat(1),
      })
      .build();
  }, [directorsUserProvided]);
};
