import { TWorkflowById } from '../../../../domains/workflows/fetchers';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../../components/Case/hooks/useCaseState/useCaseState';
import { useStorageFilesQuery } from '../../../../domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import {
  composePickableCategoryType,
  convertSnakeCaseToTitleCase,
  extractCountryCodeFromWorkflow,
  getIsEditable,
  isExistingSchemaForDocument,
  omitPropsFromObject,
} from '../useEntity/utils';
import { getDocumentsByCountry, StateTag } from '@ballerine/common';
import * as React from 'react';
import { ComponentProps, useMemo } from 'react';
import { toStartCase } from '../../../../common/utils/to-start-case/to-start-case';
import { useCaseDecision } from '../../components/Case/hooks/useCaseDecision/useCaseDecision';
import { X } from 'lucide-react';
import { useRevisionTaskByIdMutation } from '../../../../domains/entities/hooks/mutations/useRevisionTaskByIdMutation/useRevisionTaskByIdMutation';
import { MotionBadge } from '../../../../common/components/molecules/MotionBadge/MotionBadge';
import { useNominatimQuery } from '../../components/MapCell/hooks/useNominatimQuery/useNominatimQuery';
import { getAddressDeep } from '../useEntity/utils/get-address-deep/get-address-deep';

const motionProps: ComponentProps<typeof MotionBadge> = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
};

