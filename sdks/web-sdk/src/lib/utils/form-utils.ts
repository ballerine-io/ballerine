import { IInputAttributes } from '../atoms/Input';
import { IStepConfiguration } from '../contexts/configuration';
import { Elements, IFormProps } from '../contexts/configuration/types';

const getValuesFromStore = (formProps: IFormProps): Record<string, string> | undefined => {
  const storeKey = formProps.storeKey as string;
  if (formProps.persistence === 'session') {
    const storeData = sessionStorage.getItem(storeKey);
    return storeData ? JSON.parse(storeData) : undefined;
  }
  const storeData = localStorage.getItem(storeKey);
  return storeData ? JSON.parse(storeData) : undefined;
};

export const setValuesFromStore = (formProps: IFormProps, values: Record<string, string>): void => {
  const storeKey = formProps.storeKey as string;
  if (formProps.persistence === 'session') {
    sessionStorage.setItem(storeKey, JSON.stringify(values));
  }
  localStorage.setItem(storeKey, JSON.stringify(values));
};

export const getDefaultValues = (
  step: IStepConfiguration,
  formProps: IFormProps,
): Record<string, string> => {
  let values: Record<string, string> = {};
  if (formProps.action === 'store') {
    const existingValues = getValuesFromStore(formProps);
    values = existingValues || {};
  }
  step.elements.filter(element => {
    if (element.type === Elements.Input) {
      const attributes = element.props.attributes as IInputAttributes;
      const value = values[attributes.name] || attributes.defaultValue || '';
      values = {
        ...values,
        [attributes.name]: value,
      };
    }
  });
  return values;
};
