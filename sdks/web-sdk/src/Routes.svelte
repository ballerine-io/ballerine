<script lang="ts">
  import { fly } from 'svelte/transition';
  import { currentParams, currentStepId, currentStepIdx } from './lib/contexts/app-state';
  import { configuration, IStepConfiguration } from './lib/contexts/configuration';
  import { getFlowName } from './lib/contexts/flows';
  import { steps } from './lib/contexts/navigation';
  import { visitedPage } from './lib/services/analytics';
  import { sendNavigationUpdateEvent } from './lib/utils/event-service';
  import { initWorkflowContext } from './workflow-sdk/context';

  const getFlowSteps = () => {
    const flowName = getFlowName();
    const flow = $configuration.flows[flowName];
    return flow.steps as RecursivePartial<IStepConfiguration>[];
  };
  const flowSteps = getFlowSteps();
  const configurationStepIds = flowSteps.map(s => s.id) as string[];
  let stepId = configurationStepIds[0];
  const flowStep = flowSteps.find(s => s.id === stepId) as IStepConfiguration;

  let step = steps.find(s => s.name === flowStep.name);

  const routeInit = (currentStepId: string, currentStepIdx: number) => {
    const flowSteps = getFlowSteps();
    const configurationStepIds = flowSteps.map(s => s.id) as string[];
    const configurationStepId = configurationStepIds.find((id: string) => id === currentStepId);
    if (configurationStepId === stepId) return;
    if (!configurationStepId) {
      stepId = currentStepId;
      const flowStep = flowSteps.find(s => s.id === currentStepId) as IStepConfiguration;
      step = steps.find(s => s.name === flowStep.name);
    } else {
      stepId = configurationStepId;
      const flowStep = flowSteps.find(s => s.id === currentStepId) as IStepConfiguration;
      step = steps.find(s => s.name === flowStep.name);
      const newStepIndex = configurationStepIds.indexOf(stepId);
      if (newStepIndex !== currentStepIdx) {
        currentStepIdx = newStepIndex;
        sendNavigationUpdateEvent();
        visitedPage(currentStepId, $currentParams ? $currentParams.toString() : '');
      } else {
        // 404 error handling here
      }
    }
  };

  const flowName = getFlowName();
  const workflow = $configuration.workflowConfig?.flows?.[flowName];
  let snapshot;
  let currentStep: string = snapshot?.initial ?? workflow?.initial;
  let stateActionStatus: 'IDLE' | 'PENDING' | undefined;
  let error: string | undefined;

  if (workflow) {
    const workflowService = initWorkflowContext(workflow);
    snapshot = workflowService.getSnapshot();

    workflowService.subscribe('USER_NEXT_STEP', ({ state, payload }) => {
      currentStepId.set(state);
      currentStepIdx.set(flowSteps.findIndex(s => s.name === state));
      step = steps.find(s => s.name === state);
    });

    workflowService.subscribe('USER_PREV_STEP', ({ state, payload }) => {
      currentStepId.set(state);
      currentStepIdx.set(flowSteps.findIndex(s => s.name === state));
      step = steps.find(s => s.name === state);
    });

    workflowService.subscribe('ERROR', payload => {
      // error = (payload.error as Error).message;
    });

    workflowService.subscribe('HTTP_ERROR', payload => {
      error = payload.error.message;
    });

    workflowService.subscribe('STATE_ACTION_STATUS', ({ payload }) => {
      stateActionStatus = payload?.status;
      error = undefined;
    });
  }

  // $: {
  // routeInit($currentStepId, $currentStepIdx);
  // }
</script>

{#if step}
  {#key step.component}
    <div
      class="container"
      in:fly={{ x: -50, duration: 250, delay: 300 }}
      out:fly={{ x: -50, duration: 250 }}
    >
      <svelte:component this={step.component} {stepId} />
    </div>
  {/key}
{/if}

<style>
  .container {
    height: 100%;
  }
</style>
