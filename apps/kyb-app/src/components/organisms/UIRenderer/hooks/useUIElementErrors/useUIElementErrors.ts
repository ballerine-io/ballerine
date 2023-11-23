import { usePageContext } from '@/components/organisms/DynamicUI/Page';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { ErrorField } from '@/components/organisms/DynamicUI/rule-engines';
import { UIElement } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export const useUIElementErrors = (
  definition: UIElement<AnyObject>,
  errorKeyFallback?: () => string,
): { warnings: ErrorField[]; validationErrors: ErrorField[] } => {
  const { errors: _errors, pageErrors: _pageErrors } = usePageContext();
  const { currentPage } = usePageResolverContext();

  const errors = useMemo(() => {
    const pageErrors = _pageErrors[currentPage?.stateName as string] || {};
    const fieldPageError =
      pageErrors[definition.valueDestination as string] ||
      (errorKeyFallback && pageErrors[errorKeyFallback()]);

    const fieldError =
      _errors[definition.valueDestination as string] ||
      (errorKeyFallback && _errors[errorKeyFallback()]) ||
      ([] as ErrorField[]);

    const allErrors = [fieldPageError, ...fieldError];

    return allErrors.filter(Boolean) as ErrorField[];
  }, [definition, _errors, _pageErrors, currentPage, errorKeyFallback]);

  const warnings = useMemo(() => errors.filter(error => error.type === 'warning'), [errors]);

  const validationErrors = useMemo(
    () => errors.filter(error => error.type !== 'warning'),
    [errors],
  );

  return {
    warnings,
    validationErrors,
  };
};
