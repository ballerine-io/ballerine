import { settingsProviderContext } from '@app/common/providers/SettingsProvider/settings-provider.context';
import { useContext } from 'react';

export const useSettings = () => useContext(settingsProviderContext);
