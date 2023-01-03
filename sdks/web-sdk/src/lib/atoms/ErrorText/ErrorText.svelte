<script lang="ts">
  import {
    configuration as globalConfiguration,
    IElementProps,
  } from '../../contexts/configuration';
  import { getComponentStyles, uiPack } from '../../ui-packs';
  import { ICSSProperties } from '../../services/css-manager';

  export let configuration: IElementProps;

  const styleProps = configuration.style as ICSSProperties;

  const style = getComponentStyles($uiPack.errorText, $globalConfiguration.errorText, styleProps);
</script>

<div {style}>
  <slot />
</div>

<style>
  div {
    background: var(--background);
    border: var(--border);
    color: var(--color);
    border-radius: var(--border-radius);
    padding: var(--padding);
    margin: var(--margin);
    font-size: var(--font-size);
    text-align: var(--text-align);
  }
</style>
