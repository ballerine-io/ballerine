import { createTestId } from '@/components/organisms/Renderer';
import { useStack } from '../../fields/FieldList/providers/StackProvider';
import { usePriorityFields } from '../../hooks/internal/usePriorityFields';
import { IFormElement } from '../../types';

interface IFieldPriorityReasonProps {
  element: IFormElement<any, any>;
}

export const FieldPriorityReason: React.FC<IFieldPriorityReasonProps> = ({ element }) => {
  const { stack } = useStack();
  const { priorityField } = usePriorityFields(element);

  if (!priorityField) return null;

  return (
    <p
      className="py-1 text-[0.8rem] text-amber-400"
      data-testid={`${createTestId(element, stack)}-priority-reason`}
    >
      {priorityField.reason}
    </p>
  );
};
