<script lang="ts">
  import Trigger from './components/trigger.svelte';
  import StateMachine from './components/state-machine.svelte';
  import { ctw } from '@/utils';

  export let workflowDefinition: unknown;

  let showStateMachine = false;

  const toggleStateMachineVisibility = () => (showStateMachine = !showStateMachine);
</script>

<div class="fixed right-4 bottom-4 text-xs">
  <Trigger on:click={toggleStateMachineVisibility} />
</div>

<aside
  class={ctw('flex h-full', showStateMachine ? 'lg:w-[200%]' : 'w-0')}
  style="transition: width 0.3s ease-in-out;"
>
  {#if showStateMachine}
    <div
      class="
    fixed w-full h-full bg-white inset-4 rounded-lg drop-shadow-lg overflow-auto p-2
    lg:static lg:drop-shadow-none
    "
    >
      <StateMachine {workflowDefinition} on:dismiss={toggleStateMachineVisibility} />
    </div>
  {/if}
</aside>
