import { useCallback, useMemo } from 'react';

import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useBankAccountVerificationBlock = ({ pluginsOutput }) => {
  const getCell = useCallback(() => {
    if (
      Object.keys(pluginsOutput?.bankAccountVerification?.data.clientResponsePayload ?? {}).length
    ) {
      const data = {
        ...pluginsOutput.bankAccountVerification.data.responseHeader.overallResponse,
        decisionElements:
          pluginsOutput.bankAccountVerification.data.clientResponsePayload.decisionElements,
        orchestrationDecisions:
          pluginsOutput.bankAccountVerification.data.clientResponsePayload.orchestrationDecisions,
      };

      return {
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
      >;
    }
  }, [pluginsOutput]);

  return useMemo(() => {
    const cell = getCell();

    if (!cell) {
      return [];
    }

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
          .addCell(cell)
          .build()
          .flat(1),
      })
      .build();
  }, [getCell]);
};
