<script lang="ts">
  import {
    configuration as globalConfiguration,
    ICSSProperties,
    IElementProps,
  } from '../../contexts/configuration';
  import { makeStylesFromConfiguration } from '../../utils/css-utils';

  export let configuration: IElementProps;
  export let isDisabled = false;
  const styleProps = configuration.style as ICSSProperties;

  const style = makeStylesFromConfiguration($globalConfiguration.cameraButton, styleProps);
</script>

<button {style} on:click aria-label="take picture" disabled={isDisabled}>
  <span class="inner-container" />
</button>

<style>
  button {
    margin: var(--margin);
    width: 76px;
    height: 76px;
    border-radius: 50%;
    border: 5px solid #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    outline: none;
    cursor: pointer;
    z-index: 2;
  }

  .inner-container {
    width: 64px;
    height: 64px;
    min-width: 64px;
    background: #fff;
    border-radius: 50%;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
