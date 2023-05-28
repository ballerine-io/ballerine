<script lang="ts">
  import {
    configuration as globalConfiguration,
    IElementProps,
  } from '../../contexts/configuration';
  import { makeStylesFromConfiguration } from '../../services/css-manager';

  export let configuration: IElementProps;
  export let isBack = false;

  const background = !isBack
    ? $globalConfiguration.components?.button?.background ||
      $globalConfiguration.general?.colors?.primary
    : undefined;

  const styleProps = {
    ...configuration?.style,
    background,
  };

  const buttonConfiguration = isBack
    ? configuration?.style
    : $globalConfiguration.components?.button;

  const style = makeStylesFromConfiguration(buttonConfiguration, styleProps);
</script>

<button {style} on:click>
  <slot />
</button>

<style>
  button {
    cursor: pointer;
    border: var(--border);
    outline: none;
    padding: var(--padding);
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    width: var(--width);
    background: var(--background);
    color: var(--color);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    margin: var(--margin);
    z-index: 1;
  }
</style>
