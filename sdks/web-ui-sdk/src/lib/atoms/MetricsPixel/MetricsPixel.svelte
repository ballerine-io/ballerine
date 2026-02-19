<script lang="ts">
  import { configuration } from '../../../lib/contexts/configuration';
  import { getFlowConfig } from '../../contexts/flows/hooks';

  const baseURL = $configuration.metricsConfig?.baseUrl;
  export let enabled = Boolean($configuration.metricsConfig?.enabled && baseURL);
  let flow = getFlowConfig($configuration);

  const meta = {
    flowName: flow.name,
    flowSteps: flow.stepsOrder,
  };

  let payload = window.btoa(JSON.stringify(meta));
  export let endpoint = baseURL ? `${baseURL}/v2/metrics/png?meta=${payload}` : '';
</script>

{#if enabled}
  <img alt="mikashboks metrics" src={endpoint} />
{/if}

<style>
  img {
    height: 1px;
    width: 1px;
    border-style: none;
  }
</style>