export const useTasks = ({
  workflow,
  entity,
  pluginsOutput,
  documents,
  parentMachine,
}: {
  workflow: TWorkflowById;
  entity: TWorkflowById['context']['entity'];
  pluginsOutput: TWorkflowById['context']['pluginsOutput'];
  documents: TWorkflowById['context']['documents'];
  parentMachine: TWorkflowById['context']['parentMachine'];
}) => {
  const { store: storeInfo, bank: bankDetails } =
    workflow?.context?.entity?.data?.additionalInfo ?? {};
  const { website: websiteBasicRequirement, processingDetails } = storeInfo ?? {};
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const docsData = useStorageFilesQuery(
    workflow?.context?.documents?.flatMap(({ pages }) =>
      pages?.map(({ ballerineFileId }) => ballerineFileId),
    ),
  );
  const { noAction } = useCaseDecision();
  const { mutate: mutateRevisionTaskById } = useRevisionTaskByIdMutation(workflow?.id);

  const results: Array<Array<string>> = [];
  workflow?.context?.documents?.forEach((document, docIndex) => {
    document?.pages?.forEach((page, pageIndex: number) => {
      if (!results[docIndex]) {
        results[docIndex] = [];
      }
      results[docIndex][pageIndex] = docsData?.shift()?.data;
    });
  });
  const pluginsOutputKeys = Object.keys(pluginsOutput ?? {});
  const address = getAddressDeep(pluginsOutput, { propertyName: 'registeredAddressInFull' });
  const { data: locations } = useNominatimQuery(address);
  const issuerCountryCode = extractCountryCodeFromWorkflow(workflow);
  const documentsSchemas = !!issuerCountryCode && getDocumentsByCountry(issuerCountryCode);

  const registryInfoBlock =
    Object.keys(pluginsOutput ?? {}).length === 0
      ? []
      : pluginsOutputKeys
          ?.filter(
            key =>
              !!Object.keys(pluginsOutput[key] ?? {})?.length && !('error' in pluginsOutput[key]),
          )
          ?.map((key, index, collection) => ({
            cells: [
              {
                type: 'container',
                value: [
                  {
                    id: 'nested-details-heading',
                    type: 'heading',
                    value: 'Registry Information',
                  },
                  {
                    type: 'subheading',
                    value: 'Registry-provided data',
                  },
                ],
              },
              {
                type: 'details',
                hideSeparator: index === collection.length - 1,
                value: {
                  data: Object.entries(pluginsOutput[key] ?? {})?.map(([title, value]) => ({
                    title,
                    value,
                  })),
                },
              },
            ],
          }));

  const taskBlocks =
    documents?.map(
      ({ id, type: docType, category, properties, propertiesSchema, decision }, docIndex) => {
        const additionProperties =
          isExistingSchemaForDocument(documentsSchemas) &&
          composePickableCategoryType(category, docType, documentsSchemas);

        const isDoneWithRevision =
          decision?.status === 'revised' && parentMachine?.status === 'completed';
        const isDocumentRevision =
          decision?.status === 'revision' && (!isDoneWithRevision || noAction);

        const isLegacyReject = workflow?.workflowDefinition?.config?.isLegacyReject;
        const getDecisionStatusOrAction = (isDocumentRevision: boolean) => {
          const badgeClassNames = 'text-sm font-bold';

          if (isDocumentRevision) {
            return workflow?.tags?.includes(StateTag.REVISION)
              ? [
                  {
                    type: 'badge',
                    value: 'Pending re-upload',
                    props: {
                      ...motionProps,
                      variant: 'warning',
                      className: badgeClassNames,
                    },
                  },
                ]
              : [
                  {
                    type: 'badge',
                    value: (
                      <React.Fragment>
                        Re-upload needed
                        <X
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => mutateRevisionTaskById({ documentId: id, decision: null })}
                        />
                      </React.Fragment>
                    ),
                    props: {
                      ...motionProps,
                      variant: 'warning',
                      className: `gap-x-1 text-white bg-warning ${badgeClassNames}`,
                    },
                  },
                ];
          }

          if (decision?.status === StateTag.APPROVED) {
            return [
              {
                type: 'badge',
                value: 'Approved',
                props: {
                  ...motionProps,
                  variant: 'success',
                  className: `${badgeClassNames} bg-success/20`,
                },
              },
            ];
          }

          if (decision?.status === StateTag.REJECTED) {
            return [
              {
                type: 'badge',
                value: 'Rejected',
                props: {
                  ...motionProps,
                  variant: 'destructive',
                  className: badgeClassNames,
                },
              },
            ];
          }

          return [
            {
              type: 'callToAction',
              // 'Reject' displays the dialog with both "block" and "ask for re-upload" options
              value: isLegacyReject ? 'Reject' : 'Re-upload needed',
              data: {
                id,
                disabled: (!isDoneWithRevision && Boolean(decision?.status)) || noAction,
                decision: 'reject',
              },
            },
            {
              type: 'callToAction',
              value: 'Approve',
              data: {
                id,
                disabled: (!isDoneWithRevision && Boolean(decision?.status)) || noAction,
                decision: 'approve',
              },
            },
          ];
        };

        const headerCell = {
          id: 'header',
          type: 'container',
          value: [
            {
              type: 'heading',
              value: `${convertSnakeCaseToTitleCase(category)} - ${convertSnakeCaseToTitleCase(
                docType,
              )}`,
            },
            {
              id: 'actions',
              type: 'container',
              value: getDecisionStatusOrAction(isDocumentRevision),
            },
          ],
        };

        const decisionCell = {
          type: 'details',
          value: {
            id,
            title: 'Decision',
            hideSeparator: true,
            data: decision?.status
              ? Object.entries(decision ?? {}).map(([title, value]) => ({
                  title,
                  value,
                }))
              : [],
          },
        };
        const detailsCell = {
          type: 'container',
          value: [
            {
              id: 'decision',
              type: 'details',
              value: {
                id,
                title: `${category} - ${docType}`,
                data: Object.entries(
                  {
                    ...additionProperties,
                    ...propertiesSchema?.properties,
                  } ?? {},
                )?.map(
                  ([
                    title,
                    {
                      type,
                      format,
                      pattern,
                      isEditable = true,
                      dropdownOptions,
                      value,
                      formatMinimum,
                      formatMaximum,
                    },
                  ]) => {
                    const fieldValue = value || (properties?.[title] ?? '');
                    const isEditableDecision = isDoneWithRevision || !decision?.status;

                    return {
                      title,
                      value: fieldValue,
                      type,
                      format,
                      pattern,
                      isEditable:
                        isEditableDecision &&
                        caseState.writeEnabled &&
                        getIsEditable(isEditable, title),
                      dropdownOptions,
                      minimum: formatMinimum,
                      maximum: formatMaximum,
                    };
                  },
                ),
              },
            },
            decisionCell,
          ],
        };

        const documentsCell = {
          type: 'multiDocuments',
          value: {
            isLoading: docsData?.some(({ isLoading }) => isLoading),
            data:
              documents?.[docIndex]?.pages?.map(({ type, metadata, data }, pageIndex) => ({
                title: `${convertSnakeCaseToTitleCase(category)} - ${convertSnakeCaseToTitleCase(
                  docType,
                )}${metadata?.side ? ` - ${metadata?.side}` : ''}`,
                imageUrl: results[docIndex][pageIndex],
                fileType: type,
              })) ?? [],
          },
        };

        return {
          className: isDocumentRevision
            ? `shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)] border-[1px] border-warning ${
                workflow?.tags?.includes(StateTag.REVISION) ? '' : 'bg-warning/10'
              }`
            : '',
          cells: [headerCell, detailsCell, documentsCell],
        };
      },
    ) ?? [];

  const entityInfoBlock =
    Object.keys(entity?.data ?? {}).length === 0
      ? []
      : [
          {
            cells: [
              {
                type: 'container',
                value: [
                  {
                    type: 'heading',
                    value: `${toStartCase(entity?.type)} Information`,
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
                  title: `${toStartCase(entity?.type)} Information`,
                  data: [
                    ...Object.entries(
                      omitPropsFromObject(entity?.data, 'additionalInfo', 'address') ?? {},
                    ),
                    ...Object.entries(entity?.data?.additionalInfo ?? {}),
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
              },
            ],
          },
        ];

  const mapBlock =
    Object.keys(address ?? {})?.length === 0
      ? []
      : [
          {
            cells: locations &&
              locations.length && [
                {
                  id: 'map-container',
                  type: 'container',
                  value: [
                    {
                      id: 'header',
                      type: 'heading',
                      value: `${toStartCase(entity?.type)} Address`,
                    },
                    {
                      type: 'details',
                      hideSeparator: true,
                      value: {
                        title: `${toStartCase(entity?.type)} Address`,
                        data:
                          typeof address === 'string'
                            ? [
                                {
                                  title: 'Address',
                                  value: address,
                                  isEditable: false,
                                },
                              ]
                            : Object.entries(address ?? {})?.map(([title, value]) => ({
                                title,
                                value,
                                isEditable: false,
                              })),
                      },
                    },
                    {
                      type: 'map',
                      address,
                      latitude: locations[0].lat,
                      longitude: locations[0].lon,
                    },
                  ],
                },
              ],
          },
        ];

  const storeInfoBlock =
    Object.keys(storeInfo ?? {}).length === 0
      ? []
      : [
          {
            cells: [
              {
                type: 'heading',
                value: 'Store Info',
              },
              {
                type: 'subheading',
                value: 'User-provided data',
              },
              {
                type: 'details',
                value: {
                  data: Object.entries(storeInfo)?.map(([title, value]) => ({
                    title,
                    value,
                    isEditable: false,
                  })),
                },
                hideSeparator: true,
              },
            ],
          },
        ];

  const websiteBasicRequirementBlock =
    Object.keys(bankDetails ?? {}).length === 0
      ? []
      : [
          {
            cells: [
              {
                type: 'heading',
                value: 'Website Basic Requirement',
              },
              {
                type: 'subheading',
                value: 'User-Provided Data',
              },
              {
                type: 'details',
                value: {
                  data: Object.entries(bankDetails)?.map(([title, value]) => ({
                    title,
                    value,
                    isEditable: false,
                  })),
                },
                hideSeparator: true,
              },
            ],
          },
        ];

  const bankingDetailsBlock =
    Object.keys(websiteBasicRequirement ?? {}).length === 0
      ? []
      : [
          {
            cells: [
              {
                type: 'heading',
                value: 'Banking details',
              },
              {
                type: 'subheading',
                value: 'User-Provided Data',
              },
              {
                type: 'details',
                value: {
                  data: Object.entries(websiteBasicRequirement)?.map(([title, value]) => ({
                    title,
                    value,
                    isEditable: false,
                  })),
                },
                hideSeparator: true,
              },
            ],
          },
        ];

  const processingDetailsBlock =
    Object.keys(processingDetails ?? {}).length === 0
      ? []
      : [
          {
            cells: [
              {
                type: 'heading',
                value: 'Processing details',
              },
              {
                type: 'subheading',
                value: 'User-Provided Data',
              },
              {
                type: 'details',
                value: {
                  data: Object.entries(processingDetails)?.map(([title, value]) => ({
                    title,
                    value,
                    isEditable: false,
                  })),
                },
                hideSeparator: true,
              },
            ],
          },
        ];

  return useMemo(() => {
    return entity
      ? [
          ...entityInfoBlock,
          ...registryInfoBlock,
          ...taskBlocks,
          ...mapBlock,
          ...storeInfoBlock,
          ...websiteBasicRequirementBlock,
          ...bankingDetailsBlock,
          ...processingDetailsBlock,
        ]
      : [];
  }, [
    address,
    caseState.writeEnabled,
    docsData,
    documents,
    documentsSchemas,
    entity,
    parentMachine?.status,
    pluginsOutput,
    pluginsOutputKeys,
    results,
    noAction,
    mutateRevisionTaskById,
  ]);
};
