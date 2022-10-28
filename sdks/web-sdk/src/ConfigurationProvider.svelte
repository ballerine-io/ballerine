<script lang="ts">
  import { onMount } from 'svelte';
  import App from './App.svelte';
  import { IOuterEvent } from './lib/utils/event-service/types';
  import { isMobile } from './lib/utils/is-mobile';

  let loading = true;

  onMount(async () => {
    loading = false;

    const loader = document.getElementById('blrn-loader') as HTMLDivElement;
    loader.style.display = 'none';
  });
  export let flowName: string;

  export let useModal = false;
  let modalOpened = true;

  window.addEventListener(
    'message',
    e => {
      const event = e.data as IOuterEvent;
      if (event.eventName !== 'blrn_event') return;
      if (event.shouldExit) {
        modalOpened = false;
      }
    },
    false,
  );
</script>

{#if useModal}
  {#if !loading && modalOpened}
    <div class="background">
      <div class="content {isMobile() ? 'mobile' : ''}">
        <App {flowName} />
      </div>
    </div>
  {/if}
{:else if !loading}
  <App {flowName} />
{/if}

<style>
  .background {
    z-index: 9999;
    position: fixed;
    top: 0px;
    left: 0px;
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
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.05);
    border-radius: 35px;
    overflow: hidden;
  }
  .content.mobile {
    width: 100%;
    height: 100%;
    box-shadow: none;
    border-radius: 0px;
    overflow: auto;
  }
</style>
