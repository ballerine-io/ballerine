import { useMemo } from 'react';

import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { WarningFilledSvg } from '@ballerine/ui';

export const useBankAccountVerificationBlock = ({
  workflowId,
  pluginsOutput,
  isDocumentsV2,
}: {
  workflowId: string;
  pluginsOutput: any;
  isDocumentsV2: boolean;
}) => {
  return useMemo(() => {
    if (!pluginsOutput?.bankAccountVerification) {
      return [];
    }

    if (!pluginsOutput?.bankAccountVerification?.data) {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'block',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              id: 'nested-details-heading',
              type: 'heading',
              value: 'Bank Account Verification',
            })
            .addCell({
              id: 'nested-details-subheading',
              type: 'subheading',
              value: 'Experian-Provided Data',
              props: {
                className: 'mb-4',
              },
            })
            .addCell({
              type: 'paragraph',
              value: (
                <span className="flex text-sm text-black/60">
                  <WarningFilledSvg
                    className={'me-2 mt-px text-black/20 [&>:not(:first-child)]:stroke-background'}
                    width={'20'}
                    height={'20'}
                  />
                  <span>No Bank Account Verification data to show.</span>
                </span>
              ),
            })
            .buildFlat(),
        })
        .build();
    }

    const data = {
      ...pluginsOutput?.bankAccountVerification.data.responseHeader.overallResponse,
      decisionElements:
        pluginsOutput?.bankAccountVerification.data.clientResponsePayload.decisionElements,
      orchestrationDecisions:
        pluginsOutput?.bankAccountVerification.data.clientResponsePayload.orchestrationDecisions,
    };

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'nested-details-heading',
            type: 'heading',
            value: 'Bank Account Verification',
          })
          .addCell({
            id: 'nested-details-subheading',
            type: 'subheading',
            value: 'Experian-Provided Data',
            props: {
              className: 'mb-4',
            },
          })
          .addCell({
            id: 'nested-details',
            type: 'details',
            hideSeparator: true,
            workflowId,
            value: {
              id: 'nested-details-value-id',
              title: '',
              data: Object.entries(data)
                ?.filter(([property]) => !['tenantID', 'clientReferenceId'].includes(property))
                .map(([title, value]) => ({
                  type: 'editable-details',
                  isEditable: false,
                  title,
                  value,
                })),
            },
            props: {
              config: {
                sort: { predefinedOrder: ['decision', 'decisionText'] },
              },
            },
            isDocumentsV2,
          })
          .buildFlat(),
      })
      .build();
  }, [isDocumentsV2, pluginsOutput?.bankAccountVerification, workflowId]);
};
