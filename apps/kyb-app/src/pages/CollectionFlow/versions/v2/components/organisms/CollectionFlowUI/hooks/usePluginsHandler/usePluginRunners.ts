import { useRefValue } from '@/hooks/useRefValue';
import { AnyObject, IFormEventElement, TElementEvent } from '@ballerine/ui';
import debounce from 'lodash/debounce';
import { useCallback, useMemo } from 'react';
import { usePlugins } from '../../components/utility/PluginsRunner/hooks/external/usePlugins';
import { IPlugin } from '../../components/utility/PluginsRunner/types';

export const usePluginRunners = (plugins: IPlugin[] = []) => {
  const { runPlugin } = usePlugins();

  const runPluginRef = useRefValue(runPlugin);

  const runners = useMemo(() => {
    return plugins.map(plugin => ({
      name: plugin.name,
      run: plugin.commonParams?.debounceTime
        ? debounce((context: AnyObject) => {
            void runPluginRef.current(plugin, context);
          }, plugin.commonParams.debounceTime)
        : (context: AnyObject) => {
            void runPluginRef.current(plugin, context);
          },
      runOn: plugin.runOn,
    }));
  }, [plugins, runPluginRef]);

  const getPluginRunner = useCallback(
    (eventName: TElementEvent, element?: IFormEventElement<any, any>) => {
      if (eventName && element) {
        return runners.filter(runner =>
          runner.runOn?.some(runOn => runOn.type === eventName && runOn.elementId === element.id),
        );
      }

      return runners.filter(runner => runner.runOn?.some(runOn => runOn.type === eventName));
    },
    [runners],
  );

  return { runners, getPluginRunner };
};
