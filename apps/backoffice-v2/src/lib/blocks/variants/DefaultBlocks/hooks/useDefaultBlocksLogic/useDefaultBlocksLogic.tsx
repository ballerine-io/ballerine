import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { useSearchParamsByEntity } from '@/common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { ctw } from '@/common/utils/ctw/ctw';
import { omitPropsFromObjectWhitelist } from '@/common/utils/omit-props-from-object-whitelist/omit-props-from-object-whitelist';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useApproveDocumentByIdMutation } from '@/domains/documents/hooks/mutations/useApproveDocumentByIdMutation/useApproveDocumentByIdMutation';
import { useRemoveDocumentDecisionByIdMutation } from '@/domains/documents/hooks/mutations/useRemoveDocumentDecisionByIdMutation/useRemoveDocumentDecisionByIdMutation';
import { useReviseDocumentByIdMutation } from '@/domains/documents/hooks/mutations/useReviseDocumentByIdMutation/useReviseDocumentByIdMutation';
import { useApproveTaskByIdMutation } from '@/domains/entities/hooks/mutations/useApproveTaskByIdMutation/useApproveTaskByIdMutation';
import { useRemoveTaskDecisionByIdMutation } from '@/domains/entities/hooks/mutations/useRemoveTaskDecisionByIdMutation/useRemoveTaskDecisionByIdMutation';
import { useRevisionTaskByIdMutation } from '@/domains/entities/hooks/mutations/useRevisionTaskByIdMutation/useRevisionTaskByIdMutation';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useEventMutation } from '@/domains/workflows/hooks/mutations/useEventMutation/useEventMutation';
import { useAmlBlock } from '@/lib/blocks/components/AmlBlock/hooks/useAmlBlock/useAmlBlock';
import { directorAdapter } from '@/lib/blocks/components/DirectorBlock/hooks/useDirectorBlock/helpers';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useAISummaryBlock } from '@/lib/blocks/hooks/useAISummaryBlock/useAISummaryBlock';
import { useAddressBlock } from '@/lib/blocks/hooks/useAddressBlock/useAddressBlock';
import { useAssociatedCompaniesInformationBlock } from '@/lib/blocks/hooks/useAssociatedCompaniesInformationBlock/useAssociatedCompaniesInformationBlock';
import { associatedCompanyAdapter } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/associated-company-adapter';
import { associatedCompanyToWorkflowAdapter } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/associated-company-to-workflow-adapter';
import {
  motionButtonProps,
  useAssociatedCompaniesBlock,
} from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { useBankAccountVerificationBlock } from '@/lib/blocks/hooks/useBankAccountVerificationBlock/useBankAccountVerificationBlock';
import { useBankingDetailsBlock } from '@/lib/blocks/hooks/useBankingDetailsBlock/useBankingDetailsBlock';
import { useEntityInfoBlock } from '@/lib/blocks/hooks/useEntityInfoBlock/useEntityInfoBlock';
import { useCaseOverviewBlock } from '@/lib/blocks/hooks/useCaseOverviewBlock/useCaseOverviewBlock';
import { useCommercialCreditCheckBlock } from '@/lib/blocks/hooks/useCommercialCreditCheckBlock/useCommercialCreditCheckBlock';
import { useCompanySanctionsBlock } from '@/lib/blocks/hooks/useCompanySanctionsBlock/useCompanySanctionsBlock';
import { useDocuments } from '@/lib/blocks/hooks/useDocumentBlocks/hooks/useDocuments';
import { useDocumentBlocks } from '@/lib/blocks/hooks/useDocumentBlocks/useDocumentBlocks';
import { useDocumentReviewBlocks } from '@/lib/blocks/hooks/useDocumentReviewBlocks/useDocumentReviewBlocks';
import { useKYCBusinessInformationBlock } from '@/lib/blocks/hooks/useKYCBusinessInformationBlock/useKYCBusinessInformationBlock';
import { useKybRegistryInfoBlock } from '@/lib/blocks/hooks/useKybRegistryInfoBlock/useKybRegistryInfoBlock';
import { useMainContactBlock } from '@/lib/blocks/hooks/useMainContactBlock/useMainContactBlock';
import { useMainRepresentativeBlock } from '@/lib/blocks/hooks/useMainRepresentativeBlock/useMainRepresentativeBlock';
import { useManageUbosBlock } from '@/lib/blocks/hooks/useManageUbosBlock/useManageUbosBlock';
import { useMapBlock } from '@/lib/blocks/hooks/useMapBlock/useMapBlock';
import { useMerchantScreeningBlock } from '@/lib/blocks/hooks/useMerchantScreeningBlock/useMerchantScreeningBlock';
import { useObjectEntriesBlock } from '@/lib/blocks/hooks/useObjectEntriesBlock/useObjectEntriesBlock';
import { useProcessingDetailsBlock } from '@/lib/blocks/hooks/useProcessingDetailsBlock/useProcessingDetailsBlock';
import { useRegistryInfoBlock } from '@/lib/blocks/hooks/useRegistryInfoBlock/useRegistryInfoBlock';
import { useStoreInfoBlock } from '@/lib/blocks/hooks/useStoreInfoBlock/useStoreInfoBlock';
import { useUbosRegistryProvidedBlock } from '@/lib/blocks/hooks/useUbosRegistryProvidedBlock/useUbosRegistryProvidedBlock';
import { useIndividualsUserProvidedBlock } from '@/lib/blocks/hooks/useIndividualsUserProvidedBlock/useIndividualsUserProvidedBlock';
import { useWebsiteBasicRequirementBlock } from '@/lib/blocks/hooks/useWebsiteBasicRequirementBlock/useWebsiteBasicRequirementBlock';
import { useWebsiteMonitoringBlock } from '@/lib/blocks/hooks/useWebsiteMonitoringBlock/useWebsiteMonitoringBlock';
import { useCaseBlocks } from '@/lib/blocks/variants/DefaultBlocks/hooks/useCaseBlocksLogic/useCaseBlocks';
import { useWebsiteMonitoringReportBlock } from '@/lib/blocks/variants/WebsiteMonitoringBlocks/hooks/useWebsiteMonitoringReportBlock/useWebsiteMonitoringReportBlock';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { getAddressDeep } from '@/pages/Entity/hooks/useEntityLogic/utils/get-address-deep/get-address-deep';
import { Button } from '@ballerine/ui';
import { Send } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { TAllBlocks } from './constants';
import { titleCase } from 'string-ts';
import { StateTag, valueOrNA } from '@ballerine/common';
import { useEntityAdditionalInfoBlock } from '@/lib/blocks/hooks/useEntityAdditionalInfoBlock/useEntityAdditionalInfoBlock';
import { useEditCollectionFlow } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useEditCollectionFlow/useEditCollectionFlow';
import { useEndUserByIdQuery } from '@/domains/individuals/queries/useEndUserByIdQuery/useEndUserByIdQuery';

