import { createFormSchemaFromUIElements } from '@app/components/organisms/UIRenderer/elements/JSONForm/helpers/createFormSchemaFromUIElements';
import { withDynamicUIInterceptor } from '@app/components/organisms/UIRenderer/elements/JSONForm/hocs/withDynamicUIInterceptor/withDynamicUIInterceptor';
import { UIElementComponent } from '@app/components/organisms/UIRenderer/types';
import {
  TextInputAdapter,
  BooleanFieldAdapter,
  FileInputAdapter,
  DateInputAdater,
  PhoneInputAdapter,
  AutocompleteTextInputAdapter,
} from '@ballerine/ui';
import { DynamicForm } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useCallback, useMemo, useState } from 'react';

export const fields = {
  // Component with suffix Field is an overriding of internal RSJV components
  StringField: withDynamicUIInterceptor(TextInputAdapter),
  BooleanField: withDynamicUIInterceptor(BooleanFieldAdapter),

  // Component with suffix Input is an extend of supported field types
  FileInput: withDynamicUIInterceptor(FileInputAdapter),
  DateInput: withDynamicUIInterceptor(DateInputAdater),
  PhoneInput: withDynamicUIInterceptor(PhoneInputAdapter),
  AutocompleteInput: withDynamicUIInterceptor(AutocompleteTextInputAdapter),
};

export interface JSONFormElementBaseParams {
  jsonFormDefinition: RJSFSchema;
  uiSchema?: UiSchema;
  label?: string;
  hint?: string;
}

export interface JSONFormElementParams {
  jsonFormDefinition?: { required?: string[] };
}

export const JSONForm: UIElementComponent<JSONFormElementParams> = ({ definition, actions }) => {
  console.log('definition', definition);
  const { formSchema, uiSchema } = useMemo(
    () => createFormSchemaFromUIElements(definition),
    [definition],
  );

  const handleSubmit = useCallback(() => {}, []);

  console.log('json form render', formSchema);

  return (
    <DynamicForm schema={formSchema} uiSchema={uiSchema} fields={fields} onSubmit={handleSubmit} />
  );
};
