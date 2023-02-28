import { createWorkflow, WorkflowEventWithoutState } from '@ballerine/workflow-core';
import type { BaseActionObject, EventObject, StateNodeConfig, StatesConfig } from 'xstate';
import { assign } from 'xstate';
import { backendOptions } from './backend-options';
import { Action, Error, Errors, Event } from './enums';
import type {
  BackendOptions,
  BrowserWorkflowEvent,
  DeepPartial,
  IOnProps,
  IUserStepEvent,
  ObjectValues,
  TSubscribers,
  TWorkflowErrorEvent,
  TWorkflowEvent,
  TWorkflowHttpErrorEvent,
  WorkflowEventWithBrowserType,
  WorkflowOptionsBrowser,
} from './types';

export class WorkflowBrowserSDK {
  #__subscribers: TSubscribers = [];
  #__service: ReturnType<typeof createWorkflow>;
  #__backendOptions: BackendOptions;

  constructor({ backend, ...options }: WorkflowOptionsBrowser) {
    this.#__mergeBackendOptions(backend);

    // Actions defined within the machine's `states` object.
    const states = this.#__injectUserStepActionsToStates(options?.workflowDefinition?.states ?? {});
    // const states = this.#__injectSubmitActorToStates(states);

    // Actions defined within `createMachine`'s second argument (config object).

    this.#__service = createWorkflow({
      ...options,
      extensions: {
        statePlugins: [
          {
            stateNames: options?.persistStates ?? [],
            name: 'persist',
            when: 'entry',
            action: async ({ context }) => {
              const { baseUrl, endpoints, headers } = this.#__backendOptions;
              const { endpoint, method } = endpoints?.persist;
              const url = baseUrl ? new URL(endpoint, baseUrl) : endpoint;

              try {
                await new Promise(resolve => setTimeout(resolve, 2000));

                const res = await fetch(url, {
                  method,
                  body: JSON.stringify(context),
                  headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                  },
                });

                if (!res.ok) {
                  throw res;
                }
              } catch (err) {
                if (!(err instanceof Response)) {
                  throw err;
                }

                // throw new HttpError(
                //   err.status,
                //   `Response error: ${err.statusText} (${err.status})`,
                //   {
                // cause: err,
                //   },
                // );
              }
            },
          },
        ],
        globalPlugins: [],
      },
      workflowDefinition: {
        ...options?.workflowDefinition,
        states,
      },
      workflowActions: {
        [Action.USER_NEXT_STEP]: assign<Record<PropertyKey, any>, IUserStepEvent>(
          (context, event) => {
            context = {
              ...context,
              ...event.payload,
            };

            return context;
          },
        ),
        [Action.USER_PREV_STEP]: assign<Record<PropertyKey, any>, IUserStepEvent>(
          (context, event) => {
            context = {
              ...context,
              ...event.payload,
            };

            return context;
          },
        ),
      },
    });

    this.#__service.subscribe(event => {
      this.#__notify(event);
    });
  }

  /**
   * Merges partial user defined backend options received from {@link WorkflowBrowserSDK}'s constructor with the default options from {@link backendOptions}.
   * @param overrides
   */
  #__mergeBackendOptions(overrides: DeepPartial<BackendOptions> | undefined) {
    this.#__backendOptions = {
      ...backendOptions,
      ...overrides,
      endpoints: {
        persist: {
          ...backendOptions.endpoints.persist,
          ...overrides?.endpoints?.persist,
        },
        submit: {
          ...backendOptions.endpoints.submit,
          ...overrides?.endpoints?.submit,
        },
      },
      headers: {
        ...backendOptions.headers,
        ...overrides?.headers,
      },
    };
  }

  #__notify({
    type,
    payload,
    state,
  }: //  error
  WorkflowEventWithBrowserType) {
    this.#__subscribers.forEach(sub => {
      if (
        sub.event !== Event.WILD_CARD &&
        !(sub.event === Event.ERROR && Errors.includes(type as ObjectValues<typeof Error>)) &&
        sub.event !== type
      ) {
        return;
      }

      sub.cb({
        type: sub.event === Event.WILD_CARD || sub.event === Event.ERROR ? type : undefined,
        payload,
        state,
        // error,
      });
    });
  }

  subscribe<TEvent extends BrowserWorkflowEvent>(
    event: TEvent,
    cb: TEvent extends typeof Event.WILD_CARD
      ? (event: WorkflowEventWithBrowserType) => void
      : TEvent extends typeof Error.ERROR
      ? (event: TWorkflowErrorEvent) => void
      : TEvent extends typeof Error.HTTP_ERROR
      ? (event: TWorkflowHttpErrorEvent) => void
      : (event: TWorkflowEvent) => void,
  ) {
    this.#__subscribers.push({ event, cb });
  }

  sendEvent(event: WorkflowEventWithoutState) {
    this.#__service.sendEvent(event);
  }

  getSnapshot() {
    return this.#__service.getSnapshot();
  }

  /**
   * Adds the `USER_NEXT_STEP` and `USER_PREV_STEP` actions to
   * the machine states which include `on.USER_NEXT_STEP` and `on.USER_PREV_STEP`.
   * @param states
   * @private
   */
  #__injectUserStepActionsToStates(states: StatesConfig<any, any, any, BaseActionObject>) {
    /**
     * Make sure to not override existing actions.
     * Actions may be a string, an array of strings or undefined.
     * @param actions
     * @param action - `USER_NEXT_STEP`, `USER_PREV_STEP`, or user defined action.
     */
    const getActions = (
      // Actions is expected to be serializable.
      actions: string | Array<string> | undefined,
      action: typeof Action.USER_NEXT_STEP | typeof Action.USER_PREV_STEP | string,
    ) => {
      // Don't modify unrelated user defined actions.
      if (action !== Action.USER_NEXT_STEP && action !== Action.USER_PREV_STEP) {
        return actions;
      }

      // Push the `USER_NEXT_STEP` or `USER_PREV_STEP` action to
      // the existing `actions` array.
      if (Array.isArray(actions)) return [...actions, action];

      // Create a new array with the USER_NEXT_STEP/USER_PREV_STEP action,
      // and the existing user defined action.
      if (!!actions) return [actions, action];

      // Fallback to unchanged actions.
      return action;
    };

    /**
     * Traverses multiple levels of the state machine's `states` object,
     * injects the `USER_NEXT_STEP` and `USER_PREV_STEP` actions if needed,
     * without overriding unrelated props which may be defined within the `on` object or an event's props which are not `target` or `actions`.
     * @param outerKey
     * @param outerValue
     */
    const reduceStateOnProp = ([outerKey, outerValue]: [
      string,
      StateNodeConfig<unknown, any, EventObject> | StatesConfig<unknown, any, EventObject>,
    ]) => {
      const on = Object.entries(outerValue?.on ?? {})?.reduce((state, [event, target]) => {
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
        const actions = getActions(eventProps?.actions, event);

        // Construct the new `on` object.
        state[event] = {
          // Ensure if there are props which are not target or actions,
          // they don't get overridden.
          ...eventProps,
          ...(!eventProps?.invoke ? { actions } : {}),
        };

        return state;
      }, {} as Record<string, IOnProps>);

      // i.e. { WELCOME: { ..., on: { ... }, ... } }
      const injected = {
        ...outerValue,
        // Avoid adding an empty `on` prop if it
        // wasn't defined by the user originally.
        ...(Object.keys(on).length ? { on } : {}),
      };

      return [outerKey, injected];
    };

    const statesEntries = Object.entries(states)
      // Construct a new `on` object for each state.
      .map(reduceStateOnProp);

    return Object.fromEntries(statesEntries);
  }
}
