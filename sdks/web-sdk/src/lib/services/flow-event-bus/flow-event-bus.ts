import { getFlowConfig } from '../../contexts/flows/hooks';
import { get } from 'svelte/store';
import { configuration } from '../../contexts/configuration';
import { IFlowEventBus } from './interfaces';
import { FlowEvent } from './enums';

export const flowEventBus: IFlowEventBus = ({ type, payload }) => {
  const { callbacks } = getFlowConfig(get(configuration));

  switch (type) {
    case FlowEvent.FLOW_COMPLETE:
      callbacks?.onFlowComplete?.(payload);
      break;
    case FlowEvent.FLOW_EXIT:
      callbacks?.onFlowExit?.(payload);
      break;
    case FlowEvent.FLOW_ERROR:
      callbacks?.onFlowError?.(payload);
      break;
    case FlowEvent.FLOW_NAVIGATION_UPDATE:
      callbacks?.onFlowNavigationUpdate?.(payload);
      break;
    default:
      // JSON.stringify assumes the passed type could be anything, like this type should display correctly in the console.
      throw new Error(`Unknown flow event type ${JSON.stringify(type)}`);
  }
};
