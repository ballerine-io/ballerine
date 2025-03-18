import { AnyObject, ctw } from '@/common';
import { Label } from '@/components/atoms';
import { FunctionComponent } from 'react';
import { useDynamicForm } from '../../context';
import { useStack } from '../../fields/FieldList/providers/StackProvider';
import { useElement } from '../../hooks/external';
import { useRequired } from '../../hooks/external/useRequired';
import { IFormElement } from '../../types';

interface IFieldLayoutProps {
  element: IFormElement<string, any>;
  children: React.ReactNode;
  layout?: 'vertical' | 'horizontal';
  elementState?: AnyObject;
}

export const FieldLayout: FunctionComponent<IFieldLayoutProps> = ({
  element,
  children,
  layout = 'vertical',
  elementState,
}: IFieldLayoutProps) => {
  const { values } = useDynamicForm();
  const { stack } = useStack();
  const { id, hidden } = useElement(element, stack, elementState);
  const { label } = element.params || {};
  const isRequired = useRequired(element, values);

  if (hidden) {
    return null;
  }

  return (
    <div data-testid={`${id}-field-layout`} className="w-full">
      <div
        className={ctw('flex py-2', {
          'gap-2': Boolean(label),
          'flex-col': layout === 'vertical',
        })}
      >
        <div className="flex items-center">
          {label && (
            <Label id={`${id}-label`} htmlFor={`${id}`}>
              {`${isRequired ? `${label}` : `${label} (optional)`} `}
            </Label>
          )}
        </div>
        <div className={ctw('flex flex-col')}>{children}</div>
      </div>
    </div>
  );
};
