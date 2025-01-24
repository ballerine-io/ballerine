import { useCallback, useMemo } from 'react';

import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { WarningFilledSvg } from '@ballerine/ui';

export const useKybRegistryInfoBlock = ({ pluginsOutput, workflow }) => {
  const isBankAccountVerification = useMemo(
    () => !!pluginsOutput?.bankAccountVerification,
    [pluginsOutput?.bankAccountVerification],
  );

  const getCell = useCallback(() => {
    if (Object.keys(pluginsOutput?.businessInformation?.data?.[0] ?? {}).length) {
      return {
        id: 'nested-details',
        type: 'details',
        hideSeparator: true,
        value: {
          data: Object.entries(pluginsOutput?.businessInformation?.data?.[0])?.map(
            ([title, value]) => ({
              title,
              value,
            }),
          ),
        },
        workflowId: workflow?.id,
        documents: workflow?.context?.documents,
      } satisfies Extract<
        Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
        {
          type: 'details';
        }
      >;
    }

    if (Object.keys(pluginsOutput?.bankAccountVerification?.clientResponsePayload ?? {}).length) {
      const data = {
        ...pluginsOutput?.bankAccountVerification?.responseHeader.overallResponse,
        decisionElements:
          pluginsOutput?.bankAccountVerification?.clientResponsePayload.decisionElements,
        orchestrationDecisions:
          pluginsOutput?.bankAccountVerification?.clientResponsePayload.orchestrationDecisions,
      };

      return {
        id: 'nested-details',
        type: 'details',
        hideSeparator: true,
        value: {
          data: Object.entries(data)
            ?.filter(([property]) => {
              console.log(property);

              return !['tenantID', 'clientReferenceId'].includes(property);
            })
            .map(([title, value]) => ({
              title,
              value,
            })),
        },
      } satisfies Extract<
        Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
        {
          type: 'details';
        }
      >;
    }

    const message =
      pluginsOutput?.businessInformation?.message ??
      pluginsOutput?.businessInformation?.data?.message;

    if (message) {
      return {
        type: 'paragraph',
        value: (
          <span className="flex text-sm text-black/60">
            <WarningFilledSvg
              className={'me-2 mt-px text-black/20 [&>:not(:first-child)]:stroke-background'}
              width={'20'}
              height={'20'}
            />
            <span>{message}</span>
          </span>
        ),
      } satisfies Extract<
        Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
        {
          type: 'paragraph';
        }
      >;
    }

    if (pluginsOutput?.businessInformation?.isRequestTimedOut) {
      return {
        type: 'paragraph',
        value: (
          <span className="flex text-sm text-black/60">
            <WarningFilledSvg
              className={'me-2 mt-px text-black/20 [&>:not(:first-child)]:stroke-background'}
              width={'20'}
              height={'20'}
            />
            <span>
              The request timed out either because the company was not found in the registry, or the
              information is currently unavailable.
            </span>
          </span>
        ),
      } satisfies Extract<
        Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
        {
          type: 'paragraph';
        }
      >;
    }
  }, [pluginsOutput, workflow]);

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
            value: isBankAccountVerification ? 'Bank Account Verification' : 'Registry Information',
          })
          .addCell({
            id: 'nested-details-subheading',
            type: 'subheading',
            value: `${isBankAccountVerification ? 'Experian' : 'Registry'}-Provided Data`,
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
