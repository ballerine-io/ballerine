import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { useCallback, useState } from 'react';
import { TPluginStatus } from '../../../context';

export type TPluginListener = <TContext = CollectionFlowContext, TPluginParams = unknown>(
  result: TContext,
  pluginName: string,
  pluginParams: TPluginParams,
  status: TPluginStatus,
) => void;

export const usePluginListeners = () => {
  const [listeners, setListeners] = useState<TPluginListener[]>([]);

  const addListener = useCallback((listener: TPluginListener) => {
    setListeners(prev => [...prev, listener]);
  }, []);

  const removeListener = useCallback((listener: TPluginListener) => {
    setListeners(prev => prev.filter(l => l !== listener));
  }, []);

  const notifyListeners = useCallback(
    (
      result: CollectionFlowContext,
      pluginName: string,
      pluginParams: unknown,
      status: TPluginStatus,
    ) => {
      listeners.forEach(listener => listener(result, pluginName, pluginParams, status));
    },
    [listeners],
  );

  return { listeners, addListener, removeListener, notifyListeners };
};
