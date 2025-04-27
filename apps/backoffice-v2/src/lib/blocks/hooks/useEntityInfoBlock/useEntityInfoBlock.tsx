import { TWorkflowById } from '@/domains/workflows/fetchers';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { valueOrNA } from '@ballerine/common';
import { useMemo } from 'react';
import { titleCase } from 'string-ts';

export const useEntityInfoBlock = ({
  entity,
  workflow,
  onEdit,
  isEditDisabled,
}: {
  entity: TWorkflowById['context']['entity'];
  workflow: TWorkflowById;
  onEdit: () => void;
  isEditDisabled: boolean;
}) => {
  const predefinedOrder = useMemo(
    () =>
      workflow?.workflowDefinition?.config?.uiOptions?.backoffice?.blocks?.businessInformation
        ?.predefinedOrder ?? [],
    [
      workflow?.workflowDefinition?.config?.uiOptions?.backoffice?.blocks?.businessInformation
        ?.predefinedOrder,
    ],
  );

  return useMemo(() => {
    const entityData = omitPropsFromObject(entity?.data ?? {}, 'additionalInfo', 'address');

    if (Object.keys(entityData ?? {}).length === 0) {
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
            props: {
              className: 'flex justify-between space-x-4 py-4',
            },
            value: createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'container',
                value: createBlocksTyped()
                  .addBlock()
                  .addCell({
                    type: 'heading',
                    value: `${valueOrNA(titleCase(entity?.type ?? ''))} Information`,
                  })
                  .addCell({
                    type: 'subheading',
                    value: 'User-Provided Data',
                  })
                  .buildFlat(),
              })
              .addCell({
                type: 'callToAction',
                value: {
                  text: 'Edit',
                  onClick: onEdit,
                  props: {
                    disabled: isEditDisabled,
                    variant: 'outline',
                    className:
                      'px-2 py-0 text-xs aria-disabled:pointer-events-none aria-disabled:opacity-50 min-w-[3.9169rem]',
                  },
                },
              })
              .buildFlat(),
          })
          .addCell({
            id: 'entity-details',
            type: 'details',
            hideSeparator: true,
            value: {
              id: 'entity-details-value',
              title: `${valueOrNA(titleCase(entity?.type ?? ''))} Information`,
              data: Object.entries(entityData)
                ?.map(([title, value]) => ({
                  title,
                  value,
                  type: 'string',
                  isEditable: false,
                }))
                // removing private properties from list (__kyb_snapshot in this case)
                // __kyb_snapshot is state of KYB,temp solution
                // payload is not for users so removing it
                // TO DO: Remove this as soon as BE updated
                .filter(elem => !elem.title.startsWith('__')),
            },
            props: { config: { sort: { predefinedOrder } } },
            workflowId: workflow?.id,
            documents: workflow?.context?.documents?.map(
              ({ details: _details, ...document }) => document,
            ),
            isDocumentsV2: !!workflow?.workflowDefinition?.config?.isDocumentsV2,
          })
          .buildFlat(),
      })
      .build();
  }, [entity, workflow]);
};
