import { useMemo } from 'react';
import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useUbosUserProvidedBlock = ubosUserProvided => {
  return useMemo(() => {
    if (Object.keys(ubosUserProvided ?? {}).length === 0) {
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
            value: 'UBOs',
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
                  accessorKey: 'percentageOfOwnership',
                  header: '% of Ownership',
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
              data: ubosUserProvided?.map(
                ({
                  firstName,
                  lastName,
                  nationalId: identityNumber,
                  additionalInfo,
                  percentageOfOwnership,
                  ...rest
                }) => ({
                  ...rest,
                  name: `${firstName} ${lastName}`,
                  address: additionalInfo?.fullAddress,
                  nationality: additionalInfo?.nationality,
                  percentageOfOwnership: additionalInfo?.percentageOfOwnership,
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
  }, [ubosUserProvided]);
};
