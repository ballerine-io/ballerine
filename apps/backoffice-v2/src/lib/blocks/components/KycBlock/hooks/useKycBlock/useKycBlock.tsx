import * as React from 'react';
import { ComponentProps, useCallback, useMemo } from 'react';
import { isObject, StateTag, TStateTags } from '@ballerine/common';

import { TWorkflowById } from '../../../../../../domains/workflows/fetchers';
import { useStorageFilesQuery } from '../../../../../../domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { capitalize } from '../../../../../../common/utils/capitalize/capitalize';
import { MotionBadge } from '../../../../../../common/components/molecules/MotionBadge/MotionBadge';
import { valueOrNA } from '../../../../../../common/utils/value-or-na/value-or-na';
import { toTitleCase } from 'string-ts';
import { useApproveCaseAndDocumentsMutation } from '@/domains/entities/hooks/mutations/useApproveCaseAndDocumentsMutation/useApproveCaseAndDocumentsMutation';
import { useRevisionCaseAndDocumentsMutation } from '@/domains/entities/hooks/mutations/useRevisionCaseAndDocumentsMutation/useRevisionCaseAndDocumentsMutation';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { ctw } from '@/common/utils/ctw/ctw';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { Button } from '@ballerine/ui';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { motionButtonProps } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { useAmlBlock } from '@/lib/blocks/components/AmlBlock/hooks/useAmlBlock/useAmlBlock';

const motionBadgeProps = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
} satisfies ComponentProps<typeof MotionBadge>;

