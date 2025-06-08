import { createTestId, TDynamicFormElement } from '@ballerine/ui';
import { ElementContainer } from '../../utility/ElementContainer';
import { DIVIDER_UI_ELEMENT_TYPE } from '@ballerine/common';

export const DividerElement: TDynamicFormElement<typeof DIVIDER_UI_ELEMENT_TYPE> = ({
  element,
}) => (
  <ElementContainer element={element}>
    <div className="my-3 h-[1px] w-full bg-[#CECECE]" data-testid={createTestId(element)} />
  </ElementContainer>
);
