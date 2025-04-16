import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useEditCollectionFlow } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useEditCollectionFlow';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { valueOrNA } from '@ballerine/common';
import { useMemo } from 'react';
import { titleCase } from 'string-ts';

export const useEntityInfoBlock = ({
  entity,
  workflow,
}: {
  entity: TWorkflowById['context']['entity'];
  workflow: TWorkflowById;
}) => {
  const { onEditCollectionFlow } = useEditCollectionFlow();
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user ?? null, workflow);
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
                  onClick: onEditCollectionFlow({ steps: ['company_details'] }),
                  props: {
                    disabled: [!caseState.actionButtonsEnabled].some(Boolean),
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
          .build()
          .flat(1),
      })
      .build();
  }, [entity, workflow]);
};
