import { createTestId } from '@/components/organisms/Renderer';
import { InfoIcon } from 'lucide-react';
import { useStack } from '../../fields/FieldList/providers/StackProvider';
import { usePriorityFields } from '../../hooks/internal/usePriorityFields';
import { IFormElement } from '../../types';

interface IFieldPriorityReasonProps {
  element: IFormElement<any, any>;
}

export const FieldPriorityReason: React.FC<IFieldPriorityReasonProps> = ({ element }) => {
  const { stack } = useStack();
  const { priorityField } = usePriorityFields(element);

  if (!priorityField || !priorityField.reason) {
    return null;
  }

  return (
    <div className="flex flex-row flex-nowrap items-start gap-2">
      <InfoIcon size={16} className="text-warning mt-1.5 shrink-0" />
      <p
        className="text-warning py-1 text-[0.8rem]"
        data-testid={`${createTestId(element, stack)}-priority-reason`}
      >
        {priorityField.reason}
      </p>
    </div>
  );
};
