<script lang="ts">
  import Trigger from '@/visualiser/trigger.svelte';
  import StateMachine from './state-machine.svelte';
  function doNothing() {
    alert('do nothing');
  }
</script>

<div class="fixed right-4 bottom-4 text-xs">
  <Trigger on:click={doNothing} />
</div>

<div class="fixed inset-4">
  <StateMachine />
</div>
