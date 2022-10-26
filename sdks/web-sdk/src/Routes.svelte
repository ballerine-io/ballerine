<script lang="ts">
  import { fly } from 'svelte/transition';
  import { steps } from './lib/contexts/navigation';
  import { sendNavigationUpdateEvent } from './lib/utils/event-service';
  import { visitedPage } from './lib/services/analytics';
  import { currentStepRoute, currentStepIdx, currentParams } from './lib/contexts/app-state';
  let stepIndex: number;

  let currentStep = steps[0];

  $: {
    const step = steps.find(s => s.route === $currentStepRoute);
    currentStep = step || steps[0];
    if (step) {
      const newStepIndex = steps.indexOf(currentStep);
      if (newStepIndex !== stepIndex) {
        $currentStepIdx = newStepIndex;
        sendNavigationUpdateEvent();
        visitedPage($currentStepRoute, $currentParams ? $currentParams.toString() : '');
      } else {
        // 404 error handling here
      }
    }
  }
</script>

{#if currentStep}
  <div
    class="container"
    in:fly={{ x: -50, duration: 250, delay: 300 }}
    out:fly={{ x: -50, duration: 250 }}
  >
    <svelte:component this={currentStep.component} />
  </div>
{/if}

<style>
  .container {
    height: 100%;
  }
</style>
