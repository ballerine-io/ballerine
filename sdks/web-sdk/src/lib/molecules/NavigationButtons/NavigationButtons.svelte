<script lang="ts">
  import { Button, IconButton, ButtonWithIcon } from '../../atoms';
  import {
    configuration as globalConfiguration,
    ICSSProperties,
    IStepConfiguration,
  } from '../../contexts/configuration';
  import { goToNextStep, goToPrevStep } from '../../contexts/navigation';
  import { T } from '../../contexts/translation';
  import { makesLocalStyles } from '../../utils/css-utils';
  import { currentStepId } from '../../contexts/app-state';
  import merge from 'lodash.merge';
  import { navigationButtons } from '../../default-configuration/theme';
  const { navigationButtons: userConfiguration } = $globalConfiguration;

  const configuration = userConfiguration
    ? merge(navigationButtons, userConfiguration)
    : navigationButtons;

  export let step: IStepConfiguration;
  export let skipBackSide = false;

  const style = makesLocalStyles(configuration.props.style as ICSSProperties);

  const skipType = skipBackSide ? 'back-side' : undefined;
</script>

<div {style} class="navigation-buttons">
  {#if configuration.backButton.type === 'button'}
    <Button
      configuration={configuration.backButton.props}
      on:click={() => goToPrevStep(currentStepId, $globalConfiguration, $currentStepId, skipType)}
    >
      <T key="back" namespace="navigation-buttons" />
    </Button>
  {:else if configuration.backButton.type === 'iconButton'}
    <IconButton
      configuration={configuration.backButton.props}
      on:click={() => goToPrevStep(currentStepId, $globalConfiguration, $currentStepId, skipType)}
    />
  {:else}
    <ButtonWithIcon
      configuration={configuration.backButton.props}
      on:click={() => goToPrevStep(currentStepId, $globalConfiguration, $currentStepId, skipType)}
    >
      <T key="back" namespace="navigation-buttons" />
    </ButtonWithIcon>
  {/if}
  {#if configuration.nextButton.type === 'button'}
    <Button
      configuration={configuration.nextButton.props}
      on:click={() => goToNextStep(currentStepId, $globalConfiguration, $currentStepId, skipType)}
    >
      <T key="next" namespace="navigation-buttons" />
    </Button>
  {:else if configuration.nextButton.type === 'iconButton'}
    <IconButton
      configuration={configuration.nextButton.props}
      on:click={() => goToNextStep(currentStepId, $globalConfiguration, $currentStepId, skipType)}
    />
  {:else}
    <ButtonWithIcon
      configuration={configuration.nextButton.props}
      on:click={() => goToNextStep(currentStepId, $globalConfiguration, $currentStepId, skipType)}
    >
      <T key="next" namespace="navigation-buttons" />
    </ButtonWithIcon>
  {/if}
</div>

<style>
  .navigation-buttons {
    display: var(--display);
    padding: var(--padding);
    position: var(--position);
    bottom: var(--bottom);
    left: var(--left);
    width: var(--width);
    box-shadow: var(--box-shadow);
    justify-content: var(--justify-content);
    align-items: var(--align-items);
    flex-direction: var(--flex-direction);
  }
</style>
