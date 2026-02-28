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
  export let overlayType: string = '';
  
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
    <div class="photo-wrapper {overlayType}">
      <img {src} alt="result" {style} />
    </div>
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
    width: 100%;
  }

  .photo-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    animation: slide-in-bottom 0.8s linear both;
  }

  /* Match the visual crops from Overlay.svelte */
  .photo-wrapper.card {
    aspect-ratio: 4/3;
    width: 90%;
    overflow: hidden;
    border-radius: 12px;
  }
  .photo-wrapper.passport {
    aspect-ratio: 3/4;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    border-radius: 12px;
  }
  .photo-wrapper.a4 {
    aspect-ratio: 3/4;
    max-width: 80%;
    overflow: hidden;
    border-radius: 12px;
  }
  .photo-wrapper.selfie {
    aspect-ratio: 3/4;
    width: 80%;
    max-height: 80vh;
    border-radius: 100%;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: inherit;
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
