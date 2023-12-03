import {
  DynamicUIRendererContext,
  dynamicUIRendererContext,
} from '@/components/organisms/DynamicElements/context';
import { useContext } from 'react';

export const useDynamicUIContext = <TContext>() =>
  useContext(dynamicUIRendererContext) as DynamicUIRendererContext<TContext>;
