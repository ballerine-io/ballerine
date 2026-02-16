<script lang="ts">
  import { fly } from 'svelte/transition';
  import { steps } from './lib/contexts/navigation';
  import { configuration, IStepConfiguration } from './lib/contexts/configuration';
  import { sendNavigationUpdateEvent } from './lib/utils/event-service';
  import { visitedPage } from './lib/services/analytics';
  import { currentStepId, currentStepIdx, currentParams } from './lib/contexts/app-state';
  import { getFlowName } from './lib/contexts/flows';

  const getFlowSteps = () => {
    const flowName = getFlowName();
    const flow = $configuration.flows?.[flowName];
    return (flow?.steps || []) as RecursivePartial<IStepConfiguration>[];
  };

  const flowSteps = getFlowSteps();
  const firstStep = flowSteps[0];
  let stepId = (firstStep?.id as string) || '';
  let step = firstStep?.name ? steps.find(s => s.name === firstStep.name) : undefined;

  const routeInit = (activeStepId: string, activeStepIdx: number) => {
    const flowSteps = getFlowSteps();
    if (!flowSteps.length) return;

    const configurationStepIds = flowSteps
      .map(s => s.id)
      .filter((id): id is string => typeof id === 'string');
    const firstFlowStep = flowSteps[0];
    const firstStepId = firstFlowStep?.id as string | undefined;

    const alignToFirstConfiguredStep = () => {
      if (!firstStepId || !firstFlowStep?.name) return;

      stepId = firstStepId;
      step = steps.find(s => s.name === firstFlowStep.name);

      if (activeStepId !== firstStepId) {
        $currentStepId = firstStepId;
        $currentStepIdx = 0;
        sendNavigationUpdateEvent();
        visitedPage(firstStepId, $currentParams ? $currentParams.toString() : '');
      } else if (activeStepIdx !== 0) {
        $currentStepIdx = 0;
      }
    };

    if (!configurationStepIds.includes(activeStepId)) {
      // The app state can still point to an old/default step (e.g. "welcome")
      // while the host supplied a flow that starts elsewhere (e.g. preselected doc flows).
      // In that case, snap to the first configured step instead of throwing.
      alignToFirstConfiguredStep();
      return;
    }

    if (activeStepId === stepId) return;

    const flowStep = flowSteps.find(s => s.id === activeStepId) as IStepConfiguration | undefined;
    if (!flowStep?.name) {
      alignToFirstConfiguredStep();
      return;
    }

    stepId = activeStepId;
    step = steps.find(s => s.name === flowStep.name);

    const newStepIndex = configurationStepIds.indexOf(stepId);

    if (newStepIndex !== activeStepIdx) {
      $currentStepIdx = newStepIndex;
      sendNavigationUpdateEvent();
      visitedPage(activeStepId, $currentParams ? $currentParams.toString() : '');
    }
  };

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
      <svelte:component this={step.component} {stepId} />
    </div>
  {/key}
{/if}

<style>
  .container {
    height: 100%;
  }
</style>
