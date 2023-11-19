import { pageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/page-resolver.context';
import { useContext } from 'react';

export const usePageResolverContext = () => useContext(pageResolverContext);
