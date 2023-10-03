import { UIPage } from '@app/domains/collection-flow';
import { AnyChildren } from '@ballerine/ui';

export interface PageResolverContext {
  currentPage: UIPage | null;
}

export type PageResolverRenderCallback = (currentPage: PageResolverContext) => JSX.Element;

export interface PageResolverProps {
  state: string;
  pages: UIPage[];
  children: AnyChildren | PageResolverRenderCallback;
}
