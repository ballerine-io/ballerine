<script lang="ts">
  import { T } from '../contexts/translation';
  import { IconButton, IconCloseButton, Image, NextStepButton, Paragraph, Title } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation/hooks';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import { ICameraEvent, nativeCameraHandler } from '../utils/photo-utils';
  import { isNativeCamera } from '../contexts/flows/hooks';
  import {
    appState,
    currentStepId,
    selectedDocumentInfo,
    selfieUri,
  } from '../contexts/app-state/stores';
  import { layout, selfieStartStep } from '../default-configuration/theme';
  import { createToggle } from '../hooks/createToggle/createToggle';
  import merge from 'deepmerge';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { mergeStepConfig } from '../services/merge-service';
  import { injectPrimaryIntoLayoutGradient } from '../services/theme-manager';
  import {
    EActionNames,
    EVerificationStatuses,
    sendButtonClickEvent,
  } from '../utils/event-service';

  export let stepId;

  const step = mergeStepConfig(selfieStartStep, $configuration.steps[stepId]);

  const stepNamespace = step.namespace!;

  const style = makeStylesFromConfiguration(
    merge(
      injectPrimaryIntoLayoutGradient(layout, $configuration.general.colors.primary),
      $configuration.layout || {},
    ),
    step.style,
  );

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
    {#if element.type === Elements.IconCloseButton}
      <IconCloseButton
        configuration={element.props}
        on:click={() => {
          sendButtonClickEvent(
            EActionNames.CLOSE,
            { status: EVerificationStatuses.DATA_COLLECTION },
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
