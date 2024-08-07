import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { valueOrNA } from '../../../../../../../packages/common/src/utils/value-or-na/value-or-na';
import { toTitleCase } from 'string-ts';

export const useAddressBlock = ({
  address,
  entityType,
  workflow,
}: {
  address: string | Record<string, string>;
  entityType: string;
  workflow: TWorkflowById;
}) => {
  return useMemo(() => {
    if (!address || Object.keys(address ?? {})?.length === 0) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'container',
        props: {
          className: 'grid grid-cols-2',
        },
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'header',
            type: 'heading',
            value: `${valueOrNA(toTitleCase(entityType ?? ''))} Address`,
          })
          .addCell({
            type: 'subheading',
            value: 'User-Provided Data',
            props: {
              className: 'mb-4 col-span-full',
            },
          })
          .addCell({
            type: 'details',
            hideSeparator: true,
            value: {
              title: `${valueOrNA(toTitleCase(entityType ?? ''))} Address`,
              data:
                typeof address === 'string'
                  ? [
                      {
                        title: 'Address',
                        value: address,
                        isEditable: false,
                      },
                    ]
                  : Object.entries(address ?? {})?.map(([title, value]) => ({
                      title,
                      value,
                      isEditable: false,
                    })),
            },
            workflowId: workflow?.id,
            documents: workflow?.context?.documents,
          })
          .build()
          .flat(1),
      })
      .build();
  }, [address, entityType, workflow?.id, workflow?.context?.documents]);
};
