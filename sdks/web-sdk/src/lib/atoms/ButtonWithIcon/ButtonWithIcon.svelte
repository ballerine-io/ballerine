<script lang="ts">
  import merge from 'lodash.merge';
  import {
    configuration as globalConfiguration,
    IAttributes,
    ICSSProperties,
    IElementProps,
  } from '../../contexts/configuration';
  import { buttonWithIcon } from '../../default-configuration/theme';
  import { makeStylesFromConfiguration } from '../../utils/css-utils';

  export let configuration: IElementProps;
  const styleProps = configuration.style as ICSSProperties;
  const attributes = configuration.attributes as IAttributes;

  const style = makeStylesFromConfiguration(
    merge(buttonWithIcon, $globalConfiguration.buttonWithIcon),
    styleProps,
  );
</script>

<button {style} on:click>
  <slot />
  <img
    src={attributes.src}
    alt={attributes.alt}
    width={attributes.width}
    height={attributes.height}
  />
</button>

<style>
  button {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    border: none;
    outline: none;
    padding: var(--padding);
    font-size: var(--font-size);
    width: var(--width);
    background: var(--background);
    color: var(--color);
    border-radius: var(--border-radius);
  }
</style>
