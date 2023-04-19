/* eslint-disable */
import { Action } from './enums';

/**
 * Makes sure to not override existing actions.
 * Actions may be a string, an array of strings or undefined.
 * @param actions
 * @param action - `USER_NEXT_STEP`, `USER_PREV_STEP`, or user defined action.
 */

export const mergeStepActions = (state: { [x: string]: any }, [event, target]: any): any => {
  const nextTarget = target?.[event] ?? target?.target;
  const eventProps =
    typeof target === 'string'
      ? { target }
      : // i.e. the value of { USER_NEXT_STEP: [TARGET] }
        {
          // { target: ..., actions: ... } etc.
          ...target,
          ...(nextTarget ? { target: nextTarget } : {}),
        };
  // Inject actions and honor user defined actions.
  let actions = eventProps?.actions;

  if (event === Action.USER_NEXT_STEP || event === Action.USER_PREV_STEP) {
    actions = actions ? [...(Array.isArray(actions) ? actions : [actions]), event] : [event];
  }

  // Construct the new `on` object.
  state[event] = {
    // Ensure if there are props which are not target or actions,
    // they don't get overridden.
    ...eventProps,
    ...(!eventProps?.invoke ? { actions } : {}),
  };

  return state;
};
