import { useEffect } from 'react';
import { TPluginListener } from '../../internal/usePluginsRunner/usePluginListeners';
import { usePlugins } from '../usePlugins/usePlugins';

export const usePluginsSubscribe = (listener: TPluginListener) => {
  const { addListener, removeListener } = usePlugins();

  useEffect(() => {
    addListener(listener);

    return () => {
      removeListener(listener);
    };
  }, [addListener, listener, removeListener]);
};
