import { ISettings } from '@app/common/types/settings';
import { createContext } from 'react';

export const settingsProviderContext = createContext({} as ISettings);
