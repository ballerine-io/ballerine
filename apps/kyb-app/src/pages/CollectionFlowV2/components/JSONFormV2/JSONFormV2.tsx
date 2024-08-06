import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { createFormSchemaFromUIElements } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/createFormSchemaFromUIElements';
import { createInitialFormData } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/createInitialFormData';
import { useDataInsertionLogic } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic';
import { DefinitionInsertionParams } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic/types';
import { useUIElementProps } from '@/components/organisms/UIRenderer/hooks/useUIElementProps';
import { UIElementComponent } from '@/components/organisms/UIRenderer/types';
import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { useValidatedInput } from '@/components/providers/Validator/hooks/useValidatedInput';
import { Rule } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { transformRJSFErrors } from '@/helpers/transform-errors';
import { transformV1UIElementToV2UIElement } from '@/pages/CollectionFlowV2/helpers';
import { AnyObject, DynamicForm, ErrorsList } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import get from 'lodash/get';
import set from 'lodash/set';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { jsonFormFields, jsonFormLayouts } from './json-form.fields';
import { JSONFormDefinitionProvider } from './providers/JSONFormDefinitionProvider';

export interface JSONFormElementBaseParams extends DefinitionInsertionParams {
  jsonFormDefinition: RJSFSchema;
  uiSchema?: UiSchema;
  label?: string;
  hint?: string;
  description?: string;
  documentData?: AnyObject;
  canAdd?: Rule[];
}

export const JSONFormV2: UIElementComponent<JSONFormElementBaseParams> = ({ definition }) => {
  useDataInsertionLogic(
    definition,
    definition?.options?.jsonFormDefinition?.type !== 'array' ||
      !definition?.options?.insertionParams,
  );

  const { hidden } = useUIElementProps(definition);
  const { formSchema, uiSchema } = useMemo(
    () => createFormSchemaFromUIElements(definition),
    [definition],
  );
  const { stateApi } = useStateManagerContext();

  const { payload } = useStateManagerContext();
  const uiElement = useMemo(
    () => new UIElement(transformV1UIElementToV2UIElement(definition), payload, []),
    [definition, payload],
  );
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

  const errors = useValidatedInput(uiElement);

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
            testId={definition?.name ? `${definition.name}` : undefined}
            transformErrors={transformRJSFErrors}
            onSubmit={handleSubmit}
          />
          {errors?.length ? <ErrorsList errors={errors} /> : null}
        </div>
      )}
    </JSONFormDefinitionProvider>
  );
};
