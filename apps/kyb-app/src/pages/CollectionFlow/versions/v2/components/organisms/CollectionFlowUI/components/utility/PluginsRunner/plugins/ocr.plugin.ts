import { StateMachineAPI } from '@/components/organisms/DynamicUI/StateManager/hooks/useMachineLogic';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';

export const OCR_PLUGIN_NAME = 'ocr';

export const ocrPlugin = async (
  context: CollectionFlowContext,
  { api }: { api: StateMachineAPI },
) => {
  await api.invokePlugin('fetch_company_information');

  return api.getContext();
};
