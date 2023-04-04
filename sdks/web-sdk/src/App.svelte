<script lang="ts">
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { initConnectionCheck } from './lib/utils/check-connection';
  import { configuration } from './lib/contexts/configuration';
  import { currentLanguage, Languages } from './lib/contexts/translation';
  import { subscribe } from './lib/utils/event-service';
  import Routes from './Routes.svelte';
  import { t } from './lib/contexts/translation/hooks';
  import { setFlowName } from './lib/contexts/flows';
  import { uiPack } from './lib/ui-packs';
  import MetricsPixel from './lib/atoms/MetricsPixel/MetricsPixel.svelte';

  subscribe();
  initConnectionCheck(t);

  const urlParams = new URLSearchParams(window.location.search);

  // const flowName = urlParams.get("b_fid");
  export let flowName;
  setFlowName($configuration.flows, flowName);

  $currentLanguage =
    ($configuration.endUserInfo.language as Languages) || $configuration.defaultLanguage;

  const style = `
    --general-fonts-name: ${$configuration.general?.fonts?.name || $uiPack.general.fonts.name};
    --general-colors-primary: ${
      $configuration.general?.colors?.primary || $uiPack.general.colors.primary
    };
    --general-colors-secondary: ${
      $configuration.general?.colors?.secondary || $uiPack.general.colors.secondary
    };
  `;
</script>

<svelte:head>
  {#if $configuration.general?.fonts?.link || $uiPack.general.fonts.link}
    <link
      href={$configuration.general?.fonts?.link || $uiPack.general.fonts.link}
      rel="stylesheet"
    />
  {/if}
</svelte:head>

<main {style} id="blrn-app">
  <!-- <button on:click={handle}>Change</button> -->
  <Routes />
  <SvelteToast
    options={{
      theme: {
        '--toastBackground':
          $configuration.general?.colors?.primary || $uiPack.general.colors.primary,
        '--toastBarBackground':
          $configuration.general?.colors?.primary || $uiPack.general.colors.primary,
      },
    }}
  />
  <MetricsPixel />
</main>

<style>
  main {
    max-width: 500px;
    width: 100%;
    margin: 0 auto;
    height: 100%;
    overflow: hidden;
  }

  :global(html, body, #app) {
    height: 100%;
  }

  :global(html, body, p, div, input) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0px;
  }

  :global(p, div, body, button) {
    font-family: var(--general-fonts-name);
  }
</style>
