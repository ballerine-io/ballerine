<script lang="ts">
  import {
    configuration as globalConfiguration,
    IElementProps,
    IAttributes,
  } from '../../contexts/configuration';
  import { ICSSProperties } from '../../services/css-manager';
  import { getComponentStyles } from '../../ui-packs';

  export let configuration: IElementProps;
  const styleProps = configuration.style as ICSSProperties;
  const attributes = configuration.attributes as IAttributes;
  const style = getComponentStyles($globalConfiguration.components?.image || {}, styleProps);
</script>

<div {style} height={attributes.height} width={attributes.width} class="container">
  {@html attributes.src}
</div>

<style>
  .container {
    margin: var(--margin);
    position: var(--position);
    display: var(--display);
    align-items: var(--align-items);
    justify-content: var(--justify-content);
    top: var(--top);
    bottom: var(--bottom);
    right: var(--right);
    left: var(--left);
    flex-grow: var(--flex-grow, 0);
    text-align: center;
  }
  .container > :global(svg) {
    max-width: 100%;
    width: var(--width);
  }
</style>
