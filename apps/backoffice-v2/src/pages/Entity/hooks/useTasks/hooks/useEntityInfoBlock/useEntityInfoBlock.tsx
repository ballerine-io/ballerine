import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import { toTitleCase } from 'string-ts';
import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntity/utils';

export const useEntityInfoBlock = ({ entity, workflow, entityDataAdditionalInfo }) => {
  if (Object.keys(entity?.data ?? {}).length === 0) {
    return [];
  }

  return [
    {
      type: 'block',
      value: [
        {
          type: 'container',
          value: [
            {
              type: 'heading',
              value: `${valueOrNA(toTitleCase(entity?.type ?? ''))} Information`,
            },
            {
              type: 'subheading',
              value: 'User-provided data',
            },
          ],
        },
        {
          id: 'entity-details',
          type: 'details',
          hideSeparator: true,
          value: {
            title: `${valueOrNA(toTitleCase(entity?.type ?? ''))} Information`,
            data: [
              ...Object.entries(
                omitPropsFromObject(entity?.data, 'additionalInfo', 'address') ?? {},
              ),
              ...Object.entries(omitPropsFromObject(entityDataAdditionalInfo ?? {}, 'ubos')),
            ]
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
        },
      ],
    },
  ];
};
