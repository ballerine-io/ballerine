import { detectFieldType } from './helpers/detectFieldType';
import { SelectField } from './components/SelectField';
import { TextField } from './components/TextField';
import { TextInputFieldType } from './types';
import { FieldProps } from '@rjsf/utils';
import { useMemo } from 'react';
import { RJSFInputAdapter } from '@/components/organisms/DynamicForm/components/RSJVInputAdaters/types';

export const TextInputAdapter: RJSFInputAdapter<string, unknown> = props => {
  const InputComponent = useMemo(() => {
    const fieldsMap: Record<TextInputFieldType, React.ComponentType<FieldProps<string>>> = {
      select: SelectField,
      text: TextField,
    };

    const fieldType = detectFieldType(props);

    return fieldsMap[fieldType];
  }, [props]);

  return <InputComponent {...props} />;
};
