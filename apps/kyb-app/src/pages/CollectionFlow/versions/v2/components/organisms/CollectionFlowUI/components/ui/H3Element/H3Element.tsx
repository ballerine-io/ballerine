import { createTestId, TDynamicFormElement } from '@ballerine/ui';
import { ElementContainer } from '../../utility/ElementContainer';
import { H3_UI_ELEMENT_TYPE, TH3ElementParams } from '@ballerine/common';

export const H3Element: TDynamicFormElement<typeof H3_UI_ELEMENT_TYPE, TH3ElementParams> = ({
  element,
}) => {
  const { text = '' } = element.params || {};

  if (!text) {
    console.warn(
      `${H3_UI_ELEMENT_TYPE} - ID:${element.id} element has no text, element will not be rendered.`,
    );

    return null;
  }

  return (
    <ElementContainer element={element}>
      <h3 className="pt-4 text-xl font-bold" data-testid={createTestId(element)}>
        {text}
      </h3>
    </ElementContainer>
  );
};
