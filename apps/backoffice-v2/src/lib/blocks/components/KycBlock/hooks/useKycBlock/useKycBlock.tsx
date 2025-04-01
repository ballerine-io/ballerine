import { isObject, StateTag, TStateTags, valueOrNA } from '@ballerine/common';
import { ComponentProps, useCallback, useMemo } from 'react';

import { Separator } from '@/common/components/atoms/Separator/Separator';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { generateEditableDetailsV2Fields } from '@/common/components/organisms/EditableDetailsV2/utils/generate-editable-details-v2-fields';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useToggle } from '@/common/hooks/useToggle/useToggle';
import { ctw } from '@/common/utils/ctw/ctw';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useKycDocumentsAdapter } from '@/domains/documents/hooks/adapters/useKycDocumentsAdapter/useKycDocumentsAdapter';
import { useApproveCaseAndDocumentsMutation } from '@/domains/entities/hooks/mutations/useApproveCaseAndDocumentsMutation/useApproveCaseAndDocumentsMutation';
import { useRevisionCaseAndDocumentsMutation } from '@/domains/entities/hooks/mutations/useRevisionCaseAndDocumentsMutation/useRevisionCaseAndDocumentsMutation';
import { useEventMutation } from '@/domains/workflows/hooks/mutations/useEventMutation/useEventMutation';
import { useUpdateContextAndSyncEntityMutation } from '@/domains/workflows/hooks/mutations/useUpdateContextAndSyncEntity/useUpdateContextAndSyncEntity';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useAmlBlock } from '@/lib/blocks/components/AmlBlock/hooks/useAmlBlock/useAmlBlock';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { motionButtonProps } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { Badge, Button } from '@ballerine/ui';
import { MotionBadge } from '../../../../../../common/components/molecules/MotionBadge/MotionBadge';
import { capitalize } from '../../../../../../common/utils/capitalize/capitalize';
import { TWorkflowById } from '../../../../../../domains/workflows/fetchers';

const motionBadgeProps = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
} satisfies ComponentProps<typeof MotionBadge>;

const RISK_TO_LABEL = {
  allowedAge: 'Disallowed age',
  faceLiveness: 'Face is not lively',
  documentNotExpired: 'Document expired',
  geolocationMatch: 'No geolocation match',
  documentAccepted: 'Document not accepted',
  faceNotInBlocklist: 'Face is in blocklist',
  allowedIpLocation: 'Disallowed IP location',
  faceImageAvailable: 'Face image unavailable',
  documentRecognised: 'Document not recognized',
  faceSimilarToPortrait: 'Face not similar to portrait',
  validDocumentAppearance: 'Invalid document appearance',
  expectedTrafficBehaviour: 'Unexpected traffic behavior',
  physicalDocumentPresent: 'Physical document not present',
  documentBackFullyVisible: 'Document back not fully visible',
  documentFrontFullyVisible: 'Document front not fully visible',
  documentBackImageAvailable: 'Document back image unavailable',
  faceImageQualitySufficient: 'Face image quality insufficient',
  documentFrontImageAvailable: 'Document front image unavailable',
  documentImageQualitySufficient: 'Document image quality insufficient',
} as const;

