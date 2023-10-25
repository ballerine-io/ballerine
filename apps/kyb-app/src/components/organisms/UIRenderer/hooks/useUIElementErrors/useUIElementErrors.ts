import { usePageContext } from '@app/components/organisms/DynamicUI/Page';
import { usePageResolverContext } from '@app/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { ErrorField } from '@app/components/organisms/DynamicUI/rule-engines';
import { UIElement } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';

export const useUIElementErrors = (
  definition: UIElement<AnyObject>,
): { warnings: ErrorField[]; validationErrors: ErrorField[] } => {
  const { errors: _errors, pageErrors: _pageErrors } = usePageContext();
  const { currentPage } = usePageResolverContext();

  const errors = useMemo(() => {
    const pageErrors = _pageErrors[currentPage.stateName] || {};
    const fieldPageError = pageErrors[definition.valueDestination];

    const fieldError = _errors[definition.valueDestination];

    const allErrors = [fieldPageError, fieldError];

    return allErrors.filter(Boolean);
  }, [definition, _errors, _pageErrors, currentPage]);

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
