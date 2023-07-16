import { ViewStateSchema } from '@app/common/providers/ViewStateProvider/types';
import { EventData, createMachine } from 'xstate';

export function createStateMachine<TContext extends object>(schema: ViewStateSchema) {
  return createMachine(schema, {
    actions: {
      updateStateData: (
        context: TContext,
        event: EventData & { payload: object; shared?: object },
        meta,
      ) => {
        context[meta.state.value as string] = event.payload;

        if (event.shared) {
          context['shared'] = { ...context['shared'], ...event.shared };
        }

        return context;
      },
    },
  });
}
