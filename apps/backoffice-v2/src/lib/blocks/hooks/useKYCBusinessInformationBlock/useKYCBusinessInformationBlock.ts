import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useEditCollectionFlow } from '@/pages/Entity/components/Case/components/CaseOptions/hooks/useEditCollectionFlow/useEditCollectionFlow';
import { useEntityInfoBlock } from '@/lib/blocks/hooks/useEntityInfoBlock/useEntityInfoBlock';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { StateTag } from '@ballerine/common';

export const useKYCBusinessInformationBlock = () => {
  const { data: workflow } = useCurrentCaseQuery();
  const {
    store,
    bank,
    ubos,
    directors,
    mainRepresentative,
    mainContact,
    openCorporate,
    associatedCompanies: _associatedCompanies,
    ...entityDataAdditionalInfo
  } = workflow?.context?.entity?.data?.additionalInfo ?? {};

  const { onEditCollectionFlow } = useEditCollectionFlow();
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user ?? null, workflow);

  const blocks = useEntityInfoBlock({
    entity: workflow?.context?.entity,
    workflow,
    isEditDisabled: [
      !caseState.actionButtonsEnabled,
      !workflow?.tags?.includes(StateTag.MANUAL_REVIEW),
      !workflow?.workflowDefinition?.config?.editableContext?.entityInfo,
    ].some(Boolean),
    onEdit: onEditCollectionFlow({ steps: ['company_details'] }),
  });

  return blocks;
};
