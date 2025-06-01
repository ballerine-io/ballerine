import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { userCreatedIconCell } from '@/lib/blocks/utils/constants';

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
                    value: 'Website Basic Requirement',
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
              data: Object.entries(websiteBasicRequirement)?.map(([title, value]) => ({
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
          .buildFlat(),
      })
      .build();
  }, [websiteBasicRequirement, workflow]);
};
