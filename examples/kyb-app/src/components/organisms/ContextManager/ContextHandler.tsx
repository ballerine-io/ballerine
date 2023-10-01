import { DynamicElements } from '@app/components/organisms/DynamicElements/DynamicElements';
import { UISchema } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import set from 'lodash/set';
import { UIElement } from '@app/components/organisms/DynamicElements/types';
import { ApiActionHandler } from '@app/components/organisms/DynamicElements/action-handlers/api.action-handler';
import { ButtonUIElement } from '@app/components/organisms/DynamicElements/ui-elements/ButtonUI';
import { TextInputUIElement } from '@app/components/organisms/DynamicElements/ui-elements/TextInputUIElement';
import { useValidator } from '@app/components/organisms/ContextManager/useValidator';

interface Props<TContext extends AnyObject> {
  uiSchemas: UISchema[];
  context: TContext;
}

const actionHandlers = [new ApiActionHandler()];
const elements = { button: ButtonUIElement, text: TextInputUIElement };

export const ContextManager = <TContext extends AnyObject>({
  uiSchemas,
  context,
}: Props<TContext>) => {
  const mergedUIElements = useMemo(() => {
    return uiSchemas.reduce((uiElements, schema) => {
      return uiElements.concat(schema.uiSchema.uiElements);
    }, [] as UIElement<any>[]);
  }, [uiSchemas]);
  const [ctx, setContext] = useState(context);
  const { errors } = useValidator(mergedUIElements, ctx);

  const contextRef = useRef(ctx);

  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  const handleChange = useCallback(
    (caller: UIElement<any>, value: unknown) => {
      console.log({ caller, value });
      set(contextRef.current, caller.valueDestination, value);

      setContext({ ...contextRef.current });
    },
    [contextRef],
  );

  return (
    <div className="flex">
      <div className="flex w-[80%] gap-2">
        {uiSchemas.map((uiSchema, index) => {
          return (
            <div key={index}>
              <DynamicElements
                actionHandlers={actionHandlers}
                uiElements={uiSchema.uiSchema.uiElements}
                actions={uiSchema.uiSchema.actions}
                elements={elements}
                context={ctx}
                errors={errors}
                onChange={handleChange}
              />
            </div>
          );
        })}
      </div>
      <div>{JSON.stringify(context)}</div>
    </div>
  );
};
