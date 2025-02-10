import { MCC } from '@/components/organisms/UIRenderer/elements/JSONForm/components/MCCPicker/options';
import { IFormElement, ISelectFieldParams, SelectField, TDynamicFormField } from '@ballerine/ui';
import { useMemo } from 'react';

export const MCC_PICKER_FIELD_TYPE = 'mccpickerfield';

export const MCCPickerField: TDynamicFormField<ISelectFieldParams> = ({ element }) => {
  const elementWithMccOptions: IFormElement<typeof MCC_PICKER_FIELD_TYPE, ISelectFieldParams> =
    useMemo(() => {
      return {
        ...element,
        element: MCC_PICKER_FIELD_TYPE,
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