export const useKycBlock = ({
  parentWorkflowId,
  childWorkflow,
}: {
  childWorkflow: NonNullable<TWorkflowById['childWorkflows']>[number];
  parentWorkflowId: string;
}) => {
  const { noAction } = useCaseDecision();
  const results: string[][] = [];
  const kycSessionKeys = Object.keys(childWorkflow?.context?.pluginsOutput?.kyc_session ?? {});

  const docsData = useStorageFilesQuery(
    childWorkflow?.context?.documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }) => ballerineFileId),
    ),
  );

  childWorkflow?.context?.documents?.forEach((document, docIndex) => {
    document?.pages?.forEach((page, pageIndex: number) => {
      if (!results[docIndex]) {
        results[docIndex] = [];
      }
      results[docIndex][pageIndex] = docsData?.shift()?.data;
    });
  });

  const decision = kycSessionKeys?.length
    ? kycSessionKeys?.flatMap(key => [
        {
          title: 'Verified With',
          value: capitalize(childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.vendor),
          pattern: '',
          isEditable: false,
          dropdownOptions: undefined,
        },
        {
          title: 'Result',
          value: childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.decision?.status,
          pattern: '',
          isEditable: false,
          dropdownOptions: undefined,
        },
        {
          title: 'Issues',
          value: childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.decision?.riskLabels
            ?.length
            ? childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.decision?.riskLabels?.join(
                ', ',
              )
            : 'none',
          pattern: '',
          isEditable: false,
          dropdownOptions: undefined,
        },
        ...(isObject(childWorkflow?.context?.pluginsOutput?.kyc_session[key])
          ? [
              {
                title: 'Full report',
                value: childWorkflow?.context?.pluginsOutput?.kyc_session[key],
                pattern: '',
                isEditable: false,
                dropdownOptions: undefined,
              },
            ]
          : []),
      ]) ?? []
    : [];

  const amlData = useMemo(() => {
    if (!kycSessionKeys?.length) {
      return [];
    }

    return kycSessionKeys.map(
      key => kycSessionKeys[key]?.result?.vendorResult?.aml ?? kycSessionKeys[key]?.result?.aml,
    );
  }, [kycSessionKeys]);

  const amlBlock = useAmlBlock(amlData);

  const documentExtractedData = kycSessionKeys?.length
    ? kycSessionKeys?.map((key, index, collection) =>
        createBlocksTyped()
          .addBlock()
          .addCell({
            id: 'decision',
            type: 'details',
            hideSeparator: index === collection.length - 1,
            value: {
              id: childWorkflow?.id,
              title: `Details`,
              data: Object.entries({
                ...childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.entity?.data,
                ...omitPropsFromObject(
                  childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.documents?.[0]
                    ?.properties,
                  'issuer',
                ),
                issuer:
                  childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.documents?.[0]
                    ?.issuer?.country,
              })?.map(([title, value]) => ({
                title,
                value,
                pattern: '',
                isEditable: false,
                dropdownOptions: undefined,
              })),
            },
            workflowId: childWorkflow?.id,
            documents: childWorkflow?.context?.documents,
          })
          .cellAt(0, 0),
      ) ?? []
    : [];

  const details = Object.entries(childWorkflow?.context?.entity?.data ?? {}).map(
    ([title, value]) => ({
      title,
      value,
      pattern: '',
      isEditable: false,
      dropdownOptions: undefined,
    }),
  );
  const documents = childWorkflow?.context?.documents?.flatMap(
    (document, docIndex) =>
      document?.pages?.map(({ type, metadata, data }, pageIndex) => ({
        title: `${valueOrNA(toTitleCase(document?.category ?? ''))} - ${valueOrNA(
          toTitleCase(document?.type ?? ''),
        )}${metadata?.side ? ` - ${metadata?.side}` : ''}`,
        imageUrl: results[docIndex][pageIndex],
        fileType: type,
      })) ?? [],
  );

  const { mutate: mutateApproveCase, isLoading: isLoadingApproveCase } =
    useApproveCaseAndDocumentsMutation({
      workflowId: childWorkflow?.id,
    });
  const { isLoading: isLoadingRevisionCase } = useRevisionCaseAndDocumentsMutation({
    workflowId: childWorkflow?.id,
  });
  const onMutateApproveCase = useCallback(() => mutateApproveCase(), [mutateApproveCase]);
  const filterId = useFilterId();
  const { data: parentWorkflow } = useWorkflowByIdQuery({
    workflowId: parentWorkflowId,
    filterId,
  });
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, parentWorkflow);
  const isDisabled =
    !caseState.actionButtonsEnabled ||
    !childWorkflow?.tags?.includes(StateTag.MANUAL_REVIEW) ||
    noAction ||
    isLoadingApproveCase ||
    isLoadingRevisionCase;

  const getDecisionStatusOrAction = (tags?: TStateTags) => {
    const badgeClassNames = 'text-sm font-bold';

    if (tags?.includes(StateTag.REVISION)) {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'badge',
          value: 'Pending re-upload',
          props: {
            ...motionBadgeProps,
            variant: 'warning',
            className: badgeClassNames,
          },
        })
        .build()
        .flat(1);
    }

    if (tags?.includes(StateTag.APPROVED)) {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'badge',
          value: 'Approved',
          props: {
            ...motionBadgeProps,
            variant: 'success',
            className: `${badgeClassNames} bg-success/20`,
          },
        })
        .build()
        .flat(1);
    }

    if (tags?.includes(StateTag.REJECTED)) {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'badge',
          value: 'Rejected',
          props: {
            ...motionBadgeProps,
            variant: 'destructive',
            className: badgeClassNames,
          },
        })
        .build()
        .flat(1);
    }

    if (tags?.includes(StateTag.PENDING_PROCESS)) {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'badge',
          value: 'Pending ID verification',
          props: {
            ...motionBadgeProps,
            variant: 'warning',
            className: badgeClassNames,
          },
        })
        .build()
        .flat(1);
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'caseCallToActionLegacy',
        value: 'Re-upload needed',
        data: {
          parentWorkflowId: parentWorkflowId,
          childWorkflowId: childWorkflow?.id,
          childWorkflowContextSchema: childWorkflow?.workflowDefinition?.contextSchema,
          disabled: isDisabled,
        },
      })
      .addCell({
        type: 'dialog',
        value: {
          trigger: (
            <MotionButton
              {...motionButtonProps}
              animate={{
                ...motionButtonProps.animate,
                opacity: isDisabled ? 0.5 : motionButtonProps.animate.opacity,
              }}
              disabled={isDisabled}
              size={'wide'}
              variant={'success'}
            >
              Approve
            </MotionButton>
          ),
          title: `Approval confirmation`,
          description: <p className={`text-sm`}>Are you sure you want to approve?</p>,
          close: (
            <div className={`space-x-2`}>
              <Button type={'button'} variant={`secondary`}>
                Cancel
              </Button>
              <Button disabled={isDisabled} onClick={onMutateApproveCase}>
                Approve
              </Button>
            </div>
          ),
          props: {
            content: {
              className: 'mb-96',
            },
            title: {
              className: `text-2xl`,
            },
          },
        },
      })
      .build()
      .flat(1);
  };

  const headerCell = createBlocksTyped()
    .addBlock()
    .addCell({
      id: 'header',
      type: 'container',
      props: {
        className: 'items-start',
      },
      value: createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'heading',
          value: `${valueOrNA(childWorkflow?.context?.entity?.data?.firstName)} ${valueOrNA(
            childWorkflow?.context?.entity?.data?.lastName,
          )}`,
        })
        .addCell({
          id: 'actions',
          type: 'container',
          value: getDecisionStatusOrAction(childWorkflow?.tags),
        })
        .build()
        .flat(1),
    })
    .cellAt(0, 0);

  return createBlocksTyped()
    .addBlock()
    .addCell({
      type: 'block',
      className: ctw({
        'shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)] border-[1px] border-warning':
          childWorkflow.state === 'revision',
      }),
      value: createBlocksTyped()
        .addBlock()
        .addCell(headerCell)
        .addCell({
          id: 'kyc-block',
          type: 'container',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'container',
              value: createBlocksTyped()
                .addBlock()
                .addCell({
                  type: 'container',
                  value: createBlocksTyped()
                    .addBlock()
                    .addCell({
                      id: 'header',
                      type: 'heading',
                      value: 'Details',
                    })
                    .addCell({
                      id: 'decision',
                      type: 'details',
                      value: {
                        id: 1,
                        title: 'Details',
                        data: details,
                      },
                      workflowId: childWorkflow?.id,
                      documents: childWorkflow?.context?.documents,
                    })
                    .build()
                    .flat(1),
                })
                .addCell({
                  type: 'container',
                  value: createBlocksTyped()
                    .addBlock()
                    .addCell({
                      id: 'header',
                      type: 'heading',
                      value: 'Document Extracted Data',
                    })
                    .build()
                    .concat(documentExtractedData)
                    .flat(1),
                })
                .addCell({
                  type: 'container',
                  value: createBlocksTyped()
                    .addBlock()
                    .addCell({
                      id: 'header',
                      type: 'heading',
                      value: 'Document Verification Results',
                    })
                    .addCell({
                      id: 'decision',
                      type: 'details',
                      hideSeparator: true,
                      value: {
                        id: 1,
                        title: 'Decision',
                        data: decision,
                      },
                      workflowId: childWorkflow?.id,
                      documents: childWorkflow?.context?.documents,
                    })
                    .build()
                    .flat(1),
                })
                .addCell({
                  type: 'container',
                  value: amlBlock,
                })
                .build()
                .flat(1),
            })
            .addCell({
              type: 'multiDocuments',
              value: {
                isLoading: docsData?.some(({ isLoading }) => isLoading),
                data: documents,
              },
            })
            .build()
            .flat(1),
        })
        .build()
        .flat(1),
    })
    .build();
};
