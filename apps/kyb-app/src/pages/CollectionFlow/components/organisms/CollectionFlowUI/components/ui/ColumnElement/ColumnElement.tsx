import { createTestId, TDynamicFormElement } from '@ballerine/ui';
import { ElementContainer } from '../../utility/ElementContainer';

export const COLUMN_UI_ELEMENT_TYPE = 'column';

export const ColumnElement: TDynamicFormElement<typeof COLUMN_UI_ELEMENT_TYPE> = ({
  element,
  children,
}) => {
  return (
    <ElementContainer element={element}>
      <div className="flex flex-col gap-2" data-testid={createTestId(element)}>
        {children}
      </div>
    </ElementContainer>
  );
};
