<script lang="ts">
  import merge from 'lodash.merge';
  import {
    configuration as globalConfiguration,
    ICSSProperties,
    IElementProps,
  } from '../../contexts/configuration';
  import { makeStylesFromConfiguration } from '../../utils/cssUtils';

  export let configuration: IElementProps;
  export let active = false;

  const paragraph = {
    'font-weight': 400,
    'font-size': '16px',
    color: $globalConfiguration.general.colors.text,
    'text-align': 'center',
    margin: '0px',
  };

  const styleProps = configuration.style as ICSSProperties;

  const style = makeStylesFromConfiguration(
    merge(paragraph, $globalConfiguration.paragraph),
    styleProps,
  );
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
