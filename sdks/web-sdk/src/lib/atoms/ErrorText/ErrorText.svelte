<script lang="ts">
  import merge from 'lodash.merge';
  import {
    configuration as globalConfiguration,
    ICSSProperties,
    IElementProps,
  } from '../../contexts/configuration';
  import { errorText } from '../../defaultConfiguration/theme';
  import { makeStylesFromConfiguration } from '../../utils/cssUtils';

  export let configuration: IElementProps;

  const styleProps = configuration.style as ICSSProperties;

  const style = makeStylesFromConfiguration(
    merge(errorText, $globalConfiguration.errorText),
    styleProps,
  );
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
