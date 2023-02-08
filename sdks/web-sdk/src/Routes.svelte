<script lang="ts">
  import {fly} from 'svelte/transition';
  import {goToNextStep, steps} from './lib/contexts/navigation';
  import {configuration, IStepConfiguration} from './lib/contexts/configuration';
  import {sendNavigationUpdateEvent} from './lib/utils/event-service';
  import {visitedPage} from './lib/services/analytics';
  import {currentParams, currentStepId, currentStepIdx} from './lib/contexts/app-state';
  import {getFlowName} from './lib/contexts/flows';
  import {initWorkflowContext} from "./workflow-sdk/context";

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

  if (workflow) {

    const workflowService = initWorkflowContext(workflow);

    workflowService.subscribe('ui-step', (event) => {

      goToNextStep(currentStepId, $configuration, $currentStepId);
    });

    workflowService.subscribe('collect-document', (data) => {

      // workflowService.setContext((prev) => ({
      //   ...prev,
      //   ...(data?.documents ? {documents: data?.documents} : {}),
      //   ...(data?.selfie ? {selfie: data?.selfie} : {}),
      // }));
      //
    });

  }

  $: {
    routeInit($currentStepId, $currentStepIdx);
  }
</script>

{#if step}
  {#key step.component}
    <div
      class="container"
      in:fly={{ x: -50, duration: 250, delay: 300 }}
      out:fly={{ x: -50, duration: 250 }}
    >
      <svelte:component this={step.component} {stepId}/>
    </div>
  {/key}
{/if}

<style>
  .container {
    height: 100%;
  }
</style>
