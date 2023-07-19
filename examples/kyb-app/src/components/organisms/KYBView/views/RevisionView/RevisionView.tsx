import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { FileStorageProvider, useFileStorage } from '@app/common/providers/FileStorageProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { useQueryValues } from '@app/components/organisms/KYBView/hooks/useQueryParams';
import { KYBQueryParams } from '@app/components/organisms/KYBView/types';
import { buildRunPayload } from '@app/components/organisms/KYBView/views/RevisionView/helpers/buildRunPayload';
import { createFormAssets } from '@app/components/organisms/KYBView/views/RevisionView/helpers/createFormAssets';
import { useWorkflowQuery } from '@app/components/organisms/KYBView/views/RevisionView/hooks/useWorkflowQuery';
import { runWorkflowRequest } from '@app/domains/workflows';
import { AnyObject } from '@ballerine/ui';
import { useCallback, useMemo } from 'react';

export const RevisionView = () => {
  const { storage } = useFileStorage();
  const { workflowRuntimeId } = useQueryValues<KYBQueryParams>();
  const { isFailedToLoad, isLoading, error, workflow } = useWorkflowQuery(workflowRuntimeId);

  const formAssets = useMemo(() => (workflow ? createFormAssets(workflow) : null), [workflow]);

  const handleSubmit = useCallback(
    async (values: AnyObject) => {
      const runPayload = await buildRunPayload(workflow, values, storage);

      await runWorkflowRequest(runPayload);
    },
    [workflow, storage],
  );

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
        <FileStorageProvider storage={storage}>
          <DynamicForm
            className="max-w-[384px]"
            schema={formAssets.schema}
            uiSchema={formAssets.uiSchema}
            onSubmit={values => void handleSubmit(values)}
          />
        </FileStorageProvider>
      ) : null}
    </AppShell.FormContainer>
  );
};
