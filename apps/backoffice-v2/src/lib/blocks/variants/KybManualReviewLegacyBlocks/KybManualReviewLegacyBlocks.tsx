import { useParams } from 'react-router-dom';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '@/domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useEntityInfoBlock } from '@/pages/Entity/hooks/useTasks/hooks/useEntityInfoBlock/useEntityInfoBlock';
import { useDocumentBlocks } from '@/pages/Entity/hooks/useTasks/hooks/useDocumentBlocks/useDocumentBlocks';
import { BlocksComponent } from '@/lib/blocks/components/BlocksComponent/BlocksComponent';

export const KybManualReviewLegacyBlocks = () => {
  const { entityId: workflowId } = useParams();
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowQuery({
    workflowId: workflowId ?? '',
    filterId: filterId ?? '',
  });
  const { noAction } = useCaseDecision();
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user ?? null, workflow);
  const {
    store: _store,
    bank: _bank,
    directors: _directors,
    mainRepresentative: _mainRepresentative,
    mainContact: _mainContact,
    openCorporate: _openCorporate,
    ...entityDataAdditionalInfo
  } = workflow?.context?.entity?.data?.additionalInfo ?? {};

  const businessInformation = useEntityInfoBlock({
    entity: workflow?.context?.entity ?? {},
    workflow,
    entityDataAdditionalInfo,
  });
  const documentsBlocks = useDocumentBlocks({
    workflow,
    parentMachine: workflow?.context?.parentMachine,
    noAction,
    withEntityNameInHeader: false,
    caseState,
  });
  const blocks = [...businessInformation, ...documentsBlocks];

  return <BlocksComponent blocks={blocks} />;
};
