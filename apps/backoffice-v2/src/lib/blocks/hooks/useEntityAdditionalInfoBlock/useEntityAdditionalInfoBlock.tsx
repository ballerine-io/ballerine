import { titleCase } from 'string-ts';
import { createBlocksTyped } from '../../create-blocks-typed/create-blocks-typed';
import { generateEditableDetailsV2Fields } from '@/common/components/organisms/EditableDetailsV2/utils/generate-editable-details-v2-fields';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { valueOrNA } from '@ballerine/common';

export const useEntityAdditionalInfoBlock = ({
  entity,
  predefinedOrder,
}: {
  entity: TWorkflowById['context']['entity'];
  predefinedOrder: string[];
}) => {
  const fields = generateEditableDetailsV2Fields({ entity })({
    path: 'entity.data.additionalInfo',
  });

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
              value: `Additional ${valueOrNA(titleCase(entity?.type ?? ''))} Information`,
            })
            .addCell({
              type: 'subheading',
              value: 'User-Provided Data',
            })
            .buildFlat(),
        })
        .addCell({
          type: 'editableDetails',
          value: fields,
          props: {
            config: {
              sort: { predefinedOrder },
              parse: {
                date: true,
                isoDate: true,
                datetime: true,
                boolean: true,
                url: true,
                nullish: true,
              },
              blacklist: [
                'store',
                'bank',
                'mainContact',
                'openCorporate',
                'mainRepresentative',
                'ubos',
                'associatedCompanies',
                'directors',
              ],
              actions: {
                options: {
                  disabled: true,
                },
                enableEditing: {
                  disabled: true,
                },
                reRunChecks: {
                  disabled: true,
                },
                editing: {
                  disabled: true,
                },
                cancel: {
                  disabled: true,
                },
                save: {
                  disabled: true,
                },
              },
              inputTypes: {
                dateOfBirth: 'date',
              },
            },
            onSubmit: () => {},
            onEnableIsEditable: toggleOnIsEditable => {},
            onReRunChecks: () => {},
            onCancel: toggleOffIsEditable => {},
          },
        })
        .buildFlat(),
    })
    .build();
};
