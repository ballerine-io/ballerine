import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useCallback, useState } from 'react';
import { IPluginStatuses } from '../../../context';
import { getPlugin } from '../../../plugins.repository';
import { IPlugin } from '../../../types';

export const usePluginsRunner = (plugins: Array<IPlugin<any, any>> = []) => {
  const { stateApi } = useStateManagerContext();

  const [pluginStatuses, setPluginStatuses] = useState<IPluginStatuses>({});

  const schedulePlugin = useCallback(
    (pluginName: string) => {
      return new Promise(resolve => {
        if (!plugins.find(plugin => plugin.name === pluginName)) {
          console.log('Plugin not found', pluginName);

          throw Error('Plugin not found');
        }

        console.log('Scheduling plugin', pluginName);

        setPluginStatuses(prev => {
          const plugins = {
            ...prev,
            [pluginName]: { name: pluginName, status: 'pending' },
          } as const;

          console.log(`Plugin ${pluginName} is pending`);

          return plugins;
        });

        resolve(pluginName);
      });
    },
    [plugins],
  );

  const invokePlugin = useCallback(
    async (pluginName: string, pluginParams: any) => {
      console.log('Invoking plugin', pluginName);

      setPluginStatuses(prev => ({
        ...prev,
        [pluginName]: { name: pluginName, status: 'running' },
      }));

      console.log(`Plugin ${pluginName} is running`);

      try {
        const plugin = getPlugin(pluginName);
        await plugin(stateApi.getContext(), { api: stateApi }, pluginParams);

        setPluginStatuses(prev => ({
          ...prev,
          [pluginName]: { name: pluginName, status: 'completed' },
        }));

        console.log(`Plugin ${pluginName} is completed`);
      } catch (error) {
        console.log('Failed to invoke plugin', error);

        setPluginStatuses(prev => ({
          ...prev,
          [pluginName]: { name: pluginName, status: 'failed' },
        }));

        console.log(`Plugin ${pluginName} is failed`);
      }
    },
    [stateApi],
  );

  const runPlugin = async (plugin: IPlugin) => {
    try {
      await schedulePlugin(plugin.name);
      await invokePlugin(plugin.name, plugin.params);
    } catch (error) {
      console.log('Failed to run plugin', error);

      throw error;
    }
  };

  return { pluginStatuses, runPlugin, plugins };
};
