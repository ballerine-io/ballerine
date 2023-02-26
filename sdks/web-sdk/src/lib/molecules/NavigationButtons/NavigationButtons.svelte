<script lang="ts">
  import { getWorkflowContext } from '../../../workflow-sdk/context';
  import { Button, ButtonWithIcon, IconButton, NextStepButton } from '../../atoms';
  import { configuration as globalConfiguration } from '../../contexts/configuration';
  import { T } from '../../contexts/translation';
  import { ICSSProperties, makesLocalStyles } from '../../services/css-manager';

  const { navigationButtons: userConfiguration } = $globalConfiguration.components;

  const configuration = userConfiguration;

  export let skipBackSide = false;

  const style = makesLocalStyles(configuration.props.style as ICSSProperties);

  const skipType = skipBackSide ? 'back-side' : undefined;
  const workflowService = getWorkflowContext();
  const onPrevStep = () =>
    workflowService.sendEvent({
      type: 'USER_PREV_STEP',
      payload: {
        skipType,
      },
    });
  const onNextStep = () =>
    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
      payload: {
        skipType,
      },
    });
</script>

<div {style} class="navigation-buttons">
  {#if configuration.backButton.type === 'button'}
    <Button isBack configuration={configuration.backButton.props} on:click={onPrevStep}>
      <T key="back" namespace="navigation-buttons" />
    </Button>
  {:else if configuration.backButton.type === 'iconButton'}
    <IconButton configuration={configuration.backButton.props} on:click={onPrevStep} />
  {:else}
    <ButtonWithIcon configuration={configuration.backButton.props} on:click={onPrevStep}>
      <T key="back" namespace="navigation-buttons" />
    </ButtonWithIcon>
  {/if}
  {#if configuration.nextButton.type === 'button'}
    <NextStepButton configuration={configuration.nextButton.props} {skipType}>
      <T key="next" namespace="navigation-buttons" />
    </NextStepButton>
  {:else if configuration.nextButton.type === 'iconButton'}
    <IconButton configuration={configuration.nextButton.props} on:click={onNextStep} />
  {:else}
    <ButtonWithIcon configuration={configuration.nextButton.props} on:click={onNextStep}>
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
