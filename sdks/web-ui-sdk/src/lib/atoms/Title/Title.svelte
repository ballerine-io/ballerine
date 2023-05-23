<script lang="ts">
  import {
    configuration as globalConfiguration,
    IElementProps,
  } from '../../contexts/configuration';
  import { ICSSProperties } from '../../services/css-manager';
  import { getComponentStyles } from '../../ui-packs';

  export let configuration: IElementProps;
  const styleProps = configuration.style as ICSSProperties;
  const style = getComponentStyles($globalConfiguration.components?.title || {}, styleProps);
</script>

<h1 {style}>
  <slot />
</h1>

<style>
  h1 {
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    margin: var(--margin);
    width: var(--width);
    padding: var(--padding);
    text-align: var(--text-align);
    color: var(--color);
    align-self: var(--align-self);
    z-index: 2;
  }
</style>
