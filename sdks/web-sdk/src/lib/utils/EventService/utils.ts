import {
  appState,
  DevMocks,
  IAppState,
  ISelectedParams,
  IStoreData,
} from '../../contexts/appState';
import { currentLanguage, Languages } from '../../contexts/translation';
import { IDocumentVerificationResponse, IOuterEvent, ISendDocumentsResponse } from './types';
import { get } from 'svelte/store';
import { getFlowConfig } from '../../contexts/flows/hooks';
import { IAppConfiguration } from '../../contexts/configuration';
import { flowEventBus } from '../../services/flow-event-bus/flow-event-bus';
import { EFlowEvent } from '../../services/flow-event-bus/enums';

const outerScopeContext = window.__blrn_context;
const isProd = window.__blrn_is_prod;
const endpoint =
  outerScopeContext && outerScopeContext.debug !== undefined
    ? '/upload-docs'
    : '/v2/enduser/verify';
const local = outerScopeContext && outerScopeContext.local !== undefined;
const baseUrl = local ? 'http://localhost:3001' : window.__blrn_api_url;
const docTypeMapping = {
  documentBack: 'document-back',
  documentFront: 'document-front',
  selfie: 'face',
};

export const subscribe = () => {
  window.addEventListener('message', e => {
    const event = e.data as IOuterEvent;
    if (event.eventName === 'blrn_set_lang') {
      const language = event.config.lang as Languages;
      currentLanguage.set(language);
    }
  });
};

export const sendIframeEvent = eventOptions => {
  window.parent.postMessage(eventOptions, '*'); // iframe
};

export const sendFlowCompleteEvent = (verificationResponse: IDocumentVerificationResponse) => {
  const { status, idvResult } = verificationResponse;
  const payload = { status, idvResult };
  const eventOptions = {
    eventName: 'blrn_event',
    eventType: 'sync_flow_complete',
    payload,
  };

  sendIframeEvent(eventOptions);
  // Should finalize the signature on the callbacks interface
  flowEventBus({
    type: EFlowEvent.FLOW_COMPLETE,
    payload: eventOptions,
  });
};

export const sendVerificationUpdateEvent = (
  details: IDocumentVerificationResponse,
  shouldExit = false,
) => {
  const eventOptions = {
    eventName: 'blrn_event',
    eventType: 'verification_update',
    shouldExit,
    details,
  };
  window.parent.postMessage(eventOptions, '*');
};

export const sendNavigationUpdateEvent = () => {
  const as = get(appState);

  const eventOptions = {
    eventName: 'blrn_event',
    eventType: 'navigation_update',
    details: {
      currentIdx: as.currentStepIdx,
      // FIXME: currentPage and previousPage typed as a string by IAppState.
      currentPage: as.currentPage,
      previousPage: as.previousPage,
    },
  };
  window.parent.postMessage(eventOptions, '*');
  flowEventBus({
    type: EFlowEvent.FLOW_NAVIGATION_UPDATE,
    payload: eventOptions,
  });
};

export const sendButtonClickEvent = (
  actionName: string,
  status: IDocumentVerificationResponse,
  as: IAppState,
  shouldExit = false,
) => {
  const eventOptions = {
    eventName: 'blrn_event',
    eventType: 'button_click',
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
