import { useViewState } from '@app/common/providers/ViewStateProvider';
import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';
import { useLayoutEffect } from 'react';

// Main idea behing this component to:
// - mount
// - detect if user is returning with errors to fix if schema provided
// - otherwise redirect user to initial personal information form

export const MainView = () => {
  const { next, send } = useViewState<typeof kybViewSchema>();

  useLayoutEffect(() => {
    const isErrorResolving = false;

    if (isErrorResolving) {
      send('errorResolving');
      return;
    }

    next();
  }, [next, send]);

  return null;
};
