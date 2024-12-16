import { ctw } from '@/common';
import { Label } from '@/components/atoms';
import { useDynamicForm } from '../../context';
import { useStack } from '../../fields/FieldList/providers/StackProvider';
import { useElement } from '../../hooks/external';
import { useRequired } from '../../hooks/external/useRequired';
import { TDynamicFormField } from '../../types';

export interface IFieldLayoutBaseParams {
  label?: string;
}

export const FieldLayout: TDynamicFormField<any, any> = ({ element, children }) => {
  const { values } = useDynamicForm();
  const { stack } = useStack();
  const { id, hidden } = useElement(element, stack);
  const { label } = element.params || {};
  const isRequired = useRequired(element, values);

  if (hidden) return null;

  return (
    <div
      className={ctw('flex flex-col', { 'gap-2': Boolean(label) })}
      data-testid={`${id}-field-layout`}
    >
      <div>
        {label && (
          <Label id={`${id}-label`} htmlFor={`${id}-label`}>
            {`${isRequired ? `${label}` : `${label} (optional)`} `}
          </Label>
        )}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};
