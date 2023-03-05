import {
  createWorkflow,
  Error as ErrorEnum,
  Errors,
  StatePlugin,
  WorkflowEventWithoutState,
} from '@ballerine/workflow-core';
import type { BaseActionObject, StatesConfig } from 'xstate';
import { assign } from 'xstate';
import { backendOptions } from './backend-options';
import { Action, Event, Persistence } from './enums';
import { injectActionsToStateOnProp } from './inject-actions-to-state-on-prop';
import { BackendPersistPlugin } from './plugins/backend-persist-plugin';
import { LocalStoragePersistPlugin } from './plugins/local-storage-persist-plugin';
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
  TWorkflowStateActionStatusEvent,
  WorkflowEventWithBrowserType,
  WorkflowOptionsBrowser,
} from './types';
import { uniqueArray } from './utils';

export class WorkflowBrowserSDK {
  #__subscribers: TSubscribers = [];
  #__service: ReturnType<typeof createWorkflow>;
  #__backendOptions!: BackendOptions;

  constructor({ backend, ...options }: WorkflowOptionsBrowser) {
    this.#__mergeBackendOptions(backend);

    // Actions defined within the machine's `states` object.
    const states = this.#__injectUserStepActionsToStates(options?.workflowDefinition?.states ?? {});
    const statePlugins = this.#__handlePersistStatePlugins({
      states,
      persistStates: options?.persistStates,
      submitStates: options?.submitStates,
      workflowId: options?.workflowDefinition.id ?? '',
    });
    const assignContext = assign<Record<PropertyKey, any>, IUserStepEvent>((context, event) => {
      context = {
        ...context,
        ...event.payload,
      };

      return context;
    });

    this.#__service = createWorkflow({
      ...options,
      extensions: {
        statePlugins,
        globalPlugins: [],
      },
      workflowDefinition: {
        ...options?.workflowDefinition,
        states,
      },
      workflowActions: {
        [Action.USER_PREV_STEP]: assignContext,
        [Action.USER_NEXT_STEP]: assignContext,
      },
    });

    this.#__service.subscribe(event => {
      this.#__notify(event);
    });
  }

  /**
   * @description Handles state plugins based on their persistence type, and transforms the output `statePlugins` into the format workflow-core expects.
   * If no `submitStates` are provided, falls back to states with type `final`.
   */
  #__handlePersistStatePlugins({
    states,
    persistStates,
    submitStates,
    workflowId,
  }: {
    states: WorkflowOptionsBrowser['workflowDefinition']['states'];
    persistStates: WorkflowOptionsBrowser['persistStates'];
    submitStates: WorkflowOptionsBrowser['submitStates'];
    workflowId: string;
  }) {
    const statePlugins: Array<StatePlugin> = [];
    const finalStates = Object.keys(states ?? {})?.filter(
      state => states?.[state]?.type === 'final',
    );

    const backendStateNames = uniqueArray(
      persistStates
        ?.filter(state => state.persistence === Persistence.BACKEND)
        ?.map(state => state.state) ?? [],
    );
    const submitStateNames = uniqueArray(
      !submitStates?.length ? finalStates : submitStates?.map(({ state }) => state),
    );
    const localStorageStateNames = uniqueArray(
      persistStates
        ?.filter(state => state.persistence === Persistence.LOCAL_STORAGE)
        ?.map(({ state }) => state) ?? [],
    );

    const sharedOptions: Pick<
      ConstructorParameters<typeof BackendPersistPlugin>[0],
      'when' | 'fetchOptions'
    > = {
      when: 'entry',
      fetchOptions: {
        baseUrl: this.#__backendOptions.baseUrl,
        endpoint: this.#__backendOptions.endpoints.persist.endpoint
          .toString()
          .replace(':workflowId', workflowId),
        method: this.#__backendOptions.endpoints.persist.method,
        headers: this.#__backendOptions.headers,
      },
    };

    if (backendStateNames?.length) {
      statePlugins.push(
        new BackendPersistPlugin({
          ...sharedOptions,
          stateNames: backendStateNames,
        }),
      );
    }

    if (submitStateNames?.length) {
      const submitHttpPlugin = new BackendPersistPlugin({
        ...sharedOptions,
        stateNames: submitStateNames,
      });

      submitHttpPlugin.name = submitHttpPlugin.name.replace('SYNC', 'SUBMIT');

      statePlugins.push(submitHttpPlugin);
    }

    if (localStorageStateNames?.length) {
      statePlugins.push(
        new LocalStoragePersistPlugin({ when: 'entry', stateNames: localStorageStateNames }),
      );
    }

    return statePlugins;
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
      },
      headers: {
        ...backendOptions.headers,
        ...overrides?.headers,
      },
    };
  }

  #__notify(event: WorkflowEventWithBrowserType) {
    this.#__subscribers.forEach(sub => {
      if (
        sub.event !== Event.WILD_CARD &&
        !(
          sub.event === Event.ERROR && Errors.includes(event.type as ObjectValues<typeof ErrorEnum>)
        ) &&
        sub.event !== event.type
      ) {
        return;
      }

      const { action, ...payload } = event.payload ?? {};
      let eventType: string | undefined;

      if (
        sub.event === Event.WILD_CARD ||
        sub.event === Event.ERROR ||
        sub.event === Event.STATE_ACTION_STATUS
      ) {
        eventType = sub.event === Event.STATE_ACTION_STATUS ? (action as string) : event.type;
      }

      sub.cb({
        ...(eventType ? { type: eventType } : {}),
        payload,
        state: event.state,
        ...(event.error ? { error: event.error } : {}),
      });
    });
  }

  subscribe<TEvent extends BrowserWorkflowEvent>(
    event: TEvent,
    cb: TEvent extends typeof Event.WILD_CARD
      ? (event: WorkflowEventWithBrowserType) => void
      : TEvent extends typeof Event.STATE_ACTION_STATUS
      ? (event: TWorkflowStateActionStatusEvent) => void
      : TEvent extends typeof ErrorEnum.ERROR
      ? (event: TWorkflowErrorEvent) => void
      : TEvent extends typeof ErrorEnum.HTTP_ERROR
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
      .map(injectActionsToStateOnProp);

    return Object.fromEntries(statesEntries) as StatesConfig<any, any, any, BaseActionObject>;
  }
}
