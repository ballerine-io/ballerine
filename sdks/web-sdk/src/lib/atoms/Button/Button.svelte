<script lang="ts">
  import { ICSSProperties, IElementProps } from '../../contexts/configuration';
  import { makeStylesFromConfiguration } from '../../utils/css-utils';
  import { configuration as globalConfiguration } from '../../contexts/configuration';
  import { primaryButton } from '../../default-configuration/theme';
  import merge from 'lodash.merge';

  export let configuration: IElementProps;
  const styleProps = configuration.style as ICSSProperties;

  const style = makeStylesFromConfiguration(
    merge(primaryButton, $globalConfiguration.button),
    styleProps,
  );
</script>

<button {style} on:click>
  <slot />
</button>

<style>
  button {
    cursor: pointer;
    border: none;
    outline: none;
    padding: var(--padding);
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    width: var(--width);
    background: var(--background);
    color: var(--color);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    margin: var(--margin);
  }
</style>
