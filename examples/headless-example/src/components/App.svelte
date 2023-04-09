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
    queryKey: ['end-user', {id}],
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
    queryKey: ['workflows'],
    queryFn: fetchWorkflows,
    enabled: typeof noAuthUserId === 'string' && noAuthUserId.length > 0,
    ...options
  })
  const createIntentQuery = () => createQuery({
    queryKey: ['intent'],
    queryFn: async () => {
      const data = await fetchIntent();

      if (!data?.[0]) return;

      return data?.[0];
    },
    enabled: false
  })
  const createFirstWorkflowQuery = () => createWorkflowsQuery({
    select: (workflows) => {
      return Array.isArray(workflows) ? workflows?.find(
        workflow =>
          workflow?.workflowDefinition?.name === "onboarding_client_collect_data",
      ) : undefined
    }
  })
  const createWorkflowQuery = (id: string) => createQuery({
    queryKey: ['workflows', {id}],
    queryFn: async () => {
      const data = await fetchWorkflow(id);

      if (!data) return;

      return data;
    },
    refetchInterval(data) {
      if (isProcessing && data?.workflowRuntimeData?.status !== "completed") {
        return false;
      }

      return parseInt(import.meta.env.VITE_POOLING_TIME) * 1000 || false;
    },
    enabled: typeof id === 'string' && id.length > 0,
  });
  const queryClient = useQueryClient();
  const createSignUpMutation = () => createMutation({
    mutationFn: fetchSignUp,
    onSuccess: (data) => {
      sessionStorage.setItem(NO_AUTH_USER_KEY, data?.id);
      noAuthUserId = data?.id;
      queryClient.invalidateQueries();
    }
  })
  $: endUserQuery = createEndUserQuery(noAuthUserId);
  const firstWorkflowQuery = createFirstWorkflowQuery();
  $: workflowQuery = createWorkflowQuery($firstWorkflowQuery?.data?.workflowRuntimeData?.id);
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
  const mergeWorkflow = () => makeWorkflow($workflowQuery?.data || $intentQuery?.data);
  const handleResubmit = () => {
    workflow.set(mergeWorkflow());
  };

  let nextWorkflow;
  let shouldResubmit = false;
  $: isCompleted = $workflowQuery.data?.workflowRuntimeData?.status === 'completed';
  $: endUserId = $endUserQuery.data?.id;
  $: endUserState = $endUserQuery.data?.state;
  $: isProcessing = endUserState === 'PROCESSING';
  $: isValidWorkflow = endUserId && !isCompleted;

  $: {
    if (endUserId && ($workflowQuery?.data?.workflowDefinition || $intentQuery?.data?.workflowDefinition)) {
      nextWorkflow = mergeWorkflow();

      if (
        nextWorkflow?.definition?.initial !== $workflow?.definition?.initial &&
        nextWorkflow?.definition?.context?.documentOne?.resubmissionReason
      ) {
        shouldResubmit = true;
      } else {
        workflow.set(nextWorkflow);
      }
    } else {
      workflow.set(undefined)
    }
  }

  let message;

  $: {
    switch (endUserState) {
      case 'PROCESSING':
        message = '';
        break;
      case 'REJECTED':
        message = 'Your request was declined.';
        break;
      case 'APPROVED':
        message = 'Your request was approved :)';
        break;
      default:
        message = '';
    }
  }

</script>

<main class="h-full flex flex-col items-center justify-center p-4">

{#if !endUserId}
  <SignUp {onSubmit}/>
{/if}
{#if $workflow && !isCompleted}
  <Workflow workflow={$workflow}/>
{/if}
{#if endUserId && !$workflow && !isProcessing}
  <div class="w-full flex flex-col max-w-sm min-h-[30rem] bg-white p-4 rounded-md border border-slate-200 shadow">
    <h1 class="font-bold text-center w-full text-2xl">
      Welcome
    </h1>
    <button class="mt-auto" disabled={!endUserId} on:click={$intentQuery.refetch}>Start KYC
    </button>
  </div>
{/if}
{#if endUserId && isProcessing}
  <div class="w-full flex flex-col max-w-sm min-h-[30rem] bg-white p-4 rounded-md border border-slate-200 shadow">
    <h1 class="font-bold mb-2 text-2xl w-full text-center">Thank You</h1>
    <img src="/thank-you.svg" alt="clock" class="mx-auto mb-2"/>
    <p class="max-w-[50ch] p-1">
      Your onboarding request was sent to a manual review. Once a decision was made you’d be able to see it here.
    </p>
  </div>
{/if}

{#if isValidWorkflow && shouldResubmit}
  <div class="w-full flex flex-col max-w-sm min-h-[30rem] bg-white p-4 rounded-md border border-slate-200 shadow">
    <h1 class="font-bold text-center w-full text-2xl">
      Re-upload Document
    </h1>
  <p class="max-w-[50ch] p-1">
    Your document was rejected due to {nextWorkflow?.definition?.context?.documentOne?.resubmissionReason?.toLowerCase()?.replace(/_/g, ' ')}, please re-upload another image.
    You can upload <a download="/fake-document.jpg">this file</a>.
  </p>
    <img src="/re-upload-id.svg" alt="clock" class="mx-auto mb-2"/>
  <button class="mt-auto" on:click={handleResubmit}>Re-upload document file</button>
  </div>
{/if}

{#if endUserState === "REJECTED"}
  <div class="w-full flex flex-col max-w-sm min-h-[30rem] bg-white p-4 rounded-md border border-slate-200 shadow">
    <h1 class="font-bold text-center w-full text-2xl">
      Failed to verify
    </h1>
    <img src="/rejected.svg" alt="rejected" class="mx-auto mb-2"/>
    <p class="max-w-[50ch] p-1 text-center">
      Please contact support
    </p>
  </div>
{/if}

  {#if endUserState === "APPROVED"}
    <div class="w-full flex flex-col max-w-sm min-h-[30rem] bg-white p-4 rounded-md border border-slate-200 shadow">
      <h1 class="font-bold text-center w-full text-2xl">
        Success!
      </h1>
      <img src="/approved.svg" alt="approved" class="mx-auto mb-2"/>
      <p class="max-w-[50ch] p-1 text-center">
        Your information was verified successfully.
      </p>
    </div>
  {/if}

</main>
