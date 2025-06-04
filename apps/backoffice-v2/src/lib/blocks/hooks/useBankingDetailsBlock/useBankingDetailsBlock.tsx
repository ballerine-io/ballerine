import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { userCreatedIconCell } from '@/lib/blocks/utils/constants';

export const useBankingDetailsBlock = ({ bankDetails, workflow }) => {
  const isEmpty = useMemo(() => Object.keys(bankDetails ?? {}).length === 0, [bankDetails]);

  const emptyBankDetailsBlock = useMemo(() => {
    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: createBlocksTyped()
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
                    value: 'Banking details',
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
            type: 'paragraph',
            value: 'Banking details are being collected or not provided.',
          })
          .buildFlat(),
      })
      .build();
  }, []);

  const bankingDetailsBlock = useMemo(() => {
    if (isEmpty) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: createBlocksTyped()
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
                    value: 'Banking details',
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
            value: {
              data: Object.entries(bankDetails)?.map(([title, value]) => ({
                title,
                value,
                isEditable: false,
              })),
            },
            workflowId: workflow?.id,
            documents: workflow?.context?.documents?.map(
              ({ details: _details, ...document }) => document,
            ),
            hideSeparator: true,
            isDocumentsV2: !!workflow?.workflowDefinition?.config?.isDocumentsV2,
          })
          .build()
          .flat(1),
      })
      .build();
  }, [bankDetails, workflow, isEmpty]);

  return isEmpty ? emptyBankDetailsBlock : bankingDetailsBlock;
};
