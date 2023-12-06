import {
  CommonWorkflowStates,
  getDocumentsByCountry,
  getDocumentSchemaByCountry,
  isNullish,
  StateTag,
  TAvailableDocuments,
  TDocument,
} from '@ballerine/common';
import { Badge } from '@ballerine/ui';
import { X } from 'lucide-react';
import * as React from 'react';
import { ComponentProps, useCallback, useMemo } from 'react';
import { toTitleCase, toUpperCase } from 'string-ts';
import { WarningFilledSvg } from '../../../../common/components/atoms/icons';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { includesValues } from '../../../../common/utils/includes-values/includes-values';
import { isValidUrl } from '../../../../common/utils/is-valid-url';
import { valueOrNA } from '../../../../common/utils/value-or-na/value-or-na';
import { useAuthenticatedUserQuery } from '../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useRemoveDecisionTaskByIdMutation } from '../../../../domains/entities/hooks/mutations/useRemoveDecisionTaskByIdMutation/useRemoveDecisionTaskByIdMutation';
import { useStorageFilesQuery } from '../../../../domains/storage/hooks/queries/useStorageFilesQuery/useStorageFilesQuery';
import { TWorkflowById } from '../../../../domains/workflows/fetchers';
import { useCaseState } from '../../components/Case/hooks/useCaseState/useCaseState';
import {
  composePickableCategoryType,
  extractCountryCodeFromWorkflow,
  getIsEditable,
  isExistingSchemaForDocument,
  omitPropsFromObject,
} from '../useEntity/utils';
import { useCaseDecision } from '../../components/Case/hooks/useCaseDecision/useCaseDecision';
import { useNominatimQuery } from '../../components/MapCell/hooks/useNominatimQuery/useNominatimQuery';
import { getAddressDeep } from '../useEntity/utils/get-address-deep/get-address-deep';
import { getPostRemoveDecisionEventName } from './get-post-remove-decision-event-name';
import { motionProps } from './motion-props';
import { selectDirectorsDocuments } from './selectors/selectDirectorsDocuments';
import { getPhoneNumberFormatter } from '../../../../common/utils/get-phone-number-formatter/get-phone-number-formatter';
import { useDocumentPageImages } from '@/pages/Entity/hooks/useTasks/hooks/useDocumentPageImages';
import { useDirectorsBlocks } from '@/pages/Entity/hooks/useTasks/hooks/useDirectorsBlocks';
import { useApproveTaskByIdMutation } from '@/domains/entities/hooks/mutations/useApproveTaskByIdMutation/useApproveTaskByIdMutation';
import { getPostApproveEventNameEvent } from '@/pages/Entity/components/CallToActionLegacy/hooks/useCallToActionLegacyLogic/useCallToActionLegacyLogic';
import { useAssociatedCompaniesBlock } from '@/pages/Entity/hooks/useTasks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { selectWorkflowDocuments } from '@/pages/Entity/hooks/useTasks/selectors/selectWorkflowDocuments';
import { useEventMutation } from '@/domains/workflows/hooks/mutations/useEventMutation/useEventMutation';

const pluginsOutputBlacklist = [
  'companySanctions',
  'directors',
  'ubo',
  'businessInformation',
  'website_monitoring',
];

const getDocumentsSchemas = (
  issuerCountryCode: Parameters<typeof getDocumentSchemaByCountry>[0],
  workflow: TWorkflowById,
) => {
  if (!issuerCountryCode) return;

  const documentSchemaByCountry = getDocumentSchemaByCountry(
    issuerCountryCode,
    workflow.workflowDefinition?.documentsSchema as TDocument[],
  )
    .concat(getDocumentsByCountry(issuerCountryCode))
    .reduce((unique: TDocument[], item: TDocument) => {
      const isDuplicate = unique.some(u => u.type === item.type && u.category === item.category);
      if (!isDuplicate) {
        unique.push(item);
      }
      return unique;
    }, [] as TDocument[])
    .filter((documentSchema: TDocument) => {
      if (!workflow.workflowDefinition.config?.availableDocuments) return true;

      const isIncludes = !!workflow.workflowDefinition.config?.availableDocuments.find(
        (availableDocument: TAvailableDocuments[number]) =>
          availableDocument.type === documentSchema.type &&
          availableDocument.category === documentSchema.category,
      );

      return isIncludes;
    });

  if (!Array.isArray(documentSchemaByCountry) || !documentSchemaByCountry.length) {
    console.warn(
      `No document schema found for issuer country code of "${issuerCountryCode}" and documents schema of\n`,
      workflow.workflowDefinition?.documentsSchema,
    );
  }

  return documentSchemaByCountry;
};

