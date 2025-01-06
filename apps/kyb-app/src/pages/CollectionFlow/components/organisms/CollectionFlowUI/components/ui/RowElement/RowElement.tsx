import { createTestId, TDynamicFormElement } from '@ballerine/ui';
import { ElementContainer } from '../../utility/ElementContainer';

export const ROW_UI_ELEMENT_TYPE = 'row';

export const RowElement: TDynamicFormElement<typeof ROW_UI_ELEMENT_TYPE> = ({
  element,
  children,
}) => {
  return (
    <ElementContainer element={element}>
      <div className="flex flex-row gap-2" data-testid={createTestId(element)}>
        {children}
      </div>
    </ElementContainer>
  );
};
