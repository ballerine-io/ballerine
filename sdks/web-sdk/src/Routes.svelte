<script lang="ts">
  import { fly } from 'svelte/transition';
  import { steps } from './lib/contexts/navigation';
  import { configuration, IAppConfiguration } from './lib/contexts/configuration';
  import { sendNavigationUpdateEvent } from './lib/utils/event-service';
  import { visitedPage } from './lib/services/analytics';
  import { currentStepId, currentStepIdx, currentParams } from './lib/contexts/app-state';

  const configurationStepIds = Object.keys($configuration.steps);
  let stepId = configurationStepIds[0];
  let step = steps.find(s => s.name === $configuration.steps[stepId].name);

  $: {
    const configurationStepId = configurationStepIds.find((key: string) => key === $currentStepId);
    if (!configurationStepId) {
      step = steps.find(s => s.name === $currentStepId);
    } else {
      stepId = configurationStepId;
      step = steps.find(s => s.name === $configuration.steps[stepId].name);
      const newStepIndex = configurationStepIds.indexOf(stepId);
      if (newStepIndex !== $currentStepIdx) {
        $currentStepIdx = newStepIndex;
        sendNavigationUpdateEvent();
        visitedPage($currentStepId, $currentParams ? $currentParams.toString() : '');
      } else {
        // 404 error handling here
      }
    }
  }
</script>

{#if step}
  {#key step.component}
    <div
      class="container"
      in:fly={{ x: -50, duration: 250, delay: 300 }}
      out:fly={{ x: -50, duration: 250 }}
    >
      <svelte:component this={step.component} />
    </div>
  {/key}
{/if}

<style>
  .container {
    height: 100%;
  }
</style>
