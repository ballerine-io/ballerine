import { uiRendererContext } from '@app/components/organisms/UIRenderer/ui-renderer.context';
import { useContext } from 'react';

export const useUIRendererContext = () => useContext(uiRendererContext);
