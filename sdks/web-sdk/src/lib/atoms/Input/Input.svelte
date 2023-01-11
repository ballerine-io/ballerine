<script lang="ts">
  import { Writable } from 'svelte/store';
  import {
    configuration as globalConfiguration,
    IElementProps,
  } from '../../contexts/configuration';
  import { ICSSProperties, makeStylesFromConfiguration } from '../../services/css-manager';
  import { IInputAttributes } from './types';
  import { t } from '../../contexts/translation/hooks';
  import merge from 'deepmerge';

  export let configuration: IElementProps;
  export let translationContext: string;
  export let form: Writable<Record<string, string>>;

  const input = {
    width: '100%',
    margin: '10px 0px',
    padding: '12px 24px',
    'border-radius': $globalConfiguration.general?.borderRadius,
    border: `2px solid ${$globalConfiguration.general?.colors.primary}`,
  };

  const styleProps = configuration.style as ICSSProperties;
  const attributes = configuration.attributes as IInputAttributes;

  const style = makeStylesFromConfiguration(
    merge(input, $globalConfiguration.input || {}),
    styleProps,
  );
</script>

<input
  {style}
  on:change
  bind:value={$form[attributes.name]}
  name={attributes.name}
  type="text"
  placeholder={t(translationContext, attributes.placeholder || '')}
/>

<style>
  input {
    max-width: 100%;
    outline: none;
    padding: var(--padding);
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    width: var(--width);
    background: var(--background);
    color: var(--color);
    border-radius: var(--border-radius);
    border: var(--border);
    box-shadow: var(--box-shadow);
    margin: var(--margin);
  }
</style>
