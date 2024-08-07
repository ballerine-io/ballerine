import { usePageContext } from '@/components/organisms/DynamicUI/Page';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { UIElement } from '@/domains/collection-flow';
import { DocumentFieldParams } from '@/pages/CollectionFlowV2/components/JSONFormV2/components/DocumentField/DocumentField';
import { useMemo } from 'react';

export const useDocumentFieldWarnings = (definition: UIElement<DocumentFieldParams>) => {
  const { pageErrors } = usePageContext();
  const { currentPage } = usePageResolverContext();

  const documentWarnings = useMemo(() => {
    const currentPageErrors = pageErrors[currentPage?.stateName as string] || {};

    //TODO: fix this after refactoring warnings logic
    const fieldPageError =
      currentPageErrors[`document-error-${definition?.options?.documentData?.id}`];

    return fieldPageError ? [fieldPageError] : [];
  }, [pageErrors, currentPage]);

  return documentWarnings;
};
