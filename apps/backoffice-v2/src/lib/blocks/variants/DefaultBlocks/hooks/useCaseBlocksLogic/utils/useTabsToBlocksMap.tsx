import { WorkflowDefinitionConfigTheme } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { createAssociatedCompanyDocumentBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/create-assosiacted-company-document-blocks';
import { createKycBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/create-kyc-blocks';
import { StateTag, WorkflowDefinitionConfigThemeEnum } from '@ballerine/common';
import { Tab } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/utils/get-variant-tabs';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntityLogic/utils';
import { useRevisionCaseAndDocumentsMutation } from '@/domains/entities/hooks/mutations/useRevisionCaseAndDocumentsMutation/useRevisionCaseAndDocumentsMutation';
import { useApproveCaseAndDocumentsMutation } from '@/domains/entities/hooks/mutations/useApproveCaseAndDocumentsMutation/useApproveCaseAndDocumentsMutation';
import { useEventMutation } from '@/domains/workflows/hooks/mutations/useEventMutation/useEventMutation';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { TAllBlocks } from '../../useDefaultBlocksLogic/constants';
import { ReactNode, useCallback, useMemo } from 'react';
import { useKYCBlocks } from '../hooks/useKYCBlocks/useKYCBlocks';
import { useMutation } from '@tanstack/react-query';
import { Method } from '@/common/enums';
import { apiClient } from '@/common/api-client/api-client';
import { z } from 'zod';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { toast } from 'sonner';
import { t } from 'i18next';
import { useObjectEntriesBlock } from '@/lib/blocks/hooks/useObjectEntriesBlock/useObjectEntriesBlock';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import {
  EDIT_TEMPLATES,
  useEditCollectionFlow,
} from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useEditCollectionFlow';
import { Blocks } from '@ballerine/blocks';
import {
  Building2Icon,
  DatabaseIcon,
  FileTextIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  StoreIcon,
} from 'lucide-react';

export type TCaseBlocksCreationProps = {
  workflow: TWorkflowById;
  onReuploadNeeded: (params: {
    workflowId: string;
    documentId: string;
    reason?: string;
  }) => () => void;
  isLoadingReuploadNeeded: boolean;
};

type TNoDataTabState = {
  title: string;
  description: string;
  icon: ReactNode;
};

const getNoDataTabBlocks = ({ title, description, icon }: TNoDataTabState): Blocks =>
  createBlocksTyped()
    .addBlock()
    .addCell({
      type: 'noData',
      value: {
        title,
        description,
        icon: <>{icon}</>,
      },
      props: {},
    })
    .build();

const withNoDataFallback = (tabBlocks: Blocks, fallback: TNoDataTabState): Blocks => {
  if (tabBlocks.length > 0) {
    return tabBlocks;
  }

  return getNoDataTabBlocks(fallback);
};

export const initiateIndividualVerificationAndSendEmail = async ({
  endUserId,
  workflowRuntimeDataId,
  vendor,
  withAml,
  ongoingMonitoring,
  language,
  revisionReason,
}: {
  endUserId: string;
  workflowRuntimeDataId: string;
  vendor: 'veriff';
  withAml?: boolean;
  ongoingMonitoring?: boolean;
  language: string;
  revisionReason?: string;
}) => {
  const [response, error] = await apiClient({
    endpoint: `../external/kyc`,
    method: Method.POST,
    body: {
      endUserId,
      workflowRuntimeDataId,
      vendor,
      withAml,
      ongoingMonitoring,
      language,
      revisionReason,
    },
    schema: z.object({
      checkId: z.string(),
      sessionId: z.string(),
      url: z.string(),
    }),
  });

  return handleZodError(error, response);
};

export const useInitiateIndividualVerificationAndSendEmailMutation = () => {
  return useMutation({
    mutationFn: initiateIndividualVerificationAndSendEmail,
    onSuccess: () => {
      toast.success(t('toast:approve_case.success'));
    },
    onError: () => {
      toast.error(t('toast:approve_case.error'));
    },
  });
};

export const useTabsToBlocksMap = ({
  blocks,
  blocksCreationParams,
  theme,
}: {
  blocks: TAllBlocks;
  blocksCreationParams: TCaseBlocksCreationProps;
  theme?: WorkflowDefinitionConfigTheme;
}) => {
  const {
    websiteMonitoringBlock,
    entityInfoBlock,
    registryInfoBlock,
    kybRegistryInfoBlock,
    companySanctionsBlock,
    individualsUserProvidedBlock,
    individualsRegistryProvidedBlock,
    ubosRegistryProvidedBlock,
    storeInfoBlock,
    websiteBasicRequirementBlock,
    bankingDetailsBlock,
    processingDetailsBlock,
    mainContactBlock,
    mainRepresentativeBlock,
    mapBlock,
    businessDocumentBlocks,
    uboDocumentBlocks,
    directorDocumentBlocks,
    associatedCompaniesBlock,
    associatedCompaniesInformationBlock,
    websiteMonitoringBlocks,
    documentReviewBlocks,
    businessInformationBlocks,
    caseOverviewBlock,
    customDataBlock,
    amlWithContainerBlock,
    merchantScreeningBlock,
    manageUbosBlock,
    bankAccountVerificationBlock,
    commercialCreditCheckBlock,
    aiSummaryBlock,
    entityAdditionalInfoBlock,
    headquartersAddressWithContainerBlock,
    entityAddressWithContainerBlock,
    verificationResultsBlock,
  } = blocks;

  const { mutate: mutateApproveCase, isLoading: isLoadingApproveCase } =
    useApproveCaseAndDocumentsMutation({
      // Shouldnt be v2 for KYC
      isDocumentsV2: false,
    });
  const { isLoading: isLoadingRevisionCase, mutate: mutateRevisionCase } =
    useRevisionCaseAndDocumentsMutation({
      // Shouldnt be v2 for KYC
      isDocumentsV2: false,
    });

  const { mutate: mutateEvent } = useEventMutation();
  const { mutate: mutateInitiateIndividualVerificationAndSendEmail } =
    useInitiateIndividualVerificationAndSendEmailMutation();

  const { onEditCollectionFlow: onEditCompanyOwnership } = useEditCollectionFlow(
    EDIT_TEMPLATES.COMPANY_OWNERSHIP,
  );
  const getInitiateKycEvent = (nextEvents: string[]) => {
    if (nextEvents?.includes('start')) {
      return 'start';
    }
  };
  const getInitiateSanctionsScreeningEvent = (nextEvents: string[]) => {
    if (nextEvents?.includes('initiate_sanctions_screening')) {
      return 'initiate_sanctions_screening';
    }
  };

  const { data: session } = useAuthenticatedUserQuery();
  const { data: workflow } = useCurrentCaseQuery();
  const caseState = useCaseState(session?.user ?? null, workflow);
  const { endUsers } = workflow ?? {};

  const getStatusFromTags = useCallback((tags: string[]) => {
    if (tags?.includes(StateTag.REVISION)) {
      return 'revision';
    }

    if (tags?.includes(StateTag.APPROVED)) {
      return 'approved';
    }

    if (tags?.includes(StateTag.REJECTED)) {
      return 'rejected';
    }

    if (tags?.includes(StateTag.PENDING_PROCESS)) {
      return 'pending';
    }
  }, []);

  const getStatusFromCheckStatus = useCallback((status: string | undefined) => {
    if (status === 'in-progress') {
      return 'pending';
    }

    // TODO: Approved

    // TODO: Rejected

    // TODO: Revision
  }, []);
  const childWorkflowToIndividualAdapter = useCallback(
    (childWorkflow: NonNullable<TWorkflowById['childWorkflows']>[number]) => {
      const initiateKycEvent = getInitiateKycEvent(childWorkflow?.nextEvents ?? []);
      const initiateSanctionsScreeningEvent = getInitiateSanctionsScreeningEvent(
        childWorkflow?.nextEvents ?? [],
      );
      const {
        amlHits,
        id: _id,
        additionalInfo,
        dateOfBirth,
        gender,
        individualVerificationsChecks,
        ...endUserRest
      } = endUsers?.find(
        endUser => endUser.id === childWorkflow?.context?.entity?.data?.ballerineEntityId,
      ) ?? {};
      const {
        gender: genderAdditionalInfo,
        dateOfBirth: dateOfBirthAdditionalInfo,
        role,
        isAuthorizedSignatory,
        percentageOfOwnership,
        ...additionalInfoRest
      } = additionalInfo ?? {};
      const statusFromTags = getStatusFromTags(childWorkflow?.tags ?? []);
      const statusFromCheckStatus = getStatusFromCheckStatus(individualVerificationsChecks?.status);
      const status = statusFromCheckStatus ?? statusFromTags;
      const kycSession = omitPropsFromObject(
        childWorkflow?.context?.pluginsOutput?.kyc_session ?? {},
        'invokedAt',
        'error',
        'name',
        'status',
        'isRequestTimedOut',
      );

      return {
        status,
        documents: [
          ...(childWorkflow?.context?.documents ?? []),
          ...(childWorkflow?.context?.kycDocuments ?? []),
        ],
        kycSession: individualVerificationsChecks?.data ?? kycSession,
        aml: {
          vendor: amlHits?.find(aml => !!aml.vendor)?.vendor,
          hits: amlHits,
        },
        entityData: {
          ...endUserRest,
          additionalInfo: additionalInfoRest,
          gender: gender ?? genderAdditionalInfo,
          dateOfBirth: dateOfBirth ?? dateOfBirthAdditionalInfo,
          role,
          isAuthorizedSignatory,
          percentageOfOwnership,
        },
        isActionsDisabled:
          !caseState.actionButtonsEnabled || !childWorkflow?.tags?.includes(StateTag.MANUAL_REVIEW),
        isLoadingReuploadNeeded: isLoadingRevisionCase,
        isLoadingApprove: isLoadingApproveCase,
        onInitiateKyc: () => {
          if (!childWorkflow?.id) {
            console.error('No workflow id found');
            toast.error('Something went wrong. Please try again later.');

            return;
          }

          return mutateInitiateIndividualVerificationAndSendEmail({
            endUserId: childWorkflow?.context?.entity?.data?.ballerineEntityId,
            ongoingMonitoring: false,
            withAml: true,
            workflowRuntimeDataId: childWorkflow?.id,
            vendor: 'veriff',
            language: childWorkflow?.workflowDefinition?.config?.language ?? 'en',
          });
        },
        onInitiateSanctionsScreening: () => {
          if (!initiateSanctionsScreeningEvent) {
            return;
          }

          mutateEvent({
            workflowId: childWorkflow?.id,
            event: initiateSanctionsScreeningEvent,
          });
        },
        onApprove:
          ({ ids }: { ids: string[] }) =>
          () =>
            mutateApproveCase({ ids, workflowId: childWorkflow?.id }),
        onReuploadNeeded:
          ({ reason, ids }: { reason: string; ids: string[] }) =>
          () =>
            mutateRevisionCase({
              revisionReason: reason,
              ids,
              workflowId: childWorkflow?.id,
            }),
        onEdit: onEditCompanyOwnership,
        reasons:
          childWorkflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
            ({ enum: enum_ }) => !!enum_,
          )?.enum as string[],
        isReuploadNeededDisabled: isLoadingRevisionCase,
        isApproveDisabled: isLoadingApproveCase,
        isInitiateKycDisabled: [
          !childWorkflow?.id,
          !caseState.actionButtonsEnabled,
          !workflow?.workflowDefinition?.config?.isInitiateKycEnabled,
        ].some(Boolean),
        isInitiateSanctionsScreeningDisabled: [
          !initiateSanctionsScreeningEvent,
          !caseState.actionButtonsEnabled,
          !workflow?.workflowDefinition?.config?.isInitiateSanctionsScreeningEnabled,
        ].some(Boolean),
        isEditDisabled: [
          !caseState.actionButtonsEnabled,
          !workflow?.workflowDefinition?.config?.isKycEndUserEditEnabled,
        ].some(Boolean),
      } satisfies Parameters<typeof createKycBlocks>[0][number];
    },
    [
      getStatusFromCheckStatus,
      mutateInitiateIndividualVerificationAndSendEmail,
      getStatusFromTags,
      getInitiateKycEvent,
      getInitiateSanctionsScreeningEvent,
      endUsers,
      caseState.actionButtonsEnabled,
      isLoadingRevisionCase,
      isLoadingApproveCase,
      mutateEvent,
      mutateApproveCase,
      mutateRevisionCase,
      workflow?.workflowDefinition?.config?.isInitiateSanctionsScreeningEnabled,
      workflow?.workflowDefinition?.config?.isInitiateKycEnabled,
      workflow?.workflowDefinition?.config?.isKycEndUserEditEnabled,
      onEditCompanyOwnership,
    ],
  );
  const directorToIndividualAdapter = useCallback(
    ({
      kycSession,
      aml,
      status,
      ...director
    }: NonNullable<
      TWorkflowById['context']['entity']['data']['additionalInfo']['directors']
    >[number]) => {
      const { id: _id, additionalInfo, dateOfBirth, gender, ...directorRest } = director ?? {};
      const {
        gender: genderAdditionalInfo,
        dateOfBirth: dateOfBirthAdditionalInfo,
        role,
        isAuthorizedSignatory,
        percentageOfOwnership,
        ...additionalInfoRest
      } = additionalInfo ?? {};

      return {
        status,
        documents: director?.documents,
        kycSession,
        aml,
        entityData: {
          ...directorRest,
          additionalInfo: additionalInfoRest,
          gender: gender ?? genderAdditionalInfo,
          dateOfBirth: dateOfBirth ?? dateOfBirthAdditionalInfo,
          role,
          isAuthorizedSignatory,
          percentageOfOwnership,
        },
        isActionsDisabled: true,
        isLoadingReuploadNeeded: false,
        isLoadingApprove: false,
        onInitiateKyc: () => {
          if (!workflow?.id) {
            console.error('No workflow id found');
            toast.error('Something went wrong. Please try again later.');

            return;
          }

          return mutateInitiateIndividualVerificationAndSendEmail({
            endUserId: director.id,
            ongoingMonitoring: false,
            withAml: true,
            workflowRuntimeDataId: workflow?.id,
            vendor: 'veriff',
            language: workflow?.workflowDefinition?.config?.language ?? 'en',
          });
        },
        onInitiateSanctionsScreening: () => {},
        onApprove:
          ({ ids }: { ids: string[] }) =>
          () => {},
        onReuploadNeeded:
          ({ reason, ids }: { reason: string; ids: string[] }) =>
          () => {},
        onEdit: onEditCompanyOwnership,
        reasons: [],
        isReuploadNeededDisabled: true,
        isApproveDisabled: true,
        isInitiateKycDisabled: [
          !workflow?.id,
          !caseState.actionButtonsEnabled,
          !workflow?.workflowDefinition?.config?.isInitiateKycEnabled,
        ].some(Boolean),
        isInitiateSanctionsScreeningDisabled: true,
        isEditDisabled: [
          !caseState.actionButtonsEnabled,
          !workflow?.workflowDefinition?.config?.isKycEndUserEditEnabled,
        ].some(Boolean),
      } satisfies Parameters<typeof createKycBlocks>[0][number];
    },
    [
      mutateInitiateIndividualVerificationAndSendEmail,
      onEditCompanyOwnership,
      workflow?.workflowDefinition?.config?.language,
      workflow?.id,
      caseState.actionButtonsEnabled,
      workflow?.workflowDefinition?.config?.isInitiateKycEnabled,
      workflow?.workflowDefinition?.config?.isKycEndUserEditEnabled,
    ],
  );
  const childWorkflows = useMemo(
    () =>
      workflow?.childWorkflows
        ?.filter(childWorkflow => childWorkflow?.context?.entity?.type === 'individual')
        ?.map(childWorkflowToIndividualAdapter) ?? [],
    [workflow?.childWorkflows, childWorkflowToIndividualAdapter],
  );

  const deDupedDirectors = useMemo(
    () =>
      workflow?.context?.entity?.data?.additionalInfo?.directors
        ?.filter(
          director =>
            !workflow?.childWorkflows?.some(
              childWorkflow =>
                childWorkflow.context?.entity?.data?.ballerineEntityId ===
                director.ballerineEntityId,
            ),
        )
        ?.map(director => {
          const { amlHits, individualVerificationsChecks, ...directorEndUser } =
            endUsers?.find(endUser => endUser.id === director.ballerineEntityId) ?? {};
          const status = getStatusFromCheckStatus(individualVerificationsChecks?.status);

          return directorToIndividualAdapter({
            ...directorEndUser,
            kycSession: individualVerificationsChecks?.data ?? {},
            aml: {
              vendor: amlHits?.find(aml => !!aml.vendor)?.vendor,
              hits: amlHits,
            },
            status,
            documents: [...(director?.documents ?? []), ...(workflow?.context?.kycDocuments ?? [])],
          });
        }) ?? [],
    [workflow, endUsers, directorToIndividualAdapter, getStatusFromCheckStatus],
  );

  const personOfInterestToIndividualAdapter = useCallback(
    ({
      ballerineEntityId,
      role,
    }: NonNullable<
      TWorkflowById['context']['entity']['data']['additionalInfo']['peopleOfInterest']
    >[number]) => {
      const {
        id: _id,
        amlHits,
        individualVerificationsChecks,
        ...personOfInterestEndUser
      } = endUsers?.find(endUser => endUser.id === ballerineEntityId) ?? {};
      const status = getStatusFromCheckStatus(individualVerificationsChecks?.status);
      const kycSession = omitPropsFromObject(
        individualVerificationsChecks?.data ?? {},
        'invokedAt',
        'error',
        'name',
        'status',
        'isRequestTimedOut',
      );

      return {
        status,
        documents: [],
        kycSession,
        aml: {
          vendor: amlHits?.find(aml => !!aml.vendor)?.vendor,
          hits: amlHits,
        },
        entityData: {
          ...personOfInterestEndUser,
          role,
        },
        isActionsDisabled: true,
        isLoadingReuploadNeeded: false,
        isLoadingApprove: false,
        onInitiateKyc: () => {
          if (!workflow?.id) {
            console.error('No workflow id found');
            toast.error('Something went wrong. Please try again later.');

            return;
          }

          return mutateInitiateIndividualVerificationAndSendEmail({
            endUserId: ballerineEntityId,
            ongoingMonitoring: false,
            withAml: true,
            workflowRuntimeDataId: workflow?.id,
            vendor: 'veriff',
            language: workflow?.workflowDefinition?.config?.language ?? 'en',
          });
        },
        onInitiateSanctionsScreening: () => {},
        onApprove:
          ({ ids }: { ids: string[] }) =>
          () => {},
        onReuploadNeeded:
          ({ reason, ids }: { reason: string; ids: string[] }) =>
          () => {},
        onEdit: onEditCompanyOwnership,
        reasons: [],
        isReuploadNeededDisabled: true,
        isApproveDisabled: true,
        isInitiateKycDisabled: [
          !workflow?.id,
          !caseState.actionButtonsEnabled,
          !workflow?.workflowDefinition?.config?.isInitiateKycEnabled,
        ].some(Boolean),
        isInitiateSanctionsScreeningDisabled: true,
        isEditDisabled: [
          !caseState.actionButtonsEnabled,
          !workflow?.workflowDefinition?.config?.isKycEndUserEditEnabled,
        ].some(Boolean),
      } satisfies Parameters<typeof createKycBlocks>[0][number];
    },
    [
      workflow?.id,
      caseState.actionButtonsEnabled,
      workflow?.workflowDefinition?.config?.isInitiateKycEnabled,
      workflow?.workflowDefinition?.config?.isKycEndUserEditEnabled,
      endUsers,
      getStatusFromCheckStatus,
      mutateInitiateIndividualVerificationAndSendEmail,
      onEditCompanyOwnership,
      workflow?.workflowDefinition?.config?.language,
    ],
  );

  const peopleOfInterest = useMemo(
    () =>
      workflow?.context?.entity?.data?.additionalInfo?.peopleOfInterest?.map(
        personOfInterestToIndividualAdapter,
      ) ?? [],
    [
      workflow?.context?.entity?.data?.additionalInfo?.peopleOfInterest,
      personOfInterestToIndividualAdapter,
    ],
  );

  const individuals = useMemo(
    () => [...childWorkflows, ...deDupedDirectors, ...peopleOfInterest],
    [childWorkflows, deDupedDirectors, peopleOfInterest],
  );

  const kycBlocks = useKYCBlocks(individuals);

  // Sierra Leone: expose device dedup/link risk signals (shared-device graphs) in the backoffice UI.
  // This is populated by Ballerine workflow apiPlugins:
  // - device_dedup_check (check-duplicate endpoint on Unified API)
  // - device_indexing
  // - device_linking
  const deviceSignalsBlock = useObjectEntriesBlock({
    object: (() => {
      const entityDevice = blocksCreationParams?.workflow?.context?.entity?.data?.device;
      const pluginsOutput = blocksCreationParams?.workflow?.context?.pluginsOutput ?? {};

      const deviceDedup = (pluginsOutput as any)?.device_dedup_check;
      const deviceIndexing = (pluginsOutput as any)?.device_indexing;
      const deviceLinking = (pluginsOutput as any)?.device_linking;

      const out: Record<string, any> = {};

      if (entityDevice) {
        out.providedDeviceSignals = entityDevice;
      }

      if (deviceDedup) {
        out.deviceDeduplication = deviceDedup;
      }

      if (deviceIndexing) {
        out.deviceIndexing = deviceIndexing;
      }

      if (deviceLinking) {
        out.deviceLinking = deviceLinking;
      }

      return out;
    })(),
    heading: 'Device Signals',
    subheading: 'Deduplication and shared-device risk (Unified API)',
  });

  const identityVerificationDeepLinkBlock = useMemo(() => {
    const workflowRuntimeDataId = blocksCreationParams?.workflow?.id;
    const entityId = blocksCreationParams?.workflow?.context?.entity?.id;

    if (!workflowRuntimeDataId) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'callToAction',
        value: {
          text: 'Open Identity Verification Checks',
          onClick: () => {
            if (typeof window === 'undefined') {
              return;
            }

            const locale = window.location.pathname.split('/')[1] || 'en';
            const searchParams = new URLSearchParams();
            searchParams.set('workflowRuntimeDataId', workflowRuntimeDataId);

            if (entityId) {
              searchParams.set('entityId', entityId);
            }

            window.location.assign(`/${locale}/identity-verification?${searchParams.toString()}`);
          },
          props: {
            variant: 'outline',
            className: 'w-fit',
          },
        },
      })
      .build();
  }, [blocksCreationParams?.workflow?.context?.entity?.id, blocksCreationParams?.workflow?.id]);

  const summaryBlocks = [
    ...(blocksCreationParams?.workflow?.workflowDefinition?.config?.isCaseOverviewEnabled
      ? caseOverviewBlock
      : []),
    ...websiteMonitoringBlock,
    ...(aiSummaryBlock ? aiSummaryBlock : []),
    ...(blocksCreationParams?.workflow?.context?.pluginsOutput?.merchantScreening
      ? merchantScreeningBlock
      : []),
  ];

  const kybBlocks = [
    ...kybRegistryInfoBlock,
    ...ubosRegistryProvidedBlock,
    ...companySanctionsBlock,
    ...entityInfoBlock,
    ...entityAddressWithContainerBlock,
    ...headquartersAddressWithContainerBlock,
    ...entityAdditionalInfoBlock,
    ...registryInfoBlock,
    // ...mapBlock,
    ...bankingDetailsBlock,
    ...bankAccountVerificationBlock,
    ...commercialCreditCheckBlock,
  ];

  const storeBlocks = [
    ...storeInfoBlock,
    ...processingDetailsBlock,
    ...websiteBasicRequirementBlock,
  ];
  const documentsBlocks = [...businessDocumentBlocks];
  const individualsBlocks = [
    ...individualsUserProvidedBlock,
    ...individualsRegistryProvidedBlock,
    ...deviceSignalsBlock,
    ...amlWithContainerBlock,
    ...mainRepresentativeBlock,
    ...uboDocumentBlocks,
    ...directorDocumentBlocks,
    ...kycBlocks,
  ];
  const associatedCompaniesBlocks = [
    ...associatedCompaniesBlock,
    ...associatedCompaniesInformationBlock,
    ...createAssociatedCompanyDocumentBlocks(blocksCreationParams),
  ];
  const monitoringReportBlocks = [...websiteMonitoringBlocks];
  const customDataBlocks = [...customDataBlock];

  const defaultTabsMap = {
    [Tab.SUMMARY]: withNoDataFallback(summaryBlocks, {
      title: 'Summary Pending',
      description:
        'Summary insights will appear after checks and enrichment complete for this case.',
      icon: <LayoutDashboardIcon className="text-slate-400 d-12" />,
    }),
    [Tab.KYB]: withNoDataFallback(kybBlocks, {
      title: 'KYB Details Not Available Yet',
      description: 'Business profile and KYB details have not been collected for this case yet.',
      icon: <Building2Icon className="text-slate-400 d-12" />,
    }),
    [Tab.STORE_INFO]: withNoDataFallback(storeBlocks, {
      title: 'Store Information Not Available',
      description: 'Store and processing information has not been submitted for this case.',
      icon: <StoreIcon className="text-slate-400 d-12" />,
    }),
    [Tab.DOCUMENTS]: withNoDataFallback(documentsBlocks, {
      title: 'No Documents Submitted',
      description: 'No business documents have been uploaded for this case yet.',
      icon: <FileTextIcon className="text-slate-400 d-12" />,
    }),
    [Tab.INDIVIDUALS]: withNoDataFallback(individualsBlocks, {
      title: 'No Individuals Linked',
      description: 'No directors, owners, or related individuals are linked to this case yet.',
      icon: <Building2Icon className="text-slate-400 d-12" />,
    }),
    [Tab.ASSOCIATED_COMPANIES]: withNoDataFallback(associatedCompaniesBlocks, {
      title: 'No Associated Companies',
      description: 'No associated company data has been provided for this case yet.',
      icon: <Building2Icon className="text-slate-400 d-12" />,
    }),
    [Tab.MONITORING_REPORTS]: withNoDataFallback(monitoringReportBlocks, {
      title: 'No Web Presence Results',
      description: 'Web presence monitoring has not produced results for this case yet.',
      icon: <GlobeIcon className="text-slate-400 d-12" />,
    }),
    [Tab.CUSTOM_DATA]: withNoDataFallback(customDataBlocks, {
      title: 'No Custom Data Provided',
      description: 'No customer-provided custom data is available for this case.',
      icon: <DatabaseIcon className="text-slate-400 d-12" />,
    }),
  } as const;

  if (theme?.type === WorkflowDefinitionConfigThemeEnum.KYB) {
    return defaultTabsMap;
  }

  if (theme?.type === WorkflowDefinitionConfigThemeEnum.DOCUMENTS_REVIEW) {
    return {
      [Tab.DOCUMENTS]: [...documentReviewBlocks],
    } as const;
  }

  if (theme?.type === WorkflowDefinitionConfigThemeEnum.KYC) {
    return {
      [Tab.KYC_PROFILE]: [
        ...businessInformationBlocks,
        ...entityAddressWithContainerBlock,
        ...entityAdditionalInfoBlock,
      ],
      [Tab.KYC_DOCUMENTS]: [...businessDocumentBlocks],
      [Tab.KYC_VERIFICATION]: [...identityVerificationDeepLinkBlock, ...verificationResultsBlock],
      [Tab.KYC_AML]: [...amlWithContainerBlock],
      [Tab.KYC_CUSTOM_DATA]: [...customDataBlock],
    } as const;
  }

  return defaultTabsMap;
};
