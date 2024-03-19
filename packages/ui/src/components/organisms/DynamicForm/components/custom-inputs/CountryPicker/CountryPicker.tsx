import {
  RJSFInputAdapter,
  RJSFInputProps,
  TextInputAdapter,
} from '@/components/organisms/DynamicForm/components/RSJVInputAdaters';
import { getCountries } from '@/components/organisms/DynamicForm/components/custom-inputs/CountryPicker/helpers';
import { FieldProps } from '@rjsf/utils';
import { useMemo } from 'react';

export type CountryPickerProps = RJSFInputProps<FieldProps<string> & { language?: string }>;

export const CountryPicker: RJSFInputAdapter<string> = props => {
  const { schema, language = 'en' } = props;

  const enchancedSchema = useMemo(() => {
    const schemaCopy = structuredClone(schema);

    schemaCopy.oneOf = getCountries(language);

    return schemaCopy;
  }, [schema, language]);

  return <TextInputAdapter {...props} schema={enchancedSchema} />;
};
