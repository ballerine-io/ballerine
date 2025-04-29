import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

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
            type: 'heading',
            value: 'Banking details',
          })
          .addCell({
            type: 'paragraph',
            value: 'Banking details are being collected or not provided.',
          })
          .build()
          .flat(1),
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
            type: 'heading',
            value: 'Banking details',
          })
          .addCell({
            type: 'subheading',
            value: 'User-Provided Data',
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
