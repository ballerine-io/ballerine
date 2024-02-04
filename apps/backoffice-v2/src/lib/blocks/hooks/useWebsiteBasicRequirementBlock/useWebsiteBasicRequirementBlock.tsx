import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useWebsiteBasicRequirementBlock = ({ websiteBasicRequirement, workflow }) => {
  return useMemo(() => {
    if (Object.keys(websiteBasicRequirement ?? {}).length === 0) {
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
            value: 'Website Basic Requirement',
          })
          .addCell({
            type: 'subheading',
            value: 'User-Provided Data',
          })
          .addCell({
            type: 'details',
            value: {
              data: Object.entries(websiteBasicRequirement)?.map(([title, value]) => ({
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
  }, [websiteBasicRequirement, workflow]);
};
