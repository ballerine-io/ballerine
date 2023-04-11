<script lang="ts">
  import Trigger from './components/trigger.svelte';
  import StateMachine from './components/state-machine.svelte';

  export let workflowDefinition: unknown;
  export let workflowContext: unknown;

  let showStateMachine = false;

  const toggleStateMachineVisibility = () => (showStateMachine = !showStateMachine);
  console.warn(workflowDefinition);
</script>

<div class="fixed right-4 bottom-4 text-xs">
  <Trigger on:click={toggleStateMachineVisibility} />
</div>

{#if showStateMachine}
  <div class="fixed bg-white inset-4 rounded-lg drop-shadow-lg overflow-auto p-2">
    <StateMachine
      {workflowDefinition}
      {workflowContext}
      on:dismiss={toggleStateMachineVisibility}
    />
  </div>
{/if}
