import { createTestId, ctw, TDynamicFormElement } from '@ballerine/ui';
import { ElementContainer } from '../../utility/ElementContainer';

export const COLUMN_UI_ELEMENT_TYPE = 'column';

interface IColumnElementParams {
  className?: string;
}

export const ColumnElement: TDynamicFormElement<
  typeof COLUMN_UI_ELEMENT_TYPE,
  IColumnElementParams
> = ({ element, children }) => {
  const { className } = element.params || {};

  return (
    <ElementContainer element={element}>
      <div
        className={ctw('flex w-full flex-col gap-2', className)}
        data-testid={createTestId(element)}
      >
        {children}
      </div>
    </ElementContainer>
  );
};
