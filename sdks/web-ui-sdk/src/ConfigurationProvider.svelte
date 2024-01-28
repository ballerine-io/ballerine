<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import App from './App.svelte';
  import { BALLERINE_EVENT } from './lib/utils/event-service';
  import { IOuterEvent } from './lib/utils/event-service/types';
  import { isMobile } from './lib/utils/is-mobile';

  let loading = true;
  let modalOpened = true;
  let mounted = true;

  onMount(async () => {
    loading = false;

    const loader = document.getElementById('blrn-loader') as HTMLDivElement;
    loader.style.display = 'none';
  });

  export let flowName: string;
  setContext('flowName', flowName);

  export let useModal = false;

  window.addEventListener(
    'message',
    e => {
      const event = e.data as IOuterEvent;
      if (event.eventName !== BALLERINE_EVENT) return;
      if (event.shouldExit) {
        modalOpened = false;
        mounted = false;
      }
    },
    false,
  );
</script>

{#if !isMobile() && useModal}
  {#if !loading && modalOpened}
    <div class="background">
      <div class="content">
        <App {flowName} />
      </div>
    </div>
  {/if}
{:else if !loading}
  {#if mounted}
    <App {flowName} />
  {/if}
{/if}

<style>
  .background {
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content {
    width: 415px;
    height: 660px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
    border-radius: 35px;
    overflow: hidden;
  }
</style>
