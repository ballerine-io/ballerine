import { createTestId, TDynamicFormElement } from '@ballerine/ui';
import { ElementContainer } from '../../utility/ElementContainer';

export const DIVIDER_UI_ELEMENT_TYPE = 'divider';

export const DividerElement: TDynamicFormElement<typeof DIVIDER_UI_ELEMENT_TYPE> = ({
  element,
}) => (
  <ElementContainer element={element}>
    <div className="my-3 h-[1px] w-full bg-[#CECECE]" data-testid={createTestId(element)} />
  </ElementContainer>
);
