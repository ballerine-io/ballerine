import { createTestId, ctw, TDynamicFormElement } from '@ballerine/ui';
import { ElementContainer } from '../../utility/ElementContainer';

export const ROW_UI_ELEMENT_TYPE = 'row';

interface IRowElementParams {
  className?: string;
}

export const RowElement: TDynamicFormElement<typeof ROW_UI_ELEMENT_TYPE, IRowElementParams> = ({
  element,
  children,
}) => {
  const { className } = element.params || {};

  return (
    <ElementContainer element={element}>
      <div
        className={ctw('flex w-full flex-row gap-2', className)}
        data-testid={createTestId(element)}
      >
        {children}
      </div>
    </ElementContainer>
  );
};
