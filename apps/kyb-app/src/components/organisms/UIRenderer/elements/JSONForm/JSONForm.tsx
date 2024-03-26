import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { createFormSchemaFromUIElements } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/createFormSchemaFromUIElements';
import { createInitialFormData } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/createInitialFormData';
import { UIElementComponent } from '@/components/organisms/UIRenderer/types';

import {
  jsonFormFields,
  jsonFormLayouts,
} from '@/components/organisms/UIRenderer/elements/JSONForm/json-form.fields';
import { JSONFormDefinitionProvider } from '@/components/organisms/UIRenderer/elements/JSONForm/providers/JSONFormDefinitionProvider';
import { useDataInsertionLogic } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic';
import { DefinitionInsertionParams } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic/types';
import { useUIElementErrors } from '@/components/organisms/UIRenderer/hooks/useUIElementErrors/useUIElementErrors';
import { useUIElementProps } from '@/components/organisms/UIRenderer/hooks/useUIElementProps';
import { useUIElementState } from '@/components/organisms/UIRenderer/hooks/useUIElementState';
import { Rule } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { transformRJSFErrors } from '@/helpers/transform-errors';
import { AnyObject, DynamicForm, ErrorsList } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import get from 'lodash/get';
import set from 'lodash/set';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export interface JSONFormElementBaseParams extends DefinitionInsertionParams {
  jsonFormDefinition: RJSFSchema;
  uiSchema?: UiSchema;
  label?: string;
  hint?: string;
  description?: string;
  documentData?: AnyObject;
  canAdd?: Rule[];
}

export const JSONForm: UIElementComponent<JSONFormElementBaseParams> = ({ definition }) => {
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
    const elementValue = get(
      payload,
      // @ts-ignore
      definition.valueDestination,
    ) as unknown;

    // TO DO: ADD this logic to jmespath @blokh
    if (definition.options?.jsonFormDefinition?.type === 'array' && Array.isArray(elementValue)) {
      const payload = stateApi.getContext();
      //@ts-ignore
      set(
        payload,
        // @ts-ignore
        definition.valueDestination,
        // @ts-expect-error - we do not validate `obj` is an object
        elementValue.map((obj: AnyObject) => ({
          ...obj,
          additionalInfo: {
            ...obj.additionalInfo,
            companyName: get(payload, 'entity.data.companyName') as string,
            customerCompany: (payload as CollectionFlowContext).flowConfig?.customerCompany,
          },
        })),
      );
    }
  }, [payload]);

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
            testId={definition?.name ? `${definition.name}-form` : undefined}
            transformErrors={transformRJSFErrors}
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
