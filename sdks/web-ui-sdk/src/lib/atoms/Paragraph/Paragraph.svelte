<script lang="ts">
  import {
    configuration as globalConfiguration,
    IElementProps,
  } from '../../contexts/configuration';
  import { ICSSProperties } from '../../services/css-manager';
  import { getComponentStyles } from '../../ui-packs';

  export let configuration: IElementProps;
  export let active = false;

  const styleProps = configuration.style as ICSSProperties;

  const style = getComponentStyles($globalConfiguration.components?.paragraph || {}, styleProps);
</script>

<p {style} class:active>
  <slot />
</p>

<style>
  p {
    transition: all 0.1s ease-in;
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    margin: var(--margin);
    text-align: var(--text-align);
    color: var(--color);
    z-index: 2;
    align-self: var(--align-self);
  }
  p.active {
    color: var(--active-color);
  }
</style>
