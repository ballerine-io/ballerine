import { IRendererElement } from '@/components/organisms/Renderer/types';

export const createRenderedElementKey = (element: IRendererElement, stack?: number[]) =>
  [element.id, ...(stack || [])].join('-');
