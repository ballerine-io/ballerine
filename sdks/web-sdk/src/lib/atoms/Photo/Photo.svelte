<script lang="ts">
  import merge from 'deepmerge';
  import {
    configuration as globalConfiguration,
    IElementProps,
  } from '../../contexts/configuration';
  import { ICSSProperties, makeStylesFromConfiguration } from '../../services/css-manager';
  import Loader from '../Loader/Loader.svelte';

  export let configuration: IElementProps;
  export let src: string;
  const styleProps = configuration.style as ICSSProperties;

  const defaultStyle = {
    'border-radius': $globalConfiguration.general?.borderRadius,
  };

  const style = makeStylesFromConfiguration(
    merge(defaultStyle, $globalConfiguration.components?.photo || {}),
    styleProps,
  );
</script>

<div class="container">
  {#if src}
    <img {src} alt="result" {style} />
  {:else}
    <Loader size="small" fullPage={false} />
  {/if}
</div>

<style>
  div.container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
  img {
    border-radius: var(--border-radius);
    margin: var(--margin);
    max-width: 100%;
    max-height: 35vh;
    animation: slide-in-bottom 0.8s linear both;
  }
  @keyframes slide-in-bottom {
    0% {
      transform: translateY(20px);
      opacity: 0;
    }
    70% {
      transform: translateY(-5px);
      opacity: 1;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
