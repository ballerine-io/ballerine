import { appState, IAppState } from '../../contexts/app-state';
import { currentLanguage, Languages } from '../../contexts/translation';
import { EventTypes, IDocumentVerificationResponse, IOuterEvent, TActionNames } from './types';
import { get } from 'svelte/store';
import { flowEventBus } from '../../services/flow-event-bus/flow-event-bus';
import { FlowEventTypes } from '../../services/flow-event-bus/enums';
import { BALLERINE_EVENT } from './constants';
import { IEventOptions, IFlowErrorPayload } from '../../services/flow-event-bus/interfaces';
import { configuration } from '../../contexts/configuration';
import { getFlowConfig } from '../../contexts/flows/hooks';
import { IFlowCompletePayload } from '../../services/flow-event-bus/interfaces';

export const subscribe = () => {
  window.addEventListener('message', e => {
    const event = e.data as IOuterEvent;
    if (event.eventName === 'blrn_set_lang') {
      const language = event.config.lang as Languages;
      currentLanguage.set(language);
    }
  });
};

export const sendIframeEvent = (eventOptions: IEventOptions) => {
  window.parent.postMessage(eventOptions, '*'); // iframe
};

// without arguments sending events without payload
export const sendFlowCompleteEvent = (verificationResponse?: IDocumentVerificationResponse) => {
  const { syncFlow } = getFlowConfig(get(configuration));
  const { status, idvResult } = verificationResponse ?? {};
  const eventOptions: IFlowCompletePayload = {
    eventName: BALLERINE_EVENT,
    eventType: syncFlow ? EventTypes.SYNC_FLOW_COMPLETE : EventTypes.ASYNC_FLOW_COMPLETE,
    payload: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      status: status!,
      code: -1,
      idvResult,
    },
  };

  sendIframeEvent(eventOptions);
  // Should finalize the signature on the callbacks interface
  flowEventBus({
    type: FlowEventTypes.FLOW_COMPLETE,
    payload: eventOptions,
  });
};

export const sendVerificationUpdateEvent = (
  details: IDocumentVerificationResponse,
  shouldExit = false,
) => {
  const eventOptions = {
    eventName: BALLERINE_EVENT,
    eventType: EventTypes.VERIFICATION_UPDATE,
    shouldExit,
    details,
  };
  window.parent.postMessage(eventOptions, '*');
};

export const sendNavigationUpdateEvent = () => {
  const as = get(appState);

  const eventOptions = {
    eventName: BALLERINE_EVENT,
    eventType: EventTypes.NAVIGATION_UPDATE,
    details: {
      currentIdx: as.currentStepIdx,
      // FIXME: currentPage and previousPage typed as a string by IAppState.
      currentPage: as.currentPage,
      previousPage: as.previousPage,
    },
  };
  window.parent.postMessage(eventOptions, '*');
  flowEventBus({
    type: FlowEventTypes.FLOW_NAVIGATION_UPDATE,
    payload: eventOptions,
  });
};

export const sendButtonClickEvent = (
  actionName: TActionNames,
  status: IDocumentVerificationResponse,
  as: IAppState,
  shouldExit = false,
) => {
  const eventOptions = {
    eventName: BALLERINE_EVENT,
    eventType: EventTypes.BUTTON_CLICK,
    shouldExit,
    details: {
      actionName,
      currentIdx: as.currentStepIdx,
      currentPage: as.currentPage,
      status,
    },
  };

  window.parent.postMessage(eventOptions, '*');
};

export const sendFlowErrorEvent = (_error: Error, _shouldExit = false) => {
  // const as = get(appState);

  const eventOptions: IFlowErrorPayload = {
    eventName: BALLERINE_EVENT,
    eventType: EventTypes.FLOW_ERROR,
    payload: {},
    // shouldExit: shouldExit,
    // details: {
    //   currentIdx: as.currentStepIdx,
    //   currentPage: as.currentPage,
    // },
  };
  window.parent.postMessage(eventOptions, '*');
  flowEventBus({
    type: FlowEventTypes.FLOW_ERROR,
    payload: eventOptions,
  });
};
