import { useCaseInfoBlock } from '@/lib/blocks/hooks/useCaseInfoBlock/useCaseInfoBlock';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';

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

  const blocks = useCaseInfoBlock({
    entityDataAdditionalInfo,
    entity: workflow?.context?.entity,
    workflow,
  });

  return blocks;
};
