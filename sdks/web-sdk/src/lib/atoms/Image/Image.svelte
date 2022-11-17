<script lang="ts">
  import merge from 'deepmerge';
  import {
    configuration as globalConfiguration,
    ICSSProperties,
    IElementProps,
    IAttributes,
  } from '../../contexts/configuration';
  import { image } from '../../default-configuration/theme';
  import { makeStylesFromConfiguration } from '../../utils/css-utils';

  export let configuration: IElementProps;
  const styleProps = configuration.style as ICSSProperties;
  const attributes = configuration.attributes as IAttributes;
  const style = makeStylesFromConfiguration(
    merge(image, $globalConfiguration.image || {}),
    styleProps,
  );
</script>

<div {style} height={attributes.height} width={attributes.width}>
  {@html attributes.src}
</div>

<style>
  div {
    margin: var(--margin);
    max-width: 100%;
    flex-grow: var(--flex-grow, 0);
    text-align: center;
  }
</style>
