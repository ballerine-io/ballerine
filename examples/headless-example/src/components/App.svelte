<script lang="ts">
  import type {WorkflowOptionsBrowser} from '@ballerine/workflow-browser-sdk';
  import {
    createMutation,
    createQuery,
    type CreateQueryOptions,
    useQueryClient
  } from '@tanstack/svelte-query';
  import {fetchJson, makeWorkflow} from '@/utils';
  import SignUp from './SignUp.svelte';
  import Workflow from './Workflow.svelte';
  import {NO_AUTH_USER_KEY} from "@/constants";
  import {writable} from "svelte/store";

  let noAuthUserId = sessionStorage.getItem(NO_AUTH_USER_KEY);

  const fetchEndUser = async (id: string) =>
    fetchJson(`http://localhost:3000/api/external/end-users/${id}`);
  const fetchWorkflow = async (id: string) =>
    fetchJson(`http://localhost:3000/api/external/workflows/${id}`);
  const fetchWorkflows = async () =>
    fetchJson<
      Array<{
        workflowDefinition: {
          id: string;
          name: string;
        };
        workflowRuntimeData: {
          id: string;
          status: string;
        };
      }>
    >(`http://localhost:3000/api/external/workflows`);
  const fetchIntent = async () =>
    fetchJson<Array<Record<string, unknown>>>(
      `http://localhost:3000/api/external/workflows/intent`,
      {
        method: 'POST',
        body: {intentName: 'kyc'},
      },
    );
  const fetchSignUp = async ({
                               firstName,
                               lastName,
                             }: {
    firstName: string;
    lastName: string;
  }) => fetchJson(`http://localhost:3000/api/external/end-users`, {
    method: 'POST',
    body: {
      firstName,
      lastName,
    },
  });

  const createEndUserQuery = (id: string) => createQuery({
    queryKey: [{id}],
    queryFn: async () => fetchEndUser(id),
    onSuccess(data) {
      const cached = sessionStorage.getItem(NO_AUTH_USER_KEY);

      if (cached && cached === data?.id || !data?.id) return;

      noAuthUserId = data?.id;
      sessionStorage.setItem(NO_AUTH_USER_KEY, noAuthUserId);
    },
    onError(error) {
      if (error.message !== 'Not Found (404)') {
        throw error;
      }

      sessionStorage.removeItem(NO_AUTH_USER_KEY);
      noAuthUserId = undefined;
    },
    enabled: typeof id === 'string' && id.length > 0,
  })
  const createWorkflowsQuery = (options: CreateQueryOptions<Awaited<ReturnType<typeof fetchWorkflows>>> = {}) => createQuery({
    queryKey: [{}],
    queryFn: fetchWorkflows,
    ...options
  })
  const createIntentQuery = () => createQuery({
    queryKey: [{}],
    queryFn: async () => {
      const data = await fetchIntent();

      if (!data?.[0]) return;

      return makeWorkflow(data?.[0]);
    },
    enabled: false
  })
  const createFirstWorkflowQuery = () => createWorkflowsQuery({
    select: (workflows) =>
      Array.isArray(workflows) ? workflows?.find(
        workflow =>
          workflow?.workflowDefinition?.name === "onboarding_client_collect_data" &&
          workflow?.workflowRuntimeData?.status !== 'completed',
      ) : undefined
  })
  const createWorkflowQuery = (id: string) => createQuery({
    queryKey: [{id}],
    queryFn: async () => {
      const data = await fetchWorkflow(id);

      if (!data) return;

      return makeWorkflow(data);
    },
  });
  const queryClient = useQueryClient();
  const createSignUpMutation = () => createMutation({
    mutationFn: fetchSignUp,
    onSuccess: async (data) => {
      sessionStorage.setItem(NO_AUTH_USER_KEY, data?.id);
      noAuthUserId = data?.id;
      await queryClient.invalidateQueries();
    }
  })
  $: endUserQuery = createEndUserQuery(noAuthUserId);
  const firstWorkflowQuery = createFirstWorkflowQuery();
  $: workflowQuery = createWorkflowQuery($firstWorkflowQuery.data?.workflowRuntimeData?.id);
  const intentQuery = createIntentQuery();

  const signUpMutation = createSignUpMutation();
  const onSubmit = async ({
                            fname: firstName,
                            lname: lastName,
                          }: {
    fname: string;
    lname: string;
  }) =>
    $signUpMutation.mutate({
      firstName,
      lastName,
    });

  const workflow = writable<WorkflowOptionsBrowser | undefined>();

  $: {
    if ($endUserQuery.data?.id && ($workflowQuery.data?.id || $intentQuery.data?.id)) {
      workflow.set($workflowQuery.data || $intentQuery.data)
    } else {
      workflow.set(undefined)
    }
  }

</script>

{#if $endUserQuery.data?.id}
  <div>
    <div>
      <h4>{$endUserQuery?.data?.firstName ?? ''} {$endUserQuery?.data?.lastName ?? ''}</h4>
      <img alt="avatar" src={$endUserQuery?.data?.avatarUrl ?? ''}/>
    </div>
    <ul>
      <li>
        State: {$endUserQuery?.data?.id ? $endUserQuery.data?.state ?? 'NEW' : ''}</li>
    </ul>
  </div>
{/if}

{#if !$endUserQuery.data?.id}
  <SignUp {onSubmit}/>
{/if}
{#if $workflow}
  <Workflow workflow={$workflow}/>
{/if}
{#if !$workflow}
  <button disabled={!$endUserQuery.data?.id} on:click={$intentQuery.refetch}>KYC
  </button>
{/if}
