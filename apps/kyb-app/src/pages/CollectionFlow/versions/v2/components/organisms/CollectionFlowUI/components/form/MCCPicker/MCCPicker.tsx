import { MCC } from '@/components/organisms/UIRenderer/elements/JSONForm/components/MCCPicker/options';
import { MCC_PICKER_FIELD_ELEMENT_TYPE, TMCCPickerFieldParams } from '@ballerine/common';
import { IFormElement, SelectField, TDynamicFormField } from '@ballerine/ui';
import { useMemo } from 'react';

export const MCCPickerField: TDynamicFormField<TMCCPickerFieldParams> = ({ element }) => {
  const elementWithMccOptions: IFormElement<
    typeof MCC_PICKER_FIELD_ELEMENT_TYPE,
    TMCCPickerFieldParams
  > = useMemo(() => {
    return {
      ...element,
      element: MCC_PICKER_FIELD_ELEMENT_TYPE,
      params: {
        ...element.params,
        options: MCC.map(item => ({
          value: item.const,
          label: `${item.const} - ${item.title}`,
        })),
      },
    };
  }, [element]);

  return <SelectField element={elementWithMccOptions} />;
};
