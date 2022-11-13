<script lang="ts">
  import merge from 'deepmerge';
  import {
    configuration as globalConfiguration,
    IAttributes,
    ICSSProperties,
    IElementProps,
  } from '../../contexts/configuration';
  import { iconButton } from '../../default-configuration/theme';
  import { makeStylesFromConfiguration } from '../../utils/css-utils';

  export let configuration: IElementProps;
  const styleProps = configuration.style as ICSSProperties;
  const attributes = configuration.attributes as IAttributes;

  const style = makeStylesFromConfiguration(
    merge(iconButton, $globalConfiguration.iconButton || {}),
    styleProps,
  );
</script>

<button {style} on:click width={attributes.width} height={attributes.height}>
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
