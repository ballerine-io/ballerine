import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { DefaultContextSchema } from '@ballerine/common';

export const checkCanMakeDecision = ({
  caseState,
  noAction,
  decision,
}: {
  caseState: ReturnType<typeof useCaseState>;
  noAction: boolean;
  decision: DefaultContextSchema['documents'][number]['decision'];
}) => {
  return caseState.actionButtonsEnabled && !noAction && !decision?.status;
};
