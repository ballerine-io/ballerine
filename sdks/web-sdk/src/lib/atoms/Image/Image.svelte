<script lang="ts">
  import {
    configuration as globalConfiguration,
    ICSSProperties,
    IElementProps,
    IAttributes,
  } from '../../contexts/configuration';
  import { getComponentStyles, uiPack } from '../../ui-packs';

  export let configuration: IElementProps;
  const styleProps = configuration.style as ICSSProperties;
  const attributes = configuration.attributes as IAttributes;
  const style = getComponentStyles($uiPack.image, $globalConfiguration.image, styleProps);
</script>

<div {style} height={attributes.height} width={attributes.width} class="container">
  {@html attributes.src}
</div>

<style>
  .container {
    margin: var(--margin);
    flex-grow: var(--flex-grow, 0);
    text-align: center;
  }
  .container > :global(svg) {
    max-width: 100%;
  }
</style>
