import { createTestId, ctw, TDynamicFormElement } from '@ballerine/ui';
import { ElementContainer } from '../../utility/ElementContainer';
import { COLUMN_UI_ELEMENT_TYPE, TColumnElementParams } from '@ballerine/common';

export const ColumnElement: TDynamicFormElement<
  typeof COLUMN_UI_ELEMENT_TYPE,
  TColumnElementParams
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
