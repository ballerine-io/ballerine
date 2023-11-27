import { UIPage } from '@/domains/collection-flow';
import { AnyChildren } from '@ballerine/ui';

export interface PageResolverContext {
  currentPage: UIPage | null;
  pages: UIPage[];
}

export type PageResolverRenderCallback = (currentPage: PageResolverContext) => JSX.Element | null;

export interface PageResolverProps {
  state: string;
  pages: UIPage[];
  children: AnyChildren | PageResolverRenderCallback;
}