export const useDocumentBlocks = ({
  workflow,
  parentMachine,
  noAction,
  caseState,
  withEntityNameInHeader,
}) => {
  const issuerCountryCode = extractCountryCodeFromWorkflow(workflow);
  const documentsSchemas = getDocumentsSchemas(issuerCountryCode, workflow);
  const postApproveEventName = getPostApproveEventNameEvent(workflow);
  const documents = useMemo(() => selectWorkflowDocuments(workflow), [workflow]);
  const documentPages = useMemo(
    () => documents.flatMap(({ pages }) => pages?.map(({ ballerineFileId }) => ballerineFileId)),
    [documents],
  );
  const storageFilesQueryResult = useStorageFilesQuery(documentPages);
  const documentPagesResults = useDocumentPageImages(documents, storageFilesQueryResult);

  const { mutate: mutateApproveTaskById, isLoading: isLoadingApproveTaskById } =
    useApproveTaskByIdMutation(workflow?.id, postApproveEventName);
  const onMutateApproveTaskById = useCallback(
    ({
        taskId,
        contextUpdateMethod,
      }: {
        taskId: string;
        contextUpdateMethod: 'base' | 'director';
      }) =>
      () =>
        mutateApproveTaskById({ documentId: taskId, contextUpdateMethod }),
    [mutateApproveTaskById],
  );
  const postRemoveDecisionEventName = getPostRemoveDecisionEventName(workflow);
  const { mutate: onMutateRemoveDecisionById } = useRemoveDecisionTaskByIdMutation(
    workflow?.id,
    postRemoveDecisionEventName,
  );

  return (
    documents?.map(
      ({ id, type: docType, category, properties, propertiesSchema, decision }, docIndex) => {
        const additionalProperties = isExistingSchemaForDocument(documentsSchemas ?? [])
          ? composePickableCategoryType(
              category,
              docType,
              documentsSchemas ?? [],
              workflow?.workflowDefinition?.config,
            )
          : {};
        const isDoneWithRevision =
          decision?.status === 'revised' && parentMachine?.status === 'completed';
        const isDocumentRevision =
          decision?.status === CommonWorkflowStates.REVISION && (!isDoneWithRevision || noAction);

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
                        {!isLegacyReject && (
                          <X
                            className="h-4 w-4 cursor-pointer"
                            onClick={() => onMutateRemoveDecisionById({ documentId: id })}
                          />
                        )}
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

          const revisionReasons =
            workflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
              ({ enum: enum_ }) => !!enum_,
            )?.enum;
          const rejectionReasons =
            workflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.rejectionReason?.anyOf?.find(
              ({ enum: enum_ }) => !!enum_,
            )?.enum;

          return [
            {
              type: 'callToActionLegacy',
              // 'Reject' displays the dialog with both "block" and "ask for re-upload" options
              value: {
                text: isLegacyReject ? 'Reject' : 'Re-upload needed',
                props: {
                  revisionReasons,
                  rejectionReasons,
                  id,
                  disabled: (!isDoneWithRevision && Boolean(decision?.status)) || noAction,
                  decision: 'reject',
                },
              },
            },
            {
              type: 'callToAction',
              value: {
                text: 'Approve',
                onClick: onMutateApproveTaskById({
                  taskId: id,
                  contextUpdateMethod: 'base',
                }),
                props: {
                  disabled:
                    (!isDoneWithRevision && Boolean(decision?.status)) ||
                    noAction ||
                    isLoadingApproveTaskById,
                  size: 'wide',
                  variant: 'success',
                },
              },
            },
          ];
        };

        const entityNameOrNA = valueOrNA(toTitleCase(workflow?.context?.entity?.data?.name ?? ''));
        const categoryOrNA = valueOrNA(toTitleCase(category ?? ''));
        const documentTypeOrNA = valueOrNA(toTitleCase(docType ?? ''));
        const documentNameOrNA = `${categoryOrNA} - ${documentTypeOrNA}`;
        const headerCell = {
          id: 'header',
          type: 'container',
          value: [
            {
              type: 'heading',
              value: `${withEntityNameInHeader ? `${entityNameOrNA} ` : ''}${documentNameOrNA}`,
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
          workflowId: workflow?.id,
          documents: workflow?.context?.documents,
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
                    ...additionalProperties,
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
              workflowId: workflow?.id,
              documents: workflow?.context?.documents,
            },
            decisionCell,
          ],
        };

        const documentsCell = {
          type: 'multiDocuments',
          value: {
            isLoading: storageFilesQueryResult?.some(({ isLoading }) => isLoading),
            data:
              documents?.[docIndex]?.pages?.map(
                ({ type, fileName, metadata, ballerineFileId }, pageIndex) => ({
                  id: ballerineFileId,
                  title: `${valueOrNA(toTitleCase(category ?? ''))} - ${valueOrNA(
                    toTitleCase(docType ?? ''),
                  )}${metadata?.side ? ` - ${metadata?.side}` : ''}`,
                  imageUrl: documentPagesResults[docIndex][pageIndex],
                  fileType: type,
                  fileName,
                }),
              ) ?? [],
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
    ) ?? []
  );
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
  const {
    store,
    bank: bankDetails,
    directors: directorsUserProvided = [],
    mainRepresentative,
    mainContact,
    openCorporate: _openCorporate,
    ...entityDataAdditionalInfo
  } = workflow?.context?.entity?.data?.additionalInfo ?? {};
  const { website: websiteBasicRequirement, processingDetails, ...storeInfo } = store ?? {};
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const { noAction } = useCaseDecision();

  const directorsDocuments = useMemo(() => selectDirectorsDocuments(workflow), [workflow]);
  const directorDocumentPages = useMemo(
    () =>
      directorsDocuments.flatMap(({ pages }) =>
        pages?.map(({ ballerineFileId }) => ballerineFileId),
      ),
    [directorsDocuments],
  );
  const directorsStorageFilesQueryResult = useStorageFilesQuery(directorDocumentPages);
  const directorsDocumentPagesResults: Array<Array<string>> = useDocumentPageImages(
    directorsDocuments,
    directorsStorageFilesQueryResult,
  );

  const filteredPluginsOutput = useMemo(
    () => omitPropsFromObject(pluginsOutput, ...pluginsOutputBlacklist),
    [pluginsOutput],
  );

  const pluginsOutputKeys = Object.keys(filteredPluginsOutput ?? {});
  const address = getAddressDeep(filteredPluginsOutput, {
    propertyName: 'registeredAddressInFull',
  });
  const { data: locations } = useNominatimQuery(address);

  const registryInfoBlock =
    Object.keys(filteredPluginsOutput ?? {}).length === 0
      ? []
      : pluginsOutputKeys
          ?.filter(
            key =>
              !!Object.keys(filteredPluginsOutput[key] ?? {})?.length &&
              !('error' in filteredPluginsOutput[key]),
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
                  data: Object.entries(filteredPluginsOutput[key] ?? {})?.map(([title, value]) => ({
                    title,
                    value,
                  })),
                },
                workflowId: workflow?.id,
                documents: workflow?.context?.documents,
              },
            ],
          }));

  const kybRegistryInfoBlock =
    Object.keys(pluginsOutput?.businessInformation?.data?.[0] ?? {}).length === 0
      ? []
      : [
          {
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
              },
            ],
          },
        ];

  const parentDocumentBlocks = useDocumentBlocks({
    workflow,
    parentMachine,
    noAction,
    caseState,
    withEntityNameInHeader: false,
  });
  const childDocumentBlocks = useDocumentBlocks({
    workflow: workflow?.childWorkflows?.[0],
    parentMachine,
    noAction,
    caseState,
    withEntityNameInHeader: true,
  });

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
                    value: `${valueOrNA(toTitleCase(entity?.type ?? ''))} Information`,
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
                  title: `${valueOrNA(toTitleCase(entity?.type ?? ''))} Information`,
                  data: [
                    ...Object.entries(
                      omitPropsFromObject(entity?.data, 'additionalInfo', 'address') ?? {},
                    ),
                    ...Object.entries(omitPropsFromObject(entityDataAdditionalInfo ?? {}, 'ubos')),
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
                workflowId: workflow?.id,
                documents: workflow?.context?.documents,
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
                      value: `${valueOrNA(toTitleCase(entity?.type ?? ''))} Address`,
                    },
                    {
                      type: 'details',
                      hideSeparator: true,
                      value: {
                        title: `${valueOrNA(toTitleCase(entity?.type ?? ''))} Address`,
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
                      workflowId: workflow?.id,
                      documents: workflow?.context?.documents,
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

  const companySanctions = pluginsOutput?.companySanctions?.data?.map(sanction => ({
    sources: sanction?.entity?.sources,
    officialLists: sanction?.entity?.officialLists,
    fullReport: sanction,
    linkedIndividuals: sanction?.entity?.linkedIndividuals,
    lastReviewed: sanction?.entity?.lastReviewed,
    primaryName: sanction?.entity?.name,
    labels: sanction?.entity?.categories,
    reasonsForMatch: sanction?.matchedFields,
    furtherInformation: sanction?.entity?.furtherInformation,
    alternativeNames: sanction?.entity?.otherNames,
    places: sanction?.entity?.places,
  }));
  const ubos = pluginsOutput?.ubo?.data?.uboGraph?.map(ubo => ({
    name: ubo?.name,
    percentage: ubo?.shareHolders?.[0]?.sharePercentage,
    type: ubo?.type,
    level: ubo?.level,
  }));
  const directorsRegistryProvided = pluginsOutput?.directors?.data?.map(({ name, position }) => ({
    name,
    position,
  }));

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
                type: 'container',
                value: [
                  {
                    type: 'details',
                    value: {
                      data: Object.entries(omitPropsFromObject(storeInfo, 'websiteUrls'))?.map(
                        ([title, value]) => ({
                          title,
                          value,
                          isEditable: false,
                        }),
                      ),
                    },
                    workflowId: workflow?.id,
                    documents: workflow?.context?.documents,
                    hideSeparator: true,
                  },
                  {
                    type: 'table',
                    value: {
                      columns: [
                        {
                          accessorKey: 'websiteUrl',
                          header: 'Website URLs',
                        },
                      ],
                      data: storeInfo?.websiteUrls
                        ? storeInfo?.websiteUrls
                            ?.split(',')
                            ?.map(websiteUrl => ({ websiteUrl: websiteUrl?.trim() }))
                        : [],
                    },
                    hideSeparator: true,
                  },
                ],
              },
            ],
          },
        ];

  const websiteBasicRequirementBlock =
    Object.keys(websiteBasicRequirement ?? {}).length === 0
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
                value: 'User-provided Data',
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
                workflowId: workflow?.id,
                documents: workflow?.context?.documents,
                hideSeparator: true,
              },
            ],
          },
        ];

  const bankingDetailsBlock =
    Object.keys(bankDetails ?? {}).length === 0
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
                value: 'User-provided Data',
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
                workflowId: workflow?.id,
                documents: workflow?.context?.documents,
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
                value: 'User-provided Data',
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
                workflowId: workflow?.id,
                documents: workflow?.context?.documents,
                hideSeparator: true,
              },
            ],
          },
        ];

  const mainRepresentativeBlock =
    Object.keys(mainRepresentative ?? {}).length === 0
      ? []
      : [
          {
            cells: [
              {
                type: 'heading',
                value: 'Main Representative',
              },
              {
                type: 'subheading',
                value: 'User-provided Data',
              },
              {
                type: 'details',
                value: {
                  data: Object.entries(mainRepresentative)?.map(([title, value]) => {
                    const formatter =
                      getPhoneNumberFormatter(value) ?? getPhoneNumberFormatter(`+${value}`);

                    return {
                      title,
                      value: formatter?.formatInternational() ?? value,
                      isEditable: false,
                    };
                  }),
                },
                workflowId: workflow?.id,
                documents: workflow?.context?.documents,
                hideSeparator: true,
              },
            ],
          },
        ];
  const mainContactBlock =
    Object.keys(mainContact ?? {}).length === 0
      ? []
      : [
          {
            cells: [
              {
                type: 'heading',
                value: 'Main Contact',
              },
              {
                type: 'subheading',
                value: 'User-provided Data',
              },
              {
                type: 'details',
                value: {
                  data: Object.entries(mainContact ?? {})?.map(([title, value]) => {
                    const formatter =
                      getPhoneNumberFormatter(value) ?? getPhoneNumberFormatter(`+${value}`);

                    return {
                      title,
                      value: formatter?.formatInternational() ?? value,
                    };
                  }),
                },
                workflowId: workflow?.id,
                documents: workflow?.context?.documents,
                hideSeparator: true,
              },
            ],
          },
        ];

  const companySanctionsBlock = companySanctions
    ? [
        {
          cells: [
            {
              type: 'heading',
              value: 'Company Sanctions',
            },
            {
              type: 'container',
              value: [
                {
                  type: 'subheading',
                  value: 'Company check results',
                  props: {
                    className: 'text-lg my-4 block',
                  },
                },
                {
                  type: 'table',
                  value: {
                    columns: [
                      {
                        accessorKey: 'totalMatches',
                        header: 'Total matches',
                        cell: props => {
                          const value = props.getValue();

                          return (
                            <Badge
                              variant={'warning'}
                              className={`mb-1 rounded-lg px-2 py-1 font-bold`}
                            >
                              {value} {value === 1 ? 'match' : 'matches'}
                            </Badge>
                          );
                        },
                      },
                      {
                        accessorKey: 'fullReport',
                        header: 'Full report',
                      },
                    ],
                    data: [
                      {
                        totalMatches: companySanctions?.length,
                        fullReport: companySanctions,
                      },
                    ],
                  },
                },
              ],
            },
            ...companySanctions?.map((sanction, index) => ({
              type: 'container',
              props: {
                className: ctw({
                  'mt-2': index === 0,
                }),
              },
              value: [
                {
                  type: 'subheading',
                  value: `Match ${index + 1}`,
                  props: {
                    className: 'text-lg block ms-2 mb-6',
                  },
                },
                {
                  type: 'table',
                  value: {
                    props: {
                      table: {
                        className: 'mb-8',
                      },
                    },
                    columns: [
                      {
                        accessorKey: 'primaryName',
                        header: 'Primary name',
                      },
                      {
                        accessorKey: 'lastReviewed',
                        header: 'Last reviewed',
                      },
                    ],
                    data: [
                      {
                        primaryName: sanction?.primaryName,
                        lastReviewed: sanction?.lastReviewed,
                      },
                    ],
                  },
                },
                {
                  type: 'table',
                  value: {
                    props: {
                      table: {
                        className: 'my-8',
                      },
                    },
                    columns: [
                      {
                        accessorKey: 'label',
                        header: 'Labels',
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
                    ],
                    data: sanction?.labels?.map(label => ({ label })),
                  },
                },
                {
                  type: 'table',
                  value: {
                    props: {
                      table: {
                        className: 'my-8',
                      },
                    },
                    columns: [
                      {
                        accessorKey: 'reasonForMatch',
                        header: 'Reasons for Match',
                      },
                    ],
                    data: sanction?.reasonsForMatch?.map(reasonForMatch => ({
                      reasonForMatch: toTitleCase(reasonForMatch),
                    })),
                  },
                },
                {
                  type: 'table',
                  value: {
                    props: {
                      table: {
                        className: 'my-8',
                      },
                      cell: {
                        className: 'break-all w-[60ch]',
                      },
                    },
                    columns: [
                      {
                        accessorKey: 'source',
                        header: 'Sources',
                      },
                    ],
                    data: sanction?.sources
                      ?.map(({ url: source }) => ({ source }))
                      // TODO: Research why zod's url validation fails on some valid urls.
                      ?.filter(({ source }) => isValidUrl(source)),
                  },
                },
                {
                  type: 'table',
                  value: {
                    props: {
                      table: {
                        className: 'my-8',
                      },
                    },
                    columns: [
                      {
                        accessorKey: 'alternativeNames',
                        header: 'Alternative names',
                      },
                    ],
                    data: [
                      {
                        alternativeNames: sanction?.alternativeNames,
                      },
                    ],
                  },
                },
                {
                  type: 'table',
                  value: {
                    props: {
                      table: {
                        className: 'my-8',
                      },
                    },
                    columns: [
                      {
                        accessorKey: 'officialList',
                        header: 'Official lists',
                      },
                    ],
                    data: sanction?.officialLists?.map(({ description: officialList }) => ({
                      officialList,
                    })),
                  },
                },
                {
                  type: 'table',
                  value: {
                    props: {
                      table: {
                        className: 'my-8',
                      },
                    },
                    columns: [
                      {
                        accessorKey: 'furtherInformation',
                        header: 'Further information',
                      },
                    ],
                    data: sanction?.furtherInformation?.map(furtherInformation => ({
                      furtherInformation,
                    })),
                  },
                },
                {
                  type: 'table',
                  value: {
                    props: {
                      table: {
                        className: 'my-8',
                      },
                    },
                    columns: [
                      {
                        accessorKey: 'linkedIndividual',
                        header: 'Linked individual',
                      },
                      {
                        accessorKey: 'description',
                        header: 'Description',
                      },
                    ],
                    data: sanction?.linkedIndividuals?.map(
                      ({ firstName, middleName, lastName, description }) => ({
                        linkedIndividual: `${firstName}${
                          middleName ? `${middleName} ` : ''
                        } ${lastName}`,
                        description,
                      }),
                    ),
                  },
                },
                {
                  type: 'table',
                  value: {
                    props: {
                      table: {
                        className: 'my-8',
                      },
                    },
                    columns: [
                      {
                        accessorKey: 'country',
                        header: 'Linked address',
                      },
                      {
                        accessorKey: 'city',
                        header: 'City',
                      },
                      {
                        accessorKey: 'linkedAddress',
                        header: 'Address',
                      },
                    ],
                    data: sanction?.places?.map(({ country, city, address }) => ({
                      linkedAddress: address || 'N/A',
                      city: city || 'N/A',
                      country: country || 'N/A',
                    })),
                  },
                },
              ],
            })),
          ],
        },
      ]
    : [];

  const ubosBlock = ubos
    ? [
        {
          cells: [
            {
              type: 'heading',
              value: 'UBOs',
            },
            {
              type: 'subheading',
              value: 'Registry-provided Data',
              props: {
                className: 'mb-4',
              },
            },
            {
              type: 'table',
              value: {
                columns: [
                  {
                    accessorKey: 'name',
                    header: 'Name',
                  },
                  {
                    accessorKey: 'percentage',
                    header: 'Percentage (25% or higher)',
                  },
                  {
                    accessorKey: 'type',
                    header: 'Type',
                  },
                  {
                    accessorKey: 'level',
                    header: 'Level',
                  },
                ],
                data: ubos?.map(({ name, percentage, type, level }) => ({
                  name,
                  percentage,
                  type,
                  level,
                })),
              },
            },
          ],
        },
      ]
    : [];

  const directorsUserProvidedBlock =
    Object.keys(directorsUserProvided ?? {}).length === 0
      ? []
      : [
          {
            cells: [
              {
                type: 'heading',
                value: 'Directors',
              },
              {
                type: 'subheading',
                value: 'User-provided Data',
                props: {
                  className: 'mb-4',
                },
              },
              {
                type: 'table',
                value: {
                  columns: [
                    {
                      accessorKey: 'name',
                      header: 'Name',
                    },
                    {
                      accessorKey: 'nationality',
                      header: 'Nationality',
                    },
                    {
                      accessorKey: 'identityNumber',
                      header: 'Identity number',
                    },
                    {
                      accessorKey: 'email',
                      header: 'Email',
                    },
                    {
                      accessorKey: 'address',
                      header: 'Address',
                    },
                  ],
                  data: directorsUserProvided?.map(
                    ({
                      firstName,
                      lastName,
                      nationalId: identityNumber,
                      additionalInfo,
                      ...rest
                    }) => ({
                      ...rest,
                      name: `${firstName} ${lastName}`,
                      address: additionalInfo?.fullAddress,
                      nationality: additionalInfo?.nationality,
                      identityNumber,
                      ...omitPropsFromObject(additionalInfo, 'fullAddress', 'nationality'),
                    }),
                  ),
                },
              },
            ],
          },
        ];

  const directorsDocumentsBlocks = useDirectorsBlocks(
    workflow,
    directorsStorageFilesQueryResult,
    directorsDocumentPagesResults,
  );

  const directorsRegistryProvidedBlock = directorsRegistryProvided
    ? [
        {
          cells: [
            {
              type: 'heading',
              value: 'Directors',
            },
            {
              type: 'subheading',
              value: 'Registry-provided Data',
              props: {
                className: 'mb-4',
              },
            },
            {
              type: 'table',
              value: {
                columns: [
                  {
                    accessorKey: 'name',
                    header: 'Name',
                  },
                  {
                    accessorKey: 'position',
                    header: 'Position',
                  },
                ],
                data: directorsRegistryProvided,
              },
            },
          ],
        },
      ]
    : [];

  const websiteMonitoringAdapter = ({
    lsAction,
    merchantDetails,
    merchantDomains,
    createdAt: checkCreatedAt,
  }) => {
    const { reason, contentLabels, actions } = lsAction ?? {};
    const labels = contentLabels?.map(({ label: contentLabel }) => ({ contentLabel })) ?? [];
    const {
      // Merchant address
      merchantCountry,
      merchantRegion,
      merchantCity,
      merchantStreet,
      merchantPostalCode,

      // Business Owner address
      businessOwnerCountry,
      businessOwnerRegion,
      businessOwnerCity,
      businessOwnerStreet,
      businessOwnerPostalCode,

      // DBA address
      dbaCountry,
      dbaRegion,
      dbaCity,
      dbaStreet,
      dbaPostalCode,

      status,
      ...details
    } = merchantDetails ?? {};
    const domains = merchantDomains?.map(({ merchantUrl: domain, websiteRegistrar }) => {
      const { ianaNumber, riskLevel, name } = websiteRegistrar;

      return {
        domain,
        websiteRegistrar: name,
        ianaNumber,
        riskLevel,
      };
    });
    const addresses = [
      {
        entity: 'Merchant',
        country: merchantCountry,
        region: merchantRegion,
        city: merchantCity,
        street: merchantStreet,
        postalCode: merchantPostalCode,
      },
      {
        entity: 'Business Owner',
        country: businessOwnerCountry,
        region: businessOwnerRegion,
        city: businessOwnerCity,
        street: businessOwnerStreet,
        postalCode: businessOwnerPostalCode,
      },
      {
        entity: 'DBA',
        country: dbaCountry,
        region: dbaRegion,
        city: dbaCity,
        street: dbaStreet,
        postalCode: dbaPostalCode,
      },
    ];
    const checkResult = {
      checkCreatedAt,
      status,
    };
    const warnings = actions?.map(warning => ({ warning })) ?? [];

    return {
      reason,
      labels,
      addresses,
      domains,
      details,
      checkResult,
      warnings,
    };
  };
  const websiteMonitoring = websiteMonitoringAdapter(pluginsOutput?.website_monitoring?.data ?? {});
  const websiteMonitoringBlock =
    Object.keys(pluginsOutput?.website_monitoring?.data ?? {}).length === 0
      ? []
      : [
          {
            cells: [
              {
                type: 'container',
                value: [
                  {
                    type: 'container',
                    value: [
                      {
                        type: 'heading',
                        value: 'Website monitoring',
                      },
                      {
                        type: 'subheading',
                        value: '3rd Party Provided Data',
                        props: {
                          className: 'mb-4',
                        },
                      },
                    ],
                  },
                  {
                    id: 'visible-title',
                    type: 'table',
                    hideSeparator: true,
                    value: {
                      title: 'Result',
                      columns: [
                        {
                          accessorKey: 'status',
                          header: 'Status',
                          cell: props => {
                            const value = props.getValue();
                            const isCompleted = value === 'completed';

                            return (
                              <span
                                className={ctw({
                                  'text-warning': !isCompleted,
                                })}
                              >
                                {toTitleCase(websiteMonitoring?.checkResult?.status ?? '')}
                              </span>
                            );
                          },
                        },
                        {
                          accessorKey: 'checkCreatedAt',
                          header: 'Check Created at',
                        },
                      ],
                      data: [websiteMonitoring?.checkResult],
                    },
                  },
                  {
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'warning',
                          header: 'Warning',
                          cell: props => {
                            let value = props.getValue();

                            if (value === 'gbpp') {
                              value = 'virp';
                            }

                            const pickWarningVariant = (): ComponentProps<
                              typeof Badge
                            >['variant'] => {
                              const warnings = websiteMonitoring?.warnings?.map(
                                ({ warning }) => warning,
                              );
                              const isHighRisk =
                                (warnings?.includes('high_risk') &&
                                  websiteMonitoring?.warnings?.length > 1) ||
                                includesValues(['gbpp', 'bram', 'tl_confirmed'], warnings);
                              const isDestructive = ['virp', 'bram'].includes(value) || isHighRisk;
                              const isWarning = [
                                'high_risk',
                                'tc_moderate_risk',
                                'tl_suspected',
                                'offline_domain_moderate_risk',
                                'parked_domain_moderate_risk',
                              ].includes(value);
                              const isSlate = ['low_risk'].includes(value);
                              const isSuccess = ['cleared'].includes(value);

                              if (isDestructive) return 'destructive';
                              if (isWarning) return 'warning';
                              if (isSlate) return 'secondary';
                              if (isSuccess) return 'success';

                              return 'secondary';
                            };
                            const variant = pickWarningVariant();

                            if (isNullish(value) || value === '') {
                              return <span className={`text-slate-400`}>N/A</span>;
                            }

                            return (
                              <Badge
                                variant={variant}
                                className={ctw(`mb-1 rounded-lg px-2 py-1 font-bold`, {
                                  'text-slate-400': variant === 'secondary',
                                })}
                              >
                                {toUpperCase(toTitleCase(value))}
                              </Badge>
                            );
                          },
                        },
                      ],
                      data: websiteMonitoring?.warnings,
                    },
                  },
                ],
              },
              {
                type: 'table',
                value: {
                  props: {
                    table: {
                      className: 'mb-8',
                    },
                  },
                  columns: [
                    {
                      accessorKey: 'contentLabel',
                      header: 'Content Labels',
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
                  ],
                  data: websiteMonitoring?.labels,
                },
              },
              {
                type: 'container',
                value: [
                  {
                    type: 'subheading',
                    value: 'Reason',
                    props: {
                      className: 'mb-2',
                    },
                  },
                  {
                    type: 'paragraph',
                    value:
                      isNullish(websiteMonitoring?.reason) || websiteMonitoring?.reason === ''
                        ? 'N/A'
                        : websiteMonitoring?.reason,
                    props: {
                      className: ctw({
                        'text-slate-400':
                          isNullish(websiteMonitoring?.reason) || websiteMonitoring?.reason === '',
                      }),
                    },
                  },
                ],
              },
              {
                type: 'container',
                value: [
                  {
                    type: 'heading',
                    value: 'Merchant Domains',
                  },
                  {
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'domain',
                          header: 'Domain',
                        },
                        {
                          accessorKey: 'websiteRegistrar',
                          header: 'Website Registrar',
                        },
                        {
                          accessorKey: 'ianaNumber',
                          header: 'IANA Number',
                        },
                        {
                          accessorKey: 'riskLevel',
                          header: 'Risk Level',
                        },
                      ],
                      data: websiteMonitoring?.domains,
                    },
                  },
                ],
              },
              {
                type: 'container',
                value: [
                  {
                    type: 'heading',
                    value: 'Merchant Address',
                  },
                  {
                    type: 'table',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                      },
                      columns: [
                        {
                          accessorKey: 'entity',
                          header: 'Entity',
                        },
                        {
                          accessorKey: 'country',
                          header: 'Country',
                        },
                        {
                          accessorKey: 'region',
                          header: 'Region',
                        },
                        {
                          accessorKey: 'city',
                          header: 'City',
                        },
                        {
                          accessorKey: 'street',
                          header: 'Street',
                        },
                        {
                          accessorKey: 'postalCode',
                          header: 'Postal Code',
                        },
                      ],
                      data: websiteMonitoring?.addresses,
                    },
                  },
                ],
              },
              {
                type: 'container',
                value: [
                  {
                    type: 'heading',
                    value: 'Merchant Details',
                    props: {
                      className: 'mb-6',
                    },
                  },
                  {
                    type: 'details',
                    hideSeparator: true,
                    value: {
                      data: Object.entries(websiteMonitoring?.details ?? {})?.map(
                        ([title, value]) => ({
                          title,
                          value,
                        }),
                      ),
                    },
                    workflowId: workflow?.id,
                    documents: workflow?.context?.documents,
                  },
                ],
              },
            ],
          },
        ];
  const { mutate: mutateEvent, isLoading: isLoadingEvent } = useEventMutation();
  const onMutateEvent = useCallback(
    ({ workflowId, event }: Parameters<typeof mutateEvent>[0]) =>
      () =>
        mutateEvent({
          workflowId,
          event,
        }),
    [mutateEvent],
  );
  const kybChildWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'business',
  );
  const associatedCompaniesBlock = useAssociatedCompaniesBlock({
    workflows: kybChildWorkflows,
    tags: workflow?.tags ?? [],
    onMutateEvent,
    isLoadingEvent,
  });

  return useMemo(() => {
    return entity
      ? [
          ...websiteMonitoringBlock,
          ...entityInfoBlock,
          ...registryInfoBlock,
          ...associatedCompaniesBlock,
          ...childDocumentBlocks,
          ...kybRegistryInfoBlock,
          ...companySanctionsBlock,
          ...directorsUserProvidedBlock,
          ...directorsRegistryProvidedBlock,
          ...directorsDocumentsBlocks,
          ...ubosBlock,
          ...storeInfoBlock,
          ...websiteBasicRequirementBlock,
          ...bankingDetailsBlock,
          ...processingDetailsBlock,
          ...mainContactBlock,
          ...mainRepresentativeBlock,
          ...mapBlock,
          ...parentDocumentBlocks,
        ]
      : [];
  }, [
    address,
    caseState.writeEnabled,
    documents,
    entity,
    parentMachine?.status,
    pluginsOutput,
    pluginsOutputKeys,
    noAction,
  ]);
};
