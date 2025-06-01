import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { userCreatedIconCell } from '@/lib/blocks/utils/constants';

export const useAddressBlock = ({
  address,
  title,
  workflow,
}: {
  address: string | Record<string, string>;
  title: string;
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
        value: createBlocksTyped()
          .addBlock()
          .addCell(userCreatedIconCell)
          .addCell({
            type: 'container',
            value: createBlocksTyped()
              .addBlock()
              .addCell({
                id: 'header',
                type: 'heading',
                value: title,
                props: {
                  className: 'mt-0',
                },
              })
              .addCell({
                type: 'subheading',
                value: 'User-Provided Data',
              })
              .buildFlat(),
          })
          .buildFlat(),
        props: {
          className: 'flex space-x-1 items-center mt-4',
        },
      })
      .addCell({
        type: 'details',
        hideSeparator: true,
        value: {
          title,
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
        props: {
          config: {
            sort: { predefinedOrder: ['street', 'streetNumber', 'city', 'country'] },
          },
        },
        workflowId: workflow?.id,
        documents: workflow?.context?.documents?.map(
          ({ details: _details, ...document }) => document,
        ),
        isDocumentsV2: !!workflow?.workflowDefinition?.config?.isDocumentsV2,
      })
      .build();
  }, [address, title, workflow?.id, workflow?.context?.documents]);
};
