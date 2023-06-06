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
  import { ENTITY_ID_STORAGE_KEY } from '@/constants';
  import { writable } from 'svelte/store';
  import Approved from '@/components/Approved.svelte';
  import Rejected from '@/components/Rejected.svelte';
  import Resubmission from '@/components/Resubmission.svelte';
  import ThankYou from '@/components/ThankYou.svelte';
  import Intent from '@/components/Intent.svelte';
  import { BallerineBackOfficeService } from '@/services/ballerine-backoffice.service';
  import DevSidebar from '@/visualiser/dev-sidebar.svelte';

  let entityId = sessionStorage.getItem(ENTITY_ID_STORAGE_KEY);
  let nextWorkflow;
  let shouldResubmit = false;
  let documentsDecisionStatuses;
  let isDecided;
  let isApproved;
  let isRejected;
  let isRevision;

  const {
    fetchEndUser,
    fetchBusiness,
    fetchIntent,
    fetchBusinessSignUp,
    fetchEnduserSignUp,
    fetchWorkflow,
    fetchWorkflows,
  } = new BallerineBackOfficeService();

  const createEntityQuery = (id: string) =>
    createQuery({
      queryKey: ['entity', { id }],
      queryFn: async () =>
        import.meta.env.VITE_EXAMPLE_TYPE === 'kyc' ? fetchEndUser(id) : fetchBusiness(id),
      onSuccess(data) {
        const cached = sessionStorage.getItem(ENTITY_ID_STORAGE_KEY);

        if ((cached && cached === data?.id) || !data?.id) return;

        entityId = data?.id;
        sessionStorage.setItem(ENTITY_ID_STORAGE_KEY, entityId);
      },
      onError(error) {
        if (error.message !== 'Not Found (404)') {
          throw error;
        }

        sessionStorage.removeItem(ENTITY_ID_STORAGE_KEY);
        entityId = undefined;
      },
      enabled: typeof id === 'string' && id.length > 0,
    });
  const entity = import.meta.env.VITE_EXAMPLE_TYPE === 'kyc' ? 'endUser' : ('business' as const);
  const createWorkflowsQuery = (
    options: CreateQueryOptions<Awaited<ReturnType<typeof fetchWorkflows>>> = {},
  ) =>
    createQuery({
      queryKey: ['workflows', { entity, entityId }],
      queryFn: () =>
        fetchWorkflows({
          entity,
          entityId,
        }),
      enabled: typeof entityId === 'string' && entityId.length > 0,
      ...options,
    });
  const createIntentQuery = () =>
    createQuery({
      queryKey: ['intent'],
      queryFn: async () => {
        const data = await fetchIntent();

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
              workflow => workflow?.workflowDefinition?.name === import.meta.env.VITE_EXAMPLE_TYPE,
            )
          : undefined;
      },
    });
  const createWorkflowQuery = (id: string) =>
    createQuery({
      queryKey: ['workflows', { id, entity, entityId }],
      queryFn: async () => {
        const data = await fetchWorkflow(id);

        if (!data) return;

        return data;
      },
      refetchInterval(data) {
        if (
          isRejected ||
          isApproved ||
          (entityState === 'NEW' && data?.workflowRuntimeData?.status === 'created') ||
          (isProcessing && data?.workflowRuntimeData?.status !== 'completed')
        ) {
          return false;
        }

        return parseInt(import.meta.env.VITE_POLLING_INTERVAL) * 1000 || false;
      },
      enabled: typeof id === 'string' && id.length > 0,
    });
  const queryClient = useQueryClient();
  const createSignUpMutation = () =>
    createMutation({
      mutationFn:
        import.meta.env.VITE_EXAMPLE_TYPE === 'kyc' ? fetchEnduserSignUp : fetchBusinessSignUp,
      onSuccess: data => {
        sessionStorage.setItem(ENTITY_ID_STORAGE_KEY, data?.id);
        entityId = data?.id;
        queryClient.invalidateQueries();
      },
    });
  $: entityQuery = createEntityQuery(entityId);
  const firstWorkflowQuery = createFirstWorkflowQuery();
  $: workflowQuery = createWorkflowQuery($firstWorkflowQuery?.data?.workflowRuntimeData?.id);
  const intentQuery = createIntentQuery();

  const signUpMutation = createSignUpMutation();
  const onSubmitEnduser = async ({
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

  const onSubmitBusiness = async ({
    bname: companyName,
    rnum: registrationNumber,
  }: {
    bname: string;
    rnum: string;
  }) =>
    $signUpMutation.mutate({
      companyName,
      registrationNumber,
    });

  const onSubmit = import.meta.env.VITE_EXAMPLE_TYPE === 'kyc' ? onSubmitEnduser : onSubmitBusiness;
  const clearUser = () => {
    sessionStorage.removeItem(ENTITY_ID_STORAGE_KEY);
    entityId = undefined;
    queryClient.invalidateQueries();
  };
  const workflow = writable<WorkflowOptionsBrowser | undefined>();
  const debugWf = writable<{ definition: unknown }>();

  workflow.subscribe(w => {
    debugWf.set(w as any);
  });

  const workflowComponentStateUpdated = ({ detail }: { detail: any }) => {
    const debugState = {
      ...$workflow,
      definition: {
        ...$workflow?.definition,
        context: detail.context,
        initial: detail.value,
      },
    };
    debugWf.set(debugState);
  };

  const mergeWorkflow = () => makeWorkflow($workflowQuery?.data || $intentQuery?.data);
  const handleResubmit = () => {
    workflow.set(mergeWorkflow());
  };

  $: isCompleted = $workflowQuery.data?.workflowRuntimeData?.status === 'completed';
  $: entityState = $entityQuery.data?.approvalState;
  $: isProcessing = entityState === 'PROCESSING';

  $: {
    if (
      $entityQuery.data?.id &&
      ($workflowQuery?.data?.workflowDefinition || $intentQuery?.data?.workflowDefinition)
    ) {
      nextWorkflow = mergeWorkflow();
      if (
        nextWorkflow?.definition?.initial !== $workflow?.definition?.initial &&
        nextWorkflow?.definition?.context?.documents?.some(
          ({ decision }) => decision?.status === 'revision',
        )
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

  $: {
    documentsDecisionStatuses = nextWorkflow
      ? nextWorkflow?.workflowContext?.machineContext?.documents?.map(
          ({ decision }) => decision?.status,
        )
      : $workflow?.workflowContext?.machineContext?.documents?.map(
          ({ decision }) => decision?.status,
        );

    const hasDecisions = !!documentsDecisionStatuses?.length;

    // In JavaScript `some` and `every` return true with empty arrays.
    isApproved = hasDecisions && documentsDecisionStatuses?.every(status => status === 'approved');
    isRejected = hasDecisions && documentsDecisionStatuses?.some(status => status === 'rejected');
    isRevision = hasDecisions && documentsDecisionStatuses?.some(status => status === 'revision');
    isDecided = isApproved || isRejected || isRevision;
  }
</script>

<div class="flex h-full flex-row items-center justify-center">
  <main class="flex h-full w-full flex-col items-center justify-center p-6">
    {#if !$entityQuery.data?.id}
      <SignUp {onSubmit} />
    {/if}
    {#if $workflow && !isCompleted && !shouldResubmit}
      <Workflow workflow={$workflow} on:workflow-updated={workflowComponentStateUpdated} />
    {/if}

    {#if $entityQuery.data?.id && !$workflow && !isProcessing}
      <Intent disabled={!$entityQuery.data?.id} refetch={$intentQuery.refetch} />
    {/if}

    {#if $entityQuery.data?.id && isCompleted && !isDecided}
      <ThankYou />
    {/if}

    {#if isRevision}
      <Resubmission
        {handleResubmit}
        reason={nextWorkflow?.definition?.context?.documents
          ?.find(({ decision }) => decision?.status === 'revision')
          ?.decision?.revisionReason?.toLowerCase()}
      />
    {/if}

    {#if isRejected}
      <Rejected />
    {/if}

    {#if isApproved}
      <Approved />
    {/if}
  </main>
  {#if $debugWf}
    <DevSidebar workflowDefinition={$debugWf?.definition} />
  {/if}
  <div class={'fixed left-2 top-2'}>
    <button on:click={clearUser}> Clear User </button>
  </div>
</div>
