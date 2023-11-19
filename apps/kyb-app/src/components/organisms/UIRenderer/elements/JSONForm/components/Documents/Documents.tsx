import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { createFormSchemaFromUIElements } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/createFormSchemaFromUIElements';
import { createInitialFormData } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/createInitialFormData';
import { UIElementComponent } from '@/components/organisms/UIRenderer/types';

import { JSONFormElementParams } from '@/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { jsonFormFields } from '@/components/organisms/UIRenderer/elements/JSONForm/json-form.fields';
import { AnyObject, DynamicForm } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import set from 'lodash/set';
import { useCallback, useMemo } from 'react';

export interface JSONFormElementBaseParams {
  jsonFormDefinition: RJSFSchema;
  uiSchema?: UiSchema;
  label?: string;
  hint?: string;
  description?: string;
  documentData?: AnyObject;
}

export const Documents: UIElementComponent<JSONFormElementParams> = ({ definition, actions }) => {
  const { formSchema, uiSchema } = useMemo(
    () => createFormSchemaFromUIElements(definition),
    [definition],
  );
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
        // @ts-ignore
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
