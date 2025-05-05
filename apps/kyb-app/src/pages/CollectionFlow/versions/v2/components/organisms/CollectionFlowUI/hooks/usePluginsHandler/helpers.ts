import { AnyObject, executeRules } from '@ballerine/ui';
import { IPlugin } from '../../components/utility/PluginsRunner/types';

export const checkIfPluginCanRun = (
  runOn: IPlugin['runOn'],
  eventName: string,
  context: AnyObject,
) => {
  const rules = runOn.find(rule => rule.type === eventName);

  if (!rules?.rules?.length) {
    return true;
  }

  return executeRules(context, rules.rules).every(result => result.result);
};
