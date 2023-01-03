<script lang="ts">
  import { goToNextStep } from '../../contexts/navigation';
  import type { IElementProps } from '../../contexts/configuration';
  import { configuration as globalConfiguration } from '../../contexts/configuration';
  import { currentStepId } from '../../contexts/app-state';
  import { makeStylesFromConfiguration } from '../../services/css-manager';
  import { Loader } from './Loader';

  // TODO: Use the createToggle hook, and make sure an exported prop is not being mutated.
  export let isDisabled = false;
  export let isLoading = false;
  export let configuration: IElementProps;
  export let skipType: string;

  const background =
    $globalConfiguration.components?.button?.background ||
    $globalConfiguration.general?.colors?.primary;

  const styleProps = {
    ...configuration?.style,
    background,
  };

  const style = makeStylesFromConfiguration(
    $globalConfiguration.components?.button || {},
    styleProps,
  );

  let disabled: boolean;
  const onClick = () => {
    if (disabled) return;

    goToNextStep(currentStepId, $globalConfiguration, $currentStepId, skipType);
    isDisabled = true;
  };

  $: disabled = isDisabled || isLoading;
</script>

<button {style} {disabled} on:click={onClick}>
  {#if isLoading}
    <div class="loader-container">
      <Loader />
    </div>
  {/if}
  <slot />
</button>

<style>
  button:disabled .loader-container {
    margin-inline-end: 1rem;
  }

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
    position: var(--position);
    bottom: var(--bottom);
    left: var(--left);
  }

  button:disabled {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
