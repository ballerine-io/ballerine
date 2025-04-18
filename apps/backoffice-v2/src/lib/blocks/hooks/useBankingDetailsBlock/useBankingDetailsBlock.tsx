import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { FileText } from 'lucide-react';

export const useBankingDetailsBlock = ({ bankDetails, workflow }) => {
  return useMemo(() => {
    if (Object.keys(bankDetails ?? {}).length === 0) {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'block',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'emptyPlaceholder',
              props: {
                title: 'Banking details',
                description: 'Banking details are being collected or not provided.',
                icon: <FileText size={68} />,
                className: 'px-3',
              },
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
  }, [bankDetails, workflow]);
};
