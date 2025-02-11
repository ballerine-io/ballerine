import { createTestId, TDynamicFormElement } from '@ballerine/ui';
import { ElementContainer } from '../../utility/ElementContainer';

export const H1_UI_ELEMENT_TYPE = 'h1';

export interface IH1ElementParams {
  text: string;
}

export const H1Element: TDynamicFormElement<typeof H1_UI_ELEMENT_TYPE, IH1ElementParams> = ({
  element,
}) => {
  const { text = '' } = element.params || {};

  if (!text) {
    console.warn(
      `${H1_UI_ELEMENT_TYPE} - ID:${element.id} element has no text, element will not be rendered.`,
    );

    return null;
  }

  return (
    <ElementContainer element={element}>
      <h1 className="pb-6 pt-4 text-3xl font-bold" data-testid={createTestId(element)}>
        {text}
      </h1>
    </ElementContainer>
  );
};
