import { EventObject, StateNodeConfig, StatesConfig } from 'xstate';
import { IOnProps } from '../types';
import { mergeStepActions } from './merge-step-actions';

/**
 * Traverses multiple levels of the state machine's `states` object,
 * injects the `USER_NEXT_STEP` and `USER_PREV_STEP` actions if needed,
 * without overriding unrelated props which may be defined within the `on` object or an event's props which are not `target` or `actions`.
 * @param outerKey
 * @param outerValue
 */

export const reduceStateOnProp = ([outerKey, outerValue]: [
  string,
  StateNodeConfig<unknown, any, EventObject> | StatesConfig<unknown, any, EventObject>,
]) => {
  const on = Object.entries(outerValue?.on ?? {})?.reduce(
    mergeStepActions,
    {} as Record<string, IOnProps>,
  );

  // i.e. { WELCOME: { ..., on: { ... }, ... } }
  const injected = {
    ...outerValue,
    // Avoid adding an empty `on` prop if it
    // wasn't defined by the user originally.
    ...(Object.keys(on).length ? { on } : {}),
  };

  return [outerKey, injected];
};
