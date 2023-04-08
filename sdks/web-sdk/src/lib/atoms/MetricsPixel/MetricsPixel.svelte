<script lang="ts">
  import { configuration } from '../../../lib/contexts/configuration';
  import { getFlowConfig } from '../../contexts/flows/hooks';

  // let baseURL = import.meta.env.VITE_METRICS_BASE_URL
  let baseURL = 'https://api-dev.ballerine.io';
  export let enabled = $configuration.metricsConfig.enabled;
  let flow = getFlowConfig($configuration);

  const meta = {
    flowName: flow.name,
    flowSteps: flow.stepsOrder,
  };

  let payload = window.btoa(JSON.stringify(meta));
  console.log('is metrics enabled', enabled);
  export let endpoint = `${baseURL}/v2/metrics/png?meta=${payload}`;
</script>

{#if enabled}
  <img alt="ballerine metrics" src={endpoint} />
{/if}

<style>
  img {
    height: 1px;
    width: 1px;
    border-style: none;
  }
</style>
