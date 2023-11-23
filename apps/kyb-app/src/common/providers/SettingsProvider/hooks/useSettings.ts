import { settingsProviderContext } from '@/common/providers/SettingsProvider/settings-provider.context';
import { useContext } from 'react';

export const useSettings = () => useContext(settingsProviderContext);
