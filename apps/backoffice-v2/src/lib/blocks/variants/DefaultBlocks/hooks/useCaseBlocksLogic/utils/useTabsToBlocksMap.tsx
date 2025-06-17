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
import { useCallback, useMemo } from 'react';
import { useKYCBlocks } from '../hooks/useKYCBlocks/useKYCBlocks';
import { useMutation } from '@tanstack/react-query';
import { Method } from '@/common/enums';
import { apiClient } from '@/common/api-client/api-client';
import { z } from 'zod';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { toast } from 'sonner';
import { t } from 'i18next';
import {
  EDIT_TEMPLATES,
  useEditCollectionFlow,
} from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useEditCollectionFlow';

export type TCaseBlocksCreationProps = {
  workflow: TWorkflowById;
  onReuploadNeeded: (params: {
    workflowId: string;
    documentId: string;
    reason?: string;
  }) => () => void;
  isLoadingReuploadNeeded: boolean;
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
      const {
        id: _id,
        additionalInfo,
        dateOfBirth,
        gender,
        role,
        ...directorRest
      } = director ?? {};
      const {
        gender: genderAdditionalInfo,
        dateOfBirth: dateOfBirthAdditionalInfo,
        role: roleAdditionalInfo,
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
          role: role ?? roleAdditionalInfo,
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

  const dedupedDirectors = useMemo(
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

  const uboToIndividualAdapter = useCallback(
    ({
      kycSession,
      aml,
      status,
      ...ubo
    }: NonNullable<
      TWorkflowById['context']['entity']['data']['additionalInfo']['ubos']
    >[number]) => {
      const { id: _id, additionalInfo, dateOfBirth, gender, role, ...uboRest } = ubo ?? {};
      const {
        gender: genderAdditionalInfo,
        dateOfBirth: dateOfBirthAdditionalInfo,
        role: roleAdditionalInfo,
        isAuthorizedSignatory,
        percentageOfOwnership,
        ...additionalInfoRest
      } = additionalInfo ?? {};

      return {
        status,
        documents: ubo?.documents,
        kycSession,
        aml,
        entityData: {
          ...uboRest,
          additionalInfo: additionalInfoRest,
          gender: gender ?? genderAdditionalInfo,
          dateOfBirth: dateOfBirth ?? dateOfBirthAdditionalInfo,
          role: role ?? roleAdditionalInfo,
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
            endUserId: ubo.id,
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

  const dedupedUbos = useMemo(
    () =>
      workflow?.context?.entity?.data?.additionalInfo?.ubos
        ?.filter(
          ubo =>
            !workflow?.childWorkflows?.some(
              childWorkflow =>
                childWorkflow.context?.entity?.data?.ballerineEntityId === ubo.ballerineEntityId,
            ),
        )
        ?.map(ubo => {
          const { amlHits, individualVerificationsChecks, ...uboEndUser } =
            endUsers?.find(endUser => endUser.id === ubo.ballerineEntityId) ?? {};
          const status = getStatusFromCheckStatus(individualVerificationsChecks?.status);

          return uboToIndividualAdapter({
            ...uboEndUser,
            kycSession: individualVerificationsChecks?.data ?? {},
            aml: {
              vendor: amlHits?.find(aml => !!aml.vendor)?.vendor,
              hits: amlHits,
            },
            status,
            documents: [...(ubo?.documents ?? []), ...(workflow?.context?.kycDocuments ?? [])],
          });
        }) ?? [],
    [workflow, endUsers, uboToIndividualAdapter, getStatusFromCheckStatus],
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
    () => [...childWorkflows, ...dedupedDirectors, ...dedupedUbos, ...peopleOfInterest],
    [childWorkflows, dedupedDirectors, dedupedUbos, peopleOfInterest],
  );

  const kycBlocks = useKYCBlocks(individuals);

  const defaultTabsMap = {
    [Tab.SUMMARY]: [
      ...(blocksCreationParams?.workflow?.workflowDefinition?.config?.isCaseOverviewEnabled
        ? caseOverviewBlock
        : []),
      ...websiteMonitoringBlock,
      ...(aiSummaryBlock ? aiSummaryBlock : []),
      ...(blocksCreationParams?.workflow?.context?.pluginsOutput?.merchantScreening
        ? merchantScreeningBlock
        : []),
    ],
    [Tab.KYB]: [
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
    ],
    [Tab.STORE_INFO]: [
      ...storeInfoBlock,
      ...processingDetailsBlock,
      ...websiteBasicRequirementBlock,
    ],
    [Tab.DOCUMENTS]: [...businessDocumentBlocks],
    [Tab.INDIVIDUALS]: [
      ...individualsUserProvidedBlock,
      ...individualsRegistryProvidedBlock,
      ...amlWithContainerBlock,
      ...mainRepresentativeBlock,
      ...uboDocumentBlocks,
      ...directorDocumentBlocks,
      ...kycBlocks,
    ],
    [Tab.ASSOCIATED_COMPANIES]: [
      ...associatedCompaniesBlock,
      ...associatedCompaniesInformationBlock,
      ...createAssociatedCompanyDocumentBlocks(blocksCreationParams),
    ],
    [Tab.MONITORING_REPORTS]: [...websiteMonitoringBlocks],
    [Tab.CUSTOM_DATA]: [...customDataBlock],
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
      [Tab.KYC]: [...businessInformationBlocks, ...amlWithContainerBlock, ...kycBlocks],
    } as const;
  }

  return defaultTabsMap;
};
