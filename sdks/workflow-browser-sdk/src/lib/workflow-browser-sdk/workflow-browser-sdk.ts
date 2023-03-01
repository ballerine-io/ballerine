import { createWorkflow, Error, Errors, WorkflowEventWithoutState } from '@ballerine/workflow-core';
import type { BaseActionObject, StatesConfig } from 'xstate';
import { assign } from 'xstate';
import { Action, Event } from '../enums';
import { PersistPlugin } from '../plugins/persist-plugin';
import type {
  BackendOptions,
  BrowserWorkflowEvent,
  DeepPartial,
  IUserStepEvent,
  ObjectValues,
  TSubscribers,
  TWorkflowErrorEvent,
  TWorkflowEvent,
  TWorkflowHttpErrorEvent,
  WorkflowEventWithBrowserType,
  WorkflowOptionsBrowser,
} from '../types';
import { backendOptions } from './backend-options';
import { reduceStateOnProp } from './reduce-state-on-prop';

export class WorkflowBrowserSDK {
  #__subscribers: TSubscribers = [];
  #__service: ReturnType<typeof createWorkflow>;
  #__backendOptions!: BackendOptions;

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
          new PersistPlugin({
            stateNames: options?.persistStates ?? [],
            fetchOptions: {
              baseUrl: this.#__backendOptions.baseUrl,
              endpoint: this.#__backendOptions.endpoints.persist.endpoint,
              method: this.#__backendOptions.endpoints.persist.method,
              headers: this.#__backendOptions.headers,
            },
          }),
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

  #__notify({ type, payload, state, error }: WorkflowEventWithBrowserType) {
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
        error,
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
    const statesEntries = Object.entries(states)
      // Construct a new `on` object for each state.
      .map(reduceStateOnProp);

    return Object.fromEntries(statesEntries);
  }
}
