import { useCaseInfoBlock } from '@/lib/blocks/hooks/useCaseInfoBlock/useCaseInfoBlock';
import { useEntityLogic } from '@/pages/Entity/hooks/useEntityLogic/useEntityLogic';

export const useKYCBusinessInformationBlock = () => {
  const { workflow } = useEntityLogic();
  const {
    store,
    bank,
    ubos,
    directors,
    mainRepresentative,
    mainContact,
    openCorporate,
    ...entityDataAdditionalInfo
  } = workflow?.context?.entity?.data?.additionalInfo ?? {};

  const blocks = useCaseInfoBlock({
    entityDataAdditionalInfo,
    entity: workflow?.context?.entity,
    workflow,
  });

  return blocks;
};
