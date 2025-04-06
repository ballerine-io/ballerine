import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

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
        props: {
          className: 'grid grid-cols-2',
        },
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'header',
            type: 'heading',
            value: title,
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
          .build()
          .flat(1),
      })
      .build();
  }, [address, title, workflow?.id, workflow?.context?.documents]);
};
