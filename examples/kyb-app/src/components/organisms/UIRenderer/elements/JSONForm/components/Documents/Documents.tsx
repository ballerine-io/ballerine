import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { createFormSchemaFromUIElements } from '@app/components/organisms/UIRenderer/elements/JSONForm/helpers/createFormSchemaFromUIElements';
import { createInitialFormData } from '@app/components/organisms/UIRenderer/elements/JSONForm/helpers/createInitialFormData';
import { UIElementComponent } from '@app/components/organisms/UIRenderer/types';

import { AnyObject, DynamicForm } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useCallback, useMemo, useState } from 'react';
import set from 'lodash/set';
import { jsonFormFields } from '@app/components/organisms/UIRenderer/elements/JSONForm/json-form.fields';

export interface JSONFormElementBaseParams {
  jsonFormDefinition: RJSFSchema;
  uiSchema?: UiSchema;
  label?: string;
  hint?: string;
  description?: string;
  documentData?: AnyObject;
}

export interface JSONFormElementParams {
  jsonFormDefinition?: { type?: string; required?: string[] };
}

export const Documents: UIElementComponent<JSONFormElementParams> = ({ definition, actions }) => {
  const { formSchema, uiSchema } = useMemo(
    () => createFormSchemaFromUIElements(definition),
    [definition],
  );
  const [isUploading, setUploading] = useState(false);
  const { stateApi } = useStateManagerContext();

  const { payload } = useStateManagerContext();
  const initialFormData = useMemo(
    () => createInitialFormData(definition, payload),
    [definition, payload],
  );

  const handleArrayInputChange = useCallback(
    async (values: AnyObject) => {
      if (definition.options?.jsonFormDefinition?.type === 'array') {
        const prevContext = stateApi.getContext();
        set(prevContext, definition.valueDestination, values);

        stateApi.setContext(prevContext);
      }
    },
    [definition, stateApi],
  );

  const handleSubmit = useCallback(() => {}, []);

  return (
    <DynamicForm
      schema={formSchema}
      uiSchema={uiSchema}
      liveValidate
      fields={jsonFormFields}
      formData={initialFormData}
      onChange={handleArrayInputChange}
      onSubmit={handleSubmit}
      disabled
    />
  );
};
