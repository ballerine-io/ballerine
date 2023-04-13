<script lang="ts">
  import { onMount } from 'svelte';
  import { StateMachineInspector } from '@/services/state-machine.inspector.service';
  import { createEventDispatcher } from 'svelte';

  export let workflowDefinition: unknown;

  let inspectorWrapper = new StateMachineInspector();
  let acceptsUpdates = false;

  onMount(() => {
    inspectorWrapper.viewMachine(workflowDefinition);
    acceptsUpdates = true;
  });
  $: {
    if (acceptsUpdates) {
      inspectorWrapper.viewMachine(workflowDefinition);
    }
  }

  const dispatch = createEventDispatcher();
  function handleClick() {
    dispatch('dismiss');
  }
</script>

<div class="w-full h-full flex flex-col items-center relative">
  <div class="h-[50px] flex items-center">
    <h1 class="text-xl">STATE MACHINE</h1>
    <!-- svelte-ignore a11y-missing-attribute -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <a
      class="
          absolute block cursor-pointer select-none
          top-1 right-1
          text-lg p-2 leading-none
          border border-transparent
          hover:border-gray-100 hover:bg-gray-100 transition-colors
          rounded
          bg-transparent
          text-gray-600
          hover:filter-none
          filter-none
          text-center no-underline hover:no-underline"
      on:click={handleClick}>×</a
    >
  </div>

  <div class="flex flex-col w-full h-full overflow-hidden">
    <iframe
      style="width: calc(100% + clamp(36rem, 36rem + 0px, 70vw))"
      class="w-full h-full"
      data-xstate
      title="inspected machine"
    />
  </div>
</div>
