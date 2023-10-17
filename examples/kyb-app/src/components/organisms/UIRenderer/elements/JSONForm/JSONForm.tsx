import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { createFormSchemaFromUIElements } from '@app/components/organisms/UIRenderer/elements/JSONForm/helpers/createFormSchemaFromUIElements';
import { createInitialFormData } from '@app/components/organisms/UIRenderer/elements/JSONForm/helpers/createInitialFormData';
import { UIElementComponent } from '@app/components/organisms/UIRenderer/types';

import { AnyObject, DynamicForm, ErrorsList } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useCallback, useMemo, useRef } from 'react';
import set from 'lodash/set';
import get from 'lodash/get';
import {
  jsonFormFields,
  jsonFormLayouts,
} from '@app/components/organisms/UIRenderer/elements/JSONForm/json-form.fields';
import { transformRJSFErrors } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/transform-errors';
import { useUIElementProps } from '@app/components/organisms/UIRenderer/hooks/useUIElementProps';
import { DataCreationParams } from '@app/components/organisms/UIRenderer/elements/JSONForm/hocs/withInitialDataCreation';
import { useUIElementErrors } from '@app/components/organisms/UIRenderer/hooks/useUIElementErrors/useUIElementErrors';
import { useUIElementState } from '@app/components/organisms/UIRenderer/hooks/useUIElementState';
import { CollectionFlowContext } from '@app/domains/collection-flow/types/flow-context.types';

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

  const handleArrayInputChange = useCallback(
    (values: AnyObject[]) => {
      if (definition.options?.jsonFormDefinition?.type === 'array') {
        const prevContext = stateApi.getContext();
        const currentValue = get(prevContext, definition.valueDestination);

        if (Array.isArray(currentValue) && currentValue.length !== values.length) {
          set(
            prevContext,
            definition.valueDestination,
            values.map(obj => ({
              ...obj,
              customerCompany: get(payload, 'entity.data.companyName') as string,
              companyName: (payload as CollectionFlowContext).flowConfig.companyName,
            })),
          );

          stateApi.setContext(prevContext);
        } else {
          // TO DO: ADD this logic to jmespath @blokh
          set(
            prevContext,
            definition.valueDestination,
            //@ts-nocheck
            get(stateApi.getContext(), definition.valueDestination).map(obj => ({
              ...obj,
              customerCompany: get(payload, 'entity.data.companyName') as string,
              companyName: (payload as CollectionFlowContext).flowConfig.companyName,
            })),
          );

          stateApi.setContext(prevContext);
        }
      }
    },
    [definition, stateApi, payload],
  );

  const handleSubmit = useCallback(() => {}, []);

  const { validationErrors } = useUIElementErrors(definition);

  return hidden ? null : (
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
  );
};

//@ts-nocheck
// JSONForm.Documents = Documents;
