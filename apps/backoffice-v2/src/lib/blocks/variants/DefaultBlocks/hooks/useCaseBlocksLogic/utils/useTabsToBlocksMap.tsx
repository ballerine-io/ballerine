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
import { useEndUsersByIdsQuery } from '@/domains/individuals/queries/useEndUsersByIdsQuery/useEndUsersByIdsQuery';

export type TCaseBlocksCreationProps = {
  workflow: TWorkflowById;
  onReuploadNeeded: (params: {
    workflowId: string;
    documentId: string;
    reason?: string;
  }) => () => void;
  isLoadingReuploadNeeded: boolean;
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
    ubosRegistryProvidedBlock,
    storeInfoBlock,
    websiteBasicRequirementBlock,
    bankingDetailsBlock,
    processingDetailsBlock,
    mainContactBlock,
    mainRepresentativeBlock,
    mapBlock,
    addressWithContainerBlock,
    parentDocumentBlocks,
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

  const getInitiateKycEvent = (nextEvents: string[]) => {
    if (nextEvents?.includes('start')) {
      return 'start';
    }
  };
  const getInitiateSanctionsScreeningEvent = (nextEvents: string[]) => {
    if (nextEvents?.includes('temp')) {
      return 'temp';
    }
  };

  const { data: session } = useAuthenticatedUserQuery();
  const { data: workflow } = useCurrentCaseQuery();
  const caseState = useCaseState(session?.user ?? null, workflow);

  const getStatus = (tags: string[]) => {
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
  };
  const childWorkflowToIndividualAdapter = (
    childWorkflow: NonNullable<TWorkflowById['childWorkflows']>[number],
  ) => {
    const status = getStatus(childWorkflow?.tags ?? []);
    const initiateKycEvent = getInitiateKycEvent(childWorkflow?.nextEvents ?? []);
    const initiateSanctionsScreeningEvent = getInitiateSanctionsScreeningEvent(
      childWorkflow?.nextEvents ?? [],
    );

    return {
      status,
      documents: childWorkflow?.context?.documents,
      kycSession: omitPropsFromObject(
        childWorkflow?.context?.pluginsOutput?.kyc_session ?? {},
        'invokedAt',
      ),
      entityData: childWorkflow?.context?.entity?.data,
      isActionsDisabled:
        !caseState.actionButtonsEnabled || !childWorkflow?.tags?.includes(StateTag.MANUAL_REVIEW),
      isLoadingReuploadNeeded: isLoadingRevisionCase,
      isLoadingApprove: isLoadingApproveCase,
      onInitiateKyc: () => {
        if (!initiateKycEvent) {
          return;
        }

        mutateEvent({
          workflowId: childWorkflow?.id,
          event: initiateKycEvent,
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
      reasons:
        childWorkflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
          ({ enum: enum_ }) => !!enum_,
        )?.enum as string[],
      isReuploadNeededDisabled: isLoadingRevisionCase,
      isApproveDisabled: isLoadingApproveCase,
      isInitiateKycDisabled: !initiateKycEvent,
      isInitiateSanctionsScreeningDisabled: !initiateSanctionsScreeningEvent,
    } satisfies Parameters<typeof createKycBlocks>[0][number];
  };
  const directorToIndividualAdapter = ({
    kycSession,
    ...director
  }: NonNullable<
    TWorkflowById['context']['entity']['data']['additionalInfo']['directors']
  >[number]) => {
    return {
      status: undefined,
      documents: director?.documents,
      kycSession,
      entityData: director,
      isActionsDisabled: true,
      isLoadingReuploadNeeded: false,
      isLoadingApprove: false,
      onInitiateKyc: () => {},
      onInitiateSanctionsScreening: () => {},
      onApprove:
        ({ ids }: { ids: string[] }) =>
        () => {},
      onReuploadNeeded:
        ({ reason, ids }: { reason: string; ids: string[] }) =>
        () => {},
      reasons: [],
      isReuploadNeededDisabled: true,
      isApproveDisabled: true,
      isInitiateKycDisabled: true,
      isInitiateSanctionsScreeningDisabled: true,
    } satisfies Parameters<typeof createKycBlocks>[0][number];
  };
  const childWorkflows =
    workflow?.childWorkflows
      ?.filter(childWorkflow => childWorkflow?.context?.entity?.type === 'individual')
      ?.map(childWorkflowToIndividualAdapter) ?? [];
  const directorsIds = workflow?.context?.entity?.data?.additionalInfo?.directors?.map(
    director => director.ballerineEntityId,
  );

  const { data: endUsers } = useEndUsersByIdsQuery({ ids: directorsIds });

  const directors =
    workflow?.context?.entity?.data?.additionalInfo?.directors
      ?.filter(
        director =>
          !workflow?.childWorkflows?.some(
            childWorkflow =>
              childWorkflow.context?.entity?.data?.ballerineEntityId === director.ballerineEntityId,
          ),
      )
      ?.map(director => {
        const endUser = endUsers?.find(endUser => endUser.id === director.ballerineEntityId);

        return directorToIndividualAdapter({
          ...director,
          kycSession: {
            kyc_session_1: {
              result: {
                aml: {
                  hits: endUser?.amlHits,
                },
              },
            },
          },
        });
      }) ?? [];
  const individuals = [...childWorkflows, ...directors];

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
      ...mainRepresentativeBlock,
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
    [Tab.DOCUMENTS]: [...parentDocumentBlocks],
    [Tab.INDIVIDUALS]: [
      ...individualsUserProvidedBlock,
      ...amlWithContainerBlock,
      ...manageUbosBlock,
      ...createKycBlocks(individuals),
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
      [Tab.KYC]: [
        ...businessInformationBlocks,
        ...amlWithContainerBlock,
        ...createKycBlocks(individuals),
      ],
    } as const;
  }

  return defaultTabsMap;
};
