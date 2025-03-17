import { AnyRecord } from '@ballerine/common';
import { TPluginListener } from '../hooks/internal/usePluginsRunner/usePluginListeners';
import { IPlugin } from '../types';

export type TPluginStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface IPluginStatus {
  name: string;
  status: TPluginStatus;
}

export interface IPluginStatuses {
  [pluginName: string]: IPluginStatus;
}

export interface IPluginsRunnerContext {
  pluginStatuses: IPluginStatuses;
  plugins: IPlugin[];
  runPlugin: (plugin: IPlugin, context: AnyRecord) => Promise<void>;
  addListener: (listener: TPluginListener) => void;
  removeListener: (listener: TPluginListener) => void;
}
