import { createTestId, TDynamicFormElement } from '@ballerine/ui';
import DOMPurify from 'dompurify';
import { ElementContainer } from '../../utility/ElementContainer';

export const DESCRIPTION_UI_ELEMENT_TYPE = 'description';

export interface IDescriptionElementParams {
  descriptionRaw: string;
}

export const DescriptionElement: TDynamicFormElement<
  typeof DESCRIPTION_UI_ELEMENT_TYPE,
  IDescriptionElementParams
> = ({ element }) => {
  const { descriptionRaw } = element.params || {};

  if (!descriptionRaw) {
    console.warn(
      `${DESCRIPTION_UI_ELEMENT_TYPE} - ID:${element.id} element has no description, element will not be rendered.`,
    );

    return null;
  }

  return (
    <ElementContainer element={element}>
      <p
        className="font-inter pb-2 text-sm text-slate-500"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(descriptionRaw) as string,
        }}
        data-testid={createTestId(element)}
      />
    </ElementContainer>
  );
};
