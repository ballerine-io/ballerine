import { useCaseInfoBlock } from '@/lib/blocks/hooks/useCaseInfoBlock/useCaseInfoBlock';
import { useCurrentCase } from '@/pages/Entity/hooks/useCurrentCase/useCurrentCase';

export const useKYCBusinessInformationBlock = () => {
  const { workflow } = useCurrentCase();
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
