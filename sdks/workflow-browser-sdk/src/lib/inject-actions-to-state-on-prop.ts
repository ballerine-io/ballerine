/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventObject, StateNodeConfig, StatesConfig } from 'xstate';
import { mergeStepActions } from './merge-step-actions';
import { IOnProps } from './types';

/**
 * Traverses multiple levels of the state machine's `states` object,
 * injects the `USER_NEXT_STEP` and `USER_PREV_STEP` actions if needed,
 * without overriding unrelated props which may be defined within the `on` object or an event's props which are not `target` or `actions`.
 *
 * @param param0 - `[state, stateConfig]` entries from `states` object.
 * @returns A tuple of `[state, injected]`
 */
export const injectActionsToStateOnProp = ([state, stateConfig]: [
  state: string,
  stateConfig: StateNodeConfig<unknown, any, EventObject> | StatesConfig<unknown, any, EventObject>,
]) => {
  const on = Object.entries(stateConfig?.on ?? {})?.reduce(
    mergeStepActions,
    {} as Record<string, IOnProps>,
  );

  // i.e. { WELCOME: { ..., on: { ... }, ... } }
  const injected = {
    ...stateConfig,
    // Avoid adding an empty `on` prop if it
    // wasn't defined by the user originally.
    ...(Object.keys(on).length ? { on } : {}),
  };

  return [state, injected];
};
