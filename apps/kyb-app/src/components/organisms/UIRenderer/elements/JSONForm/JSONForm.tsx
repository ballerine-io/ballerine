import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { createFormSchemaFromUIElements } from '@app/components/organisms/UIRenderer/elements/JSONForm/helpers/createFormSchemaFromUIElements';
import { createInitialFormData } from '@app/components/organisms/UIRenderer/elements/JSONForm/helpers/createInitialFormData';
import { UIElementComponent } from '@app/components/organisms/UIRenderer/types';

import {
  jsonFormFields,
  jsonFormLayouts,
} from '@app/components/organisms/UIRenderer/elements/JSONForm/json-form.fields';
import { JSONFormDefinitionProvider } from '@app/components/organisms/UIRenderer/elements/JSONForm/providers/JSONFormDefinitionProvider';
import { useDataInsertionLogic } from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic';
import { DefinitionInsertionParams } from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic/types';
import { useUIElementErrors } from '@app/components/organisms/UIRenderer/hooks/useUIElementErrors/useUIElementErrors';
import { useUIElementProps } from '@app/components/organisms/UIRenderer/hooks/useUIElementProps';
import { useUIElementState } from '@app/components/organisms/UIRenderer/hooks/useUIElementState';
import { CollectionFlowContext } from '@app/domains/collection-flow/types/flow-context.types';
import { transformRJSFErrors } from '@app/helpers/transform-errors';
import { AnyObject, DynamicForm, ErrorsList } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import get from 'lodash/get';
import set from 'lodash/set';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export interface JSONFormElementBaseParams {
  jsonFormDefinition: RJSFSchema;
  uiSchema?: UiSchema;
  label?: string;
  hint?: string;
  description?: string;
  documentData?: AnyObject;
}

export interface JSONFormElementParams extends DefinitionInsertionParams {
  jsonFormDefinition?: { type?: string; required?: string[]; title?: string };
  uiSchema?: AnyObject;
}

export const JSONForm: UIElementComponent<JSONFormElementParams> = ({ definition }) => {
  useDataInsertionLogic(
    definition,
    definition?.options?.jsonFormDefinition?.type !== 'array' ||
      !definition?.options?.insertionParams,
  );

  const { state: elementState } = useUIElementState(definition);
  const { hidden } = useUIElementProps(definition);
  const { formSchema, uiSchema } = useMemo(
    () => createFormSchemaFromUIElements(definition),
    [definition],
  );
  const { stateApi } = useStateManagerContext();

  const { payload } = useStateManagerContext();
  const formData = useMemo(() => createInitialFormData(definition, payload), [definition, payload]);

  const formRef = useRef<any>(null);

  useEffect(() => {
    const elementValue = get(payload, definition.valueDestination) as unknown;
    // TO DO: ADD this logic to jmespath @blokh
    if (definition.options?.jsonFormDefinition?.type === 'array' && Array.isArray(elementValue)) {
      const payload = stateApi.getContext();
      //@ts-ignore
      set(
        payload,
        definition.valueDestination,
        elementValue.map((obj: AnyObject) => ({
          ...obj,
          additionalInfo: {
            ...obj.additionalInfo,
            companyName: get(payload, 'entity.data.companyName') as string,
            customerCompany: (payload as CollectionFlowContext).flowConfig.customerCompany,
          },
        })),
      );
    }
  }, [payload]);

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

  const { validationErrors } = useUIElementErrors(definition);

  return (
    <JSONFormDefinitionProvider definition={definition}>
      {hidden ? null : (
        <div className="flex flex-col gap-2">
          <DynamicForm
            schema={formSchema}
            uiSchema={uiSchema}
            fields={jsonFormFields}
            layouts={jsonFormLayouts}
            formData={formData}
            ref={formRef}
            transformErrors={transformRJSFErrors}
            onChange={handleArrayInputChange}
            onSubmit={handleSubmit}
          />
          {validationErrors && elementState.isTouched ? (
            <ErrorsList errors={validationErrors.map(err => err.message)} />
          ) : null}
        </div>
      )}
    </JSONFormDefinitionProvider>
  );
};
