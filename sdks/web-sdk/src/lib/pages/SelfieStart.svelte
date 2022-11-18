<script lang="ts">
  import { T } from '../contexts/translation';
  import { Image, Button, Title, Paragraph, IconButton, IconCloseButton } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation/hooks';
  import { Elements, Steps } from '../contexts/configuration/types';
  import { ICameraEvent, nativeCameraHandler } from '../utils/photo-utils';
  import { isNativeCamera } from '../contexts/flows/hooks';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import {
    selectedDocumentInfo,
    selfieUri,
    currentStepId,
    appState,
  } from '../contexts/app-state/stores';
  import {
    EActionNames,
    sendButtonClickEvent,
    EVerificationStatuses,
  } from '../utils/event-service';
  import { getLayoutStyles, getStepConfiguration, uiPack } from '../ui-packs';

  export let stepId;

  const step = getStepConfiguration($configuration, $uiPack.steps[Steps.SelfieStart], stepId);

  const stepNamespace = step.namespace!;

  const style = getLayoutStyles($configuration, $uiPack, step);

  let skipBackSide = false;

  $: {
    if ($selectedDocumentInfo && !$selectedDocumentInfo.backSide) {
      skipBackSide = true;
    }
  }

  const handler = async (e: ICameraEvent) => {
    if (!e.target) return;
    $selfieUri = await nativeCameraHandler(e);
    goToNextStep(currentStepId, $configuration, $currentStepId);
  };

  preloadNextStepByCurrent($configuration, configuration, $currentStepId, $uiPack);
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
        <Button
          on:click={() => goToNextStep(currentStepId, $configuration, $currentStepId)}
          configuration={element.props}
        >
          <T key="button" namespace={stepNamespace} />
        </Button>
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
