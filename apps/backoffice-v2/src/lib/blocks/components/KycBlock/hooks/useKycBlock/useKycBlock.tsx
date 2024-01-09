import * as React from 'react';
import { ComponentProps, useCallback } from 'react';
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
import { useWorkflowQuery } from '@/domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { ctw } from '@/common/utils/ctw/ctw';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { Badge } from '@ballerine/ui';
import { WarningFilledSvg } from '@/common/components/atoms/icons';
import { buttonVariants } from '@/common/components/atoms/Button/Button';

const motionProps: ComponentProps<typeof MotionBadge> = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
};

export const useKycBlock = ({
  parentWorkflowId,
  childWorkflow,
}: {
  childWorkflow: NonNullable<TWorkflowById['childWorkflows']>[number];
  parentWorkflowId: string;
}) => {
  const { noAction } = useCaseDecision();
  const results: Array<Array<string>> = [];
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

  const amlAdapter = (aml: {
    hits: Array<{
      matchedName: string;
      dateOfBirth: string;
      countries: string[];
      matchTypes: string[];
      aka: string[];
      listingsRelatedToMatch: {
        warnings: Array<{
          sourceName: string;
          sourceUrl: string;
          date: string;
        }>;
        sanctions: Array<{
          sourceName: string;
          sourceUrl: string;
          date: string;
        }>;
        pep: Array<{
          sourceName: string;
          sourceUrl: string;
          date: string;
        }>;
        adverseMedia: Array<{
          sourceName: string;
          sourceUrl: string;
          date: string;
        }>;
      };
    }>;
    createdAt: string;
    totalHits: number;
  }) => {
    const { hits, totalHits, createdAt, ...rest } = aml;

    return {
      totalMatches: totalHits ?? 0,
      fullReport: rest,
      dateOfCheck: createdAt,
      matches:
        hits?.map(
          ({ matchedName, dateOfBirth, countries, matchTypes, aka, listingsRelatedToMatch }) => {
            const { sanctions, warnings, pep, adverseMedia } = listingsRelatedToMatch ?? {};

            return {
              matchedName,
              dateOfBirth,
              countries: countries?.join(', ') ?? '',
              matchTypes: matchTypes?.join(', ') ?? '',
              aka: aka?.join(', ') ?? '',
              sanctions:
                sanctions?.map(sanction => ({
                  sanction: sanction?.sourceName,
                  date: sanction?.date,
                  source: sanction?.sourceUrl,
                })) ?? [],
              warnings:
                warnings?.map(warning => ({
                  warning: warning?.sourceName,
                  date: warning?.date,
                  source: warning?.sourceUrl,
                })) ?? [],
              pep:
                pep?.map(pepItem => ({
                  person: pepItem?.sourceName,
                  date: pepItem?.date,
                  source: pepItem?.sourceUrl,
                })) ?? [],
              adverseMedia:
                adverseMedia?.map(adverseMediaItem => ({
                  entry: adverseMediaItem?.sourceName,
                  date: adverseMediaItem?.date,
                  source: adverseMediaItem?.sourceUrl,
                })) ?? [],
            };
          },
        ) ?? [],
    };
  };

  const hasAml = kycSessionKeys?.some(key => {
    return (
      !!childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.vendorResult?.aml ||
      !!childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.aml
    );
  });
  const complianceCheckResults = kycSessionKeys?.length
    ? kycSessionKeys?.flatMap(key => {
        const aml =
          childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.vendorResult ??
          childWorkflow?.context?.pluginsOutput?.kyc_session[key]?.result?.aml;

        if (!Object.keys(aml ?? {}).length) return [];

        const { totalMatches, fullReport, dateOfCheck, matches } = amlAdapter(aml);

        return [
          ...createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'table',
              value: {
                props: {
                  table: {
                    className: 'my-8',
                  },
                },
                columns: [
                  {
                    accessorKey: 'totalMatches',
                    header: 'Total Matches',
                    cell: props => {
                      const value = props.getValue();
                      const variant: ComponentProps<typeof Badge>['variant'] =
                        value === 0 ? 'success' : 'warning';

                      return (
                        <Badge variant={variant} className={`mb-1 rounded-lg px-2 py-1 font-bold`}>
                          {value} {value === 1 ? 'match' : 'matches'}
                        </Badge>
                      );
                    },
                  },
                  {
                    accessorKey: 'fullReport',
                    header: 'Full Report',
                  },
                  {
                    accessorKey: 'dateOfCheck',
                    header: 'Date Of Check',
                  },
                  {
                    accessorKey: 'scanStatus',
                    header: 'Scan Status',
                    cell: props => {
                      const value = props.getValue();
                      const variant: ComponentProps<typeof Badge>['variant'] = 'success';

                      return (
                        <Badge variant={variant} className={`mb-1 rounded-lg px-2 py-1 font-bold`}>
                          <>{value}</>
                        </Badge>
                      );
                    },
                  },
                ],
                data: [
                  {
                    totalMatches,
                    fullReport,
                    dateOfCheck,
                    scanStatus: 'Completed',
                  },
                ],
              },
            })
            .addCell({
              type: 'table',
              value: {
                props: {
                  table: {
                    className: 'my-8',
                  },
                },
                columns: [
                  {
                    accessorKey: 'matchedName',
                    header: 'Matched Name',
                  },
                  {
                    accessorKey: 'dateOfBirth',
                    header: 'Date Of Birth',
                  },
                  {
                    accessorKey: 'countries',
                    header: 'Countries',
                  },
                  {
                    accessorKey: 'aka',
                    header: 'AKA',
                  },
                ],
                data: matches,
              },
            })
            .build()
            .flat(1),
          ...(matches?.flatMap(({ warnings, sanctions, pep, adverseMedia }, index) =>
            createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'container',
                value: createBlocksTyped()
                  .addBlock()
                  .addCell({
                    type: 'subheading',
                    value: `Match ${index + 1}`,
                    props: {
                      className: 'text-lg block my-6',
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8 w-full',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'warning',
                          header: 'Warning',
                          cell: props => {
                            const value = props.getValue();

                            return (
                              <div className={'flex space-x-2'}>
                                <WarningFilledSvg className={'mt-px'} width={'20'} height={'20'} />
                                <span>{value}</span>
                              </div>
                            );
                          },
                        },
                        {
                          accessorKey: 'date',
                          header: 'Date',
                        },
                        {
                          accessorKey: 'source',
                          header: 'Source URL',
                          cell: props => {
                            const value = props.getValue();

                            return (
                              <a
                                className={buttonVariants({
                                  variant: 'link',
                                  className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
                                })}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                                href={value}
                              >
                                Link
                              </a>
                            );
                          },
                        },
                      ],
                      data: warnings,
                    },
                  })
                  .addCell({
                    type: 'table',
                    props: {
                      table: {
                        className: 'my-8 w-full',
                      },
                    },
                    value: {
                      columns: [
                        {
                          accessorKey: 'sanction',
                          header: 'Sanction',
                          cell: props => {
                            const value = props.getValue();

                            return (
                              <div className={'flex space-x-2'}>
                                <WarningFilledSvg className={'mt-px'} width={'20'} height={'20'} />
                                <span>{value}</span>
                              </div>
                            );
                          },
                        },
                        {
                          accessorKey: 'date',
                          header: 'Date',
                        },
                        {
                          accessorKey: 'source',
                          header: 'Source URL',
                          cell: props => {
                            const value = props.getValue();

                            return (
                              <a
                                className={buttonVariants({
                                  variant: 'link',
                                  className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
                                })}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                                href={value}
                              >
                                Link
                              </a>
                            );
                          },
                        },
                      ],
                      data: sanctions,
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8 w-full',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'person',
                          header: 'PEP (Politically Exposed Person)',
                          cell: props => {
                            const value = props.getValue();

                            return (
                              <div className={'flex space-x-2'}>
                                <WarningFilledSvg className={'mt-px'} width={'20'} height={'20'} />
                                <span>{value}</span>
                              </div>
                            );
                          },
                        },
                        {
                          accessorKey: 'date',
                          header: 'Date',
                        },
                        {
                          accessorKey: 'source',
                          header: 'Source URL',
                          cell: props => {
                            const value = props.getValue();

                            return (
                              <a
                                className={buttonVariants({
                                  variant: 'link',
                                  className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
                                })}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                                href={value}
                              >
                                Link
                              </a>
                            );
                          },
                        },
                      ],
                      data: pep,
                    },
                  })
                  .addCell({
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'entry',
                          header: 'Adverse Media',
                          cell: props => {
                            const value = props.getValue();

                            return (
                              <div className={'flex space-x-2'}>
                                <WarningFilledSvg className={'mt-px'} width={'20'} height={'20'} />
                                <span>{value}</span>
                              </div>
                            );
                          },
                        },
                        {
                          accessorKey: 'date',
                          header: 'Date',
                        },
                        {
                          accessorKey: 'source',
                          header: 'Source URL',
                          cell: props => {
                            const value = props.getValue();

                            return (
                              <a
                                className={buttonVariants({
                                  variant: 'link',
                                  className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
                                })}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                                href={value}
                              >
                                Link
                              </a>
                            );
                          },
                        },
                      ],
                      data: adverseMedia,
                    },
                  })
                  .build()
                  .flat(1),
              })
              .build()
              .flat(1),
          ) ?? []),
        ];
      })
    : [];

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
  const { data: parentWorkflow } = useWorkflowQuery({
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
            ...motionProps,
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
            ...motionProps,
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
            ...motionProps,
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
            ...motionProps,
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
        type: 'callToAction',
        value: {
          text: 'Approve',
          onClick: onMutateApproveCase,
          props: {
            disabled: isDisabled,
            size: 'wide',
            variant: 'success',
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
                  value: !hasAml
                    ? []
                    : createBlocksTyped()
                        .addBlock()
                        .addCell({
                          id: 'header',
                          type: 'heading',
                          value: 'Compliance Check Results',
                        })
                        .build()
                        .concat(complianceCheckResults)
                        .flat(1),
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
