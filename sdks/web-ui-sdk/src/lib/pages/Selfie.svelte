<script lang="ts">
  import CameraPhoto, { CaptureConfigOption, FACING_MODES } from 'jslib-html5-camera-photo';
  import { T } from '../contexts/translation';
  import { configuration } from '../contexts/configuration';
  import { onDestroy, onMount } from 'svelte';
  import {
    CameraButton,
    IconButton,
    IconCloseButton,
    Loader,
    Overlay,
    Paragraph,
    VideoContainer,
  } from '../atoms';
  import { Elements } from '../contexts/configuration/types';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation';
  import { currentStepId, DocumentType } from '../contexts/app-state';
  import Title from '../atoms/Title/Title.svelte';
  import { appState, selfieUri } from '../contexts/app-state/stores';
  import { isMobile } from '../utils/is-mobile';
  import { createToggle } from '../hooks/createToggle/createToggle';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { ActionNames, sendButtonClickEvent, VerificationStatuses } from '../utils/event-service';
  import { getLayoutStyles, getStepConfiguration } from '../ui-packs';

  let video: HTMLVideoElement;
  let cameraPhoto: CameraPhoto | undefined = undefined;

  export let stepId;

  const step = getStepConfiguration($configuration, stepId);
  const stepNamespace = step.namespace!;
  const style = getLayoutStyles($configuration, step);

  const [isDisabled, , toggleOnIsDisabled, toggleOffIsDisabled] = createToggle(true);

  const facingMode = isMobile() ? FACING_MODES.USER : FACING_MODES.ENVIRONMENT;
  let stream: MediaStream;

  onMount(() => {
    if (!video) return;
    cameraPhoto = new CameraPhoto(video);
    cameraPhoto
      .startCamera(facingMode, {
        width: 1920,
        height: 1080,
      })
      .then(cameraStream => {
        console.log('stream', cameraStream);
        stream = cameraStream;
        toggleOffIsDisabled();
      })
      .catch(error => {
        console.log('error', error);
      });
  });

  onDestroy(() => {
    cameraPhoto?.stopCamera();
  });

  const handleTakePhoto = () => {
    if (!cameraPhoto || $isDisabled) return;

    $selfieUri = cameraPhoto.getDataUri(
      $configuration.settings?.selfieCameraSettings as CaptureConfigOption,
    );

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
        on:click={() => goToPrevStep(currentStepId, $configuration, $currentStepId)}
      />
    {/if}
    {#if element.type === Elements.IconCloseButton}
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
    {#if element.type === Elements.VideoContainer}
      <VideoContainer configuration={element.props} isSelfie>
        <!-- svelte-ignore a11y-media-has-caption -->
        <video bind:this={video} autoplay playsinline />
      </VideoContainer>
    {/if}
    {#if element.type === Elements.Loader && stream === undefined}
      <Loader />
    {/if}
  {/each}
  <div class="header">
    {#each step.elements as element}
      {#if element.type === Elements.Title}
        <Title configuration={element.props}>
          <T key={'title'} namespace={stepNamespace} />
        </Title>
      {/if}
      {#if element.type === Elements.Paragraph}
        <Paragraph configuration={element.props}>
          <T key={'description'} namespace={stepNamespace} />
        </Paragraph>
      {/if}
    {/each}
  </div>
  <Overlay type={DocumentType.SELFIE} />
  {#each step.elements as element}
    {#if element.type === Elements.CameraButton}
      <CameraButton
        on:click={handleTakePhoto}
        configuration={element.props}
        isDisabled={$isDisabled}
      />
    {/if}
  {/each}
</div>

<style>
  .container {
    height: 100%;
    position: var(--position);
    background: var(--background);
    padding: var(--padding);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
