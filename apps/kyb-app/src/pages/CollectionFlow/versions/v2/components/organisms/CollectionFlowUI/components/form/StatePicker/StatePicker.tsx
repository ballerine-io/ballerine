import { getCountryStates } from '@ballerine/common';
import {
  formatValueDestination,
  IFormElement,
  ISelectFieldParams,
  SelectField,
  TDeepthLevelStack,
  TDynamicFormField,
  useDynamicForm,
  useStack,
} from '@ballerine/ui';
import get from 'lodash/get';
import { useMemo } from 'react';

export const STATE_PICKER_FIELD_TYPE = 'statepickerfield';

export interface IStatePickerParams extends ISelectFieldParams {
  countryCodePath?: string;
}

export const StatePickerField: TDynamicFormField<IStatePickerParams> = ({ element }) => {
  const { countryCodePath } = element.params || {};
  const { values } = useDynamicForm();
  const { stack } = useStack();

  const options = useMemo(() => {
    const countryCode = get(
      values,
      formatValueDestination(countryCodePath || '', stack as TDeepthLevelStack),
    ) as string | null;

    return countryCode
      ? getCountryStates(countryCode).map(state => ({ title: state.name, const: state.isoCode }))
      : [];
  }, [values, countryCodePath]);

  const elementWithStateOptions: IFormElement<typeof STATE_PICKER_FIELD_TYPE, IStatePickerParams> =
    useMemo(() => {
      return {
        ...element,
        element: STATE_PICKER_FIELD_TYPE,
        params: {
          ...element.params,
          options: options.map(option => ({ value: option.const, label: option.title })),
        },
      };
    }, [element, options]);

  return <SelectField element={elementWithStateOptions} />;
};
