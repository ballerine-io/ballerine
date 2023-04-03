import { getFlowConfig } from '../../contexts/flows/hooks';
import { get } from 'svelte/store';
import { configuration } from '../../contexts/configuration';
import { FlowEventBusFn } from './interfaces';
import { FlowEventTypes } from './enums';

export const flowEventBus: FlowEventBusFn = ({ type, payload }) => {
  const { callbacks } = getFlowConfig(get(configuration));

  switch (type) {
    case FlowEventTypes.FLOW_COMPLETE:
      callbacks?.onFlowComplete?.(payload);
      break;
    case FlowEventTypes.FLOW_EXIT:
      callbacks?.onFlowExit?.(payload);
      break;
    case FlowEventTypes.FLOW_ERROR:
      callbacks?.onFlowError?.(payload);
      break;
    case FlowEventTypes.FLOW_NAVIGATION_UPDATE:
      callbacks?.onFlowNavigationUpdate?.(payload);
      break;
    default:
      throw new Error(`Unknown flow event type ${JSON.stringify(type)}`);
  }
};
