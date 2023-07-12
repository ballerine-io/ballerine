import { AppSettings } from '@app/common/SettingsProvider/types';
import { createContext } from 'react';

export const settingsProviderContext = createContext({} as AppSettings);
