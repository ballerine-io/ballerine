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

<div class="relative flex h-full w-full flex-col items-center">
  <div class="flex h-[50px] items-center">
    <h1 class="text-xl">STATE MACHINE</h1>
    <!-- svelte-ignore a11y-missing-attribute -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <a
      class="
          absolute right-1 top-1 block
          cursor-pointer select-none
          rounded border border-transparent
          bg-transparent p-2
          text-center text-lg leading-none
          text-gray-600
          no-underline
          filter-none
          transition-colors
          hover:border-gray-100
          hover:bg-gray-100 hover:no-underline hover:filter-none"
      on:click={handleClick}>×</a
    >
  </div>

  <div class="flex h-full w-full flex-col overflow-hidden">
    <iframe
      style="width: calc(100% + clamp(36rem, 36rem + 0px, 70vw))"
      class="h-full w-full"
      data-xstate
      title="inspected machine"
    />
  </div>
</div>
