<script lang="ts">
  import {
    configuration as globalConfiguration,
    IElementProps,
  } from '../../contexts/configuration';
  import { makeStylesFromConfiguration } from '../../utils/css-utils';
  import { primaryButton } from '../../default-configuration/theme';
  import merge from 'deepmerge';

  export let configuration: IElementProps;
  export let isBack = false;

  const background = !isBack
    ? $globalConfiguration.button?.background ||
      $globalConfiguration.general.colors.primary ||
      primaryButton.background
    : undefined;

  const styleProps = {
    ...configuration?.style,
    background,
  };

  const buttonConfiguration = isBack ? configuration?.style : $globalConfiguration.button;

  const style = makeStylesFromConfiguration(
    merge(primaryButton, buttonConfiguration || {}),
    styleProps,
  );
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
  }
</style>
