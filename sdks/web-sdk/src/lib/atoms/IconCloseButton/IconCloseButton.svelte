<script lang="ts">
  import {
    configuration as globalConfiguration,
    IAttributes,
    IElementProps,
  } from '../../contexts/configuration';
  import { getComponentStyles } from '../../ui-packs';
  import { ICSSProperties } from '../../services/css-manager';

  export let configuration: IElementProps;
  const styleProps = configuration.style as ICSSProperties;
  const attributes = configuration.attributes as IAttributes;

  const style = getComponentStyles(
    $globalConfiguration.components?.iconCloseButton || {},
    styleProps,
  );
</script>

<button {style} on:click>
  {@html attributes.src}
</button>

<style>
  button {
    cursor: pointer;
    border: none;
    outline: none;
    width: var(--width);
    min-width: var(--width);
    height: var(--height);
    background: var(--background);
    border-radius: var(--border-radius);
    position: var(--position);
    display: var(--display);
    align-items: var(--align-items);
    justify-content: var(--justify-content);
    top: var(--top);
    left: var(--left);
    right: var(--right);
    z-index: 3;
  }
</style>
