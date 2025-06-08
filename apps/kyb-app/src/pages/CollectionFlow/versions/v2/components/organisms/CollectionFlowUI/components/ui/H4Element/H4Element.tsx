import { createTestId, TDynamicFormElement } from '@ballerine/ui';
import { ElementContainer } from '../../utility/ElementContainer';
import { TH4ElementParams } from '@ballerine/common';

export const H4_UI_ELEMENT_TYPE = 'h4';

export const H4Element: TDynamicFormElement<typeof H4_UI_ELEMENT_TYPE, TH4ElementParams> = ({
  element,
}) => {
  const { text } = element.params || {};

  if (!text) {
    console.warn(
      `${H4_UI_ELEMENT_TYPE} - ID:${element.id} element has no text, element will not be rendered.`,
    );

    return null;
  }

  return (
    <ElementContainer element={element}>
      <h4 className="pb-3 text-base font-bold" data-testid={createTestId(element)}>
        {text}
      </h4>
    </ElementContainer>
  );
};
