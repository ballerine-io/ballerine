<script lang="ts">
  import type { WorkflowOptionsBrowser } from '@ballerine/workflow-browser-sdk';
  import {
    createMutation,
    createQuery,
    type CreateQueryOptions,
    useQueryClient,
  } from '@tanstack/svelte-query';
  import { makeWorkflow } from '@/utils';
  import SignUp from './SignUp.svelte';
  import Workflow from './Workflow.svelte';
  import { NO_AUTH_USER_KEY } from '@/constants';
  import { writable } from 'svelte/store';

  import Approved from '@/components/Approved.svelte';
  import Rejected from '@/components/Rejected.svelte';
  import Resubmission from '@/components/Resubmission.svelte';
  import ThankYou from '@/components/ThankYou.svelte';
  import Intent from '@/components/Intent.svelte';
  import Visualiser from '@/visualiser/visualiser.svelte';
  import { BallerineBackOfficeService } from '@/services/ballerine-backoffice.service';

  let noAuthUserId = sessionStorage.getItem(NO_AUTH_USER_KEY);

  const dataService = new BallerineBackOfficeService();

  const createEndUserQuery = (id: string) =>
    createQuery({
      queryKey: ['end-user', { id }],
      queryFn: async () => dataService.fetchEndUser(id),
      onSuccess(data) {
        const cached = sessionStorage.getItem(NO_AUTH_USER_KEY);

        if ((cached && cached === data?.id) || !data?.id) return;

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
    });
  const createWorkflowsQuery = (
    options: CreateQueryOptions<Awaited<ReturnType<typeof dataService.fetchWorkflows>>> = {},
  ) =>
    createQuery({
      queryKey: ['workflows'],
      queryFn: dataService.fetchWorkflows,
      enabled: typeof noAuthUserId === 'string' && noAuthUserId.length > 0,
      ...options,
    });
  const createIntentQuery = () =>
    createQuery({
      queryKey: ['intent'],
      queryFn: async () => {
        const data = await dataService.fetchIntent();

        if (!data?.[0]) return;

        return data?.[0];
      },
      enabled: false,
    });
  const createFirstWorkflowQuery = () =>
    createWorkflowsQuery({
      select: workflows => {
        return Array.isArray(workflows)
          ? workflows?.find(
              workflow => workflow?.workflowDefinition?.name === 'onboarding_client_collect_data',
            )
          : undefined;
      },
    });
  const createWorkflowQuery = (id: string) =>
    createQuery({
      queryKey: ['workflows', { id }],
      queryFn: async () => {
        const data = await dataService.fetchWorkflow(id);

        if (!data) return;

        return data;
      },
      refetchInterval(data) {
        if (
          endUserState === 'REJECTED' ||
          endUserState === 'APPROVED' ||
          (endUserState === 'NEW' && data?.workflowRuntimeData?.status === 'created') ||
          (isProcessing && data?.workflowRuntimeData?.status !== 'completed')
        ) {
          return false;
        }

        return parseInt(import.meta.env.VITE_POOLING_TIME) * 1000 || false;
      },
      enabled: typeof id === 'string' && id.length > 0,
    });
  const queryClient = useQueryClient();
  const createSignUpMutation = () =>
    createMutation({
      mutationFn: dataService.fetchSignUp,
      onSuccess: data => {
        sessionStorage.setItem(NO_AUTH_USER_KEY, data?.id);
        noAuthUserId = data?.id;
        queryClient.invalidateQueries();
      },
    });
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

  let nextWorkflow: any;
  let shouldResubmit = false;

  $: isCompleted = $workflowQuery.data?.workflowRuntimeData?.status === 'completed';
  $: endUserId = $endUserQuery.data?.id;
  $: endUserState = $endUserQuery.data?.state;
  $: isProcessing = endUserState === 'PROCESSING';
  $: isValidWorkflow = endUserId && !isCompleted;

  $: {
    if (
      endUserId &&
      ($workflowQuery?.data?.workflowDefinition || $intentQuery?.data?.workflowDefinition)
    ) {
      nextWorkflow = mergeWorkflow();

      if (
        nextWorkflow?.definition?.initial !== $workflow?.definition?.initial &&
        nextWorkflow?.definition?.context?.id?.resubmissionReason
      ) {
        shouldResubmit = true;
      } else {
        workflow.set(nextWorkflow);
        shouldResubmit = false;
      }
    } else {
      workflow.set(undefined);
      shouldResubmit = false;
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

<main class="h-full flex flex-col items-center justify-center p-6">
  {#if !endUserId}
    <SignUp {onSubmit} />
  {/if}

  {#if $workflow && !isCompleted && !shouldResubmit}
    <Workflow workflow={$workflow} />
  {/if}

  {#if endUserId && !$workflow && !isProcessing}
    <Intent disabled={!endUserId} refetch={$intentQuery.refetch} />
  {/if}

  {#if endUserId && isProcessing && isCompleted}
    <ThankYou />
  {/if}

  {#if isValidWorkflow && shouldResubmit}
    <Resubmission
      {handleResubmit}
      reason={nextWorkflow?.definition?.context?.id?.resubmissionReason
        ?.toLowerCase()
        ?.replace(/_/g, ' ')}
    />
  {/if}

  {#if endUserState === 'REJECTED'}
    <Rejected />
  {/if}

  {#if endUserState === 'APPROVED'}
    <Approved />
  {/if}
</main>
<aside>
  {#if nextWorkflow?.definition}
    <Visualiser
      workflowDefinition={nextWorkflow.definition}
      workflowContext={nextWorkflow.context}
    />
  {/if}
</aside>
