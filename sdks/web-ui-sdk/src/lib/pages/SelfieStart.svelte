<script lang="ts">
  import { T } from '../contexts/translation';
  import { IconButton, IconCloseButton, Image, NextStepButton, Paragraph, Title } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation/hooks';
  import { Elements } from '../contexts/configuration/types';
  import { ICameraEvent, nativeCameraHandler } from '../utils/photo-utils';
  import { getFlowConfig, isNativeCamera } from '../contexts/flows/hooks';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import {
    appState,
    currentStepId,
    selectedDocumentInfo,
    selfieUri,
  } from '../contexts/app-state/stores';
  import { ActionNames, sendButtonClickEvent, VerificationStatuses } from '../utils/event-service';
  import { getLayoutStyles, getStepConfiguration } from '../ui-packs';
  import { createToggle } from '../hooks/createToggle/createToggle';

  export let stepId;

  const step = getStepConfiguration($configuration, stepId);
  const flow = getFlowConfig($configuration);
  const style = getLayoutStyles($configuration, step);

  const stepNamespace = step.namespace!;

  let skipBackSide = false;

  $: {
    if ($selectedDocumentInfo && !$selectedDocumentInfo.backSide) {
      skipBackSide = true;
    }
  }

  const [isDisabled, , toggleOnIsDisabled] = createToggle();
  const handler = async (e: ICameraEvent) => {
    if (!e.target || $isDisabled) return;
    $selfieUri = await nativeCameraHandler(e);
    goToNextStep(currentStepId, $configuration, $currentStepId);
    toggleOnIsDisabled();
  };

  preloadNextStepByCurrent($configuration, configuration, $currentStepId);
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() =>
          goToPrevStep(
            currentStepId,
            $configuration,
            $currentStepId,
            skipBackSide ? 'back-side' : undefined,
          )}
      />
    {/if}
    {#if element.type === Elements.IconCloseButton && flow.showCloseButton}
      <IconCloseButton
        configuration={element.props}
        on:click={() => {
          sendButtonClickEvent(
            ActionNames.CLOSE,
            { status: VerificationStatuses.DATA_COLLECTION },
            $appState,
            true,
          );
        }}
      />
    {/if}
    {#if element.type === Elements.Image}
      <Image configuration={element.props} />
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key="title" namespace={stepNamespace} />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key={element.props.context || 'description'} namespace={stepNamespace} />
      </Paragraph>
    {/if}
    {#if element.type === Elements.Button}
      <div class="button-container">
        {#if isNativeCamera($configuration)}
          <input
            class="camera-input"
            type="file"
            accept="image/*"
            capture="user"
            on:change={handler}
          />
        {/if}
        <NextStepButton configuration={element.props} disabled={$isDisabled}>
          <T key="button" namespace={stepNamespace} />
        </NextStepButton>
      </div>
    {/if}
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    padding: var(--padding);
    position: var(--position);
    text-align: center;
    height: 100%;
    background: var(--background);
  }
  .button-container {
    position: relative;
  }
  .camera-input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 3;
    opacity: 0;
    cursor: pointer;
  }
</style>
