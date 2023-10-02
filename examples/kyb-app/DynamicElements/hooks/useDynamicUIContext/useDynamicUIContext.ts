import {
  DynamicUIRendererContext,
  dynamicUIRendererContext,
} from '@app/components/organisms/DynamicElements/context';
import { useContext } from 'react';

export const useDynamicUIContext = <TContext>() =>
  useContext(dynamicUIRendererContext) as DynamicUIRendererContext<TContext>;
