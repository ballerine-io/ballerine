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
import { Badge } from '@ballerine/ui';
import { WarningFilledSvg } from '../../../../common/components/atoms/icons';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { toTitleCase } from 'string-ts';
import { isValidUrl } from '../../../../common/utils/is-valid-url';

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
  const {
    store: storeInfo,
    bank: bankDetails,
    directors: directorsUserProvided,
    mainRepresentative,
    mainContact,
  } = workflow?.context?.entity?.data?.additionalInfo ?? {};
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
  const pluginsOutputBlacklist = ['company_sanctions', 'directors', 'ubos'];
  const filteredPluginsOutput = useMemo(
    () => omitPropsFromObject(pluginsOutput, ...pluginsOutputBlacklist),
    [pluginsOutput, pluginsOutputBlacklist],
  );
  const pluginsOutputKeys = Object.keys(filteredPluginsOutput ?? {});
  const address = getAddressDeep(filteredPluginsOutput, {
    propertyName: 'registeredAddressInFull',
  });
  const { data: locations } = useNominatimQuery(address);
  const issuerCountryCode = extractCountryCodeFromWorkflow(workflow);
  const documentsSchemas = !!issuerCountryCode && getDocumentsByCountry(issuerCountryCode);

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

  const companySanctions = pluginsOutput?.company_sanctions?.data?.map(sanction => ({
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
  const ubos = pluginsOutput?.ubos?.data?.map(ubo => ({
    name: ubo?.name,
    percentage: ubo?.percentage,
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
                  data: Object.entries(mainRepresentative)?.map(([title, value]) => ({
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
                  data: Object.entries(mainContact ?? {})?.map(([title, value]) => ({
                    title,
                    value,
                  })),
                },
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
                            <Badge variant={'warning'} className={`rounded-lg py-4 font-bold`}>
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
                        accessorKey: 'linkedAddress',
                        header: 'Linked address',
                      },
                      {
                        accessorKey: 'city',
                        header: 'City',
                      },
                      {
                        accessorKey: 'country',
                        header: 'Country',
                      },
                    ],
                    data: sanction?.places?.map(({ country, city, address }) => ({
                      linkedAddress: address || 'Unavailable',
                      city: city || 'Unavailable',
                      country: country || 'Unavailable',
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
                    ({ firstName, lastName, fullAddress: address, ...rest }) => ({
                      name: `${firstName} ${lastName}`,
                      address,
                      ...rest,
                    }),
                  ),
                },
              },
            ],
          },
        ];

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

  return useMemo(() => {
    return entity
      ? [
          ...entityInfoBlock,
          ...registryInfoBlock,
          ...companySanctionsBlock,
          ...taskBlocks,
          ...directorsUserProvidedBlock,
          ...directorsRegistryProvidedBlock,
          ...ubosBlock,
          ...storeInfoBlock,
          ...websiteBasicRequirementBlock,
          ...bankingDetailsBlock,
          ...processingDetailsBlock,
          ...mainContactBlock,
          ...mainRepresentativeBlock,
          ...mapBlock,
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
