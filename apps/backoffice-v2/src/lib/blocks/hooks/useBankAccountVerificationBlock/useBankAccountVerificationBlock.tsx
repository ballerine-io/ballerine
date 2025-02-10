import { useMemo } from 'react';

import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useBankAccountVerificationBlock = ({ pluginsOutput }) => {
  return useMemo(() => {
    if (
      Object.keys(pluginsOutput?.bankAccountVerification?.data?.clientResponsePayload ?? {})
        .length === 0
    ) {
      return [];
    }

    const data = {
      ...pluginsOutput.bankAccountVerification.data.responseHeader.overallResponse,
      decisionElements:
        pluginsOutput.bankAccountVerification.data.clientResponsePayload.decisionElements,
      orchestrationDecisions:
        pluginsOutput.bankAccountVerification.data.clientResponsePayload.orchestrationDecisions,
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
            value: {
              data: Object.entries(data)
                ?.filter(([property]) => !['tenantID', 'clientReferenceId'].includes(property))
                .map(([title, value]) => ({
                  title,
                  value,
                })),
            },
            props: {
              config: {
                sort: { predefinedOrder: ['decision', 'decisionText'] },
              },
            },
          } satisfies Extract<
            Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
            {
              type: 'details';
            }
          >)
          .buildFlat(),
      })
      .build();
  }, [
    pluginsOutput?.bankAccountVerification?.data?.clientResponsePayload,
    pluginsOutput?.bankAccountVerification?.data?.responseHeader?.overallResponse,
  ]);
};
