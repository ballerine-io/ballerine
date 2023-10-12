import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { createFormSchemaFromUIElements } from '@app/components/organisms/UIRenderer/elements/JSONForm/helpers/createFormSchemaFromUIElements';
import { createInitialFormData } from '@app/components/organisms/UIRenderer/elements/JSONForm/helpers/createInitialFormData';
import { UIElementComponent } from '@app/components/organisms/UIRenderer/types';

import { AnyObject, DynamicForm } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useCallback, useMemo, useRef } from 'react';
import set from 'lodash/set';
import get from 'lodash/get';
import { jsonFormFields } from '@app/components/organisms/UIRenderer/elements/JSONForm/json-form.fields';
import { transformRJSFErrors } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/transform-errors';
import { useUIElementProps } from '@app/components/organisms/UIRenderer/hooks/useUIElementProps';
import { DataCreationParams } from '@app/components/organisms/UIRenderer/elements/JSONForm/hocs/withInitialDataCreation';

export interface JSONFormElementBaseParams extends DataCreationParams {
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

export const JSONForm: UIElementComponent<JSONFormElementParams> = ({ definition, actions }) => {
  const { hidden } = useUIElementProps(definition);
  const { formSchema, uiSchema } = useMemo(
    () => createFormSchemaFromUIElements(definition),
    [definition],
  );
  const { stateApi } = useStateManagerContext();

  const { payload } = useStateManagerContext();
  const formData = useMemo(() => createInitialFormData(definition, payload), [definition, payload]);

  const formRef = useRef<any>(null);

  const handleArrayInputChange = useCallback(
    (values: AnyObject[]) => {
      if (definition.options?.jsonFormDefinition?.type === 'array') {
        const prevContext = stateApi.getContext();
        const currentValue = get(prevContext, definition.valueDestination);

        if (Array.isArray(currentValue) && currentValue.length !== values.length) {
          set(prevContext, definition.valueDestination, values);

          stateApi.setContext(prevContext);
        }
      }
    },
    [definition, stateApi],
  );

  const handleSubmit = useCallback(() => {}, []);

  return hidden ? null : (
    <DynamicForm
      schema={formSchema}
      uiSchema={uiSchema}
      fields={jsonFormFields}
      formData={formData}
      ref={formRef}
      transformErrors={transformRJSFErrors}
      onChange={handleArrayInputChange}
      onSubmit={handleSubmit}
    />
  );
};

//@ts-nocheck
// JSONForm.Documents = Documents;
