import { FunctionComponent } from 'react';
import { PluginsRunnerContext } from './context';
import { usePluginsRunner } from './hooks/internal/usePluginsRunner';
import { IPlugin } from './types';

interface IPluginRunnerProps {
  plugins: Array<IPlugin<any, any>>;
  children: React.ReactNode | React.ReactNode[];
}

export const PluginsRunner: FunctionComponent<IPluginRunnerProps> = ({ plugins, children }) => {
  const context = usePluginsRunner(plugins);

  return <PluginsRunnerContext.Provider value={context}>{children}</PluginsRunnerContext.Provider>;
};
