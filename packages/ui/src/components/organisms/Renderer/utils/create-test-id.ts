import { IRendererElement } from '@/components/organisms/Renderer/types';

export const createTestId = (definition: IRendererElement, stack?: number[]) => {
  return [definition.id, ...(stack || [])].join('-');
};
