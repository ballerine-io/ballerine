import { useContext } from 'react';
import { PluginsRunnerContext } from '../../../context';

export const usePlugins = () => useContext(PluginsRunnerContext);
