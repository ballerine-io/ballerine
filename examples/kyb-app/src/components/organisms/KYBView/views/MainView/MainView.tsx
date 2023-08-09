// import { useViewState } from '@app/common/providers/ViewStateProvider';
// import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';
// import { useLayoutEffect } from 'react';
// import { useQueryValues } from '@app/components/organisms/KYBView/hooks/useQueryParams';
// import { KYBQueryParams } from '@app/components/organisms/KYBView/types';

// Main idea behing this component to:
// - mount
// - detect if user is returning with errors to fix if schema provided
// - otherwise redirect user to initial personal information form

export const MainView = () => {
  // const { next, send } = useViewState<typeof kybViewSchema>();
  // const { workflowRuntimeId } = useQueryValues<KYBQueryParams>();

  // useLayoutEffect(() => {
  //   const isRevision = Boolean(workflowRuntimeId);

  //   if (isRevision) {
  //     send('revision');
  //     return;
  //   }

  //   next();
  // }, [workflowRuntimeId, next, send]);

  return null;
};
