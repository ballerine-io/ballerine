<script lang="ts">
  import merge from 'lodash.merge';
  import {
    configuration as globalConfiguration,
    ICSSProperties,
    IElementProps,
    IAttributes,
  } from '../../contexts/configuration';
  import { image } from '../../defaultConfiguration/theme';
  import { makeStylesFromConfiguration } from '../../utils/cssUtils';

  export let configuration: IElementProps;
  const styleProps = configuration.style as ICSSProperties;
  const attributes = configuration.attributes as IAttributes;
  const style = makeStylesFromConfiguration(merge(image, $globalConfiguration.image), styleProps);
</script>

<div {style}>
  <img
    src={attributes.src}
    width={attributes.width}
    alt={attributes.alt}
    height={attributes.height}
  />
</div>

<style>
  div {
    margin: var(--margin);
    max-width: 100%;
    flex-grow: var(--flex-grow, 0);
    text-align: center;
  }
</style>
