import { dynamicUIContext } from '@/components/organisms/DynamicUI/dynamic-ui.context';
import { useContext } from 'react';

export const useDynamicUIContext = () => useContext(dynamicUIContext);
