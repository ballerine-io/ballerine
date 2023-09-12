import { dynamicUIRendererContext } from '@app/components/organisms/DynamicUIRenderer/context';
import { useContext } from 'react';

export const useDynamicUIContext = () => useContext(dynamicUIRendererContext);
