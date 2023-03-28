<script lang="ts">
  import type { WorkflowOptionsBrowser } from '@ballerine/workflow-browser-sdk';
  import { createQuery } from '@tanstack/svelte-query';
  import { onMount } from 'svelte';
  import { fetchJson, handlePromise, makeWorkflow } from '../utils';
  import SignUp from './SignUp.svelte';
  import Workflow from './Workflow.svelte';

  let endUser: { id: string };

  let workflow: WorkflowOptionsBrowser;
  let renderIntentButton = false;

  const fetchWorkflows = async () =>
    fetchJson<
      Array<{
        id: string;
        workflowDefinitionId: string;
        status: 'completed' | 'created';
      }>
    >(`http://localhost:3000/api/external/workflows`);
  const fetchWorkflow = async (id: string) =>
    fetchJson(`http://localhost:3000/api/external/workflows/${id}`);
  const handleWorkflow = async () => {
    const [workflows] = await handlePromise(fetchWorkflows());

    const firstWorkflow = workflows?.find(
      workflow =>
        workflow?.workflowDefinitionId?.startsWith('COLLECT_DOCS') &&
        workflow?.status !== 'completed',
    );

    if (!firstWorkflow) {
      renderIntentButton = true;

      return;
    }

    const [data, error] = await handlePromise(fetchWorkflow(firstWorkflow?.id));

    if (error) throw error;
    if (!data) return;

    workflow = makeWorkflow(data);
    renderIntentButton = false;
  };
  const handleIntent = async () => {
    const data = await fetchJson<Array<Record<string, unknown>>>(
      `http://localhost:3000/api/external/workflows/intent`,
      {
        method: 'POST',
        body: { intentName: 'kyc' },
      },
    );

    workflow = makeWorkflow(data?.[0]);
    renderIntentButton = false;
  };
  const onSubmit = async ({
    fname: firstName,
    lname: lastName,
  }: {
    fname: string;
    lname: string;
  }) => {
    const res = await fetchJson(`http://localhost:3000/api/external/end-users`, {
      method: 'POST',
      body: {
        firstName,
        lastName,
      },
    });
    endUser = res;

    sessionStorage.setItem('no_auth_user_id', endUser?.id);
  };

  const useWorkflowQuery = createQuery({
    queryKey: ['workflow', { endUserId: endUser?.id, workflowId: workflow?.id }],
    queryFn: async () => {
      const [workflows] = await handlePromise(fetchWorkflows());

      const firstWorkflow = workflows?.find(
        workflow =>
          workflow?.workflowDefinitionId?.startsWith('COLLECT_DOCS') &&
          workflow?.status !== 'completed',
      );

      if (!firstWorkflow) {
        renderIntentButton = true;

        return;
      }

      const [data, error] = await handlePromise(fetchWorkflow(firstWorkflow?.id));

      if (error) throw error;
      if (!data) return;

      return makeWorkflow(data);
    },
  });

  onMount(async () => {
    await handleWorkflow();
  });
</script>

<div>
  <div>
    <h4>{endUser?.firstName ?? ''} {endUser?.lastName ?? ''}</h4>
    <img alt="avatar" src={endUser?.avatarUrl ?? ''} />
  </div>
  <ul>
    <li>State: {endUser?.id ? workflow?.workflowContext?.machineContext?.state ?? 'NEW' : ''}</li>
  </ul>
</div>

{#if workflow}
  <Workflow {workflow} />
{/if}
{#if renderIntentButton}
  <SignUp {onSubmit} />
  <button disabled={!endUser?.id} on:click={handleIntent}>KYC</button>
{/if}
