import { IRendererElement } from '@/components/organisms/Renderer/types';

export const createRenderedElementKey = (element: IRendererElement, stack?: number[]) => {
  return [element.id, ...(stack || [])].join('-');
};