export const useKycBlock = ({
  parentWorkflowId,
  childWorkflow,
}: {
  childWorkflow: NonNullable<TWorkflowById['childWorkflows']>[number];
  parentWorkflowId: string;
}) => {
  const filterId = useFilterId();
  const { data: parentWorkflow } = useWorkflowByIdQuery({
    workflowId: parentWorkflowId,
    filterId,
  });
  const { noAction } = useCaseDecision();
  const kycSessionKeys = Object.keys(childWorkflow?.context?.pluginsOutput?.kyc_session ?? {});

  const { documents: allDocuments, isLoading: isLoadingDocuments } = useKycDocumentsAdapter({
    documents: childWorkflow?.context?.documents ?? [],
  });

  const documents = useMemo(() => {
    return allDocuments?.filter(document => document.type === 'identification_document') ?? [];
  }, [allDocuments]);

  const riskLabels: string[] = kycSessionKeys?.length
    ? kycSessionKeys.flatMap(key => {
        if (key === 'invokedAt') {
          return [];
        }

        return childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.decision?.riskLabels
          ?.length
          ? childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.decision?.riskLabels
          : 'none';
      })
    : [];

  const decision = kycSessionKeys?.length
    ? kycSessionKeys
        .flatMap(key =>
          key === 'invokedAt'
            ? []
            : [
                {
                  title: 'Verified With',
                  value: capitalize(
                    childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.vendor,
                  ),
                  pattern: '',
                  isEditable: false,
                  dropdownOptions: undefined,
                },
                {
                  title: 'Result',
                  value:
                    childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.decision
                      ?.status,
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
              ],
        )
        .filter(x => Boolean(x)) ?? []
    : [];

  const amlData = useMemo(() => {
    if (!kycSessionKeys?.length) {
      return [];
    }

    return kycSessionKeys.map(
      key =>
        childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.vendorResult?.aml ??
        childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.aml,
    );
  }, [childWorkflow?.context?.pluginsOutput?.kyc_session, kycSessionKeys]);
  const vendor = useMemo(() => {
    if (!kycSessionKeys?.length) {
      return;
    }

    const amlVendor = kycSessionKeys
      .map(
        key =>
          childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.vendorResult?.aml
            ?.vendor ??
          childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.aml?.vendor,
      )
      .filter(Boolean);

    if (!amlVendor.length) {
      const kycVendor = kycSessionKeys
        .map(key => childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.vendor)
        .filter(Boolean);

      return kycVendor.join(', ');
    }

    return amlVendor.join(', ');
  }, [childWorkflow?.context?.pluginsOutput?.kyc_session, kycSessionKeys]);

  const amlBlock = useAmlBlock({
    data: amlData,
    vendor: vendor ?? '',
  });

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
            documents: documents?.map(({ details: _details, ...document }) => document),
            isDocumentsV2: !!parentWorkflow?.workflowDefinition?.config?.isDocumentsV2,
          })
          .cellAt(0, 0),
      ) ?? []
    : [];

  const nonIdentificationDocumentsIds = useMemo(() => {
    return (
      documents
        // 'identification_document' is exclusive to Veriff
        ?.filter(document => document.type !== 'identification_document')
        ?.map(document => document.id) ?? []
    );
  }, [documents]);

  const { mutate: mutateApproveCase, isLoading: isLoadingApproveCase } =
    useApproveCaseAndDocumentsMutation({
      workflowId: childWorkflow?.id,
      ids: nonIdentificationDocumentsIds,
      // Shouldnt be v2 for KYC
      isDocumentsV2: false,
    });
  const { isLoading: isLoadingRevisionCase } = useRevisionCaseAndDocumentsMutation({
    workflowId: childWorkflow?.id,
    ids: nonIdentificationDocumentsIds,
    // Shouldnt be v2 for KYC
    isDocumentsV2: false,
  });
  const onMutateApproveCase = useCallback(() => mutateApproveCase(), [mutateApproveCase]);
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
        .buildFlat();
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
        .buildFlat();
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
        .buildFlat();
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
        .buildFlat();
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
          isKYC: true,
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
              className={'enabled:bg-success enabled:hover:bg-success/90'}
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
      .buildFlat();
  };

  const { mutate: mutateInitiateKyc } = useEventMutation();

  const getEvent = () => {
    if (childWorkflow?.nextEvents?.includes('start')) {
      return 'start';
    }
  };
  const event = getEvent();
  const onInitiateKyc = useCallback(() => {
    if (!event) {
      return;
    }

    mutateInitiateKyc({
      workflowId: childWorkflow?.id,
      event,
    });
  }, [mutateInitiateKyc, event, childWorkflow?.id]);

  const headerCell = createBlocksTyped()
    .addBlock()
    .addCell({
      id: 'header',
      type: 'container',
      props: {
        className: 'justify-between items-center pt-6',
      },
      value: createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'heading',
          value: `${valueOrNA(childWorkflow?.context?.entity?.data?.firstName)} ${valueOrNA(
            childWorkflow?.context?.entity?.data?.lastName,
          )}`,
          props: {
            className: 'mt-0',
          },
        })
        .buildFlat(),
    })
    .cellAt(0, 0);

  const fields = generateEditableDetailsV2Fields(childWorkflow?.context)({
    path: 'entity.data',
  });

  const [isEditable, _toggleIsEditable, toggleOnIsEditable, toggleOffIsEditable] = useToggle();
  const { mutate: mutateUpdateContextAndSyncEntity } = useUpdateContextAndSyncEntityMutation({
    workflowId: childWorkflow?.id,
    onSuccess: () => {
      toggleOffIsEditable();
    },
  });

  const onSubmit = useCallback(
    (values: Record<PropertyKey, any>) => {
      mutateUpdateContextAndSyncEntity(values);
    },
    [mutateUpdateContextAndSyncEntity],
  );

  const getEntityDataBlock = () => {
    if (parentWorkflow?.workflowDefinition?.config?.editableContext?.kyc?.entity) {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'editableDetails',
          value: fields,
          props: {
            title: 'Details',
            onSubmit,
            onEnableIsEditable: toggleOnIsEditable,
            onCancel: toggleOffIsEditable,
            config: {
              parse: {
                date: true,
                isoDate: true,
                datetime: true,
                boolean: true,
                url: true,
                nullish: true,
              },
              blacklist: [],
              actions: {
                options: {
                  disabled: !caseState.writeEnabled,
                },
                enableEditing: {
                  disabled: isEditable,
                },
                editing: {
                  disabled: !isEditable || !caseState.writeEnabled,
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
          },
        })
        .buildFlat();
    }

    return createBlocksTyped()
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
          data: Object.entries(childWorkflow?.context?.entity?.data ?? {}).map(
            ([title, value]) => ({
              title,
              value,
              pattern: '',
              isEditable: false,
              dropdownOptions: undefined,
            }),
          ),
        },
        workflowId: childWorkflow?.id,
        documents: documents?.map(({ details: _details, ...document }) => document),
        isDocumentsV2: !!parentWorkflow?.workflowDefinition?.config?.isDocumentsV2,
      })
      .buildFlat();
  };

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
          type: 'node',
          value: <Separator className={`my-2`} />,
        })
        .addCell({
          id: 'title-with-actions',
          type: 'container',
          props: { className: 'mt-2' },
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'heading',
              value: 'Identity Verification Results',
              props: {
                className: 'mt-0',
              },
            })
            .addCell({
              type: 'container',
              props: { className: 'space-x-4' },
              value: getDecisionStatusOrAction(childWorkflow?.tags),
            })
            .buildFlat(),
        })
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
                  value: getEntityDataBlock(),
                })
                .addCell({
                  type: 'container',
                  value: documentExtractedData.length
                    ? createBlocksTyped()
                        .addBlock()
                        .addCell({
                          id: 'header',
                          type: 'heading',
                          value: 'Document Extracted Data',
                        })
                        .build()
                        .concat(documentExtractedData)
                        .flat(1)
                    : createBlocksTyped()
                        .addBlock()
                        .addCell({
                          type: 'heading',
                          value: 'Document Extracted Data',
                        })
                        .addCell({
                          type: 'paragraph',
                          value: 'Initiate KYC for document extracted data to appear',
                          props: {
                            className: 'py-4 text-slate-500',
                          },
                        })
                        .addCell({
                          type: 'callToAction',
                          value: {
                            text: 'Initiate KYC',
                            onClick: onInitiateKyc,
                            props: {
                              className:
                                'px-2 py-0 text-xs aria-disabled:pointer-events-none aria-disabled:opacity-50 ms-3',
                              variant: 'outline',
                              disabled: !event,
                            },
                          },
                        })
                        .buildFlat(),
                })
                .addCell({
                  type: 'container',
                  value: decision.length
                    ? createBlocksTyped()
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
                          props: {
                            config: {
                              sort: {
                                predefinedOrder: ['Result', 'Verified With', 'Full report'],
                              },
                            },
                          },
                          workflowId: childWorkflow?.id,
                          documents: documents?.map(
                            ({ details: _details, ...document }) => document,
                          ),
                          isDocumentsV2:
                            !!parentWorkflow?.workflowDefinition?.config?.isDocumentsV2,
                        })
                        .addCell({
                          type: 'node',
                          value: (
                            <div className="m-2 mt-4 flex flex-col gap-4 p-1">
                              <p className="text-sm font-medium">Issues</p>
                              <div className="flex flex-col space-y-4">
                                {riskLabels.map(item => (
                                  <Badge
                                    key={item}
                                    variant="destructive"
                                    className={`max-w-fit text-sm font-bold`}
                                  >
                                    {RISK_TO_LABEL[item as keyof typeof RISK_TO_LABEL] ?? item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ),
                        })
                        .buildFlat()
                    : createBlocksTyped()
                        .addBlock()
                        .addCell({
                          type: 'heading',
                          value: 'Document Verification Results',
                        })
                        .addCell({
                          type: 'paragraph',
                          value: 'Initiate KYC for document verification results to appear',
                          props: {
                            className: 'py-4 text-slate-500',
                          },
                        })
                        .buildFlat(),
                })
                .buildFlat(),
            })
            .addCell({
              type: 'multiDocuments',
              value: {
                isLoading: isLoadingDocuments,
                data: documents?.flatMap(document => document?.details),
              },
            })
            .buildFlat(),
        })
        .addCell({
          type: 'node',
          value: <Separator className={`my-2`} />,
        })
        .addCell({
          type: 'container',
          value: amlBlock,
        })
        .buildFlat(),
    })
    .build();
};
