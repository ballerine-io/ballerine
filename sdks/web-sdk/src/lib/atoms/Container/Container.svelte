<script lang="ts">
  import merge from 'lodash.merge';
  import {
    configuration as globalConfiguration,
    ICSSProperties,
    IElementProps,
  } from '../../contexts/configuration';
  import { container } from '../../defaultConfiguration/theme';
  import { makeStylesFromConfiguration } from '../../utils/cssUtils';

  export let configuration: IElementProps;
  export let active = false;
  const styleProps = configuration.style as ICSSProperties;

  const style = makeStylesFromConfiguration(
    merge(container, $globalConfiguration.container),
    styleProps,
  );
</script>

<div {style} class="container" class:active>
  <slot />
</div>

<style>
  .container {
    margin: var(--margin);
    padding: var(--padding);
    width: var(--width);
    min-width: var(--width);
    height: var(--height);
    background: var(--background);
    border-radius: var(--border-radius);
    display: var(--display);
    align-items: var(--align-items);
    justify-content: var(--justify-content);
    transition: all 0.1s ease-in;
  }
  .container.active {
    background: var(--active-background);
  }
</style>
