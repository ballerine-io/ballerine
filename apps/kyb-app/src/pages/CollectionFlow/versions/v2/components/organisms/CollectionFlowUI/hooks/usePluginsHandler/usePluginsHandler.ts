import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { IFormEventElement, TElementEvent } from '@ballerine/ui';
import { useCallback } from 'react';
import { usePlugins } from '../../components/utility/PluginsRunner/hooks/external/usePlugins';
import { checkIfPluginCanRun } from './helpers';
import { usePluginRunners } from './usePluginRunners';

export const usePluginsHandler = () => {
  const { plugins } = usePlugins();
  const { getPluginRunner } = usePluginRunners(plugins);
  const { stateApi } = useStateManagerContext();

  const handleEvent = useCallback(
    (eventName: TElementEvent, element?: IFormEventElement<any, any>) => {
      const runners = getPluginRunner(eventName, element);
      const context = stateApi.getContext();

      if (!runners?.length) {
        return;
      }

      console.log(`Found plugins ${JSON.stringify(runners)} for event ${eventName}`);

      runners.forEach(runner => {
        if (!checkIfPluginCanRun(runner.runOn, eventName, context)) {
          console.log(`Plugin ${runner.name} cannot run for event ${eventName}`);

          return;
        }

        console.log(`Plugin ${runner.name} can run for event ${eventName}`);
        runner.run(context);
      });
    },
    [getPluginRunner, stateApi],
  );

  return {
    handleEvent,
  };
};
