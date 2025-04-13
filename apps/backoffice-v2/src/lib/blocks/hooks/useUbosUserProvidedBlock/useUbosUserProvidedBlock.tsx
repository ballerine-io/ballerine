import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { Users } from 'lucide-react';
import { useMemo } from 'react';
import { ubosUserProvidedColumns } from './columns';
import { IUBOSUserProvided } from './types';

export const useUbosUserProvidedBlock = (ubosUserProvided: IUBOSUserProvided[]) => {
  return useMemo(() => {
    const isEmpty = !ubosUserProvided?.length;

    if (isEmpty) {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'block',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'node',
              value: (
                <div className="flex flex-col items-center justify-center rounded-lg  p-6 text-center">
                  <Users className="mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">No UBOs Available</h3>
                  <p className="text-sm text-gray-500">
                    UBO's information is being collected or not available
                  </p>
                </div>
              ),
            })
            .build()
            .flat(1),
        })
        .build();
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
              columns: ubosUserProvidedColumns,
              data: ubosUserProvided,
            },
          })
          .build()
          .flat(1),
      })
      .build();
  }, [ubosUserProvided]);
};
