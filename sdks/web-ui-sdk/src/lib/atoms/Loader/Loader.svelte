<script lang="ts">
  import merge from 'deepmerge';
  import { configuration } from '../../contexts/configuration';
  import { ICSSProperties, makesLocalStyles } from '../../services/css-manager';

  export let size: 'small' | 'medium' = 'medium';
  export let fullPage = true;

  const loader = {
    background: $configuration.general?.colors?.primary as string,
  };

  const styleProps = merge(loader, $configuration.components?.loader || {}) as ICSSProperties;

  const style = makesLocalStyles(styleProps);
</script>

{#if fullPage}
  <div class="container">
    <div class="loader-wrapper">
      <div {style} class:small={size === 'small'} class:medium={size === 'medium'} class="loader" />
    </div>
  </div>
{:else}
  <div class="loader-wrapper">
    <div {style} class:small={size === 'small'} class:medium={size === 'medium'} class="loader" />
  </div>
{/if}

<style>
  .container {
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background: 'transparent';
  }

  .loader-wrapper {
    position: relative;
  }

  .loader {
    position: relative;
    top: 50%;
    margin: -28px auto 0;
    border-radius: 50%;
    animation: loader-rotate 1s linear infinite;
  }

  .small {
    width: 41px;
    height: 41px;
    border: 4px solid var(--background);
    border-right-color: transparent;
  }

  .medium {
    width: 56px;
    height: 56px;
    border: 8px solid var(--background);
    border-right-color: transparent;
  }

  .small::after {
    content: '';
    width: 4px;
    height: 4px;
    background: var(--background);
    border-radius: 50%;
    position: absolute;
    top: 1px;
    left: 27px;
  }

  .medium::after {
    content: '';
    width: 8px;
    height: 8px;
    background: var(--background);
    border-radius: 50%;
    position: absolute;
    top: -1px;
    left: 33px;
  }

  @keyframes loader-rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
