<script lang="ts">
  import {
    configuration as globalConfiguration,
    ICSSProperties,
    IElementProps,
  } from '../../contexts/configuration';
  import { getComponentStyles, uiPack } from '../../ui-packs';

  export let configuration: IElementProps;
  export let active = false;

  const styleProps = configuration.style as ICSSProperties;

  const style = getComponentStyles($uiPack.paragraph, $globalConfiguration.paragraph || {}, styleProps);
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
