import { getFlowConfig } from '../../contexts/flows/hooks';
import { get } from 'svelte/store';
import { configuration } from '../../contexts/configuration';
import { FlowEventBusFn } from './interfaces';
import { FlowEventType } from './enums';

export const flowEventBus: FlowEventBusFn = ({ type, payload }) => {
  const { callbacks } = getFlowConfig(get(configuration));

  switch (type) {
    case FlowEventType.FLOW_COMPLETE:
      callbacks?.onFlowComplete?.(payload);
      break;
    case FlowEventType.FLOW_EXIT:
      callbacks?.onFlowExit?.(payload);
      break;
    case FlowEventType.FLOW_ERROR:
      callbacks?.onFlowError?.(payload);
      break;
    case FlowEventType.FLOW_NAVIGATION_UPDATE:
      callbacks?.onFlowNavigationUpdate?.(payload);
      break;
    default:
      // JSON.stringify assumes the passed type could be anything, like this type should display correctly in the console.
      throw new Error(`Unknown flow event type ${JSON.stringify(type)}`);
  }
};
