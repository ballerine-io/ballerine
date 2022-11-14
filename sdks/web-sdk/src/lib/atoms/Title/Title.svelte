<script lang="ts">
  import merge from 'deepmerge';
  import {
    configuration as globalConfiguration,
    ICSSProperties,
    IElementProps,
  } from '../../contexts/configuration';
  import { title } from '../../default-configuration/theme';
  import { makeStylesFromConfiguration } from '../../utils/css-utils';

  export let configuration: IElementProps;
  const styleProps = configuration.style as ICSSProperties;

  const style = makeStylesFromConfiguration(
    merge(title, $globalConfiguration.title || {}),
    styleProps,
  );
</script>

<h1 {style}>
  <slot />
</h1>

<style>
  h1 {
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    margin: var(--margin);
    padding: var(--padding);
    text-align: var(--text-align);
    color: var(--color);
    align-self: var(--align-self);
    z-index: 2;
  }
</style>
