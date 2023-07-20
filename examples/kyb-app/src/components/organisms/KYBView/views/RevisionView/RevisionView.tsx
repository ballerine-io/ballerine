import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useSnapshot } from '@app/common/providers/SnapshotProvider/hooks/useSnapshot';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { useQueryValues } from '@app/components/organisms/KYBView/hooks/useQueryParams';
import { kybViewSchema } from '@app/components/organisms/KYBView/kyb-view.schema';
import { KYBQueryParams } from '@app/components/organisms/KYBView/types';
import { buildRunPayload } from '@app/components/organisms/KYBView/views/RevisionView/helpers/buildRunPayload';
import { createFormAssets } from '@app/components/organisms/KYBView/views/RevisionView/helpers/createFormAssets';
import { useWorkflowQuery } from '@app/components/organisms/KYBView/views/RevisionView/hooks/useWorkflowQuery';
import { runWorkflowRequest } from '@app/domains/workflows';
import { AnyObject } from '@ballerine/ui';
import { useCallback, useLayoutEffect, useMemo } from 'react';

export const RevisionView = () => {
  const { clear } = useSnapshot();
  const { context, state, update } = useViewState<typeof kybViewSchema>();
  const { workflowRuntimeId } = useQueryValues<KYBQueryParams>();
  const { isFailedToLoad, isLoading, error, workflow } = useWorkflowQuery(workflowRuntimeId);

  const formAssets = useMemo(() => (workflow ? createFormAssets(workflow) : null), [workflow]);

  const handleSubmit = useCallback(
    async (values: AnyObject) => {
      const runPayload = await buildRunPayload(workflow, values);

      await runWorkflowRequest(runPayload);
    },
    [workflow],
  );

  useLayoutEffect(() => {
    if (!workflowRuntimeId) {
      void clear();
      location.href = '/';
    }
  }, [workflowRuntimeId, clear]);

  return (
    <AppShell.FormContainer>
      {isLoading ? (
        <h2 className="text-muted-foreground text-sm">Loading workflow information...</h2>
      ) : null}
      {isFailedToLoad ? (
        <>
          <h1 className="font-inter scroll-m-20 pb-2 text-3xl font-bold tracking-tight transition-colors first:mt-0">
            Failed to load workflow.
          </h1>
          <h2 className="text-muted-foreground text-sm">{error?.message}</h2>
        </>
      ) : null}
      {formAssets ? (
        <DynamicForm
          className="max-w-[384px]"
          formData={context[state] as object}
          schema={formAssets.schema}
          uiSchema={formAssets.uiSchema}
          onChange={update}
          onSubmit={void handleSubmit}
        />
      ) : null}
    </AppShell.FormContainer>
  );
};