const registryInfoWhitelist = ['open_corporates'] as const;

export const useDefaultBlocksLogic = () => {
  const [{ activeTab }] = useSearchParamsByEntity();
  const { search } = useLocation();
  const { data: workflow, isLoading } = useCurrentCaseQuery();
  const { data: customer } = useCustomerQuery();
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const { noAction } = useCaseDecision();
  const isWorkflowLevelResolution =
    workflow?.workflowDefinition?.config?.workflowLevelResolution ??
    workflow?.context?.entity?.type === 'business';
  const { mutate: mutateRevisionTaskById, isLoading: isLoadingReuploadNeeded } =
    useRevisionTaskByIdMutation();
  const { mutate: mutateReviseDocumentById, isLoading: isLoadingReviseDocumentById } =
    useReviseDocumentByIdMutation();
  const onReuploadNeeded = useCallback(
    ({
        workflowId,
        documentId,
        reason,
        comment,
      }: Pick<
        Parameters<typeof mutateRevisionTaskById>[0],
        'workflowId' | 'documentId' | 'reason'
      > & { comment?: string }) =>
      () => {
        if (!documentId) {
          toast.error('Invalid task id');

          return;
        }

        if (workflow?.workflowDefinition?.config?.isDocumentsV2) {
          mutateReviseDocumentById({
            documentId,
            decisionReason: reason,
            comment,
          });

          return;
        }

        mutateRevisionTaskById({
          workflowId,
          documentId,
          reason,
          contextUpdateMethod: 'base',
        });
      },
    [
      workflow?.workflowDefinition?.config?.isDocumentsV2,
      mutateReviseDocumentById,
      mutateRevisionTaskById,
    ],
  );

  const {
    store,
    bank: bankDetails,
    ubos: _ubosUserProvided,
    directors: directorsUserProvided = [],
    mainRepresentative,
    mainContact,
    openCorporate: _openCorporate,
    associatedCompanies: _associatedCompanies,
  } = workflow?.context?.entity?.data?.additionalInfo ?? {};
  const { website: websiteBasicRequirement, processingDetails, ...storeInfo } = store ?? {};

  const kybChildWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'business',
  );

  const registryInfo = useMemo(
    () =>
      omitPropsFromObjectWhitelist({
        object: workflow?.context?.pluginsOutput,
        whitelist: registryInfoWhitelist,
      }) ?? {},
    [workflow?.context?.pluginsOutput],
  );

  const companySanctions = workflow?.context?.pluginsOutput?.companySanctions?.data?.map(
    sanction => ({
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
    }),
  );

  const { documents } = useDocuments(workflow as TWorkflowById);
  const registryInfoBlock = useRegistryInfoBlock({
    registryInfo,
    workflowId: workflow?.id || '',
    documents,
  });

  const kybRegistryInfoBlock = useKybRegistryInfoBlock({
    pluginsOutput: workflow?.context?.pluginsOutput,
    workflow,
  });

  const bankAccountVerificationBlock = useBankAccountVerificationBlock({
    workflowId: workflow?.id || '',
    pluginsOutput: workflow?.context?.pluginsOutput,
    isDocumentsV2: !!workflow?.workflowDefinition?.config?.isDocumentsV2,
  });

  const commercialCreditCheckBlock = useCommercialCreditCheckBlock({
    workflowId: workflow?.id || '',
    pluginsOutput: workflow?.context?.pluginsOutput,
    isDocumentsV2: !!workflow?.workflowDefinition?.config?.isDocumentsV2,
  });

  const { businessDocumentBlocks, uboDocumentBlocks, directorDocumentBlocks } = useDocumentBlocks({
    workflow,
    parentMachine: workflow?.context?.parentMachine,
    noAction,
    caseState,
    withEntityNameInHeader: false,
    onReuploadNeeded,
    isLoadingReuploadNeeded: isLoadingReuploadNeeded || isLoadingReviseDocumentById,
    dialog: {
      reupload: {
        Description: () => (
          <p className="text-sm">
            {isWorkflowLevelResolution && (
              <>
                Once marked, you can use the “Ask for all re-uploads” button at the top of the
                screen to initiate a request for the customer to re-upload all of the documents you
                have marked for re-upload.
              </>
            )}
            {!isWorkflowLevelResolution && (
              <>
                <span className="mb-[10px] block">
                  By clicking the button below, an email with a link will be sent to the customer,
                  directing them to re-upload the documents you have marked as “re-upload needed”.
                </span>
                <span>
                  The case’s status will then change to “Revisions” until the customer will provide
                  the needed documents and fixes.
                </span>
              </>
            )}
          </p>
        ),
      },
    },
  });

  const { onEditCollectionFlow } = useEditCollectionFlow();

  const entityInfoBlock = useEntityInfoBlock({
    entity: workflow?.context?.entity,
    workflow,
    isEditDisabled: [
      !caseState.actionButtonsEnabled,
      !workflow?.tags?.includes(StateTag.MANUAL_REVIEW),
      !workflow?.workflowDefinition?.config?.editableContext?.entityInfo,
    ].some(Boolean),
    onEdit: onEditCollectionFlow({ steps: ['company_details'] }),
  });

  const entityAdditionalInfoBlock = useEntityAdditionalInfoBlock({
    entity: workflow?.context?.entity,
    workflow,
    predefinedOrder:
      workflow?.workflowDefinition?.config?.uiOptions?.backoffice?.blocks?.businessInformation
        ?.predefinedOrder ?? [],
  });

  const mapBlock = useMapBlock({
    address: getAddressDeep(registryInfo, {
      propertyName: 'registeredAddressInFull',
    }),
    title: `${valueOrNA(titleCase(workflow?.context?.entity?.type ?? ''))} Address`,
    workflow,
  });

  const headquartersAddressBlock = useAddressBlock({
    address: workflow?.context?.entity?.data?.additionalInfo?.headquarters,
    title: `${valueOrNA(titleCase(workflow?.context?.entity?.type ?? ''))} Headquarters Address`,
    workflow,
  });

  const headquartersAddressWithContainerBlock = useMemo(() => {
    if (!headquartersAddressBlock?.length) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: headquartersAddressBlock.flat(1),
      })
      .build();
  }, [headquartersAddressBlock]);

  const entityAddressBlock = useAddressBlock({
    address: workflow?.context?.entity?.data?.address,
    title: `${valueOrNA(titleCase(workflow?.context?.entity?.type ?? ''))} Address`,
    workflow,
  });

  const entityAddressWithContainerBlock = useMemo(() => {
    if (!entityAddressBlock?.length) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: entityAddressBlock.flat(1),
      })
      .build();
  }, [entityAddressBlock]);

  const storeInfoBlock = useStoreInfoBlock({
    storeInfo,
    workflow,
  });

  const websiteBasicRequirementBlock = useWebsiteBasicRequirementBlock({
    websiteBasicRequirement,
    workflow,
  });

  const bankingDetailsBlock = useBankingDetailsBlock({
    bankDetails,
    workflow,
  });

  const processingDetailsBlock = useProcessingDetailsBlock({
    processingDetails,
    workflow,
  });

  const mainRepresentativeBlock = useMainRepresentativeBlock({
    mainRepresentative,
    workflow,
  });

  const mainContactBlock = useMainContactBlock({
    mainContact,
    workflow,
  });

  const companySanctionsBlock = useCompanySanctionsBlock(companySanctions);

  const entityDataToIndividualAdapter = ({
    additionalInfo,
    ...entityData
  }: TWorkflowById['context']['entity']['data']) => {
    const {
      firstName,
      lastName,
      role,
      percentageOfOwnership,
      ownershipPercentage,
      ...collapsibleData
    } = entityData;
    const {
      percentageOfOwnership: percentageOfOwnershipAdditionalInfo,
      ownershipPercentage: ownershipPercentageAdditionalInfo,
      ...collapsibleDataAdditionalInfo
    } = additionalInfo ?? {};

    return {
      name: [firstName, lastName].filter(Boolean).join(' '),
      role,
      percentageOfOwnership:
        percentageOfOwnership ??
        percentageOfOwnershipAdditionalInfo ??
        ownershipPercentage ??
        ownershipPercentageAdditionalInfo,
      collapsibleData: {
        ...collapsibleData,
        additionalInfo: collapsibleDataAdditionalInfo,
      },
    } satisfies Parameters<typeof useIndividualsUserProvidedBlock>[0][number];
  };

  const childWorkflows = useMemo(
    () =>
      workflow?.childWorkflows?.filter(
        childWorkflow => childWorkflow?.context?.entity?.variant === 'ubo',
      ),
    [workflow?.childWorkflows],
  );
  const deDupedDirectors = useMemo(
    () =>
      workflow?.context?.entity?.data?.additionalInfo?.directors?.filter(
        director =>
          !childWorkflows?.some(
            childWorkflow =>
              childWorkflow?.context?.entity?.data?.ballerineEntityId ===
              director.ballerineEntityId,
          ),
      ),
    [workflow?.context?.entity?.data?.additionalInfo?.directors, childWorkflows],
  );
  const individualsUserProvided = useMemo(() => {
    return [
      ...(childWorkflows?.map(childWorkflow =>
        entityDataToIndividualAdapter(childWorkflow?.context?.entity?.data),
      ) ?? []),
      ...(deDupedDirectors?.map(entityDataToIndividualAdapter) ?? []),
    ];
  }, [workflow?.childWorkflows, workflow?.context?.entity?.data?.additionalInfo?.directors]);
  const individualsUserProvidedBlock = useIndividualsUserProvidedBlock(individualsUserProvided);

  const ubosRegistryProvidedBlock = useUbosRegistryProvidedBlock({
    nodes: workflow?.context?.pluginsOutput?.ubo?.data?.nodes ?? [],
    edges: workflow?.context?.pluginsOutput?.ubo?.data?.edges ?? [],
    message:
      workflow?.context?.pluginsOutput?.ubo?.message ??
      workflow?.context?.pluginsOutput?.ubo?.data?.message,
    isRequestTimedOut: workflow?.context?.pluginsOutput?.ubo?.isRequestTimedOut,
  });

  const manageUbosBlock = useManageUbosBlock({
    create: {
      ...workflow?.workflowDefinition?.config?.ubos?.create,
      enabled: workflow?.workflowDefinition?.config?.ubos?.create?.enabled ?? false,
    },
  });

  const { mutate: mutateRemoveTaskDecisionById } = useRemoveTaskDecisionByIdMutation(workflow?.id);
  const {
    mutate: mutateRemoveDocumentDecisionById,
    isLoading: isLoadingRemoveDocumentDecisionById,
  } = useRemoveDocumentDecisionByIdMutation(workflow?.id);
  const { mutate: mutateApproveTaskById, isLoading: isLoadingApproveTaskById } =
    useApproveTaskByIdMutation(workflow?.id);
  const { mutate: mutateApproveDocumentById, isLoading: isLoadingApproveDocumentById } =
    useApproveDocumentByIdMutation(workflow?.id);

  const onReuploadNeededDirectors = useCallback(
    ({
        workflowId,
        documentId,
        reason,
        comment,
      }: Pick<
        Parameters<typeof mutateRevisionTaskById>[0],
        'workflowId' | 'documentId' | 'reason'
      > & { comment?: string }) =>
      () => {
        if (!documentId) {
          toast.error('Invalid task id');

          return;
        }

        if (workflow?.workflowDefinition?.config?.isDocumentsV2) {
          mutateReviseDocumentById({
            documentId,
            decisionReason: reason,
            comment,
          });

          return;
        }

        mutateRevisionTaskById({
          workflowId,
          documentId,
          reason,
          contextUpdateMethod: 'director',
        });
      },
    [
      workflow?.workflowDefinition?.config?.isDocumentsV2,
      mutateReviseDocumentById,
      mutateRevisionTaskById,
    ],
  );

  const onMutateApproveTaskByIdDirectors = useCallback(
    ({ directorId, documentId }: { directorId: string; documentId: string }) => {
      if (workflow?.workflowDefinition?.config?.isDocumentsV2) {
        mutateApproveDocumentById({ documentId });

        return;
      }

      mutateApproveTaskById({ directorId, documentId, contextUpdateMethod: 'director' });
    },
    [
      mutateApproveDocumentById,
      mutateApproveTaskById,
      workflow?.workflowDefinition?.config?.isDocumentsV2,
    ],
  );
  const onMutateRemoveTaskDecisionByIdDirectors = useCallback(
    ({ directorId, documentId }: { directorId: string; documentId: string }) => {
      if (workflow?.workflowDefinition?.config?.isDocumentsV2) {
        mutateRemoveDocumentDecisionById({ documentId });

        return;
      }

      mutateRemoveTaskDecisionById({ directorId, documentId, contextUpdateMethod: 'director' });
    },
    [
      mutateRemoveTaskDecisionById,
      mutateRemoveDocumentDecisionById,
      workflow?.workflowDefinition?.config?.isDocumentsV2,
    ],
  );

  const directors =
    workflow?.context?.entity?.data?.additionalInfo?.directors?.map(directorAdapter);
  const revisionReasons =
    workflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
      ({ enum: enum_ }) => !!enum_,
    )?.enum ?? [];

  const websiteMonitoringBlock = useWebsiteMonitoringBlock({
    pluginsOutput: workflow?.context?.pluginsOutput,
    workflow,
  });
  const { mutate: mutateEvent, isLoading: isLoadingEvent } = useEventMutation();
  const onClose = useCallback(
    (associatedCompany: ReturnType<typeof associatedCompanyAdapter>) => () => {
      mutateEvent({
        workflowId: associatedCompany?.workflowId,
        event: 'START_ASSOCIATED_COMPANY_KYB',
      });
    },
    [mutateEvent],
  );

  const associatedCompanies =
    !kybChildWorkflows?.length &&
    !workflow?.workflowDefinition?.config?.isAssociatedCompanyKybEnabled
      ? workflow?.context?.entity?.data?.additionalInfo?.associatedCompanies?.map(
          associatedCompanyToWorkflowAdapter,
        )
      : kybChildWorkflows;

  const associatedCompaniesBlock = useAssociatedCompaniesBlock({
    workflows: associatedCompanies,
    onClose,
    isLoadingOnClose: isLoadingEvent,
    dialog: {
      Trigger: props => (
        <MotionButton
          {...motionButtonProps}
          animate={{
            ...motionButtonProps.animate,
            opacity: !caseState.actionButtonsEnabled ? 0.5 : motionButtonProps.animate.opacity,
          }}
          variant="outline"
          className={'ms-3.5'}
          disabled={!caseState.actionButtonsEnabled}
          {...props}
        >
          Initiate KYB
        </MotionButton>
      ),
      Title: ({ associatedCompany }) => <>Initiate KYB for {associatedCompany.companyName}</>,
      Description: ({ associatedCompany }) => (
        <p className={`text-sm`}>
          By clicking the button below, an email with a link will be sent to{' '}
          {associatedCompany.companyName} &apos;s contact person, {associatedCompany.contactPerson},
          directing them to provide information about their company. The case status will then
          change to &ldquo;Collection in Progress&ldquo; until the contact person will provide the
          needed information.
        </p>
      ),
      Close: ({ associatedCompany }) => (
        <Button
          className={ctw(`gap-x-2`, {
            loading: isLoadingEvent,
          })}
          onClick={onClose(associatedCompany)}
        >
          <Send size={18} />
          Send email
        </Button>
      ),
    },
    isAssociatedCompanyKybEnabled:
      !!workflow?.workflowDefinition?.config?.isAssociatedCompanyKybEnabled,
  });

  const associatedCompaniesInformationBlock = useAssociatedCompaniesInformationBlock(
    associatedCompanies ?? [],
  );

  const websiteMonitoringBlocks = useWebsiteMonitoringReportBlock();
  const documentReviewBlocks = useDocumentReviewBlocks();
  const businessInformationBlocks = useKYCBusinessInformationBlock();

  const caseOverviewBlock = useCaseOverviewBlock();

  const customDataBlock = useObjectEntriesBlock({
    object: workflow?.context?.customData ?? {},
    heading: 'Custom Data',
  });

  const { data: mainRepresentativeEndUser } = useEndUserByIdQuery({
    id: workflow?.context?.entity?.data?.additionalInfo?.mainRepresentative?.ballerineEntityId,
  });

  const amlVendor = useMemo(
    () => mainRepresentativeEndUser?.amlHits?.find(({ vendor }) => !!vendor)?.vendor ?? '',
    [mainRepresentativeEndUser?.amlHits],
  );
  const amlData = useMemo(
    () => [
      {
        hits: mainRepresentativeEndUser?.amlHits,
      },
    ],
    [mainRepresentativeEndUser?.amlHits],
  );

  const amlBlock = useAmlBlock({
    data: amlData,
    vendor: amlVendor,
  });

  const amlWithContainerBlock = useMemo(() => {
    if (!amlBlock?.length) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: amlBlock,
      })
      .build();
  }, [amlBlock]);

  const merchantScreeningBlock = useMerchantScreeningBlock({
    terminatedMatchedMerchants:
      workflow?.context?.pluginsOutput?.merchantScreening?.processed?.terminatedMatchedMerchants ??
      [],
    inquiredMatchedMerchants:
      workflow?.context?.pluginsOutput?.merchantScreening?.processed?.inquiredMatchedMerchants ??
      [],
    merchantScreeningInput:
      workflow?.context?.pluginsInput?.merchantScreening?.requestPayload || {},
    logoUrl: workflow?.context?.pluginsOutput?.merchantScreening?.logoUrl,
    rawData: workflow?.context?.pluginsOutput?.merchantScreening?.raw,
    checkDate: workflow?.context?.pluginsOutput?.merchantScreening?.processed?.checkDate,
  });

  const aiSummaryBlock = useAISummaryBlock({
    isDemoAccount: customer?.config?.isDemoAccount ?? false,
  });

  const allBlocks = useMemo(() => {
    if (!workflow?.context?.entity) {
      return {};
    }

    return {
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
      headquartersAddressWithContainerBlock,
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
      entityAddressWithContainerBlock,
      entityAdditionalInfoBlock,
    } satisfies TAllBlocks;
  }, [
    associatedCompaniesBlock,
    associatedCompaniesInformationBlock,
    bankingDetailsBlock,
    companySanctionsBlock,
    entityInfoBlock,
    kybRegistryInfoBlock,
    mainContactBlock,
    mainRepresentativeBlock,
    mapBlock,
    headquartersAddressWithContainerBlock,
    businessDocumentBlocks,
    uboDocumentBlocks,
    directorDocumentBlocks,
    processingDetailsBlock,
    registryInfoBlock,
    storeInfoBlock,
    individualsUserProvidedBlock,
    ubosRegistryProvidedBlock,
    websiteBasicRequirementBlock,
    websiteMonitoringBlock,
    websiteMonitoringBlocks,
    documentReviewBlocks,
    businessInformationBlocks,
    caseOverviewBlock,
    customDataBlock,
    amlWithContainerBlock,
    merchantScreeningBlock,
    workflow?.context?.entity,
    manageUbosBlock,
    bankAccountVerificationBlock,
    commercialCreditCheckBlock,
    aiSummaryBlock,
    entityAddressWithContainerBlock,
    entityAdditionalInfoBlock,
  ]);

  const { blocks, tabs } = useCaseBlocks({
    workflow,
    config: workflow?.workflowDefinition?.config,
    blocks: allBlocks,
    onReuploadNeeded,
    isLoadingReuploadNeeded: isLoadingReuploadNeeded || isLoadingReviseDocumentById,
    activeTab,
  });
  const availableTabs = useMemo(() => tabs.filter(tab => !tab.hidden), [tabs]);
  const getUpdatedSearchParamsWithActiveTab = useCallback(
    ({ tab }: { tab: string }) => {
      const searchParams = new URLSearchParams(search);

      searchParams.set('activeTab', tab);

      return searchParams.toString();
    },
    [search],
  );

  return {
    blocks,
    onReuploadNeeded,
    isLoadingReuploadNeeded: isLoadingReuploadNeeded || isLoadingReviseDocumentById,
    isLoading,
    activeTab,
    getUpdatedSearchParamsWithActiveTab,
    tabs: availableTabs,
  };
};
