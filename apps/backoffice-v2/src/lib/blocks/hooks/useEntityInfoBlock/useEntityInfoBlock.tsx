import { generateEditableDetailsV2Fields } from '@/common/components/organisms/EditableDetailsV2/utils/generate-editable-details-v2-fields';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useEventMutation } from '@/domains/workflows/hooks/mutations/useEventMutation/useEventMutation';
import { useUpdateContextAndSyncEntityMutation } from '@/domains/workflows/hooks/mutations/useUpdateContextAndSyncEntity/useUpdateContextAndSyncEntity';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { isObject, valueOrNA } from '@ballerine/common';
import { useCallback, useMemo } from 'react';
import { titleCase, toTitleCase } from 'string-ts';

export const useEntityInfoBlock = ({
  entity,
  workflow,
  entityDataAdditionalInfo,
}: {
  entity: TWorkflowById['context']['entity'];
  workflow: TWorkflowById;
  entityDataAdditionalInfo: TWorkflowById['context']['entity']['data']['additionalInfo'];
}) => {
  const { mutate: mutateEvent } = useEventMutation();
  const onMutateEvent = useCallback(() => {
    mutateEvent({
      workflowId: workflow?.id,
      event: 're_run_checks',
    });
  }, [mutateEvent, workflow?.id]);
  const { mutate: mutateUpdateContextAndSyncEntity } = useUpdateContextAndSyncEntityMutation({
    workflowId: workflow?.id,
  });

  const onSubmit = useCallback(
    (values: Record<PropertyKey, any>, toggleOffIsEditable: () => void) => {
      mutateUpdateContextAndSyncEntity(values, {
        onSuccess: () => {
          toggleOffIsEditable();
        },
      });
    },
    [mutateUpdateContextAndSyncEntity],
  );
  const predefinedOrder = useMemo(
    () =>
      workflow?.workflowDefinition?.config?.uiOptions?.backoffice?.blocks?.businessInformation
        ?.predefinedOrder ?? [],
    [
      workflow?.workflowDefinition?.config?.uiOptions?.backoffice?.blocks?.businessInformation
        ?.predefinedOrder,
    ],
  );
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user ?? null, workflow);

  return useMemo(() => {
    if (Object.keys(entity?.data ?? {}).length === 0) {
      return [];
    }

    const fields = generateEditableDetailsV2Fields({ entity })({
      path: 'entity.data',
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
                value: `${valueOrNA(toTitleCase(entity?.type ?? ''))} Information`,
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
                blacklist: ['address', 'additionalInfo'],
                actions: {
                  options: {
                    disabled: !caseState.writeEnabled,
                  },
                  enableEditing: {
                    disabled: false,
                  },
                  reRunChecks: {
                    disabled: true,
                  },
                  editing: {
                    disabled: !caseState.writeEnabled,
                  },
                  cancel: {
                    disabled: false,
                  },
                  save: {
                    disabled: !caseState.writeEnabled,
                  },
                },
                inputTypes: {
                  dateOfBirth: 'date',
                },
              },
              onSubmit,
              onEnableIsEditable: toggleOnIsEditable => {
                toggleOnIsEditable();
              },
              onReRunChecks: () => {},
              onCancel: toggleOffIsEditable => {
                toggleOffIsEditable();
              },
            },
          })
          .buildFlat(),
      })
      .build();
  }, [entity, workflow, entityDataAdditionalInfo]);
};
