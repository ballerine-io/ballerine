import { SelectField } from '@app/common/components/organisms/DynamicForm/components/atoms/TextInput/components/SelectField';
import { TextField } from '@app/common/components/organisms/DynamicForm/components/atoms/TextInput/components/TextField';
import { detectFieldType } from '@app/common/components/organisms/DynamicForm/components/atoms/TextInput/helpers/detectFieldType';
import { TextInputFieldType } from '@app/common/components/organisms/DynamicForm/components/atoms/TextInput/types';
import { FieldProps } from '@rjsf/utils';
import { useMemo } from 'react';

export const TextInput = (props: FieldProps<string>) => {
  const InputComponent = useMemo(() => {
    const fieldsMap: Record<TextInputFieldType, React.ComponentType<FieldProps<string>>> = {
      text: TextField,
      select: SelectField,
    };

    const fieldType = detectFieldType(props);

    return fieldsMap[fieldType];
  }, [props]);

  return <InputComponent {...props} />;
};
