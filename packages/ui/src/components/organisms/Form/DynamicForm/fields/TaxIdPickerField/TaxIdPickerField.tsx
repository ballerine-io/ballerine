import { useMemo } from 'react';
import { useDynamicForm } from '../../context';
import { IFormElement, TDynamicFormField } from '../../types';
import { useStack } from '../FieldList';
import get from 'lodash/get';
import { formatValueDestination, TDeepthLevelStack } from '../../../Validator';
import { getTaxTypeOptionsByCountryCode } from './helpers';
import { ISelectFieldParams, SelectField } from '../SelectField';

export interface ITaxIdPickerFieldParams {
  placeholder?: string;
  countryCodePath: string;
}

export const TaxIdPickerField: TDynamicFormField<ITaxIdPickerFieldParams> = ({ element }) => {
  const { countryCodePath } = element.params || {};
  const { values } = useDynamicForm();
  const { stack } = useStack();

  const countryCode = useMemo(() => {
    return get(values, formatValueDestination(countryCodePath || '', stack as TDeepthLevelStack));
  }, [values, countryCodePath, stack]);

  const options = useMemo(
    () => (countryCode ? getTaxTypeOptionsByCountryCode(countryCode) : []),
    [countryCode, countryCodePath],
  );

  const elementWithStateOptions: IFormElement<'selectfield', ISelectFieldParams> = useMemo(() => {
    return {
      ...element,
      element: 'selectfield',
      params: {
        ...element.params,
        options,
      },
    };
  }, [element, options]);

  return <SelectField element={elementWithStateOptions} />;
};
