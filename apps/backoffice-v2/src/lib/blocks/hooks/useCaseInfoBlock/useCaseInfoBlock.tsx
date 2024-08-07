import { valueOrNA } from '../../../../../../../packages/common/src/utils/value-or-na/value-or-na';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { useMemo } from 'react';
import { toTitleCase } from 'string-ts';

export const useCaseInfoBlock = ({
  entity,
  workflow,
  entityDataAdditionalInfo,
}: {
  entity: TWorkflowById['context']['entity'];
  workflow: TWorkflowById;
  entityDataAdditionalInfo: TWorkflowById['context']['entity']['data']['additionalInfo'];
}) => {
  return useMemo(() => {
    const entityDetails = [
      ...Object.entries(omitPropsFromObject(entity?.data, 'additionalInfo', 'address') ?? {}),
      ...Object.entries(omitPropsFromObject(entityDataAdditionalInfo ?? {}, 'ubos')),
    ];

    if (Object.keys(entityDetails ?? {}).length === 0) {
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
              .addCell({
                type: 'heading',
                value: `${valueOrNA(toTitleCase(entity?.type ?? ''))} Information`,
              })
              .addCell({
                type: 'subheading',
                value: 'User-Provided Data',
              })
              .build()
              .flat(1),
          })
          .addCell({
            id: 'entity-details',
            type: 'details',
            hideSeparator: true,
            value: {
              id: 'entity-details-value',
              title: `${valueOrNA(toTitleCase(entity?.type ?? ''))} Information`,
              data: entityDetails
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
            workflowId: workflow?.id,
            documents: workflow?.context?.documents,
          })
          .build()
          .flat(1),
      })
      .build();
  }, [entity, workflow, entityDataAdditionalInfo]);
};
