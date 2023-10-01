import { DynamicUIRendererContext } from '@app/components/organisms/DynamicElements/context/types';
import { createContext } from 'react';

export const dynamicUIRendererContext = createContext({} as DynamicUIRendererContext<any>);
