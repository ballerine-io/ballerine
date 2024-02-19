import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useProcessingDetailsBlock = ({ processingDetails, workflow }) => {
  return useMemo(() => {
    if (Object.keys(processingDetails ?? {}).length === 0) {
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
            value: 'Processing details',
          })
          .addCell({
            type: 'subheading',
            value: 'User-Provided Data',
          })
          .addCell({
            type: 'details',
            value: {
              data: Object.entries(processingDetails)?.map(([title, value]) => ({
                title,
                value,
                isEditable: false,
              })),
            },
            workflowId: workflow?.id,
            documents: workflow?.context?.documents,
            hideSeparator: true,
          })
          .build()
          .flat(1),
      })
      .build();
  }, [processingDetails, workflow]);
};
